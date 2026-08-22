import Link from "next/link";

import { AGHealthShell, BarChart, ComboBarChart, ExecutiveKpiCard, HeroPanel, MetricCard, PieChartCard, agHealthModules, dashboardIcons } from "./_components";
import { formatNpr, formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

const compactNpr = (value: number) => `NPR ${new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
}).format(value)}`;

const chartHeight = (value: number, max: number) => max > 0 && value > 0 ? Math.max(6, Math.round((value / max) * 92)) : 0;

export default async function AGHealthDashboard() {
  const data = await getAGHealthDashboardData();
  const latestSalesMonth = data.salesAnalysis.monthlyTrend.at(-1)?.label || "Latest month";
  const productionByMonth = new Map(data.production.monthlyTrend.map((row) => [row.label, row.amount]));
  const costByMonth = new Map(data.salesAnalysis.monthlyCostTrend.map((row) => [row.label, row.amount]));
  const revenueByMonth = new Map(data.salesAnalysis.monthlyTrend.map((row) => [row.label, row.amount]));
  const comboLabels = Array.from(new Set([
    ...data.salesAnalysis.monthlyTrend.map((row) => row.label),
    ...data.salesAnalysis.monthlyCostTrend.map((row) => row.label),
    ...data.production.monthlyTrend.map((row) => row.label),
  ])).sort().slice(-12);
  const productionMax = Math.max(...comboLabels.map((label) => productionByMonth.get(label) || 0), 0);
  const costMax = Math.max(...comboLabels.map((label) => costByMonth.get(label) || 0), 0);
  const revenueMax = Math.max(...comboLabels.map((label) => revenueByMonth.get(label) || 0), 0);
  const latestProductionBars = comboLabels.map((label) => {
    const production = productionByMonth.get(label) || 0;
    const cost = costByMonth.get(label) || 0;
    const revenue = revenueByMonth.get(label) || 0;

    return {
      label,
      production: chartHeight(production, productionMax),
      purchases: chartHeight(cost, costMax),
      revenue: chartHeight(revenue, revenueMax),
      productionAmount: formatQuantity(production, "units"),
      purchasesAmount: formatNpr(cost),
      revenueAmount: formatNpr(revenue),
    };
  });
  const metrics = [
    { label: "Total Inventory Value", value: formatNpr(data.dashboard.totalInventoryValue), note: "Current stock × purchase/cost rate from ERP items.", icon: dashboardIcons.Boxes },
    { label: "Packing Material Stock", value: formatQuantity(data.dashboard.packingMaterialStock), note: "Only PM category stock.", icon: dashboardIcons.PackageCheck },
    { label: "Today’s Production", value: formatQuantity(data.dashboard.todayProduction, "units"), note: "Finished production orders dated today.", icon: dashboardIcons.Factory },
    { label: "Monthly Production", value: formatQuantity(data.dashboard.monthlyProduction, "units"), note: "Current month finished production.", icon: dashboardIcons.Factory },
    { label: "Monthly Sales", value: formatNpr(data.dashboard.monthlySales), note: "Current/latest month sales.", icon: dashboardIcons.BarChart3 },
    { label: "Total Freight", value: formatNpr(data.dashboard.totalFreight), note: "Mapped freight-related GL rows.", icon: dashboardIcons.Truck },
    { label: "Pending Orders", value: formatQuantity(data.dashboard.pendingOrders), note: "Pending or processing orders.", icon: dashboardIcons.Route },
  ];

  return (
    <AGHealthShell active="dashboard" company={data.company} connected={data.connected}>
      <HeroPanel
        eyebrow="Executive Dashboard"
        title="Live ERP executive dashboard"
        description="The homepage starts with the most important live numbers first, followed by charts and module drilldowns in the same premium order as the reference dashboard."
        stats={[
          { label: "Source mode", value: data.connected ? "Live ERP" : "ERP Pending", note: data.company, icon: dashboardIcons.BarChart3 },
          { label: "Focused modules", value: "6", note: "Inventory, packing, production, sales, freight, and orders.", icon: dashboardIcons.Route },
          { label: "Inventory categories", value: data.inventoryByCategory.length.toLocaleString("en-US"), note: "Separated ERP item posting groups.", icon: dashboardIcons.Boxes },
          { label: "Latest live month", value: latestSalesMonth, note: "Latest month found in the sales trend.", icon: dashboardIcons.BarChart3 },
        ]}
        actions={[
          { label: "Inventory Report", href: "/ag-health/inventory-report" },
          { label: "Packing Materials", href: "/ag-health/packing-materials" },
          { label: "Sales Analysis", href: "/ag-health/sales-analysis" },
          { label: "Production", href: "/ag-health/production" },
        ]}
      />
      {data.error ? <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 font-semibold text-amber-900">{data.error}</p> : null}

      <section className="mt-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Overview</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight">Executive Snapshot</h2>
        <p className="mt-4 max-w-5xl text-xl leading-9 text-[var(--text)]">Large cards are placed first. Each card names the ERP source so the numbers are easier to understand.</p>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <ExecutiveKpiCard title="Business Central Sales" value={formatNpr(data.dashboard.totalSales)} detail="Live sales total from the connected Business Central SalesDashboard feed." source="SalesDashboard" icon={dashboardIcons.BarChart3} />
          <ExecutiveKpiCard title="Business Central Receivables" value={formatNpr(data.dashboard.receivables)} detail="Customer receivables from the live trial balance row mapped for Sundry Debtor." source="ExcelTemplateTrialBalance" icon={dashboardIcons.ReceiptText} />
          <ExecutiveKpiCard title="Business Central Bank Balance" value={formatNpr(data.dashboard.bankBalance)} detail={`Current live Business Central bank balance across ${data.dashboard.bankRows || 0} BANK rows.`} source="Bankacccard1" accent="gold" icon={dashboardIcons.Banknote} />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
        </div>
      </section>

      <section className="mt-12">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Performance</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight">Monthly Revenue and Trend Views</h2>
        <p className="mt-4 max-w-5xl text-xl leading-9 text-[var(--text)]">Charts are grouped under the KPI cards, matching the reference dashboard’s reading order.</p>
        <div className="mt-8 grid gap-6">
          <BarChart
            title="Business Central Monthly Sales Revenue"
            bars={data.salesAnalysis.monthlyTrend}
            valueFormatter={formatNpr}
            axisFormatter={compactNpr}
            note="Monthly sales placement follows the reference dashboard, while values come from this project’s ERP feed."
          />
          <ComboBarChart
            title="Business Central Production Output, Cost, and Revenue"
            bars={latestProductionBars}
            middleLabel="Cost Amount"
            note="This comparison uses exact ERP values by month: production quantity from finished production orders, cost amount from SalesDashboard Cost_Amount_Actual, and revenue from SalesDashboard Sales_Amount_Actual. Each series is scaled separately so units and NPR values stay readable."
          />
          <div className="grid gap-6 xl:grid-cols-2">
            <PieChartCard title="Inventory Value by Category" slices={data.inventoryCategoryMix} valueFormatter={formatNpr} />
            <PieChartCard title="Order Status Mix" slices={data.orders.statusMix} valueFormatter={(value) => formatQuantity(value)} />
          </div>
        </div>
      </section>

      <section className="mt-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Module Control Center</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight">Open a dedicated report</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {agHealthModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.id} href={module.href} className="module-card min-h-0">
                <span className="grid size-12 place-items-center rounded-2xl bg-[var(--soft)] text-[var(--navy)]">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-black">{module.label}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text)]">Open the separate {module.label.toLowerCase()} page.</p>
              </Link>
            );
          })}
        </div>
      </section>
    </AGHealthShell>
  );
}
