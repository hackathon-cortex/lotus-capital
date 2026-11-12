import json
import re
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog
from app.core.logging import logger
from app.core.security import hash_ip


def mask_mobile(val: str) -> str:
    cleaned = re.sub(r"\D", "", val)
    if len(cleaned) == 10:
        return f"{cleaned[:2]}xxxxx{cleaned[7:]}"
    return "xxxxxxx"


def mask_email(val: str) -> str:
    if "@" in val:
        local, domain = val.split("@", 1)
        masked_local = f"{local[0]}***" if len(local) > 0 else "***"
        return f"{masked_local}@{domain}"
    return "******"


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
        # Sanitize metadata to never store passwords, secrets or unmasked PII
        safe_meta = {}
        if metadata:
            for k, v in metadata.items():
                lower_k = k.lower()
                if any(secret in lower_k for secret in ["password", "token", "secret", "otp"]):
                    continue
                if "mobile" in lower_k and isinstance(v, str):
                    safe_meta[k] = mask_mobile(v)
                elif "email" in lower_k and isinstance(v, str):
                    safe_meta[k] = mask_email(v)
                else:
                    safe_meta[k] = v

        # Mask entity_id if it is an email
        safe_entity_id = str(entity_id) if entity_id else None
        if safe_entity_id and "@" in safe_entity_id:
            safe_entity_id = mask_email(safe_entity_id)

        # Hash IP address for privacy compliance
        safe_ip = hash_ip(ip_address) if ip_address else None

        entry = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=safe_entity_id,
            metadata_json=json.dumps(safe_meta) if safe_meta else None,
            ip_address=safe_ip,
        )
        db.add(entry)
        try:
            db.commit()
            db.refresh(entry)
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to record audit log: {str(e)}")
        return entry

    @staticmethod
    def anonymize_entity(db: Session, entity_type: str, entity_id: str) -> None:
        """Anonymizes all audit logs referencing a permanently deleted entity."""
        try:
            logs = db.query(AuditLog).filter(
                AuditLog.entity_type == entity_type,
                AuditLog.entity_id == entity_id,
            ).all()
            for log in logs:
                log.entity_id = "[DELETED_DATA_SUBJECT]"
                log.metadata_json = json.dumps({"note": "Personal data erased per data principal right."})
            db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to anonymize audit logs for {entity_type} {entity_id}: {str(e)}")
