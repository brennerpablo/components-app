import { format as formatDate } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";

import type { GanttScale } from "./types";

/**
 * Localization for the Gantt chrome and its time axis. Pass `language` to
 * `<Gantt>`; defaults to English. Extend `GanttStrings` + both tables to add a
 * locale.
 */
export type GanttLanguage = "en" | "pt";

export type GanttStrings = {
  today: string;
  previousPeriod: string;
  nextPeriod: string;
  empty: string;
  collapse: string;
  expand: string;
  zoomIn: string;
  zoomOut: string;
  untitled: string;
  complete: (percent: number) => string;
  scales: Record<GanttScale, string>;
  /** `date-fns` patterns for the bar's default hover card. */
  tooltipDate: string;
  tooltipDateTime: string;
};

export const GANTT_STRINGS: Record<GanttLanguage, GanttStrings> = {
  en: {
    today: "Today",
    previousPeriod: "Previous period",
    nextPeriod: "Next period",
    empty: "No rows to show",
    collapse: "Collapse",
    expand: "Expand",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    untitled: "Untitled",
    complete: (percent) => `${percent}% complete`,
    scales: { day: "Day", week: "Week", month: "Month", quarter: "Quarter", year: "Year" },
    tooltipDate: "MMM d, yyyy",
    tooltipDateTime: "MMM d, h:mm a",
  },
  pt: {
    today: "Hoje",
    previousPeriod: "Período anterior",
    nextPeriod: "Próximo período",
    empty: "Nada para mostrar",
    collapse: "Recolher",
    expand: "Expandir",
    zoomIn: "Aproximar",
    zoomOut: "Afastar",
    untitled: "Sem título",
    complete: (percent) => `${percent}% concluído`,
    scales: { day: "Dia", week: "Semana", month: "Mês", quarter: "Trimestre", year: "Ano" },
    tooltipDate: "dd/MM/yyyy",
    tooltipDateTime: "dd/MM, HH:mm",
  },
};

const DATE_LOCALES = { en: enUS, pt: ptBR } as const;

/** `format` bound to a language, so month and weekday names follow it. */
export function formatFor(language: GanttLanguage) {
  return (date: Date, pattern: string) =>
    formatDate(date, pattern, { locale: DATE_LOCALES[language] });
}
