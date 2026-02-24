"use client"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/DataTableColumnHeader"
import { ConditionFilter } from "@/components/ui/data-table/DataTableFilter"
import { DataTableRowActions } from "@/components/ui/data-table/DataTableRowActions"
import { Usage, statuses } from "./data"
import { cn } from "@/lib/utils"

const columnHelper = createColumnHelper<Usage>()

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  )

function StabilityIndicator({ value }: { value: number }) {
  let category: "zero" | "bad" | "ok" | "good"
  if (value === 0) {
    category = "zero"
  } else if (value < 9) {
    category = "bad"
  } else if (value >= 9 && value <= 15) {
    category = "ok"
  } else {
    category = "good"
  }

  const getBarClass = (index: number) => {
    if (category === "zero") return "bg-gray-300 dark:bg-gray-700"
    if (category === "good") return "bg-indigo-600 dark:bg-indigo-500"
    if (category === "ok" && index < 2) return "bg-indigo-600 dark:bg-indigo-500"
    if (category === "bad" && index < 1) return "bg-indigo-600 dark:bg-indigo-500"
    return "bg-gray-300 dark:bg-gray-700"
  }

  return (
    <div className="flex items-center gap-1">
      <span className="w-6 text-sm tabular-nums">{value}</span>
      <div className="flex gap-0.5">
        <div className={cn("h-3.5 w-1 rounded-sm", getBarClass(0))} />
        <div className={cn("h-3.5 w-1 rounded-sm", getBarClass(1))} />
        <div className={cn("h-3.5 w-1 rounded-sm", getBarClass(2))} />
      </div>
    </div>
  )
}

const statusBadgeClass: Record<string, string> = {
  live: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  inactive:
    "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  archived:
    "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
}

export const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomeRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={() => table.toggleAllPageRowsSelected()}
        className="translate-y-0.5"
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={() => row.toggleSelected()}
        className="translate-y-0.5"
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      displayName: "Select",
    },
  }),
  columnHelper.accessor("owner", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner" />
    ),
    enableSorting: true,
    enableHiding: false,
    meta: {
      className: "text-left",
      displayName: "Owner",
    },
  }),
  columnHelper.accessor("status", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    enableSorting: true,
    meta: {
      className: "text-left",
      displayName: "Status",
    },
    cell: ({ row }) => {
      const status = statuses.find(
        (item) => item.value === row.getValue("status"),
      )

      if (!status) return null

      return (
        <Badge
          variant="outline"
          className={cn("text-xs capitalize", statusBadgeClass[status.value])}
        >
          {status.label}
        </Badge>
      )
    },
  }),
  columnHelper.accessor("region", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Region" />
    ),
    enableSorting: false,
    meta: {
      className: "text-left",
      displayName: "Region",
    },
    filterFn: "arrIncludesSome",
  }),
  columnHelper.accessor("stability", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stability" />
    ),
    enableSorting: false,
    meta: {
      className: "text-left",
      displayName: "Stability",
    },
    cell: ({ getValue }) => <StabilityIndicator value={getValue()} />,
  }),
  columnHelper.accessor("costs", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Costs" />
    ),
    enableSorting: true,
    meta: {
      className: "text-right",
      displayName: "Costs",
    },
    cell: ({ getValue }) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(getValue())}
      </span>
    ),
    filterFn: (row, columnId, filterValue: ConditionFilter) => {
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
    },
  }),
  columnHelper.accessor("lastEdited", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last edited" />
    ),
    enableSorting: false,
    meta: {
      className: "tabular-nums",
      displayName: "Last edited",
    },
  }),
  columnHelper.display({
    id: "edit",
    header: "Edit",
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: "text-right",
      displayName: "Edit",
    },
    cell: ({ row }) => <DataTableRowActions row={row} />,
  }),
] as ColumnDef<Usage>[]

export { formatCurrency }
