"use client"

import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Row } from "@tanstack/react-table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDataTableLocale } from "./DataTableLocaleContext"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({}: DataTableRowActionsProps<TData>) {
  const locale = useDataTableLocale()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="group aspect-square p-1.5 border border-transparent hover:border-border data-[state=open]:border-border data-[state=open]:bg-muted"
        >
          <MoreHorizontal
            className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground group-data-[state=open]:text-foreground"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuItem>{locale.add}</DropdownMenuItem>
        <DropdownMenuItem>{locale.edit}</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive">{locale.delete}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
