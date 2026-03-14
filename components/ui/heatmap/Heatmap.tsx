"use client"

import { useState, useEffect, useCallback } from "react"
import {
  addDays,
  format,
  isToday,
  startOfWeek,
  subDays,
} from "date-fns"
import { cn } from "@/lib/utils"
import {
  COLOR_SCHEMES,
  getLevel,
  type HeatmapDay,
  type HeatmapProps,
  type DayCell,
  type MonthLabel,
  type WeekColumn,
} from "./types"

// ─── dark-mode hook ────────────────────────────────────────────────────────────

function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    setIsDark(root.classList.contains("dark"))

    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"))
    })
    observer.observe(root, { attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return isDark
}

// ─── grid builder ──────────────────────────────────────────────────────────────

function buildGrid(
  data: HeatmapDay[],
  weekStart: 0 | 1
): { weeks: WeekColumn[]; monthLabels: MonthLabel[] } {
  const today = new Date()
  const endDate = today
  const rawStart = subDays(today, 363)
  const startDate = startOfWeek(rawStart, { weekStartsOn: weekStart })

  const countMap = new Map<string, number>()
  for (const { date, count } of data) {
    countMap.set(date, (countMap.get(date) ?? 0) + count)
  }

  const weeks: WeekColumn[] = []
  const monthLabels: MonthLabel[] = []
  const seenMonths = new Set<string>()

  let cursor = startDate
  let weekIndex = 0
  let week: WeekColumn = Array(7).fill(null)

  while (cursor <= endDate) {
    const dayOfWeek = (cursor.getDay() - weekStart + 7) % 7
    const dateStr = format(cursor, "yyyy-MM-dd")
    const count = countMap.get(dateStr) ?? 0
    const inWindow = cursor >= rawStart && cursor <= endDate

    if (inWindow) {
      week[dayOfWeek] = {
        date: dateStr,
        count,
        level: getLevel(count),
        isToday: isToday(cursor),
      }
    }

    const monthKey = format(cursor, "yyyy-MM")
    if (cursor.getDate() === 1 && !seenMonths.has(monthKey) && inWindow) {
      seenMonths.add(monthKey)
      monthLabels.push({ weekIndex, label: format(cursor, "MMM") })
    }

    if (dayOfWeek === 6) {
      weeks.push(week)
      week = Array(7).fill(null)
      weekIndex++
    }

    cursor = addDays(cursor, 1)
  }

  if (week.some((d) => d !== null)) {
    weeks.push(week)
  }

  return { weeks, monthLabels }
}

// ─── tooltip state ─────────────────────────────────────────────────────────────

type TooltipState = {
  visible: boolean
  x: number
  y: number
  date: string
  count: number
}

// ─── main component ────────────────────────────────────────────────────────────

export function ContributionHeatmap({
  data,
  colorScheme = "green",
  showWeekdayLabels = true,
  showMonthLabels = true,
  showLegend = true,
  weekStart = 0,
  className,
  onDayClick,
}: HeatmapProps) {
  const isDark = useDarkMode()
  const palette = COLOR_SCHEMES[colorScheme][isDark ? "dark" : "light"]

  const { weeks, monthLabels } = buildGrid(data, weekStart)

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    date: "",
    count: 0,
  })

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, cell: DayCell) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = Math.min(rect.left + rect.width / 2, window.innerWidth - 160)
      const y = rect.top - 40
      setTooltip({ visible: true, x, y, date: cell.date, count: cell.count })
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    setTooltip((t) => ({ ...t, visible: false }))
  }, [])

  const CELL = 12
  const GAP = 3

  const weekdayNames = weekStart === 0
    ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div className={cn("inline-block", className)}>
      <div className="flex gap-2">
        {/* Weekday labels */}
        {showWeekdayLabels && (
          <div
            className="flex flex-col text-[10px] text-muted-foreground select-none"
            style={{
              gap: GAP,
              paddingTop: showMonthLabels ? 20 : 0,
              width: 24,
            }}
          >
            {weekdayNames.map((name, i) => (
              <div
                key={name}
                style={{ height: CELL, lineHeight: `${CELL}px` }}
                className={cn(
                  "text-right pr-1",
                  i % 2 === 0 ? "opacity-0" : "opacity-100"
                )}
              >
                {name}
              </div>
            ))}
          </div>
        )}

        {/* Grid + month labels */}
        <div className="overflow-x-auto">
          <div style={{ minWidth: weeks.length * (CELL + GAP) - GAP }}>
            {/* Month labels */}
            {showMonthLabels && (
              <div
                className="relative text-[10px] text-muted-foreground select-none"
                style={{ height: 20 }}
              >
                {monthLabels.map(({ weekIndex, label }) => (
                  <span
                    key={`${weekIndex}-${label}`}
                    className="absolute"
                    style={{ left: weekIndex * (CELL + GAP) }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

            {/* Cell grid — columns = weeks, rows = days */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${weeks.length}, ${CELL}px)`,
                gridTemplateRows: `repeat(7, ${CELL}px)`,
                gridAutoFlow: "column",
                gap: GAP,
              }}
            >
              {weeks.map((week, wi) =>
                week.map((cell, di) => {
                  if (!cell) {
                    return (
                      <div
                        key={`${wi}-${di}`}
                        style={{ width: CELL, height: CELL }}
                      />
                    )
                  }
                  return (
                    <div
                      key={cell.date}
                      style={{
                        width: CELL,
                        height: CELL,
                        backgroundColor: palette[cell.level],
                        borderRadius: 2,
                        cursor: onDayClick ? "pointer" : "default",
                        outline: cell.isToday
                          ? "1.5px solid oklch(0.556 0 0)"
                          : undefined,
                        outlineOffset: cell.isToday ? 1 : undefined,
                      }}
                      onMouseEnter={(e) => handleMouseEnter(e, cell)}
                      onMouseLeave={handleMouseLeave}
                      onClick={
                        onDayClick
                          ? () => onDayClick(cell.date, cell.count)
                          : undefined
                      }
                    />
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex items-center justify-end gap-1.5 mt-2">
          <span className="text-[10px] text-muted-foreground select-none">Less</span>
          {palette.map((color, i) => (
            <div
              key={i}
              style={{
                width: CELL,
                height: CELL,
                backgroundColor: color,
                borderRadius: 2,
              }}
            />
          ))}
          <span className="text-[10px] text-muted-foreground select-none">More</span>
        </div>
      )}

      {/* Shared hover tooltip */}
      {tooltip.visible && (
        <div
          className="pointer-events-none fixed z-50 rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translateX(-50%)" }}
        >
          <span className="font-medium">
            {tooltip.count === 0 ? "No activity" : `${tooltip.count} contribution${tooltip.count !== 1 ? "s" : ""}`}
          </span>
          {" on "}
          {format(new Date(tooltip.date + "T00:00:00"), "MMM d, yyyy")}
        </div>
      )}
    </div>
  )
}
