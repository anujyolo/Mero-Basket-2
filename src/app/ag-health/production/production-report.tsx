"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import type { ProductionGoodsRow } from "@/server/business-central/data";

function number(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

export function ProductionReport({ rows }: { rows: ProductionGoodsRow[] }) {
  const [query, setQuery] = useState("");
  const [goodsType, setGoodsType] = useState("All");
  const [itemCategory, setItemCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const categories = useMemo(() => ["All", ...Array.from(new Set(rows.map((row) => row.category)))], [rows]);
  const goodsTypes = useMemo(() => ["All", ...Array.from(new Set(rows.map((row) => row.goodsType)))], [rows]);
  const statuses = useMemo(() => ["All", ...Array.from(new Set(rows.map((row) => row.status)))], [rows]);
  const filteredRows = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesGoodsType = goodsType === "All" || row.goodsType === goodsType;
      const matchesCategory = itemCategory === "All" || row.category === itemCategory;
      const matchesStatus = status === "All" || row.status === status;
      const searchable = [
        row.itemNo,
        row.description,
        row.goodsType,
        row.category,
        row.postingGroup,
        row.status,
      ].join(" ").toLowerCase();

      return matchesGoodsType && matchesCategory && matchesStatus && (!cleanQuery || searchable.includes(cleanQuery));
    });
  }, [goodsType, itemCategory, query, rows, status]);

  const filteredQuantity = filteredRows.reduce((sum, row) => sum + row.inventory, 0);
  const filteredValue = filteredRows.reduce((sum, row) => sum + row.stockValue, 0);

  return (
    <article className="chart-container">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Production Register</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Search product stock lines</h2>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-[var(--text)]">
            Search by item no, product name, category, posting group, goods type, or stock status. This follows the reference production stock table.
          </p>
        </div>
        <div className="grid gap-2 rounded-3xl border border-[var(--border)] bg-[var(--soft)] px-5 py-4 text-sm font-black text-[var(--navy)] sm:min-w-64">
          <span>{filteredRows.length.toLocaleString("en-US")} rows visible</span>
          <span>{number(filteredQuantity)} qty · NPR {Math.round(filteredValue).toLocaleString("en-US")}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_14rem_14rem_14rem]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--text-light)]" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search product, item no, category, posting group..."
            className="h-14 w-full rounded-2xl border border-[var(--border)] bg-white pl-12 pr-4 text-sm font-bold text-[var(--ink)] shadow-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          />
        </label>
        <select
          value={goodsType}
          onChange={(event) => setGoodsType(event.target.value)}
          className="h-14 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-black text-[var(--ink)] shadow-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
        >
          {goodsTypes.map((option) => <option key={option}>{option}</option>)}
        </select>
        <select
          value={itemCategory}
          onChange={(event) => setItemCategory(event.target.value)}
          className="h-14 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-black text-[var(--ink)] shadow-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
        >
          {categories.map((option) => <option key={option}>{option}</option>)}
        </select>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-14 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-black text-[var(--ink)] shadow-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
        >
          {statuses.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {[...goodsTypes, ...categories.filter((option) => option !== "All")].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => goodsTypes.includes(option) ? setGoodsType(option) : setItemCategory(option)}
            className={`rounded-full px-4 py-2 text-xs font-black transition ${goodsType === option || itemCategory === option ? "bg-[var(--navy)] text-white shadow-[var(--shadow-soft)]" : "bg-[var(--soft)] text-[var(--text)] hover:bg-white"}`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="min-w-[78rem] border-collapse bg-white text-left text-sm">
          <thead className="bg-[var(--soft)] text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">
            <tr>
              {["Item No", "Description", "Goods Type", "Category", "Posting Group", "Status", "Inventory", "Unit Cost", "Stock Value"].map((header) => (
                <th key={header} className="whitespace-nowrap px-4 py-3">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center font-black text-[var(--text)]" colSpan={9}>No product rows match this search.</td>
              </tr>
            ) : filteredRows.map((row, index) => (
              <tr key={`${row.itemNo}-${index}`} className="border-t border-[var(--border)]">
                <td className="whitespace-nowrap px-4 py-3 font-black text-[var(--navy)]">{row.itemNo}</td>
                <td className="min-w-80 px-4 py-3 font-semibold text-[var(--ink)]">{row.description}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="rounded-full bg-[var(--badge)] px-3 py-1 text-xs font-black text-[var(--navy)]">{row.goodsType}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--ink)]">{row.category}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--ink)]">{row.postingGroup}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--ink)]">{row.status}</td>
                <td className="whitespace-nowrap px-4 py-3 font-black text-[var(--ink)]">{number(row.inventory)}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--text)]">NPR {Math.round(row.unitCost).toLocaleString("en-US")}</td>
                <td className="whitespace-nowrap px-4 py-3 font-black text-[var(--ink)]">NPR {Math.round(row.stockValue).toLocaleString("en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
