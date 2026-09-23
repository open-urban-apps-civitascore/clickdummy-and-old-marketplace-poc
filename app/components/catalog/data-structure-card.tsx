import Link from "next/link";
import { Database, Layers } from "lucide-react";

import { dataStructureDomain } from "@/lib/data-structures";
import type { DataStructureEntry } from "@/types/repo-list";
import type { UseCase } from "@/types/use-cases";

/**
 * A data structure as a catalog row of its own. The reuse count is DERIVED
 * from the use cases that include it (`lib/data-structures.ts`) rather than
 * stored, so it cannot drift — and because it is derived, the card can name
 * the use cases instead of only counting them.
 */
export function DataStructureCard({
  entry,
  usedBy,
}: {
  entry: DataStructureEntry;
  usedBy: UseCase[];
}) {
  const domain = dataStructureDomain(entry);

  return (
    <article id={entry.id} className="flex h-full flex-col gap-3 rounded-lg border bg-card p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Database className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-foreground">{entry.displayName}</h2>
          <p className="text-xs text-muted-foreground">{entry.maintainer}</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{entry.description}</p>

      {usedBy.length > 0 ? (
        <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground">
          <Layers aria-hidden className="size-3.5 shrink-0 translate-y-0.5" />
          <span>Genutzt in:</span>
          {usedBy.map((useCase, position) => (
            <span key={useCase.id}>
              <Link
                href={`/marketplace/use-cases/${useCase.id}`}
                className="text-foreground underline-offset-2 hover:underline"
              >
                {useCase.title}
              </Link>
              {position < usedBy.length - 1 ? "," : null}
            </span>
          ))}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        {domain ? (
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {domain}
          </span>
        ) : (
          <span />
        )}
        <span className="font-mono text-xs text-muted-foreground">v{entry.version}</span>
      </div>

      <p className="break-all font-mono text-[11px] text-muted-foreground/80">{entry.id}</p>
    </article>
  );
}
