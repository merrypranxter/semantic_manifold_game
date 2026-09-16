import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { allConcepts, findConcept, getConcept, type Concept } from "./concepts";
import { compileSuno, type CompileBoxes } from "./compiler";
import { wtfNeighbor } from "./metrics";
import { createOrigin } from "./origin";
import { runOperator } from "./operators";
import { parseCommand } from "./parser";
import { applyDelta, lockTrait as lockTraitOn } from "./reducer";
import type {
  CommandProposal,
  LedgerEvent,
  MetricId,
  OperatorId,
  OrganismState,
  ViewMode,
} from "./types";
import { SAVE_VERSION as VERSION } from "./types";
import { transduceConcept } from "@/lib/xai/transduce";

const MAX_STATES = 28;
const MAX_LEDGER = 48;

type ManifoldStore = {
  saveVersion: number;
  started: boolean;
  view: ViewMode;
  metric: MetricId;
  currentId: string | null;
  states: Record<string, OrganismState>;
  ledger: LedgerEvent[];
  customConcepts: Concept[];
  pending: CommandProposal | null;
  draft: string;
  selectedConceptId: string | null;
  compile: CompileBoxes | null;
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
  begin: () => void;
  reset: () => void;
  previewCommand: (raw?: string) => CommandProposal | null;
  execute: (proposal?: CommandProposal) => Promise<void>;
  executeOperator: (op: OperatorId, targetId?: string) => Promise<void>;
  restore: (stateId: string) => void;
  lockTrait: (traitId: string) => void;
  openCompile: () => void;
  closeCompile: () => void;
  current: () => OrganismState | null;
  concepts: () => Concept[];
};

function emptyRun() {
  return {
    saveVersion: VERSION,
    started: false,
    view: "PLAY" as ViewMode,
    metric: "SEMANTIC" as MetricId,
    currentId: null as string | null,
    states: {} as Record<string, OrganismState>,
    ledger: [] as LedgerEvent[],
    customConcepts: [] as Concept[],
    pending: null as CommandProposal | null,
    draft: "",
    selectedConceptId: null as string | null,
    compile: null as CompileBoxes | null,
    compileOpen: false,
    busy: false,
    error: null as string | null,
    hint: "Begin as a pulse. Zoom the field. Type a word. Go there.",
    hydrated: false,
  };
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

export const useManifold = create<ManifoldStore>()(
  persist(
    (set, get) => ({
      ...emptyRun(),

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
        const known = getConcept(concept.id) ?? get().customConcepts.find((c) => c.id === concept.id);
        if (known) {
          set({
            selectedConceptId: known.id,
            hint: `${known.label} is already in the field.`,
          });
          return;
        }
        set({
          customConcepts: [...get().customConcepts, concept],
          selectedConceptId: concept.id,
          hint: `Planted ${concept.label}. Travel there to make it work on the organism.`,
        });
      },

      current: () => {
        const { currentId, states } = get();
        if (!currentId) return null;
        return states[currentId] ?? null;
      },

      concepts: () => allConcepts(get().customConcepts),

      begin: () => {
        const origin = createOrigin();
        set({
          started: true,
          currentId: origin.id,
          states: { [origin.id]: origin },
          ledger: [],
          compile: null,
          compileOpen: false,
          pending: null,
          draft: "",
          error: null,
          hint: "Zoom in. Drag or WASD to drift. Find a word — any word — and go there.",
          view: "PLAY",
          metric: "SEMANTIC",
        });
      },

      reset: () => {
        set({ ...emptyRun(), hydrated: true });
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
          let custom = get().customConcepts;
          const ensure = async (label?: string, id?: string): Promise<Concept | undefined> => {
            if (id) {
              const hit = getConcept(id) ?? custom.find((c) => c.id === id) ?? findConcept(label ?? "", custom) ?? findConcept(id, custom);
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

          const extra = allConcepts(custom);
          const delta = runOperator(
            proposal.operator,
            cur,
            dest,
            get().metric,
            extra,
            waypoint,
          );
          const { next, event } = applyDelta(
            cur,
            delta,
            get().metric,
            dest.label,
            waypoint?.label,
          );
          const states = pruneStates(
            { ...get().states, [next.id]: next },
            [...next.ancestry, next.id],
          );
          const ledger = [...get().ledger, event].slice(-MAX_LEDGER);
          const wtf = wtfNeighbor(next, extra, get().metric);
          set({
            states,
            ledger,
            currentId: next.id,
            busy: false,
            pending: null,
            draft: "",
            compile: null,
            selectedConceptId: dest.id,
            hint: wtf
              ? `WTF neighbor under this ruler: ${wtf.label}. Try going there, or collide with wasp nest.`
              : "Inspect the descendant. Compile when it feels like wreckage or a creature.",
          });
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
        set({
          currentId: stateId,
          compile: null,
          hint: `Restored snapshot ${s.name}. Undo is not travel; scars of later events remain in the ledger.`,
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

      openCompile: () => {
        const cur = get().current();
        if (!cur) return;
        set({ compile: compileSuno(cur), compileOpen: true });
      },
      closeCompile: () => set({ compileOpen: false }),
    }),
    {
      name: "semantic-manifold-v1",
      version: VERSION,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        saveVersion: s.saveVersion,
        started: s.started,
        view: s.view,
        metric: s.metric,
        currentId: s.currentId,
        states: s.states,
        ledger: s.ledger,
        customConcepts: s.customConcepts,
      }),
    },
  ),
);

export type { ManifoldStore };
