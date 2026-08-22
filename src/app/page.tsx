import {
  Banknote,
  BarChart3,
  Bell,
  Boxes,
  ClipboardCheck,
  Database,
  ExternalLink,
  Factory,
  Gauge,
  HomeIcon,
  KeyRound,
  Package,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  User,
  Users,
} from "lucide-react";

import { getBusinessCentralConfig } from "@/server/business-central/config";

const kpiCards = [
  {
    label: "Business Central Sales (12-month)",
    value: "NPR 552,264,700",
    description: "Rolling 12-month sales from the connected ERP sales feed.",
    accent: "blue",
    source: "SalesDashboard",
  },
  {
    label: "Business Central Receivables",
    value: "NPR 135,137,991",
    description: "Current customer receivables from the live customer trial balance.",
    accent: "blue",
    source: "ExcelTemplateTrialBalance",
  },
  {
    label: "Business Central Bank Balance",
    value: "NPR 797,787",
    description: "Current bank balance net of overdraft across mapped bank rows.",
    accent: "gold",
    source: "Bankacccard1",
  },
] as const;

const quickStats = [
  {
    label: "This month sales",
    value: "NPR 2,517,130",
    note: "Current visible month from the ERP sales window.",
  },
  {
    label: "12-month sales",
    value: "NPR 552,264,700",
    note: "Sum of the connected Business Central sales period.",
  },
  {
    label: "Raw material stock",
    value: "10,856,326.7135 kg",
    note: "Positive stock across mapped raw-material items.",
  },
  {
    label: "Latest gross margin",
    value: "41.6%",
    note: "From the latest confirmed trend month on this screen.",
  },
] as const;

const dataSources = [
  { label: "Raw Materials", icon: Package, status: "Mapped" },
  { label: "Finished Goods", icon: PackageCheck, status: "Mapped" },
  { label: "Production Entries", icon: Factory, status: "Queued" },
  { label: "Orders", icon: ShoppingCart, status: "Mapped" },
  { label: "Notifications", icon: Bell, status: "Queued" },
  { label: "Bank Balances", icon: Banknote, status: "Mapped" },
  { label: "Approval Requests", icon: ClipboardCheck, status: "Queued" },
  { label: "Users", icon: Users, status: "Queued" },
  { label: "Audit Logs", icon: ShieldCheck, status: "Queued" },
  { label: "Rate Limits", icon: Gauge, status: "Queued" },
] as const;

const navItems = [
  { label: "Dashboard", icon: HomeIcon, active: true },
  { label: "Business Central", icon: Database, active: false },
  { label: "Raw Materials", icon: Boxes, active: false },
  { label: "Packaging", icon: Package, active: false },
  { label: "Production", icon: Factory, active: false },
] as const;

function KpiCard({ card }: { card: (typeof kpiCards)[number] }) {
  return (
    <article className={`dashboard-card ${card.accent === "gold" ? "dashboard-card-gold" : "dashboard-card-blue"}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="max-w-[18rem] text-[13px] font-black uppercase leading-6 text-[var(--muted-strong)]">{card.label}</p>
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--icon-soft)] text-[var(--navy)]">
          <Database className="size-6" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-7 whitespace-nowrap text-[clamp(1.85rem,2.7vw,3.35rem)] font-black leading-none tracking-tight text-[var(--navy)]">{card.value}</p>
      <p className="mt-5 text-[15px] leading-7 text-[var(--muted)]">{card.description}</p>
      <span className="mt-5 inline-flex rounded-full bg-[var(--pill)] px-4 py-2 text-xs font-extrabold text-[var(--muted)]">{card.source}</span>
    </article>
  );
}

export default function Home() {
  const businessCentral = getBusinessCentralConfig();

  return (
    <main id="top" className="min-h-screen bg-[var(--canvas)] pb-36 text-[var(--navy)]">
      <section className="mx-auto w-full max-w-[1860px] px-5 py-12 sm:px-8 lg:px-10">
        <section>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--blue)]">Overview</p>
          <h2 className="mt-5 text-4xl font-black tracking-tight">Executive Snapshot</h2>
          <p className="mt-4 max-w-6xl text-xl leading-9 text-[var(--muted)]">
            The homepage starts with the most important ERP numbers first, followed by supporting context underneath.
          </p>

          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            <a
              href={businessCentral.webUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-4 rounded-[20px] border border-[var(--border)] bg-[var(--panel)] px-6 py-5 shadow-[var(--shadow-sm)]"
            >
              <span>
                <span className="block text-xs font-black uppercase tracking-[0.14em] text-[var(--muted-light)]">ERP web target</span>
                <span className="mt-2 block text-lg font-black">{businessCentral.company}</span>
              </span>
              <ExternalLink className="size-6 text-[var(--blue)]" aria-hidden="true" />
            </a>
            <div className="flex items-center justify-between gap-4 rounded-[20px] border border-[var(--border)] bg-[var(--panel)] px-6 py-5 shadow-[var(--shadow-sm)]">
              <span>
                <span className="block text-xs font-black uppercase tracking-[0.14em] text-[var(--muted-light)]">Credentials</span>
                <span className="mt-2 block text-lg font-black">{businessCentral.hasCredentials ? "Configured locally" : "Add to .env.local"}</span>
              </span>
              <KeyRound className="size-6 text-[var(--gold)]" aria-hidden="true" />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-[20px] border border-[var(--border)] bg-[var(--panel)] px-6 py-5 shadow-[var(--shadow-sm)]">
              <span>
                <span className="block text-xs font-black uppercase tracking-[0.14em] text-[var(--muted-light)]">Data service</span>
                <span className="mt-2 block text-lg font-black">{businessCentral.serviceBaseUrl ? "Ready to test" : "OData/API URL needed"}</span>
              </span>
              <Database className="size-6 text-[var(--navy)]" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-3">
            {kpiCards.map((card) => (
              <KpiCard key={card.label} card={card} />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 2xl:grid-cols-4">
          {quickStats.map((stat) => (
            <article key={stat.label} className="rounded-[22px] border border-[var(--border)] bg-[var(--panel)] px-7 py-6 shadow-[var(--shadow-sm)]">
              <p className="text-sm font-black uppercase tracking-[0.09em] text-[var(--muted-light)]">{stat.label}</p>
              <p className="mt-3 text-3xl font-black tracking-tight text-[var(--navy)]">{stat.value}</p>
              <p className="mt-3 text-lg leading-7 text-[var(--muted-strong)]">{stat.note}</p>
            </article>
          ))}
        </section>

        <section className="mt-12">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--blue)]">Performance</p>
          <h2 className="mt-5 text-4xl font-black tracking-tight">Monthly Revenue and Trend Views</h2>
          <p className="mt-4 max-w-6xl text-xl leading-9 text-[var(--muted)]">
            Charts are grouped together so revenue, purchases, production, and COGS can be compared without interrupting the executive summary.
          </p>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <article className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-7 shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--muted-light)]">Revenue movement</p>
                  <h3 className="mt-2 text-2xl font-black">12-month sales trend</h3>
                </div>
                <BarChart3 className="size-9 text-[var(--blue)]" aria-hidden="true" />
              </div>
              <div className="mt-8 flex h-72 items-end gap-3 border-b border-l border-[var(--border)] px-4 pb-4">
                {[42, 58, 48, 72, 64, 86, 75, 92, 81, 98, 88, 100].map((height, index) => (
                  <div key={height + index} className="flex flex-1 items-end">
                    <span className="w-full rounded-t-xl bg-[var(--blue)]" style={{ height: `${height}%`, opacity: 0.42 + index * 0.04 }} />
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-7 shadow-[var(--shadow-sm)]">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--muted-light)]">ERP data map</p>
              <h3 className="mt-2 text-2xl font-black">Required sources</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {dataSources.slice(0, 6).map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--soft)] px-4 py-3">
                      <span className="flex items-center gap-3 text-sm font-black">
                        <Icon className="size-5 text-[var(--navy)]" aria-hidden="true" />
                        {item.label}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[var(--muted)]">{item.status}</span>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {dataSources.slice(6).map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.label} className="rounded-[22px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[var(--shadow-sm)]">
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[var(--icon-soft)]">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-[var(--pill)] px-3 py-1 text-xs font-black text-[var(--muted)]">{item.status}</span>
                </div>
                <h3 className="mt-5 text-xl font-black">{item.label}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Prepared for live ERP access, secure sync, and role-based visibility.</p>
              </article>
            );
          })}
        </section>
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-white/96 px-5 py-4 shadow-[0_-12px_35px_rgba(23,38,58,0.1)] backdrop-blur" aria-label="Workspace navigation">
        <div className="mx-auto flex max-w-[1860px] items-center gap-5 overflow-x-auto">
          <a href="#top" className="flex shrink-0 items-center gap-4 pr-4">
            <span className="grid size-16 place-items-center rounded-2xl bg-[var(--navy)] text-white shadow-[0_12px_28px_rgba(31,66,109,0.24)]">
              <BarChart3 className="size-8" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xl font-black">Factory Manager</span>
              <span className="block text-sm font-black uppercase tracking-[0.1em] text-[var(--gold)]">AG Health</span>
            </span>
          </a>

          <div className="flex shrink-0 items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href="#"
                  className={`inline-flex min-h-14 items-center gap-3 rounded-2xl px-5 text-base font-black transition ${
                    item.active ? "bg-[var(--navy)] text-white shadow-[0_10px_24px_rgba(31,66,109,0.22)]" : "text-[var(--muted-strong)] hover:bg-[var(--soft)]"
                  }`}
                >
                  <Icon className="size-6" aria-hidden="true" />
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-5">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--cream)] px-6 py-3">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--muted-light)]">Project</p>
              <div className="mt-2 flex gap-2">
                <span className="rounded-full bg-[var(--navy)] px-5 py-2 text-sm font-black text-white">AG Health</span>
                <span className="rounded-full border border-[var(--border)] bg-white px-5 py-2 text-sm font-black text-[var(--muted-strong)]">Parvati Agro</span>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-5 py-3">
              <span className="grid size-12 place-items-center rounded-xl bg-[var(--gold)] text-white">
                <User className="size-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-lg font-black">Mangal</span>
                <span className="block text-sm font-semibold text-[var(--muted-light)]">Administrator</span>
              </span>
            </div>
          </div>
        </div>
      </nav>
    </main>
  );
}
