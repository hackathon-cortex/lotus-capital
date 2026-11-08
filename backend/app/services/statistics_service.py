import json
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.statistic import Statistic
from app.repositories.statistics_repository import StatisticsRepository
from app.schemas.statistics import (
    StatisticPublicRead,
    StatisticAdminRead,
    StatisticCreate,
    StatisticUpdate,
)
from app.core.exceptions import NotFoundException, ForbiddenException, BadRequestException
from app.core.config import settings
from app.services.audit_service import AuditService


class StatisticsService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = StatisticsRepository(db)

    def sync_from_json_if_empty(self):
        """Seed statistics from authoritative content/data/statistics.json if table is empty."""
        existing = self.repo.list_admin_statistics(include_tier_c=True)
        if existing:
            return

        json_file = settings.CONTENT_DATA_DIR / "statistics.json"
        if not json_file.exists():
            return

        try:
            with open(json_file, "r", encoding="utf-8") as f:
                items = json.load(f)
                for item in items:
                    stat = Statistic(
                        statistic_key=item["statistic_key"],
                        label=item.get("label", item["statistic_key"]),
                        value=item["value"],
                        tier=item.get("tier", "Tier A"),
                        approval_status=item.get("approval_status", "pending"),
                        definition=item.get("definition"),
                        as_of_date=datetime.strptime(item["as_of_date"], "%Y-%m-%d").date() if item.get("as_of_date") else None,
                    )
                    self.db.add(stat)
                self.db.commit()
        except Exception:
            self.db.rollback()

    def get_public_statistics(self) -> List[StatisticPublicRead]:
        """
        Compliant public statistics endpoint.
        Returns ONLY Tier A approved statistics with a valid as_of_date.
        Tier B and Tier C are strictly filtered out.
        """
        self.sync_from_json_if_empty()
        stats = self.repo.get_public_statistics()
        return [StatisticPublicRead.model_validate(s) for s in stats]

    def list_admin_statistics(self, user_role: str) -> List[StatisticAdminRead]:
        self.sync_from_json_if_empty()
        # Tier C metrics are visible only to super_admin
        include_tier_c = (user_role == "super_admin")
        stats = self.repo.list_admin_statistics(include_tier_c=include_tier_c)
        return [StatisticAdminRead.model_validate(s) for s in stats]

    def update_statistic(
        self,
        stat_id: int,
        payload: StatisticUpdate,
        user_role: str,
        user_id: int,
        ip_address: Optional[str] = None,
    ) -> StatisticAdminRead:
        stat = self.repo.get_by_id(stat_id)
        if not stat:
            raise NotFoundException(f"Statistic with ID {stat_id} not found.")

        # Compliance rule: Tier C can never be approved for public release
        if stat.tier == "Tier C" and payload.approval_status == "approved":
            raise BadRequestException("Compliance Restriction: Tier C claims (e.g. Equity CAGR) must remain withheld and cannot be published.")

        # Approval status change requires admin or super_admin
        if payload.approval_status is not None and payload.approval_status != stat.approval_status:
            if user_role not in ["admin", "super_admin"]:
                raise ForbiddenException("Only an admin or super_admin can approve statistics.")
            stat.approval_status = payload.approval_status
            if payload.approval_status == "approved":
                stat.approved_by = user_id
                stat.approved_at = datetime.now(timezone.utc)

        if payload.label is not None:
            stat.label = payload.label
        if payload.value is not None:
            stat.value = payload.value
        if payload.tier is not None:
            if payload.tier == "Tier C" and user_role != "super_admin":
                raise ForbiddenException("Only super_admin can manage Tier C metrics.")
            stat.tier = payload.tier
        if payload.definition is not None:
            stat.definition = payload.definition
        if payload.as_of_date is not None:
            stat.as_of_date = payload.as_of_date

        updated = self.repo.update(stat)

        AuditService.log_action(
            db=self.db,
            action="STATISTIC_UPDATED",
            entity_type="statistic",
            entity_id=stat.statistic_key,
            user_id=user_id,
            metadata={"status": updated.approval_status, "tier": updated.tier},
            ip_address=ip_address,
        )

        return StatisticAdminRead.model_validate(updated)

