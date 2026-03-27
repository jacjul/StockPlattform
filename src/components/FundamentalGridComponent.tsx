import {useMemo} from "react"
import type {CompanyProfile} from "../sites/PortalSymbol"

type FundamentalGridProps = {
  stocks: CompanyProfile[]
  onDeleteStock?: (symbol: string) => void
}

type MetricDefinition = {
  key: string
  label: string
  weight: number
  direction: "higher" | "lower"
  numericValue: (stock: CompanyProfile) => number | null
  displayValue: (stock: CompanyProfile) => string
}

type MetricAnalysis = {
  metric: MetricDefinition
  scoresByIndex: Array<number | null>
  ranksByIndex: Array<number | null>
}

function formatNumber(value?: number) {
  if (value === undefined || value === null) return "-"
  return new Intl.NumberFormat("en-US", {maximumFractionDigits: 2}).format(value)
}

function formatMoney(value?: number) {
  if (value === undefined || value === null) return "-"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value)
}

function formatPercent(value?: number) {
  if (value === undefined || value === null) return "-"
  return `${(value * 100).toFixed(2)}%`
}

const metrics: MetricDefinition[] = [
  {
    key: "revenue_growth",
    label: "Revenue Growth",
    weight: 0.1,
    direction: "higher",
    numericValue: (s) => s.revenue_growth ?? null,
    displayValue: (s) => formatPercent(s.revenue_growth),
  },
  {
    key: "gross_margins",
    label: "Gross Margins",
    weight: 0.08,
    direction: "higher",
    numericValue: (s) => s.gross_margins ?? null,
    displayValue: (s) => formatPercent(s.gross_margins),
  },
  {
    key: "profit_margins",
    label: "Profit Margins",
    weight: 0.12,
    direction: "higher",
    numericValue: (s) => s.profit_margins ?? null,
    displayValue: (s) => formatPercent(s.profit_margins),
  },
  {
    key: "return_on_equity",
    label: "Return on Equity",
    weight: 0.12,
    direction: "higher",
    numericValue: (s) => s.return_on_equity ?? null,
    displayValue: (s) => formatPercent(s.return_on_equity),
  },
  {
    key: "return_on_assets",
    label: "Return on Assets",
    weight: 0.08,
    direction: "higher",
    numericValue: (s) => s.return_on_assets ?? null,
    displayValue: (s) => formatPercent(s.return_on_assets),
  },
  {
    key: "debt_to_equity",
    label: "Debt to Equity",
    weight: 0.1,
    direction: "lower",
    numericValue: (s) => s.debt_to_equity ?? null,
    displayValue: (s) => formatNumber(s.debt_to_equity),
  },
  {
    key: "current_ratio",
    label: "Current Ratio",
    weight: 0.05,
    direction: "higher",
    numericValue: (s) => s.current_ratio ?? null,
    displayValue: (s) => formatNumber(s.current_ratio),
  },
  {
    key: "quick_ratio",
    label: "Quick Ratio",
    weight: 0.05,
    direction: "higher",
    numericValue: (s) => s.quick_ratio ?? null,
    displayValue: (s) => formatNumber(s.quick_ratio),
  },
  {
    key: "forward_pe",
    label: "Forward P/E",
    weight: 0.08,
    direction: "lower",
    numericValue: (s) => s.forward_pe ?? null,
    displayValue: (s) => formatNumber(s.forward_pe),
  },
  {
    key: "price_to_book",
    label: "Price to Book",
    weight: 0.06,
    direction: "lower",
    numericValue: (s) => s.price_to_book ?? null,
    displayValue: (s) => formatNumber(s.price_to_book),
  },
  {
    key: "market_cap",
    label: "Market Cap",
    weight: 0.05,
    direction: "higher",
    numericValue: (s) => s.market_cap ?? null,
    displayValue: (s) => formatMoney(s.market_cap),
  },
  {
    key: "free_cashflow",
    label: "Free Cashflow",
    weight: 0.08,
    direction: "higher",
    numericValue: (s) => s.free_cashflow ?? null,
    displayValue: (s) => formatMoney(s.free_cashflow),
  },
  {
    key: "beta",
    label: "Beta",
    weight: 0.07,
    direction: "lower",
    numericValue: (s) => s.beta ?? null,
    displayValue: (s) => formatNumber(s.beta),
  },
  {
    key: "dividend_yield",
    label: "Dividend Yield",
    weight: 0.06,
    direction: "higher",
    numericValue: (s) => s.dividend_yield ?? null,
    displayValue: (s) => formatPercent(s.dividend_yield),
  },
]

function toBand(score: number | null): "good" | "neutral" | "weak" | "missing" {
  if (score === null) return "missing"
  if (score >= 67) return "good"
  if (score >= 34) return "neutral"
  return "weak"
}

function scoreCellClass(score: number | null): string {
  const band = toBand(score)
  if (band === "good") return "bg-emerald-900/25 text-emerald-100"
  if (band === "neutral") return "bg-amber-900/20 text-amber-100"
  if (band === "weak") return "bg-rose-900/25 text-rose-100"
  return "bg-slate-900/20 text-slate-400"
}

function computeMetricAnalysis(stocks: CompanyProfile[], metric: MetricDefinition): MetricAnalysis {
  const values = stocks.map((stock) => metric.numericValue(stock))
  const valid = values
    .map((value, index) => ({value, index}))
    .filter((entry): entry is {value: number; index: number} => entry.value !== null)

  const scoresByIndex: Array<number | null> = new Array(stocks.length).fill(null)
  const ranksByIndex: Array<number | null> = new Array(stocks.length).fill(null)

  if (!valid.length) {
    return {metric, scoresByIndex, ranksByIndex}
  }

  const valuesOnly = valid.map((entry) => entry.value)
  const min = Math.min(...valuesOnly)
  const max = Math.max(...valuesOnly)

  for (const entry of valid) {
    let score: number
    if (max === min) {
      score = 50
    } else if (metric.direction === "higher") {
      score = ((entry.value - min) / (max - min)) * 100
    } else {
      score = ((max - entry.value) / (max - min)) * 100
    }

    scoresByIndex[entry.index] = Math.max(0, Math.min(100, score))
  }

  const sorted = [...valid].sort((a, b) => {
    return metric.direction === "higher" ? b.value - a.value : a.value - b.value
  })

  let currentRank = 1
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i].value !== sorted[i - 1].value) {
      currentRank = i + 1
    }
    ranksByIndex[sorted[i].index] = currentRank
  }

  return {metric, scoresByIndex, ranksByIndex}
}

function getOverall(stocks: CompanyProfile[], analysis: MetricAnalysis[]) {
  const scores = stocks.map((_stock, stockIndex) => {
    let weightedSum = 0
    let availableWeight = 0

    for (const row of analysis) {
      const score = row.scoresByIndex[stockIndex]
      if (score === null) continue
      weightedSum += score * row.metric.weight
      availableWeight += row.metric.weight
    }

    return availableWeight > 0 ? weightedSum / availableWeight : null
  })

  const valid = scores
    .map((value, index) => ({value, index}))
    .filter((entry): entry is {value: number; index: number} => entry.value !== null)
    .sort((a, b) => b.value - a.value)

  const ranks: Array<number | null> = new Array(stocks.length).fill(null)
  let currentRank = 1
  for (let i = 0; i < valid.length; i++) {
    if (i > 0 && valid[i].value !== valid[i - 1].value) {
      currentRank = i + 1
    }
    ranks[valid[i].index] = currentRank
  }

  return {scores, ranks}
}

export default function FundamentalGridComponent({stocks, onDeleteStock}: FundamentalGridProps) {
  if (!stocks.length) return null

  const analysis = useMemo(() => {
    return metrics.map((metric) => computeMetricAnalysis(stocks, metric))
  }, [stocks])

  const overall = useMemo(() => {
    return getOverall(stocks, analysis)
  }, [stocks, analysis])

  return (
    <section className="mt-4 overflow-x-auto rounded-xl border border-slate-700/70 bg-slate-950/70">
      <div className="border-b border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold uppercase tracking-wide text-slate-200">Scoring MVP</span>
          <span className="rounded-sm bg-emerald-900/35 px-2 py-0.5 text-emerald-100">strong</span>
          <span className="rounded-sm bg-amber-900/30 px-2 py-0.5 text-amber-100">neutral</span>
          <span className="rounded-sm bg-rose-900/35 px-2 py-0.5 text-rose-100">weak</span>
          <span className="text-slate-400">Overall score uses weighted metrics (0-100), ranks shown as #.</span>
        </div>
      </div>
      <table className="min-w-full border-collapse text-left text-xs text-slate-100">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 whitespace-nowrap border-b border-r border-slate-700 bg-slate-900 px-3 py-2 font-semibold uppercase tracking-wide text-slate-300">
              Metric
            </th>
            {stocks.map((stock, index) => {
              const symbol = stock.symbol ?? `stock-${index}`
              return (
                <th key={symbol} className="min-w-[220px] whitespace-nowrap border-b border-slate-700 bg-slate-900 px-3 py-2 align-top">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold">
                      {stock.symbol ?? "-"} - {stock.short_name ?? stock.long_name ?? "Unknown"}
                    </span>
                    {onDeleteStock && stock.symbol && (
                      <button
                        type="button"
                        className="rounded-md bg-red-400/20 px-2 py-1 text-[11px] text-red-200 hover:bg-red-400/30"
                        onClick={() => onDeleteStock(stock.symbol!)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-slate-800/70">
            <th className="sticky left-0 z-10 whitespace-nowrap border-r border-slate-700 bg-slate-900 px-3 py-2 font-semibold text-slate-200">
              Overall Score
            </th>
            {stocks.map((stock, index) => {
              const score = overall.scores[index]
              const rank = overall.ranks[index]
              return (
                <td
                  key={`overall-score-${stock.symbol ?? index}`}
                  className={`whitespace-nowrap border-l border-slate-700 px-3 py-2 font-semibold ${scoreCellClass(score)}`}
                >
                  {score === null ? "-" : `${score.toFixed(1)} / 100`}
                  {rank !== null ? ` | #${rank}` : ""}
                </td>
              )
            })}
          </tr>

          {analysis.map((row, rowIndex) => (
            <tr key={row.metric.key} className={rowIndex % 2 === 0 ? "bg-slate-900/20" : "bg-slate-900/40"}>
              <th className="sticky left-0 z-10 whitespace-nowrap border-r border-slate-800 bg-slate-900 px-3 py-2 font-medium text-slate-300">
                {row.metric.label}
                <span className="ml-2 text-[10px] text-slate-500">w {row.metric.weight.toFixed(2)}</span>
              </th>
              {stocks.map((stock, index) => (
                <td
                  key={`${row.metric.key}-${stock.symbol ?? index}`}
                  className={`whitespace-nowrap border-l border-slate-800 px-3 py-2 ${scoreCellClass(row.scoresByIndex[index])}`}
                  title={row.scoresByIndex[index] === null ? "No data" : `Score ${row.scoresByIndex[index]?.toFixed(1)} / 100`}
                >
                  {row.metric.displayValue(stock)}
                  {row.ranksByIndex[index] !== null ? (
                    <span className="ml-2 rounded bg-black/20 px-1 py-0.5 text-[10px] text-slate-200">
                      #{row.ranksByIndex[index]}
                    </span>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}

          <tr className="bg-slate-800/60">
            <th className="sticky left-0 z-10 whitespace-nowrap border-r border-slate-700 bg-slate-900 px-3 py-2 font-medium text-slate-300">
              Coverage
            </th>
            {stocks.map((stock, index) => {
              const available = analysis.filter((row) => row.scoresByIndex[index] !== null).length
              return (
                <td key={`coverage-${stock.symbol ?? index}`} className="whitespace-nowrap border-l border-slate-700 px-3 py-2 text-slate-300">
                  {available} / {analysis.length} metrics
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </section>
  )
}
