import os
import time
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Tuple, Any
from sqlalchemy import select, func, and_, or_, case
from sqlalchemy.orm import Session, joinedload

from app.core.timezone import IST, now_ist, now_utc, to_ist, get_ist_day_bounds, get_ist_month_bounds
from app.models.user import User
from app.models.enquiry import Enquiry
from app.models.enquiry_service import EnquiryService
from app.models.followup import FollowUp
from app.schemas.admin import (
    DashboardMetrics,
    SummaryMetrics,
    ServiceConversionMetric,
    MonthlyDataPoint,
    SourceMetric,
    DueFollowupItem,
    ServiceCount,
    MonthlyTrend,
    FollowupsCountResponse,
)
from app.schemas.enquiry import EnquiryRead


CANONICAL_SERVICES = [
    ("mutual-funds", "Mutual Funds"),
    ("general-insurance", "General Insurance"),
    ("life-insurance", "Life Insurance"),
    ("health-insurance", "Health Insurance"),
    ("equity", "Equity & Demat"),
    ("other-solutions", "Bonds & Deposits"),
]

CANONICAL_SOURCES = [
    ("website", "Website"),
    ("phone_inbound", "Phone call"),
    ("branch_walkin", "Walk-in"),
    ("whatsapp_inbound", "WhatsApp"),
    ("referral", "Referral"),
    ("other", "Other"),
]

# Simple in-memory cache with 15s TTL
_DASHBOARD_CACHE: Dict[str, Tuple[float, Any]] = {}
CACHE_TTL_SECONDS = 15.0


def invalidate_dashboard_cache():
    """Clear cached dashboard queries upon lead or followup mutation."""
    global _DASHBOARD_CACHE
    _DASHBOARD_CACHE.clear()


class DashboardAnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def _parse_range(
        self,
        range_str: str,
        from_str: Optional[str] = None,
        to_str: Optional[str] = None,
    ) -> Tuple[datetime, datetime, datetime, datetime, List[Tuple[str, str, datetime, datetime]]]:
        """
        Parses range into (start_utc, end_utc, prev_start_utc, prev_end_utc, month_buckets_utc).
        All boundaries are aligned to Indian Standard Time (Asia/Kolkata).
        """
        current_ist = now_ist()

        if range_str == "custom" and from_str and to_str:
            try:
                dt_from = datetime.strptime(from_str.strip(), "%Y-%m-%d").replace(tzinfo=IST)
                dt_to = datetime.strptime(to_str.strip(), "%Y-%m-%d").replace(hour=23, minute=59, second=59, microsecond=999999, tzinfo=IST)
                start_ist = dt_from
                end_ist = dt_to
            except ValueError:
                start_ist = current_ist - timedelta(days=30)
                end_ist = current_ist
        elif range_str == "90d":
            start_ist = current_ist - timedelta(days=90)
            end_ist = current_ist
        elif range_str == "12m":
            start_ist = current_ist - timedelta(days=365)
            end_ist = current_ist
        else:  # default "30d"
            start_ist = current_ist - timedelta(days=30)
            end_ist = current_ist

        delta = end_ist - start_ist
        prev_end_ist = start_ist
        prev_start_ist = start_ist - delta

        start_utc = start_ist.astimezone(timezone.utc)
        end_utc = end_ist.astimezone(timezone.utc)
        prev_start_utc = prev_start_ist.astimezone(timezone.utc)
        prev_end_utc = prev_end_ist.astimezone(timezone.utc)

        # Generate zero-filled month buckets covering the period in IST
        month_buckets = []
        cur_year = start_ist.year
        cur_month = start_ist.month
        end_year = end_ist.year
        end_month = end_ist.month

        # Safety bound: maximum 24 monthly buckets
        for _ in range(24):
            m_key = f"{cur_year:04d}-{cur_month:02d}"
            m_start_ist = datetime(cur_year, cur_month, 1, 0, 0, 0, tzinfo=IST)
            m_label = m_start_ist.strftime("%b %Y")

            if cur_month == 12:
                next_y, next_m = cur_year + 1, 1
            else:
                next_y, next_m = cur_year, cur_month + 1

            m_end_ist = datetime(next_y, next_m, 1, 0, 0, 0, tzinfo=IST) - timedelta(microseconds=1)
            month_buckets.append((m_key, m_label, m_start_ist.astimezone(timezone.utc), m_end_ist.astimezone(timezone.utc)))

            if cur_year == end_year and cur_month == end_month:
                break
            cur_year, cur_month = next_y, next_m

        return start_utc, end_utc, prev_start_utc, prev_end_utc, month_buckets

    def _build_base_filters(
        self,
        current_user: User,
        service: Optional[str] = None,
        assignee: Optional[str] = None,
        include_demo: bool = True,
    ) -> List[Any]:
        """Builds standard SQLAlchemy WHERE clauses with role-scoping and demo filtering."""
        clauses = [Enquiry.deleted_at.is_(None)]

        if not include_demo:
            clauses.append(Enquiry.is_demo.is_(False))

        # Role scoping: Staff (editor) can only access assigned leads or unassigned leads
        if current_user.role == "editor":
            clauses.append(
                or_(
                    Enquiry.assigned_to == current_user.id,
                    Enquiry.assigned_to.is_(None),
                )
            )

        # Explicit assignee filter
        if assignee:
            assignee_clean = str(assignee).strip().lower()
            if assignee_clean == "me":
                clauses.append(Enquiry.assigned_to == current_user.id)
            elif assignee_clean in ("unassigned", "none"):
                clauses.append(Enquiry.assigned_to.is_(None))
            elif assignee_clean.isdigit():
                clauses.append(Enquiry.assigned_to == int(assignee_clean))

        # Explicit service filter
        if service:
            clauses.append(Enquiry.services.any(EnquiryService.service_slug == service))

        return clauses

    def get_dashboard_metrics(
        self,
        current_user: User,
        range_str: str = "30d",
        from_str: Optional[str] = None,
        to_str: Optional[str] = None,
        service: Optional[str] = None,
        assignee: Optional[str] = None,
        include_demo: bool = True,
    ) -> DashboardMetrics:
        # Check cache
        cache_key = f"{current_user.id}:{current_user.role}:{range_str}:{from_str}:{to_str}:{service}:{assignee}:{include_demo}"
        now_ts = time.time()
        if cache_key in _DASHBOARD_CACHE:
            ts, cached_data = _DASHBOARD_CACHE[cache_key]
            if now_ts - ts < CACHE_TTL_SECONDS:
                return cached_data

        start_utc, end_utc, prev_start_utc, prev_end_utc, month_buckets = self._parse_range(
            range_str, from_str, to_str
        )
        base_filters = self._build_base_filters(
            current_user=current_user,
            service=service,
            assignee=assignee,
            include_demo=include_demo,
        )

        now_i = now_ist()
        start_today_utc, end_today_utc = get_ist_day_bounds(now_i)
        start_month_utc, end_month_utc = get_ist_month_bounds(now_i)

        # 1. Summary Metrics
        # Current period totals
        new_this_month = self.db.query(func.count(Enquiry.id)).filter(
            *base_filters,
            Enquiry.created_at >= start_month_utc,
            Enquiry.created_at <= end_month_utc,
        ).scalar() or 0

        new_today = self.db.query(func.count(Enquiry.id)).filter(
            *base_filters,
            Enquiry.created_at >= start_today_utc,
            Enquiry.created_at <= end_today_utc,
        ).scalar() or 0

        converted_this_month = self.db.query(func.count(Enquiry.id)).filter(
            *base_filters,
            Enquiry.status.in_(["resolved", "closed"]),
            Enquiry.updated_at >= start_month_utc,
            Enquiry.updated_at <= end_month_utc,
        ).scalar() or 0

        awaiting_review = self.db.query(func.count(Enquiry.id)).filter(
            *base_filters,
            Enquiry.status == "new",
            Enquiry.assigned_to.is_(None),
        ).scalar() or 0

        total_leads = self.db.query(func.count(Enquiry.id)).filter(
            *base_filters,
        ).scalar() or 0

        # Previous period comparisons for trend % calculation
        prev_new_month = self.db.query(func.count(Enquiry.id)).filter(
            *base_filters,
            Enquiry.created_at >= prev_start_utc,
            Enquiry.created_at <= prev_end_utc,
        ).scalar() or 0

        prev_converted = self.db.query(func.count(Enquiry.id)).filter(
            *base_filters,
            Enquiry.status.in_(["resolved", "closed"]),
            Enquiry.updated_at >= prev_start_utc,
            Enquiry.updated_at <= prev_end_utc,
        ).scalar() or 0

        # Follow-ups counts
        followup_filter = [FollowUp.done_at.is_(None)]
        if current_user.role == "editor":
            followup_filter.append(
                or_(
                    FollowUp.assignee_id == current_user.id,
                    FollowUp.assignee_id.is_(None),
                )
            )

        followups_due_today = self.db.query(func.count(FollowUp.id)).join(Enquiry).filter(
            *followup_filter,
            *base_filters,
            FollowUp.due_at >= start_today_utc,
            FollowUp.due_at <= end_today_utc,
        ).scalar() or 0

        followups_overdue = self.db.query(func.count(FollowUp.id)).join(Enquiry).filter(
            *followup_filter,
            *base_filters,
            FollowUp.due_at < start_today_utc,
        ).scalar() or 0

        # Change percentages (null when previous is 0, never fabricate)
        def calc_change_pct(current: int, prev: int) -> Optional[float]:
            if prev > 0:
                return round(((current - prev) / prev) * 100.0, 1)
            return None

        previous_period_dict = {
            "new_enquiries": prev_new_month,
            "converted": prev_converted,
        }
        change_pct_dict = {
            "new_enquiries": calc_change_pct(new_this_month, prev_new_month),
            "converted": calc_change_pct(converted_this_month, prev_converted),
        }

        summary = SummaryMetrics(
            new_enquiries_this_month=new_this_month,
            new_enquiries_today=new_today,
            follow_ups_due_today=followups_due_today,
            follow_ups_overdue=followups_overdue,
            converted_this_month=converted_this_month,
            awaiting_review=awaiting_review,
            total_leads=total_leads,
            previous_period=previous_period_dict,
            change_pct=change_pct_dict,
        )

        # 2. By Status (Zero-filled for all 6 statuses)
        status_rows = self.db.query(
            Enquiry.status, func.count(Enquiry.id)
        ).filter(
            *base_filters,
            Enquiry.created_at >= start_utc,
            Enquiry.created_at <= end_utc,
        ).group_by(Enquiry.status).all()

        status_map = {s: 0 for s in ["new", "contacted", "qualified", "in_progress", "resolved", "closed"]}
        for s_val, count in status_rows:
            if s_val in status_map:
                status_map[s_val] = count
            elif s_val == "in_progress":
                status_map["in_progress"] += count

        # 3. By Service (Zero-filled for all 6 canonical services)
        by_service: List[ServiceConversionMetric] = []
        for s_slug, s_name in CANONICAL_SERVICES:
            s_count = self.db.query(func.count(Enquiry.id)).filter(
                *base_filters,
                Enquiry.services.any(EnquiryService.service_slug == s_slug),
                Enquiry.created_at >= start_utc,
                Enquiry.created_at <= end_utc,
            ).scalar() or 0

            s_conv = self.db.query(func.count(Enquiry.id)).filter(
                *base_filters,
                Enquiry.services.any(EnquiryService.service_slug == s_slug),
                Enquiry.status.in_(["resolved", "closed"]),
                Enquiry.created_at >= start_utc,
                Enquiry.created_at <= end_utc,
            ).scalar() or 0

            conv_rate = round((s_conv / s_count) * 100.0, 1) if s_count > 0 else None
            by_service.append(
                ServiceConversionMetric(
                    service_slug=s_slug,
                    name=s_name,
                    count=s_count,
                    converted_count=s_conv,
                    conversion_rate=conv_rate,
                )
            )

        # 4. By Month (Zero-filled for monthly buckets in range)
        by_month: List[MonthlyDataPoint] = []
        for m_key, m_label, m_start, m_end in month_buckets:
            m_enq = self.db.query(func.count(Enquiry.id)).filter(
                *base_filters,
                Enquiry.created_at >= m_start,
                Enquiry.created_at <= m_end,
            ).scalar() or 0

            m_conv = self.db.query(func.count(Enquiry.id)).filter(
                *base_filters,
                Enquiry.status.in_(["resolved", "closed"]),
                Enquiry.updated_at >= m_start,
                Enquiry.updated_at <= m_end,
            ).scalar() or 0

            by_month.append(
                MonthlyDataPoint(
                    month_key=m_key,
                    month_label=m_label,
                    enquiries=m_enq,
                    conversions=m_conv,
                )
            )

        # 5. By Source (Zero-filled for all sources)
        source_rows = self.db.query(
            Enquiry.source, func.count(Enquiry.id)
        ).filter(
            *base_filters,
            Enquiry.created_at >= start_utc,
            Enquiry.created_at <= end_utc,
        ).group_by(Enquiry.source).all()

        db_sources = {row[0]: row[1] for row in source_rows}
        by_source: List[SourceMetric] = []
        for s_code, s_label in CANONICAL_SOURCES:
            c = db_sources.get(s_code, 0)
            by_source.append(SourceMetric(source=s_code, label=s_label, count=c))

        # 6. Latest Enquiries (Latest 8 active leads)
        latest_enquiries_models = self.db.query(Enquiry).options(
            joinedload(Enquiry.services)
        ).filter(
            *base_filters,
        ).order_by(Enquiry.created_at.desc()).limit(8).all()

        latest_enquiries: List[EnquiryRead] = [
            EnquiryRead.model_validate(e) for e in latest_enquiries_models
        ]

        # 7. Follow-ups Due (Next 8 due or overdue)
        due_followup_rows = self.db.query(FollowUp).options(
            joinedload(FollowUp.enquiry),
            joinedload(FollowUp.assignee),
        ).join(Enquiry).filter(
            *followup_filter,
            *base_filters,
        ).order_by(FollowUp.due_at.asc()).limit(8).all()

        follow_ups_due: List[DueFollowupItem] = []
        now_u = now_utc()
        for f in due_followup_rows:
            lead = f.enquiry
            assignee_name = f.assignee.full_name if f.assignee else None
            due_aware = f.due_at if f.due_at.tzinfo is not None else f.due_at.replace(tzinfo=timezone.utc)
            is_over = due_aware < now_u
            s_slug = lead.services[0].service_slug if lead.services else None
            s_name = s_slug.replace("-", " ").title() if s_slug else "Advisory Consult"
            follow_ups_due.append(
                DueFollowupItem(
                    id=f.id,
                    enquiry_id=lead.id,
                    reference_id=lead.reference_id,
                    client_name=lead.name,
                    phone=lead.mobile,
                    service_slug=s_slug,
                    service_name=s_name,
                    due_at=f.due_at,
                    assignee_id=f.assignee_id,
                    assignee_name=assignee_name,
                    topic=f.topic,
                    notes=f.notes,
                    is_overdue=is_over,
                )
            )

        # Baseline backward-compatible mappings
        total_enquiries = total_leads
        new_enquiries = status_map.get("new", 0)
        in_progress_enquiries = status_map.get("in_progress", 0) + status_map.get("contacted", 0)
        resolved_enquiries = status_map.get("resolved", 0) + status_map.get("closed", 0)
        service_breakdown = [ServiceCount(service_slug=s.service_slug, count=s.count) for s in by_service]
        monthly_trends = [MonthlyTrend(month=m.month_label.split()[0], count=m.enquiries) for m in by_month[-6:]]
        recent_enquiries = latest_enquiries[:5]

        result = DashboardMetrics(
            total_enquiries=total_enquiries,
            new_enquiries=new_enquiries,
            in_progress_enquiries=in_progress_enquiries,
            resolved_enquiries=resolved_enquiries,
            service_breakdown=service_breakdown,
            monthly_trends=monthly_trends,
            recent_enquiries=recent_enquiries,
            summary=summary,
            by_status=status_map,
            by_service=by_service,
            by_month=by_month,
            by_source=by_source,
            latest_enquiries=latest_enquiries,
            follow_ups_due=follow_ups_due,
            generated_at=now_utc().isoformat(),
        )

        _DASHBOARD_CACHE[cache_key] = (now_ts, result)
        return result

    def get_followups_count(self, current_user: User) -> FollowupsCountResponse:
        """Returns due today, overdue, upcoming, and total active followups count."""
        now_i = now_ist()
        start_today_utc, end_today_utc = get_ist_day_bounds(now_i)

        followup_filter = [FollowUp.done_at.is_(None)]
        if current_user.role == "editor":
            followup_filter.append(
                or_(
                    FollowUp.assignee_id == current_user.id,
                    FollowUp.assignee_id.is_(None),
                )
            )

        due_today = self.db.query(func.count(FollowUp.id)).join(Enquiry).filter(
            *followup_filter,
            Enquiry.deleted_at.is_(None),
            FollowUp.due_at >= start_today_utc,
            FollowUp.due_at <= end_today_utc,
        ).scalar() or 0

        overdue = self.db.query(func.count(FollowUp.id)).join(Enquiry).filter(
            *followup_filter,
            Enquiry.deleted_at.is_(None),
            FollowUp.due_at < start_today_utc,
        ).scalar() or 0

        upcoming = self.db.query(func.count(FollowUp.id)).join(Enquiry).filter(
            *followup_filter,
            Enquiry.deleted_at.is_(None),
            FollowUp.due_at > end_today_utc,
        ).scalar() or 0

        total = due_today + overdue + upcoming
        return FollowupsCountResponse(
            count=due_today + overdue,
            due_today=due_today,
            overdue=overdue,
            upcoming=upcoming,
        )
