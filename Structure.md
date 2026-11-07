# Lotus Capital — Project Structure

```
Lotus_backend/
├── 00-client-data-register.md       # Client business facts, disclaimers, data registry
├── README.md                        # Master repository documentation
├── CODEBASE_GUIDE.md                # Engineering handbook and architectural rules
├── Structure.md                     # File layout and module dependencies
├── Api_end_points.md                # REST API contract specification
├── Design.md                        # Architectural decisions & security design
├── content/
│   └── data/
│       ├── services.json            # Approved financial service offerings
│       ├── statistics.json          # Tiered statistical disclosures
│       ├── company.json             # Corporate facts, Godhra address, AMFI notice
│       ├── faqs.json                # Regulatory and service FAQs
│       ├── pages.json               # Seed CMS pages (About, Home, Services)
│       └── insights.json            # Educational market insight articles
├── docs/
│   ├── BACKEND_IMPLEMENTATION_PLAN.md # Comprehensive execution blueprint
│   └── BACKEND_API_REFERENCE.md       # Deep API reference documentation
├── backend/
│   ├── alembic/                     # Database migrations
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   │       └── 001_initial_schema.py
│   ├── alembic.ini                  # Alembic migration configuration
│   ├── requirements.txt             # Python dependencies
│   ├── .env.example                 # Environment variables blueprint
│   ├── README.md                    # Backend startup and development guide
│   └── app/
│       ├── __init__.py
│       ├── main.py                  # FastAPI application entry point
│       ├── core/
│       │   ├── config.py            # Pydantic Settings
│       │   ├── security.py          # Argon2 hashing, JWT sign/verify
│       │   ├── permissions.py       # RBAC guards & role checkers
│       │   ├── exceptions.py        # Centralized HTTP & domain error handlers
│       │   └── logging.py           # Structured request-ID aware logging
│       ├── db/
│       │   ├── base.py              # DeclarativeBase & table imports
│       │   ├── session.py           # Engine & SessionLocal maker
│       │   └── init_db.py           # DB bootstrapper & super-admin seed
│       ├── models/
│       │   ├── user.py              # User SQLAlchemy model
│       │   ├── enquiry.py           # Enquiry model
│       │   ├── enquiry_service.py   # Many-to-one service association
│       │   ├── statistic.py         # Tiered statistics model
│       │   ├── content.py           # CMS pages, insights, FAQs model
│       │   ├── media.py             # Media assets metadata
│       │   ├── audit_log.py         # Security & state change audit log
│       │   └── preview_token.py     # CMS preview tokens
│       ├── schemas/
│       │   ├── auth.py              # Login, token, user schemas
│       │   ├── enquiry.py           # Submission & admin enquiry schemas
│       │   ├── statistics.py        # Public & admin statistics schemas
│       │   ├── content.py           # CMS content schemas
│       │   ├── admin.py             # Dashboard & audit log schemas
│       │   └── common.py            # Pagination & generic response envelopes
│       ├── repositories/
│       │   ├── user_repository.py
│       │   ├── enquiry_repository.py
│       │   ├── statistics_repository.py
│       │   └── content_repository.py
│       ├── services/
│       │   ├── auth_service.py
│       │   ├── enquiry_service.py
│       │   ├── statistics_service.py
│       │   ├── content_service.py
│       │   ├── email_service.py     # SMTP & mock email notifications
│       │   ├── media_service.py
│       │   └── audit_service.py
│       ├── dependencies/
│       │   ├── database.py          # get_db dependency
│       │   └── auth.py              # get_current_user & role deps
│       ├── api/
│       │   └── v1/
│       │       ├── api.py           # Root router aggregator
│       │       └── endpoints/
│       │           ├── health.py
│       │           ├── enquiries.py
│       │           ├── statistics.py
│       │           ├── services.py
│       │           ├── content.py
│       │           ├── auth.py
│       │           ├── admin.py
│       │           ├── media.py
│       │           ├── seo.py
│       │           └── audit.py
│       └── tests/
│           ├── conftest.py
│           ├── test_health.py
│           ├── test_enquiries.py
│           ├── test_statistics.py
│           ├── test_auth.py
│           ├── test_admin.py
│           └── test_content.py
```
