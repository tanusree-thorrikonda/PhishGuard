import time
from collections import defaultdict
from flask import Flask, jsonify, request
from flask_cors import CORS
from database import init_db
from routes.scan_routes import scan_bp
from routes.history_routes import history_bp

app = Flask(__name__)
CORS(app)

init_db()

# Simple in-memory rate limiter: max 30 POST scan requests per IP per 60 seconds
REQUEST_LOG = defaultdict(list)
RATE_LIMIT_MAX = 30
RATE_LIMIT_WINDOW = 60


@app.before_request
def check_rate_limit():
    if request.path == "/api/scan" and request.method == "POST":
        client_ip = request.remote_addr or "unknown"
        now = time.time()
        REQUEST_LOG[client_ip] = [t for t in REQUEST_LOG[client_ip] if now - t < RATE_LIMIT_WINDOW]
        if len(REQUEST_LOG[client_ip]) >= RATE_LIMIT_MAX:
            return jsonify({"error": "Rate limit exceeded. Please wait a minute before scanning again."}), 429
        REQUEST_LOG[client_ip].append(now)


app.register_blueprint(scan_bp)
app.register_blueprint(history_bp)


@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "service": "PhishGuard API",
        "status": "healthy",
        "version": "1.1.0"
    }), 200


@app.errorhandler(404)
def not_found(_err):
    return jsonify({"error": "Requested API endpoint was not found."}), 404


@app.errorhandler(405)
def method_not_allowed(_err):
    return jsonify({"error": "HTTP method not allowed for this endpoint."}), 405


@app.errorhandler(500)
def server_error(_err):
    return jsonify({"error": "Unexpected internal server error."}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
