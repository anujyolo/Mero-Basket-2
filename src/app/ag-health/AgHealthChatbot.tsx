"use client";

import { FormEvent, useMemo, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";

type DashboardData = {
  connected: boolean;
  checkedAt: string;
  company: string;
  error: string | null;
  dashboard: Record<string, number | null>;
  inventoryByCategory: { category: string; totalStock: number; stockValue: number; rows: { itemName: string; itemNo: string; currentStock: number; stockValue: number; unit: string; postingGroup: string; itemCategory: string }[] }[];
  packingMaterials: { packingMaterialName: string; currentStock: number; unit: string; supplier: string; remainingQuantity: number }[];
  production: { rows: { productName: string; productionDate: string; quantityProduced: number; status: string; unit: string }[]; monthlyTrend: { label: string; amount: number }[]; totalProduction: number; rowCount: number };
  salesAnalysis: { totalSales: number; monthlySales: number; yearlySales: number; previousMonthSales: number; currentMonthSales: number; growthPercentage: number | null; monthlyTrend: { label: string; amount: number }[]; lineRows: { product: string; dealer: string; districtCity: string; month: string; quantity: number; amount: number }[]; lineSourceNote: string };
  freight: { totalFreightExpense: number; rows: unknown[] };
  orders: { totalOrders: number; pendingOrders: number; rows: { customer: string; product: string; amount: number; orderStatus: string }[] };
};

type ChatMessage = {
  role: "bot" | "user";
  text: string;
};

const npr = (value: number | null | undefined) => value == null ? "ERP pending" : `NPR ${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
const qty = (value: number | null | undefined, unit = "") => value == null ? "ERP pending" : `${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}${unit ? ` ${unit}` : ""}`;

function topBy<T>(rows: T[], value: (row: T) => number, limit = 5) {
  return rows.slice().sort((a, b) => value(b) - value(a)).slice(0, limit);
}

function productAnswer(data: DashboardData, query: string) {
  const words = query.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length >= 2 && !["what", "show", "tell", "about", "sales", "stock", "qty", "quantity", "product"].includes(word));
  if (words.length === 0) return "";

  const salesMatches = data.salesAnalysis.lineRows.filter((row) => words.every((word) => row.product.toLowerCase().includes(word)));
  const inventoryMatches = data.inventoryByCategory.flatMap((category) => category.rows).filter((row) => words.every((word) => row.itemName.toLowerCase().includes(word) || row.itemNo.toLowerCase().includes(word)));

  if (salesMatches.length === 0 && inventoryMatches.length === 0) return "";

  const salesQty = salesMatches.reduce((sum, row) => sum + row.quantity, 0);
  const salesAmount = salesMatches.reduce((sum, row) => sum + row.amount, 0);
  const stockQty = inventoryMatches.reduce((sum, row) => sum + row.currentStock, 0);
  const stockValue = inventoryMatches.reduce((sum, row) => sum + row.stockValue, 0);
  const topSalesProduct = topBy(salesMatches, (row) => row.amount, 1)[0];
  const topStockItem = topBy(inventoryMatches, (row) => row.stockValue, 1)[0];

  return [
    `I found ${salesMatches.length.toLocaleString("en-US")} sales line(s) and ${inventoryMatches.length.toLocaleString("en-US")} inventory item(s) matching your product search.`,
    salesMatches.length ? `Sales match: ${qty(salesQty)} sold for ${npr(salesAmount)}. Top sales line: ${topSalesProduct.product} in ${topSalesProduct.districtCity || "unmapped location"}.` : "No matching sales lines are currently mapped for that product.",
    inventoryMatches.length ? `Inventory match: ${qty(stockQty)} in stock worth ${npr(stockValue)}. Top stock item: ${topStockItem.itemName}.` : "No matching inventory item is currently mapped for that product.",
  ].join("\n");
}

function answerQuestion(data: DashboardData, question: string) {
  const q = question.toLowerCase();
  const product = productAnswer(data, q);
  if (product) return product;

  if (q.includes("bank") || q.includes("cash")) {
    return `Bank Balance is ${npr(data.dashboard.bankBalance)}.\nSource: Business Central Trial Balance, Bank Account / Bank Balance-Total.`;
  }
  if (q.includes("receivable") || q.includes("receive")) {
    return `Receivables are ${npr(data.dashboard.receivables)}.\nMeaning: customer money still to receive.\nSource: Business Central Trial Balance.`;
  }
  if (q.includes("sale") || q.includes("revenue")) {
    const latest = data.salesAnalysis.monthlyTrend.at(-1);
    const topProducts = topBy(data.salesAnalysis.lineRows, (row) => row.amount, 5)
      .map((row, index) => `${index + 1}. ${row.product}: ${npr(row.amount)} · ${qty(row.quantity)} sold`)
      .join("\n");
    return `Sales summary:\n12-month/visible sales: ${npr(data.salesAnalysis.totalSales)}\nLatest month${latest ? ` (${latest.label})` : ""}: ${npr(latest?.amount || data.salesAnalysis.monthlySales)}\nYearly sales: ${npr(data.salesAnalysis.yearlySales)}\nGrowth: ${data.salesAnalysis.growthPercentage == null ? "ERP pending" : `${data.salesAnalysis.growthPercentage.toFixed(1)}%`}\n\nTop sales lines:\n${topProducts || "No sales product lines mapped yet."}`;
  }
  if (q.includes("production") || q.includes("produced") || q.includes("pcs")) {
    const latest = data.production.monthlyTrend.at(-1);
    const topProduction = topBy(data.production.rows, (row) => row.quantityProduced, 5)
      .map((row, index) => `${index + 1}. ${row.productName}: ${qty(row.quantityProduced, "pcs")} on ${row.productionDate}`)
      .join("\n");
    return `Production summary:\nTotal production loaded: ${qty(data.production.totalProduction, "pcs")}\nLatest month${latest ? ` (${latest.label})` : ""}: ${qty(latest?.amount, "pcs")}\nRows loaded: ${data.production.rowCount.toLocaleString("en-US")}\n\nTop production rows:\n${topProduction || "No production rows mapped yet."}`;
  }
  if (q.includes("inventory") || q.includes("stock")) {
    const categories = topBy(data.inventoryByCategory, (row) => row.stockValue, 5)
      .map((row, index) => `${index + 1}. ${row.category}: ${qty(row.totalStock)} stock · ${npr(row.stockValue)}`)
      .join("\n");
    return `Inventory summary:\nCalculated inventory value: ${npr(data.dashboard.totalInventoryValue)}\nImportant: this is stock × cost/purchase rate, so use it for operations, not final accounting.\n\nTop categories:\n${categories || "No inventory categories mapped yet."}`;
  }
  if (q.includes("packing") || q.includes("pm")) {
    const topPacking = topBy(data.packingMaterials, (row) => row.currentStock, 5)
      .map((row, index) => `${index + 1}. ${row.packingMaterialName}: ${qty(row.currentStock, row.unit)} · supplier ${row.supplier || "not mapped"}`)
      .join("\n");
    return `Packing material summary:\nTotal packing stock: ${qty(data.dashboard.packingMaterialStock)}\nRows loaded: ${data.packingMaterials.length.toLocaleString("en-US")}\n\nTop PM items:\n${topPacking || "No packing material rows mapped yet."}`;
  }
  if (q.includes("order")) {
    return `Orders summary:\nTotal orders: ${qty(data.orders.totalOrders)}\nPending/processing orders: ${qty(data.orders.pendingOrders)}\nSource: SalesOrder + salesDocumentLines.`;
  }
  if (q.includes("freight") || q.includes("transport")) {
    return `Freight summary:\nTotal freight expense: ${npr(data.freight.totalFreightExpense)}\nMatched freight rows: ${data.freight.rows.length.toLocaleString("en-US")}\nSource: General ledger entries containing freight/transport signals.`;
  }
  if (q.includes("source") || q.includes("where") || q.includes("data")) {
    return `Data sources:\nSales: SalesDashboard\nReceivables and Bank Balance: ExcelTemplateTrialBalance\nInventory and Packing: Itemcard\nProduction: Finishedproductionordgers\nOrders: SalesOrder + salesDocumentLines\nFreight: Generalledgerentries\n\nI only answer from these mapped ERP feeds.`;
  }

  return `I can answer from the AG Health ERP data loaded in this app. Try asking:\n• What is the bank balance?\n• Show sales summary\n• Show production summary\n• How much M5 did we sell?\n• What is packing stock?\n• Show inventory value by category\n• How many pending orders?`;
}

export function AgHealthChatbot() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: "Hi, I’m the AG Health data assistant. Ask me about sales, bank balance, inventory, production, packing materials, freight, or orders." },
  ]);

  const suggestions = useMemo(() => ["Bank balance", "Sales summary", "Production summary", "Packing stock", "Pending orders"], []);

  async function ensureData() {
    if (data) return data;
    setLoading(true);
    const response = await fetch("/api/erp/ag-health/summary", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load ERP summary.");
    const nextData = await response.json() as DashboardData;
    setData(nextData);
    setLoading(false);
    return nextData;
  }

  async function ask(text: string) {
    const cleanText = text.trim();
    if (!cleanText) return;
    setInput("");
    setMessages((current) => [...current, { role: "user", text: cleanText }]);
    try {
      const liveData = await ensureData();
      const answer = answerQuestion(liveData, cleanText);
      setMessages((current) => [...current, { role: "bot", text: answer }]);
    } catch {
      setLoading(false);
      setMessages((current) => [...current, { role: "bot", text: "I could not load the live ERP summary right now. Please check the ERP connection and try again." }]);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(input);
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-[var(--navy)] px-5 py-4 text-sm font-black text-white shadow-[0_18px_48px_rgba(31,63,103,0.35)]">
        <MessageCircle className="size-5" aria-hidden="true" />
        Ask data
      </button>
    );
  }

  return (
    <section className="fixed bottom-5 right-5 z-50 flex max-h-[82vh] w-[min(26rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.6rem] border border-[var(--border)] bg-white shadow-[0_24px_70px_rgba(31,48,74,0.22)]">
      <div className="flex items-center justify-between gap-3 bg-[var(--navy)] px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-white/12"><Bot className="size-5" aria-hidden="true" /></span>
          <div>
            <p className="text-sm font-black">AG Health Data Assistant</p>
            <p className="text-xs font-semibold text-white/75">{data?.connected ? "Live ERP data loaded" : "Answers from mapped ERP feeds"}</p>
          </div>
        </div>
        <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/12" aria-label="Close chat">
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto bg-[var(--soft)] px-4 py-4">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`rounded-2xl px-4 py-3 text-sm font-semibold leading-6 ${message.role === "user" ? "ml-8 bg-[var(--navy)] text-white" : "mr-8 border border-[var(--border)] bg-white text-[var(--ink)]"}`}>
            {message.text.split("\n").map((line) => <p key={line || index}>{line || "\u00a0"}</p>)}
          </div>
        ))}
        {loading ? <div className="mr-8 flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-black text-[var(--text)]"><Loader2 className="size-4 animate-spin" /> Loading ERP data…</div> : null}
      </div>
      <div className="border-t border-[var(--border)] bg-white p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button key={suggestion} type="button" onClick={() => void ask(suggestion)} className="rounded-full bg-[var(--soft)] px-3 py-2 text-xs font-black text-[var(--navy)] hover:bg-[var(--badge)]">
              {suggestion}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about AG Health data…" className="min-w-0 flex-1 rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-semibold outline-none focus:border-[var(--blue)]" />
          <button type="submit" className="grid size-12 place-items-center rounded-2xl bg-[var(--gold)] text-white shadow-sm" aria-label="Send question">
            <Send className="size-5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
