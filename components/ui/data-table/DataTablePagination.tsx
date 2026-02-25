import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react"
import { Table } from "@tanstack/react-table"
import { useDataTableLocale } from "./DataTableLocaleContext"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSize: number
}

export function DataTablePagination<TData>({
  table,
  pageSize,
}: DataTablePaginationProps<TData>) {
  const locale = useDataTableLocale()
  const paginationButtons = [
    {
      Icon: ChevronsLeft,
      onClick: () => table.setPageIndex(0),
      disabled: !table.getCanPreviousPage(),
      srText: locale.firstPage,
      mobileView: "hidden sm:block",
    },
    {
      Icon: ChevronLeft,
      onClick: () => table.previousPage(),
      disabled: !table.getCanPreviousPage(),
      srText: locale.previousPage,
      mobileView: "",
    },
    {
      Icon: ChevronRight,
      onClick: () => table.nextPage(),
      disabled: !table.getCanNextPage(),
      srText: locale.nextPage,
      mobileView: "",
    },
    {
      Icon: ChevronsRight,
      onClick: () => table.setPageIndex(table.getPageCount() - 1),
      disabled: !table.getCanNextPage(),
      srText: locale.lastPage,
      mobileView: "hidden sm:block",
    },
  ]

  const totalRows = table.getFilteredRowModel().rows.length
  const currentPage = table.getState().pagination.pageIndex
  const firstRowIndex = currentPage * pageSize + 1
  const lastRowIndex = Math.min(totalRows, firstRowIndex + pageSize - 1)

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm tabular-nums text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of {totalRows}{" "}
        {locale.rowsSelected}
      </div>
      <div className="flex items-center gap-x-6 lg:gap-x-8">
        <p className="hidden text-sm tabular-nums text-muted-foreground sm:block">
          {locale.showing}{" "}
          <span className="font-medium text-foreground">
            {firstRowIndex}-{lastRowIndex}
          </span>{" "}
          {locale.of}{" "}
          <span className="font-medium text-foreground">{totalRows}</span>
        </p>
        <div className="flex items-center gap-x-1.5">
          {paginationButtons.map((button, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon-sm"
              className={cn(button.mobileView)}
              aria-label={button.srText}
              onClick={() => {
                button.onClick()
                table.resetRowSelection()
              }}
              disabled={button.disabled}
            >
              <button.Icon className="size-4 shrink-0" aria-hidden="true" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
