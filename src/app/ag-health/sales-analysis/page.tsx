import { AGHealthShell, BarChart, MetricCard, SectionHeader, dashboardIcons } from "../_components";
import { formatNpr, formatPercent, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

export default async function SalesAnalysisPage() {
  const data = await getAGHealthDashboardData();

  return (
    <AGHealthShell active="sales-analysis" company={data.company} connected={data.connected}>
      <SectionHeader eyebrow="Sales Analysis" title="Sales Analysis">
        Sales analysis uses the ERP SalesDashboard feed and includes totals, current/previous month comparison, growth, and simple monthly/yearly charts.
      </SectionHeader>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total sales" value={formatNpr(data.salesAnalysis.totalSales)} note="Total in the current analysis window." icon={dashboardIcons.BarChart3} />
        <MetricCard label="Monthly sales" value={formatNpr(data.salesAnalysis.monthlySales)} note="Current/latest month sales." icon={dashboardIcons.BarChart3} />
        <MetricCard label="Yearly sales" value={formatNpr(data.salesAnalysis.yearlySales)} note="Current/latest year sales." icon={dashboardIcons.BarChart3} />
        <MetricCard label="Previous month" value={formatNpr(data.salesAnalysis.previousMonthSales)} note="Previous month from trend." icon={dashboardIcons.BarChart3} />
        <MetricCard label="Growth" value={formatPercent(data.salesAnalysis.growthPercentage)} note="Current vs previous month." icon={dashboardIcons.BarChart3} />
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <BarChart title="Monthly Sales Trend" bars={data.salesAnalysis.monthlyTrend} valueFormatter={formatNpr} />
        <BarChart title="Yearly Sales Trend" bars={data.salesAnalysis.yearlyTrend} valueFormatter={formatNpr} />
      </div>
    </AGHealthShell>
  );
}
