import { dependentUseCases } from "@/lib/data-structures";
import { searchText } from "@/lib/catalog-search";
import type { Addon } from "@/types/addons";
import { CURATION_TIER_LABELS, INSTALL_PATH_LABELS } from "@/types/curation-tier";
import {
  COST_BAND_LABELS,
  EFFORT_BAND_LABELS,
  USE_CASE_STATUS_LABELS,
} from "@/types/implementation";
import type { DataStructureEntry } from "@/types/repo-list";
import type { UseCase } from "@/types/use-cases";

/**
 * The searchable text of a catalog entry — "alle Eigenschaften", enumerated.
 *
 * Enumerated rather than `JSON.stringify(entry)` on purpose. A stringified
 * entry drags in commit SHAs, URL templates, image URLs and placeholder hex
 * colours, so a query of "2" or "http" matches every row in the catalog. What
 * belongs here is what a reader would recognise as a property of the thing.
 *
 * Note what is deliberately EXCLUDED: every URL, `deploymentRef.ref`, and the
 * `urlTemplate`s. URNs are included — people do paste them, and a long
 * `urn:core:…` string rarely collides with a German word.
 */
export function useCaseSearchText(useCase: UseCase): string {
  const implementation = useCase.implementation;
  const resources = implementation?.resources;

  return searchText(
    useCase.title,
    useCase.summary,
    useCase.description,
    useCase.publisher,
    useCase.categories.join(" "),
    CURATION_TIER_LABELS[useCase.curationTier],
    INSTALL_PATH_LABELS[useCase.installPath],
    useCase.compatibility.map((version) => `Core ${version}`).join(" "),
    useCase.modelForge.datasetId,

    useCase.includedArtifacts
      .map((artifact) =>
        searchText(
          artifact.title,
          artifact.id,
          artifact.description,
          artifact.requires.map((requirement) => searchText(requirement.label, requirement.note)).join(" "),
        ),
      )
      .join(" "),
    useCase.endUserSurfaces
      .map((surface) => searchText(surface.label, surface.summary, surface.via, surface.requiresAddon))
      .join(" "),
    useCase.provides
      .map((surface) => searchText(surface.label, surface.standard, surface.note))
      .join(" "),
    useCase.roles.map((role) => searchText(role.label, role.description)).join(" "),
    useCase.requirements?.components.join(" "),
    useCase.requirements?.connectors.join(" "),
    useCase.requiredCapabilities.map((capability) => capability.name).join(" "),

    useCase.trust?.maintainer?.name,
    useCase.trust?.contactPerson?.name,
    useCase.trust?.contactPerson?.role,
    useCase.trust?.productionReferences.map((reference) => reference.municipality).join(" "),
    useCase.trust?.curatedBy,
    useCase.trust?.license,

    useCase.demoData?.contains,
    useCase.demoData?.note,
    useCase.deprecated?.reason,

    implementation?.operator,
    implementation?.status ? USE_CASE_STATUS_LABELS[implementation.status] : undefined,
    implementation?.parties?.stakeholders?.join(" "),
    implementation?.parties?.serviceProviders?.join(" "),
    implementation?.stack?.join(" "),
    resources?.cost,
    resources?.effort,
    resources?.funding,
    resources?.note,
    resources?.setupCost ? COST_BAND_LABELS[resources.setupCost] : undefined,
    resources?.runningCost ? COST_BAND_LABELS[resources.runningCost] : undefined,
    resources?.effortBand ? EFFORT_BAND_LABELS[resources.effortBand] : undefined,
    implementation?.logicModel?.input,
    implementation?.logicModel?.output,
    implementation?.logicModel?.outcome,
    implementation?.logicModel?.impact,
    implementation?.collaboration?.seeking,
    implementation?.reference?.source,
  );
}

export function addonSearchText(addon: Addon): string {
  return searchText(
    addon.name,
    addon.description,
    addon.author,
    addon.categories.join(" "),
    addon.curationTier ? CURATION_TIER_LABELS[addon.curationTier] : undefined,
    addon.compatibility.map((entry) => `Core ${entry.coreVersion}`).join(" "),
    addon.requiredCapabilities?.join(" "),
    addon.licenses?.addon,
    addon.licenses?.tool,
    addon.repository,
    addon.trust?.maintainer?.name,
    addon.trust?.contactPerson?.name,
    addon.deprecated?.reason,
  );
}

export function dataStructureSearchText(
  entry: DataStructureEntry,
  useCases: UseCase[],
): string {
  return searchText(
    entry.displayName,
    entry.id,
    entry.description,
    entry.maintainer,
    entry.domain,
    entry.keywords.join(" "),
    entry.license,
    entry.version,
    // Finding a structure by the use case that builds on it is the whole
    // reason these are listed separately.
    dependentUseCases(entry.id, useCases)
      .map((useCase) => useCase.title)
      .join(" "),
  );
}
