import { ComponentDoc } from "@/components/ui/component-doc";

export function SparkAreaChartDocs() {
  return (
    <ComponentDoc
      title="SparkAreaChart"
      description="A compact decorative sparkline (no axes, legend, or tooltip) for stat cards and dense lists. Renders a soft gradient under the line by default and fills its parent container. With fewer than two data points it renders a muted placeholder block instead of an empty chart."
      usage={`import { SparkAreaChart } from "@/components/charts/spark-area-chart"

// Size via the container — the chart fills it
<div className="h-10 w-28">
  <SparkAreaChart
    data={history}
    index="month"
    categories={["value"]}
    colors={["emerald"]}
  />
</div>

// Line only, custom hex color
<SparkAreaChart
  data={history}
  index="month"
  categories={["value"]}
  colors={["#8b5cf6"]}
  showGradient={false}
  strokeWidth={1.5}
/>`}
      props={[
        {
          name: "data",
          type: "Record<string, unknown>[]",
          required: true,
          description:
            "Array of data objects. Non-numeric values are ignored when computing the Y domain.",
        },
        {
          name: "index",
          type: "string",
          required: true,
          description:
            "Key of the X-axis field. Kept for API symmetry with the other charts; the axis itself is never rendered.",
        },
        {
          name: "categories",
          type: "string[]",
          required: true,
          description: "Keys from the data objects to render as series.",
        },
        {
          name: "colors",
          type: "(ChartColor | string)[]",
          default: '["emerald"]',
          description:
            "One palette name or hex color per category, in order.",
        },
        {
          name: "showGradient",
          type: "boolean",
          default: "true",
          description: "Soft gradient fill under each line.",
        },
        {
          name: "strokeWidth",
          type: "number",
          default: "2",
          description: "Line thickness in pixels.",
        },
        {
          name: "className",
          type: "string",
          description:
            "Additional classes on the wrapper. The chart fills its parent — size the parent (or pass h-*/w-* here).",
        },
      ]}
    />
  );
}
