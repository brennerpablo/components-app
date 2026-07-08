"use client";

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

import { type ServerRow,serversData } from "../data";

const usd2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const dateBR = (v: unknown) => {
  if (typeof v !== "string" || !v) return "";
  const [y, m, d] = v.split("-");
  return `${m}/${d}/${y}`;
};

const numRange = (min: string, max: string) =>
  ({ conditions: "number", paramMap: { range: { min, max } } }) as const;

const columns: GridColumn<ServerRow>[] = [
  {
    id: "host",
    title: "Host",
    type: "text",
    width: 220,
    sortable: true,
    filter: { conditions: "text", paramMap: { contains: "q" } },
  },
  {
    id: "region",
    title: "Region",
    type: "text",
    width: 130,
    sortable: true,
    filter: { optionsKey: "region", paramMap: { csv: "region" } },
  },
  {
    id: "type",
    title: "Type",
    type: "text",
    width: 110,
    sortable: true,
    filter: { optionsKey: "type", paramMap: { csv: "type" } },
  },
  {
    id: "cpu",
    title: "vCPU",
    type: "number",
    width: 90,
    align: "right",
    sortable: true,
    filter: numRange("cpuMin", "cpuMax"),
  },
  {
    id: "memGb",
    title: "Memory",
    type: "number",
    width: 100,
    align: "right",
    sortable: true,
    filter: numRange("memMin", "memMax"),
    format: (v) => (v == null ? "" : `${v} GB`),
  },
  {
    id: "costMonth",
    title: "Cost / mo",
    type: "number",
    width: 120,
    align: "right",
    sortable: true,
    filter: numRange("costMin", "costMax"),
    format: (v) => (v == null ? "" : usd2.format(Number(v))),
  },
  {
    id: "uptime",
    title: "Uptime",
    type: "number",
    width: 100,
    align: "right",
    sortable: true,
    filter: numRange("upMin", "upMax"),
    format: (v) => (v == null ? "" : `${Number(v).toFixed(2)}%`),
  },
  {
    id: "lastSeen",
    title: "Last seen",
    type: "date",
    width: 120,
    sortable: true,
    filter: { conditions: "date", paramMap: { range: { min: "from", max: "to" } } },
    format: dateBR,
  },
];

export function Servers() {
  const [sorting, setSorting] = React.useState<GridSortState>({
    id: "costMonth",
    desc: true,
  });
  const [filters, setFilters] = React.useState<GridFilterState>({});
  const [columnState, setColumnState] = React.useState<GridColumnState>(() =>
    defaultColumnState(columns),
  );

  const src = useClientGridSource({
    rows: serversData,
    columns,
    sorting,
    filters,
    summaryColumn: "costMonth",
  });

  return (
    <DataGrid<ServerRow>
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
          filename: "servers",
          totalCount: src.totalCount,
        },
        savedViews: { storageKey: "demo-servers-views" },
      }}
      className="h-[560px]"
    />
  );
}
