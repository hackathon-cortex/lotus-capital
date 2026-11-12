# Lotus Capital Operational Runbook

**Audience:** System Administrators & Site Reliability Engineers  
**System:** Lotus Capital Production Cluster  

---

## 1. Account Lockout Remediation

When an administrator exceeds 5 failed login attempts within a 15-minute window, the account is temporarily locked to prevent brute-force credential stuffing.

### Diagnosing a Lockout
Inspect the authentication logs:
```bash
docker compose logs backend | grep -i "failed login"
```

### Unlocking an Account
Run an interactive Python shell inside the backend container to clear the lockout counter:
```bash
docker compose exec backend python -c "
from app.db.session import SessionLocal
from app.models.user import User

db = SessionLocal()
user = db.query(User).filter(User.email == 'admin@lotuscapital.in').first()
if user:
    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()
    print('Account unlocked successfully.')
else:
    print('User not found.')
"
```

---

## 2. Multi-Factor Authentication (MFA) Recovery

If an administrator loses access to their TOTP authenticator device:

### Option A: Use a One-Time Recovery Code
1. On the admin login page, enter email and password.
2. At the MFA verification screen, click *"Use a backup recovery code"*.
3. Enter one of the 8 recovery codes provided during MFA enrollment. The code will be verified against its SHA-256 hash and permanently invalidated.

### Option B: Administrative MFA Reset
If all recovery codes are exhausted, a super-admin can reset MFA for the affected user via CLI:
```bash
docker compose exec backend python -c "
from app.db.session import SessionLocal
from app.models.user import User

db = SessionLocal()
user = db.query(User).filter(User.email == 'user@lotuscapital.in').first()
if user:
    user.is_mfa_enabled = False
    user.mfa_secret = None
    user.mfa_recovery_codes = '[]'
    db.commit()
    print('MFA reset for user. User will re-enroll on next login.')
"
```

---

## 3. Emergency Global Session Invalidation

In the event of suspected token compromise or credential breach, invalidate all active user sessions across the system:

```bash
docker compose exec backend python -c "
from app.db.session import SessionLocal
from app.models.user import User

db = SessionLocal()
users = db.query(User).all()
for u in users:
    u.session_version = (u.session_version or 1) + 1
db.commit()
print(f'Bumped session version for {len(users)} users. All existing JWT tokens are now invalid.')
"
```

---

## 4. Database Backup & Restore

### SQLite Backups (Default Setup)
The SQLite database resides in the `lotus_db` volume mounted at `/app/data/lotus_capital.db`.

**Automated Online Backup:**
```bash
# Safe hot backup using SQLite online backup API
docker compose exec backend python -c "
import sqlite3, datetime
src = sqlite3.connect('/app/data/lotus_capital.db')
ts = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
dst = sqlite3.connect(f'/app/data/backup_lotus_{ts}.db')
with dst:
    src.backup(dst)
print(f'Backup created: backup_lotus_{ts}.db')
"

# Copy backup to external host storage
docker compose cp backend:/app/data/backup_lotus_*.db ./backups/
```

**Restoration:**
```bash
docker compose stop backend
docker compose run --rm -v lotus_db:/app/data alpine cp /backup/backup_file.db /app/data/lotus_capital.db
docker compose start backend
```

---

## 5. Media Upload Storage Maintenance

Uploaded media (such as team member portraits and hospital certificates) is persisted in `/app/uploads`.

**Clean Orphaned Temp Files:**
```bash
docker compose exec backend find /app/uploads/temp -type f -mtime +1 -delete
```

