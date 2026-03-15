import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { ComponentSection as ComponentSectionType } from "@/lib/components-registry";

function CompactCard({ component }: { component: ComponentSectionType["components"][number] }) {
  const Icon = component.icon;
  return (
    <Link
      href={component.href}
      className="group inline-flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5 transition-all hover:border-foreground/20 hover:shadow-sm"
    >
      <Icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      <span className="text-sm font-medium text-foreground">{component.title}</span>
    </Link>
  );
}

function HorizontalCard({ component }: { component: ComponentSectionType["components"][number] }) {
  const Icon = component.icon;
  return (
    <Link
      href={component.href}
      className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/20 hover:shadow-sm"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
        <Icon className="size-4.5" />
      </div>
      <h3 className="text-sm font-medium text-foreground self-center">{component.title}</h3>
    </Link>
  );
}

function FullCard({ component }: { component: ComponentSectionType["components"][number] }) {
  const Icon = component.icon;
  return (
    <Link
      href={component.href}
      className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/20 hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
          <Icon className="size-4.5" />
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="font-medium text-foreground">{component.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{component.description}</p>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
        {component.tags.map((tag) => (
          <span key={tag} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

export function ComponentSection({ section }: { section: ComponentSectionType }) {
  return (
    <section>
      <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
        {section.title}
      </h2>

      {section.compact ? (
        <div className="flex flex-wrap gap-3">
          {section.components.map((c) => <CompactCard key={c.href} component={c} />)}
        </div>
      ) : section.horizontal ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {section.components.map((c) => <HorizontalCard key={c.href} component={c} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {section.components.map((c) => <FullCard key={c.href} component={c} />)}
        </div>
      )}
    </section>
  );
}
