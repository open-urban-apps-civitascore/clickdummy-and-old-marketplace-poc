"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CircleHelp } from "lucide-react";

/**
 * „?“ after a term: click, tap or Enter opens a short explanation; Esc, a click
 * outside or tabbing away closes it (§5 „Erklären“ of the design system).
 * Text only - anything with links belongs in a `Disclosure`.
 *
 * The bubble spans its nearest `relative` ancestor, so it never runs off a
 * narrow column; the text is announced when it opens (`role="status"`).
 */
/** `value`: the value the text explains, named in the bubble so it does not read as a definition of the whole field. */
export function Explanation({ term, value, children }: { term: string; value?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  // Where the „?“ sits inside the bubble's box, so the bubble's tip points at it.
  const [tip, setTip] = useState(0);
  const button = useRef<HTMLButtonElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!button.current?.contains(target) && !bubble.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-label={`Erklärung zu „${term}“`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          const own = button.current;
          if (own) setTip(own.offsetLeft + own.offsetWidth / 2);
          setOpen((was) => !was);
        }}
        // Tabbing to something else closes it; a click inside the bubble (to select text) does not.
        onBlur={(event) => {
          if (event.relatedTarget && !bubble.current?.contains(event.relatedTarget)) setOpen(false);
        }}
        className="-my-1 -ml-1 grid size-6 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
      >
        <CircleHelp aria-hidden className="size-3" />
      </button>
      <div ref={bubble} id={id} role="status">
        {open ? (
          <div className="absolute inset-x-0 top-full z-30 mt-2 origin-top rounded-md border bg-popover p-3 text-left text-xs font-normal leading-relaxed text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150 ease-out motion-reduce:animate-none">
            <span
              aria-hidden
              className="absolute -top-[5px] size-2.5 rotate-45 border-l border-t bg-popover"
              style={{ left: Math.max(tip - 5, 8) }}
            />
            {value ? (
              <p className="mb-1">
                <span className="text-muted-foreground">{term}:</span> <span className="font-semibold">{value}</span>
              </p>
            ) : (
              <p className="mb-1 font-semibold">{term}</p>
            )}
            {children}
          </div>
        ) : null}
      </div>
    </>
  );
}
