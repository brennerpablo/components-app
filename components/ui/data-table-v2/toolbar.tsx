"use client";

import type { ColumnFiltersState, SortingState, Table } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronsDownUp,
  ChevronsUpDown,
  Columns3,
  Download,
  Funnel,
  Layers,
  LayoutGrid,
  LayoutList,
  Maximize2,
  Minimize2,
  Rows3,
  Search,
  X,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { exportTableToCSV } from "@/lib/exportTableToCSV";
import { exportTableToXLSX } from "@/lib/exportTableToXLSX";
import { cn } from "@/lib/utils";

import { TableCheckbox } from "./checkbox";
import { ColumnsPanel } from "./columns-panel";
import { CountBadge } from "./count-badge";
import { exportView } from "./export-view";
import { type FilterColumn, type FilterCounter, FilterPanel } from "./filter-panel";
import { countLabel, formatNumberBr } from "./model";
import { PopoverFrame } from "./popover-frame";
import { type SortColumn, SortPanel } from "./sort-panel";
import type { DataTableV2CardView, DataTableV2Controls, DataTableV2RowLabel } from "./types";
import { ViewSwitch, type ViewSwitchOption } from "./view-switch";

type ToolbarProps<TData> = {
  table: Table<TData>;
  rowLabel: DataTableV2RowLabel;
  totalRows: number;
  title?: string;
  loose: boolean;
  controls: DataTableV2Controls;
  enableSearch: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterColumns: FilterColumn[];
  filters: ColumnFiltersState;
  onFiltersChange: (next: ColumnFiltersState) => void;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  focusFilterColumnId: string | null;
  countFilters: FilterCounter;
  sortColumns: SortColumn[];
  sorting: SortingState;
  onSortingChange: (next: SortingState) => void;
  compact: boolean;
  onToggleDensity?: () => void;
  cardView?: DataTableV2CardView;
  onCardViewChange?: (view: DataTableV2CardView) => void;
  isFullscreen: boolean;
  onToggleFullscreen?: () => void;
  enableExport: boolean;
  enableColumnOptions: boolean;
  columnOrder: string[];
  columnLabelOf: (id: string) => { title: string; subtitle?: string };
  onColumnOrderChange: (next: string[]) => void;
  onColumnsReset: () => void;
  columnsChanged: boolean;
  tree?: {
    levels: number;
    current: number | null;
    onChange: (level: number) => void;
    picker?: TreeLevelPicker;
  };
  sections?: { onExpandAll: () => void; onCollapseAll: () => void };
  tableName: string;
  exportValues?: ReadonlyMap<string, (row: TData) => unknown>;
  onExport?: () => void | Promise<void>;
  pagination?: React.ReactNode;
  narrowedCount?: { shown: number; total: number };
  screenControls?: React.ReactNode;
};

type TreeLevelPicker = {
  options: { id: string; label: string; visible: boolean }[];
  onToggle: (id: string, visible: boolean) => void;
};

function IconAction({
  label,
  className,
  ref,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={ref}
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          className={cn("text-muted-foreground hover:text-foreground", className)}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

const PANEL_TRIGGER_CLASS = "gap-1.5 px-2 text-xs data-[state=open]:bg-accent";

const CARD_VIEW_OPTIONS: readonly ViewSwitchOption<DataTableV2CardView>[] = [
  { value: "grid", label: "Grade", title: "Ver em grade", icon: LayoutGrid },
  { value: "list", label: "Lista", title: "Ver em lista", icon: LayoutList },
];

const ACTIVE_ICON_CLASS = "relative text-foreground hover:text-foreground";

function ActiveDot() {
  return <span className="absolute right-1 top-1 size-1.5 rounded-full bg-primary" aria-hidden />;
}

function TreeLevelPickerButton({ options, onToggle }: TreeLevelPicker) {
  const visibleCount = options.filter((option) => option.visible).length;
  const hiddenCount = options.length - visibleCount;
  return (
    <PopoverFrame
      size="xs"
      align="end"
      icon={Layers}
      title="Níveis da árvore"
      trigger={
        <IconAction
          label={
            hiddenCount > 0
              ? `Escolher níveis: ${hiddenCount} ${hiddenCount === 1 ? "escondido" : "escondidos"}`
              : "Escolher níveis"
          }
          className={cn("data-[state=open]:bg-accent", hiddenCount > 0 && ACTIVE_ICON_CLASS)}
        >
          <Layers aria-hidden />
          {hiddenCount > 0 ? <ActiveDot /> : null}
        </IconAction>
      }
    >
      <div className="flex flex-col p-1.5 text-xs">
        {options.map((option) => {
          const locked = option.visible && visibleCount <= 1;
          return (
            <label
              key={option.id}
              className={cn(
                "flex min-h-8 items-center gap-2 rounded-sm px-1.5 select-none",
                locked ? "text-muted-foreground" : "cursor-pointer hover:bg-accent",
              )}
            >
              <TableCheckbox
                checked={option.visible}
                disabled={locked}
                onCheckedChange={(checked) => onToggle(option.id, checked === true)}
              />
              <span className="min-w-0 truncate">{option.label}</span>
            </label>
          );
        })}
      </div>
    </PopoverFrame>
  );
}

export function Toolbar<TData>({
  table,
  rowLabel,
  totalRows,
  title,
  loose,
  controls,
  enableSearch,
  search,
  onSearchChange,
  searchPlaceholder,
  filterColumns,
  filters,
  onFiltersChange,
  filterOpen,
  onFilterOpenChange,
  focusFilterColumnId,
  countFilters,
  sortColumns,
  sorting,
  onSortingChange,
  compact,
  onToggleDensity,
  cardView,
  onCardViewChange,
  isFullscreen,
  onToggleFullscreen,
  enableExport,
  enableColumnOptions,
  columnOrder,
  columnLabelOf,
  onColumnOrderChange,
  onColumnsReset,
  columnsChanged,
  tree,
  sections,
  tableName,
  exportValues,
  onExport,
  pagination,
  narrowedCount,
  screenControls,
}: ToolbarProps<TData>) {
  const hideable = table.getAllLeafColumns().filter((c) => c.getCanHide());
  const hasColumnPanel = enableColumnOptions && (hideable.length > 0 || columnOrder.length > 1);
  const levelPicker = tree?.picker && tree.picker.options.length > 1 ? tree.picker : null;
  const hasTreeControls = Boolean(tree && (tree.levels > 1 || levelPicker));
  const hasActions = Boolean(
    hasTreeControls ||
    sections ||
    enableExport ||
    hasColumnPanel ||
    onCardViewChange ||
    onToggleDensity ||
    onToggleFullscreen,
  );
  const searchLabel = searchPlaceholder ?? `Buscar em ${countLabel(totalRows, rowLabel)}`;
  const exportSource = () => exportView(table, { tree: Boolean(tree), values: exportValues });
  const hasPanels = filterColumns.length > 0 || sortColumns.length > 0;
  const icons = controls === "icons";

  const searchField = (
    <label
      className={cn(
        "flex h-8 items-center gap-2 rounded-md px-2 text-muted-foreground transition-colors",
        loose || icons ? "border border-input bg-background focus-within:border-ring" : "focus-within:bg-accent",
        icons ? "w-full" : "w-56 max-sm:w-auto max-sm:min-w-36 max-sm:flex-1",
      )}
    >
      <Search className="size-4 shrink-0" aria-hidden />
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchLabel}
        aria-label={searchLabel}
        className="w-full min-w-0 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none"
      />
      {search ? (
        <button
          type="button"
          aria-label="Limpar busca"
          className="flex size-5 shrink-0 items-center justify-center rounded-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onSearchChange("")}
        >
          <X className="size-3.5" aria-hidden />
        </button>
      ) : null}
    </label>
  );

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-4 gap-y-1",
        loose ? "min-h-8" : "min-h-12 border-b border-border px-2 py-1.5",
      )}
    >
      <div className="flex min-w-0 items-center gap-1 max-sm:w-full max-sm:flex-wrap">
        {title ? (
          <>
            <h3 className={cn("pr-1 text-sm font-semibold text-foreground", !loose && "pl-1")}>{title}</h3>
            <CountBadge>{formatNumberBr(totalRows)}</CountBadge>
            {enableSearch || hasPanels ? <span className="mx-1 h-5 w-px bg-border max-sm:hidden" aria-hidden /> : null}
          </>
        ) : null}

        {enableSearch && icons ? (
          <Popover>
            <PopoverTrigger asChild>
              <IconAction label="Buscar" className={cn(search && ACTIVE_ICON_CLASS)}>
                <Search aria-hidden />
                {search ? <ActiveDot /> : null}
              </IconAction>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-1.5">
              {searchField}
            </PopoverContent>
          </Popover>
        ) : enableSearch ? (
          searchField
        ) : null}
        {enableSearch && hasPanels && !icons && !loose ? (
          <span className="mx-1 h-5 w-px bg-border max-sm:hidden" aria-hidden />
        ) : null}

        {filterColumns.length > 0 ? (
          <PopoverFrame
            open={filterOpen}
            onOpenChange={onFilterOpenChange}
            trigger={
              icons ? (
                <IconAction
                  label={filters.length > 0 ? `Filtrar: ${filters.length} em uso` : "Filtrar"}
                  className={cn("data-[state=open]:bg-accent", filters.length > 0 && ACTIVE_ICON_CLASS)}
                >
                  <Funnel aria-hidden />
                  {filters.length > 0 ? <ActiveDot /> : null}
                </IconAction>
              ) : (
                <Button variant="ghost" size="sm" className={PANEL_TRIGGER_CLASS}>
                  <Funnel className="size-3.5" aria-hidden />
                  Filtrar
                  {filters.length > 0 ? <CountBadge>{filters.length}</CountBadge> : null}
                </Button>
              )
            }
            title="Filtros"
            icon={Funnel}
            size="sm"
            align="start"
            bodyClassName="grid-scrollbar"
            className="data-[side=top]:h-[min(32rem,var(--radix-popover-content-available-height))]"
          >
            <FilterPanel
              columns={filterColumns}
              applied={filters}
              focusColumnId={focusFilterColumnId}
              rowLabel={rowLabel}
              countWith={countFilters}
              onApply={(next) => {
                onFiltersChange(next);
                onFilterOpenChange(false);
              }}
              onClear={() => onFiltersChange([])}
              onCancel={() => onFilterOpenChange(false)}
            />
          </PopoverFrame>
        ) : null}

        {sortColumns.length > 0 ? (
          <PopoverFrame
            trigger={
              icons ? (
                <IconAction
                  label={sorting.length > 0 ? `Ordenar: ${sorting.length} em uso` : "Ordenar"}
                  className={cn("data-[state=open]:bg-accent", sorting.length > 0 && ACTIVE_ICON_CLASS)}
                >
                  <ArrowUpDown aria-hidden />
                  {sorting.length > 0 ? <ActiveDot /> : null}
                </IconAction>
              ) : (
                <Button variant="ghost" size="sm" className={PANEL_TRIGGER_CLASS}>
                  <ArrowUpDown className="size-3.5" aria-hidden />
                  Ordenar
                  {sorting.length > 0 ? <CountBadge>{sorting.length}</CountBadge> : null}
                </Button>
              )
            }
            title="Ordenar"
            icon={ArrowUpDown}
            size="md"
            align="start"
          >
            <SortPanel columns={sortColumns} sorting={sorting} onChange={onSortingChange} />
          </PopoverFrame>
        ) : null}

        {narrowedCount ? (
          <span role="status" className="whitespace-nowrap px-1.5 text-xs tabular-nums text-muted-foreground">
            {formatNumberBr(narrowedCount.shown)} de{" "}
            {icons ? formatNumberBr(narrowedCount.total) : countLabel(narrowedCount.total, rowLabel)}
          </span>
        ) : null}
      </div>

      <div className="ml-auto flex min-w-0 items-center gap-1 max-sm:flex-wrap max-sm:justify-end">
        {screenControls ? (
          <>
            {screenControls}
            {pagination || hasActions ? <span className="mx-1 h-5 w-px bg-border" aria-hidden /> : null}
          </>
        ) : null}
        {pagination ? (
          <>
            {pagination}
            {hasActions ? <span className="mx-1 h-5 w-px bg-border" aria-hidden /> : null}
          </>
        ) : null}

        {tree && hasTreeControls ? (
          <>
            {tree.levels > 1 ? (
              <>
                <span className="text-xs text-muted-foreground">Níveis</span>
                <ViewSwitch
                  ariaLabel="Abrir até o nível"
                  size="sm"
                  itemClassName="tabular-nums"
                  value={tree.current == null ? null : String(tree.current)}
                  onValueChange={(level) => tree.onChange(Number(level))}
                  onDeselect={() => {
                    if (tree.current != null) tree.onChange(tree.current);
                  }}
                  options={Array.from({ length: tree.levels }, (_, i) => ({
                    value: String(i + 1),
                    label: i + 1,
                    ariaLabel: `Abrir até o nível ${i + 1}`,
                  }))}
                />
              </>
            ) : null}
            {levelPicker ? (
              <TreeLevelPickerButton options={levelPicker.options} onToggle={levelPicker.onToggle} />
            ) : null}
            <span className="mx-1 h-5 w-px bg-border" aria-hidden />
          </>
        ) : null}

        {sections ? (
          <>
            <IconAction label="Abrir todas as seções" onClick={sections.onExpandAll}>
              <ChevronsUpDown aria-hidden />
            </IconAction>
            <IconAction label="Recolher todas as seções" onClick={sections.onCollapseAll}>
              <ChevronsDownUp aria-hidden />
            </IconAction>
            <span className="mx-1 h-5 w-px bg-border" aria-hidden />
          </>
        ) : null}

        {onCardViewChange && cardView ? (
          <>
            <ViewSwitch
              ariaLabel="Vista"
              value={cardView}
              onValueChange={onCardViewChange}
              options={CARD_VIEW_OPTIONS}
            />
            {enableExport || hasColumnPanel || onToggleDensity || onToggleFullscreen ? (
              <span className="mx-1 h-5 w-px bg-border" aria-hidden />
            ) : null}
          </>
        ) : null}

        {enableExport && onExport ? (
          <IconAction label="Exportar" onClick={() => void onExport()}>
            <Download aria-hidden />
          </IconAction>
        ) : enableExport ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconAction label="Exportar">
                <Download aria-hidden />
              </IconAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => void exportTableToCSV(exportSource(), tableName)}>.csv</DropdownMenuItem>
              <DropdownMenuItem onClick={() => void exportTableToXLSX(exportSource(), tableName)}>.xlsx</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}

        {hasColumnPanel ? (
          <PopoverFrame
            size="xs"
            align="end"
            icon={Columns3}
            title="Colunas"
            trigger={
              <IconAction label="Colunas">
                <Columns3 aria-hidden />
              </IconAction>
            }
          >
            <ColumnsPanel
              table={table}
              order={columnOrder}
              labelOf={columnLabelOf}
              onOrderChange={onColumnOrderChange}
              onReset={onColumnsReset}
              canReset={columnsChanged}
            />
          </PopoverFrame>
        ) : null}

        {onToggleDensity ? (
          <IconAction
            label={compact ? "Linhas confortáveis" : "Linhas compactas"}
            aria-pressed={compact}
            className={cn(compact && "bg-accent text-foreground")}
            onClick={onToggleDensity}
          >
            <Rows3 aria-hidden />
          </IconAction>
        ) : null}

        {onToggleFullscreen ? (
          <IconAction label={isFullscreen ? "Sair da tela cheia" : "Tela cheia"} onClick={onToggleFullscreen}>
            {isFullscreen ? <Minimize2 aria-hidden /> : <Maximize2 aria-hidden />}
          </IconAction>
        ) : null}
      </div>
    </div>
  );
}
