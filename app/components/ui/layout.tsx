import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The four levels of the communication design system, as components.
 * See `docs/communication-design-system.md`.
 *
 *   E1 Seite      PageHeader   text-3xl bold, no surface
 *   E2 Abschnitt  Section      text-xl semibold, rounded-xl, p-6 lg:p-8
 *   E3 Karte      Panel        text-sm semibold, rounded-lg, p-5
 *   E4 Feld       Field        text-xs label / text-sm value, rounded-md
 *
 * These exist so the class strings live in ONE place. An audit on 2026-09-23
 * found twenty-plus hand-written card recipes and `<h2>` at four different
 * sizes, which is what happens when every component decides for itself.
 *
 * Radius encodes nesting depth (xl → lg → md) and padding shrinks with it, so
 * a reader can see how deep they are without reading a word.
 */

// ── E1 · Seite ──────────────────────────────────────────────────────────────

export function PageHeader({
  title,
  lead,
  meta,
  actions,
  className,
}: {
  title: string;
  /** One sentence under the title. Optional. */
  lead?: ReactNode;
  /** Freshness line, counts — quiet context below the lead. */
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {lead ? <p className="mt-2 text-base text-muted-foreground">{lead}</p> : null}
        {meta ? <div className="mt-2">{meta}</div> : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  );
}

// ── E2 · Abschnitt ──────────────────────────────────────────────────────────

/**
 * A major band of a page. `tone="muted"` marks a zone that belongs to a
 * different audience (the technical zone), not a different importance.
 */
export function Section({
  title,
  lead,
  aside,
  tone = "card",
  children,
  className,
  id,
}: {
  title?: string;
  lead?: ReactNode;
  /** Rendered at the right of the heading row — a badge or a pill, not an action. */
  aside?: ReactNode;
  tone?: "card" | "muted" | "bare";
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const headingId = id ? `${id}-title` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        "rounded-xl p-6 lg:p-8",
        tone === "card" && "border bg-card",
        tone === "muted" && "border bg-muted/30",
        tone === "bare" && "p-0 lg:p-0",
        className,
      )}
    >
      {title ? (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
          <div className="max-w-3xl">
            <h2 id={headingId} className="text-xl font-semibold text-foreground">
              {title}
            </h2>
            {lead ? <p className="mt-1 text-sm text-muted-foreground">{lead}</p> : null}
          </div>
          {aside ? <div className="shrink-0">{aside}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

// ── E3 · Karte ──────────────────────────────────────────────────────────────

/**
 * Identity tints for a Panel's icon tile — §4.2 of the communication design
 * system: colour may say WHAT KIND of thing this is, but only on an icon tile,
 * never on text or a card background.
 *
 * Note what does NOT get a tone: anything whose content already uses colour as
 * a judgement (`FitCheck`). A green identity tile beside a green „Passt zu …"
 * verdict would make the reader parse one green as the other.
 */
const PANEL_TONES = {
  neutral: "text-muted-foreground",
  usecase: "grid size-7 place-items-center rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  addon: "grid size-7 place-items-center rounded-md bg-orange-500/10 text-orange-700 dark:text-orange-400",
  datastructure: "grid size-7 place-items-center rounded-md bg-primary/10 text-primary",
} as const;

export function Panel({
  title,
  icon,
  tone = "neutral",
  aside,
  footer,
  children,
  className,
}: {
  title?: string;
  /** A lucide icon element; rendered muted, or in a tinted tile when toned. */
  icon?: ReactNode;
  tone?: keyof typeof PANEL_TONES;
  aside?: ReactNode;
  /** Quiet note under a divider at the foot of the card. */
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border bg-card p-5", className)}>
      {title ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {icon ? <span className={PANEL_TONES[tone]}>{icon}</span> : null}
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          </div>
          {aside ? <div className="shrink-0">{aside}</div> : null}
        </div>
      ) : null}
      {children}
      {footer ? (
        <div className="mt-4 border-t pt-3 text-xs text-muted-foreground">{footer}</div>
      ) : null}
    </section>
  );
}

/**
 * A quiet structural label for a region inside a Panel. NOT a heading level of
 * its own — it labels a group without competing with the Panel's own title.
 */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

// ── E4 · Feld ───────────────────────────────────────────────────────────────

/**
 * Label/value pairs. `layout="stacked"` for narrow columns (a sidebar),
 * `layout="columns"` for wide ones, where a two-column grid keeps every value
 * aligned on the same axis instead of being pushed to the far edge.
 */
export function FieldList({
  layout = "stacked",
  children,
  className,
}: {
  layout?: "stacked" | "columns";
  children: ReactNode;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        layout === "stacked" && "flex flex-col gap-3",
        layout === "columns" &&
          "grid gap-x-6 gap-y-3 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]",
        className,
      )}
    >
      {children}
    </dl>
  );
}

/**
 * One fact. `dt`/`dd` are emitted as direct children of the list via a
 * fragment, so `FieldList layout="columns"` keeps both columns aligned across
 * every row.
 */
export function Field({
  label,
  children,
  hint,
  layout = "stacked",
}: {
  label: string;
  children: ReactNode;
  /** A muted line under the value — an explanation, not a second value. */
  hint?: ReactNode;
  layout?: "stacked" | "columns";
}) {
  if (layout === "columns") {
    return (
      <>
        <dt className="text-xs text-muted-foreground sm:pt-0.5">{label}</dt>
        <dd className="text-sm text-foreground">
          {children}
          {hint ? (
            <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
              {hint}
            </span>
          ) : null}
        </dd>
      </>
    );
  }

  // No per-row rule: a rule under every field turned a 10-field sidebar into
  // twelve horizontal lines, and structural boundaries became indistinguishable
  // from row separators. Spacing separates rows; rules mark group boundaries
  // only (§2 of the communication design system).
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">
        {children}
        {hint ? (
          <span className="mt-0.5 block text-xs font-normal leading-relaxed text-muted-foreground">
            {hint}
          </span>
        ) : null}
      </dd>
    </div>
  );
}

/**
 * A fact with no judgement attached — a band, a count, a version, a date.
 * Deliberately colourless: colour in this app means a trust grade or a type
 * identity, and tinting "S — unter 1.000 €" green would claim that cheap is
 * good. See §4 of the communication design system.
 */
export function NeutralBadge({
  short,
  children,
}: {
  /** Optional leading token, e.g. the band letter. */
  short?: string;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {short ? (
        <span
          aria-hidden
          className="inline-flex size-5 items-center justify-center rounded bg-muted text-[11px] font-semibold text-muted-foreground"
        >
          {short}
        </span>
      ) : null}
      <span className="text-sm font-normal text-foreground">{children}</span>
    </span>
  );
}
