from app.core.security import create_password_reset_token, clear_failed_logins


def test_auth_login_success(client, admin_user):
    payload = {
        "email": admin_user.email,
        "password": "AdminPass123!",
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["email"] == admin_user.email


def test_auth_login_invalid_password(client, admin_user):
    payload = {
        "email": admin_user.email,
        "password": "WrongPassword999!",
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["message"]


def test_auth_inactive_user_blocked(client, db_session, admin_user):
    admin_user.is_active = False
    db_session.commit()

    payload = {
        "email": admin_user.email,
        "password": "AdminPass123!",
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 403
    assert "deactivated" in response.json()["message"]


def test_auth_token_refresh(client, admin_user):
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": admin_user.email, "password": "AdminPass123!"},
    )
    refresh_token = login_res.json()["refresh_token"]

    refresh_res = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert refresh_res.status_code == 200
    data = refresh_res.json()
    assert "access_token" in data
    assert "refresh_token" in data


def test_auth_me_endpoint(client, admin_token, admin_user):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == admin_user.email


def test_auth_change_password(client, admin_user):
    # 1. Login to get token
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": admin_user.email, "password": "AdminPass123!"},
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Change password
    change_res = client.post(
        "/api/v1/auth/change-password",
        json={"old_password": "AdminPass123!", "new_password": "BrandNewAdminPass456!"},
        headers=headers,
    )
    assert change_res.status_code == 200

    # 3. Old password fails
    old_login = client.post(
        "/api/v1/auth/login",
        json={"email": admin_user.email, "password": "AdminPass123!"},
    )
    assert old_login.status_code == 401

    # 4. New password succeeds
    new_login = client.post(
        "/api/v1/auth/login",
        json={"email": admin_user.email, "password": "BrandNewAdminPass456!"},
    )
    assert new_login.status_code == 200


def test_auth_logout_revocation(client, admin_user):
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": admin_user.email, "password": "AdminPass123!"},
    )
    assert login_res.status_code == 200
    access_token = login_res.json()["access_token"]
    refresh_token = login_res.json()["refresh_token"]

    headers = {"Authorization": f"Bearer {access_token}"}
    logout_res = client.post(
        "/api/v1/auth/logout",
        json={"refresh_token": refresh_token},
        headers=headers,
    )
    assert logout_res.status_code == 200

    # Revoked access token fails on protected endpoints
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 401


def test_auth_forgot_and_reset_password(client, admin_user):
    # 1. Request reset
    forgot_res = client.post("/api/v1/auth/forgot-password", json={"email": admin_user.email})
    assert forgot_res.status_code == 200

    # 2. Reset with generated token
    token = create_password_reset_token(admin_user.email)
    reset_res = client.post(
        "/api/v1/auth/reset-password",
        json={"token": token, "new_password": "ResetPassSuccess789!"},
    )
    assert reset_res.status_code == 200

    # 3. Login with reset password
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": admin_user.email, "password": "ResetPassSuccess789!"},
    )
    assert login_res.status_code == 200


def test_auth_register_and_login(client):
    reg_payload = {
        "full_name": "New Admin Member",
        "email": "newmember@lotuscapital.in",
        "password": "SecurePassword123#",
        "role": "admin",
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 201
    assert reg_res.json()["data"]["email"] == "newmember@lotuscapital.in"

    # Login with newly registered credentials
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "newmember@lotuscapital.in", "password": "SecurePassword123#"},
    )
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()


def test_auth_login_mfa_disabled_payload_structure(client, admin_user):
    """Verify that an admin without MFA gets a clean TokenResponse with mfa_token: null."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": admin_user.email, "password": "AdminPass123!"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["mfa_required"] is False
    assert data["mfa_token"] is None
    assert data["access_token"] is not None
    assert data["refresh_token"] is not None
    assert data["user"]["email"] == admin_user.email


def test_auth_mfa_complete_flow_and_validation(client, db_session, admin_user):
    """Verify complete MFA flow: setup, challenge, invalid code rejection, and successful validation."""
    from app.core.security import generate_totp_secret, generate_recovery_codes

    # 1. Enable MFA on admin_user
    secret = generate_totp_secret()
    plain_codes, hashed_codes_json = generate_recovery_codes(8)
    recovery_code = plain_codes[0]
    admin_user.mfa_secret = secret
    admin_user.mfa_enabled = True
    admin_user.recovery_codes = hashed_codes_json
    db_session.commit()

    # 2. Login returns challenge token, NO access token
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": admin_user.email, "password": "AdminPass123!"},
    )
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert login_data["mfa_required"] is True
    assert login_data["access_token"] is None
    assert login_data["user"] is None
    assert login_data["mfa_token"] is not None
    mfa_token = login_data["mfa_token"]

    # 3. Attempting to use mfa_token as Bearer access token must FAIL (cannot bypass MFA)
    bypass_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {mfa_token}"})
    assert bypass_res.status_code == 401

    # 4. Reject empty / whitespace / missing MFA token and code
    empty_token_res = client.post(
        "/api/v1/auth/mfa/validate",
        json={"mfa_token": "   ", "code": "123456"},
    )
    assert empty_token_res.status_code in [401, 422]

    empty_code_res = client.post(
        "/api/v1/auth/mfa/validate",
        json={"mfa_token": mfa_token, "code": "   "},
    )
    assert empty_code_res.status_code in [401, 422]

    # 5. Reject invalid code
    bad_code_res = client.post(
        "/api/v1/auth/mfa/validate",
        json={"mfa_token": mfa_token, "code": "INVALID_CODE_999"},
    )
    assert bad_code_res.status_code == 401
    assert "Invalid two-factor authentication code" in bad_code_res.json()["message"]

    # 6. Reject invalid mfa_token
    bad_token_res = client.post(
        "/api/v1/auth/mfa/validate",
        json={"mfa_token": "not.a.valid.jwt", "code": recovery_code},
    )
    assert bad_token_res.status_code == 401

    # 7. Valid recovery code successfully completes login
    validate_res = client.post(
        "/api/v1/auth/mfa/validate",
        json={"mfa_token": mfa_token, "code": recovery_code},
    )
    assert validate_res.status_code == 200
    val_data = validate_res.json()
    assert val_data["mfa_required"] is False
    assert val_data["mfa_token"] is None
    assert val_data["access_token"] is not None
    assert val_data["user"]["email"] == admin_user.email

    # 8. Replay attack: Re-using the same mfa_token must FAIL because it was revoked
    replay_res = client.post(
        "/api/v1/auth/mfa/validate",
        json={"mfa_token": mfa_token, "code": recovery_code},
    )
    assert replay_res.status_code == 401

    # 9. Verify access token works on protected endpoints
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {val_data['access_token']}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == admin_user.email
