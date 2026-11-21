"use client";

import { type LucideIcon, X } from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";
import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

const FRAME_WIDTH = {
  xs: "w-[min(320px,calc(100vw-1.5rem))]",
  sm: "w-[min(400px,calc(100vw-1.5rem))]",
  md: "w-[min(560px,calc(100vw-1.5rem))]",
} as const;

export type PopoverFrameSize = keyof typeof FRAME_WIDTH;

type Slots = { headerEl: HTMLDivElement | null; footerEl: HTMLDivElement | null };

const FrameSlots = React.createContext<Slots | null>(null);

export function FrameHeaderActions({ children }: { children: React.ReactNode }) {
  const slots = React.useContext(FrameSlots);
  if (!slots?.headerEl) return null;
  return createPortal(children, slots.headerEl);
}

export function FrameFooter({ children }: { children: React.ReactNode }) {
  const slots = React.useContext(FrameSlots);
  if (!slots) return <>{children}</>;
  if (!slots.footerEl) return null;
  return createPortal(children, slots.footerEl);
}

export const FRAME_BAND_BUTTON_CLASS =
  "inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4";

export type PopoverFrameProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  anchorRef?: React.RefObject<{ getBoundingClientRect(): DOMRect }>;
  icon?: LucideIcon;
  title: React.ReactNode;
  size?: PopoverFrameSize;
  align?: "start" | "center" | "end";
  className?: string;
  bodyClassName?: string;
  popoverContentProps?: Omit<
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    "className" | "children" | "align"
  >;
  children?: React.ReactNode;
};

export function PopoverFrame({
  open,
  onOpenChange,
  trigger,
  anchorRef,
  icon: Icon,
  title,
  size = "xs",
  align = "end",
  className,
  bodyClassName,
  popoverContentProps,
  children,
}: PopoverFrameProps) {
  const titleId = React.useId();
  const [headerEl, setHeaderEl] = React.useState<HTMLDivElement | null>(null);
  const [footerEl, setFooterEl] = React.useState<HTMLDivElement | null>(null);
  const slots = React.useMemo(() => ({ headerEl, footerEl }), [headerEl, footerEl]);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange} modal={false}>
      {trigger ? <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger> : null}
      {anchorRef ? <PopoverPrimitive.Anchor virtualRef={anchorRef} /> : null}
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="bottom"
          align={align}
          sideOffset={6}
          collisionPadding={8}
          aria-labelledby={titleId}
          {...popoverContentProps}
          className={cn(
            "z-50 flex flex-col overflow-hidden rounded-xl border border-border bg-muted text-foreground shadow-lg outline-none",
            FRAME_WIDTH[size],
            "max-h-(--radix-popover-content-available-height) origin-(--radix-popover-content-transform-origin)",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            className,
          )}
        >
          <FrameSlots.Provider value={slots}>
            <header className="flex min-h-11 shrink-0 items-center gap-2 py-1.5 pr-2 pl-4">
              {Icon ? <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" /> : null}
              <h2 id={titleId} className="min-w-0 flex-1 truncate text-sm leading-5 font-semibold text-foreground">
                {title}
              </h2>
              <div
                ref={setHeaderEl}
                className="flex shrink-0 items-center gap-0.5 empty:hidden after:mx-1.5 after:h-4 after:w-px after:bg-border"
              />
              <PopoverPrimitive.Close className={FRAME_BAND_BUTTON_CLASS} title="Fechar">
                <X aria-hidden />
                <span className="sr-only">Fechar</span>
              </PopoverPrimitive.Close>
            </header>
            <div className="mx-1 mb-1 flex min-h-0 flex-1 flex-col rounded-lg border border-border bg-background">
              <div className={cn("relative min-h-0 flex-1 overflow-y-auto overscroll-contain", bodyClassName)}>
                {children}
              </div>
              <div
                ref={setFooterEl}
                className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-2.5 empty:hidden"
              />
            </div>
          </FrameSlots.Provider>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
