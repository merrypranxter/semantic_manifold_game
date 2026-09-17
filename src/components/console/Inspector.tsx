import { Lock } from "lucide-react";
import { getMind, padMind } from "@/lib/manifold/minds";
import type { LedgerEvent, OrganismState, ViewMode } from "@/lib/manifold/types";
import { cn } from "@/lib/utils";
import { VisualGenome } from "./VisualGenome";

export function Inspector({
  state,
  view,
  lastEvent,
  onLock,
  onOpenRack,
}: {
  state: OrganismState;
  view: ViewMode;
  lastEvent: LedgerEvent | undefined;
  onLock: (traitId: string) => void;
  onOpenRack?: () => void;
}) {
  const live = state.traits.filter((t) => !t.lost);
  const mind = getMind(state.installedMind);
  const visual = state.provenance?.domain === "visual";

  return (
    <aside className="flex h-full min-h-0 flex-col bg-surface">
      <div className="border-b border-border px-4 py-3">
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Current state</p>
        <h2 className="font-display text-2xl italic leading-tight text-fg">{state.name}</h2>
        <p className="mt-1 text-xs text-muted">v{state.version} · {state.identity}</p>
      </div>

      {mind ? (
        <button
          type="button"
          onClick={onOpenRack}
          className="border-b border-border bg-elevated px-4 py-2 text-left"
        >
          <p className="text-[10px] uppercase tracking-[0.16em] text-accent">Slotted mind</p>
          <p className="font-mono text-[11px] text-fg">
            {padMind(mind.n)} {mind.label}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">{mind.whatItDoes}</p>
        </button>
      ) : null}

      {visual ? <VisualGenome state={state} detailed={view === "LAB"} /> : null}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {view === "PLAY" ? (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-fg">{state.playProjection}</p>
            {lastEvent ? (
              <div className="rounded-xl bg-elevated p-3 shadow-[var(--shadow-border)]">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Last event</p>
                <p className="mt-1 font-mono text-[11px] text-accent">
                  {lastEvent.operator}
                  {lastEvent.waypointLabel ? ` via ${lastEvent.waypointLabel}` : ""} → {lastEvent.targetLabel}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg">{lastEvent.narrative}</p>
              </div>
            ) : (
              <p className="text-sm text-muted">
                {visual
                  ? "No travel yet. This is generation zero extracted from the source prompt."
                  : "No travel yet. The pulse is still unnamed."}
              </p>
            )}
            {state.scars.length > 0 ? (
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-danger">Scars</p>
                <ul className="mt-2 space-y-2">
                  {state.scars.slice(-3).map((s) => (
                    <li key={s.id} className="text-sm leading-relaxed text-fg">
                      {s.description}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {state.debris.length > 0 ? (
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Debris</p>
                <ul className="mt-2 space-y-1">
                  {state.debris.slice(-4).map((d) => (
                    <li key={d.id} className="font-mono text-xs text-muted">
                      {d.label}: {d.rule}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-5">
            <p className="font-mono text-[11px] leading-relaxed text-muted">{state.labProjection}</p>
            {lastEvent ? (
              <div className="rounded-xl bg-elevated p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Delta</p>
                <p className="mt-1 font-mono text-[11px] leading-relaxed text-fg">{lastEvent.lab}</p>
                {lastEvent.added.length ? <Meta label="Added" value={lastEvent.added.join(", ")} /> : null}
                {lastEvent.mutated.length ? <Meta label="Mutated" value={lastEvent.mutated.join(", ")} /> : null}
                {lastEvent.lost.length ? <Meta label="Lost" value={lastEvent.lost.join(", ")} danger /> : null}
              </div>
            ) : null}
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
                {visual ? "All active traits · click lock to promote" : "Traits"}
              </p>
              <ul className="mt-2 space-y-2">
                {live.map((t) => (
                  <li
                    key={t.id}
                    className={cn(
                      "rounded-lg bg-elevated p-2.5",
                      t.suppressed && "opacity-50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm text-fg">{t.name}</p>
                        <p className="font-mono text-[10px] uppercase tracking-wide text-muted">
                          {t.jurisdiction} · {t.source.replaceAll("_", " ")}
                        </p>
                      </div>
                      <button
                        type="button"
                        title="Lock as invariant"
                        onClick={() => onLock(t.id)}
                        className={cn(
                          "size-9 rounded-md text-muted hover:text-accent",
                          t.locked && "text-accent",
                        )}
                      >
                        <Lock className="mx-auto size-3.5" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-fg/90">{t.rule}</p>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-bg">
                      <div
                        className="h-full bg-accent"
                        style={{ width: `${Math.round(t.strength * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {!visual && state.invariants.length ? (
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-accent">Invariants</p>
                <ul className="mt-2 space-y-1">
                  {state.invariants.map((i) => (
                    <li key={i.id} className="font-mono text-xs text-fg">
                      {i.level}: {i.text}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {state.relationships.length ? (
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Relationships</p>
                <ul className="mt-2 space-y-1">
                  {state.relationships.slice(-8).map((r) => (
                    <li key={r.id} className="font-mono text-[11px] text-muted">
                      {r.from} {r.kind.replaceAll("_", " ")} {r.to}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </aside>
  );
}

function Meta({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <p className={cn("mt-1 font-mono text-[11px]", danger ? "text-danger" : "text-muted")}>
      {label}: {value}
    </p>
  );
}
