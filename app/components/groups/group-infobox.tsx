import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, GalleryVerticalEnd } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Eyebrow, Field, FieldList } from "@/components/ui/layout";
import { formatCatalogDate } from "@/lib/catalog-recency";
import { GROUP_TEXT, isInstallable } from "@/lib/groups";
import type { UseCaseGroup } from "@/types/repo-list";
import type { UseCase } from "@/types/use-cases";

/** The group's „Auf einen Blick“, built like the use case's. */
export function GroupInfobox({
  group,
  members,
  categories,
  installedCount,
}: {
  group: UseCaseGroup;
  members: UseCase[];
  categories: string[];
  installedCount: number;
}) {
  const total = group.members.length;
  const optional = group.members.filter((member) => member.optional).length;
  const installable = members.filter(isInstallable).length;
  const added = formatCatalogDate(group.addedAt);
  const updated = formatCatalogDate(group.updatedAt);

  return (
    <aside aria-label="Steckbrief" className="rounded-lg border bg-card">
      <div className="flex items-center gap-2 border-b px-5 py-3">
        <span
          aria-hidden
          className="grid size-7 shrink-0 place-items-center rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
        >
          <GalleryVerticalEnd className="size-4" />
        </span>
        <h3 className="text-sm font-semibold text-foreground">Auf einen Blick</h3>
      </div>

      <Group label="Einordnung">
        <Field label="Anwendungsfälle" hint={optional ? `${optional} davon optional` : undefined}>
          {total}
        </Field>
        <Field
          label="Installierbar"
          hint={installable < total ? "Die anderen sind nur beschrieben: ein Paket gibt es für sie noch nicht." : undefined}
        >
          {installable === total ? "Alle" : `${installable} von ${total}`}
        </Field>
        <Field label="Hier installiert">{installedCount ? `${installedCount} von ${total}` : "Noch keiner"}</Field>
        {categories.length ? (
          <Field label="Themengebiet">
            <ul className="flex flex-col gap-0.5 font-normal">
              {categories.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
          </Field>
        ) : null}
      </Group>

      <Group label="Wer dahintersteht" last={!added && !updated}>
        <Field label="Herausgeber">
          {group.publisherOrg ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-auto min-h-8 max-w-full whitespace-normal py-1.5 text-left"
            >
              <Link href={`/marketplace/organisationen/${group.publisherOrg}`}>
                {group.publisher}
                <ChevronRight aria-hidden />
              </Link>
            </Button>
          ) : (
            group.publisher
          )}
        </Field>
        {group.contact ? (
          <Field label="Kontakt">
            <span className="font-normal">
              {group.contact.name ? <span className="block">{group.contact.name}</span> : null}
              <a href={`mailto:${group.contact.email}`} className="break-words text-primary underline-offset-2 hover:underline">
                {group.contact.email}
              </a>
            </span>
          </Field>
        ) : null}
      </Group>

      {added || updated ? (
        <Group label="Im Katalog" last>
          {added ? <Field label="Aufgenommen">{added}</Field> : null}
          {updated ? <Field label="Eintrag aktualisiert">{updated}</Field> : null}
        </Group>
      ) : null}

      <p className="border-t px-5 py-3 text-xs leading-relaxed text-muted-foreground">
        {GROUP_TEXT.explain} Ein eigenes Siegel hat ein Projekt nicht: jeder Anwendungsfall trägt seins.
      </p>
    </aside>
  );
}

function Group({ label, children, last = false }: { label: string; children: ReactNode; last?: boolean }) {
  return (
    <section className={last ? "px-5 pb-4" : "border-b px-5 pb-4"}>
      <Eyebrow className="pb-2 pt-4">{label}</Eyebrow>
      <FieldList>{children}</FieldList>
    </section>
  );
}
