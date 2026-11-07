from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.schemas.statistics import StatisticPublicRead
from app.schemas.common import APIResponse
from app.services.statistics_service import StatisticsService

router = APIRouter()


@router.get(
    "/statistics",
    response_model=APIResponse[List[StatisticPublicRead]],
    summary="Get Approved Public Financial Statistics",
)
def get_public_statistics(db: Session = Depends(get_db)):
    service = StatisticsService(db)
    items = service.get_public_statistics()
    return APIResponse(
        success=True,
        message="Public statistics retrieved successfully.",
        data=items,
    )
