import React from 'react'
import type {CompanyProfile} from "../sites/PortalSymbol"

type FundamentalGridProps = {
  stock: CompanyProfile
}

type MetricRowProps = {
  label: string
  value: string
}

type MetricSectionProps = {
  title: string
  description?: string
  children: React.ReactNode
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

function formatDate(value?: string) {
  if (!value) return "-"
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return "-"
  return parsed.toLocaleDateString("en-US")
}

const MetricRow = ({label, value}: MetricRowProps) => {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-md border border-slate-700/80 bg-slate-800/60 px-3 py-2">
      <span className="text-xs uppercase tracking-[0.12em] text-slate-400">{label}</span>
      <span className="value-text font-semibold text-slate-100">{value}</span>
    </div>
  )
}

const MetricSection = ({title, description, children}: MetricSectionProps) => {
  return (
    <section className="rounded-xl border border-slate-700/80 bg-slate-900/70 p-3">
      <div className="mb-3">
        <h3 className="label-primary text-sm uppercase tracking-[0.16em]">{title}</h3>
        {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

const FundamentalGridComponent = ({stock}: FundamentalGridProps) => {
  return (
    <article className="card-shell w-full max-w-3xl">
      <div className="card-content">
        <div className="section-separator">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="label-primary text-lg">{stock.symbol ?? "-"}</h2>
            <span className="value-text rounded-md border border-slate-600/80 bg-slate-800 px-2 py-1 text-slate-200">
              {stock.short_name ?? stock.long_name ?? "Unknown Company"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <MetricSection title="General Information">
        <MetricRow label="Symbol" value={stock.symbol ?? "-"} />
        <MetricRow label="Name" value={stock.short_name ?? stock.long_name ?? "-"} />
        <MetricRow label="Sector" value={stock.sector ?? "-"} />
        <MetricRow label="Industry" value={stock.industry ?? "-"} />
        <MetricRow label="Country" value={stock.country ?? "-"} />
        <MetricRow label="Exchange" value={stock.exchange ?? "-"} />
        <MetricRow label="Currency" value={stock.currency ?? "-"} />
        <MetricRow label="Employees" value={formatNumber(stock.full_time_employees)} />
      </MetricSection>

      <MetricSection title="Size and Core Values" description="Main scale metrics for company size and operating footprint.">
        <MetricRow label="Market Cap" value={formatMoney(stock.market_cap)} />
        <MetricRow label="Enterprise Value" value={formatMoney(stock.enterprise_value)} />
        <MetricRow label="Total Revenue" value={formatMoney(stock.total_revenue)} />
        <MetricRow label="EBITDA" value={formatMoney(stock.ebitda)} />
        <MetricRow label="Free Cashflow" value={formatMoney(stock.free_cashflow)} />
      </MetricSection>

      <MetricSection title="Valuation" description="How expensive or cheap the stock looks relative to earnings and book value.">
        <MetricRow label="Trailing P/E" value={formatNumber(stock.trailing_pe)} />
        <MetricRow label="Forward P/E" value={formatNumber(stock.forward_pe)} />
        <MetricRow label="PEG Ratio" value={formatNumber(stock.peg_ratio)} />
        <MetricRow label="Price to Book" value={formatNumber(stock.price_to_book)} />
      </MetricSection>

      <MetricSection title="Growth and Profitability" description="Shows whether revenue is expanding and if margins are healthy.">
        <MetricRow label="Revenue Growth" value={formatPercent(stock.revenue_growth)} />
        <MetricRow label="Gross Margins" value={formatPercent(stock.gross_margins)} />
        <MetricRow label="Operating Margins" value={formatPercent(stock.operating_margins)} />
        <MetricRow label="Profit Margins" value={formatPercent(stock.profit_margins)} />
      </MetricSection>

      <MetricSection title="Quality and Risk" description="Capital efficiency, balance-sheet strength, and market risk profile.">
        <MetricRow label="Return on Equity" value={formatPercent(stock.return_on_equity)} />
        <MetricRow label="Return on Assets" value={formatPercent(stock.return_on_assets)} />
        <MetricRow label="Debt to Equity" value={formatNumber(stock.debt_to_equity)} />
        <MetricRow label="Current Ratio" value={formatNumber(stock.current_ratio)} />
        <MetricRow label="Quick Ratio" value={formatNumber(stock.quick_ratio)} />
        <MetricRow label="Beta" value={formatNumber(stock.beta)} />
      </MetricSection>

      <MetricSection title="Dividends and Trading">
        <MetricRow label="Dividend Yield" value={formatPercent(stock.dividend_yield)} />
        <MetricRow label="Payout Ratio" value={formatPercent(stock.payout_ratio)} />
        <MetricRow label="Ex Dividend Date" value={formatDate(stock.ex_dividend_date)} />
        <MetricRow label="Average Volume" value={formatNumber(stock.average_volume)} />
        <MetricRow label="52 Week High" value={formatNumber(stock.fifty_two_week_high)} />
        <MetricRow label="52 Week Low" value={formatNumber(stock.fifty_two_week_low)} />
      </MetricSection>
        </div>
      </div>
    </article>
  )
}

export default FundamentalGridComponent