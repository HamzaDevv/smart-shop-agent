from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from .. import database, models, schemas, crud

router = APIRouter()

@router.post("/sales/")
def record_sale(sale: schemas.SaleEntry, db: Session = Depends(database.get_db)):
    return crud.handle_sale(db, sale)


@router.get("/sales/")
def get_sales(db: Session = Depends(database.get_db)):
    return crud.get_all_sales(db)

@router.get("/sales/{sale_id}")
def get_sale_by_id(sale_id: int, db: Session = Depends(database.get_db)):
    sale = crud.get_sale_by_id(db, sale_id)
    if not sale:
        return {"error": "Sale not found"}
    return sale


@router.get("/profit-loss/by-date/{target_date}")
def get_profit_loss_by_date(target_date: date, db: Session = Depends(database.get_db)):
    """Get profit/loss entries for a specific date (used by Dashboard chart)."""
    entries = crud.get_profit_loss_by_date(db, target_date)
    total_profit = sum(e.amount for e in entries if e.is_profit)
    total_loss = sum(e.amount for e in entries if not e.is_profit)
    return {
        "date": str(target_date),
        "total_profit": total_profit,
        "total_loss": total_loss,
        "net": total_profit - total_loss,
        "entries": [
            {"sales_id": e.sales_id, "is_profit": e.is_profit, "amount": e.amount}
            for e in entries
        ],
    }

