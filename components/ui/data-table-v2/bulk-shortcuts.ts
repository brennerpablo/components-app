"use client";

import * as React from "react";

export type BulkShortcut = {
  key: string;
  disabled?: boolean;
  run: () => void;
};

const NON_TEXT_INPUTS = new Set(["button", "checkbox", "color", "file", "image", "radio", "range", "reset", "submit"]);

const TYPING_SELECTOR = [
  "textarea",
  "select",
  '[contenteditable]:not([contenteditable="false"])',
  '[role="textbox"]',
  '[role="searchbox"]',
  '[role="combobox"]',
  '[role="spinbutton"]',
  '[role="menu"]',
  '[role="listbox"]',
  '[role="grid"]',
  '[role="tree"]',
  '[role="application"]',
].join(", ");

export function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as Element | null;
  if (!el || typeof el.closest !== "function") return false;
  const input = el.closest("input");
  if (input) return !NON_TEXT_INPUTS.has((input.getAttribute("type") ?? "text").toLowerCase());
  return el.closest(TYPING_SELECTOR) !== null;
}

const OVERLAY_SELECTOR = [
  "dialog[open]",
  '[role="dialog"]',
  '[role="alertdialog"]',
  '[role="menu"][data-state="open"]',
  '[role="listbox"][data-state="open"]',
].join(", ");

export function hasOverlayAbove(anchor: Element): boolean {
  if (anchor.closest('[aria-hidden="true"], [inert]')) return true;
  for (const overlay of anchor.ownerDocument.querySelectorAll(OVERLAY_SELECTOR)) {
    if (overlay.contains(anchor)) continue;
    if (overlay.getAttribute("data-state") === "closed") continue;
    return true;
  }
  return false;
}

type Entry = {
  anchor: () => Element | null;
  shortcuts: () => readonly BulkShortcut[];
};

const entries: Entry[] = [];

const TABLE_ROOT_SELECTOR = "[data-table-v2]";

function pickEntry(): { entry: Entry; anchor: Element } | null {
  const live = entries.flatMap((entry) => {
    const anchor = entry.anchor();
    return anchor?.isConnected ? [{ entry, anchor }] : [];
  });
  const focused = document.activeElement;
  const focusedTable = focused?.closest(TABLE_ROOT_SELECTOR) ?? null;
  if (focusedTable) return live.find(({ anchor }) => anchor.closest(TABLE_ROOT_SELECTOR) === focusedTable) ?? null;
  return live[live.length - 1] ?? null;
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.defaultPrevented || event.repeat || event.isComposing) return;
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (isTypingTarget(event.target) || isTypingTarget(document.activeElement)) return;
  const picked = pickEntry();
  if (!picked) return;
  const key = event.key.toLowerCase();
  const shortcut = picked.entry.shortcuts().find((candidate) => candidate.key === key);
  if (!shortcut || shortcut.disabled) return;
  if (hasOverlayAbove(picked.anchor)) return;
  event.preventDefault();
  shortcut.run();
}

function register(entry: Entry): () => void {
  if (entries.length === 0) document.addEventListener("keydown", handleKeyDown);
  entries.push(entry);
  return () => {
    const index = entries.indexOf(entry);
    if (index >= 0) entries.splice(index, 1);
    if (entries.length === 0) document.removeEventListener("keydown", handleKeyDown);
  };
}

export function useBulkShortcuts(
  anchorRef: React.RefObject<Element | null>,
  shortcuts: readonly BulkShortcut[],
  selection: unknown,
  active: boolean,
) {
  const latest = React.useRef(shortcuts);
  React.useEffect(() => {
    latest.current = shortcuts;
  });
  const enabled = active && shortcuts.length > 0;
  React.useEffect(() => {
    if (!enabled) return;
    return register({ anchor: () => anchorRef.current, shortcuts: () => latest.current });
  }, [enabled, selection, anchorRef]);
}
