"use client";

import { ComponentDoc } from "@/components/ui/component-doc";
import { StatusMap } from "@/components/ui/status-map";

import { data } from "./data";

export default function StatusMapPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
          Factory Machine Status
        </h1>
        <StatusMap
          data={data}
          label
          labelAlign="right"
          labelTop={false}
          // bordered={false}
          style="squared"
          labelConfig={{
            green: { color: "bg-emerald-500", label: "Operational" },
            orange: { color: "bg-orange-400", label: "Warning" },
            red: { color: "bg-red-500", label: "Fault" },
            grey: { color: "bg-muted", label: "No data" },
          }}
        />

        <ComponentDoc
          title="StatusMap"
          description="A grid-based heatmap that maps status values to colored cells across rows and dates."
          usage={`import { StatusMap } from "@/components/ui/status-map"

<StatusMap
  data={data}
  labelConfig={{
    green: { color: "bg-emerald-500", label: "Operational" },
    orange: { color: "bg-orange-400", label: "Warning" },
    red: { color: "bg-red-500", label: "Fault" },
    grey: { color: "bg-muted", label: "No data" },
  }}
  label
  labelAlign="right"
  labelTop={false}
  style="squared"
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
                "Maps status keys to a Tailwind color class and human-readable label.",
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
              description: "Adds a border around each cell.",
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
              description: "Callback fired when a cell is clicked.",
            },
          ]}
        />
      </div>
    </main>
  );
}
