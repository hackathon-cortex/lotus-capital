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


def test_seo_metadata_endpoint(client):
    res = client.get("/api/v1/seo/about-us")
    assert res.status_code == 200
    data = res.json()["data"]
    assert "title" in data
    assert "description" in data

