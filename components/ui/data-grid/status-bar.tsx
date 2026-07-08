"use client";

import { Loader2 } from "lucide-react";
import * as React from "react";

import { useGridContext } from "./grid-context";
import { localeFor } from "./i18n";
import { useGridSelection } from "./selection-store";

/**
 * Excel-style status bar: filtered total on the left, selection stats on the
 * right (count always; sum/avg/min/max when the selection covers numeric
 * columns). Aggregates iterate loaded rows only — when the selection spans
 * unloaded blocks the stats are explicitly labeled "partial" — and are skipped
 * mid-drag (the bar shows "…" until the mouse releases).
 */

export type GridStatusSummary = {
  count: number;
  /** Aggregate total for the summary column, or null. */
  total: number | null;
  /** Aggregate mean for the summary column, or null. */
  mean: number | null;
};

type Stats = {
  sum: number;
  min: number;
  max: number;
  n: number;
  /** True when part of the selection wasn't loaded (stats are partial). */
  partial: boolean;
} | null;

export function GridStatusBar({
  totalCount,
  rowCount,
  getRow,
  summary,
  isFetching,
}: {
  totalCount: number;
  rowCount: number;
  getRow: (index: number) => unknown;
  summary?: GridStatusSummary | null;
  isFetching?: boolean;
}) {
  const { store, columns, strings, language } = useGridContext();
  const intFmt = React.useMemo(
    () => new Intl.NumberFormat(localeFor(language)),
    [language],
  );
  // Selections can mix currency and area columns — plain numbers are the only
  // universally correct format for the aggregates (like Excel's status bar).
  const numFmt = React.useMemo(
    () =>
      new Intl.NumberFormat(localeFor(language), { maximumFractionDigits: 2 }),
    [language],
  );
  // Narrow subscription: primitive rect bounds + drag flag, so an emit that
  // doesn't move the selection doesn't re-render the bar.
  const sel = useGridSelection(
    store,
    () => {
      const rect = store.getRect();
      const dragging = store.getSnapshot().dragging;
      return rect
        ? ([rect.r0, rect.r1, rect.c0, rect.c1, dragging] as const)
        : null;
    },
    (a, b) =>
      a === b ||
      (!!a && !!b && a.every((v, i) => v === b[i])),
  );
  const [r0, r1, c0, c1, dragging] = sel ?? [0, -1, 0, -1, false];

  const stats = React.useMemo<Stats>(() => {
    if (r1 < r0 || dragging) return null;
    const numericCols: string[] = [];
    for (let c = c0; c <= c1; c++) {
      if (columns[c].type === "number") numericCols.push(columns[c].id);
    }
    if (!numericCols.length) return null;
    let sum = 0;
    let min = Infinity;
    let max = -Infinity;
    let n = 0;
    let loadedRows = 0;
    for (let r = r0; r <= r1; r++) {
      const row = getRow(r) as Record<string, unknown> | undefined;
      if (!row) continue;
      loadedRows++;
      for (const id of numericCols) {
        const v = row[id];
        if (typeof v !== "number" || !Number.isFinite(v)) continue;
        sum += v;
        if (v < min) min = v;
        if (v > max) max = v;
        n++;
      }
    }
    return n
      ? { sum, min, max, n, partial: loadedRows < r1 - r0 + 1 }
      : null;
  }, [r0, r1, c0, c1, dragging, columns, getRow]);

  const cellCount = r1 >= r0 ? (r1 - r0 + 1) * (c1 - c0 + 1) : 0;

  return (
    <div className="flex h-8 shrink-0 items-center gap-3 border-t bg-muted/50 px-3 text-xs text-muted-foreground">
      <span>
        {strings.rows(intFmt.format(totalCount))}
        {rowCount > 0 && rowCount < totalCount &&
          strings.showingFirst(intFmt.format(rowCount))}
      </span>
      {summary?.total != null && (
        <span className="hidden md:inline">
          {strings.total} {numFmt.format(summary.total)}
          {summary.mean != null && (
            <>
              {" "}
              · {strings.avg} {numFmt.format(summary.mean)}
            </>
          )}
        </span>
      )}
      {isFetching && <Loader2 className="size-3.5 animate-spin" />}
      <span className="ml-auto tabular-nums">
        {cellCount > 0 && (
          <>
            {strings.cells(intFmt.format(cellCount))}
            {dragging && " · …"}
            {stats && (
              <>
                {" "}
                ·{stats.partial && ` ${strings.partial}`} {strings.sum}{" "}
                {numFmt.format(stats.sum)} · {strings.mean}{" "}
                {numFmt.format(stats.sum / stats.n)} · {strings.min}{" "}
                {numFmt.format(stats.min)} · {strings.max}{" "}
                {numFmt.format(stats.max)}
              </>
            )}
          </>
        )}
      </span>
    </div>
  );
}
