from flask import Blueprint, jsonify
from database import get_all_scans, get_scan_stats

history_bp = Blueprint("history", __name__)


@history_bp.route("/api/history", methods=["GET"])
def fetch_history():
    scans = get_all_scans()
    return jsonify({"scans": scans}), 200


@history_bp.route("/api/stats", methods=["GET"])
def fetch_stats():
    stats = get_scan_stats()
    return jsonify(stats), 200
