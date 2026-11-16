/** A wizard's steps, the current one marked. */
export function StepList({ labels, current }: { labels: readonly string[]; current: number }) {
  return (
    <ol aria-label="Fortschritt" className="grid gap-2 sm:grid-cols-3">
      {labels.map((label, index) => (
        <li
          key={label}
          aria-current={current === index + 1 ? "step" : undefined}
          className={`rounded-lg border px-3 py-3 text-sm ${current === index + 1 ? "border-primary bg-primary/5 font-semibold text-primary" : "text-muted-foreground"}`}
        >
          <span className="mr-2">{index + 1}.</span>
          {label}
        </li>
      ))}
    </ol>
  );
}
