"use client";

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb";
import {
  WaterfallChart,
  type WaterfallChartDatum,
} from "@/components/charts/waterfall-chart";

import { WaterfallChartDocs } from "./docs";

const cashFlow: WaterfallChartDatum[] = [
  { label: "Opening balance", value: 1200, type: "total" },
  { label: "Subscriptions", value: 480, type: "delta" },
  { label: "Redemptions", value: -260, type: "delta" },
  { label: "Income", value: 150, type: "delta" },
  { label: "Fees", value: -90, type: "delta" },
  { label: "Closing balance", value: 1480, type: "total" },
];

const priceBuildup: WaterfallChartDatum[] = [
  { label: "List price", value: 100, type: "total" },
  { label: "Volume discount", value: -12, type: "delta" },
  { label: "Promo", value: -6, type: "delta" },
  { label: "Freight", value: 4, type: "delta" },
  { label: "Taxes", value: 18, type: "delta" },
  { label: "Net price", value: 104, type: "total" },
];

const fmtUsd = (v: number) => `$${v.toLocaleString()}`;

export default function WaterfallChartPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DemoBreadcrumb />
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Waterfall Chart
        </h1>
        <p className="text-muted-foreground mb-10">
          A waterfall chart for explaining how a starting total becomes an
          ending total through a sequence of additions and subtractions.
          Totals anchor at zero; deltas float from the running total, with
          dashed connectors bridging consecutive bars. Powered by Recharts.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-base font-medium mb-1">Cash Flow Bridge</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Two <code>type: &quot;total&quot;</code> anchors (opening and
              closing) with signed <code>type: &quot;delta&quot;</code> steps in
              between.
            </p>
            <div className="h-80">
              <WaterfallChart data={cashFlow} valueFormatter={fmtUsd} />
            </div>
          </section>

          <section>
            <h2 className="text-base font-medium mb-1">Custom Colors</h2>
            <p className="text-sm text-muted-foreground mb-4">
              <code>totalsColor</code>, <code>additionsColor</code> and{" "}
              <code>subtractionsColor</code> accept palette names or hex.
            </p>
            <div className="h-80">
              <WaterfallChart
                data={priceBuildup}
                totalsColor="indigo"
                additionsColor="teal"
                subtractionsColor="rose"
              />
            </div>
          </section>

          <section>
            <h2 className="text-base font-medium mb-1">Minimal</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Grid, connectors and legend can be turned off independently.
            </p>
            <div className="h-64">
              <WaterfallChart
                data={priceBuildup}
                showGridLines={false}
                showConnectors={false}
                showLegend={false}
              />
            </div>
          </section>
        </div>

        <div className="mt-16">
          <WaterfallChartDocs />
        </div>
      </div>
    </main>
  );
}
