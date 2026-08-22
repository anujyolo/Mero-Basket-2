import Link from "next/link";
import type { Route as NextRoute } from "next";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Banknote,
  BarChart3,
  Boxes,
  ClipboardCheck,
  Factory,
  Home,
  PackageCheck,
  ReceiptText,
  Route as RouteIcon,
  Truck,
  User,
  type LucideIcon,
} from "lucide-react";

export const agHealthModules: { label: string; href: NextRoute; icon: LucideIcon; id: string }[] = [
  { label: "Inventory Report", href: "/ag-health/inventory-report", icon: Boxes, id: "inventory-report" },
  { label: "Packing Materials", href: "/ag-health/packing-materials", icon: PackageCheck, id: "packing-materials" },
  { label: "Production", href: "/ag-health/production", icon: Factory, id: "production" },
  { label: "Sales Analysis", href: "/ag-health/sales-analysis", icon: BarChart3, id: "sales-analysis" },
  { label: "Freight", href: "/ag-health/freight", icon: Truck, id: "freight" },
  { label: "Orders", href: "/ag-health/orders", icon: ClipboardCheck, id: "orders" },
];

export const dashboardIcons = {
  Boxes,
  PackageCheck,
  Factory,
  BarChart3,
  Truck,
  ClipboardCheck,
  Banknote,
  Route: RouteIcon,
  ReceiptText,
};

function NavLink({ label, href, icon: Icon, active }: { label: string; href: NextRoute; icon: LucideIcon; active?: boolean }) {
  return (
    <Link href={href} className={`ag-nav-tab ${active ? "ag-nav-tab-active" : ""}`}>
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </Link>
  );
}

export function AGHealthShell({
  active,
  company,
  connected,
  children,
}: {
  active: string;
  company: string;
  connected: boolean;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[var(--canvas)] pb-12 text-[var(--ink)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/95 px-5 py-3 shadow-[0_8px_28px_rgba(31,48,74,0.05)] backdrop-blur">
        <div className="mx-auto flex max-w-[1740px] flex-col gap-3 xl:flex-row xl:items-center">
          <Link href="/" className="flex items-center gap-4 rounded-2xl">
            <span className="grid size-10 place-items-center rounded-2xl bg-[var(--navy)] text-white shadow-[0_10px_25px_rgba(31,63,103,0.22)]">
              <BarChart3 className="size-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-black leading-tight">Factory Manager</span>
              <span className="block text-xs font-black uppercase tracking-[0.14em] text-[var(--gold)]">AG Health</span>
            </span>
          </Link>
          <nav className="flex min-w-0 flex-1 gap-2 overflow-x-auto xl:justify-center" aria-label="AG Health pages">
            <NavLink label="Dashboard" href="/ag-health" icon={Home} active={active === "dashboard"} />
            {agHealthModules.map((module) => <NavLink key={module.id} {...module} active={active === module.id} />)}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <span className="rounded-2xl border border-[var(--border)] bg-[var(--cream)] px-4 py-2 text-xs font-black">{connected ? "ERP Live" : "ERP Pending"}</span>
            <span className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-3 py-2 shadow-sm">
              <span className="grid size-9 place-items-center rounded-xl bg-[var(--gold)] text-white"><User className="size-4" aria-hidden="true" /></span>
              <span><span className="block text-sm font-black">AG Health</span><span className="block max-w-32 truncate text-xs text-[var(--text-light)]">{company}</span></span>
            </span>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-[1740px] px-5 py-8">{children}</section>
    </main>
  );
}

export function MetricCard({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: LucideIcon }) {
  return (
    <article className="kpi-card info">
      <div className="kpi-header">
        <h3 className="kpi-title">{label}</h3>
        <span className="kpi-icon"><Icon className="size-5" aria-hidden="true" /></span>
      </div>
      <p className="kpi-value text-2xl">{value}</p>
      <p className="kpi-subtitle">{note}</p>
    </article>
  );
}

export function HeroPanel({
  eyebrow,
  title,
  description,
  stats,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  stats: { label: string; value: string; note: string; icon: LucideIcon }[];
  actions?: { label: string; href: NextRoute }[];
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_25rem]">
      <div className="rounded-[32px] border border-[var(--border)] bg-white/74 p-7 shadow-[var(--shadow)] lg:p-9">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--gold)]">{eyebrow}</p>
        <h1 className="mt-8 max-w-5xl text-4xl font-black tracking-tight text-[var(--ink)] lg:text-6xl">{title}</h1>
        <p className="mt-6 max-w-5xl text-lg leading-8 text-[var(--text)]">{description}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {stats.map((stat) => <MetricCard key={stat.label} {...stat} />)}
        </div>
      </div>
      <aside className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--text-light)]">Quick Actions</p>
        <div className="mt-5 grid gap-3">
          {(actions || agHealthModules.slice(0, 5)).map((action, index) => (
            <Link key={action.label} href={action.href} className={`premium-btn ${index === 0 ? "premium-btn-primary" : index === 1 ? "premium-btn-outline" : "premium-btn-gold"}`}>
              {action.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          ))}
        </div>
        <p className="mt-6 text-sm leading-6 text-[var(--text)]">The layout mirrors the reference dashboard pattern: major numbers first, drilldown buttons beside them, and supporting charts/tables below.</p>
      </aside>
    </section>
  );
}

export function ExecutiveKpiCard({
  title,
  value,
  detail,
  source,
  accent = "blue",
  icon: Icon,
}: {
  title: string;
  value: string;
  detail: string;
  source: string;
  accent?: "blue" | "gold";
  icon: LucideIcon;
}) {
  return (
    <article className={`erp-metric-card ${accent === "gold" ? "erp-metric-card-gold" : "erp-metric-card-blue"}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="max-w-72 text-sm font-black uppercase leading-6 tracking-[0.08em] text-[var(--text)]">{title}</p>
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--soft)] text-[var(--navy)]">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-7 text-[clamp(2rem,3vw,3.3rem)] font-black tracking-tight text-[var(--navy)]">{value}</p>
      <p className="mt-4 text-sm leading-7 text-[var(--text)]">{detail}</p>
      <span className="mt-5 inline-flex rounded-full bg-[var(--badge)] px-4 py-2 text-xs font-black text-[var(--text)]">{source}</span>
    </article>
  );
}

export function SectionHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">{eyebrow}</p>
      <h1 className="mt-4 text-4xl font-black tracking-tight lg:text-5xl">{title}</h1>
      <p className="mt-4 max-w-5xl text-lg leading-8 text-[var(--text)]">{children}</p>
    </div>
  );
}

export function DataTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)] bg-white shadow-sm">
      <table className="min-w-full border-collapse bg-white text-left text-sm">
        <thead className="bg-[var(--soft)] text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">
          <tr>
            {headers.map((header) => <th key={header} className="whitespace-nowrap px-4 py-3">{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td className="px-4 py-5 font-semibold text-[var(--text)]" colSpan={headers.length}>No live rows mapped yet.</td></tr>
          ) : rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`} className="border-t border-[var(--border)]">
              {row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`} className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--ink)]">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BarChart({
  title,
  bars,
  valueFormatter,
  axisFormatter,
  note,
}: {
  title: string;
  bars: { label: string; amount: number; height: number }[];
  valueFormatter: (value: number) => string;
  axisFormatter?: (value: number) => string;
  note?: string;
}) {
  const max = Math.max(...bars.map((bar) => bar.amount), 0);
  const ticks = [max, max * 0.75, max * 0.5, max * 0.25, 0];
  const formatAxis = axisFormatter || valueFormatter;

  return (
    <article className="chart-container">
      <div className="chart-header flex-col sm:flex-row">
        <div>
          <h3 className="chart-title">{title}</h3>
          {note ? <p className="chart-subtitle max-w-3xl">{note}</p> : null}
        </div>
        <span className="rounded-full bg-[var(--soft)] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[var(--text)]">
          {bars.length.toLocaleString("en-US")} points
        </span>
      </div>
      {bars.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-[var(--border-strong)] bg-[var(--soft)] p-8 text-center text-sm font-black text-[var(--text)]">
          No live chart rows mapped yet.
        </div>
      ) : (
        <div className="mt-6 rounded-[28px] bg-[var(--soft)] p-4">
          <div className="grid grid-cols-[5.8rem_minmax(0,1fr)] gap-4">
            <div className="flex h-64 flex-col justify-between pb-10 text-right text-[11px] font-black leading-tight text-[var(--text-light)]">
              {ticks.map((tick, index) => <span key={`${tick}-${index}`}>{formatAxis(tick)}</span>)}
            </div>
            <div className="min-w-0 overflow-x-auto">
              <div className="flex h-64 min-w-[38rem] items-end gap-3 border-b border-l border-[var(--border-strong)] px-4 pb-4">
                {bars.map((bar) => (
                  <div key={bar.label} className="flex min-w-12 flex-1 flex-col items-center justify-end gap-2">
                    <span
                      className="w-full rounded-t-xl bg-gradient-to-t from-[var(--navy)] to-[var(--blue)] shadow-[0_10px_22px_rgba(33,63,103,0.2)]"
                      title={`${bar.label}: ${valueFormatter(bar.amount)}`}
                      style={{ height: `${Math.min(96, Math.max(bar.amount > 0 ? 6 : 0, bar.height))}%` }}
                    />
                    <span className="max-w-20 truncate text-xs font-black text-[var(--text-light)]" title={bar.label}>{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export function ComboBarChart({
  title,
  bars,
}: {
  title: string;
  bars: { label: string; production: number; purchases: number; revenue: number }[];
}) {
  return (
    <article className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="mt-5 flex flex-wrap gap-4 text-sm font-black">
        <span className="text-emerald-600">Production Output</span>
        <span className="text-[var(--gold)]">Purchases</span>
        <span className="text-[var(--navy)]">Revenue</span>
      </div>
      <div className="mt-8 flex h-72 items-end gap-3 border-b border-l border-[var(--border-strong)] px-4 pb-4">
        {bars.map((bar) => (
          <div key={bar.label} className="flex flex-1 flex-col items-center justify-end gap-2">
            <span className="flex h-full w-full items-end justify-center gap-1">
              <span className="w-2 rounded-t bg-emerald-500" style={{ height: `${bar.production}%` }} />
              <span className="w-2 rounded-t bg-[var(--gold)]" style={{ height: `${bar.purchases}%` }} />
              <span className="w-2 rounded-t bg-[var(--navy)]" style={{ height: `${bar.revenue}%` }} />
            </span>
            <span className="text-xs font-semibold text-[var(--text-light)] [writing-mode:vertical-rl] sm:[writing-mode:horizontal-tb]">{bar.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export function PieChartCard({
  title,
  slices,
  valueFormatter,
}: {
  title: string;
  slices: { label: string; value: number; color: string }[];
  valueFormatter: (value: number) => string;
}) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  let cursor = 0;
  const gradient = total > 0
    ? slices
      .map((slice) => {
        const start = cursor;
        const size = (slice.value / total) * 100;
        cursor += size;
        return `${slice.color} ${start}% ${cursor}%`;
      })
      .join(", ")
    : "#e1e7ef 0% 100%";

  return (
    <article className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="mt-8 grid gap-8 md:grid-cols-[16rem_1fr] md:items-center">
        <div className="relative mx-auto grid size-56 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--border)]" style={{ background: `conic-gradient(${gradient})` }}>
          <div className="grid size-28 place-items-center rounded-full bg-white text-center shadow-[var(--shadow-soft)]">
            <span className="px-3 text-sm font-black text-[var(--navy)]">{valueFormatter(total)}</span>
          </div>
        </div>
        <div className="grid gap-3">
          {slices.length === 0 ? (
            <p className="rounded-2xl bg-[var(--soft)] px-4 py-3 text-sm font-semibold text-[var(--text)]">No live chart rows mapped yet.</p>
          ) : slices.map((slice) => (
            <div key={slice.label} className="flex items-center justify-between gap-4 rounded-2xl bg-[var(--soft)] px-4 py-3">
              <span className="flex items-center gap-3 text-sm font-black text-[var(--ink)]">
                <span className="size-3 rounded-full" style={{ background: slice.color }} />
                {slice.label}
              </span>
              <span className="text-sm font-black text-[var(--navy)]">{valueFormatter(slice.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
