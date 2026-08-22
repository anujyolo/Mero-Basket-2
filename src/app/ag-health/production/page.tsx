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
  const finishedGoods = data.inventoryByCategory.filter((category) => category.category.startsWith("FG"));
  const semiFinishedGoods = data.inventoryByCategory.filter((category) => category.category.startsWith("SMFG"));
  const fgQuantity = finishedGoods.reduce((sum, category) => sum + category.totalStock, 0);
  const fgValue = finishedGoods.reduce((sum, category) => sum + category.stockValue, 0);
  const smfgQuantity = semiFinishedGoods.reduce((sum, category) => sum + category.totalStock, 0);
  const smfgValue = semiFinishedGoods.reduce((sum, category) => sum + category.stockValue, 0);
  const finishedProduction = data.production.categoryMix.find((row) => row.label === "Finished Goods")?.value || 0;
  const semiFinishedProduction = data.production.categoryMix.find((row) => row.label === "Semi-finished Goods")?.value || 0;
  const otherProduction = data.production.categoryMix.find((row) => row.label === "Other Production")?.value || 0;
  const loadedRows = data.production.rows.length;
  const availableRows = data.production.rowCount || loadedRows;

  return (
    <AGHealthShell active="production" company={data.company} connected={data.connected}>
      <HeroPanel
        eyebrow="Production"
        title="Premium production report"
        description="A clean production-only view: live totals, finished/semi-finished categorization, easy charts, and a searchable register for every extracted production row."
        stats={[
          { label: "Loaded rows", value: loadedRows.toLocaleString("en-US"), note: `${availableRows.toLocaleString("en-US")} rows reported by Business Central.`, icon: dashboardIcons.Route },
          { label: "Daily production", value: formatQuantity(data.production.dailyProduction, "units"), note: "Rows finished today.", icon: dashboardIcons.Factory },
          { label: "Monthly production", value: formatQuantity(data.production.monthlyProduction, "units"), note: "Rows finished in current month.", icon: dashboardIcons.BarChart3 },
          { label: "Total production", value: formatQuantity(data.production.totalProduction, "units"), note: "Total extracted production output.", icon: dashboardIcons.Route },
        ]}
        actions={[
          { label: "Sales Analysis", href: "/ag-health/sales-analysis" },
          { label: "Inventory Report", href: "/ag-health/inventory-report" },
          { label: "Orders", href: "/ag-health/orders" },
        ]}
      />
      <section className="mt-10">
        <SectionHeader eyebrow="Production Output" title="Production snapshot">
          Production uses finished production order rows only. Daily, monthly, and total production are calculated separately from sales and inventory.
        </SectionHeader>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <ExecutiveKpiCard title="Today’s Production" value={formatQuantity(data.production.dailyProduction, "units")} detail="Finished production order quantity dated today." source="Finishedproductionordgers" icon={dashboardIcons.Factory} />
          <ExecutiveKpiCard title="Monthly Production" value={formatQuantity(data.production.monthlyProduction, "units")} detail="Finished production quantity in the current month." source="Finishedproductionordgers" icon={dashboardIcons.BarChart3} />
          <ExecutiveKpiCard title="Total Production" value={formatQuantity(data.production.totalProduction, "units")} detail={`${loadedRows.toLocaleString("en-US")} rows loaded for this report; ${availableRows.toLocaleString("en-US")} rows reported by ERP.`} source="Finishedproductionordgers" accent="gold" icon={dashboardIcons.Route} />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Finished production" value={formatQuantity(finishedProduction, "units")} note="Production rows categorized as finished goods." icon={dashboardIcons.Boxes} />
          <MetricCard label="Semi-finished production" value={formatQuantity(semiFinishedProduction, "units")} note="Production rows categorized as semi-finished goods." icon={dashboardIcons.PackageCheck} />
          <MetricCard label="Other production" value={formatQuantity(otherProduction, "units")} note="Production rows not matched to FG/SMFG." icon={dashboardIcons.Route} />
          <MetricCard label="Latest production" value={data.production.rows[0] ? formatQuantity(data.production.rows[0].quantityProduced, "units") : "ERP pending"} note={data.production.rows[0]?.productName || "No production rows mapped."} icon={dashboardIcons.Factory} />
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <BarChart
            title="Monthly Production Output"
            bars={productionBars}
            valueFormatter={(value) => formatQuantity(value, "units")}
            axisFormatter={compactUnits}
            note="Monthly output from all extracted production rows, placed like the reference dashboard but using AG Health ERP data."
          />
          <PieChartCard title="Production by Goods Category" slices={data.production.categoryMix} valueFormatter={(value) => formatQuantity(value, "units")} />
        </div>
      </section>
      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <PieChartCard title="Production Order Status" slices={data.production.statusMix} valueFormatter={(value) => formatQuantity(value)} />
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
        <ProductionReport rows={data.production.rows} />
      </div>
    </AGHealthShell>
  );
}
