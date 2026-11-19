import Link from "next/link";

import { PartOfGroupsLine } from "@/components/groups/part-of-groups";
import { UseCaseIllustration } from "@/components/use-cases/use-case-illustration";
import { DeprecatedStatus, TierStatus } from "@/components/use-cases/use-case-status";
import type { UseCaseGroup } from "@/types/repo-list";
import { type UseCase } from "@/types/use-cases";

export function UseCaseCard({
  useCase,
  hidePublisher = false,
  partOf = [],
}: {
  useCase: UseCase;
  hidePublisher?: boolean;
  /** The projects it belongs to, so a member next to its project card does not read as a duplicate. */
  partOf?: UseCaseGroup[];
}) {
  const category = useCase.categories[0];

  // The title's link covers the whole card (its `after:`), so the project names
  // can be links of their own on top - a link inside a link is not allowed.
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md has-[.card-link:focus-visible]:ring-[3px] has-[.card-link:focus-visible]:ring-ring/50">
      <div className="relative">
        <UseCaseIllustration categories={useCase.categories} />
        {category ? (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-md bg-background px-2.5 py-1 text-xs font-medium text-emerald-700 shadow-sm dark:text-emerald-400">
            {category}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-tight text-foreground">
          <Link
            href={`/marketplace/use-cases/${useCase.id}`}
            className="card-link after:absolute after:inset-0 focus-visible:outline-none"
          >
            {useCase.title}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {useCase.summary}
        </p>
        {/* Grows, so the project line and the footer sit at the same height across a row, whatever the title's length. */}
        <div aria-hidden className="min-h-4 flex-1" />
        {partOf.length ? (
          <div className="pb-3">
            <PartOfGroupsLine groups={partOf} />
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3 border-t pt-4">
          {useCase.deprecated ? <DeprecatedStatus /> : <TierStatus tier={useCase.curationTier} />}
          {hidePublisher ? null : (
            <span className="truncate text-sm text-muted-foreground">{useCase.publisher}</span>
          )}
        </div>
      </div>
    </article>
  );
}
