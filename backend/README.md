# Lotus Capital — Backend Service

FastAPI-powered backend API and administrative enquiry management system for **Lotus Capital**, Godhra, Gujarat, India.

## Requirements
- Python 3.9+ (Python 3.12+ recommended)
- PostgreSQL (Production) or SQLite (Development & Pytest Testing)

## Environment Configuration
Copy `.env.example` to `.env` in the `backend/` directory:
```bash
cp .env.example .env
```

Key environment variables:
- `DATABASE_URL`: Connection string (e.g., `postgresql://user:pass@localhost:5432/lotus_capital_db` or `sqlite:///./lotus_capital.db`).
- `SECRET_KEY`: High-entropy key for signing JWTs.
- `FRONTEND_ORIGINS`: Comma-separated list of allowed origins (e.g. `http://localhost:5173`).
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`: SMTP credentials.
- `ENQUIRY_NOTIFICATION_EMAIL`: Recipient email for internal enquiry notifications.
- `MOCK_EMAIL`: Set to `true` during local development to log emails rather than sending.

## Local Development Setup

1. **Create and Activate Virtual Environment**:
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Apply Database Migrations**:
   ```bash
   alembic upgrade head
   ```

4. **Initialize Super Admin & Seed Data**:
   ```bash
   python -m app.db.init_db
   ```
   *Default super-admin credentials:*
   - **Email**: `admin@lotuscapital.in`
   - **Password**: `LotusAdmin@2026`

5. **Run Development Server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## API Documentation
- **Swagger Interactive UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Specification**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **OpenAPI Schema**: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

## Running Tests
Execute the automated test suite with pytest:
```bash
PYTHONPATH=. pytest app/tests -v
```

