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

// page.tsx
import { DataTable, ColumnMetadata, InferRowType } from "@/components/ui/data-table";
import { createColumns } from "./columns";
import { data } from "./data";

// Declare metadata as const to enable type inference
const columnsMetadata = [
  {
    columnId: "name",
    title: "Name",
    type: "text",
    sortable: true,
    filters: { text: true },
  },
  {
    columnId: "status",
    title: "Status",
    subtitle: "Current status",   // optional secondary header label
    type: "text",
    sortable: true,
    options: [{ value: "active", label: "Active" }],
    filters: { checkbox: true },
    formatter: (value) => <Badge>{String(value)}</Badge>,
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

// Derive the row type automatically from the metadata
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

**`ColumnMetadata` fields:**

| Field                  | Type                                  | Description                                               |
| ---------------------- | ------------------------------------- | --------------------------------------------------------- |
| `columnId`             | `keyof TData & string`                | Accessor key matching the data property                   |
| `title`                | `string`                              | Column header label                                       |
| `subtitle`             | `string`                              | Optional secondary label shown below the title in the header |
| `type`                 | `"text" \| "number"`                  | Data type — controls available filter types               |
| `sortable`             | `boolean`                             | Enable column sorting. Default `false`                    |
| `hideable`             | `boolean`                             | Show in view options toggle. Default `true`               |
| `options`              | `OptionItem[]`                        | Options array for `select` / `checkbox` filters           |
| `filters.text`         | `boolean`                             | Debounced text search input                               |
| `filters.select`       | `boolean`                             | Single-value dropdown filter                              |
| `filters.checkbox`     | `boolean`                             | Multi-value checkbox filter (`arrIncludesSome`)           |
| `filters.number`       | `boolean`                             | Condition + value filter (only for `type: "number"`)      |
| `aligned`              | `"left" \| "center" \| "right"`       | Cell text alignment                                       |
| `formatter`            | `(value: unknown) => ReactNode`       | Custom cell renderer                                      |
| `filterValueFormatter` | `(value: number \| string) => string` | Formats values displayed inside the number filter popover |

**Features:**

- Metadata-driven column and filter construction — add a column by adding one object to `columnsMetadata`
- `InferRowType<typeof columnsMetadata>` utility — derive a fully-typed row type automatically from a `const` metadata array, no separate interface needed
- Filter types: single select, multi-checkbox, numeric condition (built-in conditions: is equal to, is between, is greater than, is less than), debounced text search
- Row selection with emerald left-border indicator
- Bulk action command bar (keyboard shortcuts: `e` edit · `d` delete · `Escape` clear)
- Column visibility toggle + drag-and-drop reordering with accessibility live region announcements
- Persistent column order via cookie (`persistColumnOrder` prop)
- Pagination (20 rows/page) with responsive first/last buttons
- CSV export (visible columns only, PapaParse) — filename controlled via `tableName` prop

#### Notes

- Atlaskit DnD packages require `--legacy-peer-deps` due to a React 19 peer dependency conflict
- The `radix-ui` package used here is the unified package (`import { Popover } from "radix-ui"`), not the scoped `@radix-ui/*` packages
- Column `meta.displayName` is required for column visibility labels — the builder sets it automatically from `title`
- To add a new filter type: add a flag to `FilterConfig` in `types.ts`, handle it in `DataTableFilter.tsx`, and render it in `DataTableFilterbar.tsx`
- `DataTableLanguage` (`"en" | "pt"`) and `DataTableLocale` (full locale shape) are exported from the barrel — use them to extend locales or pass the `language` prop with type safety
- To add a new language: add an entry to `dataTableLocales` in `components/ui/data-table/i18n.ts` and extend the `DataTableLanguage` union
