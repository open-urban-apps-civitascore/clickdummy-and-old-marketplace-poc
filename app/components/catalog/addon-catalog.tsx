"use client";

import { useMemo, useState, type ReactNode } from "react";

import { ADDON_FACETS } from "@/lib/catalog-facet-defs";
import { applyCatalogFilters, type CatalogFilterState } from "@/lib/catalog-facets";
import { buildSearchIndex } from "@/lib/catalog-search";
import { addonSearchText } from "@/lib/catalog-search-text";
import type { Addon } from "@/types/addons";

import { CatalogFilters } from "./catalog-filters";
import { AddonCard } from "./addon-card";

interface AddonCatalogProps {
  addons: Addon[];
  detailsPath?: string;
  heading?: string;
  subtitle?: string;
  countLabel?: string;
  noResultsLabel?: string;
  /** Optional freshness line (repo-list "catalog as of …") rendered under the heading. */
  freshness?: ReactNode;
}

export const AddonCatalog = ({
  addons,
  detailsPath = "/marketplace/addons",
  heading = "Add-on Katalog",
  subtitle = "Zentrale Komponenten, Adapter und Tools für deinen CivitasCore Cluster finden und installieren.",
  countLabel = "von",
  noResultsLabel = "Keine Add-ons für die aktuelle Suche gefunden.",
  freshness,
}: AddonCatalogProps) => {
  const [filters, setFilters] = useState<CatalogFilterState>({ search: "", facets: {} });

  const index = useMemo(
    () => buildSearchIndex(addons, (addon) => addon.id, addonSearchText),
    [addons],
  );

  const filtered = useMemo(
    () =>
      applyCatalogFilters({
        entries: addons,
        facets: ADDON_FACETS,
        state: filters,
        index,
        keyOf: (addon) => addon.id,
      }),
    [addons, filters, index],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground">{heading}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        {freshness ? <div className="mt-2">{freshness}</div> : null}
      </div>

      <CatalogFilters
        value={filters}
        onChange={setFilters}
        facets={ADDON_FACETS}
        entries={addons}
        searchIndex={index}
        keyOf={(addon) => addon.id}
        searchPlaceholder="Add-on suchen …"
      />

      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{filtered.length}</span> {countLabel}{" "}
        {addons.length}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((addon) => (
            <AddonCard key={addon.id} addon={addon} href={detailsPath} />
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
