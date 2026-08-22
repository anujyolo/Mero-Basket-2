import { AGHealthShell, DataTable, MetricCard, SectionHeader, dashboardIcons } from "../_components";
import { formatNpr, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

export default async function FreightPage() {
  const data = await getAGHealthDashboardData();

  return (
    <AGHealthShell active="freight" company={data.company} connected={data.connected}>
      <SectionHeader eyebrow="Freight" title="Freight">
        Freight is filtered from GL rows containing freight, transport, vehicle, delivery, or distribution references. Total freight expense is calculated from those rows only.
      </SectionHeader>
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
