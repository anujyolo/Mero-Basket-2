import { getBusinessCentralAuthHeader, getBusinessCentralConfig } from "./config";
import { getBusinessCentralStatus } from "./client";

type ODataResponse<T> = {
  value?: T[];
  "@odata.count"?: number;
};

type SalesRow = {
  Posting_Date?: string;
  Entry_Type?: string;
  Sales_Amount_Actual?: number | string;
  Cost_Amount_Actual?: number | string;
};

type TrialBalanceRow = {
  number?: string;
  display?: string;
  balanceAtDateDebit?: number | string;
  balanceAtDateCredit?: number | string;
  dateFilter?: string;
};

type BankRow = {
  No?: string;
  Name?: string;
  Balance_LCY?: number | string;
  Bank_Acc_Posting_Group?: string;
  Bank_Acc_Posting_Group1?: string;
  Blocked?: boolean;
};

type ItemRow = {
  No?: string;
  Description?: string;
  Inventory?: number | string;
  Base_Unit_of_Measure?: string;
  Inventory_Posting_Group?: string;
};

type VendorLedgerRow = {
  Vendor_No?: string;
  Vendor_Name?: string;
};

type ProductionRow = {
  Quantity?: number | string;
};

type PurchaseLineRow = {
  Line_Amount?: number | string;
  Total_Amount_Excl_VAT?: number | string;
};

export type AGHealthDashboardData = {
  connected: boolean;
  checkedAt: string;
  company: string;
  sourceWindow: string;
  entityCounts: {
    salesRows: number;
    rawMaterialRows: number;
    rawMaterialPositiveRows: number;
    bankRows: number;
    vendorLedgerRows: number | null;
    vendorCount: number;
    productionRows: number | null;
  };
  values: {
    sales12Month: number | null;
    currentMonthSales: number | null;
    grossMarginPercent: number | null;
    receivables: number | null;
    bankBalance: number | null;
    rawMaterialStock: number | null;
    latestPurchases: number | null;
    latestProduction: number | null;
  };
  labels: {
    latestSalesMonth: string;
    receivablesDate: string;
  };
  monthlySales: { month: string; amount: number; height: number }[];
  combinedMonthly: { month: string; production: number; purchases: number; revenue: number }[];
  materialRows: { name: string; item: string; quantity: number; unit: string }[];
  error: string | null;
};

const SALES_WINDOW_START = "2025-09-01";
const SALES_WINDOW_LABEL = "Sep 2025 to Aug 2026";

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (!value) {
    return 0;
  }

  const parsed = Number(String(value).replaceAll(",", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function toMonth(value: string | undefined) {
  return value?.slice(0, 7) || "Unknown";
}

function heightFor(value: number, max: number) {
  if (max <= 0) {
    return 0;
  }

  return Math.max(4, Math.round((value / max) * 92));
}

async function fetchEntity<T>(entity: string, query: string) {
  const config = getBusinessCentralConfig();
  const authHeader = getBusinessCentralAuthHeader();

  if (!config.companyODataUrl || !authHeader) {
    throw new Error("Business Central OData URL or credentials are missing.");
  }

  const response = await fetch(`${config.companyODataUrl}/${entity}?${query}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: authHeader,
    },
  });

  if (!response.ok) {
    throw new Error(`${entity} returned ${response.status}`);
  }

  const data = (await response.json()) as ODataResponse<T>;
  return {
    rows: data.value || [],
    count: data["@odata.count"] ?? null,
  };
}

export function formatNpr(value: number | null) {
  if (value === null) {
    return "ERP pending";
  }

  return `NPR ${Math.round(value).toLocaleString("en-US")}`;
}

export function formatQuantity(value: number | null, unit = "kg") {
  if (value === null) {
    return "ERP pending";
  }

  return `${value.toLocaleString("en-US", { maximumFractionDigits: 4 })} ${unit}`;
}

export function formatPercent(value: number | null) {
  if (value === null) {
    return "ERP pending";
  }

  return `${value.toFixed(1)}%`;
}

export async function getAGHealthDashboardData(): Promise<AGHealthDashboardData> {
  const status = await getBusinessCentralStatus();
  const checkedAt = new Date().toISOString();

  const emptyData: AGHealthDashboardData = {
    connected: false,
    checkedAt,
    company: status.company,
    sourceWindow: SALES_WINDOW_LABEL,
    entityCounts: {
      salesRows: 0,
      rawMaterialRows: 0,
      rawMaterialPositiveRows: 0,
      bankRows: 0,
      vendorLedgerRows: null,
      vendorCount: 0,
      productionRows: null,
    },
    values: {
      sales12Month: null,
      currentMonthSales: null,
      grossMarginPercent: null,
      receivables: null,
      bankBalance: null,
      rawMaterialStock: null,
      latestPurchases: null,
      latestProduction: null,
    },
    labels: {
      latestSalesMonth: "ERP pending",
      receivablesDate: "ERP pending",
    },
    monthlySales: [],
    combinedMonthly: [],
    materialRows: [],
    error: status.message,
  };

  if (status.status !== "ready-to-query") {
    return emptyData;
  }

  try {
    const [salesResult, trialResult, bankResult, itemResult, vendorResult, productionResult, purchaseLineResult] = await Promise.all([
      fetchEntity<SalesRow>(
        "SalesDashboard",
        `$filter=Posting_Date ge ${SALES_WINDOW_START}&$select=Posting_Date,Sales_Amount_Actual,Cost_Amount_Actual,Entry_Type&$count=true`,
      ),
      fetchEntity<TrialBalanceRow>(
        "ExcelTemplateTrialBalance",
        "$filter=number eq '110405'&$select=number,display,balanceAtDateDebit,balanceAtDateCredit,dateFilter&$count=true",
      ),
      fetchEntity<BankRow>(
        "Bankacccard1",
        "$select=No,Name,Balance_LCY,Bank_Acc_Posting_Group,Bank_Acc_Posting_Group1,Blocked&$count=true",
      ),
      fetchEntity<ItemRow>(
        "Itemcard",
        "$filter=Inventory_Posting_Group eq 'RM'&$select=No,Description,Inventory,Base_Unit_of_Measure,Inventory_Posting_Group&$count=true",
      ),
      fetchEntity<VendorLedgerRow>(
        "VendorLedgerEntries",
        "$select=Vendor_No,Vendor_Name&$top=5000&$count=true",
      ),
      fetchEntity<ProductionRow>(
        "Finishedproductionordgers",
        "$select=Quantity&$top=5000&$count=true",
      ),
      fetchEntity<PurchaseLineRow>(
        "PostedPurchaseInvoicePurchInvLines",
        "$select=Line_Amount,Total_Amount_Excl_VAT&$top=5000&$count=true",
      ),
    ]);

    const salesByMonth = new Map<string, { sales: number; cost: number }>();
    let totalSales = 0;
    let totalCost = 0;

    for (const row of salesResult.rows) {
      const month = toMonth(row.Posting_Date);
      const sales = toNumber(row.Sales_Amount_Actual);
      const cost = Math.abs(toNumber(row.Cost_Amount_Actual));
      const current = salesByMonth.get(month) || { sales: 0, cost: 0 };

      current.sales += sales;
      current.cost += cost;
      salesByMonth.set(month, current);
      totalSales += sales;
      totalCost += cost;
    }

    const monthlySalesRaw = [...salesByMonth.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, values]) => ({ month, amount: values.sales }));
    const salesMax = Math.max(...monthlySalesRaw.map((row) => row.amount), 0);
    const monthlySales = monthlySalesRaw.map((row) => ({ ...row, height: heightFor(row.amount, salesMax) }));
    const latestSales = monthlySalesRaw.at(-1);

    const receivablesRow = trialResult.rows[0];
    const receivables = receivablesRow
      ? toNumber(receivablesRow.balanceAtDateDebit) - toNumber(receivablesRow.balanceAtDateCredit)
      : null;

    const activeBanks = bankResult.rows.filter(
      (row) => !row.Blocked && (row.Bank_Acc_Posting_Group === "BANK" || row.Bank_Acc_Posting_Group1 === "BANK"),
    );
    const bankBalance = activeBanks.reduce((sum, row) => sum + toNumber(row.Balance_LCY), 0);

    const rawMaterials = itemResult.rows;
    const positiveMaterials = rawMaterials.filter((row) => toNumber(row.Inventory) > 0);
    const rawMaterialStock = positiveMaterials.reduce((sum, row) => sum + toNumber(row.Inventory), 0);
    const materialRows = positiveMaterials
      .sort((a, b) => toNumber(b.Inventory) - toNumber(a.Inventory))
      .slice(0, 10)
      .map((row) => ({
        name: row.Description || "Unnamed material",
        item: row.No || "—",
        quantity: toNumber(row.Inventory),
        unit: row.Base_Unit_of_Measure || "kg",
      }));

    const vendorCount = new Set(vendorResult.rows.map((row) => row.Vendor_No).filter(Boolean)).size;
    const latestProduction = productionResult.rows.reduce((sum, row) => sum + toNumber(row.Quantity), 0);
    const latestPurchases = purchaseLineResult.rows.reduce(
      (sum, row) => sum + (toNumber(row.Line_Amount) || toNumber(row.Total_Amount_Excl_VAT)),
      0,
    );
    const grossMarginPercent = totalSales > 0 ? ((totalSales - totalCost) / totalSales) * 100 : null;
    const purchaseHeight = heightFor(latestPurchases, Math.max(latestPurchases, totalSales, latestProduction));
    const productionHeight = heightFor(latestProduction, Math.max(latestPurchases, totalSales, latestProduction));

    return {
      connected: true,
      checkedAt,
      company: status.company,
      sourceWindow: SALES_WINDOW_LABEL,
      entityCounts: {
        salesRows: salesResult.count ?? salesResult.rows.length,
        rawMaterialRows: itemResult.count ?? rawMaterials.length,
        rawMaterialPositiveRows: positiveMaterials.length,
        bankRows: activeBanks.length,
        vendorLedgerRows: vendorResult.count,
        vendorCount,
        productionRows: productionResult.count,
      },
      values: {
        sales12Month: totalSales,
        currentMonthSales: latestSales?.amount ?? null,
        grossMarginPercent,
        receivables,
        bankBalance,
        rawMaterialStock,
        latestPurchases,
        latestProduction,
      },
      labels: {
        latestSalesMonth: latestSales?.month || "ERP pending",
        receivablesDate: receivablesRow?.dateFilter || checkedAt.slice(0, 10),
      },
      monthlySales,
      combinedMonthly: monthlySales.map((row) => ({
        month: row.month,
        production: productionHeight,
        purchases: purchaseHeight,
        revenue: row.height,
      })),
      materialRows,
      error: null,
    };
  } catch (error) {
    return {
      ...emptyData,
      connected: false,
      error: error instanceof Error ? error.message : "ERP data extraction failed.",
    };
  }
}
