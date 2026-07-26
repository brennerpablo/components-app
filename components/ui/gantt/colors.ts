import type { GanttColor } from "./types";

/**
 * Categorical palette — 8 identity slots plus a neutral.
 *
 * The slot ORDER is the colorblind-safety mechanism, not decoration: it was
 * chosen by searching orderings of the repo's chart hues and keeping only one
 * that clears every gate on the adjacent pairlist in both modes. Validated with
 * the data-viz validator against this app's surfaces (light `#ffffff`, dark
 * `#0a0a0a`) — all checks PASS in both modes:
 *
 *   lightness band · chroma floor · contrast ≥ 3:1 ....... pass (both modes)
 *   worst adjacent CVD  teal↔rose  ΔE 11.7 (deutan) ...... pass (≥ 8)
 *   worst adjacent normal-vision  rose↔amber  ΔE 18.5 .... pass (≥ 15)
 *
 * Assign from slot 1 upward and never cycle — a 9th category folds into
 * `neutral` or gets its own view. Re-run the validator before changing a hue,
 * a step, or the order.
 */
export const GANTT_COLORS: readonly GanttColor[] = [
  "blue",
  "emerald",
  "violet",
  "amber",
  "rose",
  "teal",
  "orange",
  "indigo",
] as const;

interface ColorClasses {
  /** Saturated 2px leading rail — the ≥3:1 hue carrier on every bar. */
  rail: string;
  /** Progress fill and the `solid` variant body. */
  fill: string;
  /** `soft` variant body. */
  soft: string;
  /** Hairline ring around the soft/outline body. */
  ring: string;
  /** Label ink on a solid body. Elsewhere labels wear `text-foreground` — a
   *  colored mark carries identity, never the text itself. */
  textOnFill: string;
  /** Legend / status dot. */
  dot: string;
}

/**
 * Tailwind needs literal class names, so every slot is spelled out. Steps are
 * the validated ones — blue/emerald/violet/amber/teal/orange/indigo at 600,
 * rose at 700.
 */
export const GANTT_COLOR_CLASSES: Record<GanttColor, ColorClasses> = {
  blue: {
    rail: "bg-blue-600",
    fill: "bg-blue-600",
    soft: "bg-blue-100 dark:bg-blue-600/20",
    ring: "ring-blue-600/25 dark:ring-blue-500/30",
    textOnFill: "text-white",
    dot: "bg-blue-600",
  },
  emerald: {
    rail: "bg-emerald-600",
    fill: "bg-emerald-600",
    soft: "bg-emerald-100 dark:bg-emerald-600/20",
    ring: "ring-emerald-600/25 dark:ring-emerald-500/30",
    textOnFill: "text-white",
    dot: "bg-emerald-600",
  },
  violet: {
    rail: "bg-violet-600",
    fill: "bg-violet-600",
    soft: "bg-violet-100 dark:bg-violet-600/20",
    ring: "ring-violet-600/25 dark:ring-violet-500/30",
    textOnFill: "text-white",
    dot: "bg-violet-600",
  },
  amber: {
    rail: "bg-amber-600",
    fill: "bg-amber-600",
    soft: "bg-amber-100 dark:bg-amber-600/20",
    ring: "ring-amber-600/25 dark:ring-amber-500/30",
    textOnFill: "text-white",
    dot: "bg-amber-600",
  },
  rose: {
    rail: "bg-rose-700",
    fill: "bg-rose-700",
    soft: "bg-rose-100 dark:bg-rose-700/25",
    ring: "ring-rose-700/25 dark:ring-rose-500/30",
    textOnFill: "text-white",
    dot: "bg-rose-700",
  },
  teal: {
    rail: "bg-teal-600",
    fill: "bg-teal-600",
    soft: "bg-teal-100 dark:bg-teal-600/20",
    ring: "ring-teal-600/25 dark:ring-teal-500/30",
    textOnFill: "text-white",
    dot: "bg-teal-600",
  },
  orange: {
    rail: "bg-orange-600",
    fill: "bg-orange-600",
    soft: "bg-orange-100 dark:bg-orange-600/20",
    ring: "ring-orange-600/25 dark:ring-orange-500/30",
    textOnFill: "text-white",
    dot: "bg-orange-600",
  },
  indigo: {
    rail: "bg-indigo-600",
    fill: "bg-indigo-600",
    soft: "bg-indigo-100 dark:bg-indigo-600/20",
    ring: "ring-indigo-600/25 dark:ring-indigo-500/30",
    textOnFill: "text-white",
    dot: "bg-indigo-600",
  },
  neutral: {
    rail: "bg-foreground/50",
    fill: "bg-foreground/55",
    soft: "bg-muted",
    ring: "ring-border",
    textOnFill: "text-background",
    dot: "bg-muted-foreground",
  },
};

/** Slot lookup for consumers assigning colors by category index. */
export function ganttColorAt(index: number): GanttColor {
  return GANTT_COLORS[index] ?? "neutral";
}
