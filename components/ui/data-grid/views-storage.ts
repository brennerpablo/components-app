import type { SavedView } from "./types";

/**
 * localStorage-backed persistence for saved filter views. Isolated behind
 * load/save so the storage backend stays swappable.
 *
 * History: v1 used a cookie under the same key (4KB cap). Now that views
 * also carry column layout, storage moved to localStorage; `loadViews`
 * migrates any legacy cookie once and expires it.
 */

function readLegacyCookie(storageKey: string): SavedView[] | null {
  const prefix = `${storageKey}=`;
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith(prefix));
  if (!cookie) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(cookie.slice(prefix.length)));
    return Array.isArray(parsed) ? (parsed as SavedView[]) : null;
  } catch {
    return null;
  }
}

export function loadViews(storageKey: string): SavedView[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw != null) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as SavedView[]) : [];
    }
    // One-time migration from the cookie era.
    const legacy = readLegacyCookie(storageKey);
    if (legacy) {
      window.localStorage.setItem(storageKey, JSON.stringify(legacy));
      document.cookie = `${storageKey}=; path=/; max-age=0; SameSite=Lax`;
      return legacy;
    }
    return [];
  } catch {
    return [];
  }
}

/** Persist views. Returns false when storage refuses (quota/privacy mode). */
export function saveViews(storageKey: string, views: SavedView[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(views));
    return true;
  } catch {
    return false;
  }
}
