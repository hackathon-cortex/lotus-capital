import os
from pathlib import Path
from typing import List, Optional

class Settings:
    PROJECT_NAME: str = "Lotus Capital API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Base workspace path
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent.parent
    CONTENT_DATA_DIR: Path = BASE_DIR / "content" / "data"
    CONTENT_PAGES_DIR: Path = BASE_DIR / "content" / "pages"
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    # Email notification settings
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_TLS: bool = os.getenv("SMTP_TLS", "true").lower() in ("true", "1", "yes")
    NOTIFICATION_EMAIL_TO: str = os.getenv("NOTIFICATION_EMAIL_TO", "lotuscapitalinfo@gmail.com")
    NOTIFICATION_EMAIL_FROM: str = os.getenv("NOTIFICATION_EMAIL_FROM", "no-reply@lotuscapital.in")

settings = Settings()
