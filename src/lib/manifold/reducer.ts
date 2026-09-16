import { uid } from "./ids";
import { deriveMutationDiff } from "../suno/diff.ts";
import type { Delta, LedgerEvent, MetricId, OperatorId, OrganismState, Trait } from "./types";

function bumpRecency(traits: Trait[]): Trait[] {
  return traits.map((t) => ({ ...t, recency: t.recency + 0.05 }));
}

export function hydrateOrganism(state: OrganismState): OrganismState {
  return {
    ...state,
    seedId: state.seedId ?? "legacy",
    generation: state.generation ?? state.version ?? 0,
    phoneticRules: state.phoneticRules ?? [],
    installedMind: state.installedMind ?? null,
    mindHistory: state.mindHistory ?? [],
    retiredMetrics: state.retiredMetrics ?? [],
  };
}

export function applyDelta(
  state: OrganismState,
  delta: Delta,
  metric: MetricId,
  targetLabel: string,
  waypointLabel?: string,
): { next: OrganismState; event: LedgerEvent } {
  const src = hydrateOrganism(state);
  const next: OrganismState = {
    ...src,
    id: uid("st"),
    version: src.version + 1,
    generation: src.generation + 1,
    traits: bumpRecency(src.traits.map((t) => ({ ...t }))),
    invariants: src.invariants.map((i) => ({ ...i })),
    scars: [...src.scars],
    relationships: [...src.relationships],
    memories: [...src.memories],
    interpretations: [...src.interpretations],
    debris: [...src.debris],
    ancestry: [...src.ancestry, src.id],
    phoneticRules: src.phoneticRules.map((rule) => ({ ...rule })),
    lastOperator: delta.operator,
    lastTargetId: delta.targetId,
    lastWaypointId: delta.waypointId,
    createdAt: Date.now(),
    installedMind: src.installedMind ?? null,
    mindHistory: [...src.mindHistory],
    retiredMetrics: [...src.retiredMetrics],
  };

  const added: string[] = [];
  const mutated: string[] = [];
  const lost: string[] = [];
  const scars: string[] = [];

  for (const op of delta.ops) {
    switch (op.kind) {
      case "ADD":
        next.traits.push(op.trait);
        added.push(op.trait.name);
        break;
      case "MUTATE": {
        next.traits = next.traits.map((t) =>
          t.id === op.traitId
            ? {
                ...t,
                name: op.name ?? t.name,
                rule: op.rule,
                strength: op.strength ?? t.strength,
                source: op.source,
                recency: 0,
              }
            : t,
        );
        const changed = next.traits.find((t) => t.id === op.traitId);
        mutated.push(changed?.name ?? op.name ?? op.traitId);
        break;
      }
      case "SUPPRESS":
        next.traits = next.traits.map((t) =>
          t.id === op.traitId ? { ...t, suppressed: true, strength: t.strength * 0.4 } : t,
        );
        break;
      case "LOST": {
        const t = next.traits.find((x) => x.id === op.traitId);
        next.traits = next.traits.map((x) =>
          x.id === op.traitId ? { ...x, lost: true, strength: 0 } : x,
        );
        if (t) lost.push(t.name);
        break;
      }
      case "SCAR":
        next.scars = [...next.scars, op.scar];
        scars.push(op.scar.description);
        break;
      case "RELATE":
        next.relationships = [...next.relationships, op.relationship];
        break;
      case "DEBRIS":
        next.debris = [...next.debris, op.debris];
        break;
      case "INTERPRET": {
        const rest = next.interpretations.filter(
          (i) => i.conceptId !== op.interpretation.conceptId,
        );
        next.interpretations = [...rest, op.interpretation];
        break;
      }
      case "MEMORY":
        next.memories = [...next.memories, op.memory];
        break;
      case "RENAME":
        next.name = op.name;
        next.identity = op.identity;
        next.playProjection = op.play;
        next.labProjection = op.lab;
        break;
      case "FEATURES":
        next.features = op.features;
        next.lastFeatureDelta = op.delta;
        break;
    }
  }

  if (delta.setInstalledMind !== undefined) {
    if (delta.setInstalledMind) {
      next.installedMind = delta.setInstalledMind;
      next.mindHistory = [...next.mindHistory, delta.setInstalledMind].slice(-16);
    } else {
      next.installedMind = null;
    }
  }
  if (delta.retireMetric && !next.retiredMetrics.includes(delta.retireMetric)) {
    next.retiredMetrics = [...next.retiredMetrics, delta.retireMetric];
  }

  if (next.ancestry.length > 36) {
    next.ancestry = next.ancestry.slice(-36);
  }
  if (next.memories.length > 24) next.memories = next.memories.slice(-24);
  if (next.debris.length > 16) next.debris = next.debris.slice(-16);

  next.lastMutationDiff = deriveMutationDiff(src, next);

  const event: LedgerEvent = {
    id: uid("ev"),
    at: Date.now(),
    operator: delta.operator,
    metric,
    targetId: delta.targetId,
    targetLabel,
    waypointId: delta.waypointId,
    waypointLabel,
    fromStateId: src.id,
    toStateId: next.id,
    narrative: delta.narrative,
    lab: delta.lab,
    added,
    mutated,
    lost,
    scars,
    geodesicVia: delta.geodesicVia,
    mindId: delta.mindId,
    mindNote: delta.mindNote,
  };

  return { next, event };
}

export function lockTrait(state: OrganismState, traitId: string): OrganismState {
  const trait = state.traits.find((t) => t.id === traitId);
  if (!trait) return state;
  return {
    ...state,
    traits: state.traits.map((t) =>
      t.id === traitId ? { ...t, locked: true, mutability: 0.05 } : t,
    ),
    invariants: state.invariants.some((i) => i.traitId === traitId)
      ? state.invariants
      : [
          ...state.invariants,
          {
            id: uid("inv"),
            text: `Keep ${trait.name}: ${trait.rule}`,
            level: "STRONG",
            traitId,
          },
        ],
  };
}

export function operatorVerb(op: OperatorId): string {
  switch (op) {
    case "DIRECT":
      return "direct";
    case "VIA":
      return "via";
    case "THROUGH":
      return "through";
    case "GEODESIC":
      return "geodesic";
    case "PARALLEL":
      return "parallel";
    case "COLLISION":
      return "collision";
    case "OVERSHOOT":
      return "overshoot";
    case "HOVER":
      return "hover";
    case "KEEP_GOING":
      return "keep going";
  }
}
