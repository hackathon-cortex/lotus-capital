import os
from pathlib import Path
from typing import Optional, List
from fastapi import APIRouter, Depends, UploadFile, File, Request, Query, status
from fastapi.responses import FileResponse
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from app.dependencies.database import get_db
from app.dependencies.auth import require_role
from app.models.user import User
from app.models.media import Media
from app.core.permissions import Role
from app.core.config import settings
from app.core.exceptions import NotFoundException, BadRequestException
from app.schemas.common import APIResponse, PaginatedResponse
from app.services.media_service import MediaService
from app.services.audit_service import AuditService

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
            "url": f"/api/v1/media/{media.filename}",
        },
    )


@router.get(
    "/media/{filename}",
    summary="Serve Uploaded Media File",
)
def get_media_file(filename: str):
    # Sanitize filename to prevent directory traversal
    clean_name = os.path.basename(filename)
    file_path = settings.UPLOAD_DIR / clean_name

    if not file_path.is_file() or not file_path.exists():
        raise NotFoundException("Media file not found.")

    return FileResponse(
        path=str(file_path),
        headers={"Cache-Control": "public, max-age=86400"},
    )


@router.get(
    "/admin/media",
    summary="List Uploaded Media Assets",
)
def list_media(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_role(Role.EDITOR)),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * page_size
    query = select(Media).order_by(Media.created_at.desc()).offset(skip).limit(page_size)
    total_query = select(func.count(Media.id))

    items = list(db.execute(query).scalars().all())
    total = db.execute(total_query).scalar() or 0
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1

    serialized = [
        {
            "id": m.id,
            "filename": m.filename,
            "original_name": m.original_name,
            "mime_type": m.mime_type,
            "file_size": m.file_size,
            "url": f"/api/v1/media/{m.filename}",
            "created_at": m.created_at,
        }
        for m in items
    ]

    return PaginatedResponse(
        items=serialized,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.delete(
    "/admin/media/{id}",
    response_model=APIResponse[None],
    summary="Delete Uploaded Media File",
)
def delete_media(
    id: int,
    request: Request,
    current_user: User = Depends(require_role(Role.ADMIN)),
    db: Session = Depends(get_db),
):
    media = db.get(Media, id)
    if not media:
        raise NotFoundException(f"Media with ID {id} not found.")

    # Remove file from disk safely
    file_path = Path(media.file_path)
    if file_path.is_file() and file_path.exists():
        try:
            file_path.unlink()
        except Exception:
            pass

    db.delete(media)
    db.commit()

    ip_address = request.client.host if request.client else None
    AuditService.log_action(
        db=db,
        action="MEDIA_DELETED",
        entity_type="media",
        entity_id=str(id),
        user_id=current_user.id,
        metadata={"filename": media.filename},
        ip_address=ip_address,
    )

    return APIResponse(success=True, message="Media deleted successfully.")
