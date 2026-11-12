import argparse
import sys
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.enquiry import Enquiry
from app.models.enquiry_service import EnquiryService
from app.models.audit_log import AuditLog
from app.models.user import User
from app.services.audit_service import AuditService

KNOWN_DEMO_NAMES = ["pooja patel", "sample lead", "test lead", "aarav shah", "priya parikh"]
KNOWN_DEMO_MOBILES = ["9825012345", "9825112345", "9879223456", "9426334567"]
KNOWN_DEMO_REFS = ["LC-XYMXY8R9"]


def purge_demo_data(dry_run: bool = True, force: bool = False) -> None:
    db: Session = SessionLocal()
    try:
        # Find all target enquiries
        query = db.query(Enquiry).filter(
            or_(
                Enquiry.is_demo.is_(True),
                Enquiry.created_via == "demo_seed",
                Enquiry.mobile.in_(KNOWN_DEMO_MOBILES),
                Enquiry.reference_id.in_(KNOWN_DEMO_REFS),
                Enquiry.name.ilike("%pooja patel%"),
            )
        )
        target_enquiries = query.all()
        target_ids = [e.id for e in target_enquiries]
        target_refs = [e.reference_id for e in target_enquiries]

        # Count related services
        services_count = 0
        if target_ids:
            services_count = (
                db.query(EnquiryService)
                .filter(EnquiryService.enquiry_id.in_(target_ids))
                .count()
            )

        # Count demo audit logs
        audit_query = db.query(AuditLog).filter(
            or_(
                AuditLog.action.in_(["DEMO_DATA_SEEDED", "DEMO_DATA_PURGED"]),
                AuditLog.entity_id.in_(target_refs) if target_refs else False,
            )
        )
        audit_count = audit_query.count()

        if dry_run and not force:
            print("\n[DRY RUN MODE] Demo data purge summary (no changes made):")
            print(f"  - Enquiries to delete:        {len(target_enquiries)}")
            print(f"  - Enquiry services to delete: {services_count}")
            print(f"  - Audit logs to purge:        {audit_count}")
            if target_enquiries:
                print("\nTarget leads identified:")
                for e in target_enquiries:
                    print(f"    * {e.reference_id} - {e.name} ({e.mobile}) [is_demo={e.is_demo}]")
            print("\nTo execute actual deletion, run: python -m app.scripts.purge_demo_data --confirm\n")
            return

        # Deletion mode
        enquiries_deleted = len(target_ids)
        if target_ids:
            db.query(EnquiryService).filter(EnquiryService.enquiry_id.in_(target_ids)).delete(synchronize_session=False)
            db.query(Enquiry).filter(Enquiry.id.in_(target_ids)).delete(synchronize_session=False)

        if target_refs:
            db.query(AuditLog).filter(
                or_(
                    AuditLog.action == "DEMO_DATA_SEEDED",
                    AuditLog.entity_id.in_(target_refs),
                )
            ).delete(synchronize_session=False)

        admin = db.query(User).filter(User.role.in_(["super_admin", "admin"])).first()
        admin_id = admin.id if admin else None

        # Write clean audit log
        AuditService.log_action(
            db=db,
            action="DEMO_DATA_PURGED",
            entity_type="system",
            metadata={
                "enquiries_deleted": enquiries_deleted,
                "services_deleted": services_count,
                "audit_logs_purged": audit_count,
            },
            user_id=admin_id,
        )

        db.commit()

        print("\nPurging demo data:")
        print(f"  - Enquiries: {enquiries_deleted} deleted")
        print(f"  - Enquiry services: {services_count} deleted")
        print(f"  - Audit logs: {audit_count} purged")
        print("Database is now clean.\n")

    except Exception as e:
        db.rollback()
        print(f"Error purging demo data: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(description="Purge all demo and seed data from Lotus Capital database.")
    parser.add_argument("--confirm", action="store_true", help="Confirm execution of database purge")
    parser.add_argument("--force", action="store_true", help="Force purge without prompt")
    parser.add_argument("--dry-run", action="store_true", help="Simulate purge without modifying data")
    args = parser.parse_args()

    dry_run = True
    if args.confirm or args.force:
        dry_run = False
    elif args.dry_run:
        dry_run = True

    purge_demo_data(dry_run=dry_run, force=args.force)


if __name__ == "__main__":
    main()

