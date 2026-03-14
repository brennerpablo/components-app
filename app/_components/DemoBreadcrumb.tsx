"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { COMPONENT_SECTIONS } from "@/lib/components-registry";

const ALL = COMPONENT_SECTIONS.flatMap((s) => s.components);

export function DemoBreadcrumb() {
  const pathname = usePathname();
  const active = ALL.find((c) => pathname.startsWith(c.href));

  if (!active) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
      <Link href="/" className="hover:text-foreground transition-colors">
        Home
      </Link>
      <ChevronRight className="size-3.5" />
      <span className="text-foreground font-medium">{active.title}</span>
    </nav>
  );
}
