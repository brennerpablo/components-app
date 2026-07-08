"use client";

import { Mail, UserRound } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DataGrid,
  defaultColumnState,
  type GridColumn,
  type GridColumnState,
  type GridFilterState,
  type GridLanguage,
  type GridSortState,
  useClientGridSource,
} from "@/components/ui/data-grid";

import { type EmployeeRow,employeesData } from "../data";

const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const dateBR = (v: unknown) => {
  if (typeof v !== "string" || !v) return "";
  const [y, m, d] = v.split("-");
  return `${m}/${d}/${y}`;
};

const columns: GridColumn<EmployeeRow>[] = [
  {
    id: "name",
    title: "Name",
    type: "text",
    width: 170,
    sortable: true,
    filter: { conditions: "text", paramMap: { contains: "q" } },
  },
  {
    id: "email",
    title: "Email",
    type: "text",
    width: 220,
    filter: { conditions: "text", paramMap: { contains: "eq" } },
  },
  {
    id: "department",
    title: "Department",
    type: "text",
    width: 150,
    sortable: true,
    filter: { optionsKey: "department", paramMap: { csv: "department" } },
  },
  {
    id: "location",
    title: "Location",
    type: "text",
    width: 150,
    sortable: true,
    filter: { optionsKey: "location", paramMap: { csv: "location" } },
  },
  {
    id: "title",
    title: "Level",
    type: "text",
    width: 120,
    sortable: true,
    filter: { optionsKey: "title", paramMap: { csv: "title" } },
  },
  {
    id: "startDate",
    title: "Start date",
    type: "date",
    width: 120,
    sortable: true,
    filter: {
      conditions: "date",
      paramMap: { range: { min: "from", max: "to" } },
    },
    format: dateBR,
  },
  {
    id: "salary",
    title: "Salary",
    type: "number",
    width: 120,
    align: "right",
    sortable: true,
    filter: {
      conditions: "number",
      paramMap: { range: { min: "min", max: "max" } },
    },
    format: (v) => (v == null ? "" : usd0.format(Number(v))),
  },
  {
    id: "status",
    title: "Status",
    type: "text",
    width: 120,
    filter: { optionsKey: "status", paramMap: { csv: "status" } },
  },
  {
    id: "mail",
    title: "Mail",
    type: "text",
    width: 60,
    pinned: "right",
    action: {
      icon: Mail,
      label: "Send email",
      href: (row) => `mailto:${row.email}`,
    },
  },
  {
    id: "profile",
    title: "View",
    type: "text",
    width: 60,
    pinned: "right",
    action: {
      icon: UserRound,
      label: "View profile",
      onClick: (row) => toast.info(`Opening profile for ${row.name}`),
    },
  },
];

export function Employees() {
  const [language, setLanguage] = React.useState<GridLanguage>("en");
  const [sorting, setSorting] = React.useState<GridSortState>({
    id: "name",
    desc: false,
  });
  const [filters, setFilters] = React.useState<GridFilterState>({});
  const [columnState, setColumnState] = React.useState<GridColumnState>(() =>
    defaultColumnState(columns),
  );

  const src = useClientGridSource({
    rows: employeesData,
    columns,
    sorting,
    filters,
    summaryColumn: "salary",
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Chrome language:</span>
        <div className="flex overflow-hidden rounded-md border">
          {(["en", "pt"] as const).map((lng) => (
            <Button
              key={lng}
              variant={language === lng ? "secondary" : "ghost"}
              size="sm"
              className="h-7 rounded-none px-3 text-xs"
              onClick={() => setLanguage(lng)}
            >
              {lng.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      <DataGrid<EmployeeRow>
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
        language={language}
        toolbar={{
          export: {
            fetchRows: src.fetchRows,
            filename: "employees",
            totalCount: src.totalCount,
          },
          savedViews: { storageKey: "demo-employees-views" },
        }}
        className="h-[560px]"
      />
    </div>
  );
}
