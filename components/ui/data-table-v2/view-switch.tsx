"use client";

import type { ElementType, KeyboardEvent, ReactNode } from "react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

export type ViewSwitchOption<TValue extends string> = {
  value: TValue;
  label: ReactNode;
  ariaLabel?: string;
  title?: string;
  icon?: ElementType<{ className?: string; "aria-hidden"?: boolean }>;
};

const ITEM_SIZE = {
  sm: "h-[26px] px-2.5 text-xs",
  icon: "size-[26px]",
} as const;

export function ViewSwitch<TValue extends string>({
  value,
  options,
  onValueChange,
  onDeselect,
  ariaLabel,
  size = "icon",
  itemClassName,
}: {
  value: TValue | null;
  options: readonly ViewSwitchOption<TValue>[];
  onValueChange: (value: TValue) => void;
  onDeselect?: () => void;
  ariaLabel: string;
  size?: keyof typeof ITEM_SIZE;
  itemClassName?: string;
}) {
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (next: TValue) => {
    if (next === value) return;
    onValueChange(next);
    window.requestAnimationFrame(() => buttons.current[next]?.focus());
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (options.length === 0) return;
    const current = Math.max(
      0,
      options.findIndex((option) => option.value === value),
    );
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (step === 0) return;
    event.preventDefault();
    select(options[(current + step + options.length) % options.length].value);
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className="inline-flex max-w-full items-center rounded-md border border-input bg-background p-0.5 shadow-xs dark:bg-input/30"
    >
      {options.map((option, index) => {
        const Icon = option.icon;
        const selected = option.value === value;
        const focusable = selected || (value == null && index === 0);
        return (
          <button
            key={option.value}
            ref={(node) => {
              buttons.current[option.value] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.ariaLabel}
            title={option.title}
            tabIndex={focusable ? 0 : -1}
            onClick={() => (selected && onDeselect ? onDeselect() : select(option.value))}
            className={cn(
              "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[4px] font-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring [&_svg:not([class*='size-'])]:size-4",
              ITEM_SIZE[size],
              selected ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              itemClassName,
            )}
          >
            {Icon ? <Icon aria-hidden /> : null}
            <span className={cn(size === "icon" && "sr-only")}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
