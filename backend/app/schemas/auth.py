from typing import List, Optional, Any
from pydantic import BaseModel

class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    permissions: List[str] = []

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class DashboardSummaryResponse(BaseModel):
    total_leads: int
    new_leads: int
    pending_followups: int
    conversion_rate_percent: float
    statistics_overview: List[dict]

