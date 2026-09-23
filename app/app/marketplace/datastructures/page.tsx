import { CatalogFreshness } from "@/components/catalog/catalog-freshness";
import { DataStructureCatalog } from "@/components/catalog/data-structure-catalog";
import { MarketplacePageShell } from "@/components/marketplace/page-shell";
import { getDataStructures } from "@/lib/getDataStructures";
import { getUseCases } from "@/lib/getUseCases";
import { getMarketplaceText } from "@/lib/marketplace-text";

/**
 * Data structures as their own catalog section (P2.1 direction). The entries
 * now come from the catalog index like use cases and add-ons — they used to be
 * constants in `lib/datastructures-mock.ts`, which has been removed.
 * Installing a structure on its own is still not possible; the page says so.
 */
export default async function MarketplaceDataStructuresPage() {
  const text = getMarketplaceText();
  const [dataStructures, useCases] = await Promise.all([getDataStructures(), getUseCases()]);

  return (
    <MarketplacePageShell breadcrumb={text.sidebar.nav.dataStructures}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <DataStructureCatalog
          entries={dataStructures}
          useCases={useCases}
          heading={text.sidebar.nav.dataStructures}
          subtitle="Datenstrukturen legen fest, wie ein Messwert aufgebaut ist. Wer dieselbe Struktur nutzt, kann Auswertungen und Anwendungsfälle anderer Kommunen direkt übernehmen — deshalb stehen sie hier als eigene Katalogeinträge und nicht nur als Teil eines Anwendungsfalls."
          freshness={<CatalogFreshness />}
        />

        <p className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
          Eine Datenstruktur einzeln zu installieren ist noch nicht möglich — sie kommt derzeit
          immer mit dem Anwendungsfall, der sie nutzt.
        </p>
      </div>
    </MarketplacePageShell>
  );
}
