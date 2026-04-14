from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, and_

from api.models.stock_data_infos import StockDataFinancials,StockDataCompanyProfile
from api.core.database import get_db
router = APIRouter(prefix="/tutorial")

@router.get("/getSymbols")
def get_all_symbols(db:Session =Depends(get_db)):

    stmt = select(StockDataCompanyProfile.symbol, StockDataCompanyProfile.short_name).order_by(StockDataCompanyProfile.symbol) #order_by auto ASC
    rows = db.execute(stmt).all()
    return [
        {"symbol": symbol, "short_name": short_name}
        for symbol, short_name in rows
    ]

@router.get("/{company}")
def get_income_statement(company:str, db:Session= Depends(get_db)):

    stmt = (
        select(
            StockDataFinancials.year,
            StockDataFinancials.total_revenue,
            StockDataFinancials.cost_of_revenue,
            StockDataFinancials.gross_profit,
            StockDataFinancials.operating_expense,
            StockDataFinancials.selling_general_and_administration,
            StockDataFinancials.research_and_development,
            StockDataFinancials.operating_income,
            StockDataFinancials.net_interest_income,
            StockDataFinancials.other_income_expense,
            StockDataFinancials.pretax_income,
            StockDataFinancials.tax_provision,
            StockDataFinancials.net_income,
        )
        .where(
            and_(
                StockDataFinancials.symbol == company,
                StockDataFinancials.year.in_([2025, 2024, 2023]),
            )
        )
        .order_by(StockDataFinancials.year)
    )
    
    rows = db.execute(stmt).mappings().all()
    return [dict(row) for row in rows]
