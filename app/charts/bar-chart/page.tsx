"use client";

import { useState } from "react";

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb";
import {
  BarChart,
  type BarChartEventProps,
} from "@/components/charts/bar-chart";

import {
  costData,
  departmentData,
  fundData,
  regionData,
  salesData,
} from "./data";
import { BarChartDocs } from "./docs";

export default function BarChartPage() {
  const [event, setEvent] = useState<BarChartEventProps>(null);

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DemoBreadcrumb />
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Bar Chart
        </h1>
        <p className="text-muted-foreground mb-10">
          A responsive bar chart with vertical and horizontal layouts, stacked
          and percentage modes, interactive legend, and click events on bars and
          categories. Powered by Recharts, inspired by Tremor.
        </p>

        <div className="space-y-12">
          {/* Section 1: Basic */}
          <section>
            <h2 className="text-base font-medium mb-1">Basic</h2>
            <p className="text-sm text-muted-foreground mb-4">
              A single-category bar chart with a value formatter.
            </p>
            <BarChart
              data={salesData}
              index="month"
              categories={["Sales"]}
              valueFormatter={(v) => `$${v.toLocaleString()}`}
            />
          </section>

          {/* Section 2: Multi-Category */}
          <section>
            <h2 className="text-base font-medium mb-1">Multi-Category</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Multiple categories rendered side by side with distinct colors and
              a shared legend.
            </p>
            <BarChart
              data={departmentData}
              index="month"
              categories={["Engineering", "Marketing", "Support"]}
              valueFormatter={(v) => `${v.toLocaleString()} hrs`}
            />
          </section>

          {/* Section 3: Stacked */}
          <section>
            <h2 className="text-base font-medium mb-1">Stacked</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Bars stacked on top of each other to show cumulative totals.
            </p>
            <BarChart
              data={departmentData}
              index="month"
              categories={["Engineering", "Marketing", "Support"]}
              type="stacked"
              valueFormatter={(v) => `${v.toLocaleString()} hrs`}
            />
          </section>

          {/* Section 4: Percent Stacked */}
          <section>
            <h2 className="text-base font-medium mb-1">Percent Stacked</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Stacked bars normalized to 100% to show relative proportions
              across categories.
            </p>
            <BarChart
              data={departmentData}
              index="month"
              categories={["Engineering", "Marketing", "Support"]}
              type="percent"
              valueFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            />
          </section>

          {/* Section 5: Vertical */}
          <section>
            <h2 className="text-base font-medium mb-1">Vertical</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Horizontal bars — ideal for long category labels like region
              names.
            </p>
            <BarChart
              data={regionData}
              index="region"
              categories={["Revenue"]}
              layout="vertical"
              rounded
              showGridLines={false}
              valueFormatter={(v) => `$${v.toLocaleString()}`}
            />
          </section>

          {/* Section 6: Vertical Stacked */}
          <section>
            <h2 className="text-base font-medium mb-1">Vertical Stacked</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Horizontal stacked bars for comparing multi-category totals across
              groups.
            </p>
            <BarChart
              data={costData}
              index="quarter"
              categories={["Personnel", "Infrastructure", "Marketing"]}
              layout="vertical"
              type="stacked"
              valueFormatter={(v) => `$${v.toLocaleString()}k`}
            />
          </section>

          {/* Section 7: Interactive */}
          <section>
            <h2 className="text-base font-medium mb-1">Interactive</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Click a bar or legend item to select it. Click again or click the
              background to deselect.
            </p>
            <BarChart
              data={departmentData}
              index="month"
              categories={["Engineering", "Marketing", "Support"]}
              valueFormatter={(v) => `${v.toLocaleString()} hrs`}
              onValueChange={(v) => setEvent(v)}
            />
            <p className="mt-4 text-sm font-mono text-muted-foreground">
              onValueChange:{" "}
              <span className="text-foreground">
                {JSON.stringify(event, null, 2)}
              </span>
            </p>
          </section>

          {/* Section 8: Label Truncation */}
          <section>
            <h2 className="text-base font-medium mb-1">Label Truncation</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Use{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                labelTruncateAt
              </code>{" "}
              to clip long axis labels at a given character count. Toggle{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                tooltipFullLabel
              </code>{" "}
              to control whether the tooltip shows the full or truncated text.
            </p>
            <BarChart
              data={fundData}
              index="fund"
              categories={["Cotas"]}
              layout="vertical"
              colors={["emerald"]}
              labelTruncateAt={18}
              tooltipFullLabel={true}
              showLegend={false}
              // rounded
              showGridLines={false}
              valueFormatter={(v) => v.toLocaleString()}
            />
          </section>

          {/* Section 10: Custom Formatting */}
          <section>
            <h2 className="text-base font-medium mb-1">Custom Formatting</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Custom colors, no legend, and wider bar gaps via{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                barCategoryGap
              </code>
              .
            </p>
            <BarChart
              data={departmentData}
              index="month"
              categories={["Engineering", "Marketing", "Support"]}
              colors={["violet", "amber", "rose"]}
              valueFormatter={(v) => `${v.toLocaleString()} hrs`}
              showLegend={false}
              barCategoryGap="35%"
            />
          </section>
        </div>

        <div className="mt-16">
          <BarChartDocs />
        </div>
      </div>
    </main>
  );
}
