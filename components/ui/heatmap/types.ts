export type HeatmapDay = {
  date: string  // ISO "YYYY-MM-DD"
  count: number
}

export type ColorScheme = "green" | "blue" | "purple" | "orange"

export type HeatmapProps = {
  data: HeatmapDay[]
  colorScheme?: ColorScheme
  showWeekdayLabels?: boolean
  showMonthLabels?: boolean
  showLegend?: boolean
  weekStart?: 0 | 1  // 0 = Sunday, 1 = Monday
  className?: string
  onDayClick?: (date: string, count: number) => void
}

export type DayCell = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
  isToday: boolean
}

// Each week column has 7 slots; null = padding (before/after the date range)
export type WeekColumn = (DayCell | null)[]

export type MonthLabel = {
  weekIndex: number
  label: string  // "Jan", "Feb", etc.
}

// 5 color stops: [level0, level1, level2, level3, level4]
// light and dark variants
export const COLOR_SCHEMES: Record<ColorScheme, { light: string[]; dark: string[] }> = {
  green: {
    light: [
      "oklch(0.93 0 0)",
      "oklch(0.82 0.10 145)",
      "oklch(0.68 0.16 145)",
      "oklch(0.52 0.20 145)",
      "oklch(0.38 0.22 145)",
    ],
    dark: [
      "oklch(0.269 0 0)",
      "oklch(0.37 0.10 145)",
      "oklch(0.49 0.17 145)",
      "oklch(0.61 0.21 145)",
      "oklch(0.74 0.22 145)",
    ],
  },
  blue: {
    light: [
      "oklch(0.93 0 0)",
      "oklch(0.80 0.09 240)",
      "oklch(0.65 0.16 240)",
      "oklch(0.50 0.20 240)",
      "oklch(0.36 0.22 240)",
    ],
    dark: [
      "oklch(0.269 0 0)",
      "oklch(0.35 0.09 240)",
      "oklch(0.47 0.16 240)",
      "oklch(0.60 0.20 240)",
      "oklch(0.73 0.22 240)",
    ],
  },
  purple: {
    light: [
      "oklch(0.93 0 0)",
      "oklch(0.82 0.09 300)",
      "oklch(0.68 0.16 300)",
      "oklch(0.52 0.21 300)",
      "oklch(0.38 0.24 300)",
    ],
    dark: [
      "oklch(0.269 0 0)",
      "oklch(0.36 0.09 300)",
      "oklch(0.48 0.16 300)",
      "oklch(0.61 0.21 300)",
      "oklch(0.74 0.24 300)",
    ],
  },
  orange: {
    light: [
      "oklch(0.93 0 0)",
      "oklch(0.88 0.10 60)",
      "oklch(0.76 0.17 50)",
      "oklch(0.62 0.20 42)",
      "oklch(0.48 0.22 38)",
    ],
    dark: [
      "oklch(0.269 0 0)",
      "oklch(0.38 0.10 60)",
      "oklch(0.50 0.17 50)",
      "oklch(0.63 0.20 42)",
      "oklch(0.76 0.22 38)",
    ],
  },
}

// ─── StatusHeatmap types ───────────────────────────────────────────────────────

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

export function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0
  if (count <= 3) return 1
  if (count <= 7) return 2
  if (count <= 11) return 3
  return 4
}
