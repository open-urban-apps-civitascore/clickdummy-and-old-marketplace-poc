"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Pause, Play } from "lucide-react";

import { DEMO_STREAMS, type DemoStream } from "@/lib/demo-streams";

/**
 * The demo-data generator controls, markup mirrored 1:1 from the real PoC's
 * SimulatorPanel (civitas-marketplace, components/installed/simulator-panel.tsx)
 * so the clickdummy shows exactly what the product shows: a collapsed band
 * under the installation header, per stream a status badge, topic · interval,
 * the published counter with the last payload as a single ellipsised code line,
 * and a start/stop toggle. Only the data source differs — the real panel polls
 * the generator's registry, here the registry is component state and active
 * streams tick their counters so the panel feels live without a broker.
 */

const timeFormat = new Intl.DateTimeFormat("de-DE", {
  timeStyle: "medium",
  timeZone: "Europe/Berlin",
});

function jitter(value: number): number {
  const next = value * (0.9 + Math.random() * 0.2);
  return Number.isInteger(value) ? Math.round(next) : Math.round(next * 10) / 10;
}

function tickPayload(payload: DemoStream["samplePayload"]): DemoStream["samplePayload"] {
  const next: DemoStream["samplePayload"] = {};
  for (const [key, value] of Object.entries(payload)) {
    if (key === "timestamp") next[key] = new Date().toISOString();
    else if (typeof value === "number") next[key] = jitter(value);
    else next[key] = value;
  }
  return next;
}

export function DemoStreamPanel({ useCaseId }: { useCaseId: string }) {
  const fixtures = DEMO_STREAMS[useCaseId];
  const [open, setOpen] = useState(false);
  const [streams, setStreams] = useState<DemoStream[]>(fixtures ?? []);

  // The generator publishes every intervalSeconds; the panel ticks in the same
  // rhythm so counters and payloads move while the reader watches.
  useEffect(() => {
    const timer = setInterval(() => {
      setStreams((current) =>
        current.map((stream) =>
          stream.active
            ? {
                ...stream,
                publishedCount: stream.publishedCount + 1,
                samplePayload: tickPayload(stream.samplePayload),
              }
            : stream,
        ),
      );
    }, 10_000);
    return () => clearInterval(timer);
  }, []);

  if (!fixtures || fixtures.length === 0) return null;

  const active = streams.filter((stream) => stream.active).length;

  return (
    <div className="-mx-5 border-y bg-muted/20">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/50"
      >
        <ChevronRight className={`size-3.5 transition-transform ${open ? "rotate-90" : ""}`} />
        <span className="font-medium text-foreground">Demo-Daten</span>
        <span>
          {streams.length} Stream{streams.length === 1 ? "" : "s"} · {active} aktiv
        </span>
      </button>

      {open && (
        <div className="flex flex-col gap-2 px-4 pb-3">
          {streams.map((stream, index) => (
            <div
              key={stream.name}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border bg-card px-3 py-2"
            >
              <span className="text-sm font-medium text-foreground">{stream.name}</span>
              <span
                className={
                  stream.active
                    ? "rounded bg-success/10 dark:bg-success/20 px-1.5 py-0.5 text-xs text-success"
                    : "rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                }
              >
                {stream.active ? "Aktiv" : "Pausiert"}
              </span>
              <span className="break-all text-xs text-muted-foreground">
                {stream.topic} · alle {stream.intervalSeconds}s
              </span>
              <button
                type="button"
                onClick={() =>
                  setStreams((current) =>
                    current.map((entry, i) =>
                      i === index ? { ...entry, active: !entry.active } : entry,
                    ),
                  )
                }
                className="ml-auto inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-50"
              >
                {stream.active ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                {stream.active ? "Stoppen" : "Starten"}
              </button>

              <div className="w-full text-xs text-muted-foreground">
                <span>
                  {stream.publishedCount.toLocaleString("de-DE")} publiziert · zuletzt{" "}
                  {timeFormat.format(new Date(String(stream.samplePayload.timestamp ?? "")))}
                </span>
                <code
                  title={JSON.stringify(stream.samplePayload)}
                  className="mt-0.5 block overflow-hidden text-ellipsis whitespace-nowrap rounded bg-muted/60 px-1.5 py-0.5 font-mono"
                >
                  {JSON.stringify(stream.samplePayload)}
                </code>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
