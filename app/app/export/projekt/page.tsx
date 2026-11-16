import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { GroupWizard } from "@/components/export/group-wizard";
import { MarketplacePageShell } from "@/components/marketplace/page-shell";
import { PageHeader } from "@/components/ui/layout";
import { getUseCases } from "@/lib/getUseCases";
import { getInstanceProfile } from "@/lib/instance-profile";
import { getRepoListGroups, getRepoListOrganisations } from "@/lib/server/repo-list";

/** „Projekt zusammenstellen“: several listed use cases become one catalogue entry, played. */
export default async function GroupSharePage() {
  const [organisations, useCases, groups] = await Promise.all([
    getRepoListOrganisations(),
    getUseCases(),
    getRepoListGroups(),
  ]);
  const own = organisations.find((organisation) => organisation.name === getInstanceProfile().tenantName);

  return (
    <MarketplacePageShell breadcrumb="Beitragen">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Link href="/export" className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Zurück zu „Neues Paket teilen“
        </Link>
        <PageHeader
          title="Projekt zusammenstellen"
          lead="Fasse Anwendungsfälle, die schon im Katalog stehen, zu einem Projekt zusammen - zum Beispiel alle aus einem Smart-City-Vorhaben. Installiert wird weiter jeder Anwendungsfall einzeln."
        />
        <GroupWizard useCases={useCases} organisations={organisations} groups={groups} own={own} />
      </div>
    </MarketplacePageShell>
  );
}
