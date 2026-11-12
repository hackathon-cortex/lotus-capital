import json
import secrets
import string
import time
from collections import defaultdict
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from app.models.enquiry import Enquiry
from app.models.user import User
from app.models.followup import FollowUp
from app.repositories.enquiry_repository import EnquiryRepository
from app.schemas.enquiry import (
    EnquiryCreate,
    AdminEnquiryCreate,
    EnquiryUpdate,
    EnquiryRead,
    EnquirySubmitResponse,
)
from app.core.exceptions import BadRequestException, NotFoundException, ForbiddenException, RateLimitException
from app.core.config import settings
from app.services.email_service import email_service
from app.services.audit_service import AuditService
from app.services.dashboard_analytics_service import invalidate_dashboard_cache

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
            "travel",
            "travel-insurance",
            "rohini",
            "rohini-cashless-empanelment",
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
        # Honeypot spam defense: if honeypot field is filled, silently discard spam
        if getattr(payload, "honeypot", None):
            return EnquirySubmitResponse(
                reference_id=self.generate_reference_id(),
                status="received",
            )

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

        # Build service slugs
        service_slugs = list(payload.service_detail or [])
        if payload.service and payload.service not in service_slugs:
            service_slugs.insert(0, payload.service)

        # Validate service slugs
        valid_slugs = self.get_valid_service_slugs()
        for slug in service_slugs:
            if slug not in valid_slugs:
                raise BadRequestException(f"Invalid service selection: '{slug}'.")

        # Check spam/duplicate submission within recent minutes
        if self.repo.check_duplicate(payload.mobile, within_minutes=3):
            raise BadRequestException("An enquiry with this mobile number was recently submitted. Please wait a few minutes.")

        if ip_address:
            record_enquiry_attempt(ip_address)

        # Generate unique reference ID
        reference_id = self.generate_reference_id()
        while self.repo.get_by_reference_id(reference_id, include_deleted=True) is not None:
            reference_id = self.generate_reference_id()

        enquiry = Enquiry(
            reference_id=reference_id,
            name=payload.name or payload.full_name or "Valued Client",
            mobile=payload.mobile,
            email=payload.email,
            organisation_name=payload.organisation_name,
            city=payload.city,
            existing_rohini_id=payload.existing_rohini_id,
            contact_method=payload.contact_method or "phone",
            message=payload.message,
            consent=payload.consent,
            status="new",
            created_via="public_form",
            is_demo=False,
        )

        created = self.repo.create(enquiry, service_slugs)

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

        invalidate_dashboard_cache()

        return EnquirySubmitResponse(
            reference_id=reference_id,
            status="new",
        )

    def create_admin_enquiry(
        self,
        payload: AdminEnquiryCreate,
        current_user: User,
        ip_address: Optional[str] = None,
    ) -> EnquiryRead:
        # Check duplicate mobile if not allowed explicitly
        existing = self.repo.get_by_mobile(payload.mobile, include_deleted=False)
        if existing and not payload.allow_duplicate:
            raise BadRequestException(
                f"An active lead with mobile {payload.mobile} already exists ({existing.reference_id} - {existing.name}). Set allow_duplicate=true to create anyway."
            )

        # Build service slugs
        service_slugs = list(payload.service_detail or [])
        if payload.service and payload.service not in service_slugs:
            service_slugs.insert(0, payload.service)

        reference_id = self.generate_reference_id()
        while self.repo.get_by_reference_id(reference_id, include_deleted=True) is not None:
            reference_id = self.generate_reference_id()

        enquiry = Enquiry(
            reference_id=reference_id,
            name=payload.name or payload.full_name or "Valued Client",
            mobile=payload.mobile,
            email=payload.email,
            organisation_name=payload.organisation_name,
            city=payload.city,
            existing_rohini_id=payload.existing_rohini_id,
            contact_method=payload.contact_method or "phone",
            message=payload.message,
            consent=payload.consent,
            status=payload.status or "new",
            assigned_to=payload.assigned_to or current_user.id,
            admin_notes=f"First follow-up scheduled: {payload.first_followup_at.isoformat()}" if payload.first_followup_at else None,
            created_via="admin_manual",
            source=payload.source or "phone_inbound",
            is_demo=False,
        )

        created = self.repo.create(enquiry, service_slugs)

        # Create scheduled follow-up record if requested
        if payload.first_followup_at:
            fu = FollowUp(
                enquiry_id=created.id,
                due_at=payload.first_followup_at,
                assignee_id=created.assigned_to,
                topic=service_slugs[0] if service_slugs else "Initial Consultation",
                notes="Created during staff intake.",
            )
            self.db.add(fu)
            self.db.commit()

        invalidate_dashboard_cache()

        AuditService.log_action(
            db=self.db,
            action="ADMIN_ENQUIRY_CREATED",
            entity_type="enquiry",
            entity_id=reference_id,
            user_id=current_user.id,
            metadata={
                "source": enquiry.source,
                "created_via": enquiry.created_via,
                "assigned_to": enquiry.assigned_to,
                "status": enquiry.status,
            },
            ip_address=ip_address,
        )

        return EnquiryRead.model_validate(created)

    def check_duplicate_mobile(self, mobile: str) -> Optional[EnquiryRead]:
        existing = self.repo.get_by_mobile(mobile, include_deleted=False)
        if existing:
            return EnquiryRead.model_validate(existing)
        return None

    def get_by_reference_id(self, reference_id: str, include_deleted: bool = False) -> EnquiryRead:
        enquiry = self.repo.get_by_reference_id(reference_id, include_deleted=include_deleted)
        if not enquiry:
            raise NotFoundException("Enquiry not found.")
        return EnquiryRead.model_validate(enquiry)

    def get_by_id(self, enquiry_id: int, include_deleted: bool = False) -> EnquiryRead:
        enquiry = self.repo.get_by_id(enquiry_id, include_deleted=include_deleted)
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
        enquiry = self.repo.get_by_id(enquiry_id, include_deleted=False)
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
        invalidate_dashboard_cache()

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

    def soft_delete_enquiry(
        self,
        enquiry_id: int,
        current_user: User,
        reason: Optional[str] = None,
        ip_address: Optional[str] = None,
    ) -> EnquiryRead:
        enquiry = self.repo.get_by_id(enquiry_id, include_deleted=False)
        if not enquiry:
            raise NotFoundException(f"Enquiry with ID {enquiry_id} not found.")

        # Permission check: Editors can only delete leads assigned to them
        if current_user.role == "editor":
            if enquiry.assigned_to != current_user.id:
                raise ForbiddenException("Staff editors can only delete leads assigned to them.")

        deleted = self.repo.soft_delete(enquiry_id=enquiry_id, user_id=current_user.id, reason=reason)
        if not deleted:
            raise NotFoundException(f"Enquiry with ID {enquiry_id} not found.")

        invalidate_dashboard_cache()

        AuditService.log_action(
            db=self.db,
            action="ENQUIRY_SOFT_DELETED",
            entity_type="enquiry",
            entity_id=enquiry.reference_id,
            user_id=current_user.id,
            metadata={"reason": reason or "other", "lead_id": enquiry_id},
            ip_address=ip_address,
        )

        return EnquiryRead.model_validate(deleted)

    def restore_enquiry(
        self,
        enquiry_id: int,
        current_user: User,
        ip_address: Optional[str] = None,
    ) -> EnquiryRead:
        # Restore requires admin role
        if current_user.role not in ("admin", "super_admin"):
            raise ForbiddenException("Only administrators can restore deleted enquiries.")

        restored = self.repo.restore(enquiry_id)
        if not restored:
            raise NotFoundException(f"Enquiry with ID {enquiry_id} not found in trash.")

        invalidate_dashboard_cache()

        AuditService.log_action(
            db=self.db,
            action="ENQUIRY_RESTORED",
            entity_type="enquiry",
            entity_id=restored.reference_id,
            user_id=current_user.id,
            metadata={"lead_id": enquiry_id},
            ip_address=ip_address,
        )

        return EnquiryRead.model_validate(restored)

    def permanent_delete_enquiry(
        self,
        enquiry_id: int,
        current_user: User,
        confirm: bool = False,
        ip_address: Optional[str] = None,
    ) -> bool:
        # Requires admin role
        if current_user.role not in ("admin", "super_admin"):
            raise ForbiddenException("Only administrators can permanently delete enquiries.")

        if not confirm:
            raise BadRequestException("Permanent deletion requires confirm=true.")

        enquiry = self.repo.get_by_id(enquiry_id, include_deleted=True)
        if not enquiry:
            raise NotFoundException(f"Enquiry with ID {enquiry_id} not found.")

        # Mask reference id for compliance audit (NEVER log PII)
        ref = enquiry.reference_id
        masked_ref = f"{ref[:3]}***{ref[-4:]}" if len(ref) >= 7 else "LC-***"

        self.repo.permanent_delete(enquiry_id)
        invalidate_dashboard_cache()

        # Anonymize past audit logs referencing this deleted lead per DPDP Act data erasure
        AuditService.anonymize_entity(self.db, "enquiry", ref)

        AuditService.log_action(
            db=self.db,
            action="ENQUIRY_PERMANENTLY_DELETED",
            entity_type="enquiry",
            entity_id=masked_ref,
            user_id=current_user.id,
            metadata={"masked_reference": masked_ref, "action": "purged_from_database"},
            ip_address=ip_address,
        )

        return True

    def list_admin_enquiries(
        self,
        page: int = 1,
        page_size: int = 20,
        search: Optional[str] = None,
        status: Optional[str] = None,
        service_slug: Optional[str] = None,
        is_deleted: Optional[bool] = False,
    ) -> Tuple[List[EnquiryRead], int]:
        skip = (page - 1) * page_size
        items, total = self.repo.list_enquiries(
            skip=skip,
            limit=page_size,
            search=search,
            status=status,
            service_slug=service_slug,
            is_deleted=is_deleted,
        )
        return [EnquiryRead.model_validate(item) for item in items], total
