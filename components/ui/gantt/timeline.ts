import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  addYears,
  format,
  getQuarter,
  getWeek,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
} from "date-fns";

import type { GanttScale } from "./types";

export interface TimelineColumn {
  start: Date;
  end: Date;
  /** Second-tier header label ("Tue 21", "9 AM", "W30", "Jul"). */
  label: string;
  /** Emphasised tick — start of a day on hour columns, Mondays on day columns. */
  major: boolean;
}

export interface TimelineGroup {
  key: string;
  label: string;
  /** How many columns this first-tier cell spans. */
  span: number;
}

export interface Timeline {
  scale: GanttScale;
  /** Column unit. `unit === "hour"` drives half-hour minor ticks. */
  unit: "hour" | "day" | "week" | "month";
  start: Date;
  /** Exclusive. */
  end: Date;
  columns: TimelineColumn[];
  groups: TimelineGroup[];
  /** Px per column, zoom already applied. */
  colWidth: number;
  /** Total timeline width in px. */
  width: number;
  /** Range label for the toolbar. */
  title: string;
  /** Projects a time onto the x axis, clamped to the visible range. */
  x: (time: Date | number) => number;
  /** True when the time falls inside the visible range. */
  contains: (time: Date | number) => boolean;
}

interface ScaleSpec {
  unit: Timeline["unit"];
  colWidth: number;
  rangeStart: (anchor: Date, weekStartsOn: WeekStart) => Date;
  rangeEnd: (start: Date) => Date;
  page: (anchor: Date, direction: number) => Date;
  title: (start: Date, end: Date) => string;
}

type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const SCALES: Record<GanttScale, ScaleSpec> = {
  day: {
    unit: "hour",
    colWidth: 64,
    rangeStart: (a) => startOfDay(a),
    rangeEnd: (s) => addDays(s, 1),
    page: (a, d) => addDays(a, d),
    title: (s) => format(s, "EEEE, MMMM d, yyyy"),
  },
  week: {
    unit: "day",
    colWidth: 132,
    rangeStart: (a, w) => startOfWeek(a, { weekStartsOn: w }),
    rangeEnd: (s) => addWeeks(s, 1),
    page: (a, d) => addWeeks(a, d),
    title: (s, e) => `${format(s, "MMM d")} – ${format(addDays(e, -1), "MMM d, yyyy")}`,
  },
  month: {
    unit: "day",
    colWidth: 46,
    rangeStart: (a) => startOfMonth(a),
    rangeEnd: (s) => addMonths(s, 1),
    page: (a, d) => addMonths(a, d),
    title: (s) => format(s, "MMMM yyyy"),
  },
  quarter: {
    unit: "week",
    colWidth: 60,
    rangeStart: (a) => startOfQuarter(a),
    rangeEnd: (s) => addMonths(s, 3),
    page: (a, d) => addMonths(a, d * 3),
    title: (s) => `Q${getQuarter(s)} ${format(s, "yyyy")}`,
  },
  year: {
    unit: "month",
    colWidth: 78,
    rangeStart: (a) => startOfYear(a),
    rangeEnd: (s) => addYears(s, 1),
    page: (a, d) => addYears(a, d),
    title: (s) => format(s, "yyyy"),
  },
};

export const SCALE_LABELS: Record<GanttScale, string> = {
  day: "Day",
  week: "Week",
  month: "Month",
  quarter: "Quarter",
  year: "Year",
};

/** Moves the anchor date one page forward (1) or back (-1). */
export function pageDate(scale: GanttScale, anchor: Date, direction: number): Date {
  return SCALES[scale].page(anchor, direction);
}

function stepColumn(unit: Timeline["unit"], d: Date, weekStartsOn: WeekStart): Date {
  switch (unit) {
    case "hour":
      return addHours(d, 1);
    case "day":
      return addDays(d, 1);
    case "week":
      return addWeeks(startOfWeek(d, { weekStartsOn }), 1);
    case "month":
      return addMonths(startOfMonth(d), 1);
  }
}

function columnLabel(unit: Timeline["unit"], d: Date, weekStartsOn: WeekStart): string {
  switch (unit) {
    case "hour":
      return format(d, "h a");
    case "day":
      return format(d, "EEE d");
    case "week":
      return `W${getWeek(d, { weekStartsOn })}`;
    case "month":
      return format(d, "MMM");
  }
}

/** First-tier header cell a column belongs to — one tier up from the column unit. */
function groupOf(
  unit: Timeline["unit"],
  d: Date,
  weekStartsOn: WeekStart,
): { key: string; label: string } {
  switch (unit) {
    case "hour":
      return { key: format(d, "yyyy-MM-dd"), label: format(d, "EEEE, MMMM d, yyyy") };
    case "day": {
      const ws = startOfWeek(d, { weekStartsOn });
      const we = addDays(ws, 6);
      const sameMonth = ws.getMonth() === we.getMonth();
      return {
        key: format(ws, "yyyy-MM-dd"),
        label: `W${getWeek(ws, { weekStartsOn })} ${format(ws, "MMM d")} - ${format(we, sameMonth ? "d" : "MMM d")}`,
      };
    }
    case "week":
      return { key: format(startOfMonth(d), "yyyy-MM"), label: format(d, "MMMM") };
    case "month":
      return { key: `${format(d, "yyyy")}-Q${getQuarter(d)}`, label: `Q${getQuarter(d)} ${format(d, "yyyy")}` };
  }
}

function isMajor(unit: Timeline["unit"], d: Date, weekStartsOn: WeekStart): boolean {
  switch (unit) {
    case "hour":
      return d.getHours() === 0;
    case "day":
      return d.getDay() === weekStartsOn;
    case "week":
      return d.getDate() <= 7;
    case "month":
      return d.getMonth() % 3 === 0;
  }
}

export function buildTimeline(
  scale: GanttScale,
  anchor: Date,
  zoom: number,
  weekStartsOn: WeekStart = 0,
): Timeline {
  const spec = SCALES[scale];
  const start = spec.rangeStart(anchor, weekStartsOn);
  const end = spec.rangeEnd(start);
  const colWidth = Math.round(spec.colWidth * zoom);

  const columns: TimelineColumn[] = [];
  const groups: TimelineGroup[] = [];

  // Week/month columns can start before the range does (a quarter rarely begins
  // on the week's first day) — snap the first column back so the grid lines up.
  let cursor =
    spec.unit === "week"
      ? startOfWeek(start, { weekStartsOn })
      : spec.unit === "month"
        ? startOfMonth(start)
        : start;

  while (cursor < end) {
    const next = stepColumn(spec.unit, cursor, weekStartsOn);
    columns.push({
      start: cursor,
      end: next,
      label: columnLabel(spec.unit, cursor, weekStartsOn),
      major: isMajor(spec.unit, cursor, weekStartsOn),
    });
    const g = groupOf(spec.unit, cursor, weekStartsOn);
    const last = groups[groups.length - 1];
    if (last && last.key === g.key) last.span += 1;
    else groups.push({ ...g, span: 1 });
    cursor = next;
  }

  // The grid, not the nominal range, defines the projection domain.
  const gridStart = columns.length ? +columns[0].start : +start;
  const gridEnd = columns.length ? +columns[columns.length - 1].end : +end;
  const width = columns.length * colWidth;

  const x = (time: Date | number) => {
    const ms = +time;
    if (!columns.length) return 0;
    if (ms <= gridStart) return 0;
    if (ms >= gridEnd) return width;
    // Binary search for the column containing `ms`, then interpolate inside it —
    // month columns differ in duration but share a pixel width.
    let lo = 0;
    let hi = columns.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (+columns[mid].start <= ms) lo = mid;
      else hi = mid - 1;
    }
    const col = columns[lo];
    const fraction = (ms - +col.start) / (+col.end - +col.start);
    return (lo + fraction) * colWidth;
  };

  return {
    scale,
    unit: spec.unit,
    start,
    end,
    columns,
    groups,
    colWidth,
    width,
    title: spec.title(start, end),
    x,
    contains: (time) => +time >= gridStart && +time <= gridEnd,
  };
}

/** Default non-working shading: weekends, on day-unit columns only. */
export function defaultNonWorking(columnStart: Date): boolean {
  const day = columnStart.getDay();
  return day === 0 || day === 6;
}
