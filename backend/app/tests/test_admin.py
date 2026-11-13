def test_admin_dashboard_metrics(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.get("/api/v1/admin/dashboard", headers=headers)
    assert response.status_code == 200
    data = response.json()["data"]
    assert "total_enquiries" in data
    assert "service_breakdown" in data
    assert "monthly_trends" in data


def test_user_management_rbac(client, editor_token, superadmin_token):
    # 1. Editor is forbidden from listing or creating users
    editor_headers = {"Authorization": f"Bearer {editor_token}"}
    res_editor = client.get("/api/v1/admin/users", headers=editor_headers)
    assert res_editor.status_code == 403

    # 2. Superadmin can create and list users
    super_headers = {"Authorization": f"Bearer {superadmin_token}"}
    create_payload = {
        "full_name": "New Advisor",
        "email": "advisor@lotuscapital.in",
        "role": "admin",
        "password": "AdvisorPassword123!",
        "is_active": True,
    }
    res_create = client.post("/api/v1/admin/users", json=create_payload, headers=super_headers)
    assert res_create.status_code == 201
    new_user_id = res_create.json()["data"]["id"]

    # 3. Superadmin can update user role
    res_patch = client.patch(
        f"/api/v1/admin/users/{new_user_id}",
        json={"role": "editor"},
        headers=super_headers,
    )
    assert res_patch.status_code == 200
    assert res_patch.json()["data"]["role"] == "editor"



def test_admin_endpoints_require_authentication(client):
    admin_routes = [
        ("GET", "/api/v1/admin/dashboard"),
        ("GET", "/api/v1/admin/followups/count"),
        ("GET", "/api/v1/admin/enquiries"),
        ("GET", "/api/v1/admin/reports/conversion"),
        ("GET", "/api/v1/admin/users"),
        ("GET", "/api/v1/admin/audit-logs"),
        ("GET", "/api/v1/admin/statistics"),
        ("POST", "/api/v1/admin/media/upload"),
        ("GET", "/api/v1/auth/me"),
    ]
    for method, path in admin_routes:
        if method == "GET":
            res = client.get(path)
        else:
            res = client.post(path)
        assert res.status_code == 401, f"Expected 401 Unauthorized for anonymous {method} {path}, got {res.status_code}"
