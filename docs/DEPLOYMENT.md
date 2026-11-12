# Lotus Capital Production Deployment Guide

## 1. Architecture Overview

Lotus Capital is deployed as a two-tier containerized application:
- **Frontend Container (`lotus_frontend`):** Built from Node.js 20, served via an unprivileged Nginx instance on port 8080 (or mapped to 80/443 on the host). Handles static assets, gzip compression, SPA client-side routing, and security headers. Proxies `/api/` and `/uploads/` to the backend container.
- **Backend Container (`lotus_backend`):** FastAPI application running under Python 3.11 with Uvicorn worker processes. Connects to SQLite (local disk volume) or PostgreSQL.
- **Storage Volumes:**
  - `lotus_db`: Persistent volume for SQLite database storage (`/app/data`).
  - `lotus_uploads`: Persistent volume for uploaded media files (team photos, logos) (`/app/uploads`).

---

## 2. Environment Variables Reference

| Variable Name | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `ENVIRONMENT` | Yes | `production` | Set to `production` in live environments to enforce `__Host-` cookies and strict CSP. |
| `PROJECT_NAME` | No | `Lotus Capital API` | API service descriptor name. |
| `API_V1_STR` | No | `/api/v1` | Base API routing prefix. |
| `SECRET_KEY` | **Yes** | *None* | 64-character cryptographic hex string for signing JWT tokens. |
| `SECURITY_PASSWORD_PEPPER` | **Yes** | *None* | High-entropy random string for Argon2id password hashing pepper. |
| `CORS_ORIGINS` | **Yes** | `https://lotuscapital.in` | Comma-separated list of permitted origins for CORS and CSRF verification. |
| `DATABASE_URL` | Yes | `sqlite:////app/data/lotus_capital.db` | Database connection URL. For PostgreSQL: `postgresql://user:pass@host:5432/lotus_db`. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `720` | Session lifetime (12 hours). |
| `UPLOAD_DIR` | No | `/app/uploads` | Local directory for verified media attachments. |

### Generating Cryptographic Secrets
Run in your shell to generate production-grade keys:
```bash
# Generate SECRET_KEY
python3 -c "import secrets; print(secrets.token_hex(32))"

# Generate SECURITY_PASSWORD_PEPPER
python3 -c "import secrets; print(secrets.token_hex(32))"
```

---

## 3. Quickstart with Docker Compose

1. Clone the repository onto the production server.
2. Create your `.env` file in the project root:
   ```bash
   cp .env.example .env
   # Populate SECRET_KEY and SECURITY_PASSWORD_PEPPER
   ```
3. Build and launch the containers:
   ```bash
   docker compose up -d --build
   ```
4. Verify health status:
   ```bash
   docker compose ps
   curl -i http://localhost:8080/api/v1/health
   ```

---

## 4. Production Host Nginx & TLS (Reverse Proxy)

When deploying behind an external domain (e.g. `lotuscapital.in`), place an external Nginx or Caddy proxy in front of port 8080 with automated TLS via Certbot:

```nginx
server {
    listen 80;
    server_name lotuscapital.in www.lotuscapital.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name lotuscapital.in www.lotuscapital.in;

    ssl_certificate /etc/letsencrypt/live/lotuscapital.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lotuscapital.in/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

