from datetime import datetime, timezone
from typing import Optional, Tuple
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
)
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
    revoke_token,
    create_password_reset_token,
    verify_password_reset_token,
    is_login_rate_limited,
    record_failed_login,
    clear_failed_logins,
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

    def authenticate_user(self, credentials: LoginRequest, ip_address: Optional[str] = None) -> TokenResponse:
        rate_key = f"{ip_address or 'client'}:{credentials.email.lower()}"
        if is_login_rate_limited(rate_key):
            AuditService.log_action(
                db=self.db,
                action="LOGIN_RATE_LIMITED",
                entity_type="user",
                entity_id=credentials.email,
                metadata={"reason": "Maximum failed login attempts exceeded"},
                ip_address=ip_address,
            )
            raise RateLimitException("Too many failed login attempts. Please try again after 15 minutes.")

        user = self.user_repo.get_by_email(credentials.email)
        if not user or not verify_password(credentials.password, user.password_hash):
            record_failed_login(rate_key)
            AuditService.log_action(
                db=self.db,
                action="LOGIN_FAILED",
                entity_type="user",
                entity_id=credentials.email,
                metadata={"reason": "Invalid credentials"},
                ip_address=ip_address,
            )
            raise UnauthorizedException("Invalid email or password.")

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

        # Clear failed logins on success
        clear_failed_logins(rate_key)

        # Update last login timestamp
        user.last_login_at = datetime.now(timezone.utc)
        self.user_repo.update(user)

        # Generate tokens
        token_data = {"sub": str(user.id), "email": user.email, "role": user.role}
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

        # Rotate refresh token: revoke previous refresh token
        revoke_token(refresh_token_str)

        token_data = {"sub": str(user.id), "email": user.email, "role": user.role}
        new_access_token = create_access_token(token_data)
        new_refresh_token = create_refresh_token(token_data)

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            user=UserRead.model_validate(user),
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
        # In a real environment or mock, dispatch reset email
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
        self.user_repo.update(user)

        # Invalidate token
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
