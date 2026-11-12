from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict, model_validator, field_validator
from app.core.security import validate_password_strength


class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    permissions: List[str] = []


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)
    totp_code: Optional[str] = None


class UserBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    role: str = Field(default="editor", pattern="^(super_admin|admin|editor)$")
    is_active: bool = True


class UserCreate(UserBase):
    password: str = Field(..., min_length=12)

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        validate_password_strength(v)
        return v


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    role: Optional[str] = Field(None, pattern="^(super_admin|admin|editor)$")
    is_active: Optional[bool] = None
    password: Optional[str] = Field(None, min_length=12)

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            validate_password_strength(v)
        return v


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_superuser: bool
    mfa_enabled: bool = False
    created_at: datetime
    last_login_at: Optional[datetime] = None


class TokenResponse(BaseModel):
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user: Optional[UserRead] = None
    mfa_required: bool = False
    mfa_token: Optional[str] = None


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile


class RefreshRequest(BaseModel):
    refresh_token: str


class ChangePasswordRequest(BaseModel):
    old_password: Optional[str] = None
    current_password: Optional[str] = None
    new_password: str = Field(..., min_length=12)

    @model_validator(mode="before")
    @classmethod
    def unify_old_password(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "current_password" in data and "old_password" not in data:
                data["old_password"] = data["current_password"]
            elif "old_password" in data and "current_password" not in data:
                data["current_password"] = data["old_password"]
        return data

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        validate_password_strength(v)
        return v


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=10)
    new_password: str = Field(..., min_length=12)

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        validate_password_strength(v)
        return v


class MfaSetupResponse(BaseModel):
    secret: str
    qr_code: str
    provisioning_uri: str


class MfaVerifyRequest(BaseModel):
    code: str = Field(..., min_length=6, max_length=12)


class MfaVerifyResponse(BaseModel):
    success: bool = True
    message: str = "MFA successfully enrolled."
    recovery_codes: List[str]


class MfaValidateLoginRequest(BaseModel):
    mfa_token: str
    code: str


class DashboardSummaryResponse(BaseModel):
    total_leads: int
    new_leads: int
    pending_followups: int
    conversion_rate_percent: float
    statistics_overview: List[Dict[str, Any]] = []


TokenResponse.model_rebuild()
