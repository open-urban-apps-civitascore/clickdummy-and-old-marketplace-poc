"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Eye } from "lucide-react";

import { inputClass } from "@/components/export/fields";
import { MetadataForm } from "@/components/export/metadata-form";
import { OrganisationField } from "@/components/export/organisation-field";
import { demoIds, PackageContents } from "@/components/export/package-contents";
import { ShareSteps } from "@/components/export/share-steps";
import { Button } from "@/components/ui/button";
import { Disclosure } from "@/components/ui/disclosure";
import { Section } from "@/components/ui/layout";
import { InlineNotice, Notice, Pending } from "@/components/ui/notice";
import type { ShareDataset } from "@/lib/share/datasets";
import { emptyMetadata, filledFields, LEAD_CODE_PATH, LEAD_PATH, type MetadataDraft } from "@/lib/share/metadata";
import { withLeadDefault } from "@/lib/share/organisations";
import { buildPreview, IDENTITY_KINDS, type PackagePreview } from "@/lib/share/preview";
import { addressHref, addressProblem, startingBasics, steckbriefProblem, type SteckbriefBasics } from "@/lib/share/steckbrief";
import type { Organisation } from "@/types/repo-list";

const STEPS = ["Auswählen", "Steckbrief ergänzen", "Vorschau & Teilen"];
type Step = 1 | 2 | 3;

/** The merge request number the simulation hands out. */
const PROPOSAL = "!41";
const SIMULATED = "Im Klickdummy nur simuliert - bei GitLab entsteht kein Vorschlag.";

const BASIC_FIELDS: { key: "displayName" | "maintainer" | "license" | "keywords"; label: string; hint?: string }[] = [
  { key: "displayName", label: "Name im Katalog *" },
  { key: "maintainer", label: "Herausgeber *" },
  { key: "license", label: "Lizenz *" },
  { key: "keywords", label: "Schlagworte", hint: "Mit Komma trennen." },
];

const ADDRESS_FIELDS: { key: "publisher" | "slug" | "domain"; label: string; hint: string }[] = [
  { key: "publisher", label: "Herausgeber-Kürzel *", hint: "Steht vorn in der Adresse, zum Beispiel openurbanapps. 2 bis 40 Kleinbuchstaben oder Ziffern." },
  {
    key: "slug",
    label: "Kurzname *",
    hint: "Steht hinten in der Adresse, zum Beispiel baumkataster-mitte. 2 bis 60 Kleinbuchstaben, Ziffern oder Bindestriche, nicht am Anfang oder Ende.",
  },
  {
    key: "domain",
    label: "Fachgebiet *",
    hint: "Auf Englisch, zum Beispiel environment, mobility oder general - es steht in den Kennungen der Bausteine. 2 bis 40 Kleinbuchstaben oder Ziffern.",
  },
];

function Steps({ current }: { current: Step }) {
  return (
    <ol aria-label="Fortschritt" className="grid gap-2 sm:grid-cols-3">
      {STEPS.map((label, index) => (
        <li
          key={label}
          aria-current={current === index + 1 ? "step" : undefined}
          className={`rounded-lg border px-3 py-3 text-sm ${current === index + 1 ? "border-primary bg-primary/5 font-semibold text-primary" : "text-muted-foreground"}`}
        >
          <span className="mr-2">{index + 1}.</span>
          {label}
        </li>
      ))}
    </ol>
  );
}

/**
 * „Neues Paket teilen“ as the marketplace has it (rc.13): choose a dataset,
 * complete the Steckbrief, check the preview and submit. Played in the
 * browser: the preview is worked out here and submitting reaches no GitLab.
 */
export function ShareWizard({
  datasets,
  organisations,
  own,
}: {
  datasets: ShareDataset[];
  organisations: Organisation[];
  /** This instance's organisation, preset as „Herausgeber“. */
  own?: Organisation;
}) {
  const [datasetId, setDatasetId] = useState("");
  const [step, setStep] = useState<Step>(1);
  const dataset = datasets.find((row) => row.id === datasetId);

  return (
    <div className="flex flex-col gap-6">
      <Steps current={dataset ? step : 1} />
      {step === 1 || !dataset ? (
        <Section title="Welchen Datensatz möchtest du teilen?">
          <label className="flex flex-col gap-2 text-sm">
            <span>Datensatz</span>
            <select
              className={inputClass}
              value={datasetId}
              onChange={(event) => {
                setDatasetId(event.target.value);
                setStep(1);
              }}
            >
              <option value="" disabled>
                Bitte auswählen …
              </option>
              {datasets.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name}
                  {row.catalog ? ` - im Katalog als „${row.catalog.displayName}“` : ""}
                </option>
              ))}
            </select>
          </label>
          {dataset?.catalog ? (
            <Notice tone="neutral" className="mt-4">
              „{dataset.name}“ steht im Katalog als „{dataset.catalog.displayName}“, Version {dataset.catalog.version}. Du teilst eine neue
              Version.
            </Notice>
          ) : null}
        </Section>
      ) : null}
      {dataset ? (
        <ShareEditor key={dataset.id} dataset={dataset} organisations={organisations} own={own} step={step} onStep={setStep} />
      ) : null}
    </div>
  );
}

function ShareEditor({
  dataset,
  organisations,
  own,
  step,
  onStep,
}: {
  dataset: ShareDataset;
  organisations: Organisation[];
  own?: Organisation;
  step: Step;
  onStep: (step: Step) => void;
}) {
  const [basics, setBasics] = useState<SteckbriefBasics>(() => startingBasics(dataset, own));
  const [metadata, setMetadata] = useState<MetadataDraft>(() => emptyMetadata(dataset.catalog?.themes));
  const [proposals, setProposals] = useState<Organisation[]>([]);
  const [excluded, setExcluded] = useState<ReadonlySet<string>>(new Set());
  const [problem, setProblem] = useState<string>();
  const [preview, setPreview] = useState<PackagePreview>();
  const [making, setMaking] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState<"propose" | "check">();
  const [result, setResult] = useState<{ tone: "success" | "neutral"; text: string }>();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (step === 1) return;
    heading.current?.focus();
    heading.current?.scrollIntoView({ block: "start" });
  }, [step]);

  const known = [...organisations, ...proposals];
  const options = {
    listed: organisations,
    proposals,
    onPropose: (organisation: Organisation) => setProposals((before) => [...before.filter((row) => row.id !== organisation.id), organisation]),
  };
  const publisher = { name: basics.maintainer, code: basics.maintainerOrg };
  const lacksStructure = !dataset.parts.some((part) => part.kind === "structure");
  const chosenDemo = demoIds(dataset).filter((id) => !excluded.has(id)).length;
  const edit = (key: keyof SteckbriefBasics, value: string) => setBasics({ ...basics, [key]: value });
  const toggleDemo = (id: string) =>
    setExcluded((before) => {
      const next = new Set(before);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // The lead as it goes into the package: empty means the Herausgeber.
  const lead = withLeadDefault({ operator: metadata.fields[LEAD_PATH]?.trim() ?? "", operatorOrg: metadata.fields[LEAD_CODE_PATH] ?? "" }, publisher);
  const sent: MetadataDraft = { ...metadata, fields: { ...metadata.fields, [LEAD_PATH]: lead.operator, [LEAD_CODE_PATH]: lead.operatorOrg } };

  const makePreview = (event: FormEvent) => {
    event.preventDefault();
    const found = steckbriefProblem(dataset, basics, metadata, known);
    setProblem(found);
    if (found) return;
    setMaking(true);
    onStep(3);
    window.setTimeout(() => {
      setPreview(buildPreview(dataset, basics, chosenDemo));
      setMaking(false);
    }, 600);
  };
  const play = (action: "propose" | "check") => {
    setPending(action);
    window.setTimeout(() => {
      setPending(undefined);
      if (action === "propose") {
        setSubmitted(true);
        setResult({
          tone: "success",
          text: `Zur Prüfung eingereicht (Vorschlag ${PROPOSAL}). Sobald das Katalog-Team das Paket angenommen hat, schlägst du unter „In Arbeit“ den Katalog-Eintrag vor.`,
        });
      } else {
        setResult({ tone: "neutral", text: `Paket in Prüfung (Vorschlag ${PROPOSAL}) - das Katalog-Team hat noch nicht entschieden.` });
      }
    }, 900);
  };

  if (step === 1) {
    return (
      <Section title="Was kommt ins Paket?" lead={<>Das gehört zum Datensatz „{dataset.name}“ - in der Reihenfolge, in der die Daten fließen.</>}>
        <div className="flex flex-col gap-4">
          <PackageContents dataset={dataset} excluded={excluded} onToggle={toggleDemo} />
          {lacksStructure ? (
            <Notice tone="warn" title="Es fehlt eine eigene Datenstruktur">
              Ohne eigene Datenstruktur lässt sich das Paket nicht teilen - die Paketprüfung verlangt mindestens eine.
            </Notice>
          ) : null}
          <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">Nicht im Paket: gespeicherte Daten, der Datenpool und Zugangsdaten.</p>
            <div className="flex flex-wrap items-center gap-3">
              {lacksStructure ? (
                <InlineNotice tone="warn" id="steckbrief-gesperrt">
                  Geht erst mit einer eigenen Datenstruktur.
                </InlineNotice>
              ) : null}
              <Button type="button" disabled={lacksStructure} aria-describedby={lacksStructure ? "steckbrief-gesperrt" : undefined} onClick={() => onStep(2)}>
                Weiter zum Steckbrief
              </Button>
            </div>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">
          <span className="text-muted-foreground">Datensatz: </span>
          <strong>{dataset.name}</strong>
        </p>
        {step === 3 ? (
          <Button type="button" variant="ghost" disabled={Boolean(pending)} onClick={() => onStep(1)}>
            Zurück zur Auswahl
          </Button>
        ) : null}
      </div>

      {step === 2 ? (
        <form className="flex flex-col gap-6" onSubmit={makePreview}>
          <div>
            <h2 ref={heading} tabIndex={-1} className="scroll-mt-20 text-xl font-semibold focus:outline-none">
              Steckbrief ergänzen
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Pflichtfelder sind mit * markiert. Weitere Angaben kannst du ergänzen, soweit sie bekannt sind.</p>
            <div className="mt-3 flex flex-col gap-2 empty:hidden">
              {dataset.catalog && !submitted ? (
                <Notice tone="neutral">
                  Vorbelegt aus dem Katalog-Eintrag „{dataset.catalog.displayName}“, Version {dataset.catalog.version}.
                </Notice>
              ) : null}
              {submitted ? (
                <Notice tone="neutral">
                  Für Version {basics.version} ist schon ein Vorschlag in Prüfung ({PROPOSAL}). Er enthält den vorherigen Stand - Änderungen gehen
                  erst, wenn er angenommen oder zurückgezogen ist, dann mit einer neuen Version.
                </Notice>
              ) : null}
            </div>
          </div>
          <section className="grid gap-4 rounded-xl border bg-card p-5 md:grid-cols-2">
            <h3 className="font-semibold md:col-span-2">Grundangaben</h3>
            {BASIC_FIELDS.map(({ key, label, hint }) =>
              key === "maintainer" ? (
                <OrganisationField
                  key={key}
                  id="herausgeber"
                  label={label}
                  required
                  value={publisher}
                  options={options}
                  onChange={(choice) => setBasics({ ...basics, maintainer: choice.name, maintainerOrg: choice.code })}
                />
              ) : (
                <label key={key} className="flex flex-col gap-1 text-sm">
                  <span>{label}</span>
                  <input className={inputClass} value={basics[key]} required={key !== "keywords"} onChange={(event) => edit(key, event.target.value)} />
                  {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
                </label>
              ),
            )}
            <label className="flex flex-col gap-1 text-sm md:col-span-2">
              <span>Kurzbeschreibung *</span>
              <textarea rows={4} className={inputClass} value={basics.description} required onChange={(event) => edit("description", event.target.value)} />
            </label>
          </section>
          <MetadataForm value={metadata} onChange={setMetadata} organisations={{ ...options, publisher }} />
          <section className="grid gap-4 rounded-xl border bg-card p-5 md:grid-cols-2">
            <h3 className="font-semibold md:col-span-2">Adresse und Version im Katalog</h3>
            <p className="text-sm text-muted-foreground md:col-span-2">
              {dataset.catalog
                ? "Die nächste Version ist vorgeschlagen. Für eine eigenständige Variante kannst du die Adresse ändern."
                : "Die Adresse ist aus dem Namen des Datensatzes gebildet. Ändern musst du sie nur, wenn sie anders lauten soll."}
            </p>
            <label className="flex flex-col gap-1 text-sm">
              <span>Version *</span>
              <input className={inputClass} value={basics.version} required onChange={(event) => edit("version", event.target.value)} />
              <span className="text-xs text-muted-foreground">Drei Zahlen mit Punkt, zum Beispiel 1.0.0. Eine neue Version muss höher sein als die letzte.</span>
            </label>
            <p className="text-sm md:col-span-2">
              <span className="text-muted-foreground">Adresse im Katalog: </span>
              <span className="break-all">{addressHref(basics)}</span>
            </p>
            <Disclosure className="md:col-span-2" summary="Adresse ändern" defaultOpen={Boolean(addressProblem(basics))}>
              <div className="grid gap-4 md:grid-cols-2">
                {ADDRESS_FIELDS.map(({ key, label, hint }) => (
                  <label key={key} className="flex flex-col gap-1 text-sm">
                    <span>{label}</span>
                    <input className={inputClass} value={basics[key]} required onChange={(event) => edit(key, event.target.value)} />
                    <span className="text-xs text-muted-foreground">{hint}</span>
                  </label>
                ))}
              </div>
            </Disclosure>
            <label className="flex flex-col gap-1 text-sm md:col-span-2">
              <span>Ablageort</span>
              <select className={inputClass} value="katalog" onChange={() => undefined}>
                <option value="katalog">Katalog-Repo (packages/)</option>
              </select>
              <span className="text-xs text-muted-foreground">Wo das Paket bei GitLab abgelegt wird.</span>
            </label>
          </section>
          {problem ? (
            <Notice tone="error" live>
              {problem}
            </Notice>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => onStep(1)}>
              Zurück zur Auswahl
            </Button>
            <Button type="submit">
              <Eye />
              Vorschau erstellen
            </Button>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 ref={heading} tabIndex={-1} className="scroll-mt-20 text-xl font-semibold focus:outline-none">
                Vorschau & Teilen
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Prüfe Steckbrief und Paket. Nach dem Einreichen prüft das Katalog-Team zweimal: erst das Paket, dann den Katalog-Eintrag, den du
                dazwischen vorschlägst.
              </p>
            </div>
            <Button type="button" variant="ghost" disabled={Boolean(pending)} onClick={() => onStep(2)}>
              Steckbrief bearbeiten
            </Button>
          </div>
          {making || !preview ? (
            <Pending>Vorschau wird erstellt …</Pending>
          ) : (
            <>
              <ShareSteps submitted={submitted} pending={pending} onPropose={() => play("propose")} onCheck={() => play("check")} />
              {result ? (
                <Notice tone={result.tone} live>
                  <p>{result.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{SIMULATED}</p>
                </Notice>
              ) : null}
              <section className="rounded-xl border bg-card p-5">
                <h3 className="text-lg font-semibold">{basics.displayName}</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm">{basics.description}</p>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  {(
                    [
                      ["Herausgeber", basics.maintainer],
                      ["Lizenz", basics.license],
                      ["Schlagworte", basics.keywords],
                      ["Version", basics.version],
                      ["Adresse im Katalog", addressHref(basics)],
                      ["Fachgebiet", basics.domain],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="break-words">{value || "Keine Angabe"}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5">
                  <MetadataReview metadata={sent} />
                </div>
              </section>
              <PreviewDetails preview={preview} />
            </>
          )}
        </>
      ) : null}
    </div>
  );
}

function MetadataReview({ metadata }: { metadata: MetadataDraft }) {
  return (
    <dl className="grid gap-4 text-sm sm:grid-cols-2">
      {metadata.themes.length ? (
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Themengebiete</dt>
          <dd>{metadata.themes.join(", ")}</dd>
        </div>
      ) : null}
      {filledFields(metadata).map((field) => (
        <div key={field.path}>
          <dt className="text-muted-foreground">{field.label}</dt>
          <dd className="whitespace-pre-wrap break-words">{field.options?.[metadata.fields[field.path]] ?? metadata.fields[field.path]}</dd>
        </div>
      ))}
      {metadata.media
        .filter((item) => item.src.trim())
        .map((item, index) => (
          <div key={index} className="sm:col-span-2">
            <dt className="text-muted-foreground">Bild {index + 1}</dt>
            <dd className="break-all">{item.src}</dd>
            <dd>{item.alt}</dd>
            {item.caption ? <dd className="text-muted-foreground">{item.caption}</dd> : null}
          </div>
        ))}
    </dl>
  );
}

function PreviewDetails({ preview }: { preview: PackagePreview }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 text-sm">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-medium text-foreground">{preview.displayName}</span>
        <span className="rounded bg-status-label px-1.5 py-0.5 text-xs">v{preview.version}</span>
      </div>
      <Disclosure summary="Technische Angaben">
        <dl className="grid gap-1 text-xs text-muted-foreground">
          <div>
            <dt className="inline">Kennung im Katalog: </dt>
            <dd className="inline break-all font-mono">{preview.id}</dd>
          </div>
          <div>
            <dt className="inline">Ordner im Ablageort: </dt>
            <dd className="inline break-all font-mono">{preview.packageDir}/</dd>
          </div>
          <div>
            <dt className="inline">Zweig bei GitLab: </dt>
            <dd className="inline break-all font-mono">{preview.branch}</dd>
          </div>
        </dl>
      </Disclosure>
      <p className="text-sm">
        {preview.demoStreams
          ? `Demo-Daten: ${preview.demoStreams === 1 ? "ein Datenstrom" : `${preview.demoStreams} Datenströme`}. Eine Installation startet sie im Simulator für ihre eigenen Datenquellen.`
          : "Das Paket bringt keine Demo-Daten mit. Nach der Installation fließen erst Daten, wenn eine echte Quelle angebunden ist."}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] text-xs">
          <thead className="border-b text-left uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-2 py-1 font-medium">Datei</th>
              <th className="px-2 py-1 text-right font-medium">Bytes</th>
            </tr>
          </thead>
          <tbody>
            {preview.files.map((file) => (
              <tr key={file.path} className="border-b last:border-0">
                <td className="break-all px-2 py-1 font-mono text-foreground">{file.path}</td>
                <td className="px-2 py-1 text-right tabular-nums text-muted-foreground">{file.bytes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-xs">
          <thead className="border-b text-left uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-2 py-1 font-medium">Baustein</th>
              <th className="px-2 py-1 font-medium">Kennung im Paket</th>
              <th className="px-2 py-1 font-medium">Herkunft</th>
            </tr>
          </thead>
          <tbody>
            {preview.identities.map((identity) => (
              <tr key={`${identity.kind}-${identity.to}`} className="border-b last:border-0">
                <td className="px-2 py-1 text-foreground">
                  {identity.title} <span className="text-muted-foreground">({IDENTITY_KINDS[identity.kind] ?? identity.kind})</span>
                </td>
                <td className="break-all px-2 py-1 font-mono text-muted-foreground">{identity.to}</td>
                <td className="px-2 py-1 text-muted-foreground">{identity.kept ? "aus dem Katalog, unverändert" : "neu vergeben"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <List title="Entfernte Zugangsdaten" items={preview.stripped.length ? preview.stripped : ["keine - das Paket enthielt keine Zugangsdaten"]} />
      <List title="Wird bei der Installation abgefragt" items={preview.parameters.length ? preview.parameters : ["keine"]} />
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <ul className="mt-1 list-disc pl-5 text-xs text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="break-all">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
