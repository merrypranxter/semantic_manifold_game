import { FAMILIES, FAMILY_IDS, familyFill, type FamilyId } from "@/lib/manifold/families";
import type { MapMode } from "@/lib/manifold/types";
import { cn } from "@/lib/utils";

export function FieldChrome({
  mode,
  onMode,
  family,
  onFamily,
  wordCount,
}: {
  mode: MapMode;
  onMode: (m: MapMode) => void;
  family: string;
  onFamily: (id: string) => void;
  wordCount: number;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 p-3">
      <div className="pointer-events-auto flex flex-wrap items-center gap-2">
        <div className="flex rounded-md bg-surface p-0.5 shadow-[var(--shadow-border)]">
          {(
            [
              ["DRIFT", "Drift"],
              ["TRACK", "Track"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => onMode(id)}
              className={cn(
                "h-8 rounded-[6px] px-3 text-[11px] uppercase tracking-[0.14em] transition-colors duration-150",
                mode === id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:block">
          {wordCount.toLocaleString()} regions · WASD fly · Q/E tilt · scroll depth
        </p>
      </div>
      <div className="pointer-events-auto -mx-1 flex gap-1 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => onFamily("all")}
          className={cn(
            "h-8 shrink-0 rounded-md px-2.5 text-[11px] uppercase tracking-[0.12em]",
            family === "all" ? "bg-elevated text-fg" : "text-muted hover:text-fg",
          )}
        >
          All
        </button>
        {FAMILY_IDS.map((id) => {
          const on = family === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onFamily(on ? "all" : id)}
              className={cn(
                "flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-[11px] uppercase tracking-[0.12em]",
                on ? "bg-elevated text-fg" : "text-muted hover:text-fg",
              )}
              title={FAMILIES[id as FamilyId].whatItDoes}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ background: familyFill(id) }}
                aria-hidden
              />
              {FAMILIES[id as FamilyId].label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
