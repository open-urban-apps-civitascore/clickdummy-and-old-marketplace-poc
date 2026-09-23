import { dependentUseCases } from "@/lib/data-structures";
import type { FacetDef } from "@/lib/catalog-facets";
import { addonCurationTier, type Addon } from "@/types/addons";
import {
  CURATION_TIER_LABELS,
  INSTALL_PATH_LABELS,
  type CurationTier,
  type InstallPath,
} from "@/types/curation-tier";
import {
  COST_BAND_LABELS,
  COST_BAND_ORDER,
  EFFORT_BAND_LABELS,
  EFFORT_BAND_ORDER,
  USE_CASE_STATUS_LABELS,
  USE_CASE_STATUS_ORDER,
  type CostBand,
  type EffortBand,
  type UseCaseStatus,
} from "@/types/implementation";
import type { DataStructureEntry } from "@/types/repo-list";
import type { UseCase } from "@/types/use-cases";

/**
 * The facet sets per catalog.
 *
 * MODE PER FACET (audited 2026-09-23). The mode follows the data, not taste:
 *   - categorical, an entry may carry several, people ask "A or B"  → `multi`
 *     Themengebiet, Siegel, Status, Herausgeber, CivitasCore-Version
 *   - an ordered scale where a choice means "at most this"          → `ordinal`
 *     Aufbaukosten, laufende Kosten, Ressourceneinsatz — the labels already
 *     say „unter 10.000 €", so an entry under 1.000 € has to match
 *   - a yes/no property with a single option                        → `toggle`
 *     Kooperationsbedarf
 *
 * Kept in `lib/` rather than next to the components so they stay unit-testable
 * — the test glob is `lib/**​/*.test.ts`.
 *
 * A facet's `id` doubles as its URL parameter, which is what keeps the
 * existing `?kategorie=` deep links working without a translation table.
 */

const TIER_ORDER = ["experimental", "community", "verified"] as const;

export const USE_CASE_FACETS: FacetDef<UseCase>[] = [
  {
    id: "kategorie",
    label: "Themengebiet",
    mode: "multi",
    valuesOf: (useCase) => useCase.categories,
  },
  {
    id: "siegel",
    label: "Siegel",
    mode: "multi",
    valuesOf: (useCase) => [useCase.curationTier],
    options: TIER_ORDER,
    labelOf: (value) => CURATION_TIER_LABELS[value as CurationTier],
  },
  {
    id: "status",
    label: "Use Case Status",
    mode: "multi",
    valuesOf: (useCase) =>
      useCase.implementation?.status ? [useCase.implementation.status] : [],
    options: USE_CASE_STATUS_ORDER,
    labelOf: (value) => USE_CASE_STATUS_LABELS[value as UseCaseStatus],
  },
  {
    id: "aufbaukosten",
    label: "Aufbaukosten",
    mode: "ordinal",
    valuesOf: (useCase) => {
      const band = useCase.implementation?.resources?.setupCost;
      return band ? [band] : [];
    },
    options: COST_BAND_ORDER,
    labelOf: (value) => COST_BAND_LABELS[value as CostBand],
    group: "more",
  },
  {
    id: "betriebskosten",
    label: "Laufende Kosten (jährlich)",
    mode: "ordinal",
    valuesOf: (useCase) => {
      const band = useCase.implementation?.resources?.runningCost;
      return band ? [band] : [];
    },
    options: COST_BAND_ORDER,
    labelOf: (value) => COST_BAND_LABELS[value as CostBand],
    group: "more",
  },
  {
    id: "aufwand",
    label: "Ressourceneinsatz",
    mode: "ordinal",
    valuesOf: (useCase) => {
      const band = useCase.implementation?.resources?.effortBand;
      return band ? [band] : [];
    },
    options: EFFORT_BAND_ORDER,
    labelOf: (value) => EFFORT_BAND_LABELS[value as EffortBand],
    group: "more",
  },
  {
    id: "herausgeber",
    label: "Herausgeber",
    mode: "multi",
    valuesOf: (useCase) => [useCase.publisher],
    group: "more",
  },
  {
    id: "installation",
    label: "Installationsweg",
    mode: "multi",
    valuesOf: (useCase) => [useCase.installPath],
    labelOf: (value) => INSTALL_PATH_LABELS[value as InstallPath],
    group: "more",
  },
  {
    id: "core",
    label: "CivitasCore-Version",
    mode: "multi",
    valuesOf: (useCase) => useCase.compatibility,
    labelOf: (value) => `Core ${value}`,
    group: "more",
  },
  {
    id: "kooperation",
    label: "Kooperationsbedarf",
    mode: "toggle",
    valuesOf: (useCase) => (useCase.implementation?.collaboration?.wanted ? ["ja"] : []),
    options: ["ja"] as const,
    labelOf: () => "Sucht Mitstreiter",
    group: "more",
  },
];

export const ADDON_FACETS: FacetDef<Addon>[] = [
  {
    id: "kategorie",
    label: "Kategorie",
    mode: "multi",
    valuesOf: (addon) => addon.categories,
  },
  {
    id: "siegel",
    label: "Siegel",
    mode: "multi",
    valuesOf: (addon) => [addonCurationTier(addon)],
    options: TIER_ORDER,
    labelOf: (value) => CURATION_TIER_LABELS[value as CurationTier],
  },
  {
    id: "core",
    label: "CivitasCore-Version",
    mode: "multi",
    valuesOf: (addon) => addon.compatibility.map((entry) => entry.coreVersion),
    labelOf: (value) => `Core ${value}`,
    group: "more",
  },
  {
    id: "herausgeber",
    label: "Herausgeber",
    mode: "multi",
    valuesOf: (addon) => [addon.author],
    group: "more",
  },
];

/**
 * A factory, not a constant: "in welchem Anwendungsfall genutzt" can only be
 * answered against the use-case list, and that reuse relation is derived
 * rather than stored (see `lib/data-structures.ts`).
 */
export function dataStructureFacets(useCases: UseCase[]): FacetDef<DataStructureEntry>[] {
  return [
    {
      id: "domaene",
      label: "Domäne",
      mode: "multi",
      valuesOf: (entry) => (entry.domain ? [entry.domain] : []),
    },
    {
      id: "herausgeber",
      label: "Herausgeber",
      mode: "multi",
      valuesOf: (entry) => [entry.maintainer],
    },
    {
      id: "anwendungsfall",
      label: "Genutzt in Anwendungsfall",
      mode: "multi",
      valuesOf: (entry) => dependentUseCases(entry.id, useCases).map((useCase) => useCase.title),
      group: "more",
    },
  ];
}
