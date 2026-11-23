import re
from urllib.parse import urlparse

SUSPICIOUS_KEYWORDS = [
    "login", "signin", "verify", "update", "secure", "account",
    "banking", "confirm", "password", "credential", "wallet",
    "paypal", "ebay", "amazon", "appleid", "microsoft", "urgent", "suspended"
]

URL_SHORTENERS = [
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly", "cutt.ly"
]

SUSPICIOUS_TLDS = [".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".zip", ".click"]


def validate_url(raw_url: str):
    if not raw_url or not isinstance(raw_url, str):
        return False, "URL is required."

    cleaned = raw_url.strip()
    if len(cleaned) < 4 or len(cleaned) > 2048:
        return False, "URL length must be between 4 and 2048 characters."

    if " " in cleaned:
        return False, "URL cannot contain spaces."

    candidate = cleaned if re.match(r"^https?://", cleaned, re.IGNORECASE) else f"http://{cleaned}"
    parsed = urlparse(candidate)

    if not parsed.netloc or "." not in parsed.netloc:
        return False, "Invalid URL format: missing a valid domain name."

    return True, candidate


def analyze_url(raw_url: str) -> dict:
    is_valid, normalized_or_error = validate_url(raw_url)
    if not is_valid:
        raise ValueError(normalized_or_error)

    url = normalized_or_error
    parsed = urlparse(url)
    domain = parsed.hostname.lower() if parsed.hostname else ""
    full_lower = url.lower()

    score = 0
    indicators = []

    if parsed.scheme != "https":
        score += 15
        indicators.append({
            "rule": "Insecure Protocol (HTTP)",
            "severity": "Medium",
            "points": 15,
            "description": "The URL uses HTTP instead of HTTPS, meaning traffic is unencrypted."
        })

    if re.match(r"^\d{1,3}(\.\d{1,3}){3}$", domain):
        score += 35
        indicators.append({
            "rule": "Raw IP Address Used",
            "severity": "High",
            "points": 35,
            "description": "Legitimate websites rarely ask users to visit a raw IPv4 address."
        })

    if "@" in url:
        score += 30
        indicators.append({
            "rule": "At-Symbol (@) Obfuscation",
            "severity": "High",
            "points": 30,
            "description": "Browsers ignore everything before '@' in a URL, often hiding the real domain."
        })

    if len(url) > 75:
        points = 15 if len(url) <= 120 else 25
        score += points
        indicators.append({
            "rule": "Unusually Long URL",
            "severity": "Medium",
            "points": points,
            "description": f"URL length is {len(url)} characters, often used to hide suspicious parameters."
        })

    dot_count = domain.count(".")
    if dot_count >= 3:
        score += 20
        indicators.append({
            "rule": "Excessive Subdomains",
            "severity": "Medium",
            "points": 20,
            "description": f"Domain contains {dot_count} dots, which can mimic trusted brand hierarchies."
        })

    if "-" in domain:
        score += 10
        indicators.append({
            "rule": "Hyphenated Domain",
            "severity": "Low",
            "points": 10,
            "description": "Attackers frequently register hyphenated lookalike domains (e.g., pay-pal-login.com)."
        })

    if any(domain == shortener or domain.endswith(f".{shortener}") for shortener in URL_SHORTENERS):
        score += 25
        indicators.append({
            "rule": "URL Shortener Detected",
            "severity": "Medium",
            "points": 25,
            "description": "Shortened links mask the final destination domain."
        })

    if any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS):
        score += 20
        indicators.append({
            "rule": "High-Risk Top-Level Domain (TLD)",
            "severity": "Medium",
            "points": 20,
            "description": "This domain extension is frequently abused in phishing campaigns."
        })

    matched_keywords = [kw for kw in SUSPICIOUS_KEYWORDS if kw in full_lower]
    if matched_keywords:
        kw_points = min(len(matched_keywords) * 10, 30)
        score += kw_points
        indicators.append({
            "rule": "Suspicious Phishing Keywords",
            "severity": "High" if len(matched_keywords) >= 2 else "Medium",
            "points": kw_points,
            "description": f"Detected sensitive keywords: {', '.join(matched_keywords)}."
        })

    risk_score = min(score, 100)

    if risk_score >= 65:
        status = "High Risk"
    elif risk_score >= 30:
        status = "Suspicious"
    else:
        status = "Low Risk"

    return {
        "url": raw_url.strip(),
        "normalized_url": url,
        "domain": domain,
        "scheme": parsed.scheme,
        "path": parsed.path or "/",
        "risk_score": risk_score,
        "status": status,
        "indicators": indicators
    }
