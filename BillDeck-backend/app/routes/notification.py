"""
Notification routes — redirects /notifications/ to the udhaar notifications endpoint.
The frontend's notificationApi.js calls /api/notifications/ but the actual logic
is in the udhaar router at /api/udhaar/notifications/.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date, timedelta
from .. import database, models

router = APIRouter()


@router.get("/notifications/")
def get_notifications(
    days_ahead: int = Query(3),
    db: Session = Depends(database.get_db),
):
    """Get upcoming due udhar entries within N days ahead."""
    today = date.today()
    target = today + timedelta(days=days_ahead)

    sales_due = db.query(models.UdharSales).filter(
        models.UdharSales.date_of_payment <= target
    ).all()

    purchases_due = db.query(models.UdharPurchase).filter(
        models.UdharPurchase.date_of_payment <= target
    ).all()

    return {
        "days_ahead": days_ahead,
        "sales_udhaar_due": [
            {
                "udhar_id": u.udhar_id,
                "sales_id": u.sales_id,
                "due_date": u.date_of_payment,
                "entry_date": u.date_of_entry,
            }
            for u in sales_due
        ],
        "purchase_udhaar_due": [
            {
                "udhar_id": u.udhar_id,
                "purch_id": u.purch_id,
                "due_date": u.date_of_payment,
                "entry_date": u.date_of_entry,
            }
            for u in purchases_due
        ],
    }
