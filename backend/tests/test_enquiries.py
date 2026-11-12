import pytest
from fastapi import BackgroundTasks
from pydantic import ValidationError
from backend.app.schemas.enquiry import EnquiryCreate
from backend.app.routers.public import create_enquiry
from backend.app.db.session import SessionLocal
from backend.app.db.models import Lead

def test_valid_enquiry_schema_and_creation():
    db = SessionLocal()
    bg_tasks = BackgroundTasks()
    payload = EnquiryCreate(
        full_name="Ramesh Patel",
        mobile="9825999001",
        email="ramesh.test@example.com",
        service="mutual-funds",
        service_detail=["SIP", "Tax Saving ELSS"],
        message="Interested in long-term SIP plans.",
        contact_method="phone",
        source_path="/investments/mutual-funds",
        consent=True,
        utm_source="google",
        utm_medium="cpc",
        utm_campaign="diwali2026",
    )
    res = create_enquiry(payload, background_tasks=bg_tasks, db=db)
    db.close()

    assert res.enquiry_id.startswith("LC-")
    assert "submitted" in res.message.lower()
    # Verify email notification was scheduled
    assert len(bg_tasks.tasks) == 1

def test_service_detail_optional_and_sanitized():
    enquiry = EnquiryCreate(
        full_name="Ananya Joshi",
        mobile="9825999002",
        service="general-insurance",
        service_detail=["  Vehicle ", "Property  "],
        source_path="/services/general-insurance",
        consent=True,
    )
    assert enquiry.service_detail == ["Vehicle", "Property"]

def test_invalid_mobile_fails_validation():
    with pytest.raises(ValidationError) as exc_info:
        EnquiryCreate(
            full_name="Ramesh Patel",
            mobile="12345",  # Invalid Indian mobile
            service="mutual-funds",
            source_path="/?contact=open",
            consent=True,
        )
    assert "mobile" in str(exc_info.value).lower()

def test_missing_consent_fails_validation():
    with pytest.raises(ValidationError) as exc_info:
        EnquiryCreate(
            full_name="Ramesh Patel",
            mobile="9825999003",
            service="life-insurance",
            source_path="/?contact=open",
            consent=False,  # Must be True
        )
    assert "consent" in str(exc_info.value).lower()

def test_invalid_service_slug_fails_validation():
    with pytest.raises(ValidationError) as exc_info:
        EnquiryCreate(
            full_name="Ramesh Patel",
            mobile="9825999004",
            service="cryptocurrency-speculation",  # type: ignore
            source_path="/?contact=open",
            consent=True,
        )
    assert "service" in str(exc_info.value).lower()

def test_short_name_fails_validation():
    with pytest.raises(ValidationError) as exc_info:
        EnquiryCreate(
            full_name="R",  # Too short
            mobile="9825999005",
            service="health-insurance",
            source_path="/?contact=open",
            consent=True,
        )
    assert "full_name" in str(exc_info.value).lower()
