import io


def test_media_lifecycle(client, editor_token, admin_token):
    # 1. Upload media as editor
    headers = {"Authorization": f"Bearer {editor_token}"}
    fake_png = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4"
    files = {"file": ("test_logo.png", io.BytesIO(fake_png), "image/png")}

    upload_res = client.post("/api/v1/admin/media/upload", files=files, headers=headers)
    assert upload_res.status_code == 201
    media_data = upload_res.json()["data"]
    filename = media_data["filename"]
    media_id = media_data["id"]

    # 2. Retrieve media file publicly
    file_res = client.get(f"/api/v1/media/{filename}")
    assert file_res.status_code == 200
    assert file_res.content == fake_png

    # 3. List media as editor
    list_res = client.get("/api/v1/admin/media", headers=headers)
    assert list_res.status_code == 200
    assert list_res.json()["total"] >= 1

    # 4. Delete media as admin
    del_res = client.delete(
        f"/api/v1/admin/media/{media_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert del_res.status_code == 200

    # 5. Media file is now gone
    get_res2 = client.get(f"/api/v1/media/{filename}")
    assert get_res2.status_code == 404

