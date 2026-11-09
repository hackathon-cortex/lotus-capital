from datetime import datetime
from typing import Optional, Any, Dict, List
from pydantic import BaseModel, Field, ConfigDict


class ContentBase(BaseModel):
    content_type: str = Field(..., pattern="^(page|service|faq|insight|seo|disclaimer)$")
    slug: str = Field(..., min_length=2, max_length=128)
    title: str = Field(..., min_length=2, max_length=255)
    content_json: Dict[str, Any]
    status: str = Field(default="draft", pattern="^(draft|published|archived)$")


class ContentCreate(ContentBase):
    pass


class ContentUpdate(BaseModel):
    title: Optional[str] = None
    content_json: Optional[Dict[str, Any]] = None
    status: Optional[str] = Field(None, pattern="^(draft|published|archived)$")


class ContentRead(ContentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_by: Optional[int] = None
    updated_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime


class ContentPublicRead(BaseModel):
    slug: str
    title: str
    content_type: str
    content_json: Dict[str, Any]
    updated_at: datetime


class ServicePublicRead(BaseModel):
    model_config = ConfigDict(extra="allow", from_attributes=True)

    slug: str
    title: str
    short_description: Optional[str] = None
    shortDescription: Optional[str] = None
    category: Optional[str] = None
    path: Optional[str] = None
    icon: Optional[str] = None
    theme: Optional[Dict[str, Any]] = None
    order: Optional[int] = 0
    active: Optional[bool] = True


class FAQPublicRead(BaseModel):
    id: Any
    question: str
    answer: str
    page: Optional[str] = None
    category: Optional[str] = "General"
    order: Optional[int] = 0


class StatisticSchema(BaseModel):
    id: str
    label: str
    value: str
    displayText: str
    unit: Optional[str] = None
    tier: str
    asOfDate: Optional[str] = None
    definitionNote: Optional[str] = None
    sourceDocument: str
    approvalStatus: str
    pages: List[str]


class RegistrationSchema(BaseModel):
    id: str
    clientEntry: str
    number: str
    holder: str
    role: str
    recommendedWording: str
    verifyBeforePublishing: str
    validityDate: Optional[str] = None
    status: str


class PartnerSchema(BaseModel):
    id: str
    name: str
    category: str
    relationshipLabel: str
    logoPlaceholder: str
    status: str


class TeamMemberSchema(BaseModel):
    id: str
    name: str
    designation: str
    credentials: str
    bio: str
    photoPath: str
    approvalStatus: str


class AchievementSchema(BaseModel):
    id: str
    year: int
    award: str
    issuedBy: str
    status: str
