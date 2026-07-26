import type { ReactNode } from "react";

/**
 * Categorical identity colors. The order is the validated slot order — assign
 * from slot 1 upward and never cycle past slot 8; a 9th category folds into
 * `neutral` or gets its own chart. See `colors.ts` for the validation record.
 */
export type GanttColor =
  | "blue"
  | "emerald"
  | "violet"
  | "amber"
  | "rose"
  | "teal"
  | "orange"
  | "indigo"
  | "neutral";

/** Timeline preset — picks both the visible range and the column unit. */
export type GanttScale = "day" | "week" | "month" | "quarter" | "year";

export type GanttBarVariant = "soft" | "solid" | "outline";

export type GanttLabelPosition = "auto" | "inside" | "outside" | "none";

export interface GanttBar {
  id: string;
  start: Date;
  end: Date;
  /** Primary label. Placed inside the bar when it fits, otherwise after it. */
  label?: string;
  labelPosition?: GanttLabelPosition;
  /** 0–1. Fills that fraction of the bar with the saturated hue step. */
  progress?: number;
  color?: GanttColor;
  variant?: GanttBarVariant;
  /** Small muted captions pinned just outside the bar's leading/trailing edge. */
  startLabel?: string;
  endLabel?: string;
  /** Rendered before the label, inside the bar. */
  icon?: ReactNode;
  /** Renders a ring marker at `start` instead of a bar. `end` is ignored. */
  milestone?: boolean;
  /** Replaces the default "label · start – end" hover card. */
  tooltip?: ReactNode;
  disabled?: boolean;
  data?: unknown;
}

export interface GanttRow<T = unknown> {
  id: string;
  label: string;
  bars?: GanttBar[];
  children?: GanttRow<T>[];
  /** Groups start expanded; set false to start collapsed. */
  defaultExpanded?: boolean;
  /** Arbitrary payload handed back to every column's `cell` renderer. */
  data?: T;
}

/** Rolled-up span across a group row's descendant bars. */
export interface GanttSpan {
  start: Date;
  end: Date;
  /** Duration-weighted mean of descendant bar progress, 0–1. */
  progress: number;
}

export interface GanttCellContext {
  depth: number;
  isGroup: boolean;
  expanded: boolean;
  span?: GanttSpan;
}

export interface GanttColumn<T = unknown> {
  id: string;
  header: ReactNode;
  /** Px. Defaults to 200 for the first column, 120 for the rest. */
  width?: number;
  align?: "left" | "center" | "right";
  cell: (row: GanttRow<T>, ctx: GanttCellContext) => ReactNode;
}

export interface GanttProps<T = unknown> {
  rows: GanttRow<T>[];
  /** Left pane columns. The first one carries the expand/collapse tree affordance. */
  columns: GanttColumn<T>[];

  scale?: GanttScale;
  defaultScale?: GanttScale;
  onScaleChange?: (scale: GanttScale) => void;
  /** Presets offered by the toolbar picker. Omit the picker with an empty array. */
  scales?: GanttScale[];

  /** Anchor date the visible range is derived from. */
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;

  /** Vertical "now" line. Defaults to the current time; pass null to hide it. */
  now?: Date | null;
  /** 0 = Sunday. Affects week columns, week grouping and the `week` range. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /** Overrides the derived range label in the toolbar. */
  title?: ReactNode;
  toolbar?: boolean;
  /** Rendered at the right end of the toolbar. */
  actions?: ReactNode;
  zoomControls?: boolean;

  rowHeight?: number;
  /** Extra height each additional overlap lane adds to a row. */
  laneHeight?: number;
  /** Shades columns as non-working. Defaults to weekends on day columns. */
  nonWorking?: (columnStart: Date, columnEnd: Date) => boolean;
  /** Group rows render a rollup track across their descendants. */
  summaryRows?: boolean;
  bordered?: boolean;
  /** Scroll viewport height. Number = px. */
  height?: number | string;

  onBarClick?: (bar: GanttBar, row: GanttRow<T>) => void;
  onRowClick?: (row: GanttRow<T>) => void;
  onExpandedChange?: (expanded: Record<string, boolean>) => void;

  emptyState?: ReactNode;
  className?: string;
}
