import { AGHealthShell, DataTable, MetricCard, SectionHeader, dashboardIcons } from "../_components";
import { formatNpr, formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const data = await getAGHealthDashboardData();

  return (
    <AGHealthShell active="orders" company={data.company} connected={data.connected}>
      <SectionHeader eyebrow="Orders" title="Orders">
        Orders use ERP sales order headers and sales document lines. Statuses are normalized to Pending, Processing, Completed, or Cancelled.
      </SectionHeader>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard label="Total orders" value={formatQuantity(data.orders.totalOrders)} note="SalesOrder records available from ERP." icon={dashboardIcons.ClipboardCheck} />
        <MetricCard label="Pending orders" value={formatQuantity(data.orders.pendingOrders)} note="Pending or processing rows in the extracted list." icon={dashboardIcons.ReceiptText} />
      </div>
      <article className="mt-8 analysis-panel">
        <DataTable
          headers={["Order number", "Customer", "Order date", "Product", "Quantity", "Amount", "Order status", "Delivery status"]}
          rows={data.orders.rows.map((row) => [
            row.orderNumber,
            row.customer,
            row.orderDate,
            row.product,
            row.quantity.toLocaleString("en-US", { maximumFractionDigits: 4 }),
            formatNpr(row.amount),
            row.orderStatus,
            row.deliveryStatus,
          ])}
        />
      </article>
    </AGHealthShell>
  );
}
