from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.schemas.content import ServicePublicRead
from app.schemas.common import APIResponse
from app.services.content_service import ContentService

router = APIRouter()


@router.get(
    "/services",
    response_model=APIResponse[List[ServicePublicRead]],
    summary="List Offered Financial Services",
)
def get_services(db: Session = Depends(get_db)):
    service = ContentService(db)
    items = service.get_services()
    return APIResponse(
        success=True,
        message="Services retrieved successfully.",
        data=items,
    )
