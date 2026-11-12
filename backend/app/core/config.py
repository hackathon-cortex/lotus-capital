import os
from pathlib import Path
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    APP_NAME: str = "Lotus Capital API"
    PROJECT_NAME: str = "Lotus Capital API"
    APP_VERSION: str = "1.0.0"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str = "temporary-development-secret-key-32-chars-minimum-lotus-capital"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database
    DATABASE_URL: str = "sqlite:///./lotus_capital.db"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_database_url(cls, v: str) -> str:
        if v == "sqlite:///./lotus_capital.db":
            db_path = (Path(__file__).resolve().parent.parent.parent / "lotus_capital.db").resolve()
            return f"sqlite:///{db_path.as_posix()}"
        return v

    # CORS
    FRONTEND_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    @field_validator("FRONTEND_ORIGINS", "CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_TLS: bool = True
    EMAIL_FROM: str = "notifications@lotuscapital.in"
    NOTIFICATION_EMAIL_FROM: str = "notifications@lotuscapital.in"
    ENQUIRY_NOTIFICATION_EMAIL: str = "admin@lotuscapital.in"
    NOTIFICATION_EMAIL_TO: str = "admin@lotuscapital.in"
    MOCK_EMAIL: bool = True

    # Static data paths
    PROJECT_ROOT: Path = Path(__file__).resolve().parent.parent.parent
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    CONTENT_DATA_DIR: Path = Path(__file__).resolve().parent.parent.parent / "content" / "data"
    CONTENT_PAGES_DIR: Path = Path(__file__).resolve().parent.parent.parent / "content" / "pages"
    UPLOAD_DIR: Path = Path(__file__).resolve().parent.parent.parent / "uploads"

    @field_validator("CONTENT_DATA_DIR", "CONTENT_PAGES_DIR", "UPLOAD_DIR", "PROJECT_ROOT", "BASE_DIR", mode="before")
    @classmethod
    def assemble_paths(cls, v: Union[str, Path]) -> Path:
        p = Path(v) if isinstance(v, str) else v
        if not p.exists():
            root_cand = Path(__file__).resolve().parent.parent.parent.parent
            if "content" in p.parts:
                idx = p.parts.index("content")
                cand = root_cand.joinpath(*p.parts[idx:])
                if cand.exists():
                    return cand
            elif "uploads" in p.parts:
                cand = root_cand / "uploads"
                if cand.exists():
                    return cand
        return p


settings = Settings()
