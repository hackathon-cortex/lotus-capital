from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import String, Boolean, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Enquiry(Base):
    __tablename__ = "enquiries"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    reference_id: Mapped[str] = mapped_column(String(32), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    mobile: Mapped[str] = mapped_column(String(15), index=True, nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    organisation_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    existing_rohini_id: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    contact_method: Mapped[str] = mapped_column(String(32), default="phone", nullable=False)
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    consent: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="new", index=True, nullable=False)
    assigned_to: Mapped[Optional[int]] = mapped_column(ForeignKey("admin_users.id"), nullable=True)
    admin_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Provenance and demo flags
    is_demo: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    created_via: Mapped[str] = mapped_column(String(32), default="public_form", nullable=False)
    source: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)

    # Soft delete fields
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), index=True, nullable=True)
    deleted_by: Mapped[Optional[int]] = mapped_column(ForeignKey("admin_users.id"), nullable=True)
    delete_reason: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        index=True,
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    assigned_user = relationship("User", foreign_keys=[assigned_to], back_populates="assigned_enquiries")
    deleted_by_user = relationship("User", foreign_keys=[deleted_by])
    services: Mapped[List["EnquiryService"]] = relationship(
        "EnquiryService",
        back_populates="enquiry",
        cascade="all, delete-orphan",
    )
    followups: Mapped[List["FollowUp"]] = relationship(
        "FollowUp",
        back_populates="enquiry",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("idx_enquiries_metrics", "created_at", "status", "assigned_to", "deleted_at"),
    )
