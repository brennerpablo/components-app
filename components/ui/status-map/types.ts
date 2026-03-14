import type React from "react"

export type StatusMapEntry = {
  row: string     // row label (e.g. machine name)
  date: string    // ISO "YYYY-MM-DD"
  status: string
}

export type StatusItemConfig = {
  color: string        // Tailwind class, e.g. "bg-emerald-500"
  label: string        // Human-readable label
  enableAction?: boolean  // If true, clicking this status cell triggers onAction
}

export type StatusMapProps = {
  data: StatusMapEntry[]
  labelConfig: Record<string, StatusItemConfig>
  style?: "rounded" | "squared" | "tight"
  bordered?: boolean
  label?: boolean
  labelAlign?: "left" | "center" | "right"
  labelTop?: boolean
  className?: string
  onCellClick?: (row: string, date: string, status: string) => void
  onAction?: (row: string, date: string, status: string) => void
  tooltip?: boolean
  tooltipContent?: (row: string, date: string, status: string, label: string) => React.ReactNode
}
