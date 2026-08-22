import Link from "next/link";
import type { Route as NextRoute } from "next";
import type { ReactNode } from "react";
import {
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
  WalletCards,
  type LucideIcon,
} from "lucide-react";

export const agHealthModules: { label: string; href: NextRoute; icon: LucideIcon; id: string }[] = [
  { label: "Inventory Report", href: "/ag-health/inventory-report", icon: Boxes, id: "inventory-report" },
  { label: "Packing Materials", href: "/ag-health/packing-materials", icon: PackageCheck, id: "packing-materials" },
  { label: "Production", href: "/ag-health/production", icon: Factory, id: "production" },
  { label: "Sales Analysis", href: "/ag-health/sales-analysis", icon: BarChart3, id: "sales-analysis" },
  { label: "Freight", href: "/ag-health/freight", icon: Truck, id: "freight" },
  { label: "Distributed Expense", href: "/ag-health/distributed-expense", icon: WalletCards, id: "distributed-expense" },
  { label: "Orders", href: "/ag-health/orders", icon: ClipboardCheck, id: "orders" },
];

export const dashboardIcons = {
  Boxes,
  PackageCheck,
  Factory,
  BarChart3,
  Truck,
  WalletCards,
  ClipboardCheck,
  Route: RouteIcon,
  ReceiptText,
};

function NavLink({ label, href, icon: Icon, active }: { label: string; href: NextRoute; icon: LucideIcon; active?: boolean }) {
  return (
    <Link href={href} className={`ag-nav-tab ${active ? "ag-nav-tab-active" : ""}`}>
      <Icon className="size-5" aria-hidden="true" />
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
          <nav className="flex min-w-0 flex-1 gap-2 overflow-x-auto xl:justify-center" aria-label="AG Health pages">
            <NavLink label="Dashboard" href="/ag-health" icon={Home} active={active === "dashboard"} />
            {agHealthModules.map((module) => <NavLink key={module.id} {...module} active={active === module.id} />)}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <span className="rounded-2xl border border-[var(--border)] bg-[var(--cream)] px-5 py-3 text-sm font-black">{connected ? "ERP Live" : "ERP Pending"}</span>
            <span className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 shadow-sm">
              <span className="grid size-10 place-items-center rounded-xl bg-[var(--gold)] text-white"><User className="size-5" aria-hidden="true" /></span>
              <span><span className="block font-black">AG Health</span><span className="block text-sm text-[var(--text-light)]">{company}</span></span>
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
    <article className="snapshot-card">
      <Icon className="size-6 text-[var(--navy)]" aria-hidden="true" />
      <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">{label}</p>
      <p className="mt-3 text-2xl font-black text-[var(--navy)]">{value}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--text)]">{note}</p>
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
    <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
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

export function BarChart({ title, bars, valueFormatter }: { title: string; bars: { label: string; amount: number; height: number }[]; valueFormatter: (value: number) => string }) {
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
