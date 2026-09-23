"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Honour the OS "reduce motion" setting — an animation nobody asked for.
 *
 * `useSyncExternalStore` rather than an effect + setState: a media query IS an
 * external store, and subscribing to one from an effect makes React re-render
 * a second time on mount for a value it could have read directly.
 */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia(REDUCED_MOTION);
      query.addEventListener("change", onStoreChange);
      return () => query.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    // Server snapshot: render the motion-enabled markup, the client corrects it.
    () => false,
  );
}

/**
 * A show/hide section with the app's own chevron and a height animation.
 *
 * Replaces native `<details>/<summary>`, which rendered the browser's default
 * triangle (▸) — the one disclosure marker in the app that did not match the
 * rotating `ChevronDown` every filter dropdown uses (Ewa, 2026-09-23) — and
 * which snaps open with no transition.
 *
 * The height is MEASURED and animated in pixels, rather than the two usual
 * shortcuts: `grid-template-rows: 0fr → 1fr` depends on `fr` interpolation,
 * and a `max-height` guess either clips long content or stalls visibly while
 * the transition runs through empty space. A px→px height transition is the
 * one form every engine interpolates the same way, and a `ResizeObserver`
 * keeps the measurement honest when the content reflows.
 *
 * Closed content stays in the DOM so it can animate, and is `inert` so it is
 * neither focusable nor announced while hidden.
 */
export function Disclosure({
  summary,
  children,
  className,
  defaultOpen = false,
}: {
  summary: ReactNode;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentId = useId();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const measure = () => setContentHeight(element.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((previous) => !previous)}
        className="flex items-center gap-1 text-left text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        <ChevronDown
          aria-hidden
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
            open && "rotate-180",
          )}
        />
        {summary}
      </button>

      {/* Inline styles, not Tailwind arbitrary values: a measured, dynamic
          value belongs in `style`, and `grid-rows-[1fr]` was in fact not
          emitted by the JIT when it was tried here. */}
      <div
        id={contentId}
        inert={!open}
        style={{
          height: open ? contentHeight : 0,
          overflow: "hidden",
          transition: reducedMotion ? "none" : "height 200ms ease-out",
        }}
      >
        <div ref={contentRef} className="pt-2">
          {children}
        </div>
      </div>
    </div>
  );
}
