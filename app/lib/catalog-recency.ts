/**
 * "Zuletzt hinzugefügt" — sorting and formatting for the per-entry `addedAt`
 * date that use cases, add-ons and data structures carry.
 */

export type DatedEntry = { addedAt?: string };

/**
 * Newest first. `addedAt` is an ISO `YYYY-MM-DD`, which sorts lexicographically
 * exactly as it sorts chronologically — no `Date` parsing needed. Entries
 * without a date fall back to `""` and therefore sort last, which is the
 * intended reading: unknown is not "very old", it just cannot claim a place.
 */
export const byAddedAtDesc = (a: DatedEntry, b: DatedEntry): number =>
  (b.addedAt ?? "").localeCompare(a.addedAt ?? "");

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
