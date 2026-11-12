# System Architecture

## Data Flow
1. User submits a URL via the **React** frontend.
2. **Axios** sends a POST /api/scan JSON request to the **Flask** backend.
3. The **URL Analyzer** (ackend/detector/url_analyzer.py) parses the URL string and runs heuristic rules.
4. Results are stored in **SQLite** (ackend/database.py) and returned as JSON.

## Core Endpoints
- GET / – Health check
- POST /api/scan – Analyze a URL
- GET /api/history – List past scans
- GET /api/stats – Dashboard summary statistics
- GET /api/scan/<id> – Single scan report
