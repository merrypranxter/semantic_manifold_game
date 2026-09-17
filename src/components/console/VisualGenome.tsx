import { ChevronDown, LockKeyhole } from "lucide-react";
import { summarizeVisualState } from "@/lib/domain/visual-ui-core";
import type { OrganismState, Trait } from "@/lib/manifold/types";
import { cn } from "@/lib/utils";

export function VisualGenome({
  state,
  detailed = false,
}: {
  state: OrganismState;
  detailed?: boolean;
}) {
  const summary = summarizeVisualState(state);

  return (
    <section className="border-b border-border bg-bg/35 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-accent">Visual genome</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted">
            {summary.outputKind} target · generation {summary.generation} · ancestry {summary.ancestryDepth}
          </p>
        </div>
        <div className="text-right font-mono text-[10px] leading-relaxed text-muted">
          <p>{summary.anchors.length} anchors</p>
          <p>{summary.mutable.length} mutable laws</p>
        </div>
      </div>

      {summary.sourcePrompt ? (
        <details className="group mt-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-xs text-muted marker:hidden hover:text-fg">
            <span>Preserved source prompt</span>
            <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
          </summary>
          <pre className="mt-2 max-h-36 overflow-auto whitespace-pre-wrap rounded-lg bg-surface p-2.5 font-mono text-[10px] leading-relaxed text-fg/80 shadow-[var(--shadow-border)]">
            {summary.sourcePrompt}
          </pre>
        </details>
      ) : null}

      {detailed ? (
        <div className="mt-4 space-y-4">
          <GenomeGroup
            label="Identity anchors"
            note="low-mutability / locked"
            traits={summary.anchors}
            accent
          />
          <GenomeGroup
            label="Mutable laws"
            note="route may rewrite"
            traits={summary.mutable}
          />
          {summary.invariants.length ? (
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] uppercase tracking-[0.16em] text-accent">Invariants</p>
                <p className="font-mono text-[9px] uppercase text-muted">operator must work around these</p>
              </div>
              <ul className="mt-2 space-y-1.5">
                {summary.invariants.map((invariant) => (
                  <li key={invariant.id} className="flex gap-2 text-xs leading-relaxed text-fg">
                    <LockKeyhole className="mt-0.5 size-3 shrink-0 text-accent" />
                    <span>
                      <span className="font-mono text-[9px] uppercase text-muted">{invariant.level}</span>{" "}
                      {invariant.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {summary.inactive.length ? (
            <GenomeGroup
              label="Inactive / lost"
              note="kept in ancestry, omitted from compile"
              traits={summary.inactive}
              muted
            />
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-xs leading-relaxed text-muted">
          {summary.invariants.length} invariants · {state.scars.length} scars · {summary.inactive.length} inactive laws. Open Lab for the decompiled genome.
        </p>
      )}
    </section>
  );
}

function GenomeGroup({
  label,
  note,
  traits,
  accent = false,
  muted = false,
}: {
  label: string;
  note: string;
  traits: Trait[];
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p
          className={cn(
            "text-[10px] uppercase tracking-[0.16em]",
            accent ? "text-accent" : "text-muted",
          )}
        >
          {label}
        </p>
        <p className="font-mono text-[9px] uppercase text-muted">{note}</p>
      </div>
      {traits.length ? (
        <ul className={cn("mt-2 space-y-2", muted && "opacity-55")}>
          {traits.map((trait) => (
            <li key={trait.id}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs text-fg">{trait.name}</p>
                <p className="font-mono text-[9px] uppercase text-muted">{String(trait.jurisdiction).replaceAll("_", " ")}</p>
              </div>
              <p className="mt-0.5 text-[11px] leading-relaxed text-fg/80">{trait.rule}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-muted">None extracted.</p>
      )}
    </div>
  );
}
