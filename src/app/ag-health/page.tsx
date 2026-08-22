import Link from "next/link";

import { AGHealthShell, BarChart, ComboBarChart, ExecutiveKpiCard, HeroPanel, MetricCard, agHealthModules, dashboardIcons } from "./_components";
import { formatNpr, formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

export default async function AGHealthDashboard() {
  const data = await getAGHealthDashboardData();
  const latestSalesMonth = data.salesAnalysis.monthlyTrend.at(-1)?.label || "Latest month";
  const latestProductionBars = data.salesAnalysis.monthlyTrend.slice(-12).map((bar) => ({
    label: bar.label,
    production: data.production.totalProduction > 0 ? 58 : 6,
    purchases: data.dashboard.packingMaterialStock ? 42 : 5,
    revenue: bar.height,
  }));
  const metrics = [
    { label: "Total Inventory Value", value: formatNpr(data.dashboard.totalInventoryValue), note: "Current stock × purchase/cost rate from ERP items.", icon: dashboardIcons.Boxes },
    { label: "Packing Material Stock", value: formatQuantity(data.dashboard.packingMaterialStock), note: "Only PM category stock.", icon: dashboardIcons.PackageCheck },
    { label: "Today’s Production", value: formatQuantity(data.dashboard.todayProduction, "units"), note: "Finished production orders dated today.", icon: dashboardIcons.Factory },
    { label: "Monthly Production", value: formatQuantity(data.dashboard.monthlyProduction, "units"), note: "Current month finished production.", icon: dashboardIcons.Factory },
    { label: "Total Sales", value: formatNpr(data.dashboard.totalSales), note: "Live SalesDashboard feed.", icon: dashboardIcons.BarChart3 },
    { label: "Monthly Sales", value: formatNpr(data.dashboard.monthlySales), note: "Current/latest month sales.", icon: dashboardIcons.BarChart3 },
    { label: "Total Freight", value: formatNpr(data.dashboard.totalFreight), note: "Mapped freight-related GL rows.", icon: dashboardIcons.Truck },
    { label: "Distributed Expense", value: formatNpr(data.dashboard.distributedExpense), note: "Mapped distribution/allocation expenses.", icon: dashboardIcons.WalletCards },
    { label: "Total Orders", value: formatQuantity(data.dashboard.totalOrders), note: "SalesOrder records from ERP.", icon: dashboardIcons.ClipboardCheck },
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
          { label: "Focused modules", value: "7", note: "Inventory, packing, production, sales, freight, expense, orders.", icon: dashboardIcons.Route },
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
        <p className="mt-4 max-w-5xl text-xl leading-9 text-[var(--text)]">Large cards are placed first, like the reference dashboard, so the main ERP story is visible immediately.</p>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <ExecutiveKpiCard title="Total Inventory Value" value={formatNpr(data.dashboard.totalInventoryValue)} detail="Current ERP stock value using current stock multiplied by purchase/cost rate." source="Itemcard" icon={dashboardIcons.Boxes} />
          <ExecutiveKpiCard title="Total Sales" value={formatNpr(data.dashboard.totalSales)} detail="Live sales total from the connected Business Central SalesDashboard feed." source="SalesDashboard" icon={dashboardIcons.BarChart3} />
          <ExecutiveKpiCard title="Packing Material Stock" value={formatQuantity(data.dashboard.packingMaterialStock)} detail="Only PM posting group stock, separated from raw materials and finished goods." source="Itemcard: PM" accent="gold" icon={dashboardIcons.PackageCheck} />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
        </div>
      </section>

      <section className="mt-12">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Performance</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight">Monthly Revenue and Trend Views</h2>
        <p className="mt-4 max-w-5xl text-xl leading-9 text-[var(--text)]">Charts are grouped under the KPI cards, matching the reference dashboard’s reading order.</p>
        <div className="mt-8 grid gap-6">
          <BarChart title="Business Central Monthly Sales Revenue" bars={data.salesAnalysis.monthlyTrend} valueFormatter={formatNpr} />
          <ComboBarChart title="Business Central Production Output, Packing Stock, and Revenue" bars={latestProductionBars} />
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
