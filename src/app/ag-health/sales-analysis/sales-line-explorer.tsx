"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import type { SalesLineAnalysisRow } from "@/server/business-central/data";

function npr(value: number) {
  return `NPR ${Math.round(value).toLocaleString("en-US")}`;
}

function qty(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

export function SalesLineExplorer({ rows, sourceNote }: { rows: SalesLineAnalysisRow[]; sourceNote: string }) {
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState("All");
  const [customer, setCustomer] = useState("All");
  const [status, setStatus] = useState("All");

  const months = useMemo(() => ["All", ...Array.from(new Set(rows.map((row) => row.month))).filter(Boolean).sort().reverse()], [rows]);
  const customers = useMemo(() => ["All", ...Array.from(new Set(rows.map((row) => row.customer))).filter(Boolean).sort()], [rows]);
  const statuses = useMemo(() => ["All", ...Array.from(new Set(rows.map((row) => row.orderStatus))).filter(Boolean).sort()], [rows]);
  const filteredRows = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesMonth = month === "All" || row.month === month;
      const matchesCustomer = customer === "All" || row.customer === customer || row.place === customer;
      const matchesStatus = status === "All" || row.orderStatus === status;
      const searchable = [
        row.product,
        row.orderNumber,
        row.customer,
        row.place,
        row.month,
        row.orderStatus,
        row.deliveryStatus,
      ].join(" ").toLowerCase();

      return matchesMonth && matchesCustomer && matchesStatus && (!cleanQuery || searchable.includes(cleanQuery));
    });
  }, [customer, month, query, rows, status]);
  const totalQty = filteredRows.reduce((sum, row) => sum + row.quantity, 0);
  const totalAmount = filteredRows.reduce((sum, row) => sum + row.amount, 0);
  const byProduct = new Map<string, { product: string; quantity: number; amount: number }>();

  for (const row of filteredRows) {
    const current = byProduct.get(row.product) || { product: row.product, quantity: 0, amount: 0 };
    current.quantity += row.quantity;
    current.amount += row.amount;
    byProduct.set(row.product, current);
  }

  const topProducts = [...byProduct.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 8);

  return (
    <article className="analysis-panel">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Product Sales Explorer</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Find product sales by month, customer, and product</h2>
          <p className="mt-3 max-w-5xl text-sm font-semibold leading-6 text-[var(--text)]">
            Example: type <span className="font-black text-[var(--navy)]">M5</span> and choose a month to see only matching product rows.
          </p>
        </div>
        <div className="grid gap-2 rounded-3xl border border-[var(--border)] bg-[var(--soft)] px-5 py-4 text-sm font-black text-[var(--navy)] sm:min-w-72">
          <span>{filteredRows.length.toLocaleString("en-US")} sales lines visible</span>
          <span>{qty(totalQty)} qty · {npr(totalAmount)}</span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm font-semibold leading-6 text-blue-950">
        {sourceNote}
      </div>

      <div className="mt-6 grid gap-3 xl:grid-cols-[1fr_12rem_16rem_12rem]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--text-light)]" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search product like M5, diaper, customer, order number..."
            className="h-14 w-full rounded-2xl border border-[var(--border)] bg-white pl-12 pr-4 text-sm font-bold text-[var(--ink)] shadow-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          />
        </label>
        <select value={month} onChange={(event) => setMonth(event.target.value)} className="h-14 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-black text-[var(--ink)] shadow-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100">
          {months.map((option) => <option key={option}>{option}</option>)}
        </select>
        <select value={customer} onChange={(event) => setCustomer(event.target.value)} className="h-14 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-black text-[var(--ink)] shadow-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100">
          {customers.map((option) => <option key={option}>{option}</option>)}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-14 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-black text-[var(--ink)] shadow-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100">
          {statuses.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--soft)] p-5">
          <h3 className="text-lg font-black text-[var(--ink)]">Top matching products</h3>
          <div className="mt-4 grid gap-3">
            {topProducts.length === 0 ? (
              <p className="text-sm font-semibold text-[var(--text)]">No product found for this filter.</p>
            ) : topProducts.map((product) => (
              <div key={product.product} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm font-black text-[var(--ink)]">{product.product}</span>
                  <span className="whitespace-nowrap text-sm font-black text-[var(--navy)]">{qty(product.quantity)}</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-[var(--text)]">{npr(product.amount)} order-line amount</p>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
          <table className="min-w-[76rem] border-collapse bg-white text-left text-sm">
            <thead className="bg-[var(--soft)] text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">
              <tr>
                {["Order", "Month", "Customer / Place", "Product", "Qty sold / ordered", "Amount", "Outstanding", "Status", "Delivery"].map((header) => (
                  <th key={header} className="whitespace-nowrap px-4 py-3">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr><td className="px-4 py-6 text-center font-black text-[var(--text)]" colSpan={9}>No sales line matches this filter.</td></tr>
              ) : filteredRows.map((row, index) => (
                <tr key={`${row.orderNumber}-${row.product}-${index}`} className="border-t border-[var(--border)]">
                  <td className="whitespace-nowrap px-4 py-3 font-black text-[var(--navy)]">{row.orderNumber}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--ink)]">{row.month}</td>
                  <td className="min-w-56 px-4 py-3 font-semibold text-[var(--ink)]">{row.customer}</td>
                  <td className="min-w-80 px-4 py-3 font-semibold text-[var(--ink)]">{row.product}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-black text-[var(--ink)]">{qty(row.quantity)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--text)]">{npr(row.amount)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--text)]">{qty(row.outstandingQuantity)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--ink)]">{row.orderStatus}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--text)]">{row.deliveryStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </article>
  );
}
