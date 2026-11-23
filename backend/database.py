import json
import os
import sqlite3
from datetime import datetime, timezone

DB_PATH = os.path.join(os.path.dirname(__file__), "phishguard.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            normalized_url TEXT NOT NULL,
            domain TEXT NOT NULL,
            scheme TEXT NOT NULL,
            path TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            status TEXT NOT NULL,
            indicators TEXT NOT NULL,
            scanned_at TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()


def insert_scan(scan_data: dict) -> dict:
    scanned_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO scans (url, normalized_url, domain, scheme, path, risk_score, status, indicators, scanned_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        scan_data["url"],
        scan_data["normalized_url"],
        scan_data["domain"],
        scan_data["scheme"],
        scan_data["path"],
        scan_data["risk_score"],
        scan_data["status"],
        json.dumps(scan_data["indicators"]),
        scanned_at
    ))
    scan_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {
        "scan_id": scan_id,
        **scan_data,
        "scanned_at": scanned_at
    }


def _row_to_dict(row) -> dict:
    return {
        "scan_id": row["id"],
        "url": row["url"],
        "normalized_url": row["normalized_url"],
        "domain": row["domain"],
        "scheme": row["scheme"],
        "path": row["path"],
        "risk_score": row["risk_score"],
        "status": row["status"],
        "indicators": json.loads(row["indicators"]),
        "scanned_at": row["scanned_at"]
    }


def get_all_scans() -> list:
    conn = get_connection()
    rows = conn.execute("SELECT * FROM scans ORDER BY id DESC").fetchall()
    conn.close()
    return [_row_to_dict(row) for row in rows]


def get_scan_by_id(scan_id: int):
    conn = get_connection()
    row = conn.execute("SELECT * FROM scans WHERE id = ?", (scan_id,)).fetchone()
    conn.close()
    return _row_to_dict(row) if row else None


def get_scan_stats() -> dict:
    conn = get_connection()
    total = conn.execute("SELECT COUNT(*) FROM scans").fetchone()[0]
    low = conn.execute("SELECT COUNT(*) FROM scans WHERE status = 'Low Risk'").fetchone()[0]
    suspicious = conn.execute("SELECT COUNT(*) FROM scans WHERE status = 'Suspicious'").fetchone()[0]
    high = conn.execute("SELECT COUNT(*) FROM scans WHERE status = 'High Risk'").fetchone()[0]
    avg_row = conn.execute("SELECT AVG(risk_score) FROM scans").fetchone()[0]
    conn.close()

    return {
        "total_scans": total,
        "low_risk": low,
        "suspicious": suspicious,
        "high_risk": high,
        "average_risk_score": round(avg_row, 1) if avg_row is not None else 0
    }
