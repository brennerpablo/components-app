import { ReactNode } from "react"

export type OptionItem = {
  value: string
  label: string
}

export type FilterConfig = {
  text?: boolean      // debounced text search input
  select?: boolean    // single-value dropdown filter
  checkbox?: boolean  // multi-value checkbox filter (arrIncludesSome)
  number?: boolean    // condition + value filter (only for type "number")
}

export type ColumnType = "text" | "number"

type ColumnTypeMap = { text: string; number: number }

export type InferRowType<T extends readonly ColumnMetadata[]> = {
  [K in T[number] as K["columnId"]]: K["type"] extends keyof ColumnTypeMap
    ? ColumnTypeMap[K["type"]]
    : unknown
}

export type ColumnMetadata<TData = Record<string, unknown>> = {
  columnId: keyof TData & string
  title: string
  subtitle?: string
  type: ColumnType
  sortable?: boolean
  hideable?: boolean
  options?: OptionItem[]
  filters?: FilterConfig
  aligned?: "left" | "center" | "right"
  formatter?: (value: unknown) => ReactNode
  filterValueFormatter?: (value: number) => string
}
