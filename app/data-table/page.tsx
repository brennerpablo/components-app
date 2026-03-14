"use client";

import {
  DataTable,
  DataTableColumnHeader,
  ColumnMetadata,
} from "@/components/ui/data-table";
import { ComponentDoc } from "@/components/ui/component-doc";
import { createColumns } from "./columns";
import { data } from "./data";
import { User } from "lucide-react";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

type Row = {
  owner: string;
  status: string;
  region: string;
  costs: number;
  uptime: number;
  lastEdited: string;
};

const statusStyles: Record<string, string> = {
  live: "bg-emerald-100 text-emerald-700",
  inactive: "bg-muted text-muted-foreground",
  archived: "bg-amber-100 text-amber-700",
};

const columnsMetadata = [
  {
    columnId: "owner",
    title: "Owner",
    type: "text",
    sortable: true,
    hideable: false,
    aligned: "left",
    filters: { text: true },
    header: ({ column }) => (
      <div className="flex items-center gap-1.5">
        <User className="h-3.5 w-3.5 text-muted-foreground" />
        <DataTableColumnHeader column={column} title="Owner" />
      </div>
    ),
  },
  {
    columnId: "status",
    title: "Status",
    type: "text",
    sortable: true,
    inferOptions: true,
    filters: { checkbox: true },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[status] ?? "bg-muted text-muted-foreground"}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    columnId: "region",
    title: "Region",
    subtitle: "Computing region",
    type: "text",
    sortable: true,
    inferOptions: true, // no need to pass options manually
    filters: { checkbox: true },
  },
  {
    columnId: "costs",
    title: "Costs",
    subtitle: "Monthly costs in USD",
    description:
      "Total infrastructure spend for the current billing month, calculated daily and finalized at month end.",
    type: "number",
    sortable: true,
    aligned: "left",
    filters: { number: true },
    formatter: (value: unknown) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(value as number)}
      </span>
    ),
    filterValueFormatter: formatCurrency,
  },
  {
    columnId: "uptime",
    title: "Uptime",
    subtitle: "Service uptime %",
    type: "number",
    sortable: true,
    aligned: "left",
    filters: { percentage: true },
    formatter: (value: unknown) => (
      <span className="font-medium tabular-nums">{value as number}%</span>
    ),
  },
  {
    columnId: "lastEdited",
    title: "Last edited",
    type: "date",
    sortable: true,
    aligned: "left",
    filters: { date: true },
  },
] as const satisfies ColumnMetadata<Row>[];

export default function DataTablePage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
          Cloud Usage Overview
        </h1>
        <DataTable<Row>
          columns={createColumns<Row>()}
          columnsMetadata={columnsMetadata}
          data={data}
          persistColumnOrder
          tableName="usage_overview"
          enableRowSelection={false}
          enableRowActions={false}
          enablePagination={true}
          // pageSize={5}
          // enablePageSizeSelect={true}
          paginationDisplayTop={true}
          language="pt"
          enableTextSelection
          bordered
        />
        <ComponentDoc
          title="DataTable"
          description="A flexible data table with sorting, filtering, pagination, row selection, and column visibility."
          usage={`import { DataTable, ColumnMetadata } from "@/components/ui/data-table"
import { createColumns } from "./columns"

type Row = { name: string; status: string; cost: number }

const columnsMetadata = [
  { columnId: "name", title: "Name", type: "text", sortable: true, filters: { text: true } },
  { columnId: "status", title: "Status", type: "text", inferOptions: true, filters: { checkbox: true } },
  { columnId: "cost", title: "Cost", type: "number", sortable: true, filters: { number: true } },
] as const satisfies ColumnMetadata<Row>[]

<DataTable<Row>
  columns={createColumns<Row>()}
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
                { name: "columns", type: "ColumnDef<TData>[]", required: true, description: "Column definitions. Use createColumns<TData>() to generate select + actions columns." },
                { name: "data", type: "TData[]", required: true, description: "The row data array." },
                { name: "columnsMetadata", type: "readonly ColumnMetadata<TData>[]", description: "Declarative column config. When provided, columns are built automatically from this." },
                { name: "persistColumnOrder", type: "boolean", default: "false", description: "Persists column visibility/order to localStorage (requires tableName)." },
                { name: "tableName", type: "string", description: "Key used for localStorage persistence when persistColumnOrder is true." },
                { name: "enableRowSelection", type: "boolean", default: "false", description: "Enables per-row checkboxes and bulk editor toolbar." },
                { name: "enableRowActions", type: "boolean", default: "false", description: "Renders an actions column at the end of each row." },
                { name: "enablePagination", type: "boolean", default: "true", description: "Enables pagination controls." },
                { name: "pageSize", type: "number", default: "25", description: "Initial number of rows per page." },
                { name: "enablePageSizeSelect", type: "boolean", default: "true", description: "Shows a page-size selector in the pagination bar." },
                { name: "paginationDisplayTop", type: "boolean", default: "false", description: "Renders pagination above the table instead of below." },
                { name: "language", type: '"en" | "pt"', default: '"en"', description: "UI locale for labels and messages." },
                { name: "enableTextSelection", type: "boolean", default: "true", description: "Allows text selection inside cells. Set to false to prevent accidental selection on click." },
                { name: "bordered", type: "boolean", default: "false", description: "Wraps the table in a rounded border." },
              ],
            },
            {
              title: "ColumnMetadata fields",
              props: [
                { name: "columnId", type: "keyof TData & string", required: true, description: "Key of the row data object this column maps to." },
                { name: "title", type: "string", required: true, description: "Column header label." },
                { name: "type", type: '"text" | "number" | "date"', required: true, description: "Data type — drives which filter controls and sort logic are applied." },
                { name: "subtitle", type: "string", description: "Secondary label shown below the title in the column header." },
                { name: "description", type: "string", description: "Tooltip text shown on the column header info icon." },
                { name: "sortable", type: "boolean", default: "false", description: "Enables click-to-sort on the column header." },
                { name: "hideable", type: "boolean", default: "true", description: "Controls whether the column appears in the visibility toggle menu." },
                { name: "aligned", type: '"left" | "center" | "right"', default: '"left"', description: "Horizontal alignment of both header and cell content." },
                { name: "options", type: "OptionItem[]", description: "Explicit list of { value, label } pairs for select/checkbox filters." },
                { name: "inferOptions", type: "boolean", default: "false", description: "Auto-derives filter options from the unique values in the data array. Overrides options." },
                { name: "filters", type: "FilterConfig", description: "Which filter controls to activate for this column. See FilterConfig below." },
                { name: "formatter", type: "(value: unknown) => ReactNode", description: "Custom cell renderer for the display value (e.g. currency, badges)." },
                { name: "filterValueFormatter", type: "(value: number) => string", description: "Formats numeric values shown inside active number/percentage filter pills." },
                { name: "cell", type: "(props: CellContext<TData, unknown>) => ReactNode", description: "Full TanStack cell render override — use when you need access to the full row context." },
                { name: "header", type: "(props: HeaderContext<TData, unknown>) => ReactNode", description: "Full TanStack header render override." },
              ],
            },
            {
              title: "FilterConfig fields",
              props: [
                { name: "text", type: "boolean", description: "Debounced free-text search input. Works with type: \"text\"." },
                { name: "checkbox", type: "boolean", description: "Multi-select checkbox filter (arrIncludesSome). Requires options or inferOptions: true." },
                { name: "select", type: "boolean", description: "Single-value dropdown filter. Requires options or inferOptions: true." },
                { name: "number", type: "boolean", description: "Condition + value filter (e.g. > 100, between 50–200). Works with type: \"number\"." },
                { name: "percentage", type: "boolean", description: "Dual-thumb range slider from 0–100. Works with type: \"number\" where values are percentages." },
                { name: "date", type: "boolean", description: "Date range picker (start/end). Works with type: \"date\"." },
              ],
            },
          ]}
        />
      </div>
    </main>
  );
}
