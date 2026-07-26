import { ComponentDoc } from "@/components/ui/component-doc"

export function CompositionBarDocs() {
  return (
    <ComponentDoc
      title="CompositionBar"
      description="A single horizontal stacked bar showing how a total breaks down across categories, with an aligned legend listing each category's value and share. Segments and legend rows highlight together on hover, and a minimum segment width keeps tiny slices visible."
      usage={`import { CompositionBar } from "@/components/charts/composition-bar"

// Basic composition
<CompositionBar
  data={data}
  category="assetClass"
  value="amount"
  valueFormatter={(v) => \`$\${v.toLocaleString()}\`}
/>

// Sorted, custom palette
<CompositionBar
  data={data}
  category="source"
  value="sessions"
  sortOrder="descending"
  colors={["violet", "amber", "rose", "teal", "cyan"]}
/>

// Bar only, no legend
<CompositionBar
  data={data}
  category="assetClass"
  value="amount"
  showLegend={false}
  barHeight={8}
/>

// Fill a fixed-height card
<div className="h-64">
  <CompositionBar
    data={data}
    category="assetClass"
    value="amount"
    fillParent
  />
</div>`}
      propSections={[
        {
          title: "CompositionBar Props",
          props: [
            {
              name: "data",
              type: "Record<string, any>[]",
              required: true,
              description:
                "Array of data objects. Each object needs a key for the category label and a key for the numeric value.",
            },
            {
              name: "category",
              type: "string",
              required: true,
              description:
                'Key in each data object used as the segment label (e.g. "assetClass", "source").',
            },
            {
              name: "value",
              type: "string",
              required: true,
              description:
                "Key in each data object used as the segment's numeric value. Percentages are computed against the sum of all values.",
            },
            {
              name: "colors",
              type: "(ChartColor | string)[]",
              default: "CHART_COLORS",
              description:
                "Color palette for the segments. Accepts palette names or raw hex strings, and cycles if there are fewer colors than categories.",
            },
            {
              name: "valueFormatter",
              type: "(value: number) => string",
              default: "v => v.toString()",
              description: "Formats the raw value in the legend and tooltip.",
            },
            {
              name: "percentFormatter",
              type: "(percent: number) => string",
              default: "p => `${p.toFixed(1)}%`",
              description:
                "Formats the share percentage in the legend and tooltip. Always receives the true percentage, never the inflated render width.",
            },
            {
              name: "sortOrder",
              type: '"ascending" | "descending" | "none"',
              default: '"none"',
              description:
                "Sort order applied to segments by value. Use \"none\" to keep the order of the input array.",
            },
            {
              name: "barHeight",
              type: "number",
              default: "12",
              description: "Height of the bar in pixels.",
            },
            {
              name: "minSegmentPercent",
              type: "number",
              default: "0.5",
              description:
                "Floor (in percent) applied to rendered segment widths so tiny slices stay visible. The inflation is reclaimed from the largest segment so widths still sum to 100.",
            },
            {
              name: "showLegend",
              type: "boolean",
              default: "true",
              description:
                "Show the legend rows below the bar (color swatch, label, value, percentage).",
            },
            {
              name: "showTooltip",
              type: "boolean",
              default: "true",
              description:
                "Show the hover tooltip and enable the hover dimming of non-hovered segments.",
            },
            {
              name: "fillParent",
              type: "boolean",
              default: "false",
              description:
                "Stretch to fill the parent's height and distribute legend rows evenly across the available vertical space. Use inside fixed-height cards so the chart balances with siblings.",
            },
            {
              name: "emptyLabel",
              type: "string",
              description:
                "Text rendered under the placeholder bar when data is empty or all values sum to zero.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes on the outer wrapper.",
            },
          ],
        },
      ]}
    />
  )
}
