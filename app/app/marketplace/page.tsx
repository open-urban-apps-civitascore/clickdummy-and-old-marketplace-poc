import Link from "next/link";
import { PackagePlus } from "lucide-react";

import { CatalogFreshness } from "@/components/catalog/catalog-freshness";
import { PageHeader } from "@/components/ui/layout";
import { MarketplacePageShell } from "@/components/marketplace/page-shell";
import { RecentlyAdded } from "@/components/marketplace/recently-added";
import { getCatalog } from "@/lib/getCatalog";
import { getDataStructures } from "@/lib/getDataStructures";
import { getMarketplaceText } from "@/lib/marketplace-text";
import { getUseCases } from "@/lib/getUseCases";
import { recentlyAddedByKind } from "@/lib/recently-added";

/**
 * The marketplace front page — the front door, not a catalog.
 *
 * It answers three things before anything else: what this place is, why it is
 * worth using, and whether anything is happening here. The last one is what a
 * bare "first six use cases" grid could never show, which is why the middle of
 * the page is now "Zuletzt hinzugefügt" across all three sections rather than
 * a slice of one of them.
 *
 * Search and the category chips route into the use-case catalog (`?q=`,
 * `?kategorie=`), where the real filters live. Deliberately no AI-assistant
 * teaser here.
 */
export default async function MarketplacePage() {
  const text = getMarketplaceText();
  const [useCases, catalog, dataStructures] = await Promise.all([
    getUseCases(),
    getCatalog().catch(() => ({ addons: [] })),
    getDataStructures().catch(() => []),
  ]);


  // The section hints used to live on a separate row of nav tiles below. Those
  // tiles pointed at the same three destinations with the same three counts as
  // these columns, so they were removed and their copy moved up here.
  const SECTION_HINTS = {
    "use-case": "Fertige Pakete, die eine Aufgabe lösen — installierbar über die Plattform.",
    "data-structure": text.landing.dataStructuresHint,
    addon: text.landing.addonsHint,
  } as const;

  const recentSections = recentlyAddedByKind({
    useCases,
    dataStructures,
    addons: catalog.addons,
  }).map((section) => ({ ...section, hint: SECTION_HINTS[section.kind] }));


  return (
    <MarketplacePageShell breadcrumb={text.sidebar.nav.marketplace}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="max-w-3xl">
          <PageHeader title={text.landing.heading} lead={text.landing.subtitle} />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {text.landing.intro}
          </p>

        </section>

        {/* Why this marketplace.
            Fourth attempt, and the first three all failed the same way: they
            were BOXES. Cards forced equal heights onto unequal copy (two tiles
            sat half empty), the box-in-box nesting was the thing Ewa had
            already objected to elsewhere, and the "real asset" idea backfired
            — the category illustration is small-card art, and at full width it
            is an abstract blob that communicates nothing.
            So: no boxes at all. Editorial type, a numbered sequence, a rule per
            column, whitespace doing the grouping. Nothing here can look
            half-empty because nothing is a container. */}
        <section aria-labelledby="warum-heading">
          <h2 id="warum-heading" className="text-xl font-semibold text-foreground">
            Warum dieser Marktplatz
          </h2>

          <ol className="mt-8 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-3">
            {text.landing.benefits.map((benefit, position) => (
              <li key={benefit.title} className="border-t-2 border-primary/70 pt-5">
                <p
                  aria-hidden
                  className="text-sm font-semibold tabular-nums text-primary"
                >
                  {String(position + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {benefit.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <RecentlyAdded sections={recentSections} heading={text.landing.recentHeading} />

        <section className="flex flex-col items-start gap-4 rounded-xl border bg-muted/30 p-6 lg:p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-base font-semibold text-foreground">
              {text.landing.contributeTitle}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{text.landing.contributeBody}</p>
          </div>
          <Link
            href="/export"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <PackagePlus className="size-4" />
            {text.landing.contributeCta}
          </Link>
        </section>

        <CatalogFreshness />
      </div>
    </MarketplacePageShell>
  );
}
