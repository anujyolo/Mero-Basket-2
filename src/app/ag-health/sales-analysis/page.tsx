import { AGHealthShell, BarChart, ExecutiveKpiCard, HeroPanel, MetricCard, SectionHeader, dashboardIcons } from "../_components";
import { formatNpr, formatPercent, getAGHealthDashboardData } from "@/server/business-central/data";

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
        title="Sales trend and growth dashboard"
        description="This follows the reference sales-analysis page: filters/actions at the top, headline cards first, then monthly and yearly chart panels."
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
        <SectionHeader eyebrow="Filters" title="Sales support controls">
          These controls mirror the reference layout. The current build displays all live ERP sales rows while the next step can make these filters interactive.
        </SectionHeader>
        <div className="mt-6 grid gap-4 rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)] md:grid-cols-4">
          {["From Date", "To Date", "Person", "Product"].map((label) => (
            <label key={label} className="grid gap-2 text-sm font-black text-[var(--text)]">
              {label}
              <span className="rounded-2xl border border-[var(--border)] bg-[var(--soft)] px-4 py-3 text-[var(--text-light)]">All live ERP data</span>
            </label>
          ))}
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
        <BarChart title="Monthly Sales Trend" bars={data.salesAnalysis.monthlyTrend} valueFormatter={formatNpr} axisFormatter={compactNpr} />
        <BarChart title="Yearly Sales Trend" bars={data.salesAnalysis.yearlyTrend} valueFormatter={formatNpr} axisFormatter={compactNpr} />
      </div>
    </AGHealthShell>
  );
}
