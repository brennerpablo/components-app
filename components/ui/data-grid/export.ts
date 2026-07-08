import Papa from "papaparse";
import * as XLSX from "xlsx";

import type { GridColumn } from "./types";

/**
 * Export a materialized row set (fetched by the caller — the grid only holds
 * ~viewport blocks) to CSV or XLSX. Values are RAW, not `format`-ed: numbers
 * stay numeric and dates stay ISO so a spreadsheet can sum/sort them. Headers
 * are the column titles.
 */

const stamp = () => new Date().toISOString().slice(0, 10);

function rawValue<TData>(col: GridColumn<TData>, row: TData): unknown {
  const v = (row as Record<string, unknown>)[col.id];
  // copyValue exists to shape the clipboard/export value (e.g. drop a display
  // label); when present it wins, otherwise the raw cell value is used.
  return col.copyValue ? col.copyValue(v, row) : (v ?? "");
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportRowsToCSV<TData>(
  rows: TData[],
  columns: GridColumn<TData>[],
  filename: string,
): void {
  const data = rows.map((row) => {
    const obj: Record<string, unknown> = {};
    for (const col of columns) obj[col.title] = rawValue(col, row);
    return obj;
  });
  const csv = Papa.unparse(data);
  // Leading BOM (U+FEFF): without it, pt-BR Excel decodes the file as
  // Windows-1252 and mangles every accented character.
  const blob = new Blob(["﻿" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  triggerDownload(blob, `${filename}-${stamp()}.csv`);
}

export function exportRowsToXLSX<TData>(
  rows: TData[],
  columns: GridColumn<TData>[],
  filename: string,
): void {
  const header = columns.map((col) => col.title);
  const body = rows.map((row) => columns.map((col) => rawValue(col, row)));
  const ws = XLSX.utils.aoa_to_sheet([header, ...body]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Dados");
  XLSX.writeFile(wb, `${filename}-${stamp()}.xlsx`);
}
