import Link from "next/link";
import { AlertTriangle, ArrowUpRight, CalendarClock, Database } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { InstalledAutoRefresh } from "@/components/use-cases/installed-auto-refresh";
import { MarketplacePageShell } from "@/components/marketplace/page-shell";
import { getMarketplaceText } from "@/lib/marketplace-text";
import { getUseCases } from "@/lib/getUseCases";
import { listInstalledUseCases } from "@/lib/use-case-installations";
import {
  DATASET_LIFECYCLE_STATUS_LABELS,
  type InstalledUseCase,
} from "@/types/use-cases";

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(date);
}

/**
 * Overview of all installations as compact cards — the full record (demo-data
 * controls, destinations, interfaces, roles) lives on the per-installation
 * detail page, mirroring the catalog's list → detail pattern.
 */
export default async function InstalledPage() {
  const text = getMarketplaceText();

  // Deprecation must reach the instances that already installed the entry —
  // it is catalog state, so the list resolves it per install.
  const catalogue = await getUseCases().catch(() => []);
  const catalogueDeprecations = new Set(
    catalogue.filter((useCase) => useCase.deprecated).map((useCase) => useCase.id),
  );

  // This page reads its installs from the local install store and refreshes their
  // status from the portal-backend (best-effort). Surface a hard read failure as an
  // explicit notice rather than a 500 or a misleading "empty".
  let installations: InstalledUseCase[] = [];
  let loadError: string | null = null;
  try {
    installations = await listInstalledUseCases();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Unbekannter Fehler";
  }

  // While anything is still provisioning, poll so the PROVISIONING → AVAILABLE/READY
  // transition appears without a manual reload.
  const hasProvisioning = installations.some((installation) => installation.status === "PROVISIONING");

  return (
    <MarketplacePageShell
      breadcrumb={text.sidebar.nav.installed}
      tenantName="Stadt Musterstadt"
    >
      <InstalledAutoRefresh active={hasProvisioning} />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground">{text.useCases.installedHeading}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{text.useCases.installedSubtitle}</p>
        </div>

        {loadError ? (
          <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-medium">Installierte Anwendungsfälle konnten nicht geladen werden.</p>
              <p className="mt-1 text-amber-700 dark:text-amber-400">
                Der lokale Installations-Speicher ist nicht lesbar. ({loadError})
              </p>
            </div>
          </div>
        ) : installations.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {installations.map((installation) => (
              <Link
                key={installation.id}
                href={`/installed/${installation.useCaseId}`}
                className="group flex flex-col gap-3 rounded-md border bg-card p-5 transition-colors hover:border-foreground/20 hover:bg-muted/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-semibold text-foreground">
                    {installation.useCaseTitle}
                  </h2>
                  <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {installation.createdDataset.description}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{DATASET_LIFECYCLE_STATUS_LABELS[installation.status]}</Badge>
                  {installation.dataSourceMode === "demo" ? (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      Demo-Daten
                    </span>
                  ) : null}
                  {catalogueDeprecations.has(installation.useCaseId) ? (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-xs text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="size-3" />
                      Eingestellt
                    </span>
                  ) : null}
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Database className="size-3.5" />
                    {installation.createdDataset.name}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarClock className="size-3.5" />
                    {formatDate(installation.installedAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed bg-card p-12 text-center text-sm text-muted-foreground">
            {text.useCases.emptyInstalled}
          </div>
        )}
      </div>
    </MarketplacePageShell>
  );
}
