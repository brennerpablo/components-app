"use client"

// Tremor-inspired Checkbox [v1.0.0]

import { Checkbox as CheckboxPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, checked, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    checked={checked}
    className={cn(
      // base
      "relative inline-flex size-4 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-[3px] border outline-none transition-colors",
      // unchecked
      "border-slate-300 bg-white",
      // checked
      "data-[state=checked]:border-slate-400 data-[state=checked]:bg-slate-400",
      // indeterminate
      "data-[state=indeterminate]:border-slate-400 data-[state=indeterminate]:bg-slate-400",
      // disabled
      "disabled:cursor-not-allowed disabled:opacity-50",
      // focus
      "focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-1",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex size-full items-center justify-center text-white">
      {checked === "indeterminate" ? (
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <line
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.5"
            x1="3" y1="8" x2="13" y2="8"
          />
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M11.2 5.6L6.8 10L4.8 8"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
        </svg>
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))

Checkbox.displayName = "Checkbox"

export { Checkbox }
