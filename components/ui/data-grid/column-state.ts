import { MAX_COL_WIDTH, MIN_COL_WIDTH } from "./constants";
import type { GridColumn, GridColumnState } from "./types";

/** The layout every grid starts from: base order, nothing hidden, no overrides. */
export function defaultColumnState<TData>(
  columns: GridColumn<TData>[],
): GridColumnState {
  return { order: columns.map((c) => c.id), hidden: [], widths: {}, frozen: 0 };
}

/**
 * How many columns may be frozen: every VISIBLE unpinned column but one.
 * Freezing the last scrollable column away would leave a sheet that cannot be
 * scrolled horizontally at all, with no control left to undo it.
 */
function maxFrozen<TData>(
  columns: GridColumn<TData>[],
  order: string[],
  hidden: string[],
): number {
  const byId = new Map(columns.map((c) => [c.id, c]));
  const hiddenSet = new Set(hidden);
  let visible = 0;
  for (const id of order) {
    const col = byId.get(id);
    if (!col || hiddenSet.has(id) || col.pinned === "right") continue;
    visible++;
  }
  return Math.max(0, visible - 1);
}

/**
 * Normalize a (possibly stale) column state against the current base columns
 * — saved views may reference columns that were renamed/removed, or miss
 * columns added since. Unknown ids are dropped, missing ids appended in base
 * order, widths clamped, and at least one column is kept visible.
 */
export function sanitizeColumnState<TData>(
  state: GridColumnState,
  columns: GridColumn<TData>[],
): GridColumnState {
  const known = new Set(columns.map((c) => c.id));
  const order = state.order.filter((id, i) => known.has(id) && state.order.indexOf(id) === i);
  for (const col of columns) {
    if (!order.includes(col.id)) order.push(col.id);
  }
  let hidden = state.hidden.filter((id) => known.has(id));
  if (hidden.length >= order.length) hidden = [];
  const widths: Record<string, number> = {};
  for (const [id, w] of Object.entries(state.widths)) {
    if (known.has(id) && Number.isFinite(w)) {
      widths[id] = Math.max(MIN_COL_WIDTH, Math.min(MAX_COL_WIDTH, w));
    }
  }
  const frozen = Math.max(
    0,
    Math.min(
      Math.trunc(state.frozen ?? 0) || 0,
      maxFrozen(columns, order, hidden),
    ),
  );
  return { order, hidden, widths, frozen };
}
