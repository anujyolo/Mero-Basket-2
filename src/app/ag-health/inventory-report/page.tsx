import { AGHealthShell, BarChart, DataTable, ExecutiveKpiCard, HeroPanel, PieChartCard, SectionHeader, dashboardIcons } from "../_components";
import { formatNpr, formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";
import { InventoryRegister } from "./inventory-register";

export const dynamic = "force-dynamic";

const compactNpr = (value: number) => `NPR ${new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
}).format(value)}`;

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

export default async function InventoryReportPage() {
  const data = await getAGHealthDashboardData();
  const inventoryRows = data.inventoryByCategory.flatMap((category) => category.rows);
  const positiveRows = inventoryRows.filter((row) => row.currentStock > 0);
  const highestValueItem = inventoryRows.slice().sort((a, b) => b.stockValue - a.stockValue)[0];
  const totalStockQuantity = inventoryRows.reduce((sum, row) => sum + row.currentStock, 0);
  const topItemMax = Math.max(...inventoryRows.map((row) => row.stockValue), 0);
  const topItemBars = inventoryRows
    .slice()
    .sort((a, b) => b.stockValue - a.stockValue)
    .slice(0, 12)
    .map((row) => ({
      label: row.itemName,
      amount: row.stockValue,
      height: topItemMax > 0 ? Math.max(4, Math.round((row.stockValue / topItemMax) * 92)) : 0,
    }));
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
        title="Inventory value, stock, and categories"
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
          Inventory is separated by category, so raw materials, packing materials, finished goods, and other items do not get mixed.
        </SectionHeader>
        <SummaryStrip
          stats={[
            { label: "Inventory rows", value: inventoryRows.length.toLocaleString("en-US"), detail: "Total Itemcard rows currently visible in this inventory report." },
            { label: "Positive stock rows", value: positiveRows.length.toLocaleString("en-US"), detail: "Rows where current ERP stock is greater than zero." },
            { label: "Total stock quantity", value: formatQuantity(totalStockQuantity), detail: "Sum of current stock across all visible inventory rows." },
            { label: "Highest value item", value: highestValueItem ? formatNpr(highestValueItem.stockValue) : "ERP pending", detail: highestValueItem?.itemName || "No inventory rows mapped yet." },
          ]}
        />
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <ExecutiveKpiCard title="Inventory Value" value={formatNpr(data.dashboard.totalInventoryValue)} detail="Total value across all ERP item categories." source="Itemcard" icon={dashboardIcons.Boxes} />
          <ExecutiveKpiCard title="Packing Material Stock" value={formatQuantity(data.dashboard.packingMaterialStock)} detail="Only PM category stock." source="Itemcard: PM" icon={dashboardIcons.PackageCheck} />
          <ExecutiveKpiCard title="Category Count" value={data.inventoryByCategory.length.toLocaleString("en-US")} detail="All visible ERP inventory groups remain separated." source="Inventory_Posting_Group" accent="gold" icon={dashboardIcons.Route} />
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <BarChart title="Top Inventory Categories by Stock Value" bars={topCategoryBars} valueFormatter={formatNpr} axisFormatter={compactNpr} />
          <PieChartCard title="Inventory Category Mix" slices={data.inventoryCategoryMix} valueFormatter={formatNpr} />
        </div>
        <div className="mt-8">
          <BarChart
            title="Top Item Stock Value"
            bars={topItemBars}
            valueFormatter={formatNpr}
            axisFormatter={compactNpr}
            tone="green"
            note="Highest current inventory values by ERP item. Stock value = current stock × purchase/cost rate from Itemcard."
          />
        </div>
      </section>
      <div className="mt-8">
        <InventoryRegister rows={inventoryRows} />
      </div>
      <div className="mt-8 grid gap-6">
        {data.inventoryByCategory.map((category) => (
          <article key={category.category} className="chart-container">
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
      <article className="chart-container mt-8">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">How Inventory Data Is Calculated</h3>
            <p className="chart-subtitle">Where each inventory number comes from.</p>
          </div>
        </div>
        <DataTable
          headers={["Data shown", "ERP source", "Fields used"]}
          rows={[
            ["Item/category separation", "Itemcard", "Inventory_Posting_Group, Item_Category_Code"],
            ["Current stock", "Itemcard", "Inventory, Base_Unit_of_Measure"],
            ["Purchase quantity", "Itemcard", "Qty_on_Purch_Order"],
            ["Purchase/cost rate", "Itemcard", "Last_Direct_Cost, Unit_Cost, Unit_Price"],
            ["Supplier/date", "Itemcard", "Vendor_No, Last_Date_Modified"],
            ["Stock value", "Calculated", "Current stock × purchase/cost rate"],
          ]}
        />
      </article>
    </AGHealthShell>
  );
}
