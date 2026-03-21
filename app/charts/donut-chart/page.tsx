"use client";

import { useState } from "react";

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb";
import {
  DonutChart,
  type DonutChartEventProps,
} from "@/components/charts/donut-chart";

import { browserData, revenueData } from "./data";
import { DonutChartDocs } from "./docs";

export default function DonutChartPage() {
  const [event, setEvent] = useState<DonutChartEventProps>(null);

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DemoBreadcrumb />
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Donut Chart
        </h1>
        <p className="text-muted-foreground mb-10">
          A donut and pie chart for visualizing part-to-whole relationships.
          Supports center labels, click interactions, and custom tooltips.
          Powered by Recharts, inspired by Tremor.
        </p>

        <div className="space-y-12">
          {/* Section 1: Donut */}
          <section>
            <h2 className="text-base font-medium mb-1">Donut</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Basic donut chart with a value formatter.
            </p>
            <div className="h-48">
              <DonutChart
                data={browserData}
                category="browser"
                value="share"
                valueFormatter={(v) => `${v}%`}
              />
            </div>
          </section>

          {/* Section 2: With Center Label */}
          <section>
            <h2 className="text-base font-medium mb-1">Center Label</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Enable{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                showLabel
              </code>{" "}
              to show the sum of all values in the center. Pass a custom{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                label
              </code>{" "}
              to override it.
            </p>
            <div className="flex items-center gap-8 flex-wrap">
              <div className="h-48">
                <p className="text-xs text-muted-foreground mb-2">Auto total</p>
                <DonutChart
                  data={browserData}
                  category="browser"
                  value="share"
                  showLabel
                  valueFormatter={(v) => `${v}%`}
                />
              </div>
              <div className="h-48">
                <p className="text-xs text-muted-foreground mb-2">
                  Custom label
                </p>
                <DonutChart
                  data={revenueData}
                  category="region"
                  value="revenue"
                  showLabel
                  label="Revenue"
                  valueFormatter={(v) => `$${v.toLocaleString()}`}
                />
              </div>
            </div>
          </section>

          {/* Section 3: Thickness */}
          <section>
            <h2 className="text-base font-medium mb-1">Thickness</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Control the ring width with{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                thickness
              </code>{" "}
              (0–100). 0 is a thin ring, 100 is a solid pie.
            </p>
            <div className="flex items-center gap-8 flex-wrap">
              {([10, 25, 50, 100] as const).map((t) => (
                <div key={t} className="h-40">
                  <p className="text-xs text-muted-foreground mb-2">{t}</p>
                  <DonutChart
                    data={browserData}
                    category="browser"
                    value="share"
                    thickness={t}
                    valueFormatter={(v) => `${v}%`}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Custom Colors */}
          <section>
            <h2 className="text-base font-medium mb-1">Custom Colors</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Override the default palette with any{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                ChartColor[]
              </code>
              .
            </p>
            <div className="h-48">
              <DonutChart
                data={revenueData}
                category="region"
                value="revenue"
                colors={["violet", "amber", "rose", "teal"]}
                valueFormatter={(v) => `$${v.toLocaleString()}`}
              />
            </div>
          </section>

          {/* Section 5: Legend */}
          <section>
            <h2 className="text-base font-medium mb-1">Legend</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Enable{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                showLegend
              </code>{" "}
              to show category labels and values alongside the chart. Control
              placement with{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                legendPosition
              </code>
              .
            </p>
            <div className="space-y-8">
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  right (default)
                </p>
                <DonutChart
                  data={browserData}
                  category="browser"
                  value="share"
                  valueFormatter={(v) => `${v}%`}
                  showLegend
                  legendPosition="right"
                  className="h-48"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-3">left</p>
                <DonutChart
                  data={browserData}
                  category="browser"
                  value="share"
                  valueFormatter={(v) => `${v}%`}
                  showLegend
                  legendPosition="left"
                  className="h-48"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-3">bottom</p>
                <DonutChart
                  data={revenueData}
                  category="region"
                  value="revenue"
                  valueFormatter={(v) => `$${v.toLocaleString()}`}
                  showLegend
                  legendPosition="bottom"
                  className="h-48"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-3">top</p>
                <DonutChart
                  data={revenueData}
                  category="region"
                  value="revenue"
                  valueFormatter={(v) => `$${v.toLocaleString()}`}
                  showLegend
                  legendPosition="top"
                  className="h-48"
                />
              </div>
            </div>
          </section>

          {/* Section 6: No Tooltip */}
          <section>
            <h2 className="text-base font-medium mb-1">No Tooltip</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Disable the hover tooltip with{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                showTooltip={"{false}"}
              </code>
              .
            </p>
            <div className="h-48">
              <DonutChart
                data={browserData}
                category="browser"
                value="share"
                showTooltip={false}
                valueFormatter={(v) => `${v}%`}
              />
            </div>
          </section>

          {/* Section 6: Interactive */}
          <section>
            <h2 className="text-base font-medium mb-1">Interactive</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Click a segment to select it — others dim to 30% opacity. Click
              again or the background to deselect.
            </p>
            <div className="h-48">
              <DonutChart
                data={browserData}
                category="browser"
                value="share"
                valueFormatter={(v) => `${v}%`}
                onValueChange={(v) => setEvent(v)}
              />
            </div>
            <p className="mt-4 text-sm font-mono text-muted-foreground">
              onValueChange:{" "}
              <span className="text-foreground">
                {JSON.stringify(event, null, 2)}
              </span>
            </p>
          </section>
        </div>

        <div className="mt-16">
          <DonutChartDocs />
        </div>
      </div>
    </main>
  );
}
