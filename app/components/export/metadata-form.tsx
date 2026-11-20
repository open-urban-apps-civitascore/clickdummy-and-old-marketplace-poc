"use client";

import { inputClass } from "@/components/export/fields";
import { LeadOrganisationField, type OrganisationChoice, type OrganisationOptions } from "@/components/export/organisation-field";
import { Button } from "@/components/ui/button";
import { fieldHint, LEAD_CODE_PATH, LEAD_PATH, METADATA_GROUPS, type MetadataDraft } from "@/lib/share/metadata";
import { USE_CASE_THEMES } from "@/types/implementation";

const BOX = "rounded-xl border bg-card p-5";

export function MetadataForm({
  value,
  onChange,
  organisations,
}: {
  value: MetadataDraft;
  onChange: (value: MetadataDraft) => void;
  organisations: OrganisationOptions & { publisher: OrganisationChoice };
}) {
  const changeField = (path: string, text: string) => onChange({ ...value, fields: { ...value.fields, [path]: text } });
  return (
    <>
      <fieldset className={BOX}>
        <legend className="px-2 font-semibold">Themengebiete</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {USE_CASE_THEMES.map((theme) => (
            <label key={theme} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={value.themes.includes(theme)}
                onChange={(event) =>
                  onChange({ ...value, themes: event.target.checked ? [...value.themes, theme] : value.themes.filter((item) => item !== theme) })
                }
              />
              {theme}
            </label>
          ))}
        </div>
      </fieldset>
      {METADATA_GROUPS.map((group) => (
        <fieldset key={group.title} className={`grid gap-4 md:grid-cols-2 ${BOX}`}>
          <legend className="px-2 font-semibold">{group.title}</legend>
          {group.fields.map((field) =>
            field.kind === "organisation" ? null : field.path === LEAD_PATH ? (
              <LeadOrganisationField
                key={field.path}
                operator={value.fields[LEAD_PATH] ?? ""}
                operatorOrg={value.fields[LEAD_CODE_PATH] ?? ""}
                publisher={organisations.publisher}
                options={organisations}
                onChange={(next) => onChange({ ...value, fields: { ...value.fields, [LEAD_PATH]: next.operator, [LEAD_CODE_PATH]: next.operatorOrg } })}
              />
            ) : (
              <label key={field.path} className={`flex flex-col gap-1 text-sm ${field.kind === "multiline" ? "md:col-span-2" : ""}`}>
                <span>{field.label}</span>
                {field.options ? (
                  <select className={inputClass} value={value.fields[field.path] ?? ""} onChange={(event) => changeField(field.path, event.target.value)}>
                    <option value="">Keine Angabe</option>
                    {Object.entries(field.options).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : field.kind === "multiline" || field.kind === "list" ? (
                  <textarea className={inputClass} rows={3} value={value.fields[field.path] ?? ""} onChange={(event) => changeField(field.path, event.target.value)} />
                ) : (
                  <input
                    className={inputClass}
                    type={field.kind ?? "text"}
                    value={value.fields[field.path] ?? ""}
                    onChange={(event) => changeField(field.path, event.target.value)}
                  />
                )}
                <FieldHint text={fieldHint(field, value.fields[field.path] ?? "")} />
              </label>
            ),
          )}
        </fieldset>
      ))}
      <fieldset className={`flex flex-col gap-4 ${BOX}`}>
        <legend className="px-2 font-semibold">Bilder & Screenshots</legend>
        <p className="text-sm text-muted-foreground">
          HTTPS-Adresse oder Bildpfad im Paketordner. Bilder werden hier verlinkt, nicht hochgeladen.
        </p>
        {value.media.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-lg border p-4">
            {(["src", "alt", "caption"] as const).map((key) => (
              <label key={key} className="flex flex-col gap-1 text-sm">
                <span>{key === "src" ? "Bildadresse / Pfad *" : key === "alt" ? "Alternativtext *" : "Bildunterschrift"}</span>
                <input
                  className={inputClass}
                  value={item[key]}
                  required={key !== "caption" && Object.values(item).some((text) => text.trim())}
                  onChange={(event) =>
                    onChange({ ...value, media: value.media.map((row, i) => (i === index ? { ...row, [key]: event.target.value } : row)) })
                  }
                />
              </label>
            ))}
            <Button type="button" variant="ghost" className="justify-self-start" onClick={() => onChange({ ...value, media: value.media.filter((_, i) => i !== index) })}>
              Bild {index + 1} entfernen
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" className="self-start" onClick={() => onChange({ ...value, media: [...value.media, { src: "", alt: "", caption: "" }] })}>
          Bild hinzufügen
        </Button>
      </fieldset>
    </>
  );
}

const FieldHint = ({ text }: { text?: string }) => (text ? <span className="text-xs text-muted-foreground">{text}</span> : null);
