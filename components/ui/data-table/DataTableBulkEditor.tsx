"use client"

import { Popover } from "radix-ui"
import React from "react"
import { RowSelectionState, Table } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { useDataTableLocale } from "./DataTableLocaleContext"

interface CommandBarProps extends React.PropsWithChildren {
  open?: boolean
  disableAutoFocus?: boolean
}

const CommandBar = ({
  open = false,
  disableAutoFocus = true,
  children,
}: CommandBarProps) => {
  return (
    <Popover.Root open={open}>
      <Popover.Anchor
        className={cn(
          "fixed inset-x-0 bottom-8 mx-auto flex w-fit items-center",
        )}
      />
      <Popover.Portal>
        <Popover.Content
          side="top"
          sideOffset={0}
          onOpenAutoFocus={(e) => {
            if (disableAutoFocus) {
              e.preventDefault()
            }
          }}
          className={cn(
            "z-50",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-2",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-2",
          )}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

const CommandBarValue = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "px-3 py-2.5 text-sm tabular-nums text-gray-300",
        className,
      )}
      {...props}
    />
  )
})
CommandBarValue.displayName = "CommandBarValue"

const CommandBarBar = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex items-center rounded-lg bg-gray-900 px-1 shadow-lg shadow-black/30 dark:ring-1 dark:ring-white/10",
        className,
      )}
      {...props}
    />
  )
})
CommandBarBar.displayName = "CommandBarBar"

const CommandBarSeparator = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<"div">, "children">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("h-4 w-px bg-gray-700", className)}
      {...props}
    />
  )
})
CommandBarSeparator.displayName = "CommandBarSeparator"

interface CommandProps
  extends Omit<
    React.ComponentPropsWithoutRef<"button">,
    "children" | "onClick"
  > {
  action: () => void | Promise<void>
  label: string
  shortcut: { shortcut: string; label?: string }
}

const CommandBarCommand = React.forwardRef<HTMLButtonElement, CommandProps>(
  (
    {
      className,
      type = "button",
      label,
      action,
      shortcut,
      disabled,
      ...props
    }: CommandProps,
    ref,
  ) => {
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === shortcut.shortcut) {
          event.preventDefault()
          event.stopPropagation()
          action()
        }
      }

      if (!disabled) {
        document.addEventListener("keydown", handleKeyDown)
      }

      return () => {
        document.removeEventListener("keydown", handleKeyDown)
      }
    }, [action, shortcut, disabled])

    return (
      <span
        className={cn(
          "flex items-center gap-x-2 rounded-lg bg-gray-900 p-1 text-base font-medium text-gray-50 outline-none transition focus:z-10 sm:text-sm",
          "sm:last-of-type:-mr-1",
          className,
        )}
      >
        <button
          ref={ref}
          type={type}
          onClick={action}
          disabled={disabled}
          className={cn(
            "flex items-center gap-x-2 rounded-md px-1 py-1 hover:bg-gray-800",
            "focus-visible:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600",
            "disabled:text-gray-500",
          )}
          {...props}
        >
          <span>{label}</span>
          <span className="hidden h-6 select-none items-center justify-center rounded-md bg-gray-800 px-2 font-mono text-xs text-gray-400 ring-1 ring-inset ring-gray-700 transition sm:flex">
            {shortcut.label
              ? shortcut.label.toUpperCase()
              : shortcut.shortcut.toUpperCase()}
          </span>
        </button>
      </span>
    )
  },
)
CommandBarCommand.displayName = "CommandBarCommand"

type DataTableBulkEditorProps<TData> = {
  table: Table<TData>
  rowSelection: RowSelectionState
}

function DataTableBulkEditor<TData>({
  table,
  rowSelection,
}: DataTableBulkEditorProps<TData>) {
  const locale = useDataTableLocale()
  const hasSelectedRows = Object.keys(rowSelection).length > 0
  return (
    <CommandBar open={hasSelectedRows}>
      <CommandBarBar>
        <CommandBarValue>
          {Object.keys(rowSelection).length} {locale.selected}
        </CommandBarValue>
        <CommandBarSeparator />
        <CommandBarCommand
          label={locale.edit}
          action={() => {
            console.log("Edit")
          }}
          shortcut={{ shortcut: "e" }}
        />
        <CommandBarSeparator />
        <CommandBarCommand
          label={locale.delete}
          action={() => {
            console.log("Delete")
          }}
          shortcut={{ shortcut: "d" }}
        />
        <CommandBarSeparator />
        <CommandBarCommand
          label={locale.reset}
          action={() => {
            table.resetRowSelection()
          }}
          shortcut={{ shortcut: "Escape", label: "esc" }}
        />
      </CommandBarBar>
    </CommandBar>
  )
}

export { DataTableBulkEditor }
