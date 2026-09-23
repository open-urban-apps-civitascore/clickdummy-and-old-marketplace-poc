import { Check } from "lucide-react";

import { Disclosure } from "@/components/ui/disclosure";
import { TierBadge } from "@/components/use-cases/use-case-status";
import {
  CURATION_TIER_CRITERIA,
  CURATION_TIER_HINTS,
  type CurationTier,
} from "@/types/curation-tier";

/**
 * The curation badge plus its published criteria — the one graded claim the
 * catalog makes, with the reasoning one click away.
 *
 * Extracted 2026-09-23: this block was duplicated verbatim in the use-case
 * Steckbrief and in `TrustPanel` (the add-on detail page), so the two could
 * drift apart while stating the same thing. The criteria are what make the
 * badge auditable for the people who sign off, so they must not.
 *
 * `showRevocable` is the one real difference: a use-case listing says the tier
 * can be withdrawn, an add-on listing did not.
 */
export function TierExplainer({
  tier,
  showRevocable = false,
}: {
  tier: CurationTier;
  showRevocable?: boolean;
}) {
  return (
    <div>
      <TierBadge tier={tier} />
      <Disclosure className="mt-2" summary="Was bedeutet dieses Siegel?">
        <div className="rounded-md bg-muted/50 p-3 text-xs">
          <p className="text-muted-foreground">{CURATION_TIER_HINTS[tier]}</p>
          <ul className="mt-2 flex flex-col gap-1">
            {CURATION_TIER_CRITERIA[tier].map((criterion) => (
              <li key={criterion} className="flex items-start gap-1.5 text-foreground">
                <Check aria-hidden className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
                {criterion}
              </li>
            ))}
          </ul>
          {showRevocable ? (
            <p className="mt-2 text-muted-foreground">
              Vergeben von der Kuratierung der Community — und bei Verstößen entziehbar.
            </p>
          ) : null}
        </div>
      </Disclosure>
    </div>
  );
}
