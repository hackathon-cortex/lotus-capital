from fastapi import APIRouter
from ..schemas.auth import (
    LoginRequest,
    LoginResponse,
    UserProfile,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
)

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest):
    # Working stub for authentication
    return LoginResponse(
        access_token="mock_jwt_token_for_development",
        user=UserProfile(
            id="usr_001",
            email=req.email,
            full_name=req.email.split("@")[0].capitalize(),
            role="admin",
            permissions=["all"],
        ),
    )

@router.post("/logout")
def logout():
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserProfile)
def get_current_user():
    return UserProfile(
        id="usr_001",
        email="admin@lotuscapital.com",
        full_name="Abhilash Chudasama (Stub)",
        role="admin",
        permissions=["all"],
    )

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    # Neutral response to reduce account enumeration
    return {"message": "If this email exists in our system, a password reset link has been dispatched."}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest):
    return {"message": "Password has been successfully reset."}

@router.post("/change-password")
def change_password(req: ChangePasswordRequest):
    return {"message": "Password updated successfully."}

