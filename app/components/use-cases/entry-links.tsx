import { ExternalLink } from "lucide-react";

import { Eyebrow } from "@/components/ui/layout";
import type { EntryLink } from "@/types/use-cases";

const host = (url: string) => (URL.canParse(url) ? new URL(url).hostname : url);

/** „Weiterführende Links“: each with its address and what is to be found there. */
export function EntryLinks({ links, className }: { links: readonly EntryLink[]; className?: string }) {
  if (links.length === 0) return null;
  return (
    <div className={className}>
      <Eyebrow>Weiterführende Links</Eyebrow>
      <ul className="mt-3 flex flex-col gap-4">
        {links.map((link) => (
          <li key={link.url} className="flex flex-col gap-0.5">
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary underline-offset-2 hover:underline"
            >
              {link.title}
              <ExternalLink aria-hidden className="size-3.5 shrink-0" />
            </a>
            <span className="text-xs text-muted-foreground">{host(link.url)}</span>
            {link.description ? <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{link.description}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
