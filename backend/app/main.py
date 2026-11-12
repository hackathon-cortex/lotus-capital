

import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.exceptions import LotusException
from app.api.v1.api import api_router
from app.db.base import Base
from app.db.session import engine
from app.db.init_db import init_db_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup structured logging
    setup_logging()
    logger.info(f"Starting {settings.APP_NAME} in [{settings.ENVIRONMENT}] mode...")

    # Create tables if not exist (e.g. SQLite local development)
    Base.metadata.create_all(bind=engine)

    # Initialize default admin user & seed data
    init_db_data()

    yield
    logger.info(f"Shutting down {settings.APP_NAME}...")


is_prod = settings.ENVIRONMENT == "production"

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Official Backend & Enquiry Management API for Lotus Capital, Godhra, Gujarat, India.",
    docs_url=None if is_prod else "/docs",
    redoc_url=None if is_prod else "/redoc",
    openapi_url=None if is_prod else "/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware (strict allowlist from env, credentials only for allowed origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# Request ID, CSRF & Security Headers Middleware
@app.middleware("http")
async def security_and_request_id_middleware(request: Request, call_next):
    # 1. Generate or extract Request ID
    request_id = request.headers.get("X-Request-ID") or uuid.uuid4().hex
    request.state.request_id = request_id

    # 2. CSRF Verification for state-changing admin calls using cookies
    if request.method in ["POST", "PUT", "PATCH", "DELETE"] and request.url.path.startswith("/api/v1/admin"):
        has_auth_cookie = bool(
            request.cookies.get("lotus_refresh_token") or request.cookies.get("__Host-lotus_refresh_token")
        )
        if has_auth_cookie:
            origin = request.headers.get("origin")
            referer = request.headers.get("referer")
            allowed_origins = [o.rstrip("/") for o in settings.FRONTEND_ORIGINS]

            origin_valid = False
            if origin and any(origin.rstrip("/") == o for o in allowed_origins):
                origin_valid = True
            elif referer and any(referer.startswith(o) for o in allowed_origins):
                origin_valid = True

            if not origin_valid and (origin or referer):
                return JSONResponse(
                    status_code=status.HTTP_403_FORBIDDEN,
                    content={
                        "success": False,
                        "error_code": "CSRF_ORIGIN_REJECTED",
                        "message": "Cross-site request validation failed.",
                        "request_id": request_id,
                    },
                )

    start_time = time.time()
    response: Response = await call_next(request)
    duration_ms = round((time.time() - start_time) * 1000, 2)

    # 3. Attach comprehensive security headers & request ID
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    response.headers["Cross-Origin-Resource-Policy"] = "same-origin"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: https:; "
        "font-src 'self'; "
        "frame-src https://www.google.com https://maps.google.com; "
        "frame-ancestors 'none'; "
        "form-action 'self';"
    )
    response.headers["X-Process-Time-Ms"] = str(duration_ms)

    # Admin and authenticated API surface: noindex and no-cache
    if request.url.path.startswith("/api/v1/admin") or request.url.path.startswith("/admin"):
        response.headers["X-Robots-Tag"] = "noindex, nofollow"
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, private"

    # Log non-healthcheck requests
    if not request.url.path.endswith("/health"):
        logger.info(
            f"[{request_id}] {request.method} {request.url.path} -> {response.status_code} ({duration_ms}ms)"
        )

    return response


# Exception Handlers
@app.exception_handler(LotusException)
async def lotus_exception_handler(request: Request, exc: LotusException):
    req_id = getattr(request.state, "request_id", None)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error_code": exc.error_code,
            "message": exc.detail,
            "request_id": req_id,
        },
        headers=exc.headers,
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err.get("loc", []))
        errors.append(f"{field}: {err.get('msg')}")
    req_id = getattr(request.state, "request_id", None)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error_code": "VALIDATION_ERROR",
            "message": "Input validation failed.",
            "details": errors,
            "request_id": req_id,
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    req_id = getattr(request.state, "request_id", None)
    logger.error(
        f"[{req_id}] Unhandled exception at {request.method} {request.url.path}: {str(exc)}",
        exc_info=True,
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error_code": "INTERNAL_SERVER_ERROR",
            "message": "An internal server error occurred. Please try again later.",
            "request_id": req_id,
        },
    )


# Mount API Routers
app.include_router(api_router, prefix="/api/v1")


@app.get("/", tags=["Root"])
def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "documentation": "/docs",
        "health": "/api/v1/health",
    }


