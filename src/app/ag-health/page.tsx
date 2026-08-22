import Link from "next/link";

import { AGHealthShell, BarChart, ComboBarChart, DataTable, ExecutiveKpiCard, HeroPanel, MetricCard, PieChartCard, agHealthModules, dashboardIcons } from "./_components";
import { formatNpr, formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

const compactNpr = (value: number) => `NPR ${new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
}).format(value)}`;

const chartHeight = (value: number, max: number) => max > 0 && value > 0 ? Math.max(6, Math.round((value / max) * 92)) : 0;
const compactQuantity = (value: number) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);

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

export default async function AGHealthDashboard() {
  const data = await getAGHealthDashboardData();
  const latestSalesMonth = data.salesAnalysis.monthlyTrend.at(-1)?.label || "Latest month";
  const latestSalesTrendMonth = data.salesAnalysis.monthlyTrend.at(-1);
  const latestCostTrendMonth = data.salesAnalysis.monthlyCostTrend.at(-1);
  const latestProductionMonth = data.production.monthlyTrend.at(-1);
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
      productionAmount: formatQuantity(production, "pcs"),
      purchasesAmount: formatNpr(cost),
      revenueAmount: formatNpr(revenue),
    };
  });
  const revenueCostBars = comboLabels.map((label) => {
    const revenue = revenueByMonth.get(label) || 0;
    const cost = costByMonth.get(label) || 0;
    const margin = Math.max(0, revenue - cost);
    const marginMax = Math.max(...comboLabels.map((month) => Math.max(0, (revenueByMonth.get(month) || 0) - (costByMonth.get(month) || 0))), 0);

    return {
      label,
      production: chartHeight(revenue, revenueMax),
      purchases: chartHeight(cost, costMax),
      revenue: chartHeight(margin, marginMax),
      productionAmount: formatNpr(revenue),
      purchasesAmount: formatNpr(cost),
      revenueAmount: formatNpr(margin),
    };
  });
  const latestRevenue = latestSalesTrendMonth?.amount || 0;
  const latestCost = latestCostTrendMonth?.amount || 0;
  const latestGrossMargin = latestRevenue > 0 ? ((latestRevenue - latestCost) / latestRevenue) * 100 : null;
  const inventoryRows = data.inventoryByCategory.flatMap((category) => category.rows);
  const rawMaterialRows = inventoryRows.filter((row) => {
    const text = `${row.postingGroup} ${row.category} ${row.itemCategory} ${row.itemName}`.toLowerCase();
    return text.includes("rm") || text.includes("raw");
  });
  const rawMaterialStock = rawMaterialRows.reduce((sum, row) => sum + row.currentStock, 0);
  const positiveRawMaterialRows = rawMaterialRows.filter((row) => row.currentStock > 0);
  const materialsPreviewRows = (rawMaterialRows.length > 0 ? rawMaterialRows : inventoryRows)
    .slice()
    .sort((a, b) => b.stockValue - a.stockValue)
    .slice(0, 12);
  const executiveStats = [
    {
      label: "This Month Sales",
      value: formatNpr(latestRevenue),
      detail: latestSalesTrendMonth ? `${latestSalesTrendMonth.label} sales from Business Central.` : "Waiting for a confirmed live sales month.",
    },
    {
      label: "12-Month Sales",
      value: formatNpr(data.salesAnalysis.monthlyTrend.slice(-12).reduce((sum, row) => sum + row.amount, 0)),
      detail: "Sum of the visible Business Central sales window on this dashboard.",
    },
    {
      label: "Raw Material Stock",
      value: formatQuantity(rawMaterialStock),
      detail: `${positiveRawMaterialRows.length.toLocaleString("en-US")} raw-material rows currently show positive stock.`,
    },
    {
      label: "Latest Gross Margin",
      value: latestGrossMargin === null ? "ERP pending" : `${latestGrossMargin.toFixed(1)}%`,
      detail: "Sales left after cost, shown as a percentage.",
    },
  ];
  const operationsStats = [
    {
      label: "Raw Material Items",
      value: rawMaterialRows.length.toLocaleString("en-US"),
      detail: "Raw material items found in Business Central.",
    },
    {
      label: "Positive Stock Items",
      value: positiveRawMaterialRows.length.toLocaleString("en-US"),
      detail: "Raw-material rows with live quantity greater than zero.",
    },
    {
      label: "Latest Purchases",
      value: formatNpr(latestCost),
      detail: latestCostTrendMonth ? `Latest available purchase/cost value for ${latestCostTrendMonth.label}.` : "Waiting for live monthly purchase/cost totals.",
    },
    {
      label: "Latest Production",
      value: latestProductionMonth ? formatQuantity(latestProductionMonth.amount, "pcs") : "ERP pending",
      detail: "Live production output in the latest confirmed production month.",
    },
  ];
  const fieldTraceRows = [
    ["Sales revenue", "SalesDashboard", "Posting_Date, Sales_Amount_Actual"],
    ["Sales cost", "SalesDashboard", "Posting_Date, Cost_Amount_Actual"],
    ["Inventory and raw materials", "Itemcard", "Inventory_Posting_Group, Inventory, Unit_Cost, Last_Direct_Cost"],
    ["Production output", "Finishedproductionordgers", "Quantity, Finished_Date, Ending_Date, Starting_Date"],
    ["Orders", "SalesOrder + salesDocumentLines", "No, Status, Amount, quantity, outstandingQuantity"],
    ["Freight", "Generalledgerentries", "Posting_Date, Amount, Description, G_L_Account_Name"],
  ];
  const trustStats = [
    { label: "Live reports", value: data.connected ? "6" : "0", detail: "Dashboard, inventory, packing, production, sales, and orders use mapped ERP feeds." },
    { label: "ERP chart series", value: "4", detail: "Sales revenue, cost amount, production output, and inventory value." },
    { label: "Audit only", value: data.error ? "1" : "0", detail: data.error || "No current dashboard-level ERP error." },
    { label: "Hardcoded values", value: "0", detail: "Dashboard bars and cards use current project data only." },
  ];
  const metrics = [
    { label: "Total Inventory Value", value: formatNpr(data.dashboard.totalInventoryValue), note: "Current stock × purchase/cost rate from ERP items.", icon: dashboardIcons.Boxes },
    { label: "Packing Material Stock", value: formatQuantity(data.dashboard.packingMaterialStock), note: "Only PM category stock.", icon: dashboardIcons.PackageCheck },
    { label: "Today’s Production", value: formatQuantity(data.dashboard.todayProduction, "pcs"), note: "Finished production orders dated today.", icon: dashboardIcons.Factory },
    { label: "Monthly Production", value: formatQuantity(data.dashboard.monthlyProduction, "pcs"), note: "Current month finished production.", icon: dashboardIcons.Factory },
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
        <p className="mt-4 max-w-5xl text-xl leading-9 text-[var(--text)]">Important business numbers are shown first. Each card says what the number means.</p>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <ExecutiveKpiCard title="Business Central Sales (12-Month)" value={formatNpr(data.dashboard.totalSales)} detail="Total sales for the visible 12-month Business Central window." source="Sales" icon={dashboardIcons.BarChart3} />
          <ExecutiveKpiCard title="Business Central Receivables" value={formatNpr(data.dashboard.receivables)} detail="Customer receivables from the live trial balance row mapped for Sundry Debtor." source="ExcelTemplateTrialBalance" icon={dashboardIcons.ReceiptText} />
          <ExecutiveKpiCard title="Business Central Bank Balance" value={formatNpr(data.dashboard.bankBalance)} detail={`Current live Business Central bank balance across ${data.dashboard.bankRows || 0} BANK rows.`} source="Bankacccard1" accent="gold" icon={dashboardIcons.Banknote} />
        </div>
        <SummaryStrip stats={executiveStats} />
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
            note="Month-by-month sales. Each bar shows sales for that month."
          />
          <ComboBarChart
            title="Production, Purchases, and Sales"
            bars={latestProductionBars}
            middleLabel="Purchases / Cost"
            note="Compare how much was produced, how much cost/purchase value was recorded, and how much was sold each month."
          />
          <div className="grid gap-6 xl:grid-cols-2">
            <ComboBarChart
              title="Sales, Cost, and Gross Margin"
              bars={revenueCostBars}
              firstLabel="Revenue"
              middleLabel="Cost"
              thirdLabel="Gross Margin"
              note="Shows sales, cost, and remaining margin by month."
            />
            <BarChart
              title="Production Trend"
              bars={data.production.monthlyTrend.slice(-12)}
              valueFormatter={(value) => formatQuantity(value, "pcs")}
              axisFormatter={compactQuantity}
              tone="green"
              note="Live output quantities grouped by production month from finished production orders."
            />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <PieChartCard title="Inventory Value by Category" slices={data.inventoryCategoryMix} valueFormatter={formatNpr} />
            <PieChartCard title="Order Status Mix" slices={data.orders.statusMix} valueFormatter={(value) => formatQuantity(value)} />
          </div>
        </div>
      </section>

      <section className="mt-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Operations</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight">Materials and Production Context</h2>
        <p className="mt-4 max-w-5xl text-xl leading-9 text-[var(--text)]">This section explains what material stock is available and which items have the highest value.</p>
        <SummaryStrip stats={operationsStats} />
        <article className="chart-container mt-8">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Business Central Materials</h3>
              <p className="chart-subtitle">Material stock from Business Central. If raw-material rows are available, they appear first; otherwise the table shows highest-value inventory items.</p>
            </div>
            <div className="rounded-2xl bg-[var(--soft)] px-4 py-3 text-sm font-black text-[var(--navy)]">
              {formatQuantity(rawMaterialStock)} stock · {positiveRawMaterialRows.length} positive RM rows
            </div>
          </div>
          <DataTable
            headers={["Material", "ERP Item", "Posting group", "Category", "Quantity", "Stock value"]}
            rows={materialsPreviewRows.map((row) => [
              row.itemName,
              row.itemNo,
              row.postingGroup,
              row.itemCategory || row.category,
              row.currentStock.toLocaleString("en-US", { maximumFractionDigits: 4 }),
              formatNpr(row.stockValue),
            ])}
          />
        </article>
      </section>

      <section className="mt-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Workspace</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight">Modules and Data Meaning</h2>
        <p className="mt-4 max-w-5xl text-xl leading-9 text-[var(--text)]">Open a report, and see where each dashboard number comes from.</p>
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <article className="chart-container">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Module Control Center</h3>
                <p className="chart-subtitle">Each module explains what it means and where to go next.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              {agHealthModules.map((module) => {
                const Icon = module.icon;
                return (
                  <Link key={module.id} href={module.href} className="rounded-3xl border border-[var(--border)] bg-[var(--soft)] p-5 transition hover:border-[var(--blue)] hover:bg-white">
                    <span className="flex items-center gap-3 text-lg font-black text-[var(--ink)]">
                      <span className="grid size-11 place-items-center rounded-2xl bg-white text-[var(--navy)] shadow-sm"><Icon className="size-5" aria-hidden="true" /></span>
                      {module.label}
                    </span>
                    <p className="mt-3 text-sm font-semibold leading-6 text-[var(--text)]">Open the separate {module.label.toLowerCase()} page with its own KPIs, charts, and table.</p>
                  </Link>
                );
              })}
            </div>
          </article>
          <article className="chart-container">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">How This Data Is Calculated</h3>
                <p className="chart-subtitle">Plain source notes for each number on this dashboard.</p>
              </div>
            </div>
            <DataTable headers={["Dashboard data", "ERP source", "Fields used"]} rows={fieldTraceRows} />
          </article>
        </div>
      </section>

      <section className="mt-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Data Trust</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight">Report and Action Coverage</h2>
        <p className="mt-4 max-w-5xl text-xl leading-9 text-[var(--text)]">This bottom layer shows what is live, what is calculated, and whether any dashboard data is blocked.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trustStats.map((stat) => <MetricCard key={stat.label} label={stat.label} value={stat.value} note={stat.detail} icon={dashboardIcons.Route} />)}
        </div>
      </section>
    </AGHealthShell>
  );
}
