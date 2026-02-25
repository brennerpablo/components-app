"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import * as React from "react";

import { DataTableBulkEditor } from "./DataTableBulkEditor";
import { Filterbar } from "./DataTableFilterbar";
import { DataTablePagination } from "./DataTablePagination";
import { buildColumnsFromMetadata } from "./columnBuilder";
import { ColumnMetadata } from "./types";
import { DataTableLocaleContext } from "./DataTableLocaleContext";
import { DataTableLanguage, getLocale } from "./i18n";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  columnsMetadata?: readonly ColumnMetadata<TData>[];
  persistColumnOrder?: boolean;
  tableName?: string;
  enableRowSelection?: boolean;
  enableRowActions?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  paginationDisplayTop?: boolean;
  language?: DataTableLanguage;
}

export function DataTable<TData>({
  columns,
  data,
  columnsMetadata,
  persistColumnOrder = false,
  tableName,
  enableRowSelection = false,
  enableRowActions = false,
  enablePagination = true,
  pageSize = 20,
  paginationDisplayTop = false,
  language = "en",
}: DataTableProps<TData>) {
  const locale = getLocale(language);
  const [rowSelection, setRowSelection] = React.useState({});

  const allColumns = React.useMemo(() => {
    if (!columnsMetadata?.length) return columns;
    const builtCols = buildColumnsFromMetadata(columnsMetadata);
    // columns[0] = select, columns[last] = edit/actions
    const actionsCol = enableRowActions ? [columns[columns.length - 1]] : [];
    if (enableRowSelection) {
      return [columns[0], ...builtCols, ...actionsCol];
    }
    return [...builtCols, ...actionsCol];
  }, [columns, columnsMetadata, enableRowSelection, enableRowActions]);

  const table = useReactTable({
    data,
    columns: allColumns,
    state: {
      rowSelection,
    },
    ...(enablePagination && {
      initialState: { pagination: { pageIndex: 0, pageSize } },
      getPaginationRowModel: getPaginationRowModel(),
    }),
    enableRowSelection: enableRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataTableLocaleContext.Provider value={locale}>
      <div className="space-y-3">
        <Filterbar
          table={table}
          columnsMetadata={columnsMetadata}
          persistColumnOrder={persistColumnOrder}
          tableName={tableName}
        />
        {enablePagination && paginationDisplayTop && (
          <DataTablePagination table={table} pageSize={pageSize} />
        )}
        <div className="relative overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-y border-border bg-muted/50 hover:bg-muted/50"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "whitespace-nowrap py-2 text-sm sm:text-xs",
                        header.column.columnDef.meta?.className,
                      )}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={
                      enableRowSelection
                        ? () => row.toggleSelected(!row.getIsSelected())
                        : undefined
                    }
                    className={cn(
                      "group select-none",
                      enableRowSelection && "cursor-pointer hover:bg-muted/50",
                    )}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          row.getIsSelected() ? "bg-muted/70" : "",
                          "relative whitespace-nowrap py-2 text-muted-foreground first:w-10",
                          cell.column.columnDef.meta?.className,
                        )}
                      >
                        {index === 0 &&
                          row.getIsSelected() &&
                          enableRowSelection && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-emerald-600 dark:bg-emerald-500" />
                          )}
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={allColumns.length}
                    className="h-24 text-center"
                  >
                    {locale.noResults}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {enableRowSelection && (
            <DataTableBulkEditor table={table} rowSelection={rowSelection} />
          )}
        </div>
        {enablePagination && !paginationDisplayTop && (
          <DataTablePagination table={table} pageSize={pageSize} />
        )}
      </div>
    </DataTableLocaleContext.Provider>
  );
}
