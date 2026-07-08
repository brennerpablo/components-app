// Deterministic mock datasets for the DataGrid demos. A seeded RNG keeps the
// data identical across SSR and client render (no hydration mismatch) and
// stable between reloads.

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T>(rng: () => number, arr: readonly T[]): T =>
  arr[Math.floor(rng() * arr.length)];

const intBetween = (rng: () => number, lo: number, hi: number): number =>
  Math.floor(rng() * (hi - lo + 1)) + lo;

/** ISO YYYY-MM-DD `daysAgo` before 2025-06-30 (fixed anchor, no `Date.now`). */
function isoDaysAgo(daysAgo: number): string {
  const anchor = Date.UTC(2025, 5, 30);
  return new Date(anchor - daysAgo * 86_400_000).toISOString().slice(0, 10);
}

// ── Transactions ───────────────────────────────────────────────────────────

export type TransactionRow = {
  id: string;
  date: string;
  merchant: string;
  category: string;
  account: string;
  amount: number;
  status: string;
  receiptUrl: string;
};

const MERCHANTS = [
  "Amazon", "Whole Foods", "Shell", "Delta Air Lines", "Apple", "Uber",
  "Starbucks", "Home Depot", "Netflix", "Costco", "Spotify", "Marriott",
  "Best Buy", "Trader Joe's", "AT&T", "Chevron", "Target", "DoorDash",
];
const TX_CATEGORIES = [
  "Groceries", "Travel", "Utilities", "Dining", "Software", "Hardware",
  "Fuel", "Entertainment", "Lodging",
];
const ACCOUNTS = ["Checking ••4021", "Amex ••1009", "Visa ••7734", "Savings ••8890"];
const TX_STATUS = ["Cleared", "Pending", "Disputed", "Refunded"];

export const transactionsData: TransactionRow[] = (() => {
  const rng = mulberry32(1337);
  return Array.from({ length: 1200 }, (_, i) => {
    const amount = Number(
      (rng() * (rng() < 0.15 ? 4200 : 480) + 4).toFixed(2),
    );
    return {
      id: `TX-${(100000 + i).toString()}`,
      date: isoDaysAgo(intBetween(rng, 0, 540)),
      merchant: pick(rng, MERCHANTS),
      category: pick(rng, TX_CATEGORIES),
      account: pick(rng, ACCOUNTS),
      amount,
      status: pick(rng, TX_STATUS),
      receiptUrl: `https://example.com/receipts/${100000 + i}`,
    };
  });
})();

// ── Employees ────────────────────────────────────────────────────────────────

export type EmployeeRow = {
  id: string;
  name: string;
  email: string;
  department: string;
  location: string;
  title: string;
  startDate: string;
  salary: number;
  status: string;
};

const FIRST = [
  "Ava", "Liam", "Noah", "Emma", "Olivia", "Ethan", "Mia", "Lucas", "Sophia",
  "Mason", "Isabella", "Leo", "Zoe", "Ivan", "Nina", "Omar", "Priya", "Diego",
  "Hana", "Yusuf",
];
const LAST = [
  "Chen", "Patel", "Garcia", "Silva", "Okoye", "Kim", "Rossi", "Nguyen",
  "Haddad", "Novak", "Ivanova", "Costa", "Fischer", "Mbeki", "Tanaka",
  "Sørensen", "Reyes", "Kowalski",
];
const DEPARTMENTS = [
  "Engineering", "Sales", "Marketing", "Finance", "Support", "Design",
  "People Ops", "Legal",
];
const LOCATIONS = [
  "San Francisco", "New York", "London", "Berlin", "Toronto", "Singapore",
  "Remote", "São Paulo",
];
const TITLES = [
  "Associate", "Specialist", "Senior", "Lead", "Manager", "Director",
];
const EMP_STATUS = ["Active", "On leave", "Contractor"];

export const employeesData: EmployeeRow[] = (() => {
  const rng = mulberry32(90210);
  return Array.from({ length: 850 }, (_, i) => {
    const first = pick(rng, FIRST);
    const last = pick(rng, LAST);
    return {
      id: `E-${(2000 + i).toString()}`,
      name: `${first} ${last}`,
      email: `${first}.${last}`.toLowerCase().replace(/[^a-z.]/g, "") + "@acme.io",
      department: pick(rng, DEPARTMENTS),
      location: pick(rng, LOCATIONS),
      title: pick(rng, TITLES),
      startDate: isoDaysAgo(intBetween(rng, 30, 3600)),
      salary: intBetween(rng, 62, 245) * 1000,
      status: pick(rng, EMP_STATUS),
    };
  });
})();

// ── Servers ──────────────────────────────────────────────────────────────────

export type ServerRow = {
  host: string;
  region: string;
  type: string;
  cpu: number;
  memGb: number;
  costMonth: number;
  uptime: number;
  lastSeen: string;
};

const REGIONS = [
  "us-east-1", "us-west-2", "eu-west-1", "eu-central-1", "ap-south-1",
  "sa-east-1",
];
const SERVER_TYPES = ["web", "worker", "db", "cache", "gateway", "batch"];

export const serversData: ServerRow[] = (() => {
  const rng = mulberry32(42424);
  return Array.from({ length: 2000 }, (_, i) => {
    const cpu = intBetween(rng, 2, 64);
    return {
      host: `${pick(rng, SERVER_TYPES)}-${pick(rng, REGIONS)}-${(i % 240)
        .toString()
        .padStart(3, "0")}`,
      region: pick(rng, REGIONS),
      type: pick(rng, SERVER_TYPES),
      cpu,
      memGb: cpu * intBetween(rng, 2, 8),
      costMonth: Number((cpu * (rng() * 12 + 6)).toFixed(2)),
      uptime: Number((90 + rng() * 10).toFixed(2)),
      lastSeen: isoDaysAgo(intBetween(rng, 0, 14)),
    };
  });
})();
