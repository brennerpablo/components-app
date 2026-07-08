import type { GridConditionOp } from "./types";

/**
 * Localization for the DataGrid chrome (toolbar, filter menus, status bar,
 * empty state, clipboard toasts). Pass `language` to `<DataGrid>`; the resolved
 * strings + locale ride the grid context so every subcomponent reads them.
 * Defaults to English. Extend `GridStrings` + both tables to add a locale.
 */

export type GridLanguage = "en" | "pt";

/** Intl locale used for every number the grid formats. */
export const localeFor = (lang: GridLanguage): string =>
  lang === "pt" ? "pt-BR" : "en-US";

export type GridStrings = {
  // toolbar
  filterCount: (n: number) => string;
  clear: string;
  savedViews: string;
  noSavedViews: string;
  saveCurrentFilters: string;
  save: string;
  savedViewToast: (name: string) => string;
  deleteView: (name: string) => string;
  viewTooLarge: string;
  columns: string;
  searchColumn: string;
  restoreDefault: string;
  reorderColumn: (title: string) => string;
  clearSearchToReorder: string;
  allRows: string;
  sortedBy: (title: string, desc: boolean) => string;
  exportLabel: string;
  exportCsv: string;
  exportXlsx: string;
  exporting: (pct: number) => string;
  nothingToExport: string;
  exportedPartial: (n: string, total: string) => string;
  exportedAll: (n: string) => string;
  exportFailed: string;
  fullscreen: string;
  exitFullscreen: string;
  // filter popover
  filterColumn: (title: string) => string;
  sortAsc: string;
  sortDesc: string;
  condition: string;
  value: string;
  from: string;
  to: string;
  minChars: string;
  searchValues: string;
  selectAll: string;
  showingCap: (cap: number) => string;
  apply: string;
  opLabels: Record<GridConditionOp, string>;
  // status bar
  rows: (n: string) => string;
  showingFirst: (n: string) => string;
  total: string;
  avg: string;
  cells: (n: string) => string;
  partial: string;
  sum: string;
  mean: string;
  min: string;
  max: string;
  // empty state
  emptyTitle: string;
  emptyHint: string;
  // clipboard (data-grid)
  selectAllCorner: string;
  nothingCopied: string;
  copiedPartial: (
    copied: string,
    total: string,
    skipped: boolean,
    truncated: boolean,
  ) => string;
  cellsCopied: (n: string) => string;
};

const EN: GridStrings = {
  filterCount: (n) => `${n} ${n === 1 ? "filter" : "filters"}`,
  clear: "Clear",
  savedViews: "Saved views",
  noSavedViews: "No saved views",
  saveCurrentFilters: "Save current filters",
  save: "Save",
  savedViewToast: (name) => `View "${name}" saved`,
  deleteView: (name) => `Delete view ${name}`,
  viewTooLarge:
    "Filter too large to save — reduce the filters or delete old saved views",
  columns: "Columns",
  searchColumn: "Search column…",
  restoreDefault: "Restore default",
  reorderColumn: (title) => `Reorder column ${title}`,
  clearSearchToReorder: "Clear the search to reorder",
  allRows: "All rows",
  sortedBy: (title, desc) => `Sorted by ${title} ${desc ? "↓" : "↑"}`,
  exportLabel: "Export",
  exportCsv: "CSV (.csv)",
  exportXlsx: "Excel (.xlsx)",
  exporting: (pct) => `Exporting… ${pct}%`,
  nothingToExport: "Nothing to export with the current filters",
  exportedPartial: (n, total) =>
    `Exported the first ${n} of ${total} rows — refine with filters`,
  exportedAll: (n) => `${n} rows exported`,
  exportFailed: "Export failed",
  fullscreen: "Fullscreen",
  exitFullscreen: "Exit fullscreen",
  filterColumn: (title) => `Filter ${title}`,
  sortAsc: "Sort ascending",
  sortDesc: "Sort descending",
  condition: "Condition",
  value: "Value",
  from: "From",
  to: "To",
  minChars: "Enter at least 3 characters.",
  searchValues: "Search values…",
  selectAll: "(Select all)",
  showingCap: (cap) => `Showing ${cap} — type to refine.`,
  apply: "Apply",
  opLabels: {
    contains: "contains",
    eq: "equals",
    gte: "greater or equal",
    lte: "less or equal",
    between: "between",
  },
  rows: (n) => `${n} rows`,
  showingFirst: (n) => ` · showing the first ${n} — refine with filters`,
  total: "total",
  avg: "avg",
  cells: (n) => `${n} cells`,
  partial: "partial:",
  sum: "sum",
  mean: "avg",
  min: "min",
  max: "max",
  emptyTitle: "No rows found",
  emptyHint: "Adjust or clear filters to see results.",
  selectAllCorner: "Select all",
  nothingCopied: "Nothing copied — the selected rows haven't loaded yet.",
  copiedPartial: (copied, total, skipped, truncated) =>
    `Copied ${copied} of ${total} selected rows` +
    (skipped ? " — unloaded rows were skipped" : "") +
    (truncated ? " — per-copy cell limit reached" : ""),
  cellsCopied: (n) => `${n} cells copied`,
};

const PT: GridStrings = {
  filterCount: (n) => `${n} ${n === 1 ? "filtro" : "filtros"}`,
  clear: "Limpar",
  savedViews: "Filtros salvos",
  noSavedViews: "Nenhum filtro salvo",
  saveCurrentFilters: "Salvar filtros atuais",
  save: "Salvar",
  savedViewToast: (name) => `Filtro "${name}" salvo`,
  deleteView: (name) => `Apagar filtro ${name}`,
  viewTooLarge:
    "Filtro muito grande para salvar — reduza os filtros ou apague filtros salvos antigos",
  columns: "Colunas",
  searchColumn: "Buscar coluna…",
  restoreDefault: "Restaurar padrão",
  reorderColumn: (title) => `Reordenar coluna ${title}`,
  clearSearchToReorder: "Limpe a busca para reordenar",
  allRows: "Todas as linhas",
  sortedBy: (title, desc) => `Ordenado por ${title} ${desc ? "↓" : "↑"}`,
  exportLabel: "Exportar",
  exportCsv: "CSV (.csv)",
  exportXlsx: "Excel (.xlsx)",
  exporting: (pct) => `Exportando… ${pct}%`,
  nothingToExport: "Nada para exportar com os filtros atuais",
  exportedPartial: (n, total) =>
    `Exportadas as primeiras ${n} de ${total} linhas — refine com filtros`,
  exportedAll: (n) => `${n} linhas exportadas`,
  exportFailed: "Falha ao exportar",
  fullscreen: "Tela cheia",
  exitFullscreen: "Sair da tela cheia",
  filterColumn: (title) => `Filtrar ${title}`,
  sortAsc: "Ordenar crescente",
  sortDesc: "Ordenar decrescente",
  condition: "Condição",
  value: "Valor",
  from: "De",
  to: "Até",
  minChars: "Digite ao menos 3 caracteres.",
  searchValues: "Buscar valores…",
  selectAll: "(Selecionar tudo)",
  showingCap: (cap) => `Mostrando ${cap} — digite para refinar.`,
  apply: "Aplicar",
  opLabels: {
    contains: "contém",
    eq: "igual a",
    gte: "maior ou igual",
    lte: "menor ou igual",
    between: "entre",
  },
  rows: (n) => `${n} linhas`,
  showingFirst: (n) => ` · mostrando as primeiras ${n} — refine com filtros`,
  total: "total",
  avg: "médio",
  cells: (n) => `${n} células`,
  partial: "parcial:",
  sum: "soma",
  mean: "média",
  min: "mín",
  max: "máx",
  emptyTitle: "Nenhuma linha encontrada",
  emptyHint: "Ajuste ou limpe os filtros para ver resultados.",
  selectAllCorner: "Selecionar tudo",
  nothingCopied: "Nada copiado — as linhas selecionadas ainda não carregaram.",
  copiedPartial: (copied, total, skipped, truncated) =>
    `Copiadas ${copied} de ${total} linhas selecionadas` +
    (skipped ? " — linhas não carregadas foram ignoradas" : "") +
    (truncated ? " — limite de células por cópia atingido" : ""),
  cellsCopied: (n) => `${n} células copiadas`,
};

export function resolveGridStrings(lang: GridLanguage): GridStrings {
  return lang === "pt" ? PT : EN;
}
