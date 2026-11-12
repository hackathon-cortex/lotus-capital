from datetime import datetime
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.enquiry import EnquiryRead


class MonthlyTrend(BaseModel):
    month: str
    count: int


class ServiceCount(BaseModel):
    service_slug: str
    count: int


class SummaryMetrics(BaseModel):
    new_enquiries_this_month: int = 0
    new_enquiries_today: int = 0
    follow_ups_due_today: int = 0
    follow_ups_overdue: int = 0
    converted_this_month: int = 0
    awaiting_review: int = 0
    total_leads: int = 0
    previous_period: Dict[str, int] = Field(default_factory=dict)
    change_pct: Dict[str, Optional[float]] = Field(default_factory=dict)


class ServiceConversionMetric(BaseModel):
    service_slug: str
    name: str
    count: int = 0
    converted_count: int = 0
    conversion_rate: Optional[float] = None  # None if count == 0


class MonthlyDataPoint(BaseModel):
    month_key: str  # YYYY-MM
    month_label: str  # e.g. "Nov 2026"
    enquiries: int = 0
    conversions: int = 0


class SourceMetric(BaseModel):
    source: str
    label: str
    count: int = 0


class DueFollowupItem(BaseModel):
    id: int
    enquiry_id: int
    reference_id: str
    client_name: str
    phone: Optional[str] = None
    service_slug: Optional[str] = None
    service_name: Optional[str] = None
    due_at: datetime
    assignee_id: Optional[int] = None
    assignee_name: Optional[str] = None
    topic: Optional[str] = None
    notes: Optional[str] = None
    is_overdue: bool = False


class FollowupsCountResponse(BaseModel):
    count: int = 0
    due_today: int = 0
    overdue: int = 0
    upcoming: int = 0


class DashboardMetrics(BaseModel):
    # Backward-compatible baseline fields
    total_enquiries: int = 0
    new_enquiries: int = 0
    in_progress_enquiries: int = 0
    resolved_enquiries: int = 0
    service_breakdown: List[ServiceCount] = Field(default_factory=list)
    monthly_trends: List[MonthlyTrend] = Field(default_factory=list)
    recent_enquiries: List[EnquiryRead] = Field(default_factory=list)

    # Dynamic computed fields for Phase 1
    summary: SummaryMetrics = Field(default_factory=SummaryMetrics)
    by_status: Dict[str, int] = Field(default_factory=dict)
    by_service: List[ServiceConversionMetric] = Field(default_factory=list)
    by_month: List[MonthlyDataPoint] = Field(default_factory=list)
    by_source: List[SourceMetric] = Field(default_factory=list)
    latest_enquiries: List[EnquiryRead] = Field(default_factory=list)
    follow_ups_due: List[DueFollowupItem] = Field(default_factory=list)
    generated_at: str = ""


class AuditLogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: Optional[int] = None
    action: str
    entity_type: str
    entity_id: Optional[str] = None
    metadata_json: Optional[str] = None
    ip_address: Optional[str] = None
    created_at: datetime
