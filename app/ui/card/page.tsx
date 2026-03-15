"use client";

import { AlertTriangle, ArrowUpRight, TrendingUp } from "lucide-react";

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb";
import { AreaChart } from "@/components/charts/area-chart";
import { Card } from "@/components/ui/card";
import { ComponentDoc } from "@/components/ui/component-doc";


const revenueData = [
  { month: "Jan", Revenue: 4200 },
  { month: "Feb", Revenue: 5800 },
  { month: "Mar", Revenue: 5100 },
  { month: "Apr", Revenue: 6700 },
  { month: "May", Revenue: 7400 },
  { month: "Jun", Revenue: 6900 },
  { month: "Jul", Revenue: 8200 },
  { month: "Aug", Revenue: 9100 },
  { month: "Sep", Revenue: 8600 },
  { month: "Oct", Revenue: 9800 },
  { month: "Nov", Revenue: 11200 },
  { month: "Dec", Revenue: 12400 },
];

export default function CardPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <DemoBreadcrumb />
        <h1 className="text-2xl font-semibold tracking-tight">Card</h1>

        {/* Default */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Default
          </h2>
          <Card className="max-w-sm">
            <p className="text-sm text-muted-foreground">
              A simple card with default padding, border, and shadow.
            </p>
          </Card>
        </section>

        {/* Custom content */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            KPI Card
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                $45,231
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </Card>
            <Card>
              <p className="text-sm text-muted-foreground">Subscriptions</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                +2,350
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </Card>
            <Card>
              <p className="text-sm text-muted-foreground">Active Now</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                +573
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </Card>
          </div>
        </section>

        {/* Dashboard card */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Dashboard Card
          </h2>
          <Card enableFullscreen className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
                <TrendingUp className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Monthly Revenue
                </p>
                <p className="text-xs text-muted-foreground">
                  Jan – Dec 2024
                </p>
              </div>
            </div>
            <AreaChart
              data={revenueData}
              index="month"
              categories={["Revenue"]}
              valueFormatter={(v) =>
                `$${(v / 1000).toFixed(1)}k`
              }
              showLegend={false}
            />
          </Card>
        </section>

        {/* Hover Shadow */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Hover Shadow
          </h2>
          <Card hoverShadow className="max-w-sm">
            <p className="text-sm text-muted-foreground">
              Hover over this card to see a subtle shadow fade in.
            </p>
          </Card>
        </section>

        {/* Fullscreen */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Fullscreen
          </h2>
          <Card enableFullscreen className="max-w-sm">
            <p className="text-sm font-medium text-foreground">
              Expandable card
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Click the icon in the top-right corner to expand this card to
              fullscreen. Press Escape to exit.
            </p>
          </Card>
        </section>

        {/* Ghost — fullscreen container */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Ghost (fullscreen container)
          </h2>
          <Card ghost enableFullscreen>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">$45,231</p>
                <p className="mt-1 text-xs text-muted-foreground">+20.1% from last month</p>
              </Card>
              <Card>
                <p className="text-sm text-muted-foreground">Subscriptions</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">+2,350</p>
                <p className="mt-1 text-xs text-muted-foreground">+180.1% from last month</p>
              </Card>
              <Card>
                <p className="text-sm text-muted-foreground">Active Now</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">+573</p>
                <p className="mt-1 text-xs text-muted-foreground">+201 since last hour</p>
              </Card>
              <Card>
                <p className="text-sm text-muted-foreground">Bounce Rate</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">34.2%</p>
                <p className="mt-1 text-xs text-muted-foreground">−2.4% from last month</p>
              </Card>
              <Card>
                <p className="text-sm text-muted-foreground">Avg. Session</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">4m 12s</p>
                <p className="mt-1 text-xs text-muted-foreground">+0m 18s from last month</p>
              </Card>
              <Card>
                <p className="text-sm text-muted-foreground">New Users</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">1,892</p>
                <p className="mt-1 text-xs text-muted-foreground">+12.7% from last month</p>
              </Card>
            </div>
          </Card>
        </section>

        {/* Accent border */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Accent Border
          </h2>
          <Card accentColor="#ef4444" accentSide="left" className="max-w-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
                <AlertTriangle className="size-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Operational Failures</p>
                <p className="text-xs text-muted-foreground">Last 25 hours</p>
              </div>
              <p className="text-3xl font-semibold text-foreground">37</p>
              <a
                href="/dashboard"
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Go to failures dashboard"
              >
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card accentColor="#6366f1" accentSide="left">
              <p className="text-sm font-medium text-foreground">Left accent</p>
              <p className="mt-1 text-sm text-muted-foreground">Default side — indigo left border.</p>
            </Card>
            <Card accentColor="#f59e0b" accentSide="top">
              <p className="text-sm font-medium text-foreground">Top accent</p>
              <p className="mt-1 text-sm text-muted-foreground">Amber top border.</p>
            </Card>
            <Card accentColor="#10b981" accentSide="right">
              <p className="text-sm font-medium text-foreground">Right accent</p>
              <p className="mt-1 text-sm text-muted-foreground">Emerald right border.</p>
            </Card>
            <Card accentColor="#ef4444" accentSide="bottom">
              <p className="text-sm font-medium text-foreground">Bottom accent</p>
              <p className="mt-1 text-sm text-muted-foreground">Red bottom border.</p>
            </Card>
          </div>
        </section>

        {/* asChild — semantic list */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            asChild (semantic list)
          </h2>
          <ul role="list" className="flex flex-col gap-3 max-w-sm">
            {["Design", "Engineering", "Marketing"].map((team) => (
              <Card key={team} asChild>
                <li className="text-sm font-medium text-foreground">{team}</li>
              </Card>
            ))}
          </ul>
        </section>

        <ComponentDoc
          title="Card"
          description="A fundamental layout primitive for grouping content. Adapts Tremor's Card with project CSS variable tokens — white/dark background, border, rounded corners, and a subtle shadow."
          usage={`import { Card } from "@/components/ui/card"

<Card className="max-w-sm">
  <p>Card content</p>
</Card>

{/* Render as a different element */}
<ul>
  <Card asChild>
    <li>List item styled as a card</li>
  </Card>
</ul>`}
          props={[
            {
              name: "ghost",
              type: "boolean",
              default: "false",
              description:
                "When true, renders the card without background, border, shadow, or padding — invisible container. Useful for grouping content or enabling fullscreen without a visible card shell.",
            },
            {
              name: "enableFullscreen",
              type: "boolean",
              default: "false",
              description:
                "When true, shows a fullscreen toggle button in the top-right corner. Clicking it expands the card to fill the viewport via a portal. Press Escape to exit.",
            },
            {
              name: "hoverShadow",
              type: "boolean",
              default: "false",
              description:
                "When true, applies a subtle shadow on hover with a smooth fade-in transition.",
            },
            {
              name: "accentColor",
              type: "string",
              description:
                "Any valid CSS color value. When set, renders a 3px colored border on the side specified by accentSide.",
            },
            {
              name: "accentSide",
              type: '"top" | "right" | "bottom" | "left"',
              default: '"left"',
              description:
                'Which side of the card the accent border appears on. Only relevant when accentColor is set.',
            },
            {
              name: "asChild",
              type: "boolean",
              default: "false",
              description:
                "When true, merges Card props onto its first child element instead of rendering a <div>.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional Tailwind classes to customize the card.",
            },
            {
              name: "...props",
              type: "React.HTMLAttributes<HTMLDivElement>",
              description: "All standard div props are forwarded.",
            },
          ]}
        />
      </div>
    </main>
  );
}
