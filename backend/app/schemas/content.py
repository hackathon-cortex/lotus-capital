from datetime import datetime
from typing import Optional, Any, Dict
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
    slug: str
    title: str
    short_description: str
    icon: Optional[str] = None
    order: int = 0
    active: bool = True


class FAQPublicRead(BaseModel):
    id: int
    question: str
    answer: str
    category: Optional[str] = "General"
    order: int = 0
