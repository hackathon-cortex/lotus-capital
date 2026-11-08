import time
import uuid
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Dict, Set
import jwt
from passlib.context import CryptContext
from app.core.config import settings

# Password hashing with Argon2
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

# Revoked tokens set (token string or jti)
_revoked_tokens: Set[str] = set()

# Login attempt rate limiting tracker: key -> list of timestamp floats
_login_attempts: Dict[str, list] = defaultdict(list)
MAX_LOGIN_ATTEMPTS = 5
LOGIN_WINDOW_SECONDS = 900  # 15 minutes


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": now, "type": "access", "jti": uuid.uuid4().hex})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "iat": now, "type": "refresh", "jti": uuid.uuid4().hex})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_password_reset_token(email: str) -> str:
    now = datetime.now(timezone.utc)
    expire = now + timedelta(hours=1)
    to_encode = {"sub": email, "type": "reset", "exp": expire, "iat": now}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_password_reset_token(token: str) -> Optional[str]:
    try:
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if decoded.get("type") != "reset":
            return None
        return decoded.get("sub")
    except jwt.PyJWTError:
        return None


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    if is_token_revoked(token):
        return None
    try:
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        jti = decoded.get("jti")
        if jti and is_token_revoked(jti):
            return None
        return decoded
    except jwt.PyJWTError:
        return None


def revoke_token(token: str) -> None:
    _revoked_tokens.add(token)
    try:
        # Also decode unverified to extract jti
        unverified = jwt.decode(token, options={"verify_signature": False})
        jti = unverified.get("jti")
        if jti:
            _revoked_tokens.add(jti)
    except Exception:
        pass


def is_token_revoked(identifier: str) -> bool:
    return identifier in _revoked_tokens


def clear_revoked_tokens() -> None:
    _revoked_tokens.clear()


def record_failed_login(key: str) -> None:
    now = time.time()
    _login_attempts[key].append(now)
    # Prune old attempts
    _login_attempts[key] = [t for t in _login_attempts[key] if now - t < LOGIN_WINDOW_SECONDS]


def is_login_rate_limited(key: str) -> bool:
    now = time.time()
    valid_attempts = [t for t in _login_attempts[key] if now - t < LOGIN_WINDOW_SECONDS]
    _login_attempts[key] = valid_attempts
    return len(valid_attempts) >= MAX_LOGIN_ATTEMPTS


def clear_failed_logins(key: str) -> None:
    if key in _login_attempts:
        del _login_attempts[key]
