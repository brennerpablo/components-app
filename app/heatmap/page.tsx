"use client";

import { StatusMap } from "@/components/ui/heatmap";
import { data } from "./data";

export default function StatusMapPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
          Factory Machine Status
        </h1>
        <StatusMap
          data={data}
          label
          labelAlign="right"
          labelTop={false}
          // bordered={false}
          style="squared"
          labelConfig={{
            green: { color: "bg-emerald-500", label: "Operational" },
            orange: { color: "bg-orange-400", label: "Warning" },
            red: { color: "bg-red-500", label: "Fault" },
            grey: { color: "bg-muted", label: "No data" },
          }}
        />
      </div>
    </main>
  );
}
