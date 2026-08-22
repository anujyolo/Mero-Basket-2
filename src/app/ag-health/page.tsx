import Link from "next/link";

import { AGHealthShell, MetricCard, agHealthModules, dashboardIcons } from "./_components";
import { formatNpr, formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

export default async function AGHealthDashboard() {
  const data = await getAGHealthDashboardData();
  const metrics = [
    { label: "Total Inventory Value", value: formatNpr(data.dashboard.totalInventoryValue), note: "Current stock × purchase/cost rate from ERP items.", icon: dashboardIcons.Boxes },
    { label: "Packing Material Stock", value: formatQuantity(data.dashboard.packingMaterialStock), note: "Only PM category stock.", icon: dashboardIcons.PackageCheck },
    { label: "Today’s Production", value: formatQuantity(data.dashboard.todayProduction, "units"), note: "Finished production orders dated today.", icon: dashboardIcons.Factory },
    { label: "Monthly Production", value: formatQuantity(data.dashboard.monthlyProduction, "units"), note: "Current month finished production.", icon: dashboardIcons.Factory },
    { label: "Total Sales", value: formatNpr(data.dashboard.totalSales), note: "Live SalesDashboard feed.", icon: dashboardIcons.BarChart3 },
    { label: "Monthly Sales", value: formatNpr(data.dashboard.monthlySales), note: "Current/latest month sales.", icon: dashboardIcons.BarChart3 },
    { label: "Total Freight", value: formatNpr(data.dashboard.totalFreight), note: "Mapped freight-related GL rows.", icon: dashboardIcons.Truck },
    { label: "Distributed Expense", value: formatNpr(data.dashboard.distributedExpense), note: "Mapped distribution/allocation expenses.", icon: dashboardIcons.WalletCards },
    { label: "Total Orders", value: formatQuantity(data.dashboard.totalOrders), note: "SalesOrder records from ERP.", icon: dashboardIcons.ClipboardCheck },
    { label: "Pending Orders", value: formatQuantity(data.dashboard.pendingOrders), note: "Pending or processing orders.", icon: dashboardIcons.Route },
  ];

  return (
    <AGHealthShell active="dashboard" company={data.company} connected={data.connected}>
      <section className="rounded-[32px] border border-[var(--border)] bg-white/74 p-7 shadow-[var(--shadow)] lg:p-9">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">Focused ERP Dashboard</p>
        <h1 className="mt-6 max-w-5xl text-4xl font-black tracking-tight text-[var(--ink)] lg:text-6xl">Factory management, split into dedicated module pages.</h1>
        <p className="mt-6 max-w-5xl text-lg leading-8 text-[var(--text)]">
          The dashboard now stays as a summary page. Use the top navigation or module cards below to open each module on its own page.
        </p>
        {data.error ? <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 font-semibold text-amber-900">{data.error}</p> : null}
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
        </div>
      </section>

      <section className="mt-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Module Pages</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight">Open a dedicated report</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {agHealthModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.id} href={module.href} className="module-card min-h-0">
                <span className="grid size-12 place-items-center rounded-2xl bg-[var(--soft)] text-[var(--navy)]">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-black">{module.label}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text)]">Open the separate {module.label.toLowerCase()} page.</p>
              </Link>
            );
          })}
        </div>
      </section>
    </AGHealthShell>
  );
}
