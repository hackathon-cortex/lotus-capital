from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class StatisticPublicRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    statistic_key: str
    label: str
    value: str
    definition: Optional[str] = None
    as_of_date: Optional[date] = None


class StatisticAdminRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    statistic_key: str
    label: str
    value: str
    tier: str  # Tier A, Tier B, Tier C
    approval_status: str  # draft, pending, approved, withheld
    definition: Optional[str] = None
    as_of_date: Optional[date] = None
    approved_by: Optional[int] = None
    approved_at: Optional[datetime] = None
    updated_at: datetime


class StatisticCreate(BaseModel):
    statistic_key: str = Field(..., min_length=2, max_length=64)
    label: str = Field(..., min_length=2, max_length=128)
    value: str = Field(..., min_length=1, max_length=64)
    tier: str = Field(default="Tier A", pattern="^(Tier A|Tier B|Tier C)$")
    approval_status: str = Field(default="pending", pattern="^(draft|pending|approved|withheld)$")
    definition: Optional[str] = None
    as_of_date: Optional[date] = None


class StatisticUpdate(BaseModel):
    label: Optional[str] = None
    value: Optional[str] = None
    tier: Optional[str] = Field(None, pattern="^(Tier A|Tier B|Tier C)$")
    approval_status: Optional[str] = Field(None, pattern="^(draft|pending|approved|withheld)$")
    definition: Optional[str] = None
    as_of_date: Optional[date] = None
