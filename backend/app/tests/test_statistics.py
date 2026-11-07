from datetime import date
from app.models.statistic import Statistic


def test_public_statistics_compliance(client, db_session):
    # Setup test statistics across tiers
    s1 = Statistic(
        statistic_key="test_tier_a_approved",
        label="Verified Clients",
        value="500+",
        tier="Tier A",
        approval_status="approved",
        as_of_date=date(2026, 10, 1),
    )
    s2 = Statistic(
        statistic_key="test_tier_a_no_date",
        label="Pending Date Metric",
        value="100+",
        tier="Tier A",
        approval_status="approved",
        as_of_date=None,  # Missing date -> must be hidden
    )
    s3 = Statistic(
        statistic_key="test_tier_b_pending",
        label="Pending Confirmation Metric",
        value="₹50 Cr",
        tier="Tier B",
        approval_status="pending",
        as_of_date=date(2026, 10, 1),
    )
    s4 = Statistic(
        statistic_key="test_tier_c_equity_cagr",
        label="Historical Equity CAGR",
        value="22.5%",
        tier="Tier C",
        approval_status="withheld",
        as_of_date=date(2026, 10, 1),
    )
    db_session.add_all([s1, s2, s3, s4])
    db_session.commit()

    # Public request
    response = client.get("/api/v1/statistics")
    assert response.status_code == 200
    public_keys = [item["statistic_key"] for item in response.json()["data"]]

    # Assertions
    assert "test_tier_a_approved" in public_keys
    assert "test_tier_a_no_date" not in public_keys
    assert "test_tier_b_pending" not in public_keys
    # CRITICAL COMPLIANCE: Tier C must NEVER appear publicly
    assert "test_tier_c_equity_cagr" not in public_keys


def test_admin_statistics_tiers_and_approval(client, db_session, admin_token, superadmin_token, editor_token):
    s_tier_c = Statistic(
        statistic_key="equity_cagr_test",
        label="Confidential CAGR",
        value="19%",
        tier="Tier C",
        approval_status="withheld",
        as_of_date=date(2026, 10, 1),
    )
    db_session.add(s_tier_c)
    db_session.commit()
    db_session.refresh(s_tier_c)

    # 1. Editor cannot view Tier C
    editor_res = client.get("/api/v1/admin/statistics", headers={"Authorization": f"Bearer {editor_token}"})
    assert editor_res.status_code == 200
    editor_keys = [s["statistic_key"] for s in editor_res.json()["data"]]
    assert "equity_cagr_test" not in editor_keys

    # 2. Super Admin CAN view Tier C in internal admin view
    super_res = client.get("/api/v1/admin/statistics", headers={"Authorization": f"Bearer {superadmin_token}"})
    assert super_res.status_code == 200
    super_keys = [s["statistic_key"] for s in super_res.json()["data"]]
    assert "equity_cagr_test" in super_keys

    # 3. Compliance restriction: attempting to approve Tier C fails with 400
    try_approve = client.patch(
        f"/api/v1/admin/statistics/{s_tier_c.id}",
        json={"approval_status": "approved"},
        headers={"Authorization": f"Bearer {superadmin_token}"},
    )
    assert try_approve.status_code == 400
    assert "must remain withheld" in try_approve.json()["message"]
