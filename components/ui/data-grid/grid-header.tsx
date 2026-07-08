"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import * as React from "react";

import {
  GUTTER_WIDTH,
  HEADER_HEIGHT,
  Z_CORNER,
  Z_HEADER,
} from "./constants";
import { useGridContext } from "./grid-context";
import { GridFilterPopover } from "./grid-filter-popover";
import { useGridSelection } from "./selection-store";
import type { GridColumn } from "./types";

export function GridHeader() {
  const { columns, colOffsets, pinnedColumns, pinnedWidth, strings } =
    useGridContext();
  return (
    <div
      className="sticky top-0 flex border-b bg-background"
      style={{
        zIndex: Z_HEADER,
        height: HEADER_HEIGHT,
        width: GUTTER_WIDTH + colOffsets[columns.length] + pinnedWidth,
      }}
    >
      {/* Covers the sub-pixel seam a sticky header leaves at its top edge on
          fractional scroll offsets (Chrome/HiDPI), through which the row
          border behind it would otherwise peek as a flickering line. The
          strip sits ABOVE the header and is clipped by the scroll container,
          so it only ever paints over the seam. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-1 h-1 bg-background"
      />
      <div
        data-grid-corner
        title={strings.selectAllCorner}
        className="sticky left-0 shrink-0 cursor-pointer border-r bg-muted"
        style={{ zIndex: Z_CORNER, width: GUTTER_WIDTH }}
      />
      {columns.map((col, i) => (
        <HeaderCell key={col.id} col={col} index={i} />
      ))}
      {pinnedColumns.length > 0 && (
        // Frozen-right header lane — mirror of the sticky-left corner.
        <div
          className="sticky right-0 flex shrink-0 border-l bg-background"
          style={{ zIndex: Z_CORNER, width: pinnedWidth }}
        >
          {pinnedColumns.map((col) => (
            <div
              key={col.id}
              className="flex shrink-0 items-center border-r bg-background px-2"
              style={{ width: col.width }}
            >
              <span
                className="min-w-0 flex-1 truncate text-xs font-medium"
                title={col.title}
              >
                {col.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const HeaderCell = React.memo(function HeaderCell({
  col,
  index,
}: {
  col: GridColumn<never>;
  index: number;
}) {
  const { store, sorting, startResize } = useGridContext();
  const isSelected = useGridSelection(store, () => {
    const rect = store.getRect();
    return !!rect && index >= rect.c0 && index <= rect.c1;
  });

  const sorted = sorting?.id === col.id ? (sorting.desc ? "desc" : "asc") : null;

  return (
    <div
      data-grid-header-col={index}
      className="group relative flex shrink-0 cursor-pointer select-none items-center gap-1 border-r bg-background px-2"
      style={{ width: col.width }}
    >
      {isSelected && (
        <div className="pointer-events-none absolute inset-0 bg-primary/10" />
      )}
      <span
        className="min-w-0 flex-1 truncate text-xs font-medium"
        title={col.title}
      >
        {col.title}
      </span>
      {sorted === "asc" && <ArrowUp className="size-3 shrink-0 text-primary" />}
      {sorted === "desc" && (
        <ArrowDown className="size-3 shrink-0 text-primary" />
      )}
      {(col.filter || col.sortable) && <GridFilterPopover col={col} />}
      <div
        data-grid-resize={index}
        aria-hidden
        className="absolute -right-0.75 top-0 z-10 h-full w-1.5 cursor-col-resize hover:bg-primary/50"
        onMouseDown={(e) => {
          // The delegated grid mousedown ignores [data-grid-resize]; this
          // handler owns the drag from the first pixel.
          e.preventDefault();
          e.stopPropagation();
          startResize(col.id, e.clientX, col.width);
        }}
      />
    </div>
  );
});
