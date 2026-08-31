import { foldText } from "@/lib/fold-text";

import type { GridColumn } from "./types";

/**
 * The string a text cell DISPLAYS. Shared so the three consumers that must
 * agree on it actually do: the body renders it, autosize measures it, and
 * "Localizar" searches it. They diverged trivially before — each re-derived
 * `format(value, row) ?? String(value)` inline — and a search that reads raw
 * values while the eye reads formatted ones finds nothing for "1.250.000".
 *
 * Columns that draw a control instead of text (icon action) return "": there
 * is nothing on screen to measure or match.
 */
export function cellText<TData>(
  col: GridColumn<TData>,
  row: TData | undefined,
): string {
  if (!row || col.action) return "";
  const value = (row as Record<string, unknown>)[col.id];
  if (col.format) return col.format(value, row);
  return value == null ? "" : String(value);
}

/**
 * Where `needle` matches inside `text`, accent- and case-insensitively, as an
 * index range into the ORIGINAL string — so the caller can highlight the text
 * the user actually sees rather than a folded copy of it.
 *
 * Folding is length-preserving for precomposed (NFC) input, which is what the
 * DOM hands us: "é" decomposes to "e"+combining and the combining mark is
 * dropped, one char in, one char out. Where that does NOT hold (already-NFD
 * text, stacked diacritics) the offsets would slide, so the length check bails
 * out and the caller renders the cell unhighlighted. A missing highlight is a
 * cosmetic loss; a sliding one paints the wrong letters.
 */
export function matchRange(
  text: string,
  foldedNeedle: string,
): [number, number] | null {
  if (!foldedNeedle) return null;
  const folded = foldText(text);
  if (folded.length !== text.length) return null;
  const start = folded.indexOf(foldedNeedle);
  return start < 0 ? null : [start, start + foldedNeedle.length];
}
