"use client"

import { ColumnDef, FilterFn, Row } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./DataTableColumnHeader"
import { ConditionFilter, DateRangeFilter, PercentageRangeFilter } from "./DataTableFilter"
import { ColumnMetadata } from "./types"
import { cn } from "@/lib/utils"

export const percentageRangeFilterFn: FilterFn<unknown> = (
  row: Row<unknown>,
  columnId: string,
  filterValue: PercentageRangeFilter,
) => {
  const value = row.getValue(columnId) as number
  const [min, max] = filterValue
  return value >= min && value <= max
}

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

function parseDateValue(raw: unknown): Date | null {
  if (raw instanceof Date) return raw
  if (typeof raw !== "string") return null
  // DD/MM/YYYY or DD/MM/YYYY HH:mm
  const ddmmyyyy = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})/)
  if (ddmmyyyy) return new Date(+ddmmyyyy[3], +ddmmyyyy[2] - 1, +ddmmyyyy[1])
  const d = new Date(raw)
  return isNaN(d.getTime()) ? null : d
}

export const dateRangeFilterFn: FilterFn<unknown> = (
  row: Row<unknown>,
  columnId: string,
  filterValue: DateRangeFilter,
) => {
  const date = parseDateValue(row.getValue(columnId))
  if (!date) return true
  const { from, to } = filterValue
  if (from && date < from) return false
  if (to) {
    const endOfDay = new Date(to)
    endOfDay.setHours(23, 59, 59, 999)
    if (date > endOfDay) return false
  }
  return true
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
      header: col.header
        ? col.header
        : ({ column }) => (
            <DataTableColumnHeader column={column} title={col.title} subtitle={col.subtitle} description={col.description} />
          ),
      cell: col.cell
        ? col.cell
        : ({ getValue }) => {
            const value = getValue()
            if (col.formatter) return col.formatter(value)
            return String(value ?? "")
          },
    }

    if (col.filters?.number) {
      colDef.filterFn = numberConditionFilterFn as FilterFn<TData>
    } else if (col.filters?.checkbox) {
      colDef.filterFn = "arrIncludesSome"
    } else if (col.filters?.percentage) {
      colDef.filterFn = percentageRangeFilterFn as FilterFn<TData>
    } else if (col.filters?.date) {
      colDef.filterFn = dateRangeFilterFn as FilterFn<TData>
    }

    return colDef
  })
}
