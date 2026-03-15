"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { Slot } from "radix-ui";
import React from "react";
import ReactDOM from "react-dom";

import { cn } from "@/lib/utils";

export type AccentSide = "top" | "right" | "bottom" | "left";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  hoverShadow?: boolean;
  enableFullscreen?: boolean;
  ghost?: boolean;
  accentColor?: string;
  accentSide?: AccentSide;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      asChild = false,
      hoverShadow = false,
      enableFullscreen = false,
      ghost = false,
      accentColor,
      accentSide = "left",
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

    const accentSideClass: Record<AccentSide, string> = {
      top: "border-t-[3px]",
      right: "border-r-[3px]",
      bottom: "border-b-[3px]",
      left: "border-l-[3px]",
    };

    const accentStyle: React.CSSProperties = accentColor
      ? {
          [`border${accentSide.charAt(0).toUpperCase() + accentSide.slice(1)}Color`]: accentColor,
        }
      : {};

    const baseClass = ghost
      ? "relative w-full"
      : cn(
          "relative w-full rounded-lg border border-border bg-card p-6 text-left shadow-xs",
          accentColor && accentSideClass[accentSide],
        );

    if (asChild) {
      return (
        <Slot.Root
          ref={ref}
          className={cn(
            baseClass,
            !ghost && hoverShadow && "transition-all duration-200 ease-in-out hover:border-foreground/20 hover:shadow-sm",
            className,
          )}
          style={{ ...accentStyle, ...props.style }}
          {...props}
        >
          {children}
        </Slot.Root>
      );
    }

    const fullscreenButton = enableFullscreen && (
      <button
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        className={cn(
          "flex size-6 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground",
          ghost ? "bg-muted text-foreground" : "absolute top-3 right-3 text-muted-foreground",
        )}
      >
        {isFullscreen ? (
          <Minimize2 className="size-3.5" aria-hidden="true" />
        ) : (
          <Maximize2 className="size-3.5" aria-hidden="true" />
        )}
      </button>
    );

    const cardContent = (
      <div
        ref={ref}
        className={cn(
          baseClass,
          isFullscreen
            ? "h-full overflow-auto"
            : [
                !ghost && hoverShadow && "transition-all duration-200 ease-in-out hover:border-foreground/20 hover:shadow-sm",
                className,
              ],
        )}
        style={{ ...accentStyle, ...props.style }}
        {...props}
      >
        {ghost && enableFullscreen ? (
          <>
            <div className="mb-4 flex justify-end">{fullscreenButton}</div>
            {children}
          </>
        ) : (
          <>
            {fullscreenButton}
            {children}
          </>
        )}
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
