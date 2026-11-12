import os
import pytest
from app.db.session import SessionLocal
from app.models.user import User
from app.models.enquiry import Enquiry
from app.models.enquiry_service import EnquiryService as EnquiryServiceModel
from app.models.audit_log import AuditLog
from app.schemas.enquiry import AdminEnquiryCreate, EnquiryCreate
from app.services.enquiry_service import EnquiryService
from app.core.exceptions import BadRequestException, ForbiddenException
from app.scripts.seed_demo import seed_demo_data
from app.scripts.purge_demo_data import purge_demo_data


@pytest.fixture
def db_session():
    db = SessionLocal()
    yield db
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
def editor_user(db_session):
    user = db_session.query(User).filter(User.email == "editor@lotuscapital.in").first()
    if not user:
        user = User(
            full_name="Editor Staff",
            email="editor@lotuscapital.in",
            password_hash="testhash",
            role="editor",
            is_active=True,
            is_superuser=False,
        )
        db_session.add(user)
        db_session.commit()
    return user


def test_database_starts_empty_of_enquiries(db_session):
    """Ensure database has 0 enquiries and at least 1 admin user."""
    # Count non-demo or all enquiries
    count = db_session.query(Enquiry).count()
    assert count == 0, f"Expected 0 enquiries in fresh DB, found {count}"


def test_manual_add_enquiry_by_admin(db_session, admin_user):
    """Manual enquiry created with created_via='admin_manual' and is_demo=False."""
    service = EnquiryService(db_session)
    payload = AdminEnquiryCreate(
        full_name="Bhavesh Joshi",
        mobile="9825123450",
        email="bhavesh@example.com",
        service="mutual-funds",
        service_detail=["mutual-funds", "sip"],
        message="Consultation requested for child education fund.",
        source="walk_in",
        contact_method="phone",
        consent=True,
    )
    created = service.create_admin_enquiry(payload, current_user=admin_user)

    assert created.id is not None
    assert created.reference_id.startswith("LC-")
    assert created.name == "Bhavesh Joshi"
    assert created.created_via == "admin_manual"
    assert created.is_demo is False
    assert created.source == "walk_in"

    # Cleanup
    service.repo.permanent_delete(created.id)


def test_duplicate_mobile_check(db_session, admin_user):
    """Duplicate mobile triggers error unless allow_duplicate=True."""
    service = EnquiryService(db_session)
    mobile = "9825888888"

    payload = AdminEnquiryCreate(
        full_name="First Client",
        mobile=mobile,
        service="mutual-funds",
        consent=True,
    )
    first = service.create_admin_enquiry(payload, current_user=admin_user)

    # Second attempt without allow_duplicate must raise BadRequestException
    dup_payload = AdminEnquiryCreate(
        full_name="Second Client",
        mobile=mobile,
        service="equity",
        consent=True,
        allow_duplicate=False,
    )
    with pytest.raises(BadRequestException) as exc_info:
        service.create_admin_enquiry(dup_payload, current_user=admin_user)
    assert "already exists" in str(exc_info.value).lower()

    # With allow_duplicate=True, must succeed
    dup_payload.allow_duplicate = True
    second = service.create_admin_enquiry(dup_payload, current_user=admin_user)
    assert second.id != first.id

    # Cleanup
    service.repo.permanent_delete(first.id)
    service.repo.permanent_delete(second.id)


def test_soft_delete_and_trash_and_restore(db_session, admin_user):
    """Soft delete moves lead to trash, excluded from active list, and can be restored."""
    service = EnquiryService(db_session)
    payload = AdminEnquiryCreate(
        full_name="Trash Test Client",
        mobile="9825777777",
        service="general-insurance",
        consent=True,
    )
    lead = service.create_admin_enquiry(payload, current_user=admin_user)

    # Active list should contain it
    active_items, total = service.list_admin_enquiries(is_deleted=False)
    assert any(item.id == lead.id for item in active_items)

    # Soft delete
    deleted = service.soft_delete_enquiry(lead.id, current_user=admin_user, reason="test_data")
    assert deleted.deleted_at is not None
    assert deleted.delete_reason == "test_data"
    assert deleted.deleted_by == admin_user.id

    # Active list must NOT contain it
    active_items, _ = service.list_admin_enquiries(is_deleted=False)
    assert not any(item.id == lead.id for item in active_items)

    # Trash list must contain it
    trash_items, _ = service.list_admin_enquiries(is_deleted=True)
    assert any(item.id == lead.id for item in trash_items)

    # Restore
    restored = service.restore_enquiry(lead.id, current_user=admin_user)
    assert restored.deleted_at is None

    # Active list has it again
    active_items, _ = service.list_admin_enquiries(is_deleted=False)
    assert any(item.id == lead.id for item in active_items)

    # Cleanup
    service.repo.permanent_delete(lead.id)


def test_permanent_delete_cascades_and_anonymizes_audit(db_session, admin_user):
    """Permanent delete removes DB row and cascades services with masked audit reference."""
    service = EnquiryService(db_session)
    payload = AdminEnquiryCreate(
        full_name="Permanent Delete Client",
        mobile="9825666666",
        service="health-insurance",
        service_detail=["health-insurance"],
        consent=True,
    )
    lead = service.create_admin_enquiry(payload, current_user=admin_user)
    ref = lead.reference_id

    # Requires confirm=True
    with pytest.raises(BadRequestException):
        service.permanent_delete_enquiry(lead.id, current_user=admin_user, confirm=False)

    # Execute with confirm=True
    service.permanent_delete_enquiry(lead.id, current_user=admin_user, confirm=True)

    # Row must be gone from DB
    assert db_session.query(Enquiry).filter(Enquiry.id == lead.id).first() is None
    # Services gone
    services_count = db_session.query(EnquiryServiceModel).filter(EnquiryServiceModel.enquiry_id == lead.id).count()
    assert services_count == 0

    # Audit log entry must have masked ref and NO customer PII (mobile or full name)
    audit = (
        db_session.query(AuditLog)
        .filter(AuditLog.action == "ENQUIRY_PERMANENTLY_DELETED")
        .order_by(AuditLog.created_at.desc())
        .first()
    )
    assert audit is not None
    assert "***" in audit.entity_id
    assert "9825666666" not in (audit.metadata_json or "")
    assert "Permanent Delete Client" not in (audit.metadata_json or "")


def test_editor_role_permissions(db_session, admin_user, editor_user):
    """Editor cannot delete another staff's assigned enquiry or permanently delete."""
    service = EnquiryService(db_session)

    # Create lead assigned to admin
    payload = AdminEnquiryCreate(
        full_name="Admin Assigned Lead",
        mobile="9825555555",
        service="mutual-funds",
        assigned_to=admin_user.id,
        consent=True,
    )
    lead = service.create_admin_enquiry(payload, current_user=admin_user)

    # Editor attempts to delete lead assigned to admin -> 403 Forbidden
    with pytest.raises(ForbiddenException):
        service.soft_delete_enquiry(lead.id, current_user=editor_user, reason="other")

    # Editor attempts permanent delete -> 403 Forbidden
    with pytest.raises(ForbiddenException):
        service.permanent_delete_enquiry(lead.id, current_user=editor_user, confirm=True)

    # Cleanup
    service.repo.permanent_delete(lead.id)


def test_seed_demo_and_purge_scripts(db_session):
    """Verify seed_demo creates is_demo=True and purge_demo deletes them."""
    # Seed 3 demo leads
    seed_demo_data(count=3, days=5)

    demo_leads = db_session.query(Enquiry).filter(Enquiry.is_demo.is_(True)).all()
    assert len(demo_leads) == 3
    for lead in demo_leads:
        assert lead.created_via == "demo_seed"

    # Dry-run purge does NOT delete
    purge_demo_data(dry_run=True, force=False)
    assert db_session.query(Enquiry).filter(Enquiry.is_demo.is_(True)).count() == 3

    # Confirmed purge deletes demo data
    purge_demo_data(dry_run=False, force=True)
    assert db_session.query(Enquiry).filter(Enquiry.is_demo.is_(True)).count() == 0


def test_seed_demo_refuses_in_production(monkeypatch):
    """Seed demo refuses in production with exit code 1."""
    monkeypatch.setenv("APP_ENV", "production")
    with pytest.raises(SystemExit) as exc_info:
        seed_demo_data(count=1)
    assert exc_info.value.code == 1

