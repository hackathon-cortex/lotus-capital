from typing import Optional
from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user, oauth2_scheme
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    RefreshRequest,
    UserRead,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from app.schemas.common import APIResponse
from app.services.auth_service import AuthService
from app.core.config import settings

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
    response: Response,
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    service = AuthService(db)
    token_response = service.authenticate_user(payload, ip_address=ip_address)

    # Optionally set HttpOnly cookie for refresh token
    response.set_cookie(
        key="lotus_refresh_token",
        value=token_response.refresh_token,
        httponly=True,
        samesite="lax",
        secure=(settings.ENVIRONMENT == "production"),
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
    )
    return token_response


@router.post(
    "/auth/refresh",
    response_model=TokenResponse,
    summary="Refresh Access Token",
)
def refresh_token(
    payload: Optional[RefreshRequest] = None,
    request: Request = None,
    response: Response = None,
    db: Session = Depends(get_db),
):
    # Accept token either from JSON body or from HttpOnly cookie
    refresh_token_str = None
    if payload and payload.refresh_token:
        refresh_token_str = payload.refresh_token
    elif request and request.cookies.get("lotus_refresh_token"):
        refresh_token_str = request.cookies.get("lotus_refresh_token")

    if not refresh_token_str:
        from app.core.exceptions import UnauthorizedException
        raise UnauthorizedException("Refresh token must be provided via request body or cookie.")

    service = AuthService(db)
    token_response = service.refresh_token(refresh_token_str)

    if response:
        response.set_cookie(
            key="lotus_refresh_token",
            value=token_response.refresh_token,
            httponly=True,
            samesite="lax",
            secure=(settings.ENVIRONMENT == "production"),
            max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        )
    return token_response


@router.get(
    "/auth/me",
    response_model=UserRead,
    summary="Get Current Admin Profile",
)
def get_me(current_user: User = Depends(get_current_user)):
    return UserRead.model_validate(current_user)


@router.post(
    "/auth/change-password",
    response_model=APIResponse[None],
    summary="Change Admin Password",
)
def change_password(
    payload: ChangePasswordRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    service = AuthService(db)
    service.change_password(user=current_user, payload=payload, ip_address=ip_address)
    return APIResponse(success=True, message="Password updated successfully.")


@router.post(
    "/auth/forgot-password",
    response_model=APIResponse[None],
    summary="Request Password Reset Link",
)
def forgot_password(
    payload: ForgotPasswordRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    service = AuthService(db)
    service.forgot_password(payload, ip_address=ip_address)
    return APIResponse(
        success=True,
        message="If the account exists, instructions have been dispatched.",
    )


@router.post(
    "/auth/reset-password",
    response_model=APIResponse[None],
    summary="Reset Password with Token",
)
def reset_password(
    payload: ResetPasswordRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    service = AuthService(db)
    service.reset_password(payload, ip_address=ip_address)
    return APIResponse(
        success=True,
        message="Password has been reset successfully. You may now log in with your new password.",
    )


@router.post(
    "/auth/logout",
    response_model=APIResponse[None],
    summary="Admin Logout",
)
def logout(
    request: Request,
    response: Response,
    payload: Optional[RefreshRequest] = None,
    token: Optional[str] = Depends(oauth2_scheme),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    cookie_refresh = request.cookies.get("lotus_refresh_token")
    body_refresh = payload.refresh_token if payload else None
    refresh_token = body_refresh or cookie_refresh

    service = AuthService(db)
    service.logout_user(
        access_token=token,
        refresh_token=refresh_token,
        user_id=current_user.id,
        ip_address=ip_address,
    )

    # Clear refresh cookie
    response.delete_cookie(key="lotus_refresh_token")

    return APIResponse(success=True, message="Logged out successfully.")
