from typing import List, Optional, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request, Response, Query, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import Session, joinedload
from app.core.config import settings
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user, require_role
from app.models.user import User
from app.models.enquiry import Enquiry
from app.models.followup import FollowUp
from app.models.audit_log import AuditLog
from app.core.permissions import Role
from app.core.security import get_password_hash
from app.core.exceptions import BadRequestException, NotFoundException, ForbiddenException
from app.schemas.common import APIResponse, PaginatedResponse
from app.schemas.admin import (
    DashboardMetrics,
    ServiceCount,
    MonthlyTrend,
    AuditLogRead,
    FollowupsCountResponse,
    DueFollowupItem,
)
from app.schemas.enquiry import EnquiryRead, EnquiryUpdate, AdminEnquiryCreate, DeleteEnquiryRequest
from app.schemas.statistics import StatisticAdminRead, StatisticUpdate
from app.schemas.content import ContentRead, ContentCreate, ContentUpdate
from app.schemas.auth import UserRead, UserCreate, UserUpdate
from app.services.enquiry_service import EnquiryService
from app.services.statistics_service import StatisticsService
from app.services.content_service import ContentService
from app.services.audit_service import AuditService
from app.services.dashboard_analytics_service import DashboardAnalyticsService, invalidate_dashboard_cache
from app.repositories.user_repository import UserRepository

router = APIRouter()


# -------------------------------------------------------------
# 1. Dashboard & Reports
# -------------------------------------------------------------
@router.get(
    "/admin/dashboard",
    response_model=APIResponse[DashboardMetrics],
    summary="Admin Dashboard Metrics",
)
def get_dashboard(
    response: Response,
    range: str = Query("30d", pattern="^(30d|90d|12m|custom)$"),
    from_date: Optional[str] = Query(None, alias="from"),
    to_date: Optional[str] = Query(None, alias="to"),
    service: Optional[str] = None,
    assignee: Optional[str] = None,
    include_demo: bool = Query(default=True),
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    response.headers["Cache-Control"] = "no-store"
    is_prod = settings.ENVIRONMENT.lower() in ("production", "prod")
    if is_prod and include_demo:
        include_demo = False

    analytics_service = DashboardAnalyticsService(db)
    metrics = analytics_service.get_dashboard_metrics(
        current_user=current_user,
        range_str=range,
        from_str=from_date,
        to_str=to_date,
        service=service,
        assignee=assignee,
        include_demo=include_demo,
    )
    return APIResponse(success=True, data=metrics)


@router.get(
    "/admin/followups/count",
    response_model=APIResponse[FollowupsCountResponse],
    summary="Follow-ups Count for Sidebar Badge",
)
def get_followups_count(
    response: Response,
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    response.headers["Cache-Control"] = "no-store"
    analytics_service = DashboardAnalyticsService(db)
    counts = analytics_service.get_followups_count(current_user=current_user)
    return APIResponse(success=True, data=counts)


class FollowUpCreate(BaseModel):
    enquiry_id: int
    due_at: datetime
    topic: Optional[str] = None
    notes: Optional[str] = None
    assignee_id: Optional[int] = None


class FollowUpRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    enquiry_id: int
    due_at: datetime
    done_at: Optional[datetime] = None
    topic: Optional[str] = None
    notes: Optional[str] = None
    assignee_id: Optional[int] = None
    created_at: datetime


@router.post(
    "/admin/followups",
    response_model=APIResponse[FollowUpRead],
    summary="Schedule a Follow-up",
)
def schedule_followup(
    payload: FollowUpCreate,
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    enquiry = db.query(Enquiry).filter(Enquiry.id == payload.enquiry_id, Enquiry.deleted_at.is_(None)).first()
    if not enquiry:
        raise NotFoundException("Enquiry not found.")

    if current_user.role == "editor" and enquiry.assigned_to and enquiry.assigned_to != current_user.id:
        raise ForbiddenException("Cannot schedule follow-up for enquiry assigned to another staff member.")

    fu = FollowUp(
        enquiry_id=payload.enquiry_id,
        due_at=payload.due_at,
        topic=payload.topic,
        notes=payload.notes,
        assignee_id=payload.assignee_id or enquiry.assigned_to or current_user.id,
    )
    db.add(fu)
    db.commit()
    db.refresh(fu)
    invalidate_dashboard_cache()
    return APIResponse(success=True, message="Follow-up scheduled successfully.", data=fu)


@router.patch(
    "/admin/followups/{id}/done",
    response_model=APIResponse[FollowUpRead],
    summary="Mark Follow-up as Completed",
)
def mark_followup_done(
    id: int,
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    fu = db.query(FollowUp).filter(FollowUp.id == id).first()
    if not fu:
        raise NotFoundException("Follow-up not found.")
    fu.done_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(fu)
    invalidate_dashboard_cache()
    return APIResponse(success=True, message="Follow-up marked as completed.", data=fu)


@router.get(
    "/admin/reports/services",
    summary="Service Performance Report",
)
def get_service_reports(
    response: Response,
    range: str = Query("30d", pattern="^(30d|90d|12m|custom)$"),
    from_date: Optional[str] = Query(None, alias="from"),
    to_date: Optional[str] = Query(None, alias="to"),
    current_user: User = Depends(require_role(Role.ADMIN)),
    db: Session = Depends(get_db),
):
    response.headers["Cache-Control"] = "no-store"
    analytics_service = DashboardAnalyticsService(db)
    metrics = analytics_service.get_dashboard_metrics(
        current_user=current_user,
        range_str=range,
        from_str=from_date,
        to_str=to_date,
    )
    return {
        "services": [
            {
                "service": s.service_slug,
                "name": s.name,
                "count": s.count,
                "converted_count": s.converted_count,
                "conversion_rate": s.conversion_rate,
            }
            for s in metrics.by_service
        ]
    }


@router.get(
    "/admin/reports/conversion",
    summary="Conversion Funnel Report",
)
def get_conversion_reports(
    response: Response,
    range: str = Query("30d", pattern="^(30d|90d|12m|custom)$"),
    from_date: Optional[str] = Query(None, alias="from"),
    to_date: Optional[str] = Query(None, alias="to"),
    current_user: User = Depends(require_role(Role.ADMIN)),
    db: Session = Depends(get_db),
):
    response.headers["Cache-Control"] = "no-store"
    analytics_service = DashboardAnalyticsService(db)
    metrics = analytics_service.get_dashboard_metrics(
        current_user=current_user,
        range_str=range,
        from_str=from_date,
        to_str=to_date,
    )
    total = metrics.total_enquiries
    conv = metrics.resolved_enquiries
    overall_rate = round((conv / total) * 100.0, 1) if total > 0 else 0.0
    return {
        "conversion_rate": overall_rate,
        "stages": metrics.by_status,
        "summary": metrics.summary.model_dump(),
    }


def escape_csv_cell(val: Any) -> str:
    if val is None:
        return '""'
    s = str(val).replace('"', '""')
    if s and s[0] in ("=", "+", "-", "@", "\t", "\r"):
        s = f"'{s}"
    return f'"{s}"'


@router.get(
    "/admin/enquiries/export",
    summary="Export Enquiries to CSV (Admin only)",
)
@router.get(
    "/admin/leads/export",
    summary="Export Leads to CSV (Alias)",
)
def export_admin_enquiries(
    search: Optional[str] = None,
    status: Optional[str] = None,
    service_slug: Optional[str] = None,
    is_deleted: Optional[bool] = None,
    current_user: User = Depends(require_role(Role.ADMIN)),
    db: Session = Depends(get_db),
):
    service = EnquiryService(db)
    items, _ = service.list_admin_enquiries(
        page=1,
        page_size=1000,
        search=search,
        status=status,
        service_slug=service_slug,
        is_deleted=is_deleted,
    )
    headers = [
        "Ref ID",
        "Submission Date",
        "Client Name",
        "Mobile",
        "Email",
        "Organisation Name",
        "City",
        "ROHINI ID",
        "Source",
        "Services",
        "Status",
        "Notes",
    ]
    lines = [",".join(headers)]
    for item in items:
        services_str = "; ".join([s.service_slug for s in (item.services or [])])
        row = [
            escape_csv_cell(item.reference_id),
            escape_csv_cell(item.created_at.isoformat() if item.created_at else ""),
            escape_csv_cell(item.name),
            escape_csv_cell(item.mobile),
            escape_csv_cell(item.email or ""),
            escape_csv_cell(item.organisation_name or ""),
            escape_csv_cell(item.city or ""),
            escape_csv_cell(item.existing_rohini_id or ""),
            escape_csv_cell(item.source or item.created_via or ""),
            escape_csv_cell(services_str),
            escape_csv_cell(item.status),
            escape_csv_cell(item.admin_notes or ""),
        ]
        lines.append(",".join(row))

    csv_data = "\n".join(lines)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="lotus_capital_leads.csv"'},
    )


# -------------------------------------------------------------
# 2. Enquiry / Lead Management
# -------------------------------------------------------------
@router.get(
    "/admin/enquiries",
    response_model=PaginatedResponse[EnquiryRead],
    summary="List Enquiries (Paginated, Filterable)",
)
@router.get(
    "/admin/leads",
    response_model=PaginatedResponse[EnquiryRead],
    summary="List Leads (Alias)",
)
def list_admin_enquiries(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    service_slug: Optional[str] = None,
    is_deleted: Optional[bool] = None,
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    service = EnquiryService(db)
    items, total = service.list_admin_enquiries(
        page=page,
        page_size=page_size,
        search=search,
        status=status,
        service_slug=service_slug,
        is_deleted=is_deleted,
    )
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1
    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get(
    "/admin/enquiries/check-mobile",
    response_model=APIResponse[Optional[EnquiryRead]],
    summary="Check if mobile number already has an active lead",
)
@router.get(
    "/admin/leads/check-mobile",
    response_model=APIResponse[Optional[EnquiryRead]],
    summary="Check if mobile number already has an active lead (Alias)",
)
def check_duplicate_mobile(
    mobile: str = Query(..., description="10-digit mobile number to check"),
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    service = EnquiryService(db)
    existing = service.check_duplicate_mobile(mobile)
    return APIResponse(
        success=True,
        message="Active lead found" if existing else "No existing lead found",
        data=existing,
    )


@router.post(
    "/admin/enquiries",
    response_model=APIResponse[EnquiryRead],
    status_code=status.HTTP_201_CREATED,
    summary="Create Manual Enquiry / Lead by Staff",
)
@router.post(
    "/admin/leads",
    response_model=APIResponse[EnquiryRead],
    status_code=status.HTTP_201_CREATED,
    summary="Create Manual Lead by Staff (Alias)",
)
def create_admin_enquiry(
    payload: AdminEnquiryCreate,
    request: Request,
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    service = EnquiryService(db)
    created = service.create_admin_enquiry(
        payload=payload,
        current_user=current_user,
        ip_address=ip_address,
    )
    return APIResponse(
        success=True,
        message="Enquiry created successfully.",
        data=created,
    )


@router.get(
    "/admin/enquiries/{id}",
    response_model=APIResponse[EnquiryRead],
    summary="Get Enquiry Details by ID",
)
@router.get(
    "/admin/leads/{id}",
    response_model=APIResponse[EnquiryRead],
    summary="Get Lead Details by ID (Alias)",
)
def get_admin_enquiry(
    id: int,
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    service = EnquiryService(db)
    item = service.get_by_id(id, include_deleted=True)
    return APIResponse(success=True, data=item)


@router.patch(
    "/admin/enquiries/{id}",
    response_model=APIResponse[EnquiryRead],
    summary="Update Enquiry Status and Assignment",
)
@router.patch(
    "/admin/leads/{id}",
    response_model=APIResponse[EnquiryRead],
    summary="Update Lead Status and Assignment (Alias)",
)
def update_admin_enquiry(
    id: int,
    payload: EnquiryUpdate,
    request: Request,
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    service = EnquiryService(db)
    updated = service.update_enquiry(
        enquiry_id=id,
        payload=payload,
        admin_user_id=current_user.id,
        ip_address=ip_address,
    )
    return APIResponse(success=True, message="Enquiry updated.", data=updated)


@router.delete(
    "/admin/enquiries/{id}",
    response_model=APIResponse[EnquiryRead],
    summary="Soft-delete Enquiry (Move to Trash)",
)
@router.delete(
    "/admin/leads/{id}",
    response_model=APIResponse[EnquiryRead],
    summary="Soft-delete Lead (Alias)",
)
def soft_delete_admin_enquiry(
    id: int,
    request: Request,
    reason: Optional[str] = Query(None, description="Reason for deletion"),
    payload: Optional[DeleteEnquiryRequest] = None,
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    delete_reason = reason or (payload.reason if payload else "other")
    service = EnquiryService(db)
    deleted = service.soft_delete_enquiry(
        enquiry_id=id,
        current_user=current_user,
        reason=delete_reason,
        ip_address=ip_address,
    )
    return APIResponse(
        success=True,
        message="Enquiry moved to trash.",
        data=deleted,
    )


@router.post(
    "/admin/enquiries/{id}/restore",
    response_model=APIResponse[EnquiryRead],
    summary="Restore Soft-deleted Enquiry",
)
@router.post(
    "/admin/leads/{id}/restore",
    response_model=APIResponse[EnquiryRead],
    summary="Restore Soft-deleted Lead (Alias)",
)
def restore_admin_enquiry(
    id: int,
    request: Request,
    current_user: User = Depends(require_role(Role.ADMIN)),
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    service = EnquiryService(db)
    restored = service.restore_enquiry(
        enquiry_id=id,
        current_user=current_user,
        ip_address=ip_address,
    )
    return APIResponse(
        success=True,
        message="Enquiry restored from trash.",
        data=restored,
    )


@router.delete(
    "/admin/enquiries/{id}/permanent",
    response_model=APIResponse[None],
    summary="Permanently Delete Enquiry from Database (Admin only)",
)
@router.delete(
    "/admin/leads/{id}/permanent",
    response_model=APIResponse[None],
    summary="Permanently Delete Lead (Alias)",
)
def permanent_delete_admin_enquiry(
    id: int,
    request: Request,
    confirm: bool = Query(False, description="Must be true to confirm permanent deletion"),
    current_user: User = Depends(require_role(Role.ADMIN)),
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    service = EnquiryService(db)
    service.permanent_delete_enquiry(
        enquiry_id=id,
        current_user=current_user,
        confirm=confirm,
        ip_address=ip_address,
    )
    return APIResponse(
        success=True,
        message="Enquiry permanently deleted.",
        data=None,
    )


# -------------------------------------------------------------
# 3. Statistics Management
# -------------------------------------------------------------
@router.get(
    "/admin/statistics",
    response_model=APIResponse[List[StatisticAdminRead]],
    summary="List Statistics for Administration",
)
def list_admin_statistics(
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    service = StatisticsService(db)
    stats = service.list_admin_statistics(user_role=current_user.role)
    return APIResponse(success=True, data=stats)


@router.patch(
    "/admin/statistics/{id}",
    response_model=APIResponse[StatisticAdminRead],
    summary="Update Statistic Approval and Definition",
)
def update_admin_statistic(
    id: int,
    payload: StatisticUpdate,
    request: Request,
    current_user: User = Depends(require_role(Role.ADMIN)),
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    service = StatisticsService(db)
    updated = service.update_statistic(
        stat_id=id,
        payload=payload,
        user_role=current_user.role,
        user_id=current_user.id,
        ip_address=ip_address,
    )
    return APIResponse(success=True, message="Statistic updated.", data=updated)


# -------------------------------------------------------------
# 4. Content Management
# -------------------------------------------------------------
@router.get(
    "/admin/content",
    response_model=PaginatedResponse[ContentRead],
    summary="List Content (Drafts, Published, Archived)",
)
def list_admin_content(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    content_type: Optional[str] = None,
    status: Optional[str] = None,
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    service = ContentService(db)
    items, total = service.list_admin_content(
        content_type=content_type,
        status=status,
        page=page,
        page_size=page_size,
    )
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1
    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.post(
    "/admin/content",
    response_model=APIResponse[ContentRead],
    status_code=status.HTTP_201_CREATED,
    summary="Create Content Entry",
)
def create_admin_content(
    payload: ContentCreate,
    request: Request,
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    service = ContentService(db)
    created = service.create_content(payload, user_id=current_user.id, ip_address=ip_address)
    return APIResponse(success=True, message="Content created.", data=created)


@router.patch(
    "/admin/content/{id}",
    response_model=APIResponse[ContentRead],
    summary="Update Content Entry",
)
def update_admin_content(
    id: int,
    payload: ContentUpdate,
    request: Request,
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    service = ContentService(db)
    updated = service.update_content(
        content_id=id,
        payload=payload,
        user_id=current_user.id,
        ip_address=ip_address,
    )
    return APIResponse(success=True, message="Content updated.", data=updated)


@router.post(
    "/admin/content/{id}/preview-token",
    summary="Generate a Temporary Preview Token for Draft Content",
)
def create_preview_token(
    id: int,
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    import secrets
    from datetime import timedelta
    from app.models.preview_token import PreviewToken
    from app.models.content import Content

    content = db.get(Content, id)
    if not content:
        raise NotFoundException(f"Content with ID {id} not found.")

    token_str = secrets.token_urlsafe(24)
    expires = datetime.now(timezone.utc) + timedelta(hours=24)

    preview_record = PreviewToken(
        token=token_str,
        content_id=id,
        expires_at=expires,
    )
    db.add(preview_record)
    db.commit()

    return APIResponse(
        success=True,
        message="Preview token generated successfully.",
        data={
            "token": token_str,
            "preview_url": f"/api/v1/content/preview/{token_str}",
            "expires_at": expires.isoformat(),
        },
    )


@router.delete(
    "/admin/content/{id}",
    response_model=APIResponse[None],
    summary="Archive Content Entry",
)
def archive_admin_content(
    id: int,
    request: Request,
    current_user: User = Depends(require_role(Role.ADMIN)),
    db: Session = Depends(get_db),
):
    from app.models.content import Content
    content = db.get(Content, id)
    if not content:
        raise NotFoundException(f"Content with ID {id} not found.")

    content.status = "archived"
    content.updated_by = current_user.id
    db.commit()

    ip_address = request.client.host if request.client else None
    AuditService.log_action(
        db=db,
        action="CONTENT_ARCHIVED",
        entity_type="content",
        entity_id=str(id),
        user_id=current_user.id,
        metadata={"slug": content.slug},
        ip_address=ip_address,
    )

    return APIResponse(success=True, message="Content archived successfully.")


# -------------------------------------------------------------
# 5. User Management (Super Admin only)
# -------------------------------------------------------------
@router.get(
    "/admin/users",
    response_model=APIResponse[List[UserRead]],
    summary="List Admin Users",
)
def list_admin_users(
    current_user: User = Depends(require_role(Role.SUPER_ADMIN)),
    db: Session = Depends(get_db),
):
    repo = UserRepository(db)
    users = repo.list_users()
    return APIResponse(success=True, data=[UserRead.model_validate(u) for u in users])


@router.post(
    "/admin/users",
    response_model=APIResponse[UserRead],
    status_code=status.HTTP_201_CREATED,
    summary="Create New Admin User",
)
def create_admin_user(
    payload: UserCreate,
    request: Request,
    current_user: User = Depends(require_role(Role.SUPER_ADMIN)),
    db: Session = Depends(get_db),
):
    repo = UserRepository(db)
    existing = repo.get_by_email(payload.email)
    if existing:
        raise BadRequestException(f"User with email '{payload.email}' already exists.")

    user = User(
        full_name=payload.full_name,
        email=payload.email.strip().lower(),
        password_hash=get_password_hash(payload.password),
        role=payload.role,
        is_active=payload.is_active,
        is_superuser=(payload.role == Role.SUPER_ADMIN.value),
    )
    created = repo.create(user)

    ip_address = request.client.host if request.client else None
    AuditService.log_action(
        db=db,
        action="USER_CREATED",
        entity_type="user",
        entity_id=str(created.id),
        user_id=current_user.id,
        metadata={"email": created.email, "role": created.role},
        ip_address=ip_address,
    )

    return APIResponse(success=True, message="User created successfully.", data=UserRead.model_validate(created))


@router.patch(
    "/admin/users/{id}",
    response_model=APIResponse[UserRead],
    summary="Update Admin User Role or Active Status",
)
def update_admin_user(
    id: int,
    payload: UserUpdate,
    request: Request,
    current_user: User = Depends(require_role(Role.SUPER_ADMIN)),
    db: Session = Depends(get_db),
):
    repo = UserRepository(db)
    user = repo.get_by_id(id)
    if not user:
        raise NotFoundException(f"User with ID {id} not found.")

    # Prevent accidental deactivation of super_admin self
    if user.id == current_user.id and payload.is_active is False:
        raise BadRequestException("You cannot deactivate your own super-admin account.")

    if payload.full_name is not None:
        user.full_name = payload.full_name
    if payload.role is not None:
        user.role = payload.role
        user.is_superuser = (payload.role == Role.SUPER_ADMIN.value)
    if payload.is_active is not None:
        user.is_active = payload.is_active
    if payload.password is not None:
        user.password_hash = get_password_hash(payload.password)

    updated = repo.update(user)

    ip_address = request.client.host if request.client else None
    AuditService.log_action(
        db=db,
        action="USER_UPDATED",
        entity_type="user",
        entity_id=str(updated.id),
        user_id=current_user.id,
        metadata={"role": updated.role, "is_active": updated.is_active},
        ip_address=ip_address,
    )

    return APIResponse(success=True, message="User updated successfully.", data=UserRead.model_validate(updated))


# -------------------------------------------------------------
# 6. Audit Logs
# -------------------------------------------------------------
@router.get(
    "/admin/audit-logs",
    response_model=PaginatedResponse[AuditLogRead],
    summary="List Audit Logs",
)
def list_audit_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    current_user: User = Depends(require_role(Role.ADMIN)),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * page_size
    query = select(AuditLog).order_by(AuditLog.created_at.desc()).offset(skip).limit(page_size)
    total_query = select(func.count(AuditLog.id))

    items = list(db.execute(query).scalars().all())
    total = db.execute(total_query).scalar() or 0
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1

    return PaginatedResponse(
        items=[AuditLogRead.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )
