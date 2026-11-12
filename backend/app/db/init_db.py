import os
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
from app.core.logging import logger
from app.services.statistics_service import StatisticsService
from app.services.content_service import ContentService


def run_migrations(db: Session) -> None:
    """Ensure database schema is up-to-date with soft-delete & demo tracking columns."""
    try:
        # Check SQLite table info for enquiries
        raw_res = db.execute(text("PRAGMA table_info(enquiries)")).fetchall()
        if raw_res:
            existing_cols = {row[1] for row in raw_res}
            columns_to_add = [
                ("is_demo", "BOOLEAN DEFAULT 0 NOT NULL"),
                ("created_via", "VARCHAR(32) DEFAULT 'public_form' NOT NULL"),
                ("source", "VARCHAR(64)"),
                ("deleted_at", "DATETIME"),
                ("deleted_by", "INTEGER"),
                ("delete_reason", "VARCHAR(255)"),
                ("organisation_name", "VARCHAR(150)"),
                ("city", "VARCHAR(100)"),
                ("existing_rohini_id", "VARCHAR(20)"),
            ]
            for col_name, col_type in columns_to_add:
                if col_name not in existing_cols:
                    logger.info(f"Adding missing column '{col_name}' to enquiries table...")
                    db.execute(text(f"ALTER TABLE enquiries ADD COLUMN {col_name} {col_type}"))
            db.commit()

        # Check SQLite table info for admin_users
        user_res = db.execute(text("PRAGMA table_info(admin_users)")).fetchall()
        if user_res:
            user_cols = {row[1] for row in user_res}
            user_columns_to_add = [
                ("mfa_enabled", "BOOLEAN DEFAULT 0 NOT NULL"),
                ("mfa_secret", "VARCHAR(64)"),
                ("recovery_codes", "TEXT"),
                ("failed_login_attempts", "INTEGER DEFAULT 0 NOT NULL"),
                ("locked_until", "DATETIME"),
                ("session_version", "INTEGER DEFAULT 1 NOT NULL"),
            ]
            for col_name, col_type in user_columns_to_add:
                if col_name not in user_cols:
                    logger.info(f"Adding missing column '{col_name}' to admin_users table...")
                    db.execute(text(f"ALTER TABLE admin_users ADD COLUMN {col_name} {col_type}"))
            db.commit()

        # Ensure followups table exists
        from app.models.followup import FollowUp
        FollowUp.__table__.create(db.get_bind(), checkfirst=True)
        db.commit()
    except Exception as e:
        logger.warning(f"Schema migration check skipped or failed: {str(e)}")
        db.rollback()


def init_db_data(db: Session = None):
    own_session = False
    if db is None:
        db = SessionLocal()
        own_session = True

    try:
        # 0. Run schema upgrade / fallback migrations
        run_migrations(db)

        # 1. Bootstrap super_admin user if none exists (IDEMPOTENT)
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

        # 2. Sync statistics register & real client CMS content from seed JSON if empty
        stat_service = StatisticsService(db)
        stat_service.sync_from_json_if_empty()

        content_service = ContentService(db)
        content_service.sync_from_json_if_empty()

        # NOTE: NO DEMO LEADS OR DEMO LOGS ARE AUTOMATICALLY CREATED.
        # Database starts empty of enquiries in dev and production.

    except Exception as e:
        db.rollback()
        logger.error(f"Error initializing DB: {str(e)}")
    finally:
        if own_session:
            db.close()


if __name__ == "__main__":
    init_db_data()
