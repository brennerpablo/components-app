import { ComponentDoc } from "@/components/ui/component-doc"

export function DonutChartDocs() {
  return (
    <ComponentDoc
      title="DonutChart"
      description="A donut (or pie) chart for visualizing part-to-whole relationships. Supports an optional center label, click interactions, custom tooltip, and tooltip callbacks. Powered by Recharts, inspired by Tremor."
      usage={`import { DonutChart } from "@/components/charts/donut-chart"

// Basic donut
<DonutChart
  data={data}
  category="browser"
  value="share"
  valueFormatter={(v) => \`\${v}%\`}
/>

// With center label showing total
<DonutChart
  data={data}
  category="browser"
  value="share"
  showLabel
  valueFormatter={(v) => \`\${v}%\`}
/>

// Solid pie (thickness=100)
<DonutChart
  data={data}
  category="region"
  value="revenue"
  thickness={100}
  valueFormatter={(v) => \`$\${v.toLocaleString()}\`}
/>

// Interactive
<DonutChart
  data={data}
  category="browser"
  value="share"
  onValueChange={(v) => console.log(v)}
/>`}
      propSections={[
        {
          title: "DonutChart Props",
          props: [
            {
              name: "data",
              type: "Record<string, any>[]",
              required: true,
              description: "Array of data objects. Each object needs a key for category labels and a key for numeric values.",
            },
            {
              name: "category",
              type: "string",
              required: true,
              description: "Key in each data object used as the segment label (e.g. \"browser\", \"region\").",
            },
            {
              name: "value",
              type: "string",
              required: true,
              description: "Key in each data object used as the segment's numeric value.",
            },
            {
              name: "colors",
              type: "ChartColor[]",
              default: "CHART_COLORS",
              description: "Color palette for each segment. Cycles if fewer colors than segments.",
            },
            {
              name: "thickness",
              type: "number",
              default: "25",
              description: "Ring thickness from 0 (thin) to 100 (solid pie). Controls the inner radius: innerRadius = (100 - thickness)%.",
            },
            {
              name: "valueFormatter",
              type: "(value: number) => string",
              default: "v => v.toString()",
              description: "Formats tooltip values and the center label total.",
            },
            {
              name: "label",
              type: "string",
              description: "Custom text shown in the center (donut only). When omitted, the sum of all values is shown.",
            },
            {
              name: "showLabel",
              type: "boolean",
              default: "false",
              description: "Show a label in the center of the donut. Has no effect on the pie variant.",
            },
            {
              name: "showTooltip",
              type: "boolean",
              default: "true",
              description: "Show or hide the tooltip on hover.",
            },
            {
              name: "showLegend",
              type: "boolean",
              default: "false",
              description: "Show a legend with category labels and formatted values alongside the chart.",
            },
            {
              name: "legendPosition",
              type: '"top" | "bottom" | "left" | "right"',
              default: '"right"',
              description: 'Position of the legend relative to the chart. Left/right stacks items vertically; top/bottom lays them out horizontally.',
            },
            {
              name: "onValueChange",
              type: "(value: DonutChartEventProps) => void",
              description: 'Callback when a segment is clicked. Returns { eventType: "sector", categoryClicked, ...dataRow } or null on deselect.',
            },
            {
              name: "tooltipCallback",
              type: "(content: TooltipProps) => void",
              description: "Callback fired whenever the tooltip active state or hovered category changes.",
            },
            {
              name: "customTooltip",
              type: "React.ComponentType<TooltipProps>",
              description: "Custom tooltip component. Receives active and payload props.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes. The chart has min-h-40 and aspect-square by default — it fills the parent height while staying circular. Without a legend, applied to the outer wrapper. With a legend, applied to the chart portion only.",
            },
          ],
        },
      ]}
    />
  )
}
