"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import {
  CHART_COLORS,
  type ChartColor,
  constructCategoryColors,
  getColorClass,
  isHexColor,
} from "../utils/chartColors"

export interface CompositionBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  data: Record<string, any>[]
  category: string
  value: string
  colors?: (ChartColor | string)[]
  valueFormatter?: (value: number) => string
  percentFormatter?: (percent: number) => string
  sortOrder?: "ascending" | "descending" | "none"
  barHeight?: number
  /** Floor (in percent) applied to rendered segment widths so tiny slices stay visible. */
  minSegmentPercent?: number
  showLegend?: boolean
  /** Optional override label rendered when `data` is empty or all values are zero. */
  emptyLabel?: string
}

interface Row {
  key: string
  value: number
  percent: number
  renderedWidth: number
  color: ChartColor | string
  hex: boolean
}

const defaultPercentFormatter = (p: number): string => `${p.toFixed(1)}%`
const defaultValueFormatter = (v: number): string => v.toString()

function buildRows(
  data: Record<string, any>[],
  category: string,
  value: string,
  colors: (ChartColor | string)[],
  sortOrder: "ascending" | "descending" | "none",
  minSegmentPercent: number,
): { rows: Row[]; total: number } {
  const items = data
    .map((d) => ({
      key: String(d[category] ?? ""),
      value: Number(d[value] ?? 0),
    }))
    .filter((d) => Number.isFinite(d.value))

  const ordered =
    sortOrder === "none"
      ? items
      : [...items].sort((a, b) =>
          sortOrder === "ascending" ? a.value - b.value : b.value - a.value,
        )

  const total = ordered.reduce((s, r) => s + r.value, 0)
  if (total <= 0) return { rows: [], total: 0 }

  const categoryColors = constructCategoryColors(
    ordered.map((r) => r.key),
    colors,
  )

  // Compute true percentages, then inflate any below `minSegmentPercent`
  // and reclaim the excess from the largest segment so widths still sum to 100.
  const truePercents = ordered.map((r) => (r.value / total) * 100)
  const renderedRaw = truePercents.map((p) =>
    p > 0 && p < minSegmentPercent ? minSegmentPercent : p,
  )
  const inflation = renderedRaw.reduce((s, w) => s + w, 0) - 100
  if (inflation > 0) {
    let largestIdx = 0
    for (let i = 1; i < renderedRaw.length; i++) {
      if (renderedRaw[i] > renderedRaw[largestIdx]) largestIdx = i
    }
    renderedRaw[largestIdx] = Math.max(0, renderedRaw[largestIdx] - inflation)
  }

  const rows: Row[] = ordered.map((r, i) => {
    const color = categoryColors.get(r.key) ?? CHART_COLORS[0]
    return {
      key: r.key,
      value: r.value,
      percent: truePercents[i],
      renderedWidth: renderedRaw[i],
      color,
      hex: isHexColor(String(color)),
    }
  })

  return { rows, total }
}

const CompositionBar = React.forwardRef<HTMLDivElement, CompositionBarProps>(
  (props, ref) => {
    const {
      data,
      category,
      value,
      colors = [...CHART_COLORS],
      valueFormatter = defaultValueFormatter,
      percentFormatter = defaultPercentFormatter,
      sortOrder = "none",
      barHeight = 12,
      minSegmentPercent = 0.5,
      showLegend = true,
      emptyLabel,
      className,
      ...rest
    } = props

    const { rows, total } = React.useMemo(
      () =>
        buildRows(data, category, value, colors, sortOrder, minSegmentPercent),
      [data, category, value, colors, sortOrder, minSegmentPercent],
    )

    if (total === 0) {
      return (
        <div ref={ref} className={cn("w-full", className)} {...rest}>
          <div
            className="w-full rounded-md bg-gray-100 dark:bg-gray-800"
            style={{ height: barHeight }}
          />
          {emptyLabel && (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              {emptyLabel}
            </p>
          )}
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("w-full", className)} {...rest}>
        <div
          className="flex w-full overflow-hidden rounded-md"
          style={{ height: barHeight }}
          role="img"
          aria-label={rows
            .map((r) => `${r.key}: ${percentFormatter(r.percent)}`)
            .join(", ")}
        >
          {rows.map((r) => (
            <div
              key={r.key}
              className={cn(!r.hex && getColorClass(r.color as ChartColor, "bg"))}
              style={{
                width: `${r.renderedWidth}%`,
                backgroundColor: r.hex ? (r.color as string) : undefined,
              }}
              title={`${r.key}: ${percentFormatter(r.percent)}`}
            />
          ))}
        </div>

        {showLegend && (
          <ul className="mt-4 space-y-2">
            {rows.map((r) => (
              <li
                key={r.key}
                className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3"
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-3 shrink-0 rounded-sm",
                    !r.hex && getColorClass(r.color as ChartColor, "bg"),
                  )}
                  style={
                    r.hex ? { backgroundColor: r.color as string } : undefined
                  }
                />
                <span
                  className="truncate text-sm text-gray-700 dark:text-gray-200"
                  title={r.key}
                >
                  {r.key}
                </span>
                <span className="whitespace-nowrap text-sm tabular-nums text-gray-500 dark:text-gray-400">
                  {valueFormatter(r.value)}
                </span>
                <span className="w-14 whitespace-nowrap text-right text-sm tabular-nums text-gray-500 dark:text-gray-400">
                  {percentFormatter(r.percent)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  },
)

CompositionBar.displayName = "CompositionBar"

export { CompositionBar }
