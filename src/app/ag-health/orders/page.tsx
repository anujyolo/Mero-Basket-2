import { AGHealthShell, DataTable, ExecutiveKpiCard, HeroPanel, MetricCard, PieChartCard, SectionHeader, dashboardIcons } from "../_components";
import { formatNpr, formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const data = await getAGHealthDashboardData();
  const completedOrders = data.orders.rows.filter((row) => row.orderStatus === "Completed").length;
  const processingOrders = data.orders.rows.filter((row) => row.orderStatus === "Processing").length;

  return (
    <AGHealthShell active="orders" company={data.company} connected={data.connected}>
      <HeroPanel
        eyebrow="Orders"
        title="Order status dashboard"
        description="Orders follow the same reference-style flow: top status cards, order state summary, and then the detailed order grid."
        stats={[
          { label: "Total orders", value: formatQuantity(data.orders.totalOrders), note: "SalesOrder records available from ERP.", icon: dashboardIcons.ClipboardCheck },
          { label: "Pending orders", value: formatQuantity(data.orders.pendingOrders), note: "Pending or processing order rows.", icon: dashboardIcons.ReceiptText },
          { label: "Processing", value: processingOrders.toLocaleString("en-US"), note: "Visible rows marked processing.", icon: dashboardIcons.Route },
          { label: "Completed", value: completedOrders.toLocaleString("en-US"), note: "Visible rows marked completed.", icon: dashboardIcons.BarChart3 },
        ]}
        actions={[
          { label: "Sales Analysis", href: "/ag-health/sales-analysis" },
          { label: "Production", href: "/ag-health/production" },
          { label: "Inventory Report", href: "/ag-health/inventory-report" },
        ]}
      />
      <section className="mt-10">
        <SectionHeader eyebrow="Order Summary" title="Orders snapshot">
          Orders use ERP sales order headers and sales document lines. Statuses are normalized to Pending, Processing, Completed, or Cancelled.
        </SectionHeader>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <ExecutiveKpiCard title="Total Orders" value={formatQuantity(data.orders.totalOrders)} detail="Total SalesOrder records available from ERP." source="SalesOrder" icon={dashboardIcons.ClipboardCheck} />
          <ExecutiveKpiCard title="Pending Orders" value={formatQuantity(data.orders.pendingOrders)} detail="Pending or processing orders in the extracted list." source="Status" icon={dashboardIcons.ReceiptText} />
          <ExecutiveKpiCard title="Processing Rows" value={processingOrders.toLocaleString("en-US")} detail="Visible order rows marked processing." source="Normalized status" accent="gold" icon={dashboardIcons.Route} />
        </div>
        <div className="mt-8">
          <PieChartCard title="Order Status Mix" slices={data.orders.statusMix} valueFormatter={(value) => formatQuantity(value)} />
        </div>
      </section>
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
