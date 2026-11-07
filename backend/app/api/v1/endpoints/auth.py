from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, RefreshRequest, UserRead
from app.schemas.common import APIResponse
from app.services.auth_service import AuthService
from app.services.audit_service import AuditService

router = APIRouter()


@router.post(
    "/auth/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Admin Login",
)
def login(
    payload: LoginRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    service = AuthService(db)
    return service.authenticate_user(payload, ip_address=ip_address)


@router.post(
    "/auth/refresh",
    response_model=TokenResponse,
    summary="Refresh Access Token",
)
def refresh_token(
    payload: RefreshRequest,
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    return service.refresh_token(payload.refresh_token)


@router.get(
    "/auth/me",
    response_model=UserRead,
    summary="Get Current Admin Profile",
)
def get_me(current_user: User = Depends(get_current_user)):
    return UserRead.model_validate(current_user)


@router.post(
    "/auth/logout",
    response_model=APIResponse[None],
    summary="Admin Logout",
)
def logout(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    AuditService.log_action(
        db=db,
        action="LOGOUT",
        entity_type="user",
        entity_id=str(current_user.id),
        user_id=current_user.id,
        ip_address=ip_address,
    )
    return APIResponse(success=True, message="Logged out successfully.")
