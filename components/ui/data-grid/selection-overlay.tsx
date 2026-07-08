"use client";

import * as React from "react";

import { GUTTER_WIDTH, ROW_HEIGHT, Z_OVERLAY } from "./constants";
import { useGridContext } from "./grid-context";
import { useGridSelection } from "./selection-store";
import type { GridRect } from "./types";

/**
 * Paints the selection as absolutely-positioned rectangles in the canvas
 * coordinate space — the range fill, the active-cell ring and the copy
 * flash. Geometry is pure arithmetic (fixed row height + column prefix
 * sums), so a drag updates three divs and nothing else.
 */
export function SelectionOverlay() {
  const { store, colOffsets } = useGridContext();
  const snap = useGridSelection(store, (s) => s);
  const rect = store.getRect();

  const box = React.useCallback(
    (r: GridRect) => ({
      top: r.r0 * ROW_HEIGHT,
      height: (r.r1 - r.r0 + 1) * ROW_HEIGHT,
      left: GUTTER_WIDTH + colOffsets[r.c0],
      width: colOffsets[r.c1 + 1] - colOffsets[r.c0],
    }),
    [colOffsets],
  );

  if (!rect && !snap.copyFlash) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: Z_OVERLAY }}
    >
      {rect && (
        <div
          className="absolute border border-primary/70 bg-primary/10"
          style={box(rect)}
        />
      )}
      {snap.focus && rect && (
        <div
          className="absolute border-2 border-primary bg-transparent"
          style={box({
            r0: snap.focus.row,
            r1: snap.focus.row,
            c0: snap.focus.col,
            c1: snap.focus.col,
          })}
        />
      )}
      {snap.copyFlash && (
        <div
          key={snap.copyFlash.ts}
          className="absolute border-2 border-primary bg-primary/25 [animation:grid-copy-flash_0.5s_ease-out_forwards]"
          style={box(snap.copyFlash.rect)}
        />
      )}
    </div>
  );
}
