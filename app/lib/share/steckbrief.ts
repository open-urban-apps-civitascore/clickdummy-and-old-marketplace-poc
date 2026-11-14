import { z } from "zod";

import type { ShareDataset } from "@/lib/share/datasets";
import { LEAD_CODE_PATH, LEAD_PATH, type MetadataDraft } from "@/lib/share/metadata";
import { slugify } from "@/lib/share/names";
import { organisationsProblem, withLeadDefault } from "@/lib/share/organisations";
import type { Organisation } from "@/types/repo-list";

export interface SteckbriefBasics {
  displayName: string;
  description: string;
  maintainer: string;
  maintainerOrg: string;
  license: string;
  keywords: string;
  version: string;
  publisher: string;
  slug: string;
  domain: string;
}

const SEGMENT = /^[a-z0-9]{2,40}$/;
const SLUG = /^(?=.{2,60}$)[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VERSION = /^\d+\.\d+\.\d+$/;

export function nextPatch(version: string): string {
  const parts = version.split(".").map(Number);
  return parts.length === 3 && parts.every(Number.isInteger) ? `${parts[0]}.${parts[1]}.${parts[2] + 1}` : "1.0.0";
}

function isHigher(version: string, than: string): boolean {
  const [a, b] = [version, than].map((text) => text.split(".").map(Number));
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i];
  return false;
}

/** A listed entry starts its next version from the catalogue; anything else from the dataset and this instance. */
export function startingBasics(dataset: ShareDataset, own: Organisation | undefined): SteckbriefBasics {
  const listed = dataset.catalog;
  return {
    displayName: listed?.displayName ?? dataset.name,
    description: listed?.description ?? dataset.description ?? "",
    // Never the signed-in person: the Herausgeber goes into the public catalogue.
    maintainer: listed?.maintainer ?? own?.name ?? "",
    maintainerOrg: listed ? (listed.maintainerOrg ?? "") : (own?.id ?? ""),
    license: listed?.license ?? "EUPL-1.2",
    keywords: listed?.keywords.join(", ") ?? "",
    version: listed ? nextPatch(listed.version) : "1.0.0",
    publisher: listed?.publisher ?? "openurbanapps",
    slug: listed?.slug ?? slugify(dataset.name),
    domain: listed?.domain ?? "general",
  };
}

export function addressProblem(basics: SteckbriefBasics): string | undefined {
  if (!SEGMENT.test(basics.publisher.trim())) return "Herausgeber-Kürzel: 2 bis 40 Kleinbuchstaben oder Ziffern.";
  if (!SLUG.test(basics.slug.trim())) return "Kurzname: 2 bis 60 Kleinbuchstaben, Ziffern oder Bindestriche, nicht am Anfang oder Ende.";
  if (!SEGMENT.test(basics.domain.trim())) return "Fachgebiet: 2 bis 40 Kleinbuchstaben oder Ziffern.";
  return undefined;
}

/** The address as the catalogue's detail page spells it. */
export function addressHref(basics: SteckbriefBasics): string {
  return `/use-cases/${basics.publisher.trim().toLowerCase()}/${basics.slug.trim().toLowerCase()}`;
}

const https = z.url({ protocol: /^https$/ });

/** What stops the preview, in the words the marketplace uses; undefined when the Steckbrief is complete. */
export function steckbriefProblem(
  dataset: ShareDataset,
  basics: SteckbriefBasics,
  metadata: MetadataDraft,
  known: readonly Organisation[],
): string | undefined {
  const field = (path: string) => metadata.fields[path]?.trim() ?? "";
  const address = addressProblem(basics);
  if (address) return address;
  if (!VERSION.test(basics.version.trim())) return "Version bitte als drei Zahlen mit Punkt, zum Beispiel 1.0.0.";
  if (dataset.catalog && !isHigher(basics.version.trim(), dataset.catalog.version)) {
    return `Version ${dataset.catalog.version} steht schon im Katalog. Eine neue Version muss höher sein, zum Beispiel ${nextPatch(dataset.catalog.version)}.`;
  }
  if (!basics.displayName.trim()) return "Name im Katalog fehlt.";
  if (!basics.description.trim()) return "Kurzbeschreibung fehlt.";
  if (!basics.maintainer.trim()) return "Herausgeber fehlt.";
  const lead = withLeadDefault({ operator: field(LEAD_PATH), operatorOrg: field(LEAD_CODE_PATH) }, { name: basics.maintainer, code: basics.maintainerOrg });
  const organisations = organisationsProblem({ name: basics.maintainer.trim(), code: basics.maintainerOrg }, lead, known);
  if (organisations) return organisations;
  const contact = ["contact.name", "contact.role", "contact.email", "contact.url"].some((path) => field(path));
  if (contact && !field("contact.email") && !field("contact.url")) return "Kontakt: bitte eine E-Mail oder eine Kontaktseite angeben.";
  if (field("contact.email") && !z.email().safeParse(field("contact.email")).success) return "Kontakt: die E-Mail-Adresse ist ungültig.";
  if (field("contact.url") && !https.safeParse(field("contact.url")).success) return "Kontaktseite: bitte eine HTTPS-Adresse.";
  if (field("implementation.reference.url") && !https.safeParse(field("implementation.reference.url")).success) {
    return "Ausführliche Beschreibung: bitte eine HTTPS-Adresse.";
  }
  if (metadata.media.some((item) => item.src.trim() && !item.alt.trim())) return "Bilder: jedes Bild braucht einen Alternativtext.";
  return undefined;
}
