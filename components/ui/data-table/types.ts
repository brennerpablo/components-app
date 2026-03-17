import { CellContext, HeaderContext } from "@tanstack/react-table"
import { ReactNode } from "react"

export function resolveAccentColor(accentColor?: string): string {
  if (!accentColor) return "var(--color-zinc-800)";
  if (
    accentColor.startsWith("#") ||
    accentColor.startsWith("rgb") ||
    accentColor.startsWith("hsl")
  ) {
    return accentColor;
  }
  return `var(--color-${accentColor})`;
}

export type OptionItem = {
  value: string
  label: string
}

export type FilterConfig = {
  text?: boolean                                     // debounced text search input
  textColumns?: string[]                             // additional column IDs searched alongside the primary text column
  select?: boolean                                   // single-value dropdown filter
  checkbox?: boolean                                 // multi-value checkbox filter (arrIncludesSome)
  checkboxSearch?: boolean | { multiple?: boolean }  // checkbox list with search; multiple defaults to true
  number?: boolean                                   // condition + value filter (only for type "number")
  percentage?: boolean                               // min/max range slider filter (0–100)
  date?: boolean                                     // date range calendar filter (start/end dates)
}

export type ColumnType = "text" | "number" | "date"

type ColumnTypeMap = { text: string; number: number; date: Date }

export type InferRowType<T extends readonly ColumnMetadata[]> = {
  [K in T[number] as K["columnId"]]: K["type"] extends keyof ColumnTypeMap
    ? ColumnTypeMap[K["type"]]
    : unknown
}

export type ColumnMetadata<TData = Record<string, unknown>> = {
  columnId: keyof TData & string
  title: string
  subtitle?: string
  description?: string
  type: ColumnType
  sortable?: boolean
  hideable?: boolean
  options?: OptionItem[]
  inferOptions?: boolean
  filters?: FilterConfig
  aligned?: "left" | "center" | "right"
  formatter?: (value: unknown) => ReactNode
  filterValueFormatter?: (value: number) => string
  cell?: (props: CellContext<TData, unknown>) => ReactNode
  header?: (props: HeaderContext<TData, unknown>) => ReactNode
}
