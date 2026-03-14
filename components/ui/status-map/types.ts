export type StatusMapEntry = {
  row: string     // row label (e.g. machine name)
  date: string    // ISO "YYYY-MM-DD"
  status: string
}

export type StatusItemConfig = {
  color: string   // Tailwind class, e.g. "bg-emerald-500"
  label: string   // Human-readable label
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
}
