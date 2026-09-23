import Link from "next/link";
import { ArrowRight, Blocks, Database, LayoutGrid } from "lucide-react";

import { Panel } from "@/components/ui/layout";
import { formatCatalogDate } from "@/lib/catalog-recency";
import { type CatalogKind, type CatalogKindPreview } from "@/lib/recently-added";

/**
 * „Zuletzt hinzugefügt" — one Panel per catalog section, each previewing its
 * three newest entries (Ewa, 2026-09-23).
 *
 * Per section rather than one mixed list: mixed showed that *something* was
 * moving but not *where*, and a burst of add-ons could hide the fact that no
 * use case had arrived in months.
 *
 * Built on the shared `Panel` so the front page reads like the rest of the app
 * — an earlier borderless version drifted into a layout language used nowhere
 * else. Each row carries enough to decide whether to click: title, what it is,
 * who published it and when.
 */
const KIND_ICON: Record<CatalogKind, typeof LayoutGrid> = {
  "use-case": LayoutGrid,
  "data-structure": Database,
  addon: Blocks,
};

/** Panel tones are the app's identity colours — §4.2, icon tile only. */
const KIND_TONE: Record<CatalogKind, "usecase" | "datastructure" | "addon"> = {
  "use-case": "usecase",
  "data-structure": "datastructure",
  addon: "addon",
};

export function RecentlyAdded({
  sections,
  heading,
}: {
  sections: CatalogKindPreview[];
  heading: string;
}) {
  if (sections.every((section) => section.entries.length === 0)) return null;

  return (
    // Extra top margin on purpose: this band starts a new thought after the
    // "why" section, and the page's uniform gap was not enough to say so.
    <section aria-labelledby="zuletzt-heading" className="mt-6">
      <h2 id="zuletzt-heading" className="text-xl font-semibold text-foreground">
        {heading}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = KIND_ICON[section.kind];

          return (
            <Panel
              key={section.kind}
              title={section.label}
              icon={<Icon aria-hidden className="size-4" />}
              tone={KIND_TONE[section.kind]}
              aside={
                <span className="text-xs tabular-nums text-muted-foreground">
                  {section.total}
                </span>
              }
              footer={
                <Link
                  href={section.href}
                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  Alle {section.label}
                  <ArrowRight className="size-3.5" />
                </Link>
              }
            >
              {section.hint ? (
                <p className="-mt-1 mb-3 text-sm leading-relaxed text-muted-foreground">
                  {section.hint}
                </p>
              ) : null}

              {section.entries.length > 0 ? (
                <ul className="mb-4 divide-y border-t">
                  {section.entries.map((entry) => {
                    const date = formatCatalogDate(entry.addedAt);
                    return (
                      <li key={entry.id}>
                        <Link href={entry.href} className="group flex flex-col gap-1 py-3">
                          <span className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                            {entry.title}
                          </span>
                          <span className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {entry.summary}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {entry.meta}
                            {date ? ` · ${date}` : ""}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                // An empty section says something true rather than vanishing.
                <p className="mb-4 border-t py-3 text-sm text-muted-foreground">
                  Noch nichts eingetragen.
                </p>
              )}
            </Panel>
          );
        })}
      </div>
    </section>
  );
}
