from datetime import datetime
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, ConfigDict
from app.schemas.enquiry import EnquiryRead


class MonthlyTrend(BaseModel):
    month: str
    count: int


class ServiceCount(BaseModel):
    service_slug: str
    count: int


class DashboardMetrics(BaseModel):
    total_enquiries: int
    new_enquiries: int
    in_progress_enquiries: int
    resolved_enquiries: int
    service_breakdown: List[ServiceCount]
    monthly_trends: List[MonthlyTrend]
    recent_enquiries: List[EnquiryRead]


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
