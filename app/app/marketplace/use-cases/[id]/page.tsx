import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Section } from "@/components/ui/layout";
import { MarketplacePageShell } from "@/components/marketplace/page-shell";
import { DemoDataHighlight } from "@/components/use-cases/demo-data-highlight";
// import { FitCheck } from "@/components/use-cases/fit-check";
import { IncludedArtifactsSpec } from "@/components/use-cases/included-artifacts-spec";
import { InstallUseCaseButton } from "@/components/use-cases/install-use-case-button";
import { LogicModel } from "@/components/use-cases/logic-model";
import { EndUserSurfaces } from "@/components/use-cases/end-user-surfaces";
import { ProvidedSurfaces } from "@/components/use-cases/provided-surfaces";
import { TechnicalFacts } from "@/components/use-cases/technical-facts";
import { UseCaseGallery } from "@/components/use-cases/use-case-gallery";
import { UseCaseIllustration } from "@/components/use-cases/use-case-illustration";
import { UseCaseInfobox } from "@/components/use-cases/use-case-infobox";
import { DeprecatedNotice, TierBadge } from "@/components/use-cases/use-case-status";
import { getUseCaseById } from "@/lib/getUseCases";
import { getMarketplaceText } from "@/lib/marketplace-text";

/**
 * The use-case detail page reads in three bands (redesign 2026-09-22):
 *
 *   1. a two-column READING ZONE — the pitch on the left, a Wikipedia-style
 *      Steckbrief in a right rail, so the facts that decide a listing sit at
 *      the top instead of halfway down the page;
 *      The reading column carries the pitch and then the Wirkungslogik;
 *   2. a full-width SURFACES band — what you actually open, in a grid that
 *      adapts to how many surfaces the use case declares;
 *   3. a full-width TECHNICAL ZONE — interfaces, artifacts, platform needs.
 */
export default async function UseCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const text = getMarketplaceText();
  const useCase = await getUseCaseById(id);

  if (!useCase) {
    notFound();
  }

  // Deprecation may point to a successor entry; resolve it for the banner link.
  const successor = useCase.deprecated?.successorId
    ? await getUseCaseById(useCase.deprecated.successorId)
    : undefined;

  return (
    <MarketplacePageShell
      breadcrumb={`${text.sidebar.nav.breadcrumbUseCases} / ${useCase.title}`}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <Link
          href="/marketplace/use-cases"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {text.useCases.backToCatalog}
        </Link>

        {useCase.deprecated ? (
          <DeprecatedNotice
            deprecation={useCase.deprecated}
            successorHref={successor ? `/marketplace/use-cases/${successor.id}` : undefined}
            successorTitle={successor?.title}
          />
        ) : null}

        {/* ── Band 1: reading zone ──────────────────────────────────────── */}
        {/* `items-start` is load-bearing: without it the grid stretches the
            infobox to the hero's height and the Wikipedia effect is lost. */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_300px]">
          <div className="flex min-w-0 flex-col gap-6">
            {/* Stacked text hero — screenshots live in the media band below,
                never in a side rail. With no screenshots, a slim decorative
                illustration banner (clearly art, not a fake screenshot slot)
                gives the page its face. */}
            <section className="overflow-hidden rounded-xl border bg-card">
              {useCase.images.length === 0 ? (
                <UseCaseIllustration
                  categories={useCase.categories}
                  className="h-24 border-b lg:h-28"
                />
              ) : null}
              <div className="flex flex-col gap-4 p-6 lg:p-8">
                {useCase.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {useCase.categories.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                ) : null}
                {/* Badge always directly below the title — inline placement
                    made its position depend on whether the title wraps. */}
                <div className="flex flex-col items-start gap-2">
                  <h1 className="text-3xl font-bold text-foreground lg:text-4xl">
                    {useCase.title}
                  </h1>
                  <TierBadge tier={useCase.curationTier} />
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">{useCase.summary}</p>

                {/* The install action stays in the hero, not in the rail: the
                    rail collapses below `lg`, and the primary CTA must not
                    land at the bottom of a phone screen. */}
                <div className="mt-1 flex w-full flex-col items-start gap-1.5">
                  <InstallUseCaseButton useCase={useCase} />
                  <p className="text-xs text-muted-foreground">
                    {text.useCases.installDescription}
                  </p>
                </div>
              </div>
            </section>

            <UseCaseGallery images={useCase.images} title={useCase.title} />

            {useCase.demoData ? <DemoDataHighlight demoData={useCase.demoData} /> : null}

            <Section title={text.useCases.aboutHeading}>
              <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
                {useCase.description}
              </p>
            </Section>

            {/* Wirkung VOR den Oberflächen (Ewa, 2026-09-23): erst wofür das
                gut ist, dann womit man es bedient. Beide in der Hauptspalte
                statt über die volle Breite, damit neben dem Steckbrief keine
                leere Fläche stehen bleibt (Ewa, 2026-09-23). */}
            <LogicModel useCase={useCase} />
          </div>

          {/* Sticky, uncapped, no inner scrollbar.
              The rail (~1030px) IS taller than a 768px viewport, but that is
              only a problem when its containing block ends with it. Here the
              grid is ~2000px tall because of the reading column, so once the
              grid's bottom is reached the rail is pushed up and its lower end
              comes into view — measured: the last field becomes fully visible
              at scrollTop 2040. Capping it and scrolling it internally was
              therefore solving a problem that does not exist, at the cost of a
              nested scrollbar. */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-2">
            <UseCaseInfobox useCase={useCase} />
            {/* Ausgeblendet (Ewa, 2026-09-23). Der Fit-Check bleibt im Code:
                `checkFit` ist getestet, nur das Instanzprofil ist noch eine
                Konstante. Beim Wiedereinschalten die Voraussetzungs-Zeilen in
                „Technische Eckdaten" wieder entfernen — sonst stehen sie
                doppelt da, einmal geprüft und einmal blank. */}
            {/* <FitCheck useCase={useCase} /> */}
          </div>
        </div>

        {/* Über die volle Breite (Ewa, 2026-09-23): die Kacheln brauchen Platz,
            und ihre Zahl ist je Anwendungsfall verschieden — das Raster richtet
            sich danach (siehe `surfaceGridClass`). */}
        <Section
          title="Was Sie damit bekommen"
          lead="Oberflächen, die Menschen öffnen — Fachamt, Rat oder Öffentlichkeit."
        >
          <EndUserSurfaces surfaces={useCase.endUserSurfaces} />
        </Section>

        {/* ── Band 3: technical zone, visually separate for IT and data roles ─ */}
        <Section title={text.useCases.technicalHeading} tone="muted">
          <div className="flex flex-col gap-4">
            <ProvidedSurfaces
              surfaces={useCase.provides}
              title="Schnittstellen dieses Anwendungsfalls"
            />

            <IncludedArtifactsSpec
              title={text.useCases.includedArtifacts}
              artifacts={useCase.includedArtifacts}
              urn={useCase.modelForge.datasetId}
            />

            <TechnicalFacts useCase={useCase} />
          </div>
        </Section>
      </div>
    </MarketplacePageShell>
  );
}
