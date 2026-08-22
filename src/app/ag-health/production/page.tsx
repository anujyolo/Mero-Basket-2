import { AGHealthShell, DataTable, MetricCard, SectionHeader, dashboardIcons } from "../_components";
import { formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

export default async function ProductionPage() {
  const data = await getAGHealthDashboardData();

  return (
    <AGHealthShell active="production" company={data.company} connected={data.connected}>
      <SectionHeader eyebrow="Production" title="Production">
        Production uses finished production order rows only. Daily, monthly, and total production are calculated separately from sales and inventory.
      </SectionHeader>
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
