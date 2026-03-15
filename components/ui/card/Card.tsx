"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { Slot } from "radix-ui";
import React from "react";
import ReactDOM from "react-dom";

import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  hoverShadow?: boolean;
  enableFullscreen?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      asChild = false,
      hoverShadow = false,
      enableFullscreen = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const toggleFullscreen = React.useCallback(
      () => setIsFullscreen((v) => !v),
      [],
    );

    React.useEffect(() => {
      if (!isFullscreen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsFullscreen(false);
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isFullscreen]);

    if (asChild) {
      return (
        <Slot.Root
          ref={ref}
          className={cn(
            "relative w-full rounded-lg border border-border bg-card p-6 text-left shadow-xs",
            hoverShadow && "transition-shadow duration-200 ease-in-out hover:shadow-sm",
            className,
          )}
          {...props}
        >
          {children}
        </Slot.Root>
      );
    }

    const cardContent = (
      <div
        ref={ref}
        className={cn(
          "relative w-full rounded-lg border border-border bg-card p-6 text-left shadow-xs",
          isFullscreen
            ? "h-full overflow-auto"
            : [hoverShadow && "transition-shadow duration-200 ease-in-out hover:shadow-sm", className],
        )}
        {...props}
      >
        {enableFullscreen && (
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {isFullscreen ? (
              <Minimize2 className="size-3.5" aria-hidden="true" />
            ) : (
              <Maximize2 className="size-3.5" aria-hidden="true" />
            )}
          </button>
        )}
        {children}
      </div>
    );

    if (isFullscreen) {
      return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex flex-col bg-background p-4 animate-in fade-in-0 zoom-in-95 duration-200 sm:p-6">
          {cardContent}
        </div>,
        document.body,
      );
    }

    return cardContent;
  },
);

Card.displayName = "Card";

export { Card };
