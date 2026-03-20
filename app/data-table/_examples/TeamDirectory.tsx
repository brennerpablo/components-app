"use client";

import {
  ColumnMetadata,
  DataTable,
} from "@/components/ui/data-table";

import { teamDirectoryData } from "../data";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

type Row = {
  name: string;
  email: string;
  department: string;
  role: string;
  startDate: string;
  salary: number;
};

const avatarColors = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
];

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (const ch of name) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

const columnsMetadata = [
  {
    columnId: "name",
    title: "Employee",
    type: "text",
    sortable: true,
    hideable: false,
    filters: { text: true, textColumns: ["email"] },
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const email = row.original.email;
      return (
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAvatarColor(name)}`}>
            {getInitials(name)}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </div>
      );
    },
  },
  {
    columnId: "department",
    title: "Department",
    type: "text",
    sortable: true,
    inferOptions: true,
    filters: { select: true },
  },
  {
    columnId: "role",
    title: "Role",
    type: "text",
    sortable: true,
  },
  {
    columnId: "startDate",
    title: "Start date",
    type: "date",
    sortable: true,
  },
  {
    columnId: "salary",
    title: "Salary",
    type: "number",
    sortable: true,
    aligned: "right",
    formatter: (value: unknown) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(value as number)}
      </span>
    ),
  },
] as const satisfies ColumnMetadata<Row>[];

export function TeamDirectory() {
  return (
    <DataTable<Row>
      columnsMetadata={columnsMetadata}
      data={teamDirectoryData}
      enableRowSelection
      enableRowActions
      onRowAction={{
        onEdit: (row) => alert(`Edit: ${row.name}`),
        onDelete: (row) => alert(`Delete: ${row.name}`),
      }}
      onBulkAction={{
        onEdit: (rows) => alert(`Bulk edit ${rows.length} employees`),
        onDelete: (rows) => alert(`Bulk delete ${rows.length} employees`),
      }}
      accentColor="blue-600"
      compact
      enablePagination={false}
      enableTextSelection={false}
    />
  );
}
