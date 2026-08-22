import { AGHealthShell, DataTable, ExecutiveKpiCard, HeroPanel, MetricCard, SectionHeader, dashboardIcons } from "../_components";
import { formatNpr, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

export default async function FreightPage() {
  const data = await getAGHealthDashboardData();
  const totalRows = data.freight.rows.length;
  const averageFreight = totalRows > 0 ? data.freight.totalFreightExpense / totalRows : 0;

  return (
    <AGHealthShell active="freight" company={data.company} connected={data.connected}>
      <HeroPanel
        eyebrow="Freight"
        title="Freight and transport expense"
        description="This page follows the reference freight-expense layout: total expense first, matched rows next, and detailed ledger rows underneath."
        stats={[
          { label: "Total freight", value: formatNpr(data.freight.totalFreightExpense), note: "Mapped freight-related GL rows.", icon: dashboardIcons.Truck },
          { label: "Matched rows", value: totalRows.toLocaleString("en-US"), note: "Rows containing freight/transport signals.", icon: dashboardIcons.Route },
          { label: "Average freight", value: formatNpr(averageFreight), note: "Average per matched row.", icon: dashboardIcons.BarChart3 },
          { label: "Monthly sales", value: formatNpr(data.dashboard.monthlySales), note: "Shown for expense comparison.", icon: dashboardIcons.BarChart3 },
        ]}
        actions={[
          { label: "Sales Analysis", href: "/ag-health/sales-analysis" },
          { label: "Distributed Expense", href: "/ag-health/distributed-expense" },
          { label: "Orders", href: "/ag-health/orders" },
        ]}
      />
      <section className="mt-10">
        <SectionHeader eyebrow="Freight Summary" title="Freight snapshot">
          Freight is filtered from GL rows containing freight, transport, vehicle, delivery, or distribution references. Total freight expense is calculated from those rows only.
        </SectionHeader>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <ExecutiveKpiCard title="Total Freight Expense" value={formatNpr(data.freight.totalFreightExpense)} detail="Total matched freight/transport GL expense." source="Generalledgerentries" icon={dashboardIcons.Truck} />
          <ExecutiveKpiCard title="Matched Entries" value={totalRows.toLocaleString("en-US")} detail="Live ledger rows currently visible in this module." source="GL Description / Account" icon={dashboardIcons.Route} />
          <ExecutiveKpiCard title="Average Freight" value={formatNpr(averageFreight)} detail="Average expense amount per matched freight row." source="Calculated" accent="gold" icon={dashboardIcons.BarChart3} />
        </div>
      </section>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard label="Total freight expense" value={formatNpr(data.freight.totalFreightExpense)} note="Mapped freight-related GL rows." icon={dashboardIcons.Truck} />
      </div>
      <article className="mt-8 analysis-panel">
        <DataTable
          headers={["Date", "Supplier/customer", "Invoice/reference", "Freight amount", "Transport company", "Related purchase/order", "Remarks"]}
          rows={data.freight.rows.map((row) => [
            row.date,
            row.supplierCustomer,
            row.invoiceReference,
            formatNpr(row.freightAmount),
            row.transportCompany,
            row.relatedPurchaseOrder,
            row.remarks,
          ])}
        />
      </article>
    </AGHealthShell>
  );
}
