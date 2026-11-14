import { Children, Fragment, isValidElement, type ReactNode } from "react";
import { ArrowDown, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * What a package consists of: one card per system, joined by arrows in the
 * order the data flows. The marketplace's share page and installed view use
 * the same cards. Server-safe: no hooks.
 */
export function Flow({ className, children }: { className?: string; children: ReactNode }) {
  const groups = Children.toArray(children);
  return (
    <div className={cn("flex flex-col", className)}>
      {groups.map((group, index) => (
        <Fragment key={isValidElement(group) && group.key !== null ? group.key : index}>
          {index > 0 ? <FlowArrow /> : null}
          {group}
        </Fragment>
      ))}
    </div>
  );
}

/** One system; its things hang off the tile on a guide line (`ml-[1.875rem]` is the tile's centre). */
export function FlowGroup({
  icon: Icon,
  title,
  subtitle,
  meta,
  footer,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  meta?: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center gap-3 px-4 pb-2 pt-3">
        {/* Neutral: the kinds are facts, never coloured. */}
        <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle ? <span className="text-xs text-muted-foreground">{subtitle}</span> : null}
        </div>
        {meta ? <span className="shrink-0 text-xs text-muted-foreground">{meta}</span> : null}
      </div>
      <div className="mb-3 ml-[1.875rem] mr-3 border-l border-border">
        <ul>{children}</ul>
        {footer ? <div className="pl-4 pt-2">{footer}</div> : null}
      </div>
    </div>
  );
}

/** One thing in a system. `control` puts a checkbox in front and makes the row its label. */
export function FlowItem({
  icon,
  kind,
  name,
  badge,
  note,
  control,
  depth,
}: {
  icon: ReactNode;
  kind?: string;
  name: string;
  badge?: ReactNode;
  note?: ReactNode;
  control?: ReactNode;
  depth?: 1 | 2;
}) {
  const body = (
    <>
      <span className="flex items-center gap-3">
        {control}
        <span aria-hidden className="flex w-5 shrink-0 justify-center text-muted-foreground">
          {icon}
        </span>
        <span className="min-w-0 flex-1 break-words">
          {kind ? (
            <>
              <span className="text-muted-foreground">{kind}</span>{" "}
              <span className="font-medium text-foreground">„{name}“</span>
            </>
          ) : (
            <span className="font-medium text-foreground">{name}</span>
          )}
        </span>
        {badge}
      </span>
      {note ? <span className={`mt-0.5 block ${control ? "pl-15" : "pl-8"} text-xs leading-relaxed text-muted-foreground`}>{note}</span> : null}
    </>
  );
  const row = `block rounded-r-md py-2 ${depth === 2 ? "pl-14" : depth === 1 ? "pl-9" : "pl-4"} pr-3 text-sm`;
  const tick = depth === 2 ? "before:w-12" : depth === 1 ? "before:w-7" : "before:w-2.5";

  return (
    <li className={`relative before:absolute before:left-0 before:top-[1.125rem] before:h-px ${tick} before:bg-border`}>
      {control ? <label className={`${row} cursor-pointer has-[:disabled]:cursor-not-allowed`}>{body}</label> : <div className={row}>{body}</div>}
    </li>
  );
}

/** A quiet label over the rows of one kind („Datenquellen (2)“). */
export function FlowHeading({ children }: { children: ReactNode }) {
  return <li className="pb-0.5 pl-4 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{children}</li>;
}

/** A remark inside a group, at the size of a row's note. */
export function FlowNote({ children }: { children: ReactNode }) {
  return <li className="py-2 pl-4 pr-3 text-xs leading-relaxed text-muted-foreground">{children}</li>;
}

function FlowArrow() {
  return (
    <div aria-hidden className="flex h-7 items-center pl-[23px] text-muted-foreground/60">
      <ArrowDown className="size-4" />
    </div>
  );
}

/** A thing's state next to its name. Green only for good news, and then with an icon. */
export function StatusPill({ tone, icon: Icon, children }: { tone: "success" | "muted"; icon?: LucideIcon; children: ReactNode }) {
  const colour =
    tone === "success"
      ? "shrink-0 rounded bg-success/10 px-1.5 py-0.5 text-xs text-success dark:bg-success/20"
      : "shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground";
  if (!Icon) return <span className={colour}>{children}</span>;
  return (
    <span className={`${colour} inline-flex items-center gap-1`}>
      <Icon aria-hidden className="size-3" />
      {children}
    </span>
  );
}
