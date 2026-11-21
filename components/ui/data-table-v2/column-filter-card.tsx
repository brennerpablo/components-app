"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

import { applyLabel, BAND_TEXT_BUTTON_CLASS, type FilterColumn, FilterEditor } from "./filter-panel";
import { isFilterActive } from "./model";
import { FrameFooter, FrameHeaderActions } from "./popover-frame";
import type { DataTableV2RowLabel } from "./types";

type ColumnFilterCardProps = {
  column: FilterColumn;
  applied: unknown;
  rowLabel: DataTableV2RowLabel;
  countWith: (value: unknown) => number | null;
  onApply: (value: unknown) => void;
  onShowAll: () => void;
};

export function ColumnFilterCard({ column, applied, rowLabel, countWith, onApply, onShowAll }: ColumnFilterCardProps) {
  const [draft, setDraft] = React.useState<unknown>(applied);
  const active = isFilterActive(column.kind, draft);
  const deferredDraft = React.useDeferredValue(draft);
  const count = React.useMemo(
    () => countWith(isFilterActive(column.kind, deferredDraft) ? deferredDraft : undefined),
    [column.kind, countWith, deferredDraft],
  );
  const apply = () => onApply(active ? draft : undefined);

  return (
    <div className="text-sm">
      <FrameHeaderActions>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className={BAND_TEXT_BUTTON_CLASS}
          disabled={!active && !isFilterActive(column.kind, applied)}
          onClick={() => onApply(undefined)}
        >
          Limpar
        </Button>
      </FrameHeaderActions>

      <div className="p-3">
        <FilterEditor column={column} value={draft} onChange={setDraft} onSubmit={apply} />
      </div>

      <FrameFooter>
        <Button type="button" variant="link" size="sm" className="mr-auto h-auto px-0" onClick={onShowAll}>
          Todos os filtros
        </Button>
        <Button type="button" size="sm" onClick={apply}>
          {applyLabel(count, rowLabel)}
        </Button>
      </FrameFooter>
    </div>
  );
}
