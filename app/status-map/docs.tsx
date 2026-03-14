import { ComponentDoc } from "@/components/ui/component-doc";

export function StatusMapDocs() {
  return (
    <ComponentDoc
      title="StatusMap"
      description="A grid-based heatmap that maps status values to colored cells across rows and dates."
      usage={`import { StatusMap } from "@/components/ui/status-map"

<StatusMap
  data={data}
  labelConfig={{
    green:  { color: "bg-emerald-500", label: "Operational" },
    orange: { color: "bg-orange-400",  label: "Warning", enableAction: true },
    red:    { color: "bg-orange-700",  label: "Fault",   enableAction: true },
    grey:   { color: "bg-muted",       label: "No data" },
  }}
  onAction={(row, date, status) => console.log(row, date, status)}
  label
  labelAlign="right"
  labelTop={false}
  style="rounded"
/>`}
      props={[
        {
          name: "data",
          type: "StatusMapEntry[]",
          required: true,
          description:
            "Array of entries, each with a row label, ISO date, and status key.",
        },
        {
          name: "labelConfig",
          type: "Record<string, StatusItemConfig>",
          required: true,
          description:
            "Maps status keys to a Tailwind color class, human-readable label, and optional enableAction flag.",
        },
        {
          name: "style",
          type: '"rounded" | "squared" | "tight"',
          default: '"rounded"',
          description: "Cell shape style.",
        },
        {
          name: "bordered",
          type: "boolean",
          default: "true",
          description: "Adds a border around the grid.",
        },
        {
          name: "label",
          type: "boolean",
          default: "false",
          description: "Shows the color legend below (or above) the grid.",
        },
        {
          name: "labelAlign",
          type: '"left" | "center" | "right"',
          default: '"left"',
          description: "Horizontal alignment of the legend.",
        },
        {
          name: "labelTop",
          type: "boolean",
          default: "false",
          description:
            "Renders the legend above the grid instead of below.",
        },
        {
          name: "className",
          type: "string",
          description:
            "Additional class names applied to the root element.",
        },
        {
          name: "onCellClick",
          type: "(row, date, status) => void",
          description: "Callback fired on every cell click.",
        },
        {
          name: "onAction",
          type: "(row, date, status) => void",
          description:
            "Callback fired when a cell whose status has enableAction: true is clicked.",
        },
        {
          name: "tooltip",
          type: "boolean",
          default: "false",
          description: "Shows a tooltip on cell hover.",
        },
        {
          name: "tooltipContent",
          type: "(row, date, status, label) => ReactNode",
          description: "Custom tooltip renderer.",
        },
      ]}
    />
  );
}
