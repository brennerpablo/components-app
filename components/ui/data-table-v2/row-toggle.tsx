"use client";

import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function RowToggle({ open, label, onToggle }: { open: boolean; label: string; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={`${open ? "Recolher" : "Abrir"} ${label}`}
      className="flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <ChevronRight
        className={cn("size-3.5 transition-transform duration-150 motion-reduce:transition-none", open && "rotate-90")}
        aria-hidden
      />
    </button>
  );
}
