import { ComponentDoc } from "@/components/ui/component-doc"

export function BarChartDocs() {
  return (
    <ComponentDoc
      title="BarChart"
      description="A responsive bar chart with horizontal and vertical layouts, stacked and percentage modes, interactive legend, and click events on bars and categories. Powered by Recharts, inspired by Tremor."
      usage={`import { BarChart } from "@/components/charts/bar-chart"

// Basic
<BarChart
  data={data}
  index="month"
  categories={["Sales"]}
  valueFormatter={(v) => \`$\${v.toLocaleString()}\`}
/>

// Stacked
<BarChart
  data={data}
  index="month"
  categories={["Engineering", "Marketing", "Support"]}
  type="stacked"
/>

// Vertical (horizontal bars)
<BarChart
  data={data}
  index="region"
  categories={["Revenue"]}
  layout="vertical"
  valueFormatter={(v) => \`$\${v.toLocaleString()}\`}
/>

// Interactive
<BarChart
  data={data}
  index="month"
  categories={["Engineering", "Marketing", "Support"]}
  onValueChange={(v) => console.log(v)}
/>`}
      propSections={[
        {
          title: "BarChart Props",
          props: [
            {
              name: "data",
              type: "Record<string, any>[]",
              required: true,
              description: "Array of data objects. Each object should have the index key and one key per category.",
            },
            {
              name: "index",
              type: "string",
              required: true,
              description: "The key in each data object used as the category-axis label (e.g. \"month\", \"region\").",
            },
            {
              name: "categories",
              type: "string[]",
              required: true,
              description: "Array of data keys to render as bar series.",
            },
            {
              name: "colors",
              type: "ChartColor[]",
              default: "CHART_COLORS",
              description: "Color palette for each category. Cycles if fewer colors than categories.",
            },
            {
              name: "valueFormatter",
              type: "(value: number) => string",
              default: "v => v.toString()",
              description: "Formats Y-axis ticks and tooltip values.",
            },
            {
              name: "layout",
              type: '"vertical" | "horizontal"',
              default: '"horizontal"',
              description: 'Orientation of the chart. "horizontal" renders vertical bars; "vertical" renders horizontal bars.',
            },
            {
              name: "type",
              type: '"default" | "stacked" | "percent"',
              default: '"default"',
              description: 'Bar display mode. "default" = side-by-side, "stacked" = stacked, "percent" = stacked normalized to 100%.',
            },
            {
              name: "barCategoryGap",
              type: "string | number",
              description: "Gap between bar groups. Accepts a percentage string (e.g. \"20%\") or pixel value.",
            },
            {
              name: "showXAxis",
              type: "boolean",
              default: "true",
              description: "Show or hide the X-axis.",
            },
            {
              name: "showYAxis",
              type: "boolean",
              default: "true",
              description: "Show or hide the Y-axis.",
            },
            {
              name: "showGridLines",
              type: "boolean",
              default: "true",
              description: "Show or hide background grid lines.",
            },
            {
              name: "yAxisWidth",
              type: "number",
              description: "Width in pixels reserved for the Y-axis. Auto-inferred from data if omitted.",
            },
            {
              name: "xAxisLabel",
              type: "string",
              description: "Optional label rendered below the X-axis.",
            },
            {
              name: "yAxisLabel",
              type: "string",
              description: "Optional label rendered to the left of the Y-axis, rotated 90°.",
            },
            {
              name: "axisTextSize",
              type: '"xs" | "sm" | "md" | "lg" | number',
              default: '"xs"',
              description: "Font size for axis tick labels.",
            },
            {
              name: "tickGap",
              type: "number",
              default: "5",
              description: "Minimum gap in pixels between X-axis ticks.",
            },
            {
              name: "startEndOnly",
              type: "boolean",
              default: "false",
              description: "Only show the first and last tick labels on the category axis.",
            },
            {
              name: "intervalType",
              type: '"preserveStartEnd" | "equidistantPreserveStart"',
              default: '"equidistantPreserveStart"',
              description: "Recharts tick interval strategy for the category axis.",
            },
            {
              name: "allowDecimals",
              type: "boolean",
              default: "true",
              description: "Allow decimal values on the numeric axis.",
            },
            {
              name: "autoMinValue",
              type: "boolean",
              default: "false",
              description: 'Use "auto" for the numeric axis minimum instead of 0.',
            },
            {
              name: "minValue",
              type: "number",
              description: "Explicit minimum for the numeric axis.",
            },
            {
              name: "maxValue",
              type: "number",
              description: "Explicit maximum for the numeric axis.",
            },
            {
              name: "showLegend",
              type: "boolean",
              default: "true",
              description: "Show or hide the legend.",
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
              description: "Makes the legend horizontally scrollable with arrow buttons when items overflow.",
            },
            {
              name: "legendTextSize",
              type: '"xs" | "sm" | "md" | "lg" | number',
              default: '"xs"',
              description: "Font size for legend labels.",
            },
            {
              name: "showTooltip",
              type: "boolean",
              default: "true",
              description: "Show or hide the tooltip on hover.",
            },
            {
              name: "tooltipCallback",
              type: "(content: TooltipProps) => void",
              description: "Callback fired whenever the tooltip active state or label changes.",
            },
            {
              name: "customTooltip",
              type: "React.ComponentType<TooltipProps>",
              description: "Custom tooltip component. Receives active, payload, and label props.",
            },
            {
              name: "rounded",
              type: "boolean",
              default: "false",
              description: "Apply rounded corners to bars.",
            },
            {
              name: "labelTruncateAt",
              type: "number",
              description: 'Truncate axis labels at this many characters, appending "...". When omitted, labels are shown in full.',
            },
            {
              name: "tooltipFullLabel",
              type: "boolean",
              default: "true",
              description: "When true the tooltip shows the full label text. Set to false to show the truncated label (requires labelTruncateAt).",
            },
            {
              name: "onValueChange",
              type: "(value: BarChartEventProps) => void",
              description: 'Callback when a bar or legend item is clicked. Returns { eventType: "bar" | "category", categoryClicked, ...dataRow } or null on deselect.',
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes applied to the outer wrapper div. Default height is h-80.",
            },
          ],
        },
      ]}
    />
  )
}
