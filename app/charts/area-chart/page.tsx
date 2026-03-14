"use client"

import { useState } from "react"
import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb"
import { AreaChart, type AreaChartEventProps } from "@/components/charts/area-chart"
import { ComponentDoc } from "@/components/ui/component-doc"

const revenueData = [
  { month: "Jan", Revenue: 4200 },
  { month: "Feb", Revenue: 5800 },
  { month: "Mar", Revenue: 4900 },
  { month: "Apr", Revenue: 7200 },
  { month: "May", Revenue: 8100 },
  { month: "Jun", Revenue: 7600 },
  { month: "Jul", Revenue: 9400 },
  { month: "Aug", Revenue: 8800 },
  { month: "Sep", Revenue: 10200 },
  { month: "Oct", Revenue: 9600 },
  { month: "Nov", Revenue: 11400 },
  { month: "Dec", Revenue: 12800 },
]

const trafficData = [
  { month: "Jan", Organic: 3200, Direct: 1800, Referral: 900 },
  { month: "Feb", Organic: 4100, Direct: 2200, Referral: 1100 },
  { month: "Mar", Organic: 3800, Direct: 1900, Referral: 1400 },
  { month: "Apr", Organic: 5200, Direct: 2800, Referral: 1600 },
  { month: "May", Organic: 6100, Direct: 3100, Referral: 1900 },
  { month: "Jun", Organic: 5700, Direct: 2900, Referral: 2100 },
  { month: "Jul", Organic: 7200, Direct: 3500, Referral: 2400 },
  { month: "Aug", Organic: 6800, Direct: 3200, Referral: 2200 },
  { month: "Sep", Organic: 8100, Direct: 4100, Referral: 2700 },
  { month: "Oct", Organic: 7600, Direct: 3800, Referral: 2500 },
  { month: "Nov", Organic: 9200, Direct: 4600, Referral: 3100 },
  { month: "Dec", Organic: 10400, Direct: 5200, Referral: 3600 },
]

export default function AreaChartPage() {
  const [event, setEvent] = useState<AreaChartEventProps>(null)

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <DemoBreadcrumb />
      <h1 className="text-2xl font-semibold tracking-tight mb-2">Area Chart</h1>
      <p className="text-muted-foreground mb-10">
        A responsive area chart with gradient, solid, and no-fill modes. Supports stacked and
        percentage layouts, interactive legend with slider, custom tooltips, and click events on
        dots and categories. Powered by Recharts, inspired by Tremor.
      </p>

      <div className="space-y-12">
        {/* Section 1: Single series */}
        <section>
          <h2 className="text-base font-medium mb-1">Single Series</h2>
          <p className="text-sm text-muted-foreground mb-4">
            A basic single-category chart with a gradient fill and value formatter.
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
            Multiple categories rendered with distinct colors and a shared legend.
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
            Areas stacked on top of each other with solid fills to clearly show cumulative totals.
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
            Normalizes each data point to 100%, useful for showing proportional breakdown over time.
          </p>
          <AreaChart
            data={trafficData}
            index="month"
            categories={["Organic", "Direct", "Referral"]}
            type="percent"
          />
        </section>

        {/* Section 5: Minimal / line-only */}
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

        {/* Section 6: Interactive */}
        <section>
          <h2 className="text-base font-medium mb-1">Interactive</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Click a dot or legend item to highlight a category. The selected event is shown below.
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
      </div>

      <div className="mt-16">
        <ComponentDoc
          title="AreaChart"
          description="A responsive area chart with gradient, solid, and no-fill modes. Supports single and multi-series data, stacked and percentage layouts, interactive legend with optional slider, custom tooltips, and click events on dots and legend categories. Powered by Recharts, inspired by Tremor."
          usage={`import { AreaChart } from "@/components/charts/area-chart"

// Single series with value formatter
<AreaChart
  data={revenueData}
  index="month"
  categories={["Revenue"]}
  valueFormatter={(v) => \`$\${v.toLocaleString()}\`}
/>

// Multi-series stacked
<AreaChart
  data={trafficData}
  index="month"
  categories={["Organic", "Direct", "Referral"]}
  type="stacked"
  fill="solid"
/>

// Interactive with event handler
<AreaChart
  data={trafficData}
  index="month"
  categories={["Organic", "Direct", "Referral"]}
  onValueChange={(event) => console.log(event)}
/>`}
          propSections={[
            {
              title: "AreaChart Props",
              props: [
                {
                  name: "data",
                  type: "Record<string, any>[]",
                  required: true,
                  description: "Array of data objects. Each object must include the index key and one key per category.",
                },
                {
                  name: "index",
                  type: "string",
                  required: true,
                  description: "The key in each data object to use as the X-axis label (e.g. \"month\", \"date\").",
                },
                {
                  name: "categories",
                  type: "string[]",
                  required: true,
                  description: "Array of keys from the data objects to render as separate area series.",
                },
                {
                  name: "colors",
                  type: "ChartColor[]",
                  default: "CHART_COLORS",
                  description: "Array of chart color names to use for each category, in order. Cycles if fewer colors than categories.",
                },
                {
                  name: "valueFormatter",
                  type: "(value: number) => string",
                  default: "v => v.toString()",
                  description: "Function to format Y-axis tick labels and tooltip values.",
                },
                {
                  name: "type",
                  type: '"default" | "stacked" | "percent"',
                  default: '"default"',
                  description: "Chart layout mode. \"stacked\" stacks areas; \"percent\" normalizes to 100%.",
                },
                {
                  name: "fill",
                  type: '"gradient" | "solid" | "none"',
                  default: '"gradient"',
                  description: "Fill style for the area under each line.",
                },
                {
                  name: "showXAxis",
                  type: "boolean",
                  default: "true",
                  description: "Whether to render the X-axis with tick labels.",
                },
                {
                  name: "showYAxis",
                  type: "boolean",
                  default: "true",
                  description: "Whether to render the Y-axis with tick labels.",
                },
                {
                  name: "showGridLines",
                  type: "boolean",
                  default: "true",
                  description: "Whether to render horizontal grid lines.",
                },
                {
                  name: "showLegend",
                  type: "boolean",
                  default: "true",
                  description: "Whether to render the legend above the chart.",
                },
                {
                  name: "showTooltip",
                  type: "boolean",
                  default: "true",
                  description: "Whether to show the tooltip on hover.",
                },
                {
                  name: "legendPosition",
                  type: '"left" | "center" | "right"',
                  default: '"right"',
                  description: "Horizontal alignment of the legend.",
                },
                {
                  name: "enableLegendSlider",
                  type: "boolean",
                  default: "false",
                  description: "When true, the legend becomes horizontally scrollable with arrow buttons.",
                },
                {
                  name: "yAxisWidth",
                  type: "number",
                  default: "56",
                  description: "Width in pixels reserved for the Y-axis.",
                },
                {
                  name: "autoMinValue",
                  type: "boolean",
                  default: "false",
                  description: "When true, the Y-axis minimum is set to \"auto\" rather than 0.",
                },
                {
                  name: "minValue",
                  type: "number",
                  description: "Explicit minimum value for the Y-axis domain.",
                },
                {
                  name: "maxValue",
                  type: "number",
                  description: "Explicit maximum value for the Y-axis domain.",
                },
                {
                  name: "allowDecimals",
                  type: "boolean",
                  default: "true",
                  description: "Whether Y-axis ticks may be decimal numbers.",
                },
                {
                  name: "startEndOnly",
                  type: "boolean",
                  default: "false",
                  description: "When true, only the first and last X-axis tick labels are shown.",
                },
                {
                  name: "intervalType",
                  type: '"preserveStartEnd" | "equidistantPreserveStart"',
                  default: '"equidistantPreserveStart"',
                  description: "Recharts interval strategy for X-axis tick spacing.",
                },
                {
                  name: "tickGap",
                  type: "number",
                  default: "5",
                  description: "Minimum gap in pixels between adjacent X-axis tick labels.",
                },
                {
                  name: "connectNulls",
                  type: "boolean",
                  default: "false",
                  description: "When true, null data points are bridged rather than creating a gap.",
                },
                {
                  name: "xAxisLabel",
                  type: "string",
                  description: "Optional label rendered below the X-axis.",
                },
                {
                  name: "yAxisLabel",
                  type: "string",
                  description: "Optional label rendered to the left of the Y-axis, rotated 90 degrees.",
                },
                {
                  name: "onValueChange",
                  type: "(value: AreaChartEventProps) => void",
                  description: "Callback fired when a dot or legend category is clicked. Receives event details or null when deselected.",
                },
                {
                  name: "tooltipCallback",
                  type: "(content: TooltipProps) => void",
                  description: "Side-effect callback invoked whenever the tooltip active state or label changes.",
                },
                {
                  name: "customTooltip",
                  type: "React.ComponentType<TooltipProps>",
                  description: "Custom React component to render in place of the default tooltip.",
                },
                {
                  name: "className",
                  type: "string",
                  description: "Additional CSS classes applied to the outer wrapper div (default height is h-80).",
                },
              ],
            },
          ]}
        />
      </div>
    </main>
  )
}
