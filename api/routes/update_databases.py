from fastapi import APIRouter,Depends


from api.models.user import User
from api.routes.user import get_current_user
# import of the run function for the download
from api.api_yahoo.import_daily.main import download_tickers
from api.api_yahoo.import_info_financial.download_infos import run_download_infos
from api.api_yahoo.import_info_financial.download_financial_balance_cash import run_download_financial_balance_cash

router = APIRouter(prefix ="/update_all")

@router.post("")
@router.post("/{symbol}")
def run_all_db_updates(symbol:str|None =None,user:User =Depends(get_current_user)):
    ## additional parameters from end to start
    download_tickers(symbol)
    ## only on certain symbol
    run_download_infos(symbol)
    ## only on certain symbol
    run_download_financial_balance_cash(symbol)
    return {"success": True, "symbol": symbol}

