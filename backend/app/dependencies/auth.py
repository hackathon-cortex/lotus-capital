from typing import Optional, Callable
from fastapi import Depends, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.core.security import decode_token
from app.core.exceptions import UnauthorizedException, ForbiddenException
from app.core.permissions import Role, has_minimum_role

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    if not token:
        raise UnauthorizedException("Authentication token is required.")

    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise UnauthorizedException("Invalid or expired access token.")

    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Token payload missing subject.")

    user_repo = UserRepository(db)
    user = user_repo.get_by_id(int(user_id))
    if not user:
        raise UnauthorizedException("User no longer exists.")

    if not user.is_active:
        raise ForbiddenException("User account is inactive.")

    return user


def require_role(required_role: Role) -> Callable[[User], User]:
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if not has_minimum_role(current_user.role, required_role):
            raise ForbiddenException(
                f"Action requires minimum '{required_role.value}' role privileges."
            )
        return current_user

    return role_checker

