import type { Column, Row, RowModel, Table } from "@tanstack/react-table";

export const TREE_LEVEL_EXPORT_COLUMN_ID = "__nivel";

export function treeRowsInOrder<TRow extends { subRows: readonly TRow[] }>(rows: readonly TRow[]): TRow[] {
  const out: TRow[] = [];
  const visit = (list: readonly TRow[]) => {
    for (const row of list) {
      out.push(row);
      if (row.subRows.length) visit(row.subRows);
    }
  };
  visit(rows);
  return out;
}

export type ExportViewOptions<TData> = {
  tree: boolean;
  values?: ReadonlyMap<string, (row: TData) => unknown>;
};

export function exportView<TData>(table: Table<TData>, { tree, values }: ExportViewOptions<TData>): Table<TData> {
  const exportValues = values?.size ? values : null;
  if (!tree && !exportValues) return table;
  const filtered = table.getFilteredRowModel();
  const source = tree ? treeRowsInOrder(filtered.rows) : filtered.rows;
  const rows = source.map((row) =>
    Object.assign(Object.create(row) as Row<TData>, {
      getValue: (columnId: string) => {
        if (tree && columnId === TREE_LEVEL_EXPORT_COLUMN_ID) return row.depth + 1;
        const exportValue = exportValues?.get(columnId);
        return exportValue ? exportValue(row.original) : row.getValue(columnId);
      },
    }),
  );
  const model: RowModel<TData> = { ...filtered, rows, flatRows: rows };
  const levelColumn = {
    id: TREE_LEVEL_EXPORT_COLUMN_ID,
    accessorFn: (_row: TData) => undefined,
    getIsVisible: () => true,
    columnDef: { meta: { displayName: "Nível" } },
  } as unknown as Column<TData, unknown>;
  return Object.assign(Object.create(table) as Table<TData>, {
    getFilteredRowModel: () => model,
    ...(tree ? { getAllLeafColumns: () => [levelColumn, ...table.getAllLeafColumns()] } : {}),
  });
}
