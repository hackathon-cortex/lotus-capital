import os
import re
import uuid
from pathlib import Path
from typing import Optional
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.models.media import Media
from app.core.config import settings
from app.core.exceptions import BadRequestException
from app.services.audit_service import AuditService

ALLOWED_MIME_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
    "application/pdf": ".pdf",
}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


class MediaService:
    def __init__(self, db: Session):
        self.db = db
        self.upload_dir = settings.UPLOAD_DIR
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    def upload_file(self, file: UploadFile, user_id: int, ip_address: Optional[str] = None) -> Media:
        # Validate MIME type
        content_type = file.content_type or ""
        if content_type not in ALLOWED_MIME_TYPES:
            raise BadRequestException(
                f"Unsupported file type '{content_type}'. Allowed: JPEG, PNG, WEBP, SVG, PDF."
            )

        # Sanitize original filename and prevent path traversal
        clean_original = os.path.basename(file.filename or "upload")
        clean_original = re.sub(r"[^\w\.\-]", "_", clean_original)

        # Generate unique storage filename
        ext = ALLOWED_MIME_TYPES[content_type]
        unique_name = f"{uuid.uuid4().hex}{ext}"
        target_path = self.upload_dir / unique_name

        # Read and check size
        contents = file.file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise BadRequestException("File size exceeds 5MB limit.")

        with open(target_path, "wb") as f:
            f.write(contents)

        media_record = Media(
            filename=unique_name,
            original_name=clean_original,
            file_path=str(target_path),
            mime_type=content_type,
            file_size=len(contents),
            uploaded_by=user_id,
        )
        self.db.add(media_record)
        self.db.commit()
        self.db.refresh(media_record)

        AuditService.log_action(
            db=self.db,
            action="MEDIA_UPLOADED",
            entity_type="media",
            entity_id=str(media_record.id),
            user_id=user_id,
            metadata={"filename": unique_name, "mime_type": content_type},
            ip_address=ip_address,
        )

        return media_record
