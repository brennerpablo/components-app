import { ComponentDoc } from "@/components/ui/component-doc";

export function GanttDocs() {
  return (
    <ComponentDoc
      title="Gantt"
      description="A tree-and-timeline chart with a sticky column pane, group rollups, overlap lanes, milestones and switchable time scales."
      usage={`import { Gantt } from "@/components/ui/gantt"
import type { GanttColumn, GanttRow } from "@/components/ui/gantt"

type Task = { status: string; owner: string }

const columns: GanttColumn<Task>[] = [
  { id: "name", header: "Name", width: 230, cell: (row) => row.label },
  { id: "status", header: "Status", width: 110, cell: (row) => row.data?.status },
]

const rows: GanttRow<Task>[] = [
  {
    id: "epic-1",
    label: "Bug Tracking",
    children: [
      {
        id: "task-1",
        label: "Login redirect",
        data: { status: "Done", owner: "Ana" },
        bars: [{
          id: "task-1-bar",
          start: new Date(2026, 6, 13),
          end: new Date(2026, 6, 15),
          label: "Login redirect",
          color: "blue",
          progress: 1,
        }],
      },
    ],
  },
]

<Gantt<Task>
  rows={rows}
  columns={columns}
  defaultScale="month"
  defaultDate={new Date(2026, 6, 22)}
  onBarClick={(bar, row) => console.log(bar.id, row.id)}
/>`}
      propSections={[
        {
          title: "Props",
          props: [
            {
              name: "rows",
              type: "GanttRow<T>[]",
              required: true,
              description:
                "Row tree. A row with children renders as a collapsible group.",
            },
            {
              name: "columns",
              type: "GanttColumn<T>[]",
              required: true,
              description:
                "Left pane columns. The first one automatically gets the indent and expand/collapse chevron.",
            },
            {
              name: "scale",
              type: '"day" | "week" | "month" | "quarter" | "year"',
              description:
                "Controlled time preset. Picks both the visible range and the column unit.",
            },
            {
              name: "defaultScale",
              type: "GanttScale",
              default: '"month"',
              description: "Uncontrolled initial scale.",
            },
            {
              name: "onScaleChange",
              type: "(scale: GanttScale) => void",
              description: "Fires when the toolbar scale picker changes.",
            },
            {
              name: "scales",
              type: "GanttScale[]",
              default: "all five",
              description:
                "Presets offered by the toolbar picker. A single-entry array hides it.",
            },
            {
              name: "date",
              type: "Date",
              description:
                "Controlled anchor date. The visible range is derived from it.",
            },
            {
              name: "defaultDate",
              type: "Date",
              default: "new Date()",
              description: "Uncontrolled initial anchor date.",
            },
            {
              name: "onDateChange",
              type: "(date: Date) => void",
              description: "Fires on Today and the prev/next page buttons.",
            },
            {
              name: "now",
              type: "Date | null",
              default: "current time",
              description:
                "Position of the red now line. Pass null to hide it. Only rendered after mount.",
            },
            {
              name: "weekStartsOn",
              type: "0 | 1 | ... | 6",
              default: "0",
              description:
                "First day of the week — affects week columns, week grouping and the week range.",
            },
            {
              name: "title",
              type: "ReactNode",
              description: "Overrides the derived range label in the toolbar.",
            },
            {
              name: "toolbar",
              type: "boolean",
              default: "true",
              description: "Renders the Today / scale / paging / title bar.",
            },
            {
              name: "actions",
              type: "ReactNode",
              description: "Rendered at the right end of the toolbar.",
            },
            {
              name: "zoomControls",
              type: "boolean",
              default: "true",
              description:
                "Floating +/- control that scales column width from 0.5× to 4×.",
            },
            {
              name: "rowHeight",
              type: "number",
              default: "36",
              description: "Height of a single-lane row, in px.",
            },
            {
              name: "laneHeight",
              type: "number",
              default: "24",
              description: "Extra height each additional overlap lane adds to a row.",
            },
            {
              name: "nonWorking",
              type: "(start: Date, end: Date) => boolean",
              default: "weekends",
              description:
                "Shades a column as non-working. Defaults to weekends on day columns, nothing otherwise.",
            },
            {
              name: "summaryRows",
              type: "boolean",
              default: "true",
              description:
                "Group rows render a rollup track spanning their descendants, with duration-weighted progress.",
            },
            {
              name: "bordered",
              type: "boolean",
              default: "true",
              description: "Wraps the chart in a rounded border.",
            },
            {
              name: "height",
              type: "number | string",
              default: "520",
              description: "Scroll viewport height. A number is treated as px.",
            },
            {
              name: "onBarClick",
              type: "(bar: GanttBar, row: GanttRow<T>) => void",
              description: "Makes bars interactive and fires on click.",
            },
            {
              name: "onRowClick",
              type: "(row: GanttRow<T>) => void",
              description: "Fires when either pane of a row is clicked.",
            },
            {
              name: "onExpandedChange",
              type: "(expanded: Record<string, boolean>) => void",
              description: "Fires when a group is expanded or collapsed.",
            },
            {
              name: "emptyState",
              type: "ReactNode",
              default: '"No rows to show"',
              description: "Shown when rows is empty.",
            },
            {
              name: "className",
              type: "string",
              description: "Merged onto the outer wrapper.",
            },
          ],
        },
        {
          title: "GanttRow<T>",
          props: [
            { name: "id", type: "string", required: true, description: "Unique row key." },
            {
              name: "label",
              type: "string",
              required: true,
              description: "Row name, available to every column renderer.",
            },
            {
              name: "bars",
              type: "GanttBar[]",
              description:
                "Bars on this row. Overlapping bars are packed into lanes and the row grows taller.",
            },
            {
              name: "children",
              type: "GanttRow<T>[]",
              description: "Nested rows. Presence of children makes the row a group.",
            },
            {
              name: "defaultExpanded",
              type: "boolean",
              default: "true",
              description: "Start the group collapsed with false.",
            },
            {
              name: "data",
              type: "T",
              description: "Arbitrary payload handed back to every column's cell renderer.",
            },
          ],
        },
        {
          title: "GanttBar",
          props: [
            { name: "id", type: "string", required: true, description: "Unique bar key." },
            { name: "start", type: "Date", required: true, description: "Bar start time." },
            {
              name: "end",
              type: "Date",
              required: true,
              description: "Bar end time. Ignored when milestone is true.",
            },
            {
              name: "label",
              type: "string",
              description: "Placed inside the bar when it fits, otherwise just after it.",
            },
            {
              name: "labelPosition",
              type: '"auto" | "inside" | "outside" | "none"',
              default: '"auto"',
              description: "Overrides the automatic label placement.",
            },
            {
              name: "progress",
              type: "number",
              description: "0–1. Fills that fraction of the bar with the saturated hue.",
            },
            {
              name: "color",
              type: "GanttColor",
              default: '"neutral"',
              description:
                "One of the eight validated identity hues (blue, emerald, violet, amber, rose, teal, orange, indigo) or neutral.",
            },
            {
              name: "variant",
              type: '"soft" | "solid" | "outline"',
              default: '"soft"',
              description:
                "soft is a tint with a saturated rail; outline is dashed, for planned or queued work.",
            },
            {
              name: "startLabel",
              type: "string",
              description: "Small muted caption just before the bar's leading edge.",
            },
            {
              name: "endLabel",
              type: "string",
              description:
                "Small muted caption after the trailing edge. Skipped when the main label lands outside.",
            },
            {
              name: "icon",
              type: "ReactNode",
              description: "Rendered before the label, inside the bar.",
            },
            {
              name: "milestone",
              type: "boolean",
              default: "false",
              description: "Renders a ring marker at start instead of a bar.",
            },
            {
              name: "tooltip",
              type: "ReactNode",
              description: "Replaces the default label / range / progress hover card.",
            },
            {
              name: "disabled",
              type: "boolean",
              default: "false",
              description: "Dims the bar and suppresses onBarClick.",
            },
          ],
        },
        {
          title: "GanttColumn<T>",
          props: [
            { name: "id", type: "string", required: true, description: "Unique column key." },
            { name: "header", type: "ReactNode", required: true, description: "Header cell content." },
            {
              name: "width",
              type: "number",
              default: "200 / 120",
              description: "Column width in px — 200 for the first column, 120 for the rest.",
            },
            {
              name: "align",
              type: '"left" | "center" | "right"',
              default: '"left"',
              description: "Text alignment. Ignored on the first (tree) column.",
            },
            {
              name: "cell",
              type: "(row, ctx) => ReactNode",
              required: true,
              description:
                "Cell renderer. ctx carries depth, isGroup, expanded and the group's rolled-up span.",
            },
          ],
        },
      ]}
    />
  );
}
