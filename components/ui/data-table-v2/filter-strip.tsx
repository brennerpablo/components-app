"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { type ColumnFilterAnchor, SOFT_SURFACE } from "./header-cell";

export type FilterStripItem = { id: string; title: string; summary: string };

type FilterStripProps = {
  items: FilterStripItem[];
  openId: string | null;
  loose: boolean;
  onOpen: (columnId: string, anchor: ColumnFilterAnchor) => void;
  onRemove: (columnId: string) => void;
  onClear: () => void;
};

export function FilterStrip({ items, openId, loose, onOpen, onRemove, onClear }: FilterStripProps) {
  return (
    <div
      role="group"
      aria-label="Filtros em uso"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-xs",
        loose ? "" : cn("min-h-10 border-b border-border py-1.5 pl-3 pr-1.5", SOFT_SURFACE),
      )}
    >
      <span className="mr-0.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Filtros</span>
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <span
            key={item.id}
            className={cn(
              "inline-flex h-7 max-w-full items-center rounded-md border border-border bg-background text-foreground shadow-xs",
              open && "ring-2 ring-ring/50",
            )}
          >
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-label={`${item.title}: ${item.summary}. Editar filtro`}
              className="flex h-full min-w-0 items-center gap-1.5 rounded-l-md pl-2 pr-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={(e) =>
                onOpen(item.id, {
                  anchor: e.currentTarget.parentElement ?? e.currentTarget,
                  trigger: e.currentTarget,
                  align: "start",
                })
              }
            >
              <span className="shrink-0 font-medium text-muted-foreground">{item.title}</span>
              <span className="max-w-56 truncate font-semibold tabular-nums">{item.summary}</span>
            </button>
            <button
              type="button"
              aria-label={`Remover filtro de ${item.title}`}
              className="mr-1 flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onRemove(item.id)}
            >
              <X className="size-3" aria-hidden />
            </button>
          </span>
        );
      })}
      <Button
        type="button"
        variant="ghost"
        size="xs"
        className={cn("text-muted-foreground", loose ? "" : "ml-auto")}
        onClick={onClear}
      >
        Limpar filtros
      </Button>
    </div>
  );
}
