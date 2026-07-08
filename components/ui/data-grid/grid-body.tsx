"use client";

import type { VirtualItem } from "@tanstack/react-virtual";
import * as React from "react";

import { cn } from "@/lib/utils";

import { GUTTER_WIDTH, HEADER_HEIGHT, ROW_HEIGHT, Z_GUTTER } from "./constants";
import { useGridContext } from "./grid-context";
import { useGridSelection } from "./selection-store";
import type { GridCellAction, GridColumn } from "./types";

/**
 * Virtualized rows. The perf contract: `GridCell` is a pure memoized leaf
 * with no hooks — nothing about selection/hover reaches it, so a drag-select
 * never re-renders the body. Rows re-render only when their block loads.
 */

const intBR = new Intl.NumberFormat("pt-BR");

export function GridBody({
  items,
  getRow,
}: {
  items: VirtualItem[];
  getRow: (index: number) => unknown;
}) {
  const { columns, colOffsets, pinnedColumns, pinnedWidth } = useGridContext();
  const width = GUTTER_WIDTH + colOffsets[columns.length] + pinnedWidth;
  return (
    <>
      {items.map((vi) => (
        <GridRow
          key={vi.index}
          index={vi.index}
          // virtualItem.start includes the virtualizer's scrollMargin (the
          // sticky header); rows are positioned inside the canvas below it.
          top={vi.start - HEADER_HEIGHT}
          row={getRow(vi.index)}
          columns={columns}
          pinnedColumns={pinnedColumns}
          pinnedWidth={pinnedWidth}
          width={width}
        />
      ))}
    </>
  );
}

type GridRowProps = {
  index: number;
  top: number;
  row: unknown;
  columns: GridColumn<never>[];
  pinnedColumns: GridColumn<never>[];
  pinnedWidth: number;
  width: number;
};

const GridRow = React.memo(function GridRow({
  index,
  top,
  row,
  columns,
  pinnedColumns,
  pinnedWidth,
  width,
}: GridRowProps) {
  const record = row as Record<string, unknown> | undefined;
  return (
    <div
      className={cn(
        "absolute left-0 flex hover:bg-accent/40",
        index % 2 === 1 && "bg-muted/30",
      )}
      style={{ top, height: ROW_HEIGHT, width }}
    >
      <GutterCell index={index} />
      {columns.map((col, c) => {
        if (col.action) {
          return (
            <GridActionCell
              key={col.id}
              action={col.action as GridCellAction<never>}
              row={record}
              width={col.width}
              loaded={!!record}
              r={index}
              c={c}
            />
          );
        }
        let text = "";
        if (record) {
          const v = record[col.id];
          text = col.format
            ? col.format(v, record as never)
            : v == null
              ? ""
              : String(v);
        }
        return (
          <GridCell
            key={col.id}
            text={text}
            width={col.width}
            align={col.align}
            loaded={!!record}
            r={index}
            c={c}
          />
        );
      })}
      {pinnedColumns.length > 0 && (
        // Frozen-right lane — mirror of the sticky-left gutter. Display-only:
        // no data-grid-cell markers, so the mouse layer never selects it.
        <div
          className="sticky right-0 flex shrink-0 border-l bg-background"
          style={{ zIndex: Z_GUTTER, width: pinnedWidth }}
        >
          {pinnedColumns.map((col) => (
            <GridPinnedCell
              key={col.id}
              col={col}
              row={record}
              loaded={!!record}
            />
          ))}
        </div>
      )}
    </div>
  );
});

const GutterCell = React.memo(function GutterCell({ index }: { index: number }) {
  const { store } = useGridContext();
  // store.getRect() is cached per snapshot — one rect allocation per store
  // emit for all ~70 gutter/header subscribers, not one per subscriber.
  const isSelected = useGridSelection(store, () => {
    const rect = store.getRect();
    return !!rect && index >= rect.r0 && index <= rect.r1;
  });
  return (
    <div
      data-grid-gutter={index}
      className="sticky left-0 flex shrink-0 cursor-pointer select-none items-center justify-end border-b border-r bg-muted pr-2"
      style={{ zIndex: Z_GUTTER, width: GUTTER_WIDTH }}
    >
      {isSelected && (
        <div className="pointer-events-none absolute inset-0 bg-primary/15" />
      )}
      <span
        className={cn(
          "relative text-[11px] tabular-nums",
          isSelected ? "font-medium text-foreground" : "text-muted-foreground",
        )}
      >
        {intBR.format(index + 1)}
      </span>
    </div>
  );
});

type GridCellProps = {
  text: string;
  width: number;
  align?: "left" | "right";
  loaded: boolean;
  r: number;
  c: number;
};

const GridCell = React.memo(function GridCell({
  text,
  width,
  align,
  loaded,
  r,
  c,
}: GridCellProps) {
  return (
    <div
      data-grid-cell
      data-r={r}
      data-c={c}
      className={cn(
        "flex shrink-0 items-center overflow-hidden border-b border-r px-2 text-xs whitespace-nowrap",
        align === "right" ? "justify-end tabular-nums" : "justify-start",
      )}
      style={{ width }}
    >
      {loaded ? (
        <span className="truncate">{text}</span>
      ) : (
        <span className="h-3 w-3/4 animate-pulse rounded-sm bg-muted" />
      )}
    </div>
  );
});

const ICON_CLS =
  "text-muted-foreground hover:text-foreground inline-flex items-center";

/**
 * The icon itself (link `<a>` or action `<button>`), shared by the in-grid
 * action cell and the frozen-right pinned cell. Carries `data-grid-cell-action`
 * so the mouse layer skips it — a click fires the link/handler, never a
 * selection. Renders a pulse until the row block loads.
 */
function ActionIcon({
  action,
  row,
  loaded,
}: {
  action: GridCellAction<never>;
  row: Record<string, unknown> | undefined;
  loaded: boolean;
}) {
  if (!loaded || !row) {
    return <span className="size-3.5 animate-pulse rounded-sm bg-muted" />;
  }
  const Icon = action.icon;
  const href = action.href?.(row as never);
  const label =
    typeof action.label === "function" ? action.label(row as never) : action.label;
  if (href) {
    return (
      <a
        data-grid-cell-action
        href={href}
        target="_blank"
        rel="noreferrer"
        title={label}
        aria-label={label}
        className={ICON_CLS}
      >
        <Icon className="size-4" />
      </a>
    );
  }
  if (action.onClick) {
    return (
      <button
        type="button"
        data-grid-cell-action
        title={label}
        aria-label={label}
        className={ICON_CLS}
        onClick={() => action.onClick?.(row as never)}
      >
        <Icon className="size-4" />
      </button>
    );
  }
  return null;
}

type GridActionCellProps = {
  action: GridCellAction<never>;
  row: Record<string, unknown> | undefined;
  width: number;
  loaded: boolean;
  r: number;
  c: number;
};

/**
 * Interactive icon cell in the scrollable grid. Still a real `[data-grid-cell]`
 * so the column stays selectable/copyable. (When a column is `pinned`, it goes
 * to the frozen lane via `GridPinnedCell` instead.)
 */
const GridActionCell = React.memo(function GridActionCell({
  action,
  row,
  width,
  loaded,
  r,
  c,
}: GridActionCellProps) {
  return (
    <div
      data-grid-cell
      data-r={r}
      data-c={c}
      className="flex shrink-0 items-center justify-center overflow-hidden border-b border-r px-2"
      style={{ width }}
    >
      <ActionIcon action={action} row={row} loaded={loaded} />
    </div>
  );
});

/**
 * One cell in the frozen-right pinned lane. Display-only (no `data-grid-cell`),
 * opaque background so scrolled content passes cleanly behind it. Renders the
 * column's icon action/link, or plain text for a non-action pinned column.
 */
const GridPinnedCell = React.memo(function GridPinnedCell({
  col,
  row,
  loaded,
}: {
  col: GridColumn<never>;
  row: Record<string, unknown> | undefined;
  loaded: boolean;
}) {
  if (col.action) {
    return (
      <div
        className="flex shrink-0 items-center justify-center overflow-hidden border-b border-r bg-background px-2"
        style={{ width: col.width }}
      >
        <ActionIcon action={col.action} row={row} loaded={loaded} />
      </div>
    );
  }
  let text = "";
  if (loaded && row) {
    const v = row[col.id];
    text = col.format
      ? col.format(v, row as never)
      : v == null
        ? ""
        : String(v);
  }
  return (
    <div
      className={cn(
        "flex shrink-0 items-center overflow-hidden border-b border-r bg-background px-2 text-xs whitespace-nowrap",
        col.align === "right" ? "justify-end tabular-nums" : "justify-start",
      )}
      style={{ width: col.width }}
    >
      {loaded ? (
        <span className="truncate">{text}</span>
      ) : (
        <span className="h-3 w-3/4 animate-pulse rounded-sm bg-muted" />
      )}
    </div>
  );
});
