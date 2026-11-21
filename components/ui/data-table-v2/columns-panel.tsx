"use client";

import type { Table } from "@tanstack/react-table";
import { GripVertical, RotateCcw } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { TableCheckbox } from "./checkbox";
import { ColumnLabel } from "./column-label";
import { moveItem } from "./model";
import { FrameFooter } from "./popover-frame";

type ColumnsPanelProps<TData> = {
  table: Table<TData>;
  order: string[];
  labelOf: (id: string) => { title: string; subtitle?: string };
  onOrderChange: (next: string[]) => void;
  onReset?: () => void;
  canReset: boolean;
};

export function ColumnsPanel<TData>({
  table,
  order,
  labelOf,
  onOrderChange,
  onReset,
  canReset,
}: ColumnsPanelProps<TData>) {
  const [draft, setDraft] = React.useState<string[] | null>(null);
  const [dragId, setDragId] = React.useState<string | null>(null);
  const ids = draft ?? order;

  return (
    <>
      <div
        className="grid-scrollbar flex max-h-72 flex-col overflow-y-auto p-1.5 text-xs"
        onDragOver={(e) => {
          if (dragId) e.preventDefault();
        }}
        onDrop={(e) => e.preventDefault()}
      >
        {ids.map((id, index) => {
          const column = table.getColumn(id);
          if (!column) return null;
          const { title, subtitle } = labelOf(id);
          return (
            <div
              key={id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", id);
                setDragId(id);
                setDraft(ids);
              }}
              onDragEnter={(e) => {
                if (!dragId) return;
                e.preventDefault();
                if (id === dragId) return;
                setDraft((list) => (list ? moveItem(list, list.indexOf(dragId), list.indexOf(id)) : list));
              }}
              onDragOver={(e) => {
                if (!dragId) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDrop={(e) => e.preventDefault()}
              onDragEnd={(e) => {
                if (draft && e.dataTransfer.dropEffect !== "none") onOrderChange(draft);
                setDraft(null);
                setDragId(null);
              }}
              className={cn(
                "flex min-h-8 items-center gap-1 rounded-sm border border-dashed border-transparent pr-1.5 select-none",
                dragId === id ? "border-ring bg-accent" : !dragId && "hover:bg-accent",
              )}
            >
              <button
                type="button"
                aria-label={`Posição de ${title}: use as setas para mover`}
                className="flex h-8 w-5 shrink-0 cursor-grab items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
                onKeyDown={(e) => {
                  const to = e.key === "ArrowUp" ? index - 1 : e.key === "ArrowDown" ? index + 1 : -1;
                  if (to < 0 || to >= ids.length) return;
                  e.preventDefault();
                  onOrderChange(moveItem(ids, index, to));
                }}
              >
                <GripVertical className="size-3.5" aria-hidden />
              </button>
              <label
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-2",
                  column.getCanHide() ? "cursor-pointer" : "text-muted-foreground",
                )}
              >
                <TableCheckbox
                  checked={column.getIsVisible()}
                  disabled={!column.getCanHide()}
                  onCheckedChange={(checked) => column.toggleVisibility(checked === true)}
                />
                <ColumnLabel title={title} subtitle={subtitle} />
              </label>
            </div>
          );
        })}
      </div>
      {onReset ? (
        <FrameFooter>
          <Button variant="ghost" size="sm" className="mr-auto" disabled={!canReset} onClick={onReset}>
            <RotateCcw className="size-3.5" aria-hidden />
            Redefinir colunas
          </Button>
        </FrameFooter>
      ) : null}
    </>
  );
}
