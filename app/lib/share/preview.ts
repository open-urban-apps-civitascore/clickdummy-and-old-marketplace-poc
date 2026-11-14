import type { PartKind, ShareDataset } from "@/lib/share/datasets";
import { compactLetters, slugify } from "@/lib/share/names";
import type { SteckbriefBasics } from "@/lib/share/steckbrief";

/**
 * What the package would hold, worked out here instead of by the marketplace's
 * export: the files, the identities the parts get, what stays behind. Close
 * enough to show the step; nothing is written anywhere.
 */
export interface PackagePreview {
  id: string;
  displayName: string;
  version: string;
  packageDir: string;
  branch: string;
  files: { path: string; bytes: number }[];
  identities: { title: string; kind: string; to: string; kept: boolean }[];
  stripped: string[];
  parameters: string[];
  demoStreams: number;
}

const FILE_KINDS: Record<PartKind, string> = {
  source: "datasource",
  mapping: "mapping",
  structure: "datastructure",
  pipeline: "pipeline",
  sink: "datasink",
  api: "api",
  layer: "layer",
  style: "style",
};

export const IDENTITY_KINDS: Record<string, string> = {
  datastructure: "Datenstruktur",
  mapping: "Mapping",
  datasource: "Datenquelle",
  datasink: "Datensenke",
};

/** Stands in for the marketplace's SHA-256 derivation: same input, same ten characters. */
function derived(text: string): string {
  let a = 0x811c9dc5;
  let b = 0x01000193;
  for (const char of text) {
    a = Math.imul(a ^ char.charCodeAt(0), 0x01000193) >>> 0;
    b = Math.imul(b ^ char.charCodeAt(0), 0x811c9dc5) >>> 0;
  }
  return (a.toString(36) + b.toString(36)).padEnd(10, "0").slice(0, 10);
}

/** Sizes that look like real ones and stay the same for the same part. */
function bytesOf(path: string): number {
  return 400 + (parseInt(derived(path).slice(0, 4), 36) % 3600);
}

export function buildPreview(dataset: ShareDataset, basics: SteckbriefBasics, demoStreams: number): PackagePreview {
  const publisher = basics.publisher.trim().toLowerCase();
  const slug = basics.slug.trim().toLowerCase();
  const domain = basics.domain.trim().toLowerCase();
  const version = basics.version.trim();
  const listed = Boolean(dataset.catalog);

  const partFiles = dataset.parts.map((part) => `core-ir/${slugify(part.name)}.${FILE_KINDS[part.kind]}.json`);
  const files = [
    "README.md",
    "core-ir/manifest.json",
    ...partFiles,
    ...(demoStreams ? [`core-ir/${slug}.simulation.json`] : []),
  ].map((path) => ({ path, bytes: bytesOf(path) }));

  const identities = dataset.parts.flatMap((part) => {
    const kind = FILE_KINDS[part.kind];
    if (kind === "datastructure" || kind === "mapping") {
      const name = compactLetters(part.name);
      return [{ title: part.name, kind, to: `urn:core:standard:${publisher}:${kind}:${domain}:${name}:${derived(`${publisher}#${name}`)}`, kept: listed && kind === "datastructure" }];
    }
    if (kind === "datasource" || kind === "datasink") {
      return [{ title: part.name, kind, to: `urn:${publisher}:${kind}:${slugify(part.name)}`, kept: false }];
    }
    return [];
  });

  const fileOf = (name: string) => partFiles[dataset.parts.findIndex((part) => part.name === name)];
  return {
    id: `urn:${publisher}:usecase:${slug}`,
    displayName: basics.displayName.trim(),
    version,
    packageDir: `packages/${slug}`,
    branch: `export/${slug}-${version}`,
    files,
    identities,
    stripped: dataset.parts.flatMap((part) => (part.secret ? [`${fileOf(part.name)}: ${part.secret.field} (${part.secret.reason})`] : [])),
    parameters: dataset.parts.flatMap((part) => (part.parameters ? [`${fileOf(part.name)}: ${part.parameters.join(", ")}`] : [])),
    demoStreams,
  };
}
