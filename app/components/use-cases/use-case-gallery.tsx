"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { UseCaseImage } from "@/types/use-cases";

/**
 * Screenshot band under the hero: the image alone. Renders nothing without
 * screenshots; the hero then carries a decorative illustration banner instead.
 * Shared by use-case and add-on detail pages (both submit the same screenshot
 * shape).
 *
 * There used to be an explanation box under the image — a caption plus
 * bullet points per screenshot (Ewa, 2026-08-07). It went on 2026-10-03 on
 * both pages: on the use-case page "Was dieser Anwendungsfall löst" takes its
 * place, and the submission form no longer asks for bullet points. The
 * caption survives as the image's alt text.
 *
 * Framing is applied uniformly by the UI; uploads should be raw 16:9 UI
 * screenshots without browser chrome (per app-store submission practice).
 */
export function UseCaseGallery({ images, title }: { images: UseCaseImage[]; title: string }) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  const safeIndex = Math.min(index, images.length - 1);
  const current = images[safeIndex];

  return (
    <section aria-label="Screenshots" className="flex flex-col gap-4">
      <figure className="flex flex-col gap-2">
        <div className="relative overflow-hidden rounded-lg border bg-background">
          {/* Catalog screenshots come from arbitrary hosts; the mock skips the
              image optimizer instead of maintaining remotePatterns. */}
          <Image
            key={current.url}
            src={current.url}
            alt={current.caption ?? `${title} — Screenshot ${safeIndex + 1}`}
            width={1600}
            height={900}
            unoptimized
            // The first screenshot sits above the fold and is the page's LCP
            // element; the later ones only load once someone pages to them.
            priority={safeIndex === 0}
            className="aspect-video w-full object-cover object-top"
          />

          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Vorheriges Bild"
                onClick={() => setIndex((safeIndex - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border bg-background/85 text-foreground shadow-sm transition-colors hover:bg-background"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Nächstes Bild"
                onClick={() => setIndex((safeIndex + 1) % images.length)}
                className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border bg-background/85 text-foreground shadow-sm transition-colors hover:bg-background"
              >
                <ChevronRight className="size-5" />
              </button>
              <div
                aria-hidden
                className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border bg-background/85 px-2.5 py-1.5 shadow-sm"
              >
                {images.map((image, position) => (
                  <span
                    key={image.url}
                    className={cn(
                      "size-2 rounded-full",
                      position === safeIndex ? "bg-primary" : "bg-muted-foreground/35",
                    )}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>

        {/* The visible "Bild 2 von 3" lived in the explanation box. Screen
            readers still get the position and the caption when paging. */}
        {images.length > 1 ? (
          <p aria-live="polite" className="sr-only">
            Bild {safeIndex + 1} von {images.length}
            {current.caption ? `: ${current.caption}` : ""}
          </p>
        ) : null}
      </figure>
    </section>
  );
}
