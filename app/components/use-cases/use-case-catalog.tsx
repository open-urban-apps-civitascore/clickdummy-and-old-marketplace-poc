"use client";

import { useMemo, useState, type ReactNode } from "react";

import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { UseCaseCard } from "@/components/use-cases/use-case-card";
import { USE_CASE_FACETS } from "@/lib/catalog-facet-defs";
import { applyCatalogFilters, type CatalogFilterState } from "@/lib/catalog-facets";
import { buildSearchIndex } from "@/lib/catalog-search";
import { useCaseSearchText } from "@/lib/catalog-search-text";
import type { UseCase } from "@/types/use-cases";

interface UseCaseCatalogProps {
  useCases: UseCase[];
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
    // `?kategorie=Umwelt,Mobilität` seeds a multi-select facet of the same id.
    facets: initialCategory
      ? { kategorie: initialCategory.split(",").map((v) => v.trim()).filter(Boolean) }
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

      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{filtered.length}</span> {countLabel}{" "}
        {useCases.length}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((useCase) => (
            <UseCaseCard key={useCase.id} useCase={useCase} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed bg-card p-12 text-center text-sm text-muted-foreground">
          {noResultsLabel}
        </div>
      )}
    </div>
  );
};
