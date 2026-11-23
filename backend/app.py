from flask import Flask, jsonify
from flask_cors import CORS
from database import init_db
from routes.scan_routes import scan_bp
from routes.history_routes import history_bp

app = Flask(__name__)
CORS(app)

init_db()

app.register_blueprint(scan_bp)
app.register_blueprint(history_bp)


@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "service": "PhishGuard API",
        "status": "healthy",
        "version": "1.0.0"
    }), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
