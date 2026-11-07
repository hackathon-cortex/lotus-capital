from datetime import datetime, date, timezone
from typing import Optional
from sqlalchemy import String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Statistic(Base):
    __tablename__ = "statistics"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    statistic_key: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    label: Mapped[str] = mapped_column(String(128), nullable=False)
    value: Mapped[str] = mapped_column(String(64), nullable=False)
    tier: Mapped[str] = mapped_column(String(32), default="Tier A", nullable=False)  # Tier A, Tier B, Tier C
    approval_status: Mapped[str] = mapped_column(String(32), default="pending", nullable=False)  # draft, pending, approved, withheld
    definition: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    as_of_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    approved_by: Mapped[Optional[int]] = mapped_column(ForeignKey("admin_users.id"), nullable=True)
    approved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    approver_user = relationship("User", back_populates="approved_statistics")
