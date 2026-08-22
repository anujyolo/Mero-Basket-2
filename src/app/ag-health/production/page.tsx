import { AGHealthShell, DataTable, PieChartCard, dashboardIcons } from "../_components";
import { formatNpr, formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";
import { ProductionReport } from "./production-report";

export const dynamic = "force-dynamic";

const compactUnits = (value: number) => `${new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value)} pcs`;

function Kpi({ title, value, note, source, tone = "info" }: { title: string; value: string; note: string; source: string; tone?: "primary" | "info" | "gold" | "green" | "red" }) {
  const Icon = dashboardIcons.Factory;
  return (
    <article className={`kpi-card ${tone}`}>
      <div className="kpi-header"><h3 className="kpi-title">{title}</h3><span className="kpi-icon"><Icon className="size-5" /></span></div>
      <div className="kpi-value">{value}</div>
      <p className="kpi-subtitle">{note}</p>
      <span className="kpi-trend">{source}</span>
    </article>
  );
}

function OutputChart({ bars }: { bars: { label: string; amount: number; height: number }[] }) {
  const max = Math.max(...bars.map((bar) => bar.amount), 0);
  const ticks = [max, max * 0.75, max * 0.5, max * 0.25, 0];
  const hasPositiveValues = bars.some((bar) => bar.amount > 0);
  return (
    <article className="chart-container">
      <div className="chart-header"><div><h3 className="chart-title">Monthly Production Output</h3><p className="chart-subtitle">How many pieces were produced each month.</p></div><span className="kpi-trend">{bars.length} months</span></div>
      <div className="premium-chart-surface mt-8 grid grid-cols-[5.8rem_minmax(0,1fr)] gap-4 p-4">
        <div className="flex h-[360px] flex-col justify-between pb-10 text-right text-[11px] font-black text-[var(--text-light)]">{ticks.map((tick, index) => <span key={index}>{compactUnits(tick)}</span>)}</div>
        <div className="min-w-0 overflow-x-auto">
          <div className="premium-chart-axis relative flex h-[360px] min-w-[48rem] items-end gap-6 px-4 pb-4">
            {!hasPositiveValues ? <div className="premium-chart-empty">ERP returned production months, but no positive output values for this view.</div> : null}
            {bars.map((bar) => <div key={bar.label} className="flex h-full min-w-12 flex-1 flex-col items-center justify-end gap-2"><span className="text-center text-[11px] font-black leading-tight text-[var(--navy)]">{compactUnits(bar.amount)}</span><span className="premium-chart-bar w-full bg-[#10b981]" title={`${bar.label}: ${formatQuantity(bar.amount, "pcs")}`} style={{ height: `${Math.min(96, Math.max(bar.amount > 0 ? 6 : 0, bar.height))}%` }} /><span className="max-w-20 truncate text-xs font-black text-[var(--text-light)]">{bar.label}</span></div>)}
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {bars.slice(-8).map((bar) => <div key={`value-${bar.label}`} className="rounded-2xl bg-[var(--soft)] px-4 py-3"><p className="text-xs font-black uppercase tracking-[0.1em] text-[var(--text-light)]">{bar.label}</p><p className="mt-1 text-lg font-black text-[var(--navy)]">{formatQuantity(bar.amount, "pcs")}</p></div>)}
      </div>
    </article>
  );
}

function SummaryStrip({ stats }: { stats: { label: string; value: string; detail: string }[] }) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article key={stat.label} className="rounded-[1.35rem] border border-[var(--border)] bg-white/90 p-5 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-black uppercase tracking-[0.13em] text-[var(--text-light)]">{stat.label}</p>
          <p className="mt-3 text-2xl font-black text-[var(--ink)]">{stat.value}</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[var(--text)]">{stat.detail}</p>
        </article>
      ))}
    </div>
  );
}

function ComboChart({ bars, revenues }: { bars: { label: string; height: number }[]; revenues: { label: string; amount: number }[] }) {
  const revenueByMonth = new Map(revenues.map((row) => [row.label, row.amount]));
  const revenueMax = Math.max(...revenues.map((row) => row.amount), 0);
  const hasPositiveValues = bars.some((bar) => bar.height > 0) || revenueMax > 0;
  return (
    <article className="chart-container">
      <div className="chart-header"><div><h3 className="chart-title">Production vs Sales</h3><p className="chart-subtitle">Compare pieces produced with sales value by month.</p></div></div>
      <div className="mt-5 flex gap-4 text-sm font-black"><span className="text-emerald-600">Production</span><span className="text-[var(--navy)]">Revenue</span></div>
      <div className="premium-chart-surface mt-8 overflow-x-auto p-4">
      <div className="premium-chart-axis relative flex h-[360px] min-w-[48rem] items-end gap-5 px-4 pb-4">
        {!hasPositiveValues ? <div className="premium-chart-empty">No positive ERP values for this grouped chart yet.</div> : null}
        {bars.map((bar) => {
          const revenue = revenueByMonth.get(bar.label) || 0;
          const revenueHeight = revenueMax > 0 && revenue > 0 ? Math.max(6, Math.round((revenue / revenueMax) * 92)) : 0;
          return <div key={bar.label} className="flex h-full min-w-12 flex-1 flex-col items-center justify-end gap-2"><span className="flex h-full w-full items-end justify-center gap-1"><span className="premium-chart-bar w-3 bg-[#10b981]" style={{ height: `${bar.height > 0 ? Math.max(6, bar.height) : 0}%` }} /><span className="premium-chart-bar w-3 bg-[var(--navy)]" style={{ height: `${revenueHeight}%` }} /></span><span className="max-w-20 truncate text-xs font-black text-[var(--text-light)]">{bar.label}</span></div>;
        })}
      </div>
      </div>
    </article>
  );
}

function AreaChart({ bars }: { bars: { label: string; height: number }[] }) {
  const hasPositiveValues = bars.some((bar) => bar.height > 0);

  return (
    <article className="chart-container">
      <div className="chart-header"><div><h3 className="chart-title">Production Trend</h3><p className="chart-subtitle">Simple month-by-month production movement.</p></div></div>
      <div className="premium-chart-surface mt-8 overflow-x-auto p-4">
      <div className="premium-chart-axis relative flex h-[360px] min-w-[42rem] items-end gap-4 px-4 pb-4">
        {!hasPositiveValues ? <div className="premium-chart-empty">No positive production trend values in this view.</div> : null}
        {bars.map((bar) => <div key={bar.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="premium-chart-bar w-full bg-gradient-to-t from-[#10b981] to-emerald-200" style={{ height: `${bar.height > 0 ? Math.max(6, bar.height) : 0}%` }} /><span className="max-w-20 truncate text-xs font-black text-[var(--text-light)]">{bar.label}</span></div>)}
      </div>
      </div>
    </article>
  );
}

export default async function ProductionPage() {
  const data = await getAGHealthDashboardData();
  const bars = data.production.monthlyTrend.slice(-12);
  const revenues = data.salesAnalysis.monthlyTrend.slice(-12);
  const fg = data.production.goodsRows.filter((row) => row.goodsType === "Finished Good");
  const smfg = data.production.goodsRows.filter((row) => row.goodsType === "Semi-finished Good");
  const fgQty = fg.reduce((sum, row) => sum + row.inventory, 0);
  const smfgQty = smfg.reduce((sum, row) => sum + row.inventory, 0);
  const fgValue = fg.reduce((sum, row) => sum + row.stockValue, 0);
  const smfgValue = smfg.reduce((sum, row) => sum + row.stockValue, 0);
  const latest = data.production.rows[0];
  const activeMonths = data.production.monthlyTrend.filter((row) => row.amount > 0).length;
  const mix = [{ label: "Finished Goods", value: fgValue, color: "#213f67" }, { label: "Semi-Finished Goods", value: smfgValue, color: "#10b981" }].filter((row) => row.value > 0);
  const latestMonth = data.production.monthlyTrend.at(-1);
  const summaryStats = [
    { label: "Latest output month", value: latestMonth ? formatQuantity(latestMonth.amount, "pcs") : "ERP pending", detail: latestMonth ? `${latestMonth.label} production output.` : "No monthly production value mapped yet." },
    { label: "Finished Goods Value", value: formatNpr(fgValue), detail: `${fg.length.toLocaleString("en-US")} finished product rows.` },
    { label: "Semi-Finished Value", value: formatNpr(smfgValue), detail: `${smfg.length.toLocaleString("en-US")} partly finished product rows.` },
    { label: "Production rows", value: data.production.rows.length.toLocaleString("en-US"), detail: "Finished production order rows loaded from ERP." },
  ];

  return (
    <AGHealthShell active="production" company={data.company} connected={data.connected}>
      <section className="rounded-[32px] border border-[var(--border)] bg-white/74 p-7 shadow-[var(--shadow)] lg:p-9">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">Production</p>
        <h1 className="mt-6 max-w-5xl text-4xl font-black tracking-tight text-[var(--ink)] lg:text-6xl">Production Management</h1>
        <p className="mt-5 max-w-5xl text-lg leading-8 text-[var(--text)]">Production output, finished goods, and semi-finished goods in one simple page.</p>
        <div className="mt-6 inline-flex rounded-full bg-[var(--soft)] px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-[var(--text)]">Source: Business Central production and item stock</div>
      </section>
      <section className="mt-8 kpi-grid">
        <Kpi title="Latest Production" value={latest ? formatQuantity(latest.quantityProduced, "pcs") : "ERP pending"} note={latest?.productionDate || "No date mapped."} source="Finishedproductionordgers" tone="primary" />
        <Kpi title="12-Month Output" value={formatQuantity(data.production.totalProduction, "pcs")} note={`${data.production.rows.length.toLocaleString("en-US")} production rows loaded.`} source="Business Central" tone="green" />
        <Kpi title="Production Stock Lines" value={data.production.goodsRows.length.toLocaleString("en-US")} note="Live finished and semi-finished product stock lines." source="Itemcard" tone="gold" />
        <Kpi title="Finished Goods" value={fg.length.toLocaleString("en-US")} note={`${formatQuantity(fgQty)} stock · ${formatNpr(fgValue)} value.`} source="FG" tone="info" />
        <Kpi title="Semi-Finished Goods" value={smfg.length.toLocaleString("en-US")} note={`${formatQuantity(smfgQty)} stock · ${formatNpr(smfgValue)} value.`} source="SMFG" tone="info" />
        <Kpi title="Active Production Months" value={activeMonths.toLocaleString("en-US")} note="Months with positive production output." source="Trend" tone="green" />
      </section>
      <SummaryStrip stats={summaryStats} />
      <section className="mt-8 premium-grid">
        <OutputChart bars={bars} />
        <div className="premium-grid-2"><ComboChart bars={bars} revenues={revenues} /><AreaChart bars={bars} /></div>
        <div className="premium-grid-2">
          <PieChartCard title="Finished vs Semi-Finished Stock Value" slices={mix} valueFormatter={formatNpr} />
          <article className="chart-container"><div className="chart-header"><div><h3 className="chart-title">Top Production Stock Items</h3><p className="chart-subtitle">Finished and semi-finished items with the highest current stock value.</p></div></div><div className="mt-6 grid gap-3">{data.production.goodsRows.slice(0, 8).map((row) => <div key={row.itemNo} className="flex items-center justify-between gap-4 rounded-2xl bg-[var(--soft)] px-4 py-3"><span className="text-sm font-black text-[var(--ink)]">{row.description}</span><span className="whitespace-nowrap text-sm font-black text-[var(--navy)]">{formatNpr(row.stockValue)}</span></div>)}</div></article>
        </div>
      </section>
      <div className="mt-8"><ProductionReport rows={data.production.goodsRows} /></div>
      <article className="chart-container mt-8">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">How Production Data Is Calculated</h3>
            <p className="chart-subtitle">Where each production number comes from.</p>
          </div>
        </div>
        <DataTable
          headers={["Data shown", "ERP source", "Fields used"]}
          rows={[
            ["Production output", "Finishedproductionordgers", "Quantity, Finished_Date, Ending_Date, Starting_Date"],
            ["Product / source item", "Finishedproductionordgers", "Description, Source_No, No"],
            ["Production line", "Finishedproductionordgers", "Routing_No, Location_Code"],
            ["Finished goods stock", "Itemcard", "Inventory_Posting_Group = FG, Inventory, Unit_Cost"],
            ["Semi-finished goods stock", "Itemcard", "Inventory_Posting_Group / category mapped as SMFG, Inventory, Unit_Cost"],
            ["Stock value", "Calculated", "Inventory × Unit_Cost / purchase rate"],
          ]}
        />
      </article>
    </AGHealthShell>
  );
}
