import { ComponentDoc } from "@/components/ui/component-doc";

export function DataTableDocs() {
  return (
    <ComponentDoc
      title="DataTable"
      description="A flexible data table with sorting, filtering, pagination, row selection, column visibility, and CSV/XLSX export."
      usage={`import { DataTable, ColumnMetadata } from "@/components/ui/data-table"

type Row = { name: string; status: string; cost: number }

const columnsMetadata = [
  { columnId: "name", title: "Name", type: "text", sortable: true, filters: { text: true } },
  { columnId: "status", title: "Status", type: "text", inferOptions: true, filters: { checkboxSearch: { multiple: false } } },
  { columnId: "cost", title: "Cost", type: "number", sortable: true, filters: { number: true } },
] as const satisfies ColumnMetadata<Row>[]

<DataTable<Row>
  columnsMetadata={columnsMetadata}
  data={data}
  bordered
  enablePagination
  paginationDisplayTop
/>`}
      propSections={[
        {
          title: "DataTable props",
          props: [
            {
              name: "data",
              type: "TData[]",
              required: true,
              description: "The row data array.",
            },
            {
              name: "columnsMetadata",
              type: "readonly ColumnMetadata<TData>[]",
              description:
                "Declarative column config. When provided, columns are built automatically from this.",
            },
            {
              name: "persistColumnOrder",
              type: "boolean",
              default: "false",
              description:
                "Persists column visibility/order to localStorage (requires tableName).",
            },
            {
              name: "tableName",
              type: "string",
              description:
                "Base filename for CSV/XLSX exports (e.g. \"usage_overview\" → usage_overview-2026-03-16.csv). Also used as the localStorage key when persistColumnOrder is true.",
            },
            {
              name: "enableRowSelection",
              type: "boolean",
              default: "false",
              description:
                "Enables per-row checkboxes and bulk editor toolbar.",
            },
            {
              name: "enableRowActions",
              type: "boolean",
              default: "false",
              description:
                "Renders an actions column at the end of each row.",
            },
            {
              name: "enablePagination",
              type: "boolean",
              default: "true",
              description: "Enables pagination controls.",
            },
            {
              name: "pageSize",
              type: "number",
              default: "25",
              description: "Initial number of rows per page.",
            },
            {
              name: "enablePageSizeSelect",
              type: "boolean",
              default: "true",
              description:
                "Shows a page-size selector in the pagination bar.",
            },
            {
              name: "paginationDisplayTop",
              type: "boolean",
              default: "false",
              description:
                "Renders pagination above the table instead of below.",
            },
            {
              name: "language",
              type: '"en" | "pt"',
              default: '"en"',
              description: "UI locale for labels and messages.",
            },
            {
              name: "enableTextSelection",
              type: "boolean",
              default: "true",
              description:
                "Allows text selection inside cells. Set to false to prevent accidental selection on click.",
            },
            {
              name: "enableFullscreen",
              type: "boolean",
              default: "false",
              description:
                "Adds a fullscreen toggle button to the toolbar. Opens the table in a fixed overlay covering the entire viewport via a React portal. Press Escape or click the button again to exit.",
            },
            {
              name: "bordered",
              type: "boolean",
              default: "false",
              description: "Wraps the table in a rounded border.",
            },
            {
              name: "tableStyle",
              type: '"default" | "ghost"',
              default: '"default"',
              description:
                'Visual style preset. "ghost" removes all background colors and row dividers, keeping only the outer border when bordered is true.',
            },
            {
              name: "accentColor",
              type: "string",
              description:
                "Accent color applied to active filter button backgrounds, filter value labels, the row-selection indicator bar, and the clear-filters button. Accepts a Tailwind color token (e.g. \"blue-600\") or any CSS color value (e.g. \"#3b82f6\"). Defaults to zinc-800.",
            },
            {
              name: "onRowAction",
              type: "{ onAdd?: (row: TData) => void; onEdit?: (row: TData) => void; onDelete?: (row: TData) => void }",
              description:
                "Callbacks for the per-row action dropdown (requires enableRowActions). Only menu items with a corresponding callback are rendered.",
            },
            {
              name: "onBulkAction",
              type: "{ onEdit?: (rows: TData[]) => void; onDelete?: (rows: TData[]) => void }",
              description:
                "Callbacks for the bulk editor toolbar (requires enableRowSelection). Edit and Delete commands are disabled when the corresponding callback is not provided.",
            },
          ],
        },
        {
          title: "ColumnMetadata fields",
          props: [
            {
              name: "columnId",
              type: "keyof TData & string",
              required: true,
              description:
                "Key of the row data object this column maps to.",
            },
            {
              name: "title",
              type: "string",
              required: true,
              description: "Column header label.",
            },
            {
              name: "type",
              type: '"text" | "number" | "date"',
              required: true,
              description:
                "Data type — drives which filter controls and sort logic are applied.",
            },
            {
              name: "subtitle",
              type: "string",
              description:
                "Secondary label shown below the title in the column header.",
            },
            {
              name: "description",
              type: "string",
              description:
                "Tooltip text shown on the column header info icon.",
            },
            {
              name: "sortable",
              type: "boolean",
              default: "false",
              description: "Enables click-to-sort on the column header.",
            },
            {
              name: "hideable",
              type: "boolean",
              default: "true",
              description:
                "Controls whether the column appears in the visibility toggle menu.",
            },
            {
              name: "aligned",
              type: '"left" | "center" | "right"',
              default: '"left"',
              description:
                "Horizontal alignment of both header and cell content.",
            },
            {
              name: "options",
              type: "OptionItem[]",
              description:
                "Explicit list of { value, label } pairs for select/checkbox filters.",
            },
            {
              name: "inferOptions",
              type: "boolean",
              default: "false",
              description:
                "Auto-derives filter options from the unique values in the data array. Overrides options.",
            },
            {
              name: "filters",
              type: "FilterConfig",
              description:
                "Which filter controls to activate for this column. See FilterConfig below.",
            },
            {
              name: "formatter",
              type: "(value: unknown) => ReactNode",
              description:
                "Custom cell renderer for the display value (e.g. currency, badges).",
            },
            {
              name: "filterValueFormatter",
              type: "(value: number) => string",
              description:
                "Formats numeric values shown inside active number/percentage filter pills.",
            },
            {
              name: "cell",
              type: "(props: CellContext<TData, unknown>) => ReactNode",
              description:
                "Full TanStack cell render override — use when you need access to the full row context.",
            },
            {
              name: "header",
              type: "(props: HeaderContext<TData, unknown>) => ReactNode",
              description: "Full TanStack header render override.",
            },
          ],
        },
        {
          title: "FilterConfig fields",
          props: [
            {
              name: "text",
              type: "boolean",
              description:
                'Debounced free-text search input. Works with type: "text".',
            },
            {
              name: "checkbox",
              type: "boolean",
              description:
                "Multi-select checkbox filter (arrIncludesSome). Requires options or inferOptions: true.",
            },
            {
              name: "checkboxSearch",
              type: 'boolean | { multiple?: boolean }',
              description:
                "Checkbox list with a search box. Set multiple: false for single-select (radio-style). Requires options or inferOptions: true.",
            },
            {
              name: "select",
              type: "boolean",
              description:
                "Single-value dropdown filter. Requires options or inferOptions: true.",
            },
            {
              name: "number",
              type: "boolean",
              description:
                'Condition + value filter (e.g. > 100, between 50–200). Works with type: "number".',
            },
            {
              name: "percentage",
              type: "boolean",
              description:
                'Dual-thumb range slider from 0–100. Works with type: "number" where values are percentages.',
            },
            {
              name: "date",
              type: "boolean",
              description:
                'Date range picker (start/end). Works with type: "date".',
            },
          ],
        },
      ]}
    />
  );
}
