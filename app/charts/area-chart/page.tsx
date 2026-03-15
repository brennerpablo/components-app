"use client";

import { useState } from "react";

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb";
import {
  AreaChart,
  type AreaChartEventProps,
} from "@/components/charts/area-chart";

import { aumData, revenueData, trafficData } from "./data";
import { AreaChartDocs } from "./docs";

export default function AreaChartPage() {
  const [event, setEvent] = useState<AreaChartEventProps>(null);

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DemoBreadcrumb />
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Area Chart
        </h1>
        <p className="text-muted-foreground mb-10">
          A responsive area chart with gradient, solid, and no-fill modes.
          Supports stacked and percentage layouts, interactive legend with
          slider, custom tooltips, and click events on dots and categories.
          Powered by Recharts, inspired by Tremor.
        </p>

        <div className="space-y-12">
          {/* Section 1: Single series */}
          <section>
            <h2 className="text-base font-medium mb-1">Single Series</h2>
            <p className="text-sm text-muted-foreground mb-4">
              A basic single-category chart with a gradient fill and value
              formatter.
            </p>
            <AreaChart
              data={revenueData}
              index="month"
              categories={["Revenue"]}
              valueFormatter={(v) => `$${v.toLocaleString()}`}
            />
          </section>

          {/* Section 2: Multi-series */}
          <section>
            <h2 className="text-base font-medium mb-1">Multi-Series</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Multiple categories rendered with distinct colors and a shared
              legend.
            </p>
            <AreaChart
              data={trafficData}
              index="month"
              categories={["Organic", "Direct", "Referral"]}
            />
          </section>

          {/* Section 3: Stacked */}
          <section>
            <h2 className="text-base font-medium mb-1">Stacked</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Areas stacked on top of each other with solid fills to clearly
              show cumulative totals.
            </p>
            <AreaChart
              data={trafficData}
              index="month"
              categories={["Organic", "Direct", "Referral"]}
              type="stacked"
              fill="solid"
            />
          </section>

          {/* Section 4: Percent */}
          <section>
            <h2 className="text-base font-medium mb-1">Percentage</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Normalizes each data point to 100%, useful for showing
              proportional breakdown over time.
            </p>
            <AreaChart
              data={trafficData}
              index="month"
              categories={["Organic", "Direct", "Referral"]}
              type="percent"
            />
          </section>

          {/* Section 5: Data Point Labels */}
          <section>
            <h2 className="text-base font-medium mb-1">Data Point Labels</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Shows formatted values directly on each data point. Enable{" "}
              <code>showDataPointLabelBackground</code> to add a rounded tinted
              pill behind each label.
            </p>
            <AreaChart
              data={trafficData}
              index="month"
              categories={["Organic", "Direct", "Referral"]}
              showDataPointLabels
              showDataPointLabelBackground
            />
          </section>

          {/* Section 7: Minimal / line-only */}
          <section>
            <h2 className="text-base font-medium mb-1">Minimal (No Fill)</h2>
            <p className="text-sm text-muted-foreground mb-4">
              A clean line-only look with no fill, no legend, and no grid lines.
            </p>
            <AreaChart
              data={revenueData}
              index="month"
              categories={["Revenue"]}
              fill="none"
              showLegend={false}
              showGridLines={false}
              valueFormatter={(v) => `$${v.toLocaleString()}`}
            />
          </section>

          {/* Section 8: Interactive */}
          <section>
            <h2 className="text-base font-medium mb-1">Interactive</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Click a dot or legend item to highlight a category. The selected
              event is shown below.
            </p>
            <AreaChart
              data={trafficData}
              index="month"
              categories={["Organic", "Direct", "Referral"]}
              onValueChange={(v) => setEvent(v)}
            />
            {event && (
              <div className="mt-3 rounded-md bg-muted px-4 py-2 text-sm text-muted-foreground">
                <pre>{JSON.stringify(event, null, 2)}</pre>
              </div>
            )}
          </section>

          {/* Section: AUM by Fund Category */}
          <section>
            <h2 className="text-base font-medium mb-1">AUM by Fund Category</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Total assets under management (USD millions) across six fund
              categories over the trailing 12 months.
            </p>
            <AreaChart
              data={aumData}
              index="month"
              categories={[
                "Equities",
                "Fixed Income",
                "Real Estate",
                "Private Equity",
                "Infrastructure",
                "Hedge Funds",
              ]}
              type="stacked"
              fill="solid"
              valueFormatter={(v) => `$${v.toLocaleString()}M`}
              tooltipShowTotal
              showTotalDataPointLabels
              totalDataPointLabelPosition="top"
            />
          </section>
        </div>

        <div className="mt-16">
          <AreaChartDocs />
        </div>
      </div>
    </main>
  );
}
