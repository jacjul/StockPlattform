from fastapi import APIRouter,Depends, Query
from pydantic import BaseModel

from api.models.user import User
from api.routes.user import get_current_user
# import of the run function for the download
from api.api_yahoo.import_daily.main import download_tickers
from api.api_yahoo.import_info_financial.download_infos import run_download_infos
from api.api_yahoo.import_info_financial.download_financial_balance_cash import run_download_financial_balance_cash

router = APIRouter(prefix ="/update_all")

class StartEndTime(BaseModel):
    start : str
    end : str
@router.post("")
@router.post("/{symbol}")
def run_all_db_updates(symbol:str|None =None,
                       times : StartEndTime |None=None, 
                       daily :bool =  Query(default = False), 
                       infos :bool = Query(default = False),
                       financials: bool =Query(default =False),
                       
                       user:User =Depends(get_current_user)):
    ## additional parameters from end to start
    if times:
        print(times)
    if daily:
        download_tickers(symbol, end=times.end, start=times.start)
    ## only on certain symbol

    if infos:
        run_download_infos(symbol)
    ## only on certain symbol
    if financials:
        run_download_financial_balance_cash(symbol)

    #this should be changes, cause currently always returns success
    return {"success": True, "symbol": symbol}

