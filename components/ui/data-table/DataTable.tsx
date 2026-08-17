"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Updater,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import ReactDOM from "react-dom";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { cn } from "@/lib/utils";

import { buildColumnsFromMetadata, buildOptionLabelLookup } from "./columnBuilder";
import { DataTableBulkEditor } from "./DataTableBulkEditor";
import { Filterbar } from "./DataTableFilterbar";
import { DataTableLocaleContext } from "./DataTableLocaleContext";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableRowActions } from "./DataTableRowActions";
import { DataTableStickyHeader } from "./DataTableStickyHeader";
import { DataTableLanguage, getLocale } from "./i18n";
import { ColumnMetadata, resolveAccentColor } from "./types";

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

type RowActionCallbacks<TData> = {
  onAdd?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
};

function createActionsColumn<TData>(callbacks: RowActionCallbacks<TData>): ColumnDef<TData> {
  const helper = createColumnHelper<TData>();
  return helper.display({
    id: "edit",
    header: "Edit",
    enableSorting: false,
    enableHiding: false,
    meta: { className: "text-right", displayName: "Edit" },
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onAdd={callbacks.onAdd}
        onEdit={callbacks.onEdit}
        onDelete={callbacks.onDelete}
      />
    ),
  });
}

type BulkActionCallbacks<TData> = {
  onEdit?: (rows: TData[]) => void;
  onDelete?: (rows: TData[]) => void;
};

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
  accentColor?: string;
  enableFullscreen?: boolean;
  enableDownload?: boolean;
  enableColumnOptions?: boolean;
  toolbarIconsOnly?: boolean;
  /** Conteúdo extra renderizado junto dos botões da toolbar. */
  toolbarExtras?: React.ReactNode;
  compact?: boolean;
  /**
   * Floats a copy of the header at the top of the viewport once the real one
   * scrolls out of view, so long tables keep their column labels. Off by
   * default. See `DataTableStickyHeader` for why this is a clone and not
   * `position: sticky`.
   */
  stickyHeader?: boolean;
  /** Gap in px between the top of the scroll viewport and the floating header. Default 16. */
  stickyHeaderOffset?: number;
  /**
   * Whether the floating header can sort. Default `true`. Set `false` to make it
   * labels-only — the sort arrows still reflect the current sort, they just stop
   * responding to clicks.
   */
  stickyHeaderSortable?: boolean;
  fetching?: boolean;
  /**
   * Filters applied on first render, with the filter UI already showing them —
   * e.g. `[{ id: "isActive", value: ["true"] }]` for a list that opens on the
   * active records only. This is *initial*, uncontrolled state: the user can
   * still change it, and "clear filters" clears for real rather than restoring
   * the default.
   */
  initialColumnFilters?: ColumnFiltersState;
  onRowAction?: RowActionCallbacks<TData>;
  onBulkAction?: BulkActionCallbacks<TData>;
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
  accentColor,
  enableFullscreen = false,
  enableDownload = true,
  enableColumnOptions = true,
  toolbarIconsOnly = false,
  toolbarExtras,
  compact = false,
  stickyHeader = false,
  stickyHeaderOffset,
  stickyHeaderSortable = true,
  fetching = false,
  initialColumnFilters,
  onRowAction,
  onBulkAction,
}: DataTableProps<TData>) {
  const isGhost = tableStyle === "ghost";
  const locale = getLocale(language);
  const [rowSelection, setRowSelection] = React.useState({});
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const toggleFullscreen = React.useCallback(() => setIsFullscreen((v) => !v), []);

  // In fullscreen the table leaves the flow (only the portal renders), but the
  // REST of the page stays: wherever there is tall content outside the table,
  // the page scrollbar survives behind the overlay and scrolling does nothing.
  useBodyScrollLock(isFullscreen);

  React.useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Stabilize the data reference: if the array is a new object but contains
  // the same row references as last render, reuse the previous reference so
  // that downstream memos (enrichedMetadata, allColumns, TanStack) don't
  // re-run unnecessarily. This guards against the common pattern of parents
  // passing `data={someArray.filter(...)}` or `data={state.rows ?? []}` which
  // produces a new array identity on every render even when contents are unchanged.
  const dataRef = React.useRef<TData[]>(data);
  if (data !== dataRef.current) {
    const prev = dataRef.current;
    const isShallowEqual =
      data.length === prev.length && data.every((row, i) => row === prev[i]);
    if (!isShallowEqual) dataRef.current = data;
  }
  const stableData = dataRef.current;

  // Stabilize onRowAction: inline object literals get a new reference on every
  // parent render, which would cause allColumns to rebuild even when nothing
  // meaningful changed. Use a ref to always call the latest callbacks without
  // including them in the memo dependency array.
  const onRowActionRef = React.useRef(onRowAction);
  React.useEffect(() => { onRowActionRef.current = onRowAction; });
  const stableOnRowAction = React.useMemo(
    () => ({
      onAdd: onRowAction?.onAdd ? (row: TData) => onRowActionRef.current?.onAdd?.(row) : undefined,
      onEdit: onRowAction?.onEdit ? (row: TData) => onRowActionRef.current?.onEdit?.(row) : undefined,
      onDelete: onRowAction?.onDelete ? (row: TData) => onRowActionRef.current?.onDelete?.(row) : undefined,
    }),
    // Re-create only when the presence of a callback changes, not its identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [!!onRowAction?.onAdd, !!onRowAction?.onEdit, !!onRowAction?.onDelete],
  );

  const enrichedMetadata = React.useMemo(() => {
    if (!columnsMetadata?.length) return columnsMetadata;
    return columnsMetadata.map((col) => {
      if (!col.inferOptions) return col;
      const labelFor = buildOptionLabelLookup(col);
      const seen = new Set<string>();
      const options: { value: string; label: string }[] = [];
      for (const row of stableData) {
        const raw = (row as Record<string, unknown>)[col.columnId];
        const val = raw == null ? "" : String(raw);
        if (!seen.has(val)) {
          seen.add(val);
          options.push({ value: val, label: labelFor(val) });
        }
      }
      options.sort((a, b) => a.label.localeCompare(b.label));
      return { ...col, options };
    });
  }, [columnsMetadata, stableData]);

  const allColumns = React.useMemo(() => {
    const builtCols = enrichedMetadata?.length
      ? buildColumnsFromMetadata(enrichedMetadata)
      : [];
    const selectCol = enableRowSelection ? [createSelectColumn<TData>()] : [];
    const actionsCol = enableRowActions ? [createActionsColumn<TData>(stableOnRowAction)] : [];
    return [...selectCol, ...builtCols, ...actionsCol];
  }, [enrichedMetadata, enableRowSelection, enableRowActions, stableOnRowAction]);

  const filterOnlyColumnIds = React.useMemo(
    () => (columnsMetadata ?? []).filter((c) => c.filterOnly).map((c) => c.columnId),
    [columnsMetadata],
  );
  const hasFilterOnly = filterOnlyColumnIds.length > 0;

  const [userColumnVisibility, setUserColumnVisibility] = React.useState<VisibilityState>({});

  const columnVisibilityForTable = React.useMemo(() => {
    if (!hasFilterOnly) return undefined;
    const merged: VisibilityState = { ...userColumnVisibility };
    for (const id of filterOnlyColumnIds) {
      merged[id] = false;
    }
    return merged;
  }, [userColumnVisibility, filterOnlyColumnIds, hasFilterOnly]);

  const handleColumnVisibilityChange = React.useCallback(
    (updater: Updater<VisibilityState>) => {
      setUserColumnVisibility((prev) => {
        const full: VisibilityState = { ...prev };
        for (const id of filterOnlyColumnIds) {
          full[id] = false;
        }
        const updated = typeof updater === "function" ? updater(full) : updater;
        const next: VisibilityState = { ...prev };
        for (const [k, val] of Object.entries(updated)) {
          if (!(filterOnlyColumnIds as string[]).includes(k)) {
            next[k] = val;
          }
        }
        return next;
      });
    },
    [filterOnlyColumnIds],
  );

  const table = useReactTable({
    data,
    columns: allColumns,
    state: {
      rowSelection,
      ...(columnVisibilityForTable && { columnVisibility: columnVisibilityForTable }),
    },
    initialState: {
      ...(enablePagination ? { pagination: { pageIndex: 0, pageSize } } : {}),
      ...(initialColumnFilters ? { columnFilters: initialColumnFilters } : {}),
    },
    ...(enablePagination && {
      getPaginationRowModel: getPaginationRowModel(),
    }),
    enableRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    ...(hasFilterOnly && { onColumnVisibilityChange: handleColumnVisibilityChange }),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Measured by the floating header clone (`stickyHeader`).
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const tableElementRef = React.useRef<HTMLTableElement | null>(null);
  const headerElementRef = React.useRef<HTMLTableSectionElement | null>(null);
  const headerClassName = cn(isGhost && "[&_tr]:border-0!");

  // Built once and rendered in both the in-flow header and the floating clone.
  // Sharing the element identity also means the clone's own geometry updates
  // never re-render these cells.
  const headerRows = table.getHeaderGroups().map((headerGroup) => (
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
            compact
              ? "whitespace-nowrap py-0.5 text-sm sm:text-xs"
              : "whitespace-nowrap py-2 text-sm sm:text-xs",
            bordered && "first:pl-4 last:pr-4",
            header.column.columnDef.meta?.className,
            // `columnClassName` describes the DATA cells — `align-top` is how a
            // column with multi-line rows keeps its text at the top — but it
            // lands on the header cell too. Left alone, those labels top-align
            // while columns without it stay centred, so a header row mixes two
            // baselines (most visible against the actions column's icon).
            // Restored last so it wins the vertical-align group in twMerge.
            "align-middle",
          )}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
        </TableHead>
      ))}
    </TableRow>
  ));

  const tableContent = (
    <DataTableLocaleContext.Provider value={locale}>
      <div
        className={cn("space-y-3 transition-opacity duration-300", fetching && "opacity-50 pointer-events-none")}
        style={
          { "--dt-accent": resolveAccentColor(accentColor) } as React.CSSProperties
        }
      >
        <Filterbar
          table={table}
          columnsMetadata={enrichedMetadata}
          persistColumnOrder={persistColumnOrder}
          tableName={tableName}
          accentColor={accentColor}
          isFullscreen={isFullscreen}
          onToggleFullscreen={enableFullscreen ? toggleFullscreen : undefined}
          enableDownload={enableDownload}
          enableColumnOptions={enableColumnOptions}
          toolbarIconsOnly={toolbarIconsOnly}
          toolbarExtras={toolbarExtras}
        />
        {enablePagination && paginationDisplayTop && (
          <DataTablePagination table={table} enablePageSizeSelect={enablePageSizeSelect} enableRowActions={enableRowActions} />
        )}
        <div
          ref={scrollContainerRef}
          className={cn("relative overflow-hidden overflow-x-auto", bordered && "rounded-md border border-border")}
        >
          <Table ref={tableElementRef}>
            <TableHeader ref={headerElementRef} className={headerClassName}>
              {headerRows}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
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
                          !isGhost && "bg-background group-hover:bg-muted/30",
                          !isGhost && row.getIsSelected() && "bg-muted/70",
                          compact ? "relative whitespace-nowrap py-0.5 text-muted-foreground first:w-10" : "relative whitespace-nowrap py-2 text-muted-foreground first:w-10",
                          bordered && "first:pl-4 last:pr-4",
                          cell.column.columnDef.meta?.className,
                        )}
                      >
                        {index === 0 &&
                          row.getIsSelected() &&
                          enableRowSelection && (
                            <div
                              className="absolute inset-y-0 left-0 w-0.5"
                              style={{ backgroundColor: "var(--dt-accent)" }}
                            />
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
          {stickyHeader && (
            <DataTableStickyHeader
              containerRef={scrollContainerRef}
              tableRef={tableElementRef}
              headerRef={headerElementRef}
              headerClassName={headerClassName}
              style={
                { "--dt-accent": resolveAccentColor(accentColor) } as React.CSSProperties
              }
              zIndex={isFullscreen ? 51 : 30}
              offsetTop={stickyHeaderOffset}
              sortable={stickyHeaderSortable}
              surfaceClassName={isFullscreen ? "bg-background" : "bg-card"}
            >
              {headerRows}
            </DataTableStickyHeader>
          )}
          {enableRowSelection && (
            <DataTableBulkEditor
              table={table}
              rowSelection={rowSelection}
              onEdit={onBulkAction?.onEdit}
              onDelete={onBulkAction?.onDelete}
            />
          )}
        </div>
        {enablePagination && !paginationDisplayTop && (
          <DataTablePagination table={table} enablePageSizeSelect={enablePageSizeSelect} enableRowActions={enableRowActions} />
        )}
      </div>
    </DataTableLocaleContext.Provider>
  );

  if (isFullscreen) {
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-50 flex flex-col bg-background p-4 animate-in fade-in-0 zoom-in-95 duration-200 sm:p-6">
        <div className="flex min-h-0 flex-1 flex-col overflow-auto">
          {tableContent}
        </div>
      </div>,
      document.body,
    );
  }

  return tableContent;
}
