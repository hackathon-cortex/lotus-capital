from datetime import datetime, timezone
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, TokenResponse, UserRead
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, decode_token
from app.core.exceptions import UnauthorizedException, ForbiddenException, BadRequestException
from app.services.audit_service import AuditService


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def authenticate_user(self, credentials: LoginRequest, ip_address: Optional[str] = None) -> TokenResponse:
        user = self.user_repo.get_by_email(credentials.email)
        if not user or not verify_password(credentials.password, user.password_hash):
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

        token_data = {"sub": str(user.id), "email": user.email, "role": user.role}
        new_access_token = create_access_token(token_data)
        new_refresh_token = create_refresh_token(token_data)

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            user=UserRead.model_validate(user),
        )
