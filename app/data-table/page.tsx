"use client";

import {
  DataTable,
  DataTableColumnHeader,
  ColumnMetadata,
} from "@/components/ui/data-table";
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
      </div>
    </main>
  );
}
