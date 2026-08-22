import { AGHealthShell, BarChart, DataTable, ExecutiveKpiCard, HeroPanel, MetricCard, SectionHeader, dashboardIcons } from "../_components";
import { formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

export default async function ProductionPage() {
  const data = await getAGHealthDashboardData();
  const byDate = new Map<string, number>();

  for (const row of data.production.rows) {
    byDate.set(row.productionDate, (byDate.get(row.productionDate) || 0) + row.quantityProduced);
  }

  const rawBars = [...byDate.entries()].slice(0, 12);
  const maxProduction = Math.max(...rawBars.map(([, amount]) => amount), 0);
  const productionBars = rawBars.map(([label, amount]) => ({
    label,
    amount,
    height: maxProduction > 0 ? Math.max(4, Math.round((amount / maxProduction) * 92)) : 0,
  }));

  return (
    <AGHealthShell active="production" company={data.company} connected={data.connected}>
      <HeroPanel
        eyebrow="Production"
        title="Live production management"
        description="This page follows the reference production structure: latest output cards first, then production stock/context, then the detail table."
        stats={[
          { label: "Latest production", value: data.production.rows[0] ? formatQuantity(data.production.rows[0].quantityProduced, "units") : "ERP pending", note: data.production.rows[0]?.productionDate || "No production date mapped.", icon: dashboardIcons.Factory },
          { label: "Daily production", value: formatQuantity(data.production.dailyProduction, "units"), note: "Rows finished today.", icon: dashboardIcons.Factory },
          { label: "Monthly production", value: formatQuantity(data.production.monthlyProduction, "units"), note: "Rows finished in current month.", icon: dashboardIcons.BarChart3 },
          { label: "Total production", value: formatQuantity(data.production.totalProduction, "units"), note: "Total extracted production output.", icon: dashboardIcons.Route },
        ]}
        actions={[
          { label: "Sales Analysis", href: "/ag-health/sales-analysis" },
          { label: "Inventory Report", href: "/ag-health/inventory-report" },
          { label: "Orders", href: "/ag-health/orders" },
        ]}
      />
      <section className="mt-10">
        <SectionHeader eyebrow="Production Output" title="Production snapshot">
          Production uses finished production order rows only. Daily, monthly, and total production are calculated separately from sales and inventory.
        </SectionHeader>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <ExecutiveKpiCard title="Today’s Production" value={formatQuantity(data.production.dailyProduction, "units")} detail="Finished production order quantity dated today." source="Finishedproductionordgers" icon={dashboardIcons.Factory} />
          <ExecutiveKpiCard title="Monthly Production" value={formatQuantity(data.production.monthlyProduction, "units")} detail="Finished production quantity in the current month." source="Finishedproductionordgers" icon={dashboardIcons.BarChart3} />
          <ExecutiveKpiCard title="Total Production" value={formatQuantity(data.production.totalProduction, "units")} detail="Total quantity extracted from finished production orders." source="Finishedproductionordgers" accent="gold" icon={dashboardIcons.Route} />
        </div>
        <div className="mt-8">
          <BarChart title="Visible Production Output" bars={productionBars} valueFormatter={(value) => formatQuantity(value, "units")} />
        </div>
      </section>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard label="Daily production" value={formatQuantity(data.production.dailyProduction, "units")} note="Rows finished today." icon={dashboardIcons.Factory} />
        <MetricCard label="Monthly production" value={formatQuantity(data.production.monthlyProduction, "units")} note="Rows finished in the current month." icon={dashboardIcons.Factory} />
        <MetricCard label="Total production" value={formatQuantity(data.production.totalProduction, "units")} note="Total extracted production quantity." icon={dashboardIcons.Factory} />
      </div>
      <article className="mt-8 analysis-panel">
        <DataTable
          headers={["Product name", "Production date", "Qty produced", "Unit", "Machine / line", "Material consumption"]}
          rows={data.production.rows.map((row) => [
            row.productName,
            row.productionDate,
            row.quantityProduced.toLocaleString("en-US", { maximumFractionDigits: 4 }),
            row.unit,
            row.productionLine,
            row.materialConsumption,
          ])}
        />
      </article>
    </AGHealthShell>
  );
}
