export type DataTableLanguage = "en" | "pt"

export type DataTableLocale = {
  // Table body
  noResults: string

  // Number filter conditions
  conditionIsEqualTo: string
  conditionIsBetween: string
  conditionIsGreaterThan: string
  conditionIsLessThan: string

  // Filter UI
  filterLabelAnd: string
  selectPlaceholder: string
  selectConditionPlaceholder: string
  numberInputPlaceholder: string
  rangeAnd: string
  filterBy: (title: string) => string
  apply: string
  reset: string

  // Filterbar toolbar
  searchBy: (title: string) => string
  clearFilters: string
  export: string

  // Pagination
  firstPage: string
  previousPage: string
  nextPage: string
  lastPage: string
  rowsSelected: string
  showing: string
  of: string

  // Row / bulk actions
  add: string
  edit: string
  delete: string
  selected: string

  // View options
  view: string
  displayProperties: string
  reorderColumn: (label: string) => string
  movedColumn: (args: {
    label: string
    previousIndex: number
    currentIndex: number
    numberOfItems: number
  }) => string
}

const en: DataTableLocale = {
  noResults: "No results.",

  conditionIsEqualTo: "is equal to",
  conditionIsBetween: "is between",
  conditionIsGreaterThan: "is greater than",
  conditionIsLessThan: "is less than",

  filterLabelAnd: "and",
  selectPlaceholder: "Select",
  selectConditionPlaceholder: "Select condition",
  numberInputPlaceholder: "$0",
  rangeAnd: "and",
  filterBy: (title) => `Filter by ${title}`,
  apply: "Apply",
  reset: "Reset",

  searchBy: (title) => `Search by ${title.toLowerCase()}...`,
  clearFilters: "Clear filters",
  export: "Export",

  firstPage: "First page",
  previousPage: "Previous page",
  nextPage: "Next page",
  lastPage: "Last page",
  rowsSelected: "row(s) selected.",
  showing: "Showing",
  of: "of",

  add: "Add",
  edit: "Edit",
  delete: "Delete",
  selected: "selected",

  view: "View",
  displayProperties: "Display properties",
  reorderColumn: (label) => `Reorder ${label}`,
  movedColumn: ({ label, previousIndex, currentIndex, numberOfItems }) =>
    `You've moved ${label} from position ${previousIndex + 1} to position ${currentIndex + 1} of ${numberOfItems}.`,
}

const pt: DataTableLocale = {
  noResults: "Sem resultados.",

  conditionIsEqualTo: "é igual a",
  conditionIsBetween: "está entre",
  conditionIsGreaterThan: "é maior que",
  conditionIsLessThan: "é menor que",

  filterLabelAnd: "e",
  selectPlaceholder: "Selecionar",
  selectConditionPlaceholder: "Selecionar condição",
  numberInputPlaceholder: "$0",
  rangeAnd: "e",
  filterBy: (title) => `Filtrar por ${title}`,
  apply: "Aplicar",
  reset: "Redefinir",

  searchBy: (title) => `Buscar por ${title.toLowerCase()}...`,
  clearFilters: "Limpar filtros",
  export: "Exportar",

  firstPage: "Primeira página",
  previousPage: "Página anterior",
  nextPage: "Próxima página",
  lastPage: "Última página",
  rowsSelected: "linha(s) selecionada(s).",
  showing: "Exibindo",
  of: "de",

  add: "Adicionar",
  edit: "Editar",
  delete: "Excluir",
  selected: "selecionado(s)",

  view: "Visualizar",
  displayProperties: "Propriedades de exibição",
  reorderColumn: (label) => `Reordenar ${label}`,
  movedColumn: ({ label, previousIndex, currentIndex, numberOfItems }) =>
    `Você moveu ${label} da posição ${previousIndex + 1} para a posição ${currentIndex + 1} de ${numberOfItems}.`,
}

export const dataTableLocales: Record<DataTableLanguage, DataTableLocale> = {
  en,
  pt,
}

export function getLocale(language: DataTableLanguage): DataTableLocale {
  return dataTableLocales[language]
}
