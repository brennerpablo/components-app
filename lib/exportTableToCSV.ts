import Papa from "papaparse"
import { Table } from "@tanstack/react-table"

export function exportTableToCSV<TData>(
  table: Table<TData>,
  filename: string = "export",
): void {
  const exportableColumns = table
    .getAllLeafColumns()
    .filter((col) => col.getIsVisible() && col.accessorFn !== undefined)

  const rows = table.getFilteredRowModel().rows.map((row) => {
    const obj: Record<string, unknown> = {}
    exportableColumns.forEach((col) => {
      const header = col.columnDef.meta?.displayName ?? col.id
      obj[header] = row.getValue(col.id)
    })
    return obj
  })

  const csv = Papa.unparse(rows)
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
