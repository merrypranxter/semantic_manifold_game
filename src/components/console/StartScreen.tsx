import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

type StartAction = "begin" | "rack" | "spec";

export function StartScreen({
  onBegin,
  onOpenSpec,
  onOpenRack,
  error,
}: {
  onBegin: () => void;
  onOpenSpec: () => void;
  onOpenRack?: () => void;
  error?: string | null;
}) {
  const beginRef = useRef(onBegin);
  const specRef = useRef(onOpenSpec);
  const rackRef = useRef(onOpenRack);
  beginRef.current = onBegin;
  specRef.current = onOpenSpec;
  rackRef.current = onOpenRack;

  const lastRef = useRef({ at: 0, action: "" as string });
  const fire = (action: StartAction) => {
    const now = performance.now();
    if (action === lastRef.current.action && now - lastRef.current.at < 450) return;
    lastRef.current = { at: now, action };
    if (action === "begin") beginRef.current();
    else if (action === "spec") specRef.current();
    else rackRef.current?.();
  };
  const fireRef = useRef(fire);
  fireRef.current = fire;

  useEffect(() => {
    const fromEvent = (e: Event) => {
      if ("button" in e) {
        const button = (e as PointerEvent).button;
        if (typeof button === "number" && button !== 0) return;
      }
      const target = e.target;
      if (!(target instanceof Element)) return;
      const host = target.closest("[data-start]");
      if (!(host instanceof HTMLElement)) return;
      const action = host.getAttribute("data-start");
      if (action === "begin" || action === "rack" || action === "spec") {
        fireRef.current(action);
      }
    };

    window.addEventListener("pointerdown", fromEvent, true);
    window.addEventListener("click", fromEvent, true);
    return () => {
      window.removeEventListener("pointerdown", fromEvent, true);
      window.removeEventListener("click", fromEvent, true);
    };
  }, []);

  const bind = (action: StartAction) => ({
    "data-start": action,
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.button !== 0) return;
      fire(action);
    },
    onClick: () => fire(action),
  });

  return (
    <main className="relative z-10 flex min-h-dvh flex-col justify-center bg-bg px-5 py-12 sm:px-12">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute left-[12%] top-[18%] size-1.5 rounded-full bg-accent" />
        <div className="absolute right-[22%] top-[28%] size-1 rounded-full bg-muted" />
        <div className="absolute left-[40%] top-[22%] size-1 rounded-full bg-muted" />
        <div className="absolute bottom-[38%] right-[18%] size-1.5 rounded-full bg-accent/70" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-xl">
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
        <div className="relative z-20 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="button"
            size="lg"
            className="min-h-12 touch-manipulation"
            {...bind("begin")}
          >
            Begin as a pulse
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="min-h-12 touch-manipulation text-muted"
            {...bind("rack")}
          >
            Mind rack
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="min-h-12 touch-manipulation text-muted"
            {...bind("spec")}
          >
            Design spec v0.1
          </Button>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
        <p className="mt-8 max-w-prose text-sm leading-relaxed text-muted">
          This is not a blender and not a prompt box. You move a persistent
          organism through conceptual space. The field is a volume — thousands
          of ordinary words, rare words, and previously unnamed ones, each with
          a job. Drift through it. Travel only when you mean it. Slot a
          temporary mind if you want the route to think differently. The route,
          the ruler, and the wreckage are the artwork.
        </p>
        <p className="mt-4 text-xs text-muted">
          First path: slot Ownership · via Déjà Vu · collide with Wasp Nest ·
          compile
        </p>
      </div>
    </main>
  );
}
