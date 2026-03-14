import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  Minus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ComponentDoc } from "@/components/ui/component-doc";

export default function BadgePage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <h1 className="text-2xl font-semibold tracking-tight">Badge</h1>

        {/* Variants */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Variants
          </h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
          </div>
        </section>

        {/* Sizes */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Sizes
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="default" size="sm">
              Small
            </Badge>
            <Badge variant="default" size="md">
              Medium
            </Badge>
            <Badge variant="default" size="lg">
              Large
            </Badge>
          </div>
        </section>

        {/* With icons */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            With Icons
          </h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">
              <Info />
              Info
            </Badge>
            <Badge variant="neutral">
              <Minus />
              Neutral
            </Badge>
            <Badge variant="success">
              <CheckCircle />
              Success
            </Badge>
            <Badge variant="warning">
              <AlertTriangle />
              Warning
            </Badge>
            <Badge variant="error">
              <AlertCircle />
              Error
            </Badge>
          </div>
        </section>

        {/* With Tooltip */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            With Tooltip
          </h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default" tooltip>
              Default
            </Badge>
            <Badge variant="success" tooltip>
              Success
            </Badge>
            <Badge variant="warning" tooltip>
              Warning
            </Badge>
            <Badge variant="error" tooltip>
              Error
            </Badge>
          </div>
        </section>

        <ComponentDoc
          title="Badge"
          description="A small label component for displaying status, categories, or counts. Supports five semantic variants with light and dark mode."
          usage={`import { Badge } from "@/components/ui/badge"

<Badge variant="default">Default</Badge>
<Badge variant="neutral">Neutral</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>`}
          props={[
            {
              name: "variant",
              type: '"default" | "neutral" | "success" | "error" | "warning"',
              default: '"default"',
              description: "Controls the color scheme of the badge.",
            },
            {
              name: "size",
              type: '"sm" | "md" | "lg"',
              default: '"md"',
              description: "Controls the size of the badge.",
            },
            {
              name: "tooltip",
              type: "boolean",
              default: "false",
              description:
                "When true, wraps the badge in a tooltip showing its content on hover.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes.",
            },
            {
              name: "children",
              type: "React.ReactNode",
              description: "Badge content. Can include text and/or icons.",
            },
          ]}
        />
      </div>
    </main>
  );
}
