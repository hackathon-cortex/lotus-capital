from fastapi import APIRouter, Depends, UploadFile, File, Request, status
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.dependencies.auth import require_role
from app.models.user import User
from app.core.permissions import Role
from app.schemas.common import APIResponse
from app.services.media_service import MediaService

router = APIRouter()


@router.post(
    "/admin/media/upload",
    status_code=status.HTTP_201_CREATED,
    summary="Upload Media Asset (Admin Only)",
)
def upload_media(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    service = MediaService(db)
    media = service.upload_file(file=file, user_id=current_user.id, ip_address=ip_address)
    return APIResponse(
        success=True,
        message="Media uploaded successfully.",
        data={
            "id": media.id,
            "filename": media.filename,
            "original_name": media.original_name,
            "mime_type": media.mime_type,
            "file_size": media.file_size,
        },
    )

