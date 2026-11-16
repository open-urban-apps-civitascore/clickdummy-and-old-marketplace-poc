import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Mail } from "lucide-react";

import { MarketplacePageShell } from "@/components/marketplace/page-shell";
import { PageHeader, Section } from "@/components/ui/layout";
import { GroupCard } from "@/components/groups/group-card";
import { AdopterLogo } from "@/components/use-cases/adopters";
import { UseCaseCard } from "@/components/use-cases/use-case-card";
import { GROUP_TEXT, groupListings } from "@/lib/groups";
import { getMarketplaceText } from "@/lib/marketplace-text";
import { getRepoListGroups, getRepoListOrganisation, getRepoListUseCases } from "@/lib/server/repo-list";

const LINK_CLASS = "text-primary underline-offset-2 hover:underline";

export default async function OrganisationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const [organisation, allUseCases, allGroups] = await Promise.all([
    getRepoListOrganisation(code),
    getRepoListUseCases(),
    getRepoListGroups(),
  ]);
  if (!organisation) notFound();

  const useCases = allUseCases.filter((useCase) => useCase.implementation?.operatorOrg === code);
  const groups = groupListings(
    allGroups.filter((group) => group.publisherOrg === code),
    allUseCases,
  );
  const { name, website, contact } = organisation;
  const text = getMarketplaceText();

  return (
    <MarketplacePageShell breadcrumb={name}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <Link
          href="/marketplace/use-cases"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {text.useCases.backToCatalog}
        </Link>

        <div className="flex items-center gap-4">
          <AdopterLogo adopter={{ name }} size="lg" />
          <PageHeader
            className="min-w-0"
            title={name}
            meta={
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-1 ${LINK_CLASS}`}
                  >
                    <ExternalLink aria-hidden className="size-3.5" />
                    {new URL(website).hostname}
                  </a>
                ) : null}
                <span className="inline-flex min-w-0 items-center gap-1">
                  <Mail aria-hidden className="size-3.5 shrink-0" />
                  {contact ? (
                    <span className="min-w-0 break-words">
                      {contact.name ? `${contact.name}: ` : null}
                      <a href={`mailto:${contact.email}`} className={LINK_CLASS}>
                        {contact.email}
                      </a>
                    </span>
                  ) : (
                    "Keine zentrale Kontaktstelle hinterlegt"
                  )}
                </span>
              </div>
            }
          />
        </div>

        {groups.length ? (
          <Section tone="bare" title={`${GROUP_TEXT.many} (${groups.length})`}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map(({ group, members }) => (
                <GroupCard key={group.id} group={group} members={members} hidePublisher />
              ))}
            </div>
          </Section>
        ) : null}

        <Section tone="bare" title={`Anwendungsfälle (${useCases.length})`}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <UseCaseCard key={useCase.id} useCase={useCase} hidePublisher />
            ))}
          </div>
        </Section>
      </div>
    </MarketplacePageShell>
  );
}
