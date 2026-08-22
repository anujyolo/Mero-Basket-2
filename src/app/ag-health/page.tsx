import Link from "next/link";
import {
  BarChart3,
  Boxes,
  ClipboardCheck,
  Factory,
  Home,
  PackageCheck,
  ReceiptText,
  Route,
  Truck,
  User,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

import { formatNpr, formatPercent, formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

const modules: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Inventory Report", href: "#inventory-report", icon: Boxes },
  { label: "Packing Materials", href: "#packing-materials", icon: PackageCheck },
  { label: "Production", href: "#production", icon: Factory },
  { label: "Sales Analysis", href: "#sales-analysis", icon: BarChart3 },
  { label: "Freight", href: "#freight", icon: Truck },
  { label: "Distributed Expense", href: "#distributed-expense", icon: WalletCards },
  { label: "Orders", href: "#orders", icon: ClipboardCheck },
];

function NavTab({ label, href, icon: Icon }: { label: string; href: string; icon: LucideIcon }) {
  return (
    <a href={href} className="ag-nav-tab">
      <Icon className="size-5" aria-hidden="true" />
      {label}
    </a>
  );
}

function MetricCard({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: LucideIcon }) {
  return (
    <article className="snapshot-card">
      <Icon className="size-6 text-[var(--navy)]" aria-hidden="true" />
      <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">{label}</p>
      <p className="mt-3 text-2xl font-black text-[var(--navy)]">{value}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--text)]">{note}</p>
    </article>
  );
}

function SectionHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-black tracking-tight">{title}</h2>
      <p className="mt-4 max-w-5xl text-lg leading-8 text-[var(--text)]">{children}</p>
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
      <table className="min-w-full border-collapse bg-white text-left text-sm">
        <thead className="bg-[var(--soft)] text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">
          <tr>
            {headers.map((header) => (
              <th key={header} className="whitespace-nowrap px-4 py-3">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-5 font-semibold text-[var(--text)]" colSpan={headers.length}>No live rows mapped yet.</td>
            </tr>
          ) : rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`} className="border-t border-[var(--border)]">
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--ink)]">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BarChart({ title, bars, valueFormatter }: { title: string; bars: { label: string; amount: number; height: number }[]; valueFormatter: (value: number) => string }) {
  return (
    <article className="analysis-panel">
      <h3 className="text-2xl font-black text-[var(--ink)]">{title}</h3>
      <div className="mt-8 flex h-72 items-end gap-3 border-b border-l border-[var(--border-strong)] px-4 pb-4">
        {bars.map((bar) => (
          <div key={bar.label} className="flex flex-1 flex-col items-center justify-end gap-2">
            <span className="w-full rounded-t-xl bg-[var(--navy)]" title={valueFormatter(bar.amount)} style={{ height: `${bar.height}%` }} />
            <span className="text-xs font-semibold text-[var(--text-light)] [writing-mode:vertical-rl] sm:[writing-mode:horizontal-tb]">{bar.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default async function AGHealthDashboard() {
  const data = await getAGHealthDashboardData();
  const dashboardMetrics = [
    { label: "Total Inventory Value", value: formatNpr(data.dashboard.totalInventoryValue), note: "Current stock × purchase/cost rate from ERP items.", icon: Boxes },
    { label: "Packing Material Stock", value: formatQuantity(data.dashboard.packingMaterialStock), note: "Only PM category stock, not raw materials or finished goods.", icon: PackageCheck },
    { label: "Today’s Production", value: formatQuantity(data.dashboard.todayProduction, "units"), note: "Finished production orders dated today where available.", icon: Factory },
    { label: "Monthly Production", value: formatQuantity(data.dashboard.monthlyProduction, "units"), note: "Current month production from finished production orders.", icon: Factory },
    { label: "Total Sales", value: formatNpr(data.dashboard.totalSales), note: "SalesDashboard live ERP sales window.", icon: BarChart3 },
    { label: "Monthly Sales", value: formatNpr(data.dashboard.monthlySales), note: "Current/latest month from live sales trend.", icon: BarChart3 },
    { label: "Total Freight", value: formatNpr(data.dashboard.totalFreight), note: "Freight/transport GL rows currently mapped.", icon: Truck },
    { label: "Distributed Expense", value: formatNpr(data.dashboard.distributedExpense), note: "Distributed/allocation expense GL rows currently mapped.", icon: WalletCards },
    { label: "Total Orders", value: formatQuantity(data.dashboard.totalOrders), note: "SalesOrder records from Business Central.", icon: ClipboardCheck },
    { label: "Pending Orders", value: formatQuantity(data.dashboard.pendingOrders), note: "Pending or processing order rows in the extracted set.", icon: Route },
  ];

  return (
    <main className="min-h-screen bg-[var(--canvas)] pb-12 text-[var(--ink)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/95 px-5 py-4 shadow-[0_8px_28px_rgba(31,48,74,0.05)] backdrop-blur">
        <div className="mx-auto flex max-w-[1740px] flex-col gap-4 xl:flex-row xl:items-center">
          <Link href="/" className="flex items-center gap-4 rounded-2xl">
            <span className="grid size-12 place-items-center rounded-2xl bg-[var(--navy)] text-white shadow-[0_10px_25px_rgba(31,63,103,0.22)]">
              <BarChart3 className="size-7" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xl font-black leading-tight">Factory Manager</span>
              <span className="block text-xs font-black uppercase tracking-[0.14em] text-[var(--gold)]">AG Health</span>
            </span>
          </Link>
          <nav className="flex min-w-0 flex-1 gap-2 overflow-x-auto xl:justify-center" aria-label="AG Health modules">
            <a href="#dashboard" className="ag-nav-tab ag-nav-tab-active">
              <Home className="size-5" aria-hidden="true" />
              Dashboard
            </a>
            {modules.map((module) => <NavTab key={module.label} {...module} />)}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <span className="rounded-2xl border border-[var(--border)] bg-[var(--cream)] px-5 py-3 text-sm font-black">{data.connected ? "ERP Live" : "ERP Pending"}</span>
            <span className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 shadow-sm">
              <span className="grid size-10 place-items-center rounded-xl bg-[var(--gold)] text-white"><User className="size-5" aria-hidden="true" /></span>
              <span><span className="block font-black">AG Health</span><span className="block text-sm text-[var(--text-light)]">{data.company}</span></span>
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1740px] px-5 py-8">
        <section id="dashboard" className="rounded-[32px] border border-[var(--border)] bg-white/74 p-7 shadow-[var(--shadow)] lg:p-9">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">Focused ERP Dashboard</p>
          <h1 className="mt-6 max-w-5xl text-4xl font-black tracking-tight text-[var(--ink)] lg:text-6xl">Factory management, simplified to the seven modules that matter.</h1>
          <p className="mt-6 max-w-5xl text-lg leading-8 text-[var(--text)]">
            This page now shows only Inventory Report, Packing Materials, Production, Sales Analysis, Freight, Distributed Expense, and Orders. Each module uses its own filtered ERP feed so sections stay clean and separate.
          </p>
          {data.error ? <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 font-semibold text-amber-900">{data.error}</p> : null}
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {dashboardMetrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
          </div>
        </section>

        <section id="inventory-report" className="mt-12">
          <SectionHeader eyebrow="Module 1" title="Inventory Report">
            Inventory is grouped by ERP category. It can include raw materials, packing materials, finished goods, spare parts, and other item categories, but each category is separated.
          </SectionHeader>
          <div className="mt-8 grid gap-6">
            {data.inventoryByCategory.map((category) => (
              <article key={category.category} className="analysis-panel">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-black">{category.category}</h3>
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
        </section>

        <section id="packing-materials" className="mt-12">
          <SectionHeader eyebrow="Module 2" title="Packing Materials">
            This section is strictly filtered to ERP posting group PM. It does not show raw materials or finished goods.
          </SectionHeader>
          <article className="mt-8 analysis-panel">
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
        </section>

        <section id="production" className="mt-12">
          <SectionHeader eyebrow="Module 3" title="Production">
            Production uses finished production order rows only. Daily, monthly, and total production are calculated separately from sales and inventory.
          </SectionHeader>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <MetricCard label="Daily production" value={formatQuantity(data.production.dailyProduction, "units")} note="Rows finished today." icon={Factory} />
            <MetricCard label="Monthly production" value={formatQuantity(data.production.monthlyProduction, "units")} note="Rows finished in the current month." icon={Factory} />
            <MetricCard label="Total production" value={formatQuantity(data.production.totalProduction, "units")} note="Total extracted production quantity." icon={Factory} />
          </div>
          <article className="mt-8 analysis-panel">
            <DataTable
              headers={["Product name", "Production date", "Qty produced", "Unit", "Machine / line", "Material consumption"]}
              rows={data.production.rows.map((row) => [
                row.productName,
                row.productionDate,
                row.quantityProduced.toLocaleString("en-US", { maximumFractionDigits: 4 }),
                row.unit,
                row.productionLine,
                row.materialConsumption,
              ])}
            />
          </article>
        </section>

        <section id="sales-analysis" className="mt-12">
          <SectionHeader eyebrow="Module 4" title="Sales Analysis">
            Sales analysis uses the ERP SalesDashboard feed and includes totals, current/previous month comparison, growth, and simple monthly/yearly charts.
          </SectionHeader>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Total sales" value={formatNpr(data.salesAnalysis.totalSales)} note="Total in the current analysis window." icon={BarChart3} />
            <MetricCard label="Monthly sales" value={formatNpr(data.salesAnalysis.monthlySales)} note="Current/latest month sales." icon={BarChart3} />
            <MetricCard label="Yearly sales" value={formatNpr(data.salesAnalysis.yearlySales)} note="Current/latest year sales." icon={BarChart3} />
            <MetricCard label="Previous month" value={formatNpr(data.salesAnalysis.previousMonthSales)} note="Previous month from trend." icon={BarChart3} />
            <MetricCard label="Growth" value={formatPercent(data.salesAnalysis.growthPercentage)} note="Current vs previous month." icon={BarChart3} />
          </div>
          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <BarChart title="Monthly Sales Trend" bars={data.salesAnalysis.monthlyTrend} valueFormatter={formatNpr} />
            <BarChart title="Yearly Sales Trend" bars={data.salesAnalysis.yearlyTrend} valueFormatter={formatNpr} />
          </div>
        </section>

        <section id="freight" className="mt-12">
          <SectionHeader eyebrow="Module 5" title="Freight">
            Freight is filtered from GL rows containing freight, transport, vehicle, delivery, or distribution references. Total freight expense is calculated from those rows only.
          </SectionHeader>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <MetricCard label="Total freight expense" value={formatNpr(data.freight.totalFreightExpense)} note="Mapped freight-related GL rows." icon={Truck} />
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
        </section>

        <section id="distributed-expense" className="mt-12">
          <SectionHeader eyebrow="Module 6" title="Distributed Expense">
            Distributed expense uses only GL rows that look like expense, allocation, distribution, or department cost rows.
          </SectionHeader>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <MetricCard label="Total distributed expense" value={formatNpr(data.distributedExpense.totalDistributedExpense)} note="Mapped distributed/allocation expense rows." icon={WalletCards} />
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
        </section>

        <section id="orders" className="mt-12">
          <SectionHeader eyebrow="Module 7" title="Orders">
            Orders use Business Central sales order headers and sales document lines. Statuses are normalized to Pending, Processing, Completed, or Cancelled.
          </SectionHeader>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <MetricCard label="Total orders" value={formatQuantity(data.orders.totalOrders)} note="SalesOrder records available from ERP." icon={ClipboardCheck} />
            <MetricCard label="Pending orders" value={formatQuantity(data.orders.pendingOrders)} note="Pending or processing rows in the extracted list." icon={ReceiptText} />
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
        </section>
      </section>
    </main>
  );
}
