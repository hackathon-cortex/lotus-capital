import json
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog
from app.core.logging import logger


class AuditService:
    @staticmethod
    def log_action(
        db: Session,
        action: str,
        entity_type: str,
        entity_id: Optional[str] = None,
        user_id: Optional[int] = None,
        metadata: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
    ) -> AuditLog:
        # Sanitize metadata to never store passwords or tokens
        safe_meta = {}
        if metadata:
            for k, v in metadata.items():
                if any(secret in k.lower() for secret in ["password", "token", "secret", "otp"]):
                    continue
                safe_meta[k] = v

        entry = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=str(entity_id) if entity_id else None,
            metadata_json=json.dumps(safe_meta) if safe_meta else None,
            ip_address=ip_address,
        )
        db.add(entry)
        try:
            db.commit()
            db.refresh(entry)
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to record audit log: {str(e)}")
        return entry

