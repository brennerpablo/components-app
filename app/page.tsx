import Link from "next/link";
import { TableProperties, ArrowUpRight } from "lucide-react";

const components = [
  {
    title: "Data Table",
    description:
      "A powerful, feature-rich table with sorting, filtering, pagination, bulk editing, and drag-and-drop column reordering.",
    href: "/data-table",
    icon: TableProperties,
    tags: ["TanStack Table", "Drag & Drop", "Filters"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">components-app</span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/brennerpablo/components-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <GitHubIcon />
              GitHub
            </a>
            <a
              href="https://x.com/pablobrenner_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <XIcon />
              @pablobrenner_
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-20">
        {/* Hero */}
        <section className="mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground mb-6">
            <span className="size-1.5 rounded-full bg-green-500" />
            Open source
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-5 max-w-2xl leading-tight">
            Reusable components for building cool dashboards.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            A collection of production-ready UI components crafted with shadcn/ui, Tailwind CSS, and React. Copy, paste, ship.{" "}
            <a
              href="https://x.com/pablobrenner_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-medium underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
            >
              Made by @pablobrenner_
            </a>
          </p>

          <a
            href="https://github.com/brennerpablo/components-app"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-5 py-3.5 text-white transition-colors hover:bg-blue-500 group"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500 group-hover:bg-blue-400 transition-colors">
              <GitHubIcon className="size-4 fill-white" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">Discover the components repo</span>
              <span className="text-xs text-blue-200 leading-tight">github.com/brennerpablo/components-app</span>
            </span>
            <ArrowUpRight className="ml-1 size-4 text-blue-300 group-hover:text-white transition-colors" />
          </a>
        </section>

        {/* Components grid */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
            Components — {components.length}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {components.map((component) => {
              const Icon = component.icon;
              return (
                <Link
                  key={component.href}
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
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {component.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    {component.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}

            {/* Coming soon placeholder */}
            <div className="flex flex-col gap-4 rounded-xl border border-dashed border-border p-5 opacity-50">
              <div className="size-10 rounded-lg border border-border bg-muted" />
              <div className="flex flex-col gap-1.5">
                <p className="font-medium text-muted-foreground">More coming soon</p>
                <p className="text-sm text-muted-foreground">
                  Charts, command palettes, kanban boards, and more.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border mt-20">
        <div className="mx-auto max-w-5xl px-6 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>components-app</span>
          <a
            href="https://x.com/pablobrenner_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            @pablobrenner_
          </a>
        </div>
      </footer>
    </div>
  );
}

function GitHubIcon({ className = "size-3.5 fill-current" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-3.5 fill-current"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.627L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}
