import Link from "next/link";
import { ChevronRight, ClipboardList, PackageCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InstallUseCaseButton } from "@/components/use-cases/install-use-case-button";
import { DeprecatedStatus, TierStatus } from "@/components/use-cases/use-case-status";
import { isInstallable, type ResolvedMember } from "@/lib/groups";

/** A group's members, each with its own facts and its own way in. */
export function GroupMembers({
  members,
  ordered,
  groupOrg,
  installedIds,
}: {
  members: ResolvedMember[];
  ordered: boolean;
  /** The group's organisation: members from another one say so. */
  groupOrg?: string;
  installedIds: ReadonlySet<string>;
}) {
  return (
    <ol className="flex flex-col gap-3">
      {members.map((member, index) => (
        <MemberRow
          key={member.ref.id}
          member={member}
          position={index + 1}
          ordered={ordered}
          groupOrg={groupOrg}
          installed={installedIds.has(member.ref.id)}
        />
      ))}
    </ol>
  );
}

function MemberRow({
  member,
  position,
  ordered,
  groupOrg,
  installed,
}: {
  member: ResolvedMember;
  position: number;
  ordered: boolean;
  groupOrg?: string;
  installed: boolean;
}) {
  const { ref, useCase } = member;
  if (!useCase) {
    return (
      <li className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
        Nicht mehr im Katalog ({ref.id}).
      </li>
    );
  }

  const href = `/marketplace/use-cases/${useCase.id}`;
  const operator = useCase.implementation?.operator ?? useCase.publisher;
  const operatorOrg = useCase.implementation?.operatorOrg;
  const fromElsewhere = Boolean(groupOrg && operatorOrg && operatorOrg !== groupOrg);

  return (
    <li className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-start">
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-md bg-emerald-500/10 text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400"
      >
        {ordered ? position : <ClipboardList className="size-4" />}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link href={href} className="font-semibold text-foreground underline-offset-2 hover:underline">
            {useCase.title}
          </Link>
          {ref.optional ? (
            <span className="rounded-md border px-1.5 py-0.5 text-xs text-muted-foreground">Optional</span>
          ) : null}
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{useCase.summary}</p>
        {ref.note ? <p className="mt-2 text-sm text-foreground">{ref.note}</p> : null}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          {useCase.deprecated ? <DeprecatedStatus /> : <TierStatus tier={useCase.curationTier} />}
          {fromElsewhere ? <span>Von {operator}</span> : null}
          {isInstallable(useCase) ? null : <span>Nur beschrieben, kein Paket</span>}
          {installed ? (
            <span className="inline-flex items-center gap-1.5 text-foreground">
              <PackageCheck aria-hidden className="size-4" />
              Hier installiert
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
        {isInstallable(useCase) && !installed ? <InstallUseCaseButton useCase={useCase} variant="outline" /> : null}
        <Button asChild variant="ghost" size="sm">
          <Link href={href}>
            Ansehen
            <ChevronRight aria-hidden />
          </Link>
        </Button>
      </div>
    </li>
  );
}
