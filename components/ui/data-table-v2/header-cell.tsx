"use client";

import { flexRender, type Header } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Funnel, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { ACTIONS_CELL_CLASS, ACTIONS_COLUMN_ID } from "./columns";
import { alignOf, growHeaderClass, normalizeUnit, sortDirectionLabel } from "./model";
import type { DataTableV2Column } from "./types";

export const SOFT_SURFACE = "bg-[var(--dtv2-soft)]";

const PINNED_HEADER_BASE = "sticky left-0 z-[2] shadow-[1px_0_0_0_var(--border)]";
export const PINNED_HEADER_CLASS = cn(PINNED_HEADER_BASE, SOFT_SURFACE);
export const PINNED_HEADER_PLAIN_CLASS = cn(PINNED_HEADER_BASE, "bg-background");

export type ColumnFilterAnchor = {
  anchor: HTMLElement;
  trigger: HTMLElement;
  align: "start" | "center" | "end";
};

const DIVIDED_CLASS = "border-r border-border last:border-r-0";

export const GROUP_END_CLASS = "border-r border-border";

const SLOT_BUTTON_CLASS = "size-5 gap-0 rounded-sm p-0";

const SOFT_ICON_CLASS = SOFT_SURFACE;
const PLAIN_ICON_CLASS = "bg-background";

const ACTIVE_ICON_CLASS = "text-foreground hover:text-foreground";
const ACTIVE_STROKE = 2.5;
const OPEN_ICON_CLASS = "bg-accent text-foreground ring-1 ring-border hover:bg-accent hover:text-foreground";

const HOVER_ONLY_CLASS =
  "pointer-events-none text-muted-foreground opacity-0 transition-opacity duration-150 hover:text-foreground focus-visible:opacity-100 group-hover/th:pointer-events-auto group-hover/th:opacity-100 group-focus-within/th:opacity-100 motion-reduce:transition-none";

type HeaderCellProps<TData> = {
  header: Header<TData, unknown>;
  meta: DataTableV2Column<TData> | undefined;
  pinned: false | { left: number; last: boolean };
  plain: boolean;
  divided: boolean;
  groupEnd: boolean;
  filterSummary: string;
  canFilter: boolean;
  filterOpen: boolean;
  sortCount: number;
  onOpenFilter: (columnId: string, anchor: ColumnFilterAnchor) => void;
  grow?: boolean;
  last?: boolean;
};

export function HeaderCell<TData>({
  header,
  meta,
  pinned,
  plain,
  divided,
  groupEnd,
  filterSummary,
  canFilter,
  filterOpen,
  sortCount,
  onOpenFilter,
  grow,
  last,
}: HeaderCellProps<TData>) {
  const column = header.column;
  const pinnedClass =
    pinned && cn(plain ? PINNED_HEADER_PLAIN_CLASS : PINNED_HEADER_CLASS, !pinned.last && "shadow-none");
  const pinnedStyle = pinned ? { left: pinned.left } : undefined;

  if (!meta || meta.header) {
    return (
      <th
        scope="col"
        style={pinnedStyle}
        className={cn(
          "px-3 text-left align-middle font-medium",
          !meta && "w-10 min-w-10 max-w-10 pr-0",
          column.id === ACTIONS_COLUMN_ID && ACTIONS_CELL_CLASS,
          column.columnDef.meta?.className,
          grow && "w-full",
          "align-middle",
          divided && DIVIDED_CLASS,
          groupEnd && GROUP_END_CLASS,
          pinnedClass,
        )}
      >
        {header.isPlaceholder ? null : flexRender(column.columnDef.header, header.getContext())}
      </th>
    );
  }

  const align = alignOf(meta);
  const right = align === "right";
  const sorted = column.getIsSorted();
  const canSort = column.getCanSort();
  const filtered = filterSummary !== "";
  const unit = normalizeUnit(meta.subtitle);
  const direction = sorted ? sortDirectionLabel(meta.type, sorted === "desc") : "";

  const iconSurface = plain ? PLAIN_ICON_CLASS : SOFT_ICON_CLASS;
  const activeCount = (filtered ? 1 : 0) + (sorted ? 1 : 0);
  const hasIcons = canFilter || canSort;
  const iconsInFlow = activeCount === 2 || (activeCount > 0 && !right && Boolean(last));

  const filterButton = (
    <Button
      variant="ghost"
      size="icon-xs"
      className={cn(
        SLOT_BUTTON_CLASS,
        iconSurface,
        filterOpen ? OPEN_ICON_CLASS : filtered ? ACTIVE_ICON_CLASS : HOVER_ONLY_CLASS,
      )}
      aria-label={filtered ? `${meta.title} filtrada: ${filterSummary}. Editar filtro` : `Filtrar por ${meta.title}`}
      aria-haspopup="dialog"
      aria-expanded={filterOpen}
      onClick={(e) =>
        onOpenFilter(column.id, {
          anchor: e.currentTarget.closest("th") ?? e.currentTarget,
          trigger: e.currentTarget,
          align: align === "center" ? "center" : right ? "end" : "start",
        })
      }
    >
      <Funnel className="size-3" strokeWidth={filtered || filterOpen ? ACTIVE_STROKE : undefined} aria-hidden />
    </Button>
  );

  const filterIcon = canFilter ? (
    filtered && !filterOpen ? (
      <Tooltip>
        <TooltipTrigger asChild>{filterButton}</TooltipTrigger>
        <TooltipContent className="font-normal">{filterSummary}</TooltipContent>
      </Tooltip>
    ) : (
      filterButton
    )
  ) : null;

  const sortIcon = canSort ? (
    <Button
      variant="ghost"
      size="icon-xs"
      className={cn(SLOT_BUTTON_CLASS, iconSurface, sorted ? ACTIVE_ICON_CLASS : HOVER_ONLY_CLASS)}
      aria-label={sorted ? `${meta.title} ordenada: ${direction}. Mudar` : `Ordenar por ${meta.title}`}
      onClick={(e) => column.toggleSorting(undefined, e.shiftKey)}
    >
      {sorted === "desc" ? (
        <ArrowDown className="size-3" strokeWidth={ACTIVE_STROKE} aria-hidden />
      ) : sorted === "asc" ? (
        <ArrowUp className="size-3" strokeWidth={ACTIVE_STROKE} aria-hidden />
      ) : (
        <ArrowUpDown className="size-3" aria-hidden />
      )}
      {sorted && sortCount > 1 ? (
        <span className="text-[11px] font-semibold leading-none tabular-nums">{column.getSortIndex() + 1}</span>
      ) : null}
    </Button>
  ) : null;

  const sortNextToLabel = right ? !filtered || Boolean(sorted) : Boolean(sorted) && !filtered;
  const icons = hasIcons ? (
    right === sortNextToLabel ? (
      <>
        {filterIcon}
        {sortIcon}
      </>
    ) : (
      <>
        {sortIcon}
        {filterIcon}
      </>
    )
  ) : null;

  const iconsSlot = hasIcons ? (
    iconsInFlow ? (
      <span className={cn("flex shrink-0 items-center", right ? "mr-1 -ml-1.5" : "-mr-1.5 ml-1")}>{icons}</span>
    ) : (
      <span
        className={cn(
          "absolute top-1/2 z-[1] flex -translate-y-1/2 items-center",
          right ? "right-full" : last ? "right-0" : "left-full",
        )}
      >
        {icons}
      </span>
    )
  ) : null;

  return (
    <th
      scope="col"
      style={pinnedStyle}
      aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
      className={cn(
        "group/th px-3 align-middle font-medium",
        right ? "text-right" : align === "center" ? "text-center" : "text-left",
        column.columnDef.meta?.className,
        "font-sans align-middle",
        grow && growHeaderClass(meta),
        meta.headerWrap && "whitespace-normal leading-4",
        divided && DIVIDED_CLASS,
        groupEnd && GROUP_END_CLASS,
        pinnedClass,
      )}
    >
      <div className={cn("flex items-center", right && "justify-end", align === "center" && "justify-center")}>
        {iconsInFlow && right ? iconsSlot : null}
        <span className="relative inline-flex items-center">
          {iconsInFlow ? null : iconsSlot}
          <span className={cn((filtered || sorted) && "text-foreground")}>{meta.title}</span>
          {unit ? <span className="ml-1 font-normal text-muted-foreground">{unit}</span> : null}
          {meta.description ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-1 inline-flex" tabIndex={0} aria-label={meta.description}>
                  <Info className="size-3 text-muted-foreground" aria-hidden />
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs font-normal">{meta.description}</TooltipContent>
            </Tooltip>
          ) : null}
        </span>
        {iconsInFlow && !right ? iconsSlot : null}
      </div>
    </th>
  );
}
