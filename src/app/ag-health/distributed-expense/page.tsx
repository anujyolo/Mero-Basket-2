import { AGHealthShell, DataTable, ExecutiveKpiCard, HeroPanel, MetricCard, SectionHeader, dashboardIcons } from "../_components";
import { formatNpr, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

export default async function DistributedExpensePage() {
  const data = await getAGHealthDashboardData();
  const totalRows = data.distributedExpense.rows.length;
  const averageExpense = totalRows > 0 ? data.distributedExpense.totalDistributedExpense / totalRows : 0;

  return (
    <AGHealthShell active="distributed-expense" company={data.company} connected={data.connected}>
      <HeroPanel
        eyebrow="Distributed Expense"
        title="Distributed expense dashboard"
        description="This page mirrors the reference expense style: total expense, matched entries, average amount, then full rows."
        stats={[
          { label: "Distributed expense", value: formatNpr(data.distributedExpense.totalDistributedExpense), note: "Mapped distributed/allocation rows.", icon: dashboardIcons.WalletCards },
          { label: "Matched rows", value: totalRows.toLocaleString("en-US"), note: "Rows in the extracted expense set.", icon: dashboardIcons.Route },
          { label: "Average expense", value: formatNpr(averageExpense), note: "Average per matched row.", icon: dashboardIcons.BarChart3 },
          { label: "Total freight", value: formatNpr(data.dashboard.totalFreight), note: "Freight shown as related expense context.", icon: dashboardIcons.Truck },
        ]}
        actions={[
          { label: "Freight", href: "/ag-health/freight" },
          { label: "Sales Analysis", href: "/ag-health/sales-analysis" },
          { label: "Orders", href: "/ag-health/orders" },
        ]}
      />
      <section className="mt-10">
        <SectionHeader eyebrow="Expense Summary" title="Distributed expense snapshot">
          Distributed expense uses only GL rows that look like expense, allocation, distribution, or department cost rows.
        </SectionHeader>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <ExecutiveKpiCard title="Total Distributed Expense" value={formatNpr(data.distributedExpense.totalDistributedExpense)} detail="Total matched distributed/allocation GL expense." source="Generalledgerentries" icon={dashboardIcons.WalletCards} />
          <ExecutiveKpiCard title="Matched Entries" value={totalRows.toLocaleString("en-US")} detail="Live ledger rows currently visible in this module." source="GL Description / Account" icon={dashboardIcons.Route} />
          <ExecutiveKpiCard title="Average Expense" value={formatNpr(averageExpense)} detail="Average distributed amount per matched row." source="Calculated" accent="gold" icon={dashboardIcons.BarChart3} />
        </div>
      </section>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard label="Total distributed expense" value={formatNpr(data.distributedExpense.totalDistributedExpense)} note="Mapped distributed/allocation expense rows." icon={dashboardIcons.WalletCards} />
      </div>
      <article className="mt-8 analysis-panel">
        <DataTable
          headers={["Expense date", "Expense type", "Amount", "Related department/order/product", "Description", "Distributed amount"]}
          rows={data.distributedExpense.rows.map((row) => [
            row.expenseDate,
            row.expenseType,
            formatNpr(row.amount),
            row.relatedDepartmentOrderProduct,
            row.description,
            formatNpr(row.distributedAmount),
          ])}
        />
      </article>
    </AGHealthShell>
  );
}
