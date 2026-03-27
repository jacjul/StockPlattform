import React, {useState} from 'react'
import {useMutation } from "@tanstack/react-query"
import {postAPI} from "../apiCalls"
import {useAuth} from "../components/context/AuthContext"

type UpdateVars ={
    endpointQ :string
    dateBody: {
        start : string
        end : string
    }
}
const UpdateDB = () => {
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)

    const {accessToken} = useAuth()
    const [hasCheckedBox, setHasCheckedBox] = useState<boolean>(false) 
    const [startDate, setStartDate] = useState(sevenDaysAgo.toISOString().substring(0,10))
    const [endDate, setEndDate] = useState(today.toISOString().substring(0,10))


    const updateMutation = useMutation({
        mutationFn: async ({endpointQ, dateBody}:UpdateVars)=>{
            const response = await postAPI(endpointQ, accessToken, dateBody)
            return response.message
        }
    })

    function handleSubmit(event:React.SubmitEvent<HTMLFormElement>){
        event.preventDefault()
        const fd = new FormData(event.currentTarget)
        const symbol = String(fd.get("symbol") ?? "").trim().toUpperCase()
        const checks = fd.getAll("check")
        
        const dateStart = fd.get("start")
        const dateEnd = fd.get("end")

        const dateBody = {start: dateStart,end : dateEnd}


        const searchParams = new URLSearchParams()
        checks.forEach(check =>{searchParams.set(check, "True")})



        const endpoint = symbol ? `/api/update_all/${symbol}` : "/api/update_all"
        const endpointQ = searchParams ? endpoint +"?"+ searchParams.toString() : endpoint 

        updateMutation.mutate({endpointQ,dateBody})

    }

    function handleCheckboxChange(event:React.ChangeEvent<HTMLInputElement>){
        const form = event.currentTarget.form

        if (!form) return
        const checkedBoxes = form.querySelectorAll('input[name="check"]:checked').length
        setHasCheckedBox(checkedBoxes>0)
    }
  return (
    <div className="full-w h-screen flex flex-col justify-center items-center ">
        <div className=" flex flex-col border-solid border-2 rounded-2xl p-10 gap-4"> 
    <h2>Update DB</h2>
    <h4>This is an Update form to manually trigger an Update of the Following Tables:<br/>
         Daily OHLC, Company Profiles, Financials,Balance Sheet and Cash Flow
    </h4>
    
    <h5>If a symbol is not selected all symbols will be updated - that will take more then 20min</h5>
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <div>
            <label htmlFor="symbol">Add Symbol for DB-Download</label>
            <input type="text" name="symbol" placeholder="e.g AAPL"/>
        </div>
        <div className="flex flex-row gap-2 p-1">
            <label htmlFor="start">Start time</label>
            <input type ="date" name="start" id="start" value={startDate} onChange={(e) => setStartDate(e.target.value)} max={endDate}/>
            <label htmlFor="end">End time</label>
            <input type ="date" name="end" id="end" value={endDate} onChange={(e)=>setEndDate(e.target.value)} min={startDate}/>
        </div>
        <div className="flex flex-row gap-5">
            <div className="flex flex-row gap-2"> 
            <label htmlFor="daily">Daily Updates</label>
            <input type="checkbox" id="daily" name="check" value="daily" onChange={handleCheckboxChange}/>
            </div>
            <div className=" flex flex-row gap-2">
            <label htmlFor="infos">Infos</label>
            <input type="checkbox" id="infos" name="check" value="infos" onChange={handleCheckboxChange}/>
            </div>
            <div className="flex flex-row gap-2">
            <label htmlFor="financials">Financials</label>
            <input type="checkbox" id="financials" name="check" value="financials" onChange={handleCheckboxChange}/>
            </div>     
        </div>

        
                <button
                    className="bg-gray-600 disabled:bg-gray-500 rounded-2xl p-1"
                    disabled={!hasCheckedBox || updateMutation.isPending}
                >
                    {updateMutation.isPending ? "Updating..." : "Submit"}
                </button>
    </form>
    </div>
    </div>
  )
}

export default UpdateDB