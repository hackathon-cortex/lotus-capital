# Lotus Capital — Official Backend & Enquiry Management System

Production-ready backend for Lotus Capital, a financial services business located in Godhra, Gujarat, India.

## Technology Stack
- **Language**: Python 3.9+ (optimized for Python 3.12+)
- **Framework**: FastAPI
- **Validation**: Pydantic v2
- **ORM & Migrations**: SQLAlchemy 2.0 & Alembic
- **Database**: PostgreSQL (Production) / SQLite (Development & Pytest Testing)
- **Security**: Argon2 Password Hashing, JWT Bearer Tokens, RBAC Guards, CORS Middleware
- **Testing**: pytest & httpx TestClient

## Quick Start
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Seed initial data and super-admin
python -m app.db.init_db

# Start development server
uvicorn app.main:app --reload --port 8000
```

- API Documentation (Swagger): http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health Check: http://localhost:8000/api/v1/health
