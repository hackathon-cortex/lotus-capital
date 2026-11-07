from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.schemas.content import ContentPublicRead, FAQPublicRead
from app.schemas.common import APIResponse
from app.services.content_service import ContentService

router = APIRouter()


@router.get(
    "/content/pages/{slug}",
    response_model=APIResponse[ContentPublicRead],
    summary="Get Published Page Content by Slug",
)
def get_page_by_slug(slug: str, db: Session = Depends(get_db)):
    service = ContentService(db)
    item = service.get_public_page(slug)
    return APIResponse(success=True, data=item)


@router.get(
    "/content/insights",
    response_model=APIResponse[List[ContentPublicRead]],
    summary="List Published Insight Articles",
)
def list_insights(db: Session = Depends(get_db)):
    service = ContentService(db)
    items = service.list_public_insights()
    return APIResponse(success=True, data=items)


@router.get(
    "/content/insights/{slug}",
    response_model=APIResponse[ContentPublicRead],
    summary="Get Published Insight Article by Slug",
)
def get_insight_by_slug(slug: str, db: Session = Depends(get_db)):
    service = ContentService(db)
    item = service.get_public_insight(slug)
    return APIResponse(success=True, data=item)


@router.get(
    "/contact",
    summary="Get Official Lotus Capital Contact Information",
)
def get_contact_info(db: Session = Depends(get_db)):
    service = ContentService(db)
    data = service.get_company_info()
    return APIResponse(success=True, data=data)


@router.get(
    "/faqs",
    response_model=APIResponse[List[FAQPublicRead]],
    summary="List Frequently Asked Questions",
)
def get_faqs(db: Session = Depends(get_db)):
    service = ContentService(db)
    items = service.get_faqs()
    return APIResponse(success=True, data=items)
