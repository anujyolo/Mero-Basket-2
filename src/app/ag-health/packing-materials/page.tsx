import { AGHealthShell, BarChart, DataTable, ExecutiveKpiCard, HeroPanel, MetricCard, SectionHeader, dashboardIcons } from "../_components";
import { formatNpr, formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

const compactQuantity = (value: number) => new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
}).format(value);

const compactNpr = (value: number) => `NPR ${new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value)}`;

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

export default async function PackingMaterialsPage() {
  const data = await getAGHealthDashboardData();
  const maxStock = Math.max(...data.packingMaterials.map((row) => row.currentStock), 0);
  const stockBars = data.packingMaterials.slice(0, 12).map((row) => ({
    label: row.packingMaterialName.slice(0, 12),
    amount: row.currentStock,
    height: maxStock > 0 ? Math.max(4, Math.round((row.currentStock / maxStock) * 92)) : 0,
  }));
  const maxValue = Math.max(...data.packingMaterials.map((row) => row.currentStock * row.purchaseRate), 0);
  const valueBars = data.packingMaterials.slice(0, 12).map((row) => {
    const value = row.currentStock * row.purchaseRate;
    return {
      label: row.packingMaterialName.slice(0, 12),
      amount: value,
      height: maxValue > 0 ? Math.max(4, Math.round((value / maxValue) * 92)) : 0,
    };
  });
  const totalRows = data.packingMaterials.length;
  const topItem = data.packingMaterials[0];
  const totalPurchased = data.packingMaterials.reduce((sum, row) => sum + row.purchasedQuantity, 0);
  const totalRemaining = data.packingMaterials.reduce((sum, row) => sum + row.remainingQuantity, 0);
  const totalValue = data.packingMaterials.reduce((sum, row) => sum + row.currentStock * row.purchaseRate, 0);

  return (
    <AGHealthShell active="packing-materials" company={data.company} connected={data.connected}>
      <HeroPanel
        eyebrow="Packing Materials"
        title="Packing material stock dashboard"
        description="This page shows only packing materials. Raw materials and finished goods are not mixed here."
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
          This section explains packing stock, purchased quantity, remaining quantity, and current value without mixing other inventory.
        </SectionHeader>
        <SummaryStrip
          stats={[
            { label: "PM rows", value: totalRows.toLocaleString("en-US"), detail: "Only Itemcard rows mapped to packing materials." },
            { label: "Purchased quantity", value: formatQuantity(totalPurchased), detail: "Sum of purchase-order quantity for PM rows." },
            { label: "Remaining quantity", value: formatQuantity(totalRemaining), detail: "Current remaining PM quantity from ERP stock." },
            { label: "Packing value", value: formatNpr(totalValue), detail: "Current PM stock × purchase/cost rate." },
          ]}
        />
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <ExecutiveKpiCard title="Packing Material Stock" value={formatQuantity(data.dashboard.packingMaterialStock)} detail="Sum of PM current stock from ERP Itemcard." source="Itemcard: PM" icon={dashboardIcons.PackageCheck} />
          <ExecutiveKpiCard title="Visible PM Rows" value={totalRows.toLocaleString("en-US")} detail="Rows shown in the packing-material report table." source="Inventory_Posting_Group = PM" icon={dashboardIcons.Route} />
          <ExecutiveKpiCard title="Highest Stock PM" value={topItem ? formatQuantity(topItem.currentStock, topItem.unit) : "ERP pending"} detail={topItem?.packingMaterialName || "No PM rows mapped."} source="Itemcard" accent="gold" icon={dashboardIcons.Boxes} />
        </div>
        <div className="mt-8">
          <BarChart title="Top Packing Material Stock" bars={stockBars} valueFormatter={(value) => formatQuantity(value)} axisFormatter={compactQuantity} tone="green" note="Current stock quantity for the highest visible PM items." />
        </div>
        <div className="mt-8">
          <BarChart title="Top Packing Material Stock Value" bars={valueBars} valueFormatter={formatNpr} axisFormatter={compactNpr} tone="gold" note="Current PM value calculated as current stock × purchase/cost rate." />
        </div>
      </section>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard label="Packing material stock" value={formatQuantity(data.dashboard.packingMaterialStock)} note="Only PM category stock." icon={dashboardIcons.PackageCheck} />
      </div>
      <article className="mt-8 chart-container">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Packing Material Detail</h3>
            <p className="chart-subtitle">Only PM rows are shown here. This table excludes raw materials, finished goods, and other inventory groups.</p>
          </div>
        </div>
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
      <article className="chart-container mt-8">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">How Packing Data Is Calculated</h3>
            <p className="chart-subtitle">Where each packing material number comes from.</p>
          </div>
        </div>
        <DataTable
          headers={["Data shown", "ERP source", "Fields used"]}
          rows={[
            ["PM-only filter", "Itemcard", "Inventory_Posting_Group = PM"],
            ["Current stock", "Itemcard", "Inventory, Base_Unit_of_Measure"],
            ["Purchased quantity", "Itemcard", "Qty_on_Purch_Order"],
            ["Purchase/cost rate", "Itemcard", "Last_Direct_Cost, Unit_Cost, Unit_Price"],
            ["Supplier/date", "Itemcard", "Vendor_No, Last_Date_Modified"],
            ["Packing stock value", "Calculated", "Current stock × purchase/cost rate"],
          ]}
        />
      </article>
    </AGHealthShell>
  );
}
