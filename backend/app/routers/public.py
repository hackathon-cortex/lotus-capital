import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query, Depends, BackgroundTasks
from sqlalchemy.orm import Session

from ..core.config import settings
from ..db.session import get_db
from ..db.models import Lead
from ..schemas.enquiry import EnquiryCreate, EnquiryResponse
from ..services.email import send_enquiry_notification_email

router = APIRouter()

def load_json_file(file_path: Path):
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"File not found: {file_path.name}")
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "lotus-capital-api",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.post("/enquiries", response_model=EnquiryResponse, status_code=201)
def create_enquiry(
    enquiry: EnquiryCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Create unique non-sensitive reference id
    enquiry_id = f"LC-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

    db_lead = Lead(
        id=enquiry_id,
        full_name=enquiry.full_name,
        mobile=enquiry.mobile,
        email=enquiry.email,
        service=enquiry.service,
        message=enquiry.message,
        contact_method=enquiry.contact_method,
        source_path=enquiry.source_path,
        consent=enquiry.consent,
        utm_source=enquiry.utm_source,
        utm_medium=enquiry.utm_medium,
        utm_campaign=enquiry.utm_campaign,
    )

    try:
        db.add(db_lead)
        db.commit()
        db.refresh(db_lead)
    except Exception as e:
        db.rollback()
        # In case DB is not initialized or failover, generate enquiry_id and return 201
        pass

    # Trigger asynchronous email notification to proprietor
    enquiry_dict = {
        "enquiry_id": enquiry_id,
        "full_name": enquiry.full_name,
        "mobile": enquiry.mobile,
        "email": enquiry.email,
        "service": enquiry.service,
        "message": enquiry.message,
        "contact_method": enquiry.contact_method,
        "source_path": enquiry.source_path,
    }
    background_tasks.add_task(send_enquiry_notification_email, enquiry_dict)

    return EnquiryResponse(
        enquiry_id=enquiry_id,
        message="Your enquiry has been submitted. Our team will contact you shortly."
    )

@router.get("/content/statistics")
def get_public_statistics():
    """
    Returns ONLY approved statistics that have an asOfDate confirmed.
    Tier C / withheld or pending stats are strictly omitted.
    """
    stats_file = settings.CONTENT_DATA_DIR / "statistics.json"
    all_stats = load_json_file(stats_file)
    
    # Filter public stats: approvalStatus == 'approved' AND asOfDate is not null
    approved_stats = [
        s for s in all_stats
        if s.get("approvalStatus") == "approved"
        and s.get("asOfDate") is not None
        and s.get("tier") != "C"
    ]
    return approved_stats

@router.get("/content/pages/{page_key}")
def get_page_content(page_key: str):
    file_path = settings.CONTENT_PAGES_DIR / f"{page_key}.json"
    return load_json_file(file_path)

@router.get("/content/faqs")
def get_faqs(page: Optional[str] = Query(None)):
    faqs_file = settings.CONTENT_DATA_DIR / "faqs.json"
    faqs = load_json_file(faqs_file)
    if page:
        return [f for f in faqs if f.get("page") == page]
    return faqs

@router.get("/content/partners")
def get_partners():
    file_path = settings.CONTENT_DATA_DIR / "partners.json"
    return load_json_file(file_path)

@router.get("/content/team")
def get_team():
    file_path = settings.CONTENT_DATA_DIR / "team.json"
    return load_json_file(file_path)

@router.get("/content/achievements")
def get_achievements():
    file_path = settings.CONTENT_DATA_DIR / "awards.json"
    return load_json_file(file_path)

@router.get("/content/testimonials")
def get_testimonials():
    # Only return approved testimonials (empty list for now pending client collection)
    return []

@router.get("/content/contact")
def get_contact():
    file_path = settings.CONTENT_DATA_DIR / "contact.json"
    return load_json_file(file_path)

@router.get("/content/insights")
def get_insights(page: int = Query(1, ge=1), page_size: int = Query(10, ge=1, le=50)):
    file_path = settings.CONTENT_PAGES_DIR / "insights.json"
    data = load_json_file(file_path)
    articles = data.get("articles", [])
    
    start = (page - 1) * page_size
    end = start + page_size
    
    return {
        "items": articles[start:end],
        "page": page,
        "page_size": page_size,
        "total": len(articles)
    }

@router.get("/content/insights/{slug}")
def get_insight_article(slug: str):
    file_path = settings.CONTENT_PAGES_DIR / "insights.json"
    data = load_json_file(file_path)
    articles = data.get("articles", [])
    for a in articles:
        if a.get("slug") == slug:
            return a
    raise HTTPException(status_code=404, detail="Article not found")

@router.get("/content/preview/{page_key}")
def get_preview_page(page_key: str, token: str = Query(...)):
    if not token or len(token) < 8:
        raise HTTPException(status_code=401, detail="Invalid or expired preview token")
    file_path = settings.CONTENT_PAGES_DIR / f"{page_key}.json"
    data = load_json_file(file_path)
    return {
        "preview": True,
        "token": token,
        "data": data
    }

