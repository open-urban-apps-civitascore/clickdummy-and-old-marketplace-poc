import { type ReactNode } from "react";
import { ClipboardList, ExternalLink, Handshake } from "lucide-react";

import {
  Eyebrow,
  Field,
  FieldList,
  NeutralBadge,
} from "@/components/ui/layout";
import { TierExplainer } from "@/components/use-cases/tier-explainer";
import {
  COST_BAND_LABELS,
  COST_BAND_SHORT,
  EFFORT_BAND_LABELS,
  EFFORT_BAND_SHORT,
  IMPLEMENTATION_LABELS,
  USE_CASE_STATUS_HINTS,
  USE_CASE_STATUS_LABELS,
} from "@/types/implementation";
import { type UseCase } from "@/types/use-cases";

/**
 * The Steckbrief: the facts that decide an entry, in one box at the top of the
 * page — the Wikipedia infobox pattern (Ewa, 2026-09-22).
 *
 * Deliberately SHORT (Ewa, 2026-09-23): at most the field set the public
 * CIVITAS Connect detail page shows. Not here, because they lengthen the box
 * without deciding anything:
 *   - Installationsweg and Kompatibilität → technical, they live below
 *   - Themengebiet → already a badge above the title
 *   - Lizenz, Quelle, catalog date, curation → "Technische Details"
 *
 * Split into three groups (Ewa, 2026-09-23) so the box can be skimmed rather
 * than read; each group answers ONE question: how sound is this, who stands
 * behind it, what does it cost. The group labels are `Eyebrow`s, not headings —
 * they label a region without competing with the box's own title (see §1 of
 * `docs/communication-design-system.md`).
 *
 * No actions here: the install button stays in the hero, where it is still
 * near the top on a phone (this column drops below the content under `lg`).
 *
 * `TrustPanel` is deliberately left alone — the add-on detail page still
 * renders it; here it is superseded by this box.
 */
export function UseCaseInfobox({
  useCase,
  className,
}: {
  useCase: UseCase;
  className?: string;
}) {
  const { trust, implementation } = useCase;
  const resources = implementation?.resources;
  const references = trust?.productionReferences ?? [];
  const status = implementation?.status;
  // A group with no content should not get a heading either.
  const hasResources = Boolean(
    resources?.setupCost ||
    resources?.runningCost ||
    resources?.effortBand ||
    resources?.funding,
  );

  return (
    <aside
      aria-label="Steckbrief"
      className={["rounded-lg border bg-card", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center gap-2 border-b px-5 py-3">
        {/* Identity tint, not a judgement: green marks a use case throughout
            the app (§4.2). It sits on an icon tile, never on the text. */}
        <span
          aria-hidden
          className="grid size-7 shrink-0 place-items-center rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
        >
          <ClipboardList className="size-4" />
        </span>
        <h3 className="text-sm font-semibold text-foreground">
          Auf einen Blick
        </h3>
      </div>

      <Group label="Einordnung">
        <div className="pb-1 pt-3">
          <TierExplainer tier={useCase.curationTier} showRevocable />
        </div>

        {status ? (
          <Field
            label={IMPLEMENTATION_LABELS.status}
            hint={USE_CASE_STATUS_HINTS[status]}
          >
            {USE_CASE_STATUS_LABELS[status]}
          </Field>
        ) : null}

        <Field label="Produktiv im Einsatz">
          {references.length > 0 ? (
            <ul className="flex flex-col gap-0.5">
              {references.map((reference) => (
                <li key={reference.municipality}>
                  {reference.url ? (
                    <a
                      href={reference.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 underline-offset-2 hover:underline"
                    >
                      {reference.municipality}
                      <ExternalLink className="size-3" />
                    </a>
                  ) : (
                    reference.municipality
                  )}
                  {reference.since ? (
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      seit {reference.since}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <span className="font-normal text-muted-foreground">
              Noch keine gemeldet
            </span>
          )}
        </Field>
      </Group>

      {/* Group 2 — who do you call if you want to rebuild it? */}
      <Group label="Wer dahintersteht" last={!hasResources}>
        <Field label={IMPLEMENTATION_LABELS.operator}>
          {implementation?.operator ?? useCase.publisher}
        </Field>

        <List
          label={IMPLEMENTATION_LABELS.stakeholders}
          items={implementation?.parties?.stakeholders}
        />
        <List
          label={IMPLEMENTATION_LABELS.serviceProviders}
          items={implementation?.parties?.serviceProviders}
        />

        {/* Omitted entirely when nothing is on record (Ewa, 2026-09-23) — a row
            reading „keine Ansprechperson benannt" spends a line to say nothing.
            Falls back from a named person to the maintainer's public contact. */}
        {trust?.contactPerson || trust?.maintainer?.contactUrl ? (
          <Field label="Kontakt">
            {trust.contactPerson ? (
              <>
                <span className="block">{trust.contactPerson.name}</span>
                {trust.contactPerson.role ? (
                  <span className="block text-xs font-normal text-muted-foreground">
                    {trust.contactPerson.role}
                  </span>
                ) : null}
                {trust.contactPerson.email ? (
                  <a
                    href={`mailto:${trust.contactPerson.email}`}
                    className="block text-xs font-normal text-primary underline-offset-2 hover:underline"
                  >
                    {trust.contactPerson.email}
                  </a>
                ) : null}
                {trust.contactPerson.phone ? (
                  <span className="block text-xs font-normal text-muted-foreground">
                    {trust.contactPerson.phone}
                  </span>
                ) : null}
              </>
            ) : trust.maintainer?.contactUrl ? (
              <a
                href={trust.maintainer.contactUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-normal text-primary underline-offset-2 hover:underline"
              >
                Über {trust.maintainer.name}
                <ExternalLink className="size-3" />
              </a>
            ) : null}
          </Field>
        ) : null}
      </Group>

      {/* Group 3 — build and run costs kept apart: a project budget can invest
          once, but the running cost has to be carried by the regular budget. */}
      {hasResources ? (
        <Group label="Kosten und Aufwand" last>
          {resources?.setupCost ? (
            <Field label={IMPLEMENTATION_LABELS.setupCost}>
              <NeutralBadge short={COST_BAND_SHORT[resources.setupCost]}>
                {stripBandPrefix(COST_BAND_LABELS[resources.setupCost])}
              </NeutralBadge>
            </Field>
          ) : null}
          {resources?.runningCost ? (
            <Field label={IMPLEMENTATION_LABELS.runningCost}>
              <NeutralBadge short={COST_BAND_SHORT[resources.runningCost]}>
                {stripBandPrefix(COST_BAND_LABELS[resources.runningCost])}
              </NeutralBadge>
            </Field>
          ) : null}
          {resources?.effortBand ? (
            <Field label={IMPLEMENTATION_LABELS.effort} hint={resources.note}>
              <NeutralBadge short={EFFORT_BAND_SHORT[resources.effortBand]}>
                {stripBandPrefix(EFFORT_BAND_LABELS[resources.effortBand])}
              </NeutralBadge>
            </Field>
          ) : null}
          {resources?.funding ? (
            <Field label={IMPLEMENTATION_LABELS.funding}>
              {resources.funding}
            </Field>
          ) : null}
        </Group>
      ) : null}

      {/* Structured rather than free text, so "looking for partners" is a filter. */}
      {implementation?.collaboration ? (
        <div className="border-t bg-muted/40 px-5 py-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Handshake aria-hidden className="size-3.5" />
            {IMPLEMENTATION_LABELS.collaboration}:{" "}
            {implementation.collaboration.wanted ? "Ja" : "Nein"}
          </p>
          {implementation.collaboration.wanted &&
          implementation.collaboration.seeking ? (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {implementation.collaboration.seeking}
            </p>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}

/** "M — unter 10.000 €" → "unter 10.000 €"; the letter is already the badge. */
const stripBandPrefix = (label: string) => label.replace(/^\w+ — /, "");

/**
 * One group of the Steckbrief: an eyebrow label, its fields, a dividing rule.
 * The last group drops the rule so the box does not end on a floating line.
 */
function Group({
  label,
  children,
  last = false,
}: {
  label: string;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <section className={last ? "px-5 pb-4" : "border-b px-5 pb-4"}>
      <Eyebrow className="pb-2 pt-4">{label}</Eyebrow>
      <FieldList>{children}</FieldList>
    </section>
  );
}

function List({
  label,
  items,
}: {
  label: string;
  items: string[] | undefined;
}) {
  if (!items || items.length === 0) return null;
  return (
    <Field label={label}>
      <ul className="flex flex-col gap-0.5 font-normal">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Field>
  );
}
