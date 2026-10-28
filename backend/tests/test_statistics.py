import pytest
from backend.app.routers.public import (
    get_public_statistics,
    get_partners,
    get_contact,
    get_page_content,
)

def test_public_statistics_only_returns_approved_with_dates():
    stats = get_public_statistics()
    # Check that all returned public statistics are approved, have asOfDate and are not Tier C
    for item in stats:
        assert item["approvalStatus"] == "approved"
        assert item["asOfDate"] is not None
        assert item["tier"] != "C"

def test_tier_c_equity_cagr_never_exposed_publicly():
    stats = get_public_statistics()
    stat_ids = [s["id"] for s in stats]
    assert "equity_cagr" not in stat_ids

def test_content_endpoints_serve_source_of_truth():
    partners = get_partners()
    assert any(p["name"] == "Religare Broking Limited" for p in partners)

    contact = get_contact()
    assert "Godhra" in contact["address"]["city"]

    home_page = get_page_content("home")
    assert "Plan with confidence" in home_page["headline"]

