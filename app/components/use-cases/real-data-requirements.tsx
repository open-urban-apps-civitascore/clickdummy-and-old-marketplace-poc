import { Plug } from "lucide-react";

import { type UseCase } from "@/types/use-cases";

type Requirement = UseCase["includedArtifacts"][number]["requires"][number];

/**
 * „Für echte Daten zusätzlich nötig" — what a use case needs from the real
 * world before it shows productive data: sensors, hardware, existing
 * registers. None of it is in the package; the install creates the artifacts,
 * and they stay empty until these exist (Ewa, 2026-08-07).
 *
 * Sits directly under the demo-data panel (feedback 2026-10-03): the two
 * answer one question — what runs right away, and what you have to bring for
 * real operation. It used to sit per artifact in the technical zone, where the
 * people who plan the procurement do not read. Without demo data the block
 * stands alone in the same place.
 *
 * Amber, like every "was müssen Sie noch beisteuern?" in the app (§4.1 of
 * `docs/communication-design-system.md`). Kept light on purpose: needing
 * sensors is a plan item, not a defect.
 */
export function RealDataRequirements({ requirements }: { requirements: Requirement[] }) {
  if (requirements.length === 0) return null;

  return (
    <section className="rounded-lg border border-l-4 border-amber-200 border-l-amber-500 bg-amber-50/60 p-5 dark:border-amber-900/60 dark:border-l-amber-600 dark:bg-amber-950/25">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-900 dark:text-amber-200">
        <Plug aria-hidden className="size-4" />
        Für echte Daten zusätzlich nötig
      </h3>
      <ul className="mt-3 flex flex-col gap-2">
        {requirements.map((requirement) => (
          <li
            key={requirement.label}
            className="text-sm leading-relaxed text-amber-900/75 dark:text-amber-200/75"
          >
            <span className="font-medium text-amber-950 dark:text-amber-100">
              {requirement.label}
            </span>
            {requirement.note ? <> — {requirement.note}</> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The real-world needs of all artifacts, each once: the reader plans a
 * procurement, not a data model, so which artifact asked for it does not
 * matter — and two artifacts may well need the same register.
 */
export function collectRealDataRequirements(
  artifacts: UseCase["includedArtifacts"],
): Requirement[] {
  const seen = new Set<string>();
  return artifacts
    .flatMap((artifact) => artifact.requires)
    .filter((requirement) => {
      if (seen.has(requirement.label)) return false;
      seen.add(requirement.label);
      return true;
    });
}
