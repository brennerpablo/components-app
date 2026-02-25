import { ChevronDown, ChevronUp } from "lucide-react"
import { Column } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import React from "react"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  subtitle?: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  subtitle,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn(className)}>
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-medium leading-none">{title}</span>
          {subtitle && (
            <span className="text-[11px] font-normal text-muted-foreground leading-none">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={column.getToggleSortingHandler()}
      className={cn(
        column.columnDef.enableSorting === true
          ? "-mx-2 inline-flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1 hover:bg-muted"
          : "",
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] font-medium leading-none">{title}</span>
        {subtitle && (
          <span className="text-[11px] font-normal text-muted-foreground leading-none">
            {subtitle}
          </span>
        )}
      </div>
      {column.getCanSort() ? (
        <div className="-space-y-2">
          <ChevronUp
            className={cn(
              "size-3.5 text-foreground",
              column.getIsSorted() === "desc" ? "opacity-30" : "",
            )}
            aria-hidden="true"
          />
          <ChevronDown
            className={cn(
              "size-3.5 text-foreground",
              column.getIsSorted() === "asc" ? "opacity-30" : "",
            )}
            aria-hidden="true"
          />
        </div>
      ) : null}
    </div>
  )
}
