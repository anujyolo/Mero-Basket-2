import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  BarChart3,
  Bot,
  Box,
  ClipboardCheck,
  Database,
  Download,
  Factory,
  FileSearch,
  Gauge,
  Home,
  Package,
  PackageCheck,
  RefreshCcw,
  Send,
  ShieldCheck,
  Truck,
  User,
  X,
  type LucideIcon,
} from "lucide-react";

import { formatNpr, formatPercent, formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

const navTabs = [
  { label: "Dashboard", href: "/ag-health", icon: Home, active: true },
  { label: "Business Central", href: "#business-central", icon: Database },
  { label: "Raw Materials", href: "#raw-materials", icon: Package },
  { label: "Packing Materials", href: "#packing-materials", icon: PackageCheck },
  { label: "Cylinder", href: "#cylinder", icon: Box },
  { label: "Production", href: "#production", icon: Factory },
  { label: "Sales Analysis", href: "#sales-analysis", icon: BarChart3 },
  { label: "East Dealers", href: "#dealers", icon: Truck },
  { label: "Orders", href: "#orders", icon: ClipboardCheck },
  { label: "Freight And Distribution Expenses", href: "#freight", icon: Truck },
] as const;

type KpiCardModel = {
  title: string;
  value: string;
  detail: string;
  source: string;
  fields: string;
  accent: "blue" | "gold";
  icon: LucideIcon;
};

const fieldTrace = [
  ["Billing date", "Posting_Date"],
  ["Billing document type", "Document_Type"],
  ["Billing amount", "Amount_LCY"],
  ["Sales date", "Posting_Date"],
  ["Inventory item", "No"],
  ["Inventory quantity", "Inventory"],
  ["Bank balance", "Balance_LCY"],
  ["Vendor ledger", "VendorLedgerEntries"],
] as const;

const coverageRows = [
  ["Sales", "Open report", "Business Central"],
  ["Purchases", "Open report", "Vendor Ledger"],
  ["Raw Materials", "Open report", "Itemcard"],
  ["Finished Goods", "Review gap", "Itemcard"],
  ["Production Entries", "Open report", "Production"],
  ["Orders", "Open report", "Orders"],
  ["Notifications", "Review gap", "Alerts"],
  ["Bank Balances", "Open report", "Bankacccard1"],
  ["Approval Requests", "Review gap", "Approvals"],
  ["Users", "Review gap", "Access"],
  ["Audit Logs", "Review gap", "Source Audit"],
  ["Rate Limits", "Review gap", "Connector Health"],
] as const;

const assistantChips = ["Today summary", "Inventory", "Bank", "Production", "Low stock", "FG stock", "Qty source", "Diaper materials"] as const;

function NavTab({ item }: { item: (typeof navTabs)[number] }) {
  const Icon = item.icon;

  return (
    <a href={item.href} className={`ag-nav-tab ${"active" in item && item.active ? "ag-nav-tab-active" : ""}`}>
      <Icon className="size-5" aria-hidden="true" />
      {item.label}
    </a>
  );
}

function KpiCard({ card }: { card: KpiCardModel }) {
  const Icon = card.icon;

  return (
    <a href="#business-central" className={`erp-metric-card ${card.accent === "gold" ? "erp-metric-card-gold" : "erp-metric-card-blue"}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="max-w-72 text-sm font-black uppercase leading-6 tracking-[0.08em] text-[var(--text)]">{card.title}</p>
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--soft)] text-[var(--navy)]">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-7 text-[clamp(2rem,3vw,3.3rem)] font-black tracking-tight text-[var(--navy)]">{card.value}</p>
      <p className="mt-4 text-sm leading-7 text-[var(--text)]">{card.detail}</p>
      <span className="mt-5 inline-flex rounded-full bg-[var(--badge)] px-4 py-2 text-xs font-black text-[var(--text)]">{card.source}</span>
      <p className="mt-4 text-xs leading-5 text-[var(--text-light)]">{card.fields}</p>
    </a>
  );
}

function GunteAssistant() {
  return (
    <aside className="assistant-panel" aria-label="Gunte assistant">
      <div className="assistant-header">
        <div className="flex items-center gap-4">
          <span className="grid size-10 place-items-center rounded-2xl bg-white/12">
            <Bot className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-black text-white">Gunte</h2>
            <p className="mt-1 text-sm leading-5 text-white/72">Live data answers with source-aware follow ups</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="grid size-9 place-items-center rounded-full bg-white/10 text-white" aria-label="Refresh assistant">
            <RefreshCcw className="size-4" aria-hidden="true" />
          </button>
          <button className="grid size-9 place-items-center rounded-full bg-white/10 text-white" aria-label="Close assistant">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="border-b border-[var(--border)] bg-white px-5 py-3 text-sm text-[var(--text)]">Ask for totals, drilldowns, source fields, or setup help.</div>
      <div className="flex gap-2 overflow-x-auto border-b border-[var(--border)] bg-white px-5 py-4">
        {assistantChips.map((chip) => (
          <button key={chip} className="assistant-chip">{chip}</button>
        ))}
      </div>
      <div className="min-h-60 bg-[linear-gradient(135deg,#f8fafc_0%,#f6f8fc_52%,#f7f4e8_100%)] p-5">
        <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-black text-[var(--navy)]">Gunte</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--ink)]">I can answer from live ERP data, local dashboard records, product recipes, and setup docs. Ask naturally, or tap a quick action below.</p>
        </div>
      </div>
      <div className="border-t border-[var(--border)] bg-white px-5 py-4">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">Try a guided question</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Production summary", "Inventory detail", "Receivables"].map((question) => (
            <button key={question} className="assistant-chip">{question}</button>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-3">
          <div className="min-h-16 flex-1 rounded-2xl border border-[var(--border-strong)] px-4 py-3 text-base text-[var(--text-light)]">Ask Gunte about qty, inventory, sources, bank balance...</div>
          <button className="grid size-16 place-items-center rounded-2xl bg-[var(--gold)] text-white" aria-label="Send question">
            <Send className="size-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default async function AGHealthDashboard() {
  const data = await getAGHealthDashboardData();
  const kpiCards: KpiCardModel[] = [
    {
      title: "Business Central Sales (12-Month)",
      value: formatNpr(data.values.sales12Month),
      detail: `Live Business Central sales recognized from ${data.sourceWindow}. This is a rolling dashboard window from the connected BC sales feed, not a single-month or today-only figure.`,
      source: "SalesDashboard",
      fields: "Fields: Posting_Date + Sales_Amount_Actual",
      accent: "blue",
      icon: BarChart3,
    },
    {
      title: "Business Central Receivables",
      value: formatNpr(data.values.receivables),
      detail: "Current customer receivables from the live Business Central customer trial balance row for Sundry Debtor.",
      source: "ExcelTemplateTrialBalance",
      fields: "Fields: number=110405 + balanceAtDateDebit + balanceAtDateCredit",
      accent: "blue",
      icon: Database,
    },
    {
      title: "Business Central Bank Balance",
      value: formatNpr(data.values.bankBalance),
      detail: `Current live Business Central bank balance net of blocked accounts across ${data.entityCounts.bankRows} BANK rows.`,
      source: "Bankacccard1",
      fields: "Fields: Blocked + Bank_Acc_Posting_Group + Balance_LCY",
      accent: "gold",
      icon: Banknote,
    },
  ];
  const heroStats = [
    { label: "Source mode", value: data.connected ? "Live ERP" : "ERP pending", detail: "Dynamics 365 Business Central", icon: Database },
    { label: "Confirmed entities", value: data.connected ? "7" : "0", detail: "Sales, receivables, bank, stock, vendors, purchases, production", icon: ShieldCheck },
    { label: "Sales rows", value: data.entityCounts.salesRows.toLocaleString("en-US"), detail: "Rows summarized from the mapped sales feed", icon: Gauge },
    { label: "Latest live month", value: data.labels.latestSalesMonth, detail: `Last checked ${new Date(data.checkedAt).toLocaleString("en-US", { timeZone: "Asia/Kathmandu" })}`, icon: RefreshCcw },
  ];
  const quickMetrics = [
    { label: "This month sales", value: formatNpr(data.values.currentMonthSales), note: `${data.labels.latestSalesMonth} from live Business Central sales entries` },
    { label: "12-month sales", value: formatNpr(data.values.sales12Month), note: "Sum of the visible Business Central sales window on this dashboard" },
    { label: "Raw material stock", value: formatQuantity(data.values.rawMaterialStock), note: `${data.entityCounts.rawMaterialPositiveRows} materials currently show positive stock` },
    { label: "Latest gross margin", value: formatPercent(data.values.grossMarginPercent), note: "Calculated from live sales amount and actual cost in the sales window" },
  ];
  const operationStats = [
    { label: "ERP RM items", value: data.entityCounts.rawMaterialRows.toLocaleString("en-US"), note: "Material master rows currently classified under the RM posting group" },
    { label: "Positive stock items", value: data.entityCounts.rawMaterialPositiveRows.toLocaleString("en-US"), note: "Raw-material rows with live quantity greater than zero" },
    { label: "Purchase line sample", value: formatNpr(data.values.latestPurchases), note: "Current extracted purchase-line total from the first mapped ERP batch" },
    { label: "Production sample", value: formatQuantity(data.values.latestProduction, "units"), note: "Current extracted finished-production quantity from the first mapped ERP batch" },
  ];
  const moduleCards = [
    { title: "Executive Dashboard", meta: data.connected ? "Live ERP" : "Pending", detail: `Executive view: ${formatNpr(data.values.sales12Month)} in sales, ${formatNpr(data.values.receivables)} in receivables, and ${formatNpr(data.values.bankBalance)} in live ERP bank balance.`, href: "#overview", icon: BarChart3 },
    { title: "Business Central", meta: `${data.entityCounts.rawMaterialRows.toLocaleString("en-US")} RM items`, detail: `ERP preview: ${data.entityCounts.rawMaterialPositiveRows.toLocaleString("en-US")} positive-stock raw material rows with live drill-down ready.`, href: "#business-central", icon: Database },
    { title: "Source Audit", meta: "Mapped fields", detail: "Traceability preview: exact Business Central field names are shown beside the dashboard sections.", href: "#source-audit", icon: FileSearch },
    { title: "Raw Materials", meta: `${data.entityCounts.rawMaterialRows.toLocaleString("en-US")} ERP items`, detail: `Inventory preview: ${formatQuantity(data.values.rawMaterialStock)} on hand across positive raw-material stock rows.`, href: "#raw-materials", icon: Package },
    { title: "Production", meta: data.entityCounts.productionRows ? `${data.entityCounts.productionRows.toLocaleString("en-US")} rows` : "Mapped", detail: `Production preview: ${formatQuantity(data.values.latestProduction, "units")} extracted from finished production orders.`, href: "#production", icon: Factory },
    { title: "Orders", meta: data.entityCounts.vendorLedgerRows ? `${data.entityCounts.vendorLedgerRows.toLocaleString("en-US")} rows` : "Mapped", detail: `Payables preview: vendor-ledger extraction is active with ${data.entityCounts.vendorCount.toLocaleString("en-US")} vendors in the first batch.`, href: "#orders", icon: ClipboardCheck },
    { title: "Freight And Distribution Expenses", meta: "Needs GL mapping", detail: "Monthly freight and distribution expense view appears here when GL tracking rules are confirmed.", href: "#freight", icon: Truck },
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
          <nav className="flex min-w-0 flex-1 gap-2 overflow-x-auto xl:justify-center" aria-label="AG Health navigation">
            {navTabs.map((item) => <NavTab key={item.label} item={item} />)}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <span className="rounded-2xl border border-[var(--border)] bg-[var(--cream)] px-5 py-3 text-sm font-black">AG Health</span>
            <span className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 shadow-sm">
              <span className="grid size-10 place-items-center rounded-xl bg-[var(--gold)] text-white"><User className="size-5" aria-hidden="true" /></span>
              <span><span className="block font-black">Mangal</span><span className="block text-sm text-[var(--text-light)]">Administrator</span></span>
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1740px] px-5 py-8 lg:pr-[29rem]">
        <section id="overview" className="grid gap-6 xl:grid-cols-[1fr_25rem]">
          <div className="rounded-[32px] border border-[var(--border)] bg-white/74 p-7 shadow-[var(--shadow)] lg:p-9">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">Executive Dashboard</p>
            <h1 className="mt-10 max-w-4xl text-4xl font-black tracking-tight text-[var(--ink)] lg:text-6xl">Live ERP executive dashboard</h1>
            <p className="mt-8 max-w-4xl text-lg leading-8 text-[var(--text)]">Truthful executive reporting first. This homepage is now organized around overview, performance, operations, and data trust so the live ERP story is easier to scan.</p>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {heroStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <article key={stat.label} className="status-card">
                    <Icon className="size-6 text-[var(--navy)]" aria-hidden="true" />
                    <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-[var(--text-light)]">{stat.label}</p>
                    <p className="mt-2 text-2xl font-black text-[var(--navy)]">{stat.value}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--text)]">{stat.detail}</p>
                  </article>
                );
              })}
            </div>
          </div>
          <aside className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]">
            <ShieldCheck className="size-8 text-[var(--blue)]" aria-hidden="true" />
            <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-[var(--text-light)]">Source Health</p>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-[var(--soft)] px-4 py-3"><span className="font-black">ERP base URL</span><span className="text-sm font-black text-[var(--navy)]">Configured</span></div>
              <div className="flex items-center justify-between rounded-2xl bg-[var(--soft)] px-4 py-3"><span className="font-black">Checked roots</span><span className="text-sm font-black text-[var(--navy)]">1</span></div>
              <div className="flex items-center justify-between rounded-2xl bg-[var(--soft)] px-4 py-3"><span className="font-black">Retry status</span><span className="text-sm font-black text-[var(--navy)]">{data.connected ? "Stable" : "Pending"}</span></div>
            </div>
            <p className="mt-5 text-sm leading-6 text-[var(--text)]">This panel shows the current data-connection state for the executive homepage.</p>
            <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-[var(--text-light)]">Quick Actions</p>
            <div className="mt-4 grid gap-3">
              {["Open Source Audit", "Open Business Central", "Open Freight Expenses", "Download Reports", "Inventory Report"].map((action, index) => (
                <a key={action} href={index === 0 ? "#source-audit" : "#business-central"} className={`premium-btn ${index === 1 ? "premium-btn-primary" : index === 2 ? "premium-btn-outline" : "premium-btn-gold"}`}>
                  {action}
                  {action.includes("Download") ? <Download className="size-4" aria-hidden="true" /> : <ArrowRight className="size-4" aria-hidden="true" />}
                </a>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Overview</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight">Executive Snapshot</h2>
          <p className="mt-4 max-w-5xl text-xl leading-9 text-[var(--text)]">The homepage now starts with the most important live numbers first, followed by the supporting context underneath.</p>
          <div className="mt-8 grid gap-6 xl:grid-cols-3">{kpiCards.map((card) => <KpiCard key={card.title} card={card} />)}</div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickMetrics.map((metric) => (
              <article key={metric.label} className="snapshot-card"><p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">{metric.label}</p><p className="mt-3 text-2xl font-black text-[var(--navy)]">{metric.value}</p><p className="mt-3 text-sm leading-6 text-[var(--text)]">{metric.note}</p></article>
            ))}
          </div>
        </section>

        <section id="sales-analysis" className="mt-12">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Performance</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight">Monthly Revenue and Trend Views</h2>
          <p className="mt-4 max-w-5xl text-xl leading-9 text-[var(--text)]">Charts are grouped together here so revenue, purchases, production, and COGS can be compared without interrupting the rest of the page.</p>
          <div className="mt-8 grid gap-6">
            <article className="analysis-panel">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div><h3 className="text-2xl font-black text-[var(--ink)]">Business Central Monthly Sales Revenue</h3><p className="mt-3 text-sm leading-6 text-[var(--text)]">Sales are sourced from live Business Central customer-ledger invoices minus credit memos, grouped by Posting_Date.</p></div>
                <div className="flex gap-2 text-sm font-black"><span className="rounded-full bg-[var(--badge)] px-4 py-2">All years</span><span className="rounded-full bg-white px-4 py-2 shadow-sm">2083</span><span className="rounded-full bg-white px-4 py-2 shadow-sm">2082</span></div>
              </div>
              <div className="mt-8 flex h-80 items-end gap-3 border-b border-l border-[var(--border-strong)] px-4 pb-4">
                {data.monthlySales.map((bar) => <div key={bar.month} className="flex flex-1 flex-col items-center justify-end gap-2"><span className="w-full rounded-t-xl bg-[var(--navy)]" title={formatNpr(bar.amount)} style={{ height: `${bar.height}%` }} /><span className="text-xs font-semibold text-[var(--text-light)] [writing-mode:vertical-rl] sm:[writing-mode:horizontal-tb]">{bar.month}</span></div>)}
              </div>
            </article>
            <article className="analysis-panel">
              <h3 className="text-2xl font-black text-[var(--ink)]">Business Central Production Output, Purchases, and Revenue</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--text)]">Revenue and purchases are NPR values; production is output quantity on its own axis so the units stay honest.</p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-black"><span className="text-emerald-600">Production Output</span><span className="text-[var(--gold)]">Purchases</span><span className="text-[var(--navy)]">Revenue</span></div>
              <div className="mt-8 flex h-80 items-end gap-3 border-b border-l border-[var(--border-strong)] px-4 pb-4">
                {data.combinedMonthly.map((bar) => (
                  <div key={bar.month} className="flex flex-1 flex-col items-center justify-end gap-2">
                    <span className="flex h-full w-full items-end justify-center gap-1">
                      <span className="w-2 rounded-t bg-emerald-500" style={{ height: `${bar.production}%` }} />
                      <span className="w-2 rounded-t bg-[var(--gold)]" style={{ height: `${bar.purchases}%` }} />
                      <span className="w-2 rounded-t bg-[var(--navy)]" style={{ height: `${bar.revenue}%` }} />
                    </span>
                    <span className="text-xs font-semibold text-[var(--text-light)] [writing-mode:vertical-rl] sm:[writing-mode:horizontal-tb]">{bar.month}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="raw-materials" className="mt-12">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Operations</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight">Materials and Production Context</h2>
          <p className="mt-4 max-w-5xl text-xl leading-9 text-[var(--text)]">Raw-material inventory now sits in its own section with a compact operational summary above the full detail table.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{operationStats.map((stat) => <article key={stat.label} className="snapshot-card"><p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">{stat.label}</p><p className="mt-3 text-2xl font-black text-[var(--navy)]">{stat.value}</p><p className="mt-3 text-sm leading-6 text-[var(--text)]">{stat.note}</p></article>)}</div>
          <article className="mt-8 analysis-panel">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div><h3 className="text-2xl font-black text-[var(--ink)]">Business Central Materials</h3><p className="mt-3 text-sm leading-6 text-[var(--text)]">Exact live raw-material quantities in kilograms from Itemcard rows where the posting group is RM.</p></div>
              <div className="rounded-2xl bg-[var(--badge)] px-5 py-3 text-right"><p className="text-xl font-black text-[var(--navy)]">{formatQuantity(data.values.rawMaterialStock)}</p><p className="text-xs font-black text-[var(--text)]">{data.entityCounts.rawMaterialPositiveRows.toLocaleString("en-US")} positive-stock materials out of {data.entityCounts.rawMaterialRows.toLocaleString("en-US")} ERP raw-material items</p></div>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
              <div className="grid grid-cols-[1fr_8rem_9rem] bg-[var(--soft)] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]"><span>Material</span><span>ERP item</span><span>Quantity (kg)</span></div>
              {data.materialRows.map((row) => <div key={row.item} className="grid grid-cols-[1fr_8rem_9rem] border-t border-[var(--border)] bg-white px-4 py-3 text-sm"><span className="font-semibold">{row.name}</span><span className="text-[var(--text)]">{row.item}</span><span className="font-black text-[var(--navy)]">{row.quantity.toLocaleString("en-US", { maximumFractionDigits: 4 })}</span></div>)}
            </div>
          </article>
        </section>

        <section id="business-central" className="mt-12">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Modules and Field Trace</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight">Module Control Center</h2>
          <p className="mt-4 max-w-5xl text-xl leading-9 text-[var(--text)]">Navigation and exact field mappings are grouped together here so the next destination and the current source are visible side by side.</p>
          <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <div className="analysis-panel"><h3 className="text-2xl font-black">Module Control Center</h3><p className="mt-3 text-sm leading-6 text-[var(--text)]">Each module explains what it is, what it means, and where to go next.</p><div className="mt-6 grid gap-4">{moduleCards.map((module) => { const Icon = module.icon; return <a key={module.title} href={module.href} className="module-card min-h-0"><div className="flex items-start justify-between gap-4"><span className="flex items-center gap-4"><span className="grid size-11 place-items-center rounded-2xl bg-[var(--soft)] text-[var(--navy)]"><Icon className="size-5" aria-hidden="true" /></span><span className="text-lg font-black">{module.title}</span></span><span className="rounded-full bg-[var(--badge)] px-3 py-1 text-xs font-black text-[var(--text)]">{module.meta}</span></div><p className="mt-4 text-sm leading-6 text-[var(--text)]">{module.detail}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[var(--navy)]">Open module <ArrowRight className="size-4" aria-hidden="true" /></span></a>; })}</div></div>
            <div id="source-audit" className="analysis-panel"><h3 className="text-2xl font-black">Exact Field Trace</h3><p className="mt-3 text-sm leading-6 text-[var(--text)]">The exact live keys recognized by the dashboard.</p><div className="mt-6 grid gap-4">{fieldTrace.map(([label, field]) => <div key={label} className="rounded-2xl border border-[var(--border)] bg-[var(--soft)] p-4"><p className="font-black">{label}</p><p className="mt-2 text-[var(--text)]">{field}</p></div>)}</div></div>
          </div>
        </section>

        <section id="reports" className="mt-12">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Report and Action Coverage</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight">Report and Action Coverage</h2>
          <div className="mt-8 overflow-hidden rounded-[28px] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
            {coverageRows.map(([name, action, route]) => <div key={name} className="grid gap-3 border-b border-[var(--border)] px-5 py-4 last:border-b-0 md:grid-cols-[1fr_auto_1fr]"><span className="font-black">{name}</span><a href="#business-central" className="font-black text-[var(--navy)]">{action}</a><span className="text-sm font-semibold text-[var(--text)]">{route}</span></div>)}
          </div>
        </section>
      </section>
      <GunteAssistant />
    </main>
  );
}
