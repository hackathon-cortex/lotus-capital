from datetime import datetime, timezone, timedelta
from typing import Optional, Tuple, Dict, Any, List
from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    UserRead,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    MfaSetupResponse,
    MfaVerifyResponse,
)
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    create_mfa_pending_token,
    decode_token,
    revoke_token,
    create_password_reset_token,
    verify_password_reset_token,
    is_login_rate_limited,
    record_failed_login,
    clear_failed_logins,
    simulate_password_hash_timing,
    generate_totp_secret,
    get_totp_uri,
    generate_qr_code_data_uri,
    verify_totp,
    generate_recovery_codes,
    verify_and_consume_recovery_code,
)
from app.core.exceptions import (
    UnauthorizedException,
    ForbiddenException,
    BadRequestException,
    RateLimitException,
    NotFoundException,
)
from app.services.audit_service import AuditService
from app.services.email_service import email_service


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def register_user(self, payload: Any, ip_address: Optional[str] = None) -> User:
        repo = UserRepository(self.db)
        clean_email = payload.email.strip().lower()
        existing = repo.get_by_email(clean_email)
        if existing:
            raise BadRequestException(f"Account with email '{clean_email}' already exists.")

        assigned_role = payload.role if getattr(payload, "role", None) in ("admin", "editor") else "admin"

        user = User(
            full_name=payload.full_name.strip(),
            email=clean_email,
            password_hash=get_password_hash(payload.password),
            role=assigned_role,
            is_active=True,
            is_superuser=(assigned_role == "super_admin"),
        )
        created = repo.create(user)

        AuditService.log_action(
            db=self.db,
            action="USER_REGISTERED",
            entity_type="user",
            entity_id=str(created.id),
            user_id=created.id,
            metadata={"email": created.email, "role": created.role},
            ip_address=ip_address,
        )
        return created

    def authenticate_user(self, credentials: LoginRequest, ip_address: Optional[str] = None) -> TokenResponse:
        now = datetime.now(timezone.utc)
        norm_email = credentials.email.strip().lower()

        # 1. Rate limiting check (per-IP and per-account)
        if is_login_rate_limited(ip_address, norm_email):
            AuditService.log_action(
                db=self.db,
                action="LOGIN_RATE_LIMITED",
                entity_type="user",
                entity_id=norm_email,
                metadata={"reason": "Maximum failed login attempts exceeded"},
                ip_address=ip_address,
            )
            raise RateLimitException("Too many failed login attempts. Please wait 15 minutes before trying again.")

        user = self.user_repo.get_by_email(norm_email)

        # 2. Timing attack mitigation: if user doesn't exist, simulate hash calculation
        if not user:
            simulate_password_hash_timing()
            record_failed_login(ip_address, norm_email)
            AuditService.log_action(
                db=self.db,
                action="LOGIN_FAILED",
                entity_type="user",
                entity_id=norm_email,
                metadata={"reason": "Invalid credentials (user not found)"},
                ip_address=ip_address,
            )
            raise UnauthorizedException("Invalid email or password.")

        # 3. Check temporary account lockout
        if user.locked_until and user.locked_until > now:
            raise RateLimitException("Account is temporarily locked due to excessive failed attempts. Try again later.")

        # 4. Verify password
        if not verify_password(credentials.password, user.password_hash):
            user.failed_login_attempts = getattr(user, "failed_login_attempts", 0) + 1
            if user.failed_login_attempts >= 5:
                user.locked_until = now + timedelta(minutes=15)
            self.user_repo.update(user)
            record_failed_login(ip_address, norm_email)
            AuditService.log_action(
                db=self.db,
                action="LOGIN_FAILED",
                entity_type="user",
                entity_id=norm_email,
                user_id=user.id,
                metadata={"reason": "Invalid password", "failed_count": user.failed_login_attempts},
                ip_address=ip_address,
            )
            raise UnauthorizedException("Invalid email or password.")

        # 5. Check active status
        if not user.is_active:
            AuditService.log_action(
                db=self.db,
                action="LOGIN_BLOCKED_INACTIVE",
                entity_type="user",
                entity_id=str(user.id),
                user_id=user.id,
                ip_address=ip_address,
            )
            raise ForbiddenException("Account is currently deactivated. Please contact an administrator.")

        # 6. Check MFA
        if getattr(user, "mfa_enabled", False):
            if credentials.totp_code:
                # Direct MFA verification included with credentials
                code = credentials.totp_code.strip()
                totp_valid = verify_totp(user.mfa_secret, code)
                rec_valid = False
                if not totp_valid and user.recovery_codes:
                    rec_valid, updated_codes = verify_and_consume_recovery_code(code, user.recovery_codes)
                    if rec_valid:
                        user.recovery_codes = updated_codes
                        self.user_repo.update(user)

                if not totp_valid and not rec_valid:
                    record_failed_login(ip_address, norm_email)
                    AuditService.log_action(
                        db=self.db,
                        action="MFA_FAILED",
                        entity_type="user",
                        entity_id=str(user.id),
                        user_id=user.id,
                        ip_address=ip_address,
                    )
                    raise UnauthorizedException("Invalid two-factor authentication code.")
            else:
                # Return challenge token for 2FA step
                mfa_token = create_mfa_pending_token(user.id, user.email)
                return TokenResponse(
                    mfa_required=True,
                    mfa_token=mfa_token,
                    user=None,
                )

        # Clear failed logins and lockouts on success
        user.failed_login_attempts = 0
        user.locked_until = None
        user.last_login_at = now
        self.user_repo.update(user)
        clear_failed_logins(ip_address, norm_email)

        # Generate tokens
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
            "v": getattr(user, "session_version", 1),
        }
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        AuditService.log_action(
            db=self.db,
            action="LOGIN_SUCCESS",
            entity_type="user",
            entity_id=str(user.id),
            user_id=user.id,
            ip_address=ip_address,
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserRead.model_validate(user),
            mfa_required=False,
        )

    def validate_mfa_login(self, mfa_token: str, code: str, ip_address: Optional[str] = None) -> TokenResponse:
        payload = decode_token(mfa_token)
        if not payload or payload.get("type") != "mfa_pending":
            raise UnauthorizedException("MFA session expired or invalid. Please log in again.")

        user_id = payload.get("sub")
        user = self.user_repo.get_by_id(int(user_id))
        if not user or not user.is_active:
            raise UnauthorizedException("Account not found or inactive.")

        clean_code = code.strip()
        totp_valid = verify_totp(user.mfa_secret, clean_code)
        rec_valid = False
        if not totp_valid and user.recovery_codes:
            rec_valid, updated_codes = verify_and_consume_recovery_code(clean_code, user.recovery_codes)
            if rec_valid:
                user.recovery_codes = updated_codes
                self.user_repo.update(user)

        if not totp_valid and not rec_valid:
            AuditService.log_action(
                db=self.db,
                action="MFA_FAILED",
                entity_type="user",
                entity_id=str(user.id),
                user_id=user.id,
                ip_address=ip_address,
            )
            raise UnauthorizedException("Invalid two-factor authentication code.")

        # Invalidate the MFA challenge token
        revoke_token(mfa_token)

        # Success - issue tokens
        user.last_login_at = datetime.now(timezone.utc)
        self.user_repo.update(user)

        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
            "v": getattr(user, "session_version", 1),
        }
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        AuditService.log_action(
            db=self.db,
            action="MFA_LOGIN_SUCCESS",
            entity_type="user",
            entity_id=str(user.id),
            user_id=user.id,
            ip_address=ip_address,
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserRead.model_validate(user),
            mfa_required=False,
        )

    def setup_mfa(self, user: User) -> MfaSetupResponse:
        secret = generate_totp_secret()
        user.mfa_secret = secret
        self.user_repo.update(user)

        uri = get_totp_uri(secret, user.email)
        qr_code = generate_qr_code_data_uri(uri)
        return MfaSetupResponse(
            secret=secret,
            qr_code=qr_code,
            provisioning_uri=uri,
        )

    def verify_and_enable_mfa(self, user: User, code: str, ip_address: Optional[str] = None) -> MfaVerifyResponse:
        if not user.mfa_secret:
            raise BadRequestException("MFA enrollment has not been initialized.")

        if not verify_totp(user.mfa_secret, code):
            raise BadRequestException("Invalid verification code. Please check your authenticator app.")

        plain_codes, hashed_codes_json = generate_recovery_codes(8)
        user.mfa_enabled = True
        user.recovery_codes = hashed_codes_json
        self.user_repo.update(user)

        AuditService.log_action(
            db=self.db,
            action="MFA_ENABLED",
            entity_type="user",
            entity_id=str(user.id),
            user_id=user.id,
            ip_address=ip_address,
        )

        return MfaVerifyResponse(
            success=True,
            message="Two-factor authentication successfully enabled. Store your recovery codes in a secure location.",
            recovery_codes=plain_codes,
        )

    def refresh_token(self, refresh_token_str: str) -> TokenResponse:
        payload = decode_token(refresh_token_str)
        if not payload or payload.get("type") != "refresh":
            raise UnauthorizedException("Invalid or expired refresh token.")

        user_id = payload.get("sub")
        if not user_id:
            raise UnauthorizedException("Invalid token payload.")

        user = self.user_repo.get_by_id(int(user_id))
        if not user or not user.is_active:
            raise UnauthorizedException("User associated with token is inactive or no longer exists.")

        # Check session version
        token_v = payload.get("v")
        if token_v is not None and token_v != getattr(user, "session_version", 1):
            raise UnauthorizedException("Session has been terminated. Please log in again.")

        # Rotate refresh token: revoke previous refresh token
        revoke_token(refresh_token_str)

        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
            "v": getattr(user, "session_version", 1),
        }
        new_access_token = create_access_token(token_data)
        new_refresh_token = create_refresh_token(token_data)

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            user=UserRead.model_validate(user),
            mfa_required=False,
        )

    def change_password(
        self,
        user: User,
        payload: ChangePasswordRequest,
        ip_address: Optional[str] = None,
    ) -> bool:
        if not verify_password(payload.old_password, user.password_hash):
            raise BadRequestException("Current password is incorrect.")

        if payload.old_password == payload.new_password:
            raise BadRequestException("New password cannot be identical to current password.")

        user.password_hash = get_password_hash(payload.new_password)
        # Invalidate all existing sessions on password change
        user.session_version = getattr(user, "session_version", 1) + 1
        self.user_repo.update(user)

        AuditService.log_action(
            db=self.db,
            action="PASSWORD_CHANGED",
            entity_type="user",
            entity_id=str(user.id),
            user_id=user.id,
            ip_address=ip_address,
        )
        return True

    def forgot_password(self, payload: ForgotPasswordRequest, ip_address: Optional[str] = None) -> bool:
        user = self.user_repo.get_by_email(payload.email)
        # Even if user doesn't exist, return True to prevent user enumeration attacks
        if not user or not user.is_active:
            return True

        reset_token = create_password_reset_token(user.email)
        AuditService.log_action(
            db=self.db,
            action="PASSWORD_RESET_REQUESTED",
            entity_type="user",
            entity_id=str(user.id),
            user_id=user.id,
            ip_address=ip_address,
        )
        return True

    def reset_password(self, payload: ResetPasswordRequest, ip_address: Optional[str] = None) -> bool:
        email = verify_password_reset_token(payload.token)
        if not email:
            raise BadRequestException("Password reset link is invalid or has expired.")

        user = self.user_repo.get_by_email(email)
        if not user or not user.is_active:
            raise NotFoundException("User not found or inactive.")

        user.password_hash = get_password_hash(payload.new_password)
        # Invalidate all existing sessions on reset
        user.session_version = getattr(user, "session_version", 1) + 1
        self.user_repo.update(user)

        # Invalidate single-use token
        revoke_token(payload.token)

        AuditService.log_action(
            db=self.db,
            action="PASSWORD_RESET_COMPLETED",
            entity_type="user",
            entity_id=str(user.id),
            user_id=user.id,
            ip_address=ip_address,
        )
        return True

    def logout_user(
        self,
        access_token: Optional[str] = None,
        refresh_token: Optional[str] = None,
        user_id: Optional[int] = None,
        ip_address: Optional[str] = None,
    ) -> bool:
        if access_token:
            revoke_token(access_token)
        if refresh_token:
            revoke_token(refresh_token)

        AuditService.log_action(
            db=self.db,
            action="LOGOUT",
            entity_type="user",
            entity_id=str(user_id) if user_id else "unknown",
            user_id=user_id,
            ip_address=ip_address,
        )
        return True

    def logout_all_sessions(self, user: User, ip_address: Optional[str] = None) -> bool:
        user.session_version = getattr(user, "session_version", 1) + 1
        self.user_repo.update(user)
        AuditService.log_action(
            db=self.db,
            action="LOGOUT_ALL_SESSIONS",
            entity_type="user",
            entity_id=str(user.id),
            user_id=user.id,
            ip_address=ip_address,
        )
        return True
