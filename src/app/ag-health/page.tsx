import Link from "next/link";

import { AGHealthShell, BarChart, DataTable, ExecutiveKpiCard, MetricCard, PieChartCard, agHealthModules, dashboardIcons } from "./_components";
import { formatNpr, formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

const compactNpr = (value: number) => `NPR ${new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
}).format(value)}`;

const compactQuantity = (value: number) => new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
}).format(value);

export default async function AGHealthDashboard() {
  const data = await getAGHealthDashboardData();
  const latestSalesMonth = data.salesAnalysis.monthlyTrend.at(-1);
  const latestCostMonth = data.salesAnalysis.monthlyCostTrend.at(-1);
  const latestProductionMonth = data.production.monthlyTrend.at(-1);
  const latestRevenue = latestSalesMonth?.amount || 0;
  const latestCost = latestCostMonth?.amount || 0;
  const grossMargin = latestRevenue > 0 ? ((latestRevenue - latestCost) / latestRevenue) * 100 : null;

  const decisionCards = [
    { label: "Inventory Value", value: formatNpr(data.dashboard.totalInventoryValue), note: "Total stock value in ERP.", icon: dashboardIcons.Boxes },
    { label: "Packing Stock", value: formatQuantity(data.dashboard.packingMaterialStock), note: "Only packing-material stock.", icon: dashboardIcons.PackageCheck },
    { label: "Latest Production", value: latestProductionMonth ? formatQuantity(latestProductionMonth.amount, "pcs") : "ERP pending", note: latestProductionMonth ? `${latestProductionMonth.label} production output.` : "No production month found.", icon: dashboardIcons.Factory },
    { label: "Pending Orders", value: formatQuantity(data.dashboard.pendingOrders), note: "Orders still pending/processing.", icon: dashboardIcons.ClipboardCheck },
    { label: "Gross Margin", value: grossMargin === null ? "ERP pending" : `${grossMargin.toFixed(1)}%`, note: "Latest sales month after cost.", icon: dashboardIcons.BarChart3 },
    { label: "Freight Expense", value: formatNpr(data.dashboard.totalFreight), note: "Mapped freight ledger rows.", icon: dashboardIcons.Truck },
  ];

  const sourceRows = [
    ["Sales", "SalesDashboard", "Sales_Amount_Actual by Posting_Date"],
    ["Receivables", "ExcelTemplateTrialBalance", "Sundry Debtor trial-balance row"],
    ["Bank balance", "ExcelTemplateTrialBalance", "Bank Account / Bank Balance-Total"],
    ["Inventory", "Itemcard", "Inventory × purchase/cost rate"],
    ["Production", "Finishedproductionordgers", "Quantity grouped by production date"],
    ["Orders", "SalesOrder + salesDocumentLines", "Status, quantity, amount, delivery fields"],
  ];

  return (
    <AGHealthShell active="dashboard" company={data.company} connected={data.connected}>
      <section className="rounded-[32px] border border-[var(--border)] bg-white/80 p-7 shadow-[var(--shadow)] lg:p-9">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">Executive Dashboard</p>
            <h1 className="mt-5 max-w-5xl text-4xl font-black tracking-tight text-[var(--ink)] lg:text-6xl">AG Health live business overview</h1>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-[var(--text)]">
              Simple CEO view: sales, cash, stock, production, and pending work first. Detailed reports stay on their own pages.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[28rem]">
            <span className="rounded-2xl border border-[var(--border)] bg-[var(--soft)] px-5 py-4 text-sm font-black text-[var(--navy)]">
              {data.connected ? "ERP Live" : "ERP Pending"}
              <span className="block pt-1 text-xs font-semibold text-[var(--text)]">{data.company}</span>
            </span>
            <span className="rounded-2xl border border-[var(--border)] bg-[var(--soft)] px-5 py-4 text-sm font-black text-[var(--navy)]">
              Latest sales month
              <span className="block pt-1 text-xs font-semibold text-[var(--text)]">{latestSalesMonth?.label || "Not available"}</span>
            </span>
          </div>
        </div>
        {data.error ? <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 font-semibold text-amber-900">{data.error}</p> : null}
      </section>

      <section className="mt-8">
        <div className="grid gap-6 xl:grid-cols-4">
          <ExecutiveKpiCard title="12-Month Sales" value={formatNpr(data.dashboard.totalSales)} detail="Sales total from the visible Business Central analysis window." source="SalesDashboard" icon={dashboardIcons.BarChart3} />
          <ExecutiveKpiCard title="This Month Sales" value={formatNpr(latestRevenue)} detail={latestSalesMonth ? `${latestSalesMonth.label} sales from Business Central.` : "Waiting for live monthly sales."} source="SalesDashboard" icon={dashboardIcons.BarChart3} />
          <ExecutiveKpiCard title="Receivables" value={formatNpr(data.dashboard.receivables)} detail="Customer money still to receive from the live trial balance." source="Trial Balance" icon={dashboardIcons.ReceiptText} />
          <ExecutiveKpiCard title="Bank Balance" value={formatNpr(data.dashboard.bankBalance)} detail="Live Trial Balance Bank Account total." source="Trial Balance" accent="gold" icon={dashboardIcons.Banknote} />
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">At a glance</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">What needs attention</h2>
          </div>
          <p className="max-w-2xl text-sm font-semibold leading-6 text-[var(--text)]">Each card explains exactly what the number means. Click a module below for detail.</p>
        </div>
        <div className="kpi-grid">
          {decisionCards.map((metric) => <MetricCard key={metric.label} {...metric} />)}
        </div>
      </section>

      <section className="mt-10 grid gap-6">
        <BarChart
          title="Monthly Sales Trend"
          bars={data.salesAnalysis.monthlyTrend}
          valueFormatter={formatNpr}
          axisFormatter={compactNpr}
          note="Sales by month. Use this first to see whether revenue is rising or falling."
        />
        <div className="grid gap-6 xl:grid-cols-2">
          <BarChart
            title="Production Output"
            bars={data.production.monthlyTrend.slice(-12)}
            valueFormatter={(value) => formatQuantity(value, "pcs")}
            axisFormatter={compactQuantity}
            tone="green"
            note="Pieces produced by month from Business Central production rows."
          />
          <PieChartCard title="Inventory Value by Category" slices={data.inventoryCategoryMix} valueFormatter={formatNpr} />
        </div>
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="chart-container">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Open detailed reports</h3>
              <p className="chart-subtitle">The dashboard stays simple. Use these pages for full tables, filters, and deeper analysis.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {agHealthModules.map((module) => {
              const Icon = module.icon;
              return (
                <Link key={module.id} href={module.href} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--soft)] px-4 py-3 text-sm font-black text-[var(--ink)] transition hover:border-[var(--blue)] hover:bg-white">
                  <span className="grid size-9 place-items-center rounded-xl bg-white text-[var(--navy)] shadow-sm"><Icon className="size-4" aria-hidden="true" /></span>
                  {module.label}
                </Link>
              );
            })}
          </div>
        </article>

        <article className="chart-container">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">What each number means</h3>
              <p className="chart-subtitle">Quick source guide so the dashboard is easy to trust.</p>
            </div>
          </div>
          <DataTable headers={["Data", "ERP source", "Meaning"]} rows={sourceRows} />
        </article>
      </section>
    </AGHealthShell>
  );
}
