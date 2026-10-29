import pytest
from fastapi import BackgroundTasks
from pydantic import ValidationError
from backend.app.schemas.enquiry import EnquiryCreate
from backend.app.routers.public import create_enquiry
from backend.app.db.session import SessionLocal

def test_valid_enquiry_schema_and_creation():
    db = SessionLocal()
    bg_tasks = BackgroundTasks()
    payload = EnquiryCreate(
        full_name="Ramesh Patel",
        mobile="9825012345",
        email="ramesh@example.com",
        service="mutual-funds",
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

def test_invalid_mobile_fails_validation():
    with pytest.raises(ValidationError) as exc_info:
        EnquiryCreate(
            full_name="Ramesh Patel",
            mobile="12345",  # Invalid Indian mobile
            service="mutual-funds",
            source_path="/contact-us",
            consent=True,
        )
    assert "mobile" in str(exc_info.value).lower()

def test_missing_consent_fails_validation():
    with pytest.raises(ValidationError) as exc_info:
        EnquiryCreate(
            full_name="Ramesh Patel",
            mobile="9825012345",
            service="life-insurance",
            source_path="/contact-us",
            consent=False,  # Must be True
        )
    assert "consent" in str(exc_info.value).lower()

def test_invalid_service_slug_fails_validation():
    with pytest.raises(ValidationError) as exc_info:
        EnquiryCreate(
            full_name="Ramesh Patel",
            mobile="9825012345",
            service="cryptocurrency-speculation",  # type: ignore
            source_path="/contact-us",
            consent=True,
        )
    assert "service" in str(exc_info.value).lower()

def test_short_name_fails_validation():
    with pytest.raises(ValidationError) as exc_info:
        EnquiryCreate(
            full_name="R",  # Too short
            mobile="9825012345",
            service="health-insurance",
            source_path="/contact-us",
            consent=True,
        )
    assert "full_name" in str(exc_info.value).lower()

