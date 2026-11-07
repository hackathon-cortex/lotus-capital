import re
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr, field_validator, ConfigDict


INDIAN_MOBILE_REGEX = re.compile(r"^[6-9]\d{9}$")
FORBIDDEN_KEYWORDS = ["pan", "aadhaar", "otp", "password", "netbanking", "cvv"]


class EnquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    mobile: str = Field(..., description="10-digit Indian Mobile Number")
    email: Optional[EmailStr] = None
    contact_method: str = Field(default="phone", pattern="^(phone|email|whatsapp)$")
    service_detail: List[str] = Field(default_factory=list, description="Selected service slugs")
    message: Optional[str] = Field(None, max_length=1000)
    consent: bool = Field(..., description="Consent to be contacted")

    @field_validator("name")
    @classmethod
    def sanitize_name(cls, v: str) -> str:
        clean = v.strip()
        if len(clean) < 2:
            raise ValueError("Name must be at least 2 characters long")
        return clean

    @field_validator("mobile")
    @classmethod
    def validate_indian_mobile(cls, v: str) -> str:
        # Strip spaces or hyphens if present
        cleaned = re.sub(r"[\s\-\+]", "", v)
        if cleaned.startswith("91") and len(cleaned) == 12:
            cleaned = cleaned[2:]
        if not INDIAN_MOBILE_REGEX.match(cleaned):
            raise ValueError("Invalid Indian mobile number. Must be a 10-digit number starting with 6, 7, 8, or 9.")
        return cleaned

    @field_validator("consent")
    @classmethod
    def require_consent(cls, v: bool) -> bool:
        if not v:
            raise ValueError("Consent is mandatory to submit an enquiry.")
        return v

    @field_validator("message")
    @classmethod
    def check_for_sensitive_info(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return v
        lower_msg = v.lower()
        for kw in FORBIDDEN_KEYWORDS:
            # Check for words like 'pan:', 'aadhaar:', etc.
            if re.search(rf"\b{kw}\b", lower_msg):
                raise ValueError(
                    f"For your security, please do not include sensitive financial credentials ({kw}) in enquiries."
                )
        return v


class EnquirySubmitResponse(BaseModel):
    reference_id: str
    status: str


class EnquiryServiceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    service_slug: str
    service_detail: Optional[str] = None


class EnquiryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    reference_id: str
    name: str
    mobile: str
    email: Optional[str] = None
    contact_method: str
    message: Optional[str] = None
    consent: bool
    status: str
    assigned_to: Optional[int] = None
    admin_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    services: List[EnquiryServiceRead] = []


class EnquiryUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern="^(new|contacted|in_progress|resolved|closed)$")
    assigned_to: Optional[int] = None
    admin_notes: Optional[str] = None
