import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb";
import { ComponentDoc } from "@/components/ui/component-doc";
import { Card } from "@/components/ui/card";

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
