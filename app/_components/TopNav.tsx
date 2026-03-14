"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Popover } from "radix-ui";
import { useState } from "react";

import { cn } from "@/lib/utils";

const GROUPS = [
  {
    category: "Data Navigation",
    components: [
      {
        href: "/data-table",
        label: "DataTable",
        description: "Sortable, filterable data grid",
      },
    ],
  },
  {
    category: "Data Visualization",
    components: [
      {
        href: "/status-map",
        label: "StatusMap",
        description: "Matrix of coloured status cells",
      },
    ],
  },
];

const ALL = GROUPS.flatMap((g) => g.components);

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const active = ALL.find((c) => pathname.startsWith(c.href));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-7xl px-6 flex h-12 items-center gap-4">
        <Link
          href="/"
          className="text-sm font-semibold text-foreground tracking-tight hover:text-foreground/80 transition-colors"
        >
          components-app
        </Link>

        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <button className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 h-8 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              {active?.label ?? "Components"}
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  open && "rotate-180",
                )}
              />
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              align="start"
              sideOffset={6}
              className="z-50 w-64 rounded-md border border-border bg-popover shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            >
              {GROUPS.map((group, gi) => (
                <div key={group.category}>
                  {gi > 0 && <div className="mx-2 border-t border-border" />}
                  <div className="px-3 pt-3 pb-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {group.category}
                    </p>
                  </div>
                  <div className="px-1.5 pb-1.5 space-y-px">
                    {group.components.map(({ href, label, description }) => {
                      const isActive = pathname.startsWith(href);
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex flex-col rounded-sm px-2.5 py-2 transition-colors",
                            isActive ? "bg-muted" : "hover:bg-muted/60",
                          )}
                        >
                          <span
                            className={cn(
                              "text-sm font-medium",
                              isActive
                                ? "text-foreground"
                                : "text-foreground/80",
                            )}
                          >
                            {label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {description}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <div className="ml-auto flex items-center gap-3">
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
  );
}

function GitHubIcon({
  className = "size-3.5 fill-current",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
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
