import re
from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field, EmailStr, field_validator, model_validator, ConfigDict


INDIAN_MOBILE_REGEX = re.compile(r"^[6-9]\d{9}$")
FORBIDDEN_KEYWORDS = ["pan", "aadhaar", "otp", "password", "netbanking", "cvv"]
VALID_SERVICES = {
    "general-insurance",
    "life-insurance",
    "health-insurance",
    "mutual-funds",
    "equity",
    "other-solutions",
}


class EnquiryCreate(BaseModel):
    name: Optional[str] = None
    full_name: Optional[str] = None
    mobile: str = Field(..., description="10-digit Indian Mobile Number")
    email: Optional[str] = None
    service: Optional[str] = None
    service_detail: Optional[List[str]] = Field(default_factory=list, description="Selected service slugs or details")
    contact_method: Optional[str] = Field(default="phone", pattern="^(phone|email|whatsapp)$")
    message: Optional[str] = Field(None, max_length=1000)
    consent: bool = Field(..., description="Consent to be contacted")
    source_path: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def unify_name_and_service(cls, data: Any) -> Any:
        if isinstance(data, dict):
            # If full_name provided but not name:
            if "full_name" in data and not data.get("name"):
                data["name"] = data["full_name"]
            elif "name" in data and not data.get("full_name"):
                data["full_name"] = data["name"]
        return data

    @field_validator("service")
    @classmethod
    def validate_service_slug(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_SERVICES:
            raise ValueError(f"Invalid service '{v}'. Allowed services are: {', '.join(sorted(VALID_SERVICES))}")
        return v

    @field_validator("name", "full_name")
    @classmethod
    def sanitize_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            clean = v.strip()
            if len(clean) < 2:
                raise ValueError("Name must be at least 2 characters long")
            return clean
        return v

    @field_validator("service_detail")
    @classmethod
    def validate_service_detail(cls, v: Optional[List[str]]) -> Optional[List[str]]:
        if v is not None:
            sanitized = []
            for item in v:
                cleaned = str(item).strip()
                if cleaned and len(cleaned) <= 100:
                    sanitized.append(cleaned)
            return sanitized
        return None

    @field_validator("mobile")
    @classmethod
    def validate_indian_mobile(cls, v: str) -> str:
        cleaned = re.sub(r"[\s\-\+]", "", v)
        if cleaned.startswith("91") and len(cleaned) == 12:
            cleaned = cleaned[2:]
        if not INDIAN_MOBILE_REGEX.match(cleaned):
            raise ValueError("Mobile must be a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.")
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
            if re.search(rf"\b{kw}\b", lower_msg):
                raise ValueError(
                    f"For your security, please do not include sensitive financial credentials ({kw}) in enquiries."
                )
        return v


class EnquirySubmitResponse(BaseModel):
    reference_id: str
    enquiry_id: str
    message: str = "Your enquiry has been submitted. Our Godhra team will follow up shortly."
    status: str = "received"

    @model_validator(mode="before")
    @classmethod
    def sync_ids(cls, data: Any) -> Any:
        if isinstance(data, dict):
            ref = data.get("reference_id") or data.get("enquiry_id", "LC-UNKNOWN")
            data["reference_id"] = ref
            data["enquiry_id"] = ref
        return data


class EnquiryResponse(BaseModel):
    enquiry_id: str
    message: str = "Your enquiry has been submitted."


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
