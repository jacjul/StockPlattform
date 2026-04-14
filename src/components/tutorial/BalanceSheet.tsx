import { useState } from "react"
import type { Dispatch, SetStateAction } from "react"
type AssetProps ={
  name: string
  cash : number
  receivables : number
  inventory : number
  otherCurrentAssets : number
  totalCurrentAssets : number
  propertyPlantEquipment : number
  longtermInvestments : number
  goodwill : number
  otherLongtermAssets: number
  totalLongtermAssets: number
  totalAssets:number
}
type LiabilityEquityProps = {
  name: string
  totalCurrentLiabilities : number
  longtermDebt: number
  noncurrentLiabilities: number
  totalLongtermLiabilities:number
  totalLiabilities:number
  retainedEarnings:number
  commonStock:number
  totalEquity:number
  totalLiabilitiesEquity:number

}
type LessonStep = {
  id: string
  term: string
  short: string
  explanation: string
  example: string
}

const BalanceSheet = ({ setStepFundamental }: { setStepFundamental: Dispatch<SetStateAction<number>> }) => {
  const [currentStep, setCurrentStep] = useState<number>(0)

  const assets:AssetProps = {name: "Assets", cash:16.2, receivables:16.1, inventory:0.6,
      otherCurrentAssets : 0.7,
      totalCurrentAssets : 33.6,
      propertyPlantEquipment : 2.3,
      longtermInvestments : 1.7,
      goodwill : 0.2,
      otherLongtermAssets: 0.4,
      totalLongtermAssets: 9.1,
      totalAssets:42.7
   }
  const liabilityEquity:LiabilityEquityProps={
      name : "Liabilities & Equity",
      totalCurrentLiabilities : 28.6,
      longtermDebt: 4.5,
      noncurrentLiabilities: 0.6,
      totalLongtermLiabilities:7.3,
      totalLiabilities:35.9,
      retainedEarnings:5.8,
      commonStock:0,
      totalEquity:6.7,
      totalLiabilitiesEquity:42.7,
  }

  const steps: LessonStep[] = [
    {
      id: "cash",
      term: "Cash",
      short: "Most liquid asset used to operate the business day to day.",
      explanation:
        "Cash is immediately available and helps the company pay suppliers, salaries, and short-term obligations.",
      example: "Cash at 2025 is 16.2, up from 12.4 in 2024."
    },
    {
      id: "receivables",
      term: "Receivables",
      short: "Money customers owe the company.",
      explanation:
        "Receivables represent sales already made but not yet collected in cash.",
      example: "Receivables are 16.1 in 2025, showing a large working-capital position."
    },
    {
      id: "inventory",
      term: "Inventory",
      short: "Goods held for sale.",
      explanation:
        "Inventory includes products waiting to be sold. Too much can tie up cash; too little can hurt sales.",
      example: "Inventory is 0.6 in 2025, relatively small vs total current assets."
    },
    {
      id: "totalCurrentAssets",
      term: "Total Current Assets",
      short: "Assets expected to be converted to cash within one year.",
      explanation:
        "This combines cash, receivables, inventory, and other current assets to indicate short-term liquidity.",
      example: "Total Current Assets = 33.6 in 2025."
    },
    {
      id: "propertyPlantEquipment",
      term: "Property, Plant & Equipment",
      short: "Long-lived physical assets like offices and equipment.",
      explanation:
        "PP&E supports operations over multiple years and is a non-current asset.",
      example: "PP&E is 2.3 in 2025."
    },
    {
      id: "totalLongtermAssets",
      term: "Total Long-Term Assets",
      short: "Assets expected to provide value for more than one year.",
      explanation:
        "Long-term assets include PP&E, long-term investments, goodwill, and other long-term items.",
      example: "Total Long-Term Assets are 9.1 in 2025."
    },
    {
      id: "totalAssets",
      term: "Total Assets",
      short: "Everything the company owns.",
      explanation:
        "Total assets combine current and non-current assets and represent the full resource base.",
      example: "Total Assets = 42.7 in 2025."
    },
    {
      id: "totalCurrentLiabilities",
      term: "Total Current Liabilities",
      short: "Obligations due within one year.",
      explanation:
        "These are near-term debts and payables that must be covered by operating cash and current assets.",
      example: "Total Current Liabilities = 28.6 in 2025."
    },
    {
      id: "longtermDebt",
      term: "Long-Term Debt",
      short: "Borrowings due after one year.",
      explanation:
        "Long-term debt is financing that supports growth but adds fixed repayment obligations.",
      example: "Long-Term Debt is 4.5 in 2025."
    },
    {
      id: "totalLiabilities",
      term: "Total Liabilities",
      short: "All obligations owed by the company.",
      explanation:
        "Total liabilities include both current and long-term obligations and show total claims by creditors.",
      example: "Total Liabilities = 35.9 in 2025."
    },
    {
      id: "totalEquity",
      term: "Total Equity",
      short: "Owners' residual claim after liabilities.",
      explanation:
        "Equity represents what belongs to shareholders after subtracting liabilities from assets.",
      example: "Total Equity = 6.7 in 2025."
    },
    {
      id: "totalLiabilitiesEquity",
      term: "Balance Check",
      short: "Assets must equal Liabilities plus Equity.",
      explanation:
        "The balance sheet identity confirms internal consistency: Assets = Liabilities + Equity.",
      example: "42.7 (Assets) = 35.9 (Liabilities) + 6.7 (Equity), with rounding differences possible."
    }
  ]

  const activeId = steps[currentStep].id

  const getRowClass = (id: string, emphasize = false) =>
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

  const gotoIncomeStatement = () => {
    setStepFundamental(0)
  }

  const gotoCashFlowStatement = () => {
    setStepFundamental(2)
  }

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8 md:px-6">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Balance Sheet Tutorial</h2>
        <p className="mt-2 text-sm text-slate-600">Mercado Libre 2025 snapshot, values in USD billions.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <div className="grid gap-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-3 shadow-sm md:p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">{assets.name}</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] border-separate border-spacing-y-1">
                <tbody>
                  <tr className={getRowClass("cash")}>
                    <td>Cash</td>
                    <td>{assets.cash}</td>
                  </tr>
                  <tr className={getRowClass("receivables")}>
                    <td>Receivables</td>
                    <td>{assets.receivables}</td>
                  </tr>
                  <tr className={getRowClass("inventory")}>
                    <td>Inventory</td>
                    <td>{assets.inventory}</td>
                  </tr>
                  <tr className={getRowClass("totalCurrentAssets", true)}>
                    <td>Total Current Assets</td>
                    <td>{assets.totalCurrentAssets}</td>
                  </tr>
                  <tr className={getRowClass("propertyPlantEquipment")}>
                    <td>Property, Plant &amp; Equipment</td>
                    <td>{assets.propertyPlantEquipment}</td>
                  </tr>
                  <tr className={getRowClass("totalLongtermAssets", true)}>
                    <td>Total Long-Term Assets</td>
                    <td>{assets.totalLongtermAssets}</td>
                  </tr>
                  <tr className={getRowClass("totalAssets", true)}>
                    <td>Total Assets</td>
                    <td>{assets.totalAssets}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-3 shadow-sm md:p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">{liabilityEquity.name}</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] border-separate border-spacing-y-1">
                <tbody>
                  <tr className={getRowClass("totalCurrentLiabilities")}>
                    <td>Total Current Liabilities</td>
                    <td>{liabilityEquity.totalCurrentLiabilities}</td>
                  </tr>
                  <tr className={getRowClass("longtermDebt")}>
                    <td>Long-Term Debt</td>
                    <td>{liabilityEquity.longtermDebt}</td>
                  </tr>
                  <tr className={getRowClass("totalLiabilities", true)}>
                    <td>Total Liabilities</td>
                    <td>{liabilityEquity.totalLiabilities}</td>
                  </tr>
                  <tr className={getRowClass("totalEquity", true)}>
                    <td>Total Equity</td>
                    <td>{liabilityEquity.totalEquity}</td>
                  </tr>
                  <tr className={getRowClass("totalLiabilitiesEquity", true)}>
                    <td>Total Liabilities &amp; Equity</td>
                    <td>{liabilityEquity.totalLiabilitiesEquity}</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
            <div className="text-xs font-semibold uppercase tracking-wide text-rose-200">Example</div>
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

          <div className="mt-5 grid gap-2">
            <button
              onClick={gotoIncomeStatement}
              className="w-full rounded-lg border border-slate-500 bg-slate-700 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-600"
            >
              Back to Income Statement
            </button>
            <button
              onClick={gotoCashFlowStatement}
              className="w-full rounded-lg border border-rose-300/70 bg-rose-500/90 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
            >
              Go to Cash Flow Statement
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default BalanceSheet