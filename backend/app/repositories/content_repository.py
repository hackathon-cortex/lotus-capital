import json
from typing import Optional, List, Tuple
from sqlalchemy import select, and_
from sqlalchemy.orm import Session
from app.models.content import Content


class ContentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_public_by_slug(self, content_type: str, slug: str) -> Optional[Content]:
        query = select(Content).where(
            and_(
                Content.content_type == content_type,
                Content.slug == slug.strip().lower(),
                Content.status == "published",
            )
        )
        return self.db.execute(query).scalar_one_or_none()

    def list_public(self, content_type: str, skip: int = 0, limit: int = 50) -> List[Content]:
        query = (
            select(Content)
            .where(
                and_(
                    Content.content_type == content_type,
                    Content.status == "published",
                )
            )
            .order_by(Content.id.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(self.db.execute(query).scalars().all())

    def get_by_id(self, content_id: int) -> Optional[Content]:
        return self.db.get(Content, content_id)

    def get_by_type_and_slug(self, content_type: str, slug: str) -> Optional[Content]:
        query = select(Content).where(
            and_(
                Content.content_type == content_type,
                Content.slug == slug.strip().lower(),
            )
        )
        return self.db.execute(query).scalar_one_or_none()

    def list_admin(
        self,
        content_type: Optional[str] = None,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> Tuple[List[Content], int]:
        query = select(Content)
        conditions = []
        if content_type:
            conditions.append(Content.content_type == content_type)
        if status:
            conditions.append(Content.status == status)
        if conditions:
            query = query.where(and_(*conditions))

        total = len(list(self.db.execute(query).scalars().all()))
        items = list(
            self.db.execute(
                query.order_by(Content.id.desc()).offset(skip).limit(limit)
            ).scalars().all()
        )
        return items, total

    def create(self, content: Content) -> Content:
        self.db.add(content)
        self.db.commit()
        self.db.refresh(content)
        return content

    def update(self, content: Content) -> Content:
        self.db.commit()
        self.db.refresh(content)
        return content

