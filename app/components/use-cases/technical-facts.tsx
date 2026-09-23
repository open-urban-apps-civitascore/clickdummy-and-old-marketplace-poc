import { Cpu, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Field, FieldList, Panel } from "@/components/ui/layout";
import { formatCatalogDate } from "@/lib/catalog-recency";
import { INSTALL_PATH_LABELS } from "@/types/curation-tier";
import { IMPLEMENTATION_LABELS } from "@/types/implementation";
import { type UseCase } from "@/types/use-cases";

/**
 * The technical and formal facts of an entry.
 *
 * Deliberately NOT here: compatibility, required platform components and
 * connectors (Ewa, 2026-09-23). Those appeared twice — once as a bare list
 * here, once in "Passt zu dieser Instanz?", where the same values are checked
 * against the running instance. Between two versions of one fact, the one with
 * a verdict wins; `checkFit` (lib/instance-profile.ts) covers all three.
 *
 * Uses `FieldList layout="columns"` because this Panel is full width: a
 * two-column grid keeps every value on one axis, whereas justified rows tore a
 * gap through the middle of the card.
 */
export function TechnicalFacts({ useCase }: { useCase: UseCase }) {
  const stack = useCase.implementation?.stack ?? [];
  const trust = useCase.trust;

  return (
    <Panel
      title="Technische Eckdaten"
      icon={<Cpu aria-hidden className="size-4" />}
      tone="usecase"
      footer={
        <>
          Was Ihre Instanz dafür mitbringen muss — CivitasCore-Version,
          Plattform-Komponenten und Konnektoren — steht geprüft unter „Passt zu dieser
          Instanz?“.
        </>
      }
    >
      <FieldList layout="columns">
        {stack.length > 0 ? (
          <Field layout="columns" label={IMPLEMENTATION_LABELS.stack}>
            <div className="flex flex-wrap gap-1.5">
              {stack.map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </Field>
        ) : null}

        {/* Only when it is NOT the normal case (Ewa, 2026-09-23): for "portal"
            the hint under the install button already says the use case is
            provisioned through the portal backend, so the row repeated it
            verbatim. "Durch den Betreiber" and "Mit Anpassung" are real
            caveats and stay visible. */}
        {useCase.installPath !== "portal" ? (
          <Field layout="columns" label="Installationsweg">
            {INSTALL_PATH_LABELS[useCase.installPath]}
          </Field>
        ) : null}

        {trust?.license ? (
          <Field layout="columns" label="Lizenz">
            <span className="font-mono text-xs">{trust.license}</span>
          </Field>
        ) : null}

        {/* What the reader sees is the release name — what gets installed is
            the commit. Without a pin the row disappears: an entry with no
            fixed state is not installable at all. */}
        {useCase.deploymentRef ? (
          <Field layout="columns" label="Quelle">
            <a
              href={useCase.deploymentRef.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
            >
              {useCase.deploymentRef.releaseTag ?? useCase.deploymentRef.ref.slice(0, 12)}
              <ExternalLink className="size-3" />
            </a>
          </Field>
        ) : null}

        {useCase.implementation?.reference ? (
          <Field layout="columns" label={IMPLEMENTATION_LABELS.reference}>
            <a
              href={useCase.implementation.reference.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
            >
              {useCase.implementation.reference.source ?? "Zur Quelle"}
              <ExternalLink className="size-3" />
            </a>
          </Field>
        ) : null}

        {trust?.curatedBy ? (
          <Field layout="columns" label="Geprüft von">
            {trust.curatedBy}
            {trust.curatedAt ? (
              <span className="ml-1 text-xs text-muted-foreground">({trust.curatedAt})</span>
            ) : null}
          </Field>
        ) : null}

        {useCase.addedAt ? (
          <Field layout="columns" label="Im Katalog seit">
            {formatCatalogDate(useCase.addedAt)}
          </Field>
        ) : null}
      </FieldList>
    </Panel>
  );
}
