"""Seed Firestore with sample slots for a slot booking app.

This script will:
  - Connect to Firestore using a Firebase service account (GOOGLE_APPLICATION_CREDENTIALS)
  - Create a `slots` collection with 3 days of slots (7 slots per day)
  - Each slot document contains:
      - date (YYYY-MM-DD string)
      - time (e.g. "09:00 AM")
      - booked (boolean)
      - slotId (string id matching document ID)

Usage:
  1) Set your service account JSON path:
       export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccount.json"
  2) Run:
       python seed_firestore.py

After running, you can verify the documents under the Firestore console.
"""

from datetime import datetime, timedelta
import logging
import os
import sys

import firebase_admin
from firebase_admin import credentials, firestore

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_firestore() -> firestore.Client:
    """Initialize Firestore client using service account credentials."""
    if not firebase_admin._apps:
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
        if not cred_path:
            logger.error(
                "Missing GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_PATH environment variable. "
                "Set it to your Firebase service account JSON file path."
            )
            sys.exit(1)

        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)

    return firestore.client()


def make_slot_doc_id(date: str, time: str) -> str:
    """Stable doc ID for a slot (so running the script multiple times won't create duplicates)."""
    # Example: 2026-03-18_09-00-AM
    safe_time = time.replace(":", "-").replace(" ", "")
    return f"slot_{date}_{safe_time}"


def seed_slots(db: firestore.Client, days: int = 3, times: list[str] | None = None) -> None:
    """Create sample slot documents in Firestore."""
    if times is None:
        times = [
            "09:00 AM",
            "10:00 AM",
            "11:00 AM",
            "01:00 PM",
            "02:00 PM",
            "03:00 PM",
            "04:00 PM",
        ]

    slots_col = db.collection("slots")
    today = datetime.utcnow().date()

    created = 0
    batch = db.batch()

    for day_offset in range(days):
        slot_date = (today + timedelta(days=day_offset)).isoformat()
        for time in times:
            doc_id = make_slot_doc_id(slot_date, time)
            doc_ref = slots_col.document(doc_id)
            batch.set(
                doc_ref,
                {
                    "slotId": doc_id,
                    "date": slot_date,
                    "time": time,
                    "booked": False,
                },
                merge=True,
            )
            created += 1

    batch.commit()
    logger.info("Seeded %d slots into Firestore (collection=slots)", created)


def main() -> None:
    db = init_firestore()
    seed_slots(db)


if __name__ == "__main__":
    main()
