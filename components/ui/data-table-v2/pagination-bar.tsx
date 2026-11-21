"use client";

import type { Table } from "@tanstack/react-table";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Pencil, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { type BulkShortcut, useBulkShortcuts } from "./bulk-shortcuts";
import { bulkShortcutKeys, countLabel, formatNumberBr } from "./model";
import type { DataTableV2Props, DataTableV2RowLabel } from "./types";

type PaginationBarProps<TData> = {
  table: Table<TData>;
  placement: "top" | "bottom";
  showSelection: boolean;
  rowLabel: DataTableV2RowLabel;
  totalRows: number;
  filteredCount?: number;
  enablePagination: boolean;
  onBulkAction: DataTableV2Props<TData>["onBulkAction"];
  loose: boolean;
  note?: React.ReactNode;
  selectAll?: { total: number; selected: boolean; pageAllSelected: boolean; onChange: (selected: boolean) => void };
};

function ShortcutKey({ shortcut }: { shortcut: string }) {
  return (
    <kbd
      aria-hidden
      className="hidden h-4 min-w-4 items-center justify-center rounded-sm border border-current px-1 font-mono text-[10px] leading-none opacity-60 sm:inline-flex"
    >
      {shortcut.toUpperCase()}
    </kbd>
  );
}

export function PaginationBar<TData>({
  table,
  placement,
  showSelection,
  rowLabel,
  totalRows,
  filteredCount,
  enablePagination,
  onBulkAction,
  loose,
  note,
  selectAll,
}: PaginationBarProps<TData>) {
  const selected = showSelection ? table.getFilteredSelectedRowModel().rows : [];
  const filteredRows = filteredCount ?? table.getFilteredRowModel().rows.length;
  const originals = () => selected.map((row) => row.original);

  const barRef = React.useRef<HTMLDivElement | null>(null);
  const customActions = onBulkAction?.actions ?? [];
  const keys = bulkShortcutKeys({
    edit: Boolean(onBulkAction?.onEdit),
    delete: Boolean(onBulkAction?.onDelete),
    custom: customActions.map((custom) => custom.shortcut),
  });
  const shortcuts: BulkShortcut[] = [];
  if (keys.edit) shortcuts.push({ key: keys.edit, run: () => onBulkAction?.onEdit?.(originals()) });
  customActions.forEach((custom, index) => {
    const key = keys.custom[index];
    if (key) shortcuts.push({ key, disabled: custom.disabled, run: () => custom.action(originals()) });
  });
  if (keys.delete) shortcuts.push({ key: keys.delete, run: () => onBulkAction?.onDelete?.(originals()) });
  useBulkShortcuts(barRef, shortcuts, table.getState().rowSelection, selected.length > 0);

  return (
    <div
      ref={barRef}
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-muted-foreground",
        loose ? "min-h-8" : cn("min-h-12 border-border px-3 py-2", placement === "top" ? "border-b" : "border-t"),
      )}
    >
      {selected.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="pr-1 font-medium tabular-nums text-foreground">
            {selectAll?.selected
              ? `Filtro inteiro: ${countLabel(selectAll.total, rowLabel)}`
              : selected.length === 1
                ? "1 selecionado"
                : `${formatNumberBr(selected.length)} selecionados`}
          </span>
          {onBulkAction?.controls ? onBulkAction.controls(originals()) : null}
          {onBulkAction?.onEdit ? (
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              aria-keyshortcuts={keys.edit ?? undefined}
              onClick={() => onBulkAction.onEdit?.(originals())}
            >
              <Pencil className="size-3.5" aria-hidden />
              Editar
              {keys.edit ? <ShortcutKey shortcut={keys.edit} /> : null}
            </Button>
          ) : null}
          {customActions.map((custom, index) => {
            const key = keys.custom[index];
            return (
              <Button
                key={custom.label}
                variant="outline"
                size="sm"
                className="text-xs"
                disabled={custom.disabled}
                aria-keyshortcuts={key ?? undefined}
                onClick={() => custom.action(originals())}
              >
                {custom.icon}
                {custom.label}
                {key ? <ShortcutKey shortcut={key} /> : null}
              </Button>
            );
          })}
          {onBulkAction?.onDelete ? (
            <Button
              variant="destructive"
              size="sm"
              className="text-xs"
              aria-keyshortcuts={keys.delete ?? undefined}
              onClick={() => onBulkAction.onDelete?.(originals())}
            >
              <Trash2 className="size-3.5" aria-hidden />
              Excluir
              {keys.delete ? <ShortcutKey shortcut={keys.delete} /> : null}
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => table.resetRowSelection()}>
            Limpar seleção
          </Button>
          {selectAll && !selectAll.selected && selectAll.pageAllSelected && selectAll.total > selected.length ? (
            <Button variant="link" size="sm" className="text-xs" onClick={() => selectAll.onChange(true)}>
              Selecionar o filtro inteiro ({countLabel(selectAll.total, rowLabel)})
            </Button>
          ) : null}
        </div>
      ) : note ? (
        <span>{note}</span>
      ) : enablePagination ? null : (
        <span className="tabular-nums">
          {filteredRows !== totalRows ? (
            <>
              <span className="font-medium text-foreground">{formatNumberBr(filteredRows)}</span> de{" "}
              {formatNumberBr(totalRows)}
            </>
          ) : (
            countLabel(totalRows, rowLabel)
          )}
        </span>
      )}

      {enablePagination ? (
        <div className="ml-auto">
          <Pagination table={table} filteredRows={filteredRows} />
        </div>
      ) : null}
    </div>
  );
}

export function InlinePagination<TData>({ table, filteredCount }: { table: Table<TData>; filteredCount?: number }) {
  return <Pagination table={table} filteredRows={filteredCount ?? table.getFilteredRowModel().rows.length} />;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200];

function Pagination<TData>({ table, filteredRows }: { table: Table<TData>; filteredRows: number }) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const firstRow = filteredRows === 0 ? 0 : pageIndex * pageSize + 1;
  const lastRow = Math.min(filteredRows, (pageIndex + 1) * pageSize);
  const sizes = PAGE_SIZE_OPTIONS.includes(pageSize)
    ? PAGE_SIZE_OPTIONS
    : [...PAGE_SIZE_OPTIONS, pageSize].sort((a, b) => a - b);
  const go = (move: () => void) => {
    move();
    table.resetRowSelection();
  };
  const canPrevious = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  return (
    <div className="flex items-center text-xs text-muted-foreground">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 pl-2 pr-1.5 text-xs font-normal text-muted-foreground tabular-nums data-[state=open]:bg-accent"
          >
            <span>
              <span className="font-medium text-foreground">
                {formatNumberBr(firstRow)}–{formatNumberBr(lastRow)}
              </span>{" "}
              de <span className="font-medium text-foreground">{formatNumberBr(filteredRows)}</span>
              <span className="sr-only">, linhas por página</span>
            </span>
            <ChevronDown className="size-3.5" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Linhas por página</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={String(pageSize)}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              table.setPageIndex(0);
            }}
          >
            {sizes.map((size) => (
              <DropdownMenuRadioItem key={size} value={String(size)} className="text-xs tabular-nums">
                {size}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-xs"
            disabled={!canPrevious}
            onSelect={() => go(() => table.setPageIndex(0))}
          >
            <ChevronsLeft className="size-3.5" aria-hidden />
            Primeira página
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs"
            disabled={!canNext}
            onSelect={() => go(() => table.setPageIndex(table.getPageCount() - 1))}
          >
            <ChevronsRight className="size-3.5" aria-hidden />
            Última página
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Página anterior"
        className="text-muted-foreground hover:text-foreground"
        disabled={!canPrevious}
        onClick={() => go(() => table.previousPage())}
      >
        <ChevronLeft aria-hidden />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Próxima página"
        className="text-muted-foreground hover:text-foreground"
        disabled={!canNext}
        onClick={() => go(() => table.nextPage())}
      >
        <ChevronRight aria-hidden />
      </Button>
    </div>
  );
}
