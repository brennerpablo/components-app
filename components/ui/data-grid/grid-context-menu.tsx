"use client";

import { Copy } from "lucide-react";

import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";

import { useGridContext } from "./grid-context";
import { useGridSelection } from "./selection-store";

/**
 * The sheet's right-click menu.
 *
 * It lives in its own component, and not inside `DataGrid`, because it needs
 * to KNOW whether there is a selection: subscribing to that up there would
 * re-render the whole grid on every frame of a drag, which is exactly what the
 * `selection-store` architecture avoids. Here the subscription is to a
 * boolean, and Radix only mounts the content while the menu is open — during a
 * drag this component does not exist at all.
 *
 * What ADJUSTS the selection when the menu opens is `use-grid-mouse.ts`, in the
 * native `contextmenu` listener: right-clicking outside the selection moves it
 * there, inside it preserves the rectangle. That is the spreadsheet rule, and
 * it is what prevents the ugly case — picking 400 rows, missing the click on a
 * fifth column and copying one cell.
 */
export function GridContextMenuContent({ onCopy }: { onCopy: () => void }) {
  const { store, strings } = useGridContext();
  const hasSelection = useGridSelection(store, () => !!store.getRect());

  return (
    <ContextMenuContent className="w-56">
      <ContextMenuItem disabled={!hasSelection} onSelect={onCopy}>
        <Copy />
        {strings.copy}
        <ContextMenuShortcut>{copyShortcut()}</ContextMenuShortcut>
      </ContextMenuItem>
    </ContextMenuContent>
  );
}

/**
 * The shortcut label. Read on click and not at module scope: the menu content
 * only mounts after hydration, so server and client can never disagree — and a
 * Mac keyboard says ⌘, not Ctrl.
 */
function copyShortcut(): string {
  if (typeof navigator === "undefined") return "Ctrl+C";
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ? "⌘C" : "Ctrl+C";
}
