import type * as React from "react";

import type { DataTableV2Column } from "./types";

export type MatrixCellLike = { display: string; sortValue: number | null };

export type MatrixModelLike = {
  rowKeys: string[];
  columnKeys: string[];
  rowLabel: (key: string) => string;
  rowSecondaryLabel?: (key: string) => string;
  rowPrimaryHeader?: string;
  rowSecondaryHeader?: string;
  compareRowKeys?: (a: string, b: string) => number;
  columnLabel: (key: string) => string;
  cell: (rowKey: string, colKey: string) => MatrixCellLike;
};

export type MatrixRow = {
  __key: string;
  __label: string;
  __secondary?: string;
  [colKey: string]: string | number | null | undefined;
};

export type MatrixToTableOptions = {
  rowTitle?: string;
  heatmap?: { baseColor: string; maxAlpha?: number; skip?: (colKey: string) => boolean };
  cellClassName?: (rowKey: string, colKey: string, cell: MatrixCellLike) => string | undefined;
  columnClassName?: (colKey: string) => string | undefined;
  sortable?: boolean | ((colKey: string) => boolean);
  textColumn?: (colKey: string) => boolean;
};

const EMPTY = "—";
const EMPTY_CLASS = "text-muted-foreground/60";

export function matrixToTable(
  model: MatrixModelLike,
  options: MatrixToTableOptions = {},
): { rows: MatrixRow[]; columns: DataTableV2Column<MatrixRow>[] } {
  const rows: MatrixRow[] = model.rowKeys.map((rowKey) => {
    const row: MatrixRow = { __key: rowKey, __label: model.rowLabel(rowKey) };
    if (model.rowSecondaryLabel) row.__secondary = model.rowSecondaryLabel(rowKey);
    for (const colKey of model.columnKeys) {
      const cell = model.cell(rowKey, colKey);
      row[colKey] = options.textColumn?.(colKey) ? cell.display : (cell.sortValue ?? undefined);
    }
    return row;
  });

  const sortable = (colKey: string) =>
    typeof options.sortable === "function" ? options.sortable(colKey) : options.sortable === true;

  const { compareRowKeys } = model;
  const compareKeys = compareRowKeys
    ? (a: MatrixRow, b: MatrixRow) => compareRowKeys(a.__key, b.__key)
    : (a: MatrixRow, b: MatrixRow) => a.__label.localeCompare(b.__label, "pt-BR", { sensitivity: "base" });

  const columns: DataTableV2Column<MatrixRow>[] = [
    {
      columnId: "__label",
      title: model.rowPrimaryHeader ?? options.rowTitle ?? "Linha",
      type: "text",
      sortable: true,
      sortingFn: (a, b) => compareKeys(a.original, b.original),
      hideable: false,
    },
  ];
  if (model.rowSecondaryLabel) {
    columns.push({
      columnId: "__secondary",
      title: model.rowSecondaryHeader ?? "Detalhe",
      type: "text",
      sortable: true,
      filters: { checkbox: true },
      inferOptions: true,
    });
  }
  for (const colKey of model.columnKeys) {
    const text = options.textColumn?.(colKey) ?? false;
    const heat = options.heatmap && !options.heatmap.skip?.(colKey) && !text ? options.heatmap : undefined;
    columns.push({
      columnId: colKey,
      title: model.columnLabel(colKey),
      type: text ? "text" : "number",
      sortable: sortable(colKey),
      columnClassName: options.columnClassName?.(colKey),
      sortUndefined: "last",
      exportValue: (row) => model.cell(row.__key, colKey).display,
      ...(heat ? { heatmap: { baseColor: heat.baseColor, maxAlpha: heat.maxAlpha, scale: "matriz" } } : {}),
      cell: ({ row }): React.ReactNode => {
        const cell = model.cell(row.original.__key, colKey);
        if (!cell.display || cell.display === "-" || cell.display === EMPTY) {
          return <span className={EMPTY_CLASS}>{EMPTY}</span>;
        }
        const className = options.cellClassName?.(row.original.__key, colKey, cell);
        return className ? <span className={className}>{cell.display}</span> : cell.display;
      },
    });
  }
  return { rows, columns };
}
