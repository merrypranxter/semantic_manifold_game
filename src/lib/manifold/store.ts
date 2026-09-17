import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  cacheableVisualSource,
  freshVisualCacheEntry,
  pruneVisualCache,
  visualDecompileCacheKey,
  visualTransductionCacheKey,
  VISUAL_AI_CACHE_TTL_MS,
  VISUAL_DECOMPILE_CACHE_LIMIT,
  VISUAL_TRANSDUCTION_CACHE_LIMIT,
  type VisualDecompileCacheEntry,
  type VisualTransductionCacheEntry,
} from "../domain/visual-cache-core.ts";
import { visualSpecimenToOrigin } from "../domain/visual-decompiler-core.ts";
import { getDomainProfile } from "../domain/registry.ts";
import type {
  DomainCompileOutput,
  DomainId,
  DomainProfile,
} from "../domain/types.ts";
import type { VisualOutputKind } from "../domain/visual-schema.ts";
import { allConcepts, findConcept, getConcept, type Concept } from "./concepts";
import { wtfNeighbor } from "./metrics";
import {
  finishMind,
  prepareMind,
  slotMindDelta,
  unslotMindDelta,
} from "./mind-engine";
import { findMind, getMind } from "./minds";
import { runOperator } from "./operators";
import { parseCommand } from "./parser";
import { applyDelta, hydrateOrganism, lockTrait as lockTraitOn } from "./reducer";
import type {
  CommandProposal,
  LedgerEvent,
  MetricId,
  OperatorId,
  OrganismState,
  ViewMode,
} from "./types";
import { SAVE_VERSION as VERSION } from "./types";
import { decompileVisualPrompt } from "@/lib/xai/decompile-visual";
import { transduceConcept } from "@/lib/xai/transduce";
import { transduceVisualConcept } from "@/lib/xai/transduce-visual";

const MAX_STATES = 28;
const MAX_LEDGER = 48;
const DEFAULT_DOMAIN: DomainId = "music";

/** In-session begin must survive a late persist rehydrate. */
let sessionPulse: { domainId: DomainId; state: OrganismState } | null = null;

type ManifoldStore = {
  saveVersion: number;
  domainId: DomainId;
  started: boolean;
  view: ViewMode;
  metric: MetricId;
  currentId: string | null;
  states: Record<string, OrganismState>;
  ledger: LedgerEvent[];
  customConcepts: Concept[];
  visualDecompileCache: Record<string, VisualDecompileCacheEntry>;
  visualTransductionCache: Record<string, VisualTransductionCacheEntry>;
  pending: CommandProposal | null;
  draft: string;
  selectedConceptId: string | null;
  compile: DomainCompileOutput | null;
  compileOpen: boolean;
  busy: boolean;
  error: string | null;
  hint: string;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  setView: (v: ViewMode) => void;
  setMetric: (m: MetricId) => void;
  setDraft: (s: string) => void;
  setSelectedConcept: (id: string | null) => void;
  plant: (concept: Concept) => void;
  ingestVisualPrompt: (rawPrompt: string, output: VisualOutputKind) => Promise<void>;
  begin: () => void;
  reset: () => void;
  previewCommand: (raw?: string) => CommandProposal | null;
  execute: (proposal?: CommandProposal) => Promise<void>;
  executeOperator: (op: OperatorId, targetId?: string) => Promise<void>;
  restore: (stateId: string) => void;
  lockTrait: (traitId: string) => void;
  slotMind: (mindId: string) => void;
  ejectMind: () => void;
  openCompile: () => void;
  closeCompile: () => void;
  current: () => OrganismState | null;
  currentDomain: () => DomainProfile;
  concepts: () => Concept[];
};

function emptyRun(domainId: DomainId = DEFAULT_DOMAIN) {
  const domain = getDomainProfile(domainId);
  return {
    saveVersion: VERSION,
    domainId,
    started: false,
    view: "PLAY" as ViewMode,
    metric: domain.defaultMetric,
    currentId: null as string | null,
    states: {} as Record<string, OrganismState>,
    ledger: [] as LedgerEvent[],
    customConcepts: [] as Concept[],
    pending: null as CommandProposal | null,
    draft: "",
    selectedConceptId: null as string | null,
    compile: null as DomainCompileOutput | null,
    compileOpen: false,
    busy: false,
    error: null as string | null,
    hint: domain.idleHint,
    hydrated: false,
  };
}

function visualOutputOf(state: OrganismState): VisualOutputKind {
  return state.provenance?.outputKind === "video" ? "video" : "image";
}

function customConceptBy(
  custom: Concept[],
  label?: string,
  id?: string,
): Concept | undefined {
  if (id) {
    const exact = custom.find((concept) => concept.id === id);
    if (exact) return exact;
  }
  const normalized = label?.trim().toLowerCase();
  if (!normalized) return undefined;
  return custom.find(
    (concept) =>
      concept.label.trim().toLowerCase() === normalized ||
      concept.aliases.some((alias) => alias.trim().toLowerCase() === normalized),
  );
}

function conceptsForDomain(domainId: DomainId, custom: Concept[]): Concept[] {
  return domainId === "visual" ? custom : allConcepts(custom);
}

function pruneStates(
  states: Record<string, OrganismState>,
  keepIds: string[],
): Record<string, OrganismState> {
  const keep = new Set(keepIds.slice(-MAX_STATES));
  const next: Record<string, OrganismState> = {};
  for (const id of Object.keys(states)) {
    if (keep.has(id)) next[id] = states[id]!;
  }
  return next;
}

function commitTravel(
  get: () => ManifoldStore,
  set: (partial: Partial<ManifoldStore>) => void,
  next: OrganismState,
  event: LedgerEvent,
  hint: string,
  metric?: MetricId,
) {
  const states = pruneStates(
    { ...get().states, [next.id]: next },
    [...next.ancestry, next.id],
  );
  const ledger = [...get().ledger, event].slice(-MAX_LEDGER);
  set({
    states,
    ledger,
    currentId: next.id,
    busy: false,
    pending: null,
    draft: "",
    compile: null,
    selectedConceptId: event.targetId ?? get().selectedConceptId,
    hint,
    ...(metric ? { metric } : {}),
  });
}

export const useManifold = create<ManifoldStore>()(
  persist(
    (set, get) => ({
      ...emptyRun(),
      visualDecompileCache: {},
      visualTransductionCache: {},

      setHydrated: (v) => set({ hydrated: v }),
      setView: (v) => set({ view: v }),
      setMetric: (m) =>
        set({
          metric: m,
          hint: `Ruler is now ${m}. Neighborhoods rearrange. Look for the WTF neighbor.`,
        }),
      setDraft: (s) => set({ draft: s, error: null }),
      setSelectedConcept: (id) => set({ selectedConceptId: id }),

      plant: (concept) => {
        const custom = get().customConcepts;
        const known =
          get().domainId === "visual"
            ? customConceptBy(custom, concept.label, concept.id)
            : getConcept(concept.id) ?? customConceptBy(custom, concept.label, concept.id);
        if (known) {
          set({
            selectedConceptId: known.id,
            hint: `${known.label} is already in the field.`,
          });
          return;
        }
        set({
          customConcepts: [...custom, concept],
          selectedConceptId: concept.id,
          hint: `Planted ${concept.label}. Travel there to make it work on the organism.`,
        });
      },

      current: () => {
        const { currentId, states } = get();
        if (!currentId) return null;
        const s = states[currentId];
        return s ? hydrateOrganism(s) : null;
      },

      currentDomain: () => getDomainProfile(get().domainId),

      concepts: () => conceptsForDomain(get().domainId, get().customConcepts),

      ingestVisualPrompt: async (rawPrompt, output) => {
        if (get().busy) return;
        const cacheKey = visualDecompileCacheKey(rawPrompt, output);
        const cached = freshVisualCacheEntry(get().visualDecompileCache, cacheKey);
        if (cached) {
          const domain = getDomainProfile("visual");
          const origin = visualSpecimenToOrigin(cached.decompiled);
          sessionPulse = { domainId: "visual", state: origin };
          set({
            ...emptyRun("visual"),
            hydrated: get().hydrated,
            started: true,
            domainId: "visual",
            currentId: origin.id,
            states: { [origin.id]: origin },
            metric: domain.defaultMetric,
            view: "PLAY",
            busy: false,
            error: null,
            hint: `Generation zero rebuilt from cached AI decompilation for this ${output} prompt. No model call was needed.`,
          });
          return;
        }

        set({ busy: true, error: null, compile: null, compileOpen: false });
        try {
          const result = await decompileVisualPrompt({ data: { rawPrompt, output } });
          if (!result.ok) {
            set({ busy: false, error: result.error });
            return;
          }
          const domain = getDomainProfile("visual");
          const origin = result.origin;
          sessionPulse = { domainId: "visual", state: origin };
          const now = Date.now();
          const visualDecompileCache =
            result.usedAI && cacheableVisualSource(result.decompiled.source)
              ? pruneVisualCache(
                  {
                    ...get().visualDecompileCache,
                    [cacheKey]: { cachedAt: now, decompiled: result.decompiled },
                  },
                  now,
                  VISUAL_AI_CACHE_TTL_MS,
                  VISUAL_DECOMPILE_CACHE_LIMIT,
                )
              : get().visualDecompileCache;
          set({
            ...emptyRun("visual"),
            hydrated: get().hydrated,
            started: true,
            domainId: "visual",
            currentId: origin.id,
            states: { [origin.id]: origin },
            metric: domain.defaultMetric,
            view: "PLAY",
            visualDecompileCache,
            busy: false,
            error: null,
            hint: result.usedAI
              ? `Generation zero extracted from the ${output} prompt. The AI reading is cached for exact reuse.`
              : `Generation zero built with the local decompiler. Pick a destination; uncertainty is higher until the structure is refined.`,
          });
        } catch (err) {
          set({
            busy: false,
            error: err instanceof Error ? err.message : "Visual prompt ingestion failed.",
          });
        }
      },

      begin: () => {
        const domain = get().currentDomain();
        const prior = sessionPulse?.domainId === domain.id ? sessionPulse.state : null;
        const origin = prior ?? domain.createOrigin();
        sessionPulse = { domainId: domain.id, state: origin };
        set({
          started: true,
          domainId: domain.id,
          currentId: origin.id,
          states: { ...get().states, [origin.id]: origin },
          ledger: [],
          compile: null,
          compileOpen: false,
          pending: null,
          draft: "",
          error: null,
          hint: domain.beginHint,
          view: "PLAY",
          metric: domain.defaultMetric,
        });
      },

      reset: () => {
        const domainId = get().domainId;
        sessionPulse = null;
        set({ ...emptyRun(domainId), hydrated: true });
      },

      previewCommand: (raw) => {
        const text = (raw ?? get().draft).trim();
        if (!text) {
          set({ pending: null });
          return null;
        }
        const cur = get().current();
        const lastEv = get().ledger[get().ledger.length - 1];
        const proposal = parseCommand(
          text,
          get().customConcepts,
          cur?.lastTargetId ?? lastEv?.targetId,
          lastEv?.targetLabel,
        );
        set({ pending: proposal });
        return proposal;
      },

      executeOperator: async (op, targetId) => {
        if (get().busy) return;
        const concepts = get().concepts();
        const id = targetId ?? get().selectedConceptId;
        const concept = id ? concepts.find((c) => c.id === id) : undefined;
        const cur = get().current();
        const lastEv = get().ledger[get().ledger.length - 1];
        const proposal: CommandProposal = {
          raw: `${op} ${concept?.label ?? ""}`.trim(),
          operator: op,
          targetId: concept?.id ?? cur?.lastTargetId,
          targetLabel: concept?.label ?? lastEv?.targetLabel ?? "",
          confidence: concept ? 0.95 : 0.4,
          note: `${op} via the operator row.`,
        };
        set({ pending: proposal, draft: proposal.raw });
        await get().execute(proposal);
      },

      execute: async (incoming) => {
        if (get().busy) return;
        const proposal = incoming ?? get().pending ?? get().previewCommand();
        if (!proposal) {
          set({ error: "Type a command or pick a destination on the map." });
          return;
        }
        const cur = get().current();
        if (!cur) {
          set({ error: "Begin first." });
          return;
        }
        set({ busy: true, error: null });
        try {
          if (proposal.ejectMind) {
            const installed = getMind(cur.installedMind);
            if (!installed) {
              set({ busy: false, error: "No mind is slotted." });
              return;
            }
            const delta = unslotMindDelta(installed);
            const { next, event } = applyDelta(cur, delta, get().metric, installed.label);
            commitTravel(get, set, next, event, "Mind ejected. A scar of that thinking remains.");
            return;
          }

          if (proposal.installOnly) {
            const mind = proposal.mindId ? getMind(proposal.mindId) : findMind(proposal.targetLabel);
            if (!mind) {
              set({ busy: false, error: proposal.note || "Name a mind from the rack." });
              return;
            }
            const previous = getMind(cur.installedMind);
            const delta = slotMindDelta(mind, previous && previous.id !== mind.id ? previous : undefined);
            const { next, event } = applyDelta(cur, delta, get().metric, mind.label);
            commitTravel(
              get,
              set,
              next,
              event,
              `${mind.label} is thinking through this organism. Go somewhere.`,
            );
            return;
          }

          let custom = get().customConcepts;
          const installed = getMind(cur.installedMind);
          const visual = get().domainId === "visual";
          let reusedVisualCache = false;
          let usedVisualFallback = false;

          const ensure = async (label?: string, id?: string): Promise<Concept | undefined> => {
            if (visual) {
              const resolvedLabel =
                label?.trim() || (id ? customConceptBy(custom, undefined, id)?.label : undefined);
              if (!resolvedLabel) return undefined;

              const output = visualOutputOf(cur);
              const cacheKey = visualTransductionCacheKey(
                resolvedLabel,
                cur,
                output,
                installed?.id,
              );
              const cached = freshVisualCacheEntry(
                get().visualTransductionCache,
                cacheKey,
              );
              if (cached) {
                reusedVisualCache = true;
                const concept = cached.result.concept;
                custom = [...custom.filter((c) => c.id !== concept.id), concept];
                set({ customConcepts: custom });
                return concept;
              }

              const res = await transduceVisualConcept({
                data: {
                  label: resolvedLabel,
                  output,
                  organismName: cur.name,
                  organismIdentity: cur.identity,
                  traits: cur.traits,
                  invariants: cur.invariants.map((invariant) => invariant.text),
                  mind: installed
                    ? {
                        id: installed.id,
                        full: installed.full,
                        transduce: installed.transduce,
                        procedure: installed.procedure,
                      }
                    : undefined,
                },
              });
              if (!res.ok) throw new Error(res.error);

              custom = [...custom.filter((c) => c.id !== res.concept.id), res.concept];
              if (cacheableVisualSource(res.source)) {
                const now = Date.now();
                const visualTransductionCache = pruneVisualCache(
                  {
                    ...get().visualTransductionCache,
                    [cacheKey]: {
                      cachedAt: now,
                      result: {
                        concept: res.concept,
                        readings: res.readings,
                        warnings: res.warnings,
                        source: res.source,
                      },
                    },
                  },
                  now,
                  VISUAL_AI_CACHE_TTL_MS,
                  VISUAL_TRANSDUCTION_CACHE_LIMIT,
                );
                set({ customConcepts: custom, visualTransductionCache });
              } else {
                usedVisualFallback = true;
                set({ customConcepts: custom });
              }
              return res.concept;
            }

            if (id) {
              const hit =
                getConcept(id) ??
                customConceptBy(custom, label, id) ??
                findConcept(label ?? "", custom) ??
                findConcept(id, custom);
              if (hit) return hit;
            }
            if (!label) return undefined;
            const known = findConcept(label, custom);
            if (known) return known;

            const res = await transduceConcept({
              data: {
                label,
                organismName: cur.name,
                organismIdentity: cur.identity,
                mind: installed
                  ? {
                      id: installed.id,
                      full: installed.full,
                      transduce: installed.transduce,
                      procedure: installed.procedure,
                    }
                  : undefined,
              },
            });
            if (!res.ok) throw new Error(res.error);
            custom = [...custom.filter((c) => c.id !== res.concept.id), res.concept];
            set({ customConcepts: custom });
            return res.concept;
          };

          const target = await ensure(proposal.targetLabel || proposal.novelTarget, proposal.targetId);
          const waypoint = proposal.waypointLabel || proposal.novelWaypoint || proposal.waypointId
            ? await ensure(proposal.waypointLabel || proposal.novelWaypoint, proposal.waypointId)
            : undefined;

          if (proposal.operator !== "KEEP_GOING" && !target) {
            set({ busy: false, error: "Name a destination. Click the map or type a concept." });
            return;
          }
          const dest = target ?? (await ensure(proposal.targetLabel, proposal.targetId));
          if (!dest) {
            set({ busy: false, error: "Need a heading." });
            return;
          }

          const extra = conceptsForDomain(get().domainId, custom);
          let operator = proposal.operator;
          let metric = get().metric;
          let via = waypoint;
          let retireAfter: MetricId | undefined;

          if (installed) {
            const prep = prepareMind({
              state: cur,
              target: dest,
              extra,
              metric,
              operator,
              waypoint: via,
              mind: installed,
              priorMinds: cur.mindHistory,
              retiredMetrics: cur.retiredMetrics,
            });
            operator = prep.operator;
            metric = prep.metric;
            via = prep.waypoint;
            retireAfter = prep.retireAfter;
          }

          let delta = runOperator(operator, cur, dest, metric, extra, via);
          if (installed) {
            delta = finishMind(delta, {
              state: cur,
              target: dest,
              extra,
              metric,
              operator,
              waypoint: via,
              mind: installed,
              priorMinds: cur.mindHistory,
              retiredMetrics: cur.retiredMetrics,
            });
            if (retireAfter) delta.retireMetric = retireAfter;
          }
          const { next, event } = applyDelta(
            cur,
            delta,
            metric,
            dest.label,
            via?.label,
          );
          const wtf = wtfNeighbor(next, extra, metric);
          const mindHint = installed ? ` Mind ${installed.label} still slotted.` : "";
          const costHint = reusedVisualCache
            ? " Reused cached visual transduction; no model call."
            : usedVisualFallback
              ? " Semantic transduction was unavailable, so the deterministic local fallback was used."
              : "";
          commitTravel(
            get,
            set,
            next,
            event,
            wtf
              ? `WTF neighbor under this ruler: ${wtf.label}.${mindHint}${costHint}`
              : `Inspect the descendant.${mindHint}${costHint}`,
            metric !== get().metric ? metric : undefined,
          );
        } catch (err) {
          set({
            busy: false,
            error: err instanceof Error ? err.message : "Transformation failed.",
          });
        }
      },

      restore: (stateId) => {
        const s = get().states[stateId];
        if (!s) return;
        const hydrated = hydrateOrganism(s);
        const mind = getMind(hydrated.installedMind);
        set({
          currentId: stateId,
          compile: null,
          hint: mind
            ? `Restored snapshot ${hydrated.name}. ${mind.label} is still thinking through it.`
            : `Restored snapshot ${hydrated.name}. Undo is not travel; scars of later events remain in the ledger.`,
        });
      },

      lockTrait: (traitId) => {
        const cur = get().current();
        if (!cur) return;
        const next = lockTraitOn(cur, traitId);
        set({
          states: { ...get().states, [cur.id]: next },
          hint: "Trait locked as a STRONG invariant. Later operators must work around it.",
        });
      },

      slotMind: (mindId) => {
        const mind = getMind(mindId);
        if (!mind) return;
        if (!get().started) get().begin();
        const proposal: CommandProposal = {
          raw: `install ${mind.label}`,
          operator: "KEEP_GOING",
          targetLabel: mind.label,
          mindId: mind.id,
          installOnly: true,
          confidence: 1,
          note: `Slot ${mind.label}.`,
        };
        set({ pending: proposal, draft: proposal.raw });
        void get().execute(proposal);
      },

      ejectMind: () => {
        const proposal: CommandProposal = {
          raw: "eject mind",
          operator: "KEEP_GOING",
          targetLabel: "",
          ejectMind: true,
          confidence: 1,
          note: "Eject the installed mind.",
        };
        set({ pending: proposal, draft: proposal.raw });
        void get().execute(proposal);
      },

      openCompile: () => {
        const cur = get().current();
        if (!cur) return;
        const domain = get().currentDomain();
        set({ compile: domain.compile(cur), compileOpen: true });
      },
      closeCompile: () => set({ compileOpen: false }),
    }),
    {
      name: "semantic-manifold-v1",
      version: VERSION,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      migrate: (persisted) => {
        try {
          const p = persisted as Partial<ManifoldStore>;
          const states: Record<string, OrganismState> = {};
          for (const [id, s] of Object.entries(p.states ?? {})) {
            if (s && typeof s === "object") states[id] = hydrateOrganism(s);
          }
          const now = Date.now();
          return {
            ...p,
            domainId: p.domainId ?? DEFAULT_DOMAIN,
            states,
            visualDecompileCache: pruneVisualCache(
              p.visualDecompileCache ?? {},
              now,
              VISUAL_AI_CACHE_TTL_MS,
              VISUAL_DECOMPILE_CACHE_LIMIT,
            ),
            visualTransductionCache: pruneVisualCache(
              p.visualTransductionCache ?? {},
              now,
              VISUAL_AI_CACHE_TTL_MS,
              VISUAL_TRANSDUCTION_CACHE_LIMIT,
            ),
            saveVersion: VERSION,
          };
        } catch {
          return {
            saveVersion: VERSION,
            domainId: DEFAULT_DOMAIN,
            visualDecompileCache: {},
            visualTransductionCache: {},
          };
        }
      },
      merge: (persistedState, currentState) => {
        const p = (persistedState ?? {}) as Partial<ManifoldStore>;
        if (sessionPulse) {
          const pulse = sessionPulse.state;
          const id = currentState.currentId ?? pulse.id;
          const states = currentState.states[pulse.id]
            ? currentState.states
            : { ...currentState.states, [pulse.id]: pulse };
          return {
            ...currentState,
            domainId: sessionPulse.domainId,
            started: true,
            currentId: id,
            states,
            visualDecompileCache: {
              ...(p.visualDecompileCache ?? {}),
              ...currentState.visualDecompileCache,
            },
            visualTransductionCache: {
              ...(p.visualTransductionCache ?? {}),
              ...currentState.visualTransductionCache,
            },
          };
        }
        if (currentState.started && currentState.currentId && currentState.states[currentState.currentId]) {
          return currentState;
        }
        return {
          ...currentState,
          ...p,
          domainId: p.domainId ?? currentState.domainId,
          states: p.states ?? currentState.states,
          visualDecompileCache:
            p.visualDecompileCache ?? currentState.visualDecompileCache,
          visualTransductionCache:
            p.visualTransductionCache ?? currentState.visualTransductionCache,
        };
      },
      partialize: (s) => ({
        saveVersion: s.saveVersion,
        domainId: s.domainId,
        started: s.started,
        view: s.view,
        metric: s.metric,
        currentId: s.currentId,
        states: s.states,
        ledger: s.ledger,
        customConcepts: s.customConcepts,
        visualDecompileCache: s.visualDecompileCache,
        visualTransductionCache: s.visualTransductionCache,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export type { ManifoldStore };
