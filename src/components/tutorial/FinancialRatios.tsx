import { useMemo } from "react"
import type { Dispatch, SetStateAction } from "react"

type RatioRow = {
  category: string
  ratio: string
  formula: string
  value: string
  commonRange: string
  industryRange: string
  explanation: string
}

const FinancialRatios = ({ setStepFundamental }: { setStepFundamental: Dispatch<SetStateAction<number>> }) => {
  const revenue = 28.9
  const cogs = 16.0
  const operatingIncome = 3.2
  const netIncome = 2.0
  const totalAssets = 42.7
  const priorYearAssets = 36.8
  const averageTotalAssets = (totalAssets + priorYearAssets) / 2

  const totalEquity = 6.7
  const priorYearEquity = 5.9
  const averageEquity = (totalEquity + priorYearEquity) / 2

  const currentAssets = 33.6
  const currentLiabilities = 28.6
  const cash = 16.2
  const receivables = 16.1

  const totalLiabilities = 35.9

  const interestExpense = 0.22

  const inventory = 0.6
  const priorYearInventory = 0.5
  const averageInventory = (inventory + priorYearInventory) / 2

  const priorYearReceivables = 12.8
  const averageReceivables = (receivables + priorYearReceivables) / 2

  const marketPricePerShare = 2050
  const earningsPerShare = 12.5
  const bookValuePerShare = 42.3
  const revenuePerShare = 181.0
  const annualDividendPerShare = 0

  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`
  const formatX = (value: number) => `${value.toFixed(2)}x`

  const rows = useMemo<RatioRow[]>(() => {
    const grossMargin = (revenue - cogs) / revenue
    const operatingMargin = operatingIncome / revenue
    const netMargin = netIncome / revenue
    const roa = netIncome / averageTotalAssets
    const roe = netIncome / averageEquity

    const currentRatio = currentAssets / currentLiabilities
    const quickRatio = (cash + receivables) / currentLiabilities

    const debtToEquity = totalLiabilities / totalEquity
    const debtToAssets = totalLiabilities / totalAssets
    const interestCoverage = operatingIncome / interestExpense

    const assetTurnover = revenue / averageTotalAssets
    const inventoryTurnover = cogs / averageInventory
    const receivablesTurnover = revenue / averageReceivables

    const peRatio = marketPricePerShare / earningsPerShare
    const pbRatio = marketPricePerShare / bookValuePerShare
    const psRatio = marketPricePerShare / revenuePerShare
    const dividendYield = annualDividendPerShare / marketPricePerShare

    return [
      {
        category: "Profitability",
        ratio: "Gross profit margin",
        formula: "(Revenue - Cost of Goods Sold) / Revenue",
        value: formatPercent(grossMargin),
        commonRange: "20% to 60%",
        industryRange: "35% to 50% (e-commerce marketplace)",
        explanation:
          "Shows how much of each sales dollar remains after direct costs. Higher gross margins usually indicate pricing power, strong take rates, or efficient fulfillment economics."
      },
      {
        category: "Profitability",
        ratio: "Operating profit margin",
        formula: "Operating Income / Revenue",
        value: formatPercent(operatingMargin),
        commonRange: "5% to 25%",
        industryRange: "8% to 18% (e-commerce marketplace)",
        explanation:
          "Measures profitability after core operating expenses. It captures management efficiency in scaling fixed costs while growing revenue."
      },
      {
        category: "Profitability",
        ratio: "Net profit margin",
        formula: "Net Income / Revenue",
        value: formatPercent(netMargin),
        commonRange: "3% to 20%",
        industryRange: "4% to 12% (e-commerce marketplace)",
        explanation:
          "Reflects the final percent of revenue retained as profit after all expenses, taxes, and non-operating items."
      },
      {
        category: "Profitability",
        ratio: "Return on assets (ROA)",
        formula: "Net Income / Average Total Assets",
        value: formatPercent(roa),
        commonRange: "3% to 15%",
        industryRange: "4% to 10% (e-commerce marketplace)",
        explanation:
          "Indicates how effectively management converts the asset base into earnings. Asset-heavy models usually run lower ROA than asset-light models."
      },
      {
        category: "Profitability",
        ratio: "Return on equity (ROE)",
        formula: "Net Income / Average Shareholders' Equity",
        value: formatPercent(roe),
        commonRange: "8% to 25%",
        industryRange: "12% to 30% (e-commerce marketplace)",
        explanation:
          "Measures return generated on shareholder capital. Very high ROE can be positive but may also indicate high leverage."
      },
      {
        category: "Liquidity",
        ratio: "Current ratio",
        formula: "Current Assets / Current Liabilities",
        value: formatX(currentRatio),
        commonRange: "1.2x to 2.5x",
        industryRange: "1.0x to 1.8x (e-commerce marketplace)",
        explanation:
          "Tests near-term solvency by comparing short-term assets to short-term obligations. Above 1.0x generally indicates adequate liquidity."
      },
      {
        category: "Liquidity",
        ratio: "Quick ratio",
        formula: "(Cash + Marketable Securities + Accounts Receivable) / Current Liabilities",
        value: formatX(quickRatio),
        commonRange: "0.8x to 2.0x",
        industryRange: "0.8x to 1.6x (e-commerce marketplace)",
        explanation:
          "A stricter liquidity test that excludes inventory. It highlights whether cash-like assets can cover short-term liabilities."
      },
      {
        category: "Solvency",
        ratio: "Debt-to-equity ratio",
        formula: "Total Liabilities / Total Shareholders' Equity",
        value: formatX(debtToEquity),
        commonRange: "0.5x to 2.0x",
        industryRange: "1.0x to 3.0x (e-commerce marketplace)",
        explanation:
          "Shows financing mix between creditor funding and shareholder funding. Lower values generally imply a stronger capital cushion."
      },
      {
        category: "Solvency",
        ratio: "Debt-to-assets ratio",
        formula: "Total Liabilities / Total Assets",
        value: formatPercent(debtToAssets),
        commonRange: "30% to 70%",
        industryRange: "55% to 80% (e-commerce marketplace)",
        explanation:
          "Measures the share of the asset base financed by liabilities. Higher values increase sensitivity to earnings volatility."
      },
      {
        category: "Solvency",
        ratio: "Interest coverage ratio",
        formula: "Operating Income / Interest Expense",
        value: formatX(interestCoverage),
        commonRange: "> 3.0x",
        industryRange: "> 4.0x (e-commerce marketplace)",
        explanation:
          "Evaluates ability to service interest from operating profit. The larger the cushion, the lower the refinancing and distress risk."
      },
      {
        category: "Efficiency",
        ratio: "Asset turnover ratio",
        formula: "Revenue / Average Total Assets",
        value: formatX(assetTurnover),
        commonRange: "0.5x to 2.0x",
        industryRange: "0.6x to 1.4x (e-commerce marketplace)",
        explanation:
          "Tracks how efficiently assets generate revenue. Higher turnover often points to better platform utilization and operational throughput."
      },
      {
        category: "Efficiency",
        ratio: "Inventory turnover ratio",
        formula: "Cost of Goods Sold / Average Inventory",
        value: formatX(inventoryTurnover),
        commonRange: "3x to 10x",
        industryRange: "8x to 20x (e-commerce marketplace)",
        explanation:
          "Measures how quickly inventory is sold and replaced. Fast turnover can reduce storage costs and markdown risk, but overly lean levels can hurt service quality."
      },
      {
        category: "Efficiency",
        ratio: "Receivables turnover ratio",
        formula: "Revenue / Average Accounts Receivable",
        value: formatX(receivablesTurnover),
        commonRange: "4x to 12x",
        industryRange: "1.5x to 3.5x (e-commerce marketplace with fintech exposure)",
        explanation:
          "Indicates collection speed from customers and counterparties. Slower turnover can be normal when credit products are embedded in the platform."
      },
      {
        category: "Valuation",
        ratio: "P/E",
        formula: "Market Price per Share / Earnings per Share",
        value: formatX(peRatio),
        commonRange: "10x to 30x",
        industryRange: "20x to 50x (high-growth marketplace)",
        explanation:
          "Compares price to current earnings power. Growth expectations, risk profile, and interest rates heavily influence this multiple."
      },
      {
        category: "Valuation",
        ratio: "Price-to-book (P/B) ratio",
        formula: "Market Price per Share / Book Value per Share",
        value: formatX(pbRatio),
        commonRange: "1x to 6x",
        industryRange: "4x to 15x (asset-light marketplace)",
        explanation:
          "Relates market value to accounting net worth. High P/B can be reasonable for businesses with strong intangible assets and high expected returns."
      },
      {
        category: "Valuation",
        ratio: "Price-to-sales (P/S) ratio",
        formula: "Market Price per Share / Revenue per Share",
        value: formatX(psRatio),
        commonRange: "1x to 8x",
        industryRange: "3x to 12x (high-growth marketplace)",
        explanation:
          "Useful when earnings are volatile. It compares valuation directly against revenue scale and expected long-term margins."
      },
      {
        category: "Valuation",
        ratio: "Dividend yield",
        formula: "Annual Dividends per Share / Market Price per Share",
        value: formatPercent(dividendYield),
        commonRange: "1% to 5%",
        industryRange: "0% to 1% (growth marketplace)",
        explanation:
          "Shows direct cash return to shareholders. Fast-growing companies often reinvest and keep yields near zero."
      }
    ]
  }, [])

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 md:px-6">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Key Financial Ratios Lab</h2>
        <p className="mt-2 text-sm text-slate-600">
          Calculated from the tutorial statements (mostly 2025 values with simple average proxies where formulas require averages).
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-3 shadow-sm md:p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-separate border-spacing-y-1">
            <thead>
              <tr className="[&>th]:px-4 [&>th]:pb-2 [&>th]:text-left [&>th]:text-xs [&>th]:font-semibold [&>th]:uppercase [&>th]:tracking-wide [&>th]:text-slate-500">
                <th>Category</th>
                <th>Ratio</th>
                <th>Formula</th>
                <th>Calculated Value</th>
                <th>Common Range</th>
                <th>Industry Range (Marketplace/E-commerce)</th>
                <th>Detailed Explanation</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.ratio} className="[&>td]:rounded-none [&>td]:bg-white [&>td]:px-4 [&>td]:py-3 [&>td]:align-top [&>td]:text-sm [&>td]:text-slate-800">
                  <td className="font-semibold text-slate-700">{row.category}</td>
                  <td className="font-semibold">{row.ratio}</td>
                  <td className="font-mono text-xs text-slate-600">{row.formula}</td>
                  <td className="font-semibold text-rose-700">{row.value}</td>
                  <td>{row.commonRange}</td>
                  <td>{row.industryRange}</td>
                  <td className="max-w-[380px] leading-relaxed">{row.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-900 bg-slate-900 p-5 text-slate-100 shadow-lg">
        <h3 className="text-xl font-semibold">How to read this page</h3>
        <ul className="mt-3 list-disc pl-5 text-sm text-slate-300 space-y-1">
          <li>Use Calculated Value to see where the company currently stands.</li>
          <li>Compare against Common Range for broad cross-sector context.</li>
          <li>Compare against Industry Range to avoid misleading cross-industry conclusions.</li>
          <li>Treat valuation and industry ranges as market-dependent and time-varying.</li>
        </ul>

        <button
          onClick={() => setStepFundamental(2)}
          className="mt-5 rounded-lg border border-slate-500 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-600"
        >
          Back to Cash Flow Statement
        </button>
      </div>
    </section>
  )
}

export default FinancialRatios
