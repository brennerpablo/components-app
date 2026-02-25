"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportTableToCSV } from "@/lib/exportTableToCSV";
import { Download } from "lucide-react";
import { Column, Table } from "@tanstack/react-table";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { DataTableFilter } from "./DataTableFilter";
import { ViewOptions } from "./DataTableViewOptions";
import { ColumnMetadata } from "./types";
import { useDataTableLocale } from "./DataTableLocaleContext";

function TextFilterInput<TData>({
  column,
  title,
}: {
  column: Column<TData, unknown>;
  title: string;
}) {
  const locale = useDataTableLocale();
  const [value, setValue] = useState("");

  const debouncedSet = useDebouncedCallback((v: string) => {
    column.setFilterValue(v || undefined);
  }, 300);

  return (
    <Input
      type="search"
      placeholder={locale.searchBy(title)}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        debouncedSet(e.target.value);
      }}
      className="h-8 w-full text-xs sm:max-w-62.5"
    />
  );
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  columnsMetadata?: readonly ColumnMetadata<TData>[];
  persistColumnOrder?: boolean;
  tableName?: string;
}

export function Filterbar<TData>({
  table,
  columnsMetadata,
  persistColumnOrder = false,
  tableName,
}: DataTableToolbarProps<TData>) {
  const locale = useDataTableLocale();
  const isFiltered = table.getState().columnFilters.length > 0;
  const [clearKey, setClearKey] = useState(0);

  const handleClearFilters = () => {
    table.resetColumnFilters();
    setClearKey((k) => k + 1);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-x-6">
      <div className="flex w-full flex-col gap-2 sm:w-fit sm:flex-row sm:items-center">
        {columnsMetadata?.map((col) => {
          if (!col.filters) return null;
          const column = table.getColumn(col.columnId);
          if (!column?.getIsVisible()) return null;

          return (
            <div key={col.columnId} className="contents">
              {col.filters.select && (
                <DataTableFilter
                  column={column}
                  title={col.title}
                  options={col.options}
                  type="select"
                />
              )}
              {col.filters.checkbox && (
                <DataTableFilter
                  column={column}
                  title={col.title}
                  options={col.options}
                  type="checkbox"
                />
              )}
              {col.filters.number && (
                <DataTableFilter
                  column={column}
                  title={col.title}
                  type="number"
                  formatter={
                    col.filterValueFormatter
                      ? (value) => col.filterValueFormatter!(Number(value))
                      : undefined
                  }
                />
              )}
              {col.filters.text && (
                <TextFilterInput
                  key={`${col.columnId}-${clearKey}`}
                  column={column}
                  title={col.title}
                />
              )}
            </div>
          );
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="border border-border px-2 font-semibold text-emerald-600 sm:border-none sm:py-1 dark:text-emerald-500"
            size="sm"
          >
            {locale.clearFilters}
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="hidden gap-x-2 px-2 py-1.5 text-sm sm:text-xs lg:flex"
          size="sm"
          onClick={() => exportTableToCSV(table, tableName ?? "export")}
        >
          <Download className="size-4 shrink-0" aria-hidden="true" />
          {locale.export}
        </Button>
        <ViewOptions table={table} persistColumnOrder={persistColumnOrder} />
      </div>
    </div>
  );
}
