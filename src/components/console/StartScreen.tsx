import { Clapperboard, ImageIcon, ScanSearch } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { VisualOutputKind } from "@/lib/domain/visual-schema";
import { useManifold } from "@/lib/manifold/store";
import { cn } from "@/lib/utils";

type StartAction = "begin" | "rack" | "spec";

const MAX_PROMPT = 8000;

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
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState<VisualOutputKind>("image");
  const [localError, setLocalError] = useState<string | null>(null);
  const visualBusy = useManifold((s) => s.busy);
  const visualError = useManifold((s) => s.error);

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

  const ingestVisual = () => {
    const raw = prompt.trim();
    if (!raw) {
      setLocalError("Paste an image or video prompt first.");
      return;
    }
    setLocalError(null);
    void useManifold.getState().ingestVisualPrompt(raw, output);
  };

  return (
    <main className="relative z-10 min-h-dvh overflow-hidden bg-bg px-5 py-10 sm:px-10 lg:px-14 lg:py-14">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute left-[12%] top-[18%] size-1.5 rounded-full bg-accent" />
        <div className="absolute right-[22%] top-[28%] size-1 rounded-full bg-muted" />
        <div className="absolute left-[40%] top-[22%] size-1 rounded-full bg-muted" />
        <div className="absolute bottom-[22%] right-[18%] size-1.5 rounded-full bg-accent/70" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(17rem,0.75fr)] lg:items-start lg:gap-14">
        <section>
          <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-muted">
            Navigation instrument · image / video branch
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-medium leading-[0.95] tracking-[-0.035em] text-fg sm:text-6xl">
            Semantic
            <span className="italic text-accent"> Manifold</span>
          </h1>
          <p className="mt-5 max-w-2xl font-display text-xl italic leading-snug text-fg/90">
            Paste a prompt. Keep the specimen. Move its rules through conceptual space instead of merely adding more adjectives.
          </p>

          <form
            className="mt-8 rounded-2xl bg-surface p-3 shadow-[var(--shadow-border)] sm:p-4"
            onSubmit={(event) => {
              event.preventDefault();
              ingestVisual();
            }}
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Source specimen</p>
                <p className="mt-1 text-sm text-fg">The original text is preserved verbatim in provenance.</p>
              </div>
              <div className="flex rounded-lg bg-bg p-1 shadow-[var(--shadow-border)]" aria-label="Output mode">
                <button
                  type="button"
                  aria-pressed={output === "image"}
                  onClick={() => setOutput("image")}
                  className={cn(
                    "flex h-9 items-center gap-2 rounded-md px-3 text-xs transition-colors",
                    output === "image" ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
                  )}
                >
                  <ImageIcon className="size-3.5" />
                  Image
                </button>
                <button
                  type="button"
                  aria-pressed={output === "video"}
                  onClick={() => setOutput("video")}
                  className={cn(
                    "flex h-9 items-center gap-2 rounded-md px-3 text-xs transition-colors",
                    output === "video" ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
                  )}
                >
                  <Clapperboard className="size-3.5" />
                  Video
                </button>
              </div>
            </div>

            <textarea
              value={prompt}
              maxLength={MAX_PROMPT}
              onChange={(event) => {
                setPrompt(event.target.value);
                if (localError) setLocalError(null);
              }}
              placeholder="Paste the actual image or video prompt you want to mutate…"
              className="min-h-52 w-full resize-y rounded-xl border border-border bg-bg px-3 py-3 font-mono text-[13px] leading-relaxed text-fg outline-none transition focus:border-border-strong focus:ring-1 focus:ring-accent/40"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[10px] tabular-nums text-muted">
                {prompt.length}/{MAX_PROMPT} · one bounded decompile call, local fallback if unavailable
              </p>
              <Button type="submit" size="lg" disabled={visualBusy} className="min-h-11">
                <ScanSearch />
                {visualBusy ? "Decompiling specimen…" : "Create generation zero"}
              </Button>
            </div>

            {localError || visualError ? (
              <p className="mt-3 text-sm text-danger">{localError ?? visualError}</p>
            ) : null}
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-5">
            <p className="mr-2 text-xs text-muted">Original word organism:</p>
            <Button type="button" variant="outline" size="sm" {...bind("begin")}>
              Begin as a pulse
            </Button>
            <Button type="button" variant="ghost" size="sm" className="text-muted" {...bind("rack")}>
              Mind rack
            </Button>
            <Button type="button" variant="ghost" size="sm" className="text-muted" {...bind("spec")}>
              Design spec v0.1
            </Button>
          </div>
          {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
        </section>

        <aside className="border-t border-border pt-7 lg:mt-24 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="text-[10px] uppercase tracking-[0.18em] text-accent">What generation zero contains</p>
          <div className="mt-5 space-y-6">
            <StartNote
              n="01"
              title="Identity + invariants"
              body="What must remain itself. Explicit preservation language becomes hard constraint material instead of decorative wording."
            />
            <StartNote
              n="02"
              title="Mutable visual laws"
              body="Topology, anatomy, material, camera, lighting, color, degradation, causality, continuity and other operational rules the route may alter."
            />
            <StartNote
              n="03"
              title="Path-dependent descendants"
              body="Every trip works on the current organism. Scars, debris and ancestry survive. The destination is an operation donor, not a theme sticker."
            />
          </div>
          <p className="mt-8 font-mono text-[11px] leading-relaxed text-muted">
            Try: preserve a face prompt → via memory loss → collide with molting → geodesic to p-adic numbers → compile.
          </p>
        </aside>
      </div>
    </main>
  );
}

function StartNote({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="grid grid-cols-[2rem_1fr] gap-3">
      <span className="font-mono text-[10px] text-muted">{n}</span>
      <div>
        <h2 className="font-display text-lg italic text-fg">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
      </div>
    </div>
  );
}
