import { Button } from "@/components/ui/button";

export function StartScreen({
  onBegin,
  onOpenSpec,
}: {
  onBegin: () => void;
  onOpenSpec: () => void;
}) {
  return (
    <main className="relative flex min-h-dvh flex-col justify-end bg-bg px-5 pb-10 pt-16 sm:justify-center sm:px-12">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute left-[12%] top-[18%] size-1.5 rounded-full bg-accent" />
        <div className="absolute right-[22%] top-[28%] size-1 rounded-full bg-muted" />
        <div className="absolute left-[40%] top-[22%] size-1 rounded-full bg-muted" />
        <div className="absolute bottom-[38%] right-[18%] size-1.5 rounded-full bg-accent/70" />
      </div>
      <div className="relative mx-auto w-full max-w-xl">
        <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-muted">
          Navigation instrument
        </p>
        <h1 className="font-display text-5xl font-medium leading-tight tracking-[-0.03em] text-fg sm:text-6xl">
          Semantic
          <span className="italic text-accent"> Manifold</span>
        </h1>
        <p className="mt-6 max-w-prose font-display text-xl italic leading-snug text-fg/90">
          Do not ask what the destination looks like. Ask what the current thing
          becomes by traveling there this particular way.
        </p>
        <p className="mt-5 max-w-prose text-sm leading-relaxed text-muted">
          This is not a blender and not a prompt box. You move a persistent
          organism through conceptual space. The route, the ruler, and the
          wreckage are part of the artwork. Suno is just the first synthesizer
          plugged into it.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button size="lg" onClick={onBegin} className="min-h-12">
            Begin as a pulse
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={onOpenSpec}
            className="min-h-12 text-muted"
          >
            Design spec v0.1
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted">
          First path: via Déjà Vu · WTF neighbor · collide with Wasp Nest ·
          compile
        </p>
      </div>
    </main>
  );
}
