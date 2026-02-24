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
