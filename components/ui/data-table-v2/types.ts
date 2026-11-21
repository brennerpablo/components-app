import type {
  ColumnFiltersState,
  PaginationState,
  SortingFnOption,
  SortingState,
} from "@tanstack/react-table";
import type * as React from "react";
import type { ReactNode } from "react";

import type { ColumnMetadata, FilterConfig } from "@/components/ui/data-table/types";

export type DataTableV2Density = "default" | "compact";

export type DataTableV2Frame = "card" | "table" | "none";

export type DataTableV2RowStyle = "lines" | "striped" | "grid" | "cards";

export type DataTableV2CardView = "grid" | "list";

export type DataTableV2HeaderStyle = "soft" | "plain";

export type DataTableV2Controls = "full" | "icons";

export type DataTableV2BulkAction<TData> = {
  label: string;
  icon?: ReactNode;
  action: (rows: TData[]) => void;
  disabled?: boolean;
  shortcut?: string;
};

export type DataTableV2RowLabel = { singular: string; plural: string };

export type DataTableV2LinkVariant = "primary" | "default" | "mono" | "asset" | "muted";

export type DataTableV2Link<TData> = {
  href: (row: TData) => string | null | undefined;
  label?: (row: TData) => ReactNode;
  subtitle?: (row: TData) => ReactNode;
  title?: (row: TData) => string | undefined;
  variant?: DataTableV2LinkVariant;
  className?: string;
  subtitleClassName?: string;
  onClick?: (row: TData, event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export type DataTableV2ServerPagination = {
  totalRows: number;
  pagination: PaginationState;
  onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>;
  sorting: SortingState;
  onSortingChange: React.Dispatch<React.SetStateAction<SortingState>>;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  onDownload?: () => void | Promise<void>;
  isFetching?: boolean;
};

export type DataTableV2FilterConfig = FilterConfig & { checkboxArray?: boolean };

export type DataTableV2Column<TData = Record<string, unknown>> = Omit<ColumnMetadata<TData>, "filters"> & {
  filters?: DataTableV2FilterConfig;
  sortingFn?: SortingFnOption<TData>;
  defaultVisible?: boolean;
  link?: DataTableV2Link<TData>;
  filterScale?: number;
  filterUnit?: string;
  total?: "sum" | "average" | ((rows: TData[]) => ReactNode);
  group?: string;
  cellTone?: (row: TData) => "muted" | null | undefined;
  exportValue?: (row: TData) => unknown;
  sortUndefined?: "first" | "last";
  grow?: boolean;
  textCap?: boolean;
  headerWrap?: boolean;
  heatmap?: {
    baseColor: string;
    maxAlpha?: number;
    scale?: string;
    domain?: { min: number; max: number };
    getValue?: (row: TData) => number | null | undefined;
  };
};

export type DataTableV2TreeLevel = {
  id: string;
  label: string;
  defaultVisible?: boolean;
};

export type DataTableV2TreeLevels<TData> = {
  levels: readonly DataTableV2TreeLevel[];
  getLevel: (row: TData) => string | null | undefined;
};

export type DataTableV2Sections<TData> = {
  items: readonly { id: string; label: string; defaultCollapsed?: boolean }[];
  getSectionId: (row: TData) => string;
  fallbackSectionId?: string;
};

export type DataTableV2Props<TData> = {
  data: TData[];
  columnsMetadata: readonly DataTableV2Column<TData>[];
  tableId?: string;
  tableName?: string;
  rowLabel?: DataTableV2RowLabel;
  density?: DataTableV2Density;
  frame?: DataTableV2Frame;
  rowStyle?: DataTableV2RowStyle;
  groupDividers?: boolean;
  headerStyle?: DataTableV2HeaderStyle;
  controls?: DataTableV2Controls;
  title?: string;
  toolbarControls?: ReactNode;
  enableToolbar?: boolean;
  enableSearch?: boolean;
  enableExport?: boolean;
  enableColumnOptions?: boolean;
  enableDensityToggle?: boolean;
  enableFullscreen?: boolean;
  enablePagination?: boolean;
  paginationPosition?: "bottom" | "top" | "both" | "toolbar";
  pageSize?: number;
  enableRowSelection?: boolean;
  pinnedTopRowIds?: readonly string[];
  onBulkAction?: {
    onEdit?: (rows: TData[]) => void;
    onDelete?: (rows: TData[]) => void;
    actions?: DataTableV2BulkAction<TData>[];
    controls?: (rows: TData[]) => ReactNode;
  };
  onRowAction?: {
    onAdd?: (row: TData) => void;
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
  };
  renderRowActions?: (row: TData) => ReactNode;
  getSubRows?: (row: TData) => TData[] | undefined;
  defaultExpandedDepth?: number;
  maxChildrenPerNode?: number;
  treeLevels?: DataTableV2TreeLevels<TData>;
  renderDetail?: (row: TData) => ReactNode;
  hasDetail?: (row: TData) => boolean;
  initialOpenDetailIds?: readonly string[];
  sections?: DataTableV2Sections<TData>;
  renderCard?: (row: TData, view: DataTableV2CardView) => ReactNode;
  cardMinWidth?: number;
  cardView?: DataTableV2CardView;
  enableCardViewToggle?: boolean;
  initialSorting?: SortingState;
  initialColumnFilters?: ColumnFiltersState;
  serverPagination?: DataTableV2ServerPagination;
  pinFirstColumn?: boolean;
  pinColumns?: number;
  serverSelectAll?: { selected: boolean; onChange: (selected: boolean) => void };
  stickyHeader?: boolean;
  stickyHeaderOffset?: number;
  getRowId?: (row: TData) => string;
  fetching?: boolean;
  emptyMessage?: string;
  summaryRow?: { label: ReactNode; position?: "top" | "bottom" };
  serverSearch?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  searchState?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  columnFiltersState?: {
    value: ColumnFiltersState;
    onChange: (updater: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => void;
  };
  footerNote?: ReactNode;
  className?: string;
};
