import {
  Activity,
  ArrowUpRight,
  Banknote,
  Bell,
  ClipboardCheck,
  Factory,
  Gauge,
  LayoutDashboard,
  LineChart,
  Lock,
  Package,
  PackageCheck,
  ReceiptText,
  RefreshCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
  UserCheck,
  Users,
} from "lucide-react";

const requiredData = [
  { label: "Raw Materials", icon: Package, owner: "Inventory" },
  { label: "Finished Goods", icon: PackageCheck, owner: "Inventory" },
  { label: "Production Entries", icon: Factory, owner: "Production" },
  { label: "Orders", icon: ShoppingCart, owner: "Sales" },
  { label: "Notifications", icon: Bell, owner: "Alerts" },
  { label: "Bank Balances", icon: Banknote, owner: "Finance" },
  { label: "Approval Requests", icon: ClipboardCheck, owner: "Control" },
  { label: "Users", icon: Users, owner: "Access" },
  { label: "Audit Logs", icon: ShieldCheck, owner: "Security" },
  { label: "Rate Limits", icon: Gauge, owner: "System" },
] as const;

const executiveCards = [
  {
    title: "Sales completed",
    description: "Total order value, quantity sold, daily trend, and branch split.",
    icon: LineChart,
  },
  {
    title: "Receivers",
    description: "Customer or receiver count, active accounts, and delivery coverage.",
    icon: Truck,
  },
  {
    title: "Approval queue",
    description: "Pending owner approvals, requested access, and blocked actions.",
    icon: UserCheck,
  },
  {
    title: "Live ERP sync",
    description: "Connection health, last refresh time, and failed sync warnings.",
    icon: RefreshCcw,
  },
] as const;

const navItems = [
  "Dashboard",
  "Sales",
  "Receivers",
  "Inventory",
  "Production",
  "Orders",
  "Finance",
  "Approvals",
  "Reports",
  "Settings",
] as const;

function ConnectionBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-[var(--warning-border)] bg-[var(--warning-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--warning)]">
      <span className="size-2 rounded-full bg-[var(--warning)]" />
      ERP connection needed
    </span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-[var(--border)] bg-[var(--panel)] px-4 py-5 lg:block">
          <a href="#dashboard" className="flex items-center gap-3 rounded-md px-2 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]">
            <span className="grid size-10 place-items-center rounded-lg bg-[var(--green)] text-sm font-bold text-white">MB</span>
            <span>
              <span className="block text-sm font-bold">Mero Basket</span>
              <span className="block text-[11px] font-semibold uppercase text-[var(--muted)]">ERP Control</span>
            </span>
          </a>

          <nav className="mt-8 space-y-1" aria-label="Main navigation">
            {navItems.map((item, index) => (
              <a
                key={item}
                href={index === 0 ? "#dashboard" : "#erp-data"}
                className={`flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${
                  index === 0 ? "bg-[var(--green-soft)] text-[var(--green)]" : "text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--ink)]"
                }`}
              >
                {index === 0 ? <LayoutDashboard className="size-4" aria-hidden="true" /> : <span className="size-1.5 rounded-full bg-current opacity-50" />}
                {item}
              </a>
            ))}
          </nav>

          <div className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--soft)] p-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Lock className="size-4 text-[var(--green)]" aria-hidden="true" />
              Secure build
            </div>
            <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
              Real ERP data will stay behind protected access and audited server-side requests.
            </p>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(246,247,243,0.9)] px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-[var(--muted)]">Hackathon 2.0 clean rebuild</p>
                <h1 id="dashboard" className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                  ERP executive dashboard
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ConnectionBadge />
                <a
                  href="/api/health"
                  className="inline-flex min-h-9 items-center gap-2 rounded-md border border-[var(--border-strong)] bg-white px-3 text-sm font-semibold hover:border-[var(--green)] hover:text-[var(--green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
                >
                  <Activity className="size-4" aria-hidden="true" />
                  System status
                </a>
              </div>
            </div>
          </header>

          <div className="px-4 py-5 sm:px-6 lg:px-8">
            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-sm font-bold text-[var(--green)]">Premium operations view</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                      Sales, receivers, inventory, production, finance, and approvals in one place.
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                      This dashboard is ready for your ERP details. Once connected, these panels will show live values, trends, and alerts from the data sources you listed.
                    </p>
                  </div>
                  <button className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-[var(--green)] px-4 text-sm font-bold text-white hover:bg-[var(--green-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2">
                    <RefreshCcw className="size-4" aria-hidden="true" />
                    Connect ERP
                  </button>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {executiveCards.map((card) => {
                    const Icon = card.icon;

                    return (
                      <article key={card.title} className="rounded-lg border border-[var(--border)] bg-[var(--soft)] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <span className="grid size-9 place-items-center rounded-md bg-white text-[var(--green)]">
                            <Icon className="size-4" aria-hidden="true" />
                          </span>
                          <span className="rounded-md bg-[var(--warning-soft)] px-2 py-1 text-[10px] font-bold uppercase text-[var(--warning)]">
                            Waiting
                          </span>
                        </div>
                        <h3 className="mt-4 text-sm font-bold">{card.title}</h3>
                        <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{card.description}</p>
                      </article>
                    );
                  })}
                </div>
              </div>

              <aside className="rounded-lg border border-[var(--border)] bg-[var(--ink)] p-5 text-white shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-white/50">Connection status</p>
                    <h2 className="mt-1 text-xl font-semibold">ERP not linked yet</h2>
                  </div>
                  <span className="grid size-10 place-items-center rounded-md bg-white/10">
                    <RefreshCcw className="size-5" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/62">
                  Send the ERP name, login method, API docs or database details, and sample fields. I will wire the live connector into this dashboard.
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-md bg-white/8 p-3">
                    <dt className="text-xs text-white/45">Live data</dt>
                    <dd className="mt-1 font-bold">Not connected</dd>
                  </div>
                  <div className="rounded-md bg-white/8 p-3">
                    <dt className="text-xs text-white/45">Refresh</dt>
                    <dd className="mt-1 font-bold">Manual setup</dd>
                  </div>
                  <div className="rounded-md bg-white/8 p-3">
                    <dt className="text-xs text-white/45">Auth</dt>
                    <dd className="mt-1 font-bold">Next phase</dd>
                  </div>
                  <div className="rounded-md bg-white/8 p-3">
                    <dt className="text-xs text-white/45">Reports</dt>
                    <dd className="mt-1 font-bold">Queued</dd>
                  </div>
                </dl>
              </aside>
            </section>

            <section id="erp-data" className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-[var(--green)]">ERP data map</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight">Data required for the first live dashboard</h2>
                </div>
                <span className="text-xs font-semibold text-[var(--muted)]">10 source areas identified</span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {requiredData.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article key={item.label} className="rounded-lg border border-[var(--border)] bg-[var(--soft)] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="grid size-9 place-items-center rounded-md bg-white text-[var(--green)]">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="text-[11px] font-bold uppercase text-[var(--muted)]">{item.owner}</span>
                      </div>
                      <h3 className="mt-4 text-sm font-bold">{item.label}</h3>
                      <p className="mt-2 text-xs leading-5 text-[var(--muted)]">Ready to connect from ERP once credentials and field names are provided.</p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="mt-5 grid gap-4 lg:grid-cols-3">
              <article className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-5 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[var(--green)]">Sales analysis</p>
                    <h2 className="mt-1 text-xl font-semibold">Trend view pending ERP data</h2>
                  </div>
                  <ArrowUpRight className="size-5 text-[var(--muted)]" aria-hidden="true" />
                </div>
                <div className="mt-6 h-56 rounded-lg border border-dashed border-[var(--border-strong)] bg-[linear-gradient(180deg,#ffffff_0%,#f4f7f3_100%)] p-4">
                  <div className="grid h-full place-items-center text-center">
                    <div>
                      <ReceiptText className="mx-auto size-8 text-[var(--green)]" aria-hidden="true" />
                      <p className="mt-3 text-sm font-bold">Waiting for sales orders and receiver records</p>
                      <p className="mt-2 max-w-md text-xs leading-5 text-[var(--muted)]">
                        When connected, this area will show sales volume, revenue, order count, top receivers, and period comparison.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              <article className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-5 shadow-sm">
                <p className="text-sm font-bold text-[var(--green)]">Next build step</p>
                <h2 className="mt-1 text-xl font-semibold">Connect real access</h2>
                <ol className="mt-5 space-y-3 text-sm text-[var(--muted)]">
                  <li className="flex gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-[var(--green-soft)] text-xs font-bold text-[var(--green)]">1</span>
                    Provide ERP system name and how it exposes data.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-[var(--green-soft)] text-xs font-bold text-[var(--green)]">2</span>
                    Add protected credentials in local environment settings.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-[var(--green-soft)] text-xs font-bold text-[var(--green)]">3</span>
                    Map ERP fields into dashboard cards and reports.
                  </li>
                </ol>
              </article>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
