from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.user import User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.get(User, user_id)

    def get_by_email(self, email: str) -> Optional[User]:
        query = select(User).where(User.email == email.strip().lower())
        return self.db.execute(query).scalar_one_or_none()

    def list_users(self, skip: int = 0, limit: int = 50) -> List[User]:
        query = select(User).order_by(User.id.desc()).offset(skip).limit(limit)
        return list(self.db.execute(query).scalars().all())

    def create(self, user: User) -> User:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, user: User) -> User:
        self.db.commit()
        self.db.refresh(user)
        return user
