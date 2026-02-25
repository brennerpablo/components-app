"use client";

import {
  DataTable,
  ColumnMetadata,
  InferRowType,
} from "@/components/ui/data-table";
import { createColumns } from "./columns";
import { data, dataRegions } from "./data";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

const columnsMetadata = [
  {
    columnId: "owner",
    title: "Owner",
    type: "text",
    sortable: true,
    hideable: false,
    aligned: "left",
    filters: { text: true },
  },
  {
    columnId: "region",
    title: "Region",
    subtitle: "Computing region",
    type: "text",
    sortable: true,
    options: dataRegions,
    filters: { checkbox: true },
  },
  {
    columnId: "costs",
    title: "Costs",
    subtitle: "Monthly costs in USD",
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
    columnId: "lastEdited",
    title: "Last edited",
    type: "text",
    sortable: true,
    aligned: "left",
  },
] as const satisfies ColumnMetadata[];

type Row = InferRowType<typeof columnsMetadata>;

export default function DataTablePage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
          Usage Overview
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
          paginationDisplayTop={false}
          language="pt"
        />
      </div>
    </main>
  );
}
