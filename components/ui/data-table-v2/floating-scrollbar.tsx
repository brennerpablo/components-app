"use client";

import * as React from "react";
import ReactDOM from "react-dom";

const MIN_VISIBLE_PX = 48;

type Geometry = { left: number; width: number; bottom: number; scrollWidth: number };

function getVerticalScrollParent(el: HTMLElement): HTMLElement | null {
  let node = el.parentElement;
  while (node && node !== document.body && node !== document.documentElement) {
    const overflowY = window.getComputedStyle(node).overflowY;
    if ((overflowY === "auto" || overflowY === "scroll") && node.scrollHeight > node.clientHeight) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

export function FloatingScrollbar({
  scrollerRef,
  zIndex = 30,
}: {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
  zIndex?: number;
}) {
  const [geometry, setGeometry] = React.useState<Geometry | null>(null);
  const barRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame = 0;
    let lastKey = "";

    const measure = () => {
      frame = 0;
      const rect = scroller.getBoundingClientRect();
      const parent = getVerticalScrollParent(scroller);
      const viewportBottom = parent
        ? Math.min(parent.getBoundingClientRect().bottom, window.innerHeight)
        : window.innerHeight;
      const show =
        rect.width > 0 &&
        scroller.scrollWidth > scroller.clientWidth + 1 &&
        rect.bottom > viewportBottom + 1 &&
        rect.top < viewportBottom - MIN_VISIBLE_PX;

      if (!show) {
        if (lastKey !== "") {
          lastKey = "";
          setGeometry(null);
        }
        return;
      }

      const next: Geometry = {
        left: rect.left,
        width: rect.width,
        bottom: window.innerHeight - viewportBottom,
        scrollWidth: scroller.scrollWidth,
      };
      const key = `${next.left}|${next.width}|${next.bottom}|${next.scrollWidth}`;
      if (key === lastKey) return;
      lastKey = key;
      setGeometry(next);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    const followTable = () => {
      const bar = barRef.current;
      if (bar && bar.scrollLeft !== scroller.scrollLeft) bar.scrollLeft = scroller.scrollLeft;
    };

    measure();
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    scroller.addEventListener("scroll", followTable);
    const observer = new ResizeObserver(schedule);
    observer.observe(scroller);
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      scroller.removeEventListener("scroll", followTable);
      observer.disconnect();
    };
  }, [scrollerRef]);

  React.useLayoutEffect(() => {
    const bar = barRef.current;
    const scroller = scrollerRef.current;
    if (bar && scroller) bar.scrollLeft = scroller.scrollLeft;
  }, [geometry, scrollerRef]);

  if (!geometry) return null;

  return ReactDOM.createPortal(
    <div
      ref={barRef}
      data-datatable-floating-scrollbar=""
      aria-hidden
      tabIndex={-1}
      className="grid-scrollbar fixed overflow-x-auto overflow-y-hidden border-t border-border bg-background"
      style={{ left: geometry.left, width: geometry.width, bottom: geometry.bottom, zIndex }}
      onScroll={(e) => {
        const scroller = scrollerRef.current;
        if (scroller && scroller.scrollLeft !== e.currentTarget.scrollLeft) {
          scroller.scrollLeft = e.currentTarget.scrollLeft;
        }
      }}
    >
      <div style={{ width: geometry.scrollWidth, height: 1 }} />
    </div>,
    document.body,
  );
}
