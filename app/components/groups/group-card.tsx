import Link from "next/link";
import { Check, GalleryVerticalEnd } from "lucide-react";

import { GroupIllustration } from "@/components/groups/group-illustration";
import { countUseCases, GROUP_TEXT, groupCategories, isInstallable, matchLine, type GroupMatch } from "@/lib/groups";
import type { UseCaseGroup } from "@/types/repo-list";
import type { UseCase } from "@/types/use-cases";

const SHOWN_MEMBERS = 3;

/**
 * A group in a card grid: a deck of cards, so it never reads as one use case.
 * Its contents sit on the card itself, and it carries no seal: each member has its own.
 */
export function GroupCard({
  group,
  members,
  hidePublisher = false,
  preview = false,
  match,
}: {
  group: UseCaseGroup;
  /** The members still listed, in the group's order. */
  members: UseCase[];
  hidePublisher?: boolean;
  /** Not yet in the catalogue: shown, but not a link. */
  preview?: boolean;
  /** From the catalogue's filters: which members fit. */
  match?: GroupMatch;
}) {
  const checked = match?.checkedBy ? match : undefined;
  const fits = (useCase: UseCase) => !checked || checked.matching.has(useCase.id);
  // While filtering, the fitting members come first, so the card shows what was found.
  const ordered = checked ? [...members.filter(fits), ...members.filter((useCase) => !fits(useCase))] : members;
  const shown = ordered.slice(0, SHOWN_MEMBERS);
  const more = members.length - shown.length;
  const described = members.filter((useCase) => !isInstallable(useCase)).length;
  const frame = "group block h-full rounded-lg";

  const deck = (
    // Room at the top right for the two cards behind.
    <div className="relative h-full pr-3 pt-3">
      <div
        aria-hidden
        className="absolute bottom-3 left-3 right-0 top-0 rounded-lg border bg-card transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
      <div
        aria-hidden
        className="absolute bottom-1.5 left-1.5 right-1.5 top-1.5 rounded-lg border bg-card shadow-sm transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px"
      />

      <article className="relative flex h-full flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow group-hover:shadow-md">
        <div className="relative">
          <GroupIllustration members={members} fallbackCategories={groupCategories(group, members)} />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-background px-2.5 py-1 text-xs font-medium text-emerald-700 shadow-sm dark:text-emerald-400">
            <GalleryVerticalEnd aria-hidden className="size-3.5" />
            {GROUP_TEXT.one} · {countUseCases(members.length)}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="hyphens-auto break-words text-lg font-semibold leading-tight text-foreground">{group.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{group.summary}</p>

          {checked?.checkedBy ? (
            <p className="mt-3 text-xs font-medium text-foreground">
              {matchLine(checked.matching.size, members.length, checked.checkedBy)}
            </p>
          ) : null}
          <ul className={`${checked ? "mt-1.5" : "mt-3"} flex flex-col gap-1 text-xs text-muted-foreground`}>
            {shown.map((useCase) =>
              checked ? (
                <li key={useCase.id} className="flex min-w-0 items-center gap-2">
                  {fits(useCase) ? (
                    <Check aria-hidden className="size-3.5 shrink-0 text-foreground" strokeWidth={3} />
                  ) : (
                    <span aria-hidden className="mx-1 size-1.5 shrink-0 rounded-full border border-muted-foreground/60" />
                  )}
                  <span className={`truncate ${fits(useCase) ? "font-medium text-foreground" : ""}`}>{useCase.title}</span>
                  <span className="sr-only">{fits(useCase) ? "(passt)" : "(passt nicht)"}</span>
                </li>
              ) : (
                <li key={useCase.id} className="flex min-w-0 items-center gap-2">
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-emerald-600/70" />
                  <span className="truncate text-foreground">{useCase.title}</span>
                </li>
              ),
            )}
            {more > 0 ? <li className="pl-3.5">und {more} weitere</li> : null}
          </ul>

          <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
            <span className="text-sm text-muted-foreground">
              {described ? `${described} davon nur beschrieben` : "Alle installierbar"}
            </span>
            {hidePublisher ? null : <span className="truncate text-sm text-muted-foreground">{group.publisher}</span>}
          </div>
        </div>
      </article>
    </div>
  );

  if (preview) return <div className={frame}>{deck}</div>;
  return (
    <Link
      href={`/marketplace/projekte/${group.id}`}
      className={`${frame} focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50`}
    >
      {deck}
    </Link>
  );
}
