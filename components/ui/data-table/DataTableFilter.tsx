"use client";

import { Column } from "@tanstack/react-table";
import { ChevronDown, CornerDownRight, Plus } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

import { useDataTableLocale } from "./DataTableLocaleContext";
import { DataTableLocale } from "./i18n";
import { resolveAccentColor } from "./types";

export type ConditionFilter = {
  condition: string;
  value: [number | string, number | string];
};

export type PercentageRangeFilter = [number, number];

export type DateRangeFilter = { from: Date | undefined; to: Date | undefined };

const DEFAULT_PERCENTAGE_RANGE: PercentageRangeFilter = [0, 100];
const DEFAULT_DATE_RANGE: DateRangeFilter = { from: undefined, to: undefined };

function getEmptyValue(type: FilterType): FilterValues {
  switch (type) {
    case "percentage": return DEFAULT_PERCENTAGE_RANGE;
    case "date": return DEFAULT_DATE_RANGE;
    case "checkbox":
    case "checkboxSearch": return [];
    case "number": return { condition: "", value: ["", ""] };
    default: return "";
  }
}

function isFilterActive(type: FilterType, value: FilterValues): boolean {
  if (value === undefined || value === null) return false;
  if (type === "date") {
    const d = value as DateRangeFilter;
    return d.from !== undefined || d.to !== undefined;
  }
  if (type === "percentage") {
    const [min, max] = value as PercentageRangeFilter;
    return min !== DEFAULT_PERCENTAGE_RANGE[0] || max !== DEFAULT_PERCENTAGE_RANGE[1];
  }
  if (typeof value === "string") return value !== "";
  if (typeof value === "object" && "condition" in value) return (value as ConditionFilter).condition !== "";
  if (Array.isArray(value)) return value.length > 0;
  return false;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDateRange(filter: DateRangeFilter): string {
  const { from, to } = filter;
  if (from && to)
    return `${DATE_FORMATTER.format(from)} – ${DATE_FORMATTER.format(to)}`;
  if (from) return `From ${DATE_FORMATTER.format(from)}`;
  if (to) return `Until ${DATE_FORMATTER.format(to)}`;
  return "";
}

type FilterType = "select" | "checkbox" | "checkboxSearch" | "number" | "percentage" | "date";

function getNumberConditions(locale: DataTableLocale) {
  return [
    { value: "is-equal-to", label: locale.conditionIsEqualTo },
    { value: "is-between", label: locale.conditionIsBetween },
    { value: "is-greater-than", label: locale.conditionIsGreaterThan },
    { value: "is-less-than", label: locale.conditionIsLessThan },
  ];
}

function DateRangeCalendarPicker({
  dateRange,
  onChange,
}: {
  dateRange: DateRangeFilter;
  onChange: (value: DateRangeFilter) => void;
}) {
  const locale = useDataTableLocale();
  const today = new Date();
  const currentYear = today.getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - 50 + i);

  const [fromMonth, setFromMonth] = React.useState<Date>(
    dateRange.from ?? today,
  );
  const [toMonth, setToMonth] = React.useState<Date>(
    dateRange.to ?? new Date(today.getFullYear(), today.getMonth() + 1, 1),
  );

  const rangeModifiers = {
    range_start: dateRange.from ? [dateRange.from] : [],
    range_end: dateRange.to ? [dateRange.to] : [],
    range_middle:
      dateRange.from && dateRange.to
        ? { from: dateRange.from, to: dateRange.to }
        : false,
  };

  return (
    <div className="mt-2 flex flex-col gap-4 sm:flex-row">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">
          {locale.dateFrom}
        </p>
        <div className="flex gap-1">
          <Select
            value={String(fromMonth.getMonth())}
            onValueChange={(v) =>
              setFromMonth(new Date(fromMonth.getFullYear(), Number(v), 1))
            }
          >
            <SelectTrigger className="h-7 flex-1 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => (
                <SelectItem key={i} value={String(i)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(fromMonth.getFullYear())}
            onValueChange={(v) =>
              setFromMonth(new Date(Number(v), fromMonth.getMonth(), 1))
            }
          >
            <SelectTrigger className="h-7 w-22 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={dateRange.from}
          onSelect={(date) =>
            onChange({ ...dateRange, from: date ?? undefined })
          }
          month={fromMonth}
          onMonthChange={setFromMonth}
          modifiers={rangeModifiers}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">
          {locale.dateTo}
        </p>
        <div className="flex gap-1">
          <Select
            value={String(toMonth.getMonth())}
            onValueChange={(v) =>
              setToMonth(new Date(toMonth.getFullYear(), Number(v), 1))
            }
          >
            <SelectTrigger className="h-7 flex-1 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => (
                <SelectItem key={i} value={String(i)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(toMonth.getFullYear())}
            onValueChange={(v) =>
              setToMonth(new Date(Number(v), toMonth.getMonth(), 1))
            }
          >
            <SelectTrigger className="h-7 w-22 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={dateRange.to}
          onSelect={(date) => onChange({ ...dateRange, to: date ?? undefined })}
          month={toMonth}
          onMonthChange={setToMonth}
          modifiers={rangeModifiers}
        />
      </div>
    </div>
  );
}

type FilterValues =
  | string
  | string[]
  | ConditionFilter
  | PercentageRangeFilter
  | DateRangeFilter
  | undefined;

interface DataTableFilterProps<TData, TValue> {
  column: Column<TData, TValue> | undefined;
  title?: string;
  options?: {
    label: string;
    value: string;
  }[];
  type?: FilterType;
  multiple?: boolean;
  formatter?: (value: string | number) => string;
  accentColor?: string;
}

const ColumnFiltersLabel = ({
  columnFilterLabels,
  className,
}: {
  columnFilterLabels: string[] | undefined;
  className?: string;
}) => {
  const locale = useDataTableLocale();
  if (!columnFilterLabels) return null;

  if (columnFilterLabels.length < 3) {
    return (
      <span className={cn("truncate", className)}>
        {columnFilterLabels.map((value, index) => (
          <span
            key={value}
            className="font-semibold"
            style={{ color: "var(--dt-accent)" }}
          >
            {value}
            {index < columnFilterLabels.length - 1 && ", "}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span
      className={cn("font-semibold", className)}
      style={{ color: "var(--dt-accent)" }}
    >
      {columnFilterLabels[0]} {locale.filterLabelAnd}{" "}
      {columnFilterLabels.length - 1} {locale.filterLabelMore}
    </span>
  );
};

export function DataTableFilter<TData, TValue>({
  column,
  title,
  options: optionsProp,
  type = "select",
  multiple = true,
  formatter = (value) => value.toString(),
  accentColor,
}: DataTableFilterProps<TData, TValue>) {
  const locale = useDataTableLocale();
  const options =
    type === "number" && !optionsProp
      ? getNumberConditions(locale)
      : optionsProp;
  const columnFilters = column?.getFilterValue() as FilterValues;

  const [selectedValues, setSelectedValues] =
    React.useState<FilterValues>(columnFilters);

  const [searchQuery, setSearchQuery] = React.useState("");

  const columnFilterLabels = React.useMemo(() => {
    if (!selectedValues) return undefined;

    if (
      type === "date" &&
      typeof selectedValues === "object" &&
      !Array.isArray(selectedValues) &&
      "from" in selectedValues
    ) {
      const dateRange = selectedValues as DateRangeFilter;
      if (!dateRange.from && !dateRange.to) return undefined;
      return [formatDateRange(dateRange)];
    }

    if (
      type === "percentage" &&
      Array.isArray(selectedValues) &&
      selectedValues.length === 2 &&
      typeof selectedValues[0] === "number"
    ) {
      const [min, max] = selectedValues as PercentageRangeFilter;
      if (
        min === DEFAULT_PERCENTAGE_RANGE[0] &&
        max === DEFAULT_PERCENTAGE_RANGE[1]
      )
        return undefined;
      return [`${min}% – ${max}%`];
    }

    if (Array.isArray(selectedValues)) {
      return selectedValues.map((value) => formatter(value));
    }

    if (typeof selectedValues === "string") {
      return [formatter(selectedValues)];
    }

    if (typeof selectedValues === "object" && "condition" in selectedValues) {
      const condition = options?.find(
        (option) => option.value === selectedValues.condition,
      )?.label;
      if (!condition) return undefined;
      if (!selectedValues.value?.[0] && !selectedValues.value?.[1])
        return [`${condition}`];
      if (!selectedValues.value?.[1])
        return [`${condition} ${formatter(selectedValues.value?.[0])}`];
      return [
        `${condition} ${formatter(selectedValues.value?.[0])} ${locale.rangeAnd} ${formatter(
          selectedValues.value?.[1],
        )}`,
      ];
    }

    return undefined;
  }, [selectedValues, options, formatter, type, locale.rangeAnd]);

  const hasActiveFilter = isFilterActive(type, selectedValues);

  const getDisplayedFilter = () => {
    switch (type) {
      case "date": {
        const dateRange =
          (selectedValues as DateRangeFilter | undefined) ?? DEFAULT_DATE_RANGE;
        return (
          <DateRangeCalendarPicker
            dateRange={dateRange}
            onChange={setSelectedValues}
          />
        );
      }
      case "select":
        return (
          <Select
            value={selectedValues as string}
            onValueChange={(value) => {
              setSelectedValues(value);
            }}
          >
            <SelectTrigger className="mt-2 h-8 w-full text-xs">
              <SelectValue placeholder={locale.selectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <div className="mt-2 space-y-2 overflow-y-auto sm:max-h-36">
            {options?.map((option) => {
              return (
                <div key={option.label} className="flex items-center gap-2">
                  <Checkbox
                    id={option.value}
                    checked={(selectedValues as string[])?.includes(
                      option.value,
                    )}
                    onCheckedChange={(checked) => {
                      setSelectedValues((prev) => {
                        if (checked) {
                          return prev
                            ? [...(prev as string[]), option.value]
                            : [option.value];
                        } else {
                          return (prev as string[]).filter(
                            (value) => value !== option.value,
                          );
                        }
                      });
                    }}
                  />
                  <Label
                    htmlFor={option.value}
                    className="text-base sm:text-sm"
                  >
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
        );
      case "checkboxSearch": {
        const filteredOptions = options?.filter((opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        return (
          <div className="mt-2 space-y-2">
            <Input
              type="search"
              placeholder={locale.searchOptionsPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 text-xs"
            />
            <div className="space-y-2 overflow-y-auto sm:max-h-36">
              {filteredOptions?.length === 0 && (
                <p className="py-1 text-center text-xs text-muted-foreground">
                  {locale.noResults}
                </p>
              )}
              {filteredOptions?.map((option) => {
                const isChecked = (selectedValues as string[])?.includes(option.value);
                if (multiple) {
                  return (
                    <div key={option.value} className="flex items-center gap-2">
                      <Checkbox
                        id={`cs-${option.value}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          setSelectedValues((prev) => {
                            if (checked) {
                              return prev ? [...(prev as string[]), option.value] : [option.value];
                            } else {
                              return (prev as string[]).filter((v) => v !== option.value);
                            }
                          });
                        }}
                      />
                      <Label htmlFor={`cs-${option.value}`} className="text-base sm:text-sm">
                        {option.label}
                      </Label>
                    </div>
                  );
                } else {
                  return (
                    <div key={option.value} className="flex items-center gap-2">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={isChecked}
                        onClick={() => {
                          setSelectedValues(isChecked ? [] : [option.value]);
                        }}
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-full border border-border transition-colors",
                          isChecked && "border-[var(--dt-accent)]",
                        )}
                      >
                        {isChecked && (
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: "var(--dt-accent)" }}
                          />
                        )}
                      </button>
                      <Label
                        className="text-base sm:text-sm cursor-pointer"
                        onClick={() => setSelectedValues(isChecked ? [] : [option.value])}
                      >
                        {option.label}
                      </Label>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        );
      }
      case "percentage": {
        const range =
          (selectedValues as PercentageRangeFilter) ?? DEFAULT_PERCENTAGE_RANGE;
        const [min, max] = range;
        return (
          <div className="mt-3 space-y-4">
            <div style={{ "--primary": "var(--dt-accent)" } as React.CSSProperties}>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[min, max]}
                onValueChange={(value) => {
                  setSelectedValues(value as PercentageRangeFilter);
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium tabular-nums">{min}%</span>
              <span className="font-medium tabular-nums">{max}%</span>
            </div>
          </div>
        );
      }
      case "number": {
        const isBetween =
          (selectedValues as ConditionFilter)?.condition === "is-between";
        return (
          <div className="space-y-2">
            <Select
              value={(selectedValues as ConditionFilter)?.condition}
              onValueChange={(value) => {
                setSelectedValues((prev) => {
                  return {
                    condition: value,
                    value: [
                      value !== "" ? (prev as ConditionFilter)?.value?.[0] : "",
                      "",
                    ],
                  };
                });
              }}
            >
              <SelectTrigger className="mt-2 h-8 w-full text-xs">
                <SelectValue placeholder={locale.selectConditionPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex w-full items-center gap-2">
              <CornerDownRight
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                disabled={!(selectedValues as ConditionFilter)?.condition}
                type="number"
                placeholder={locale.numberInputPlaceholder}
                className="h-8 text-xs"
                value={(selectedValues as ConditionFilter)?.value?.[0] ?? ""}
                onChange={(e) => {
                  setSelectedValues((prev) => {
                    return {
                      condition: (prev as ConditionFilter)?.condition,
                      value: [
                        e.target.value,
                        isBetween ? (prev as ConditionFilter)?.value?.[1] : "",
                      ],
                    };
                  });
                }}
              />
              {(selectedValues as ConditionFilter)?.condition ===
                "is-between" && (
                <>
                  <span className="text-xs font-medium text-muted-foreground">
                    {locale.rangeAnd}
                  </span>
                  <Input
                    disabled={!(selectedValues as ConditionFilter)?.condition}
                    type="number"
                    placeholder={locale.numberInputPlaceholder}
                    className="h-8 text-xs"
                    value={(selectedValues as ConditionFilter)?.value?.[1] ?? ""}
                    onChange={(e) => {
                      setSelectedValues((prev) => {
                        return {
                          condition: (prev as ConditionFilter)?.condition,
                          value: [
                            (prev as ConditionFilter)?.value?.[0],
                            e.target.value,
                          ],
                        };
                      });
                    }}
                  />
                </>
              )}
            </div>
          </div>
        );
      }
    }
  };

  React.useEffect(() => {
    setSelectedValues(columnFilters);
  }, [columnFilters]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-x-1.5 whitespace-nowrap rounded-md border px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted sm:w-fit sm:text-xs",
            hasActiveFilter ? "" : "border-dashed border-border",
          )}
          style={
            hasActiveFilter
              ? {
                  backgroundColor:
                    "color-mix(in srgb, var(--dt-accent) 10%, transparent)",
                  borderColor:
                    "color-mix(in srgb, var(--dt-accent) 35%, transparent)",
                }
              : undefined
          }
        >
          <span
            aria-hidden="true"
            onClick={(e) => {
              if (hasActiveFilter) {
                e.stopPropagation();
                const emptyValue = getEmptyValue(type);
                column?.setFilterValue(emptyValue);
                setSelectedValues(emptyValue);
              }
            }}
          >
            <Plus
              className={cn(
                "-ml-px size-5 shrink-0 transition sm:size-4",
                hasActiveFilter && "rotate-45 hover:text-destructive",
              )}
              aria-hidden="true"
            />
          </span>
          {columnFilterLabels && columnFilterLabels.length > 0 ? (
            <span>{title}</span>
          ) : (
            <span className="w-full text-left sm:w-fit">{title}</span>
          )}
          {columnFilterLabels && columnFilterLabels.length > 0 && (
            <span className="h-4 w-px bg-border" aria-hidden="true" />
          )}
          <ColumnFiltersLabel
            columnFilterLabels={columnFilterLabels}
            className="w-full text-left sm:w-fit"
          />
          <ChevronDown
            className="size-5 shrink-0 text-muted-foreground sm:size-4"
            aria-hidden="true"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={7}
        className={cn(
          "min-w-[calc(var(--radix-popover-trigger-width))] max-w-[calc(var(--radix-popover-trigger-width))]",
          type === "date"
            ? "sm:w-fit sm:min-w-0 sm:max-w-none"
            : "sm:min-w-56 sm:max-w-56",
        )}
        style={
          { "--dt-accent": resolveAccentColor(accentColor) } as React.CSSProperties
        }
        onInteractOutside={() => {
          setSearchQuery("");
          if (!isFilterActive(type, columnFilters)) {
            column?.setFilterValue(undefined);
            setSelectedValues(getEmptyValue(type));
          } else {
            setSelectedValues(columnFilters);
          }
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            column?.setFilterValue(selectedValues);
          }}
        >
          <div className="space-y-2">
            <div>
              <Label className="text-base font-medium sm:text-sm">
                {locale.filterBy(title ?? "")}
              </Label>
              {getDisplayedFilter()}
            </div>
            <PopoverClose className="w-full" asChild>
              <Button
                type="submit"
                className="w-full"
                size="sm"
                style={{
                  backgroundColor: "var(--dt-accent)",
                  borderColor: "var(--dt-accent)",
                }}
              >
                {locale.apply}
              </Button>
            </PopoverClose>
            {columnFilterLabels && columnFilterLabels.length > 0 && (
              <Button
                variant="secondary"
                className="w-full"
                size="sm"
                type="button"
                onClick={() => {
                  const emptyValue = getEmptyValue(type);
                  column?.setFilterValue(emptyValue);
                  setSelectedValues(emptyValue);
                  setSearchQuery("");
                }}
              >
                {locale.reset}
              </Button>
            )}
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
