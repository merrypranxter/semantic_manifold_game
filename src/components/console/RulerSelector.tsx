import { METRICS } from "@/lib/manifold/metrics";
import type { MetricId } from "@/lib/manifold/types";
import { cn } from "@/lib/utils";

export function RulerSelector({
  value,
  onChange,
}: {
  value: MetricId;
  onChange: (m: MetricId) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="px-1 text-[10px] uppercase tracking-[0.16em] text-muted">Ruler</p>
      <div className="flex flex-wrap gap-1">
        {METRICS.map((m) => {
          const on = m.id === value;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange(m.id)}
              title={m.blurb}
              className={cn(
                "h-9 rounded-md px-2.5 text-xs transition-[background-color,color] duration-150",
                on ? "bg-accent text-accent-fg" : "bg-elevated text-muted hover:text-fg",
              )}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
