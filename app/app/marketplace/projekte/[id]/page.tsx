import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowLeft, GalleryVerticalEnd } from "lucide-react";

import { GroupIllustration } from "@/components/groups/group-illustration";
import { GroupInfobox } from "@/components/groups/group-infobox";
import { GroupMembers } from "@/components/groups/group-members";
import { EntryLinks } from "@/components/use-cases/entry-links";
import { MarketplacePageShell } from "@/components/marketplace/page-shell";
import { Button } from "@/components/ui/button";
import { Eyebrow, Section } from "@/components/ui/layout";
import { getUseCases } from "@/lib/getUseCases";
import { GROUP_TEXT, groupCategories, joinGerman, listedMembers, resolveMembers, sharedStructures, countUseCases } from "@/lib/groups";
import { getMarketplaceText } from "@/lib/marketplace-text";
import { getRepoListGroups } from "@/lib/server/repo-list";
import { listInstalledUseCases } from "@/lib/use-case-installations";

const STORY = [
  { key: "problem", label: "Das Problem" },
  { key: "goal", label: "Das Ziel" },
  { key: "next", label: "Wie es weitergeht" },
] as const;

/**
 * A project's page: what its use cases solve together, then the use cases
 * themselves, each installed on its own. Laid out like the use-case page.
 */
export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [groups, useCases, installed] = await Promise.all([
    getRepoListGroups(),
    getUseCases(),
    listInstalledUseCases().catch(() => []),
  ]);
  const group = groups.find((entry) => entry.id === id);
  if (!group) notFound();

  const text = getMarketplaceText();
  const resolved = resolveMembers(group, useCases);
  const members = listedMembers(resolved);
  const categories = groupCategories(group, members);
  const installedIds = new Set(installed.map((record) => record.useCaseId));
  const installedCount = group.members.filter((member) => installedIds.has(member.id)).length;
  const shared = sharedStructures(members);
  const story = STORY.flatMap(({ key, label }) => (group.story?.[key] ? [{ label, text: group.story[key] }] : []));

  return (
    <MarketplacePageShell breadcrumb={`${text.sidebar.nav.breadcrumbUseCases} / ${group.title}`}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <Link
          href="/marketplace/use-cases"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {text.useCases.backToCatalog}
        </Link>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_300px]">
          <div className="flex min-w-0 flex-col gap-6">
            <section className="overflow-hidden rounded-xl border bg-card">
              <GroupIllustration members={members} fallbackCategories={categories} className="h-24 border-b lg:h-28" />
              <div className="flex flex-col gap-4 p-6 lg:p-8">
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <GalleryVerticalEnd aria-hidden className="size-3.5" />
                    {GROUP_TEXT.one} · {countUseCases(group.members.length)}
                  </span>
                  {categories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <h1 className="hyphens-auto break-words text-3xl font-bold text-foreground lg:text-4xl">{group.title}</h1>
                <p className="text-lg leading-relaxed text-muted-foreground">{group.summary}</p>
                <div className="mt-1 flex w-full flex-col items-start gap-1.5">
                  <Button asChild variant="outline">
                    <a href="#anwendungsfaelle">
                      <ArrowDown aria-hidden />
                      Zu den Anwendungsfällen
                    </a>
                  </Button>
                  <p className="text-xs text-muted-foreground">{GROUP_TEXT.explain}</p>
                </div>
              </div>
            </section>

            {group.description || story.length || group.links.length ? (
              <Section title="Worum es geht">
                {group.description ? (
                  <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">{group.description}</p>
                ) : null}
                {story.length ? (
                  <dl className={`grid gap-6 sm:grid-cols-3 ${group.description ? "mt-6" : ""}`}>
                    {story.map((part) => (
                      <div key={part.label} className="border-t pt-3">
                        <dt>
                          <Eyebrow>{part.label}</Eyebrow>
                        </dt>
                        <dd className="mt-1.5 text-sm leading-relaxed text-foreground">{part.text}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                <EntryLinks links={group.links} className={group.description || story.length ? "mt-6" : undefined} />
              </Section>
            ) : null}

            <Section
              id="anwendungsfaelle"
              title={`Enthaltene Anwendungsfälle (${group.members.length})`}
              lead={
                group.ordered
                  ? "In dieser Reihenfolge aufbauen: der Hinweis unter jedem sagt, warum. Installiert wird jeder einzeln."
                  : "Jeder läuft für sich und wird einzeln installiert."
              }
            >
              <GroupMembers
                members={resolved}
                ordered={group.ordered}
                groupOrg={group.publisherOrg}
                installedIds={installedIds}
              />
            </Section>

            {shared.length ? (
              <Section
                title="Was sie gemeinsam nutzen"
                lead="Diese Datenstrukturen bringen mehrere der Anwendungsfälle mit. Nacheinander installiert, wird jede nur einmal angelegt."
              >
                <ul className="flex flex-col gap-3">
                  {shared.map((structure) => (
                    <li key={structure.id} className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-foreground">{structure.title}</span>
                      <span className="text-sm text-muted-foreground">in {joinGerman(structure.usedBy)}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-2">
            <GroupInfobox group={group} members={members} categories={categories} installedCount={installedCount} />
          </div>
        </div>
      </div>
    </MarketplacePageShell>
  );
}
