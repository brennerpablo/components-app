export function getYAxisDomain(
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined,
): [number | string, number | string] {
  const minDomain = autoMinValue ? "auto" : (minValue ?? 0)
  const maxDomain = maxValue ?? "auto"
  return [minDomain, maxDomain]
}

export function measureTextWidth(text: string): number {
  if (typeof window === "undefined") {
    return text.length * 7.5
  }
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return text.length * 7.5
  ctx.font = "12px sans-serif"
  return ctx.measureText(text).width
}

export function inferYAxisWidth(
  data: Record<string, unknown>[],
  categories: string[],
  valueFormatter: (value: number) => string = String,
  padding = 20,
): number {
  let longestFormatted = ""
  for (const row of data) {
    for (const cat of categories) {
      const val = row[cat]
      if (typeof val === "number") {
        const formatted = valueFormatter(val)
        if (formatted.length > longestFormatted.length) {
          longestFormatted = formatted
        }
      }
    }
  }
  if (!longestFormatted) return 56
  return Math.ceil(measureTextWidth(longestFormatted) * 1.15) + padding
}

export function hasOnlyOneValueForKey(
  data: Record<string, unknown>[],
  key: string,
): boolean {
  const values = data.filter(
    (item) => item[key] !== undefined && item[key] !== null,
  )
  return values.length === 1
}
