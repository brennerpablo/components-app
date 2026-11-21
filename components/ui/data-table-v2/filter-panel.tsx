"use client";

import type { ColumnFiltersState } from "@tanstack/react-table";
import { CalendarDays, ChevronDown, ChevronRight, Hash, ListChecks, Type, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import type { OptionItem } from "@/components/ui/data-table/types";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { foldIncludes } from "@/lib/fold-text";
import { cn } from "@/lib/utils";

import { TableCheckbox } from "./checkbox";
import { ColumnLabel } from "./column-label";
import {
  countLabel,
  type DateFilterValue,
  type FilterKind,
  formatNumberBr,
  isFilterActive,
  NUMBER_CONDITIONS,
  type NumberCondition,
  type NumberFilterValue,
  parseNumberBr,
  summarizeFilter,
} from "./model";
import { FrameFooter, FrameHeaderActions } from "./popover-frame";
import type { DataTableV2RowLabel } from "./types";

export type FilterColumn = {
  id: string;
  title: string;
  subtitle?: string;
  kind: FilterKind;
  options: OptionItem[];
  unit?: string;
  single?: boolean;
};

export type FilterCounter = (filters: ColumnFiltersState) => number | null;

type Draft = Record<string, unknown>;

type FilterPanelProps = {
  columns: FilterColumn[];
  applied: ColumnFiltersState;
  focusColumnId: string | null;
  rowLabel: DataTableV2RowLabel;
  countWith: FilterCounter;
  onApply: (next: ColumnFiltersState) => void;
  onClear: () => void;
  onCancel: () => void;
};

const FIELD_CLASS = "h-8 text-xs md:text-xs";

export const BAND_TEXT_BUTTON_CLASS = "h-7 px-2 text-[13px] hover:bg-foreground/10";

export const FILTER_VALUE_CLASS =
  "max-w-44 truncate rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground tabular-nums";

export function summaryOf(col: FilterColumn, value: unknown): string {
  const labels = new Map(col.options.map((o) => [o.value, o.label]));
  return summarizeFilter(col.kind, value, (v) => labels.get(v) ?? v, col.unit);
}

export function applyLabel(count: number | null, rowLabel: DataTableV2RowLabel): string {
  return count == null ? "Aplicar" : `Mostrar ${countLabel(count, rowLabel)}`;
}

const KIND_ICON = { options: ListChecks, number: Hash, date: CalendarDays, text: Type } as const;

export function FilterKindIcon({ kind, className }: { kind: FilterKind; className?: string }) {
  const Icon = KIND_ICON[kind];
  return <Icon className={cn("size-3.5 shrink-0 text-muted-foreground", className)} aria-hidden />;
}

function toFilters(columns: FilterColumn[], draft: Draft): ColumnFiltersState {
  return columns
    .filter((col) => isFilterActive(col.kind, draft[col.id]))
    .map((col) => ({ id: col.id, value: draft[col.id] }));
}

export function FilterPanel({
  columns,
  applied,
  focusColumnId,
  rowLabel,
  countWith,
  onApply,
  onClear,
  onCancel,
}: FilterPanelProps) {
  const [draft, setDraft] = React.useState<Draft>(() => Object.fromEntries(applied.map((f) => [f.id, f.value])));
  const [expanded, setExpanded] = React.useState<string | null>(focusColumnId);
  const [inUse] = React.useState(() => new Set(applied.map((f) => f.id)));

  const setValue = (id: string, value: unknown) =>
    setDraft((prev) => {
      const next = { ...prev };
      if (value === undefined) delete next[id];
      else next[id] = value;
      return next;
    });

  const hasAny = columns.some((col) => isFilterActive(col.kind, draft[col.id]));
  const deferredDraft = React.useDeferredValue(draft);
  const count = React.useMemo(() => countWith(toFilters(columns, deferredDraft)), [columns, countWith, deferredDraft]);
  const apply = () => onApply(toFilters(columns, draft));

  const used = columns.filter((col) => inUse.has(col.id));
  const others = columns.filter((col) => !inUse.has(col.id));

  const renderRow = (col: FilterColumn) => {
    const value = draft[col.id];
    const summary = summaryOf(col, value);

    if (expanded === col.id) {
      return (
        <div key={col.id} className="mx-2 my-0.5 rounded-md border border-border bg-muted/40">
          <button
            type="button"
            aria-expanded
            className="flex h-10 w-full items-center gap-2.5 rounded-md pl-2 pr-2 text-left font-medium outline-none focus-visible:bg-muted"
            onClick={() => setExpanded(null)}
          >
            <FilterKindIcon kind={col.kind} />
            <span className="min-w-0 flex-1">
              <ColumnLabel title={col.title} subtitle={col.subtitle} />
            </span>
            <ChevronDown className="size-3.5 shrink-0" aria-hidden />
          </button>
          <div className="px-2.5 pb-2.5">
            <FilterEditor column={col} value={value} onChange={(v) => setValue(col.id, v)} onSubmit={apply} />
          </div>
        </div>
      );
    }

    return (
      <div key={col.id} className="flex h-10 items-center pl-4 pr-2">
        <button
          type="button"
          aria-expanded={false}
          className="flex h-full min-w-0 flex-1 items-center gap-2.5 text-left outline-none focus-visible:underline"
          onClick={() => setExpanded(col.id)}
        >
          <FilterKindIcon kind={col.kind} />
          <span className="min-w-0 flex-1">
            <ColumnLabel title={col.title} subtitle={col.subtitle} />
          </span>
          {summary ? <span className={FILTER_VALUE_CLASS}>{summary}</span> : null}
        </button>
        {summary ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="ml-0.5 text-muted-foreground hover:text-foreground"
            aria-label={`Remover filtro de ${col.title}`}
            onClick={() => setValue(col.id, undefined)}
          >
            <X className="size-3" aria-hidden />
          </Button>
        ) : null}
        <ChevronRight className="mx-1 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
      </div>
    );
  };

  return (
    <div className="text-sm">
      <FrameHeaderActions>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className={BAND_TEXT_BUTTON_CLASS}
          disabled={!hasAny && applied.length === 0}
          onClick={() => {
            setDraft({});
            onClear();
          }}
        >
          Limpar tudo
        </Button>
      </FrameHeaderActions>

      <div className="py-1">
        {used.length > 0 ? (
          <>
            <SectionLabel>Em uso · {used.length}</SectionLabel>
            {used.map(renderRow)}
            {others.length > 0 ? (
              <>
                <div className="my-1 h-px bg-border" aria-hidden />
                <SectionLabel>Outras colunas</SectionLabel>
              </>
            ) : null}
          </>
        ) : null}
        {others.map(renderRow)}
      </div>

      <FrameFooter>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" size="sm" onClick={apply}>
          {applyLabel(count, rowLabel)}
        </Button>
      </FrameFooter>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-7 items-center px-4 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
      {children}
    </div>
  );
}

export function FilterEditor({
  column,
  value,
  onChange,
  onSubmit,
}: {
  column: FilterColumn;
  value: unknown;
  onChange: (value: unknown) => void;
  onSubmit?: () => void;
}) {
  const submitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !onSubmit) return;
    e.preventDefault();
    onSubmit();
  };
  switch (column.kind) {
    case "options":
      return (
        <OptionsEditor
          options={column.options}
          single={column.single}
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={(next) => onChange(next.length ? next : undefined)}
        />
      );
    case "number":
      return (
        <NumberEditor
          value={value as NumberFilterValue | undefined}
          unit={column.unit}
          onChange={onChange}
          onKeyDown={submitOnEnter}
        />
      );
    case "date":
      return <DateEditor value={value as DateFilterValue | undefined} onChange={onChange} />;
    case "text":
      return (
        <Input
          autoFocus
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value || undefined)}
          onKeyDown={submitOnEnter}
          placeholder="Contém…"
          aria-label={`Texto contido em ${column.title}`}
          className={FIELD_CLASS}
        />
      );
  }
}

function OptionsEditor({
  options,
  single = false,
  value,
  onChange,
}: {
  options: OptionItem[];
  single?: boolean;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [busca, setBusca] = React.useState("");
  const visiveis = busca ? options.filter((o) => foldIncludes(o.label, busca)) : options;
  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange(single ? [v] : [...value, v]);
  };

  return (
    <div className="flex flex-col gap-1">
      {options.length > 8 ? (
        <Input
          autoFocus
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder={`Buscar entre ${formatNumberBr(options.length)} valores`}
          aria-label="Buscar valor"
          className={FIELD_CLASS}
        />
      ) : null}
      <div className="grid-scrollbar flex max-h-52 flex-col overflow-y-auto" role={single ? "radiogroup" : undefined}>
        {visiveis.map((option) => (
          <label key={option.value} className="flex min-h-7 cursor-pointer items-center gap-2">
            <TableCheckbox
              role={single ? "radio" : undefined}
              className={single ? "rounded-full" : undefined}
              checked={value.includes(option.value)}
              onCheckedChange={() => toggle(option.value)}
            />
            <span className="truncate">{option.label}</span>
          </label>
        ))}
        {visiveis.length === 0 ? <p className="py-2 text-muted-foreground">Nenhum valor</p> : null}
      </div>
    </div>
  );
}

function NumberEditor({
  value,
  unit,
  onChange,
  onKeyDown,
}: {
  value: NumberFilterValue | undefined;
  unit?: string;
  onChange: (value: NumberFilterValue | undefined) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  const [condition, setCondition] = React.useState<NumberCondition>(value?.condition ?? "is-greater-than");
  const [a, setA] = React.useState(value ? formatNumberBr(value.value[0]) : "");
  const [b, setB] = React.useState(value?.condition === "is-between" ? formatNumberBr(value.value[1]) : "");
  const between = condition === "is-between";

  const emit = (c: NumberCondition, textA: string, textB: string) => {
    const na = parseNumberBr(textA);
    const nb = parseNumberBr(textB);
    if (na == null || (c === "is-between" && nb == null)) return onChange(undefined);
    onChange({ condition: c, value: [na, c === "is-between" ? (nb as number) : na] });
  };

  const field = (text: string, set: (t: string) => void, label: string, autoFocus: boolean) => (
    <Input
      autoFocus={autoFocus}
      inputMode="decimal"
      value={text}
      onChange={(e) => set(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder="0"
      aria-label={label}
      className={`${FIELD_CLASS} min-w-0 flex-1 tabular-nums`}
    />
  );
  const setFirst = (t: string) => {
    setA(t);
    emit(condition, t, b);
  };
  const setSecond = (t: string) => {
    setB(t);
    emit(condition, a, t);
  };
  const unitLabel = unit ? <span className="shrink-0 text-xs text-muted-foreground">{unit}</span> : null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Select
          value={condition}
          onValueChange={(next) => {
            setCondition(next as NumberCondition);
            emit(next as NumberCondition, a, b);
          }}
        >
          <SelectTrigger size="sm" className={cn("shrink-0 text-xs", between ? "w-full" : "w-32")} aria-label="Condição">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NUMBER_CONDITIONS.map((c) => (
              <SelectItem key={c.value} value={c.value} className="text-xs">
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {between ? null : (
          <>
            {field(a, setFirst, "Valor", true)}
            {unitLabel}
          </>
        )}
      </div>
      {between ? (
        <div className="flex items-center gap-2">
          {field(a, setFirst, "Valor inicial", true)}
          <span className="text-xs text-muted-foreground">e</span>
          {field(b, setSecond, "Valor final", false)}
          {unitLabel}
        </div>
      ) : null}
    </div>
  );
}

function DateEditor({
  value,
  onChange,
}: {
  value: DateFilterValue | undefined;
  onChange: (value: DateFilterValue | undefined) => void;
}) {
  const from = value?.from ?? value?.to;
  const to = value?.to ?? value?.from;
  return (
    <DatePicker
      mode="range"
      language="pt"
      displayFormat="short"
      size="sm"
      shadow="none"
      wrapperClassName="w-full"
      triggerClassName="w-full bg-background"
      value={from ? { from, to } : undefined}
      onChange={(next) => onChange(next?.from ? { from: next.from, to: next.to ?? next.from } : undefined)}
    />
  );
}
