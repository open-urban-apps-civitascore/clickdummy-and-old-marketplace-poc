import { ArrowRightLeft, Braces, Globe, HardDrive, MapPin, Palette, Plug, Workflow, type LucideIcon } from "lucide-react";

import type { PartKind } from "@/lib/share/datasets";

/** Each kind of part: its German name, icon and place in the data flow. Kinds are facts, never coloured. */
export const PART_KINDS: Record<PartKind, { one: string; many: string; icon: LucideIcon; order: number }> = {
  source: { one: "Datenquelle", many: "Datenquellen", icon: Plug, order: 1 },
  mapping: { one: "Mapping", many: "Mappings", icon: ArrowRightLeft, order: 2 },
  structure: { one: "Datenstruktur", many: "Datenstrukturen", icon: Braces, order: 3 },
  pipeline: { one: "Pipeline", many: "Pipelines", icon: Workflow, order: 4 },
  sink: { one: "Datensenke", many: "Datensenken", icon: HardDrive, order: 5 },
  api: { one: "API", many: "APIs", icon: Globe, order: 6 },
  layer: { one: "Kartenebene", many: "Kartenebenen", icon: MapPin, order: 7 },
  style: { one: "Stil", many: "Stile", icon: Palette, order: 8 },
};

/** The parts in flow order, one group per kind present. */
export function byKind<T extends { kind: PartKind }>(parts: T[]): { kind: PartKind; items: T[] }[] {
  const groups: { kind: PartKind; items: T[] }[] = [];
  for (const part of [...parts].sort((a, b) => PART_KINDS[a.kind].order - PART_KINDS[b.kind].order)) {
    const last = groups.at(-1);
    if (last?.kind === part.kind) last.items.push(part);
    else groups.push({ kind: part.kind, items: [part] });
  }
  return groups;
}

/** "1 Baustein", "6 Bausteine". */
export function partsCount(count: number): string {
  return count === 1 ? "1 Baustein" : `${count} Bausteine`;
}
