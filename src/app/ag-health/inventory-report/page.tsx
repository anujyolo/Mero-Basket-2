import { AGHealthShell, DataTable, SectionHeader } from "../_components";
import { formatNpr, formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

export default async function InventoryReportPage() {
  const data = await getAGHealthDashboardData();

  return (
    <AGHealthShell active="inventory-report" company={data.company} connected={data.connected}>
      <SectionHeader eyebrow="Inventory Report" title="Inventory Report">
        Inventory is grouped by ERP category. Each category is shown separately so packing materials, finished goods, raw materials, and other item groups do not get mixed.
      </SectionHeader>
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
              headers={["Item name", "Category", "Current stock", "Unit", "Purchased qty", "Purchase rate", "Supplier", "Purchase date", "Remaining qty", "Stock value"]}
              rows={category.rows.map((row) => [
                row.itemName,
                row.category,
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
