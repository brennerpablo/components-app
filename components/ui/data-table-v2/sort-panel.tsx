"use client";

import type { SortingState } from "@tanstack/react-table";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import type { ColumnType } from "@/components/ui/data-table/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { ColumnLabel } from "./column-label";
import { moveItem, sortDirectionLabel } from "./model";
import { FrameFooter } from "./popover-frame";

export type SortColumn = { id: string; title: string; subtitle?: string; type: ColumnType };

type SortPanelProps = {
  columns: SortColumn[];
  sorting: SortingState;
  onChange: (next: SortingState) => void;
  max?: number;
};

export function SortPanel({ columns, sorting, onChange, max = Infinity }: SortPanelProps) {
  const [dragFrom, setDragFrom] = React.useState<number | null>(null);
  const byId = new Map(columns.map((c) => [c.id, c]));
  const rules = sorting.filter((s) => byId.has(s.id));
  const livres = columns.filter((c) => !rules.some((r) => r.id === c.id));

  const replace = (index: number, rule: SortingState[number]) =>
    onChange(rules.map((r, i) => (i === index ? rule : r)));

  const add = () => {
    const col = livres[0];
    if (!col || rules.length >= max) return;
    onChange([...rules, { id: col.id, desc: col.type !== "text" }]);
  };

  return (
    <div className="text-xs">
      <div className="flex flex-col gap-2 p-3 pl-2">
        {rules.length === 0 ? <p className="py-1 pl-1 text-muted-foreground">Sem ordenação</p> : null}
        {rules.map((rule, index) => {
          const col = byId.get(rule.id) as SortColumn;
          return (
            <div
              key={rule.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", rule.id);
                setDragFrom(index);
              }}
              onDragEnd={() => setDragFrom(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragFrom != null && dragFrom !== index) onChange(moveItem(rules, dragFrom, index));
                setDragFrom(null);
              }}
              className={cn(
                "grid grid-cols-[1.25rem_0.75rem_minmax(0,1fr)_10.5rem_1.5rem] items-center gap-2",
                dragFrom === index && "opacity-50",
              )}
            >
              <button
                type="button"
                aria-label={`Prioridade de ${col.title}: use as setas para mover`}
                className="flex h-8 cursor-grab items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                onKeyDown={(e) => {
                  const to = e.key === "ArrowUp" ? index - 1 : e.key === "ArrowDown" ? index + 1 : -1;
                  if (to < 0 || to >= rules.length) return;
                  e.preventDefault();
                  onChange(moveItem(rules, index, to));
                }}
              >
                <GripVertical className="size-3.5" aria-hidden />
              </button>
              <span className="text-center text-[11px] font-semibold tabular-nums text-muted-foreground">{index + 1}</span>
              <Select value={rule.id} onValueChange={(id) => replace(index, { id, desc: rule.desc })}>
                <SelectTrigger size="sm" className="text-xs font-medium" aria-label="Coluna">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[col, ...livres].map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">
                      <ColumnLabel title={c.title} subtitle={c.subtitle} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={rule.desc ? "desc" : "asc"}
                onValueChange={(dir) => replace(index, { id: rule.id, desc: dir === "desc" })}
              >
                <SelectTrigger size="sm" className="text-xs" aria-label="Direção">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc" className="text-xs">
                    {sortDirectionLabel(col.type, false)}
                  </SelectItem>
                  <SelectItem value="desc" className="text-xs">
                    {sortDirectionLabel(col.type, true)}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Remover ordenação por ${col.title}`}
                onClick={() => onChange(rules.filter((_, i) => i !== index))}
              >
                <Trash2 className="size-3.5" aria-hidden />
              </Button>
            </div>
          );
        })}
      </div>
      <FrameFooter>
        <Button
          variant="ghost"
          size="sm"
          className="mr-auto"
          disabled={livres.length === 0 || rules.length >= max}
          onClick={add}
        >
          <Plus className="size-3.5" aria-hidden />
          Ordenação
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          disabled={rules.length === 0}
          onClick={() => onChange([])}
        >
          Limpar tudo
        </Button>
      </FrameFooter>
    </div>
  );
}
