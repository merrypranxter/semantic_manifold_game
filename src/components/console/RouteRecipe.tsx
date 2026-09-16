import type { CommandProposal } from "@/lib/manifold/types";

export function RouteRecipe({
  pending,
  selectedLabel,
  metric,
}: {
  pending: CommandProposal | null;
  selectedLabel?: string;
  metric: string;
}) {
  const op = pending?.operator ?? "DIRECT";
  const dest = pending?.targetLabel || selectedLabel || "—";
  const via = pending?.waypointLabel;
  return (
    <div className="flex flex-wrap items-center gap-1.5 px-1 py-1">
      <span className="text-[10px] uppercase tracking-[0.16em] text-muted">Route</span>
      <Chip>{op}</Chip>
      {via ? (
        <>
          <span className="text-muted">via</span>
          <Chip>{via}</Chip>
        </>
      ) : null}
      <span className="text-muted">→</span>
      <Chip>{dest}</Chip>
      <span className="text-muted">under</span>
      <Chip>{metric}</Chip>
    </div>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-md bg-elevated px-2 py-1 font-mono text-[11px] uppercase tracking-wide text-fg">
      {children}
    </span>
  );
}
