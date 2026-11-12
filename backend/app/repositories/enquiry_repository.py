from typing import Optional, List, Tuple
from datetime import datetime, timedelta, timezone
from sqlalchemy import select, func, or_, and_
from sqlalchemy.orm import Session, joinedload
from app.models.enquiry import Enquiry
from app.models.enquiry_service import EnquiryService


class EnquiryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, enquiry_id: int, include_deleted: bool = False) -> Optional[Enquiry]:
        query = (
            select(Enquiry)
            .options(joinedload(Enquiry.services))
            .where(Enquiry.id == enquiry_id)
        )
        if not include_deleted:
            query = query.where(Enquiry.deleted_at.is_(None))
        return self.db.execute(query).unique().scalar_one_or_none()

    def get_by_reference_id(self, reference_id: str, include_deleted: bool = False) -> Optional[Enquiry]:
        query = (
            select(Enquiry)
            .options(joinedload(Enquiry.services))
            .where(Enquiry.reference_id == reference_id)
        )
        if not include_deleted:
            query = query.where(Enquiry.deleted_at.is_(None))
        return self.db.execute(query).unique().scalar_one_or_none()

    def get_by_mobile(self, mobile: str, include_deleted: bool = False) -> Optional[Enquiry]:
        query = (
            select(Enquiry)
            .options(joinedload(Enquiry.services))
            .where(Enquiry.mobile == mobile)
        )
        if not include_deleted:
            query = query.where(Enquiry.deleted_at.is_(None))
        return self.db.execute(query.order_by(Enquiry.created_at.desc())).unique().scalars().first()

    def check_duplicate(self, mobile: str, within_minutes: int = 5) -> bool:
        """Check if an active enquiry from this mobile exists within recent minutes to prevent duplicate/spam."""
        since = datetime.now(timezone.utc) - timedelta(minutes=within_minutes)
        query = select(Enquiry.id).where(
            and_(
                Enquiry.mobile == mobile,
                Enquiry.deleted_at.is_(None),
                Enquiry.created_at >= since,
            )
        )
        return self.db.execute(query).first() is not None

    def create(self, enquiry: Enquiry, service_slugs: List[str]) -> Enquiry:
        self.db.add(enquiry)
        self.db.flush()  # generates enquiry.id

        for slug in service_slugs:
            service_item = EnquiryService(
                enquiry_id=enquiry.id,
                service_slug=slug.strip().lower(),
                service_detail=slug,
            )
            self.db.add(service_item)

        self.db.commit()
        self.db.refresh(enquiry)
        return self.get_by_id(enquiry.id, include_deleted=True)

    def list_enquiries(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        status: Optional[str] = None,
        service_slug: Optional[str] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
        is_deleted: Optional[bool] = False,
    ) -> Tuple[List[Enquiry], int]:
        query = select(Enquiry).options(joinedload(Enquiry.services))
        count_query = select(func.count(func.distinct(Enquiry.id)))

        conditions = []

        # Handle trash / soft-delete filtering
        if is_deleted is True or status == "trash":
            conditions.append(Enquiry.deleted_at.isnot(None))
        else:
            conditions.append(Enquiry.deleted_at.is_(None))
            if status:
                conditions.append(Enquiry.status == status)

        if search:
            search_pattern = f"%{search.strip()}%"
            conditions.append(
                or_(
                    Enquiry.name.ilike(search_pattern),
                    Enquiry.mobile.ilike(search_pattern),
                    Enquiry.reference_id.ilike(search_pattern),
                    Enquiry.email.ilike(search_pattern),
                )
            )

        if service_slug:
            query = query.join(Enquiry.services)
            count_query = count_query.join(Enquiry.services)
            conditions.append(EnquiryService.service_slug == service_slug.strip().lower())

        if date_from:
            conditions.append(Enquiry.created_at >= date_from)

        if date_to:
            conditions.append(Enquiry.created_at <= date_to)

        if conditions:
            query = query.where(and_(*conditions))
            count_query = count_query.where(and_(*conditions))

        total = self.db.execute(count_query).scalar() or 0
        items = list(
            self.db.execute(
                query.order_by(
                    Enquiry.deleted_at.desc() if (is_deleted or status == "trash") else Enquiry.created_at.desc()
                ).offset(skip).limit(limit)
            ).unique().scalars().all()
        )
        return items, total

    def update(self, enquiry: Enquiry) -> Enquiry:
        self.db.commit()
        self.db.refresh(enquiry)
        return self.get_by_id(enquiry.id, include_deleted=True)

    def soft_delete(self, enquiry_id: int, user_id: int, reason: Optional[str] = None) -> Optional[Enquiry]:
        enquiry = self.get_by_id(enquiry_id, include_deleted=False)
        if not enquiry:
            return None
        enquiry.deleted_at = datetime.now(timezone.utc)
        enquiry.deleted_by = user_id
        enquiry.delete_reason = reason
        self.db.commit()
        self.db.refresh(enquiry)
        return enquiry

    def restore(self, enquiry_id: int) -> Optional[Enquiry]:
        enquiry = self.get_by_id(enquiry_id, include_deleted=True)
        if not enquiry:
            return None
        enquiry.deleted_at = None
        enquiry.deleted_by = None
        enquiry.delete_reason = None
        self.db.commit()
        self.db.refresh(enquiry)
        return enquiry

    def permanent_delete(self, enquiry_id: int) -> bool:
        enquiry = self.get_by_id(enquiry_id, include_deleted=True)
        if not enquiry:
            return False
        self.db.delete(enquiry)
        self.db.commit()
        return True

    def count_by_status(self) -> dict:
        query = (
            select(Enquiry.status, func.count(Enquiry.id))
            .where(Enquiry.deleted_at.is_(None))
            .group_by(Enquiry.status)
        )
        results = self.db.execute(query).all()
        return {status: count for status, count in results}

    def count_by_services(self) -> List[Tuple[str, int]]:
        query = (
            select(EnquiryService.service_slug, func.count(EnquiryService.id))
            .join(Enquiry, Enquiry.id == EnquiryService.enquiry_id)
            .where(Enquiry.deleted_at.is_(None))
            .group_by(EnquiryService.service_slug)
            .order_by(func.count(EnquiryService.id).desc())
        )
        return list(self.db.execute(query).all())

    def count_trash(self) -> int:
        query = select(func.count(Enquiry.id)).where(Enquiry.deleted_at.isnot(None))
        return self.db.execute(query).scalar() or 0
