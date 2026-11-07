import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.dependencies.database import get_db
from app.main import app
from app.models.user import User
from app.models.statistic import Statistic
from app.models.content import Content
from app.core.security import get_password_hash
from app.core.security import create_access_token

# Use in-memory SQLite for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def superadmin_user(db_session):
    user = User(
        full_name="Super Admin User",
        email="superadmin@lotuscapital.in",
        password_hash=get_password_hash("SuperAdminPass123!"),
        role="super_admin",
        is_active=True,
        is_superuser=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def admin_user(db_session):
    user = User(
        full_name="Standard Admin",
        email="admin@lotuscapital.in",
        password_hash=get_password_hash("AdminPass123!"),
        role="admin",
        is_active=True,
        is_superuser=False,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def editor_user(db_session):
    user = User(
        full_name="Content Editor",
        email="editor@lotuscapital.in",
        password_hash=get_password_hash("EditorPass123!"),
        role="editor",
        is_active=True,
        is_superuser=False,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def superadmin_token(superadmin_user):
    return create_access_token({"sub": str(superadmin_user.id), "email": superadmin_user.email, "role": superadmin_user.role})


@pytest.fixture
def admin_token(admin_user):
    return create_access_token({"sub": str(admin_user.id), "email": admin_user.email, "role": admin_user.role})


@pytest.fixture
def editor_token(editor_user):
    return create_access_token({"sub": str(editor_user.id), "email": editor_user.email, "role": editor_user.role})
