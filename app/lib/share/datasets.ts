/**
 * The datasets of this instance (Stadt Musterstadt) that can be shared, with
 * what each is built from. The marketplace reads these from the portal and
 * the simulator; here they are invented, one per case worth showing: a new
 * share with demo data, a new version of a listed entry, demo data drafted
 * from the structure plus a map, and a dataset without its own structure.
 */

export type PartKind = "source" | "mapping" | "structure" | "pipeline" | "sink" | "api" | "layer" | "style";

export interface PackagePart {
  kind: PartKind;
  name: string;
  detail?: string;
  /** Under the row above it, e.g. a map layer under its API. */
  depth?: 1 | 2;
  /** On the map card instead of the platform card. */
  map?: boolean;
  /** The API's standard, e.g. "OWS". */
  standard?: string;
  /** Connection data the package leaves behind. */
  secret?: { field: string; reason: string };
  /** Asked for when installing. */
  parameters?: string[];
}

export interface DemoSource {
  id: string;
  name: string;
  transport: "mqtt" | "sql";
  streams: { id: string; label: string }[];
  /** Drafted from the data structure, for a source the simulator has no stream for. */
  generated?: { id: string; summary: string };
  sample?: Record<string, unknown>[];
}

/** The catalogue entry this dataset was shared as before: its texts start the next version. */
export interface CatalogLink {
  id: string;
  displayName: string;
  description: string;
  version: string;
  maintainer: string;
  maintainerOrg?: string;
  license: string;
  keywords: string[];
  themes: string[];
  publisher: string;
  slug: string;
  domain: string;
}

export interface ShareDataset {
  id: string;
  name: string;
  status: "AVAILABLE" | "DRAFT";
  description?: string;
  parts: PackagePart[];
  demo: DemoSource[];
  catalog?: CatalogLink;
}

export const DATASET_STATUS_LABELS: Record<ShareDataset["status"], string> = {
  AVAILABLE: "Freigegeben",
  DRAFT: "Entwurf",
};

const DATASETS: ShareDataset[] = [
  {
    id: "radverkehr",
    name: "Radverkehrszählung Innenstadt",
    status: "AVAILABLE",
    description: "Zählstellen an sieben Knotenpunkten, stündlich aggregiert.",
    parts: [
      {
        kind: "source",
        name: "MQTT Zählstellen Innenstadt",
        detail: "MQTT · Topic zaehlstellen/innenstadt/+",
        secret: { field: "password", reason: "Passwort" },
        parameters: ["urls", "username", "password"],
      },
      { kind: "mapping", name: "Zählwert zu Messung" },
      { kind: "structure", name: "BicycleCountReading", detail: "Version 1.2.0" },
      { kind: "structure", name: "GeoPoint", detail: "Version 1.0.0" },
      { kind: "pipeline", name: "Radverkehr Ingest" },
      { kind: "sink", name: "FROST Radverkehr", detail: "FROST" },
    ],
    demo: [
      {
        id: "src-zaehlstellen",
        name: "MQTT Zählstellen Innenstadt",
        transport: "mqtt",
        streams: [{ id: "sim-zaehlstellen", label: "Zählstellen Innenstadt (7 Sensoren)" }],
        sample: [
          { sensorId: "ZS-01", richtung: "Nord", anzahl: 42, zeit: "2026-11-14T08:00:00Z" },
          { sensorId: "ZS-02", richtung: "Süd", anzahl: 37, zeit: "2026-11-14T08:00:00Z" },
          { sensorId: "ZS-03", richtung: "Ost", anzahl: 18, zeit: "2026-11-14T08:00:00Z" },
        ],
      },
    ],
  },
  {
    id: "baumkataster",
    name: "Baumkataster Musterstadt",
    status: "AVAILABLE",
    description: "Stadtbäume mit Standort, Art und Pflanzjahr.",
    parts: [
      {
        kind: "source",
        name: "Baumliste Grünflächenamt",
        detail: "SQL · Tabelle baeume",
        secret: { field: "dsn", reason: "Passwort in der Adresse" },
        parameters: ["dsn"],
      },
      { kind: "structure", name: "TreeRecord", detail: "Version 1.0.0" },
      { kind: "pipeline", name: "Baumliste übernehmen" },
      { kind: "sink", name: "PostGIS Bäume", detail: "POSTGIS" },
      { kind: "api", name: "Baumkataster", standard: "OWS", map: true },
      { kind: "layer", name: "Bäume", depth: 1, map: true },
      { kind: "style", name: "Baumkronen", depth: 1, map: true },
    ],
    demo: [
      {
        id: "src-baumliste",
        name: "Baumliste Grünflächenamt",
        transport: "sql",
        streams: [],
        generated: { id: "gen-baumliste", summary: "50 Bäume, einmal täglich neu" },
        sample: [
          { baumId: "B-0001", art: "Winterlinde", pflanzjahr: 1987, kronendurchmesser: 9.5 },
          { baumId: "B-0002", art: "Spitzahorn", pflanzjahr: 2004, kronendurchmesser: 6 },
        ],
      },
    ],
    catalog: {
      id: "tree-register-starter",
      displayName: "Baumkataster Starter App",
      description: "Ein kleines, wiederverwendbares Starterpaket für einen kommunalen Baumkataster-Datensatz.",
      version: "1.0.0",
      maintainer: "Stadt Musterstadt",
      maintainerOrg: "musterstadt",
      license: "EUPL-1.2",
      keywords: ["baumkataster", "grünflächen"],
      themes: ["Umwelt & Klima"],
      publisher: "musterstadt",
      slug: "baumkataster-starter",
      domain: "environment",
    },
  },
  {
    id: "luftqualitaet",
    name: "Luftqualität Messstationen",
    status: "AVAILABLE",
    parts: [
      { kind: "source", name: "Messstationen Umweltamt", detail: "MQTT · Topic umwelt/luft/+", parameters: ["urls"] },
      { kind: "mapping", name: "Messwert zu Beobachtung" },
      { kind: "structure", name: "AirQualityReading", detail: "Version 1.0.0" },
      { kind: "pipeline", name: "Luftqualität Ingest" },
      { kind: "sink", name: "FROST Luftqualität", detail: "FROST" },
    ],
    demo: [
      {
        id: "src-luft",
        name: "Messstationen Umweltamt",
        transport: "mqtt",
        streams: [
          { id: "sim-luft-no2", label: "Stickstoffdioxid (4 Stationen)" },
          { id: "sim-luft-pm10", label: "Feinstaub PM10 (4 Stationen)" },
        ],
      },
    ],
  },
  {
    id: "parken",
    name: "Parkplatzbelegung (Test)",
    status: "DRAFT",
    parts: [
      { kind: "source", name: "Parkhaus-Schnittstelle", detail: "HTTP" },
      { kind: "sink", name: "PostGIS Parken", detail: "POSTGIS" },
    ],
    demo: [],
  },
];

export function getShareDatasets(): ShareDataset[] {
  return DATASETS;
}
