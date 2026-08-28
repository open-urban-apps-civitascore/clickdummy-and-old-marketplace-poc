import { ArrowUpRight, Blocks, Sparkles } from "lucide-react";

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
  title = "Was jetzt bereitsteht",
}: {
  surfaces: EndUserSurface[];
  datasetId?: string;
  isDemoData?: boolean;
  title?: string;
}) {
  if (surfaces.length === 0) return null;

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Oberflächen, die Menschen öffnen — Fachamt, Rat oder Öffentlichkeit.
          </p>
        </div>
        {isDemoData ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
            <Sparkles className="size-3.5" />
            Läuft auf Demo-Daten
          </span>
        ) : null}
      </div>

      <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {surfaces.map((surface) => {
          const url = resolveUrl(surface, datasetId);
          const card = (
            <article className="flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-shadow group-hover:shadow-md">
              <SurfacePreview kind={surface.kind} />

              <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="min-w-0 text-sm font-semibold leading-tight text-foreground">
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
