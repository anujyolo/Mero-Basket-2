import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  BarChart3,
  Bell,
  Boxes,
  ClipboardCheck,
  Database,
  Factory,
  Gauge,
  Package,
  PackageCheck,
  ReceiptText,
  RefreshCcw,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

import { getBusinessCentralConfig } from "@/server/business-central/config";

const executiveMetrics = [
  {
    title: "Sales data",
    value: "Awaiting ERP sync",
    detail: "Invoices, credit memos, customer sales, item sales, monthly trend, and revenue comparison.",
    icon: BarChart3,
    accent: "blue",
  },
  {
    title: "Purchase data",
    value: "Awaiting ERP sync",
    detail: "Purchase invoices, vendor totals, landed cost, item purchases, and buying trend.",
    icon: ShoppingCart,
    accent: "blue",
  },
  {
    title: "All stock",
    value: "Awaiting ERP sync",
    detail: "Raw material stock, finished goods, packaging, item ledger quantity, and current availability.",
    icon: Boxes,
    accent: "gold",
  },
] as const;

const operationalModules = [
  { title: "Raw Materials", detail: "Material balances, item cards, stock movement, unit costs, and low-stock flags.", icon: Package, group: "Inventory" },
  { title: "Finished Goods", detail: "Finished item availability, quantities, value, and shipment readiness.", icon: PackageCheck, group: "Inventory" },
  { title: "Production Entries", detail: "Production output, consumption entries, batches, yield, and waste signals.", icon: Factory, group: "Production" },
  { title: "Orders", detail: "Sales orders, purchase orders, open orders, fulfillment, and pending quantities.", icon: ReceiptText, group: "Sales" },
  { title: "Notifications", detail: "ERP alerts, sync warnings, approval reminders, and operational exceptions.", icon: Bell, group: "Alerts" },
  { title: "Bank Balances", detail: "Bank accounts, available balance, overdraft separation, and cash position.", icon: Banknote, group: "Finance" },
  { title: "Approval Requests", detail: "Pending requests, requester, amount, approval level, and owner decision state.", icon: ClipboardCheck, group: "Control" },
  { title: "Users", detail: "ERP users, roles, permissions, active status, and access review.", icon: Users, group: "Access" },
  { title: "Audit Logs", detail: "Sensitive changes, login trail, record edits, and exported report activity.", icon: ShieldCheck, group: "Security" },
  { title: "Rate Limits", detail: "API health, throttling, retries, sync schedule, and failed connector calls.", icon: Gauge, group: "System" },
] as const;

const trendRows = [
  "Sales by month",
  "Purchases by vendor",
  "Stock value by item group",
  "Production output by batch",
  "Bank movement",
] as const;

function MetricCard({ metric }: { metric: (typeof executiveMetrics)[number] }) {
  const Icon = metric.icon;

  return (
    <article className={`erp-metric-card ${metric.accent === "gold" ? "erp-metric-card-gold" : "erp-metric-card-blue"}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="max-w-60 text-sm font-black uppercase leading-6 tracking-[0.08em] text-[var(--text)]">{metric.title}</p>
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--soft)] text-[var(--navy)]">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-7 text-3xl font-black tracking-tight text-[var(--navy)]">{metric.value}</p>
      <p className="mt-4 text-sm leading-7 text-[var(--text)]">{metric.detail}</p>
    </article>
  );
}

export default function AGHealthDashboard() {
  const businessCentral = getBusinessCentralConfig();

  return (
    <main className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/95 px-5 py-4 shadow-[0_8px_28px_rgba(31,48,74,0.05)] backdrop-blur">
        <div className="mx-auto flex max-w-[1640px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="grid size-11 place-items-center rounded-2xl border border-[var(--border)] bg-white text-[var(--navy)] shadow-sm" aria-label="Back to project hub">
              <ArrowLeft className="size-5" aria-hidden="true" />
            </Link>
            <span className="grid size-12 place-items-center rounded-2xl bg-[var(--navy)] text-white shadow-[0_10px_25px_rgba(31,63,103,0.22)]">
              <Factory className="size-7" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--gold)]">AG Health</p>
              <h1 className="text-2xl font-black tracking-tight">Complete ERP Dashboard</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-[var(--badge)] px-4 py-2 text-sm font-black text-[var(--navy)]">{businessCentral.company}</span>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[var(--text)] shadow-sm">
              {businessCentral.serviceBaseUrl ? "Data service ready" : "OData/API URL needed"}
            </span>
            <a href="/api/erp/status" className="inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-4 py-2 text-sm font-black text-white">
              <RefreshCcw className="size-4" aria-hidden="true" />
              ERP status
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1640px] px-5 py-8">
        <section className="rounded-[32px] border border-[var(--border)] bg-white/72 p-6 shadow-[var(--shadow)] lg:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--blue)]">Overview</p>
              <h2 className="mt-4 max-w-5xl bg-[linear-gradient(90deg,#213f67_0%,#4168e8_45%,#8f72ee_100%)] bg-clip-text text-4xl font-black tracking-tight text-transparent lg:text-5xl">
                AG Health live data command center
              </h2>
              <p className="mt-5 max-w-5xl text-lg leading-8 text-[var(--text)]">
                This is the dashboard that opens from the AG Health project. Every panel is prepared for Business Central data, without using fake numbers before the ERP data service is mapped.
              </p>
            </div>
            <div className="grid gap-3 rounded-3xl border border-[var(--border)] bg-[var(--cream)] p-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white px-5 py-4">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">Credentials</p>
                <p className="mt-2 font-black">{businessCentral.hasCredentials ? "Configured locally" : "Add to .env.local"}</p>
              </div>
              <div className="rounded-2xl bg-white px-5 py-4">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">Live sync</p>
                <p className="mt-2 font-black">{businessCentral.serviceBaseUrl ? "Ready to test" : "Waiting for endpoint"}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-3">
            {executiveMetrics.map((metric) => (
              <MetricCard key={metric.title} metric={metric} />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_26rem]">
          <div className="rounded-[28px] border border-[var(--border)] bg-white/82 p-6 shadow-[var(--shadow-soft)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--text-light)]">ERP data modules</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--navy)]">Everything AG Health needs</h2>
              </div>
              <span className="rounded-full bg-[var(--badge)] px-4 py-2 text-sm font-black text-[var(--navy)]">10 groups mapped</span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {operationalModules.map((module) => {
                const Icon = module.icon;

                return (
                  <article key={module.title} className="data-card">
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid size-11 place-items-center rounded-2xl bg-white text-[var(--navy)] shadow-sm">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="rounded-full bg-[var(--badge)] px-3 py-1 text-xs font-black text-[var(--text)]">{module.group}</span>
                    </div>
                    <h3 className="mt-5 text-xl font-black text-[var(--ink)]">{module.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--text)]">{module.detail}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="rounded-[28px] border border-[var(--border)] bg-[var(--navy)] p-6 text-white shadow-[var(--shadow)]">
            <Database className="size-9 text-white/80" aria-hidden="true" />
            <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-white/55">Live data status</p>
            <h2 className="mt-3 text-2xl font-black">ERP location is reachable</h2>
            <p className="mt-4 text-sm leading-7 text-white/70">
              The AG Health Business Central web address is configured. To extract sales, purchases, stock, production, bank, and audit data, the app still needs the published OData/API service URL.
            </p>
            <div className="mt-6 space-y-3">
              {trendRows.map((row) => (
                <div key={row} className="flex items-center justify-between rounded-2xl bg-white/9 px-4 py-3 text-sm font-black">
                  <span>{row}</span>
                  <TrendingUp className="size-4 text-white/65" aria-hidden="true" />
                </div>
              ))}
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
