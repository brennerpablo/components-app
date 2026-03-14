"use client";

import { format } from "date-fns";
import { AlertTriangle, CalendarDays, Cpu } from "lucide-react";
import { useState } from "react";

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StatusMap } from "@/components/ui/status-map";
import { Textarea } from "@/components/ui/textarea";

import { data } from "./data";
import { StatusMapDocs } from "./docs";

const STATUS_STYLES: Record<string, { dot: string; text: string; bg: string }> =
  {
    green: {
      dot: "bg-emerald-500",
      text: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    orange: {
      dot: "bg-amber-400",
      text: "text-amber-600",
      bg: "bg-amber-400/10",
    },
    red: {
      dot: "bg-rose-500",
      text: "text-rose-600",
      bg: "bg-rose-500/10",
    },
    grey: {
      dot: "bg-muted-foreground/40",
      text: "text-muted-foreground",
      bg: "bg-muted/50",
    },
  };

function MachineTooltip(
  row: string,
  date: string,
  status: string,
  label: string,
) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.grey;
  const parsed = new Date(date + "T00:00:00");
  return (
    <div className="w-44 space-y-2.5">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
          <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground leading-none">
            {row}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Factory unit
          </p>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <CalendarDays className="h-3 w-3 shrink-0" />
        {format(parsed, "EEE, MMM d yyyy")}
      </div>

      <div className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${s.bg}`}>
        <span className={`h-2 w-2 rounded-full shrink-0 ${s.dot}`} />
        <span className={`text-xs font-medium ${s.text}`}>{label}</span>
      </div>
    </div>
  );
}

type ActionContext = { row: string; date: string; status: string };

function IncidentReportSheet({
  context,
  onClose,
}: {
  context: ActionContext | null;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  }

  const statusLabel = context?.status === "red" ? "Fault" : "Warning";
  const statusColor =
    context?.status === "red" ? "text-rose-600" : "text-amber-600";
  const statusBg =
    context?.status === "red" ? "bg-rose-500/10" : "bg-amber-400/10";
  const statusDot = context?.status === "red" ? "bg-rose-500" : "bg-amber-400";

  return (
    <Sheet
      open={!!context}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="sm:max-w-md flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
            </div>
            <div>
              <SheetTitle className="text-base">Report Incident</SheetTitle>
              <SheetDescription className="text-xs mt-0.5">
                Create a report plan for this event
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {context && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 overflow-y-auto"
          >
            <div className="px-6 py-4 space-y-5 flex-1">
              {/* Context badge */}
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background border border-border">
                  <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {context.row}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(
                      new Date(context.date + "T00:00:00"),
                      "EEE, MMM d yyyy",
                    )}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1.5 rounded-md px-2 py-1 ${statusBg}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
                  <span className={`text-xs font-medium ${statusColor}`}>
                    {statusLabel}
                  </span>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-1.5">
                <Label htmlFor="title">Incident title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Overheating in drive motor"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="severity">Severity</Label>
                <Select
                  defaultValue={context.status === "red" ? "high" : "medium"}
                  required
                >
                  <SelectTrigger id="severity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="assignee">Assigned to</Label>
                <Input id="assignee" placeholder="e.g. John Doe" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what happened and the steps to investigate or resolve..."
                  className="resize-none h-28"
                />
              </div>
            </div>

            <SheetFooter className="px-6 py-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={submitted}>
                {submitted ? "Submitted!" : "Submit report"}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default function StatusMapPage() {
  const [actionContext, setActionContext] = useState<ActionContext | null>(
    null,
  );

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DemoBreadcrumb />
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
          Factory Machine Status
        </h1>
        <div className="flex flex-col gap-20">
          <StatusMap
            data={data}
            label
            labelAlign="right"
            labelTop={false}
            style="rounded"
            tooltip
            tooltipContent={MachineTooltip}
            onAction={(row, date, status) =>
              setActionContext({ row, date, status })
            }
            labelConfig={{
              green: { color: "bg-emerald-500", label: "Operational" },
              orange: {
                color: "bg-amber-400",
                label: "Warning",
                enableAction: true,
              },
              red: {
                color: "bg-rose-500",
                label: "Fault",
                enableAction: true,
              },
              grey: { color: "bg-muted", label: "No data" },
            }}
          />

          <StatusMap
            data={data}
            label={false}
            labelAlign="right"
            labelTop={false}
            style="tight"
            bordered={false}
            labelConfig={{
              green: { color: "bg-sky-400", label: "Operational" },
              orange: { color: "bg-blue-600", label: "Warning" },
              red: { color: "bg-blue-900", label: "Fault" },
              grey: { color: "bg-muted", label: "No data" },
            }}
          />
        </div>

        <IncidentReportSheet
          context={actionContext}
          onClose={() => setActionContext(null)}
        />

        <StatusMapDocs />
      </div>
    </main>
  );
}
