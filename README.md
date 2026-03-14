# components-app

Personal component library built with Next.js + React + shadcn/ui. Components are designed to be **copied into other projects** (shadcn-style copy-paste model — no package to install, no version lock-in).

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (New York, neutral) · Radix UI · Lucide React

---

## Agent Skills — Copying Components Efficiently

This section is written for AI coding agents. Follow this protocol to copy or update a component with no wasted steps.

### 1. Read the component entry first

Each component section contains everything needed. Before touching any files, read the entry for the component you want:

- **Files to copy** — exact paths relative to this repo root
- **shadcn dependencies** — run these in the target project before pasting files
- **npm dependencies** — install these in the target project
- **Internal dependencies** — files outside the component folder (e.g. `lib/`) that must also be copied
- **Type augmentations** — `.d.ts` files that extend third-party modules; copy alongside the component files

### 2. Install dependencies first (order matters)

Run shadcn and npm installs in the target project **before** copying files. If the target already has shadcn set up, `npx shadcn@latest add` is safe to re-run — it skips already-present primitives.

```
1. npx shadcn@latest add <primitives>    # generates shadcn primitives
2. npm install <packages>                # installs npm deps
3. Copy files from this repo             # paste component files
```

> If Atlaskit DnD packages are listed, always use `--legacy-peer-deps`.

### 3. Copy files at the exact same paths

Preserve the directory structure. A component at `components/ui/data-table/DataTable.tsx` here should land at the same path in the target. The barrel `index.ts` must be included — imports reference it.

### 4. Check for internal dependencies

Any file listed under **Internal dependencies** that is not `lib/utils.ts` must also be copied. `lib/utils.ts` is assumed present in every shadcn project and can be skipped.

### 5. Apply type augmentations

Files listed under **Type augmentations** (e.g. `TanstackTable.d.ts`) extend third-party module types. Copy them into the same path in the target project. They must be included in `tsconfig.json`'s `include` glob (the default `"**/*.d.ts"` covers it).

### 6. Verify

After copying, confirm:
- No missing import errors (check `@/components/ui/<name>` resolves)
- No missing peer dependency warnings at runtime
- The component renders correctly against the **Usage** example in the README entry

### Updating an existing component

When pulling in a newer version of a component from this repo:

1. Diff the component files — look for new or removed props, changed types, new internal deps
2. Re-check **shadcn dependencies** and **npm dependencies** for any additions
3. Update call sites in the target project if props changed (the **Props** table in the README entry is the source of truth)
4. Update any type augmentation files if the `.d.ts` changed

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
| `enableRowSelection` | `boolean`                 | No       | Enables row checkboxes and click-to-select. Shows an accent-colored left-border on selected rows and reveals the BulkEditor bar. Defaults to `false`. |
| `enableRowActions`   | `boolean`                 | No       | Appends the per-row actions column (ellipsis menu via `DataTableRowActions`). Defaults to `false`.                    |
| `enablePagination`      | `boolean`                 | No       | Shows pagination controls and slices rows into pages. Defaults to `true`. Set to `false` to render all rows at once. |
| `pageSize`              | `number`                  | No       | Number of rows per page when pagination is enabled. Defaults to `20`.                                                |
| `paginationDisplayTop`  | `boolean`                 | No       | When `true`, renders the pagination row between the filterbar and the table instead of below it. Defaults to `false`. |
| `language`              | `DataTableLanguage`       | No       | UI language for built-in labels. `"en"` (default) or `"pt"`. Import `DataTableLanguage` from `@/components/ui/data-table`. |
| `enableTextSelection`   | `boolean`                 | No       | Allows users to select and copy text from table cells. Defaults to `true`. Set to `false` to disable selection (e.g. when click interactions conflict). |
| `accentColor`           | `string`                  | No       | Accent color for active filter button backgrounds, filter value labels, the row-selection indicator bar, and the clear-filters button. Accepts a Tailwind color token (`"blue-600"`) or any CSS color value (`"#3b82f6"`). Defaults to `zinc-800`. |
| `onRowAction`           | `{ onAdd?, onEdit?, onDelete? }` | No | Callbacks for the per-row action dropdown (requires `enableRowActions`). Each receives `row.original` as `TData`. Only items with a provided callback are rendered in the menu. |
| `onBulkAction`          | `{ onEdit?, onDelete? }`  | No       | Callbacks for the bulk editor toolbar (requires `enableRowSelection`). Each receives `TData[]` for all selected rows. Commands are disabled when no callback is provided. |

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

### StatusMap

A grid-based status heatmap that renders rows × dates cells, each colored by a status key. Useful for operational dashboards (machine status, service health, etc.). Fully driven by props — pass data, a label config, and display options.

**Demo:** `localhost:3000/status-map`

#### Files to copy

```
components/ui/status-map/StatusHeatmap.tsx
components/ui/status-map/types.ts
components/ui/status-map/index.ts
```

#### shadcn dependencies

None required.

#### npm dependencies

```bash
npm install date-fns
```

#### Internal dependencies

| File           | Purpose                                     |
| -------------- | ------------------------------------------- |
| `lib/utils.ts` | `cn()` utility — already in any shadcn project |

#### Type augmentations

None.

#### Usage

```tsx
import { StatusMap } from "@/components/ui/status-map"
import type { StatusMapEntry } from "@/components/ui/status-map"

const data: StatusMapEntry[] = [
  { row: "Machine A", date: "2025-03-01", status: "green" },
  { row: "Machine A", date: "2025-03-02", status: "red" },
  { row: "Machine B", date: "2025-03-01", status: "orange" },
]

export default function Page() {
  return (
    <StatusMap
      data={data}
      labelConfig={{
        green:  { color: "bg-emerald-500", label: "Operational" },
        orange: { color: "bg-orange-400",  label: "Warning" },
        red:    { color: "bg-red-500",     label: "Fault" },
        grey:   { color: "bg-muted",       label: "No data" },
      }}
      label
      labelAlign="right"
      labelTop={false}
      style="rounded"
      onCellClick={(row, date, status) => console.log(row, date, status)}
    />
  )
}
```

**Props:**

| Prop          | Type                                    | Default      | Description                                                                       |
| ------------- | --------------------------------------- | ------------ | --------------------------------------------------------------------------------- |
| `data`        | `StatusMapEntry[]`                      | —            | Array of `{ row, date, status }`. Missing row/date combinations fall back to the last key in `labelConfig`. |
| `labelConfig` | `Record<string, StatusItemConfig>`      | —            | Maps status keys to `{ color: string, label: string }`. `color` is a Tailwind bg class (e.g. `"bg-emerald-500"`). |
| `style`       | `"rounded" \| "squared" \| "tight"`    | `"rounded"`  | Cell shape. `tight` collapses padding for dense grids.                            |
| `bordered`    | `boolean`                               | `true`       | Wraps the grid in a rounded border.                                               |
| `label`       | `boolean`                               | `false`      | Shows a color legend.                                                             |
| `labelAlign`  | `"left" \| "center" \| "right"`        | `"left"`     | Horizontal alignment of the legend.                                               |
| `labelTop`    | `boolean`                               | `false`      | Renders the legend above the grid instead of below.                               |
| `className`   | `string`                                | —            | Additional class names on the root element.                                       |
| `onCellClick` | `(row, date, status) => void`           | —            | Callback fired when a cell is clicked.                                            |

**`StatusMapEntry` fields:**

| Field    | Type     | Description                      |
| -------- | -------- | -------------------------------- |
| `row`    | `string` | Row label (e.g. machine name)    |
| `date`   | `string` | ISO `"YYYY-MM-DD"` date          |
| `status` | `string` | Key into `labelConfig`           |

**Features:**

- Derives unique rows and dates automatically from `data` — no manual axis config
- Missing cells fall back to the last key in `labelConfig` (intended as a "no data" state)
- Legend shows count of cells per status in parentheses
- Horizontally scrollable for wide date ranges
- `onCellClick` for interactive dashboards

#### Notes

- Rows appear in insertion order from `data`; dates are sorted ascending
- The `date` field must be `"YYYY-MM-DD"`; the component appends `T00:00:00` to avoid timezone off-by-one errors

---

### Badge

A small label component for displaying status, categories, or counts. Inspired by Tremor's Badge. Supports five semantic color variants (`default`, `neutral`, `success`, `warning`, `error`) with automatic light and dark mode styling.

**Demo:** `localhost:3000/ui/badge`

#### Files to copy

```
components/ui/badge.tsx
```

#### shadcn dependencies

None required.

#### npm dependencies

```bash
npm install class-variance-authority
```

#### Internal dependencies

| File           | Purpose                                         |
| -------------- | ----------------------------------------------- |
| `lib/utils.ts` | `cn()` utility — already in any shadcn project  |

#### Type augmentations

None.

#### Usage

```tsx
import { Badge } from "@/components/ui/badge"

<Badge variant="default">Default</Badge>
<Badge variant="neutral">Neutral</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
```

**Props:**

| Prop        | Type                                                       | Default       | Description                                   |
| ----------- | ---------------------------------------------------------- | ------------- | --------------------------------------------- |
| `variant`   | `"default" \| "neutral" \| "success" \| "error" \| "warning"` | `"default"` | Color scheme of the badge                     |
| `className` | `string`                                                   | —             | Additional CSS classes                        |
| `children`  | `React.ReactNode`                                          | —             | Badge content — text and/or Lucide icons      |

**Features:**

- Five semantic variants: `default` (blue), `neutral` (gray), `success` (emerald), `warning` (yellow), `error` (red)
- Icon support — place any `lucide-react` icon as a direct child, auto-sized to 12 px
- Full light and dark mode support via Tailwind color classes
- Spreads all native `span` props for aria attributes, event handlers, etc.
- Exports `badgeVariants` CVA function for reuse on other elements

#### Notes

- Replaces the default shadcn `badge.tsx` — the variant names differ from shadcn's (`default/secondary/destructive/outline`)
- `cva` is already installed via shadcn's `class-variance-authority` dependency

---

### Tabs

Accessible tabbed navigation built on Radix UI Tabs primitives. Supports `line` (underline indicator) and `solid` (pill with background) variants, icon support inside triggers, disabled states, and full keyboard navigation.

**Demo:** `localhost:3000/tabs`

#### Files to copy

```
components/ui/tabs.tsx
```

#### shadcn dependencies

None required.

#### npm dependencies

None — uses `radix-ui` (unified package), which is a peer dependency of any shadcn/ui setup.

#### Internal dependencies

| File           | Purpose                                     |
| -------------- | ------------------------------------------- |
| `lib/utils.ts` | `cn()` utility — already in any shadcn project |

#### Type augmentations

None.

#### Usage

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

<Tabs defaultValue="overview">
  <TabsList variant="line">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
    <TabsTrigger value="billing" disabled>Billing</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="settings">Settings content</TabsContent>
  <TabsContent value="billing">Billing content</TabsContent>
</Tabs>
```

**Props:**

`Tabs` (root):

| Prop            | Type                       | Default | Description                                  |
| --------------- | -------------------------- | ------- | -------------------------------------------- |
| `defaultValue`  | `string`                   | —       | Initially active tab value (uncontrolled)    |
| `value`         | `string`                   | —       | Controlled active tab value                  |
| `onValueChange` | `(value: string) => void`  | —       | Callback fired when the active tab changes   |
| `className`     | `string`                   | —       | Additional CSS classes on the root element   |

`TabsList`:

| Prop        | Type                  | Default    | Description                                                                              |
| ----------- | --------------------- | ---------- | ---------------------------------------------------------------------------------------- |
| `variant`   | `"line" \| "solid"`   | `"line"`   | `"line"` uses a border-bottom underline; `"solid"` uses a pill container with background |
| `className` | `string`              | —          | Additional CSS classes                                                                   |

`TabsTrigger`:

| Prop        | Type      | Default | Description                               |
| ----------- | --------- | ------- | ----------------------------------------- |
| `value`     | `string`  | —       | Identifier for this tab (required)        |
| `disabled`  | `boolean` | `false` | Disables interaction with the trigger     |
| `className` | `string`  | —       | Additional CSS classes                    |

`TabsContent`:

| Prop        | Type     | Default | Description                                            |
| ----------- | -------- | ------- | ------------------------------------------------------ |
| `value`     | `string` | —       | Must match the corresponding `TabsTrigger` value (required) |
| `className` | `string` | —       | Additional CSS classes                                 |

**Features:**

- Two visual variants: `line` (underline indicator) and `solid` (pill/card active state)
- Icon support — place any `lucide-react` icon as a child of `TabsTrigger`
- Disabled triggers via the `disabled` prop
- Full keyboard navigation (arrow keys, Home/End) inherited from Radix UI
- Variant context passed automatically from `TabsList` to `TabsTrigger` — no extra prop threading needed
- All sub-components accept `className` for full styling override

#### Notes

- Import as named exports: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `radix-ui` must be installed (`npm install radix-ui`)

---

### ComponentDoc

An in-page documentation block rendered at the bottom of demo pages. Shows a usage code snippet with a copy button and a props table. Follows the component's own props-driven API standard.

**Demo:** Visible at the bottom of every component demo page (e.g. `localhost:3000/data-table`, `localhost:3000/status-map`).

#### Files to copy

```
components/ui/component-doc/ComponentDoc.tsx
components/ui/component-doc/index.ts
```

#### shadcn dependencies

None required.

#### npm dependencies

None.

#### Internal dependencies

| File           | Purpose                                     |
| -------------- | ------------------------------------------- |
| `lib/utils.ts` | `cn()` utility — already in any shadcn project |

#### Type augmentations

None.

#### Usage

```tsx
import { ComponentDoc } from "@/components/ui/component-doc"

// Single flat props list:
<ComponentDoc
  title="MyComponent"
  description="Short description of what it does."
  usage={`import { MyComponent } from "@/components/ui/my-component"

<MyComponent requiredProp="value" optionalProp />`}
  props={[
    { name: "requiredProp", type: "string", required: true, description: "..." },
    { name: "optionalProp", type: "boolean", default: "false", description: "..." },
  ]}
/>

// Multiple named prop sections (e.g. component props + sub-type fields):
<ComponentDoc
  title="MyComponent"
  usage={`...`}
  propSections={[
    {
      title: "MyComponent props",
      props: [{ name: "data", type: "Row[]", required: true, description: "..." }],
    },
    {
      title: "Row fields",
      props: [{ name: "id", type: "string", required: true, description: "..." }],
    },
  ]}
/>
```

**Props:**

| Prop           | Type              | Description                                                                          |
| -------------- | ----------------- | ------------------------------------------------------------------------------------ |
| `title`        | `string`          | Component name shown as the section heading.                                         |
| `description`  | `string`          | Optional subtitle below the heading.                                                 |
| `usage`        | `string`          | Raw code string rendered in a syntax-highlighted block with a copy button.           |
| `props`        | `PropDef[]`       | Flat list of prop definitions. Renders under a single "Props" heading.               |
| `propSections` | `PropSection[]`   | Multiple named prop groups, each with its own sub-heading. Use instead of `props` when there are multiple distinct types to document. |
| `className`    | `string`          | Additional class names on the root `<section>`.                                      |

**`PropDef` fields:**

| Field         | Type      | Description                                   |
| ------------- | --------- | --------------------------------------------- |
| `name`        | `string`  | Prop name (rendered in monospace)             |
| `type`        | `string`  | Type string (rendered in a muted code badge)  |
| `default`     | `string`  | Default value, if any                         |
| `required`    | `boolean` | Adds a red `*` next to the prop name          |
| `description` | `string`  | Human-readable description                    |

#### Notes

- Place `<ComponentDoc>` at the bottom of every demo page, after the live component demo
- Update it whenever props are added, removed, or changed
