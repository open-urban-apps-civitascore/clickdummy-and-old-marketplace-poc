import { parseUrn } from "@/lib/urn";
import type { DataStructureEntry } from "@/types/repo-list";
import type { UseCase } from "@/types/use-cases";

/**
 * Which use cases build on a given data structure — the reuse argument, and
 * the whole point of listing data structures separately.
 *
 * DERIVED, never stored. The placeholder this replaces carried a hand-written
 * `usedByUseCases: 2`, which is stale the moment a use case is added or drops
 * an artifact. Counting the catalog instead cannot go out of date.
 *
 * Matching strips the version: a catalog row may carry a logical URN while a
 * bundle's artifact carries `…:TreeRecord:1.0.0`. `parseUrn` already reports
 * whether a URN is versioned, so the comparison is exact rather than a
 * `startsWith` that would also match `TreeRecordArchive`.
 */
export function logicalUrn(urn: string): string {
  const parsed = parseUrn(urn);
  if (!parsed.isVersioned) return urn;
  const parts = urn.split(":");
  return parts.slice(0, -1).join(":");
}

// Named `dependentUseCases`, not `useCasesUsing`: a helper whose name starts
// with "use" is treated as a React hook by the lint rules.
export function dependentUseCases(dataStructureId: string, useCases: UseCase[]): UseCase[] {
  const target = logicalUrn(dataStructureId);
  return useCases.filter((useCase) =>
    useCase.includedArtifacts.some(
      (artifact) => artifact.kind === "datastructure" && logicalUrn(artifact.id) === target,
    ),
  );
}

export function countDependentUseCases(dataStructureId: string, useCases: UseCase[]): number {
  return dependentUseCases(dataStructureId, useCases).length;
}

/** Display label for a row: the declared domain, else the first keyword. */
export function dataStructureDomain(entry: DataStructureEntry): string | undefined {
  return entry.domain ?? entry.keywords[0];
}
