"use client";

import { ExternalLink } from "lucide-react";
import * as React from "react";

import {
  DataGrid,
  defaultColumnState,
  type GridColumn,
  type GridColumnState,
  type GridFilterState,
  type GridSortState,
  useClientGridSource,
} from "@/components/ui/data-grid";

import { type TransactionRow,transactionsData } from "../data";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const dateBR = (v: unknown) => {
  if (typeof v !== "string" || !v) return "";
  const [y, m, d] = v.split("-");
  return `${m}/${d}/${y}`;
};

const columns: GridColumn<TransactionRow>[] = [
  {
    id: "date",
    title: "Date",
    type: "date",
    width: 110,
    sortable: true,
    filter: { conditions: "date", paramMap: { range: { min: "from", max: "to" } } },
    format: dateBR,
  },
  {
    id: "id",
    title: "Reference",
    type: "text",
    width: 120,
    sortable: true,
    filter: { conditions: "text", paramMap: { contains: "q" } },
  },
  {
    id: "merchant",
    title: "Merchant",
    type: "text",
    width: 170,
    sortable: true,
    filter: {
      optionsKey: "merchant",
      conditions: "text",
      paramMap: { csv: "merchant", contains: "mq" },
    },
  },
  {
    id: "category",
    title: "Category",
    type: "text",
    width: 140,
    sortable: true,
    filter: { optionsKey: "category", paramMap: { csv: "category" } },
  },
  {
    id: "account",
    title: "Account",
    type: "text",
    width: 150,
    filter: { optionsKey: "account", paramMap: { csv: "account" } },
  },
  {
    id: "status",
    title: "Status",
    type: "text",
    width: 120,
    sortable: true,
    filter: { optionsKey: "status", paramMap: { csv: "status" } },
  },
  {
    id: "amount",
    title: "Amount",
    type: "number",
    width: 130,
    align: "right",
    sortable: true,
    filter: {
      conditions: "number",
      paramMap: { range: { min: "amtMin", max: "amtMax" } },
    },
    format: (v) => (v == null ? "" : usd.format(Number(v))),
  },
  {
    id: "receiptUrl",
    title: "Receipt",
    type: "text",
    width: 70,
    pinned: "right",
    action: {
      icon: ExternalLink,
      label: "Open receipt",
      href: (row) => row.receiptUrl,
    },
  },
];

export function Transactions() {
  const [sorting, setSorting] = React.useState<GridSortState>({
    id: "date",
    desc: true,
  });
  const [filters, setFilters] = React.useState<GridFilterState>({});
  const [columnState, setColumnState] = React.useState<GridColumnState>(() =>
    defaultColumnState(columns),
  );

  const src = useClientGridSource({
    rows: transactionsData,
    columns,
    sorting,
    filters,
    summaryColumn: "amount",
  });

  return (
    <DataGrid<TransactionRow>
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
        export: {
          fetchRows: src.fetchRows,
          filename: "transactions",
          totalCount: src.totalCount,
        },
        savedViews: { storageKey: "demo-transactions-views" },
      }}
      className="h-[560px]"
    />
  );
}
