import { Boxes } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/layout";
import { parseUrn } from "@/lib/urn";
import { INCLUDED_ARTIFACT_KIND_LABELS, type UseCase } from "@/types/use-cases";

interface IncludedArtifactsSpecProps {
  title: string;
  artifacts: UseCase["includedArtifacts"];
  /** Dataset-level CORE URN, pinned at the bottom for traceability. */
  urn: string;
}

/**
 * Technical spec of a use case: its CORE artifacts rendered as a compact,
 * scannable list — a fixed-width mono type badge, the artifact title and its
 * version — with the dataset URN pinned below.
 *
 * Data structures show no version. They are the shared, reusable part: the
 * version that matters for them is the one the instance resolves, not the one
 * this package happened to be built against (feedback 2026-10-03).
 *
 * What an artifact additionally needs in the real world (sensors, registers)
 * is no longer listed here but under the demo-data panel, collected across
 * all artifacts — see `real-data-requirements.tsx`.
 */
export function IncludedArtifactsSpec({ title, artifacts, urn }: IncludedArtifactsSpecProps) {
  return (
    <Panel
      title={title}
      icon={<Boxes aria-hidden className="size-4" />}
      tone="usecase"
      footer={
        <>
          <span className="block font-mono text-[11px] uppercase tracking-wide">
            CORE Dataset URN
          </span>
          <span className="mt-1 block break-all font-mono text-xs text-foreground/80">{urn}</span>
        </>
      }
    >
      <ul>
        {artifacts.map((artifact) => {
          const { version, isVersioned } = parseUrn(artifact.id);
          const showsVersion = artifact.kind !== "datastructure";
          return (
            <li key={artifact.id} className="border-b py-3 last:border-b-0">
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className="w-32 shrink-0 justify-center bg-muted font-mono text-[11px] uppercase tracking-wide text-muted-foreground"
                >
                  {INCLUDED_ARTIFACT_KIND_LABELS[artifact.kind]}
                </Badge>
                <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                  {artifact.title}
                </span>
                {showsVersion ? (
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {isVersioned ? `v${version}` : "v—"}
                  </span>
                ) : null}
              </div>
              {artifact.description ? (
                <p className="mt-1 pl-0 text-sm text-muted-foreground sm:pl-36">
                  {artifact.description}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>

    </Panel>
  );
}
