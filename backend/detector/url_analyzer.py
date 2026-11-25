import re
from urllib.parse import urlparse

SUSPICIOUS_KEYWORDS = ["login","signin","verify","update","secure","account","banking","confirm","password","credential","wallet","paypal","ebay","amazon","appleid","microsoft","urgent","suspended","unlock","billing","invoice","webscr"]
URL_SHORTENERS = ["bit.ly","tinyurl.com","t.co","goo.gl","ow.ly","is.gd","buff.ly","cutt.ly","rb.gy"]
SUSPICIOUS_TLDS = [".tk",".ml",".ga",".cf",".gq",".xyz",".top",".zip",".click",".work",".loan"]
PROTECTED_BRANDS = {"paypal":["paypal.com"],"google":["google.com","accounts.google.com"],"microsoft":["microsoft.com","live.com","office.com"],"apple":["apple.com","icloud.com"],"amazon":["amazon.com","amazon.in"],"netflix":["netflix.com"],"instagram":["instagram.com"],"facebook":["facebook.com"],"hdfc":["hdfcbank.com"],"sbi":["onlinesbi.sbi","sbi.co.in"]}
TYPOSQUAT_PATTERNS = [(r"paypa[1l]|p[a4]ypal","PayPal"),(r"g00gle|goog1e","Google"),(r"micr0soft|mircosoft","Microsoft"),(r"amaz0n|arnazon","Amazon"),(r"app1e|appl3","Apple"),(r"netf1ix|netfiix","Netflix")]

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
    score, indicators = 0, []

    if parsed.scheme != "https":
        score += 15
        indicators.append({"rule": "Insecure Protocol (HTTP)", "severity": "Medium", "points": 15, "description": "The URL uses unencrypted HTTP instead of HTTPS."})
    if re.match(r"^\d{1,3}(\.\d{1,3}){3}$", domain):
        score += 35
        indicators.append({"rule": "Raw IP Address Used", "severity": "High", "points": 35, "description": "Legitimate services rarely use a raw IPv4 address."})
    if "@" in url:
        score += 30
        indicators.append({"rule": "At-Symbol (@) Obfuscation", "severity": "High", "points": 30, "description": "Browsers ignore text before '@' in a URL."})
    if "xn--" in domain:
        score += 30
        indicators.append({"rule": "Punycode / IDN Homograph Domain", "severity": "High", "points": 30, "description": "Punycode (xn--) is used to spoof lookalike characters."})
    for pattern, brand_name in TYPOSQUAT_PATTERNS:
        if re.search(pattern, domain):
            score += 35
            indicators.append({"rule": f"Typosquatting Lookalike ({brand_name})", "severity": "High", "points": 35, "description": f"Domain mimics '{brand_name}'."})
            break
    for brand, official_domains in PROTECTED_BRANDS.items():
        if brand in domain and not any(domain == od or domain.endswith(f".{od}") for od in official_domains):
            score += 25
            indicators.append({"rule": f"Brand Impersonation ({brand.capitalize()})", "severity": "High", "points": 25, "description": f"'{brand}' appears in an unofficial domain ({domain})."})
            break
    if parsed.port and parsed.port not in (80, 443):
        score += 20
        indicators.append({"rule": f"Non-Standard Port (:{parsed.port})", "severity": "Medium", "points": 20, "description": f"Port {parsed.port} is unusual for web traffic."})
    if len(url) > 75:
        pts = 15 if len(url) <= 120 else 25
        score += pts
        indicators.append({"rule": "Unusually Long URL", "severity": "Medium", "points": pts, "description": f"URL length is {len(url)} characters."})
    if domain.count(".") >= 3:
        score += 20
        indicators.append({"rule": "Excessive Subdomains", "severity": "Medium", "points": 20, "description": f"Domain contains {domain.count('.')} dots."})
    if "-" in domain:
        score += 10
        indicators.append({"rule": "Hyphenated Domain", "severity": "Low", "points": 10, "description": "Hyphenated lookalike domain pattern."})
    if any(domain == s or domain.endswith(f".{s}") for s in URL_SHORTENERS):
        score += 25
        indicators.append({"rule": "URL Shortener Detected", "severity": "Medium", "points": 25, "description": "Shortened links mask the final destination."})
    if any(domain.endswith(t) for t in SUSPICIOUS_TLDS):
        score += 20
        indicators.append({"rule": "High-Risk Top-Level Domain (TLD)", "severity": "Medium", "points": 20, "description": "High-risk disposable domain extension."})
    matched_kw = [kw for kw in SUSPICIOUS_KEYWORDS if kw in full_lower]
    if matched_kw:
        kw_pts = min(len(matched_kw) * 10, 30)
        score += kw_pts
        indicators.append({"rule": "Suspicious Phishing Keywords", "severity": "High" if len(matched_kw) >= 2 else "Medium", "points": kw_pts, "description": f"Detected keywords: {', '.join(matched_kw)}."})
    if url.count("%") >= 4:
        score += 15
        indicators.append({"rule": "Heavy URL Percent-Encoding", "severity": "Medium", "points": 15, "description": "Excessive hex-encoded characters detected."})

    risk_score = min(score, 100)
    status = "High Risk" if risk_score >= 65 else ("Suspicious" if risk_score >= 30 else "Low Risk")
    return {"url": raw_url.strip(), "normalized_url": url, "domain": domain, "scheme": parsed.scheme, "path": parsed.path or "/", "risk_score": risk_score, "status": status, "indicators": indicators}
