"use client";

import { Plus, X } from "lucide-react";

import { inputClass } from "@/components/export/fields";
import { Button } from "@/components/ui/button";
import { emptyLink, MAX_LINKS, type LinkDraft } from "@/lib/share/links";

/** Links with title, address and a short description; empty rows are dropped when sending. */
export function LinksField({
  value,
  onChange,
  hint,
}: {
  value: LinkDraft[];
  onChange: (links: LinkDraft[]) => void;
  /** Where the links will show. */
  hint: string;
}) {
  const edit = (index: number, patch: Partial<LinkDraft>) =>
    onChange(value.map((link, at) => (at === index ? { ...link, ...patch } : link)));

  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="text-sm font-semibold text-foreground">Weiterführende Links</legend>
      <p className="-mt-2 text-xs text-muted-foreground">{hint}</p>
      {value.map((link, index) => (
        <div key={index} className="flex gap-3">
          <span className="w-5 shrink-0 pt-2 text-sm tabular-nums text-muted-foreground">{index + 1}.</span>
          <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span>Titel</span>
              <input className={inputClass} value={link.title} onChange={(event) => edit(index, { title: event.target.value })} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Adresse</span>
              <input
                className={inputClass}
                type="url"
                inputMode="url"
                placeholder="https://"
                value={link.url}
                onChange={(event) => edit(index, { url: event.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span>Kurze Beschreibung</span>
              <input
                className={inputClass}
                value={link.description}
                onChange={(event) => edit(index, { description: event.target.value })}
              />
              <span className="text-xs text-muted-foreground">Was findet man dort? Ein Satz.</span>
            </label>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Link ${index + 1} entfernen`}
            onClick={() => onChange(value.filter((_, at) => at !== index))}
          >
            <X />
          </Button>
        </div>
      ))}
      {value.length < MAX_LINKS ? (
        <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => onChange([...value, emptyLink()])}>
          <Plus />
          Link hinzufügen
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground">Höchstens {MAX_LINKS} Links.</p>
      )}
    </fieldset>
  );
}
