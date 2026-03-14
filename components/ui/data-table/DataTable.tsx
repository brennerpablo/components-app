"use client";

import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { buildColumnsFromMetadata } from "./columnBuilder";
import { DataTableBulkEditor } from "./DataTableBulkEditor";
import { Filterbar } from "./DataTableFilterbar";
import { DataTableLocaleContext } from "./DataTableLocaleContext";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableRowActions } from "./DataTableRowActions";
import { DataTableLanguage, getLocale } from "./i18n";
import { ColumnMetadata } from "./types";

function createSelectColumn<TData>(): ColumnDef<TData> {
  const helper = createColumnHelper<TData>();
  return helper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomeRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={() => table.toggleAllPageRowsSelected()}
        className="translate-y-0.5"
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={() => row.toggleSelected()}
        className="translate-y-0.5"
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: { displayName: "Select" },
  });
}

function createActionsColumn<TData>(): ColumnDef<TData> {
  const helper = createColumnHelper<TData>();
  return helper.display({
    id: "edit",
    header: "Edit",
    enableSorting: false,
    enableHiding: false,
    meta: { className: "text-right", displayName: "Edit" },
    cell: ({ row }) => <DataTableRowActions row={row} />,
  });
}

interface DataTableProps<TData> {
  data: TData[];
  columnsMetadata?: readonly ColumnMetadata<TData>[];
  persistColumnOrder?: boolean;
  tableName?: string;
  enableRowSelection?: boolean;
  enableRowActions?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  enablePageSizeSelect?: boolean;
  paginationDisplayTop?: boolean;
  language?: DataTableLanguage;
  enableTextSelection?: boolean;
  bordered?: boolean;
  tableStyle?: "default" | "ghost";
}

export function DataTable<TData>({
  data,
  columnsMetadata,
  persistColumnOrder = false,
  tableName,
  enableRowSelection = false,
  enableRowActions = false,
  enablePagination = true,
  pageSize = 25,
  enablePageSizeSelect = true,
  paginationDisplayTop = false,
  language = "en",
  enableTextSelection = true,
  bordered = false,
  tableStyle = "default",
}: DataTableProps<TData>) {
  const isGhost = tableStyle === "ghost";
  const locale = getLocale(language);
  const [rowSelection, setRowSelection] = React.useState({});

  const enrichedMetadata = React.useMemo(() => {
    if (!columnsMetadata?.length) return columnsMetadata;
    return columnsMetadata.map((col) => {
      if (!col.inferOptions) return col;
      const seen = new Set<string>();
      const options: { value: string; label: string }[] = [];
      for (const row of data) {
        const raw = (row as Record<string, unknown>)[col.columnId];
        const val = raw == null ? "" : String(raw);
        if (!seen.has(val)) {
          seen.add(val);
          options.push({ value: val, label: val });
        }
      }
      options.sort((a, b) => a.label.localeCompare(b.label));
      return { ...col, options };
    });
  }, [columnsMetadata, data]);

  const allColumns = React.useMemo(() => {
    const builtCols = enrichedMetadata?.length
      ? buildColumnsFromMetadata(enrichedMetadata)
      : [];
    const selectCol = enableRowSelection ? [createSelectColumn<TData>()] : [];
    const actionsCol = enableRowActions ? [createActionsColumn<TData>()] : [];
    return [...selectCol, ...builtCols, ...actionsCol];
  }, [enrichedMetadata, enableRowSelection, enableRowActions]);

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
          columnsMetadata={enrichedMetadata}
          persistColumnOrder={persistColumnOrder}
          tableName={tableName}
        />
        {enablePagination && paginationDisplayTop && (
          <DataTablePagination table={table} enablePageSizeSelect={enablePageSizeSelect} enableRowActions={enableRowActions} />
        )}
        <div className={cn("relative overflow-hidden overflow-x-auto", bordered && "rounded-md border border-border")}>
          <Table>
            <TableHeader className={cn(isGhost && "[&_tr]:border-0!")}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className={cn(
                    "border-border",
                    !isGhost && "bg-muted/50 hover:bg-muted/50",
                    !isGhost && (bordered ? "border-b" : "border-y"),
                    isGhost && "hover:bg-transparent",
                  )}
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "whitespace-nowrap py-2 text-sm sm:text-xs",
                        bordered && "first:pl-4 last:pr-4",
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
                      "group",
                      isGhost && "border-0! hover:bg-transparent",
                      !enableTextSelection && "select-none",
                      enableRowSelection && "cursor-pointer",
                      enableRowSelection && !isGhost && "hover:bg-muted/50",
                    )}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          !isGhost && row.getIsSelected() && "bg-muted/70",
                          "relative whitespace-nowrap py-2 text-muted-foreground first:w-10",
                          bordered && "first:pl-4 last:pr-4",
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
          <DataTablePagination table={table} enablePageSizeSelect={enablePageSizeSelect} enableRowActions={enableRowActions} />
        )}
      </div>
    </DataTableLocaleContext.Provider>
  );
}
