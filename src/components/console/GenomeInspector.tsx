import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMind, padMind } from "@/lib/manifold/minds";
import type { OrganismState } from "@/lib/manifold/types";
import { deriveSunoGenome, JURISDICTIONS } from "@/lib/suno/genome";
import { cn } from "@/lib/utils";
import { MutationDiff } from "./MutationDiff";

const STATUS_STYLE: Record<string, string> = {
  active: "text-fg",
  locked: "text-lime-300",
  scarred: "text-orange-300",
  dormant: "text-muted",
  suppressed: "text-amber-300",
  lost: "text-danger",
};

export function GenomeInspector({
  state,
  onLock,
  onOpenRack,
}: {
  state: OrganismState;
  onLock: (traitId: string) => void;
  onOpenRack?: () => void;
}) {
  const genome = deriveSunoGenome(state);
  const mind = getMind(state.installedMind);
  const groups = JURISDICTIONS.map((jurisdiction) => ({
    jurisdiction,
    genes: genome.byJurisdiction[jurisdiction],
  })).filter((group) => group.genes.length > 0);

  return (
    <aside className="flex h-full min-h-0 flex-col bg-surface">
      <div className="border-b border-border px-4 py-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted">Genome / mutation inspector</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl italic text-fg">Generation {state.generation}</h2>
            <p className="mt-0.5 font-mono text-[10px] text-muted">{state.seedId}</p>
          </div>
          <span className="font-mono text-[10px] text-muted">{state.traits.length} genes</span>
        </div>
        <div className="mt-3">
          <MutationDiff diff={state.lastMutationDiff} />
        </div>
      </div>

      {mind ? (
        <button
          type="button"
          onClick={onOpenRack}
          className="border-b border-border bg-elevated px-4 py-3 text-left transition hover:bg-elevated/80"
        >
          <p className="text-[9px] uppercase tracking-[0.18em] text-accent">Installed Temporary Mind</p>
          <p className="mt-1 font-mono text-[11px] text-fg">{padMind(mind.n)} {mind.label}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{mind.whatItDoes}</p>
        </button>
      ) : (
        <button
          type="button"
          onClick={onOpenRack}
          className="border-b border-border px-4 py-2 text-left font-mono text-[10px] text-muted transition hover:text-accent"
        >
          No Temporary Mind slotted · open rack
        </button>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-3">
          {groups.map((group) => (
            <section key={group.jurisdiction} className="rounded-xl border border-border bg-bg/45 p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">{group.jurisdiction}</p>
                <span className="font-mono text-[9px] text-muted">{group.genes.length}</span>
              </div>
              <div className="space-y-2">
                {group.genes.map(({ trait, status }) => {
                  const canLock = !trait.locked && !trait.lost && !trait.suppressed;
                  return (
                    <article
                      key={trait.id}
                      className={cn(
                        "rounded-lg border border-border/70 bg-surface p-2.5",
                        status === "lost" && "opacity-45",
                        status === "suppressed" && "opacity-65",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-fg" title={trait.name}>{trait.name}</p>
                          <p className={cn("mt-0.5 font-mono text-[9px] uppercase tracking-wide", STATUS_STYLE[status])}>{status}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={!canLock}
                          onClick={() => canLock && onLock(trait.id)}
                          aria-label={trait.locked ? `${trait.name} is locked` : `Lock ${trait.name}`}
                          title={trait.locked ? "Locked invariant" : canLock ? "Lock as invariant" : status}
                        >
                          {trait.locked ? <Lock /> : <Unlock />}
                        </Button>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-fg/85">{trait.rule}</p>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-elevated">
                        <div className="h-full bg-accent" style={{ width: `${Math.round(Math.max(0, Math.min(1, trait.strength)) * 100)}%` }} />
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <details className="mt-4 rounded-xl border border-border bg-bg/40 p-3">
          <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Lab detail</summary>
          <div className="mt-3 space-y-4 text-[11px] leading-relaxed text-muted">
            {state.scars.length ? (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wide text-danger">Scars</p>
                {state.scars.map((scar) => <p key={scar.id} className="mt-1 text-fg/80">{scar.description}</p>)}
              </div>
            ) : null}
            {state.debris.length ? (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wide text-orange-300">Debris</p>
                {state.debris.map((debris) => <p key={debris.id} className="mt-1">{debris.label}: {debris.rule}</p>)}
              </div>
            ) : null}
            {state.relationships.length ? (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wide text-muted">Relationships</p>
                {state.relationships.slice(-12).map((rel) => (
                  <p key={rel.id} className="mt-1">{rel.from} {rel.kind.replaceAll("_", " ")} {rel.to}</p>
                ))}
              </div>
            ) : null}
            {!state.scars.length && !state.debris.length && !state.relationships.length ? <p>No deeper wreckage yet.</p> : null}
          </div>
        </details>
      </div>
    </aside>
  );
}
