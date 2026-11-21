export type TreeNode = { id: string; depth: number; hasChildren: boolean };

export function treeRowId(userId: string | undefined, index: number, parentId: string | undefined): string {
  return userId ?? (parentId == null ? String(index) : `${parentId}.${index}`);
}

export function walkTree<T>(
  data: readonly T[],
  getSubRows: (row: T) => readonly T[] | undefined,
  getId: ((row: T) => string | undefined) | undefined,
): TreeNode[] {
  const nodes: TreeNode[] = [];
  const visit = (rows: readonly T[], depth: number, parentId: string | undefined) => {
    rows.forEach((row, index) => {
      const id = treeRowId(getId?.(row), index, parentId);
      const children = getSubRows(row) ?? [];
      nodes.push({ id, depth, hasChildren: children.length > 0 });
      if (children.length > 0) visit(children, depth + 1, id);
    });
  };
  visit(data, 0, undefined);
  return nodes;
}

export function treeRowIds<T>(data: readonly T[], getSubRows: (row: T) => readonly T[] | undefined): Map<T, string> {
  const ids = new Map<T, string>();
  const visit = (rows: readonly T[], parentId: string | undefined) => {
    rows.forEach((row, index) => {
      const id = treeRowId(undefined, index, parentId);
      ids.set(row, id);
      const children = getSubRows(row);
      if (children?.length) visit(children, id);
    });
  };
  visit(data, undefined);
  return ids;
}

export function flattenTree<T>(data: readonly T[], getSubRows: (row: T) => readonly T[] | undefined): T[] {
  const rows: T[] = [];
  const visit = (level: readonly T[]) => {
    for (const row of level) {
      rows.push(row);
      const children = getSubRows(row);
      if (children?.length) visit(children);
    }
  };
  visit(data);
  return rows;
}

export function treeLevelCount(nodes: readonly TreeNode[]): number {
  return nodes.reduce((max, node) => Math.max(max, node.depth + 1), nodes.length ? 1 : 0);
}

export function expandedNodes(
  nodes: readonly TreeNode[],
  depth: number,
  overrides: Readonly<Record<string, boolean>>,
): Record<string, boolean> {
  const open: Record<string, boolean> = {};
  for (const node of nodes) {
    if (!node.hasChildren) continue;
    if (overrides[node.id] ?? node.depth < depth) open[node.id] = true;
  }
  return open;
}

export type DisplayRow<R> = { kind: "row"; row: R } | { kind: "more"; parentId: string; depth: number; hidden: number };

export function limitChildren<R extends { id: string; depth: number; parentId?: string }>(
  rows: readonly R[],
  limit: number | undefined,
  showAll: ReadonlySet<string>,
  childCount: (parentId: string) => number,
): DisplayRow<R>[] {
  if (!limit || limit < 1) return rows.map((row) => ({ kind: "row", row }));
  const out: DisplayRow<R>[] = [];
  const shown = new Map<string, number>();
  let skipBelow: number | null = null;
  for (const row of rows) {
    if (skipBelow != null) {
      if (row.depth > skipBelow) continue;
      skipBelow = null;
    }
    const parentId = row.parentId;
    if (parentId != null && !showAll.has(parentId)) {
      const n = shown.get(parentId) ?? 0;
      shown.set(parentId, n + 1);
      if (n >= limit) {
        if (n === limit) {
          out.push({ kind: "more", parentId, depth: row.depth, hidden: childCount(parentId) - limit });
        }
        skipBelow = row.depth;
        continue;
      }
    }
    out.push({ kind: "row", row });
  }
  return out;
}

export function groupBySection<R>(
  rows: readonly R[],
  sectionIds: readonly string[],
  sectionOf: (row: R) => string,
  fallback?: string,
): Map<string, R[]> {
  const groups = new Map<string, R[]>(sectionIds.map((id) => [id, []]));
  for (const row of rows) {
    const target = groups.get(sectionOf(row)) ?? (fallback ? groups.get(fallback) : undefined);
    if (target) target.push(row);
  }
  return groups;
}
