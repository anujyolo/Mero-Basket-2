import { AGHealthShell, PieChartCard, dashboardIcons } from "../_components";
import { formatNpr, formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";
import { ProductionReport } from "./production-report";

export const dynamic = "force-dynamic";

const compactUnits = (value: number) => `${new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value)} units`;

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
  return (
    <article className="chart-container">
      <div className="chart-header"><div><h3 className="chart-title">Business Central Production Output</h3><p className="chart-subtitle">Monthly production output from existing Business Central production rows.</p></div><span className="kpi-trend">{bars.length} months</span></div>
      <div className="mt-8 grid grid-cols-[5.8rem_minmax(0,1fr)] gap-4 rounded-[28px] bg-[var(--soft)] p-4">
        <div className="flex h-[360px] flex-col justify-between pb-10 text-right text-[11px] font-black text-[var(--text-light)]">{ticks.map((tick, index) => <span key={index}>{compactUnits(tick)}</span>)}</div>
        <div className="min-w-0 overflow-x-auto">
          <div className="flex h-[360px] min-w-[42rem] items-end gap-3 border-b border-l border-[var(--border-strong)] px-4 pb-4">
            {bars.map((bar) => <div key={bar.label} className="flex min-w-12 flex-1 flex-col items-center justify-end gap-2"><span className="w-full rounded-t-xl bg-[#10b981] shadow-[0_10px_22px_rgba(16,185,129,0.22)]" title={`${bar.label}: ${formatQuantity(bar.amount, "units")}`} style={{ height: `${Math.min(96, Math.max(bar.amount > 0 ? 6 : 0, bar.height))}%` }} /><span className="max-w-20 truncate text-xs font-black text-[var(--text-light)]">{bar.label}</span></div>)}
          </div>
        </div>
      </div>
    </article>
  );
}

function ComboChart({ bars, revenues }: { bars: { label: string; height: number }[]; revenues: { amount: number }[] }) {
  const revenueMax = Math.max(...revenues.map((row) => row.amount), 0);
  return (
    <article className="chart-container">
      <div className="chart-header"><div><h3 className="chart-title">Production vs Revenue</h3><p className="chart-subtitle">Production output and sales revenue share the same premium dashboard placement.</p></div></div>
      <div className="mt-5 flex gap-4 text-sm font-black"><span className="text-emerald-600">Production</span><span className="text-[var(--navy)]">Revenue</span></div>
      <div className="mt-8 flex h-[360px] items-end gap-3 overflow-x-auto border-b border-l border-[var(--border-strong)] px-4 pb-4">
        {bars.map((bar, index) => {
          const revenueHeight = revenueMax > 0 ? Math.max(6, Math.round(((revenues[index]?.amount || 0) / revenueMax) * 92)) : 0;
          return <div key={bar.label} className="flex min-w-12 flex-1 flex-col items-center justify-end gap-2"><span className="flex h-full w-full items-end justify-center gap-1"><span className="w-3 rounded-t bg-[#10b981]" style={{ height: `${Math.max(6, bar.height)}%` }} /><span className="w-3 rounded-t bg-[var(--navy)]" style={{ height: `${revenueHeight}%` }} /></span><span className="max-w-20 truncate text-xs font-black text-[var(--text-light)]">{bar.label}</span></div>;
        })}
      </div>
    </article>
  );
}

function AreaChart({ bars }: { bars: { label: string; height: number }[] }) {
  return (
    <article className="chart-container">
      <div className="chart-header"><div><h3 className="chart-title">Production Trend</h3><p className="chart-subtitle">Green area-style trend for active production months.</p></div></div>
      <div className="mt-8 flex h-[360px] items-end gap-2 rounded-[28px] bg-gradient-to-t from-emerald-50 to-white px-4 pb-4">
        {bars.map((bar) => <div key={bar.label} className="flex flex-1 flex-col items-center justify-end gap-2"><span className="w-full rounded-t-xl bg-gradient-to-t from-[#10b981] to-emerald-200" style={{ height: `${Math.max(6, bar.height)}%` }} /><span className="max-w-20 truncate text-xs font-black text-[var(--text-light)]">{bar.label}</span></div>)}
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

  return (
    <AGHealthShell active="production" company={data.company} connected={data.connected}>
      <section className="rounded-[32px] border border-[var(--border)] bg-white/74 p-7 shadow-[var(--shadow)] lg:p-9">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">Production</p>
        <h1 className="mt-6 max-w-5xl text-4xl font-black tracking-tight text-[var(--ink)] lg:text-6xl">Production Management</h1>
        <p className="mt-5 max-w-5xl text-lg leading-8 text-[var(--text)]">Live Business Central production output and FG/SMFG stock in the same premium dashboard layout as AG Health.</p>
        <div className="mt-6 inline-flex rounded-full bg-[var(--soft)] px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-[var(--text)]">ERP source: Finishedproductionordgers + Itemcard FG/SMFG</div>
      </section>
      <section className="mt-8 kpi-grid">
        <Kpi title="Latest Production" value={latest ? formatQuantity(latest.quantityProduced, "units") : "ERP pending"} note={latest?.productionDate || "No date mapped."} source="Finishedproductionordgers" tone="primary" />
        <Kpi title="12-Month Output" value={formatQuantity(data.production.totalProduction, "units")} note={`${data.production.rows.length.toLocaleString("en-US")} production rows loaded.`} source="Business Central" tone="green" />
        <Kpi title="Production Stock Lines" value={data.production.goodsRows.length.toLocaleString("en-US")} note="Live finished and semi-finished product stock lines." source="Itemcard" tone="gold" />
        <Kpi title="Finished Goods" value={fg.length.toLocaleString("en-US")} note={`${formatQuantity(fgQty)} stock · ${formatNpr(fgValue)} value.`} source="FG" tone="info" />
        <Kpi title="Semi-Finished Goods" value={smfg.length.toLocaleString("en-US")} note={`${formatQuantity(smfgQty)} stock · ${formatNpr(smfgValue)} value.`} source="SMFG" tone="info" />
        <Kpi title="Active Production Months" value={activeMonths.toLocaleString("en-US")} note="Months with positive production output." source="Trend" tone="green" />
      </section>
      <section className="mt-8 premium-grid">
        <OutputChart bars={bars} />
        <div className="premium-grid-2"><ComboChart bars={bars} revenues={revenues} /><AreaChart bars={bars} /></div>
        <div className="premium-grid-2">
          <PieChartCard title="Finished Goods vs Semi-Finished Goods" slices={mix} valueFormatter={formatNpr} />
          <article className="chart-container"><div className="chart-header"><div><h3 className="chart-title">Live Production Stock Lines</h3><p className="chart-subtitle">Top visible FG/SMFG stock lines by current value.</p></div></div><div className="mt-6 grid gap-3">{data.production.goodsRows.slice(0, 8).map((row) => <div key={row.itemNo} className="flex items-center justify-between gap-4 rounded-2xl bg-[var(--soft)] px-4 py-3"><span className="text-sm font-black text-[var(--ink)]">{row.description}</span><span className="whitespace-nowrap text-sm font-black text-[var(--navy)]">{formatNpr(row.stockValue)}</span></div>)}</div></article>
        </div>
      </section>
      <div className="mt-8"><ProductionReport rows={data.production.goodsRows} /></div>
    </AGHealthShell>
  );
}
