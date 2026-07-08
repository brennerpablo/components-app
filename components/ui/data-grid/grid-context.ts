"use client";

import * as React from "react";

import type { GridLanguage, GridStrings } from "./i18n";
import type { GridSelectionStore } from "./selection-store";
import type {
  GridColumn,
  GridFilterOption,
  GridFilterState,
  GridSortState,
} from "./types";

// NOTE: `getRow` is deliberately absent — its identity changes on every
// block load and would re-render every context consumer; the body and the
// status bar receive it as a direct prop instead.
export type GridContextValue = {
  store: GridSelectionStore;
  // Children read columns untyped — cell text is produced by the shell.
  // Only the SCROLLABLE (unpinned) data columns; the selection/mouse/keyboard
  // grid is defined entirely over these.
  columns: GridColumn<never>[];
  /** Prefix sums of column widths, length `columns.length + 1`, gutter excluded. */
  colOffsets: number[];
  /** Columns frozen to the right edge — display-only, outside the selection grid. */
  pinnedColumns: GridColumn<never>[];
  /** Total width of the pinned-right lane (0 when none). */
  pinnedWidth: number;
  rowCount: number;
  sorting: GridSortState;
  onSortingChange: (s: GridSortState) => void;
  filters: GridFilterState;
  onFiltersChange: (f: GridFilterState) => void;
  filterOptions: Record<string, GridFilterOption[]>;
  /** Begin a column-width drag from a header resize handle. */
  startResize: (colId: string, clientX: number, startWidth: number) => void;
  /** Resolved UI strings for the active language. */
  strings: GridStrings;
  /** Active language (drives number/date locale formatting). */
  language: GridLanguage;
};

export const GridContext = React.createContext<GridContextValue | null>(null);

export function useGridContext(): GridContextValue {
  const ctx = React.useContext(GridContext);
  if (!ctx) throw new Error("useGridContext must be used inside <DataGrid>");
  return ctx;
}
