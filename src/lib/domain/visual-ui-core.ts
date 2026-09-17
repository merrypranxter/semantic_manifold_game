import type { Concept, OrganismState, Trait } from "../manifold/types.ts";
import type { VisualOutputKind } from "./visual-schema.ts";

export type VisualStateSummary = {
  outputKind: VisualOutputKind;
  generation: number;
  ancestryDepth: number;
  sourcePrompt: string;
  anchors: Trait[];
  mutable: Trait[];
  inactive: Trait[];
  invariants: OrganismState["invariants"];
};

function isAnchor(trait: Trait): boolean {
  return Boolean(
    trait.locked ||
      trait.mutability <= 0.15 ||
      String(trait.jurisdiction) === "subject_identity",
  );
}

export function isVisualOperationalConcept(concept: Concept | undefined): boolean {
  return concept?.family === "visual-transduced";
}

export function summarizeVisualState(state: OrganismState): VisualStateSummary {
  const active = state.traits.filter((trait) => !trait.lost && !trait.suppressed);
  const anchors = active.filter(isAnchor);
  const mutable = active.filter((trait) => !isAnchor(trait));
  const inactive = state.traits.filter((trait) => trait.lost || trait.suppressed);

  return {
    outputKind: state.provenance?.outputKind === "video" ? "video" : "image",
    generation: state.version,
    ancestryDepth: state.ancestry.length,
    sourcePrompt: state.provenance?.raw?.trim() ?? "",
    anchors,
    mutable,
    inactive,
    invariants: [...state.invariants],
  };
}

/**
 * Change only the requested rendering lens. This is deliberately not travel:
 * it does not create a generation, alter ancestry, or rewrite any organism law.
 */
export function retargetVisualOutput(
  state: OrganismState,
  outputKind: VisualOutputKind,
): OrganismState {
  return {
    ...state,
    provenance: {
      ...state.provenance,
      source: state.provenance?.source ?? "generated",
      domain: "visual",
      outputKind,
    },
  };
}
