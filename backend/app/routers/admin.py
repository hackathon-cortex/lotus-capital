import json
from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException, Depends
from sqlalchemy.orm import Session

from ..core.config import settings
from ..db.session import get_db
from ..db.models import Lead

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_summary(db: Session = Depends(get_db)):
    # Read statistics from data layer as example
    stats_file = settings.CONTENT_DATA_DIR / "statistics.json"
    stats = []
    if stats_file.exists():
        with open(stats_file, "r", encoding="utf-8") as f:
            stats = json.load(f)

    # Lead metrics from database
    total_leads = 0
    try:
        total_leads = db.query(Lead).count()
    except Exception:
        pass

    return {
        "summary": {
            "total_leads": total_leads,
            "new_leads": total_leads,
            "pending_followups": 3,
            "conversion_rate_percent": 18.5,
        },
        "statistics_master": stats[:6],
        "recent_activity": [
            {"id": "act_1", "event": "Client enquiry submitted for Mutual Funds", "time": "10 mins ago"},
            {"id": "act_2", "event": "Follow-up completed for Health Insurance lead", "time": "1 hour ago"},
        ]
    }

@router.get("/leads")
def list_leads(
    service: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    items = []
    total = 0
    try:
        query = db.query(Lead)
        if service:
            query = query.filter(Lead.service == service)
        if status:
            query = query.filter(Lead.status == status)
        total = query.count()
        leads = query.offset((page - 1) * page_size).limit(page_size).all()
        items = [
            {
                "id": l.id,
                "full_name": l.full_name,
                "mobile": l.mobile,
                "email": l.email,
                "service": l.service,
                "status": l.status,
                "created_at": l.created_at.isoformat() if l.created_at else None,
            }
            for l in leads
        ]
    except Exception:
        pass

    return {
        "items": items,
        "page": page,
        "page_size": page_size,
        "total": total
    }

@router.get("/leads/{lead_id}")
def get_lead_detail(lead_id: str, db: Session = Depends(get_db)):
    lead = None
    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
    except Exception:
        pass

    if not lead:
        # Return typed stub
        return {
            "id": lead_id,
            "full_name": "Sample Client (Stub)",
            "mobile": "9825012345",
            "email": "client@example.com",
            "service": "mutual-funds",
            "status": "new",
            "message": "Interested in SIP planning for children's education.",
            "notes": [],
            "followups": []
        }

    return {
        "id": lead.id,
        "full_name": lead.full_name,
        "mobile": lead.mobile,
        "email": lead.email,
        "service": lead.service,
        "status": lead.status,
        "message": lead.message,
        "source_path": lead.source_path,
        "created_at": lead.created_at.isoformat() if lead.created_at else None,
    }

@router.get("/followups")
def list_followups():
    return {
        "items": [
            {
                "id": "fol_001",
                "lead_id": "LC-20261028-A1B2C3",
                "client_name": "Kishore Shah",
                "scheduled_for": "2026-10-29T10:30:00Z",
                "status": "pending",
                "topic": "Mutual Fund folio review"
            }
        ],
        "total": 1
    }

@router.get("/reports/services")
def get_service_reports():
    return {
        "services": [
            {"service": "mutual-funds", "count": 42},
            {"service": "health-insurance", "count": 28},
            {"service": "life-insurance", "count": 19},
            {"service": "general-insurance", "count": 14},
            {"service": "equity", "count": 12},
            {"service": "other-solutions", "count": 7},
        ]
    }

@router.get("/reports/conversion")
def get_conversion_reports():
    return {
        "conversion_rate": 22.4,
        "stages": {
            "new": 100,
            "contacted": 75,
            "qualified": 45,
            "in_progress": 30,
            "converted": 22,
            "closed": 8
        }
    }

@router.get("/users")
def list_users():
    return {
        "items": [
            {
                "id": "usr_001",
                "full_name": "Abhilash Chudasama",
                "email": "admin@lotuscapital.com",
                "role": "admin",
                "is_active": True
            },
            {
                "id": "usr_002",
                "full_name": "Staff Associate",
                "email": "staff@lotuscapital.com",
                "role": "staff",
                "is_active": True
            }
        ],
        "total": 2
    }

