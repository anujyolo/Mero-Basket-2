"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import type { SalesLineAnalysisRow } from "@/server/business-central/data";

function npr(value: number) {
  return `NPR ${Math.round(value).toLocaleString("en-US")}`;
}

function qty(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

export function SalesLineExplorer({ rows, sourceNote }: { rows: SalesLineAnalysisRow[]; sourceNote: string }) {
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [month, setMonth] = useState("All");
  const [year, setYear] = useState("All");
  const [province, setProvince] = useState("All");
  const [districtCity, setDistrictCity] = useState("All");
  const [dealer, setDealer] = useState("All");
  const [productCategory, setProductCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const months = useMemo(() => ["All", ...Array.from(new Set(rows.map((row) => row.month))).filter(Boolean).sort().reverse()], [rows]);
  const years = useMemo(() => ["All", ...Array.from(new Set(rows.map((row) => row.year))).filter(Boolean).sort().reverse()], [rows]);
  const provinces = useMemo(() => ["All", ...Array.from(new Set(rows.map((row) => row.province))).filter(Boolean).sort()], [rows]);
  const districtCities = useMemo(() => ["All", ...Array.from(new Set(rows.map((row) => row.districtCity))).filter(Boolean).sort()], [rows]);
  const dealers = useMemo(() => ["All", ...Array.from(new Set(rows.map((row) => row.dealer))).filter(Boolean).sort()], [rows]);
  const productCategories = useMemo(() => ["All", ...Array.from(new Set(rows.map((row) => row.productCategory))).filter(Boolean).sort()], [rows]);
  const statuses = useMemo(() => ["All", ...Array.from(new Set(rows.map((row) => row.orderStatus))).filter(Boolean).sort()], [rows]);
  const filteredRows = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesMonth = month === "All" || row.month === month;
      const matchesYear = year === "All" || row.year === year;
      const matchesProvince = province === "All" || row.province === province;
      const matchesDistrict = districtCity === "All" || row.districtCity === districtCity;
      const matchesDealer = dealer === "All" || row.dealer === dealer;
      const matchesCategory = productCategory === "All" || row.productCategory === productCategory;
      const matchesStatus = status === "All" || row.orderStatus === status;
      const searchable = [
        row.productNo,
        row.product,
        row.orderNumber,
        row.dealer,
        row.province,
        row.districtCity,
        row.productCategory,
        row.month,
        row.year,
        row.orderStatus,
        row.deliveryStatus,
      ].join(" ").toLowerCase();

      return matchesMonth && matchesYear && matchesProvince && matchesDistrict && matchesDealer && matchesCategory && matchesStatus && (!cleanQuery || searchable.includes(cleanQuery));
    });
  }, [dealer, districtCity, month, productCategory, province, query, rows, status, year]);
  const totalQty = filteredRows.reduce((sum, row) => sum + row.quantity, 0);
  const totalAmount = filteredRows.reduce((sum, row) => sum + row.amount, 0);
  const byProduct = new Map<string, { product: string; productNo: string; quantity: number; amount: number; places: Set<string>; dealers: Set<string> }>();
  const byLocation = new Map<string, { label: string; quantity: number; amount: number; dealers: Set<string>; products: Set<string> }>();
  const byDealer = new Map<string, { label: string; place: string; quantity: number; amount: number; products: Set<string>; topProduct: string }>();

  for (const row of filteredRows) {
    const current = byProduct.get(row.product) || { product: row.product, productNo: row.productNo, quantity: 0, amount: 0, places: new Set<string>(), dealers: new Set<string>() };
    current.quantity += row.quantity;
    current.amount += row.amount;
    current.places.add(row.districtCity);
    current.dealers.add(row.dealer);
    byProduct.set(row.product, current);

    const location = byLocation.get(row.districtCity) || { label: row.districtCity, quantity: 0, amount: 0, dealers: new Set<string>(), products: new Set<string>() };
    location.quantity += row.quantity;
    location.amount += row.amount;
    location.dealers.add(row.dealer);
    location.products.add(row.product);
    byLocation.set(row.districtCity, location);

    const dealerRow = byDealer.get(row.dealer) || { label: row.dealer, place: row.districtCity, quantity: 0, amount: 0, products: new Set<string>(), topProduct: row.product };
    dealerRow.quantity += row.quantity;
    dealerRow.amount += row.amount;
    dealerRow.products.add(row.product);
    dealerRow.topProduct = row.product;
    byDealer.set(row.dealer, dealerRow);
  }

  const topProducts = [...byProduct.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 8);
  const topLocations = [...byLocation.values()].sort((a, b) => b.amount - a.amount).slice(0, 8);
  const topDealers = [...byDealer.values()].sort((a, b) => b.amount - a.amount).slice(0, 8);
  const heroProduct = topProducts[0];
  const bestLocation = topLocations[0];
  const bestDealer = topDealers[0];
  const resetFilters = () => {
    setQuery("");
    setMonth("All");
    setYear("All");
    setProvince("All");
    setDistrictCity("All");
    setDealer("All");
    setProductCategory("All");
    setStatus("All");
  };

  return (
    <article className="analysis-panel">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--navy)]">Product Sales Explorer</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Nepal → location → dealer → product drilldown</h2>
          <p className="mt-3 max-w-5xl text-sm font-semibold leading-6 text-[var(--text)]">
            Example: click Kathmandu, choose a dealer, or type <span className="font-black text-[var(--navy)]">M5</span> to see that product’s quantity, sales amount, contribution, dealers, and trend-ready rows.
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

      <div className="mt-6 grid gap-3 xl:grid-cols-[1fr_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--text-light)]" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search product like M5, diaper, customer, order number..."
            className="h-14 w-full rounded-2xl border border-[var(--border)] bg-white pl-12 pr-4 text-sm font-bold text-[var(--ink)] shadow-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
          />
        </label>
        <button type="button" onClick={() => setFiltersOpen((open) => !open)} className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[var(--navy)] px-5 text-sm font-black text-white shadow-[var(--shadow-soft)]">
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filter
        </button>
      </div>

      {filtersOpen ? (
        <div className="mt-4 rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Year", year, setYear, years],
              ["Month", month, setMonth, months],
              ["Province / Area", province, setProvince, provinces],
              ["District / City", districtCity, setDistrictCity, districtCities],
              ["Dealer", dealer, setDealer, dealers],
              ["Product category", productCategory, setProductCategory, productCategories],
              ["Order status", status, setStatus, statuses],
            ].map(([label, value, setter, options]) => (
              <label key={label as string} className="grid gap-2 text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">
                {label as string}
                <select value={value as string} onChange={(event) => (setter as (next: string) => void)(event.target.value)} className="h-12 rounded-2xl border border-[var(--border)] bg-[var(--soft)] px-4 text-sm font-black normal-case tracking-normal text-[var(--ink)] outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100">
                  {(options as string[]).map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
            ))}
            <button type="button" onClick={resetFilters} className="h-12 self-end rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-black text-[var(--navy)]">
              Reset filters
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="snapshot-card">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">Hero product</p>
          <p className="mt-3 text-xl font-black text-[var(--navy)]">{heroProduct?.product || "Not mapped"}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--text)]">{heroProduct ? `${qty(heroProduct.quantity)} qty · ${npr(heroProduct.amount)}` : "No rows in current filter."}</p>
        </div>
        <div className="snapshot-card">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">Best location</p>
          <p className="mt-3 text-xl font-black text-[var(--navy)]">{bestLocation?.label || "Not mapped"}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--text)]">{bestLocation ? `${npr(bestLocation.amount)} · ${bestLocation.dealers.size} dealer(s)` : "No rows in current filter."}</p>
        </div>
        <div className="snapshot-card">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">Best dealer</p>
          <p className="mt-3 text-xl font-black text-[var(--navy)]">{bestDealer?.label || "Not mapped"}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--text)]">{bestDealer ? `${npr(bestDealer.amount)} · ${bestDealer.products.size} product(s)` : "No rows in current filter."}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--soft)] p-5">
          <h3 className="text-lg font-black text-[var(--ink)]">Top 5/10 products</h3>
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
          <h3 className="mt-6 text-lg font-black text-[var(--ink)]">Top locations</h3>
          <div className="mt-4 grid gap-2">
            {topLocations.slice(0, 5).map((place) => (
              <button key={place.label} type="button" onClick={() => setDistrictCity(place.label)} className="rounded-2xl bg-white px-4 py-3 text-left text-sm font-black text-[var(--ink)] shadow-sm">
                {place.label}<span className="block text-xs font-semibold text-[var(--text)]">{npr(place.amount)} · {place.products.size} product(s)</span>
              </button>
            ))}
          </div>
          <h3 className="mt-6 text-lg font-black text-[var(--ink)]">Dealer ranking</h3>
          <div className="mt-4 grid gap-2">
            {topDealers.slice(0, 5).map((dealerRow) => (
              <button key={dealerRow.label} type="button" onClick={() => setDealer(dealerRow.label)} className="rounded-2xl bg-white px-4 py-3 text-left text-sm font-black text-[var(--ink)] shadow-sm">
                {dealerRow.label}<span className="block text-xs font-semibold text-[var(--text)]">{dealerRow.place} · {npr(dealerRow.amount)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
          <table className="min-w-[76rem] border-collapse bg-white text-left text-sm">
            <thead className="bg-[var(--soft)] text-xs font-black uppercase tracking-[0.12em] text-[var(--text-light)]">
              <tr>
                {["Order", "Year", "Month", "Province", "District / City", "Dealer", "Product no", "Product", "Category", "Qty sold", "Amount", "Outstanding", "Status", "Delivery"].map((header) => (
                  <th key={header} className="whitespace-nowrap px-4 py-3">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr><td className="px-4 py-6 text-center font-black text-[var(--text)]" colSpan={14}>No sales line matches this filter.</td></tr>
              ) : filteredRows.map((row, index) => (
                <tr key={`${row.orderNumber}-${row.product}-${index}`} className="border-t border-[var(--border)]">
                  <td className="whitespace-nowrap px-4 py-3 font-black text-[var(--navy)]">{row.orderNumber}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--ink)]">{row.year}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--ink)]">{row.month}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--ink)]">{row.province}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--ink)]">{row.districtCity}</td>
                  <td className="min-w-56 px-4 py-3 font-semibold text-[var(--ink)]">{row.dealer}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--ink)]">{row.productNo}</td>
                  <td className="min-w-80 px-4 py-3 font-semibold text-[var(--ink)]">{row.product}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-[var(--ink)]">{row.productCategory}</td>
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
