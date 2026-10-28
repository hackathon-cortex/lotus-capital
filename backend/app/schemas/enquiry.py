import re
from typing import Optional, Literal
from pydantic import BaseModel, Field, field_validator

class EnquiryCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    mobile: str = Field(...)
    email: Optional[str] = Field(None, max_length=255)
    service: Literal[
        "general-insurance",
        "life-insurance",
        "health-insurance",
        "mutual-funds",
        "equity",
        "other-solutions",
    ]
    message: Optional[str] = Field(None, max_length=1000)
    contact_method: Optional[Literal["phone", "whatsapp", "email"]] = "phone"
    source_path: str = Field(..., max_length=255)
    consent: bool = Field(...)
    utm_source: Optional[str] = Field(None, max_length=100)
    utm_medium: Optional[str] = Field(None, max_length=100)
    utm_campaign: Optional[str] = Field(None, max_length=100)

    @field_validator("mobile")
    @classmethod
    def validate_indian_mobile(cls, v: str) -> str:
        cleaned = re.sub(r"[\s\-\+]", "", v)
        if cleaned.startswith("91") and len(cleaned) == 12:
            cleaned = cleaned[2:]
        if not re.match(r"^[6-9]\d{9}$", cleaned):
            raise ValueError("Mobile must be a valid 10-digit Indian phone number starting with 6-9")
        return cleaned

    @field_validator("consent")
    @classmethod
    def validate_consent(cls, v: bool) -> bool:
        if not v:
            raise ValueError("Consent must be accepted")
        return v

class EnquiryResponse(BaseModel):
    enquiry_id: str
    message: str = "Your enquiry has been submitted."

