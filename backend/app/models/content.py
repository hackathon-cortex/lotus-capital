from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class Content(Base):
    __tablename__ = "contents"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    content_type: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content_json: Mapped[str] = mapped_column(Text, nullable=False)  # JSON-encoded payload
    status: Mapped[str] = mapped_column(String(32), default="draft", index=True, nullable=False)  # draft, published, archived
    created_by: Mapped[Optional[int]] = mapped_column(ForeignKey("admin_users.id"), nullable=True)
    updated_by: Mapped[Optional[int]] = mapped_column(ForeignKey("admin_users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

