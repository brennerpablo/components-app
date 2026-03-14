# CLAUDE.md

Instructions for Claude when working in this repository.

## README Maintenance (critical)

Whenever you **create or update a component**, you must also update `README.md`:

- Use the **Component Template** scaffold at the top of the README as the format.
- Keep the entry complete: files to copy, shadcn deps, npm deps, internal deps, type augmentations, usage example, props table, features list, and notes.
- If you're only making a minor fix, update the relevant section of the existing entry rather than rewriting it from scratch.

## Stack

- Next.js + React 19 + TypeScript
- Tailwind CSS v4 — use CSS variable tokens (`bg-muted`, `text-foreground`, `border-border`), no hardcoded colors
- shadcn/ui (New York style, neutral base) — add primitives with `npx shadcn@latest add <name>`
- `radix-ui` unified package — `import { Popover } from "radix-ui"` (not `@radix-ui/*`)
- `lucide-react` for icons
- `cn()` utility at `@/lib/utils`

## Component Conventions

- Components live in `components/ui/<name>/`
- Each component directory has an `index.ts` barrel export
- Demo pages live at `app/<name>/page.tsx` → accessible at `localhost:3000/<name>`
- Atlaskit DnD packages require `--legacy-peer-deps` (React 19 peer dep conflict)

## Component API Standard

All components must be **standalone single-call components driven entirely by props** — no compound component patterns (e.g. `<Table.Row>` sub-components), no required wrapper context, no imperative setup outside the JSX. The consumer passes everything through props and the component handles all internal complexity.

```tsx
// ✅ Correct — single call, props-driven
<DataTable<Row>
  columns={createColumns<Row>()}
  columnsMetadata={columnsMetadata}
  data={data}
  enablePagination
  bordered
/>

// ❌ Avoid — compound/multi-call patterns
<TableProvider>
  <TableHeader columns={columns} />
  <TableBody rows={rows} />
</TableProvider>
```

This is the standard established by `DataTable` and `StatusMap`.

## Demo Page Standard

Every demo page (`app/<name>/page.tsx`) must include a `<ComponentDoc>` block at the bottom, below the live component demo. This is the in-browser documentation for the component.

```tsx
import { ComponentDoc } from "@/components/ui/component-doc"

// At the bottom of the page, after the live demo:
<ComponentDoc
  title="ComponentName"
  description="Short description of what the component does."
  usage={`import { ComponentName } from "@/components/ui/component-name"

<ComponentName
  requiredProp="value"
  optionalProp={true}
/>`}
  props={[
    { name: "requiredProp", type: "string", required: true, description: "..." },
    { name: "optionalProp", type: "boolean", default: "false", description: "..." },
  ]}
/>
```

Use `propSections` instead of `props` when the component has multiple distinct prop groups (e.g. component props + config object fields).

**Whenever you add, remove, or change a prop on any component, update the `<ComponentDoc>` block on its demo page to match.**
