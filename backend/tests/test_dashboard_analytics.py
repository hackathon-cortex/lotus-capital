import pytest
from datetime import datetime, timezone, timedelta
from app.db.session import SessionLocal
from app.models.user import User
from app.models.enquiry import Enquiry
from app.models.enquiry_service import EnquiryService as EnquiryServiceModel
from app.models.followup import FollowUp
from app.core.timezone import IST, now_ist, now_utc, get_ist_day_bounds
from app.services.dashboard_analytics_service import DashboardAnalyticsService, invalidate_dashboard_cache
from app.services.enquiry_service import EnquiryService


@pytest.fixture
def db_session():
    db = SessionLocal()
    # Clean database before and after
    db.query(FollowUp).delete()
    db.query(EnquiryServiceModel).delete()
    db.query(Enquiry).delete()
    db.commit()
    invalidate_dashboard_cache()

    yield db

    db.query(FollowUp).delete()
    db.query(EnquiryServiceModel).delete()
    db.query(Enquiry).delete()
    db.commit()
    invalidate_dashboard_cache()
    db.close()


@pytest.fixture
def admin_user(db_session):
    user = db_session.query(User).filter(User.role == "super_admin").first()
    if not user:
        user = User(
            full_name="Super Admin",
            email="superadmin@lotuscapital.in",
            password_hash="testhash",
            role="super_admin",
            is_active=True,
            is_superuser=True,
        )
        db_session.add(user)
        db_session.commit()
    return user


@pytest.fixture
def editor_user_1(db_session):
    user = db_session.query(User).filter(User.email == "editor1@lotuscapital.in").first()
    if not user:
        user = User(
            full_name="Staff One",
            email="editor1@lotuscapital.in",
            password_hash="testhash",
            role="editor",
            is_active=True,
            is_superuser=False,
        )
        db_session.add(user)
        db_session.commit()
    return user


@pytest.fixture
def editor_user_2(db_session):
    user = db_session.query(User).filter(User.email == "editor2@lotuscapital.in").first()
    if not user:
        user = User(
            full_name="Staff Two",
            email="editor2@lotuscapital.in",
            password_hash="testhash",
            role="editor",
            is_active=True,
            is_superuser=False,
        )
        db_session.add(user)
        db_session.commit()
    return user


def test_empty_database_returns_all_zeros_and_zero_filled_series(db_session, admin_user):
    analytics = DashboardAnalyticsService(db_session)
    metrics = analytics.get_dashboard_metrics(current_user=admin_user)

    assert metrics.total_enquiries == 0
    assert metrics.new_enquiries == 0
    assert metrics.in_progress_enquiries == 0
    assert metrics.resolved_enquiries == 0

    # Summary object
    summary = metrics.summary
    assert summary.total_leads == 0
    assert summary.new_enquiries_this_month == 0
    assert summary.new_enquiries_today == 0
    assert summary.follow_ups_due_today == 0
    assert summary.follow_ups_overdue == 0
    assert summary.converted_this_month == 0
    assert summary.awaiting_review == 0
    assert summary.change_pct.get("new_enquiries") is None
    assert summary.change_pct.get("converted") is None

    # By Status (all 6 zero-filled)
    assert set(metrics.by_status.keys()) == {"new", "contacted", "qualified", "in_progress", "resolved", "closed"}
    for status_val, count in metrics.by_status.items():
        assert count == 0

    # By Service (all 6 canonical services zero-filled)
    expected_slugs = {
        "mutual-funds",
        "general-insurance",
        "life-insurance",
        "health-insurance",
        "equity",
        "other-solutions",
    }
    assert {s.service_slug for s in metrics.by_service} == expected_slugs
    for s in metrics.by_service:
        assert s.count == 0
        assert s.converted_count == 0
        assert s.conversion_rate is None

    # By Month (non-empty zero-filled series)
    assert len(metrics.by_month) > 0
    for m in metrics.by_month:
        assert m.enquiries == 0
        assert m.conversions == 0

    # By Source (zero-filled)
    expected_sources = {"website", "phone_inbound", "branch_walkin", "whatsapp_inbound", "referral", "other"}
    assert {src.source for src in metrics.by_source} == expected_sources
    for src in metrics.by_source:
        assert src.count == 0

    # Lists
    assert metrics.latest_enquiries == []
    assert metrics.follow_ups_due == []


def test_inserted_leads_change_exact_counts_and_conversions(db_session, admin_user):
    analytics = DashboardAnalyticsService(db_session)

    # 1. Insert 3 leads:
    # Lead 1: Mutual Funds, status=new, unassigned
    # Lead 2: Mutual Funds, status=resolved (converted)
    # Lead 3: Health Insurance, status=contacted
    l1 = Enquiry(
        reference_id="LC-ENQ-001",
        name="Aarav Shah",
        mobile="9825011111",
        status="new",
        source="website",
        assigned_to=None,
    )
    db_session.add(l1)
    db_session.flush()
    db_session.add(EnquiryServiceModel(enquiry_id=l1.id, service_slug="mutual-funds"))

    l2 = Enquiry(
        reference_id="LC-ENQ-002",
        name="Bhavik Mehta",
        mobile="9825022222",
        status="resolved",
        source="phone_inbound",
        assigned_to=admin_user.id,
    )
    db_session.add(l2)
    db_session.flush()
    db_session.add(EnquiryServiceModel(enquiry_id=l2.id, service_slug="mutual-funds"))

    l3 = Enquiry(
        reference_id="LC-ENQ-003",
        name="Chetan Patel",
        mobile="9825033333",
        status="contacted",
        source="branch_walkin",
        assigned_to=admin_user.id,
    )
    db_session.add(l3)
    db_session.flush()
    db_session.add(EnquiryServiceModel(enquiry_id=l3.id, service_slug="health-insurance"))

    db_session.commit()
    invalidate_dashboard_cache()

    metrics = analytics.get_dashboard_metrics(current_user=admin_user)

    assert metrics.total_enquiries == 3
    assert metrics.summary.total_leads == 3
    assert metrics.summary.new_enquiries_this_month == 3
    assert metrics.summary.new_enquiries_today == 3
    assert metrics.summary.converted_this_month == 1
    assert metrics.summary.awaiting_review == 1  # l1 is new & unassigned

    # Status counts
    assert metrics.by_status["new"] == 1
    assert metrics.by_status["resolved"] == 1
    assert metrics.by_status["contacted"] == 1
    assert metrics.by_status["closed"] == 0

    # Service conversion rate
    mf_stat = next(s for s in metrics.by_service if s.service_slug == "mutual-funds")
    assert mf_stat.count == 2
    assert mf_stat.converted_count == 1
    assert mf_stat.conversion_rate == 50.0  # 1 / 2 * 100

    hi_stat = next(s for s in metrics.by_service if s.service_slug == "health-insurance")
    assert hi_stat.count == 1
    assert hi_stat.converted_count == 0
    assert hi_stat.conversion_rate == 0.0

    eq_stat = next(s for s in metrics.by_service if s.service_slug == "equity")
    assert eq_stat.count == 0
    assert eq_stat.conversion_rate is None


def test_soft_deleted_leads_excluded(db_session, admin_user):
    analytics = DashboardAnalyticsService(db_session)

    # Insert active lead
    l1 = Enquiry(
        reference_id="LC-ENQ-ACTIVE",
        name="Active Client",
        mobile="9825044444",
        status="new",
    )
    db_session.add(l1)

    # Insert soft-deleted lead
    l2 = Enquiry(
        reference_id="LC-ENQ-DELETED",
        name="Deleted Client",
        mobile="9825055555",
        status="new",
        deleted_at=datetime.now(timezone.utc),
        delete_reason="duplicate",
    )
    db_session.add(l2)
    db_session.commit()
    invalidate_dashboard_cache()

    metrics = analytics.get_dashboard_metrics(current_user=admin_user)
    assert metrics.total_enquiries == 1
    assert metrics.summary.total_leads == 1
    assert len(metrics.latest_enquiries) == 1
    assert metrics.latest_enquiries[0].reference_id == "LC-ENQ-ACTIVE"


def test_ist_day_boundaries(db_session, admin_user):
    analytics = DashboardAnalyticsService(db_session)

    # Create a lead at 23:30 IST today
    now_i = now_ist()
    dt_today_2330_ist = datetime(now_i.year, now_i.month, now_i.day, 23, 30, 0, tzinfo=IST)
    dt_today_utc = dt_today_2330_ist.astimezone(timezone.utc)

    # Create another lead at 00:15 IST yesterday
    dt_yesterday_ist = dt_today_2330_ist - timedelta(days=1)
    dt_yesterday_utc = dt_yesterday_ist.astimezone(timezone.utc)

    l_today = Enquiry(
        reference_id="LC-ENQ-TODAY",
        name="Late Night Client",
        mobile="9825066666",
        status="new",
        created_at=dt_today_utc,
    )
    db_session.add(l_today)

    l_yesterday = Enquiry(
        reference_id="LC-ENQ-YEST",
        name="Yesterday Client",
        mobile="9825077777",
        status="new",
        created_at=dt_yesterday_utc,
    )
    db_session.add(l_yesterday)
    db_session.commit()
    invalidate_dashboard_cache()

    metrics = analytics.get_dashboard_metrics(current_user=admin_user)

    # Only 1 lead belongs to today IST
    assert metrics.summary.new_enquiries_today == 1
    # Both belong to this month
    assert metrics.summary.new_enquiries_this_month == 2


def test_staff_role_scoping(db_session, admin_user, editor_user_1, editor_user_2):
    analytics = DashboardAnalyticsService(db_session)

    # Lead 1: assigned to editor 1
    l1 = Enquiry(
        reference_id="LC-ENQ-ED1",
        name="Staff 1 Client",
        mobile="9825088881",
        status="in_progress",
        assigned_to=editor_user_1.id,
    )
    # Lead 2: assigned to editor 2
    l2 = Enquiry(
        reference_id="LC-ENQ-ED2",
        name="Staff 2 Client",
        mobile="9825088882",
        status="in_progress",
        assigned_to=editor_user_2.id,
    )
    # Lead 3: unassigned
    l3 = Enquiry(
        reference_id="LC-ENQ-UNASSIGNED",
        name="Unassigned Pool",
        mobile="9825088883",
        status="new",
        assigned_to=None,
    )
    db_session.add_all([l1, l2, l3])
    db_session.commit()
    invalidate_dashboard_cache()

    # Admin sees all 3
    admin_metrics = analytics.get_dashboard_metrics(current_user=admin_user)
    assert admin_metrics.total_enquiries == 3

    # Editor 1 sees assigned (1) + unassigned (1) = 2 (cannot see editor 2's lead)
    ed1_metrics = analytics.get_dashboard_metrics(current_user=editor_user_1)
    assert ed1_metrics.total_enquiries == 2
    ed1_refs = {e.reference_id for e in ed1_metrics.latest_enquiries}
    assert ed1_refs == {"LC-ENQ-ED1", "LC-ENQ-UNASSIGNED"}
    assert "LC-ENQ-ED2" not in ed1_refs


def test_property_never_returns_constants(db_session, admin_user):
    analytics = DashboardAnalyticsService(db_session)

    # Run on empty DB
    res1 = analytics.get_dashboard_metrics(current_user=admin_user)

    # Insert 1 lead
    l = Enquiry(reference_id="LC-ENQ-DYNAMIC", name="Dynamic Test", mobile="9825099991", status="new")
    db_session.add(l)
    db_session.commit()
    invalidate_dashboard_cache()

    # Run on populated DB
    res2 = analytics.get_dashboard_metrics(current_user=admin_user)

    # Assert response dynamically changes
    assert res1.total_enquiries != res2.total_enquiries
    assert res1.summary.total_leads != res2.summary.total_leads
    assert res1.summary.new_enquiries_today != res2.summary.new_enquiries_today


def test_followups_scheduling_and_marking_done(db_session, admin_user):
    analytics = DashboardAnalyticsService(db_session)

    # 1. Initially 0 follow-ups
    cnt0 = analytics.get_followups_count(current_user=admin_user)
    assert cnt0.count == 0
    assert cnt0.due_today == 0

    # 2. Add enquiry and schedule follow-up for today
    lead = Enquiry(reference_id="LC-ENQ-FU", name="Followup Lead", mobile="9825099992", status="in_progress")
    db_session.add(lead)
    db_session.flush()

    now_i = now_ist()
    fu = FollowUp(
        enquiry_id=lead.id,
        due_at=now_utc(),
        topic="Mutual Fund Review",
        assignee_id=admin_user.id,
    )
    db_session.add(fu)
    db_session.commit()
    invalidate_dashboard_cache()

    # 3. Follow-up count should now be 1
    cnt1 = analytics.get_followups_count(current_user=admin_user)
    assert cnt1.count == 1
    assert cnt1.due_today == 1

    dash1 = analytics.get_dashboard_metrics(current_user=admin_user)
    assert dash1.summary.follow_ups_due_today == 1
    assert len(dash1.follow_ups_due) == 1
    assert dash1.follow_ups_due[0].reference_id == "LC-ENQ-FU"

    # 4. Mark follow-up done
    fu.done_at = now_utc()
    db_session.commit()
    invalidate_dashboard_cache()

    # 5. Follow-up count drops back to 0
    cnt2 = analytics.get_followups_count(current_user=admin_user)
    assert cnt2.count == 0
    assert cnt2.due_today == 0

    dash2 = analytics.get_dashboard_metrics(current_user=admin_user)
    assert dash2.summary.follow_ups_due_today == 0
    assert len(dash2.follow_ups_due) == 0

