import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  BarChart3,
  ClipboardCheck,
  Database,
  Download,
  Factory,
  FileSearch,
  Gauge,
  Home,
  Package,
  PackageCheck,
  ReceiptText,
  RefreshCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react";

import { getBusinessCentralConfig } from "@/server/business-central/config";

const navTabs = [
  { label: "Dashboard", href: "/ag-health", icon: Home, active: true },
  { label: "Business Central", href: "#business-central", icon: Database },
  { label: "Raw Materials", href: "#raw-materials", icon: Package },
  { label: "Packing Materials", href: "#packing-materials", icon: PackageCheck },
  { label: "Production", href: "#production", icon: Factory },
  { label: "Sales Analysis", href: "#sales-analysis", icon: BarChart3 },
  { label: "Orders", href: "#orders", icon: ReceiptText },
  { label: "Freight Expenses", href: "#freight", icon: Truck },
] as const;

const heroStats = [
  { label: "Source mode", value: "Live ERP", detail: "Dynamics 365 Business Central", icon: Database },
  { label: "Confirmed entities", value: "Pending", detail: "Will update after API/OData mapping", icon: ShieldCheck },
  { label: "Coverage ready", value: "13", detail: "Dashboard sections prepared in frontend", icon: Gauge },
  { label: "Latest live month", value: "Waiting", detail: "Requires ERP data service endpoint", icon: RefreshCcw },
] as const;

const executiveCards = [
  {
    title: "Business Central Sales",
    value: "Awaiting live sync",
    detail: "Sales invoices, credit memos, customers, item sales, monthly revenue, and period comparison.",
    source: "SalesDashboard",
    icon: BarChart3,
    accent: "blue",
  },
  {
    title: "Business Central Purchases",
    value: "Awaiting live sync",
    detail: "Purchase invoices, vendor totals, landed costs, item purchases, and buying trends.",
    source: "PurchaseDashboard",
    icon: ShoppingCart,
    accent: "blue",
  },
  {
    title: "Business Central Bank Balance",
    value: "Awaiting live sync",
    detail: "Bank accounts, available balance, overdraft separation, and cash position.",
    source: "BankAccountCards",
    icon: Banknote,
    accent: "gold",
  },
] as const;

const quickMetrics = [
  { label: "This month sales", value: "Waiting for ERP", note: "Current month billed sales net of credit memos." },
  { label: "Purchase total", value: "Waiting for ERP", note: "Vendor-ledger and purchase invoice total." },
  { label: "Raw material stock", value: "Waiting for ERP", note: "Positive stock and low-stock material count." },
  { label: "Latest gross margin", value: "Waiting for ERP", note: "Calculated after sales, COGS, and production mapping." },
] as const;

const moduleCards = [
  { title: "Executive Dashboard", meta: "Overview", detail: "Top-level sales, purchases, receivables, bank, stock, production, and margin view.", href: "#overview", icon: Home },
  { title: "Business Central", meta: "ERP source", detail: "Connection status, entity coverage, field mapping, and sync health.", href: "#business-central", icon: Database },
  { title: "Source / Self Analysis", meta: "Data trust", detail: "Shows where each number comes from, missing fields, and confidence before reporting.", href: "#self-analysis", icon: FileSearch },
  { title: "Raw Materials", meta: "Inventory", detail: "Raw material stock, unit cost, purchase, consumption, and low-stock dashboard.", href: "#raw-materials", icon: Package },
  { title: "Finished Goods", meta: "Inventory", detail: "Finished stock, available quantity, value, shipment readiness, and movement.", href: "#finished-goods", icon: PackageCheck },
  { title: "Production", meta: "Factory", detail: "Production entries, consumption, batch output, yield, and waste signals.", href: "#production", icon: Factory },
  { title: "Orders", meta: "Sales & purchase", detail: "Sales orders, purchase orders, pending quantities, and fulfillment state.", href: "#orders", icon: ReceiptText },
  { title: "Freight And Distribution Expenses", meta: "Expenses", detail: "Freight, delivery, distribution expenses, and comparison against sales.", href: "#freight", icon: Truck },
] as const;

const coverageRows = [
  { name: "Sales Data", route: "Sales Analysis", status: "Frontend ready" },
  { name: "Purchase Data", route: "Business Central", status: "Frontend ready" },
  { name: "All Stock", route: "Raw Materials / Finished Goods", status: "Frontend ready" },
  { name: "Production Entries", route: "Production", status: "Frontend ready" },
  { name: "Orders", route: "Orders", status: "Frontend ready" },
  { name: "Notifications", route: "Dashboard alerts", status: "Frontend ready" },
  { name: "Bank Balances", route: "Business Central", status: "Frontend ready" },
  { name: "Approval Requests", route: "Control panel", status: "Frontend ready" },
  { name: "Users", route: "Access panel", status: "Frontend ready" },
  { name: "Audit Logs", route: "Source / Self Analysis", status: "Frontend ready" },
  { name: "Rate Limits", route: "Connector health", status: "Frontend ready" },
] as const;

function NavTab({ item }: { item: (typeof navTabs)[number] }) {
  const Icon = item.icon;

  return (
    <a href={item.href} className={`ag-nav-tab ${"active" in item && item.active ? "ag-nav-tab-active" : ""}`}>
      <Icon className="size-5" aria-hidden="true" />
      {item.label}
    </a>
  );
}

function ExecutiveCard({ card }: { card: (typeof executiveCards)[number] }) {
  const Icon = card.icon;

  return (
    <article className={`erp-metric-card ${card.accent === "gold" ? "erp-metric-card-gold" : "erp-metric-card-blue"}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="max-w-72 text-sm font-black uppercase leading-6 tracking-[0.08em] text-[var(--text)]">{card.title}</p>
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--soft)] text-[var(--navy)]">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-7 text-3xl font-black tracking-tight text-[var(--navy)]">{card.value}</p>
      <p className="mt-4 text-sm leading-7 text-[var(--text)]">{card.detail}</p>
      <span className="mt-5 inline-flex rounded-full bg-[var(--badge)] px-4 py-2 text-xs font-black text-[var(--text)]">{card.source}</span>
    </article>
  );
}

export default function AGHealthDashboard() {
  const businessCentral = getBusinessCentralConfig();

  return (
    <main className="min-h-screen bg-[var(--canvas)] pb-12 text-[var(--ink)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/95 px-5 py-4 shadow-[0_8px_28px_rgba(31,48,74,0.05)] backdrop-blur">
        <div className="mx-auto flex max-w-[1740px] flex-col gap-4 xl:flex-row xl:items-center">
          <Link href="/" className="flex items-center gap-4 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)]">
            <span className="grid size-12 place-items-center rounded-2xl bg-[var(--navy)] text-white shadow-[0_10px_25px_rgba(31,63,103,0.22)]">
              <BarChart3 className="size-7" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xl font-black leading-tight">Factory Manager</span>
              <span className="block text-xs font-black uppercase tracking-[0.14em] text-[var(--gold)]">AG Health</span>
            </span>
          </Link>

          <nav className="flex min-w-0 flex-1 gap-2 overflow-x-auto xl:justify-center" aria-label="AG Health navigation">
            {navTabs.map((item) => (
              <NavTab key={item.label} item={item} />
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden rounded-2xl border border-[var(--border)] bg-[var(--cream)] px-5 py-3 text-sm font-black md:inline-flex">AG Health</span>
            <span className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 shadow-sm">
              <span className="grid size-10 place-items-center rounded-xl bg-[var(--gold)] text-white">
                <User className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-black">Mangal</span>
                <span className="block text-sm text-[var(--text-light)]">Administrator</span>
              </span>
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1740px] px-5 py-8">
        <section id="overview" className="grid gap-6 xl:grid-cols-[1fr_25rem]">
          <div className="rounded-[32px] border border-[var(--border)] bg-white/74 p-7 shadow-[var(--shadow)] lg:p-9">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">Executive Dashboard</p>
            <h1 className="mt-10 max-w-4xl bg-[linear-gradient(90deg,#213f67_0%,#6676f4_55%,#9b7cf5_100%)] bg-clip-text text-4xl font-black tracking-tight text-transparent lg:text-6xl">
              Live ERP executive dashboard
            </h1>
            <p className="mt-8 max-w-4xl text-lg leading-8 text-[var(--text)]">
              Truthful executive reporting first. This page is organized around overview, performance, operations, and data trust so the AG Health ERP story is easy to scan.
            </p>

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
              <div className="flex items-center justify-between rounded-2xl bg-[var(--soft)] px-4 py-3">
                <span className="font-black">ERP base URL</span>
                <span className="text-sm font-black text-[var(--navy)]">Configured</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[var(--soft)] px-4 py-3">
                <span className="font-black">Credentials</span>
                <span className="text-sm font-black text-[var(--navy)]">{businessCentral.hasCredentials ? "Local" : "Needed"}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[var(--soft)] px-4 py-3">
                <span className="font-black">Data service</span>
                <span className="text-sm font-black text-[var(--navy)]">{businessCentral.serviceBaseUrl ? "Ready" : "Needed"}</span>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-[var(--text)]">
              This panel shows the frontend connection state. Live values stay empty until the ERP API/OData endpoint is mapped.
            </p>
            <div className="mt-6 grid gap-3">
              <a href="#self-analysis" className="premium-btn premium-btn-gold">
                Open Source Audit
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a href="#business-central" className="premium-btn premium-btn-primary">
                Open Business Central
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a href="#freight" className="premium-btn premium-btn-outline">
                Open Freight Expenses
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a href="#reports" className="premium-btn premium-btn-gold">
                Download Reports
                <Download className="size-4" aria-hidden="true" />
              </a>
            </div>
          </aside>
        </section>

        <section className="mt-10">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Overview</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight">Executive Snapshot</h2>
          <p className="mt-4 max-w-5xl text-xl leading-9 text-[var(--text)]">
            The dashboard starts with the most important AG Health numbers first, followed by supporting context underneath.
          </p>
          <div className="mt-8 grid gap-6 xl:grid-cols-3">
            {executiveCards.map((card) => (
              <ExecutiveCard key={card.title} card={card} />
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickMetrics.map((metric) => (
              <article key={metric.label} className="snapshot-card">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">{metric.label}</p>
                <p className="mt-3 text-2xl font-black text-[var(--navy)]">{metric.value}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--text)]">{metric.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="sales-analysis" className="mt-12">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Performance</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight">Monthly Revenue and Trend Views</h2>
          <p className="mt-4 max-w-5xl text-xl leading-9 text-[var(--text)]">
            Charts are grouped here so revenue, purchases, production, and COGS can be compared without interrupting the rest of the page.
          </p>
          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <article className="analysis-panel">
              <h3 className="text-2xl font-black text-[var(--navy)]">Business Central Monthly Sales Revenue</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--text)]">Sales chart container prepared for live ERP invoices and credit memos.</p>
              <div className="mt-8 flex h-72 items-end gap-3 border-b border-l border-[var(--border)] px-4 pb-4">
                {[38, 48, 44, 62, 55, 78, 70, 88, 76, 92, 84, 96].map((height, index) => (
                  <span key={height + index} className="flex-1 rounded-t-xl bg-[var(--blue)]" style={{ height: `${height}%`, opacity: 0.36 + index * 0.04 }} />
                ))}
              </div>
            </article>
            <article className="analysis-panel">
              <h3 className="text-2xl font-black text-[var(--navy)]">Self Analysis</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--text)]">
                Frontend panel for AI/source-aware review: missing fields, unusual trends, margin pressure, and report confidence.
              </p>
              <div className="mt-6 grid gap-3">
                {["Sales trend confidence", "Purchase variance review", "Stock movement exceptions", "COGS and margin readiness"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--soft)] px-4 py-3">
                    <span className="font-black">{item}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[var(--text)]">Ready</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="business-central" className="mt-12">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Operations</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight">Dashboard Functions</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {moduleCards.map((module) => {
              const Icon = module.icon;

              return (
                <a key={module.title} href={module.href} className="module-card">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-12 place-items-center rounded-2xl bg-[var(--soft)] text-[var(--navy)]">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-[var(--badge)] px-3 py-1 text-xs font-black text-[var(--text)]">{module.meta}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-black text-[var(--ink)]">{module.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--text)]">{module.detail}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[var(--navy)]">
                    Open module
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        <section id="self-analysis" className="mt-12 grid gap-6 xl:grid-cols-[1fr_32rem]">
          <div className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Report Coverage</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight">Data Trust and Source Map</h2>
            <div className="mt-6 overflow-hidden rounded-3xl border border-[var(--border)]">
              {coverageRows.map((row) => (
                <div key={row.name} className="grid gap-3 border-b border-[var(--border)] bg-white px-5 py-4 last:border-b-0 md:grid-cols-[1fr_1fr_auto]">
                  <span className="font-black">{row.name}</span>
                  <span className="text-sm font-semibold text-[var(--text)]">{row.route}</span>
                  <span className="rounded-full bg-[var(--badge)] px-3 py-1 text-xs font-black text-[var(--navy)]">{row.status}</span>
                </div>
              ))}
            </div>
          </div>

          <aside id="reports" className="rounded-[28px] border border-[var(--border)] bg-[var(--navy)] p-6 text-white shadow-[var(--shadow)]">
            <FileSearch className="size-9 text-white/80" aria-hidden="true" />
            <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-white/55">Self Analysis</p>
            <h2 className="mt-3 text-2xl font-black">Ask before trusting a number</h2>
            <p className="mt-4 text-sm leading-7 text-white/70">
              This frontend keeps a visible audit area for source fields, mapped routes, missing data, and report confidence. When ERP endpoints are connected, this becomes the review layer before decisions.
            </p>
            <div className="mt-6 space-y-3">
              {["Source field check", "Gap review", "Anomaly scan", "Export-ready report"].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl bg-white/9 px-4 py-3 text-sm font-black">
                  <span>{item}</span>
                  <ClipboardCheck className="size-4 text-white/65" aria-hidden="true" />
                </div>
              ))}
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
