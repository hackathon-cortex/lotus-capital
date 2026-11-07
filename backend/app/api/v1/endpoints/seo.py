from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.schemas.common import APIResponse
from app.services.content_service import ContentService

router = APIRouter()


@router.get(
    "/seo/{slug}",
    summary="Get SEO Metadata for a Route/Page",
)
def get_seo_metadata(slug: str, db: Session = Depends(get_db)):
    service = ContentService(db)
    seo_data = service.get_public_seo(slug)
    return APIResponse(success=True, data=seo_data)
