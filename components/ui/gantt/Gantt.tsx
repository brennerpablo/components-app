"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { BAR_HEIGHT, GanttBar } from "./GanttBar";
import type { Timeline } from "./timeline";
import { buildTimeline, defaultNonWorking, pageDate, SCALE_LABELS } from "./timeline";
import type {
  GanttBar as GanttBarType,
  GanttProps,
  GanttRow,
  GanttScale,
  GanttSpan,
} from "./types";

const TIER_HEIGHT = 28;
const DEFAULT_ROW_HEIGHT = 36;
const DEFAULT_LANE_HEIGHT = 24;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.25;
const ALL_SCALES: GanttScale[] = ["day", "week", "month", "quarter", "year"];

interface FlatRow<T> {
  row: GanttRow<T>;
  depth: number;
  isGroup: boolean;
  expanded: boolean;
  span?: GanttSpan;
  /** Lane index per bar, parallel to `row.bars`. */
  lanes: number[];
  /** Start of the next bar sharing this bar's lane — bounds its outside label. */
  nextInLane: (number | null)[];
  height: number;
}

/** Greedy interval packing — the fewest lanes that keep bars from overlapping. */
function packLanes(bars: GanttBarType[]): {
  lanes: number[];
  nextInLane: (number | null)[];
  count: number;
} {
  const laneEnds: number[] = [];
  const lanes = new Array<number>(bars.length).fill(0);
  const nextInLane = new Array<number | null>(bars.length).fill(null);
  const order = bars.map((_, i) => i).sort((a, b) => +bars[a].start - +bars[b].start);

  // `order` is start-ascending, so the previous index seen on a lane is always
  // the one immediately before this bar in that lane.
  const lastOnLane: number[] = [];

  for (const i of order) {
    const bar = bars[i];
    let lane = laneEnds.findIndex((end) => end <= +bar.start);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(0);
    }
    if (lastOnLane[lane] != null) nextInLane[lastOnLane[lane]] = +bar.start;
    laneEnds[lane] = Math.max(+bar.end, +bar.start);
    lastOnLane[lane] = i;
    lanes[i] = lane;
  }
  return { lanes, nextInLane, count: Math.max(laneEnds.length, 1) };
}

/** Min start / max end / duration-weighted progress across a row and its descendants. */
function rollup<T>(row: GanttRow<T>): GanttSpan | undefined {
  let start = Number.POSITIVE_INFINITY;
  let end = Number.NEGATIVE_INFINITY;
  let weight = 0;
  let weighted = 0;

  const visit = (r: GanttRow<T>) => {
    for (const bar of r.bars ?? []) {
      start = Math.min(start, +bar.start);
      end = Math.max(end, +bar.end);
      const w = Math.max(+bar.end - +bar.start, 1);
      weight += w;
      weighted += w * Math.max(0, Math.min(1, bar.progress ?? 0));
    }
    r.children?.forEach(visit);
  };
  visit(row);

  if (start === Number.POSITIVE_INFINITY) return undefined;
  return {
    start: new Date(start),
    end: new Date(end),
    progress: weight ? weighted / weight : 0,
  };
}

export function Gantt<T = unknown>({
  rows,
  columns,
  scale: scaleProp,
  defaultScale = "month",
  onScaleChange,
  scales = ALL_SCALES,
  date: dateProp,
  defaultDate,
  onDateChange,
  now,
  weekStartsOn = 0,
  title,
  toolbar = true,
  actions,
  zoomControls = true,
  rowHeight = DEFAULT_ROW_HEIGHT,
  laneHeight = DEFAULT_LANE_HEIGHT,
  nonWorking,
  summaryRows = true,
  bordered = true,
  height = 520,
  onBarClick,
  onRowClick,
  onExpandedChange,
  emptyState,
  className,
}: GanttProps<T>) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // `new Date()` differs between the server and client render, so the now line
  // only appears after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [uncontrolledScale, setUncontrolledScale] = useState<GanttScale>(defaultScale);
  const scale = scaleProp ?? uncontrolledScale;

  const [uncontrolledDate, setUncontrolledDate] = useState<Date>(
    () => defaultDate ?? new Date(),
  );
  const anchor = dateProp ?? uncontrolledDate;

  const setScale = useCallback(
    (next: GanttScale) => {
      if (scaleProp === undefined) setUncontrolledScale(next);
      onScaleChange?.(next);
    },
    [scaleProp, onScaleChange],
  );

  const setAnchor = useCallback(
    (next: Date) => {
      if (dateProp === undefined) setUncontrolledDate(next);
      onDateChange?.(next);
    },
    [dateProp, onDateChange],
  );

  const timeline = useMemo(
    () => buildTimeline(scale, anchor, zoom, weekStartsOn),
    [scale, anchor, zoom, weekStartsOn],
  );

  const leftWidth = useMemo(
    () => columns.reduce((sum, c, i) => sum + (c.width ?? (i === 0 ? 200 : 120)), 0),
    [columns],
  );

  const toggle = useCallback(
    (id: string, isExpanded: boolean) => {
      setExpanded((prev) => {
        const next = { ...prev, [id]: !isExpanded };
        onExpandedChange?.(next);
        return next;
      });
    },
    [onExpandedChange],
  );

  const flat = useMemo(() => {
    const out: FlatRow<T>[] = [];

    const walk = (list: GanttRow<T>[], depth: number) => {
      for (const row of list) {
        const isGroup = Boolean(row.children?.length);
        const isExpanded = expanded[row.id] ?? row.defaultExpanded ?? true;
        const bars = row.bars ?? [];
        const { lanes, nextInLane, count } = packLanes(bars);
        const span = isGroup && summaryRows ? rollup(row) : undefined;

        out.push({
          row,
          depth,
          isGroup,
          expanded: isExpanded,
          span,
          lanes,
          nextInLane,
          height: rowHeight + Math.max(0, count - 1) * laneHeight,
        });

        if (isGroup && isExpanded) walk(row.children!, depth + 1);
      }
    };

    walk(rows, 0);
    return out;
  }, [rows, expanded, summaryRows, rowHeight, laneHeight]);

  const nowDate = now === undefined ? (mounted ? new Date() : null) : now;
  const nowX = nowDate && timeline.contains(nowDate) ? timeline.x(nowDate) : null;

  /** Earliest bar in view — where to look when "now" sits outside the range. */
  const firstBarStart = useMemo(() => {
    let earliest = Number.POSITIVE_INFINITY;
    for (const item of flat) {
      for (const bar of item.row.bars ?? []) earliest = Math.min(earliest, +bar.start);
    }
    return Number.isFinite(earliest) ? earliest : null;
  }, [flat]);

  // Bring the interesting part of the timeline into view when the range changes.
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const focus =
      nowX ??
      (firstBarStart != null && timeline.contains(firstBarStart)
        ? timeline.x(firstBarStart)
        : null);
    if (focus == null) return;
    el.scrollLeft = Math.max(0, focus - (el.clientWidth - leftWidth) / 3);
    // Re-anchor on range/zoom changes, plus once on mount when the now line
    // becomes available. Not on every clock tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, +timeline.start, timeline.colWidth, leftWidth, firstBarStart, mounted]);

  const isNonWorking = nonWorking ?? (timeline.unit === "day" ? defaultNonWorking : undefined);
  const headerHeight = TIER_HEIGHT * 2;

  return (
    <TooltipProvider delayDuration={250}>
      <div
        className={cn(
          "relative flex flex-col overflow-hidden bg-background",
          bordered && "rounded-lg border border-border",
          className,
        )}
      >
        {toolbar && (
          <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2">
            <Button variant="outline" size="sm" onClick={() => setAnchor(new Date())}>
              Today
            </Button>

            {scales.length > 1 && (
              <Select value={scale} onValueChange={(v) => setScale(v as GanttScale)}>
                <SelectTrigger size="sm" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scales.map((s) => (
                    <SelectItem key={s} value={s}>
                      {SCALE_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label="Previous period"
                onClick={() => setAnchor(pageDate(scale, anchor, -1))}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label="Next period"
                onClick={() => setAnchor(pageDate(scale, anchor, 1))}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

            <div className="truncate text-sm font-semibold">{title ?? timeline.title}</div>

            {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
          </div>
        )}

        <div
          ref={scrollerRef}
          className="grid-scrollbar relative flex-1 overflow-auto"
          style={{ height: typeof height === "number" ? `${height}px` : height }}
        >
          <div className="w-max min-w-full">
            {/* ── Header ─────────────────────────────────────────────── */}
            <div
              className="sticky top-0 z-50 flex w-max border-b border-border bg-background"
              style={{ height: headerHeight }}
            >
              <div
                className="sticky left-0 z-10 flex shrink-0 items-center border-r border-border bg-background"
                style={{ width: leftWidth }}
              >
                {columns.map((col, i) => (
                  <div
                    key={col.id}
                    className={cn(
                      "truncate px-3 text-xs font-medium text-muted-foreground",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                    )}
                    style={{ width: col.width ?? (i === 0 ? 200 : 120) }}
                  >
                    {col.header}
                  </div>
                ))}
              </div>

              <div className="relative z-0 shrink-0" style={{ width: timeline.width }}>
                <div className="flex" style={{ height: TIER_HEIGHT }}>
                  {timeline.groups.map((g) => (
                    <div
                      key={g.key}
                      className="flex items-center truncate border-r border-border px-2 text-xs font-medium text-muted-foreground"
                      style={{ width: g.span * timeline.colWidth }}
                    >
                      {g.label}
                    </div>
                  ))}
                </div>
                <div className="flex border-t border-border" style={{ height: TIER_HEIGHT }}>
                  {timeline.columns.map((col) => (
                    <div
                      key={+col.start}
                      className={cn(
                        "flex shrink-0 items-center justify-center truncate border-r border-border text-[11px]",
                        isNonWorking?.(col.start, col.end)
                          ? "text-muted-foreground/60"
                          : "text-muted-foreground",
                      )}
                      style={{ width: timeline.colWidth }}
                    >
                      {col.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Body ───────────────────────────────────────────────── */}
            {flat.length === 0 ? (
              <div
                className="sticky left-0 flex items-center justify-center p-10 text-sm text-muted-foreground"
                style={{ width: leftWidth + timeline.width }}
              >
                {emptyState ?? "No rows to show"}
              </div>
            ) : (
              <div className="flex w-max">
                {/* Left pane — one sticky column, not per-row sticky cells, so the
                    now line and column bands stay tucked behind it while scrolling. */}
                <div
                  className="sticky left-0 z-40 shrink-0 border-r border-border bg-background"
                  style={{ width: leftWidth }}
                >
                  {flat.map((item) => (
                    <div
                      key={item.row.id}
                      className={cn(
                        "flex items-center border-b border-border/60 transition-colors",
                        hovered === item.row.id && "bg-muted/40",
                        onRowClick && "cursor-pointer",
                      )}
                      style={{ height: item.height }}
                      onMouseEnter={() => setHovered(item.row.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => onRowClick?.(item.row)}
                    >
                      {columns.map((col, i) => {
                        const width = col.width ?? (i === 0 ? 200 : 120);
                        const cell = col.cell(item.row, {
                          depth: item.depth,
                          isGroup: item.isGroup,
                          expanded: item.expanded,
                          span: item.span,
                        });

                        // The first column carries the tree affordance.
                        if (i === 0) {
                          return (
                            <div
                              key={col.id}
                              className="flex min-w-0 items-center gap-1 pr-2"
                              style={{ width, paddingLeft: 8 + item.depth * 16 }}
                            >
                              {item.isGroup ? (
                                <button
                                  type="button"
                                  aria-label={item.expanded ? "Collapse" : "Expand"}
                                  aria-expanded={item.expanded}
                                  className="flex size-4 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggle(item.row.id, item.expanded);
                                  }}
                                >
                                  <ChevronDown
                                    className={cn(
                                      "size-3.5 transition-transform",
                                      !item.expanded && "-rotate-90",
                                    )}
                                  />
                                </button>
                              ) : (
                                <span className="size-4 shrink-0" />
                              )}
                              <div className="min-w-0 flex-1 truncate">{cell}</div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={col.id}
                            className={cn(
                              "min-w-0 truncate px-3",
                              col.align === "right" && "text-right",
                              col.align === "center" && "text-center",
                            )}
                            style={{ width }}
                          >
                            {cell}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Timeline pane — z-0 caps every layer inside it below the left pane. */}
                <div className="relative z-0 shrink-0" style={{ width: timeline.width }}>
                  <div className="pointer-events-none absolute inset-0 z-0 flex">
                    {timeline.columns.map((col) => (
                      <div
                        key={+col.start}
                        className={cn(
                          "h-full shrink-0 border-r",
                          col.major ? "border-border" : "border-border/50",
                          isNonWorking?.(col.start, col.end) && "bg-muted/40",
                        )}
                        style={{ width: timeline.colWidth }}
                      />
                    ))}
                  </div>

                  {flat.map((item) => (
                    <div
                      key={item.row.id}
                      className={cn(
                        "relative z-10 border-b border-border/60 transition-colors",
                        hovered === item.row.id && "bg-muted/40",
                        onRowClick && "cursor-pointer",
                      )}
                      style={{ height: item.height }}
                      onMouseEnter={() => setHovered(item.row.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => onRowClick?.(item.row)}
                    >
                      {item.span && (
                        <SummaryTrack
                          span={item.span}
                          timeline={timeline}
                          top={(rowHeight - BAR_HEIGHT) / 2}
                        />
                      )}
                      {(item.row.bars ?? []).map((bar, bi) => (
                        <GanttBar
                          key={bar.id}
                          bar={bar}
                          timeline={timeline}
                          top={
                            (rowHeight - BAR_HEIGHT) / 2 + item.lanes[bi] * laneHeight
                          }
                          outsideRoom={
                            item.nextInLane[bi] == null
                              ? undefined
                              : timeline.x(item.nextInLane[bi]!) - timeline.x(bar.end)
                          }
                          onClick={
                            onBarClick ? (b) => onBarClick(b, item.row) : undefined
                          }
                        />
                      ))}
                    </div>
                  ))}

                  {nowX != null && (
                    <div
                      className="pointer-events-none absolute inset-y-0 z-20 w-px bg-rose-600 dark:bg-rose-500"
                      style={{ left: nowX }}
                      aria-hidden
                    >
                      <span className="absolute -top-px -left-0.75 size-1.75 rounded-full bg-rose-600 dark:bg-rose-500" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {zoomControls && (
          <div className="absolute right-3 bottom-3 z-50 flex flex-col overflow-hidden rounded-md border border-border bg-background shadow-sm">
            <button
              type="button"
              aria-label="Zoom in"
              disabled={zoom >= ZOOM_MAX}
              onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
              className="flex size-6 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
            >
              <Plus className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Zoom out"
              disabled={zoom <= ZOOM_MIN}
              onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
              className="flex size-6 items-center justify-center border-t border-border text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
            >
              <Minus className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

/** Group rollup: a hairline track with a progress portion and a trailing percent. */
function SummaryTrack({
  span,
  timeline,
  top,
}: {
  span: GanttSpan;
  timeline: Timeline;
  top: number;
}) {
  const x1 = timeline.x(span.start);
  const x2 = timeline.x(span.end);
  const width = Math.max(x2 - x1, 2);
  const pct = Math.round(span.progress * 100);
  // Projected through the time axis so a span clipped by the visible range still
  // shows the right fill.
  const progressWidth = Math.max(
    0,
    timeline.x(+span.start + (+span.end - +span.start) * span.progress) - x1,
  );

  return (
    <>
      <div
        className="pointer-events-none absolute"
        style={{ left: x1, width, top, height: BAR_HEIGHT }}
      >
        <span className="absolute inset-x-0 top-1/2 h-0.75 -translate-y-1/2 rounded-full bg-foreground/15" />
        <span
          className="absolute top-1/2 left-0 h-0.75 -translate-y-1/2 rounded-full bg-foreground/45"
          style={{ width: progressWidth }}
        />
        <span className="absolute top-1/2 left-0 h-2 w-px -translate-y-1/2 bg-foreground/35" />
        <span className="absolute top-1/2 right-0 h-2 w-px -translate-y-1/2 bg-foreground/35" />
      </div>
      <span
        className="pointer-events-none absolute flex items-center text-[11px] text-muted-foreground tabular-nums"
        style={{ left: x2 + 8, top, height: BAR_HEIGHT }}
      >
        {pct}%
      </span>
    </>
  );
}
