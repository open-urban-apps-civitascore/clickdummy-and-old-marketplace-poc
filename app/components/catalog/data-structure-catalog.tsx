"use client";

import { useMemo, useState, type ReactNode } from "react";

import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { DataStructureCard } from "@/components/catalog/data-structure-card";
import { dataStructureFacets } from "@/lib/catalog-facet-defs";
import { applyCatalogFilters, type CatalogFilterState } from "@/lib/catalog-facets";
import { buildSearchIndex } from "@/lib/catalog-search";
import { dataStructureSearchText } from "@/lib/catalog-search-text";
import { dependentUseCases } from "@/lib/data-structures";
import type { DataStructureEntry } from "@/types/repo-list";
import type { UseCase } from "@/types/use-cases";

/**
 * The data-structure catalog. Same filter bar as the other two sections — this
 * page had no search and no filters at all before.
 */
export function DataStructureCatalog({
  entries,
  useCases,
  heading,
  subtitle,
  freshness,
}: {
  entries: DataStructureEntry[];
  useCases: UseCase[];
  heading: string;
  subtitle: string;
  freshness?: ReactNode;
}) {
  const [filters, setFilters] = useState<CatalogFilterState>({ search: "", facets: {} });

  const facets = useMemo(() => dataStructureFacets(useCases), [useCases]);
  const index = useMemo(
    () =>
      buildSearchIndex(
        entries,
        (entry) => entry.id,
        (entry) => dataStructureSearchText(entry, useCases),
      ),
    [entries, useCases],
  );

  const filtered = useMemo(
    () =>
      applyCatalogFilters({
        entries,
        facets,
        state: filters,
        index,
        keyOf: (entry) => entry.id,
      }),
    [entries, facets, filters, index],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground">{heading}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        {freshness ? <div className="mt-2">{freshness}</div> : null}
      </div>

      <CatalogFilters
        value={filters}
        onChange={setFilters}
        facets={facets}
        entries={entries}
        searchIndex={index}
        keyOf={(entry) => entry.id}
        searchPlaceholder="Datenstruktur suchen …"
      />

      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{filtered.length}</span> von{" "}
        {entries.length}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {filtered.map((entry) => (
            <DataStructureCard
              key={entry.id}
              entry={entry}
              usedBy={dependentUseCases(entry.id, useCases)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed bg-card p-12 text-center text-sm text-muted-foreground">
          Keine Datenstrukturen für die aktuelle Suche gefunden.
        </div>
      )}
    </div>
  );
}
