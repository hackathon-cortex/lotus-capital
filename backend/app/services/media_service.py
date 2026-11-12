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


def verify_file_magic_bytes(contents: bytes, expected_mime: str) -> bool:
    """Verifies true file magic bytes rather than trusting client-supplied headers."""
    if len(contents) < 4:
        return False

    if expected_mime == "image/jpeg":
        return contents[:3] == b"\xff\xd8\xff"
    elif expected_mime == "image/png":
        return contents[:8] == b"\x89PNG\r\n\x1a\n"
    elif expected_mime == "image/webp":
        return len(contents) > 12 and contents[:4] == b"RIFF" and contents[8:12] == b"WEBP"
    elif expected_mime == "application/pdf":
        return contents[:5] == b"%PDF-"
    elif expected_mime == "image/svg+xml":
        head = contents[:2048].lower()
        if b"<svg" not in head and b"<?xml" not in head:
            return False
        # Disallow malicious active content in SVGs (XSS prevention)
        dangerous_patterns = [
            b"<script",
            b"javascript:",
            b"onload=",
            b"onerror=",
            b"onclick=",
            b"<foreignobject",
            b"xlink:href=\"data:text/html",
        ]
        for pat in dangerous_patterns:
            if pat in head:
                return False
        return True
    return False


class MediaService:
    def __init__(self, db: Session):
        self.db = db
        self.upload_dir = settings.UPLOAD_DIR
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    def upload_file(self, file: UploadFile, user_id: int, ip_address: Optional[str] = None) -> Media:
        # 1. Validate MIME type declaration
        content_type = (file.content_type or "").lower().split(";")[0].strip()
        if content_type not in ALLOWED_MIME_TYPES:
            raise BadRequestException(
                f"Unsupported file type '{content_type}'. Allowed: JPEG, PNG, WEBP, SVG, PDF."
            )

        # 2. Sanitize original filename and prevent path traversal
        clean_original = os.path.basename(file.filename or "upload")
        clean_original = re.sub(r"[^\w\.\-]", "_", clean_original)

        # 3. Read and check size limit (5MB)
        contents = file.file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise BadRequestException("File size exceeds 5MB limit.")
        if len(contents) == 0:
            raise BadRequestException("Uploaded file is empty.")

        # 4. Strict Magic-Bytes Verification
        if not verify_file_magic_bytes(contents, content_type):
            raise BadRequestException(
                f"File content does not match declared type '{content_type}'. Upload rejected for security reasons."
            )

        # 5. Generate secure random filename
        ext = ALLOWED_MIME_TYPES[content_type]
        unique_name = f"{uuid.uuid4().hex}{ext}"
        target_path = self.upload_dir / unique_name

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
            metadata={
                "filename": unique_name,
                "original_name": clean_original,
                "size": len(contents),
                "mime": content_type,
            },
            ip_address=ip_address,
        )

        return media_record
