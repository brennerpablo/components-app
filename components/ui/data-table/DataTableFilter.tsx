"use client";

import { ChevronDown, CornerDownRight, Plus } from "lucide-react";
import { Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import React from "react";
import { useDataTableLocale } from "./DataTableLocaleContext";
import { DataTableLocale } from "./i18n";

export type ConditionFilter = {
  condition: string;
  value: [number | string, number | string];
};

type FilterType = "select" | "checkbox" | "number";

function getNumberConditions(locale: DataTableLocale) {
  return [
    { value: "is-equal-to", label: locale.conditionIsEqualTo },
    { value: "is-between", label: locale.conditionIsBetween },
    { value: "is-greater-than", label: locale.conditionIsGreaterThan },
    { value: "is-less-than", label: locale.conditionIsLessThan },
  ];
}

interface DataTableFilterProps<TData, TValue> {
  column: Column<TData, TValue> | undefined;
  title?: string;
  options?: {
    label: string;
    value: string;
  }[];
  type?: FilterType;
  formatter?: (value: any) => string;
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
            className={cn(
              "font-semibold text-emerald-600 dark:text-emerald-400",
            )}
          >
            {value}
            {index < columnFilterLabels.length - 1 && ", "}
          </span>
        ))}
      </span>
    );
  }

  return (
    <>
      <span
        className={cn(
          "font-semibold text-emerald-600 dark:text-emerald-400",
          className,
        )}
      >
        {columnFilterLabels[0]} {locale.filterLabelAnd} {columnFilterLabels.length - 1} more
      </span>
    </>
  );
};

type FilterValues = string | string[] | ConditionFilter | undefined;

export function DataTableFilter<TData, TValue>({
  column,
  title,
  options: optionsProp,
  type = "select",
  formatter = (value) => value.toString(),
}: DataTableFilterProps<TData, TValue>) {
  const locale = useDataTableLocale();
  const options =
    type === "number" && !optionsProp ? getNumberConditions(locale) : optionsProp;
  const columnFilters = column?.getFilterValue() as FilterValues;

  const [selectedValues, setSelectedValues] =
    React.useState<FilterValues>(columnFilters);

  const columnFilterLabels = React.useMemo(() => {
    if (!selectedValues) return undefined;

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
  }, [selectedValues, options, formatter]);

  const hasActiveFilter =
    selectedValues &&
    ((typeof selectedValues === "object" &&
      "condition" in selectedValues &&
      selectedValues.condition !== "") ||
      (typeof selectedValues === "string" && selectedValues !== "") ||
      (Array.isArray(selectedValues) && selectedValues.length > 0));

  const getDisplayedFilter = () => {
    switch (type) {
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
                value={(selectedValues as ConditionFilter)?.value?.[0]}
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
                    value={(selectedValues as ConditionFilter)?.value?.[1]}
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
            "flex w-full items-center gap-x-1.5 whitespace-nowrap rounded-md border border-border px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted sm:w-fit sm:text-xs",
            hasActiveFilter ? "" : "border-dashed",
          )}
        >
          <span
            aria-hidden="true"
            onClick={(e) => {
              if (hasActiveFilter) {
                e.stopPropagation();
                column?.setFilterValue("");
                setSelectedValues("");
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
        className="min-w-[calc(var(--radix-popover-trigger-width))] max-w-[calc(var(--radix-popover-trigger-width))] sm:min-w-56 sm:max-w-56"
        onInteractOutside={() => {
          if (
            !columnFilters ||
            (typeof columnFilters === "string" && columnFilters === "") ||
            (Array.isArray(columnFilters) && columnFilters.length === 0) ||
            (typeof columnFilters === "object" &&
              "condition" in columnFilters &&
              columnFilters.condition === "")
          ) {
            column?.setFilterValue("");
            setSelectedValues("");
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
              <Button type="submit" className="w-full" size="sm">
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
                  column?.setFilterValue("");
                  setSelectedValues(
                    type === "checkbox"
                      ? []
                      : type === "number"
                        ? { condition: "", value: ["", ""] }
                        : "",
                  );
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
