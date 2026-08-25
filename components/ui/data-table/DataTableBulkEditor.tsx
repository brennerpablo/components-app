"use client"

import { RowSelectionState, Table } from "@tanstack/react-table"
import { Popover } from "radix-ui"
import React from "react"

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
        "px-3 py-2.5 text-sm tabular-nums text-background/60",
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
        "relative flex items-center rounded-lg bg-foreground px-1 shadow-lg shadow-black/30 dark:ring-1 dark:ring-background/10",
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
      className={cn("h-4 w-px bg-background/20", className)}
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
          "flex items-center gap-x-2 rounded-lg bg-foreground p-1 text-base font-medium text-background outline-none transition focus:z-10 sm:text-sm",
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
            "flex items-center gap-x-2 rounded-md px-1 py-1 hover:bg-background/10",
            "focus-visible:bg-background/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/30",
            "disabled:text-background/40",
          )}
          {...props}
        >
          <span>{label}</span>
          <span className="hidden h-6 select-none items-center justify-center rounded-md bg-background/10 px-2 font-mono text-xs text-background/60 ring-1 ring-inset ring-background/20 transition sm:flex">
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

/**
 * A bulk action beyond the built-in Edit/Delete pair.
 *
 * It exists because the two built-in buttons take their labels from `locale`
 * and cannot be renamed: reusing `onEdit` for an action of a different name
 * would put the label "Edit" on a button that edits nothing. `shortcut` is a
 * single key, same scheme as the built-ins (`e`, `d`, `esc`) — pick one that
 * does not collide.
 */
export type DataTableBulkAction<TData> = {
  label: string
  shortcut: string
  action: (rows: TData[]) => void
  disabled?: boolean
}

type DataTableBulkEditorProps<TData> = {
  table: Table<TData>
  rowSelection: RowSelectionState
  onEdit?: (rows: TData[]) => void
  onDelete?: (rows: TData[]) => void
  /** Extra actions, rendered before Reset. */
  actions?: DataTableBulkAction<TData>[]
}

function DataTableBulkEditor<TData>({
  table,
  rowSelection,
  onEdit,
  onDelete,
  actions,
}: DataTableBulkEditorProps<TData>) {
  const locale = useDataTableLocale()

  // Count from the row model, not from `rowSelection` keys: a bulk action can
  // only ever receive rows present in `data`, so in server-pagination mode a
  // selection carried over from another page must not inflate the count.
  // `rowSelection` stays a dependency so the count re-renders on toggle.
  void rowSelection
  const selectedRows = table.getSelectedRowModel().rows
  const hasSelectedRows = selectedRows.length > 0

  function getSelectedRows() {
    return selectedRows.map((r) => r.original)
  }

  // Edit/Delete only render when a callback is given. They used to render
  // always, disabled — so a table that only does bulk delete showed a dead
  // "Edit" next to it, and one with only custom actions would show two. A
  // disabled button that will never enable is noise, not affordance.
  return (
    <CommandBar open={hasSelectedRows}>
      <CommandBarBar>
        <CommandBarValue>
          {selectedRows.length} {locale.selected}
        </CommandBarValue>
        {onEdit && (
          <>
            <CommandBarSeparator />
            <CommandBarCommand
              label={locale.edit}
              action={() => onEdit(getSelectedRows())}
              shortcut={{ shortcut: "e" }}
            />
          </>
        )}
        {onDelete && (
          <>
            <CommandBarSeparator />
            <CommandBarCommand
              label={locale.delete}
              action={() => onDelete(getSelectedRows())}
              shortcut={{ shortcut: "d" }}
            />
          </>
        )}
        {actions?.map((custom) => (
          <React.Fragment key={custom.label}>
            <CommandBarSeparator />
            <CommandBarCommand
              label={custom.label}
              action={() => custom.action(getSelectedRows())}
              shortcut={{ shortcut: custom.shortcut }}
              disabled={custom.disabled}
            />
          </React.Fragment>
        ))}
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
