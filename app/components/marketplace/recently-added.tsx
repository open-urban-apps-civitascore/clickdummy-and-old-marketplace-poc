import Link from "next/link";
import { ArrowRight, Blocks, Database, LayoutGrid } from "lucide-react";

import { formatCatalogDate } from "@/lib/catalog-recency";
import { CATALOG_KIND_LABELS, type CatalogHighlight, type CatalogKind } from "@/lib/recently-added";

/**
 * „Zuletzt hinzugefügt" — one mixed list across use cases, data structures and
 * add-ons. The mixing is the point: one glance should show that all three
 * sections exist and that something happened here recently.
 *
 * The type chip keeps its section's identity colour (green = Anwendungsfall,
 * orange = Add-on, blau = Datenstruktur), tinted only on the icon tile.
 */
const KIND_ICON: Record<CatalogKind, typeof LayoutGrid> = {
  "use-case": LayoutGrid,
  "data-structure": Database,
  addon: Blocks,
};

const KIND_TILE: Record<CatalogKind, string> = {
  "use-case": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  "data-structure": "bg-primary/10 text-primary",
  addon: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
};

export function RecentlyAdded({
  entries,
  heading,
  subtitle,
}: {
  entries: CatalogHighlight[];
  heading: string;
  subtitle: string;
}) {
  if (entries.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{heading}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <ul className="divide-y rounded-lg border bg-card">
        {entries.map((entry) => {
          const Icon = KIND_ICON[entry.kind];
          const date = formatCatalogDate(entry.addedAt);

          return (
            <li key={`${entry.kind}:${entry.id}`}>
              <Link
                href={entry.href}
                className="group flex items-start gap-4 p-4 transition-colors hover:bg-muted/40"
              >
                <span
                  aria-hidden
                  className={`grid size-9 shrink-0 place-items-center rounded-lg ${KIND_TILE[entry.kind]}`}
                >
                  <Icon className="size-4" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      {CATALOG_KIND_LABELS[entry.kind]}
                    </span>
                    {date ? (
                      <span className="text-[11px] text-muted-foreground">· {date}</span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    {entry.title}
                    <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-sm text-muted-foreground">
                    {entry.summary}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">{entry.meta}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
