"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import type { InventoryReportRow } from "@/server/business-central/data";

function formatNpr(value: number) {
  return `NPR ${Math.round(value).toLocaleString("en-US")}`;
}

function qty(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

export function InventoryRegister({ rows }: { rows: InventoryReportRow[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [stockStatus, setStockStatus] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(rows.map((row) => row.category)))], [rows]);
  const statuses = useMemo(() => ["All", ...Array.from(new Set(rows.map((row) => row.status)))], [rows]);
  const filteredRows = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesCategory = category === "All" || row.category === category;
      const matchesStatus = stockStatus === "All" || row.status === stockStatus;
      const searchable = [
        row.itemNo,
        row.itemName,
        row.category,
        row.itemCategory,
        row.postingGroup,
        row.status,
        row.supplier,
      ].join(" ").toLowerCase();

      return matchesCategory && matchesStatus && (!cleanQuery || searchable.includes(cleanQuery));
    });
  }, [category, query, rows, stockStatus]);
  const stockValue = filteredRows.reduce((sum, row) => sum + row.stockValue, 0);

  return (
    <article className="analysis-panel">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Inventory Register</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Search any ERP item manually</h2>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-[var(--text)]">
            Search by item number, product name, posting group, item category, supplier, or stock status.
          </p>
        </div>
        <div className="grid gap-2 rounded-3xl border border-[var(--border)] bg-[var(--soft)] px-5 py-4 text-sm font-black text-[var(--navy)] sm:min-w-64">
          <span>{filteredRows.length.toLocaleString("en-US")} rows visible</span>
          <span>{formatNpr(stockValue)} visible value</span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_14rem_14rem]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--text-light)]" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search item, category, posting group, supplier..."
            className="h-14 w-full rounded-2xl border border-[var(--border)] bg-white pl-12 pr-4 text-sm font-bold text-[var(--ink)] shadow-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          />
        </label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-14 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-black text-[var(--ink)] shadow-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
        >
          {categories.map((option) => <option key={option}>{option}</option>)}
        </select>
        <select
          value={stockStatus}
          onChange={(event) => setStockStatus(event.target.value)}
          className="h-14 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-black text-[var(--ink)] shadow-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
        >
          {statuses.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="min-w-[92rem] border-collapse bg-white text-left text-sm">
          <thead className="bg-[var(--soft)] text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">
            <tr>
              {["Item No", "Item name", "Posting group", "Item category", "Status", "Current stock", "Unit", "Purchased qty", "Purchase rate", "Supplier", "Purchase date", "Stock value"].map((header) => (
                <th key={header} className="whitespace-nowrap px-4 py-3">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr><td className="px-4 py-6 text-center font-black text-[var(--text)]" colSpan={12}>No inventory rows match this search.</td></tr>
            ) : filteredRows.map((row, index) => (
              <tr key={`${row.itemNo}-${index}`} className="border-t border-[var(--border)]">
                <td className="whitespace-nowrap px-4 py-3 font-black text-[var(--navy)]">{row.itemNo}</td>
                <td className="min-w-80 px-4 py-3 font-semibold text-[var(--ink)]">{row.itemName}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--ink)]">{row.postingGroup}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--ink)]">{row.itemCategory}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--ink)]">{row.status}</td>
                <td className="whitespace-nowrap px-4 py-3 font-black text-[var(--ink)]">{qty(row.currentStock)}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--text)]">{row.unit}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--text)]">{qty(row.purchasedQuantity)}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--text)]">{formatNpr(row.purchaseRate)}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--text)]">{row.supplier}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--text)]">{row.purchaseDate}</td>
                <td className="whitespace-nowrap px-4 py-3 font-black text-[var(--ink)]">{formatNpr(row.stockValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
