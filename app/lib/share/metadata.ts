import { TRANSFERABILITY_HINTS, TRANSFERABILITY_LABELS } from "@/types/curation-tier";
import {
  COLLABORATION_LABELS,
  COST_BAND_LABELS,
  EFFORT_BAND_LABELS,
  LOGIC_MODEL_STEPS,
  USE_CASE_STATUS_LABELS,
} from "@/types/implementation";

/**
 * The Steckbrief's fields beyond the basics, grouped as the marketplace's
 * share form groups them, with its labels. The paths follow this app's own
 * catalogue model (`types/implementation.ts`).
 */
export interface MetadataField {
  path: string;
  label: string;
  /** `organisation`: written by the lead organisation's picker, never a field of its own. */
  kind?: "multiline" | "list" | "email" | "url" | "organisation";
  options?: Record<string, string>;
  /** What the chosen option means; shown under the select in place of the hint. */
  optionHints?: Record<string, string>;
  hint?: string;
}

export const LEAD_PATH = "implementation.operator";
export const LEAD_CODE_PATH = "implementation.operatorOrg";

export const METADATA_GROUPS: { title: string; fields: MetadataField[] }[] = [
  {
    title: "Umsetzung & Beteiligte",
    fields: [
      { path: "implementation.status", label: "Stand der Umsetzung", options: USE_CASE_STATUS_LABELS },
      {
        path: "transferability",
        label: "Übertragbarkeit",
        options: TRANSFERABILITY_LABELS,
        optionHints: TRANSFERABILITY_HINTS,
        hint: "Wie viel davon kann eine andere Kommune übernehmen?",
      },
      { path: LEAD_PATH, label: "Federführende Organisation" },
      { path: LEAD_CODE_PATH, label: "Federführende Organisation (Kürzel)", kind: "organisation" },
      { path: "implementation.parties.stakeholders", label: "Relevante Stakeholder", kind: "list" },
      { path: "implementation.parties.serviceProviders", label: "Dienstleister", kind: "list" },
      { path: "implementation.stack", label: "Eingesetzte Technik", kind: "list" },
    ],
  },
  {
    title: "Kontakt",
    fields: [
      { path: "contact.name", label: "Name / Kontaktstelle" },
      { path: "contact.role", label: "Rolle" },
      { path: "contact.email", label: "E-Mail", kind: "email" },
      { path: "contact.url", label: "Kontaktseite", kind: "url", hint: "HTTPS-Adresse. Ein Kontakt braucht eine E-Mail oder eine Kontaktseite." },
    ],
  },
  {
    title: "Kosten & Ressourcen",
    fields: [
      {
        path: "implementation.resources.costBand",
        label: "Geschätzte Gesamtkosten (36 Monate)",
        options: COST_BAND_LABELS,
        hint: "Gesamtkosten über 36 Monate - die Frage aus dem CIVITAS-Connect-Formular. Enthält die laufenden Kosten bereits; nicht zusätzlich unter „Aufbaukosten“ eintragen.",
      },
      { path: "implementation.resources.setupCost", label: "Aufbaukosten (einmalig)", options: COST_BAND_LABELS },
      { path: "implementation.resources.runningCost", label: "Laufende Kosten (jährlich)", options: COST_BAND_LABELS },
      { path: "implementation.resources.effortBand", label: "Ressourceneinsatz", options: EFFORT_BAND_LABELS },
      { path: "implementation.resources.funding", label: "Finanzierung" },
      { path: "implementation.resources.note", label: "Anmerkung zu Ressourceneinsatz", kind: "multiline" },
    ],
  },
  {
    title: "Wirkungslogik",
    fields: LOGIC_MODEL_STEPS.map((step) => ({
      path: `implementation.logicModel.${step.key}`,
      label: `${step.label} - ${step.gloss}`,
      hint: step.hint,
      kind: "multiline" as const,
    })),
  },
  {
    title: "Kooperation & Referenz",
    fields: [
      {
        path: "implementation.collaboration.wanted",
        label: "Kooperationsbedarf",
        options: { true: COLLABORATION_LABELS.sought, false: COLLABORATION_LABELS.notSought },
      },
      { path: "implementation.collaboration.seeking", label: "Gesuchte Unterstützung", kind: "multiline" },
      { path: "implementation.reference.url", label: "Ausführliche Beschreibung", kind: "url", hint: "HTTPS-Adresse" },
      { path: "implementation.reference.source", label: "Quelle / Sammlung" },
    ],
  },
];

export const METADATA_FIELDS = METADATA_GROUPS.flatMap((group) => group.fields);

export interface MetadataDraft {
  fields: Record<string, string>;
  themes: string[];
  media: { src: string; alt: string; caption: string }[];
}

export function emptyMetadata(themes: string[] = []): MetadataDraft {
  return { fields: Object.fromEntries(METADATA_FIELDS.map((field) => [field.path, ""])), themes, media: [] };
}

/** The line under a field: what the chosen option means, else the field's own hint. */
export const fieldHint = (field: MetadataField, value: string): string | undefined =>
  field.optionHints?.[value] ?? field.hint ?? (field.kind === "list" ? "Ein Eintrag pro Zeile." : undefined);

/** The filled-in fields, as the package's manifest would carry them. */
export function filledFields(draft: MetadataDraft): MetadataField[] {
  return METADATA_FIELDS.filter((field) => field.kind !== "organisation" && draft.fields[field.path]?.trim());
}
