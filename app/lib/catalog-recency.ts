/**
 * Recency — sorting and formatting for the per-entry catalog dates:
 * `addedAt` ("Zuletzt hinzugefügt", carried by use cases, add-ons and data
 * structures) and, on use cases, `updatedAt` and `softwareUpdatedAt`.
 */

export type DatedEntry = { addedAt?: string; updatedAt?: string; softwareUpdatedAt?: string };

/**
 * Newest first by one date field. The dates are ISO `YYYY-MM-DD`, which sorts
 * lexicographically exactly as it sorts chronologically — no `Date` parsing
 * needed. Entries without the date fall back to `""` and therefore sort last,
 * which is the intended reading: unknown is not "very old", it just cannot
 * claim a place.
 */
export const byDateDesc =
  (field: keyof DatedEntry) =>
  (a: DatedEntry, b: DatedEntry): number =>
    (b[field] ?? "").localeCompare(a[field] ?? "");

export const byAddedAtDesc = byDateDesc("addedAt");

/**
 * German medium date, or `undefined` when nothing is on record.
 *
 * The `T00:00:00` matters: `new Date("2026-08-14")` is parsed as UTC midnight,
 * which renders as the 13th anywhere west of Greenwich. Appending a local time
 * makes the date the author wrote the date the reader sees.
 */
export function formatCatalogDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(parsed);
}
