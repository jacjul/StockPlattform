import React from 'react'
import {useState} from "react"
import {useQuery,useMutation} from "@tanstack/react-query"
import {getAPI, postAPI} from "../apiCalls"
import SingleStock from "./SingleStock"
export type StocksData ={
    symbol : string
    day: number
    week: number
    month: number
    pct_week: number
    pct_month: number
    week_indicator: string
    month_indicator: string
}

const MultipleStocks = () => {

    const [currentIndex,setCurrentIndex] =useState<number>(0)
    
    const {data:stocks, isPending,error} = useQuery({
        queryKey: ["stocks"],
        queryFn : async ():Promise<StocksData[]> =>{
            const response = await getAPI("/api/stock_data/allStocks")
            console.log(response.message)
            return response.message
        },
        staleTime: 1000*60*5 //5 min
    })

    const mutation = useMutation({
        mutationFn: async (add_symbol:string)=>{
            const response =await postAPI(`/api/stock_data/favorites/${add_symbol}`)
            console.log(response.message)
        }
    })
    
    function addToFavorites(symbol:string){
        console.log(symbol)
        mutation.mutate(symbol)
    }


    if (isPending){return(<div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-300">Is pending</div>)}
    if (error){return(<div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">Following error occured : ${error.message}</div>)}

    const hasNext = (stocks && (currentIndex +10) <stocks.length)? false : true
    const hasBefore = (stocks && currentIndex >=10)? false: true
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/70 shadow-xl backdrop-blur-sm">
        <button onClick={()=>setCurrentIndex(prev =>prev-10)} disabled={hasBefore} className="m-3 rounded-xl border border-slate-500/60 bg-slate-700 px-3 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500" >
            ^
        </button>
        <div className="grid grid-cols-[1.2fr_auto_auto] items-center gap-3 border-b border-slate-700 px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 md:grid-cols-[1.2fr_1fr_1fr_0.8fr_0.6fr]">
            <span>Symbol</span><span>Day</span><span className="hidden md:block">Week %</span><span className="hidden md:block">Trend</span><span className="hidden md:block">Add</span>
        </div>
        <div className="divide-y divide-slate-800/80 px-1 py-1">
            {stocks.slice(currentIndex,currentIndex+10).map(
                stock =><SingleStock key={stock.symbol} stock={stock} addToFavorites={addToFavorites}/>)}
        </div>
        
        <button onClick={()=>setCurrentIndex(prev =>prev+10)} disabled={hasNext} className="m-3 rounded-xl border border-slate-500/60 bg-slate-700 px-3 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500" >
            v
        </button>
    </div>
  )
}

export default MultipleStocks