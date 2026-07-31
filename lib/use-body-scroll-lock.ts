"use client";

import * as React from "react";

/**
 * Locks page scrolling while a `position: fixed` overlay is open.
 *
 * Without it the page keeps its own scrollbar BEHIND the overlay: the bar
 * moves, content scrolls underneath, and nothing on screen changes — a
 * scrollbar that does nothing. Radix dialogs do this themselves; the fullscreen
 * modes of Card and DataTable are hand-rolled portals and need the equivalent.
 *
 * The counter is module-level because locks nest (a Card in fullscreen holding
 * a DataTable that also expands): only the first acquire touches `<body>` and
 * only the last release restores it.
 */
let lockCount = 0;
let restoreBodyStyle: (() => void) | null = null;

function acquireLock() {
  lockCount += 1;
  if (lockCount > 1) return;

  const { body } = document;
  const previousOverflow = body.style.overflow;
  const previousPaddingRight = body.style.paddingRight;

  // Classic scrollbars (Windows/Linux) take layout space: hiding them would
  // shift content to the right. Compensate with equivalent padding. Overlay
  // scrollbars (macOS) measure 0, so nothing is compensated.
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  if (scrollbarWidth > 0) {
    const currentPadding =
      Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
  }
  body.style.overflow = "hidden";

  restoreBodyStyle = () => {
    body.style.overflow = previousOverflow;
    body.style.paddingRight = previousPaddingRight;
  };
}

function releaseLock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0 && restoreBodyStyle) {
    restoreBodyStyle();
    restoreBodyStyle = null;
  }
}

export function useBodyScrollLock(active: boolean) {
  React.useEffect(() => {
    if (!active) return;
    acquireLock();
    return releaseLock;
  }, [active]);
}
