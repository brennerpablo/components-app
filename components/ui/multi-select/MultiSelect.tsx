"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface MultiSelectContextValue {
  selected: string[];
  onSelect: (value: string) => void;
}

const MultiSelectContext = React.createContext<MultiSelectContextValue>({
  selected: [],
  onSelect: () => {},
});

// ---------------------------------------------------------------------------
// MultiSelectItem
// ---------------------------------------------------------------------------

interface MultiSelectItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

function MultiSelectItem({ value, className, children }: MultiSelectItemProps) {
  const { selected, onSelect } = React.useContext(MultiSelectContext);
  const isSelected = selected.includes(value);

  return (
    <CommandItem
      value={value}
      onSelect={() => onSelect(value)}
      className={cn("flex items-center gap-2 cursor-pointer", className)}
    >
      <div
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary",
          isSelected
            ? "bg-primary text-primary-foreground"
            : "opacity-50 [&_svg]:invisible",
        )}
      >
        <Check className="h-3.5 w-3.5" />
      </div>
      {children}
    </CommandItem>
  );
}

// ---------------------------------------------------------------------------
// MultiSelect
// ---------------------------------------------------------------------------

interface MultiSelectProps {
  disabled?: boolean;
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  placeholderSearch?: string;
  className?: string;
  children: React.ReactNode;
}

function MultiSelect({
  disabled,
  onValueChange,
  placeholder = "Select...",
  placeholderSearch = "Search...",
  className,
  children,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);

  // Build a label map from children so we can render chips for selected items
  const labelMap = React.useMemo(() => {
    const map: Record<string, React.ReactNode> = {};
    React.Children.forEach(children, (child) => {
      if (
        React.isValidElement<MultiSelectItemProps>(child) &&
        child.props.value != null
      ) {
        map[child.props.value] = child.props.children;
      }
    });
    return map;
  }, [children]);

  const handleSelect = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setSelected(next);
    onValueChange?.(next);
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = selected.filter((v) => v !== value);
    setSelected(next);
    onValueChange?.(next);
  };

  return (
    <MultiSelectContext.Provider value={{ selected, onSelect: handleSelect }}>
      <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between h-auto min-h-9 font-normal px-3 py-1.5",
              className,
            )}
          >
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selected.map((val) => (
                  <span
                    key={val}
                    className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {labelMap[val]}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-foreground"
                      onClick={(e) => handleRemove(val, e)}
                    />
                  </span>
                ))}
              </div>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={placeholderSearch} />
            <CommandList>
              <CommandEmpty>Nenhum resultado.</CommandEmpty>
              <CommandGroup>{children}</CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </MultiSelectContext.Provider>
  );
}

export { MultiSelect, MultiSelectItem };
export type { MultiSelectItemProps, MultiSelectProps };
