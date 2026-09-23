import { byAddedAtDesc } from "@/lib/catalog-recency";
import type { Addon } from "@/types/addons";
import type { DataStructureEntry } from "@/types/repo-list";
import type { UseCase } from "@/types/use-cases";

export type CatalogKind = "use-case" | "data-structure" | "addon";

export const CATALOG_KIND_LABELS: Record<CatalogKind, string> = {
  "use-case": "Anwendungsfall",
  "data-structure": "Datenstruktur",
  addon: "Add-on",
};

/** One row of "Zuletzt hinzugefügt", normalised across the three entry shapes. */
export interface CatalogHighlight {
  kind: CatalogKind;
  id: string;
  title: string;
  summary: string;
  href: string;
  /** Publisher / maintainer / author — whoever stands behind the entry. */
  meta: string;
  addedAt?: string;
}

export const CATALOG_KIND_PLURALS: Record<CatalogKind, string> = {
  "use-case": "Anwendungsfälle",
  "data-structure": "Datenstrukturen",
  addon: "Add-ons",
};

export const CATALOG_KIND_HREFS: Record<CatalogKind, string> = {
  "use-case": "/marketplace/use-cases",
  "data-structure": "/marketplace/datastructures",
  addon: "/marketplace/addons",
};

/** One column of "Zuletzt hinzugefügt": a section and its newest entries. */
export interface CatalogKindPreview {
  kind: CatalogKind;
  label: string;
  href: string;
  /** How many entries the section holds in total, not just the preview. */
  total: number;
  /** One line on what this section is — absorbed from the old nav tiles. */
  hint?: string;
  entries: CatalogHighlight[];
}

/**
 * The newest entries PER SECTION (Ewa, 2026-09-23).
 *
 * One mixed list showed that something had happened, but not where: a burst of
 * add-ons could bury the fact that no use case had arrived in months. Three
 * columns make each section accountable for its own freshness, and an empty
 * column says something true rather than being invisible.
 */
export function recentlyAddedByKind(
  input: { useCases: UseCase[]; dataStructures: DataStructureEntry[]; addons: Addon[] },
  perKind = 3,
): CatalogKindPreview[] {
  const all = recentlyAdded(input, Number.POSITIVE_INFINITY);

  return (["use-case", "data-structure", "addon"] as const).map((kind) => ({
    kind,
    label: CATALOG_KIND_PLURALS[kind],
    href: CATALOG_KIND_HREFS[kind],
    total: all.filter((entry) => entry.kind === kind).length,
    entries: all.filter((entry) => entry.kind === kind).slice(0, perKind),
  }));
}

/**
 * The newest entries across all three catalog sections, mixed into one list.
 * Kept as the normalisation layer `recentlyAddedByKind` groups.
 *
 * Entries without `addedAt` sort last but are never dropped — otherwise the
 * section stays empty until every row is dated, and a clickdummy that looks
 * unfinished defeats its own purpose.
 */
export function recentlyAdded(
  input: { useCases: UseCase[]; dataStructures: DataStructureEntry[]; addons: Addon[] },
  limit = 6,
): CatalogHighlight[] {
  const useCases: CatalogHighlight[] = input.useCases.map((useCase) => ({
    kind: "use-case",
    id: useCase.id,
    title: useCase.title,
    summary: useCase.summary,
    href: `/marketplace/use-cases/${useCase.id}`,
    meta: useCase.publisher,
    addedAt: useCase.addedAt,
  }));

  const addons: CatalogHighlight[] = input.addons.map((addon) => ({
    kind: "addon",
    id: addon.id,
    title: addon.name,
    summary: addon.description,
    href: `/marketplace/addons/${addon.id}`,
    meta: addon.author,
    addedAt: addon.addedAt,
  }));

  // Data structures have no detail route yet, so the link lands on the card in
  // the list (the card carries the URN as its anchor id).
  const dataStructures: CatalogHighlight[] = input.dataStructures.map((entry) => ({
    kind: "data-structure",
    id: entry.id,
    title: entry.displayName,
    summary: entry.description,
    href: `/marketplace/datastructures#${entry.id}`,
    meta: entry.maintainer,
    addedAt: entry.addedAt,
  }));

  return [...useCases, ...dataStructures, ...addons].sort(byAddedAtDesc).slice(0, limit);
}
