"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

import { inputClass } from "@/components/export/fields";
import { LinksField } from "@/components/export/links-field";
import { OrganisationField } from "@/components/export/organisation-field";
import { ShareSteps, type ShareStage } from "@/components/export/share-steps";
import { StepList } from "@/components/export/step-list";
import { GroupCard } from "@/components/groups/group-card";
import { EntryLinks } from "@/components/use-cases/entry-links";
import { Button } from "@/components/ui/button";
import { Field, FieldList, Panel, Section } from "@/components/ui/layout";
import { InlineNotice, Notice } from "@/components/ui/notice";
import {
  emptyGroupDraft,
  GROUP_TEXT,
  groupDraftProblem,
  groupFromDraft,
  isInstallable,
  moveMember,
  selectionProblem,
  countUseCases,
  type GroupDraft,
} from "@/lib/groups";
import { slugify } from "@/lib/share/names";
import type { Organisation, UseCaseGroup } from "@/types/repo-list";
import { USE_CASE_THEMES } from "@/types/implementation";
import type { UseCase } from "@/types/use-cases";

const STEPS = ["Anwendungsfälle wählen", "Projekt beschreiben", "Vorschau & Vorschlagen"];
type Step = 1 | 2 | 3;

const PROPOSAL = "!42";
const SIMULATED = "Im Klickdummy nur simuliert - bei GitLab entsteht kein Vorschlag.";

const STAGES: readonly ShareStage[] = [
  { key: "propose", title: "Projekt vorschlagen", who: "Du" },
  { key: "review", title: "Prüfung", who: "Das Katalog-Team" },
];

const STORY_FIELDS: { key: "problem" | "goal" | "next"; label: string }[] = [
  { key: "problem", label: "Das Problem" },
  { key: "goal", label: "Das Ziel" },
  { key: "next", label: "Wie es weitergeht" },
];

const operatorOf = (useCase: UseCase) => useCase.implementation?.operator ?? useCase.publisher;

/**
 * „Projekt zusammenstellen“: a group made from use cases already in the
 * catalogue. Proposing it adds one catalogue entry and changes no package.
 * Played in the browser: nothing reaches GitLab.
 */
export function GroupWizard({
  useCases,
  organisations,
  groups,
  own,
}: {
  useCases: UseCase[];
  organisations: Organisation[];
  groups: UseCaseGroup[];
  /** This instance's organisation: its use cases come first, and it presets „Herausgeber“. */
  own?: Organisation;
}) {
  const [step, setStep] = useState<Step>(1);
  const [draft, setDraft] = useState<GroupDraft>(() => emptyGroupDraft(own));
  const [slugTouched, setSlugTouched] = useState(false);
  const [themesTouched, setThemesTouched] = useState(false);
  const [proposals, setProposals] = useState<Organisation[]>([]);
  const [problem, setProblem] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState<"propose" | "check">();
  const [result, setResult] = useState<{ tone: "success" | "neutral"; text: string }>();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (step === 1) return;
    heading.current?.focus();
    heading.current?.scrollIntoView({ block: "start" });
  }, [step]);

  const byId = new Map(useCases.map((useCase) => [useCase.id, useCase]));
  const chosen = draft.members.flatMap((member) => {
    const useCase = byId.get(member.id);
    return useCase ? [{ member, useCase }] : [];
  });
  const isOwn = (useCase: UseCase) => Boolean(own && useCase.implementation?.operatorOrg === own.id);
  const ownCases = useCases.filter(isOwn);
  const otherCases = useCases.filter((useCase) => !isOwn(useCase));
  const fromElsewhere = chosen.filter(({ useCase }) => !isOwn(useCase));
  const selection = selectionProblem(draft.members);

  const edit = (patch: Partial<GroupDraft>) => setDraft((before) => ({ ...before, ...patch }));
  const toggle = (id: string) =>
    edit({
      members: draft.members.some((member) => member.id === id)
        ? draft.members.filter((member) => member.id !== id)
        : [...draft.members, { id, optional: false }],
    });
  const editMember = (index: number, patch: { optional?: boolean; note?: string }) =>
    edit({ members: draft.members.map((member, at) => (at === index ? { ...member, ...patch } : member)) });

  const toDescribe = () => {
    // Themes start from the chosen use cases until someone picks them by hand.
    if (!themesTouched) {
      const themes = new Set(chosen.flatMap(({ useCase }) => useCase.categories));
      edit({ categories: USE_CASE_THEMES.filter((theme) => themes.has(theme)) });
    }
    setStep(2);
  };
  const toPreview = (event: FormEvent) => {
    event.preventDefault();
    const found = groupDraftProblem(draft, groups);
    setProblem(found);
    if (!found) setStep(3);
  };
  const play = (action: "propose" | "check") => {
    setPending(action);
    window.setTimeout(() => {
      setPending(undefined);
      if (action === "propose") {
        setSubmitted(true);
        setResult({
          tone: "success",
          text: `Zur Prüfung eingereicht (Vorschlag ${PROPOSAL}). Sobald das Katalog-Team ihn angenommen hat, steht „${draft.title.trim()}“ im Katalog.`,
        });
      } else {
        setResult({ tone: "neutral", text: `Projekt in Prüfung (Vorschlag ${PROPOSAL}) - das Katalog-Team hat noch nicht entschieden.` });
      }
    }, 900);
  };

  const options = {
    listed: organisations,
    proposals,
    onPropose: (organisation: Organisation) =>
      setProposals((before) => [...before.filter((row) => row.id !== organisation.id), organisation]),
  };

  return (
    <div className="flex flex-col gap-6">
      <StepList labels={STEPS} current={step} />

      {step === 1 ? (
        <Section
          title="Welche Anwendungsfälle gehören dazu?"
          lead="Wähle mindestens zwei aus dem Katalog. Sie bleiben, wie sie sind: das Projekt verweist nur auf sie."
        >
          <div className="flex flex-col gap-6">
            {own ? <Choices legend={`Von ${own.name}`} useCases={ownCases} chosen={draft.members} onToggle={toggle} /> : null}
            <Choices legend="Von anderen Organisationen" useCases={otherCases} chosen={draft.members} onToggle={toggle} />

            {chosen.length ? (
              <Panel title={`Ausgewählt: ${countUseCases(chosen.length)}`}>
                <ol className="flex flex-col gap-5">
                  {chosen.map(({ member, useCase }, index) => (
                    <li key={member.id} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                      <span className="w-6 shrink-0 pt-2 text-sm tabular-nums text-muted-foreground">{index + 1}.</span>
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <p className="pt-2 text-sm font-medium text-foreground">{useCase.title}</p>
                        <input
                          className={inputClass}
                          aria-label={`Warum gehört „${useCase.title}“ dazu?`}
                          placeholder="Warum gehört er dazu? Ein Satz, freiwillig"
                          value={member.note ?? ""}
                          onChange={(event) => editMember(index, { note: event.target.value || undefined })}
                        />
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            className="size-4 accent-primary"
                            checked={member.optional}
                            onChange={(event) => editMember(index, { optional: event.target.checked })}
                          />
                          Optional - das Projekt funktioniert auch ohne
                        </label>
                      </div>
                      <div className="flex shrink-0 gap-1 sm:pt-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`„${useCase.title}“ nach oben`}
                          disabled={index === 0}
                          onClick={() => edit({ members: moveMember(draft.members, index, -1) })}
                        >
                          <ArrowUp />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`„${useCase.title}“ nach unten`}
                          disabled={index === chosen.length - 1}
                          onClick={() => edit({ members: moveMember(draft.members, index, 1) })}
                        >
                          <ArrowDown />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ol>
                <label className="mt-5 flex items-start gap-2 border-t pt-4 text-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5 size-4 accent-primary"
                    checked={draft.ordered}
                    onChange={(event) => edit({ ordered: event.target.checked })}
                  />
                  <span>
                    Die Reihenfolge ist eine Empfehlung
                    <span className="block text-xs text-muted-foreground">
                      Dann nummeriert die Projektseite die Anwendungsfälle, zum Aufbauen nacheinander.
                    </span>
                  </span>
                </label>
              </Panel>
            ) : null}

            {fromElsewhere.length ? (
              <InlineNotice tone="neutral">
                {fromElsewhere.map(({ useCase }) => `„${useCase.title}“ (${operatorOf(useCase)})`).join(", ")}{" "}
                {fromElsewhere.length === 1 ? "erscheint" : "erscheinen"} im Projekt mit dem eigenen Herausgeber. Ändern kann den
                Anwendungsfall weiter nur, wer ihn geteilt hat.
              </InlineNotice>
            ) : null}

            <div className="flex flex-wrap items-center justify-end gap-3">
              {selection && chosen.length ? <InlineNotice tone="warn">{selection}</InlineNotice> : null}
              <Button type="button" disabled={Boolean(selection)} onClick={toDescribe}>
                Weiter
              </Button>
            </div>
          </div>
        </Section>
      ) : null}

      {step === 2 ? (
        <form noValidate onSubmit={toPreview} className="flex flex-col gap-6">
          <Section>
            <h2 ref={heading} tabIndex={-1} className="mb-6 text-xl font-semibold text-foreground outline-none">
              Projekt beschreiben
            </h2>
            <div className="flex flex-col gap-5">
              <TextField
                label="Name *"
                value={draft.title}
                onChange={(title) => edit({ title, ...(slugTouched ? {} : { slug: slugify(title) }) })}
              />
              <TextField
                label="Kurzname *"
                hint={`Steht in der Adresse: /marketplace/projekte/${draft.slug || "kurzname"}. Kleinbuchstaben, Ziffern und Bindestriche.`}
                value={draft.slug}
                onChange={(slug) => {
                  setSlugTouched(true);
                  edit({ slug });
                }}
              />
              <TextField
                label="Kurzbeschreibung *"
                hint="Ein Satz. Er steht auf der Karte in der Liste."
                value={draft.summary}
                onChange={(summary) => edit({ summary })}
              />
              <TextField
                label="Beschreibung"
                hint="Was die Anwendungsfälle zusammen leisten."
                multiline
                value={draft.description}
                onChange={(description) => edit({ description })}
              />

              <fieldset className="flex flex-col gap-4 border-t pt-5">
                <legend className="text-sm font-semibold text-foreground">Worum es geht</legend>
                <p className="-mt-2 text-xs text-muted-foreground">Freiwillig. So sehen andere Kommunen schnell, ob das Projekt zu ihnen passt.</p>
                {STORY_FIELDS.map(({ key, label }) => (
                  <TextField key={key} label={label} multiline value={draft[key]} onChange={(value) => edit({ [key]: value } as Partial<GroupDraft>)} />
                ))}
              </fieldset>

              <div className="border-t pt-5">
                <LinksField
                  value={draft.links}
                  onChange={(links) => edit({ links })}
                  hint="Erscheinen auf der Projektseite unter „Worum es geht“, zum Beispiel die Smart-City-Strategie oder ein Ratsbeschluss."
                />
              </div>

              <fieldset className="flex flex-col gap-2 border-t pt-5">
                <legend className="text-sm font-semibold text-foreground">Themengebiet</legend>
                <p className="-mt-1 text-xs text-muted-foreground">Vorgeschlagen aus den gewählten Anwendungsfällen.</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {USE_CASE_THEMES.map((theme) => (
                    <label key={theme} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="size-4 accent-primary"
                        checked={draft.categories.includes(theme)}
                        onChange={(event) => {
                          setThemesTouched(true);
                          edit({
                            categories: event.target.checked
                              ? USE_CASE_THEMES.filter((row) => row === theme || draft.categories.includes(row))
                              : draft.categories.filter((row) => row !== theme),
                          });
                        }}
                      />
                      {theme}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="flex flex-col gap-5 border-t pt-5">
                <OrganisationField
                  id="group-publisher"
                  label="Herausgeber *"
                  value={draft.publisher}
                  options={options}
                  required
                  onChange={(publisher) => edit({ publisher })}
                />
                <TextField label="Kontakt: Name" value={draft.contactName} onChange={(contactName) => edit({ contactName })} />
                <TextField
                  label="Kontakt: E-Mail"
                  hint="Eine Team-Adresse, keine persönliche: der Eintrag ist öffentlich."
                  value={draft.contactEmail}
                  onChange={(contactEmail) => edit({ contactEmail })}
                />
              </div>
            </div>
          </Section>

          {problem ? (
            <Notice tone="warn" live>
              {problem}
            </Notice>
          ) : null}
          <div className="flex flex-wrap justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
              Zurück
            </Button>
            <Button type="submit">Vorschau ansehen</Button>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 ref={heading} tabIndex={-1} className="text-xl font-semibold text-foreground outline-none">
                Vorschau & Vorschlagen
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                So erscheint das Projekt im Katalog. Die Anwendungsfälle selbst ändern sich nicht: es entsteht nur ein neuer
                Katalog-Eintrag, den das Katalog-Team prüft.
              </p>
            </div>
            <Button type="button" variant="ghost" disabled={Boolean(pending) || submitted} onClick={() => setStep(2)}>
              Beschreibung bearbeiten
            </Button>
          </div>

          <ShareSteps
            submitted={submitted}
            pending={pending}
            onPropose={() => play("propose")}
            onCheck={() => play("check")}
            stages={STAGES}
            intro="Zwei Schritte bis in den Katalog - den ersten machst du hier."
            subject="das Projekt"
            leaveNote="Du kannst diese Seite jetzt verlassen. Nach der Prüfung steht das Projekt im Katalog bei den Anwendungsfällen."
          />
          {result ? (
            <Notice tone={result.tone} live>
              <p>{result.text}</p>
              <p className="mt-1 text-xs text-muted-foreground">{SIMULATED}</p>
            </Notice>
          ) : null}

          <Preview draft={draft} chosen={chosen.map(({ useCase }) => useCase)} isOwn={isOwn} />
        </>
      ) : null}
    </div>
  );
}

function Choices({
  legend,
  useCases,
  chosen,
  onToggle,
}: {
  legend: string;
  useCases: UseCase[];
  chosen: GroupDraft["members"];
  onToggle: (id: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold text-foreground">{legend}</legend>
      {useCases.length === 0 ? <p className="text-sm text-muted-foreground">Keine im Katalog.</p> : null}
      {useCases.map((useCase) => (
        <label key={useCase.id} className="flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 hover:bg-muted/40">
          <input
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 accent-primary"
            checked={chosen.some((member) => member.id === useCase.id)}
            onChange={() => onToggle(useCase.id)}
          />
          <span className="min-w-0">
            <span className="block text-sm font-medium text-foreground">{useCase.title}</span>
            <span className="block text-xs text-muted-foreground">
              {operatorOf(useCase)}
              {isInstallable(useCase) ? "" : " · nur beschrieben, kein Paket"}
            </span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}

function Preview({ draft, chosen, isOwn }: { draft: GroupDraft; chosen: UseCase[]; isOwn: (useCase: UseCase) => boolean }) {
  const group = groupFromDraft(draft);
  const story = STORY_FIELDS.filter(({ key }) => draft[key].trim());
  return (
    <div className="grid items-start gap-6 md:grid-cols-[minmax(0,20rem)_1fr]">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">In der Liste</p>
        <GroupCard group={group} members={chosen} preview />
      </div>
      <Panel title="Auf der Projektseite">
        <FieldList>
          <Field label="Adresse">/marketplace/projekte/{group.id}</Field>
          <Field label="Herausgeber">{group.publisher}</Field>
          <Field label={`Anwendungsfälle (${chosen.length})`} hint={draft.ordered ? "Nummeriert, in dieser Reihenfolge." : undefined}>
            <ol className="flex flex-col gap-0.5 font-normal">
              {chosen.map((useCase, index) => (
                <li key={useCase.id}>
                  {draft.ordered ? `${index + 1}. ` : ""}
                  {useCase.title}
                  {draft.members[index]?.optional ? " (optional)" : ""}
                  {isOwn(useCase) ? "" : ` - von ${operatorOf(useCase)}`}
                </li>
              ))}
            </ol>
          </Field>
          <Field label="Themengebiet">{group.categories.length ? group.categories.join(", ") : "Keine Angabe"}</Field>
          <Field label="Worum es geht">{story.length ? story.map(({ label }) => label).join(", ") : "Keine Angabe"}</Field>
          {group.links.length ? null : <Field label="Weiterführende Links">Keine</Field>}
          <Field label="Kontakt">{group.contact ? group.contact.email : "Keine Angabe"}</Field>
        </FieldList>
        <EntryLinks links={group.links} className="mt-4" />
        <p className="mt-4 border-t pt-3 text-xs leading-relaxed text-muted-foreground">
          Auf den Seiten der Anwendungsfälle steht dann: {GROUP_TEXT.partOf} „{group.title}“ ({countUseCases(chosen.length)}).
        </p>
      </Panel>
    </div>
  );
}

function TextField({
  label,
  hint,
  value,
  multiline = false,
  onChange,
}: {
  label: string;
  hint?: ReactNode;
  value: string;
  multiline?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {multiline ? (
        <textarea className={`${inputClass} min-h-20`} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}
