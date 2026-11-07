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
