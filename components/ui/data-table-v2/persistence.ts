import type { ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";

import { type FilterKind, isFilterActive } from "./model";
import type { DataTableV2CardView, DataTableV2Density } from "./types";

export type TableView = {
  sorting: SortingState;
  filters: ColumnFiltersState;
  columnOrder: string[];
  visibility: VisibilityState;
  density: DataTableV2Density;
  cardView?: DataTableV2CardView;
  treeLevels?: Record<string, boolean>;
};

export type PersistableColumn = { id: string; sortable: boolean; hideable: boolean; kind: FilterKind | null };

const VERSION = 1;

export function tableViewKey(tableId: string): string {
  return `data-table-v2.${tableId}`;
}

function sortedVisibility(visibility: Record<string, boolean>): Record<string, boolean> {
  return Object.fromEntries(Object.entries(visibility).sort(([a], [b]) => a.localeCompare(b)));
}

export function serializeView(view: TableView): string {
  return JSON.stringify({
    v: VERSION,
    sorting: view.sorting,
    filters: view.filters,
    columnOrder: view.columnOrder,
    visibility: sortedVisibility(view.visibility),
    density: view.density,
    ...(view.cardView ? { cardView: view.cardView } : {}),
    ...(view.treeLevels && Object.keys(view.treeLevels).length > 0
      ? { treeLevels: sortedVisibility(view.treeLevels) }
      : {}),
  });
}

export function sameView(a: TableView, b: TableView): boolean {
  return serializeView(a) === serializeView(b);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toDate(value: unknown): Date | undefined {
  if (typeof value !== "string" && !(value instanceof Date)) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function reviveValue(kind: FilterKind, value: unknown): unknown {
  if (kind === "date" && isRecord(value)) return { from: toDate(value.from), to: toDate(value.to) };
  if (kind === "options" && Array.isArray(value)) return value.filter((v) => typeof v === "string");
  return value;
}

export function parseView(
  raw: string | null,
  columns: readonly PersistableColumn[],
  fallback: Pick<TableView, "density" | "cardView"> = { density: "default" },
  treeLevelIds?: readonly string[],
): TableView | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(parsed) || parsed.v !== VERSION) return null;

  const byId = new Map(columns.map((col) => [col.id, col]));

  const sorting: SortingState = [];
  if (Array.isArray(parsed.sorting)) {
    for (const rule of parsed.sorting) {
      if (!isRecord(rule) || typeof rule.id !== "string") continue;
      if (!byId.get(rule.id)?.sortable || sorting.some((s) => s.id === rule.id)) continue;
      sorting.push({ id: rule.id, desc: rule.desc === true });
    }
  }

  const filters: ColumnFiltersState = [];
  if (Array.isArray(parsed.filters)) {
    for (const filter of parsed.filters) {
      if (!isRecord(filter) || typeof filter.id !== "string") continue;
      const kind = byId.get(filter.id)?.kind;
      if (!kind || filters.some((f) => f.id === filter.id)) continue;
      const value = reviveValue(kind, filter.value);
      if (isFilterActive(kind, value)) filters.push({ id: filter.id, value });
    }
  }

  const columnOrder: string[] = [];
  if (Array.isArray(parsed.columnOrder)) {
    for (const id of parsed.columnOrder) {
      if (typeof id === "string" && byId.has(id) && !columnOrder.includes(id)) columnOrder.push(id);
    }
  }

  const visibility: VisibilityState = {};
  if (isRecord(parsed.visibility)) {
    for (const [id, visible] of Object.entries(parsed.visibility)) {
      if (typeof visible === "boolean" && byId.get(id)?.hideable) visibility[id] = visible;
    }
  }

  const density = parsed.density === "compact" || parsed.density === "default" ? parsed.density : fallback.density;

  const cardView = !fallback.cardView
    ? undefined
    : parsed.cardView === "grid" || parsed.cardView === "list"
      ? parsed.cardView
      : fallback.cardView;

  let treeLevels: Record<string, boolean> | undefined;
  if (treeLevelIds) {
    treeLevels = {};
    if (isRecord(parsed.treeLevels)) {
      for (const [id, visible] of Object.entries(parsed.treeLevels)) {
        if (typeof visible === "boolean" && treeLevelIds.includes(id)) treeLevels[id] = visible;
      }
    }
  }

  return {
    sorting,
    filters,
    columnOrder,
    visibility,
    density,
    ...(cardView ? { cardView } : {}),
    ...(treeLevels ? { treeLevels } : {}),
  };
}
