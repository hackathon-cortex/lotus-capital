import os
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
from app.core.logging import logger
from app.services.statistics_service import StatisticsService
from app.services.content_service import ContentService


def init_db_data(db: Session = None):
    own_session = False
    if db is None:
        db = SessionLocal()
        own_session = True

    try:
        # 1. Bootstrap super_admin user if none exists
        admin_email = os.getenv("BOOTSTRAP_ADMIN_EMAIL", "admin@lotuscapital.in").strip().lower()
        admin_password = os.getenv("BOOTSTRAP_ADMIN_PASSWORD", "LotusAdmin@2026")
        admin_name = os.getenv("BOOTSTRAP_ADMIN_NAME", "Lotus Super Admin")

        existing_user = db.query(User).filter(User.email == admin_email).first()
        if not existing_user:
            super_admin = User(
                full_name=admin_name,
                email=admin_email,
                password_hash=get_password_hash(admin_password),
                role="super_admin",
                is_active=True,
                is_superuser=True,
            )
            db.add(super_admin)
            db.commit()
            logger.info(f"Bootstrap super_admin user created: {admin_email}")
        else:
            logger.info(f"Admin user already exists: {admin_email}")

        # 2. Sync statistics and CMS contents from seed JSON
        stat_service = StatisticsService(db)
        stat_service.sync_from_json_if_empty()

        content_service = ContentService(db)
        content_service.sync_from_json_if_empty()

    except Exception as e:
        db.rollback()
        logger.error(f"Error initializing DB seed data: {str(e)}")
    finally:
        if own_session:
            db.close()


if __name__ == "__main__":
    init_db_data()
