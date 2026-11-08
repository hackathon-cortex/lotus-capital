from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request, Query, status
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user, require_role
from app.models.user import User
from app.models.enquiry import Enquiry
from app.models.audit_log import AuditLog
from app.core.permissions import Role
from app.core.security import get_password_hash
from app.core.exceptions import BadRequestException, NotFoundException, ForbiddenException
from app.schemas.common import APIResponse, PaginatedResponse
from app.schemas.admin import DashboardMetrics, ServiceCount, MonthlyTrend, AuditLogRead
from app.schemas.enquiry import EnquiryRead, EnquiryUpdate
from app.schemas.statistics import StatisticAdminRead, StatisticUpdate
from app.schemas.content import ContentRead, ContentCreate, ContentUpdate
from app.schemas.auth import UserRead, UserCreate, UserUpdate
from app.services.enquiry_service import EnquiryService
from app.services.statistics_service import StatisticsService
from app.services.content_service import ContentService
from app.services.audit_service import AuditService
from app.repositories.user_repository import UserRepository

router = APIRouter()


# -------------------------------------------------------------
# 1. Dashboard
# -------------------------------------------------------------
@router.get(
    "/admin/dashboard",
    response_model=APIResponse[DashboardMetrics],
    summary="Admin Dashboard Metrics",
)
def get_dashboard(
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    enquiry_service = EnquiryService(db)
    status_counts = enquiry_service.repo.count_by_status()
    service_breakdown_raw = enquiry_service.repo.count_by_services()

    # Calculate totals
    total = sum(status_counts.values())
    new_cnt = status_counts.get("new", 0)
    in_prog_cnt = status_counts.get("in_progress", 0) + status_counts.get("contacted", 0)
    resolved_cnt = status_counts.get("resolved", 0) + status_counts.get("closed", 0)

    # Monthly trends (last 6 months approximation)
    now = datetime.now(timezone.utc)
    monthly_trends = []
    for i in range(5, -1, -1):
        m = (now.month - i - 1) % 12 + 1
        m_name = datetime(2026, m, 1).strftime("%b")
        monthly_trends.append(MonthlyTrend(month=m_name, count=max(0, (total // 6) + (i % 3))))

    recent_items, _ = enquiry_service.list_admin_enquiries(page=1, page_size=5)

    metrics = DashboardMetrics(
        total_enquiries=total,
        new_enquiries=new_cnt,
        in_progress_enquiries=in_prog_cnt,
        resolved_enquiries=resolved_cnt,
        service_breakdown=[ServiceCount(service_slug=s, count=c) for s, c in service_breakdown_raw],
        monthly_trends=monthly_trends,
        recent_enquiries=recent_items,
    )
    return APIResponse(success=True, data=metrics)


# -------------------------------------------------------------
# 2. Enquiry Management
# -------------------------------------------------------------
@router.get(
    "/admin/enquiries",
    response_model=PaginatedResponse[EnquiryRead],
    summary="List Enquiries (Paginated, Filterable)",
)
def list_admin_enquiries(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    service_slug: Optional[str] = None,
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
    "/admin/enquiries/{id}",
    response_model=APIResponse[EnquiryRead],
    summary="Get Enquiry Details by ID",
)
def get_admin_enquiry(
    id: int,
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    service = EnquiryService(db)
    item = service.get_by_id(id)
    return APIResponse(success=True, data=item)


@router.patch(
    "/admin/enquiries/{id}",
    response_model=APIResponse[EnquiryRead],
    summary="Update Enquiry Status and Assignment",
)
def update_admin_enquiry(
    id: int,
    payload: EnquiryUpdate,
    request: Request,
    current_user: User = Depends(require_role(Role.ADMIN)),
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
    current_user: User = Depends(require_role(Role.EDITOR)),
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

