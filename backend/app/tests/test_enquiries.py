def test_valid_enquiry_submission(client):
    payload = {
        "name": "Rajesh Kumar",
        "mobile": "9876543210",
        "email": "rajesh@example.com",
        "contact_method": "phone",
        "service_detail": ["mutual-funds", "health-insurance"],
        "message": "Interested in long term SIPs.",
        "consent": True,
    }
    response = client.post("/api/v1/enquiries", json=payload)
    assert response.status_code == 201
    res_data = response.json()
    assert res_data["success"] is True
    assert "LC-" in res_data["data"]["reference_id"]
    assert res_data["data"]["status"] == "new"

    # Verify thank you page verification endpoint
    ref_id = res_data["data"]["reference_id"]
    v_res = client.get(f"/api/v1/enquiries/verify-ref/{ref_id}")
    assert v_res.status_code == 200
    assert v_res.json()["valid"] is True


def test_invalid_mobile_rejection(client):
    # Starts with 5 (invalid in India)
    payload = {
        "name": "Invalid Phone User",
        "mobile": "5123456789",
        "contact_method": "phone",
        "service_detail": ["mutual-funds"],
        "consent": True,
    }
    response = client.post("/api/v1/enquiries", json=payload)
    assert response.status_code == 422


def test_missing_consent_rejection(client):
    payload = {
        "name": "No Consent User",
        "mobile": "9876543211",
        "contact_method": "phone",
        "service_detail": ["mutual-funds"],
        "consent": False,
    }
    response = client.post("/api/v1/enquiries", json=payload)
    assert response.status_code == 422


def test_invalid_service_slug(client):
    payload = {
        "name": "Invalid Service",
        "mobile": "9876543212",
        "contact_method": "phone",
        "service_detail": ["crypto-trading-bot"],
        "consent": True,
    }
    response = client.post("/api/v1/enquiries", json=payload)
    assert response.status_code == 400
    assert "Invalid service selection" in response.json()["message"]


def test_duplicate_submission_prevention(client):
    payload = {
        "name": "Spam Tester",
        "mobile": "9876543213",
        "contact_method": "phone",
        "service_detail": ["mutual-funds"],
        "consent": True,
    }
    # First submit succeeds
    res1 = client.post("/api/v1/enquiries", json=payload)
    assert res1.status_code == 201

    # Immediate second submit from same mobile is rejected
    res2 = client.post("/api/v1/enquiries", json=payload)
    assert res2.status_code == 400
    assert "recently submitted" in res2.json()["message"]


def test_admin_enquiry_workflow(client, admin_token):
    # 1. Create an enquiry
    submit_res = client.post(
        "/api/v1/enquiries",
        json={
            "name": "Admin Workflow User",
            "mobile": "9876543214",
            "contact_method": "whatsapp",
            "service_detail": ["tax-planning"],
            "consent": True,
        },
    )
    ref_id = submit_res.json()["data"]["reference_id"]

    # 2. List enquiries as admin
    headers = {"Authorization": f"Bearer {admin_token}"}
    list_res = client.get("/api/v1/admin/enquiries?search=Admin%20Workflow", headers=headers)
    assert list_res.status_code == 200
    items = list_res.json()["items"]
    assert len(items) >= 1
    enquiry_id = items[0]["id"]

    # 3. Update enquiry status
    patch_res = client.patch(
        f"/api/v1/admin/enquiries/{enquiry_id}",
        json={"status": "in_progress", "admin_notes": "Called client, scheduled visit."},
        headers=headers,
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["data"]["status"] == "in_progress"
    assert "Called client" in patch_res.json()["data"]["admin_notes"]
