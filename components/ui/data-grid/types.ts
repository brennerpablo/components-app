/**
 * Read-only spreadsheet grid (`<DataGrid>`): virtualized rows over a sparse
 * server-backed window, Sheets-style cell/row/column selection, keyboard
 * navigation, clipboard copy and Excel-style per-column filters. Sorting and
 * filtering always run on the server — the grid only renders what the
 * caller's `getRow` accessor can resolve.
 */

import type * as React from "react";

export type GridColumnType = "text" | "number" | "date";

/**
 * Renders an icon link/button instead of text (the "external link" / "open
 * detail" cells the DataTable had). The cell is still a real grid cell —
 * selectable, and copy/export use the column's raw value (or `copyValue`) — but
 * the icon itself owns its click (a `data-grid-cell-action` marker keeps the
 * grid's selection from swallowing it).
 */
export type GridCellAction<TData> = {
  /** Icon component; lucide-react icons match this signature. */
  icon: React.ComponentType<{ className?: string }>;
  /** Tooltip + aria-label (static, or derived from the row). */
  label: string | ((row: TData) => string);
  /** Renders an `<a target="_blank">`. Return null/empty to render nothing. */
  href?: (row: TData) => string | null | undefined;
  /** Renders a `<button>` firing this (used when there's no `href`). */
  onClick?: (row: TData) => void;
};

/**
 * How a column's filter popover state maps onto the API's query params.
 * Only the shapes the server can serve from an index are expressible.
 */
export type GridFilterParamMap = {
  /** Checkbox multi-select values → CSV query param. */
  csv?: string;
  /** Text `contains` condition → query param (server requires ≥3 chars). */
  contains?: string;
  /** Exact-equality condition → query param. */
  equals?: string;
  /** Range condition → min/max query params (numbers or ISO dates). */
  range?: { min?: string; max?: string };
};

export type GridColumnFilterConfig = {
  /** Key into the grid's `filterOptions` prop for the checkbox value list. */
  optionsKey?: string;
  /** Enables the condition section of the popover, typed like the column. */
  conditions?: GridColumnType;
  paramMap: GridFilterParamMap;
};

export type GridColumn<TData> = {
  /** Row-object key; also the sort id sent to the server. */
  id: string;
  title: string;
  type: GridColumnType;
  /** Fixed width in px (v1 has no resize). */
  width: number;
  align?: "left" | "right";
  /** Must be whitelisted in the API route's SORT_FIELDS. */
  sortable?: boolean;
  filter?: GridColumnFilterConfig;
  /** Freeze this column to the right edge (mirror of the left row-number
   * gutter). Pinned columns render in a sticky lane and are display-only —
   * outside cell selection, keyboard nav, sort and reorder. Meant for
   * action/link icon columns. */
  pinned?: "right";
  /** Renders an interactive icon (link/action) instead of text. Takes
   * precedence over `format`; copy/export still use the raw value. */
  action?: GridCellAction<TData>;
  /** Display string (cells render plain text — keep it cheap). */
  format?: (value: unknown, row: TData) => string;
  /** Raw value for clipboard TSV (default `String(value)`). */
  copyValue?: (value: unknown, row: TData) => string;
};

export type CellCoord = { row: number; col: number };

/** Inclusive, normalized selection rectangle. */
export type GridRect = { r0: number; r1: number; c0: number; c1: number };

export type GridConditionOp = "contains" | "eq" | "gte" | "lte" | "between";

export type GridColumnFilter = {
  /** Checked values of the checkbox section; absent = all values. */
  values?: string[];
  condition?: { op: GridConditionOp; value: string; value2?: string };
};

/** Active filters by column id. */
export type GridFilterState = Record<string, GridColumnFilter>;

export type GridSortState = { id: string; desc: boolean } | null;

export type GridFilterOption = { value: string; label: string };

/**
 * User-adjustable column layout, controlled by the caller like
 * filters/sorting. `order` always contains ALL column ids (hidden included);
 * the grid derives its visible columns from it — internal index math only
 * ever sees contiguous visible indices.
 */
export type GridColumnState = {
  /** All column ids in display order (hidden ones included). */
  order: string[];
  /** Hidden column ids. */
  hidden: string[];
  /** Width overrides by id; falls back to GridColumn.width. */
  widths: Record<string, number>;
};

/** A named snapshot of the grid's filter + sort state (see views-storage). */
export type SavedView = {
  name: string;
  filters: GridFilterState;
  sorting: GridSortState;
  /** Column layout at save time; absent on views saved before v3. */
  columns?: GridColumnState;
  /** ISO timestamp of the last save. */
  savedAt: string;
};
