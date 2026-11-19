import { matchesFacet, type CatalogFilterState, type FacetDef } from "@/lib/catalog-facets";
import { matchesQuery, foldGerman, searchText } from "@/lib/catalog-search";
import type { DatedEntry } from "@/lib/catalog-recency";
import { cleanLinks, linksProblem, type LinkDraft } from "@/lib/share/links";
import type { GroupMember, Organisation, UseCaseGroup } from "@/types/repo-list";
import type { UseCase } from "@/types/use-cases";

/** The UI's word for a group, in one place so a label test changes one object. */
export const GROUP_TEXT = {
  one: "Projekt",
  many: "Projekte",
  partOf: "Teil des Projekts",
  partOfMany: "Teil der Projekte",
  explain: "Ein Projekt fasst Anwendungsfälle zusammen, die zusammengehören. Installiert wird jeder Anwendungsfall einzeln.",
} as const;

/** „A, B und C“. */
export const joinGerman = (items: readonly string[]): string =>
  items.length < 2 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} und ${items.at(-1)}`;

export const countUseCases = (count: number): string => `${count} ${count === 1 ? "Anwendungsfall" : "Anwendungsfälle"}`;

/** Without a pinned package an entry is only described, never installed. */
export const isInstallable = (useCase: UseCase): boolean => Boolean(useCase.deploymentRef);

export interface ResolvedMember {
  ref: GroupMember;
  /** Missing when the entry has left the catalogue. */
  useCase?: UseCase;
}

export function resolveMembers(group: UseCaseGroup, useCases: readonly UseCase[]): ResolvedMember[] {
  return group.members.map((ref) => ({ ref, useCase: useCases.find((useCase) => useCase.id === ref.id) }));
}

export const listedMembers = (members: readonly ResolvedMember[]): UseCase[] =>
  members.flatMap((member) => (member.useCase ? [member.useCase] : []));

/** A group as a list shows it: with its members still in the catalogue. */
export interface GroupListing {
  group: UseCaseGroup;
  members: UseCase[];
}

export const groupListings = (groups: readonly UseCaseGroup[], useCases: readonly UseCase[]): GroupListing[] =>
  groups.map((group) => ({ group, members: listedMembers(resolveMembers(group, useCases)) }));

export const groupsContaining = (useCaseId: string, groups: readonly UseCaseGroup[]): UseCaseGroup[] =>
  groups.filter((group) => group.members.some((member) => member.id === useCaseId));

/** The group's own themes, or else its members'. */
export function groupCategories(group: UseCaseGroup, members: readonly UseCase[]): string[] {
  return group.categories.length ? group.categories : [...new Set(members.flatMap((useCase) => useCase.categories))];
}

export interface SharedStructure {
  id: string;
  title: string;
  usedBy: string[];
}

/** Data structures that two or more members bring: installing them together reuses one. */
export function sharedStructures(members: readonly UseCase[]): SharedStructure[] {
  const byId = new Map<string, SharedStructure>();
  for (const useCase of members) {
    for (const artifact of useCase.includedArtifacts) {
      if (artifact.kind !== "datastructure") continue;
      const entry = byId.get(artifact.id) ?? { id: artifact.id, title: artifact.title, usedBy: [] };
      if (!entry.usedBy.includes(useCase.title)) entry.usedBy.push(useCase.title);
      byId.set(artifact.id, entry);
    }
  }
  return [...byId.values()].filter((entry) => entry.usedBy.length > 1);
}

/** Dates to sort a group among use cases; its software date is its newest member's. */
export function groupDates(group: UseCaseGroup, members: readonly UseCase[]): DatedEntry {
  const software = members.map((useCase) => useCase.softwareUpdatedAt ?? "").sort().at(-1);
  return { addedAt: group.addedAt, updatedAt: group.updatedAt, softwareUpdatedAt: software || undefined };
}

export const groupSearchText = (group: UseCaseGroup): string =>
  foldGerman(searchText(group.title, group.summary, group.description, group.publisher, ...group.categories));

/** Filters a group answers with its own details; every other filter looks at its members. */
const OWN_FACETS: Record<string, (listing: GroupListing) => string[]> = {
  kategorie: ({ group, members }) => groupCategories(group, members),
  herausgeber: ({ group }) => [group.publisher],
};

export interface GroupMatch {
  visible: boolean;
  /** Members that pass; all of them when nothing was asked about members. */
  matching: ReadonlySet<string>;
  /** What the members were checked against, if anything: the card says „1 von 3 passt …“. */
  checkedBy?: "filter" | "search" | "both";
}

/**
 * A group shows when its own details pass Themengebiet and Herausgeber and at
 * least one member passes the other filters. The search counts for all members
 * when it names the group itself, else each member must match it.
 */
export function matchGroup(
  listing: GroupListing,
  state: CatalogFilterState,
  facets: readonly FacetDef<UseCase>[],
  memberText: (useCase: UseCase) => string,
): GroupMatch {
  const selected = (id: string) => state.facets[id] ?? [];
  const ownPass = Object.entries(OWN_FACETS).every(([id, valuesOf]) => {
    const chosen = selected(id);
    return chosen.length === 0 || chosen.some((value) => valuesOf(listing).includes(value));
  });
  const memberFacets = facets.filter((def) => !(def.id in OWN_FACETS) && selected(def.id).length > 0);
  const query = state.search.trim();
  const searchOnMembers = query !== "" && !matchesQuery(groupSearchText(listing.group), query);

  const matching = new Set(
    listing.members
      .filter(
        (useCase) =>
          memberFacets.every((def) => matchesFacet(def, useCase, selected(def.id))) &&
          (!searchOnMembers || matchesQuery(memberText(useCase), query)),
      )
      .map((useCase) => useCase.id),
  );
  const checkedBy =
    memberFacets.length && searchOnMembers ? "both" : memberFacets.length ? "filter" : searchOnMembers ? "search" : undefined;
  return { visible: ownPass && matching.size > 0, matching, checkedBy };
}

/** „1 von 3 passt zu den Filtern“. */
export function matchLine(count: number, total: number, by: NonNullable<GroupMatch["checkedBy"]>): string {
  const what = by === "search" ? "zur Suche" : by === "both" ? "zu Suche und Filtern" : "zu den Filtern";
  return `${count} von ${total} ${count === 1 ? "passt" : "passen"} ${what}`;
}

// ── Proposing a group ─────────────────────────────────────────────────────────

export interface GroupDraft {
  title: string;
  slug: string;
  summary: string;
  description: string;
  problem: string;
  goal: string;
  next: string;
  categories: string[];
  ordered: boolean;
  publisher: { name: string; code: string };
  contactName: string;
  contactEmail: string;
  links: LinkDraft[];
  members: GroupMember[];
}

export function emptyGroupDraft(own: Organisation | undefined): GroupDraft {
  return {
    title: "",
    slug: "",
    summary: "",
    description: "",
    problem: "",
    goal: "",
    next: "",
    categories: [],
    ordered: false,
    publisher: { name: own?.name ?? "", code: own?.id ?? "" },
    contactName: own?.contact?.name ?? "",
    contactEmail: own?.contact?.email ?? "",
    links: [],
    members: [],
  };
}

/** The draft's members moved by one place; out-of-range moves change nothing. */
export function moveMember(members: readonly GroupMember[], index: number, by: -1 | 1): GroupMember[] {
  const target = index + by;
  if (target < 0 || target >= members.length) return [...members];
  const next = [...members];
  [next[index], next[target]] = [next[target]!, next[index]!];
  return next;
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function selectionProblem(members: readonly GroupMember[]): string | undefined {
  if (members.length < 2) return "Bitte mindestens zwei Anwendungsfälle wählen.";
  if (members.every((member) => member.optional)) return "Mindestens ein Anwendungsfall darf nicht optional sein.";
  return undefined;
}

/** The first thing that stops the preview, in the order of the form. */
export function groupDraftProblem(draft: GroupDraft, groups: readonly UseCaseGroup[]): string | undefined {
  const selection = selectionProblem(draft.members);
  if (selection) return selection;
  if (draft.title.trim().length < 3) return "Name: bitte mindestens drei Zeichen.";
  if (!SLUG.test(draft.slug)) return "Kurzname: nur Kleinbuchstaben, Ziffern und Bindestriche, nicht am Anfang oder Ende.";
  if (groups.some((group) => group.id === draft.slug)) return `Kurzname: „${draft.slug}“ ist im Katalog schon vergeben.`;
  if (!draft.summary.trim()) return "Kurzbeschreibung: bitte einen Satz, worum es geht.";
  const links = linksProblem(draft.links);
  if (links) return links;
  if (!draft.publisher.code) return "Herausgeber: bitte eine Organisation aus der Liste wählen oder neu vorschlagen.";
  if (draft.contactEmail.trim() && !EMAIL.test(draft.contactEmail.trim())) return "Kontakt: die E-Mail-Adresse sieht nicht vollständig aus.";
  return undefined;
}

/** The catalogue row the proposal would add. */
export function groupFromDraft(draft: GroupDraft): UseCaseGroup {
  const story = { problem: draft.problem.trim(), goal: draft.goal.trim(), next: draft.next.trim() };
  const hasStory = Object.values(story).some(Boolean);
  return {
    id: draft.slug,
    title: draft.title.trim(),
    summary: draft.summary.trim(),
    description: draft.description.trim(),
    publisher: draft.publisher.name,
    publisherOrg: draft.publisher.code || undefined,
    categories: draft.categories,
    members: draft.members,
    ordered: draft.ordered,
    links: cleanLinks(draft.links),
    story: hasStory
      ? { problem: story.problem || undefined, goal: story.goal || undefined, next: story.next || undefined }
      : undefined,
    contact: draft.contactEmail.trim()
      ? { name: draft.contactName.trim() || undefined, email: draft.contactEmail.trim() }
      : undefined,
  };
}
