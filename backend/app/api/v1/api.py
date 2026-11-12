from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    enquiries,
    statistics,
    services,
    content,
    auth,
    admin,
    media,
    seo,
    audit,
)

api_router = APIRouter()

# Public Endpoints
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(enquiries.router, tags=["Enquiries"])
api_router.include_router(statistics.router, tags=["Statistics"])
api_router.include_router(services.router, tags=["Services"])
api_router.include_router(content.router, tags=["Content"])
api_router.include_router(seo.router, tags=["SEO"])

# Authentication
api_router.include_router(auth.router, tags=["Auth"])

# Admin & Management
api_router.include_router(admin.router, tags=["Admin"])
api_router.include_router(media.router, tags=["Media"])
api_router.include_router(audit.router, tags=["Audit"])

