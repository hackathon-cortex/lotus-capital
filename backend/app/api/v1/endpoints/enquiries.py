from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.schemas.enquiry import EnquiryCreate
from app.services.enquiry_service import EnquiryService

router = APIRouter()


@router.post(
    "/enquiries",
    status_code=status.HTTP_201_CREATED,
    summary="Submit Customer Enquiry",
)
def submit_enquiry(
    payload: EnquiryCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    service = EnquiryService(db)
    result = service.create_enquiry(payload, ip_address=ip_address)
    return {
        "success": True,
        "enquiry_id": result.reference_id,
        "reference_id": result.reference_id,
        "message": "Enquiry submitted successfully.",
        "status": "received",
        "data": {
            "enquiry_id": result.reference_id,
            "reference_id": result.reference_id,
            "status": result.status,
        },
    }


@router.get(
    "/enquiries/verify-ref/{reference_id}",
    summary="Verify Enquiry Reference ID for Thank-You Page",
)
def verify_reference_id(
    reference_id: str,
    db: Session = Depends(get_db),
):
    service = EnquiryService(db)
    enquiry = service.get_by_reference_id(reference_id)
    # Only return sanitized, public-safe fields
    return {
        "success": True,
        "valid": True,
        "enquiry_id": enquiry.reference_id,
        "reference_id": enquiry.reference_id,
        "status": enquiry.status,
    }
