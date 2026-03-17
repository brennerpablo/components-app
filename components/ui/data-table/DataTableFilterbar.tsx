"use client";

import { Column, Table } from "@tanstack/react-table";
import { Download, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { exportTableToCSV } from "@/lib/exportTableToCSV";
import { exportTableToXLSX } from "@/lib/exportTableToXLSX";

import { DataTableFilter } from "./DataTableFilter";
import { useDataTableLocale } from "./DataTableLocaleContext";
import { ViewOptions } from "./DataTableViewOptions";
import { ColumnMetadata } from "./types";

function TextFilterInput<TData>({
  column,
  title,
  extraTitles = [],
}: {
  column: Column<TData, unknown>;
  title: string;
  extraTitles?: string[];
}) {
  const locale = useDataTableLocale();
  const [value, setValue] = useState("");

  const debouncedSet = useDebouncedCallback((v: string) => {
    column.setFilterValue(v || undefined);
  }, 300);

  return (
    <Input
      type="search"
      placeholder={locale.searchBy([title, ...extraTitles].join(", "))}
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
  accentColor?: string;
  isFullscreen: boolean;
  onToggleFullscreen?: () => void;
}

export function Filterbar<TData>({
  table,
  columnsMetadata,
  persistColumnOrder = false,
  tableName,
  accentColor,
  isFullscreen,
  onToggleFullscreen,
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
                  accentColor={accentColor}
                />
              )}
              {col.filters.checkbox && (
                <DataTableFilter
                  column={column}
                  title={col.title}
                  options={col.options}
                  type="checkbox"
                  accentColor={accentColor}
                />
              )}
              {col.filters.checkboxSearch && (
                <DataTableFilter
                  column={column}
                  title={col.title}
                  options={col.options}
                  type="checkboxSearch"
                  multiple={
                    typeof col.filters.checkboxSearch === "object"
                      ? (col.filters.checkboxSearch.multiple ?? true)
                      : true
                  }
                  accentColor={accentColor}
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
                  accentColor={accentColor}
                />
              )}
              {col.filters.percentage && (
                <DataTableFilter
                  column={column}
                  title={col.title}
                  type="percentage"
                  accentColor={accentColor}
                />
              )}
              {col.filters.date && (
                <DataTableFilter
                  column={column}
                  title={col.title}
                  type="date"
                  accentColor={accentColor}
                />
              )}
              {col.filters.text && (
                <TextFilterInput
                  key={`${col.columnId}-${clearKey}`}
                  column={column}
                  title={col.title}
                  extraTitles={col.filters.textColumns?.map(
                    (id) => columnsMetadata?.find((m) => m.columnId === id)?.title ?? id
                  )}
                />
              )}
            </div>
          );
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="border border-border px-2 font-semibold sm:border-none sm:py-1"
            style={{ color: "var(--dt-accent)" }}
            size="sm"
          >
            {locale.clearFilters}
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="hidden gap-x-2 px-2 py-1.5 text-sm sm:text-xs lg:flex"
              size="sm"
            >
              <Download className="size-4 shrink-0" aria-hidden="true" />
              {locale.export}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => exportTableToCSV(table, tableName ?? "export")}
            >
              {locale.exportCsv}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => exportTableToXLSX(table, tableName ?? "export")}
            >
              {locale.exportXlsx}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ViewOptions table={table} persistColumnOrder={persistColumnOrder} />
        {onToggleFullscreen && (
          <Button
            variant="outline"
            size="sm"
            className="hidden gap-x-2 px-2 py-1.5 text-sm sm:text-xs lg:flex"
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? locale.exitFullscreen : locale.fullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="size-4 shrink-0" aria-hidden="true" />
            ) : (
              <Maximize2 className="size-4 shrink-0" aria-hidden="true" />
            )}
            {isFullscreen ? locale.exitFullscreen : locale.fullscreen}
          </Button>
        )}
      </div>
    </div>
  );
}
