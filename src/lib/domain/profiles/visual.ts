import { uid } from "../../manifold/ids.ts";
import type { OrganismState } from "../../manifold/types.ts";
import { compileVisual } from "../visual-compiler.ts";
import { VISUAL_JURISDICTIONS } from "../visual-schema.ts";
import type { DomainProfile } from "../types.ts";

function createVisualPlaceholderOrigin(): OrganismState {
  return {
    id: uid("st"),
    version: 0,
    name: "Unseeded Visual Specimen",
    identity: "a visual organism awaiting a source prompt before meaningful mutation",
    playProjection:
      "No image or video prompt has been ingested yet. Paste a source prompt to create generation zero.",
    labProjection:
      "Visual domain placeholder. Zero traits, zero invariants, no fabricated prompt content.",
    features: {
      semanticX: 0,
      semanticY: 0,
      structure: 0,
      failure: 0,
      memory: 0,
      temporal: 0,
      topology: 0,
      energy: 0,
    },
    traits: [],
    invariants: [],
    scars: [],
    relationships: [],
    memories: [],
    interpretations: [],
    debris: [],
    ancestry: [],
    uncertainty: 1,
    createdAt: Date.now(),
    installedMind: null,
    mindHistory: [],
    retiredMetrics: [],
    provenance: {
      source: "generated",
      domain: "visual",
    },
  };
}

export const visualProfile: DomainProfile = {
  id: "visual",
  label: "Image / Video",
  description:
    "One path-dependent visual organism that can compile as a still image or a temporal video prompt.",
  jurisdictions: VISUAL_JURISDICTIONS.map((jurisdiction) => jurisdiction.id),
  defaultMetric: "SEMANTIC",
  idleHint: "Paste an image or video prompt to create generation zero.",
  beginHint:
    "This visual specimen is empty. Ingest a source prompt before traveling if you want mutations to preserve ancestry.",
  createOrigin: createVisualPlaceholderOrigin,
  compile: compileVisual,
};
