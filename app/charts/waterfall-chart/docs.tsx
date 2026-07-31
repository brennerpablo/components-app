import { ComponentDoc } from "@/components/ui/component-doc";

export function WaterfallChartDocs() {
  return (
    <ComponentDoc
      title="WaterfallChart"
      description='Explains how a starting total becomes an ending total through sequential additions and subtractions. Bars typed "total" anchor at zero and reset the running total; bars typed "delta" float from the previous running total, colored by sign. Dashed connectors bridge consecutive bars, and the Y axis computes nice bounds/ticks from the stacked extent. Fills its parent height; with many factors, minWidthPerBar enables horizontal scrolling.'
      usage={`import {
  WaterfallChart,
  type WaterfallChartDatum,
} from "@/components/charts/waterfall-chart"

const data: WaterfallChartDatum[] = [
  { label: "Opening", value: 1200, type: "total" },
  { label: "Inflows", value: 480, type: "delta" },
  { label: "Outflows", value: -350, type: "delta" },
  { label: "Closing", value: 1330, type: "total" },
]

<div className="h-80">
  <WaterfallChart data={data} valueFormatter={(v) => \`$\${v}\`} />
</div>`}
      props={[
        {
          name: "data",
          type: "WaterfallChartDatum[]",
          required: true,
          description:
            'Ordered steps: { label, value, type: "total" | "delta" }. Totals anchor at zero (value is the absolute total); deltas are signed contributions.',
        },
        {
          name: "valueFormatter",
          type: "(value: number) => string",
          default: "v => v.toString()",
          description: "Formats Y-axis ticks, tooltip values and legend.",
        },
        {
          name: "showLegend",
          type: "boolean",
          default: "true",
          description:
            "Legend mapping the three roles (totals, additions, subtractions).",
        },
        {
          name: "showTooltip",
          type: "boolean",
          default: "true",
          description:
            "Tooltip with the step value and the running total.",
        },
        {
          name: "showGridLines",
          type: "boolean",
          default: "true",
          description: "Horizontal grid lines.",
        },
        {
          name: "showConnectors",
          type: "boolean",
          default: "true",
          description:
            "Dashed lines bridging the end of one bar to the start of the next.",
        },
        {
          name: "totalsColor",
          type: "ChartColor | string",
          default: '"blue"',
          description: "Color of total bars (palette name or hex).",
        },
        {
          name: "additionsColor",
          type: "ChartColor | string",
          default: '"emerald"',
          description: "Color of positive delta bars.",
        },
        {
          name: "subtractionsColor",
          type: "ChartColor | string",
          default: '"red"',
          description: "Color of negative delta bars.",
        },
        {
          name: "yAxisWidth",
          type: "number",
          default: "auto",
          description:
            "Pixels reserved for the Y axis; inferred from the formatted ticks when omitted.",
        },
        {
          name: "axisTextSize",
          type: '"xs" | "sm" | "md" | "lg" | number',
          default: '"xs"',
          description: "Axis label font size.",
        },
        {
          name: "labelTruncateAt",
          type: "number",
          description:
            "Truncates long X labels with an ellipsis (full label in the tooltip).",
        },
        {
          name: "minWidthPerBar",
          type: "number",
          default: "52",
          description:
            "Minimum width per bar; when bars would get narrower, the chart scrolls horizontally instead.",
        },
        {
          name: "className",
          type: "string",
          description:
            "Additional classes on the wrapper. The chart fills its parent — give the parent a height (e.g. h-80).",
        },
      ]}
    />
  );
}
