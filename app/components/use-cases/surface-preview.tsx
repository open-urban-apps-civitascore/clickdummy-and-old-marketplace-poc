import type { EndUserSurface } from "@/types/use-cases";

/**
 * Preview thumbnails for the end-user surfaces. Generated SVG rather than
 * screenshots: a screenshot of a dashboard that does not exist yet would be a
 * promise we have not kept, while a stylised preview reads as "this is the kind
 * of thing you get" — and it never 404s, needs no asset pipeline, and themes
 * with the app. Each motif imitates the target tool's silhouette closely enough
 * to be recognised at thumbnail size.
 */

const TONE = {
  superset: { surface: "bg-emerald-500/10", fill: "fill-emerald-600 dark:fill-emerald-500", soft: "fill-emerald-500/30", stroke: "stroke-emerald-600 dark:stroke-emerald-500" },
  masterportal: { surface: "bg-sky-500/10", fill: "fill-sky-600 dark:fill-sky-500", soft: "fill-sky-500/30", stroke: "stroke-sky-600 dark:stroke-sky-500" },
  grafana: { surface: "bg-orange-500/10", fill: "fill-orange-600 dark:fill-orange-500", soft: "fill-orange-500/30", stroke: "stroke-orange-600 dark:stroke-orange-500" },
  app: { surface: "bg-violet-500/10", fill: "fill-violet-600 dark:fill-violet-500", soft: "fill-violet-500/30", stroke: "stroke-violet-600 dark:stroke-violet-500" },
  chatbot: { surface: "bg-amber-500/10", fill: "fill-amber-600 dark:fill-amber-500", soft: "fill-amber-500/30", stroke: "stroke-amber-600 dark:stroke-amber-500" },
} as const;

function Motif({ kind }: { kind: EndUserSurface["kind"] }) {
  const t = TONE[kind];
  switch (kind) {
    // Superset: a KPI row above a bar chart — the classic BI board silhouette.
    case "superset":
      return (
        <g>
          <g className={t.soft}>
            <rect x="12" y="12" width="52" height="22" rx="4" />
            <rect x="72" y="12" width="52" height="22" rx="4" />
            <rect x="132" y="12" width="52" height="22" rx="4" />
          </g>
          <g className={t.fill}>
            <rect x="16" y="66" width="18" height="30" rx="2" />
            <rect x="42" y="52" width="18" height="44" rx="2" />
            <rect x="68" y="74" width="18" height="22" rx="2" />
            <rect x="94" y="44" width="18" height="52" rx="2" />
            <rect x="120" y="60" width="18" height="36" rx="2" />
            <rect x="146" y="50" width="18" height="46" rx="2" />
          </g>
        </g>
      );
    // Masterportal: map canvas with a layer panel and pins.
    case "masterportal":
      return (
        <g>
          <g className={t.soft}>
            <rect x="10" y="10" width="44" height="86" rx="4" />
          </g>
          <g className="stroke-current opacity-25" strokeWidth="2" fill="none">
            <line x1="64" y1="38" x2="190" y2="38" />
            <line x1="64" y1="68" x2="190" y2="68" />
            <line x1="104" y1="10" x2="104" y2="96" />
            <line x1="150" y1="10" x2="150" y2="96" />
          </g>
          <g className={t.fill}>
            <path d="M104 30c-7 0-12 5-12 12 0 9 12 22 12 22s12-13 12-22c0-7-5-12-12-12zm0 17a5 5 0 110-10 5 5 0 010 10z" />
            <path d="M158 52c-5 0-9 4-9 9 0 7 9 17 9 17s9-10 9-17c0-5-4-9-9-9zm0 13a4 4 0 110-8 4 4 0 010 8z" opacity="0.7" />
          </g>
          <g className={t.soft}>
            <rect x="16" y="18" width="32" height="5" rx="2.5" />
            <rect x="16" y="30" width="26" height="5" rx="2.5" />
            <rect x="16" y="42" width="30" height="5" rx="2.5" />
          </g>
        </g>
      );
    // Grafana: time-series panels with the characteristic filled area.
    case "grafana":
      return (
        <g>
          <g className={t.soft}>
            <path d="M12 78 L44 58 L76 68 L108 40 L140 52 L188 26 L188 96 L12 96 Z" />
          </g>
          <polyline
            className={t.stroke}
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="12,78 44,58 76,68 108,40 140,52 188,26"
          />
          <g className={t.fill}>
            <circle cx="108" cy="40" r="5" />
            <rect x="12" y="10" width="60" height="8" rx="4" opacity="0.5" />
          </g>
        </g>
      );
    // Custom app: a phone frame with content blocks and a primary action.
    case "app":
      return (
        <g>
          <rect className={t.soft} x="66" y="8" width="68" height="90" rx="10" />
          <g className={t.fill}>
            <rect x="76" y="20" width="48" height="6" rx="3" />
            <rect x="76" y="32" width="34" height="6" rx="3" opacity="0.6" />
            <rect x="76" y="48" width="48" height="20" rx="4" opacity="0.35" />
            <rect x="76" y="76" width="48" height="12" rx="6" />
          </g>
        </g>
      );
    // Chatbot: alternating conversation bubbles.
    case "chatbot":
    default:
      return (
        <g>
          <g className={t.soft}>
            <rect x="14" y="16" width="96" height="22" rx="11" />
            <rect x="14" y="70" width="80" height="22" rx="11" />
          </g>
          <g className={t.fill}>
            <rect x="90" y="43" width="96" height="22" rx="11" />
            <circle cx="118" cy="27" r="3" opacity="0.7" />
            <circle cx="132" cy="27" r="3" opacity="0.7" />
            <circle cx="146" cy="27" r="3" opacity="0.7" />
          </g>
        </g>
      );
  }
}

export function SurfacePreview({ kind, className = "h-28" }: { kind: EndUserSurface["kind"]; className?: string }) {
  return (
    <div className={`w-full ${TONE[kind].surface} ${className}`}>
      <svg viewBox="0 0 200 106" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
        <Motif kind={kind} />
      </svg>
    </div>
  );
}
