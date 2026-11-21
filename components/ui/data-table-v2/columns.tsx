"use client";

import {
  type CellContext,
  type ColumnDef,
  createColumnHelper,
  type FilterFn,
  type HeaderContext,
  type Row,
  type VisibilityState,
} from "@tanstack/react-table";
import Link from "next/link";
import type { ReactNode } from "react";

import type { OptionItem } from "@/components/ui/data-table/types";
import { foldText } from "@/lib/fold-text";
import { cn } from "@/lib/utils";

import { TableCheckbox } from "./checkbox";
import {
  buildRowIndex,
  type DateFilterValue,
  dateMatches,
  filterKindOf,
  formatNumberBr,
  type NumberFilterValue,
  numberMatches,
  type RowIndex,
} from "./model";
import { RowActions } from "./row-actions";
import { codigoDoAtivo, textoPadraoDaCelula } from "./texto-padrao-da-celula";
import type { DataTableV2Column, DataTableV2LinkVariant } from "./types";

export const SELECT_COLUMN_ID = "__selecionar";
export const ACTIONS_COLUMN_ID = "__acoes";

export const ACTIONS_CELL_CLASS = "pl-1";

export function buildDefaultColumnVisibility<TData>(metadata: readonly DataTableV2Column<TData>[]): VisibilityState {
  const visibility: VisibilityState = {};
  for (const col of metadata) {
    if (col.defaultVisible === false && !col.filterOnly) visibility[col.columnId] = false;
  }
  return visibility;
}

export function buildOptionLabelLookup(col: { options?: OptionItem[] }): (value: string) => string {
  if (!col.options?.length) return (value) => value;
  const labels = new Map(col.options.map((o) => [o.value, o.label]));
  return (value) => labels.get(value) ?? value;
}

const checkboxIncludesSomeFilterFn: FilterFn<unknown> = (row, columnId, filterValue) => {
  if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
  const raw = row.getValue(columnId);
  const val = raw == null ? "" : String(raw);
  return (filterValue as string[]).some((item) => item === val);
};

const checkboxArrayIncludesSomeFilterFn: FilterFn<unknown> = (row, columnId, filterValue) => {
  if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
  const raw = row.getValue(columnId);
  const cellValues = Array.isArray(raw)
    ? (raw as unknown[]).map((item) => String(item))
    : raw == null || raw === ""
      ? []
      : [String(raw)];
  return (filterValue as string[]).some((item) => cellValues.includes(item));
};

const LINK_BASE_CLASS = "text-xs font-medium text-primary hover:underline";

const LINK_VARIANT_CLASS: Record<DataTableV2LinkVariant, string> = {
  primary: "",
  default: "",
  mono: "font-mono",
  asset: "font-mono",
  muted: "",
};

function renderLinkedCell<TData>(col: DataTableV2Column<TData>, row: Row<TData>, value: unknown): ReactNode {
  const link = col.link;
  if (!link) return col.formatter ? col.formatter(value) : textoPadraoDaCelula(col.type, value);
  const rowData = row.original;
  const href = link.href(rowData);
  const rotulo = link.label
    ? link.label(rowData)
    : col.formatter
      ? col.formatter(value)
      : textoPadraoDaCelula(col.type, value);
  const label = link.variant === "asset" && typeof rotulo === "string" ? codigoDoAtivo(rotulo) : rotulo;
  const subtitle = link.subtitle?.(rowData);
  const className = cn(link.className, LINK_VARIANT_CLASS[link.variant ?? "primary"], LINK_BASE_CLASS);
  const primary = href ? (
    <Link
      href={href}
      className={className}
      title={link.title?.(rowData)}
      onClick={(event) => link.onClick?.(rowData, event)}
    >
      {label}
    </Link>
  ) : (
    <span>{label}</span>
  );
  if (subtitle == null || subtitle === false) return primary;
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      {primary}
      <div className={cn("text-xs text-muted-foreground", link.subtitleClassName)}>{subtitle}</div>
    </div>
  );
}

function MetadataCell<TData>(props: CellContext<TData, unknown>): ReactNode {
  return props.column.columnDef.meta?.renderCell?.(props) ?? null;
}

function MetadataHeader<TData>(props: HeaderContext<TData, unknown>): ReactNode {
  return props.column.columnDef.meta?.renderHeader?.(props) ?? null;
}

function buildBaseColumns<TData>(metadata: readonly DataTableV2Column<TData>[]): ColumnDef<TData>[] {
  return metadata.map((col) => ({
    id: col.columnId,
    accessorKey: col.columnId,
    enableSorting: col.sortable ?? false,
    ...(col.sortingFn ? { sortingFn: col.sortingFn } : {}),
    enableHiding: col.filterOnly ? false : (col.hideable ?? true),
    meta: {
      displayName: col.title,
      filterOnly: col.filterOnly,
      className: cn(
        col.aligned === "right" && "text-right",
        col.aligned === "center" && "text-center",
        col.aligned === "left" && "text-left",
        col.columnClassName,
      ),
      renderHeader: col.header,
      renderCell: col.cell ?? (({ getValue, row }) => renderLinkedCell(col, row, getValue())),
    },
    header: MetadataHeader,
    cell: MetadataCell,
  }));
}

export function enrichMetadata<TData>(
  metadata: readonly DataTableV2Column<TData>[],
  data: readonly TData[],
): DataTableV2Column<TData>[] {
  return metadata.map((col) => {
    if (filterKindOf(col) !== "options") return col;
    if (!col.inferOptions && col.options?.length) return col;
    const labelFor = buildOptionLabelLookup(col);
    const seen = new Set<string>();
    const options: OptionItem[] = [];
    for (const row of data) {
      const raw = (row as Record<string, unknown>)[col.columnId];
      const values = Array.isArray(raw) ? raw.map(String) : [raw == null ? "" : String(raw)];
      for (const value of values) {
        if (value === "" || seen.has(value)) continue;
        seen.add(value);
        options.push({ value, label: labelFor(value) });
      }
    }
    options.sort((a, b) => a.label.localeCompare(b.label, "pt-BR", { numeric: true }));
    return { ...col, options };
  });
}

const NUMERO_COM_PONTUACAO = /^[\d.\-/\s]+$/;

function foldedTextFilterFn<TData>(extraColumnIds: readonly string[]): FilterFn<TData> {
  const fn: FilterFn<TData> = (row, columnId, filterValue) => {
    const raw = String(filterValue ?? "").trim();
    const needle = foldText(raw);
    if (!needle) return true;
    const digits = NUMERO_COM_PONTUACAO.test(raw) ? raw.replace(/\D/g, "") : "";
    const data = row.original as Record<string, unknown>;
    return [columnId, ...extraColumnIds].some((id) => {
      const value = String(data[id] ?? "");
      return foldText(value).includes(needle) || (digits !== "" && value.replace(/\D/g, "").includes(digits));
    });
  };
  fn.autoRemove = (value) => !String(value ?? "").trim();
  return fn;
}

function numberFilterFn<TData>(scale: number): FilterFn<TData> {
  return (row, columnId, filterValue) => {
    const raw = row.getValue(columnId);
    if (raw == null || raw === "") return false;
    return numberMatches(Number(raw) * scale, filterValue as NumberFilterValue);
  };
}

function dateFilterFn<TData>(): FilterFn<TData> {
  return (row, columnId, filterValue) => dateMatches(row.getValue(columnId), filterValue as DateFilterValue);
}

export function buildV2Columns<TData>(metadata: readonly DataTableV2Column<TData>[]): ColumnDef<TData>[] {
  const built = buildBaseColumns(metadata);
  return built.map((builtDef, i) => {
    const col = metadata[i];
    const colDef: ColumnDef<TData> = col.sortUndefined ? { ...builtDef, sortUndefined: col.sortUndefined } : builtDef;
    const kind = filterKindOf(col);
    if (!kind) return { ...colDef, enableColumnFilter: false };
    const filterFn: FilterFn<TData> =
      kind === "options"
        ? ((col.filters?.checkboxArray
            ? checkboxArrayIncludesSomeFilterFn
            : checkboxIncludesSomeFilterFn) as FilterFn<TData>)
        : kind === "number"
          ? numberFilterFn<TData>(col.filterScale ?? 1)
          : kind === "date"
            ? dateFilterFn<TData>()
            : foldedTextFilterFn<TData>(col.filters?.textColumns ?? []);
    return { ...colDef, filterFn };
  });
}

function UtilityCell<TData>(props: CellContext<TData, unknown>): ReactNode {
  return props.column.columnDef.meta?.renderCell?.(props) ?? null;
}

function UtilityHeader<TData>(props: HeaderContext<TData, unknown>): ReactNode {
  return props.column.columnDef.meta?.renderHeader?.(props) ?? null;
}

export function createSelectColumn<TData>(): ColumnDef<TData> {
  return createColumnHelper<TData>().display({
    id: SELECT_COLUMN_ID,
    header: UtilityHeader,
    cell: UtilityCell,
    enableSorting: false,
    enableHiding: false,
    meta: {
      displayName: "Selecionar",
      renderHeader: ({ table }) => (
        <TableCheckbox
          checked={
            table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false
          }
          onCheckedChange={() => table.toggleAllPageRowsSelected()}
          aria-label="Selecionar todas as linhas da página"
        />
      ),
      renderCell: ({ row }) =>
        row.getCanSelect() ? (
          <div onClick={(e) => e.stopPropagation()} className="flex w-fit">
            <TableCheckbox
              checked={row.getIsSelected()}
              onCheckedChange={() => row.toggleSelected()}
              aria-label="Selecionar linha"
            />
          </div>
        ) : null,
    },
  });
}

export type RowActionCallbacks<TData> = {
  onAdd?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
};

export function createActionsColumn<TData>(
  callbacks: RowActionCallbacks<TData>,
  render?: (row: TData) => ReactNode,
): ColumnDef<TData> {
  return createColumnHelper<TData>().display({
    id: ACTIONS_COLUMN_ID,
    header: UtilityHeader,
    cell: UtilityCell,
    enableSorting: false,
    enableHiding: false,
    meta: {
      displayName: "Ações",
      renderHeader: () => <span className="sr-only">Ações</span>,
      renderCell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()} className="flex w-fit">
          {render ? (
            render(row.original)
          ) : (
            <RowActions
              row={row}
              onAdd={callbacks.onAdd}
              onEdit={callbacks.onEdit}
              onDelete={callbacks.onDelete}
            />
          )}
        </div>
      ),
    },
  });
}

function dataBr(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function createRowIndexer<TData>(metadata: readonly DataTableV2Column<TData>[]): (row: TData) => RowIndex {
  const lookups = metadata.map((col) => (col.options?.length ? buildOptionLabelLookup(col) : null));
  const cache = new WeakMap<object, RowIndex>();

  const build = (row: TData): RowIndex => {
    const parts: string[] = [];
    metadata.forEach((col, i) => {
      const raw = (row as Record<string, unknown>)[col.columnId];
      if (raw == null || raw === "") return;
      if (raw instanceof Date) {
        parts.push(dataBr(raw));
        return;
      }
      if (Array.isArray(raw)) {
        const values = raw.map(String);
        parts.push(values.join(" "));
        const lookup = lookups[i];
        if (lookup) {
          const labels = values.map(lookup).filter((label, j) => label !== values[j]);
          if (labels.length) parts.push(labels.join(" "));
        }
        return;
      }
      if (typeof raw === "number") parts.push(String(raw), formatNumberBr(raw));
      else if (typeof raw !== "object") parts.push(String(raw));
      if (col.link?.variant === "asset") parts.push(codigoDoAtivo(raw));
      const label = lookups[i]?.(String(raw));
      if (label && label !== String(raw)) parts.push(label);
      if (col.formatter) {
        try {
          const shown = col.formatter(raw);
          if (typeof shown === "string" || typeof shown === "number") parts.push(String(shown));
        } catch {}
      }
    });
    return buildRowIndex(parts);
  };

  return (row) => {
    if (typeof row !== "object" || row === null) return build(row);
    const hit = cache.get(row);
    if (hit) return hit;
    const index = build(row);
    cache.set(row, index);
    return index;
  };
}
