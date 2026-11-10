import Image from "next/image";
import { ExternalLink } from "lucide-react";

import { Section } from "@/components/ui/layout";
import { cn } from "@/lib/utils";
import { ADOPTER_STAGE_LABELS, type Adopter } from "@/types/use-cases";

/**
 * Nachnutzende — organisations that took a use case over. Always labelled as
 * reported („nach eigener Angabe"), not counted by the marketplace.
 */

export const adopterCountLabel = (count: number): string =>
  count === 1 ? "1 Organisation" : `${count} Organisationen`;

// „Stadt Beispielhausen" → „BE", not „SB": the prefix does not tell them apart.
const ADMIN_PREFIX =
  /^(Stadt|Gemeinde|Landkreis|Kreis|Markt|Hansestadt|Samtgemeinde|Verbandsgemeinde|Amt|Bezirk)\s+/i;

function monogram(name: string): string {
  const core = name.replace(ADMIN_PREFIX, "").trim() || name;
  const parts = core.split(/[\s-]+/).filter(Boolean);
  const letters = parts.length >= 2 ? parts[0]![0]! + parts[1]![0]! : core.slice(0, 2);
  return letters.toUpperCase();
}

const LOGO_SIZES = {
  sm: { box: "size-6 text-[10px]", px: 24 },
  md: { box: "size-10 text-xs", px: 40 },
  lg: { box: "size-14 text-base", px: 56 },
} as const;

/**
 * The logo, or a neutral monogram without one — colour means a trust grade or
 * a kind of thing here (§4 of the design system). Decorative: the name is next to it.
 */
export function AdopterLogo({
  adopter,
  size,
}: {
  adopter: Adopter;
  size: keyof typeof LOGO_SIZES;
}) {
  const { box, px } = LOGO_SIZES[size];

  if (adopter.logo) {
    return (
      <Image
        src={adopter.logo}
        alt=""
        width={px}
        height={px}
        // Logos come from arbitrary hosts; same reasoning as the gallery.
        unoptimized
        className={cn("shrink-0 rounded-md object-contain", box)}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-md bg-muted font-semibold text-muted-foreground",
        box,
      )}
    >
      {monogram(adopter.name)}
    </span>
  );
}

/** The „Auf einen Blick" row: count, then logo and name; long lists link to the section. */
export function AdopterSummary({ adopters, limit = 4 }: { adopters: Adopter[]; limit?: number }) {
  const shown = adopters.length > limit ? adopters.slice(0, limit - 1) : adopters;
  const rest = adopters.length - shown.length;

  return (
    <>
      <span className="block">{adopterCountLabel(adopters.length)}</span>
      <ul className="mt-1.5 flex flex-col gap-1.5 font-normal">
        {shown.map((adopter) => (
          <li key={adopter.name} className="flex items-center gap-2">
            <AdopterLogo adopter={adopter} size="sm" />
            <span className="min-w-0 break-words">{adopter.name}</span>
          </li>
        ))}
      </ul>
      {rest > 0 ? (
        <a
          href="#nachnutzer"
          className="mt-1.5 block text-xs font-normal text-primary underline-offset-2 hover:underline"
        >
          und {rest} weitere
        </a>
      ) : null}
    </>
  );
}

/** The full list. Nothing without adopters: „Auf einen Blick" already says so. */
export function AdoptersSection({ adopters }: { adopters: Adopter[] }) {
  if (adopters.length === 0) return null;

  const lead =
    adopters.length === 1
      ? "1 Organisation hat diesen Anwendungsfall übernommen - nach eigener Angabe."
      : `${adopters.length} Organisationen haben diesen Anwendungsfall übernommen - nach eigener Angabe.`;

  return (
    <Section id="nachnutzer" title="Wer diesen Anwendungsfall nachnutzt" lead={lead}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {adopters.map((adopter) => {
          const meta = [
            adopter.stage ? ADOPTER_STAGE_LABELS[adopter.stage] : undefined,
            adopter.since ? `seit ${adopter.since}` : undefined,
          ].filter(Boolean);

          return (
            // E4: an item inside a section — rounded-md, the innermost radius.
            <li
              key={adopter.name}
              className="flex items-center gap-3 rounded-md border bg-background p-4"
            >
              <AdopterLogo adopter={adopter} size="md" />
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-foreground">
                  {adopter.url ? (
                    <a
                      href={adopter.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 underline-offset-2 hover:underline"
                    >
                      {adopter.name}
                      <ExternalLink aria-hidden className="size-3 shrink-0" />
                    </a>
                  ) : (
                    adopter.name
                  )}
                </p>
                {meta.length > 0 ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">{meta.join(" · ")}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
