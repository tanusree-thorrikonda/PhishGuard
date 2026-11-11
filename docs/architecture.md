# PhishGuard Architecture

## Application Flow

1. User submits a URL through React.
2. React sends a POST request to Flask.
3. Flask validates the submitted URL.
4. URL analyzer checks suspicious characteristics.
5. Risk scoring calculates a score.
6. SQLite stores the scan information.
7. Flask returns JSON response.
8. React displays the scan results.

## Architecture Components

Frontend: React.js
Backend: Flask
Database: SQLite
Communication: REST API
Detection: Rule-based URL analysis