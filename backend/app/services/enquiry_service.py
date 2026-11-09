import json
import secrets
import string
import time
from collections import defaultdict
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from app.models.enquiry import Enquiry
from app.repositories.enquiry_repository import EnquiryRepository
from app.schemas.enquiry import EnquiryCreate, EnquiryUpdate, EnquiryRead, EnquirySubmitResponse
from app.core.exceptions import BadRequestException, NotFoundException, RateLimitException
from app.core.config import settings
from app.services.email_service import email_service
from app.services.audit_service import AuditService

_enquiry_ip_attempts: defaultdict = defaultdict(list)
MAX_ENQUIRY_PER_IP = 5
ENQUIRY_WINDOW_SECONDS = 600  # 10 minutes


def is_enquiry_rate_limited(ip: str) -> bool:
    now = time.time()
    valid_attempts = [t for t in _enquiry_ip_attempts[ip] if now - t < ENQUIRY_WINDOW_SECONDS]
    _enquiry_ip_attempts[ip] = valid_attempts
    return len(valid_attempts) >= MAX_ENQUIRY_PER_IP


def record_enquiry_attempt(ip: str) -> None:
    _enquiry_ip_attempts[ip].append(time.time())


class EnquiryService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = EnquiryRepository(db)

    @staticmethod
    def generate_reference_id() -> str:
        # Generate LC-XXXXXXXX (8 random uppercase alphanumeric chars)
        random_suffix = "".join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))
        return f"LC-{random_suffix}"

    def get_valid_service_slugs(self) -> List[str]:
        valid = {
            "general-insurance",
            "life-insurance",
            "health-insurance",
            "mutual-funds",
            "equity",
            "other-solutions",
            "insights",
            "retirement-planning",
            "tax-planning",
            "wealth-management",
            "vehicle-insurance",
            "property-insurance",
            "fixed-deposits",
        }
        services_file = settings.CONTENT_DATA_DIR / "services.json"
        if services_file.exists():
            try:
                with open(services_file, "r", encoding="utf-8") as f:
                    services_data = json.load(f)
                    for s in services_data:
                        if s.get("slug"):
                            valid.add(s["slug"])
            except Exception:
                pass
        return list(valid)

    def create_enquiry(self, payload: EnquiryCreate, ip_address: Optional[str] = None) -> EnquirySubmitResponse:
        # Check rate limiting per IP
        if ip_address and is_enquiry_rate_limited(ip_address):
            AuditService.log_action(
                db=self.db,
                action="ENQUIRY_RATE_LIMITED",
                entity_type="enquiry",
                metadata={"reason": "IP enquiry submission limit reached"},
                ip_address=ip_address,
            )
            raise RateLimitException("Too many enquiries submitted from your network. Please wait a few minutes.")

        # Validate service slugs
        valid_slugs = self.get_valid_service_slugs()
        for slug in payload.service_detail:
            if slug not in valid_slugs:
                raise BadRequestException(f"Invalid service selection: '{slug}'.")

        # Check spam/duplicate submission within recent minutes
        if self.repo.check_duplicate(payload.mobile, within_minutes=3):
            raise BadRequestException("An enquiry with this mobile number was recently submitted. Please wait a few minutes.")

        if ip_address:
            record_enquiry_attempt(ip_address)

        # Generate unique reference ID
        reference_id = self.generate_reference_id()
        while self.repo.get_by_reference_id(reference_id) is not None:
            reference_id = self.generate_reference_id()

        enquiry = Enquiry(
            reference_id=reference_id,
            name=payload.name,
            mobile=payload.mobile,
            email=payload.email,
            contact_method=payload.contact_method,
            message=payload.message,
            consent=payload.consent,
            status="new",
        )

        created = self.repo.create(enquiry, payload.service_detail)

        # Audit log
        AuditService.log_action(
            db=self.db,
            action="ENQUIRY_SUBMITTED",
            entity_type="enquiry",
            entity_id=reference_id,
            metadata={"services": payload.service_detail, "contact_method": payload.contact_method},
            ip_address=ip_address,
        )

        # Non-blocking email notifications
        email_service.send_enquiry_notification(
            reference_id=reference_id,
            name=payload.name,
            mobile=payload.mobile,
            services=payload.service_detail,
            contact_method=payload.contact_method,
            message=payload.message,
        )
        if payload.email:
            email_service.send_customer_acknowledgement(
                to_email=payload.email,
                customer_name=payload.name,
                reference_id=reference_id,
            )

        return EnquirySubmitResponse(
            reference_id=reference_id,
            status="new",
        )

    def get_by_reference_id(self, reference_id: str) -> EnquiryRead:
        enquiry = self.repo.get_by_reference_id(reference_id)
        if not enquiry:
            raise NotFoundException("Enquiry not found.")
        return EnquiryRead.model_validate(enquiry)

    def get_by_id(self, enquiry_id: int) -> EnquiryRead:
        enquiry = self.repo.get_by_id(enquiry_id)
        if not enquiry:
            raise NotFoundException(f"Enquiry with ID {enquiry_id} not found.")
        return EnquiryRead.model_validate(enquiry)

    def update_enquiry(
        self,
        enquiry_id: int,
        payload: EnquiryUpdate,
        admin_user_id: int,
        ip_address: Optional[str] = None,
    ) -> EnquiryRead:
        enquiry = self.repo.get_by_id(enquiry_id)
        if not enquiry:
            raise NotFoundException(f"Enquiry with ID {enquiry_id} not found.")

        old_status = enquiry.status
        if payload.status is not None:
            enquiry.status = payload.status
        if payload.assigned_to is not None:
            enquiry.assigned_to = payload.assigned_to
        if payload.admin_notes is not None:
            enquiry.admin_notes = payload.admin_notes

        updated = self.repo.update(enquiry)

        AuditService.log_action(
            db=self.db,
            action="ENQUIRY_UPDATED",
            entity_type="enquiry",
            entity_id=str(enquiry_id),
            user_id=admin_user_id,
            metadata={
                "old_status": old_status,
                "new_status": updated.status,
                "assigned_to": updated.assigned_to,
            },
            ip_address=ip_address,
        )

        return EnquiryRead.model_validate(updated)

    def list_admin_enquiries(
        self,
        page: int = 1,
        page_size: int = 20,
        search: Optional[str] = None,
        status: Optional[str] = None,
        service_slug: Optional[str] = None,
    ) -> Tuple[List[EnquiryRead], int]:
        skip = (page - 1) * page_size
        items, total = self.repo.list_enquiries(
            skip=skip,
            limit=page_size,
            search=search,
            status=status,
            service_slug=service_slug,
        )
        return [EnquiryRead.model_validate(item) for item in items], total

