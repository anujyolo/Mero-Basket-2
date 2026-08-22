import { AGHealthShell, BarChart, DataTable, ExecutiveKpiCard, HeroPanel, MetricCard, SectionHeader, dashboardIcons } from "../_components";
import { formatNpr, formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

const compactQuantity = (value: number) => new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
}).format(value);

export default async function PackingMaterialsPage() {
  const data = await getAGHealthDashboardData();
  const maxStock = Math.max(...data.packingMaterials.map((row) => row.currentStock), 0);
  const stockBars = data.packingMaterials.slice(0, 12).map((row) => ({
    label: row.packingMaterialName.slice(0, 12),
    amount: row.currentStock,
    height: maxStock > 0 ? Math.max(4, Math.round((row.currentStock / maxStock) * 92)) : 0,
  }));
  const totalRows = data.packingMaterials.length;
  const topItem = data.packingMaterials[0];

  return (
    <AGHealthShell active="packing-materials" company={data.company} connected={data.connected}>
      <HeroPanel
        eyebrow="Packing Materials"
        title="Packing material stock dashboard"
        description="This page uses the same premium card-and-chart rhythm as the reference dashboard, but it is strictly filtered to ERP posting group PM."
        stats={[
          { label: "Packing material stock", value: formatQuantity(data.dashboard.packingMaterialStock), note: "Only PM category stock.", icon: dashboardIcons.PackageCheck },
          { label: "Visible PM rows", value: totalRows.toLocaleString("en-US"), note: "No raw materials or finished goods.", icon: dashboardIcons.Route },
          { label: "Top stock item", value: topItem ? formatQuantity(topItem.currentStock, topItem.unit) : "ERP pending", note: topItem?.packingMaterialName || "No PM item mapped.", icon: dashboardIcons.Boxes },
          { label: "Total inventory value", value: formatNpr(data.dashboard.totalInventoryValue), note: "Shown only as context.", icon: dashboardIcons.BarChart3 },
        ]}
        actions={[
          { label: "Inventory Report", href: "/ag-health/inventory-report" },
          { label: "Production", href: "/ag-health/production" },
          { label: "Orders", href: "/ag-health/orders" },
        ]}
      />
      <section className="mt-10">
        <SectionHeader eyebrow="PM Overview" title="Packing material snapshot">
          This section is strictly filtered to ERP posting group PM. It does not show raw materials, finished goods, spare parts, or other item categories.
        </SectionHeader>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <ExecutiveKpiCard title="Packing Material Stock" value={formatQuantity(data.dashboard.packingMaterialStock)} detail="Sum of PM current stock from ERP Itemcard." source="Itemcard: PM" icon={dashboardIcons.PackageCheck} />
          <ExecutiveKpiCard title="Visible PM Rows" value={totalRows.toLocaleString("en-US")} detail="Rows shown in the packing-material report table." source="Inventory_Posting_Group = PM" icon={dashboardIcons.Route} />
          <ExecutiveKpiCard title="Highest Stock PM" value={topItem ? formatQuantity(topItem.currentStock, topItem.unit) : "ERP pending"} detail={topItem?.packingMaterialName || "No PM rows mapped."} source="Itemcard" accent="gold" icon={dashboardIcons.Boxes} />
        </div>
        <div className="mt-8">
          <BarChart title="Top Packing Material Stock" bars={stockBars} valueFormatter={(value) => formatQuantity(value)} axisFormatter={compactQuantity} />
        </div>
      </section>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard label="Packing material stock" value={formatQuantity(data.dashboard.packingMaterialStock)} note="Only PM category stock." icon={dashboardIcons.PackageCheck} />
      </div>
      <article className="mt-8 chart-container">
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
