import {useQuery, useQueryClient} from "@tanstack/react-query"
import {useState} from "react"
import {getAPI} from "../apiCalls"
import {useAuth} from "../components/context/AuthContext"
import FundamentalGridComponent from "../components/FundamentalGridComponent"
import type {CompanyProfile} from "../sites/PortalSymbol"

const container_checkbox = "flex flex-row gap-2"
const container_search_check = "flex justify-center gap-3"
type StockInfos = {
    country: string
    gross_margins: number
    industry: string
    market_cap : number
    revenue_growth : number
    sector: string
    short_name : string
    symbol: string

}
type SubmittedRequest = {
    symbol : string
    industry? : string
    country?: string
    market_cap_min?: number
    market_cap_max?: number

}
type FilterKey = "industry" | "marketCap" | "country"
export default function FundamentalLab (){
    const queryClient = useQueryClient()
    const [currentSelect,setCurrentSelect] =useState("")
    const [filters, setFilters] =useState<Set<FilterKey>>(new Set())
    const [submittedRequest, setSubmittedRequest] =useState<SubmittedRequest | null>(null)

    const {accessToken} = useAuth()
    const {data:symbolsAvailable = [], isPending,error} = useQuery({
        queryKey: ["symbolsAvailable"],
        queryFn : async ():Promise<StockInfos[]>=>{
            const response = await getAPI("/api/stock_data/comparison", accessToken)
            return response.message
        },
        staleTime: 1000*60*60
    }) 

    
    const {data:searchedStocks = []} = useQuery<CompanyProfile[]>({
    queryKey: ["searchStocks", submittedRequest], 
    enabled: !!submittedRequest,

    queryFn : async (): Promise<CompanyProfile[]> => {
        if (!submittedRequest) return []
        const params = new URLSearchParams()
        if(submittedRequest.industry) params.set("industry", submittedRequest.industry)
        if(submittedRequest.market_cap_min !== undefined) params.set("market_cap_min", String(submittedRequest.market_cap_min))
        if(submittedRequest.market_cap_max !== undefined) params.set("market_cap_max", String(submittedRequest.market_cap_max))
        if (submittedRequest.country) params.set("country", submittedRequest.country)
        const url = `/api/stock_data/comparison/${submittedRequest.symbol}?${params.toString()}`
        const response = await getAPI(url, accessToken)

        return response.message
    },
    staleTime : 1000*60*60,
    })

    function toggleFilter(filter: FilterKey, checked: boolean){
        setFilters(prev => {
            const next = new Set(prev)
            if (checked) next.add(filter)
            else next.delete(filter)
            return next
        })
    }

    function handleSubmit(event:React.SubmitEvent<HTMLFormElement>){
    event.preventDefault()
    const normalizedSymbol = currentSelect.trim().toUpperCase()
    const currentSymbolObject = symbolsAvailable.find(s =>s.symbol===normalizedSymbol)
    if (!currentSymbolObject) return

    const next: SubmittedRequest = {"symbol":currentSymbolObject.symbol}

    if (filters.has("industry")) next.industry = currentSymbolObject.industry
    if (filters.has("country")) next.country = currentSymbolObject.country
    if (filters.has("marketCap")) {
        const tolerance = 0.3
        next.market_cap_min = Math.floor(currentSymbolObject.market_cap * (1 - tolerance))
        next.market_cap_max = Math.ceil(currentSymbolObject.market_cap * (1 + tolerance))
    }

    setSubmittedRequest(next)
}

    function handleDeleteStock(symbol: string) {
        if (!submittedRequest) return
        queryClient.setQueryData<CompanyProfile[]>(["searchStocks", submittedRequest], (old = []) =>
            old.filter((stock) => stock.symbol !== symbol)
        )
    }




    if (isPending)return <div>Is pending</div>
    if (error) return <div>Following error occured {(error as Error).message}</div>
    return(
        <div className="w-full">
            <form onSubmit={handleSubmit}>
                <div className={container_search_check +" p-1"}>

                <label htmlFor="symbol">Select a Symbol</label>
                <input list="symbol-list" type ="text" name="symbol" id="symbol" className="rounded-xl"
                    onChange={(e)=> setCurrentSelect(e.target.value.toUpperCase())} placeholder="search a Symbol" 
                value={currentSelect} />
                <datalist id="symbol-list">
                    {symbolsAvailable.map((s: StockInfos)=><option key={s.symbol} value={s.symbol}>{s.symbol} {s.short_name}</option>)}
                </datalist>
                <button className="rounded-xl p-1 bg-gray-200">Submit</button>
                </div>
                <div className ={container_search_check}>
                    <div className={container_checkbox}>
                        <label htmlFor="industry">Similar Industry</label>
                        <input
                            type ="checkbox"
                            id="industry"
                            name="check"
                            value="industry"
                            checked={filters.has("industry")}
                            onChange={(e) => toggleFilter("industry", e.target.checked)}
                        />
                    </div>
                    <div className={container_checkbox}>
                        <label htmlFor="marketCap">Similar Market Cap</label>
                        <input
                            type ="checkbox"
                            id="marketCap"
                            name="check"
                            value="marketCap"
                            checked={filters.has("marketCap")}
                            onChange={(e) => toggleFilter("marketCap", e.target.checked)}
                        />
                    </div>
                    <div className={container_checkbox}>
                        <label htmlFor="country">Same Country</label>
                        <input
                            type ="checkbox"
                            id="country"
                            name="check"
                            value="country"
                            checked={filters.has("country")}
                            onChange={(e) => toggleFilter("country", e.target.checked)}
                        />
                    </div>
                </div>
            </form>
            
            {submittedRequest && searchedStocks.length === 0 && (
                <div>No matching companies found.</div>
            )}

            <FundamentalGridComponent stocks={searchedStocks} onDeleteStock={handleDeleteStock} />
            
        </div>
    )
}
/*
What To Compare

Same industry (primary anchor): best for business model similarity.
Same market-cap bucket: small caps should be compared with small caps, large with large.
Same geography/listing market: regulation, currency, and macro cycle matter.
Similar profitability profile: gross margin, operating margin, ROIC.
Similar growth profile: revenue growth, EPS growth.
Similar leverage/risk: debt ratios, beta, volatility.
Valuation multiples on top: P/E, EV/EBITDA, P/S, FCF yield. */