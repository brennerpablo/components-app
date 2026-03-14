import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  Minus,
} from "lucide-react";

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb";
import { Badge } from "@/components/ui/badge";

import { BadgeDocs } from "./docs";

export default function BadgePage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <DemoBreadcrumb />
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

        <BadgeDocs />
      </div>
    </main>
  );
}
