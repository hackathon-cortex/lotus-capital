import json
from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from app.models.content import Content
from app.repositories.content_repository import ContentRepository
from app.schemas.content import (
    ContentCreate,
    ContentUpdate,
    ContentRead,
    ContentPublicRead,
    ServicePublicRead,
    FAQPublicRead,
)
from app.core.exceptions import NotFoundException, BadRequestException
from app.core.config import settings
from app.services.audit_service import AuditService


class ContentService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = ContentRepository(db)

    def sync_from_json_if_empty(self):
        """Seed CMS contents from content/data/*.json files if table is empty."""
        existing, total = self.repo.list_admin(limit=1)
        if total > 0:
            return

        # Seed pages
        pages_file = settings.CONTENT_DATA_DIR / "pages.json"
        if pages_file.exists():
            try:
                with open(pages_file, "r", encoding="utf-8") as f:
                    pages = json.load(f)
                    for p in pages:
                        content = Content(
                            content_type="page",
                            slug=p["slug"],
                            title=p["title"],
                            content_json=json.dumps(p.get("content_json", {})),
                            status=p.get("status", "published"),
                        )
                        self.db.add(content)
            except Exception:
                pass

        # Seed insights
        insights_file = settings.CONTENT_DATA_DIR / "insights.json"
        if insights_file.exists():
            try:
                with open(insights_file, "r", encoding="utf-8") as f:
                    insights = json.load(f)
                    for item in insights:
                        content = Content(
                            content_type="insight",
                            slug=item["slug"],
                            title=item["title"],
                            content_json=json.dumps(item.get("content_json", {})),
                            status=item.get("status", "published"),
                        )
                        self.db.add(content)
            except Exception:
                pass

        # Seed FAQs
        faqs_file = settings.CONTENT_DATA_DIR / "faqs.json"
        if faqs_file.exists():
            try:
                with open(faqs_file, "r", encoding="utf-8") as f:
                    faqs = json.load(f)
                    for item in faqs:
                        content = Content(
                            content_type="faq",
                            slug=f"faq-{item['id']}",
                            title=item["question"],
                            content_json=json.dumps({"question": item["question"], "answer": item["answer"], "category": item.get("category", "General"), "order": item.get("order", 0)}),
                            status="published",
                        )
                        self.db.add(content)
            except Exception:
                pass

        try:
            self.db.commit()
        except Exception:
            self.db.rollback()

    def get_public_page(self, slug: str) -> ContentPublicRead:
        self.sync_from_json_if_empty()
        item = self.repo.get_public_by_slug("page", slug)
        if not item:
            raise NotFoundException(f"Page '{slug}' not found.")
        return ContentPublicRead(
            slug=item.slug,
            title=item.title,
            content_type=item.content_type,
            content_json=json.loads(item.content_json) if item.content_json else {},
            updated_at=item.updated_at,
        )

    def list_public_insights(self) -> List[ContentPublicRead]:
        self.sync_from_json_if_empty()
        items = self.repo.list_public("insight")
        return [
            ContentPublicRead(
                slug=i.slug,
                title=i.title,
                content_type=i.content_type,
                content_json=json.loads(i.content_json) if i.content_json else {},
                updated_at=i.updated_at,
            )
            for i in items
        ]

    def get_public_insight(self, slug: str) -> ContentPublicRead:
        self.sync_from_json_if_empty()
        item = self.repo.get_public_by_slug("insight", slug)
        if not item:
            raise NotFoundException(f"Insight article '{slug}' not found.")
        return ContentPublicRead(
            slug=item.slug,
            title=item.title,
            content_type=item.content_type,
            content_json=json.loads(item.content_json) if item.content_json else {},
            updated_at=item.updated_at,
        )

    def get_public_seo(self, slug: str) -> Dict[str, Any]:
        """Provides SEO metadata for a page."""
        self.sync_from_json_if_empty()
        item = self.repo.get_public_by_slug("page", slug)
        if not item:
            # Fallback default Lotus Capital SEO
            return {
                "title": f"Lotus Capital — {slug.replace('-', ' ').title()}",
                "description": "Financial services, Mutual Funds distribution, and insurance advisory based in Godhra, Gujarat, India.",
                "canonical_url": f"https://lotuscapital.in/{slug}",
            }
        parsed = json.loads(item.content_json) if item.content_json else {}
        return {
            "title": item.title,
            "description": parsed.get("meta_description", "Financial services in Godhra, Gujarat."),
            "canonical_url": f"https://lotuscapital.in/{slug}",
        }

    def get_services(self) -> List[ServicePublicRead]:
        services_file = settings.CONTENT_DATA_DIR / "services.json"
        if services_file.exists():
            try:
                with open(services_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    return [ServicePublicRead(**s) for s in data if s.get("active", True)]
            except Exception:
                pass
        return []

    def get_faqs(self) -> List[FAQPublicRead]:
        faqs_file = settings.CONTENT_DATA_DIR / "faqs.json"
        if faqs_file.exists():
            try:
                with open(faqs_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    return [FAQPublicRead(**item) for item in data]
            except Exception:
                pass
        return []

    def get_company_info(self) -> Dict[str, Any]:
        company_file = settings.CONTENT_DATA_DIR / "company.json"
        if company_file.exists():
            try:
                with open(company_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {
            "name": "Lotus Capital",
            "city": "Godhra, Gujarat, India",
            "disclaimer": "Mutual fund investments are subject to market risks.",
        }

    def list_admin_content(
        self,
        content_type: Optional[str] = None,
        status: Optional[str] = None,
        page: int = 1,
        page_size: int = 50,
    ) -> Tuple[List[ContentRead], int]:
        self.sync_from_json_if_empty()
        skip = (page - 1) * page_size
        items, total = self.repo.list_admin(
            content_type=content_type,
            status=status,
            skip=skip,
            limit=page_size,
        )
        return [
            ContentRead(
                id=i.id,
                content_type=i.content_type,
                slug=i.slug,
                title=i.title,
                content_json=json.loads(i.content_json) if i.content_json else {},
                status=i.status,
                created_by=i.created_by,
                updated_by=i.updated_by,
                created_at=i.created_at,
                updated_at=i.updated_at,
            )
            for i in items
        ], total

    def create_content(
        self,
        payload: ContentCreate,
        user_id: int,
        ip_address: Optional[str] = None,
    ) -> ContentRead:
        existing = self.repo.get_by_type_and_slug(payload.content_type, payload.slug)
        if existing:
            raise BadRequestException(f"Content with slug '{payload.slug}' already exists for type '{payload.content_type}'.")

        content = Content(
            content_type=payload.content_type,
            slug=payload.slug.strip().lower(),
            title=payload.title,
            content_json=json.dumps(payload.content_json),
            status=payload.status,
            created_by=user_id,
            updated_by=user_id,
        )
        created = self.repo.create(content)

        AuditService.log_action(
            db=self.db,
            action="CONTENT_CREATED",
            entity_type="content",
            entity_id=str(created.id),
            user_id=user_id,
            metadata={"slug": created.slug, "status": created.status},
            ip_address=ip_address,
        )

        return ContentRead(
            id=created.id,
            content_type=created.content_type,
            slug=created.slug,
            title=created.title,
            content_json=json.loads(created.content_json),
            status=created.status,
            created_by=created.created_by,
            updated_by=created.updated_by,
            created_at=created.created_at,
            updated_at=created.updated_at,
        )

    def update_content(
        self,
        content_id: int,
        payload: ContentUpdate,
        user_id: int,
        ip_address: Optional[str] = None,
    ) -> ContentRead:
        content = self.repo.get_by_id(content_id)
        if not content:
            raise NotFoundException(f"Content with ID {content_id} not found.")

        if payload.title is not None:
            content.title = payload.title
        if payload.content_json is not None:
            content.content_json = json.dumps(payload.content_json)
        if payload.status is not None:
            content.status = payload.status

        content.updated_by = user_id
        updated = self.repo.update(content)

        AuditService.log_action(
            db=self.db,
            action="CONTENT_UPDATED",
            entity_type="content",
            entity_id=str(updated.id),
            user_id=user_id,
            metadata={"status": updated.status},
            ip_address=ip_address,
        )

        return ContentRead(
            id=updated.id,
            content_type=updated.content_type,
            slug=updated.slug,
            title=updated.title,
            content_json=json.loads(updated.content_json),
            status=updated.status,
            created_by=updated.created_by,
            updated_by=updated.updated_by,
            created_at=updated.created_at,
            updated_at=updated.updated_at,
        )
