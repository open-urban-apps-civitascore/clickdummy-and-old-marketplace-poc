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
