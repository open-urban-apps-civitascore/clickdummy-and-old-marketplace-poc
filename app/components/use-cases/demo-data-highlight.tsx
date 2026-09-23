import { PlayCircle, Trash2, Zap } from "lucide-react";

import { Panel } from "@/components/ui/layout";
import type { DemoData } from "@/types/use-cases";

/**
 * Bundled sample data, stated as a FACT — not as a call to action.
 *
 * This used to be an emerald banner with a filled icon tile and the heading
 * „Ohne eigene Daten ausprobieren", which read as a button: Mathias tried to
 * click it (2026-09). It never was one. The actual choice lives in step 1 of
 * the install wizard, where „Mit Demo-Daten starten" is the featured option
 * (see `install-use-case-button.tsx`, `DATA_SOURCE_CHOICES`).
 *
 * So the panel now looks like what it is: a property of the listing, in the
 * same neutral card chrome as every other fact on the page. Dropping the
 * emerald also removes one of that colour's three meanings — it is the trust
 * tier and the use-case identity, and it should not additionally mean "demo".
 *
 * The catalog-card badge and the Demo-Daten filter were removed on 2026-09-23:
 * demo data is a property to read on the entry, not a way to browse for one.
 *
 * Only rendered for listings that actually declare demo data — a store that
 * promises sample data and then shows an empty dataset burns exactly the trust
 * the catalog is built on.
 */
export function DemoDataHighlight({ demoData }: { demoData: DemoData }) {
  return (
    <Panel
      title="Demo-Daten enthalten"
      icon={<PlayCircle aria-hidden className="size-4" />}
      tone="usecase"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Dieser Anwendungsfall bringt Beispieldaten mit. Beim Installieren können Sie wählen, ob
            Sie damit starten — das fertige Ergebnis ist dann sofort mit Daten gefüllt, und ob Sie
            eigene Sensoren anbinden, entscheiden Sie später.
            {demoData.contains ? (
              <>
                {" "}
                Enthalten: <span className="font-medium text-foreground">{demoData.contains}</span>.
              </>
            ) : null}
          </p>
          {demoData.note ? (
            <p className="mt-2 text-sm text-muted-foreground">{demoData.note}</p>
          ) : null}

          <ul className="mt-4 grid gap-2 sm:grid-cols-3">
            <Point icon={Zap} label="Keine Sensoren nötig" />
            <Point icon={PlayCircle} label="In Minuten startklar" />
            <Point icon={Trash2} label="Rückstandsfrei entfernbar" />
          </ul>
        </div>
      </div>
    </Panel>
  );
}

function Point({
  icon: Icon,
  label,
}: {
  icon: typeof PlayCircle;
  label: string;
}) {
  return (
    <li className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground">
      <Icon aria-hidden className="size-4 shrink-0" />
      {label}
    </li>
  );
}
