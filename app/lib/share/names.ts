const UMLAUTS: Record<string, string> = { ä: "ae", ö: "oe", ü: "ue", ß: "ss" };

function plain(title: string): string {
  const lowered = title.trim().toLowerCase().replace(/[äöüß]/g, (c) => UMLAUTS[c] ?? c);
  return lowered.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Lower-case letters and digits only; empty when the title has none. */
export function compactLetters(title: string): string {
  return plain(title).replace(/[^a-z0-9]/g, "");
}

/** „Radverkehrszählung Innenstadt“ → `radverkehrszaehlung-innenstadt`. */
export function slugify(title: string): string {
  return plain(title).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "");
}
