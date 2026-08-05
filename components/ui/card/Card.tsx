"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { Slot } from "radix-ui";
import React from "react";
import ReactDOM from "react-dom";

import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { cn } from "@/lib/utils";

export type AccentSide = "top" | "right" | "bottom" | "left";

/**
 * Fullscreen state, exposed to the card's content.
 *
 * The state is internal to `Card`, but content sometimes needs to react to it —
 * a fixed-height chart should grow to fill the overlay. Context rather than a
 * controlled component: in controlled mode the OPEN button only exists on the
 * `ghost` path, so controlling it from outside would leave the card with no
 * trigger.
 *
 * Consumers must sit INSIDE `<Card>` in the tree — calling the hook in the same
 * component that renders the `Card` always returns `false`, because the provider
 * does not exist there yet.
 */
const CardFullscreenContext = React.createContext(false);

export function useCardFullscreen(): boolean {
  return React.useContext(CardFullscreenContext);
}

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

    // The overlay is `fixed`, but the page stays in flow behind it: without the
    // lock its scrollbar remains live and scrolling changes nothing on screen.
    useBodyScrollLock(isFullscreen);

    React.useEffect(() => {
      if (!isFullscreen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsFullscreen(false);
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isFullscreen]);

    const accentSideClass: Record<AccentSide, string> = {
      top: "border-t-3",
      right: "border-r-3",
      bottom: "border-b-3",
      left: "border-l-3",
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
        // Fullscreen state is internal to the Card, but content sometimes needs
        // to react to it (a fixed-height chart should grow to fill the overlay).
        // Exposing it as an attribute avoids turning Card into a controlled
        // component — in controlled mode the open button only exists on the
        // `ghost` path, so controlling it from outside would leave the card with
        // no trigger. Consumers style against it with the `in-data-fullscreen:`
        // variant.
        data-fullscreen={isFullscreen ? "" : undefined}
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

    // The provider wraps BOTH outputs so content always sees the state —
    // including the normal view, where it is `false`.
    if (isFullscreen) {
      return ReactDOM.createPortal(
        <CardFullscreenContext.Provider value={true}>
          <div className="fixed inset-0 z-50 flex flex-col bg-background p-4 animate-in fade-in-0 zoom-in-95 duration-200 sm:p-6">
            {cardContent}
          </div>
        </CardFullscreenContext.Provider>,
        document.body,
      );
    }

    return (
      <CardFullscreenContext.Provider value={false}>{cardContent}</CardFullscreenContext.Provider>
    );
  },
);

Card.displayName = "Card";

export { Card };
