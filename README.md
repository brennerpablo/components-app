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

```markdown
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

| File | Purpose |
|---|---|
| `lib/some-util.ts` | Description of what it does |

#### Type augmentations

| File | What it augments |
|---|---|
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
```

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
components/ui/data-table/DataTablePagination.tsx
components/ui/data-table/DataTableRowActions.tsx
components/ui/data-table/DataTableViewOptions.tsx
components/ui/data-table/TanstackTable.d.ts
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

| File | Purpose |
|---|---|
| `lib/utils.ts` | `cn()` utility — already present in any shadcn project |
| `lib/exportTableToCSV.ts` | CSV export helper using PapaParse |

#### Type augmentations

| File | What it augments |
|---|---|
| `TanstackTable.d.ts` | Extends `@tanstack/react-table` `ColumnMeta` with `className?: string` and `displayName: string` |

#### Usage

```tsx
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"

type MyRow = { id: string; name: string; status: string }

const columns: ColumnDef<MyRow>[] = [
  // define your columns here
]

export default function Page() {
  return (
    <DataTable
      columns={columns}
      data={data}
      statuses={[{ value: "active", label: "Active" }]}
    />
  )
}
```

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `columns` | `ColumnDef<TData>[]` | Yes | TanStack Table column definitions |
| `data` | `TData[]` | Yes | Row data |
| `statuses` | `{ value: string; label: string }[]` | No | Options for the status filter |
| `regions` | `{ value: string; label: string }[]` | No | Options for the region filter |
| `conditions` | `{ value: string; label: string }[]` | No | Numeric condition options (`is-equal-to`, `is-between`, etc.) |
| `currencyFormatter` | `(value: number) => string` | No | Custom formatter for currency columns |

**Features:**
- Sorting on any column via `DataTableColumnHeader`
- Filter types: single select, multi-checkbox, numeric range (with conditions)
- Search with 300ms debounce on the `owner` column
- Row selection with indigo left-border indicator
- Bulk action command bar (keyboard shortcuts: `e` edit · `d` delete · `Escape` clear)
- Column visibility toggle + drag-and-drop reordering with accessibility live region announcements
- Pagination (20 rows/page) with responsive first/last buttons
- CSV export (visible columns only, PapaParse)

#### Notes

- Atlaskit DnD packages require `--legacy-peer-deps` due to a React 19 peer dependency conflict
- The `radix-ui` package used here is the unified package (`import { Popover } from "radix-ui"`), not the scoped `@radix-ui/*` packages
- Column `meta.displayName` is required for column visibility labels — set it on every column definition you want to appear in the view options panel
- The `owner` column is hardcoded as the search target in `DataTableFilterbar.tsx` — update it to match your searchable column's id
