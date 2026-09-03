"use client"

import { format } from "date-fns"
import { Tooltip } from "radix-ui"
import { useLayoutEffect, useMemo, useRef } from "react"

import { cn } from "@/lib/utils"

import type { StatusMapProps } from "./types"

const LABEL_ALIGN = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
}

export function StatusMap({
  data,
  labelConfig,
  style = "rounded",
  bordered = true,
  label = true,
  labelAlign = "left",
  labelTop = true,
  className,
  onCellClick,
  onAction,
  tooltip = false,
  initialScroll = "start",
  tooltipContent,
}: StatusMapProps) {
  const { rows, dates, index, counts } = useMemo(() => {
    const rowsSet = new Set<string>()
    const datesSet = new Set<string>()
    const idx = new Map<string, string>()
    const cnt: Record<string, number> = {}

    for (const entry of data) {
      rowsSet.add(entry.row)
      datesSet.add(entry.date)
      idx.set(`${entry.row}|${entry.date}`, entry.status)
      cnt[entry.status] = (cnt[entry.status] ?? 0) + 1
    }

    return {
      rows: Array.from(rowsSet),
      dates: Array.from(datesSet).sort(),
      index: idx,
      counts: cnt,
    }
  }, [data])

  const tight = style === "tight"
  const rounded = style === "rounded"
  const statuses = Object.keys(labelConfig)
  const fallbackStatus = statuses[statuses.length - 1]

  const scrollRef = useRef<HTMLDivElement>(null)

  // In a window of days the interesting end is the LAST one, and that is
  // exactly what falls out of view when the axis overflows. Layout effect and
  // not effect: after paint the user would see the map jump.
  useLayoutEffect(() => {
    if (initialScroll !== "end") return
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [initialScroll, dates])

  const legend = label && (
    <div className={cn("flex flex-wrap items-center gap-x-6 gap-y-2", LABEL_ALIGN[labelAlign])}>
      {statuses.map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className={cn("h-3 w-3 rounded-sm", labelConfig[s].color)} />
          <span className="text-sm text-muted-foreground">
            {labelConfig[s].label}
            {counts[s] != null && (
              <span className="ml-1 font-medium text-foreground">({counts[s]})</span>
            )}
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <Tooltip.Provider delayDuration={300}>
    <div className={cn("space-y-4", className)}>
      {labelTop && legend}

      {/* Grid */}
      <div
        ref={scrollRef}
        className={cn("grid-scrollbar overflow-x-auto", bordered && "rounded-md border border-border")}
      >
        <table className="border-separate border-spacing-0 w-full">
          <thead>
            <tr className={cn("border-b border-border", bordered && "bg-muted/50")}>
              <th
                className={cn(
                  "sticky left-0 z-20 w-16 pt-3 pb-2 pl-6",
                  bordered ? "status-map-frozen-head" : "status-map-frozen-label",
                )}
              />
              {dates.map((date, di) => (
                <th
                  key={date}
                  className={cn(
                    "pt-3 pb-2 text-sm font-medium text-muted-foreground text-center whitespace-nowrap",
                    tight ? "min-w-5" : "min-w-7",
                    !tight && di === dates.length - 1 && "pr-6"
                  )}
                >
                  {format(new Date(date + "T00:00:00"), "d")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={row}
                className={cn(
                  !tight && "border-b border-border",
                  !tight && ri === rows.length - 1 && "border-b-0"
                )}
              >
                <td
                  className={cn(
                    "status-map-frozen-label sticky left-0 z-10 pl-6 pr-4 text-sm font-medium text-muted-foreground whitespace-nowrap",
                    tight ? "py-0" : "py-2",
                    !tight && ri === rows.length - 1 && "pb-3"
                  )}
                >
                  {row}
                </td>
                {dates.map((date, di) => {
                  const status = index.get(`${row}|${date}`) ?? fallbackStatus
                  const config = labelConfig[status] ?? labelConfig[statuses[0]]
                  const isActionable = onAction && config.enableAction
                  const cell = (
                    <div
                      title={tooltip ? undefined : `${row} · ${date} · ${config.label}`}
                      className={cn(
                        "transition-opacity hover:opacity-75",
                        tight ? "w-full h-5 block" : rounded ? "h-5 w-5 rounded-sm mx-auto" : "h-5 w-5 mx-auto",
                        config.color,
                        (onCellClick || isActionable) ? "cursor-pointer" : "cursor-default"
                      )}
                      onClick={() => {
                        onCellClick?.(row, date, status)
                        if (isActionable) onAction(row, date, status)
                      }}
                    />
                  )
                  return (
                    <td
                      key={date}
                      className={cn(
                        tight ? "p-0" : "px-1 py-1.5 text-center",
                        !tight && di === dates.length - 1 && "pr-6",
                        !tight && ri === rows.length - 1 && "pb-3"
                      )}
                    >
                      {tooltip ? (
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>{cell}</Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              side="top"
                              sideOffset={6}
                              className="z-50 rounded-md bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md"
                            >
                              {tooltipContent
                                ? tooltipContent(row, date, status, config.label)
                                : `${row} · ${date} · ${config.label}`}
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      ) : cell}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!labelTop && legend}
    </div>
    </Tooltip.Provider>
  )
}
