export const ROW_HEIGHT = 32;
export const HEADER_HEIGHT = 36;
export const GUTTER_WIDTH = 56;
export const OVERSCAN = 8;

/** Hard cap on cells per clipboard copy (rows × selected columns). */
export const COPY_CELL_CAP = 100_000;

/** Column resize clamp. */
export const MIN_COL_WIDTH = 60;
export const MAX_COL_WIDTH = 600;

// z-index ladder: rows sit at auto/0, the selection overlay above them, the
// sticky gutter above the overlay, the sticky header above the gutter, the
// column-move drop line above the header, and the top-left corner (sticky on
// both axes) above everything.
export const Z_OVERLAY = 10;
export const Z_GUTTER = 20;
export const Z_HEADER = 30;
export const Z_DROPLINE = 35;
export const Z_CORNER = 40;
