import { ComponentDoc } from "@/components/ui/component-doc";

export function DataGridDocs() {
  return (
    <ComponentDoc
      title="DataGrid"
      description="A virtualized spreadsheet-style data grid. It is server-oriented by contract — a sparse getRow accessor plus windowed block fetching — so it scales to millions of rows. For local arrays, useClientGridSource applies sorting/filtering in memory and returns the data props."
      usage={`import * as React from "react"
import {
  DataGrid,
  defaultColumnState,
  useClientGridSource,
  type GridColumn,
  type GridColumnState,
  type GridFilterState,
  type GridSortState,
} from "@/components/ui/data-grid"

type Row = { name: string; team: string; salary: number; joined: string; url: string }

const columns: GridColumn<Row>[] = [
  { id: "name", title: "Name", type: "text", width: 180, sortable: true,
    filter: { conditions: "text", paramMap: { contains: "q" } } },
  { id: "team", title: "Team", type: "text", width: 140, sortable: true,
    filter: { optionsKey: "team", paramMap: { csv: "team" } } },
  { id: "salary", title: "Salary", type: "number", width: 120, align: "right", sortable: true,
    filter: { conditions: "number", paramMap: { range: { min: "min", max: "max" } } },
    format: (v) => \`$\${v}\` },
  { id: "joined", title: "Joined", type: "date", width: 120, sortable: true,
    filter: { conditions: "date", paramMap: { range: { min: "from", max: "to" } } } },
  // Frozen to the right, opens a link (or use onClick for an action):
  { id: "url", title: "", type: "text", width: 60, pinned: "right",
    action: { icon: ExternalLink, label: "Open", href: (row) => row.url } },
]

function Example({ data }: { data: Row[] }) {
  const [sorting, setSorting] = React.useState<GridSortState>({ id: "name", desc: false })
  const [filters, setFilters] = React.useState<GridFilterState>({})
  const [columnState, setColumnState] = React.useState<GridColumnState>(
    () => defaultColumnState(columns),
  )
  const src = useClientGridSource({ rows: data, columns, sorting, filters, summaryColumn: "salary" })

  return (
    <DataGrid<Row>
      columns={columns}
      columnState={columnState}
      onColumnStateChange={setColumnState}
      rowCount={src.rowCount}
      totalCount={src.totalCount}
      getRow={src.getRow}
      onViewportChange={src.onViewportChange}
      sorting={sorting}
      onSortingChange={setSorting}
      filters={filters}
      onFiltersChange={setFilters}
      filterOptions={src.filterOptions}
      summary={src.summary}
      resetToken={src.resetToken}
      toolbar={{
        export: { fetchRows: src.fetchRows, filename: "people", totalCount: src.totalCount },
        savedViews: { storageKey: "people-views" },
      }}
      language="en"
      className="h-[560px]"
    />
  )
}`}
      propSections={[
        {
          title: "DataGrid props",
          props: [
            {
              name: "columns",
              type: "GridColumn<TData>[]",
              required: true,
              description:
                "Full column definitions. Actual display order/visibility/width is driven by columnState.",
            },
            {
              name: "columnState",
              type: "GridColumnState",
              required: true,
              description:
                "Controlled layout { order, hidden, widths }. Seed with defaultColumnState(columns).",
            },
            {
              name: "onColumnStateChange",
              type: "(s: GridColumnState) => void",
              required: true,
              description:
                "Layout setter — fired on reorder, hide/show, and resize.",
            },
            {
              name: "rowCount",
              type: "number",
              required: true,
              description:
                "Virtualized row count (already capped to the browsable window).",
            },
            {
              name: "totalCount",
              type: "number",
              required: true,
              description: "Uncapped filtered total, shown in the status bar.",
            },
            {
              name: "getRow",
              type: "(index: number) => TData | undefined",
              required: true,
              description:
                "Sparse row accessor — return undefined while a block is still loading.",
            },
            {
              name: "onViewportChange",
              type: "(startRow: number, endRow: number) => void",
              required: true,
              description:
                "Fires the visible index range; drives block fetching. No-op for in-memory sources.",
            },
            {
              name: "sorting / onSortingChange",
              type: "GridSortState / (s) => void",
              required: true,
              description:
                "Controlled sort: { id, desc } | null. Sorting runs on the data source, not in the grid.",
            },
            {
              name: "filters / onFiltersChange",
              type: "GridFilterState / (f) => void",
              required: true,
              description:
                "Controlled per-column filters (checkbox value lists + typed conditions).",
            },
            {
              name: "filterOptions",
              type: "Record<string, GridFilterOption[]>",
              description:
                "Distinct-value lists for checkbox filters, keyed by each column's filter.optionsKey.",
            },
            {
              name: "summary",
              type: "GridStatusSummary | null",
              description:
                "{ count, total, mean } shown on the right of the status bar (e.g. from a currency column).",
            },
            {
              name: "isFetching",
              type: "boolean",
              description: "Shows the status-bar spinner.",
            },
            {
              name: "isRefreshing",
              type: "boolean",
              description:
                "Dims the body under a veil while a new sort/filter loads (keeps previous rows visible).",
            },
            {
              name: "toolbar",
              type: "GridToolbarConfig<TData>",
              description:
                "Top toolbar: export, fullscreen, saved views, column picker. Omit to hide the toolbar.",
            },
            {
              name: "resetToken",
              type: "string",
              description:
                "Change it on any sort/filter change to clear the selection and scroll to top without remounting.",
            },
            {
              name: "language",
              type: '"en" | "pt"',
              default: '"en"',
              description:
                "Locale for the chrome (toolbar, filter menus, status bar, toasts) and number formatting.",
            },
            {
              name: "className",
              type: "string",
              description:
                "Applied to the outer element — set a height (e.g. h-[560px]) so the grid can virtualize.",
            },
          ],
        },
        {
          title: "GridColumn fields",
          props: [
            {
              name: "id",
              type: "string",
              required: true,
              description:
                "Row-object key; also the sort id sent to the data source.",
            },
            {
              name: "title",
              type: "string",
              required: true,
              description: "Header label.",
            },
            {
              name: "type",
              type: '"text" | "number" | "date"',
              required: true,
              description:
                "Drives sorting, selection aggregates, and which filter condition operators are offered.",
            },
            {
              name: "width",
              type: "number",
              required: true,
              description: "Fixed column width in px (resizable at runtime).",
            },
            {
              name: "align",
              type: '"left" | "right"',
              default: '"left"',
              description: "Cell + header alignment.",
            },
            {
              name: "sortable",
              type: "boolean",
              default: "false",
              description: "Enables the sort shortcuts in the column menu.",
            },
            {
              name: "filter",
              type: "{ optionsKey?, conditions?, paramMap }",
              description:
                "Filter config. optionsKey → checkbox value list; conditions ('text' | 'number' | 'date') enables the typed condition section; paramMap declares the operators (contains/equals/range).",
            },
            {
              name: "pinned",
              type: '"right"',
              description:
                "Freeze the column to the right edge in a sticky lane (mirror of the row-number gutter). Display-only — meant for action/link icons.",
            },
            {
              name: "action",
              type: "{ icon, label, href?, onClick? }",
              description:
                "Render an interactive icon instead of text — an <a> (href) or a <button> (onClick). The cell stays copyable using the raw value.",
            },
            {
              name: "format",
              type: "(value, row) => string",
              description:
                "Display string for the cell (keep it cheap — cells render plain text).",
            },
            {
              name: "copyValue",
              type: "(value, row) => string",
              description:
                "Raw value used for clipboard/export TSV (defaults to String(value)).",
            },
          ],
        },
        {
          title: "GridToolbarConfig",
          props: [
            {
              name: "export",
              type: "{ fetchRows, filename, totalCount }",
              description:
                "Enables CSV/XLSX export. fetchRows(onProgress) returns the full filtered dataset (the grid only holds viewport blocks).",
            },
            {
              name: "savedViews",
              type: "{ storageKey: string }",
              description:
                "Enables saving/loading named filter+sort+layout snapshots to localStorage under storageKey.",
            },
            {
              name: "fullscreen",
              type: "boolean",
              default: "true",
              description:
                "Shows the fullscreen toggle (CSS overlay; Escape exits).",
            },
          ],
        },
        {
          title: "useClientGridSource(opts)",
          props: [
            {
              name: "rows",
              type: "TData[]",
              required: true,
              description: "The full in-memory dataset.",
            },
            {
              name: "columns",
              type: "GridColumn<TData>[]",
              required: true,
              description:
                "Same columns passed to the grid — used to interpret filters and derive filterOptions.",
            },
            {
              name: "sorting / filters",
              type: "GridSortState / GridFilterState",
              required: true,
              description:
                "The controlled state; the hook applies them to rows in memory.",
            },
            {
              name: "summaryColumn",
              type: "string",
              description:
                "Optional numeric column id — the hook computes { count, total, mean } for the status bar.",
            },
            {
              name: "→ returns",
              type: "ClientGridSource<TData>",
              description:
                "{ getRow, rowCount, totalCount, onViewportChange, filterOptions, summary, resetToken, fetchRows } — spread straight onto DataGrid.",
            },
          ],
        },
      ]}
    />
  );
}
