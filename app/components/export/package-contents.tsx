"use client";

import { Fragment } from "react";
import { CircleCheck, CirclePlay, Database, Layers, MapIcon, Radio, Sparkles } from "lucide-react";

import { Flow, FlowGroup, FlowHeading, FlowItem, FlowNote, StatusPill } from "@/components/ui/flow";
import { DATASET_STATUS_LABELS, type DemoSource, type PackagePart, type ShareDataset } from "@/lib/share/datasets";
import { byKind, PART_KINDS, partsCount } from "@/lib/share/kinds";

/** The ids of the demo data this dataset offers. */
export function demoIds(dataset: ShareDataset): string[] {
  return dataset.demo.flatMap((source) => [...source.streams.map((stream) => stream.id), ...(source.generated ? [source.generated.id] : [])]);
}

/** What goes into the package: demo data first, where the data starts, then the platform, then the map. */
export function PackageContents({
  dataset,
  excluded,
  onToggle,
}: {
  dataset: ShareDataset;
  excluded: ReadonlySet<string>;
  onToggle: (id: string) => void;
}) {
  const platform = dataset.parts.filter((part) => !part.map);
  const map = dataset.parts.filter((part) => part.map);
  const standards = [...new Set(map.flatMap((part) => (part.standard ? [part.standard] : [])))];
  const ids = demoIds(dataset);

  return (
    <Flow>
      <FlowGroup
        key="demo"
        icon={CirclePlay}
        title="Demo-Daten"
        subtitle="Simulator - freiwillig"
        meta={ids.length ? `${ids.filter((id) => !excluded.has(id)).length} von ${ids.length} ausgewählt` : undefined}
        footer={
          <p className="pb-1 text-xs leading-relaxed text-muted-foreground">
            Angehakte Demo-Daten kommen ins Paket. Eine Installation startet sie für ihre eigenen Datenquellen.
          </p>
        }
      >
        {dataset.demo.length === 0 ? (
          <FlowNote>Dieser Datensatz hat keine MQTT- oder SQL-Quelle, für die der Simulator Daten erzeugen könnte.</FlowNote>
        ) : (
          dataset.demo.map((source) => <DemoRows key={source.id} source={source} excluded={excluded} onToggle={onToggle} />)
        )}
      </FlowGroup>
      <FlowGroup key="platform" icon={Layers} title="Plattform" subtitle="CIVITAS/CORE" meta={platform.length ? partsCount(platform.length) : undefined}>
        <FlowItem
          icon={<Database className="size-4" />}
          kind="Datensatz"
          name={dataset.name}
          badge={
            dataset.status === "AVAILABLE" ? (
              <StatusPill tone="success" icon={CircleCheck}>
                {DATASET_STATUS_LABELS.AVAILABLE}
              </StatusPill>
            ) : (
              <StatusPill tone="muted">{DATASET_STATUS_LABELS[dataset.status]}</StatusPill>
            )
          }
        />
        {byKind(platform).map(({ kind, items }) => (
          <Fragment key={kind}>
            <FlowHeading>{items.length === 1 ? PART_KINDS[kind].one : `${PART_KINDS[kind].many} (${items.length})`}</FlowHeading>
            {items.map((part) => (
              <PartRow key={part.name} part={part} kindShown={false} />
            ))}
          </Fragment>
        ))}
      </FlowGroup>
      {map.length ? (
        <FlowGroup key="map" icon={MapIcon} title="Karte" subtitle={standards.length ? `API: ${standards.join(", ")}` : undefined}>
          {/* Not grouped: a layer sits under its API. */}
          {map.map((part) => (
            <PartRow key={part.name} part={part} kindShown />
          ))}
        </FlowGroup>
      ) : null}
    </Flow>
  );
}

function PartRow({ part, kindShown }: { part: PackagePart; kindShown: boolean }) {
  const { one, icon: Icon } = PART_KINDS[part.kind];
  return (
    <FlowItem
      icon={<Icon className="size-4" />}
      kind={kindShown ? (part.kind === "api" && part.standard ? `API (${part.standard})` : one) : undefined}
      name={part.name}
      note={part.detail}
      depth={part.depth}
    />
  );
}

function DemoRows({ source, excluded, onToggle }: { source: DemoSource; excluded: ReadonlySet<string>; onToggle: (id: string) => void }) {
  const transport = source.transport === "mqtt" ? "MQTT" : "SQL";
  const tick = (id: string) => (
    <input type="checkbox" className="size-4 shrink-0 accent-primary" checked={!excluded.has(id)} onChange={() => onToggle(id)} />
  );
  return (
    <>
      {source.streams.map((stream) => (
        <FlowItem
          key={stream.id}
          control={tick(stream.id)}
          icon={<Radio className="size-4" />}
          name={stream.label}
          note={`für Datenquelle „${source.name}“ · ${transport}`}
        />
      ))}
      {source.streams.length && source.sample?.length ? (
        <FlowNote>
          <p>So sehen die ersten Nachrichten von „{source.streams[0].label}“ aus:</p>
          <SampleTable records={source.sample} />
        </FlowNote>
      ) : null}
      {source.generated ? (
        <>
          <FlowItem
            control={tick(source.generated.id)}
            icon={<Sparkles className="size-4" />}
            name="Erzeugte Demo-Daten"
            note={`für Datenquelle „${source.name}“ · ${transport} · ${source.generated.summary}`}
          />
          <FlowNote>
            <p>Aus der Datenstruktur vorgeschlagen{source.sample?.length ? " - so sehen die ersten Nachrichten aus:" : "."}</p>
            {source.sample?.length ? <SampleTable records={source.sample} /> : null}
          </FlowNote>
        </>
      ) : null}
    </>
  );
}

const ISO_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

function cellText(value: unknown): string {
  // No thousands separator: a year or an id must not read as „1.987“.
  if (typeof value === "number") return value.toLocaleString("de-DE", { maximumFractionDigits: 2, useGrouping: false });
  if (typeof value === "string" && ISO_TIME.test(value)) return new Date(value).toLocaleTimeString("de-DE", { timeZone: "UTC" });
  return typeof value === "string" ? value : JSON.stringify(value);
}

function SampleTable({ records }: { records: Record<string, unknown>[] }) {
  const columns = [...new Set(records.flatMap((record) => Object.keys(record)))];
  return (
    <div className="mt-1.5 overflow-x-auto rounded-md border">
      <table className="w-full text-left text-xs">
        <thead className="border-b text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col" className="whitespace-nowrap px-2 py-1 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column} className="whitespace-nowrap px-2 py-1 tabular-nums text-foreground">
                  {column in record ? cellText(record[column]) : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
