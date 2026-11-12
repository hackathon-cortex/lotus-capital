import io
import pytest
from app.models.user import User
from app.core.security import get_password_hash, generate_totp_secret, verify_totp
import pyotp


def test_rohini_enquiry_submission_valid(client):
    payload = {
        "name": "City General Hospital",
        "mobile": "9876543210",
        "email": "admin@cityhospital.org",
        "service": "rohini-cashless-empanelment",
        "service_detail": ["rohini-cashless-empanelment"],
        "organisation_name": "City General Hospital & Trauma Centre",
        "city": "Godhra",
        "existing_rohini_id": "8900012345678",
        "contact_method": "phone",
        "message": "Assistance needed with cashless empanelment with TPAs.",
        "consent": True,
    }
    res = client.post("/api/v1/enquiries", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["success"] is True
    assert "LC-" in data["data"]["reference_id"]


def test_rohini_enquiry_invalid_rohini_id(client):
    payload = {
        "name": "Apollo Clinic",
        "mobile": "9876543210",
        "service": "rohini-cashless-empanelment",
        "organisation_name": "Apollo Clinic",
        "city": "Godhra",
        "existing_rohini_id": "12345",  # Less than 13 digits
        "consent": True,
    }
    res = client.post("/api/v1/enquiries", json=payload)
    assert res.status_code == 422


def test_csv_export_and_formula_injection_escaping(client, admin_token, db_session):
    # Submit an enquiry with formula characters
    payload = {
        "name": "=cmd|' /C calc'!A0",
        "mobile": "9825012345",
        "service": "rohini-cashless-empanelment",
        "organisation_name": "@HospitalFormula",
        "city": "+GodhraCity",
        "existing_rohini_id": "1234567890123",
        "consent": True,
    }
    res = client.post("/api/v1/enquiries", json=payload)
    assert res.status_code == 201

    headers = {"Authorization": f"Bearer {admin_token}"}
    export_res = client.get("/api/v1/admin/enquiries/export", headers=headers)
    assert export_res.status_code == 200
    assert "text/csv" in export_res.headers["content-type"]
    content = export_res.text

    # Header check
    assert "Organisation Name,City,ROHINI ID" in content
    # Formula escaping check: cells starting with =, +, -, @ must be prepended with a single quote
    assert "'=cmd|' /C calc'!A0" in content
    assert "'@HospitalFormula" in content
    assert "'+GodhraCity" in content
    assert "1234567890123" in content


def test_password_policy_enforcement(client, superadmin_token):
    headers = {"Authorization": f"Bearer {superadmin_token}"}
    # Short password (<12 chars)
    payload_short = {
        "full_name": "Short Pass User",
        "email": "shortpass@lotuscapital.in",
        "password": "Short123!",
        "role": "editor",
    }
    res = client.post("/api/v1/admin/users", json=payload_short, headers=headers)
    assert res.status_code == 422

    # Common password rejected
    payload_common = {
        "full_name": "Common Pass User",
        "email": "commonpass@lotuscapital.in",
        "password": "password123456",
        "role": "editor",
    }
    res = client.post("/api/v1/admin/users", json=payload_common, headers=headers)
    assert res.status_code == 422

    # Strong password accepted
    payload_strong = {
        "full_name": "Strong Pass User",
        "email": "strongpass@lotuscapital.in",
        "password": "StrongLotusAuth@2026",
        "role": "editor",
    }
    res = client.post("/api/v1/admin/users", json=payload_strong, headers=headers)
    assert res.status_code == 201


def test_mfa_enrollment_and_validation_flow(client, db_session, admin_user):
    # Set known password on admin_user
    admin_user.password_hash = get_password_hash("AdminSecurePass@2026")
    admin_user.mfa_enabled = False
    admin_user.mfa_secret = None
    db_session.commit()

    # 1. Login to get initial token
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": admin_user.email, "password": "AdminSecurePass@2026"},
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Setup MFA
    setup_res = client.post("/api/v1/auth/mfa/setup", headers=headers)
    assert setup_res.status_code == 200
    setup_data = setup_res.json()["data"]
    assert "secret" in setup_data
    assert "qr_code" in setup_data
    secret = setup_data["secret"]

    # 3. Verify and Enable MFA with valid TOTP code
    totp = pyotp.TOTP(secret)
    current_code = totp.now()
    verify_res = client.post(
        "/api/v1/auth/mfa/verify",
        headers=headers,
        json={"code": current_code},
    )
    assert verify_res.status_code == 200
    verify_data = verify_res.json()["data"]
    assert verify_data["success"] is True
    assert len(verify_data["recovery_codes"]) == 8
    recovery_code = verify_data["recovery_codes"][0]

    # 4. Next login requires MFA challenge
    mfa_login_res = client.post(
        "/api/v1/auth/login",
        json={"email": admin_user.email, "password": "AdminSecurePass@2026"},
    )
    assert mfa_login_res.status_code == 200
    mfa_data = mfa_login_res.json()
    assert mfa_data["mfa_required"] is True
    assert "mfa_token" in mfa_data
    mfa_token = mfa_data["mfa_token"]

    # 5. Complete login with recovery code
    val_res = client.post(
        "/api/v1/auth/mfa/validate",
        json={"mfa_token": mfa_token, "code": recovery_code},
    )
    assert val_res.status_code == 200
    assert "access_token" in val_res.json()


def test_magic_byte_file_upload_validation(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}

    # Spoofed file: .jpg name and image/jpeg header, but content is text/plain
    fake_jpeg = io.BytesIO(b"This is not a real JPEG image file.")
    res = client.post(
        "/api/v1/admin/media/upload",
        headers=headers,
        files={"file": ("fake.jpg", fake_jpeg, "image/jpeg")},
    )
    assert res.status_code == 400
    assert "does not match declared type" in res.json()["message"]

    # Genuine JPEG: starts with \xFF\xD8\xFF
    real_jpeg = io.BytesIO(b"\xff\xd8\xff\xe0\x00\x10JFIF" + b"\x00" * 30)
    res_real = client.post(
        "/api/v1/admin/media/upload",
        headers=headers,
        files={"file": ("real.jpg", real_jpeg, "image/jpeg")},
    )
    assert res_real.status_code == 201

    # Malicious SVG with embedded script
    malicious_svg = io.BytesIO(b'<svg xmlns="http://www.w3.org/2000/svg"><script>alert("xss")</script></svg>')
    res_svg = client.post(
        "/api/v1/admin/media/upload",
        headers=headers,
        files={"file": ("malicious.svg", malicious_svg, "image/svg+xml")},
    )
    assert res_svg.status_code == 400


def test_rbac_endpoint_matrix(client, db_session):
    # Anonymous: 401 on admin endpoints
    assert client.get("/api/v1/admin/users").status_code == 401
    assert client.get("/api/v1/admin/audit-logs").status_code == 401
    assert client.get("/api/v1/admin/enquiries/export").status_code == 401

    # Create Staff (editor) user
    editor = User(
        full_name="Staff Editor",
        email="editor_test@lotuscapital.in",
        password_hash=get_password_hash("EditorPass@2026"),
        role="editor",
        is_active=True,
    )
    db_session.add(editor)
    db_session.commit()

    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": editor.email, "password": "EditorPass@2026"},
    )
    editor_token = login_res.json()["access_token"]
    editor_headers = {"Authorization": f"Bearer {editor_token}"}

    # Staff / Editor: 403 on admin-only endpoints
    assert client.get("/api/v1/admin/users", headers=editor_headers).status_code == 403
    assert client.get("/api/v1/admin/audit-logs", headers=editor_headers).status_code == 403
    assert client.get("/api/v1/admin/enquiries/export", headers=editor_headers).status_code == 403
    assert client.patch("/api/v1/admin/statistics/1", json={"label": "New"}, headers=editor_headers).status_code == 403

    # Staff / Editor: 200 on editor permitted endpoints
    assert client.get("/api/v1/admin/dashboard", headers=editor_headers).status_code == 200
    assert client.get("/api/v1/admin/enquiries", headers=editor_headers).status_code == 200
