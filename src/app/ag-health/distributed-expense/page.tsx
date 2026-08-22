import { AGHealthShell, DataTable, MetricCard, SectionHeader, dashboardIcons } from "../_components";
import { formatNpr, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

export default async function DistributedExpensePage() {
  const data = await getAGHealthDashboardData();

  return (
    <AGHealthShell active="distributed-expense" company={data.company} connected={data.connected}>
      <SectionHeader eyebrow="Distributed Expense" title="Distributed Expense">
        Distributed expense uses only GL rows that look like expense, allocation, distribution, or department cost rows.
      </SectionHeader>
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
