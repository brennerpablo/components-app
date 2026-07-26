export const portfolioData = [
  { assetClass: "Equities", amount: 4_820_000 },
  { assetClass: "Fixed Income", amount: 3_140_000 },
  { assetClass: "Real Estate", amount: 1_260_000 },
  { assetClass: "Cash", amount: 640_000 },
  { assetClass: "Commodities", amount: 310_000 },
]

export const trafficData = [
  { source: "Organic Search", sessions: 18_420 },
  { source: "Direct", sessions: 9_310 },
  { source: "Referral", sessions: 4_205 },
  { source: "Social", sessions: 2_180 },
  { source: "Email", sessions: 1_040 },
]

/** Includes a near-zero slice to demonstrate `minSegmentPercent`. */
export const skewedData = [
  { segment: "Enterprise", revenue: 9_800_000 },
  { segment: "Mid-Market", revenue: 2_100_000 },
  { segment: "SMB", revenue: 420_000 },
  { segment: "Trial", revenue: 4_000 },
]

export const emptyData: { assetClass: string; amount: number }[] = []
