import { AGHealthShell, BarChart, DataTable, ExecutiveKpiCard, HeroPanel, MetricCard, SectionHeader, dashboardIcons } from "../_components";
import { formatNpr, formatPercent, getAGHealthDashboardData } from "@/server/business-central/data";
import { SalesLineExplorer } from "./sales-line-explorer";

export const dynamic = "force-dynamic";

const compactNpr = (value: number) => `NPR ${new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
}).format(value)}`;

export default async function SalesAnalysisPage() {
  const data = await getAGHealthDashboardData();
  const latestMonth = data.salesAnalysis.monthlyTrend.at(-1)?.label || "Latest month";
  const previousMonth = data.salesAnalysis.monthlyTrend.at(-2)?.label || "Previous month";

  return (
    <AGHealthShell active="sales-analysis" company={data.company} connected={data.connected}>
      <HeroPanel
        eyebrow="Sales Analysis"
        title="Sales trend and product drilldown"
        description="Clear sales reporting: money totals from the live SalesDashboard feed, plus product/customer/month filtering from sales order lines."
        stats={[
          { label: "Total sales", value: formatNpr(data.salesAnalysis.totalSales), note: "Total in the analysis window.", icon: dashboardIcons.BarChart3 },
          { label: "Current month", value: formatNpr(data.salesAnalysis.currentMonthSales), note: latestMonth, icon: dashboardIcons.BarChart3 },
          { label: "Previous month", value: formatNpr(data.salesAnalysis.previousMonthSales), note: previousMonth, icon: dashboardIcons.Route },
          { label: "Growth", value: formatPercent(data.salesAnalysis.growthPercentage), note: "Current vs previous month.", icon: dashboardIcons.ReceiptText },
        ]}
        actions={[
          { label: "Open Orders", href: "/ag-health/orders" },
          { label: "Open Production", href: "/ag-health/production" },
          { label: "Open Freight", href: "/ag-health/freight" },
        ]}
      />
      <section className="mt-10">
        <SectionHeader eyebrow="Data meaning" title="What this sales data shows">
          The top KPI and charts are financial sales totals from Business Central SalesDashboard. The product filter below uses salesDocumentLines joined with SalesOrder, so you can search products like M5 and filter by month and customer/place.
        </SectionHeader>
        <div className="mt-6 grid gap-4 rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)] md:grid-cols-3">
          <MetricCard label="Financial source" value="SalesDashboard" note="Used for total sales, monthly sales, yearly sales, and revenue trend charts." icon={dashboardIcons.BarChart3} />
          <MetricCard label="Product source" value="salesDocumentLines" note="Used for product quantity search and order-line product drilldown." icon={dashboardIcons.Route} />
          <MetricCard label="Customer source" value="SalesOrder" note="Joined by order number to show customer/place, month, order status, and delivery status." icon={dashboardIcons.ReceiptText} />
        </div>
      </section>
      <section className="mt-10">
        <SectionHeader eyebrow="Sales KPI" title="Sales summary">
          Sales analysis uses the ERP SalesDashboard feed and includes totals, current/previous month comparison, growth, and simple monthly/yearly charts.
        </SectionHeader>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <ExecutiveKpiCard title="Total Sales" value={formatNpr(data.salesAnalysis.totalSales)} detail="Total sales in the current ERP analysis window." source="SalesDashboard" icon={dashboardIcons.BarChart3} />
          <ExecutiveKpiCard title="Monthly Sales" value={formatNpr(data.salesAnalysis.monthlySales)} detail={`Current/latest month: ${latestMonth}.`} source="Posting_Date" icon={dashboardIcons.BarChart3} />
          <ExecutiveKpiCard title="Growth Percentage" value={formatPercent(data.salesAnalysis.growthPercentage)} detail={`Compared against ${previousMonth}.`} source="Month-over-month" accent="gold" icon={dashboardIcons.ReceiptText} />
        </div>
      </section>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total sales" value={formatNpr(data.salesAnalysis.totalSales)} note="Total in the current analysis window." icon={dashboardIcons.BarChart3} />
        <MetricCard label="Monthly sales" value={formatNpr(data.salesAnalysis.monthlySales)} note="Current/latest month sales." icon={dashboardIcons.BarChart3} />
        <MetricCard label="Yearly sales" value={formatNpr(data.salesAnalysis.yearlySales)} note="Current/latest year sales." icon={dashboardIcons.BarChart3} />
        <MetricCard label="Previous month" value={formatNpr(data.salesAnalysis.previousMonthSales)} note="Previous month from trend." icon={dashboardIcons.BarChart3} />
        <MetricCard label="Growth" value={formatPercent(data.salesAnalysis.growthPercentage)} note="Current vs previous month." icon={dashboardIcons.BarChart3} />
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <BarChart title="Monthly Sales Trend" bars={data.salesAnalysis.monthlyTrend} valueFormatter={formatNpr} axisFormatter={compactNpr} note="Exact Sales_Amount_Actual grouped by Posting_Date month." />
        <BarChart title="Monthly Cost / COGS Trend" bars={data.salesAnalysis.monthlyCostTrend} valueFormatter={formatNpr} axisFormatter={compactNpr} tone="gold" note="Exact Cost_Amount_Actual grouped by Posting_Date month." />
        <BarChart title="Yearly Sales Trend" bars={data.salesAnalysis.yearlyTrend} valueFormatter={formatNpr} axisFormatter={compactNpr} />
      </div>
      <div className="mt-8">
        <SalesLineExplorer rows={data.salesAnalysis.lineRows} sourceNote={data.salesAnalysis.lineSourceNote} />
      </div>
      <article className="chart-container mt-8">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Exact Sales Field Trace</h3>
            <p className="chart-subtitle">ERP fields used for sales totals, product search, dealer analysis, and location drilldown.</p>
          </div>
        </div>
        <DataTable
          headers={["Data shown", "ERP source", "Fields used"]}
          rows={[
            ["Total/monthly/yearly sales", "SalesDashboard", "Posting_Date, Sales_Amount_Actual"],
            ["Cost / COGS trend", "SalesDashboard", "Posting_Date, Cost_Amount_Actual"],
            ["Dealer/customer", "SalesOrder", "Sell_to_Customer_Name"],
            ["Province / district / city", "SalesOrder", "Ship_to_City, Sell_to_City, Ship_to_County, Sell_to_County"],
            ["Product and quantity", "salesDocumentLines", "number, description, itemCategoryCode, quantity, quantityShipped, quantityInvoiced"],
            ["Order/delivery status", "SalesOrder + salesDocumentLines", "Status, outstandingQuantity"],
          ]}
        />
      </article>
    </AGHealthShell>
  );
}
