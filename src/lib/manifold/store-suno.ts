import type { Concept } from "./concepts.ts";
import { hydrateOrganism } from "./reducer.ts";
import type { LedgerEvent, MetricId, OrganismState, ViewMode } from "./types.ts";
import { SAVE_VERSION } from "./types.ts";

export type PersistedRunShape = {
  saveVersion?: number;
  started?: boolean;
  view?: ViewMode;
  metric?: MetricId;
  currentId?: string | null;
  states?: Record<string, OrganismState>;
  ledger?: LedgerEvent[];
  customConcepts?: Concept[];
  hint?: string;
};

function safeConcepts(value: unknown): Concept[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Concept => {
    if (!item || typeof item !== "object") return false;
    const c = item as Partial<Concept>;
    return typeof c.id === "string" && typeof c.label === "string" && Array.isArray(c.donations);
  });
}

export function migratePersistedRun(
  persisted: unknown,
  persistedVersion: number,
): PersistedRunShape {
  const p = persisted && typeof persisted === "object" ? (persisted as PersistedRunShape) : {};
  const customConcepts = safeConcepts(p.customConcepts);

  if (persistedVersion < SAVE_VERSION) {
    return {
      saveVersion: SAVE_VERSION,
      started: false,
      currentId: null,
      states: {},
      ledger: [],
      customConcepts,
      view: "PLAY",
      metric: "SEMANTIC",
      hint: "The instrument was updated. Choose a Suno genotype to start a new lineage; your cached custom concepts were preserved.",
    };
  }

  try {
    const states: Record<string, OrganismState> = {};
    for (const [id, state] of Object.entries(p.states ?? {})) {
      if (!state || typeof state !== "object") continue;
      const hydrated = hydrateOrganism(state);
      if (!hydrated.seedId || hydrated.seedId === "legacy") continue;
      states[id] = hydrated;
    }
    const currentId = p.currentId && states[p.currentId] ? p.currentId : null;
    const started = Boolean(p.started && currentId);
    return {
      ...p,
      saveVersion: SAVE_VERSION,
      started,
      currentId,
      states,
      ledger: started && Array.isArray(p.ledger) ? p.ledger : [],
      customConcepts,
      hint:
        started
          ? p.hint
          : "Choose a Suno genotype. The previous run could not be restored safely, but cached custom concepts remain available.",
    };
  } catch {
    return {
      saveVersion: SAVE_VERSION,
      started: false,
      currentId: null,
      states: {},
      ledger: [],
      customConcepts,
      view: "PLAY",
      metric: "SEMANTIC",
      hint: "Saved run data was unreadable. Choose a Suno genotype to begin cleanly.",
    };
  }
}
