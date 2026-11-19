"use client";

import { useMemo, useState, type ReactNode } from "react";

import { CatalogFilters, SortDropdown } from "@/components/catalog/catalog-filters";
import { GroupCard } from "@/components/groups/group-card";
import { UseCaseCard } from "@/components/use-cases/use-case-card";
import { USE_CASE_FACETS } from "@/lib/catalog-facet-defs";
import { applyCatalogFilters, type CatalogFilterState } from "@/lib/catalog-facets";
import { buildSearchIndex } from "@/lib/catalog-search";
import { useCaseSearchText } from "@/lib/catalog-search-text";
import { findSort, USE_CASE_SORTS } from "@/lib/catalog-sort";
import { GROUP_TEXT, groupDates, groupsContaining, matchGroup, type GroupListing } from "@/lib/groups";
import type { UseCase } from "@/types/use-cases";

interface UseCaseCatalogProps {
  useCases: UseCase[];
  groups?: GroupListing[];
  heading: string;
  subtitle: string;
  countLabel: string;
  noResultsLabel: string;
  searchPlaceholder: string;
  /** Optional freshness line (repo-list "catalog as of …") rendered under the heading. */
  freshness?: ReactNode;
  /** Deep-link state: the landing page's search form and category chips land here. */
  initialSearch?: string;
  initialCategory?: string;
}

export const UseCaseCatalog = ({
  useCases,
  groups = [],
  heading,
  subtitle,
  countLabel,
  noResultsLabel,
  searchPlaceholder,
  freshness,
  initialSearch = "",
  initialCategory = "",
}: UseCaseCatalogProps) => {
  // `?kategorie=` seeds the facet of the same id — that identity is why the
  // landing page's chips keep working without a translation table.
  const [filters, setFilters] = useState<CatalogFilterState>({
    search: initialSearch,
    // `?kategorie=Umwelt & Klima,Energie & Netze` seeds a multi-select facet of
    // the same id. Only a comma WITHOUT a following space separates: one topic
    // is „Planen, Bauen & Immobilien".
    facets: initialCategory
      ? { kategorie: initialCategory.split(/,(?!\s)/).map((v) => v.trim()).filter(Boolean) }
      : {},
  });

  // Built once per list, not per keystroke: typing then costs one substring
  // check per token per entry instead of a walk over nested objects.
  const index = useMemo(
    () => buildSearchIndex(useCases, (useCase) => useCase.id, useCaseSearchText),
    [useCases],
  );

  const filtered = useMemo(
    () =>
      applyCatalogFilters({
        entries: useCases,
        facets: USE_CASE_FACETS,
        state: filters,
        index,
        keyOf: (useCase) => useCase.id,
      }),
    [useCases, filters, index],
  );

  const shownGroups = useMemo(
    () =>
      groups
        .map((listing) => ({ ...listing, match: matchGroup(listing, filters, USE_CASE_FACETS, (useCase) => index.get(useCase.id) ?? "") }))
        .filter((listing) => listing.match.visible),
    [groups, filters, index],
  );

  // Membership is a fact whatever the filters show, so it comes from every group.
  const allGroups = useMemo(() => groups.map((listing) => listing.group), [groups]);

  const [sortId, setSortId] = useState(USE_CASE_SORTS[0]!.id);
  // Groups sort among the use cases, as decks in the same grid.
  const sorted = useMemo(() => {
    const items = [
      ...filtered.map((useCase) => ({ kind: "usecase" as const, key: useCase.id, dates: useCase, useCase })),
      ...shownGroups.map((listing) => ({
        kind: "group" as const,
        key: `group:${listing.group.id}`,
        dates: groupDates(listing.group, listing.members),
        listing,
      })),
    ];
    const { compare } = findSort(USE_CASE_SORTS, sortId);
    return items.sort((a, b) => compare(a.dates, b.dates));
  }, [filtered, shownGroups, sortId]);

  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground">{heading}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        {freshness ? <div className="mt-2">{freshness}</div> : null}
      </div>

      <CatalogFilters
        value={filters}
        onChange={setFilters}
        facets={USE_CASE_FACETS}
        entries={useCases}
        searchIndex={index}
        keyOf={(useCase) => useCase.id}
        searchPlaceholder={searchPlaceholder}
      />

      {/* The order applies to the results, so it sits with them, not among the filters. */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span> {countLabel}{" "}
          {useCases.length}
          {shownGroups.length ? ` · ${shownGroups.length} ${shownGroups.length === 1 ? GROUP_TEXT.one : GROUP_TEXT.many}` : null}
        </p>
        <SortDropdown sorts={USE_CASE_SORTS} value={sortId} onChange={setSortId} />
      </div>

      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((item) =>
            item.kind === "group" ? (
              <GroupCard key={item.key} group={item.listing.group} members={item.listing.members} match={item.listing.match} />
            ) : (
              <UseCaseCard key={item.key} useCase={item.useCase} partOf={groupsContaining(item.useCase.id, allGroups)} />
            ),
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed bg-card p-12 text-center text-sm text-muted-foreground">
          {noResultsLabel}
        </div>
      )}
    </div>
  );
};
