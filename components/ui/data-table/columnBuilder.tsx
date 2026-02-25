"use client"

import { ColumnDef, FilterFn, Row } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./DataTableColumnHeader"
import { ConditionFilter } from "./DataTableFilter"
import { ColumnMetadata } from "./types"
import { cn } from "@/lib/utils"

export const numberConditionFilterFn: FilterFn<unknown> = (
  row: Row<unknown>,
  columnId: string,
  filterValue: ConditionFilter,
) => {
  const value = row.getValue(columnId) as number
  const [min, max] = filterValue.value as [number, number]

  switch (filterValue.condition) {
    case "is-equal-to":
      return value == min
    case "is-between":
      return value >= min && value <= max
    case "is-greater-than":
      return value > min
    case "is-less-than":
      return value < min
    default:
      return true
  }
}

export function buildColumnsFromMetadata<TData>(
  metadata: readonly ColumnMetadata<TData>[],
): ColumnDef<TData>[] {
  return metadata.map((col) => {
    const colDef: ColumnDef<TData> = {
      id: col.columnId,
      accessorKey: col.columnId,
      enableSorting: col.sortable ?? false,
      enableHiding: col.hideable ?? true,
      meta: {
        displayName: col.title,
        className: cn(
          col.aligned === "right" && "text-right",
          col.aligned === "center" && "text-center",
          col.aligned === "left" && "text-left",
        ),
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={col.title} subtitle={col.subtitle} />
      ),
      cell: ({ getValue }) => {
        const value = getValue()
        if (col.formatter) {
          return col.formatter(value)
        }
        return String(value ?? "")
      },
    }

    if (col.filters?.number) {
      colDef.filterFn = numberConditionFilterFn as FilterFn<TData>
    } else if (col.filters?.checkbox) {
      colDef.filterFn = "arrIncludesSome"
    }

    return colDef
  })
}
