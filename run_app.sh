#!/bin/bash
# Run script for Slot Booking Flask app with MySQL

cd /home/chaitu/C_drive/SlotBookingWebsite
source myenv/bin/activate
export MYSQL_PASSWORD=chaitu
python app.py