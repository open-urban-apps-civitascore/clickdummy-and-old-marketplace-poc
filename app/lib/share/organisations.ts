import { z } from "zod";

import { compactLetters } from "@/lib/share/names";
import type { Organisation } from "@/types/repo-list";

/**
 * The organisation rules of the marketplace's share form (D34): a code from
 * the catalogue's list, or a new organisation proposed with the share.
 */

const proposalSchema = z.object({
  id: z.string().regex(/^[a-z0-9]{2,40}$/),
  name: z.string().min(1),
  website: z.url({ protocol: /^https$/ }).optional(),
  contact: z.object({ name: z.string().min(1).optional(), email: z.email() }).optional(),
});

const PROBLEMS: Record<string, string> = {
  id: "das Kürzel braucht 2 bis 40 Kleinbuchstaben oder Ziffern",
  name: "der Name fehlt",
  website: "die Website braucht eine https-Adresse",
  email: "die Team-E-Mail ist ungültig",
};

/** What is wrong with a new organisation, by the catalogue's rules; undefined when nothing is. */
export function organisationProblem(row: unknown): string | undefined {
  const parsed = proposalSchema.safeParse(row);
  if (parsed.success) return undefined;
  const at = parsed.error.issues[0]?.path.at(-1);
  return (typeof at === "string" && PROBLEMS[at]) || "die Angaben sind unvollständig";
}

/** The listed organisation with exactly this name, ignoring case. */
export function organisationNamed(name: string, listed: readonly Organisation[]): Organisation | undefined {
  const wanted = name.trim().toLowerCase();
  return wanted ? listed.find((organisation) => organisation.name.toLowerCase() === wanted) : undefined;
}

/**
 * The catalogue's own rules, checked before the preview: a code names a listed
 * or proposed organisation, and the text beside it is that one's name.
 */
export function organisationsProblem(
  publisher: { name: string; code: string },
  lead: { operator: string; operatorOrg: string },
  known: readonly Organisation[],
): string | undefined {
  const nameOf = (code: string) => known.find((organisation) => organisation.id === code)?.name;
  if (!publisher.code) return "Herausgeber: bitte eine Organisation aus der Liste wählen oder neu vorschlagen.";
  const name = nameOf(publisher.code);
  if (!name) return "Herausgeber: diese Organisation ist nicht im Katalog. Bitte aus der Liste wählen oder neu vorschlagen.";
  if (publisher.name !== name) return `Herausgeber: die gewählte Organisation heißt „${name}“.`;
  if (lead.operatorOrg) {
    const leadName = nameOf(lead.operatorOrg);
    if (!leadName) return "Federführende Organisation: diese Organisation ist nicht im Katalog. Bitte aus der Liste wählen oder neu vorschlagen.";
    if (!lead.operator.startsWith(leadName)) return `Federführende Organisation: der Eintrag muss mit „${leadName}“ beginnen.`;
  }
  return undefined;
}

/** „Wie Herausgeber“: an empty lead is the publisher, filled in when the preview is made. */
export function withLeadDefault(
  lead: { operator: string; operatorOrg: string },
  publisher: { name: string; code: string },
): { operator: string; operatorOrg: string } {
  if (lead.operator || lead.operatorOrg || !publisher.name.trim()) return lead;
  return { operator: publisher.name.trim(), operatorOrg: publisher.code };
}

/** The box „Wie Herausgeber“: ticked while the lead is empty, unless it was unticked by hand. */
export function isFollowing(mayFollow: boolean, untickedByHand: boolean, lead: { operator: string; operatorOrg: string }): boolean {
  return mayFollow && !untickedByHand && !lead.operator && !lead.operatorOrg;
}

/** „Stadt Musterhausen - Umweltamt“: the organisation's name, then the department if there is one. */
export function composeLead(name: string, department: string): string {
  return department.trim() ? `${name} - ${department.trim()}` : name;
}

/** The department after the organisation's name, without the dash. */
export function departmentOf(operator: string, name: string | undefined): string {
  return name && operator.startsWith(name) ? operator.slice(name.length).replace(/^\s*[-–]\s*/, "") : "";
}

/** What the department field shows: as typed, spaces included, while that still makes the lead. */
export function shownDepartment(operator: string, name: string | undefined, typed: string | undefined): string {
  if (!name) return "";
  return typed !== undefined && composeLead(name, typed) === operator ? typed : departmentOf(operator, name);
}

/** The lead after picking an organisation: a department stays only with the same organisation. */
export function leadAfterPick(
  current: { operatorOrg: string; department: string },
  choice: { name: string; code: string },
): { operator: string; operatorOrg: string } {
  if (!choice.code) return { operator: choice.name, operatorOrg: "" };
  return { operator: composeLead(choice.name, choice.code === current.operatorOrg ? current.department : ""), operatorOrg: choice.code };
}

/** „Stadt“, „Gemeinde“ …: the prefix tells nobody apart, so codes leave it out. */
const ADMIN_PREFIX = /^(Stadt|Gemeinde|Landkreis|Kreis|Markt|Hansestadt|Samtgemeinde|Verbandsgemeinde|Amt|Bezirk)\s+/i;

/** As the catalogue writes codes: „Stadt Musterhausen“ → `musterhausen`. Empty when nothing fits. */
export function suggestedCode(name: string): string {
  const code = compactLetters(name.replace(ADMIN_PREFIX, "").trim() || name).slice(0, 40);
  return code.length >= 2 ? code : "";
}

/** A listed organisation the typed name probably means, for „Meinst du …?“. */
export function similarOrganisation(name: string, listed: readonly Organisation[]): Organisation | undefined {
  const typed = suggestedCode(name);
  if (typed.length < 3) return undefined;
  return listed.find((organisation) => {
    const known = suggestedCode(organisation.name);
    if (organisation.id === typed || known === typed) return true;
    // A short code is part of too many names to mean anything.
    return known.length >= 4 && typed.length >= 4 && (known.includes(typed) || typed.includes(known));
  });
}
