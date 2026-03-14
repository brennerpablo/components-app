# components-app

Personal component library built with Next.js + React + shadcn/ui. Components are designed to be **copied into other projects** (shadcn-style copy-paste model — no package to install, no version lock-in).

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (New York, neutral) · Radix UI · Lucide React

---

## Copying Components

Each component below lists everything you need to bring it into another project:

1. Copy the listed files into the same paths in your project
2. Run the `shadcn` command to install any required primitives
3. Run `npm install` for any additional packages
4. Copy any listed internal dependencies (shared utilities)
5. Add any listed type augmentation files

Your target project should already have a shadcn/ui setup with `lib/utils.ts` (the `cn()` utility).

---

## Component Template

When adding or updating a component, copy this scaffold and fill it in:

````markdown
### Component Name

Brief description of what the component does and its main features (2–3 sentences).

**Demo:** `localhost:3000/<route>`

#### Files to copy

\```
components/ui/<name>/ComponentName.tsx
components/ui/<name>/index.ts
\```

#### shadcn dependencies

\```bash
npx shadcn@latest add button input # ...
\```

#### npm dependencies

\```bash
npm install package-a package-b
\```

#### Internal dependencies

| File               | Purpose                     |
| ------------------ | --------------------------- |
| `lib/some-util.ts` | Description of what it does |

#### Type augmentations

| File           | What it augments                                 |
| -------------- | ------------------------------------------------ |
| `SomeLib.d.ts` | Extends `some-package` module with custom fields |

#### Usage

\```tsx
import { ComponentName } from "@/components/ui/<name>"

export default function Page() {
return <ComponentName prop="value" />
}
\```

#### Notes

- Any special flags, caveats, or known issues.
````

---

## Components

### DataTable

A fully-featured data table with sorting, filtering, pagination, row selection, column management, and CSV export. Built on TanStack Table with drag-and-drop column reordering powered by Atlaskit Pragmatic DnD.

**Demo:** `localhost:3000/data-table`

#### Files to copy

```
components/ui/data-table/DataTable.tsx
components/ui/data-table/DataTableBulkEditor.tsx
components/ui/data-table/DataTableColumnHeader.tsx
components/ui/data-table/DataTableFilter.tsx
components/ui/data-table/DataTableFilterbar.tsx
components/ui/data-table/DataTableLocaleContext.tsx
components/ui/data-table/DataTablePagination.tsx
components/ui/data-table/DataTableRowActions.tsx
components/ui/data-table/DataTableViewOptions.tsx
components/ui/data-table/TanstackTable.d.ts
components/ui/data-table/columnBuilder.tsx
components/ui/data-table/i18n.ts
components/ui/data-table/types.ts
components/ui/data-table/index.ts
lib/exportTableToCSV.ts
```

#### shadcn dependencies

```bash
npx shadcn@latest add button checkbox dropdown-menu input label popover select table
```

#### npm dependencies

```bash
npm install @tanstack/react-table papaparse use-debounce tiny-invariant
```

```bash
npm install --legacy-peer-deps @atlaskit/pragmatic-drag-and-drop @atlaskit/pragmatic-drag-and-drop-flourish @atlaskit/pragmatic-drag-and-drop-hitbox @atlaskit/pragmatic-drag-and-drop-live-region @atlaskit/pragmatic-drag-and-drop-react-drop-indicator
```

#### Internal dependencies

| File                      | Purpose                                                |
| ------------------------- | ------------------------------------------------------ |
| `lib/utils.ts`            | `cn()` utility — already present in any shadcn project |
| `lib/exportTableToCSV.ts` | CSV export helper using PapaParse                      |

#### Type augmentations

| File                 | What it augments                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| `TanstackTable.d.ts` | Extends `@tanstack/react-table` `ColumnMeta` with `className?: string` and `displayName: string` |

#### Usage

```tsx
// columns.tsx — generic factory for static utility columns (select checkbox + row actions)
import { DataTableRowActions } from "@/components/ui/data-table";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

export function createColumns<TData>(): ColumnDef<TData>[] {
  const helper = createColumnHelper<TData>();
  return [
    helper.display({ id: "select" /* checkbox header/cell */ }),
    helper.display({
      id: "edit",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    }),
  ];
}

// page.tsx — simple pattern (no custom cell/header)
// Use InferRowType to derive the row type automatically from the metadata
import { DataTable, ColumnMetadata, InferRowType } from "@/components/ui/data-table";
import { createColumns } from "./columns";
import { data } from "./data";

const columnsMetadata = [
  {
    columnId: "name",
    title: "Name",
    type: "text",
    sortable: true,
    filters: { text: true },
  },
  {
    columnId: "amount",
    title: "Amount",
    type: "number",
    sortable: true,
    aligned: "right",
    filters: { number: true },
    formatter: (value) => `$${value}`,
    filterValueFormatter: (value) => `$${value}`,
  },
] as const satisfies ColumnMetadata[];

type Row = InferRowType<typeof columnsMetadata>;

export default function Page() {
  return (
    <DataTable<Row>
      columns={createColumns<Row>()}
      columnsMetadata={columnsMetadata}
      data={data}
      tableName="fund_assets"
      language="en"
    />
  );
}
```

**Custom `cell` and `header` renderers**

When a column needs JSX beyond what `formatter` covers (icons, badges, data from multiple fields), use the `cell` field. Similarly, `header` fully replaces the default `DataTableColumnHeader` when you need a non-standard header.

> **Note on typing:** `InferRowType` creates a circular reference when the metadata array references `Row` inside a `cell`/`header` callback. In this case, define `Row` manually and annotate with `ColumnMetadata<Row>[]` instead.

```tsx
import {
  DataTable,
  DataTableColumnHeader,
  ColumnMetadata,
} from "@/components/ui/data-table";
import { CheckCircle2, AlertTriangle, User } from "lucide-react";

// Define Row manually when using cell/header overrides
type Row = {
  owner: string
  status: "live" | "inactive" | "archived"
  pl: number
  plMin: number
  enquadrado: string
}

const columnsMetadata = [
  {
    columnId: "owner",
    title: "Owner",
    type: "text",
    sortable: true,
    filters: { text: true },
    // custom header — wraps DataTableColumnHeader to keep sort button
    header: ({ column }) => (
      <div className="flex items-center gap-1.5">
        <User className="h-3.5 w-3.5 text-muted-foreground" />
        <DataTableColumnHeader column={column} title="Owner" />
      </div>
    ),
  },
  {
    columnId: "status",
    title: "Status",
    type: "text",
    sortable: true,
    inferOptions: true,
    filters: { checkbox: true },
    // custom cell — badge with conditional colour
    cell: ({ row }) => {
      const s = row.original.status;
      const styles = { live: "bg-emerald-100 text-emerald-700", inactive: "bg-muted text-muted-foreground", archived: "bg-amber-100 text-amber-700" };
      return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[s]}`}>{s}</span>;
    },
  },
  {
    columnId: "pl",
    title: "PL",
    subtitle: "(Min)",           // rendered below the title by DataTableColumnHeader
    type: "number",
    sortable: true,
    aligned: "right",
    filters: { number: true },
    // custom cell — icon + value from multiple fields via row.original
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        {row.original.enquadrado === "True"
          ? <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          : <AlertTriangle className="h-3 w-3 text-orange-400" />}
        <span className="text-xs">{row.original.pl}</span>
        <span className="text-[9px]">({row.original.plMin})</span>
      </div>
    ),
  },
] as const satisfies ColumnMetadata<Row>[];

export default function Page() {
  return (
    <DataTable<Row>
      columns={createColumns<Row>()}
      columnsMetadata={columnsMetadata}
      data={data}
      tableName="fund_assets"
      language="pt"
    />
  );
}
```

**`DataTable` props:**

| Prop                 | Type                      | Required | Description                                                                                                          |
| -------------------- | ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `columns`            | `ColumnDef<TData>[]`      | Yes      | Static display columns — first element is the select column, last is the row-actions column                          |
| `data`               | `TData[]`                 | Yes      | Row data                                                                                                             |
| `columnsMetadata`    | `ColumnMetadata<TData>[]` | No       | Declarative descriptors that auto-build the data columns and filter controls                                         |
| `persistColumnOrder` | `boolean`                 | No       | Saves column order to a cookie (`data-table-column-order`) and restores it on mount. Defaults to `false`.            |
| `tableName`          | `string`                  | No       | Base name for the exported CSV file. Produces `{tableName}-{YYYY-MM-DD}.csv`. Defaults to `"export"`.                |
| `enableRowSelection` | `boolean`                 | No       | Enables row checkboxes and click-to-select. Shows emerald left-border on selected rows and reveals the BulkEditor bar. Defaults to `false`. |
| `enableRowActions`   | `boolean`                 | No       | Appends the per-row actions column (ellipsis menu via `DataTableRowActions`). Defaults to `false`.                    |
| `enablePagination`      | `boolean`                 | No       | Shows pagination controls and slices rows into pages. Defaults to `true`. Set to `false` to render all rows at once. |
| `pageSize`              | `number`                  | No       | Number of rows per page when pagination is enabled. Defaults to `20`.                                                |
| `paginationDisplayTop`  | `boolean`                 | No       | When `true`, renders the pagination row between the filterbar and the table instead of below it. Defaults to `false`. |
| `language`              | `DataTableLanguage`       | No       | UI language for built-in labels. `"en"` (default) or `"pt"`. Import `DataTableLanguage` from `@/components/ui/data-table`. |
| `enableTextSelection`   | `boolean`                 | No       | Allows users to select and copy text from table cells. Defaults to `true`. Set to `false` to disable selection (e.g. when click interactions conflict). |

**`ColumnMetadata` fields:**

| Field                  | Type                                  | Description                                               |
| ---------------------- | ------------------------------------- | --------------------------------------------------------- |
| `columnId`             | `keyof TData & string`                | Accessor key matching the data property                   |
| `title`                | `string`                              | Column header label                                       |
| `subtitle`             | `string`                              | Optional secondary label shown below the title in the header |
| `description`          | `string`                              | Tooltip text shown on hover of an info icon in the header |
| `type`                 | `"text" \| "number"`                  | Data type — controls available filter types               |
| `sortable`             | `boolean`                             | Enable column sorting. Default `false`                    |
| `hideable`             | `boolean`                             | Show in view options toggle. Default `true`               |
| `options`              | `OptionItem[]`                        | Options array for `select` / `checkbox` filters           |
| `filters.text`         | `boolean`                             | Debounced text search input                               |
| `filters.select`       | `boolean`                             | Single-value dropdown filter                              |
| `filters.checkbox`     | `boolean`                             | Multi-value checkbox filter (`arrIncludesSome`)           |
| `filters.number`       | `boolean`                             | Condition + value filter (only for `type: "number"`)      |
| `aligned`              | `"left" \| "center" \| "right"`       | Cell text alignment                                       |
| `formatter`            | `(value: unknown) => ReactNode`                  | Simple cell renderer — receives the column's value only   |
| `filterValueFormatter` | `(value: number \| string) => string`            | Formats values displayed inside the number filter popover |
| `cell`                 | `(props: CellContext<TData, unknown>) => ReactNode` | Full cell renderer override — receives the complete TanStack `CellContext` (use `row.original` to access other fields). Takes precedence over `formatter`. |
| `header`               | `(props: HeaderContext<TData, unknown>) => ReactNode` | Full header renderer override — replaces the default `DataTableColumnHeader`. Wrap `DataTableColumnHeader` inside it to keep the sort button. |

**Features:**

- Metadata-driven column and filter construction — add a column by adding one object to `columnsMetadata`
- `cell` and `header` overrides on any `ColumnMetadata` entry — full TanStack `CellContext`/`HeaderContext` access, including `row.original` for multi-field cells
- `InferRowType<typeof columnsMetadata>` utility — derive a fully-typed row type automatically from a `const` metadata array; when `cell`/`header` overrides are used, define `Row` manually and annotate with `ColumnMetadata<Row>[]` instead
- Filter types: single select, multi-checkbox, numeric condition (built-in conditions: is equal to, is between, is greater than, is less than), debounced text search
- Row selection with emerald left-border indicator
- Bulk action command bar (keyboard shortcuts: `e` edit · `d` delete · `Escape` clear)
- Column visibility toggle + drag-and-drop reordering with accessibility live region announcements
- Persistent column order via cookie (`persistColumnOrder` prop)
- Pagination (20 rows/page) with responsive first/last buttons
- CSV export (visible columns only, PapaParse) — filename controlled via `tableName` prop

#### Notes

- Atlaskit DnD packages require `--legacy-peer-deps` due to a React 19 peer dependency conflict

---

### Heatmap

A GitHub-style activity heatmap showing 52 weeks of contribution data. Cells are color-coded by intensity across 5 levels, with hover tooltips, month/weekday labels, a legend, and four built-in color schemes. Dark mode aware.

**Demo:** `localhost:3000/heatmap`

#### Files to copy

```
components/ui/heatmap/Heatmap.tsx
components/ui/heatmap/types.ts
components/ui/heatmap/index.ts
```

#### shadcn dependencies

None required.

#### npm dependencies

```bash
npm install date-fns
```

(`date-fns` is likely already present in any project using shadcn's Calendar component.)

#### Internal dependencies

| File           | Purpose                                     |
| -------------- | ------------------------------------------- |
| `lib/utils.ts` | `cn()` utility — already in any shadcn project |

#### Type augmentations

None.

#### Usage

```tsx
import { Heatmap } from "@/components/ui/heatmap"
import type { HeatmapDay } from "@/components/ui/heatmap"

const data: HeatmapDay[] = [
  { date: "2025-03-01", count: 4 },
  { date: "2025-03-02", count: 12 },
  // ...
]

export default function Page() {
  return (
    <Heatmap
      data={data}
      colorScheme="green"
      showWeekdayLabels
      showMonthLabels
      showLegend
      weekStart={0}
      onDayClick={(date, count) => console.log(date, count)}
    />
  )
}
```

**Props:**

| Prop                 | Type                                          | Default    | Description                                              |
| -------------------- | --------------------------------------------- | ---------- | -------------------------------------------------------- |
| `data`               | `HeatmapDay[]`                                | —          | Array of `{ date: string; count: number }` objects       |
| `colorScheme`        | `"green" \| "blue" \| "purple" \| "orange"`  | `"green"`  | Color theme for the 5 intensity levels                   |
| `showWeekdayLabels`  | `boolean`                                     | `true`     | Show Mon/Wed/Fri labels on the left                      |
| `showMonthLabels`    | `boolean`                                     | `true`     | Show month abbreviations above the grid                  |
| `showLegend`         | `boolean`                                     | `true`     | Show "Less → More" color scale below the grid            |
| `weekStart`          | `0 \| 1`                                      | `0`        | `0` = week starts Sunday, `1` = Monday                  |
| `className`          | `string`                                      | —          | Additional class names for the root element              |
| `onDayClick`         | `(date: string, count: number) => void`       | —          | Called when a day cell is clicked                        |

**Features:**

- 52-week × 7-day CSS Grid layout, horizontally scrollable on small screens
- 5 intensity levels (0–3, 4–7, 8–11, 12+ contributions) with distinct color steps
- Single shared hover tooltip (fixed-position, no Radix overhead) showing date + count
- Today indicator (outline ring on the current day's cell)
- `useDarkMode` hook via `MutationObserver` on `document.documentElement` — reacts to `.dark` class changes instantly

#### Notes

- Dates outside the 52-week window are silently ignored
- Duplicate dates in `data` are summed automatically
- The `date` field must be in `"YYYY-MM-DD"` format; the component appends `T00:00:00` internally to avoid timezone-related off-by-one errors when formatting
