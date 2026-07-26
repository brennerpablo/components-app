"use client";

import { format } from "date-fns";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { GANTT_COLOR_CLASSES } from "./colors";
import type { Timeline } from "./timeline";
import type { GanttBar as GanttBarType } from "./types";

/** Bar body height. Rows are taller than this — the bar is a thin mark. */
export const BAR_HEIGHT = 18;
const MIN_BAR_WIDTH = 6;
/** Half of the 2px surface gap kept between bars that meet edge to edge. */
const EDGE_INSET = 1;
/** Rough advance width of `text-[11px]` — good enough to decide inside vs outside. */
const CHAR_PX = 6;

/** Below this, a trailing label has nowhere useful to go and is dropped. */
const MIN_OUTSIDE_ROOM = 28;

interface GanttBarProps {
  bar: GanttBarType;
  timeline: Timeline;
  /** Lane offset within the row, in px. */
  top: number;
  /** Px to the next bar in this lane — caps the trailing label so they can't collide. */
  outsideRoom?: number;
  onClick?: (bar: GanttBarType) => void;
}

function defaultTooltip(bar: GanttBarType, timeline: Timeline) {
  const fmt = timeline.unit === "hour" ? "MMM d, h:mm a" : "MMM d, yyyy";
  return (
    <div className="space-y-1">
      <div className="font-medium">{bar.label ?? "Untitled"}</div>
      <div className="text-muted-foreground">
        {bar.milestone
          ? format(bar.start, fmt)
          : `${format(bar.start, fmt)} → ${format(bar.end, fmt)}`}
      </div>
      {bar.progress != null && !bar.milestone && (
        <div className="text-muted-foreground">
          {Math.round(bar.progress * 100)}% complete
        </div>
      )}
    </div>
  );
}

export function GanttBar({ bar, timeline, top, outsideRoom, onClick }: GanttBarProps) {
  const colors = GANTT_COLOR_CLASSES[bar.color ?? "neutral"];
  const variant = bar.variant ?? "soft";
  const interactive = Boolean(onClick) && !bar.disabled;

  const x1 = timeline.x(bar.start);
  const x2 = timeline.x(bar.end);
  // A bar running past either edge gets a squared-off end so the clip is visible.
  const clippedStart = +bar.start < +timeline.start;
  const clippedEnd = +bar.end > +timeline.end;

  // Project the progress boundary through the time axis rather than taking a
  // percentage of the drawn width — otherwise a bar clipped by the visible range
  // would show the wrong fill.
  const progress = Math.max(0, Math.min(1, bar.progress ?? 0));
  const progressX =
    progress > 0 ? timeline.x(+bar.start + (+bar.end - +bar.start) * progress) : x1;

  const content = bar.milestone ? (
    <MilestoneMark bar={bar} x={x1} top={top} interactive={interactive} onClick={onClick} />
  ) : (
    <BarMark
      bar={bar}
      colors={colors}
      variant={variant}
      x1={x1}
      x2={x2}
      progressX={progressX}
      top={top}
      clippedStart={clippedStart}
      clippedEnd={clippedEnd}
      outsideRoom={outsideRoom}
      interactive={interactive}
      onClick={onClick}
    />
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={6} className="max-w-64 text-xs">
        {bar.tooltip ?? defaultTooltip(bar, timeline)}
      </TooltipContent>
    </Tooltip>
  );
}

function MilestoneMark({
  bar,
  x,
  top,
  interactive,
  onClick,
}: {
  bar: GanttBarType;
  x: number;
  top: number;
  interactive: boolean;
  onClick?: (bar: GanttBarType) => void;
}) {
  const colors = GANTT_COLOR_CLASSES[bar.color ?? "neutral"];
  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? () => onClick?.(bar) : undefined}
      className={cn(
        "absolute flex items-center gap-1.5",
        interactive && "cursor-pointer",
      )}
      style={{ left: x - BAR_HEIGHT / 2, top: top + (BAR_HEIGHT - 14) / 2 }}
    >
      <span
        className={cn(
          "flex size-3.5 shrink-0 items-center justify-center rounded-full border-2 bg-background",
          bar.color && bar.color !== "neutral"
            ? "border-current"
            : "border-muted-foreground/40",
        )}
      >
        <span className={cn("size-1.5 rounded-full", colors.dot)} />
      </span>
      {bar.label && (
        <span className="whitespace-nowrap text-[11px] text-foreground">
          {bar.label}
        </span>
      )}
    </div>
  );
}

function BarMark({
  bar,
  colors,
  variant,
  x1,
  x2,
  progressX,
  top,
  clippedStart,
  clippedEnd,
  outsideRoom,
  interactive,
  onClick,
}: {
  bar: GanttBarType;
  colors: (typeof GANTT_COLOR_CLASSES)[keyof typeof GANTT_COLOR_CLASSES];
  variant: NonNullable<GanttBarType["variant"]>;
  x1: number;
  x2: number;
  progressX: number;
  top: number;
  clippedStart: boolean;
  clippedEnd: boolean;
  outsideRoom?: number;
  interactive: boolean;
  onClick?: (bar: GanttBarType) => void;
}) {
  const left = x1 + EDGE_INSET;
  const width = Math.max(x2 - x1 - EDGE_INSET * 2, MIN_BAR_WIDTH);

  const label = bar.label ?? "";
  const needed = label.length * CHAR_PX + (bar.icon ? 18 : 0) + 16;
  // A trailing label may only use the gap before the next bar in this lane.
  const room = outsideRoom == null ? Number.POSITIVE_INFINITY : outsideRoom - 10;
  const explicit = bar.labelPosition && bar.labelPosition !== "auto";
  const placement = explicit
    ? bar.labelPosition!
    : !label
      ? "none"
      : width >= needed
        ? "inside"
        : room >= MIN_OUTSIDE_ROOM
          ? "outside"
          : "none";

  const progressWidth = Math.max(0, progressX - x1 - EDGE_INSET);

  return (
    <>
      <div
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        onClick={interactive ? () => onClick?.(bar) : undefined}
        className={cn(
          "absolute flex items-center overflow-hidden rounded-[4px]",
          variant === "soft" && cn(colors.soft, "ring-1 ring-inset", colors.ring),
          variant === "solid" && colors.fill,
          variant === "outline" &&
            "border border-dashed border-muted-foreground/40 bg-background/60",
          clippedStart && "rounded-l-none",
          clippedEnd && "rounded-r-none",
          interactive && "cursor-pointer hover:brightness-95 dark:hover:brightness-125",
          bar.disabled && "opacity-60",
        )}
        style={{ left, width, top, height: BAR_HEIGHT }}
      >
        {/* Saturated leading rail — carries the hue at full contrast even when
            the body is a pale tint. */}
        {variant !== "solid" && (
          <span
            className={cn("absolute inset-y-0 left-0 w-0.75", colors.rail)}
            aria-hidden
          />
        )}
        {progressWidth > 0 && (
          <span
            className={cn(
              "absolute inset-y-0 left-0",
              variant === "solid" ? "bg-black/20" : cn(colors.fill, "opacity-40"),
            )}
            style={{ width: progressWidth }}
            aria-hidden
          />
        )}
        {placement === "inside" && (
          <span
            className={cn(
              "relative flex min-w-0 items-center gap-1 truncate px-2 text-[11px] leading-none font-medium",
              variant === "solid" ? colors.textOnFill : "text-foreground",
              variant !== "solid" && "pl-2.5",
            )}
          >
            {bar.icon}
            <span className="truncate">{label}</span>
          </span>
        )}
      </div>

      {placement === "outside" && (
        <span
          className="pointer-events-none absolute flex items-center gap-1 text-[11px] text-foreground"
          style={{
            left: left + width + 8,
            top,
            height: BAR_HEIGHT,
            maxWidth: Number.isFinite(room) ? room : undefined,
          }}
        >
          {bar.icon}
          <span className="truncate">{label}</span>
        </span>
      )}

      {bar.startLabel && (
        <span
          className="pointer-events-none absolute flex items-center whitespace-nowrap text-[10px] text-muted-foreground"
          style={{ right: `calc(100% - ${left - 6}px)`, top, height: BAR_HEIGHT }}
        >
          {bar.startLabel}
        </span>
      )}
      {/* An outside main label already occupies the trailing gutter. */}
      {bar.endLabel && placement !== "outside" && (
        <span
          className="pointer-events-none absolute flex items-center whitespace-nowrap text-[10px] text-muted-foreground"
          style={{ left: left + width + 6, top, height: BAR_HEIGHT }}
        >
          {bar.endLabel}
        </span>
      )}
    </>
  );
}
