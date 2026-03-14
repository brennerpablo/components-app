import { format,subDays } from "date-fns"

const MACHINES = [
  "M-01", "M-02", "M-03", "M-04", "M-05",
  "M-06", "M-07", "M-08", "M-09", "M-10",
]

// Seeded PRNG (mulberry32) — same sequence on server and client
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s |= 0; s = s + 0x6d2b79f5 | 0
    let t = Math.imul(s ^ s >>> 15, 1 | s)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 0x100000000
  }
}

function weightedStatus(rand: () => number) {
  const r = rand()
  if (r < 0.55) return "green"
  if (r < 0.75) return "orange"
  if (r < 0.88) return "red"
  return "grey"
}

export const data = (function generateData() {
  const rand = seededRandom(42)
  const today = new Date()
  const result = []
  for (let d = 29; d >= 0; d--) {
    const date = format(subDays(today, d), "yyyy-MM-dd")
    for (const machine of MACHINES) {
      result.push({ row: machine, date, status: weightedStatus(rand) })
    }
  }
  return result
})()
