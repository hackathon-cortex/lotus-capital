"""Command Line Interface (CLI) for Lotus Capital Administration.

Usage examples:
    python -m app.cli create-admin --name "Super Admin" --email admin@lotuscapital.in --password "AdminPass123!" --role super_admin
    python -m app.cli reset-password --email admin@lotuscapital.in --password "NewSecurePassword123!"
    python -m app.cli list-users
    python -m app.cli init-db
"""

import argparse
import sys
from app.db.session import SessionLocal
from app.db.base import Base
from app.db.session import engine
from app.models.user import User
from app.core.security import get_password_hash
from app.db.init_db import init_db_data


def get_db():
    return SessionLocal()


def handle_create_admin(args):
    db = get_db()
    try:
        email = args.email.strip().lower()
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"[ERROR] User with email '{email}' already exists.")
            sys.exit(1)

        user = User(
            full_name=args.name,
            email=email,
            password_hash=get_password_hash(args.password),
            role=args.role,
            is_active=True,
            is_superuser=(args.role == "super_admin"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"[SUCCESS] Admin user '{user.email}' (Role: {user.role}, ID: {user.id}) created successfully.")
    finally:
        db.close()


def handle_reset_password(args):
    db = get_db()
    try:
        email = args.email.strip().lower()
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"[ERROR] User with email '{email}' not found.")
            sys.exit(1)

        user.password_hash = get_password_hash(args.password)
        db.commit()
        print(f"[SUCCESS] Password for '{email}' reset successfully.")
    finally:
        db.close()


def handle_list_users(args):
    db = get_db()
    try:
        users = db.query(User).order_by(User.id.asc()).all()
        if not users:
            print("No users found.")
            return

        print(f"{'ID':<4} | {'Full Name':<20} | {'Email':<30} | {'Role':<12} | {'Active':<6} | {'Superuser':<9}")
        print("-" * 90)
        for u in users:
            print(f"{u.id:<4} | {u.full_name:<20} | {u.email:<30} | {u.role:<12} | {str(u.is_active):<6} | {str(u.is_superuser):<9}")
    finally:
        db.close()


def handle_init_db(args):
    Base.metadata.create_all(bind=engine)
    init_db_data()
    print("[SUCCESS] Database tables created and initial data initialized.")


def main():
    parser = argparse.ArgumentParser(description="Lotus Capital Management CLI")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # create-admin
    p_create = subparsers.add_parser("create-admin", help="Create a new admin user")
    p_create.add_argument("--name", required=True, help="Full Name")
    p_create.add_argument("--email", required=True, help="Email address")
    p_create.add_argument("--password", required=True, help="Password (min 8 chars)")
    p_create.add_argument(
        "--role",
        choices=["super_admin", "admin", "editor"],
        default="admin",
        help="User role (default: admin)",
    )

    # reset-password
    p_reset = subparsers.add_parser("reset-password", help="Reset password for an admin user")
    p_reset.add_argument("--email", required=True, help="Email address")
    p_reset.add_argument("--password", required=True, help="New password")

    # list-users
    subparsers.add_parser("list-users", help="List all admin users")

    # init-db
    subparsers.add_parser("init-db", help="Initialize database schema and seed data")

    args = parser.parse_args()
    if args.command == "create-admin":
        handle_create_admin(args)
    elif args.command == "reset-password":
        handle_reset_password(args)
    elif args.command == "list-users":
        handle_list_users(args)
    elif args.command == "init-db":
        handle_init_db(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
