"use client";

import { Check, Clock, GitPullRequest, Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Disclosure } from "@/components/ui/disclosure";
import { Panel } from "@/components/ui/layout";
import { InlineNotice } from "@/components/ui/notice";
import { cn } from "@/lib/utils";

export interface ShareStage {
  key: string;
  title: string;
  who: string;
}

const PACKAGE_STAGES: readonly ShareStage[] = [
  { key: "propose", title: "Paket einreichen", who: "Du" },
  { key: "review", title: "Paket-Prüfung", who: "Das Katalog-Team" },
  { key: "catalog", title: "Katalog-Eintrag vorschlagen", who: "Du" },
  { key: "listing", title: "Eintrags-Prüfung", who: "Das Katalog-Team" },
];

type StageState = "current" | "done" | "waiting" | "later";

const WAITING_FOR_TEAM = "Wartet auf das Katalog-Team";

function StepMark({ state, number }: { state: StageState; number: number }) {
  if (state === "done") {
    return (
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-foreground text-background">
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    );
  }
  if (state === "waiting") {
    return (
      <span className="grid size-6 shrink-0 place-items-center rounded-full border border-muted-foreground text-muted-foreground">
        <Clock className="size-3.5" />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums",
        state === "current" ? "bg-foreground text-background" : "border bg-muted text-muted-foreground",
      )}
    >
      {number}
    </span>
  );
}

/**
 * „So geht es weiter“, as the marketplace shows it, with the first two stages
 * played: submitting moves the package to the catalogue team, which then never
 * answers. Nothing is sent anywhere.
 */
export function ShareSteps({
  submitted,
  pending,
  blocker,
  onPropose,
  onCheck,
  stages = PACKAGE_STAGES,
  intro = "Vier Schritte bis in den Katalog - den ersten machst du hier.",
  subject = "das Paket",
  leaveNote = "Du kannst diese Seite jetzt verlassen. Du findest das Paket jederzeit unter „Teilen“ › „In Arbeit“ - dort geht es nach der Prüfung weiter.",
}: {
  submitted: boolean;
  pending?: "propose" | "check";
  blocker?: string;
  onPropose: () => void;
  onCheck: () => void;
  stages?: readonly ShareStage[];
  intro?: string;
  /** What the catalogue team reviews, with its article. */
  subject?: string;
  leaveNote?: string;
}) {
  const states: StageState[] = stages.map((_, index) =>
    submitted ? (index === 0 ? "done" : index === 1 ? "waiting" : "later") : index === 0 ? "current" : "later",
  );
  return (
    <Panel title="So geht es weiter">
      {!submitted ? <p className="mb-4 text-sm text-muted-foreground">{intro}</p> : null}
      <ol className="flex flex-col">
        {stages.map((stage, index) => {
          const state = states[index];
          const last = index === stages.length - 1;
          const who =
            state === "done" ? `${stage.who} - erledigt` : state === "waiting" ? WAITING_FOR_TEAM : state === "current" ? "Du bist dran" : stage.who;
          return (
            <li key={stage.key} aria-current={state === "current" || state === "waiting" ? "step" : undefined} className="flex gap-3">
              <div aria-hidden className="flex flex-col items-center">
                <StepMark state={state} number={index + 1} />
                {!last ? <span className={cn("my-1 w-px flex-1", state === "done" ? "bg-foreground/60" : "bg-border")} /> : null}
              </div>
              <div className={cn("flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between", !last && "pb-5")}>
                <div className="min-w-0 pt-0.5">
                  <p className={cn("text-sm", state === "later" ? "text-muted-foreground" : "font-medium text-foreground")}>{stage.title}</p>
                  <p className="text-xs text-muted-foreground">{who}</p>
                  {state === "current" && blocker ? (
                    <div className="mt-1.5">
                      <InlineNotice tone="warn">{blocker}</InlineNotice>
                    </div>
                  ) : null}
                </div>
                {state === "current" && !blocker ? (
                  <div className="flex shrink-0 flex-wrap items-center gap-3">
                    <span className="text-xs text-muted-foreground">Dein Name erscheint im öffentlichen Vorschlag bei GitLab.</span>
                    <Button type="button" disabled={Boolean(pending)} onClick={onPropose}>
                      {pending === "propose" ? <Loader2 className="animate-spin" /> : <GitPullRequest />}
                      Zur Prüfung einreichen
                    </Button>
                  </div>
                ) : null}
                {state === "waiting" ? (
                  <div className="flex shrink-0 flex-wrap items-center gap-3">
                    <Button type="button" variant="outline" disabled={Boolean(pending)} onClick={onCheck}>
                      {pending === "check" ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                      Stand prüfen
                    </Button>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <Disclosure summary="Was ist ein Merge Request?" className="mt-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          So heißt bei GitLab ein Änderungsvorschlag - hier kurz „Vorschlag“. Das Katalog-Team sieht sich {subject} dort an und nimmt es
          an („Merge“) oder nicht. Hat es vorher eine Frage, steht sie im Vorschlag bei GitLab - schau dort nach, wenn es länger dauert.
        </p>
      </Disclosure>

      {submitted ? <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{leaveNote}</p> : null}
    </Panel>
  );
}
