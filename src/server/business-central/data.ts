import { getBusinessCentralStatus } from "./client";
import { getBusinessCentralAuthHeader, getBusinessCentralConfig } from "./config";

type ODataResponse<T> = {
  value?: T[];
  "@odata.count"?: number;
  "@odata.nextLink"?: string;
};

type ItemRow = {
  No?: string;
  Description?: string;
  Base_Unit_of_Measure?: string;
  Item_Category_Code?: string;
  Inventory?: number | string;
  Qty_on_Purch_Order?: number | string;
  Unit_Cost?: number | string;
  Last_Direct_Cost?: number | string;
  Inventory_Posting_Group?: string;
  Unit_Price?: number | string;
  Vendor_No?: string;
  Last_Date_Modified?: string;
};

type SalesRow = {
  Posting_Date?: string;
  Sales_Amount_Actual?: number | string;
  Cost_Amount_Actual?: number | string;
};

type ProductionRow = {
  No?: string;
  Description?: string;
  Source_No?: string;
  Quantity?: number | string;
  Location_Code?: string;
  Starting_Date?: string;
  Ending_Date?: string;
  Finished_Date?: string;
  Routing_No?: string;
  Status?: string;
};

type SalesOrderRow = {
  No?: string;
  Sell_to_Customer_Name?: string;
  Order_Date?: string;
  Posting_Date?: string;
  Shipment_Date?: string;
  Status?: string;
  Amount?: number | string;
  Amount_Including_VAT?: number | string;
};

type SalesOrderLineRow = {
  documentNumber?: string;
  description?: string;
  quantity?: number | string;
  amount?: number | string;
  outstandingQuantity?: number | string;
};

type GeneralLedgerRow = {
  Posting_Date?: string;
  Document_No?: string;
  G_L_Account_Name?: string;
  Description?: string;
  Narration?: string;
  Source_Name?: string;
  External_Document_No?: string;
  Amount?: number | string;
  Debit_Amount?: number | string;
  Global_Dimension_1_Code?: string;
  Global_Dimension_2_Code?: string;
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

export type InventoryReportRow = {
  itemName: string;
  category: string;
  currentStock: number;
  unit: string;
  purchasedQuantity: number;
  purchaseRate: number;
  supplier: string;
  purchaseDate: string;
  remainingQuantity: number;
  stockValue: number;
};

export type PackingMaterialRow = {
  packingMaterialName: string;
  currentStock: number;
  unit: string;
  purchasedQuantity: number;
  purchaseRate: number;
  supplier: string;
  purchaseDate: string;
  remainingQuantity: number;
};

export type ProductionReportRow = {
  orderNumber: string;
  sourceNumber: string;
  productName: string;
  goodsCategory: "Finished Goods" | "Semi-finished Goods" | "Other Production";
  status: string;
  productionDate: string;
  quantityProduced: number;
  unit: string;
  productionLine: string;
  materialConsumption: string;
};

export type FreightRow = {
  date: string;
  supplierCustomer: string;
  invoiceReference: string;
  freightAmount: number;
  transportCompany: string;
  relatedPurchaseOrder: string;
  remarks: string;
};

export type DistributedExpenseRow = {
  expenseDate: string;
  expenseType: string;
  amount: number;
  relatedDepartmentOrderProduct: string;
  description: string;
  distributedAmount: number;
};

export type OrderRow = {
  orderNumber: string;
  customer: string;
  orderDate: string;
  product: string;
  quantity: number;
  amount: number;
  orderStatus: "Pending" | "Processing" | "Completed" | "Cancelled";
  deliveryStatus: string;
};

export type AGHealthDashboardData = {
  connected: boolean;
  checkedAt: string;
  company: string;
  error: string | null;
  dashboard: {
    totalInventoryValue: number | null;
    packingMaterialStock: number | null;
    todayProduction: number | null;
    monthlyProduction: number | null;
    totalSales: number | null;
    monthlySales: number | null;
    receivables: number | null;
    bankBalance: number | null;
    bankRows: number | null;
    totalFreight: number | null;
    distributedExpense: number | null;
    totalOrders: number | null;
    pendingOrders: number | null;
  };
  inventoryByCategory: { category: string; totalStock: number; stockValue: number; rows: InventoryReportRow[] }[];
  inventoryCategoryMix: { label: string; value: number; color: string }[];
  packingMaterials: PackingMaterialRow[];
  production: {
    rows: ProductionReportRow[];
    rowCount: number;
    dailyProduction: number;
    monthlyProduction: number;
    totalProduction: number;
    categoryMix: { label: string; value: number; color: string }[];
    statusMix: { label: string; value: number; color: string }[];
    monthlyTrend: { label: string; amount: number; height: number }[];
  };
  salesAnalysis: {
    totalSales: number;
    monthlySales: number;
    yearlySales: number;
    previousMonthSales: number;
    currentMonthSales: number;
    growthPercentage: number | null;
    monthlyTrend: { label: string; amount: number; height: number }[];
    yearlyTrend: { label: string; amount: number; height: number }[];
  };
  freight: {
    rows: FreightRow[];
    totalFreightExpense: number;
  };
  distributedExpense: {
    rows: DistributedExpenseRow[];
    totalDistributedExpense: number;
  };
  orders: {
    rows: OrderRow[];
    totalOrders: number;
    pendingOrders: number;
    statusMix: { label: string; value: number; color: string }[];
  };
};

const SALES_WINDOW_START = "2025-09-01";
const TODAY = new Date().toISOString().slice(0, 10);
const CURRENT_MONTH = TODAY.slice(0, 7);
const CURRENT_YEAR = TODAY.slice(0, 4);

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

function toYear(value: string | undefined) {
  return value?.slice(0, 4) || "Unknown";
}

function heightFor(value: number, max: number) {
  if (max <= 0) {
    return 0;
  }

  return Math.max(4, Math.round((value / max) * 92));
}

function normalizeStatus(status: string | undefined, outstanding = 0): OrderRow["orderStatus"] {
  const clean = (status || "").toLowerCase();

  if (clean.includes("cancel")) {
    return "Cancelled";
  }

  if (clean.includes("release") || clean.includes("open") || outstanding > 0) {
    return "Processing";
  }

  if (clean.includes("complete") || clean.includes("posted")) {
    return "Completed";
  }

  return "Pending";
}

function includesAny(value: string, terms: string[]) {
  const clean = value.toLowerCase();
  return terms.some((term) => clean.includes(term));
}

function productionGoodsCategory(categoryCode: string, productText: string): ProductionReportRow["goodsCategory"] {
  const cleanCategory = categoryCode.toUpperCase();
  const cleanProduct = productText.toUpperCase();

  if (cleanCategory.startsWith("SMFG") || cleanProduct.includes("SEMI") || cleanProduct.includes("SMFG")) {
    return "Semi-finished Goods";
  }

  if (cleanCategory.startsWith("FG") || cleanProduct.includes("FINISHED") || cleanProduct.includes("FG")) {
    return "Finished Goods";
  }

  return "Other Production";
}

async function fetchEntity<T>(entity: string, query: string, options: { pageLimit?: number } = {}) {
  const config = getBusinessCentralConfig();
  const authHeader = getBusinessCentralAuthHeader();

  if (!config.companyODataUrl || !authHeader) {
    throw new Error("Business Central OData URL or credentials are missing.");
  }

  const rows: T[] = [];
  let count: number | null = null;
  let nextUrl: string | undefined = `${config.companyODataUrl}/${entity}?${query}`;
  let pagesRead = 0;
  const pageLimit = options.pageLimit ?? 1;

  while (nextUrl && pagesRead < pageLimit) {
    const response = await fetch(nextUrl, {
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
    rows.push(...(data.value || []));
    count = data["@odata.count"] ?? count;
    nextUrl = data["@odata.nextLink"];
    pagesRead += 1;
  }

  return {
    rows,
    count,
  };
}

export function formatNpr(value: number | null) {
  if (value === null) {
    return "ERP pending";
  }

  return `NPR ${Math.round(value).toLocaleString("en-US")}`;
}

export function formatQuantity(value: number | null, unit = "") {
  if (value === null) {
    return "ERP pending";
  }

  const formatted = value.toLocaleString("en-US", { maximumFractionDigits: 4 });
  return unit ? `${formatted} ${unit}` : formatted;
}

export function formatPercent(value: number | null) {
  if (value === null) {
    return "ERP pending";
  }

  return `${value.toFixed(1)}%`;
}

function emptyData(message: string, company: string): AGHealthDashboardData {
  return {
    connected: false,
    checkedAt: new Date().toISOString(),
    company,
    error: message,
    dashboard: {
      totalInventoryValue: null,
      packingMaterialStock: null,
      todayProduction: null,
      monthlyProduction: null,
      totalSales: null,
      monthlySales: null,
      receivables: null,
      bankBalance: null,
      bankRows: null,
      totalFreight: null,
      distributedExpense: null,
      totalOrders: null,
      pendingOrders: null,
    },
    inventoryByCategory: [],
    inventoryCategoryMix: [],
    packingMaterials: [],
    production: {
      rows: [],
      rowCount: 0,
      dailyProduction: 0,
      monthlyProduction: 0,
      totalProduction: 0,
      categoryMix: [],
      statusMix: [],
      monthlyTrend: [],
    },
    salesAnalysis: {
      totalSales: 0,
      monthlySales: 0,
      yearlySales: 0,
      previousMonthSales: 0,
      currentMonthSales: 0,
      growthPercentage: null,
      monthlyTrend: [],
      yearlyTrend: [],
    },
    freight: {
      rows: [],
      totalFreightExpense: 0,
    },
    distributedExpense: {
      rows: [],
      totalDistributedExpense: 0,
    },
    orders: {
      rows: [],
      totalOrders: 0,
      pendingOrders: 0,
      statusMix: [],
    },
  };
}

export async function getAGHealthDashboardData(): Promise<AGHealthDashboardData> {
  const status = await getBusinessCentralStatus();

  if (status.status !== "ready-to-query") {
    return emptyData(status.message, status.company);
  }

  try {
    const [itemsResult, salesResult, productionResult, orderResult, orderLineResult, glResult, trialBalanceResult, bankResult] = await Promise.all([
      fetchEntity<ItemRow>(
        "Itemcard",
        "$select=No,Description,Base_Unit_of_Measure,Item_Category_Code,Inventory,Qty_on_Purch_Order,Unit_Cost,Last_Direct_Cost,Inventory_Posting_Group,Unit_Price,Vendor_No,Last_Date_Modified&$count=true",
      ),
      fetchEntity<SalesRow>(
        "SalesDashboard",
        `$filter=Posting_Date ge ${SALES_WINDOW_START}&$select=Posting_Date,Sales_Amount_Actual,Cost_Amount_Actual&$count=true`,
      ),
      fetchEntity<ProductionRow>(
        "Finishedproductionordgers",
        "$select=No,Description,Source_No,Quantity,Location_Code,Starting_Date,Ending_Date,Finished_Date,Routing_No,Status&$top=5000&$count=true",
        { pageLimit: 6 },
      ),
      fetchEntity<SalesOrderRow>(
        "SalesOrder",
        "$select=No,Sell_to_Customer_Name,Order_Date,Posting_Date,Shipment_Date,Status,Amount,Amount_Including_VAT&$top=5000&$count=true",
      ),
      fetchEntity<SalesOrderLineRow>(
        "salesDocumentLines",
        "$select=documentNumber,description,quantity,amount,outstandingQuantity&$top=5000&$count=true",
      ),
      fetchEntity<GeneralLedgerRow>(
        "Generalledgerentries",
        "$select=Posting_Date,Document_No,G_L_Account_Name,Description,Narration,Source_Name,External_Document_No,Amount,Debit_Amount,Global_Dimension_1_Code,Global_Dimension_2_Code&$top=500",
      ),
      fetchEntity<TrialBalanceRow>(
        "ExcelTemplateTrialBalance",
        "$filter=number eq '110405'&$select=number,display,balanceAtDateDebit,balanceAtDateCredit,dateFilter&$count=true",
      ),
      fetchEntity<BankRow>(
        "Bankacccard1",
        "$select=No,Name,Balance_LCY,Bank_Acc_Posting_Group,Bank_Acc_Posting_Group1,Blocked&$count=true",
      ),
    ]);

    const inventoryRows = itemsResult.rows.map((item) => {
      const currentStock = toNumber(item.Inventory);
      const purchaseRate = toNumber(item.Last_Direct_Cost) || toNumber(item.Unit_Cost) || toNumber(item.Unit_Price);
      const category = item.Inventory_Posting_Group || item.Item_Category_Code || "Uncategorized";

      return {
        itemName: item.Description || item.No || "Unnamed item",
        category,
        currentStock,
        unit: item.Base_Unit_of_Measure || "—",
        purchasedQuantity: toNumber(item.Qty_on_Purch_Order),
        purchaseRate,
        supplier: item.Vendor_No || "Not mapped",
        purchaseDate: item.Last_Date_Modified || "Not mapped",
        remainingQuantity: currentStock,
        stockValue: currentStock * purchaseRate,
      };
    });
    const itemCategoryByKey = new Map<string, string>();

    for (const item of itemsResult.rows) {
      const category = item.Inventory_Posting_Group || item.Item_Category_Code || "";

      if (item.No && category) {
        itemCategoryByKey.set(item.No.toUpperCase(), category);
      }

      if (item.Description && category) {
        itemCategoryByKey.set(item.Description.toUpperCase(), category);
      }
    }

    const inventoryByCategory = [...Map.groupBy(inventoryRows, (row) => row.category).entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, rows]) => ({
        category,
        totalStock: rows.reduce((sum, row) => sum + row.currentStock, 0),
        stockValue: rows.reduce((sum, row) => sum + row.stockValue, 0),
        rows: rows
          .sort((a, b) => b.stockValue - a.stockValue)
          .slice(0, 8),
      }));
    const categoryColors = ["#213f67", "#3d78dd", "#e2be2d", "#16a34a", "#8b5cf6", "#f97316", "#64748b"];
    const inventoryCategoryMix = inventoryByCategory
      .slice()
      .sort((a, b) => b.stockValue - a.stockValue)
      .slice(0, 7)
      .map((category, index) => ({
        label: category.category,
        value: category.stockValue,
        color: categoryColors[index % categoryColors.length],
      }));

    const packingMaterials = inventoryRows
      .filter((row) => row.category === "PM")
      .sort((a, b) => b.currentStock - a.currentStock)
      .slice(0, 15)
      .map((row) => ({
        packingMaterialName: row.itemName,
        currentStock: row.currentStock,
        unit: row.unit,
        purchasedQuantity: row.purchasedQuantity,
        purchaseRate: row.purchaseRate,
        supplier: row.supplier,
        purchaseDate: row.purchaseDate,
        remainingQuantity: row.remainingQuantity,
      }));

    const productionRows = productionResult.rows.map((row) => {
      const productionDate = row.Finished_Date || row.Ending_Date || row.Starting_Date || "Not mapped";
      const productName = row.Description || row.Source_No || row.No || "Unnamed product";
      const sourceNumber = row.Source_No || "Not mapped";
      const categoryCode = itemCategoryByKey.get(sourceNumber.toUpperCase()) || itemCategoryByKey.get(productName.toUpperCase()) || "";

      return {
        orderNumber: row.No || "Not mapped",
        sourceNumber,
        productName,
        goodsCategory: productionGoodsCategory(categoryCode, `${productName} ${sourceNumber}`),
        status: row.Status || "Finished",
        productionDate,
        quantityProduced: toNumber(row.Quantity),
        unit: "units",
        productionLine: row.Routing_No || row.Location_Code || "Not mapped",
        materialConsumption: "Not mapped",
      };
    }).sort((a, b) => b.productionDate.localeCompare(a.productionDate));
    const dailyProduction = productionRows
      .filter((row) => row.productionDate === TODAY)
      .reduce((sum, row) => sum + row.quantityProduced, 0);
    const monthlyProduction = productionRows
      .filter((row) => row.productionDate.startsWith(CURRENT_MONTH))
      .reduce((sum, row) => sum + row.quantityProduced, 0);
    const totalProduction = productionRows.reduce((sum, row) => sum + row.quantityProduced, 0);
    const productionMonthlyRaw = [...Map.groupBy(productionRows.filter((row) => row.productionDate !== "Not mapped"), (row) => row.productionDate.slice(0, 7)).entries()]
      .map(([label, rows]) => [label, rows.reduce((sum, row) => sum + row.quantityProduced, 0)] as const)
      .sort(([a], [b]) => a.localeCompare(b));
    const productionMonthlyMax = Math.max(...productionMonthlyRaw.map(([, amount]) => amount), 0);
    const productionCategoryColors: Record<ProductionReportRow["goodsCategory"], string> = {
      "Finished Goods": "#213f67",
      "Semi-finished Goods": "#3d78dd",
      "Other Production": "#e2be2d",
    };
    const productionCategoryMix = (["Finished Goods", "Semi-finished Goods", "Other Production"] as const)
      .map((label) => ({
        label,
        value: productionRows
          .filter((row) => row.goodsCategory === label)
          .reduce((sum, row) => sum + row.quantityProduced, 0),
        color: productionCategoryColors[label],
      }))
      .filter((row) => row.value > 0);
    const productionStatusColors = ["#213f67", "#3d78dd", "#e2be2d", "#16a34a", "#8b5cf6", "#64748b"];
    const productionStatusMix = [...Map.groupBy(productionRows, (row) => row.status || "Not mapped").entries()]
      .map(([label, rows], index) => ({
        label,
        value: rows.length,
        color: productionStatusColors[index % productionStatusColors.length],
      }))
      .filter((row) => row.value > 0);

    const monthlySalesMap = new Map<string, number>();
    const yearlySalesMap = new Map<string, number>();
    let totalSales = 0;

    for (const row of salesResult.rows) {
      const amount = toNumber(row.Sales_Amount_Actual);
      const month = toMonth(row.Posting_Date);
      const year = toYear(row.Posting_Date);
      totalSales += amount;
      monthlySalesMap.set(month, (monthlySalesMap.get(month) || 0) + amount);
      yearlySalesMap.set(year, (yearlySalesMap.get(year) || 0) + amount);
    }

    const monthlyTrendRaw = [...monthlySalesMap.entries()].sort(([a], [b]) => a.localeCompare(b));
    const yearlyTrendRaw = [...yearlySalesMap.entries()].sort(([a], [b]) => a.localeCompare(b));
    const monthlyMax = Math.max(...monthlyTrendRaw.map(([, amount]) => amount), 0);
    const yearlyMax = Math.max(...yearlyTrendRaw.map(([, amount]) => amount), 0);
    const currentMonthSales = monthlySalesMap.get(CURRENT_MONTH) || monthlyTrendRaw.at(-1)?.[1] || 0;
    const previousMonthSales = monthlyTrendRaw.at(-2)?.[1] || 0;
    const growthPercentage = previousMonthSales > 0 ? ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100 : null;
    const yearlySales = yearlySalesMap.get(CURRENT_YEAR) || yearlyTrendRaw.at(-1)?.[1] || 0;

    const orderLinesByDocument = Map.groupBy(orderLineResult.rows, (row) => row.documentNumber || "");
    const orders = orderResult.rows.slice(0, 20).map((order) => {
      const lines = orderLinesByDocument.get(order.No || "") || [];
      const firstLine = lines[0];
      const quantity = lines.reduce((sum, line) => sum + toNumber(line.quantity), 0);
      const amount = toNumber(order.Amount) || lines.reduce((sum, line) => sum + toNumber(line.amount), 0);
      const outstanding = lines.reduce((sum, line) => sum + toNumber(line.outstandingQuantity), 0);
      const orderStatus = normalizeStatus(order.Status, outstanding);

      return {
        orderNumber: order.No || "Not mapped",
        customer: order.Sell_to_Customer_Name || "Not mapped",
        orderDate: order.Order_Date || order.Posting_Date || "Not mapped",
        product: firstLine?.description || "Multiple / not mapped",
        quantity,
        amount,
        orderStatus,
        deliveryStatus: outstanding > 0 ? "Pending delivery" : "Ready / completed",
      };
    });

    const freightRows = glResult.rows
      .filter((row) => includesAny(`${row.G_L_Account_Name} ${row.Description} ${row.Narration}`, ["freight", "transport", "vehicle", "delivery", "distribution"]))
      .slice(0, 15)
      .map((row) => ({
        date: row.Posting_Date || "Not mapped",
        supplierCustomer: row.Source_Name || "Not mapped",
        invoiceReference: row.External_Document_No || row.Document_No || "Not mapped",
        freightAmount: Math.abs(toNumber(row.Amount) || toNumber(row.Debit_Amount)),
        transportCompany: row.Source_Name || "Not mapped",
        relatedPurchaseOrder: row.Document_No || "Not mapped",
        remarks: row.Description || row.Narration || "—",
      }));
    const totalFreightExpense = freightRows.reduce((sum, row) => sum + row.freightAmount, 0);

    const distributedRows = glResult.rows
      .filter((row) => includesAny(`${row.G_L_Account_Name} ${row.Description} ${row.Narration}`, ["distributed", "allocation", "expense", "department"]))
      .slice(0, 15)
      .map((row) => {
        const amount = Math.abs(toNumber(row.Amount) || toNumber(row.Debit_Amount));

        return {
          expenseDate: row.Posting_Date || "Not mapped",
          expenseType: row.G_L_Account_Name || "Expense",
          amount,
          relatedDepartmentOrderProduct: row.Global_Dimension_1_Code || row.Global_Dimension_2_Code || "Not mapped",
          description: row.Description || row.Narration || "—",
          distributedAmount: amount,
        };
      });
    const totalDistributedExpense = distributedRows.reduce((sum, row) => sum + row.distributedAmount, 0);
    const totalInventoryValue = inventoryRows.reduce((sum, row) => sum + row.stockValue, 0);
    const packingMaterialStock = packingMaterials.reduce((sum, row) => sum + row.currentStock, 0);
    const pendingOrders = orders.filter((row) => row.orderStatus === "Pending" || row.orderStatus === "Processing").length;
    const receivablesRow = trialBalanceResult.rows[0];
    const receivables = receivablesRow
      ? toNumber(receivablesRow.balanceAtDateDebit) - toNumber(receivablesRow.balanceAtDateCredit)
      : null;
    const activeBanks = bankResult.rows.filter(
      (row) => !row.Blocked && (row.Bank_Acc_Posting_Group === "BANK" || row.Bank_Acc_Posting_Group1 === "BANK"),
    );
    const bankBalance = activeBanks.reduce((sum, row) => sum + toNumber(row.Balance_LCY), 0);
    const orderStatusColors: Record<OrderRow["orderStatus"], string> = {
      Pending: "#e2be2d",
      Processing: "#3d78dd",
      Completed: "#16a34a",
      Cancelled: "#ef4444",
    };
    const statusMix = (["Pending", "Processing", "Completed", "Cancelled"] as const)
      .map((statusLabel) => ({
        label: statusLabel,
        value: orders.filter((row) => row.orderStatus === statusLabel).length,
        color: orderStatusColors[statusLabel],
      }))
      .filter((row) => row.value > 0);

    return {
      connected: true,
      checkedAt: new Date().toISOString(),
      company: status.company,
      error: null,
      dashboard: {
        totalInventoryValue,
        packingMaterialStock,
        todayProduction: dailyProduction,
        monthlyProduction,
        totalSales,
        monthlySales: currentMonthSales,
        receivables,
        bankBalance,
        bankRows: activeBanks.length,
        totalFreight: totalFreightExpense,
        distributedExpense: totalDistributedExpense,
        totalOrders: orderResult.count ?? orders.length,
        pendingOrders,
      },
      inventoryByCategory,
      inventoryCategoryMix,
      packingMaterials,
      production: {
        rows: productionRows,
        rowCount: productionResult.count ?? productionRows.length,
        dailyProduction,
        monthlyProduction,
        totalProduction,
        categoryMix: productionCategoryMix,
        statusMix: productionStatusMix,
        monthlyTrend: productionMonthlyRaw.map(([label, amount]) => ({ label, amount, height: heightFor(amount, productionMonthlyMax) })),
      },
      salesAnalysis: {
        totalSales,
        monthlySales: currentMonthSales,
        yearlySales,
        previousMonthSales,
        currentMonthSales,
        growthPercentage,
        monthlyTrend: monthlyTrendRaw.map(([label, amount]) => ({ label, amount, height: heightFor(amount, monthlyMax) })),
        yearlyTrend: yearlyTrendRaw.map(([label, amount]) => ({ label, amount, height: heightFor(amount, yearlyMax) })),
      },
      freight: {
        rows: freightRows,
        totalFreightExpense,
      },
      distributedExpense: {
        rows: distributedRows,
        totalDistributedExpense,
      },
      orders: {
        rows: orders,
        totalOrders: orderResult.count ?? orders.length,
        pendingOrders,
        statusMix,
      },
    };
  } catch (error) {
    return emptyData(error instanceof Error ? error.message : "ERP data extraction failed.", status.company);
  }
}
