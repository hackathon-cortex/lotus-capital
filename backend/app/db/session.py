import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from .models import Base

# Use in-memory SQLite by default (avoids OneDrive file sync locking), or configurable via DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///:memory:")

if "sqlite" in DATABASE_URL and ":memory:" in DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
elif "sqlite" in DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

init_db()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

