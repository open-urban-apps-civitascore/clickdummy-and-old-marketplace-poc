import Link from "next/link";
import {
  ArrowRight,
  Blocks,
  Database,
  LayoutGrid,
  PackagePlus,
  Search,
} from "lucide-react";

import { CatalogFreshness } from "@/components/catalog/catalog-freshness";
import { PageHeader } from "@/components/ui/layout";
import { MarketplacePageShell } from "@/components/marketplace/page-shell";
import { RecentlyAdded } from "@/components/marketplace/recently-added";
import { getCatalog } from "@/lib/getCatalog";
import { getDataStructures } from "@/lib/getDataStructures";
import { getMarketplaceText } from "@/lib/marketplace-text";
import { getUseCases } from "@/lib/getUseCases";
import { recentlyAdded } from "@/lib/recently-added";

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

  const categories = Array.from(
    new Set(useCases.flatMap((useCase) => useCase.categories)),
  ).sort();

  const recent = recentlyAdded(
    { useCases, dataStructures, addons: catalog.addons },
    6,
  );


  return (
    <MarketplacePageShell breadcrumb={text.sidebar.nav.marketplace}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="max-w-3xl">
          <PageHeader title={text.landing.heading} lead={text.landing.subtitle} />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {text.landing.intro}
          </p>

          {/* Plain GET form — lands on the use-case catalog with `?q=` prefilled. */}
          <form
            action="/marketplace/use-cases"
            method="get"
            className="mt-5 flex max-w-xl flex-col gap-2 sm:flex-row"
          >
            <label className="relative block flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                name="q"
                placeholder={text.landing.searchPlaceholder}
                className="h-11 w-full rounded-lg border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {text.landing.searchButton}
            </button>
          </form>

          {categories.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/marketplace/use-cases?kategorie=${encodeURIComponent(category)}`}
                  className="rounded-full border bg-card px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {category}
                </Link>
              ))}
            </div>
          ) : null}
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

        <RecentlyAdded
          entries={recent}
          heading={text.landing.recentHeading}
          subtitle={text.landing.recentSubtitle}
        />

        {/* The three sections, with their counts — the secondary navigation. */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <SectionTile
            href="/marketplace/use-cases"
            icon={LayoutGrid}
            tone="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            title={`${text.landing.useCasesHeading} (${useCases.length})`}
            hint="Fertige Pakete, die eine Aufgabe lösen — installierbar über die Plattform."
          />
          <SectionTile
            href="/marketplace/datastructures"
            icon={Database}
            tone="bg-primary/10 text-primary"
            title={`${text.sidebar.nav.dataStructures} (${dataStructures.length})`}
            hint={text.landing.dataStructuresHint}
          />
          <SectionTile
            href="/marketplace/addons"
            icon={Blocks}
            // Orange = add-on identity (complement of the CIVITAS blue).
            tone="bg-orange-500/10 text-orange-700 dark:text-orange-400"
            title={`${text.landing.addonsTitle} (${catalog.addons.length})`}
            hint={text.landing.addonsHint}
          />
        </section>

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

function SectionTile({
  href,
  icon: Icon,
  tone,
  title,
  hint,
}: {
  href: string;
  icon: typeof Blocks;
  tone: string;
  title: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-lg border bg-card p-5 transition-shadow hover:shadow-md"
    >
      <span aria-hidden className={`grid size-11 place-items-center rounded-lg ${tone}`}>
        <Icon className="size-5" />
      </span>
      <span className="flex items-center gap-1.5 text-base font-semibold text-foreground">
        {title}
        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </span>
      <span className="text-sm leading-relaxed text-muted-foreground">{hint}</span>
    </Link>
  );
}
