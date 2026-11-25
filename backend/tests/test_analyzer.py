import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from detector.url_analyzer import analyze_url, validate_url
from app import app


def test_validate_empty_url():
    valid, msg = validate_url("")
    assert valid is False
    assert "required" in msg.lower()


def test_validate_url_with_spaces():
    valid, msg = validate_url("http://exa mple.com")
    assert valid is False
    assert "spaces" in msg.lower()


def test_safe_https_url():
    res = analyze_url("https://www.github.com")
    assert res["risk_score"] == 0
    assert res["status"] == "Low Risk"
    assert res["indicators"] == []


def test_ip_address_and_http_high_risk():
    res = analyze_url("http://192.168.1.50/paypal-login-verify.tk")
    assert res["risk_score"] >= 65
    assert res["status"] == "High Risk"
    rules = [i["rule"] for i in res["indicators"]]
    assert "Raw IP Address Used" in rules
    assert "Insecure Protocol (HTTP)" in rules


def test_typosquatting_detection():
    res = analyze_url("https://www.paypa1.com/login")
    assert res["risk_score"] >= 35
    rules = [i["rule"] for i in res["indicators"]]
    assert any("Typosquatting" in r for r in rules)


def test_punycode_homograph_detection():
    res = analyze_url("https://xn--pple-43d.com")
    rules = [i["rule"] for i in res["indicators"]]
    assert "Punycode / IDN Homograph Domain" in rules


def test_url_shortener_detection():
    res = analyze_url("https://bit.ly/3xYzAbC")
    rules = [i["rule"] for i in res["indicators"]]
    assert "URL Shortener Detected" in rules


def test_score_capped_at_100():
    extreme_url = "http://user@192.168.1.1:8080/login/verify/update/secure/paypal/account/banking/confirm/password.tk?redirect=%20%20%20%20"
    res = analyze_url(extreme_url)
    assert res["risk_score"] == 100
    assert res["status"] == "High Risk"


def test_flask_health_endpoint():
    client = app.test_client()
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.get_json()["status"] == "healthy"


def test_flask_scan_validation_error():
    client = app.test_client()
    resp = client.post("/api/scan", json={"url": "not a valid url"})
    assert resp.status_code == 400
    assert "error" in resp.get_json()
