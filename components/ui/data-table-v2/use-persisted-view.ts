"use client";

import * as React from "react";

import {
  parseView,
  type PersistableColumn,
  sameView,
  serializeView,
  type TableView,
  tableViewKey,
} from "./persistence";

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, serialized: string, defaults: TableView) {
  try {
    if (serialized === serializeView(defaults)) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, serialized);
  } catch {}
}

export function usePersistedView({
  tableId,
  columns,
  defaults,
  view,
  onRestore,
  treeLevelIds,
}: {
  tableId: string | undefined;
  columns: readonly PersistableColumn[];
  defaults: TableView;
  view: TableView;
  onRestore: (saved: TableView) => void;
  treeLevelIds?: readonly string[];
}) {
  const storageKey = tableId ? tableViewKey(tableId) : null;

  const [loadedKey, setLoadedKey] = React.useState<string | null>(null);

  React.useLayoutEffect(() => {
    if (!storageKey) return;
    const saved = parseView(read(storageKey), columns, defaults, treeLevelIds);
    if (saved && sameView(view, defaults)) onRestore(saved);
    setLoadedKey(storageKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const serialized = serializeView(view);
  React.useEffect(() => {
    if (!storageKey || loadedKey !== storageKey) return;
    write(storageKey, serialized, defaults);
  }, [storageKey, loadedKey, serialized, defaults]);
}
