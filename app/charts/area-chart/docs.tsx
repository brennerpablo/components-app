import { ComponentDoc } from "@/components/ui/component-doc";

export function AreaChartDocs() {
  return (
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
              description:
                "Array of data objects. Each object must include the index key and one key per category.",
            },
            {
              name: "index",
              type: "string",
              required: true,
              description:
                'The key in each data object to use as the X-axis label (e.g. "month", "date").',
            },
            {
              name: "categories",
              type: "string[]",
              required: true,
              description:
                "Array of keys from the data objects to render as separate area series.",
            },
            {
              name: "colors",
              type: "ChartColor[]",
              default: "CHART_COLORS",
              description:
                "Array of chart color names to use for each category, in order. Cycles if fewer colors than categories.",
            },
            {
              name: "valueFormatter",
              type: "(value: number) => string",
              default: "v => v.toString()",
              description:
                "Function to format Y-axis tick labels and tooltip values.",
            },
            {
              name: "type",
              type: '"default" | "stacked" | "percent"',
              default: '"default"',
              description:
                'Chart layout mode. "stacked" stacks areas; "percent" normalizes to 100%.',
            },
            {
              name: "fill",
              type: '"gradient" | "solid" | "none"',
              default: '"gradient"',
              description: "Fill style for the area under each line.",
            },
            {
              name: "axisTextSize",
              type: '"xs" | "sm" | "md" | "lg" | number',
              default: '"xs"',
              description: 'Font size for X and Y axis tick labels. Named sizes map to 12/14/16/18px. Pass a number for a custom pixel size.',
            },
            {
              name: "legendTextSize",
              type: '"xs" | "sm" | "md" | "lg" | number',
              default: '"xs"',
              description: 'Font size for legend item labels. Named sizes map to 12/14/16/18px. Pass a number for a custom pixel size.',
            },
            {
              name: "dataPointTextSize",
              type: '"xs" | "sm" | "md" | "lg" | number',
              default: '"xs"',
              description: 'Font size for data point labels (requires showDataPointLabels). Named sizes map to 12/14/16/18px. Pass a number for a custom pixel size.',
            },
            {
              name: "showDataPointLabels",
              type: "boolean",
              default: "false",
              description: "When true, renders the formatted value as a label above each data point.",
            },
            {
              name: "showDataPointLabelBackground",
              type: "boolean",
              default: "false",
              description: "When true, each data point label gets a rounded background tinted with the series color. Requires showDataPointLabels.",
            },
            {
              name: "dataPointLabelFormatter",
              type: "(value: number) => string",
              description: "Custom formatter for data point labels. Falls back to valueFormatter when omitted. Useful for compact notation (e.g. 1500000 → \"1.5M\").",
            },
            {
              name: "showXAxis",
              type: "boolean",
              default: "true",
              description:
                "Whether to render the X-axis with tick labels.",
            },
            {
              name: "showYAxis",
              type: "boolean",
              default: "true",
              description:
                "Whether to render the Y-axis with tick labels.",
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
              description:
                "Whether to render the legend above the chart.",
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
              description:
                "When true, the legend becomes horizontally scrollable with arrow buttons.",
            },
            {
              name: "yAxisWidth",
              type: "number",
              default: "auto",
              description: "Width in pixels reserved for the Y-axis. When omitted, the width is auto-inferred from the largest formatted value in the dataset.",
            },
            {
              name: "autoMinValue",
              type: "boolean",
              default: "false",
              description:
                'When true, the Y-axis minimum is set to "auto" rather than 0.',
            },
            {
              name: "minValue",
              type: "number",
              description:
                "Explicit minimum value for the Y-axis domain.",
            },
            {
              name: "maxValue",
              type: "number",
              description:
                "Explicit maximum value for the Y-axis domain.",
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
              description:
                "When true, only the first and last X-axis tick labels are shown.",
            },
            {
              name: "intervalType",
              type: '"preserveStartEnd" | "equidistantPreserveStart"',
              default: '"equidistantPreserveStart"',
              description:
                "Recharts interval strategy for X-axis tick spacing.",
            },
            {
              name: "tickGap",
              type: "number",
              default: "5",
              description:
                "Minimum gap in pixels between adjacent X-axis tick labels.",
            },
            {
              name: "connectNulls",
              type: "boolean",
              default: "false",
              description:
                "When true, null data points are bridged rather than creating a gap.",
            },
            {
              name: "xAxisLabel",
              type: "string",
              description: "Optional label rendered below the X-axis.",
            },
            {
              name: "yAxisLabel",
              type: "string",
              description:
                "Optional label rendered to the left of the Y-axis, rotated 90 degrees.",
            },
            {
              name: "onValueChange",
              type: "(value: AreaChartEventProps) => void",
              description:
                "Callback fired when a dot or legend category is clicked. Receives event details or null when deselected.",
            },
            {
              name: "showTotalDataPointLabels",
              type: "boolean",
              default: "false",
              description:
                "When true, renders a label above or below the top of the stacked area at each X-axis point showing the sum of all category values. Has no effect when type is \"percent\".",
            },
            {
              name: "totalDataPointLabelPosition",
              type: '"top" | "bottom" | "line"',
              default: '"line"',
              description:
                "Controls where total labels are placed. \"line\" floats the label above the top of the stack at each data point. \"top\" pins all labels to a fixed row at the top of the chart. \"bottom\" pins them just below the chart area, above the x-axis tick labels (shifts ticks down to make room). Requires showTotalDataPointLabels.",
            },
            {
              name: "tooltipShowTotal",
              type: "boolean",
              default: "false",
              description:
                "When true, appends a Total row at the bottom of the tooltip showing the sum of all category values for that data point. Useful for stacked charts.",
            },
            {
              name: "tooltipCallback",
              type: "(content: TooltipProps) => void",
              description:
                "Side-effect callback invoked whenever the tooltip active state or label changes.",
            },
            {
              name: "customTooltip",
              type: "React.ComponentType<TooltipProps>",
              description:
                "Custom React component to render in place of the default tooltip.",
            },
            {
              name: "className",
              type: "string",
              description:
                "Additional CSS classes applied to the outer wrapper div (default height is h-80).",
            },
          ],
        },
      ]}
    />
  );
}
