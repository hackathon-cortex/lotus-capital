from typing import Optional, List, Tuple
from datetime import datetime, timedelta, timezone
from sqlalchemy import select, func, or_, and_
from sqlalchemy.orm import Session, joinedload
from app.models.enquiry import Enquiry
from app.models.enquiry_service import EnquiryService


class EnquiryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, enquiry_id: int) -> Optional[Enquiry]:
        query = (
            select(Enquiry)
            .options(joinedload(Enquiry.services))
            .where(Enquiry.id == enquiry_id)
        )
        return self.db.execute(query).unique().scalar_one_or_none()

    def get_by_reference_id(self, reference_id: str) -> Optional[Enquiry]:
        query = (
            select(Enquiry)
            .options(joinedload(Enquiry.services))
            .where(Enquiry.reference_id == reference_id)
        )
        return self.db.execute(query).unique().scalar_one_or_none()

    def check_duplicate(self, mobile: str, within_minutes: int = 5) -> bool:
        """Check if an enquiry from this mobile exists within recent minutes to prevent duplicate/spam."""
        since = datetime.now(timezone.utc) - timedelta(minutes=within_minutes)
        query = select(Enquiry.id).where(
            and_(
                Enquiry.mobile == mobile,
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
        return self.get_by_id(enquiry.id)

    def list_enquiries(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        status: Optional[str] = None,
        service_slug: Optional[str] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
    ) -> Tuple[List[Enquiry], int]:
        query = select(Enquiry).options(joinedload(Enquiry.services))
        count_query = select(func.count(func.distinct(Enquiry.id)))

        conditions = []
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
                query.order_by(Enquiry.created_at.desc()).offset(skip).limit(limit)
            ).unique().scalars().all()
        )
        return items, total

    def update(self, enquiry: Enquiry) -> Enquiry:
        self.db.commit()
        self.db.refresh(enquiry)
        return self.get_by_id(enquiry.id)

    def count_by_status(self) -> dict:
        query = select(Enquiry.status, func.count(Enquiry.id)).group_by(Enquiry.status)
        results = self.db.execute(query).all()
        return {status: count for status, count in results}

    def count_by_services(self) -> List[Tuple[str, int]]:
        query = (
            select(EnquiryService.service_slug, func.count(EnquiryService.id))
            .group_by(EnquiryService.service_slug)
            .order_by(func.count(EnquiryService.id).desc())
        )
        return list(self.db.execute(query).all())

