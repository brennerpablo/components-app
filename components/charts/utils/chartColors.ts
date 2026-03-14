export const CHART_COLORS = [
  "blue",
  "emerald",
  "violet",
  "amber",
  "rose",
  "orange",
  "teal",
  "cyan",
  "pink",
  "indigo",
] as const

export type ChartColor = (typeof CHART_COLORS)[number]

// Maps a color name to Tailwind utility classes for different SVG/CSS usages
const colorMap: Record<ChartColor, Record<"text" | "stroke" | "fill" | "bg", string>> = {
  blue:    { text: "text-blue-500",    stroke: "stroke-blue-500",    fill: "fill-blue-500",    bg: "bg-blue-500" },
  emerald: { text: "text-emerald-500", stroke: "stroke-emerald-500", fill: "fill-emerald-500", bg: "bg-emerald-500" },
  violet:  { text: "text-violet-500",  stroke: "stroke-violet-500",  fill: "fill-violet-500",  bg: "bg-violet-500" },
  amber:   { text: "text-amber-500",   stroke: "stroke-amber-500",   fill: "fill-amber-500",   bg: "bg-amber-500" },
  rose:    { text: "text-rose-500",    stroke: "stroke-rose-500",    fill: "fill-rose-500",    bg: "bg-rose-500" },
  orange:  { text: "text-orange-500",  stroke: "stroke-orange-500",  fill: "fill-orange-500",  bg: "bg-orange-500" },
  teal:    { text: "text-teal-500",    stroke: "stroke-teal-500",    fill: "fill-teal-500",    bg: "bg-teal-500" },
  cyan:    { text: "text-cyan-500",    stroke: "stroke-cyan-500",    fill: "fill-cyan-500",    bg: "bg-cyan-500" },
  pink:    { text: "text-pink-500",    stroke: "stroke-pink-500",    fill: "fill-pink-500",    bg: "bg-pink-500" },
  indigo:  { text: "text-indigo-500",  stroke: "stroke-indigo-500",  fill: "fill-indigo-500",  bg: "bg-indigo-500" },
}

export function getColorClass(
  color: ChartColor,
  variant: "text" | "stroke" | "fill" | "bg",
): string {
  return colorMap[color]?.[variant] ?? ""
}

export function constructCategoryColors(
  categories: string[],
  colors: ChartColor[],
): Map<string, ChartColor> {
  const categoryColors = new Map<string, ChartColor>()
  categories.forEach((category, index) => {
    categoryColors.set(category, colors[index % colors.length])
  })
  return categoryColors
}
