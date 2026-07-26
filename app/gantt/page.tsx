"use client";

import { format } from "date-fns";
import {
  AlertTriangle,
  CircleDashed,
  Lock,
  Plus,
  Settings2,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GanttColor, GanttColumn } from "@/components/ui/gantt";
import { Gantt, GANTT_COLOR_CLASSES } from "@/components/ui/gantt";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import type { StageMeta, TaskMeta, TaskStatus, TechMeta } from "./data";
import {
  dispatchRows,
  JOB_TYPES,
  outsideShift,
  projectRows,
  RUN_STATUS,
  runRows,
  TASK_STATUS_LABEL,
} from "./data";
import { GanttDocs } from "./docs";

/* ── Shared bits ──────────────────────────────────────────────────────────── */

/** Legend — identity is never carried by colour alone. */
function Legend({ items }: { items: { label: string; color: GanttColor }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className={cn(
              "size-2.5 rounded-[3px]",
              GANTT_COLOR_CLASSES[item.color].dot,
            )}
          />
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

const INITIALS = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

function AvatarStack({ names, max = 3 }: { names: string[]; max?: number }) {
  if (names.length === 0) {
    return (
      <span className="flex size-6 items-center justify-center rounded-full border border-dashed border-border" />
    );
  }
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  return (
    <div className="flex items-center -space-x-1.5">
      {shown.map((name) => (
        <span
          key={name}
          title={name}
          className="flex size-6 items-center justify-center rounded-full border border-background bg-muted text-[10px] font-medium text-muted-foreground"
        >
          {INITIALS(name)}
        </span>
      ))}
      {rest > 0 && (
        <span className="flex size-6 items-center justify-center rounded-full border border-background bg-muted text-[10px] font-medium text-muted-foreground">
          +{rest}
        </span>
      )}
    </div>
  );
}

/* ── 1. Project plan ──────────────────────────────────────────────────────── */

const TASK_BADGE: Record<TaskStatus, "success" | "default" | "warning" | "neutral"> = {
  done: "success",
  "in-progress": "default",
  "in-review": "warning",
  todo: "neutral",
};

const projectColumns: GanttColumn<TaskMeta>[] = [
  {
    id: "name",
    header: "Name",
    width: 230,
    cell: (row, ctx) => (
      <span
        className={cn(
          "flex items-center gap-1.5 truncate text-sm",
          ctx.isGroup ? "font-medium text-foreground" : "text-foreground",
        )}
      >
        <span className="truncate">{row.label}</span>
        {row.data?.locked && (
          <Lock className="size-3 shrink-0 text-muted-foreground" aria-label="Locked" />
        )}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    width: 110,
    cell: (row) =>
      row.data ? (
        <Badge variant={TASK_BADGE[row.data.status]} size="sm">
          {TASK_STATUS_LABEL[row.data.status]}
        </Badge>
      ) : null,
  },
  {
    id: "assignee",
    header: "Assignee",
    width: 100,
    cell: (row, ctx) =>
      ctx.isGroup && !row.data?.assignees.length ? null : (
        <AvatarStack names={row.data?.assignees ?? []} />
      ),
  },
  {
    id: "due",
    header: "Due date",
    width: 100,
    cell: (row) => {
      const due = row.data?.due;
      if (!due) return null;
      const overdue = row.data?.status !== "done" && due < new Date(2026, 6, 22);
      return (
        <span
          className={cn(
            "text-xs tabular-nums",
            overdue ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {format(due, "MMM d")}
        </span>
      );
    },
  },
];

/* ── 2. Dispatch board ────────────────────────────────────────────────────── */

const dispatchColumns: GanttColumn<TechMeta>[] = [
  {
    id: "technician",
    header: "Technician",
    width: 260,
    cell: (row, ctx) => (
      <span className="flex min-w-0 items-center gap-2">
        {!ctx.isGroup && (
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
            {INITIALS(row.label)}
          </span>
        )}
        {/* The name keeps its width first; role gives way before the badge does. */}
        <span
          className={cn(
            "shrink-0 text-sm",
            ctx.isGroup ? "font-medium" : "text-foreground",
          )}
        >
          {row.label}
        </span>
        {/* A clash is the more urgent signal — the role yields the space to it. */}
        {!row.data?.clash && (row.data?.role || row.data?.zone) && (
          <span className="min-w-0 truncate text-xs text-muted-foreground">
            · {row.data.role ?? row.data.zone}
          </span>
        )}
        {row.data?.clash && (
          <Badge variant="error" size="sm" className="shrink-0">
            <AlertTriangle className="size-3" />
            Clash
          </Badge>
        )}
      </span>
    ),
  },
  {
    id: "shift",
    header: "Shift",
    width: 110,
    cell: (row) =>
      row.data?.shift ? (
        <span className="text-xs text-muted-foreground">{row.data.shift}</span>
      ) : null,
  },
  {
    id: "booked",
    header: "Booked",
    width: 170,
    cell: (row) => {
      const { bookedHours, capacityHours, jobs } = row.data ?? {};
      if (bookedHours == null || !capacityHours) return null;
      const ratio = Math.min(1, bookedHours / capacityHours);
      const hours = Number.isInteger(bookedHours)
        ? `${bookedHours}h`
        : `${Math.floor(bookedHours)}h ${Math.round((bookedHours % 1) * 60)}m`;
      return (
        <div className="flex items-center gap-2">
          <span className="h-1 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-foreground/70"
              style={{ width: `${ratio * 100}%` }}
            />
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {hours}
            {jobs != null && ` · ${jobs} jobs`}
          </span>
        </div>
      );
    },
  },
  {
    id: "next-free",
    header: "Next free",
    width: 90,
    cell: (row) =>
      row.data?.nextFree ? (
        <span className="text-xs tabular-nums text-muted-foreground">
          {row.data.nextFree}
        </span>
      ) : null,
  },
];

/* ── 3. Agent run board ───────────────────────────────────────────────────── */

const STAGE_ICON = {
  gate: ShieldCheck,
  tool: Wrench,
  task: CircleDashed,
} as const;

const runColumns: GanttColumn<StageMeta>[] = [
  {
    id: "stage",
    header: "Stage",
    width: 240,
    cell: (row, ctx) => {
      const Icon = row.data?.kind ? STAGE_ICON[row.data.kind] : null;
      return (
        <span className="flex items-center gap-1.5 truncate">
          {Icon && !ctx.isGroup && (
            <Icon className="size-3.5 shrink-0 text-muted-foreground" />
          )}
          <span
            className={cn("truncate text-sm", ctx.isGroup && "font-medium")}
          >
            {row.label}
          </span>
          {row.data?.runId && (
            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              {row.data.runId}
            </span>
          )}
        </span>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    width: 120,
    cell: (row) => {
      if (!row.data) return null;
      const status = RUN_STATUS[row.data.status];
      return (
        <span className="flex items-center gap-1.5">
          <span
            className={cn(
              "size-1.5 shrink-0 rounded-full",
              GANTT_COLOR_CLASSES[status.color].dot,
            )}
          />
          <span className="truncate text-xs text-muted-foreground">
            {status.label}
          </span>
        </span>
      );
    },
  },
  {
    id: "slack",
    header: "Slack",
    width: 90,
    align: "right",
    cell: (row) =>
      row.data?.slack ? (
        <span
          className={cn(
            "text-xs tabular-nums",
            row.data.blocked ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {row.data.slack}
        </span>
      ) : null,
  },
];

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function GanttPage() {
  return (
    <main className="mx-auto max-w-300 px-6 py-10">
      <DemoBreadcrumb />

      <header className="mb-8 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Gantt</h1>
        <p className="text-sm text-muted-foreground">
          A tree-and-timeline chart: a sticky column pane on the left, a scrollable
          time grid on the right. Groups roll their children up into a summary
          track, overlapping bars stack into lanes, and the scale switches between
          hourly and yearly columns.
        </p>
      </header>

      <Tabs defaultValue="project">
        <TabsList className="mb-5">
          <TabsTrigger value="project">Project plan</TabsTrigger>
          <TabsTrigger value="dispatch">Dispatch board</TabsTrigger>
          <TabsTrigger value="runs">Agent runs</TabsTrigger>
        </TabsList>

        {/* 1 — month scale, nested groups, milestone, rollups */}
        <TabsContent value="project" className="space-y-4">
          <Legend
            items={[
              { label: "Bug Tracking", color: "blue" },
              { label: "Mobile crash", color: "emerald" },
              { label: "Release 2.4", color: "violet" },
            ]}
          />
          <Gantt<TaskMeta>
            rows={projectRows}
            columns={projectColumns}
            defaultScale="month"
            defaultDate={new Date(2026, 6, 22)}
            height={540}
            actions={
              <>
                <AvatarStack
                  names={["Ana Ruiz", "Tom Vale", "Lena Fox", "Kofi Mensah"]}
                />
                <Button size="sm">
                  <Plus className="size-4" />
                  Add task
                </Button>
              </>
            }
          />
          <p className="text-xs text-muted-foreground">
            Bars are coloured by workstream, so a colour always means the same
            thing. Group rows show a rolled-up span with duration-weighted
            progress; <strong>Ship 2.4</strong> is a milestone.
          </p>
        </TabsContent>

        {/* 2 — day scale, overlap lanes, shift shading */}
        <TabsContent value="dispatch" className="space-y-4">
          <Legend items={JOB_TYPES.map((t) => ({ label: t.label, color: t.color }))} />
          <Gantt<TechMeta>
            rows={dispatchRows}
            columns={dispatchColumns}
            defaultScale="day"
            scales={["day", "week"]}
            defaultDate={new Date(2026, 6, 19)}
            nonWorking={outsideShift}
            summaryRows={false}
            height={520}
            actions={
              <Button size="sm">
                <Plus className="size-4" />
                Book job
              </Button>
            }
          />
          <p className="text-xs text-muted-foreground">
            Double-booked technicians (Alex, Theo) get extra lanes and a taller
            row instead of overlapping bars. Hours outside the shift envelope are
            shaded.
          </p>
        </TabsContent>

        {/* 3 — day scale, retries and shards in lanes, outline variant for queued */}
        <TabsContent value="runs" className="space-y-4">
          <Legend
            items={[
              { label: "Succeeded", color: "emerald" },
              { label: "Running", color: "blue" },
              { label: "Waiting", color: "amber" },
              { label: "Failed", color: "rose" },
              { label: "Queued", color: "neutral" },
            ]}
          />
          <Gantt<StageMeta>
            rows={runRows}
            columns={runColumns}
            defaultScale="day"
            scales={["day"]}
            defaultDate={new Date(2026, 6, 22)}
            height={520}
            actions={
              <>
                <Button variant="outline" size="sm">
                  <Settings2 className="size-4" />
                  Settings
                </Button>
                <Button size="sm">
                  <Plus className="size-4" />
                  New stage
                </Button>
              </>
            }
          />
          <p className="text-xs text-muted-foreground">
            Retry attempts and parallel shards share a stage row and stack into
            lanes. Queued stages render as dashed outlines — planned, not run.
          </p>
        </TabsContent>
      </Tabs>

      <GanttDocs />
    </main>
  );
}
