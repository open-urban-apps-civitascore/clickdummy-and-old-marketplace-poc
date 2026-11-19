import { z } from "zod";

// The ONE graded trust vocabulary of the store (design decision 2026-08-07).
// A single curation tier — assigned by the curator, revocable, with public
// criteria — replaces the three previous overlapping scales (maturity,
// installability-as-grade, curation badge). Everything else about an entry is
// an ungraded, machine-verifiable fact: fit check, production references,
// license, install path.
export const curationTierSchema = z.enum(["experimental", "community", "verified"]);
export type CurationTier = z.infer<typeof curationTierSchema>;

// How an entry gets onto an instance — a fact, not a grade. `operator` covers
// add-ons: their install is a GitOps change made by the platform operator,
// never 1-click (glossary rule).
export const installPathSchema = z.enum(["portal", "operator", "adaptation"]);
export type InstallPath = z.infer<typeof installPathSchema>;

// Deprecation is a state overlay, independent of the tier: unlike `revoked`
// (tombstone, hidden) a deprecated entry stays visible, warns, and may point
// to a successor. It must also reach instances that already installed it.
export const deprecationSchema = z.object({
  reason: z.string(),
  successorId: z.string().optional(),
});
export type Deprecation = z.infer<typeof deprecationSchema>;

export const CURATION_TIER_LABELS: Record<CurationTier, string> = {
  experimental: "Experimentell",
  community: "Community",
  verified: "Verifiziert",
};

export const CURATION_TIER_HINTS: Record<CurationTier, string> = {
  experimental: "Formal gültig eingereicht, aber noch nicht inhaltlich geprüft.",
  community: "Von der Kuratierung geprüft: Lizenz, Kontakt, Plattform-Bedarf.",
  verified: "Zusätzlich fachlich geprüft und produktiv im Einsatz — mit benannter Referenz.",
};

// The published per-tier criteria ("Was bedeutet dieses Siegel?"). Cumulative:
// each tier includes everything below it. Public criteria are what make the
// badge auditable for the people who sign off (Amtsleitung, Datenschutz).
// Mirrors the curation checklist in `lib/curation.ts`.
export const CURATION_TIER_CRITERIA: Record<CurationTier, string[]> = {
  experimental: [
    "Manifest ist gültig und vollständig lesbar",
    "Repository öffentlich erreichbar",
    "Keine Zugangsdaten im Bündel",
    "Unveränderliche Versions-Referenz",
  ],
  community: [
    "Alle Kriterien von „Experimentell“",
    "Freie Lizenz angegeben und zulässig",
    "Pflegestelle und Kontakt benannt",
    "Plattform-Bedarf deklariert",
    "Beschreibung auch fachfremd verständlich",
  ],
  verified: [
    "Alle Kriterien von „Community“",
    "Mindestens eine Kommune produktiv im Einsatz — benannt",
    "Fachliche Prüfung durch die Kuratierung",
  ],
};

export const INSTALL_PATH_LABELS: Record<InstallPath, string> = {
  portal: "Über das Portal",
  operator: "Durch den Betreiber",
  adaptation: "Mit Anpassung",
};

// How much of a use case another commune can take over - a fact about the
// content, not a grade, so it is never shown in the tier colours.
export const transferabilitySchema = z.enum(["direct", "tailored", "inspiration"]);
export type Transferability = z.infer<typeof transferabilitySchema>;

export const TRANSFERABILITY_LABELS: Record<Transferability, string> = {
  direct: "Direkt übertragbar",
  tailored: "Mit eigenem Zuschnitt",
  inspiration: "Zur Inspiration",
};

export const TRANSFERABILITY_HINTS: Record<Transferability, string> = {
  direct: "Läuft mit den eigenen Daten weitgehend so, wie es geliefert wird.",
  tailored: "Das Gerüst passt, Teile werden an die eigene Kommune angepasst - etwa Datenquellen, Orte oder Schwellenwerte.",
  inspiration: "Stark auf die Kommune zugeschnitten, aus der es stammt - zeigt einen Lösungsweg, den man selbst nachbaut.",
};
