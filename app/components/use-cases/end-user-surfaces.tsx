import { ArrowUpRight, Blocks, PlayCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SurfacePreview } from "@/components/use-cases/surface-preview";
import { END_USER_SURFACE_KIND_LABELS, type EndUserSurface } from "@/types/use-cases";

/**
 * The destinations a person opens — deliberately ABOVE the interface list and
 * with more visual weight, because "a map of the tree stock" is what a use case
 * is for, while "a WFS endpoint" is how it is delivered. An installation whose
 * value the reader has to infer from protocol names has buried its own point.
 *
 * Two flavours, like ProvidedSurfaces:
 *   - catalog detail (`datasetId` absent) reads as a promise
 *   - an installation resolves the URLs into links
 *
 * INCOMPLETE, and labelled as such per card: nothing here is created by an
 * install today. A dashboard needs its add-on installed and a board built; the
 * map needs a layer configured. What the bundle guarantees is the DATA the
 * surface consumes — never the surface itself.
 */

function resolveUrl(surface: EndUserSurface, datasetId?: string): string | undefined {
  if (!surface.urlTemplate) return undefined;
  if (!surface.urlTemplate.includes("{datasetId}")) return surface.urlTemplate;
  if (!datasetId) return undefined;
  return surface.urlTemplate.replace("{datasetId}", datasetId);
}

export function EndUserSurfaces({
  surfaces,
  datasetId,
  isDemoData = false,
  title,
}: {
  surfaces: EndUserSurface[];
  datasetId?: string;
  isDemoData?: boolean;
  /** Only when this renders inside its own card; the detail page uses a Section. */
  title?: string;
}) {
  if (surfaces.length === 0) return null;

  return (
    <section>
      {/* Heading and lead belong to the enclosing `Section` (E2) on the detail
          page; an installation view passes `title` because it renders this
          inside a card of its own. */}
      {title || isDemoData ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {title ? <h3 className="text-sm font-semibold text-foreground">{title}</h3> : <span />}
          {isDemoData ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
              <PlayCircle className="size-3.5" />
              Läuft auf Demo-Daten
            </span>
          ) : null}
        </div>
      ) : null}

      <ul className={`grid gap-4 ${surfaceGridClass(surfaces.length)}`}>
        {surfaces.map((surface) => {
          const url = resolveUrl(surface, datasetId);
          const card = (
            <article className="flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-shadow group-hover:shadow-md">
              <SurfacePreview kind={surface.kind} />

              <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  {/* Deutsche Komposita („Verkehrsaufkommen") sind breiter als
                      eine schmale Kachel; ohne Trennung schieben sie sich unter
                      das Badge. `lang="de"` steht im Root-Layout, also trennt
                      `hyphens-auto` korrekt. */}
                  <h3 className="min-w-0 hyphens-auto break-words text-sm font-semibold leading-tight text-foreground">
                    {surface.label}
                  </h3>
                  <Badge variant="outline" className="shrink-0 text-[11px]">
                    {END_USER_SURFACE_KIND_LABELS[surface.kind]}
                  </Badge>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">{surface.summary}</p>

                <div className="mt-auto flex flex-col gap-2 pt-2">
                  {surface.via ? (
                    <p className="font-mono text-[11px] text-muted-foreground">über {surface.via}</p>
                  ) : null}

                  {url ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                      Öffnen
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  ) : surface.requiresAddon ? (
                    // The honest dependency: this surface needs an add-on that is
                    // not part of the bundle. Naming it beats a dead link.
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Blocks className="size-3.5 shrink-0" />
                      Benötigt Add-on „{surface.requiresAddon}&ldquo;
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {datasetId
                        ? "Wird bereitgestellt, sobald die Oberfläche eingerichtet ist."
                        : "Steht nach der Installation zur Verfügung."}
                    </span>
                  )}
                </div>
              </div>
            </article>
          );

          return (
            <li key={`${surface.kind}-${surface.label}`} className="group">
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {card}
                </a>
              ) : (
                card
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Column grid chosen by how many surfaces there are.
 *
 * The band runs full width, but the number of surfaces differs per use case
 * (Ewa, 2026-09-23) — a fixed 3-column grid would leave a third empty with two
 * entries, and strand a single straggler on a second row with four.
 *
 * The classes are deliberately written out as complete literals: Tailwind only
 * emits what it can find in the source, so a composed `grid-cols-${n}` would
 * never reach the build.
 */
function surfaceGridClass(count: number): string {
  switch (count) {
    case 1:
      // Eine Kachel allein soll nicht über die ganze Breite gezogen werden.
      return "max-w-sm";
    case 2:
      return "sm:grid-cols-2";
    case 3:
      return "sm:grid-cols-2 lg:grid-cols-3";
    case 4:
      return "sm:grid-cols-2 lg:grid-cols-4";
    default:
      // Ab fünf lieber drei bzw. vier je Zeile als immer schmalere Kacheln.
      return "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  }
}
