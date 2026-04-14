import { useEffect, useState } from "react"
import type {Dispatch, SetStateAction} from "react"
import {useQuery} from "@tanstack/react-query"
import {getAPI} from "../../apiCalls"
type LessonStep = {
  id: string
  term: string
  short: string
  explanation: string
  example?: string
}

type CompanyProfile = {
  symbol: string
  short_name: string | null
}

type IncomeStatementYearRow = {
  year: number
  total_revenue: number | null
  cost_of_revenue: number | null
  gross_profit: number | null
  operating_expense: number | null
  selling_general_and_administration: number | null
  research_and_development: number | null
  operating_income: number | null
  net_interest_income: number | null
  other_income_expense: number | null
  pretax_income: number | null
  tax_provision: number | null
  net_income: number | null
}

type IncomeStatementProps = {
  setStepFundamental:Dispatch<SetStateAction<number>>
  selectedCompany: string
  setSelectedCompany: Dispatch<SetStateAction<string>>
}

const IncomeStatement = ({setStepFundamental,selectedCompany,setSelectedCompany }:IncomeStatementProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0)
const [isClickedBalanceSheet, setIsClickedBalanceSheet] = useState<boolean>(false)

const {data:allSymbols, isPending, error} = useQuery({
  queryKey : ["allSymbols"],
  queryFn : async()=>{
              const response = await getAPI("/api/tutorial/getSymbols")
              return response.message
  }
})

const {data:incomeStatement, isPending:isPendingIncome,error:errorIncome} = useQuery({
    queryKey: ["incomeStatement", selectedCompany],
    queryFn : async()=>{
      const response = await getAPI(`/api/tutorial/${selectedCompany}`)
      return response.message
    },
    enabled: !!selectedCompany && selectedCompany.length > 0 
})

const companies: CompanyProfile[] = Array.isArray(allSymbols) ? allSymbols : []
const incomeRows: IncomeStatementYearRow[] = Array.isArray(incomeStatement) ? incomeStatement : []
const activeCompany = selectedCompany || companies[0]?.symbol || "Mercado Libre"

useEffect(() => {
  if (!selectedCompany && companies.length > 0) {
    setSelectedCompany(companies[0].symbol)
  }
}, [companies, selectedCompany])

const billion = 1_000_000_000
const yearToRow = new Map(incomeRows.map((row) => [row.year, row]))
const formatBillions = (value?: number | null) => {
  if (value === null || value === undefined) return "-"
  return (Number(value) / billion).toFixed(1)
}
const valueFor = (year: number, key: keyof IncomeStatementYearRow) => {
  const row = yearToRow.get(year)
  if (!row) return "-"
  return formatBillions(row[key] as number | null | undefined)
}
  const steps: LessonStep[] = [
    {
      id: "revenue",
      term: "Revenue",
      short: "Total money from selling products/services before costs.",
      explanation:
        "Revenue is the top line of the income statement. It tells you how much money came in from core business activities.",
      example: "Revenue is 28.9. Growth vs 2024 is 28.9 - 20.8 = 8.1."
    },
    {
      id: "COGS",
      term: "Cost of Goods Sold (COGS)",
      short: "Direct costs tied to producing goods or delivering services.",
      explanation:
        "COGS includes costs like raw materials, manufacturing, and direct labor. It is subtracted from revenue to calculate gross profit.",
      example: "COGS is 16.0, shown with an illustrative breakdown into materials, labor, and freight."
    },
    {
      id: "grossProfit",
      term: "Gross Profit",
      short: "Revenue minus direct production costs.",
      explanation:
        "Gross profit shows how much remains after paying costs directly tied to producing goods/services.",
      example: "Gross Profit = Revenue - COGS = 28.9 - 16.0 = 12.9."
    },
    {
      id: "operatingExpenses",
      term: "Operating Expenses",
      short: "Ongoing costs required to run the business.",
      explanation:
        "Operating expenses include items like salaries, rent, marketing, SG&A, and R&D that are not direct production costs.",
      example: "Operating Expenses = SG&A (proxy) 7.4 + R&D 2.3 = 9.7."
    },
    {
      id: "operatingIncome",
      term: "Operating Income",
      short: "Profit generated from core operations.",
      explanation:
        "Operating income is gross profit minus operating expenses. It shows how profitable the core business is before interest and taxes.",
      example: "Operating Income = Gross Profit - Operating Expenses = 12.9 - 9.7 = 3.2."
    },
    {
      id: "interest",
      term: "Interest",
      short: "Cost of debt financing or income from cash balances.",
      explanation:
        "Interest reflects borrowing costs (or, less commonly, interest income). It is included below operating income to reach pretax income.",
      example: "Net interest rounds to 0.0 in each year at one decimal, but the underlying values are slightly negative."
    },
    {
      id: "totalNonOperatingIncomeExpense",
      term: "Total Non-Operating Income/Expense",
      short: "Items below operating income, including interest and other non-operating effects.",
      explanation:
        "This line combines net interest with other non-operating gains/losses. Adding it to operating income gives pretax income.",
      example: "2025 bridge: Pretax Income = Operating Income + Total Non-Operating Income/Expense = 3.2 + (-0.4) = 2.8 (rounded)."
    },
    {
      id: "pretaxIncome",
      term: "Pretax Income",
      short: "Earnings before income tax is applied.",
      explanation:
        "Pretax income equals operating income plus or minus non-operating items such as interest. It is the base for calculating taxes.",
      example: "Pretax Income is 2.8, and pretax margin is 2.8 / 28.9 = 9.7%."
    },
    {
      id: "incomeTax",
      term: "Income Tax",
      short: "Taxes owed on pretax earnings.",
      explanation:
        "Income tax is the amount paid to tax authorities based on taxable profit. Subtracting it from pretax income gives net income.",
      example: "Income Tax = 0.8, so effective tax rate is 0.8 / 2.8 = 28.6%."
    },
    {
      id: "netIncome",
      term: "Net Income",
      short: "Final profit after all costs and taxes.",
      explanation:
        "Net income is the amount of money left after paying all costs, interest, and taxes.",
      example: "Net margin = 2.0 / 28.9 = 6.9%."
    }
  ]

  const activeId = steps[currentStep].id

  const getMainRowClass = (id: string, emphasize = false) =>
    [
      "[&>td]:px-4",
      "[&>td]:py-3",
      "[&>td]:align-middle",
      "[&>td]:transition-colors",
      "[&>td:first-child]:rounded-l-lg",
      "[&>td:last-child]:rounded-r-lg",
      "[&>td:not(:first-child)]:text-right",
      emphasize ? "[&>td]:font-semibold" : "",
      activeId === id ? "[&>td]:bg-rose-100 [&>td]:text-rose-900" : "[&>td]:bg-white [&>td]:text-slate-800"
    ].join(" ")

  const detailRowClass = [
    "[&>td]:px-4",
    "[&>td]:py-2",
    "[&>td]:text-sm",
    "[&>td]:!text-black",
    "[&>td:first-child]:pl-8",
    "[&>td:not(:first-child)]:text-right",
    "[&>td]:bg-slate-50"
  ].join(" ")

  const gotoBalanceSheet = ()=>{
    if (isClickedBalanceSheet) return
    setStepFundamental(1)
    setIsClickedBalanceSheet(true)
  }
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8 md:px-6">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Income Statement Tutorial</h2>
        <p className="mt-2 text-sm text-slate-600">{activeCompany} annual data (2023-2025), values in USD billions.</p>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="company-select" className="block text-sm font-semibold text-slate-900">
          Choose a company to analyze
        </label>
        <p className="mt-1 text-sm text-slate-600">
          Select the company you want to analyze. Symbols are loaded from allSymbols.
        </p>
        <select
          id="company-select"
          value={selectedCompany || companies[0]?.symbol || ""}
          onChange={(event) => setSelectedCompany(event.target.value)}
          disabled={isPending || companies.length === 0}
          className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          {companies.map((company) => (
            <option key={company.symbol} value={company.symbol}>
              {company.symbol} {company.short_name ? `- ${company.short_name}` : ""}
            </option>
          ))}
        </select>
        {isPending && <p className="mt-2 text-xs text-slate-500">Loading company symbols...</p>}
        {error && <p className="mt-2 text-xs text-rose-700">Could not load symbols.</p>}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-3 shadow-sm md:p-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate border-spacing-y-1">
              <thead>
                <tr className="[&>th]:px-4 [&>th]:pb-2 [&>th]:text-xs [&>th]:font-semibold [&>th]:uppercase [&>th]:tracking-wide [&>th]:text-slate-500">
                  <th className="text-left">Line Item</th>
                  <th className="text-right">2023</th>
                  <th className="text-right">2024</th>
                  <th className="text-right">2025</th>
                </tr>
              </thead>
              <tbody>
                <tr className={getMainRowClass("revenue")}>
                  <td>Revenue</td>
                  <td>{valueFor(2023, "total_revenue")}</td>
                  <td>{valueFor(2024, "total_revenue")}</td>
                  <td>{valueFor(2025, "total_revenue")}</td>
                </tr>

                <tr className={getMainRowClass("COGS")}>
                  <td>Cost of Goods Sold (COGS)</td>
                  <td>{valueFor(2023, "cost_of_revenue")}</td>
                  <td>{valueFor(2024, "cost_of_revenue")}</td>
                  <td>{valueFor(2025, "cost_of_revenue")}</td>
                </tr>
                {activeId === "COGS" && (
                  <>
                    <tr className={detailRowClass}>
                      <td>SG&amp;A</td>
                      <td>{valueFor(2023, "selling_general_and_administration")}</td>
                      <td>{valueFor(2024, "selling_general_and_administration")}</td>
                      <td>{valueFor(2025, "selling_general_and_administration")}</td>
                    </tr>
                    <tr className={detailRowClass}>
                      <td>R&amp;D</td>
                      <td>{valueFor(2023, "research_and_development")}</td>
                      <td>{valueFor(2024, "research_and_development")}</td>
                      <td>{valueFor(2025, "research_and_development")}</td>
                    </tr>
                  </>
                )}

                <tr className={getMainRowClass("grossProfit", true)}>
                  <td>Gross Profit</td>
                  <td>{valueFor(2023, "gross_profit")}</td>
                  <td>{valueFor(2024, "gross_profit")}</td>
                  <td>{valueFor(2025, "gross_profit")}</td>
                </tr>
                <tr className={getMainRowClass("operatingExpenses")}>
                  <td>Operating Expenses</td>
                  <td>{valueFor(2023, "operating_expense")}</td>
                  <td>{valueFor(2024, "operating_expense")}</td>
                  <td>{valueFor(2025, "operating_expense")}</td>
                </tr>
                {activeId === "operatingExpenses" && (
                  <>
                    <tr className={detailRowClass}>
                      <td>SG&amp;A (Proxy)</td>
                      <td>{valueFor(2023, "selling_general_and_administration")}</td>
                      <td>{valueFor(2024, "selling_general_and_administration")}</td>
                      <td>{valueFor(2025, "selling_general_and_administration")}</td>
                    </tr>
                    <tr className={detailRowClass}>
                      <td>R&amp;D</td>
                      <td>{valueFor(2023, "research_and_development")}</td>
                      <td>{valueFor(2024, "research_and_development")}</td>
                      <td>{valueFor(2025, "research_and_development")}</td>
                    </tr>
                  </>
                )}

                <tr className={getMainRowClass("operatingIncome", true)}>
                  <td>Operating Income</td>
                  <td>{valueFor(2023, "operating_income")}</td>
                  <td>{valueFor(2024, "operating_income")}</td>
                  <td>{valueFor(2025, "operating_income")}</td>
                </tr>
                <tr className={getMainRowClass("interest")}>
                  <td>Net Interest Income</td>
                  <td>{valueFor(2023, "net_interest_income")}</td>
                  <td>{valueFor(2024, "net_interest_income")}</td>
                  <td>{valueFor(2025, "net_interest_income")}</td>
                </tr>
                <tr className={getMainRowClass("totalNonOperatingIncomeExpense")}>
                  <td>Total Non-Operating Income/Expense</td>
                  <td>{valueFor(2023, "other_income_expense")}</td>
                  <td>{valueFor(2024, "other_income_expense")}</td>
                  <td>{valueFor(2025, "other_income_expense")}</td>
                </tr>
                <tr className={getMainRowClass("pretaxIncome", true)}>
                  <td>Pretax Income</td>
                  <td>{valueFor(2023, "pretax_income")}</td>
                  <td>{valueFor(2024, "pretax_income")}</td>
                  <td>{valueFor(2025, "pretax_income")}</td>
                </tr>
                <tr className={getMainRowClass("incomeTax")}>
                  <td>Income Tax</td>
                  <td>{valueFor(2023, "tax_provision")}</td>
                  <td>{valueFor(2024, "tax_provision")}</td>
                  <td>{valueFor(2025, "tax_provision")}</td>
                </tr>
                <tr className={getMainRowClass("netIncome", true)}>
                  <td>Net Income</td>
                  <td>{valueFor(2023, "net_income")}</td>
                  <td>{valueFor(2024, "net_income")}</td>
                  <td>{valueFor(2025, "net_income")}</td>
                </tr>
              </tbody>
            </table>
            {isPendingIncome && <p className="mt-3 text-xs text-slate-500">Loading income statement...</p>}
            {errorIncome && <p className="mt-3 text-xs text-rose-700">Could not load income statement for this symbol.</p>}
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-900 bg-slate-900 p-5 text-slate-100 shadow-lg lg:sticky lg:top-24 lg:h-fit">
          <div className="mb-3 inline-flex rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
            Step {currentStep + 1} of {steps.length}
          </div>
          <h3 className="text-2xl font-semibold leading-tight">{steps[currentStep].term}</h3>
          <p className="mt-2 text-sm text-slate-300">{steps[currentStep].short}</p>

          <div className="mt-4 rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-sm leading-relaxed text-slate-200">
            {steps[currentStep].explanation}
          </div>

          <div className="mt-4 rounded-xl bg-rose-500/15 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-rose-200">Example 2025</div>
            <p className="mt-1 text-sm text-rose-100">{steps[currentStep].example}</p>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 0}
              className="rounded-lg border border-slate-500 bg-slate-700 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <div className="text-sm tabular-nums text-slate-300">
              {currentStep + 1}/{steps.length}
            </div>
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={currentStep >= steps.length - 1}
              className="rounded-lg border border-slate-500 bg-slate-700 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
            <button
                onClick={()=>{gotoBalanceSheet()}}
                className="w-full mt-5 rounded-lg border border-slate-500 bg-slate-700 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={isClickedBalanceSheet}>
                Go to Balance Sheet
            </button>
        </aside>
      </div>
    </section>
  )
}

export default IncomeStatement