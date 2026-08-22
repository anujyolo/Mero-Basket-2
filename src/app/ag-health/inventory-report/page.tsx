import { AGHealthShell, BarChart, DataTable, ExecutiveKpiCard, HeroPanel, PieChartCard, SectionHeader, dashboardIcons } from "../_components";
import { formatNpr, formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";
import { InventoryRegister } from "./inventory-register";

export const dynamic = "force-dynamic";

const compactNpr = (value: number) => `NPR ${new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
}).format(value)}`;

export default async function InventoryReportPage() {
  const data = await getAGHealthDashboardData();
  const inventoryRows = data.inventoryByCategory.flatMap((category) => category.rows);
  const topCategoryBars = data.inventoryByCategory
    .slice()
    .sort((a, b) => b.stockValue - a.stockValue)
    .slice(0, 12)
    .map((category) => {
      const max = Math.max(...data.inventoryByCategory.map((row) => row.stockValue), 0);
      return { label: category.category, amount: category.stockValue, height: max > 0 ? Math.max(4, Math.round((category.stockValue / max) * 92)) : 0 };
    });

  return (
    <AGHealthShell active="inventory-report" company={data.company} connected={data.connected}>
      <HeroPanel
        eyebrow="Inventory Report"
        title="ERP inventory value, stock, and category separation"
        description="This page follows the reference dashboard pattern: headline numbers first, category chart second, and separated inventory tables below."
        stats={[
          { label: "Total inventory value", value: formatNpr(data.dashboard.totalInventoryValue), note: "Stock × purchase/cost rate.", icon: dashboardIcons.Boxes },
          { label: "Categories", value: data.inventoryByCategory.length.toLocaleString("en-US"), note: "ERP posting groups kept separate.", icon: dashboardIcons.Route },
          { label: "Packing material stock", value: formatQuantity(data.dashboard.packingMaterialStock), note: "PM group only.", icon: dashboardIcons.PackageCheck },
          { label: "Total orders", value: formatQuantity(data.dashboard.totalOrders), note: "Shown for inventory planning context.", icon: dashboardIcons.ClipboardCheck },
        ]}
        actions={[
          { label: "Packing Materials", href: "/ag-health/packing-materials" },
          { label: "Production", href: "/ag-health/production" },
          { label: "Orders", href: "/ag-health/orders" },
        ]}
      />
      <section className="mt-10">
        <SectionHeader eyebrow="Category Value" title="Inventory by category">
          Inventory is grouped by ERP category. Each category is shown separately so packing materials, finished goods, raw materials, and other item groups do not get mixed.
        </SectionHeader>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <ExecutiveKpiCard title="Inventory Value" value={formatNpr(data.dashboard.totalInventoryValue)} detail="Total value across all ERP item categories." source="Itemcard" icon={dashboardIcons.Boxes} />
          <ExecutiveKpiCard title="Packing Material Stock" value={formatQuantity(data.dashboard.packingMaterialStock)} detail="Only PM category stock." source="Itemcard: PM" icon={dashboardIcons.PackageCheck} />
          <ExecutiveKpiCard title="Category Count" value={data.inventoryByCategory.length.toLocaleString("en-US")} detail="All visible ERP inventory groups remain separated." source="Inventory_Posting_Group" accent="gold" icon={dashboardIcons.Route} />
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <BarChart title="Top Inventory Categories by Stock Value" bars={topCategoryBars} valueFormatter={formatNpr} axisFormatter={compactNpr} />
          <PieChartCard title="Inventory Category Mix" slices={data.inventoryCategoryMix} valueFormatter={formatNpr} />
        </div>
      </section>
      <div className="mt-8">
        <InventoryRegister rows={inventoryRows} />
      </div>
      <div className="mt-8 grid gap-6">
        {data.inventoryByCategory.map((category) => (
          <article key={category.category} className="analysis-panel">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black">{category.category}</h2>
                <p className="mt-2 text-sm font-semibold text-[var(--text)]">Stock: {formatQuantity(category.totalStock)} · Value: {formatNpr(category.stockValue)}</p>
              </div>
            </div>
            <DataTable
              headers={["Item no", "Item name", "Posting group", "Item category", "Status", "Current stock", "Unit", "Purchased qty", "Purchase rate", "Supplier", "Purchase date", "Remaining qty", "Stock value"]}
              rows={category.rows.map((row) => [
                row.itemNo,
                row.itemName,
                row.postingGroup,
                row.itemCategory,
                row.status,
                row.currentStock.toLocaleString("en-US", { maximumFractionDigits: 4 }),
                row.unit,
                row.purchasedQuantity.toLocaleString("en-US", { maximumFractionDigits: 4 }),
                row.purchaseRate.toLocaleString("en-US", { maximumFractionDigits: 2 }),
                row.supplier,
                row.purchaseDate,
                row.remainingQuantity.toLocaleString("en-US", { maximumFractionDigits: 4 }),
                formatNpr(row.stockValue),
              ])}
            />
          </article>
        ))}
      </div>
    </AGHealthShell>
  );
}
