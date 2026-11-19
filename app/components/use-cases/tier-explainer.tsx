import { Check } from "lucide-react";

import { Field } from "@/components/ui/layout";
import { TierBadge } from "@/components/use-cases/use-case-status";
import {
  CURATION_TIER_CRITERIA,
  CURATION_TIER_HINTS,
  CURATION_TIER_LABELS,
  type CurationTier,
} from "@/types/curation-tier";

/**
 * The curation badge as a field labelled „Siegel“, its criteria behind the label's
 * „?“ - like every other explained field. Used on both detail pages, so the two
 * cannot drift apart on the one graded claim the catalog makes.
 *
 * `showRevocable`: a use-case listing says the tier can be withdrawn.
 */
export function TierExplainer({
  tier,
  showRevocable = false,
}: {
  tier: CurationTier;
  showRevocable?: boolean;
}) {
  return (
    <Field
      label="Siegel"
      explainedValue={CURATION_TIER_LABELS[tier]}
      explanation={
        <>
          <p className="text-muted-foreground">{CURATION_TIER_HINTS[tier]}</p>
          <ul className="mt-2 flex flex-col gap-1">
            {CURATION_TIER_CRITERIA[tier].map((criterion) => (
              <li key={criterion} className="flex items-start gap-1.5">
                <Check aria-hidden className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
                {criterion}
              </li>
            ))}
          </ul>
          {showRevocable ? (
            <p className="mt-2 text-muted-foreground">
              Vergeben von der Kuratierung der Community - und bei Verstößen entziehbar.
            </p>
          ) : null}
        </>
      }
    >
      <TierBadge tier={tier} />
    </Field>
  );
}
