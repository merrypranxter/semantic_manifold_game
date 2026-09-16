import { FileOutput, FlaskConical, Play, RotateCcw, ScrollText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CommandBar } from "./CommandBar";
import { CompileDrawer } from "./CompileDrawer";
import { HistoryStrip } from "./HistoryStrip";
import { Inspector } from "./Inspector";
import { ManifoldMap } from "./ManifoldMap";
import { RouteRecipe } from "./RouteRecipe";
import { RulerSelector } from "./RulerSelector";
import { SpecDrawer } from "./SpecDrawer";
import { StartScreen } from "./StartScreen";
import { allConcepts } from "@/lib/manifold/concepts";
import { wtfNeighbor } from "@/lib/manifold/metrics";
import { useManifold } from "@/lib/manifold/store";
import { cn } from "@/lib/utils";

export function ManifoldApp() {
  const [tab, setTab] = useState<"map" | "state">("map");
  const [specOpen, setSpecOpen] = useState(false);

  const started = useManifold((s) => s.started);
  const view = useManifold((s) => s.view);
  const metric = useManifold((s) => s.metric);
  const currentId = useManifold((s) => s.currentId);
  const states = useManifold((s) => s.states);
  const ledger = useManifold((s) => s.ledger);
  const draft = useManifold((s) => s.draft);
  const pending = useManifold((s) => s.pending);
  const busy = useManifold((s) => s.busy);
  const error = useManifold((s) => s.error);
  const hint = useManifold((s) => s.hint);
  const selectedConceptId = useManifold((s) => s.selectedConceptId);
  const compile = useManifold((s) => s.compile);
  const compileOpen = useManifold((s) => s.compileOpen);
  const customConcepts = useManifold((s) => s.customConcepts);

  useEffect(() => {
    void Promise.resolve(useManifold.persist.rehydrate());
  }, []);

  const state = currentId ? states[currentId] : undefined;
  const concepts = useMemo(() => allConcepts(customConcepts), [customConcepts]);
  const selected = concepts.find((c) => c.id === selectedConceptId);
  const lastEvent = ledger[ledger.length - 1];
  const wtf = state ? wtfNeighbor(state, concepts, metric) : undefined;
  const ancestry = useMemo(() => {
    if (!state) return [];
    return state.ancestry
      .map((id) => states[id])
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
  }, [state, states]);
  const origin = useMemo(() => {
    const first = Object.values(states).find((s) => s.version === 0);
    return first;
  }, [states]);

  const spec = (
    <SpecDrawer open={specOpen} onClose={() => setSpecOpen(false)} />
  );

  if (!started || !state) {
    return (
      <>
        <StartScreen
          onBegin={() => useManifold.getState().begin()}
          onOpenSpec={() => setSpecOpen(true)}
        />
        {spec}
      </>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2 sm:px-4">
        <div>
          <p className="font-display text-lg italic leading-none text-fg">
            Semantic <span className="text-accent">Manifold</span>
          </p>
          <p className="mt-1 hidden text-[11px] text-muted sm:block">{hint}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant={view === "PLAY" ? "default" : "quiet"}
            size="sm"
            onClick={() => useManifold.getState().setView("PLAY")}
          >
            <Play />
            Play
          </Button>
          <Button
            variant={view === "LAB" ? "default" : "quiet"}
            size="sm"
            onClick={() => useManifold.getState().setView("LAB")}
          >
            <FlaskConical />
            Lab
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => useManifold.getState().openCompile()}
          >
            <FileOutput />
            Compile
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Open design specification"
            onClick={() => setSpecOpen(true)}
          >
            <ScrollText />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Reset organism"
            onClick={() => useManifold.getState().reset()}
          >
            <RotateCcw />
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className={cn("flex min-h-0 flex-col", tab !== "map" && "hidden lg:flex")}>
          <div className="flex flex-wrap items-end justify-between gap-2 px-3 py-2">
            <RulerSelector
              value={metric}
              onChange={(m) => useManifold.getState().setMetric(m)}
            />
            <RouteRecipe
              pending={pending}
              selectedLabel={selected?.label}
              metric={metric}
            />
          </div>
          <div className="min-h-72 flex-1 lg:min-h-0">
            <ManifoldMap
              state={state}
              concepts={concepts}
              metric={metric}
              selectedId={selectedConceptId}
              wtfId={wtf?.id}
              pendingTargetId={pending?.targetId ?? selectedConceptId ?? undefined}
              ancestry={ancestry}
              onSelect={(id) => {
                useManifold.getState().setSelectedConcept(id);
                const label = concepts.find((c) => c.id === id)?.label;
                if (label) {
                  const next = `take this to ${label}`;
                  useManifold.getState().setDraft(next);
                  useManifold.getState().previewCommand(next);
                }
              }}
            />
          </div>
        </section>
        <section
          className={cn(
            "min-h-0 border-t border-border lg:border-l lg:border-t-0",
            tab !== "state" && "hidden lg:block",
          )}
        >
          <Inspector
            state={state}
            view={view}
            lastEvent={lastEvent}
            onLock={(id) => useManifold.getState().lockTrait(id)}
          />
        </section>
      </div>

      <HistoryStrip
        origin={origin}
        ledger={ledger}
        currentId={state.id}
        states={states}
        onRestore={(id) => useManifold.getState().restore(id)}
      />
      <CommandBar
        draft={draft}
        pending={pending}
        busy={busy}
        error={error}
        onDraft={(s) => {
          useManifold.getState().setDraft(s);
          useManifold.getState().previewCommand(s);
        }}
        onPreview={() => useManifold.getState().previewCommand()}
        onExecute={() => void useManifold.getState().execute()}
        onOperator={(op) => {
          if (op === "KEEP_GOING") {
            void useManifold.getState().executeOperator(op);
            return;
          }
          const label = selected?.label;
          const raw =
            op === "VIA" && label
              ? `take this via ${label}`
              : op === "THROUGH" && label
                ? `take it through ${label}`
                : op === "COLLISION" && label
                  ? `collide with ${label}`
                  : op === "GEODESIC" && label
                    ? `find the geodesic to ${label}`
                    : op === "PARALLEL" && label
                      ? `run that parallel to ${label}`
                      : op === "OVERSHOOT" && label
                        ? `overshoot ${label}`
                        : op === "HOVER" && label
                          ? `hover around ${label}`
                          : label
                            ? `take this to ${label}`
                            : op.toLowerCase();
          useManifold.getState().setDraft(raw);
          const p = useManifold.getState().previewCommand(raw);
          if (p && label) void useManifold.getState().execute(p);
        }}
      />

      <nav className="grid grid-cols-2 border-t border-border bg-surface lg:hidden">
        <button
          type="button"
          className={cn("h-12 text-sm", tab === "map" ? "text-accent" : "text-muted")}
          onClick={() => setTab("map")}
        >
          Map
        </button>
        <button
          type="button"
          className={cn("h-12 text-sm", tab === "state" ? "text-accent" : "text-muted")}
          onClick={() => setTab("state")}
        >
          State
        </button>
      </nav>

      <CompileDrawer
        open={compileOpen}
        boxes={compile}
        onClose={() => useManifold.getState().closeCompile()}
      />
      {spec}
    </div>
  );
}
