import { Section } from "@/components/ui/layout";
import { LOGIC_MODEL_STEPS } from "@/types/implementation";
import { type UseCase } from "@/types/use-cases";

/**
 * The Wirkungslogik as one chain: Input → Output → Outcome → Impact.
 *
 * Its own section, not part of the technical details (Ewa, 2026-09-22): this
 * is the business argument — what the use case changes — not a technical fact.
 * It sits before "Was Sie damit bekommen" (Ewa, 2026-09-23): what it is good
 * for, then what you operate it through.
 *
 * 2x2 inside the reading column rather than full width (Ewa, 2026-09-23): full
 * width left dead space beside the Steckbrief. The values are whole sentences,
 * which would wrap anyway in four narrow columns; as a 2x2 they get a readable
 * line length, and the numbered steps carry the sequence.
 *
 * Each step carries its own gloss — "Outcome" and "Impact" come from programme
 * evaluation and nobody outside that world separates them reliably.
 */
export function LogicModel({ useCase }: { useCase: UseCase }) {
  const logicModel = useCase.implementation?.logicModel;
  const steps = LOGIC_MODEL_STEPS.map((step) => ({ ...step, value: logicModel?.[step.key] }));

  if (!steps.some((step) => step.value)) return null;

  return (
    <Section
      id="wirkung"
      title="Was dieser Anwendungsfall bewirkt"
      lead="Die Wirkungslogik in vier Schritten — von dem, was hineingegeben wurde, bis zu dem, was sich in der Kommune ändert."
    >
      <ol className="grid gap-4 sm:grid-cols-2">
        {steps.map((step, position) => (
          <li key={step.key} className="flex">
            {/* E4: an item inside a section — rounded-md, the innermost radius. */}
            <div className="flex w-full flex-col rounded-md border bg-background p-4">
              <p className="flex items-baseline gap-2">
                <span
                  aria-hidden
                  className="text-xs font-semibold tabular-nums text-muted-foreground"
                >
                  {position + 1}
                </span>
                <span className="text-sm font-semibold text-foreground">{step.label}</span>
                <span className="text-xs text-muted-foreground">{step.gloss}</span>
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.hint}</p>
              <p className="mt-3 border-t pt-3 text-sm leading-relaxed text-foreground">
                {step.value ?? <span className="text-muted-foreground">Nicht angegeben.</span>}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
