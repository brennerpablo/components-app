export function getYAxisDomain(
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined,
): [number | string, number | string] {
  const minDomain = autoMinValue ? "auto" : (minValue ?? 0)
  const maxDomain = maxValue ?? "auto"
  return [minDomain, maxDomain]
}

export function computeYDomainWithPadding(
  data: Record<string, unknown>[],
  categories: string[],
  padding: number,
  stacked = false,
): [number, number] {
  let min = Infinity
  let max = -Infinity
  for (const row of data) {
    if (stacked) {
      let sum = 0
      for (const cat of categories) {
        const val = row[cat]
        if (typeof val === "number") sum += val
      }
      if (sum < min) min = sum
      if (sum > max) max = sum
    } else {
      for (const cat of categories) {
        const val = row[cat]
        if (typeof val === "number") {
          if (val < min) min = val
          if (val > max) max = val
        }
      }
    }
  }
  if (!isFinite(min)) return [0, 0]
  const range = max - min || Math.abs(max) || 1
  // More padding below (3x) so the line doesn't hug the bottom axis
  const bottomPadding = range * padding * 3
  const topPadding = range * padding
  return [Math.round(min - bottomPadding), Math.round(max + topPadding)]
}

export type CompactScale = "k" | "M" | "B" | "T"

const SCALE_DIVISORS: Record<CompactScale, number> = {
  k: 1e3,
  M: 1e6,
  B: 1e9,
  T: 1e12,
}

function formatScaled(value: number, divisor: number, suffix: string): string {
  const scaled = value / divisor
  // Strip trailing zeros: 1.00 → "1", 1.50 → "1.5", 1.25 → "1.25"
  const formatted = +scaled.toFixed(2)
  return `${formatted}${suffix}`
}

export function detectCompactScale(values: number[]): CompactScale | undefined {
  const maxAbs = Math.max(...values.map(Math.abs))
  if (maxAbs >= 1e12) return "T"
  if (maxAbs >= 1e9) return "B"
  if (maxAbs >= 1e6) return "M"
  if (maxAbs >= 1e3) return "k"
  return undefined
}

export function formatCompactNumber(
  value: number,
  forceScale?: CompactScale,
): string {
  if (value === 0) return "0"
  const sign = value < 0 ? "-" : ""
  const abs = Math.abs(value)

  if (forceScale) {
    return sign + formatScaled(abs, SCALE_DIVISORS[forceScale], forceScale)
  }

  if (abs >= 1e12) return sign + formatScaled(abs, 1e12, "T")
  if (abs >= 1e9) return sign + formatScaled(abs, 1e9, "B")
  if (abs >= 1e6) return sign + formatScaled(abs, 1e6, "M")
  if (abs >= 1e3) return sign + formatScaled(abs, 1e3, "k")
  // Small values: return plain number, strip trailing zeros
  return String(+abs.toFixed(2) * (value < 0 ? -1 : 1))
}

export function computeNiceTicks(
  min: number,
  max: number,
  targetCount = 5,
  allowNegative = false,
): number[] {
  if (min === max) {
    // Flat line — create a range around the value
    if (min === 0) return [-1, 0, 1]
    const mag = Math.pow(10, Math.floor(Math.log10(Math.abs(min))))
    const half = mag / 2
    const ticks: number[] = []
    for (let v = min - mag; v <= min + mag + half * 0.01; v += half) {
      ticks.push(Math.round(v * 1e10) / 1e10)
    }
    return ticks
  }

  const range = max - min
  const roughStep = range / targetCount
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)))
  const fraction = roughStep / magnitude

  let niceStep: number
  if (fraction <= 1) niceStep = magnitude
  else if (fraction <= 2) niceStep = 2 * magnitude
  else if (fraction <= 2.5) niceStep = 2.5 * magnitude
  else if (fraction <= 5) niceStep = 5 * magnitude
  else niceStep = 10 * magnitude

  const niceMin = Math.floor(min / niceStep) * niceStep
  const niceMax = Math.ceil(max / niceStep) * niceStep

  const ticks: number[] = []
  for (let v = niceMin; v <= niceMax + niceStep * 0.001; v += niceStep) {
    // Round to remove floating-point noise
    const rounded = Math.round(v / (niceStep * 1e-10)) * (niceStep * 1e-10)
    const tick = Math.round(rounded * 1e10) / 1e10
    if (!allowNegative && tick < 0) continue
    ticks.push(tick)
  }
  return ticks
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
