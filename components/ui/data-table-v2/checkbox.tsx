"use client";

import type * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const ACCENT_CLASS =
  "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary [&>span]:text-primary-foreground";

export function TableCheckbox({ className, ...props }: React.ComponentProps<typeof Checkbox>) {
  return <Checkbox className={cn(ACCENT_CLASS, className)} {...props} />;
}
