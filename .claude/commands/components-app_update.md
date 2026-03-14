# /components-app_update

Update one or more components from the `components-app` source repo into the current (target) project.

## Arguments

`$ARGUMENTS` — space-separated component names to update, e.g. `DataTable StatusMap`. If omitted, prompt the user to specify which components to update.

## Protocol

Follow these steps exactly and in order. Do not skip steps.

### Step 0 — Resolve source repo

The source repo is at `/Users/pablobrenner/Documents/repos/components-app`. Confirm it is reachable:

```bash
ls /Users/pablobrenner/Documents/repos/components-app/README.md
```

If the path does not exist, stop and tell the user to provide the correct path to `components-app`.

### Step 1 — Read the README entry for each requested component

For each component name in `$ARGUMENTS`, read the corresponding section from the source README:

```
Read: /Users/pablobrenner/Documents/repos/components-app/README.md
```

Extract and record:
- **Files to copy** (all paths)
- **shadcn dependencies** (the `npx shadcn@latest add` command, if any)
- **npm dependencies** (all `npm install` commands, noting any `--legacy-peer-deps` flags)
- **Internal dependencies** (non-`lib/utils.ts` entries only)
- **Type augmentations** (`.d.ts` files)

### Step 2 — Diff against what already exists in the target

For each file listed under "Files to copy", read both the source and the target version:

- Source: `/Users/pablobrenner/Documents/repos/components-app/<path>`
- Target: `./<path>` (current working directory)

Identify:
1. **New files** — present in source, absent in target
2. **Changed files** — content differs
3. **Unchanged files** — identical; skip these entirely

Also diff any internal dependency files and type augmentation files.

### Step 3 — Check for new dependencies

Compare source `package.json` deps against target `package.json`:

```
Read: /Users/pablobrenner/Documents/repos/components-app/package.json
Read: ./package.json
```

Identify any packages listed in the component's **npm dependencies** that are missing or at a lower version in the target. Record them.

### Step 4 — Install missing dependencies (run in target)

If there are new shadcn primitives to add:

```bash
npx shadcn@latest add <primitives>
```

If there are new npm packages (standard):

```bash
npm install <packages>
```

If there are Atlaskit or other packages requiring legacy peers:

```bash
npm install --legacy-peer-deps <packages>
```

Only run installs for packages actually missing from the target — do not reinstall what is already present.

### Step 5 — Copy changed and new files

For each file identified as new or changed in Step 2:

1. Read the full source file from `/Users/pablobrenner/Documents/repos/components-app/<path>`
2. Write it to `./<path>` in the target, preserving the exact directory structure
3. If the target file already exists, overwrite it entirely — do not merge

Preserve path structure exactly. Never flatten directories.

### Step 6 — Apply type augmentations

For each `.d.ts` listed under **Type augmentations** that is new or changed, write it to the same relative path in the target. Confirm the path is covered by the target `tsconfig.json` `include` glob (default `**/*.d.ts` is sufficient — no action needed unless the tsconfig is non-standard).

### Step 7 — Report call-site impact

Read the component's **Props** table from the README entry (source) and compare it to the previous version you read from the target in Step 2. List:

- Props added (new required props will break existing call sites)
- Props removed or renamed
- Type changes

Output a concise summary for the user:

```
## Update summary — <ComponentName>

Files changed: N
Files added: N
Files unchanged (skipped): N

Dependency changes:
  - Added: <package@version>
  - (none)

Props diff:
  - Added (optional): `newProp: boolean` — default false, no action needed
  - Added (required): `requiredProp: string` — UPDATE CALL SITES
  - Removed: `oldProp` — remove from call sites
  - (no prop changes)

Next step: search your codebase for usages and update call sites where noted above.
```

### Step 8 — Verify

Remind the user to:
1. Run `tsc --noEmit` (or the project's type-check command) to catch type errors
2. Visually verify the component renders against the usage example in the README
