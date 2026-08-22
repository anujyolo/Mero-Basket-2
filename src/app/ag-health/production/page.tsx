import { AGHealthShell, BarChart, ExecutiveKpiCard, HeroPanel, MetricCard, PieChartCard, SectionHeader, dashboardIcons } from "../_components";
import { formatNpr, formatQuantity, getAGHealthDashboardData } from "@/server/business-central/data";
import { ProductionReport } from "./production-report";

export const dynamic = "force-dynamic";

const compactUnits = (value: number) => `${new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
}).format(value)} units`;

export default async function ProductionPage() {
  const data = await getAGHealthDashboardData();
  const productionBars = data.production.monthlyTrend.slice(-12);
  const finishedGoods = data.production.goodsRows.filter((row) => row.goodsType === "Finished Good");
  const semiFinishedGoods = data.production.goodsRows.filter((row) => row.goodsType === "Semi-finished Good");
  const fgQuantity = finishedGoods.reduce((sum, row) => sum + row.inventory, 0);
  const fgValue = finishedGoods.reduce((sum, row) => sum + row.stockValue, 0);
  const smfgQuantity = semiFinishedGoods.reduce((sum, row) => sum + row.inventory, 0);
  const smfgValue = semiFinishedGoods.reduce((sum, row) => sum + row.stockValue, 0);
  const positiveFgCount = finishedGoods.filter((row) => row.inventory > 0).length;
  const positiveSmfgCount = semiFinishedGoods.filter((row) => row.inventory > 0).length;
  const goodsValueMix = [
    { label: "Finished Goods", value: fgValue, color: "#213f67" },
    { label: "Semi-finished Goods", value: smfgValue, color: "#3d78dd" },
  ].filter((row) => row.value > 0);
  const goodsStatusMix = [
    { label: "In stock", value: data.production.goodsRows.filter((row) => row.status === "In stock").length, color: "#16a34a" },
    { label: "Finished / zero stock", value: data.production.goodsRows.filter((row) => row.status === "Finished / zero stock").length, color: "#e2be2d" },
  ].filter((row) => row.value > 0);
  const loadedRows = data.production.rows.length;
  const availableRows = data.production.rowCount || loadedRows;

  return (
    <AGHealthShell active="production" company={data.company} connected={data.connected}>
      <HeroPanel
        eyebrow="Production"
        title="Live finished and semi-finished product stock"
        description="This follows the reference production page: production output context at the top, then current finished-goods and semi-finished-goods product stock from ERP Itemcard."
        stats={[
          { label: "Production stock lines", value: data.production.goodsRows.length.toLocaleString("en-US"), note: `${finishedGoods.length} FG and ${semiFinishedGoods.length} SMFG items from ERP Itemcard.`, icon: dashboardIcons.Route },
          { label: "Finished goods quantity", value: formatQuantity(fgQuantity), note: `${positiveFgCount.toLocaleString("en-US")} positive-stock finished goods.`, icon: dashboardIcons.Factory },
          { label: "Semi-finished quantity", value: formatQuantity(smfgQuantity), note: `${positiveSmfgCount.toLocaleString("en-US")} positive-stock semi-finished items.`, icon: dashboardIcons.BarChart3 },
          { label: "Production output rows", value: loadedRows.toLocaleString("en-US"), note: `${availableRows.toLocaleString("en-US")} output rows reported by Business Central.`, icon: dashboardIcons.Route },
        ]}
        actions={[
          { label: "Sales Analysis", href: "/ag-health/sales-analysis" },
          { label: "Inventory Report", href: "/ag-health/inventory-report" },
          { label: "Orders", href: "/ag-health/orders" },
        ]}
      />
      <section className="mt-10">
        <SectionHeader eyebrow="Production Output" title="Production snapshot">
          Production is organized like the reference: live output context plus the current FG/SMFG product stock table. Search and filters below let you manually find any product.
        </SectionHeader>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <ExecutiveKpiCard title="Latest Production Output" value={data.production.rows[0] ? formatQuantity(data.production.rows[0].quantityProduced, "units") : "ERP pending"} detail={data.production.rows[0]?.productionDate || "No production output date mapped."} source="Finishedproductionordgers" icon={dashboardIcons.Factory} />
          <ExecutiveKpiCard title="12-Month / Loaded Output" value={formatQuantity(data.production.totalProduction, "units")} detail={`${loadedRows.toLocaleString("en-US")} output rows loaded; ${availableRows.toLocaleString("en-US")} rows reported by ERP.`} source="Finishedproductionordgers" icon={dashboardIcons.BarChart3} />
          <ExecutiveKpiCard title="Production Stock Lines" value={data.production.goodsRows.length.toLocaleString("en-US")} detail={`${finishedGoods.length.toLocaleString("en-US")} FG items and ${semiFinishedGoods.length.toLocaleString("en-US")} SMFG items from live Itemcard.`} source="Itemcard: FG / SMFG" accent="gold" icon={dashboardIcons.Route} />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Finished Goods" value={finishedGoods.length.toLocaleString("en-US")} note={`${positiveFgCount.toLocaleString("en-US")} positive-stock finished-good items.`} icon={dashboardIcons.Boxes} />
          <MetricCard label="FG Quantity" value={formatQuantity(fgQuantity)} note={`${formatNpr(fgValue)} current FG stock value.`} icon={dashboardIcons.Boxes} />
          <MetricCard label="Semi-finished Goods" value={semiFinishedGoods.length.toLocaleString("en-US")} note={`${positiveSmfgCount.toLocaleString("en-US")} positive-stock semi-finished items.`} icon={dashboardIcons.PackageCheck} />
          <MetricCard label="SMFG Quantity" value={formatQuantity(smfgQuantity)} note={`${formatNpr(smfgValue)} current SMFG stock value.`} icon={dashboardIcons.PackageCheck} />
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <BarChart
            title="Monthly Production Output"
            bars={productionBars}
            valueFormatter={(value) => formatQuantity(value, "units")}
            axisFormatter={compactUnits}
            note="Monthly output from all extracted production rows, placed like the reference dashboard but using AG Health ERP data."
          />
          <PieChartCard title="Production Stock Value by Goods Type" slices={goodsValueMix} valueFormatter={formatNpr} />
        </div>
      </section>
      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <PieChartCard title="Production Stock Status" slices={goodsStatusMix} valueFormatter={(value) => formatQuantity(value)} />
        <article className="analysis-panel">
          <h3 className="text-2xl font-black text-[var(--ink)]">Inventory context for finished goods</h3>
          <p className="mt-3 text-sm font-semibold leading-6 text-[var(--text)]">This is only stock context. The searchable production register below remains production-only.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <MetricCard label="FG inventory groups" value={finishedGoods.length.toLocaleString("en-US")} note={`${formatQuantity(fgQuantity)} stock · ${formatNpr(fgValue)}`} icon={dashboardIcons.Boxes} />
            <MetricCard label="SMFG inventory groups" value={semiFinishedGoods.length.toLocaleString("en-US")} note={`${formatQuantity(smfgQuantity)} stock · ${formatNpr(smfgValue)}`} icon={dashboardIcons.PackageCheck} />
          </div>
        </article>
      </section>
      <div className="mt-8">
        <ProductionReport rows={data.production.goodsRows} />
      </div>
    </AGHealthShell>
  );
}
