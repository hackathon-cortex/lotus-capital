from typing import Optional
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class EnquiryService(Base):
    __tablename__ = "enquiry_services"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    enquiry_id: Mapped[int] = mapped_column(ForeignKey("enquiries.id", ondelete="CASCADE"), nullable=False)
    service_slug: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    service_detail: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    enquiry = relationship("Enquiry", back_populates="services")

