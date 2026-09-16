import { BrainCircuit, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUNO_SEEDS } from "@/lib/suno/seeds";

export function GenotypePicker({
  onChoose,
  onOpenRack,
  onOpenSpec,
  error,
}: {
  onChoose: (seedId: string) => void;
  onOpenRack?: () => void;
  onOpenSpec?: () => void;
  error?: string | null;
}) {
  return (
    <main className="min-h-dvh bg-bg px-4 py-7 text-fg sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.24em] text-accent">Suno Prompt Manifold</p>
            <h1 className="mt-2 font-display text-4xl italic leading-none sm:text-6xl">
              Choose a prompt <span className="text-accent">genotype</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              These are not genre presets. Each seed begins as a complete musical organism with a different way of surviving mutation. Pick the kind of creature you want to abuse, then drive its Suno prompt through conceptual space.
            </p>
          </div>
          <div className="flex gap-2">
            {onOpenRack ? (
              <Button variant="outline" size="sm" onClick={onOpenRack}>
                <BrainCircuit /> Minds
              </Button>
            ) : null}
            {onOpenSpec ? (
              <Button variant="ghost" size="icon-sm" onClick={onOpenSpec} aria-label="Open design specification">
                <ScrollText />
              </Button>
            ) : null}
          </div>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SUNO_SEEDS.map((seed) => (
            <button
              key={seed.id}
              type="button"
              onClick={() => onChoose(seed.id)}
              className="group flex min-h-64 flex-col rounded-2xl border border-border bg-surface p-4 text-left transition hover:-translate-y-0.5 hover:border-accent/70 hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-accent">{seed.dna}</p>
              <h2 className="mt-2 font-display text-2xl italic text-fg">{seed.label}</h2>
              <p className="mt-2 text-sm leading-relaxed text-fg/90">{seed.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {seed.tendencies.map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-bg px-2 py-1 font-mono text-[10px] text-muted">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto pt-4">
                <p className="text-[9px] uppercase tracking-[0.16em] text-muted">Evolves well by</p>
                <p className="mt-1 font-mono text-[11px] leading-relaxed text-fg/80">{seed.evolvesWellBy.join(" · ")}</p>
                <p className="mt-3 text-xs text-accent opacity-70 transition group-hover:opacity-100">Begin generation zero →</p>
              </div>
            </button>
          ))}
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </div>
    </main>
  );
}
