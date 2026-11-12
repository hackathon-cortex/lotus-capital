def test_public_services_and_faqs(client):
    res_services = client.get("/api/v1/services")
    assert res_services.status_code == 200
    services = res_services.json()["data"]
    assert len(services) >= 1
    assert any(s["slug"] == "mutual-funds" for s in services)

    res_faqs = client.get("/api/v1/faqs")
    assert res_faqs.status_code == 200
    assert len(res_faqs.json()["data"]) >= 1


def test_draft_vs_published_content(client, editor_token):
    headers = {"Authorization": f"Bearer {editor_token}"}

    # 1. Editor creates a draft page
    create_payload = {
        "content_type": "page",
        "slug": "exclusive-wealth-strategy",
        "title": "Exclusive Wealth Strategy",
        "content_json": {"intro": "Private draft content"},
        "status": "draft",
    }
    create_res = client.post("/api/v1/admin/content", json=create_payload, headers=headers)
    assert create_res.status_code == 201
    content_id = create_res.json()["data"]["id"]

    # 2. Public cannot view draft (returns 404)
    public_res = client.get("/api/v1/content/pages/exclusive-wealth-strategy")
    assert public_res.status_code == 404

    # 3. Editor publishes the content
    publish_res = client.patch(
        f"/api/v1/admin/content/{content_id}",
        json={"status": "published"},
        headers=headers,
    )
    assert publish_res.status_code == 200

    # 4. Public can now view published content
    public_res2 = client.get("/api/v1/content/pages/exclusive-wealth-strategy")
    assert public_res2.status_code == 200
    assert public_res2.json()["data"]["title"] == "Exclusive Wealth Strategy"


def test_draft_content_preview_token(client, editor_token):
    headers = {"Authorization": f"Bearer {editor_token}"}

    # 1. Create a draft article
    create_res = client.post(
        "/api/v1/admin/content",
        json={
            "content_type": "insight",
            "slug": "preview-draft-market-cycle",
            "title": "Draft Market Cycles",
            "content_json": {"summary": "Draft market outlook for preview."},
            "status": "draft",
        },
        headers=headers,
    )
    assert create_res.status_code == 201
    content_id = create_res.json()["data"]["id"]

    # 2. Generate a preview token
    token_res = client.post(f"/api/v1/admin/content/{content_id}/preview-token", headers=headers)
    assert token_res.status_code == 200
    token_data = token_res.json()["data"]
    preview_token = token_data["token"]

    # 3. Load draft via preview token
    preview_res = client.get(f"/api/v1/content/preview/{preview_token}")
    assert preview_res.status_code == 200
    assert "[PREVIEW]" in preview_res.json()["data"]["title"]


def test_content_archival(client, editor_token, admin_token):
    # 1. Create content
    create_res = client.post(
        "/api/v1/admin/content",
        json={
            "content_type": "page",
            "slug": "old-event-godhra-2025",
            "title": "Old Event Godhra 2025",
            "content_json": {"summary": "Past event"},
            "status": "published",
        },
        headers={"Authorization": f"Bearer {editor_token}"},
    )
    content_id = create_res.json()["data"]["id"]

    # 2. Archive content as admin
    del_res = client.delete(
        f"/api/v1/admin/content/{content_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert del_res.status_code == 200

    # 3. Public access returns 404
    public_res = client.get("/api/v1/content/pages/old-event-godhra-2025")
    assert public_res.status_code == 404


def test_seo_metadata_endpoint(client):
    res = client.get("/api/v1/seo/about-us")
    assert res.status_code == 200
    data = res.json()["data"]
    assert "title" in data
    assert "description" in data
