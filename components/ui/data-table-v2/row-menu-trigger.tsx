"use client";

import { MoreHorizontal } from "lucide-react";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DataTableV2RowMenuTrigger({
  label,
  className,
  ref,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children"> & { label: string }) {
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      className={cn(
        "group -my-2 align-middle border border-transparent hover:border-border data-[state=open]:border-border data-[state=open]:bg-muted",
        className,
      )}
      {...props}
    >
      <MoreHorizontal
        className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground group-data-[state=open]:text-foreground"
        aria-hidden
      />
    </Button>
  );
}
