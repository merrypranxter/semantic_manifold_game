import type { LedgerEvent, OrganismState } from "@/lib/manifold/types";
import { cn } from "@/lib/utils";

export function HistoryStrip({
  origin,
  ledger,
  currentId,
  states,
  onRestore,
}: {
  origin: OrganismState | undefined;
  ledger: LedgerEvent[];
  currentId: string;
  states: Record<string, OrganismState>;
  onRestore: (id: string) => void;
}) {
  const chips: { id: string; label: string; sub: string }[] = [];
  if (origin) chips.push({ id: origin.id, label: "Origin", sub: origin.name });
  for (const ev of ledger) {
    chips.push({
      id: ev.toStateId,
      label: ev.operator,
      sub: ev.waypointLabel ? `${ev.waypointLabel} → ${ev.targetLabel}` : ev.targetLabel,
    });
  }

  return (
    <div className="border-t border-border bg-bg px-3 py-2">
      <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-muted">Ledger</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {chips.length === 0 ? (
          <span className="text-xs text-muted">Empty history.</span>
        ) : (
          chips.map((c, i) => {
            const exists = Boolean(states[c.id]);
            const on = c.id === currentId;
            return (
              <button
                key={`${c.id}-${i}`}
                type="button"
                disabled={!exists}
                onClick={() => exists && onRestore(c.id)}
                className={cn(
                  "h-11 shrink-0 rounded-lg px-3 text-left transition-colors duration-150",
                  on ? "bg-accent text-accent-fg" : "bg-elevated text-fg hover:bg-elevated/80",
                  !exists && "opacity-40",
                )}
              >
                <span className="block font-mono text-[10px] uppercase tracking-wide opacity-80">
                  {c.label}
                </span>
                <span className="block max-w-40 truncate text-xs">{c.sub}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
