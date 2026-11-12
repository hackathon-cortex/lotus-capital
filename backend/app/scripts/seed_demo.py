import argparse
import os
import random
import sys
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import SessionLocal
from app.models.enquiry import Enquiry
from app.models.enquiry_service import EnquiryService
from app.models.user import User
from app.services.enquiry_service import EnquiryService as EnquiryDomainService
from app.services.audit_service import AuditService

DEMO_PROFILES = [
    {
        "name": "Aarav Shah",
        "mobile": "9825112345",
        "email": "aarav.shah@example.com",
        "city": "Godhra",
        "service": "mutual-funds",
        "sub_services": ["mutual-funds", "sip"],
        "message": "Looking to invest in disciplined monthly SIPs for wealth building in Godhra.",
        "source": "phone_inbound",
    },
    {
        "name": "Priya Parikh",
        "mobile": "9879223456",
        "email": "priya.parikh@example.com",
        "city": "Vadodara",
        "service": "life-insurance",
        "sub_services": ["life-insurance", "term-insurance"],
        "message": "Need family term protection review and comprehensive cover advisory.",
        "source": "referral",
    },
    {
        "name": "Rajesh Mehta",
        "mobile": "9426334567",
        "email": "rajesh.mehta@example.com",
        "city": "Halol",
        "service": "retirement-planning",
        "sub_services": ["mutual-funds", "retirement-planning"],
        "message": "Planning retirement corpus and pension cashflow options from industrial unit sale.",
        "source": "walk_in",
    },
    {
        "name": "Bhavna Joshi",
        "mobile": "9824445678",
        "email": "bhavna.joshi@example.com",
        "city": "Godhra",
        "service": "health-insurance",
        "sub_services": ["health-insurance"],
        "message": "Seeking senior citizen floater mediclaim policy for parents in Panchmahal.",
        "source": "phone_inbound",
    },
    {
        "name": "Dharmesh Patel",
        "mobile": "9727556789",
        "email": "dharmesh.patel@example.com",
        "city": "Ahmedabad",
        "service": "equity",
        "sub_services": ["equity"],
        "message": "Enquiring about long-term equity portfolio review and tax efficient restructuring.",
        "source": "whatsapp",
    },
    {
        "name": "Neha Desai",
        "mobile": "9898667890",
        "email": "neha.desai@example.com",
        "city": "Godhra",
        "service": "tax-planning",
        "sub_services": ["mutual-funds", "tax-planning"],
        "message": "Section 80C ELSS mutual fund tax saving before end of financial year.",
        "source": "campaign",
    },
    {
        "name": "Kiritbhai Solanki",
        "mobile": "9428778901",
        "email": "kirit.solanki@example.com",
        "city": "Godhra",
        "service": "general-insurance",
        "sub_services": ["general-insurance", "property-insurance"],
        "message": "Commercial property and warehouse fire & burglary coverage quotation.",
        "source": "walk_in",
    },
    {
        "name": "Ananya Trivedi",
        "mobile": "9825889012",
        "email": "ananya.trivedi@example.com",
        "city": "Vadodara",
        "service": "mutual-funds",
        "sub_services": ["mutual-funds"],
        "message": "Child education higher studies portfolio planning for 10-year horizon.",
        "source": "phone_inbound",
    },
]

STATUS_CHOICES = ["new", "contacted", "in_progress"]


def check_production() -> None:
    app_env = os.getenv("APP_ENV", "").strip().lower()
    env = os.getenv("ENVIRONMENT", settings.ENVIRONMENT).strip().lower()
    if app_env == "production" or env == "production":
        print("Refusing to seed demo data in production environment", file=sys.stderr)
        sys.exit(1)


def seed_demo_data(count: int = 15, include_resolved: bool = False, days: int = 30) -> None:
    check_production()

    db: Session = SessionLocal()
    try:
        # Get super_admin or default user
        admin = db.query(User).filter(User.role.in_(["super_admin", "admin"])).first()
        admin_id = admin.id if admin else None

        now = datetime.now(timezone.utc)
        created_records = []

        statuses = list(STATUS_CHOICES)
        if include_resolved:
            statuses.extend(["resolved", "closed"])

        for i in range(count):
            profile = DEMO_PROFILES[i % len(DEMO_PROFILES)]
            ref_id = EnquiryDomainService.generate_reference_id()

            # Spread created_at across days
            days_ago = random.uniform(0.1, max(1.0, float(days)))
            created_at = now - timedelta(days=days_ago)
            status = random.choice(statuses)

            # Unique mobile variation if count > profiles
            mobile = profile["mobile"]
            if i >= len(DEMO_PROFILES):
                mobile = f"9825{random.randint(100000, 999999)}"

            enquiry = Enquiry(
                reference_id=ref_id,
                name=profile["name"],
                mobile=mobile,
                email=profile["email"],
                contact_method="phone",
                message=profile["message"],
                consent=True,
                status=status,
                assigned_to=admin_id,
                admin_notes=f"Demo lead from {profile['city']}",
                is_demo=True,
                created_via="demo_seed",
                source=profile["source"],
                created_at=created_at,
                updated_at=created_at,
            )
            db.add(enquiry)
            db.flush()

            for slug in profile["sub_services"]:
                db.add(
                    EnquiryService(
                        enquiry_id=enquiry.id,
                        service_slug=slug,
                        service_detail=slug,
                    )
                )

            created_records.append((ref_id, enquiry.name, enquiry.mobile, status, profile["service"]))

        db.commit()

        # Log audit entry
        AuditService.log_action(
            db=db,
            action="DEMO_DATA_SEEDED",
            entity_type="system",
            metadata={"count": len(created_records), "is_demo": True},
            user_id=admin_id,
        )

        print("\n" + "=" * 65)
        print(f" DEMO DATA SEEDED SUCCESSFULLY ({len(created_records)} records)")
        print("=" * 65)
        print(f"{'Reference':<14} | {'Name':<18} | {'Mobile':<12} | {'Status':<10}")
        print("-" * 65)
        for r in created_records:
            print(f"{r[0]:<14} | {r[1]:<18} | {r[2]:<12} | {r[3]:<10}")
        print("=" * 65)
        print("All records marked with is_demo = True and created_via = 'demo_seed'.")
        print("To purge all demo records, run: python -m app.scripts.purge_demo_data --confirm\n")

    except Exception as e:
        db.rollback()
        print(f"Error seeding demo data: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(description="Seed demo enquiries into Lotus Capital database.")
    parser.add_argument("--count", type=int, default=15, help="Number of demo enquiries to create (default: 15)")
    parser.add_argument("--include-resolved", action="store_true", help="Include resolved/closed statuses")
    parser.add_argument("--days", type=int, default=30, help="Spread creation date across last N days (default: 30)")
    args = parser.parse_args()

    seed_demo_data(count=args.count, include_resolved=args.include_resolved, days=args.days)


if __name__ == "__main__":
    main()

