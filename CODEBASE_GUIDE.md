# Lotus Capital — Codebase Guide

## Architectural Philosophy
1. **Separation of Concerns**:
   - `models/`: Pure SQLAlchemy ORM schema definitions.
   - `schemas/`: Pydantic models for strict payload validation and response serialisation.
   - `repositories/`: Database query logic decoupled from business layer.
   - `services/`: Core business logic, compliance enforcement, orchestration, and transactional workflows.
   - `api/v1/endpoints/`: Thin routing handlers connecting incoming HTTP requests to services.
   - `core/`: Cross-cutting concerns including security, config, and exceptions.

2. **Compliance & Truth In Lending/Distributorship**:
   - Never expose unapproved or Tier C statistics to the public API.
   - Maintain authoritativeness of seed JSON data files (`content/data/*.json`) while enabling authenticated admin overrides via the database.
   - Mandatory consent and strict Indian phone number regex verification on all public enquiry submissions.
   - PII protection: In logs and error responses, never leak passwords, tokens, full phone numbers or customer sensitive notes.

3. **Database & Migration Integrity**:
   - Schema is managed by Alembic.
   - SQLite is supported out-of-the-box for rapid pytest test execution with zero external dependencies.
   - PostgreSQL is the production engine with connection pooling and strict foreign key integrity.
