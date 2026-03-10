import React from 'react'
import type {StocksData} from "./MultipleStocks"
import SymbolIndicator from "./SymbolIndicator"
type SingleStockProps ={
    stock:StocksData
    addToFavorites: (symbol:string)=>void
}
const SingleStock = ({stock, addToFavorites}:SingleStockProps) => {
  return (
    <div className="rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-slate-800/60">
    <div className="grid grid-cols-[1.2fr_auto_auto] items-center gap-3 md:grid-cols-[1.2fr_1fr_1fr_0.8fr_0.6fr]">
        <div className="truncate font-semibold text-slate-100">{stock.symbol}</div>
        {(stock.symbol ==="up" ||  stock.symbol ==="up_much")? 
          <div className="tabular-nums text-sm font-medium text-emerald-400">{Math.trunc(stock.day*100)/100}</div>:
        <div className="tabular-nums text-sm font-medium text-rose-400">{Math.trunc(stock.day*100)/100}</div>}

        <div className="hidden tabular-nums text-sm text-slate-300 md:block">{Math.trunc(stock.pct_week*100)/100}</div>
        <SymbolIndicator direction={stock.week_indicator} />
        <button onClick={()=>addToFavorites(stock.symbol)} className="hidden h-7 w-7 items-center justify-center rounded-lg border border-slate-500/70 bg-slate-700 text-sm font-semibold text-slate-100 transition-colors hover:border-cyan-400/70 hover:bg-slate-600 hover:text-cyan-200 md:inline-flex">+</button>
    </div>
    </div>
  )
}

export default SingleStock