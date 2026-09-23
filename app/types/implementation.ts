import { z } from "zod";

/**
 * How a use case was realised in practice, by whom, at what cost — the part of
 * a catalog entry that DESCRIBES an implementation rather than shipping one.
 *
 * Deliberately orthogonal to installability: a packaged entry may carry it too
 * ("this is who runs it in production"), so there are not two kinds of row in
 * the schema, only one optional block. `deploymentRef` alone decides whether an
 * entry can be installed.
 *
 * Field names mirror the `Implementation` interface already shipped in the live
 * marketplace (`civitas-marketplace/lib/catalog/types.ts`) so this block can be
 * ported upstream without a rename. The band fields below are this catalog's
 * addition — see `implementationResourcesSchema`.
 */

// ── Cost and effort bands ───────────────────────────────────────────────────
// The vocabulary of the public CIVITAS Connect submission form, kept verbatim
// so entries stay comparable with the catalog our readers already know. Bands
// rather than numbers on purpose: a commune can answer a band honestly from
// memory, and a band is something a filter can work with — which is the one
// thing that catalog cannot do with its own structured data.
export const costBandSchema = z.enum(["s", "m", "l", "xl"]);
export const effortBandSchema = z.enum(["s", "m", "l"]);
export type CostBand = z.infer<typeof costBandSchema>;
export type EffortBand = z.infer<typeof effortBandSchema>;

/** Low → high. The array order IS the option order in the filter bar. */
export const COST_BAND_ORDER = ["s", "m", "l", "xl"] as const;
export const EFFORT_BAND_ORDER = ["s", "m", "l"] as const;

export const COST_BAND_LABELS: Record<CostBand, string> = {
  s: "S — unter 1.000 €",
  m: "M — unter 10.000 €",
  l: "L — unter 100.000 €",
  xl: "XL — über 100.000 €",
};

export const EFFORT_BAND_LABELS: Record<EffortBand, string> = {
  s: "S — unter 10 Tage",
  m: "M — unter 50 Tage",
  l: "L — unter 100 Tage",
};

/** Just the letter, for the compact badge in the infobox. */
export const COST_BAND_SHORT: Record<CostBand, string> = { s: "S", m: "M", l: "L", xl: "XL" };
export const EFFORT_BAND_SHORT: Record<EffortBand, string> = { s: "S", m: "M", l: "L" };

/**
 * Aufbau- und Betriebskosten getrennt, weil die Frage in der Kommune getrennt
 * gestellt wird: einmalig investieren kann ein Projektbudget, dauerhaft tragen
 * muss der Haushalt.
 *
 * `cost` und `effort` sind FREITEXT und bleiben, wie sie im Live-Katalog
 * stehen ("M, unter 10.000 Euro") — eine Zeile, die von dort übernommen wird,
 * parst hier unverändert. Die `*Band`-Felder daneben sind die maschinenlesbare
 * Entsprechung, aus der die Filter gebaut werden. Bewusst Geschwisterfelder
 * statt einer verschachtelten `bands`-Struktur: so steht der filterbare Wert
 * direkt neben dem lesbaren, den er spiegelt — verschachtelt laufen die beiden
 * in einer handgepflegten JSON-Datei irgendwann auseinander.
 */
export const implementationResourcesSchema = z.object({
  // Upstream-compatible, display only.
  /** Gesamtkosten als Freitext — die Semantik des Live-Katalogs. */
  cost: z.string().optional(),
  /** Ressourceneinsatz als Freitext. */
  effort: z.string().optional(),
  funding: z.string().optional(),

  // This catalog's addition: the filterable mirrors.
  /** Filterbare Entsprechung zu `cost` (Gesamtkosten über 36 Monate). */
  costBand: costBandSchema.optional(),
  /** Einmalige Aufbaukosten. */
  setupCost: costBandSchema.optional(),
  /** Laufende Kosten pro Jahr. */
  runningCost: costBandSchema.optional(),
  /** Filterbare Entsprechung zu `effort` (Personentage). */
  effortBand: effortBandSchema.optional(),
  /** Vorbehalt oder Erläuterung zu Kosten und Aufwand. */
  note: z.string().optional(),
});

/**
 * Reifegrad der Umsetzung IN DER BETREIBENDEN KOMMUNE — das Vokabular des
 * öffentlichen CIVITAS-Connect-Formulars, unverändert übernommen.
 *
 * NICHT zu verwechseln mit `curationTier`: die Kurationsstufe sagt, wie genau
 * WIR den Eintrag geprüft haben, der Status sagt, wie weit die Umsetzung vor
 * Ort ist. Ein produktiver Anwendungsfall kann unkuratiert sein und umgekehrt.
 */
export const useCaseStatusSchema = z.enum([
  "idee",
  "entwurf",
  "in-entwicklung",
  "prototyp",
  "produktiv",
  "review",
  "archiviert",
]);
export type UseCaseStatus = z.infer<typeof useCaseStatusSchema>;

export const USE_CASE_STATUS_ORDER = [
  "idee",
  "entwurf",
  "in-entwicklung",
  "prototyp",
  "produktiv",
  "review",
  "archiviert",
] as const;

export const USE_CASE_STATUS_LABELS: Record<UseCaseStatus, string> = {
  idee: "Idee",
  entwurf: "Entwurf",
  "in-entwicklung": "In Entwicklung",
  prototyp: "Prototyp",
  produktiv: "Produktiv",
  review: "Review",
  archiviert: "Archiviert",
};

/** Der erklärende Halbsatz, den das Formular mitliefert. */
export const USE_CASE_STATUS_HINTS: Record<UseCaseStatus, string> = {
  idee: "Die Idee ist beschrieben, aber noch nicht ausgearbeitet.",
  entwurf: "Ein Konzept liegt vor, die Umsetzung hat noch nicht begonnen.",
  "in-entwicklung": "Die Umsetzung läuft.",
  prototyp: "Die erste Entwicklung ist umgesetzt und wird getestet.",
  produktiv: "Im Regelbetrieb und dauerhaft in Nutzung.",
  review: "Die Umsetzung wird überprüft oder überarbeitet.",
  archiviert: "Nicht mehr in Betrieb.",
};

export const implementationSchema = z.object({
  /** Reifegrad der Umsetzung vor Ort — siehe `useCaseStatusSchema`. */
  status: useCaseStatusSchema.optional(),
  /** Die Stelle, die es betreibt — das stärkste Glaubwürdigkeitssignal. */
  operator: z.string().optional(),
  parties: z
    .object({
      /** Ämter, Werke, Verbände. */
      stakeholders: z.array(z.string()).optional(),
      /** Auftragnehmer und Dienstleister. */
      serviceProviders: z.array(z.string()).optional(),
    })
    .optional(),
  /** Womit es gebaut wurde — der Anknüpfungspunkt für „das haben wir auch". */
  stack: z.array(z.string()).optional(),
  resources: implementationResourcesSchema.optional(),
  // Key order kept as upstream has it (input, output, impact, outcome) so a
  // diff against the live app's interface stays empty. READING order is
  // Input → Output → Outcome → Impact and comes from LOGIC_MODEL_STEPS below;
  // do not "fix" this order to match it.
  /** Wirkungslogik: was hineinging, was herauskam, was sich geändert hat. */
  logicModel: z
    .object({
      input: z.string().optional(),
      output: z.string().optional(),
      impact: z.string().optional(),
      outcome: z.string().optional(),
    })
    .optional(),
  /**
   * Strukturiert statt Freitext, damit „sucht diese Kommune Mitstreiter?" ein
   * Filter wird und nicht ein Satz, den jemand lesen muss.
   */
  collaboration: z.object({ wanted: z.boolean(), seeking: z.string().optional() }).optional(),
  /** Wo die ausführliche Beschreibung liegt; `source` nennt die Sammlung. */
  reference: z.object({ url: z.string().url(), source: z.string().optional() }).optional(),
});

export type Implementation = z.infer<typeof implementationSchema>;
export type ImplementationResources = z.infer<typeof implementationResourcesSchema>;

// Every field above is `.optional()` and none carries a `.default([])`: these
// blocks are curated from what a commune actually wrote down, and "keine
// Beteiligten" is a claim while "nicht angegeben" is not. Collapsing the two
// into an empty array would make the UI assert something nobody authored.

export const IMPLEMENTATION_LABELS = {
  operator: "Federführende Organisation",
  stakeholders: "Relevante Stakeholder",
  serviceProviders: "Dienstleister",
  stack: "Eingesetzte Technik",
  cost: "Gesamtkosten",
  setupCost: "Aufbaukosten (einmalig)",
  runningCost: "Laufende Kosten (jährlich)",
  effort: "Ressourceneinsatz",
  funding: "Finanzierung",
  note: "Anmerkung zu Ressourceneinsatz",
  status: "Use Case Status",
  collaboration: "Kooperationsbedarf",
  reference: "Ausführliche Beschreibung",
} as const;

/**
 * Die Wirkungslogik in Lesereihenfolge: Input → Output → Outcome → Impact.
 *
 * Jeder Schritt trägt seine eigene Erklärung, weil „Outcome" und „Impact"
 * Begriffe aus der Programmevaluation sind, die ein Fachamt nicht aus dem
 * Bauch heraus unterscheidet — das Label allein erklärt niemandem etwas.
 */
export const LOGIC_MODEL_STEPS = [
  {
    key: "input",
    label: "Input",
    gloss: "Was hineingeht",
    hint: "Geräte, Infrastruktur, Personal und Geld, die eingesetzt wurden.",
  },
  {
    key: "output",
    label: "Output",
    gloss: "Was entsteht",
    hint: "Das unmittelbare Ergebnis — das Produkt, das man öffnen kann.",
  },
  {
    key: "outcome",
    label: "Outcome",
    gloss: "Was sich ändert",
    hint: "Wie sich die Arbeit der beteiligten Stellen dadurch ändert.",
  },
  {
    key: "impact",
    label: "Impact",
    gloss: "Was es bewirkt",
    hint: "Welche längerfristige Wirkung in der Kommune entsteht.",
  },
] as const satisfies readonly {
  key: keyof NonNullable<Implementation["logicModel"]>;
  label: string;
  gloss: string;
  hint: string;
}[];
