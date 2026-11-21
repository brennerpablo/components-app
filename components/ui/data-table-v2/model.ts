import type { ColumnMetadata, ColumnType } from "@/components/ui/data-table/types";
import { foldText } from "@/lib/fold-text";

import type { DataTableV2FilterConfig } from "./types";

export type FilterKind = "options" | "number" | "date" | "text";

export type NumberCondition = "is-equal-to" | "is-between" | "is-greater-than" | "is-less-than";

export type NumberFilterValue = { condition: NumberCondition; value: [number, number] };

export type DateFilterValue = { from: Date | undefined; to: Date | undefined };

export const NUMBER_CONDITIONS: { value: NumberCondition; label: string; resumo: string }[] = [
  { value: "is-greater-than", label: "é maior que", resumo: "maior que" },
  { value: "is-less-than", label: "é menor que", resumo: "menor que" },
  { value: "is-equal-to", label: "é igual a", resumo: "igual a" },
  { value: "is-between", label: "está entre", resumo: "entre" },
];

export function filterKindOf(col: { filters?: DataTableV2FilterConfig }): FilterKind | null {
  const f = col.filters;
  if (!f) return null;
  if (f.checkbox || f.checkboxSearch || f.checkboxArray || f.select) return "options";
  if (f.number || f.percentage) return "number";
  if (f.date || f.dateSingle) return "date";
  if (f.text) return "text";
  return null;
}

export function isFilterActive(kind: FilterKind, value: unknown): boolean {
  if (value == null) return false;
  switch (kind) {
    case "options":
      return Array.isArray(value) && value.length > 0;
    case "number": {
      const v = value as Partial<NumberFilterValue>;
      return (
        Boolean(v.condition) && Array.isArray(v.value) && Number.isFinite(v.value[0]) && Number.isFinite(v.value[1])
      );
    }
    case "date": {
      const v = value as Partial<DateFilterValue>;
      return v.from instanceof Date || v.to instanceof Date;
    }
    case "text":
      return typeof value === "string" && value.trim() !== "";
  }
}

const NUMERO_BR = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 6 });

function dataBr(d: Date): string {
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${d.getFullYear()}`;
}

export function summarizeFilter(
  kind: FilterKind,
  value: unknown,
  labelFor: (value: string) => string = (v) => v,
  unit = "",
): string {
  if (!isFilterActive(kind, value)) return "";
  switch (kind) {
    case "options": {
      const labels = (value as string[]).map(labelFor);
      if (labels.length <= 2) return labels.join(", ");
      return `${labels[0]} e mais ${labels.length - 1}`;
    }
    case "number": {
      const {
        condition,
        value: [a, b],
      } = value as NumberFilterValue;
      const resumo = NUMBER_CONDITIONS.find((c) => c.value === condition)?.resumo ?? "";
      const n = (x: number) => {
        const num = NUMERO_BR.format(x);
        if (unit === "%") return `${num}%`;
        if (unit.startsWith("R$")) return `R$ ${num}${unit.slice(2)}`;
        return unit ? `${num} ${unit}` : num;
      };
      return condition === "is-between" ? `${resumo} ${n(a)} e ${n(b)}` : `${resumo} ${n(a)}`;
    }
    case "date": {
      const { from, to } = value as DateFilterValue;
      if (from && to) return from.getTime() === to.getTime() ? dataBr(from) : `${dataBr(from)} – ${dataBr(to)}`;
      if (from) return `a partir de ${dataBr(from)}`;
      return `até ${dataBr(to as Date)}`;
    }
    case "text":
      return `contém «${(value as string).trim()}»`;
  }
}

export function numberMatches(n: number, filter: NumberFilterValue): boolean {
  if (!Number.isFinite(n)) return false;
  const v = Math.round(n * 1e9) / 1e9;
  const [a, b] = filter.value;
  switch (filter.condition) {
    case "is-equal-to":
      return v === a;
    case "is-greater-than":
      return v > a;
    case "is-less-than":
      return v < a;
    case "is-between":
      return v >= Math.min(a, b) && v <= Math.max(a, b);
  }
}

export function parseDateLoose(raw: unknown): Date | null {
  if (raw instanceof Date) return Number.isNaN(raw.getTime()) ? null : raw;
  if (typeof raw !== "string") return null;
  const s = raw.trim();
  const br = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(s);
  if (br) return new Date(+br[3], +br[2] - 1, +br[1]);
  const iso = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(s);
  if (iso) {
    const [, ano, mes, dia, hora, minuto, segundo] = iso;
    const temHora = hora != null && (hora !== "00" || minuto !== "00" || (segundo ?? "00") !== "00");
    if (temHora) {
      const instante = new Date(s);
      if (!Number.isNaN(instante.getTime())) return instante;
    }
    return new Date(+ano, +mes - 1, +dia);
  }
  const compacta = /^(\d{4})(\d{2})(\d{2})$/.exec(s);
  if (compacta) return new Date(+compacta[1], +compacta[2] - 1, +compacta[3]);
  const mes = /^(\d{4})-(\d{2})$/.exec(s);
  if (mes) return new Date(+mes[1], +mes[2] - 1, 1);
  return null;
}

export function dateMatches(raw: unknown, filter: DateFilterValue): boolean {
  const date = parseDateLoose(raw);
  if (!date) return false;
  const dia = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  if (filter.from && dia < new Date(filter.from).setHours(0, 0, 0, 0)) return false;
  if (filter.to && dia > new Date(filter.to).setHours(23, 59, 59, 999)) return false;
  return true;
}

const SO_MILHAR = /^-?\d{1,3}(\.\d{3})+$/;

function decimalLimpo(d: string): string {
  let t = d.includes(".") ? d.replace(/0+$/, "").replace(/\.$/, "") : d;
  t = t.replace(/^(-?)\./, "$10.");
  return t === "-0" || t === "" ? "0" : t;
}

export function parseNumberBr(texto: string): number | null {
  const t = texto.replace(/\s|R\$|%/g, "");
  if (!t) return null;
  const normal = t.includes(",") ? t.replaceAll(".", "").replace(",", ".") : SO_MILHAR.test(t) ? t.replaceAll(".", "") : t;
  return /^-?(\d+(\.\d*)?|\.\d+)$/.test(normal) ? Number(decimalLimpo(normal)) : null;
}

export function formatNumberBr(n: number): string {
  return NUMERO_BR.format(n);
}

export function sortDirectionLabel(type: ColumnType, desc: boolean): string {
  if (type === "number") return desc ? "Maior primeiro" : "Menor primeiro";
  if (type === "date") return desc ? "Mais recente primeiro" : "Mais antiga primeiro";
  return desc ? "Z a A" : "A a Z";
}

export function normalizeUnit(subtitle: string | undefined): string | undefined {
  if (!subtitle) return undefined;
  const t = subtitle.trim();
  const sem = t.startsWith("(") && t.endsWith(")") ? t.slice(1, -1).trim() : t;
  return sem || undefined;
}

export function alignOf(col: Pick<ColumnMetadata, "aligned" | "type">): "left" | "center" | "right" {
  return col.aligned ?? "left";
}

export const TEXT_CAP_CLASS = "max-w-[280px] truncate";

const WIDTH_MANAGED = /(^|\s)(w-|min-w-|max-w-|truncate|whitespace-normal|font-mono)/;
const CLAMPED = /(^|\s)whitespace-normal(\s|$)/;
const PERCENT_WIDTH = /(^|\s)w-(\[[\d.]+%\]|full)/;
const NOT_A_NAME =
  /^(status|situa|tipo|perfil|data\b|layout|formato|categoria|vers|criado|atualiza|venc|último|última)/i;
const NOT_A_NAME_VALUE = /^(\d{2}\/\d{2}\/\d{2,4}|\d{4}-\d{2}-\d{2}|[-+\d.,\s%R$()]+$)/;

type WidthColumn = Pick<ColumnMetadata, "aligned" | "type" | "columnClassName"> & { textCap?: boolean };

export function isCappedTextColumn(col: WidthColumn): boolean {
  if (col.textCap === false) return false;
  if (col.type && col.type !== "text") return false;
  if (alignOf(col) !== "left") return false;
  return !WIDTH_MANAGED.test(col.columnClassName ?? "");
}

export function growCellClass(col: { columnClassName?: string }): string {
  const own = col.columnClassName ?? "";
  return [
    "w-full max-w-0 overflow-hidden",
    /(^|\s)min-w-/.test(own) ? "" : "min-w-40",
    CLAMPED.test(own) ? "" : "text-ellipsis whitespace-nowrap",
  ]
    .filter(Boolean)
    .join(" ");
}

export function growHeaderClass(col: { columnClassName?: string }): string {
  return /(^|\s)min-w-/.test(col.columnClassName ?? "") ? "w-full" : "w-full min-w-40";
}

export function isClampedTextColumn(col: { columnClassName?: string; cell?: unknown }): boolean {
  return !col.cell && CLAMPED.test(col.columnClassName ?? "");
}

type GrowColumn = WidthColumn &
  Pick<ColumnMetadata, "columnId" | "title"> & { grow?: boolean; link?: { variant?: string } };

export function pickGrowColumn(columns: readonly GrowColumn[], sampleRow: unknown): string | undefined {
  const declared = columns.find((col) => col.grow === true);
  if (declared) return declared.columnId;
  if (columns.some((col) => PERCENT_WIDTH.test(col.columnClassName ?? ""))) return undefined;
  const sample = (sampleRow ?? {}) as Record<string, unknown>;
  return columns.find((col) => {
    if (col.grow === false) return false;
    if (col.type && col.type !== "text") return false;
    if (alignOf(col) !== "left") return false;
    if (/(^|\s)font-mono/.test(col.columnClassName ?? "")) return false;
    if (col.link?.variant === "mono" || col.link?.variant === "asset") return false;
    if (NOT_A_NAME.test(col.title ?? "")) return false;
    const value = sample[col.columnId];
    return !(typeof value === "string" && NOT_A_NAME_VALUE.test(value.trim()));
  })?.columnId;
}

export function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function resolveColumnOrder(saved: readonly string[], ids: readonly string[]): string[] {
  const known = new Set(ids);
  const kept = saved.filter((id, i) => known.has(id) && saved.indexOf(id) === i);
  const seen = new Set(kept);
  return [...kept, ...ids.filter((id) => !seen.has(id))];
}

export type ColumnGroupSpan = { label: string | null; span: number };

export function columnGroupSpans(
  groups: readonly (string | null | undefined)[],
  alone: readonly number[] = [],
): ColumnGroupSpan[] | null {
  if (!groups.some((g) => g != null && g !== "")) return null;
  const spans: ColumnGroupSpan[] = [];
  groups.forEach((raw, index) => {
    const label = raw == null || raw === "" ? null : raw;
    const previous = spans[spans.length - 1];
    const sozinha = alone.includes(index) || alone.includes(index - 1);
    if (previous && previous.label === label && !sozinha) previous.span += 1;
    else spans.push({ label, span: 1 });
  });
  return spans;
}

export function columnTotal(kind: "sum" | "average", values: readonly unknown[]): number | null {
  let sum = 0;
  let count = 0;
  for (const value of values) {
    if (value == null || value === "") continue;
    const n = Number(value);
    if (!Number.isFinite(n)) continue;
    sum += n;
    count += 1;
  }
  if (count === 0) return null;
  return kind === "sum" ? sum : sum / count;
}

export type RowIndex = { text: string; digits: string[] };

export function buildRowIndex(parts: readonly string[]): RowIndex {
  const limpas = parts.filter((p) => p !== "");
  return {
    text: foldText(limpas.join("\n")),
    digits: limpas.map((p) => p.replace(/\D+/g, "")).filter((d) => d.length >= 3),
  };
}

export function searchTerms(query: string): string[] {
  return foldText(query).split(/\s+/).filter(Boolean);
}

export function matchesSearch(index: RowIndex, terms: readonly string[]): boolean {
  return terms.every((term) => {
    if (index.text.includes(term)) return true;
    const digitos = term.replace(/[.\-/,]/g, "");
    return /^\d{3,}$/.test(digitos) && index.digits.some((d) => d.includes(digitos));
  });
}

export function countLabel(n: number, label: { singular: string; plural: string }): string {
  return `${NUMERO_BR.format(n)} ${n === 1 ? label.singular : label.plural}`;
}

export function lastValidPageIndex(pageIndex: number, pageSize: number, totalRows: number): number | null {
  if (totalRows <= 0 || pageIndex <= 0) return null;
  const size = Math.max(1, pageSize);
  if (pageIndex * size < totalRows) return null;
  return Math.ceil(totalRows / size) - 1;
}

export type HeatmapDomain = { min: number; max: number };

export function heatmapDomains(
  columns: readonly { id: string; scale?: string; domain?: HeatmapDomain }[],
  valuesOf: (columnId: string) => Iterable<number | null | undefined>,
): Map<string, HeatmapDomain> {
  const acc = new Map<string, HeatmapDomain>();
  const fixed = new Set<string>();
  for (const col of columns) {
    const key = col.scale ?? col.id;
    if (col.domain) {
      acc.set(key, { ...col.domain });
      fixed.add(key);
      continue;
    }
    if (fixed.has(key)) continue;
    const cur = acc.get(key) ?? { min: Infinity, max: -Infinity };
    for (const v of valuesOf(col.id)) {
      if (v == null || !Number.isFinite(v)) continue;
      if (v < cur.min) cur.min = v;
      if (v > cur.max) cur.max = v;
    }
    acc.set(key, cur);
  }
  for (const [key, d] of acc) {
    if (!Number.isFinite(d.min) || !Number.isFinite(d.max) || d.max === d.min) acc.delete(key);
  }
  return acc;
}

export function heatmapBackground(
  hex: string,
  value: number | null | undefined,
  domain: HeatmapDomain,
  maxAlpha: number,
): string | undefined {
  if (value == null || !Number.isFinite(value)) return undefined;
  const span = domain.max - domain.min;
  if (!(span > 0)) return undefined;
  const t = Math.max(0, Math.min(1, (value - domain.min) / span));
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return undefined;
  const n = Number.parseInt(h, 16);
  const a = Math.round(t * maxAlpha * 1000) / 1000;
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export const BULK_EDIT_KEY = "e";
export const BULK_DELETE_KEY = "d";

export function normalizeShortcut(raw: string | null | undefined): string | null {
  const key = (raw ?? "").trim().toLowerCase();
  return [...key].length === 1 ? key : null;
}

export function bulkShortcutKeys(config: {
  edit: boolean;
  delete: boolean;
  custom: readonly (string | null | undefined)[];
}): { edit: string | null; delete: string | null; custom: (string | null)[] } {
  const taken = new Set<string>();
  if (config.edit) taken.add(BULK_EDIT_KEY);
  if (config.delete) taken.add(BULK_DELETE_KEY);
  const custom = config.custom.map((raw) => {
    const key = normalizeShortcut(raw);
    if (!key || taken.has(key)) return null;
    taken.add(key);
    return key;
  });
  return { edit: config.edit ? BULK_EDIT_KEY : null, delete: config.delete ? BULK_DELETE_KEY : null, custom };
}

export type TreeLevelDef = { id: string; label: string; defaultVisible?: boolean };

export type TreeLevelChoices = Readonly<Record<string, boolean>>;

function levelVisible(level: TreeLevelDef, choices: TreeLevelChoices): boolean {
  return choices[level.id] ?? level.defaultVisible !== false;
}

export function hiddenTreeLevels(
  levels: readonly TreeLevelDef[],
  present: ReadonlySet<string>,
  choices: TreeLevelChoices,
): Set<string> {
  const listed = levels.filter((level) => present.has(level.id));
  const hidden = listed.filter((level) => !levelVisible(level, choices));
  return new Set(hidden.length < listed.length ? hidden.map((level) => level.id) : []);
}

export function normalizeTreeLevelChoices(
  levels: readonly TreeLevelDef[],
  choices: TreeLevelChoices,
): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const level of levels) {
    const visible = levelVisible(level, choices);
    if (visible !== (level.defaultVisible !== false)) out[level.id] = visible;
  }
  return out;
}

export function toggleTreeLevel(
  levels: readonly TreeLevelDef[],
  present: ReadonlySet<string>,
  choices: TreeLevelChoices,
  id: string,
  visible: boolean,
): Record<string, boolean> {
  const current = normalizeTreeLevelChoices(levels, choices);
  if (!present.has(id) || !levels.some((level) => level.id === id)) return current;
  const hidden = hiddenTreeLevels(levels, present, choices);
  const shown: Record<string, boolean> = { ...current };
  let visibleCount = 0;
  for (const level of levels) {
    if (!present.has(level.id)) continue;
    shown[level.id] = level.id === id ? visible : !hidden.has(level.id);
    if (shown[level.id]) visibleCount += 1;
  }
  return visibleCount === 0 ? current : normalizeTreeLevelChoices(levels, shown);
}

export function treeWithoutLevels<T>(
  data: readonly T[],
  getSubRows: (row: T) => readonly T[] | undefined,
  isHidden: (row: T) => boolean,
): { roots: T[]; getSubRows: (row: T) => T[] } {
  const promote = (rows: readonly T[] | undefined): T[] => {
    const out: T[] = [];
    const visit = (list: readonly T[] | undefined) => {
      if (!list) return;
      for (const row of list) {
        if (isHidden(row)) visit(getSubRows(row));
        else out.push(row);
      }
    };
    visit(rows);
    return out;
  };
  return { roots: promote(data), getSubRows: (row) => promote(getSubRows(row)) };
}
