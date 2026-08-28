import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { InstalledAutoRefresh } from "@/components/use-cases/installed-auto-refresh";
import { MarketplacePageShell } from "@/components/marketplace/page-shell";
import { UseCaseInstallationCard } from "@/components/use-cases/use-case-installation-card";
import { getMarketplaceText } from "@/lib/marketplace-text";
import { getUseCaseById } from "@/lib/getUseCases";
import { listInstalledUseCases } from "@/lib/use-case-installations";

/**
 * Detail page for one installation. The route is keyed by useCaseId — the
 * same key the activate/remove actions already use, because the dummy (like
 * the current PoC) holds at most one installation per use case.
 */
export default async function InstalledUseCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const text = getMarketplaceText();

  const installations = await listInstalledUseCases().catch(() => []);
  const installation = installations.find((entry) => entry.useCaseId === id);
  if (!installation) {
    notFound();
  }

  // What this installation *provides* — and whether the catalog has meanwhile
  // deprecated it — is declared by its catalog entry, not by the install
  // record. Missing entry (unlisted since install) → no panels.
  const catalogueEntry = await getUseCaseById(installation.useCaseId).catch(() => undefined);

  return (
    <MarketplacePageShell
      breadcrumb={`${text.sidebar.nav.installed} / ${installation.useCaseTitle}`}
      tenantName="Stadt Musterstadt"
    >
      <InstalledAutoRefresh active={installation.status === "PROVISIONING"} />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <Link
          href="/installed"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {text.useCases.installedHeading}
        </Link>

        <UseCaseInstallationCard
          installation={installation}
          surfaces={catalogueEntry?.provides ?? []}
          endUserSurfaces={catalogueEntry?.endUserSurfaces ?? []}
          deprecation={catalogueEntry?.deprecated}
        />
      </div>
    </MarketplacePageShell>
  );
}
