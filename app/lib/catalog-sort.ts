import { byDateDesc, type DatedEntry } from "@/lib/catalog-recency";

/** One way to order a catalog — not a facet, see §3 of the design system. */
export interface CatalogSort<T> {
  /** Stable key. */
  id: string;
  /** German label, shown in the button and the list. */
  label: string;
  compare: (a: T, b: T) => number;
}

/**
 * All newest first; the first is the default. Entries without the date sort
 * last in catalog order (`sort` is stable). Groups sort among use cases by the same dates.
 */
export const USE_CASE_SORTS: CatalogSort<DatedEntry>[] = [
  { id: "eintrag", label: "Eintrag aktualisiert", compare: byDateDesc("updatedAt") },
  { id: "software", label: "Letztes Software-Update", compare: byDateDesc("softwareUpdatedAt") },
  { id: "neu", label: "Neu im Katalog", compare: byDateDesc("addedAt") },
];

/** The sort with this id, or the default when the id is unknown. */
export function findSort<T>(sorts: CatalogSort<T>[], id: string): CatalogSort<T> {
  return sorts.find((sort) => sort.id === id) ?? sorts[0]!;
}
