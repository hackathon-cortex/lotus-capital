from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict, model_validator


class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    permissions: List[str] = []


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    role: str = Field(default="editor", pattern="^(super_admin|admin|editor)$")
    is_active: bool = True


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    role: Optional[str] = Field(None, pattern="^(super_admin|admin|editor)$")
    is_active: Optional[bool] = None
    password: Optional[str] = Field(None, min_length=8)


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_superuser: bool
    created_at: datetime
    last_login_at: Optional[datetime] = None


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserRead


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile


class RefreshRequest(BaseModel):
    refresh_token: str


class ChangePasswordRequest(BaseModel):
    old_password: Optional[str] = None
    current_password: Optional[str] = None
    new_password: str = Field(..., min_length=8)

    @model_validator(mode="before")
    @classmethod
    def unify_old_password(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "current_password" in data and "old_password" not in data:
                data["old_password"] = data["current_password"]
            elif "old_password" in data and "current_password" not in data:
                data["current_password"] = data["old_password"]
        return data


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=10)
    new_password: str = Field(..., min_length=8)


class DashboardSummaryResponse(BaseModel):
    total_leads: int
    new_leads: int
    pending_followups: int
    conversion_rate_percent: float
    statistics_overview: List[Dict[str, Any]] = []


TokenResponse.model_rebuild()
