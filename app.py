from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import datetime, timedelta
import logging
import os

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': os.getenv('MYSQL_PASSWORD', 'your_mysql_password'),  # Set your MySQL password here
    'database': 'slot_booking'
}

def get_db():
    """Get database connection"""
    return mysql.connector.connect(**DB_CONFIG)

def init_db():
    """Initialize database with schema and sample data"""
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    # Create slots table (using the MySQL schema but adapting for current logic)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS slots (
            id INT AUTO_INCREMENT PRIMARY KEY,
            date DATE NOT NULL,
            time VARCHAR(20) NOT NULL,
            status VARCHAR(20) DEFAULT 'available',
            UNIQUE(date, time)
        )
    """)

    # Check if slots already exist
    cursor.execute("SELECT COUNT(*) as count FROM slots")
    result = cursor.fetchone()
    count = result['count'] if result else 0

    # Initialize with sample data if empty
    if count == 0:
        times = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]
        today = datetime.now()

        # Create slots for today and next 2 days
        for day_offset in range(3):
            date = (today + timedelta(days=day_offset)).strftime("%Y-%m-%d")
            for time in times:
                cursor.execute("INSERT INTO slots (date, time, status) VALUES (%s, %s, %s)", (date, time, 'available'))

        conn.commit()
        logger.info("Database initialized with sample slots")

    cursor.close()
    conn.close()

# Initialize database on startup
init_db()

@app.route("/slots", methods=["GET"])
def get_slots():
    """Retrieve all slots with their booking status"""
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT id, date, time, CASE WHEN status = 'booked' THEN 1 ELSE 0 END as booked
            FROM slots
            ORDER BY date ASC, time ASC
        """)
        slots = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(slots)
    except mysql.connector.Error as e:
        logger.error(f"Database error: {e}")
        return jsonify({"error": "Failed to fetch slots"}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return jsonify({"error": "Unexpected error occurred"}), 500

@app.route("/book", methods=["POST"])
def book_slot():
    """Book a slot - prevents double booking"""
    try:
        data = request.json

        # Validate input
        if not data or "id" not in data:
            return jsonify({"error": "Missing slot id"}), 400

        try:
            slot_id = int(data["id"])
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid slot id"}), 400

        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # Check if slot exists
        cursor.execute("SELECT id, status FROM slots WHERE id = %s", (slot_id,))
        slot = cursor.fetchone()

        if not slot:
            cursor.close()
            conn.close()
            return jsonify({"error": "Slot not found"}), 404

        # Check if slot is already booked
        if slot["status"] == 'booked':
            cursor.close()
            conn.close()
            return jsonify({"error": "Slot already booked"}), 409

        # Book the slot
        cursor.execute("UPDATE slots SET status = 'booked' WHERE id = %s", (slot_id,))
        conn.commit()
        cursor.close()
        conn.close()

        logger.info(f"Slot {slot_id} booked successfully")
        return jsonify({"message": "Slot booked successfully", "slot_id": slot_id}), 200

    except mysql.connector.Error as e:
        logger.error(f"Database error: {e}")
        return jsonify({"error": "Failed to book slot"}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return jsonify({"error": "Unexpected error occurred"}), 500

@app.route("/cancel", methods=["POST"])
def cancel_slot():
    """Cancel a booked slot"""
    try:
        data = request.json

        # Validate input
        if not data or "id" not in data:
            return jsonify({"error": "Missing slot id"}), 400

        try:
            slot_id = int(data["id"])
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid slot id"}), 400

        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # Check if slot exists
        cursor.execute("SELECT id, status FROM slots WHERE id = %s", (slot_id,))
        slot = cursor.fetchone()

        if not slot:
            cursor.close()
            conn.close()
            return jsonify({"error": "Slot not found"}), 404

        # Check if slot is booked
        if slot["status"] == 'available':
            cursor.close()
            conn.close()
            return jsonify({"error": "Slot is not booked"}), 409

        # Cancel the slot
        cursor.execute("UPDATE slots SET status = 'available' WHERE id = %s", (slot_id,))
        conn.commit()
        cursor.close()
        conn.close()

        logger.info(f"Slot {slot_id} cancelled successfully")
        return jsonify({"message": "Slot cancelled successfully", "slot_id": slot_id}), 200

    except mysql.connector.Error as e:
        logger.error(f"Database error: {e}")
        return jsonify({"error": "Failed to cancel slot"}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return jsonify({"error": "Unexpected error occurred"}), 500

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy"}), 200

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {error}")
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)