import { AGHealthShell, DataTable, MetricCard, SectionHeader, dashboardIcons } from "../_components";
import { formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

export default async function PackingMaterialsPage() {
  const data = await getAGHealthDashboardData();

  return (
    <AGHealthShell active="packing-materials" company={data.company} connected={data.connected}>
      <SectionHeader eyebrow="Packing Materials" title="Packing Materials">
        This page is strictly filtered to ERP posting group PM. It does not show raw materials, finished goods, spare parts, or other item categories.
      </SectionHeader>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard label="Packing material stock" value={formatQuantity(data.dashboard.packingMaterialStock)} note="Only PM category stock." icon={dashboardIcons.PackageCheck} />
      </div>
      <article className="mt-8 analysis-panel">
        <DataTable
          headers={["Packing material name", "Current stock", "Unit", "Purchased qty", "Purchase rate", "Supplier", "Purchase date", "Remaining qty"]}
          rows={data.packingMaterials.map((row) => [
            row.packingMaterialName,
            row.currentStock.toLocaleString("en-US", { maximumFractionDigits: 4 }),
            row.unit,
            row.purchasedQuantity.toLocaleString("en-US", { maximumFractionDigits: 4 }),
            row.purchaseRate.toLocaleString("en-US", { maximumFractionDigits: 2 }),
            row.supplier,
            row.purchaseDate,
            row.remainingQuantity.toLocaleString("en-US", { maximumFractionDigits: 4 }),
          ])}
        />
      </article>
    </AGHealthShell>
  );
}
