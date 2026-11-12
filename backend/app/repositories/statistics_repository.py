from typing import Optional, List
from sqlalchemy import select, and_
from sqlalchemy.orm import Session
from app.models.statistic import Statistic


class StatisticsRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_public_statistics(self) -> List[Statistic]:
        """
        Public compliant statistics retrieval:
        Tier A ONLY, approval_status == 'approved', and as_of_date is not null.
        Tier B and Tier C are strictly prohibited from this query.
        """
        query = select(Statistic).where(
            and_(
                Statistic.tier == "Tier A",
                Statistic.approval_status == "approved",
                Statistic.as_of_date.is_not(None),
            )
        ).order_by(Statistic.id.asc())
        return list(self.db.execute(query).scalars().all())

    def get_by_id(self, stat_id: int) -> Optional[Statistic]:
        return self.db.get(Statistic, stat_id)

    def get_by_key(self, key: str) -> Optional[Statistic]:
        query = select(Statistic).where(Statistic.statistic_key == key)
        return self.db.execute(query).scalar_one_or_none()

    def list_admin_statistics(self, include_tier_c: bool = False) -> List[Statistic]:
        query = select(Statistic)
        if not include_tier_c:
            query = query.where(Statistic.tier != "Tier C")
        return list(self.db.execute(query.order_by(Statistic.id.asc())).scalars().all())

    def create(self, stat: Statistic) -> Statistic:
        self.db.add(stat)
        self.db.commit()
        self.db.refresh(stat)
        return stat

    def update(self, stat: Statistic) -> Statistic:
        self.db.commit()
        self.db.refresh(stat)
        return stat

