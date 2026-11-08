"""001_initial_schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-11-07 14:40:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. admin_users
    op.create_table(
        "admin_users",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("full_name", sa.String(length=100), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=32), server_default="editor", nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("1"), nullable=False),
        sa.Column("is_superuser", sa.Boolean(), server_default=sa.text("0"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("last_login_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_admin_users_email"), "admin_users", ["email"], unique=True)
    op.create_index(op.f("ix_admin_users_id"), "admin_users", ["id"], unique=False)

    # 2. enquiries
    op.create_table(
        "enquiries",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("reference_id", sa.String(length=32), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("mobile", sa.String(length=15), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("contact_method", sa.String(length=32), server_default="phone", nullable=False),
        sa.Column("message", sa.Text(), nullable=True),
        sa.Column("consent", sa.Boolean(), server_default=sa.text("1"), nullable=False),
        sa.Column("status", sa.String(length=32), server_default="new", nullable=False),
        sa.Column("assigned_to", sa.Integer(), nullable=True),
        sa.Column("admin_notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["assigned_to"], ["admin_users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_enquiries_id"), "enquiries", ["id"], unique=False)
    op.create_index(op.f("ix_enquiries_reference_id"), "enquiries", ["reference_id"], unique=True)
    op.create_index(op.f("ix_enquiries_mobile"), "enquiries", ["mobile"], unique=False)
    op.create_index(op.f("ix_enquiries_status"), "enquiries", ["status"], unique=False)
    op.create_index(op.f("ix_enquiries_created_at"), "enquiries", ["created_at"], unique=False)

    # 3. enquiry_services
    op.create_table(
        "enquiry_services",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("enquiry_id", sa.Integer(), nullable=False),
        sa.Column("service_slug", sa.String(length=64), nullable=False),
        sa.Column("service_detail", sa.String(length=255), nullable=True),
        sa.ForeignKeyConstraint(["enquiry_id"], ["enquiries.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_enquiry_services_id"), "enquiry_services", ["id"], unique=False)
    op.create_index(op.f("ix_enquiry_services_service_slug"), "enquiry_services", ["service_slug"], unique=False)

    # 4. statistics
    op.create_table(
        "statistics",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("statistic_key", sa.String(length=64), nullable=False),
        sa.Column("label", sa.String(length=128), nullable=False),
        sa.Column("value", sa.String(length=64), nullable=False),
        sa.Column("tier", sa.String(length=32), server_default="Tier A", nullable=False),
        sa.Column("approval_status", sa.String(length=32), server_default="pending", nullable=False),
        sa.Column("definition", sa.Text(), nullable=True),
        sa.Column("as_of_date", sa.Date(), nullable=True),
        sa.Column("approved_by", sa.Integer(), nullable=True),
        sa.Column("approved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["approved_by"], ["admin_users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_statistics_id"), "statistics", ["id"], unique=False)
    op.create_index(op.f("ix_statistics_statistic_key"), "statistics", ["statistic_key"], unique=True)

    # 5. contents
    op.create_table(
        "contents",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("content_type", sa.String(length=64), nullable=False),
        sa.Column("slug", sa.String(length=128), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("content_json", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=32), server_default="draft", nullable=False),
        sa.Column("created_by", sa.Integer(), nullable=True),
        sa.Column("updated_by", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["created_by"], ["admin_users.id"]),
        sa.ForeignKeyConstraint(["updated_by"], ["admin_users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_contents_id"), "contents", ["id"], unique=False)
    op.create_index(op.f("ix_contents_slug"), "contents", ["slug"], unique=False)
    op.create_index(op.f("ix_contents_status"), "contents", ["status"], unique=False)

    # 6. media
    op.create_table(
        "media",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("original_name", sa.String(length=255), nullable=False),
        sa.Column("file_path", sa.String(length=512), nullable=False),
        sa.Column("mime_type", sa.String(length=100), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("uploaded_by", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["uploaded_by"], ["admin_users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_media_id"), "media", ["id"], unique=False)

    # 7. audit_logs
    op.create_table(
        "audit_logs",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("action", sa.String(length=64), nullable=False),
        sa.Column("entity_type", sa.String(length=64), nullable=False),
        sa.Column("entity_id", sa.String(length=64), nullable=True),
        sa.Column("metadata_json", sa.Text(), nullable=True),
        sa.Column("ip_address", sa.String(length=64), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["admin_users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_audit_logs_id"), "audit_logs", ["id"], unique=False)
    op.create_index(op.f("ix_audit_logs_created_at"), "audit_logs", ["created_at"], unique=False)

    # 8. preview_tokens
    op.create_table(
        "preview_tokens",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("token", sa.String(length=64), nullable=False),
        sa.Column("content_id", sa.Integer(), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["content_id"], ["contents.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_preview_tokens_id"), "preview_tokens", ["id"], unique=False)
    op.create_index(op.f("ix_preview_tokens_token"), "preview_tokens", ["token"], unique=True)


def downgrade() -> None:
    op.drop_table("preview_tokens")
    op.drop_table("audit_logs")
    op.drop_table("media")
    op.drop_table("contents")
    op.drop_table("statistics")
    op.drop_table("enquiry_services")
    op.drop_table("enquiries")
    op.drop_table("admin_users")

