"use client";

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb";
import { SparkAreaChart } from "@/components/charts/spark-area-chart";

import { SparkAreaChartDocs } from "./docs";

const upTrend = [4, 6, 5, 8, 9, 8, 11, 13, 12, 15, 17, 16].map((v, i) => ({
  month: i,
  value: v,
}));
const downTrend = [17, 15, 16, 13, 12, 13, 10, 9, 10, 7, 6, 4].map((v, i) => ({
  month: i,
  value: v,
}));
const flatTrend = [8, 9, 8, 8, 9, 8, 9, 9, 8, 9, 8, 9].map((v, i) => ({
  month: i,
  value: v,
}));

function StatCard({
  label,
  value,
  change,
  data,
  color,
}: {
  label: string;
  value: string;
  change: string;
  data: Record<string, unknown>[];
  color: string;
}) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-xs text-muted-foreground">{change}</p>
        </div>
        <div className="h-10 w-28">
          <SparkAreaChart
            data={data}
            index="month"
            categories={["value"]}
            colors={[color]}
          />
        </div>
      </div>
    </div>
  );
}

export default function SparkAreaChartPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DemoBreadcrumb />
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Spark Area Chart
        </h1>
        <p className="text-muted-foreground mb-10">
          A compact, decorative sparkline for stat cards and dense lists — no
          axes, no legend, no tooltip. Fills its parent, so size it with the
          container (e.g. <code>h-10 w-28</code>). Powered by Recharts,
          inspired by Tremor.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-base font-medium mb-1">In Stat Cards</h2>
            <p className="text-sm text-muted-foreground mb-4">
              The intended habitat: a small trend hint next to a KPI value.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Revenue"
                value="$164k"
                change="+12.4% vs. last year"
                data={upTrend}
                color="emerald"
              />
              <StatCard
                label="Churn"
                value="3.1%"
                change="-0.8 pp vs. last year"
                data={downTrend}
                color="rose"
              />
              <StatCard
                label="Active users"
                value="8.9k"
                change="stable"
                data={flatTrend}
                color="blue"
              />
            </div>
          </section>

          <section>
            <h2 className="text-base font-medium mb-1">Line Only</h2>
            <p className="text-sm text-muted-foreground mb-4">
              <code>showGradient={"{false}"}</code> drops the soft fill under
              the line; <code>strokeWidth</code> tunes its weight. Hex colors
              are accepted alongside palette names.
            </p>
            <div className="h-16 w-64">
              <SparkAreaChart
                data={upTrend}
                index="month"
                categories={["value"]}
                colors={["#8b5cf6"]}
                showGradient={false}
                strokeWidth={1.5}
              />
            </div>
          </section>
        </div>

        <div className="mt-16">
          <SparkAreaChartDocs />
        </div>
      </div>
    </main>
  );
}
