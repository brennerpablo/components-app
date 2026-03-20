"use client";

import { Badge, BadgeProps } from "@/components/ui/badge";
import {
  ColumnMetadata,
  DataTable,
} from "@/components/ui/data-table";

import { projectTasksData } from "../data";

type Row = {
  title: string;
  assignee: string;
  priority: string;
  status: string;
  progress: number;
  dueDate: string;
};

const priorityVariants: Record<string, BadgeProps["variant"]> = {
  Critical: "error",
  High: "warning",
  Medium: "default",
  Low: "neutral",
};

const statusVariants: Record<string, BadgeProps["variant"]> = {
  Done: "success",
  "In Progress": "default",
  "In Review": "warning",
  Blocked: "error",
  Backlog: "neutral",
};

const columnsMetadata = [
  {
    columnId: "title",
    title: "Task",
    type: "text",
    sortable: true,
    hideable: false,
    filters: { text: true },
  },
  {
    columnId: "assignee",
    title: "Assignee",
    type: "text",
    sortable: true,
    inferOptions: true,
    filters: { checkboxSearch: true },
  },
  {
    columnId: "priority",
    title: "Priority",
    type: "text",
    sortable: true,
    options: [
      { value: "Critical", label: "Critical" },
      { value: "High", label: "High" },
      { value: "Medium", label: "Medium" },
      { value: "Low", label: "Low" },
    ],
    filters: { checkbox: true },
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        <Badge variant={priorityVariants[priority] ?? "neutral"}>
          {priority}
        </Badge>
      );
    },
  },
  {
    columnId: "status",
    title: "Status",
    type: "text",
    sortable: true,
    inferOptions: true,
    filters: { checkboxSearch: { multiple: false } },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={statusVariants[status] ?? "neutral"}>
          {status}
        </Badge>
      );
    },
  },
  {
    columnId: "progress",
    title: "Progress",
    type: "number",
    sortable: true,
    filters: { percentage: true },
    cell: ({ row }) => {
      const value = row.getValue("progress") as number;
      const color =
        value === 100
          ? "bg-emerald-500"
          : value >= 60
            ? "bg-blue-500"
            : value >= 30
              ? "bg-amber-500"
              : "bg-zinc-400";
      return (
        <div className="flex items-center gap-2.5">
          <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${color}`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">{value}%</span>
        </div>
      );
    },
  },
  {
    columnId: "dueDate",
    title: "Due Date",
    type: "date",
    sortable: true,
    aligned: "left",
    filters: { date: true },
  },
] as const satisfies ColumnMetadata<Row>[];

export function ProjectTasks() {
  return (
    <DataTable<Row>
      columnsMetadata={columnsMetadata}
      data={projectTasksData}
      enableRowSelection
      onBulkAction={{
        onEdit: (rows) => alert(`Bulk edit ${rows.length} tasks`),
        onDelete: (rows) => alert(`Bulk delete ${rows.length} tasks`),
      }}
      accentColor="indigo-500"
      enableFullscreen
      paginationDisplayTop
      toolbarIconsOnly
      enableTextSelection={false}
    />
  );
}
