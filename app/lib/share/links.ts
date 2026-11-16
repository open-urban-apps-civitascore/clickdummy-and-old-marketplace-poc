import type { EntryLink } from "@/types/use-cases";

export interface LinkDraft {
  title: string;
  url: string;
  description: string;
}

export const MAX_LINKS = 8;

export const emptyLink = (): LinkDraft => ({ title: "", url: "", description: "" });

const isBlank = (link: LinkDraft) => !link.title.trim() && !link.url.trim() && !link.description.trim();

const isHttps = (value: string) => URL.canParse(value) && new URL(value).protocol === "https:" && new URL(value).hostname.includes(".");

/** The first link that stops the preview; empty rows are ignored. */
export function linksProblem(links: readonly LinkDraft[]): string | undefined {
  for (const [index, link] of links.entries()) {
    if (isBlank(link)) continue;
    const name = `Link ${index + 1}`;
    if (!link.title.trim()) return `${name}: bitte einen Titel.`;
    if (!isHttps(link.url.trim())) return `${name}: die Adresse braucht https, zum Beispiel https://musterstadt.example/projekt.`;
  }
  return undefined;
}

/** The links as the catalogue row carries them. */
export function cleanLinks(links: readonly LinkDraft[]): EntryLink[] {
  return links
    .filter((link) => !isBlank(link))
    .map((link) => ({
      title: link.title.trim(),
      url: link.url.trim(),
      ...(link.description.trim() ? { description: link.description.trim() } : {}),
    }));
}
