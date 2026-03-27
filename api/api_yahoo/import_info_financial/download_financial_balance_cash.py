from pathlib import Path
from api.core.database import run_sql_file,SessionLocal, Base,engine
from api.models import stock_data_infos
from api.models.stock_data_infos import StockDataFinancialsStaging, StockDataBalanceStaging,StockDataCashStaging
from concurrent.futures import ThreadPoolExecutor
import math 
import pandas as pd
import yfinance as yf


def create_all_databases():
    path = Path(__file__).resolve().parent.parent / "sql" /"create_tables_info_balance_financials.sql"
    run_sql_file(path)


def create_chunks(symbols, max_workers):
    if not symbols:
        return []

    max_workers = max(1, int(max_workers))
    chunksize = math.ceil(len(symbols) / max_workers)
    return [symbols[i:i + chunksize] for i in range(0, len(symbols), chunksize)]

def get_symbols(limit=None):
    path = Path(__file__).resolve().parent.parent / "sp500_companies.csv"
    symbols = pd.read_csv(path)["Symbol"].dropna().astype(str).str.strip().unique().tolist()  

    return symbols[:limit] if limit else symbols

def create_tickers(symbol):
    ticker = yf.Ticker(symbol)
    financials_payload = validation_financials_balance_cash_dfs(ticker.financials)
    balance_payload = validation_financials_balance_cash_dfs(ticker.balance_sheet)
    cash_payload = validation_financials_balance_cash_dfs(ticker.cash_flow)

    financials_row = StockDataFinancialsStaging(symbol=symbol, jsondump=financials_payload)
    balance_row = StockDataBalanceStaging(symbol=symbol, jsondump=balance_payload)
    cash_row = StockDataCashStaging(symbol=symbol, jsondump=cash_payload)
    return financials_row, balance_row, cash_row

def validation_financials_balance_cash_dfs(df):
    df = df.rename_axis("metric").stack().reset_index(name="value")
    df["year"] = pd.to_datetime(df["level_1"], errors = "coerce").dt.year
    df.drop(columns=["level_1"], inplace=True)
    df = df[df["year"].notna()]
   
    # making NaN to None for valid JSON
    df = df.astype(object).where(pd.notna(df), None)
    payload = df.to_dict(orient = "records")

    return payload 

def get_staging_data(chunk_symbols:list[str]):
    failed_symbols = []

    with SessionLocal() as session:
        for symbol in chunk_symbols:
            try:
                financials, balance, cash = create_tickers(symbol)
                session.merge(financials)
                session.merge(balance)
                session.merge(cash)
                session.commit()
            except Exception as e:
                session.rollback()
                failed_symbols.append(symbol)
                print(f"Failed symbol {symbol}: {e}")

    return failed_symbols


def running_workers(symbol:str|None=None,max_workers = 10 ):
    if symbol == None:
        symbols = get_symbols()
    else:
        symbols = [symbol]
    
    chunks_symbols = create_chunks(symbol, max_workers)

    if not chunks_symbols:
        return []

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        results = list(executor.map(get_staging_data, chunks_symbols))

    failed = [symbol for batch in results for symbol in batch]
    if failed:
        print(f"Failed symbols count: {len(failed)}")

    return failed

def update_productive_tables():
    path = Path(__file__).resolve().parent.parent / "sql" / "update_info_balance_financials.sql"
    run_sql_file(path)


def run_download_financial_balance_cash(symbol:str|None=None, create_tables=False):
    if create_tables:
        create_all_databases()
        Base.metadata.create_all(bind = engine)
    
    running_workers(symbol)
    update_productive_tables()

if __name__ == "__main__":
    run_download_financial_balance_cash()