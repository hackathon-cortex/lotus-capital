from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    DateTime,
    Integer,
    ForeignKey,
    create_engine,
)
from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(String(64), primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    mobile = Column(String(15), nullable=False, index=True)
    email = Column(String(255), nullable=True)
    service = Column(String(50), nullable=False)
    message = Column(Text, nullable=True)
    contact_method = Column(String(20), default="phone")
    source_path = Column(String(255), nullable=False)
    consent = Column(Boolean, default=True, nullable=False)
    status = Column(String(30), default="new", index=True)  # new, contacted, qualified, in-progress, converted, closed
    assigned_to = Column(String(64), nullable=True)
    utm_source = Column(String(100), nullable=True)
    utm_medium = Column(String(100), nullable=True)
    utm_campaign = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class Note(Base):
    __tablename__ = "lead_notes"
    
    id = Column(String(64), primary_key=True)
    lead_id = Column(String(64), ForeignKey("leads.id"), nullable=False)
    author_id = Column(String(64), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Followup(Base):
    __tablename__ = "followups"
    
    id = Column(String(64), primary_key=True)
    lead_id = Column(String(64), ForeignKey("leads.id"), nullable=False)
    assigned_to = Column(String(64), nullable=False)
    scheduled_for = Column(DateTime, nullable=False)
    status = Column(String(30), default="pending")  # pending, completed, rescheduled, cancelled
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(64), primary_key=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(30), default="staff", nullable=False)  # admin, staff
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String(64), primary_key=True)
    actor_id = Column(String(64), nullable=False)
    action = Column(String(100), nullable=False)
    target_type = Column(String(50), nullable=False)
    target_id = Column(String(64), nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

