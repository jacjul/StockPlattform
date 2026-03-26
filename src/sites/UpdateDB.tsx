import React from 'react'
import {useMutation } from "@tanstack/react-query"
import {postAPI} from "../apiCalls"

const UpdateDB = () => {

    const updateMutation = useMutation({
        mutationFn: async (symbol?: string)=>{
            const endpoint = symbol ? `/api/update_all/${symbol}` : "/api/update_all"
            return postAPI(endpoint)
        }
    })

    function handleSubmit(event:React.SubmitEvent<HTMLFormElement>){
        event.preventDefault()
        const fd = new FormData(event.currentTarget)
        const symbol = String(fd.get("symbol") ?? "").trim().toUpperCase()

        updateMutation.mutate(symbol || undefined)

    }
  return (
    <div className="full-w h-screen flex flex-col justify-center items-center ">
        <div className=" flex flex-col border-solid border-2 rounded-2xl p-10 gap-4"> 
    <h2>Update DB</h2>
    <h4>This is an Update form to manually trigger an Update of the Following Tables:<br/>
         Daily OHLC, Company Profiles, Financials,Balance Sheet and Cash Flow
    </h4>
    
    <h5>If a symbol is not selected all symbols will be updated - that will take around 15min</h5>
    <form onSubmit={handleSubmit} className="flex flex-row items-center gap-4">
        <label htmlFor="symbol">Add Label for DB-Download</label>
        <input type="text" name="symbol" placeholder="e.g AAPL"/>
        <button className="bg-gray-600 rounded-2xl p-1">Submit</button>
    </form>
    </div>
    </div>
  )
}

export default UpdateDB