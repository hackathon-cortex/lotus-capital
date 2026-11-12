import base64
import hashlib
import hmac
import io
import json
import os
import re
import secrets
import string
import time
import uuid
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Dict, Set, List, Tuple
import jwt
from passlib.context import CryptContext
import pyotp
import qrcode
from app.core.config import settings

# Password hashing with Argon2id primary, bcrypt fallback
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

# Optional server-side pepper from environment
PEPPER = os.getenv("SECURITY_PASSWORD_PEPPER", "")

# Precalculated dummy hash to ensure constant-time response for nonexistent users
DUMMY_ARGON2_HASH = "$argon2id$v=19$m=65536,t=3,p=4$dGVzdHNhbHQxMjM0NTY3OA$9vV0i8J8Bfx2Xp9yM4n1L8k5"

# Revoked tokens set (token string or jti)
_revoked_tokens: Set[str] = set()

# In-memory tracking for IP and account login rate limits
_ip_login_attempts: Dict[str, list] = defaultdict(list)
_account_login_attempts: Dict[str, list] = defaultdict(list)

MAX_IP_LOGIN_ATTEMPTS = 20
MAX_ACCOUNT_LOGIN_ATTEMPTS = 5
LOGIN_WINDOW_SECONDS = 900  # 15 minutes

# Top breached/common passwords list to prevent weak password usage
COMMON_PASSWORDS: Set[str] = {
    "password12345",
    "password123456",
    "admin12345678",
    "123456789012",
    "qwertyuiop12",
    "welcome123456",
    "lotuscapital1",
    "lotuscapital12",
    "lotuscapital2026",
    "administrator1",
    "changeme12345",
    "letmein123456",
    "passphrase1234",
    "iloveyou12345",
    "sunshine12345",
    "football12345",
    "master1234567",
    "superadmin123",
}


def validate_password_strength(password: str) -> None:
    """Enforces minimum 12 characters and blocks common/breached passwords."""
    if not password or len(password) < 12:
        raise ValueError("Password must be at least 12 characters long.")
    if password.lower() in COMMON_PASSWORDS:
        raise ValueError("This password is too common or known to be breached. Please choose a more unique password.")
    # Check simple repetitive sequences
    if re.search(r"^(.)\1+$", password):
        raise ValueError("Password cannot consist of a single repeated character.")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies password using Argon2id with pepper, falling back to unpeppered verification."""
    if PEPPER:
        if pwd_context.verify(plain_password + PEPPER, hashed_password):
            return True
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hashes password with Argon2id and optional server-side pepper."""
    to_hash = password + PEPPER if PEPPER else password
    return pwd_context.hash(to_hash)


def simulate_password_hash_timing() -> None:
    """Performs dummy verification to avoid timing attacks when account is unknown."""
    try:
        pwd_context.verify("invalid_probe_string", DUMMY_ARGON2_HASH)
    except Exception:
        pass


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": now, "type": "access", "jti": uuid.uuid4().hex})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire, "iat": now, "type": "refresh", "jti": uuid.uuid4().hex})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_mfa_pending_token(user_id: int, email: str) -> str:
    """Creates a short-lived token (5 minutes) for the second-factor TOTP challenge."""
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=5)
    to_encode = {
        "sub": str(user_id),
        "email": email,
        "type": "mfa_pending",
        "exp": expire,
        "iat": now,
        "jti": uuid.uuid4().hex,
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_password_reset_token(email: str) -> str:
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=15)
    to_encode = {"sub": email, "type": "reset", "exp": expire, "iat": now, "jti": uuid.uuid4().hex}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_password_reset_token(token: str) -> Optional[str]:
    if is_token_revoked(token):
        return None
    try:
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if decoded.get("type") != "reset":
            return None
        jti = decoded.get("jti")
        if jti and is_token_revoked(jti):
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


# Rate Limiting & Lockout
def record_failed_login(ip: Optional[str] = None, email: Optional[str] = None) -> None:
    now = time.time()
    if ip:
        _ip_login_attempts[ip].append(now)
        _ip_login_attempts[ip] = [t for t in _ip_login_attempts[ip] if now - t < LOGIN_WINDOW_SECONDS]
    if email:
        norm_email = email.strip().lower()
        _account_login_attempts[norm_email].append(now)
        _account_login_attempts[norm_email] = [t for t in _account_login_attempts[norm_email] if now - t < LOGIN_WINDOW_SECONDS]


def is_login_rate_limited(ip_or_key: Optional[str] = None, email: Optional[str] = None) -> bool:
    now = time.time()
    if ip_or_key:
        valid_ip = [t for t in _ip_login_attempts[ip_or_key] if now - t < LOGIN_WINDOW_SECONDS]
        _ip_login_attempts[ip_or_key] = valid_ip
        if len(valid_ip) >= MAX_IP_LOGIN_ATTEMPTS:
            return True
    if email:
        norm_email = email.strip().lower()
        valid_acc = [t for t in _account_login_attempts[norm_email] if now - t < LOGIN_WINDOW_SECONDS]
        _account_login_attempts[norm_email] = valid_acc
        if len(valid_acc) >= MAX_ACCOUNT_LOGIN_ATTEMPTS:
            return True
    return False


def clear_failed_logins(ip_or_key: Optional[str] = None, email: Optional[str] = None) -> None:
    if ip_or_key and ip_or_key in _ip_login_attempts:
        del _ip_login_attempts[ip_or_key]
    if email:
        norm_email = email.strip().lower()
        if norm_email in _account_login_attempts:
            del _account_login_attempts[norm_email]


# TOTP MFA helpers
def generate_totp_secret() -> str:
    return pyotp.random_base32()


def get_totp_uri(secret: str, email: str) -> str:
    return pyotp.totp.TOTP(secret).provisioning_uri(name=email, issuer_name="Lotus Capital")


def generate_qr_code_data_uri(provisioning_uri: str) -> str:
    import qrcode.image.svg
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=2,
        image_factory=qrcode.image.svg.SvgPathImage,
    )
    qr.add_data(provisioning_uri)
    qr.make(fit=True)
    img = qr.make_image()
    buf = io.BytesIO()
    img.save(buf)
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    return f"data:image/svg+xml;base64,{b64}"


def verify_totp(secret: str, code: str) -> bool:
    if not secret or not code:
        return False
    clean_code = re.sub(r"\s+", "", str(code))
    totp = pyotp.TOTP(secret)
    # Validates current and immediate adjacent time step (tolerance of 30s)
    return totp.verify(clean_code, valid_window=1)


def generate_recovery_codes(count: int = 8) -> Tuple[List[str], str]:
    """Generates 8 single-use alphanumeric recovery codes and stores their salted hashes."""
    plain_codes = []
    hashed_codes = []
    salt = secrets.token_hex(8)
    for _ in range(count):
        code = "".join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(10))
        plain_codes.append(code)
        h = hashlib.sha256(f"{salt}:{code}".encode()).hexdigest()
        hashed_codes.append(f"{salt}${h}")
    return plain_codes, json.dumps(hashed_codes)


def verify_and_consume_recovery_code(code: str, hashed_codes_json: Optional[str]) -> Tuple[bool, Optional[str]]:
    """Verifies a single-use recovery code and returns (is_valid, updated_json_without_consumed_code)."""
    if not hashed_codes_json or not code:
        return False, None
    try:
        stored_list = json.loads(hashed_codes_json)
        if not isinstance(stored_list, list):
            return False, None
    except Exception:
        return False, None

    clean_code = re.sub(r"\s+", "", code.upper())
    for idx, entry in enumerate(stored_list):
        if "$" in entry:
            salt, stored_hash = entry.split("$", 1)
            candidate_hash = hashlib.sha256(f"{salt}:{clean_code}".encode()).hexdigest()
            if hmac.compare_digest(stored_hash, candidate_hash):
                # Consume this code
                remaining = stored_list[:idx] + stored_list[idx + 1:]
                return True, json.dumps(remaining)
    return False, None


# CSRF token generator
def generate_csrf_token() -> str:
    return secrets.token_hex(32)


def hash_ip(ip: Optional[str]) -> str:
    """Anonymizes IP address to SHA-256 hash for privacy compliance under DPDP Act."""
    if not ip:
        return "unknown"
    salt = settings.SECRET_KEY[:16]
    return hashlib.sha256(f"{salt}:{ip}".encode()).hexdigest()[:16]
