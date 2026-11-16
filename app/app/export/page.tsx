import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";

import { ShareWizard } from "@/components/export/share-wizard";
import { MarketplacePageShell } from "@/components/marketplace/page-shell";
import { PageHeader } from "@/components/ui/layout";
import { getInstanceProfile } from "@/lib/instance-profile";
import { getShareDatasets } from "@/lib/share/datasets";
import { getRepoListOrganisations } from "@/lib/server/repo-list";

/**
 * „Neues Paket teilen“: the marketplace's share wizard, played. It starts at
 * the instance's datasets, not at an installation: what a municipality hands
 * on is usually what it modelled by hand.
 */
export default async function ExportPage() {
  const organisations = await getRepoListOrganisations();
  // The instance's own organisation presets „Herausgeber“; never the signed-in person.
  const own = organisations.find((organisation) => organisation.name === getInstanceProfile().tenantName);

  return (
    <MarketplacePageShell breadcrumb="Beitragen">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <PageHeader
          title="Neues Paket teilen"
          lead="Aus einem Datensatz dieser Instanz wird ein Paket. Nach zwei Prüfungen durch das Katalog-Team steht es im Katalog als Anwendungsfall. Die Daten selbst bleiben hier."
          meta={
            <Link
              href="/export/projekt"
              className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-2 hover:underline"
            >
              <GalleryVerticalEnd aria-hidden className="size-4" />
              Mehrere Anwendungsfälle gehören zusammen? Als Projekt zusammenstellen
            </Link>
          }
        />
        <ShareWizard datasets={getShareDatasets()} organisations={organisations} own={own} />
      </div>
    </MarketplacePageShell>
  );
}
