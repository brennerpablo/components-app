"use client";

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb";
import { CompositionBar } from "@/components/charts/composition-bar";

import { emptyData, portfolioData, skewedData, trafficData } from "./data";
import { CompositionBarDocs } from "./docs";

const currency = (v: number) =>
  `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const compact = (v: number) => v.toLocaleString("en-US");

export default function CompositionBarPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DemoBreadcrumb />
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Composition Bar
        </h1>
        <p className="text-muted-foreground mb-10">
          A single horizontal stacked bar showing how a total breaks down across
          categories, with an aligned legend listing each category&apos;s value
          and share. Hovering a segment or a legend row highlights both. Pure
          CSS — no charting library required.
        </p>

        <div className="space-y-12">
          {/* Section 1: Basic */}
          <section>
            <h2 className="text-base font-medium mb-1">Basic</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Pass{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">data</code>
              , <code className="text-xs bg-muted px-1 py-0.5 rounded">
                category
              </code>{" "}
              and{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">value</code>
              . Percentages are computed against the sum of all values.
            </p>
            <div className="max-w-md">
              <CompositionBar
                data={portfolioData}
                category="assetClass"
                value="amount"
                valueFormatter={currency}
              />
            </div>
          </section>

          {/* Section 2: Sort Order */}
          <section>
            <h2 className="text-base font-medium mb-1">Sort Order</h2>
            <p className="text-sm text-muted-foreground mb-4">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                sortOrder
              </code>{" "}
              reorders segments by value. Use{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                &quot;none&quot;
              </code>{" "}
              to preserve the input array order.
            </p>
            <div className="grid gap-8 sm:grid-cols-3">
              {(["none", "descending", "ascending"] as const).map((order) => (
                <div key={order}>
                  <p className="text-xs text-muted-foreground mb-3">{order}</p>
                  <CompositionBar
                    data={trafficData}
                    category="source"
                    value="sessions"
                    sortOrder={order}
                    valueFormatter={compact}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Bar Height */}
          <section>
            <h2 className="text-base font-medium mb-1">Bar Height</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Control the thickness of the bar with{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                barHeight
              </code>{" "}
              (pixels).
            </p>
            <div className="max-w-md space-y-6">
              {([6, 12, 24] as const).map((h) => (
                <div key={h}>
                  <p className="text-xs text-muted-foreground mb-2">{h}px</p>
                  <CompositionBar
                    data={portfolioData}
                    category="assetClass"
                    value="amount"
                    barHeight={h}
                    showLegend={false}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Custom Colors */}
          <section>
            <h2 className="text-base font-medium mb-1">Custom Colors</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Override the palette with any{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                ChartColor[]
              </code>{" "}
              — or raw hex strings for brand colors.
            </p>
            <div className="grid gap-8 sm:grid-cols-2 max-w-3xl">
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  Palette names
                </p>
                <CompositionBar
                  data={portfolioData}
                  category="assetClass"
                  value="amount"
                  colors={["violet", "amber", "rose", "teal", "cyan"]}
                  valueFormatter={currency}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-3">Hex values</p>
                <CompositionBar
                  data={portfolioData}
                  category="assetClass"
                  value="amount"
                  colors={["#0f766e", "#0ea5e9", "#a855f7", "#f59e0b", "#ef4444"]}
                  valueFormatter={currency}
                />
              </div>
            </div>
          </section>

          {/* Section 5: Formatters */}
          <section>
            <h2 className="text-base font-medium mb-1">Formatters</h2>
            <p className="text-sm text-muted-foreground mb-4">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                valueFormatter
              </code>{" "}
              formats the raw value;{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                percentFormatter
              </code>{" "}
              formats the share. Both apply to the legend and the tooltip.
            </p>
            <div className="max-w-md">
              <CompositionBar
                data={trafficData}
                category="source"
                value="sessions"
                sortOrder="descending"
                valueFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                percentFormatter={(p) => `${Math.round(p)}%`}
              />
            </div>
          </section>

          {/* Section 6: Minimum Segment Width */}
          <section>
            <h2 className="text-base font-medium mb-1">
              Minimum Segment Width
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                minSegmentPercent
              </code>{" "}
              inflates slices below the given percentage so they stay visible;
              the excess is reclaimed from the largest segment. The legend always
              shows the <em>true</em> percentage. Note the 0.0% Trial slice
              below.
            </p>
            <div className="grid gap-8 sm:grid-cols-2 max-w-3xl">
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  0 (true widths)
                </p>
                <CompositionBar
                  data={skewedData}
                  category="segment"
                  value="revenue"
                  minSegmentPercent={0}
                  valueFormatter={currency}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  2 (floor applied)
                </p>
                <CompositionBar
                  data={skewedData}
                  category="segment"
                  value="revenue"
                  minSegmentPercent={2}
                  valueFormatter={currency}
                />
              </div>
            </div>
          </section>

          {/* Section 7: Without Legend / Tooltip */}
          <section>
            <h2 className="text-base font-medium mb-1">Legend & Tooltip</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Turn either off with{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                showLegend={"{false}"}
              </code>{" "}
              or{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                showTooltip={"{false}"}
              </code>
              . With the tooltip off, hover dimming is disabled too.
            </p>
            <div className="grid gap-8 sm:grid-cols-2 max-w-3xl">
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  Bar only (no legend)
                </p>
                <CompositionBar
                  data={portfolioData}
                  category="assetClass"
                  value="amount"
                  showLegend={false}
                  valueFormatter={currency}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  Static (no tooltip)
                </p>
                <CompositionBar
                  data={portfolioData}
                  category="assetClass"
                  value="amount"
                  showTooltip={false}
                  valueFormatter={currency}
                />
              </div>
            </div>
          </section>

          {/* Section 8: Fill Parent */}
          <section>
            <h2 className="text-base font-medium mb-1">Fill Parent</h2>
            <p className="text-sm text-muted-foreground mb-4">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                fillParent
              </code>{" "}
              stretches the component to the parent&apos;s height and spreads the
              legend rows evenly — useful inside fixed-height cards so the chart
              balances with its siblings.
            </p>
            <div className="grid gap-8 sm:grid-cols-2 max-w-3xl">
              <div className="h-72 rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground mb-3">default</p>
                <CompositionBar
                  data={portfolioData}
                  category="assetClass"
                  value="amount"
                  valueFormatter={currency}
                />
              </div>
              <div className="flex h-72 flex-col rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground mb-3">fillParent</p>
                <CompositionBar
                  data={portfolioData}
                  category="assetClass"
                  value="amount"
                  valueFormatter={currency}
                  fillParent
                />
              </div>
            </div>
          </section>

          {/* Section 9: Empty State */}
          <section>
            <h2 className="text-base font-medium mb-1">Empty State</h2>
            <p className="text-sm text-muted-foreground mb-4">
              When the data is empty or all values sum to zero, a placeholder bar
              is rendered. Pass{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                emptyLabel
              </code>{" "}
              to explain why.
            </p>
            <div className="max-w-md">
              <CompositionBar
                data={emptyData}
                category="assetClass"
                value="amount"
                emptyLabel="No allocation data for this period."
              />
            </div>
          </section>
        </div>

        <div className="mt-16">
          <CompositionBarDocs />
        </div>
      </div>
    </main>
  );
}
