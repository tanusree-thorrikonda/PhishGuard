from flask import Blueprint, request, jsonify
from detector.url_analyzer import analyze_url
from database import insert_scan, get_scan_by_id

scan_bp = Blueprint("scan", __name__)


@scan_bp.route("/api/scan", methods=["POST"])
def scan_url():
    data = request.get_json(silent=True) or {}
    raw_url = data.get("url", "")

    try:
        analysis = analyze_url(raw_url)
        saved_report = insert_scan(analysis)
        return jsonify(saved_report), 201
    except ValueError as err:
        return jsonify({"error": str(err)}), 400
    except Exception:
        return jsonify({"error": "Internal server error while analyzing URL."}), 500


@scan_bp.route("/api/scan/<int:scan_id>", methods=["GET"])
def fetch_scan_report(scan_id):
    report = get_scan_by_id(scan_id)
    if not report:
        return jsonify({"error": "Scan report not found."}), 404
    return jsonify(report), 200
