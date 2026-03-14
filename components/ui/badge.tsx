import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-x-1 rounded-md font-medium w-fit whitespace-nowrap shrink-0 ring-1 ring-inset transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-blue-50 text-blue-900 ring-blue-500/30 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30",
        neutral:
          "bg-gray-50 text-gray-900 ring-gray-500/30 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20",
        success:
          "bg-emerald-50 text-emerald-900 ring-emerald-600/30 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
        error:
          "bg-red-50 text-red-900 ring-red-600/20 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20",
        warning:
          "bg-yellow-50 text-yellow-900 ring-yellow-600/30 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20",
      },
      size: {
        sm: "px-1.5 py-0.5 text-xs [&>svg]:size-3",
        md: "px-2 py-1 text-xs [&>svg]:size-3",
        lg: "px-2.5 py-1 text-sm [&>svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type BadgeProps = React.ComponentPropsWithoutRef<"span"> &
  VariantProps<typeof badgeVariants> & {
    tooltip?: boolean;
  };

function Badge({ className, variant, size, tooltip, children, ...props }: BadgeProps) {
  const badge = (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </span>
  );

  if (!tooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
