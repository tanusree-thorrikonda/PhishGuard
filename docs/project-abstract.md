# PhishGuard – Intelligent Phishing URL Detection & Cyber Threat Analysis Platform

## Overview
PhishGuard is a web-based cybersecurity analysis tool designed to evaluate submitted URLs using heuristic, rule-based static inspection. It assigns a risk score (0–100), classifies links into Low Risk, Suspicious, or High Risk, and explains the specific indicators triggered.

## Security & Scope Principles
- **Static Analysis Only:** The backend analyzes URL strings without fetching or visiting arbitrary user-submitted URLs.
- **Heuristic Scoring:** Risk scores indicate suspicious patterns, not guaranteed safety. HTTPS alone does not guarantee legitimacy.
