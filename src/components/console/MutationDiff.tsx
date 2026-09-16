import type { MutationDiff as MutationDiffData } from "@/lib/manifold/types";
import { cn } from "@/lib/utils";

const GROUPS: Array<{
  key: keyof MutationDiffData;
  label: string;
  className: string;
}> = [
  { key: "mutated", label: "MUTATED", className: "border-accent/50 text-accent" },
  { key: "added", label: "ADDED", className: "border-cyan-400/40 text-cyan-300" },
  { key: "suppressed", label: "SUPPRESSED", className: "border-amber-400/40 text-amber-300" },
  { key: "lost", label: "LOST", className: "border-danger/50 text-danger" },
  { key: "scarred", label: "NEW SCAR", className: "border-orange-400/40 text-orange-300" },
  { key: "preserved", label: "PRESERVED", className: "border-lime-400/40 text-lime-300" },
];

export function MutationDiff({ diff, compact = false }: { diff?: MutationDiffData; compact?: boolean }) {
  if (!diff) return null;
  const visible = GROUPS.filter((group) => diff[group.key].length > 0);
  if (!visible.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-1.5", !compact && "gap-y-2")}>
      {visible.map((group) => (
        <div
          key={group.key}
          className={cn(
            "rounded-full border bg-bg/70 px-2 py-1 font-mono text-[9px] uppercase tracking-wide",
            group.className,
          )}
          title={diff[group.key].join(", ")}
        >
          {group.label}: {diff[group.key].slice(0, compact ? 1 : 2).join(", ")}
          {diff[group.key].length > (compact ? 1 : 2) ? ` +${diff[group.key].length - (compact ? 1 : 2)}` : ""}
        </div>
      ))}
    </div>
  );
}
