import type { ReactNode } from "react";

export function CountBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md bg-muted px-1.5 text-[11px] font-semibold leading-none tabular-nums text-muted-foreground ring-1 ring-border ring-inset">
      {children}
    </span>
  );
}
