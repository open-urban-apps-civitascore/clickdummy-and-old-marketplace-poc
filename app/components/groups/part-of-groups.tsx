import { Fragment } from "react";
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";

import { GROUP_TEXT, countUseCases } from "@/lib/groups";
import type { UseCaseGroup } from "@/types/repo-list";

/** The one quiet line a use case gets for each group it belongs to. */
export function PartOfGroups({ groups }: { groups: UseCaseGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <ul className="flex flex-col gap-1">
      {groups.map((group) => (
        <li key={group.id}>
          <Link
            href={`/marketplace/projekte/${group.id}`}
            className="group/part inline-flex items-start gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <GalleryVerticalEnd aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span>
              {GROUP_TEXT.partOf}{" "}
              <span className="font-medium text-foreground underline-offset-2 group-hover/part:underline">„{group.title}“</span> (
              {countUseCases(group.members.length)})
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * The same fact on a catalogue card: one quiet line, the project names as links.
 * `relative z-10` lifts them above the card's own link, which covers the card.
 */
export function PartOfGroupsLine({ groups }: { groups: UseCaseGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
      <GalleryVerticalEnd aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>
        {groups.length === 1 ? GROUP_TEXT.partOf : GROUP_TEXT.partOfMany}{" "}
        {groups.map((group, index) => (
          <Fragment key={group.id}>
            {index === 0 ? null : index === groups.length - 1 ? " und " : ", "}
            <Link
              href={`/marketplace/projekte/${group.id}`}
              className="relative z-10 rounded-sm font-medium text-foreground underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
            >
              „{group.title}“
            </Link>
          </Fragment>
        ))}
      </span>
    </p>
  );
}
