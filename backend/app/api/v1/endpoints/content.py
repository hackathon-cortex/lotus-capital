import json
from datetime import datetime, timezone
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.schemas.content import ContentPublicRead, FAQPublicRead
from app.schemas.common import APIResponse
from app.services.content_service import ContentService
from app.models.preview_token import PreviewToken
from app.models.content import Content
from app.core.exceptions import NotFoundException, BadRequestException

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
    "/content/preview/{token}",
    response_model=APIResponse[ContentPublicRead],
    summary="Preview Draft Content via Secure Token",
)
def preview_content(token: str, db: Session = Depends(get_db)):
    query = select(PreviewToken).where(PreviewToken.token == token)
    preview = db.execute(query).scalar_one_or_none()
    if not preview:
        raise NotFoundException("Preview token is invalid.")

    # Check expiration
    now = datetime.now(timezone.utc)
    # Ensure preview.expires_at is timezone-aware
    expires = preview.expires_at
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if expires < now:
        raise BadRequestException("Preview token has expired.")

    content = db.get(Content, preview.content_id)
    if not content:
        raise NotFoundException("Previewed content no longer exists.")

    return APIResponse(
        success=True,
        message="Preview content loaded.",
        data=ContentPublicRead(
            slug=content.slug,
            title=f"[PREVIEW] {content.title}",
            content_type=content.content_type,
            content_json=json.loads(content.content_json) if content.content_json else {},
            updated_at=content.updated_at,
        ),
    )


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
