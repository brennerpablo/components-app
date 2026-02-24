"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { exportTableToCSV } from "@/lib/exportTableToCSV"
import { Download } from "lucide-react"
import { Table } from "@tanstack/react-table"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { DataTableFilter } from "./DataTableFilter"
import { ViewOptions } from "./DataTableViewOptions"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  statuses: { value: string; label: string }[]
  regions: { value: string; label: string }[]
  conditions: { value: string; label: string }[]
  currencyFormatter?: (value: number) => string
}

export function Filterbar<TData>({
  table,
  statuses,
  regions,
  conditions,
  currencyFormatter,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [searchTerm, setSearchTerm] = useState<string>("")

  const debouncedSetFilterValue = useDebouncedCallback((value: string) => {
    table.getColumn("owner")?.setFilterValue(value)
  }, 300)

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    debouncedSetFilterValue(value)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-x-6">
      <div className="flex w-full flex-col gap-2 sm:w-fit sm:flex-row sm:items-center">
        {table.getColumn("status")?.getIsVisible() && (
          <DataTableFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
            type="select"
          />
        )}
        {table.getColumn("region")?.getIsVisible() && (
          <DataTableFilter
            column={table.getColumn("region")}
            title="Region"
            options={regions}
            type="checkbox"
          />
        )}
        {table.getColumn("costs")?.getIsVisible() && (
          <DataTableFilter
            column={table.getColumn("costs")}
            title="Costs"
            type="number"
            options={conditions}
            formatter={
              currencyFormatter
                ? (value) => currencyFormatter(Number(value))
                : undefined
            }
          />
        )}
        {table.getColumn("owner")?.getIsVisible() && (
          <Input
            type="search"
            placeholder="Search by owner..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="h-8 w-full text-xs sm:max-w-[250px]"
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters()
              setSearchTerm("")
            }}
            className="border border-border px-2 font-semibold text-indigo-600 sm:border-none sm:py-1 dark:text-indigo-500"
            size="sm"
          >
            Clear filters
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="hidden gap-x-2 px-2 py-1.5 text-sm sm:text-xs lg:flex"
          size="sm"
          onClick={() => exportTableToCSV(table, "export")}
        >
          <Download className="size-4 shrink-0" aria-hidden="true" />
          Export
        </Button>
        <ViewOptions table={table} />
      </div>
    </div>
  )
}
