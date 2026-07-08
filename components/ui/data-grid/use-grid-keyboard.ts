"use client";

import type { Virtualizer } from "@tanstack/react-virtual";
import * as React from "react";

import { GUTTER_WIDTH, ROW_HEIGHT } from "./constants";
import type { GridSelectionStore } from "./selection-store";
import type { CellCoord } from "./types";

/**
 * Sheets-style keyboard navigation. Arrows move the active cell, Shift
 * extends the range from the anchor, Ctrl/Cmd jumps to the data edge (the
 * dataset is fully dense, so the edge IS the first/last row/column —
 * matching Excel on a filled sheet). Ctrl/Cmd+C is handled by the caller via
 * `onCopy`.
 */

type KeyboardDeps = {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  store: GridSelectionStore;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  colOffsets: number[];
  rowCount: number;
  colCount: number;
  onCopy: () => void;
};

export function useGridKeyboard({
  scrollRef,
  store,
  virtualizer,
  colOffsets,
  rowCount,
  colCount,
  onCopy,
}: KeyboardDeps) {
  return React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (rowCount === 0 || colCount === 0) return;
      const ctrl = e.metaKey || e.ctrlKey;
      const key = e.key;

      if (ctrl && (key === "c" || key === "C")) {
        e.preventDefault();
        onCopy();
        return;
      }
      if (ctrl && (key === "a" || key === "A")) {
        e.preventDefault();
        store.selectAll();
        return;
      }
      if (key === "Escape") {
        // Precedence: a live selection is cleared first. When we consume the
        // Escape this way, stop it propagating to the window-level listener
        // so the same keypress doesn't also exit fullscreen. With no
        // selection, let it bubble — that listener handles fullscreen exit.
        if (store.getRect()) {
          store.clear();
          e.stopPropagation();
        }
        return;
      }

      const snap = store.getSnapshot();
      const cur: CellCoord = snap.focus ?? { row: 0, col: 0 };
      const el = scrollRef.current;
      const visibleRows = el
        ? Math.max(1, Math.floor(el.clientHeight / ROW_HEIGHT) - 1)
        : 20;

      let next: CellCoord | null = null;
      switch (key) {
        case "ArrowDown":
          next = { row: ctrl ? rowCount - 1 : cur.row + 1, col: cur.col };
          break;
        case "ArrowUp":
          next = { row: ctrl ? 0 : cur.row - 1, col: cur.col };
          break;
        case "ArrowRight":
          next = { row: cur.row, col: ctrl ? colCount - 1 : cur.col + 1 };
          break;
        case "ArrowLeft":
          next = { row: cur.row, col: ctrl ? 0 : cur.col - 1 };
          break;
        case "PageDown":
          next = { row: cur.row + visibleRows, col: cur.col };
          break;
        case "PageUp":
          next = { row: cur.row - visibleRows, col: cur.col };
          break;
        case "Home":
          next = ctrl ? { row: 0, col: 0 } : { row: cur.row, col: 0 };
          break;
        case "End":
          next = ctrl
            ? { row: rowCount - 1, col: colCount - 1 }
            : { row: cur.row, col: colCount - 1 };
          break;
        default:
          return;
      }

      e.preventDefault();
      const clamped: CellCoord = {
        row: Math.max(0, Math.min(next.row, rowCount - 1)),
        col: Math.max(0, Math.min(next.col, colCount - 1)),
      };
      if (e.shiftKey) store.extendTo(clamped);
      else store.setActive(clamped);

      virtualizer.scrollToIndex(clamped.row, { align: "auto" });
      if (el) {
        // Horizontal: keep the cell clear of the sticky gutter on the left
        // and the scrollport edge on the right.
        const left = GUTTER_WIDTH + colOffsets[clamped.col];
        const right = GUTTER_WIDTH + colOffsets[clamped.col + 1];
        if (left - GUTTER_WIDTH < el.scrollLeft) {
          el.scrollLeft = left - GUTTER_WIDTH;
        } else if (right > el.scrollLeft + el.clientWidth) {
          el.scrollLeft = right - el.clientWidth;
        }
      }
    },
    [scrollRef, store, virtualizer, colOffsets, rowCount, colCount, onCopy],
  );
}
