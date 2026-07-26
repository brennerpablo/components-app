import type { GanttRow } from "@/components/ui/gantt";

/** July 2026 — all three demos are anchored here so the boards line up. */
const jul = (day: number, hour = 0, minute = 0) => new Date(2026, 6, day, hour, minute);

/* ────────────────────────────────────────────────────────────────────────────
   1. Project plan — month scale, nested groups, colour by workstream
   ──────────────────────────────────────────────────────────────────────── */

export type TaskStatus = "todo" | "in-progress" | "in-review" | "done";

export interface TaskMeta {
  status: TaskStatus;
  assignees: string[];
  due?: Date;
  /** Rendered with a lock glyph — the task is frozen for the release. */
  locked?: boolean;
}

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  "in-review": "In Review",
  done: "Done",
};

export const projectRows: GanttRow<TaskMeta>[] = [
  {
    id: "bug-tracking",
    label: "Bug Tracking",
    data: { status: "in-progress", assignees: [] },
    children: [
      {
        id: "login-redirect",
        label: "Login redirect",
        data: { status: "done", assignees: ["Ana Ruiz", "Tom Vale"], due: jul(15) },
        bars: [
          {
            id: "login-redirect-b",
            start: jul(13),
            end: jul(15),
            label: "Login redirect",
            color: "blue",
            progress: 1,
          },
        ],
      },
      {
        id: "access-rules",
        label: "Access rules",
        data: { status: "in-progress", assignees: ["Kofi Mensah"], due: jul(20) },
        bars: [
          {
            id: "access-rules-b",
            start: jul(16),
            end: jul(20),
            label: "Access rules",
            color: "blue",
            progress: 0.8,
          },
        ],
      },
      {
        id: "mobile-crash",
        label: "Mobile crash",
        data: { status: "in-progress", assignees: ["Ana Ruiz", "Lena Fox", "Kofi Mensah"] },
        children: [
          {
            id: "ios-audit",
            label: "iOS audit",
            data: { status: "in-progress", assignees: ["Lena Fox"], due: jul(22) },
            bars: [
              {
                id: "ios-audit-b",
                start: jul(18),
                end: jul(22),
                label: "iOS audit",
                color: "emerald",
                progress: 0.5,
              },
            ],
          },
          {
            id: "android-audit",
            label: "Android audit",
            data: { status: "todo", assignees: [], due: jul(28) },
            bars: [
              {
                id: "android-audit-b",
                start: jul(23),
                end: jul(28),
                label: "Android audit",
                color: "emerald",
                progress: 0,
              },
            ],
          },
        ],
      },
      {
        id: "button-truncation",
        label: "Button truncation",
        data: { status: "in-review", assignees: ["Tom Vale"], due: jul(16) },
        bars: [
          {
            id: "button-truncation-b",
            start: jul(14),
            end: jul(16),
            label: "Button truncation",
            color: "blue",
            progress: 0.9,
          },
        ],
      },
      {
        id: "offline-sync",
        label: "Offline sync",
        data: { status: "todo", assignees: ["Ana Ruiz", "Lena Fox"], due: jul(27) },
        bars: [
          {
            id: "offline-sync-b",
            start: jul(20),
            end: jul(27),
            label: "Offline sync",
            color: "blue",
            progress: 0.35,
          },
        ],
      },
      {
        id: "api-key-rotation",
        label: "API key rotation",
        data: { status: "done", assignees: ["Kofi Mensah"], due: jul(14) },
        bars: [
          {
            id: "api-key-rotation-b",
            start: jul(10),
            end: jul(14),
            label: "API key rotation",
            color: "blue",
            progress: 1,
          },
        ],
      },
      {
        id: "session-replay",
        label: "Session replay",
        data: { status: "todo", assignees: [] },
      },
    ],
  },
  {
    id: "release-24",
    label: "Release 2.4",
    data: { status: "in-progress", assignees: [] },
    children: [
      {
        id: "data-export",
        label: "Data export",
        data: { status: "in-progress", assignees: ["Ana Ruiz", "Tom Vale"], due: jul(22) },
        bars: [
          {
            id: "data-export-b",
            start: jul(17),
            end: jul(22),
            label: "Data export",
            color: "violet",
            progress: 0.6,
          },
        ],
      },
      {
        id: "form-validation",
        label: "Form validation",
        data: { status: "todo", assignees: ["Lena Fox"], due: jul(27) },
        bars: [
          {
            id: "form-validation-b",
            start: jul(21),
            end: jul(27),
            label: "Form validation",
            color: "violet",
            progress: 0.2,
          },
        ],
      },
      {
        id: "nav-focus",
        label: "Nav focus",
        data: { status: "todo", assignees: [], due: jul(29) },
        bars: [
          {
            id: "nav-focus-b",
            start: jul(24),
            end: jul(29),
            label: "Nav focus",
            color: "violet",
            progress: 0,
          },
        ],
      },
      {
        id: "perf-audit",
        label: "Perf audit",
        data: { status: "in-review", assignees: ["Kofi Mensah"], due: jul(22), locked: true },
        bars: [
          {
            id: "perf-audit-b",
            start: jul(15),
            end: jul(22),
            label: "Perf audit",
            color: "violet",
            progress: 0.45,
          },
        ],
      },
      {
        id: "ship-24",
        label: "Ship 2.4",
        data: { status: "todo", assignees: [], due: jul(31) },
        bars: [
          {
            id: "ship-24-b",
            start: jul(31),
            end: jul(31),
            label: "Ship 2.4",
            color: "violet",
            milestone: true,
          },
        ],
      },
    ],
  },
];

/* ────────────────────────────────────────────────────────────────────────────
   2. Dispatch board — day scale, overlapping jobs stack into lanes
   ──────────────────────────────────────────────────────────────────────── */

export type JobType = "install" | "repair" | "inspection" | "emergency";

export const JOB_TYPES: { id: JobType; label: string; color: "blue" | "emerald" | "violet" | "rose" }[] = [
  { id: "install", label: "Install", color: "blue" },
  { id: "repair", label: "Repair", color: "emerald" },
  { id: "inspection", label: "Inspection", color: "violet" },
  { id: "emergency", label: "Emergency", color: "rose" },
];

const JOB_COLOR = Object.fromEntries(JOB_TYPES.map((t) => [t.id, t.color])) as Record<
  JobType,
  "blue" | "emerald" | "violet" | "rose"
>;

export interface TechMeta {
  role?: string;
  zone?: string;
  shift?: string;
  bookedHours?: number;
  capacityHours?: number;
  jobs?: number;
  nextFree?: string;
  clash?: boolean;
}

const job = (
  id: string,
  label: string,
  type: JobType,
  from: [number, number],
  to: [number, number],
) => ({
  id,
  label,
  color: JOB_COLOR[type],
  start: jul(19, from[0], from[1]),
  end: jul(19, to[0], to[1]),
  startLabel: from[1] === 0 ? `${from[0] % 12 || 12}${from[0] < 12 ? "am" : "pm"}` : undefined,
});

export const dispatchRows: GanttRow<TechMeta>[] = [
  {
    id: "north-crew",
    label: "North Crew",
    data: { zone: "Zone 1", clash: true, bookedHours: 22.5, capacityHours: 27, jobs: 12 },
    children: [
      {
        id: "mira",
        label: "Mira Stone",
        data: {
          role: "HVAC Lead",
          shift: "8am to 5pm",
          bookedHours: 7.5,
          capacityHours: 9,
          nextFree: "11:30am",
        },
        bars: [
          job("mira-1", "Lakeside Deli", "repair", [8, 0], [10, 30]),
          job("mira-2", "Rowan Apartments", "install", [11, 30], [13, 30]),
          job("mira-3", "Halsey Court", "inspection", [14, 30], [16, 0]),
        ],
      },
      {
        id: "alex",
        label: "Alex Johnson",
        data: {
          role: "HVAC",
          shift: "8am to 5pm",
          bookedHours: 7.5,
          capacityHours: 9,
          nextFree: "8am",
          clash: true,
        },
        bars: [
          job("alex-1", "Ridgeway School", "install", [8, 0], [11, 0]),
          job("alex-2", "Halsey Court", "repair", [10, 0], [12, 0]),
          job("alex-3", "Ash Street Lofts", "install", [13, 0], [15, 30]),
        ],
      },
      {
        id: "sarah",
        label: "Sarah Chen",
        data: {
          role: "Plumbing",
          shift: "8am to 5pm",
          bookedHours: 7.5,
          capacityHours: 9,
          nextFree: "12:30pm",
        },
        bars: [
          job("sarah-1", "Nia Okafor", "repair", [9, 0], [11, 0]),
          job("sarah-2", "Marlow Gym", "inspection", [11, 30], [13, 0]),
          job("sarah-3", "Bay View Hotel", "install", [14, 0], [17, 0]),
        ],
      },
    ],
  },
  {
    id: "south-crew",
    label: "South Crew",
    data: { zone: "Zone 4", clash: true, bookedHours: 25, capacityHours: 32, jobs: 14 },
    children: [
      {
        id: "leo",
        label: "Leo Grant",
        data: {
          role: "HVAC",
          shift: "9am to 6pm",
          bookedHours: 6,
          capacityHours: 9,
          nextFree: "1pm",
        },
        bars: [
          job("leo-1", "Alder Offices", "install", [9, 0], [11, 30]),
          job("leo-2", "Priya Raman", "repair", [12, 0], [14, 0]),
          job("leo-3", "Stone Yard", "emergency", [15, 30], [17, 30]),
        ],
      },
      {
        id: "sofia",
        label: "Sofia Romero",
        data: {
          role: "Electrical",
          shift: "8am to 5pm",
          bookedHours: 6.5,
          capacityHours: 9,
          nextFree: "11am",
        },
        bars: [
          job("sofia-1", "Bramble Cafe", "install", [8, 0], [12, 0]),
          job("sofia-2", "Olive Court", "repair", [12, 30], [14, 30]),
        ],
      },
      {
        id: "theo",
        label: "Theo Park",
        data: {
          role: "Plumbing",
          shift: "8am to 5pm",
          bookedHours: 8.5,
          capacityHours: 9,
          nextFree: "8am",
          clash: true,
        },
        bars: [
          job("theo-1", "Kwan Residence", "repair", [9, 0], [11, 0]),
          job("theo-2", "Ivy Lane Cafe", "inspection", [10, 0], [12, 0]),
          job("theo-3", "Dunmore Court", "install", [10, 30], [13, 0]),
          job("theo-4", "Ferry Road Diner", "emergency", [14, 0], [16, 0]),
        ],
      },
      {
        id: "jonas",
        label: "Jonas Beck",
        data: {
          role: "Apprentice",
          shift: "10am to 3pm",
          bookedHours: 4,
          capacityHours: 5,
          nextFree: "12pm",
        },
        bars: [
          job("jonas-1", "Willow Terrace", "inspection", [10, 0], [12, 0]),
          job("jonas-2", "Ambrose Hardware", "install", [13, 0], [15, 0]),
        ],
      },
    ],
  },
];

/** Shift envelope for the dispatch board — anything outside is shaded. */
export function outsideShift(columnStart: Date): boolean {
  const hour = columnStart.getHours();
  return hour < 8 || hour >= 18;
}

/* ────────────────────────────────────────────────────────────────────────────
   3. Agent run board — day scale, retries stack, queued stages are outlines
   ──────────────────────────────────────────────────────────────────────── */

export type RunStatus = "succeeded" | "failed" | "running" | "queued" | "waiting";

export const RUN_STATUS: Record<
  RunStatus,
  { label: string; color: "emerald" | "rose" | "blue" | "amber" | "neutral" }
> = {
  succeeded: { label: "Succeeded", color: "emerald" },
  failed: { label: "Failed", color: "rose" },
  running: { label: "Running", color: "blue" },
  queued: { label: "Queued", color: "neutral" },
  waiting: { label: "Waiting", color: "amber" },
};

export interface StageMeta {
  status: RunStatus;
  slack?: string;
  blocked?: boolean;
  kind?: "task" | "gate" | "tool";
  runId?: string;
}

const at = (hour: number, minute = 0) => jul(22, hour, minute);

export const runRows: GanttRow<StageMeta>[] = [
  {
    id: "refund",
    label: "Refund Escalation",
    data: { status: "failed", slack: "0m", runId: "PB-31" },
    children: [
      {
        id: "refund-intake",
        label: "Intake & Classify",
        data: { status: "succeeded", slack: "0m", kind: "tool" },
        bars: [
          {
            id: "refund-intake-b",
            start: at(8, 0),
            end: at(8, 40),
            label: "Intake",
            color: "emerald",
            progress: 1,
          },
        ],
      },
      {
        id: "refund-policy",
        label: "Policy Check",
        data: { status: "succeeded", slack: "0m", kind: "task" },
        bars: [
          {
            id: "refund-policy-b",
            start: at(8, 40),
            end: at(9, 5),
            label: "Policy",
            color: "emerald",
            progress: 1,
          },
        ],
      },
      {
        id: "refund-finance",
        label: "Finance Approval",
        data: { status: "succeeded", slack: "0m", kind: "gate" },
        bars: [
          {
            id: "refund-finance-b",
            start: at(9, 5),
            end: at(10, 10),
            label: "Finance",
            color: "emerald",
            progress: 1,
          },
        ],
      },
      {
        id: "refund-capture",
        label: "Capture Refund",
        data: { status: "failed", slack: "0m", kind: "tool" },
        // Three attempts on the same stage — they overlap, so they stack in lanes.
        bars: [
          {
            id: "refund-capture-1",
            start: at(10, 10),
            end: at(10, 35),
            label: "Attempt 1",
            color: "rose",
          },
          {
            id: "refund-capture-2",
            start: at(10, 25),
            end: at(10, 50),
            label: "Attempt 2",
            color: "rose",
          },
          {
            id: "refund-capture-3",
            start: at(10, 40),
            end: at(11, 5),
            label: "Attempt 3",
            color: "rose",
          },
        ],
      },
      {
        id: "refund-notify",
        label: "Notify Customer",
        data: { status: "queued", slack: "Blocked", blocked: true, kind: "tool" },
        bars: [
          {
            id: "refund-notify-b",
            start: at(11, 30),
            end: at(12, 0),
            label: "Notify",
            color: "neutral",
            variant: "outline",
          },
        ],
      },
    ],
  },
  {
    id: "contract",
    label: "Contract Ingest",
    data: { status: "running", slack: "30m", runId: "PB-44" },
    children: [
      {
        id: "contract-fetch",
        label: "Fetch Documents",
        data: { status: "succeeded", slack: "30m", kind: "task" },
        bars: [
          {
            id: "contract-fetch-b",
            start: at(9, 0),
            end: at(9, 30),
            label: "Fetch",
            color: "emerald",
            progress: 1,
          },
        ],
      },
      {
        id: "contract-parse",
        label: "Parse Batch",
        data: { status: "running", slack: "30m", kind: "tool" },
        // Three shards running in parallel.
        bars: [
          {
            id: "contract-parse-1",
            start: at(9, 30),
            end: at(11, 0),
            label: "Shard 1",
            color: "blue",
            progress: 0.7,
          },
          {
            id: "contract-parse-2",
            start: at(9, 35),
            end: at(10, 40),
            label: "Shard 2",
            color: "blue",
            progress: 1,
          },
          {
            id: "contract-parse-3",
            start: at(9, 40),
            end: at(10, 20),
            label: "Shard 3",
            color: "blue",
            progress: 1,
          },
        ],
      },
      {
        id: "contract-summarize",
        label: "Summarize",
        data: { status: "queued", slack: "30m", kind: "tool" },
        bars: [
          {
            id: "contract-summarize-b",
            start: at(11, 30),
            end: at(12, 15),
            label: "Summarize",
            color: "neutral",
            variant: "outline",
          },
        ],
      },
      {
        id: "contract-risk",
        label: "Risk Review",
        data: { status: "queued", slack: "30m", kind: "gate" },
        bars: [
          {
            id: "contract-risk-b",
            start: at(12, 15),
            end: at(13, 0),
            label: "Risk Review",
            color: "neutral",
            variant: "outline",
          },
        ],
      },
    ],
  },
  {
    id: "steward",
    label: "Data Steward Sweep",
    data: { status: "waiting", slack: "3h", runId: "PB-19" },
    children: [
      {
        id: "steward-snapshot",
        label: "Snapshot",
        data: { status: "succeeded", slack: "6h", kind: "task" },
        bars: [
          {
            id: "steward-snapshot-b",
            start: at(7, 15),
            end: at(8, 0),
            label: "Snapshot",
            color: "emerald",
            progress: 1,
          },
        ],
      },
      {
        id: "steward-dedupe",
        label: "Dedupe Records",
        data: { status: "waiting", slack: "3h", kind: "tool" },
        bars: [
          {
            id: "steward-dedupe-b",
            start: at(8, 30),
            end: at(11, 45),
            label: "Dedupe Records",
            color: "amber",
            progress: 0.55,
          },
        ],
      },
      {
        id: "steward-publish",
        label: "Publish",
        data: { status: "queued", slack: "3h", kind: "gate" },
        bars: [
          {
            id: "steward-publish-b",
            start: at(12, 30),
            end: at(13, 15),
            label: "Publish",
            color: "neutral",
            variant: "outline",
          },
        ],
      },
    ],
  },
];
