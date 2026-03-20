from fastapi import APIRouter,Depends,Query
from sqlalchemy.orm import Session
from sqlalchemy import select, and_ ,or_ 
from typing import Optional

from api.models.user import User
from api.models.stock_data_infos import StockDataCompanyProfile
from api.routes.user import get_current_user
from api.core.database import get_db

router = APIRouter(prefix="/stock_data")

@router.get("/comparison")
def get_all_symbols(db:Session = Depends(get_db) , user:User =Depends(get_current_user)):
    stmt = select(StockDataCompanyProfile.symbol, StockDataCompanyProfile.short_name ,StockDataCompanyProfile.sector,
                  StockDataCompanyProfile.industry,StockDataCompanyProfile.market_cap,
                  StockDataCompanyProfile.country,StockDataCompanyProfile.revenue_growth,StockDataCompanyProfile.gross_margins)

    #because multiple row/col without scalars()
    all_rows= db.execute(stmt).mappings().all()
    return all_rows


#symbol, short_name sector, industry,market_cap, country, revenue_growth, gross_margins
@router.get("/comparison/{symbol}")
def get_fundamental_data(symbol:str,
    industry:Optional[str]=Query(None, description="Like Semiconductors"),
    market_cap:Optional[int] =Query(None,ge = 0, description="Market Cap" ),
    market_cap_min:Optional[int] = Query(None, ge=0, description="Minimum market cap"),
    market_cap_max:Optional[int] = Query(None, ge=0, description="Maximum market cap"),
    country:Optional[str] =Query(None),
    revenue_growth:Optional[float]=Query(None, description="RevenueGrowth can be positive or negative"),
    gross_margin:Optional[float]=Query(None),
    db:Session = Depends(get_db) , user:User =Depends(get_current_user)):
    
    stmt_symbol = select(StockDataCompanyProfile).where(StockDataCompanyProfile.symbol==symbol)
    get_symbol_data = db.execute(stmt_symbol).scalars().first()

    stmt = select(StockDataCompanyProfile)

    filters = []
    if industry:
        try:
            try:
                filters.append(StockDataCompanyProfile.industry ==get_symbol_data.industry)
            except:
                filters.append(StockDataCompanyProfile.industry ==industry)
        except Exception as e:
            return f"Couldnt append Industry because of {e}"
        
    if country:
        try:
            try:
                filters.append(StockDataCompanyProfile.country ==get_symbol_data.country)
            except:
                filters.append(StockDataCompanyProfile.country ==country)
        except Exception as e:
            return f"Couldnt append Industry because of {e}"
        
    if market_cap_min is not None or market_cap_max is not None:
        min_cap = market_cap_min if market_cap_min is not None else 0
        max_cap = market_cap_max if market_cap_max is not None else (10**18)
        filters.append(StockDataCompanyProfile.market_cap.between(min_cap,max_cap))
    elif market_cap:
        min_cap = 0.8 *market_cap
        max_cap = 1.2 *market_cap
        filters.append(StockDataCompanyProfile.market_cap.between(min_cap,max_cap))

        
    if filters:
       peer = and_(*filters)
       stmt = stmt.where(or_(
           peer , StockDataCompanyProfile.symbol==symbol)).limit(10)
       results = db.execute(stmt).scalars().all()
       return results
    else: 
        return [get_symbol_data] if get_symbol_data else []

    
 
        