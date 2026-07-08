"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import * as React from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { copySelection } from "./clipboard";
import {
  GUTTER_WIDTH,
  HEADER_HEIGHT,
  MAX_COL_WIDTH,
  MIN_COL_WIDTH,
  OVERSCAN,
  ROW_HEIGHT,
  Z_DROPLINE,
} from "./constants";
import { GridBody } from "./grid-body";
import { GridContext, type GridContextValue } from "./grid-context";
import { GridHeader } from "./grid-header";
import { GridEmptyState, GridLoadingState } from "./grid-loading";
import { type GridLanguage, localeFor, resolveGridStrings } from "./i18n";
import { SelectionOverlay } from "./selection-overlay";
import { GridSelectionStore } from "./selection-store";
import { GridStatusBar, type GridStatusSummary } from "./status-bar";
import { GridToolbar, type GridToolbarConfig } from "./toolbar";
import type {
  GridColumn,
  GridColumnState,
  GridFilterOption,
  GridFilterState,
  GridSortState,
} from "./types";
import { useGridKeyboard } from "./use-grid-keyboard";
import { useGridMouse } from "./use-grid-mouse";

export type DataGridProps<TData> = {
  /** Base column definitions (full set; display is driven by columnState). */
  columns: GridColumn<TData>[];
  /** User-adjustable layout: order, hidden, width overrides. Controlled. */
  columnState: GridColumnState;
  onColumnStateChange: (s: GridColumnState) => void;
  /** Virtualized row count — already capped to the browsable window. */
  rowCount: number;
  /** Uncapped filtered total, for the status bar. */
  totalCount: number;
  /** Sparse accessor — `undefined` while the row's block loads. */
  getRow: (index: number) => TData | undefined;
  /** Fired with the visible index range; drives block fetching. */
  onViewportChange: (startRow: number, endRow: number) => void;
  sorting: GridSortState;
  onSortingChange: (s: GridSortState) => void;
  filters: GridFilterState;
  onFiltersChange: (f: GridFilterState) => void;
  /** Distinct-value lists for checkbox filters, keyed by `optionsKey`. */
  filterOptions?: Record<string, GridFilterOption[]>;
  isFetching?: boolean;
  /** Previous rows shown as placeholder while a new sort/filter loads —
   * dims the body under a subtle veil instead of blanking the sheet. */
  isRefreshing?: boolean;
  summary?: GridStatusSummary | null;
  /** Top toolbar: export, fullscreen, saved views, column picker. Omit to hide it. */
  toolbar?: GridToolbarConfig<TData>;
  /**
   * Changes when sort/filters change: clears the selection and scrolls back
   * to the top WITHOUT remounting (a remount would drop the scroll element).
   */
  resetToken?: string;
  /** UI language for the chrome (toolbar, filters, status bar, toasts). */
  language?: GridLanguage;
  className?: string;
};

export function DataGrid<TData>({
  columns,
  columnState,
  onColumnStateChange,
  rowCount,
  totalCount,
  getRow,
  onViewportChange,
  sorting,
  onSortingChange,
  filters,
  onFiltersChange,
  filterOptions,
  isFetching,
  isRefreshing,
  summary,
  toolbar,
  resetToken,
  language = "en",
  className,
}: DataGridProps<TData>) {
  const strings = React.useMemo(() => resolveGridStrings(language), [language]);
  const intFmt = React.useMemo(
    () => new Intl.NumberFormat(localeFor(language)),
    [language],
  );
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const storeRef = React.useRef<GridSelectionStore | null>(null);
  if (!storeRef.current) storeRef.current = new GridSelectionStore();
  const store = storeRef.current;

  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const toggleFullscreen = React.useCallback(
    () => setIsFullscreen((v) => !v),
    [],
  );

  // Live width overrides while a resize drag is in flight — grid-local so
  // the screen doesn't re-render per pointer frame; committed to
  // columnState on release.
  const [dragWidths, setDragWidths] = React.useState<Record<
    string,
    number
  > | null>(null);

  // THE load-bearing derivation: everything below (offsets, selection
  // indices, clipboard, status bar, keyboard, export) operates on contiguous
  // VISIBLE indices. Hidden columns must never leak into index math.
  // Pinned-right columns are pulled into a separate sticky lane and are NOT
  // part of the selectable data grid — so the index math only ever sees the
  // unpinned (scrollable) columns.
  const { visibleColumns, pinnedColumns } = React.useMemo(() => {
    const byId = new Map(columns.map((c) => [c.id, c]));
    const hidden = new Set(columnState.hidden);
    const data: GridColumn<TData>[] = [];
    const pinned: GridColumn<TData>[] = [];
    for (const id of columnState.order) {
      const col = byId.get(id);
      if (!col || hidden.has(id)) continue;
      const width = dragWidths?.[id] ?? columnState.widths[id];
      const resolved =
        width != null && width !== col.width ? { ...col, width } : col;
      (resolved.pinned === "right" ? pinned : data).push(resolved);
    }
    return { visibleColumns: data, pinnedColumns: pinned };
  }, [columns, columnState, dragWidths]);

  const pinnedWidth = React.useMemo(
    () => pinnedColumns.reduce((sum, c) => sum + c.width, 0),
    [pinnedColumns],
  );

  const colOffsets = React.useMemo(() => {
    const offsets = [0];
    for (const col of visibleColumns)
      offsets.push(offsets[offsets.length - 1] + col.width);
    return offsets;
  }, [visibleColumns]);

  // Order/visibility changes re-map what each visible index MEANS — clear
  // the selection (unless a header move just replaced it deliberately).
  // Width changes don't alter indices and must NOT clear (hence the id-join
  // key, not visibleColumns identity).
  const visibleIdsKey = visibleColumns.map((c) => c.id).join(",");
  const justMovedRef = React.useRef(false);
  const prevIdsRef = React.useRef(visibleIdsKey);
  React.useEffect(() => {
    store.setDimensions(rowCount, visibleColumns.length);
    if (prevIdsRef.current !== visibleIdsKey) {
      prevIdsRef.current = visibleIdsKey;
      if (justMovedRef.current) justMovedRef.current = false;
      else store.clear();
    }
  }, [store, rowCount, visibleIdsKey, visibleColumns.length]);

  const startResize = React.useCallback(
    (colId: string, startX: number, startWidth: number) => {
      let rafId = 0;
      let lastX = startX;
      let lastWidth = startWidth;
      const onMove = (e: MouseEvent) => {
        lastX = e.clientX;
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          lastWidth = Math.max(
            MIN_COL_WIDTH,
            Math.min(MAX_COL_WIDTH, startWidth + (lastX - startX)),
          );
          setDragWidths({ [colId]: lastWidth });
        });
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        if (rafId) cancelAnimationFrame(rafId);
        document.body.classList.remove("cursor-col-resize");
        if (lastWidth !== startWidth) {
          onColumnStateChange({
            ...columnState,
            widths: { ...columnState.widths, [colId]: lastWidth },
          });
        }
        setDragWidths(null);
      };
      document.body.classList.add("cursor-col-resize");
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [columnState, onColumnStateChange],
  );

  // Sheets-style header move: the mouse hook reports the live drop boundary
  // and the commit in VISIBLE indices; we translate to ids on the full order.
  const [colDropTarget, setColDropTarget] = React.useState<number | null>(null);

  const handleColMove = React.useCallback(
    (from: number, to: number) => {
      // Dropping on either edge of the moved column itself is a no-op.
      if (to === from || to === from + 1) return;
      const visIds = visibleColumns.map((c) => c.id);
      const movedId = visIds[from];
      if (!movedId) return;
      const order = [...columnState.order];
      order.splice(order.indexOf(movedId), 1);
      if (to >= visIds.length) {
        const lastId = visIds[visIds.length - 1];
        order.splice(order.indexOf(lastId) + 1, 0, movedId);
      } else {
        order.splice(order.indexOf(visIds[to]), 0, movedId);
      }
      justMovedRef.current = true;
      onColumnStateChange({ ...columnState, order });
      // Keep the moved column selected at its new position (Sheets does).
      store.selectColumn(to > from ? to - 1 : to, false);
      store.endDrag();
    },
    [visibleColumns, columnState, onColumnStateChange, store],
  );

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
    // The sticky header sits INSIDE the scroll container above the rows
    // canvas; without this, scrollToIndex/range math is 36px shallow and
    // keyboard navigation leaves the active row clipped under the fold.
    scrollMargin: HEADER_HEIGHT,
  });
  const items = virtualizer.getVirtualItems();

  // Sort/filter change: clear selection, scroll to top, keep the mount.
  // Declared BEFORE the viewport effect so the scroll reset lands first on a
  // reset commit and the viewport effect doesn't report the stale position.
  const prevResetRef = React.useRef(resetToken);
  React.useEffect(() => {
    if (prevResetRef.current === resetToken) return;
    prevResetRef.current = resetToken;
    store.clear();
    virtualizer.scrollToOffset(0);
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, [resetToken, store, virtualizer]);

  const firstIndex = items[0]?.index ?? 0;
  const lastIndex = items[items.length - 1]?.index ?? 0;
  React.useEffect(() => {
    if (rowCount > 0) onViewportChange(firstIndex, lastIndex);
  }, [onViewportChange, firstIndex, lastIndex, rowCount]);

  // Fullscreen Escape exit. The grid's own keydown handler stops propagation
  // when it clears a selection, so an Escape reaching here means no selection
  // consumed it. Window-level so it also works when focus is on the toolbar.
  React.useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !store.getRect()) setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen, store]);

  useGridMouse({
    scrollRef,
    store,
    colOffsets,
    rowCount,
    colCount: visibleColumns.length,
    onColMoveTarget: setColDropTarget,
    onColMove: handleColMove,
  });

  const handleCopy = React.useCallback(() => {
    const rect = store.getRect();
    if (!rect) return;
    void copySelection({ rect, columns: visibleColumns, getRow }).then((res) => {
      if (!res.cells) {
        toast.warning(strings.nothingCopied);
        return;
      }
      store.flashCopy(rect);
      const totalRows = rect.r1 - rect.r0 + 1;
      if (res.skippedRows || res.truncatedRows) {
        // Partial copies must be loud — pasting silently truncated data into
        // a sheet is worse than no copy at all.
        toast.warning(
          strings.copiedPartial(
            intFmt.format(res.rows),
            intFmt.format(totalRows),
            !!res.skippedRows,
            !!res.truncatedRows,
          ),
        );
      } else {
        toast.success(strings.cellsCopied(intFmt.format(res.cells)));
      }
    });
  }, [store, visibleColumns, getRow, strings, intFmt]);

  const onKeyDown = useGridKeyboard({
    scrollRef,
    store,
    virtualizer,
    colOffsets,
    rowCount,
    colCount: visibleColumns.length,
    onCopy: handleCopy,
  });

  // getRow deliberately does NOT ride the context: its identity changes on
  // every block load, and gutter/header cells never read it. It goes as a
  // direct prop to the two consumers (body, status bar) instead.
  const ctx = React.useMemo<GridContextValue>(
    () => ({
      store,
      columns: visibleColumns as GridColumn<never>[],
      colOffsets,
      pinnedColumns: pinnedColumns as GridColumn<never>[],
      pinnedWidth,
      rowCount,
      sorting,
      onSortingChange,
      filters,
      onFiltersChange,
      filterOptions: filterOptions ?? {},
      startResize,
      strings,
      language,
    }),
    [
      store,
      visibleColumns,
      colOffsets,
      pinnedColumns,
      pinnedWidth,
      rowCount,
      sorting,
      onSortingChange,
      filters,
      onFiltersChange,
      filterOptions,
      startResize,
      strings,
      language,
    ],
  );

  const canvasWidth =
    GUTTER_WIDTH + colOffsets[visibleColumns.length] + pinnedWidth;

  return (
    <GridContext.Provider value={ctx}>
      {/* Outer column: the toolbar is a separate card, gapped from the sheet.
          Fullscreen (CSS-only — portaling would remount the scroll container
          and drop the virtualizer's scroll/selection) pads the cards off the
          viewport edges. */}
      <div
        className={cn(
          "flex min-h-0 flex-col gap-2",
          className,
          isFullscreen && "fixed inset-0 z-50 bg-background p-3",
        )}
      >
        {toolbar && (
          <GridToolbar
            config={toolbar}
            columns={[...visibleColumns, ...pinnedColumns]}
            allColumns={columns}
            columnState={columnState}
            onColumnStateChange={onColumnStateChange}
            filters={filters}
            onFiltersChange={onFiltersChange}
            sorting={sorting}
            onSortingChange={onSortingChange}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        )}
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border bg-background">
          {/* Refresh veil companion: a small floating pill anchored to the
              CARD (not the 3000px-wide canvas, where centering would land
              off-screen). */}
          {rowCount === 0 && !isFetching && <GridEmptyState />}
          {isRefreshing && rowCount > 0 && (
            <div className="pointer-events-none absolute bottom-12 left-1/2 z-40 -translate-x-1/2">
              <span className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground shadow-sm">
                <span className="size-3 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-transparent" />
                Carregando…
              </span>
            </div>
          )}
          <div
            ref={scrollRef}
            tabIndex={0}
            role="grid"
            aria-rowcount={rowCount}
            aria-colcount={visibleColumns.length}
            onKeyDown={onKeyDown}
            className="grid-scrollbar relative flex-1 overflow-auto overscroll-contain outline-none"
          >
            <div
              className="relative min-h-full"
              style={{ width: canvasWidth, minWidth: "100%" }}
            >
              <GridHeader />
              {rowCount === 0 && isFetching ? (
                <GridLoadingState />
              ) : rowCount > 0 ? (
                <div
                  className={cn(
                    "relative transition-opacity duration-200",
                    isRefreshing && "opacity-50",
                  )}
                  style={{ height: virtualizer.getTotalSize() }}
                >
                  <SelectionOverlay />
                  <GridBody items={items} getRow={getRow} />
                </div>
              ) : null}
              {colDropTarget != null && (
                <div
                  className="pointer-events-none absolute inset-y-0 w-0.5 bg-primary"
                  style={{
                    zIndex: Z_DROPLINE,
                    left: GUTTER_WIDTH + colOffsets[colDropTarget] - 1,
                  }}
                />
              )}
            </div>
          </div>
          <GridStatusBar
            totalCount={totalCount}
            rowCount={rowCount}
            getRow={getRow}
            summary={summary}
            isFetching={isFetching}
          />
        </div>
      </div>
    </GridContext.Provider>
  );
}
