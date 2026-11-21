"use client";

import {
  type Cell,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Updater,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Funnel } from "lucide-react";
import * as React from "react";
import ReactDOM from "react-dom";

import { chartColorToCss } from "@/components/charts/utils/chartColors";
import { DataTableStickyHeader } from "@/components/ui/data-table/DataTableStickyHeader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { cn } from "@/lib/utils";

import { ColumnFilterCard } from "./column-filter-card";
import { ColumnLabel } from "./column-label";
import {
  ACTIONS_CELL_CLASS,
  ACTIONS_COLUMN_ID,
  buildDefaultColumnVisibility,
  buildV2Columns,
  createActionsColumn,
  createRowIndexer,
  createSelectColumn,
  enrichMetadata,
  SELECT_COLUMN_ID,
} from "./columns";
import { CountBadge } from "./count-badge";
import type { FilterColumn, FilterCounter } from "./filter-panel";
import { FilterStrip, type FilterStripItem } from "./filter-strip";
import { FloatingScrollbar } from "./floating-scrollbar";
import {
  type ColumnFilterAnchor,
  GROUP_END_CLASS,
  HeaderCell,
  PINNED_HEADER_CLASS,
  PINNED_HEADER_PLAIN_CLASS,
  SOFT_SURFACE,
} from "./header-cell";
import {
  alignOf,
  columnGroupSpans,
  columnTotal,
  countLabel,
  filterKindOf,
  formatNumberBr,
  growCellClass,
  heatmapBackground,
  heatmapDomains,
  hiddenTreeLevels,
  isCappedTextColumn,
  isClampedTextColumn,
  isFilterActive,
  lastValidPageIndex,
  matchesSearch,
  normalizeTreeLevelChoices,
  normalizeUnit,
  pickGrowColumn,
  resolveColumnOrder,
  searchTerms,
  summarizeFilter,
  TEXT_CAP_CLASS,
  toggleTreeLevel,
  treeWithoutLevels,
} from "./model";
import {
  expandedNodes,
  flattenTree,
  groupBySection,
  limitChildren,
  treeLevelCount,
  treeRowId,
  treeRowIds,
  walkTree,
} from "./nesting";
import { InlinePagination, PaginationBar } from "./pagination-bar";
import type { PersistableColumn, TableView } from "./persistence";
import { PopoverFrame } from "./popover-frame";
import { RowToggle } from "./row-toggle";
import type { SortColumn } from "./sort-panel";
import { Toolbar } from "./toolbar";
import type {
  DataTableV2CardView,
  DataTableV2Column,
  DataTableV2Density,
  DataTableV2Props,
  DataTableV2RowLabel,
} from "./types";
import { useIsMobile } from "./use-mobile";
import { usePersistedView } from "./use-persisted-view";

const DEFAULT_ROW_LABEL: DataTableV2RowLabel = {
  singular: "linha",
  plural: "linhas",
};

const NO_FILTERS: ColumnFiltersState = [];

const SOFT_COLOR = "color-mix(in oklab, var(--muted) 50%, var(--background))";

const VAZIO = <span className="text-muted-foreground/60">—</span>;

const CARD_CELL_CLASS =
  "border-y border-border bg-background first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r group-hover/row:bg-[var(--dtv2-soft)] group-data-[state=selected]/row:bg-muted";

const TREE_INDENT = 20;

const UTILITY_WIDTH = 40;
const DETAIL_WIDTH = 44;
const DETAIL_PIN = "sticky left-0 z-[1] min-w-11 max-w-11";

const PINNED_CELL_CLASS =
  "sticky left-0 z-[1] bg-background shadow-[1px_0_0_0_var(--border)] group-hover/row:bg-[var(--dtv2-soft)] group-data-[state=selected]/row:bg-muted";
const PINNED_PHONE_CAP_CLASS = "max-md:max-w-[45vw] max-md:truncate";

export function DataTableV2<TData>({
  data,
  columnsMetadata,
  tableId,
  tableName = "export",
  rowLabel = DEFAULT_ROW_LABEL,
  density: initialDensity = "default",
  frame = "card",
  rowStyle = "lines",
  groupDividers = false,
  headerStyle = "soft",
  controls = "full",
  title,
  toolbarControls,
  enableToolbar = true,
  enableSearch = true,
  enableExport = true,
  enableColumnOptions = true,
  enableDensityToggle = true,
  enableFullscreen = false,
  enablePagination = true,
  paginationPosition = "toolbar",
  pageSize = 25,
  enableRowSelection = false,
  onBulkAction,
  onRowAction,
  renderRowActions,
  getSubRows,
  defaultExpandedDepth = 1,
  maxChildrenPerNode,
  treeLevels,
  renderDetail,
  hasDetail,
  initialOpenDetailIds,
  sections,
  renderCard,
  cardMinWidth = 320,
  cardView: initialCardView = "grid",
  enableCardViewToggle = false,
  initialSorting,
  initialColumnFilters,
  serverPagination,
  pinFirstColumn = false,
  pinColumns,
  serverSelectAll,
  stickyHeader = false,
  stickyHeaderOffset,
  getRowId,
  pinnedTopRowIds,
  fetching = false,
  emptyMessage = "Sem resultados.",
  summaryRow,
  serverSearch,
  searchState,
  columnFiltersState,
  footerNote,
  className,
}: DataTableV2Props<TData>) {
  const isMobile = useIsMobile();
  const [density, setDensity] = React.useState<DataTableV2Density>(initialDensity);
  const [cardView, setCardView] = React.useState<DataTableV2CardView>(initialCardView);
  const [localSearch, setLocalSearch] = React.useState("");
  const controlledSearch = serverPagination ? undefined : searchState;
  const search = controlledSearch ? controlledSearch.value : localSearch;
  const setSearch = controlledSearch ? controlledSearch.onChange : setLocalSearch;
  const [defaultView] = React.useState<TableView>(() => ({
    sorting: initialSorting ?? [],
    filters: initialColumnFilters ?? [],
    columnOrder: [],
    visibility: {},
    density: initialDensity,
    ...(enableCardViewToggle ? { cardView: initialCardView } : {}),
    ...(treeLevels && getSubRows ? { treeLevels: {} } : {}),
  }));
  const [localSorting, setLocalSorting] = React.useState<SortingState>(() => defaultView.sorting);
  const [localFilters, setLocalFilters] = React.useState<ColumnFiltersState>(() => defaultView.filters);
  const serverMode = Boolean(serverPagination);
  const sorting = serverPagination ? serverPagination.sorting : localSorting;
  const columnFilters = serverPagination
    ? (serverPagination.columnFilters ?? NO_FILTERS)
    : (columnFiltersState?.value ?? localFilters);
  const setSorting = (updater: Updater<SortingState>) => {
    if (!serverPagination) return setLocalSorting(updater);
    serverPagination.onSortingChange((prev) => (typeof updater === "function" ? updater(prev) : updater).slice(-1));
    serverPagination.onPaginationChange((prev) => ({ ...prev, pageIndex: 0 }));
  };
  const setColumnFilters = (updater: Updater<ColumnFiltersState>) => {
    if (!serverPagination) {
      return columnFiltersState ? columnFiltersState.onChange(updater) : setLocalFilters(updater);
    }
    serverPagination.onColumnFiltersChange?.(updater);
    serverPagination.onPaginationChange((prev) => ({ ...prev, pageIndex: 0 }));
  };
  const [userVisibility, setUserVisibility] = React.useState<VisibilityState>({});
  const [userOrder, setUserOrder] = React.useState<string[]>([]);
  const [levelChoices, setLevelChoices] = React.useState<Record<string, boolean>>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [focusFilterColumnId, setFocusFilterColumnId] = React.useState<string | null>(null);
  const [columnCard, setColumnCard] = React.useState<(ColumnFilterAnchor & { columnId: string }) | null>(null);
  const cardReturnsFocus = React.useRef(true);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const compact = density === "compact";
  const loose = frame !== "card";
  const cards = rowStyle === "cards";
  const striped = rowStyle === "striped";
  const divided = rowStyle === "grid";
  const plainHeader = headerStyle === "plain" || cards;
  const treeMode = Boolean(getSubRows);
  const detailMode = Boolean(renderDetail) && !treeMode;
  const sectionConfig = treeMode ? undefined : sections;
  const gridMode = Boolean(renderCard) && !treeMode && !detailMode && !sectionConfig;
  const pinnedKey = treeMode || sectionConfig || gridMode ? "" : (pinnedTopRowIds ?? []).join("\u0000");
  const rowPinning = React.useMemo(
    () => ({
      top: pinnedKey ? pinnedKey.split("\u0000") : [],
      bottom: [] as string[],
    }),
    [pinnedKey],
  );
  const hasPinned = rowPinning.top.length > 0;
  const [treeDepth, setTreeDepth] = React.useState(defaultExpandedDepth);
  const [nodeOverrides, setNodeOverrides] = React.useState<Record<string, boolean>>({});
  const [showAllChildren, setShowAllChildren] = React.useState<ReadonlySet<string>>(() => new Set());
  const [openDetails, setOpenDetails] = React.useState<ReadonlySet<string>>(() => new Set(initialOpenDetailIds));
  const openIdsKey = (initialOpenDetailIds ?? []).join("\n");
  const [seenOpenIdsKey, setSeenOpenIdsKey] = React.useState(openIdsKey);
  if (openIdsKey !== seenOpenIdsKey) {
    const before = new Set(seenOpenIdsKey ? seenOpenIdsKey.split("\n") : []);
    const added = (initialOpenDetailIds ?? []).filter((id) => !before.has(id));
    setSeenOpenIdsKey(openIdsKey);
    if (added.length) setOpenDetails((prev) => new Set([...prev, ...added]));
  }
  const [collapsedSections, setCollapsedSections] = React.useState<ReadonlySet<string>>(
    () => new Set(sections?.items.filter((item) => item.defaultCollapsed).map((item) => item.id)),
  );
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const tableRef = React.useRef<HTMLTableElement | null>(null);
  const headRef = React.useRef<HTMLTableSectionElement | null>(null);

  useBodyScrollLock(isFullscreen);
  React.useEffect(() => {
    if (!isFullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      setIsFullscreen(false);
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [isFullscreen]);

  const levelDefs = treeMode ? treeLevels?.levels : undefined;
  const levelOf = treeMode ? treeLevels?.getLevel : undefined;
  const levelState = React.useMemo(() => {
    if (!getSubRows || !levelDefs || !levelOf) return null;
    const present = new Set<string>();
    for (const row of flattenTree(data, getSubRows)) {
      const level = levelOf(row);
      if (level != null) present.add(level);
    }
    return {
      present,
      hidden: hiddenTreeLevels(levelDefs, present, levelChoices),
    };
  }, [data, getSubRows, levelDefs, levelOf, levelChoices]);
  const tree = React.useMemo<{
    roots: TData[];
    getSubRows: (row: TData) => TData[] | undefined;
  } | null>(() => {
    if (!getSubRows) return null;
    const hidden = levelState?.hidden;
    if (!levelOf || !hidden?.size) return { roots: data, getSubRows };
    return treeWithoutLevels(data, getSubRows, (row) => {
      const level = levelOf(row);
      return level != null && hidden.has(level);
    });
  }, [data, getSubRows, levelOf, levelState]);
  const hasRowId = Boolean(getRowId);
  const positionIds = React.useMemo(
    () => (getSubRows && levelOf && !hasRowId ? treeRowIds(data, getSubRows) : null),
    [data, getSubRows, levelOf, hasRowId],
  );
  const treeIdOf = React.useMemo(
    () => getRowId ?? (positionIds ? (row: TData) => positionIds.get(row) : undefined),
    [getRowId, positionIds],
  );

  const metadata = React.useMemo(
    () => enrichMetadata(columnsMetadata, tree ? flattenTree(tree.roots, tree.getSubRows) : data),
    [columnsMetadata, data, tree],
  );
  const metaById = React.useMemo(
    () => new Map<string, DataTableV2Column<TData>>(metadata.map((col) => [col.columnId, col])),
    [metadata],
  );
  const exportValues = React.useMemo(
    () =>
      new Map<string, (row: TData) => unknown>(
        metadata.flatMap((col) => (col.exportValue ? [[col.columnId, col.exportValue] as const] : [])),
      ),
    [metadata],
  );

  const heatmap = React.useMemo(() => {
    const cols = metadata.filter((col) => col.heatmap);
    if (!cols.length) return null;
    const all = getSubRows ? flattenTree(data, getSubRows) : data;
    const valueOf = (col: DataTableV2Column<TData>, row: TData): number | null => {
      const raw = col.heatmap?.getValue ? col.heatmap.getValue(row) : (row as Record<string, unknown>)[col.columnId];
      const n = typeof raw === "number" ? raw : raw == null || raw === "" ? null : Number(raw);
      return n == null || Number.isNaN(n) ? null : n;
    };
    const byId = new Map<string, DataTableV2Column<TData>>(cols.map((col) => [col.columnId, col]));
    const domains = heatmapDomains(
      cols.map((col) => ({
        id: col.columnId,
        scale: col.heatmap?.scale,
        domain: col.heatmap?.domain,
      })),
      (id) => all.map((row) => valueOf(byId.get(id) as DataTableV2Column<TData>, row)),
    );
    return { domains, valueOf };
  }, [metadata, data, getSubRows]);
  const heatStyle = (col: DataTableV2Column<TData> | undefined, row: TData): React.CSSProperties | undefined => {
    if (!heatmap || !col?.heatmap) return undefined;
    const domain = heatmap.domains.get(col.heatmap.scale ?? col.columnId);
    if (!domain) return undefined;
    const bg = heatmapBackground(
      chartColorToCss(col.heatmap.baseColor),
      heatmap.valueOf(col, row),
      domain,
      col.heatmap.maxAlpha ?? 0.28,
    );
    return bg ? { backgroundColor: bg } : undefined;
  };

  const indexOf = React.useMemo(() => createRowIndexer(metadata), [metadata]);
  const deferredSearch = React.useDeferredValue(search);
  const visibleData = React.useMemo(() => {
    if (tree) return tree.roots;
    if (serverMode) return data;
    const terms = searchTerms(deferredSearch);
    return terms.length ? data.filter((row) => matchesSearch(indexOf(row), terms)) : data;
  }, [data, deferredSearch, indexOf, tree, serverMode]);

  const rowIdOf = React.useMemo(() => {
    if (treeMode) {
      return (row: TData, index: number, parent?: Row<TData>) => treeRowId(treeIdOf?.(row), index, parent?.id);
    }
    if (getRowId) return getRowId;
    const position = new Map<TData, number>(data.map((row, i) => [row, i]));
    return (row: TData) => String(position.get(row) ?? -1);
  }, [data, getRowId, treeMode, treeIdOf]);

  const treeNodes = React.useMemo(
    () => (tree ? walkTree(tree.roots, tree.getSubRows, treeIdOf) : []),
    [tree, treeIdOf],
  );
  const depthLevels = treeLevelCount(treeNodes);
  const narrowing = deferredSearch.trim() !== "" || columnFilters.length > 0;
  const expanded = React.useMemo(
    () => expandedNodes(treeNodes, narrowing ? Infinity : treeDepth, narrowing ? {} : nodeOverrides),
    [narrowing, nodeOverrides, treeDepth, treeNodes],
  );

  const hasRowActions = Boolean(renderRowActions || onRowAction?.onAdd || onRowAction?.onEdit || onRowAction?.onDelete);
  const onRowActionRef = React.useRef(onRowAction);
  React.useEffect(() => {
    onRowActionRef.current = onRowAction;
  });
  const hasOnAdd = Boolean(onRowAction?.onAdd);
  const hasOnEdit = Boolean(onRowAction?.onEdit);
  const hasOnDelete = Boolean(onRowAction?.onDelete);
  const utilityColumns = React.useMemo(
    () => [
      ...(enableRowSelection ? [createSelectColumn<TData>()] : []),
      ...(hasRowActions
        ? [
            createActionsColumn<TData>(
              {
                onAdd: hasOnAdd ? (row) => onRowActionRef.current?.onAdd?.(row) : undefined,
                onEdit: hasOnEdit ? (row) => onRowActionRef.current?.onEdit?.(row) : undefined,
                onDelete: hasOnDelete ? (row) => onRowActionRef.current?.onDelete?.(row) : undefined,
              },
              renderRowActions,
            ),
          ]
        : []),
    ],
    [enableRowSelection, hasRowActions, hasOnAdd, hasOnEdit, hasOnDelete, renderRowActions],
  );
  const columns = React.useMemo(() => [...utilityColumns, ...buildV2Columns(metadata)], [utilityColumns, metadata]);

  const baseVisibility = React.useMemo(() => {
    const base = buildDefaultColumnVisibility(columnsMetadata);
    for (const col of columnsMetadata) if (col.filterOnly) base[col.columnId] = false;
    return base;
  }, [columnsMetadata]);
  const columnVisibility = React.useMemo(() => {
    const merged = { ...baseVisibility, ...userVisibility };
    for (const col of columnsMetadata) if (col.filterOnly) merged[col.columnId] = false;
    return merged;
  }, [baseVisibility, columnsMetadata, userVisibility]);
  const handleVisibilityChange = React.useCallback(
    (updater: Updater<VisibilityState>) =>
      setUserVisibility((prev) => (typeof updater === "function" ? updater({ ...baseVisibility, ...prev }) : updater)),
    [baseVisibility, setUserVisibility],
  );

  const dataOrder = React.useMemo(
    () =>
      resolveColumnOrder(
        userOrder,
        metadata.map((col) => col.columnId),
      ),
    [metadata, userOrder],
  );
  const columnOrder = React.useMemo(
    () => [
      ...(enableRowSelection ? [SELECT_COLUMN_ID] : []),
      ...(hasRowActions ? [ACTIONS_COLUMN_ID] : []),
      ...dataOrder,
    ],
    [dataOrder, enableRowSelection, hasRowActions],
  );
  const pickerOrder = React.useMemo(
    () => dataOrder.filter((id) => !metaById.get(id)?.filterOnly),
    [dataOrder, metaById],
  );
  const orderToSave = React.useMemo(
    () => (dataOrder.every((id, i) => id === metadata[i]?.columnId) ? [] : dataOrder),
    [dataOrder, metadata],
  );
  const visibilityToSave = React.useMemo(() => {
    const changed: VisibilityState = {};
    for (const col of metadata) {
      if (col.filterOnly || col.hideable === false) continue;
      const visible = columnVisibility[col.columnId] ?? true;
      if (visible !== (baseVisibility[col.columnId] ?? true)) changed[col.columnId] = visible;
    }
    return changed;
  }, [baseVisibility, columnVisibility, metadata]);
  const columnsChanged = orderToSave.length > 0 || Object.keys(visibilityToSave).length > 0;
  const columnLabelOf = React.useCallback(
    (id: string) => {
      const col = metaById.get(id);
      return {
        title: col?.title ?? id,
        subtitle: normalizeUnit(col?.subtitle),
      };
    },
    [metaById],
  );
  const resetColumns = React.useCallback(() => {
    setUserOrder([]);
    setUserVisibility({});
  }, [setUserOrder, setUserVisibility]);

  const levelsToSave = React.useMemo(
    () => (levelDefs ? normalizeTreeLevelChoices(levelDefs, levelChoices) : undefined),
    [levelDefs, levelChoices],
  );

  const persistableColumns = React.useMemo<PersistableColumn[]>(
    () =>
      metadata.map((col) => ({
        id: col.columnId,
        sortable: Boolean(col.sortable) && !col.filterOnly,
        hideable: !col.filterOnly && col.hideable !== false,
        kind: filterKindOf(col),
      })),
    [metadata],
  );
  usePersistedView({
    tableId,
    columns: persistableColumns,
    defaults: defaultView,
    treeLevelIds: levelDefs?.map((level) => level.id),
    view: {
      sorting,
      filters: columnFilters,
      columnOrder: orderToSave,
      visibility: visibilityToSave,
      density,
      ...(enableCardViewToggle ? { cardView } : {}),
      ...(levelsToSave ? { treeLevels: levelsToSave } : {}),
    },
    onRestore: (saved) => {
      setSorting(saved.sorting);
      setColumnFilters(saved.filters);
      setUserOrder(saved.columnOrder);
      setUserVisibility(saved.visibility);
      setDensity(saved.density);
      if (saved.cardView) setCardView(saved.cardView);
      if (saved.treeLevels) setLevelChoices(saved.treeLevels);
    },
  });

  const table = useReactTable({
    data: visibleData,
    columns,
    getRowId: rowIdOf,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
      rowSelection,
      ...(hasPinned ? { rowPinning } : {}),
      ...(treeMode ? { expanded, globalFilter: deferredSearch } : {}),
      ...(serverPagination ? { pagination: serverPagination.pagination } : {}),
    },
    ...(treeMode
      ? {
          getSubRows: (row: TData) => tree?.getSubRows(row),
          getExpandedRowModel: getExpandedRowModel(),
          filterFromLeafRows: true,
          paginateExpandedRows: !enablePagination,
          globalFilterFn: (row: Row<TData>, _columnId: string, value: unknown) =>
            matchesSearch(indexOf(row.original), searchTerms(String(value ?? ""))),
          getColumnCanGlobalFilter: (column: { id: string }) => column.id === metadata[0]?.columnId,
        }
      : {}),
    initialState: { pagination: { pageIndex: 0, pageSize } },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: handleVisibilityChange,
    onRowSelectionChange: setRowSelection,
    enableRowSelection:
      hasPinned && enableRowSelection ? (row: Row<TData>) => !rowPinning.top.includes(row.id) : enableRowSelection,
    ...(hasPinned ? { enableRowPinning: true, keepPinnedRows: true } : {}),
    enableMultiSort: !serverMode,
    getCoreRowModel: getCoreRowModel(),
    ...(serverPagination
      ? {
          manualPagination: true,
          manualSorting: true,
          manualFiltering: true,
          rowCount: serverPagination.totalRows,
          pageCount: Math.max(
            1,
            Math.ceil(serverPagination.totalRows / Math.max(1, serverPagination.pagination.pageSize)),
          ),
          onPaginationChange: serverPagination.onPaginationChange,
        }
      : {
          getFilteredRowModel: getFilteredRowModel(),
          getSortedRowModel: getSortedRowModel(),
          ...(enablePagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
        }),
  });

  const serverPageIndex = serverPagination?.pagination.pageIndex ?? 0;
  const serverPageSize = serverPagination?.pagination.pageSize ?? pageSize;
  const serverTotalRows = serverPagination?.totalRows ?? 0;
  const backToLastPage = React.useEffectEvent((last: number) =>
    serverPagination?.onPaginationChange((prev) => ({
      ...prev,
      pageIndex: last,
    })),
  );
  React.useEffect(() => {
    if (!serverMode) return;
    const last = lastValidPageIndex(serverPageIndex, serverPageSize, serverTotalRows);
    if (last != null) backToLastPage(last);
  }, [serverMode, serverPageIndex, serverPageSize, serverTotalRows]);

  const filterColumns = React.useMemo<FilterColumn[]>(
    () =>
      metadata.flatMap((col) => {
        const kind = filterKindOf(col);
        return kind
          ? [
              {
                id: col.columnId,
                title: col.title,
                subtitle: normalizeUnit(col.subtitle),
                kind,
                options: col.options ?? [],
                unit: col.filterUnit,
                single: col.filters?.select === true,
              },
            ]
          : [];
      }),
    [metadata],
  );
  const sortColumns = React.useMemo<SortColumn[]>(
    () =>
      metadata.flatMap((col) =>
        col.sortable && !col.filterOnly
          ? [
              {
                id: col.columnId,
                title: col.title,
                subtitle: normalizeUnit(col.subtitle),
                type: col.type,
              },
            ]
          : [],
      ),
    [metadata],
  );
  const filterSummaries = React.useMemo(() => {
    const out = new Map<string, string>();
    for (const filter of columnFilters) {
      const col = metaById.get(filter.id);
      const kind = col ? filterKindOf(col) : null;
      if (!col || !kind || !isFilterActive(kind, filter.value)) continue;
      const labels = new Map((col.options ?? []).map((o) => [o.value, o.label]));
      out.set(
        filter.id,
        summarizeFilter(kind, filter.value, (v) => labels.get(v) ?? v, col.filterUnit),
      );
    }
    return out;
  }, [columnFilters, metaById]);

  const openFilterPanel = React.useCallback((columnId: string | null) => {
    setColumnCard(null);
    setFocusFilterColumnId(columnId);
    setFilterOpen(true);
  }, []);
  const openColumnCard = React.useCallback((columnId: string, anchor: ColumnFilterAnchor) => {
    setColumnCard((prev) => (prev && prev.trigger === anchor.trigger ? null : { columnId, ...anchor }));
  }, []);

  const countFilters = React.useCallback<FilterCounter>(
    (filters) => {
      if (serverMode || treeMode) return null;
      const checks = filters.flatMap((filter) => {
        const fn = table.getColumn(filter.id)?.getFilterFn();
        if (!fn) return [];
        const value = fn.resolveFilterValue ? fn.resolveFilterValue(filter.value) : filter.value;
        return [{ id: filter.id, value, fn }];
      });
      let count = 0;
      for (const row of table.getCoreRowModel().rows) {
        if (checks.every((c) => c.fn(row, c.id, c.value, () => {}))) count += 1;
      }
      return count;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `table` is stable; new data arrives through visibleData
    [serverMode, treeMode, table, visibleData],
  );

  const removeFilter = (columnId: string) => {
    if (columnCard?.columnId === columnId) setColumnCard(null);
    setColumnFilters((prev) => prev.filter((f) => f.id !== columnId));
  };
  const setColumnFilter = (columnId: string, value: unknown) =>
    setColumnFilters((prev) => {
      const rest = prev.filter((f) => f.id !== columnId);
      return value === undefined ? rest : [...rest, { id: columnId, value }];
    });

  const stripItems = React.useMemo<FilterStripItem[]>(
    () =>
      filterColumns.flatMap((col) => {
        const summary = filterSummaries.get(col.id);
        return summary ? [{ id: col.id, title: col.title, summary }] : [];
      }),
    [filterColumns, filterSummaries],
  );
  const cardColumn = columnCard ? filterColumns.find((col) => col.id === columnCard.columnId) : undefined;
  const cardApplied = columnCard ? columnFilters.find((f) => f.id === columnCard.columnId)?.value : undefined;
  const cardCountWith = React.useCallback(
    (value: unknown) => {
      if (!columnCard) return null;
      const rest = columnFilters.filter((f) => f.id !== columnCard.columnId);
      return countFilters(value === undefined ? rest : [...rest, { id: columnCard.columnId, value }]);
    },
    [columnCard, columnFilters, countFilters],
  );
  const cardAnchorRef = React.useMemo(
    () => ({ current: columnCard?.anchor ?? null }) as React.RefObject<{ getBoundingClientRect(): DOMRect }>,
    [columnCard],
  );

  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();
  const visibleColumnCount = Math.max(1, visibleColumns.length) + (detailMode ? 1 : 0);
  const firstDataColumnId = visibleColumns.find((column) => metaById.has(column.id))?.id;
  const growColumnId = pickGrowColumn(
    visibleColumns.flatMap((column) => {
      const col = metaById.get(column.id);
      return col ? [col] : [];
    }),
    data[0],
  );
  const pinData = isMobile ? 1 : (pinColumns ?? (pinFirstColumn ? 1 : 0));
  const firstDataIndex = visibleColumns.findIndex((column) => metaById.has(column.id));
  const pinCount = pinData > 0 ? Math.min(visibleColumns.length, Math.max(0, firstDataIndex) + pinData) : 0;
  const groupOf = (index: number) => metaById.get(visibleColumns[index]?.id ?? "")?.group || null;
  const endsGroup = (index: number) => {
    const group = groupOf(index);
    return groupDividers && group != null && index < visibleColumns.length - 1 && groupOf(index + 1) !== group;
  };
  const pinDetail = detailMode && pinCount > 0;
  const pinBase = pinDetail ? DETAIL_WIDTH : 0;
  const [pinWidths, setPinWidths] = React.useState<readonly number[]>([]);
  const pinLeft = (index: number) => {
    let left = pinBase;
    for (let i = 0; i < index; i += 1) left += pinWidths[i] ?? UTILITY_WIDTH;
    return left;
  };
  const pinOf = (index: number): false | { left: number; last: boolean } =>
    index < pinCount ? { left: pinLeft(index), last: index === pinCount - 1 } : false;

  React.useEffect(() => {
    if (pinData <= 1 || pinCount === 0) return;
    const medir = () => {
      const ultima = headRef.current?.rows[headRef.current.rows.length - 1];
      if (!ultima) return;
      const inicio = pinDetail ? 1 : 0;
      const larguras = Array.from(ultima.cells)
        .slice(inicio, inicio + pinCount)
        .map((cell) => Math.round(cell.getBoundingClientRect().width));
      setPinWidths((prev) =>
        prev.length === larguras.length && prev.every((w, i) => w === larguras[i]) ? prev : larguras,
      );
    };
    medir();
    const tabela = tableRef.current;
    if (!tabela || typeof ResizeObserver === "undefined") return;
    const observador = new ResizeObserver(medir);
    observador.observe(tabela);
    return () => observador.disconnect();
  }, [pinData, pinCount, pinDetail]);

  const selecionadas = Object.keys(rowSelection).length;
  React.useEffect(() => {
    if (serverSelectAll?.selected && selecionadas === 0) serverSelectAll.onChange(false);
  }, [serverSelectAll, selecionadas]);

  const toggleNode = (id: string, open: boolean) => setNodeOverrides((prev) => ({ ...prev, [id]: !open }));
  const toggleIn = (set: ReadonlySet<string>, id: string) => {
    const next = new Set(set);
    if (!next.delete(id)) next.add(id);
    return next;
  };

  const childCounts = new Map<string, number>();
  if (treeMode) for (const row of rows) if (row.subRows.length) childCounts.set(row.id, row.subRows.length);
  const treeItems = treeMode
    ? limitChildren(rows, maxChildrenPerNode, showAllChildren, (parentId) => childCounts.get(parentId) ?? 0)
    : [];
  const sectionGroups = sectionConfig
    ? groupBySection(
        rows,
        sectionConfig.items.map((item) => item.id),
        (row) => sectionConfig.getSectionId(row.original),
        sectionConfig.fallbackSectionId,
      )
    : null;

  const paginates =
    enablePagination &&
    (table.getState().pagination.pageIndex > 0 ||
      (serverPagination ? serverPagination.totalRows : table.getFilteredRowModel().rows.length) > 0);
  const hasBar = paginates || enableRowSelection;
  const inlinePagination = paginationPosition === "toolbar" && enableToolbar;
  const barPosition = paginationPosition === "toolbar" ? "top" : paginationPosition;
  const hasSelection = enableRowSelection && table.getFilteredSelectedRowModel().rows.length > 0;
  const totalRows = serverPagination ? serverPagination.totalRows : tree ? tree.roots.length : data.length;
  const barShowsCount = !paginates && hasBar && !inlinePagination && (!hasSelection || paginationPosition === "both");
  const narrowedCount =
    !serverMode && narrowing && !paginates && !barShowsCount
      ? { shown: table.getFilteredRowModel().rows.length, total: totalRows }
      : undefined;
  const renderBar = (placement: "top" | "bottom") => (
    <PaginationBar
      table={table}
      placement={placement}
      showSelection={placement === "bottom" || barPosition === "top"}
      rowLabel={rowLabel}
      totalRows={totalRows}
      filteredCount={serverPagination?.totalRows}
      enablePagination={paginates && !inlinePagination}
      onBulkAction={onBulkAction}
      loose={loose}
      note={placement === "bottom" ? footerNote : undefined}
      selectAll={
        serverSelectAll && serverPagination
          ? {
              total: serverPagination.totalRows,
              selected: serverSelectAll.selected,
              pageAllSelected: table.getIsAllPageRowsSelected(),
              onChange: serverSelectAll.onChange,
            }
          : undefined
      }
    />
  );

  const showFullText = (event: React.MouseEvent<HTMLTableSectionElement>) => {
    const target = event.target as HTMLElement;
    const cell = target.closest("td");
    if (!cell) return;
    for (let el: HTMLElement | null = target; el; el = el === cell ? null : el.parentElement) {
      if (el.scrollWidth <= el.clientWidth + 1 && el.scrollHeight <= el.clientHeight + 1) continue;
      const own = el.closest("[title]");
      if (own && !(own as HTMLElement).dataset.dicaAuto) return;
      el.title = (el.textContent ?? "").trim();
      el.dataset.dicaAuto = "1";
      return;
    }
  };

  const renderCell = (cell: Cell<TData, unknown>) => {
    const col = metaById.get(cell.column.id);
    if (col && !col.cell && !col.formatter && !col.link) {
      const value = cell.getValue();
      if (value == null || value === "") return VAZIO;
    }
    return flexRender(cell.column.columnDef.cell, cell.getContext());
  };

  const groupSpans = columnGroupSpans(
    visibleColumns.map((column) => metaById.get(column.id)?.group),
    Array.from({ length: pinCount }, (_, i) => i),
  );
  const groupRow = groupSpans ? (
    <tr
      key="column-groups"
      className={cn(
        "h-8 text-xs whitespace-nowrap text-muted-foreground",
        !cards && "border-b border-border",
        !plainHeader && SOFT_SURFACE,
      )}
    >
      {detailMode ? (
        <td
          className={cn("w-11", pinDetail && cn(DETAIL_PIN, plainHeader ? "bg-background" : SOFT_SURFACE))}
          aria-hidden
        />
      ) : null}
      {groupSpans.map((group, index) => {
        const pin = pinOf(index);
        const next = groupSpans[index + 1];
        const fechaGrupo = groupDividers && group.label != null && next != null && next.label !== group.label;
        const className = cn(
          "px-3 text-left align-middle font-medium",
          divided && "border-r border-border last:border-r-0",
          fechaGrupo && GROUP_END_CLASS,
          pin && cn(plainHeader ? PINNED_HEADER_PLAIN_CLASS : PINNED_HEADER_CLASS, !pin.last && "shadow-none"),
        );
        const style = pin ? { left: pin.left } : undefined;
        const repetido = index > 0 && groupSpans[index - 1]!.label === group.label;
        return group.label && !repetido ? (
          <th key={index} scope="colgroup" colSpan={group.span} className={className} style={style}>
            {group.label}
          </th>
        ) : (
          <td key={index} colSpan={group.span} className={className} style={style} aria-hidden />
        );
      })}
    </tr>
  ) : null;

  const leafHeaderRows = table.getHeaderGroups().map((group) => (
    <tr
      key={group.id}
      className={cn(
        "text-xs whitespace-nowrap",
        cards ? "h-7" : "h-10 border-b border-border",
        plainHeader ? "text-muted-foreground" : cn("text-foreground/75", SOFT_SURFACE),
      )}
    >
      {detailMode ? (
        <th
          scope="col"
          className={cn("w-11", pinDetail && cn(DETAIL_PIN, "z-[2]", plainHeader ? "bg-background" : SOFT_SURFACE))}
        >
          <span className="sr-only">Abrir o detalhe</span>
        </th>
      ) : null}
      {group.headers.map((header, index) => (
        <HeaderCell
          key={header.id}
          header={header}
          meta={metaById.get(header.column.id)}
          pinned={pinOf(index)}
          plain={plainHeader}
          divided={divided}
          groupEnd={endsGroup(index)}
          filterSummary={filterSummaries.get(header.column.id) ?? ""}
          canFilter={enableToolbar && header.column.getCanFilter()}
          filterOpen={columnCard?.columnId === header.column.id && columnCard.trigger.closest("th") != null}
          sortCount={sorting.length}
          onOpenFilter={openColumnCard}
          grow={header.column.id === growColumnId}
          last={index === group.headers.length - 1}
        />
      ))}
    </tr>
  ));
  const headerRows = groupRow ? [groupRow, ...leafHeaderRows] : leafHeaderRows;

  const totalOf = (columnId: string, over: Row<TData>[]): React.ReactNode => {
    const col = metaById.get(columnId);
    if (col?.total == null) return null;
    if (typeof col.total === "function") return col.total(over.map((row) => row.original));
    const n = columnTotal(
      col.total,
      over.map((row) => row.getValue(columnId)),
    );
    return n == null ? VAZIO : col.formatter ? col.formatter(n) : formatNumberBr(n);
  };
  const aligned = (align: "left" | "center" | "right", node: React.ReactNode) =>
    align === "left" ? (
      node
    ) : (
      <div className={cn("flex", align === "right" ? "justify-end" : "justify-center")}>{node}</div>
    );

  const hasTotals = !cards && !gridMode && !serverMode && metadata.some((col) => col.total != null);
  const renderTotals = () => {
    const allRows = table.getSortedRowModel().rows;
    const labelColumnId = visibleColumns.find((column) => {
      const col = metaById.get(column.id);
      return col && col.total == null;
    })?.id;
    return (
      <tfoot>
        <tr
          className={cn(
            "border-t border-border font-semibold whitespace-nowrap",
            SOFT_SURFACE,
            compact ? "h-8" : "h-10",
          )}
        >
          {detailMode ? <td className={cn(pinDetail && cn(DETAIL_PIN, SOFT_SURFACE))} /> : null}
          {visibleColumns.map((column, index) => {
            const col = metaById.get(column.id);
            const align = col ? alignOf(col) : "left";
            const value =
              column.id === labelColumnId ? (
                <>
                  Total
                  <span className="ml-1.5 font-normal text-muted-foreground">
                    {countLabel(allRows.length, rowLabel)}
                  </span>
                </>
              ) : (
                totalOf(column.id, allRows)
              );
            const pin = pinOf(index);
            return (
              <td
                key={column.id}
                style={pin ? { left: pin.left } : undefined}
                className={cn(
                  "px-3 align-middle leading-5",
                  align === "right" && "text-right",
                  align === "center" && "text-center",
                  col?.type === "number" && "tabular-nums",
                  divided && "border-r border-muted last:border-r-0",
                  endsGroup(index) && GROUP_END_CLASS,
                  pin && cn(PINNED_CELL_CLASS, SOFT_SURFACE, !pin.last && "shadow-none"),
                )}
              >
                {aligned(align, value)}
              </td>
            );
          })}
        </tr>
      </tfoot>
    );
  };

  const renderSummary = (label: React.ReactNode) => {
    const lead = visibleColumns.findIndex((column) => metaById.get(column.id)?.total != null);
    const span = pinCount > 0 ? pinCount : Math.max(1, lead === -1 ? visibleColumns.length : lead);
    const pageRows = table.getRowModel().rows;
    const firstPin = pinCount > 0 ? pinOf(pinCount - 1) : false;
    return (
      <tr
        data-summary-row=""
        className={cn(
          "text-xs whitespace-nowrap text-muted-foreground",
          summaryRow?.position === "top" ? "border-b border-border" : "border-t border-border",
          compact ? "h-8" : "h-10",
        )}
      >
        <td
          colSpan={span + (detailMode ? 1 : 0)}
          style={firstPin ? { left: 0 } : undefined}
          className={cn(
            "px-3 align-middle",
            endsGroup(span - 1) && GROUP_END_CLASS,
            firstPin && cn(PINNED_CELL_CLASS, "z-[2] bg-background"),
          )}
        >
          {label}
        </td>
        {visibleColumns.slice(span).map((column, index) => {
          const col = metaById.get(column.id);
          const align = col ? alignOf(col) : "left";
          const pin = pinOf(index + span);
          return (
            <td
              key={column.id}
              style={pin ? { left: pin.left } : undefined}
              className={cn(
                "px-3 align-middle",
                align === "right" && "text-right",
                align === "center" && "text-center",
                divided && "border-r border-muted last:border-r-0",
                endsGroup(index + span) && GROUP_END_CLASS,
                pin && cn(PINNED_CELL_CLASS, "bg-background", !pin.last && "shadow-none"),
              )}
            >
              {col?.total != null ? aligned(align, totalOf(column.id, pageRows)) : null}
            </td>
          );
        })}
      </tr>
    );
  };

  const renderDataRow = (row: Row<TData>, rowIndex: number) => {
    const canDetail = detailMode && (hasDetail ? hasDetail(row.original) : true);
    const detailOpen = canDetail && openDetails.has(row.id);
    const parent = treeMode && row.subRows.length > 0;
    const rootParent = parent && row.depth === 0;
    const odd = striped && rowIndex % 2 === 1;
    const rowName = firstDataColumnId ? String(row.getValue(firstDataColumnId) ?? "") : "";
    return (
      <React.Fragment key={row.id}>
        <tr
          data-state={row.getIsSelected() ? "selected" : undefined}
          data-pinned={hasPinned && row.getIsPinned() ? "top" : undefined}
          onClick={enableRowSelection && row.getCanSelect() ? () => row.toggleSelected() : undefined}
          className={cn(
            "group/row transition-colors",
            rowStyle === "lines" && "border-b border-muted last:border-b-0",
            divided && "border-b border-border last:border-b-0",
            !cards && "data-[state=selected]:bg-muted",
            !cards && (striped || rootParent ? "hover:bg-muted" : "hover:bg-[var(--dtv2-soft)]"),
            odd && SOFT_SURFACE,
            rootParent && cn(SOFT_SURFACE, "border-border font-semibold"),
            detailOpen && "border-b-0",
            cards ? (compact ? "h-11" : "h-14") : compact ? "h-8" : "h-10",
            enableRowSelection && row.getCanSelect() && "cursor-pointer",
            hasPinned && row.getIsPinned() && SOFT_SURFACE,
          )}
        >
          {detailMode ? (
            <td
              className={cn(
                "w-11 pl-3 pr-0 align-middle",
                cards && CARD_CELL_CLASS,
                pinDetail &&
                  cn(
                    PINNED_CELL_CLASS,
                    DETAIL_PIN,
                    striped && "group-hover/row:bg-muted",
                    odd && SOFT_SURFACE,
                    "shadow-none",
                  ),
              )}
            >
              {canDetail ? (
                <RowToggle
                  open={detailOpen}
                  label={`o detalhe de ${rowName}`}
                  onToggle={() => setOpenDetails((prev) => toggleIn(prev, row.id))}
                />
              ) : null}
            </td>
          ) : null}
          {row.getVisibleCells().map((cell, index) => {
            const col = metaById.get(cell.column.id);
            const align = col ? alignOf(col) : "left";
            const actions = cell.column.id === ACTIONS_COLUMN_ID;
            const utility = cell.column.id === SELECT_COLUMN_ID || actions;
            const hierarchy = treeMode && cell.column.id === firstDataColumnId;
            const pin = pinOf(index);
            return (
              <td
                key={cell.id}
                style={{
                  ...(cards ? undefined : heatStyle(col, row.original)),
                  ...(pin ? { left: pin.left } : undefined),
                }}
                className={cn(
                  "px-3 align-middle leading-5 whitespace-nowrap",
                  utility && "w-10 min-w-10 max-w-10 pr-0",
                  actions && ACTIONS_CELL_CLASS,
                  align === "right" && "text-right",
                  align === "center" && "text-center",
                  col?.type === "number" && "tabular-nums",
                  col && isCappedTextColumn(col) && TEXT_CAP_CLASS,
                  cell.column.columnDef.meta?.className,
                  col && cell.column.id === growColumnId && growCellClass(col),
                  divided && "border-r border-muted last:border-r-0",
                  endsGroup(index) && GROUP_END_CLASS,
                  !cards && col?.cellTone?.(row.original) === "muted" && SOFT_SURFACE,
                  cards && CARD_CELL_CLASS,
                  pin &&
                    cn(
                      PINNED_CELL_CLASS,
                      (striped || rootParent) && "group-hover/row:bg-muted",
                      (odd || rootParent) && SOFT_SURFACE,
                      !pin.last && "shadow-none",
                      !utility && PINNED_PHONE_CAP_CLASS,
                    ),
                )}
              >
                {hierarchy ? (
                  <div className="flex min-w-0 items-center gap-1.5" style={{ paddingLeft: row.depth * TREE_INDENT }}>
                    {parent ? (
                      <RowToggle
                        open={row.getIsExpanded()}
                        label={rowName}
                        onToggle={() => toggleNode(row.id, row.getIsExpanded())}
                      />
                    ) : (
                      <span className="size-5 shrink-0" aria-hidden />
                    )}
                    <div className={cn("min-w-0", parent && !rootParent && "font-medium")}>{renderCell(cell)}</div>
                  </div>
                ) : (
                  aligned(
                    align,
                    col && isClampedTextColumn(col) ? (
                      <div className="line-clamp-2">{renderCell(cell)}</div>
                    ) : (
                      renderCell(cell)
                    ),
                  )
                )}
              </td>
            );
          })}
        </tr>
        {detailOpen ? (
          <tr>
            <td colSpan={visibleColumnCount} className="border-b border-border p-0">
              <div className={cn("py-3 pl-11 pr-4", SOFT_SURFACE)}>{renderDetail?.(row.original)}</div>
            </td>
          </tr>
        ) : null}
      </React.Fragment>
    );
  };

  const renderSection = (section: { id: string; label: string }, sectionRows: Row<TData>[]) => (
    <tr
      key={`secao:${section.id}`}
      className={cn("border-b border-border whitespace-nowrap", SOFT_SURFACE, compact ? "h-8" : "h-9")}
    >
      {detailMode ? <td className={cn(pinDetail && cn(DETAIL_PIN, SOFT_SURFACE))} /> : null}
      {visibleColumns.map((column, index) => {
        const col = metaById.get(column.id);
        const align = col ? alignOf(col) : "left";
        const pin = pinOf(index);
        const pinStyle = pin ? { left: pin.left } : undefined;
        const pinClass = pin && cn(PINNED_CELL_CLASS, SOFT_SURFACE, !pin.last && "shadow-none");
        if (column.id === firstDataColumnId) {
          return (
            <td
              key={column.id}
              style={pinStyle}
              className={cn("px-3 align-middle", pinClass, pin && PINNED_PHONE_CAP_CLASS)}
            >
              <div className="-ml-1 flex items-center gap-1.5">
                <RowToggle
                  open={!collapsedSections.has(section.id)}
                  label={`a seção ${section.label}`}
                  onToggle={() => setCollapsedSections((prev) => toggleIn(prev, section.id))}
                />
                <span className="font-semibold text-foreground">{section.label}</span>
                <CountBadge>{formatNumberBr(sectionRows.length)}</CountBadge>
              </div>
            </td>
          );
        }
        return (
          <td
            key={column.id}
            style={pinStyle}
            className={cn(
              "px-3 align-middle font-semibold text-foreground/75",
              align === "right" && "text-right",
              align === "center" && "text-center",
              col?.type === "number" && "tabular-nums",
              pinClass,
            )}
          >
            {aligned(align, totalOf(column.id, sectionRows))}
          </td>
        );
      })}
    </tr>
  );

  const renderBody = () => {
    if (sectionConfig && sectionGroups) {
      return sectionConfig.items.flatMap((section) => {
        const sectionRows = sectionGroups.get(section.id) ?? [];
        if (sectionRows.length === 0) return [];
        const header = renderSection(section, sectionRows);
        return collapsedSections.has(section.id) ? [header] : [header, ...sectionRows.map(renderDataRow)];
      });
    }
    if (treeMode) {
      return treeItems.map((item, index) =>
        item.kind === "row" ? (
          renderDataRow(item.row, index)
        ) : (
          <tr key={`mais:${item.parentId}`} className={cn("border-b border-muted", compact ? "h-8" : "h-10")}>
            <td colSpan={visibleColumnCount} className="px-3 align-middle">
              <button
                type="button"
                className="rounded-sm font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                style={{ marginLeft: item.depth * TREE_INDENT + 26 }}
                onClick={() => setShowAllChildren((prev) => new Set(prev).add(item.parentId))}
              >
                Mostrar mais {formatNumberBr(item.hidden)}
              </button>
            </td>
          </tr>
        ),
      );
    }
    if (hasPinned) return [...table.getTopRows(), ...table.getCenterRows()].map(renderDataRow);
    return rows.map(renderDataRow);
  };

  const content = (
    <TooltipProvider delayDuration={300}>
      <div
        ref={rootRef}
        data-table-v2=""
        data-density={density}
        style={{ "--dtv2-soft": SOFT_COLOR } as React.CSSProperties}
        className={cn(
          "flex min-w-0 flex-col text-foreground transition-opacity duration-300",
          frame === "card" ? "overflow-hidden rounded-lg border border-border bg-background shadow-xs" : "gap-3",
          (fetching || serverPagination?.isFetching) && "pointer-events-none opacity-50",
          className,
        )}
      >
        {enableToolbar ? (
          <Toolbar
            table={table}
            rowLabel={rowLabel}
            totalRows={totalRows}
            title={title}
            loose={loose}
            controls={controls}
            enableSearch={enableSearch && (!serverMode || Boolean(serverSearch))}
            search={serverMode && serverSearch ? serverSearch.value : search}
            onSearchChange={serverMode && serverSearch ? serverSearch.onChange : setSearch}
            searchPlaceholder={serverMode ? serverSearch?.placeholder : searchState?.placeholder}
            filterColumns={filterColumns}
            filters={columnFilters}
            onFiltersChange={setColumnFilters}
            filterOpen={filterOpen}
            onFilterOpenChange={(open) => {
              setFilterOpen(open);
              if (!open) setFocusFilterColumnId(null);
            }}
            focusFilterColumnId={focusFilterColumnId}
            countFilters={countFilters}
            sortColumns={sortColumns}
            sorting={sorting}
            onSortingChange={setSorting}
            compact={compact}
            onToggleDensity={enableDensityToggle ? () => setDensity(compact ? "default" : "compact") : undefined}
            cardView={cardView}
            onCardViewChange={gridMode && enableCardViewToggle ? setCardView : undefined}
            isFullscreen={isFullscreen}
            onToggleFullscreen={enableFullscreen ? () => setIsFullscreen((v) => !v) : undefined}
            enableExport={enableExport && (!serverMode || Boolean(serverPagination?.onDownload))}
            onExport={serverPagination?.onDownload}
            enableColumnOptions={enableColumnOptions}
            columnOrder={pickerOrder}
            columnLabelOf={columnLabelOf}
            onColumnOrderChange={setUserOrder}
            onColumnsReset={resetColumns}
            columnsChanged={columnsChanged}
            tree={
              treeMode
                ? {
                    levels: depthLevels,
                    current:
                      Object.keys(nodeOverrides).length > 0
                        ? null
                        : levelState
                          ? Math.min(treeDepth + 1, Math.max(1, depthLevels))
                          : treeDepth + 1,
                    onChange: (level) => {
                      setTreeDepth(level - 1);
                      setNodeOverrides({});
                    },
                    picker:
                      levelDefs && levelState
                        ? {
                            options: levelDefs.flatMap((level) =>
                              levelState.present.has(level.id)
                                ? [
                                    {
                                      id: level.id,
                                      label: level.label,
                                      visible: !levelState.hidden.has(level.id),
                                    },
                                  ]
                                : [],
                            ),
                            onToggle: (id, visible) =>
                              setLevelChoices((prev) =>
                                toggleTreeLevel(levelDefs, levelState.present, prev, id, visible),
                              ),
                          }
                        : undefined,
                  }
                : undefined
            }
            sections={
              sectionConfig
                ? {
                    onExpandAll: () => setCollapsedSections(new Set()),
                    onCollapseAll: () => setCollapsedSections(new Set(sectionConfig.items.map((item) => item.id))),
                  }
                : undefined
            }
            tableName={tableName}
            exportValues={exportValues}
            narrowedCount={narrowedCount}
            screenControls={toolbarControls}
            pagination={
              inlinePagination && paginates ? (
                <InlinePagination table={table} filteredCount={serverPagination?.totalRows} />
              ) : undefined
            }
          />
        ) : null}

        {enableToolbar && stripItems.length > 0 ? (
          <FilterStrip
            items={stripItems}
            openId={columnCard && columnCard.trigger.closest("th") == null ? columnCard.columnId : null}
            loose={loose}
            onOpen={openColumnCard}
            onRemove={removeFilter}
            onClear={() => {
              setColumnCard(null);
              setColumnFilters([]);
            }}
          />
        ) : null}

        {columnCard && cardColumn ? (
          <PopoverFrame
            open
            onOpenChange={(open) => (open ? undefined : setColumnCard(null))}
            anchorRef={cardAnchorRef}
            title={<ColumnLabel title={cardColumn.title} subtitle={cardColumn.subtitle} />}
            icon={Funnel}
            size="xs"
            align={columnCard.align}
            popoverContentProps={{
              onInteractOutside: (e) => {
                if (columnCard.trigger.contains(e.target as Node)) e.preventDefault();
              },
              onCloseAutoFocus: (e) => {
                e.preventDefault();
                if (cardReturnsFocus.current && columnCard.trigger.isConnected) columnCard.trigger.focus();
                cardReturnsFocus.current = true;
              },
            }}
          >
            <ColumnFilterCard
              key={columnCard.columnId}
              column={cardColumn}
              applied={cardApplied}
              rowLabel={rowLabel}
              countWith={cardCountWith}
              onApply={(value) => {
                setColumnFilter(columnCard.columnId, value);
                setColumnCard(null);
              }}
              onShowAll={() => {
                cardReturnsFocus.current = false;
                openFilterPanel(columnCard.columnId);
              }}
            />
          </PopoverFrame>
        ) : null}

        {hasBar && barPosition !== "bottom" && (!inlinePagination || hasSelection) ? renderBar("top") : null}

        {gridMode ? (
          rows.length ? (
            <div
              data-card-view={cardView}
              className={cn("@container grid", cardView === "list" ? "gap-2" : "gap-4", frame === "card" && "p-3")}
              style={
                cardView === "list"
                  ? undefined
                  : {
                      gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${cardMinWidth}px), 1fr))`,
                    }
              }
            >
              {rows.map((row) => (
                <React.Fragment key={row.id}>{renderCard?.(row.original, cardView)}</React.Fragment>
              ))}
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center text-xs text-muted-foreground">{emptyMessage}</div>
          )
        ) : (
          <div
            ref={scrollerRef}
            className={cn(
              "grid-scrollbar relative overflow-x-auto",
              frame === "table" && !cards && "rounded-lg border border-border bg-background shadow-xs",
            )}
          >
            <table
              ref={tableRef}
              className={cn(
                "w-full text-xs",
                cards ? "border-separate border-spacing-x-0 border-spacing-y-2" : "border-collapse",
              )}
            >
              <thead ref={headRef}>{headerRows}</thead>
              <tbody onMouseOver={showFullText}>
                {summaryRow && summaryRow.position === "top" && rows.length ? renderSummary(summaryRow.label) : null}
                {rows.length ? (
                  renderBody()
                ) : (
                  <tr>
                    <td colSpan={visibleColumnCount} className="h-24 text-center text-muted-foreground">
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
              {hasTotals && rows.length ? renderTotals() : null}
              {summaryRow && summaryRow.position !== "top" && !hasTotals && rows.length ? (
                <tfoot>{renderSummary(summaryRow.label)}</tfoot>
              ) : null}
            </table>
          </div>
        )}

        {hasBar && barPosition !== "top" ? renderBar("bottom") : null}
        {footerNote && !(hasBar && barPosition !== "top") ? (
          <div
            data-footer-note=""
            className={cn("text-xs text-muted-foreground", loose ? "py-1" : "border-t border-border px-3 py-2.5")}
          >
            {footerNote}
          </div>
        ) : null}

        {gridMode ? null : <FloatingScrollbar scrollerRef={scrollerRef} zIndex={isFullscreen ? 51 : 30} />}

        {stickyHeader && !gridMode ? (
          <DataTableStickyHeader
            containerRef={rootRef}
            tableRef={tableRef}
            headerRef={headRef}
            style={{ "--dtv2-soft": SOFT_COLOR } as React.CSSProperties}
            zIndex={isFullscreen ? 51 : 30}
            offsetTop={stickyHeaderOffset}
            sortable={false}
            surfaceClassName={isFullscreen ? "bg-background" : "bg-card"}
          >
            {headerRows}
          </DataTableStickyHeader>
        ) : null}
      </div>
    </TooltipProvider>
  );

  if (isFullscreen) {
    return ReactDOM.createPortal(
      <div
        data-datatable-fullscreen=""
        className="fixed inset-0 z-50 overflow-auto bg-background p-4 animate-in fade-in-0 zoom-in-95 duration-200 sm:p-6"
      >
        {content}
      </div>,
      document.body,
    );
  }

  return content;
}
