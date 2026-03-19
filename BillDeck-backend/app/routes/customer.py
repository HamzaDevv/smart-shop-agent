"""Customer lookup routes — used by CreateBill phone-number search."""
from fastapi import APIRouter, Depends, Query as QueryParam
from sqlalchemy.orm import Session
from .. import database, crud

router = APIRouter()


@router.get("/customers")
def get_customers(
    customer_phone_no: str = QueryParam(None),
    db: Session = Depends(database.get_db),
):
    """Look up customer by phone number, or return all customers."""
    if customer_phone_no:
        customer = crud.get_customer_by_phone(db, customer_phone_no)
        if customer:
            return {
                "cust_id": customer.cust_id,
                "customer_name": customer.customer_name,
                "phone_no": customer.phone_no,
            }
        return {"customer_name": None}
    return crud.get_all_customers(db)


@router.get("/customers/{customer_id}")
def get_customer_by_id(customer_id: int, db: Session = Depends(database.get_db)):
    customer = crud.get_customer_by_id(db, customer_id)
    if not customer:
        return {"error": "Customer not found"}
    return customer
