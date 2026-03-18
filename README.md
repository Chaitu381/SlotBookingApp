# Slot Booking App

A simple web app to view, book, and cancel time slots. Backend is in Flask + MySQL, frontend is plain HTML, CSS, and JavaScript.

# Webpage: https://slotbookingappjq.vercel.app/

# Features

* See available time slots

* Book a slot

* Cancel a booking

* Data saved in MySQL

* Tech Stack

Backend: Flask (Python), MySQL, Flask-CORS
Frontend: HTML, CSS, JavaScript
Dev Tools: Python virtual environment

# Setup Instructions

1. Create Database
   
    sudo mysql -u root -p
   
    CREATE DATABASE slot_booking;
    source database.sql;
   
3. Setup Backend
   
    python -m venv myenv
   
    source myenv/bin/activate
   
    pip install flask flask-cors mysql-connector-python
   
5. Run Backend
   
    source myenv/bin/activate
   
    export MYSQL_PASSWORD=your_mysql_password
python app.py

    Backend runs at: http://127.0.0.1:5000

7. Run Frontend

   Local:   http://localhost:8080/
   
   Network: http://192.168.68.175:8080/

# API Endpoints

GET /slots → Get all slots

POST /book → Book a slot, body: {"id": 1}

POST /cancel → Cancel a slot, body: {"id": 1}

GET /health → Check if backend is running

# How It Works

Slots are stored in the database

Booking a slot updates the database

Cancelling makes the slot available again

Frontend fetches data from backend using JavaScript (AJAX/fetch)

# Assumptions

No login system

7 slots per day (9 AM - 4 PM)

Only 3 days of slots visible (today + next 2 days)

One user per slot

# Possible Improvements

Add user login and authentication

Send email confirmations for bookings

Let admin add/remove slots

Better UI design# SlotBookingApp
