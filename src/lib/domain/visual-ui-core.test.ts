import test from "node:test";
import assert from "node:assert/strict";
import {
  isVisualOperationalConcept,
  retargetVisualOutput,
  summarizeVisualState,
} from "./visual-ui-core.ts";
import type { Concept, OrganismState, Trait } from "../manifold/types.ts";

function trait(
  id: string,
  jurisdiction: string,
  rule: string,
  options: Partial<Trait> = {},
): Trait {
  return {
    id,
    name: id,
    rule,
    jurisdiction,
    strength: 0.75,
    confidence: 0.9,
    persistence: 0.8,
    mutability: 0.6,
    source: "ORIGIN",
    recency: 0,
    ...options,
  };
}

function specimen(): OrganismState {
  return {
    id: "st_visual",
    version: 4,
    name: "Visual Descendant",
    identity: "the same recognizable face remains the subject",
    playProjection: "visual descendant",
    labProjection: "visual descendant",
    features: {
      semanticX: 0.2,
      semanticY: 0.3,
      structure: 0.8,
      failure: 0.6,
      memory: 0.7,
      temporal: 0.5,
      topology: 0.9,
      energy: 0.6,
    },
    traits: [
      trait("identity", "subject_identity", "facial proportions remain recognizable", {
        locked: true,
        mutability: 0.02,
      }),
      trait("topology", "topology", "the cheek passes through itself without tearing"),
      trait("motion", "motion", "the fold propagates from left to right"),
      trait("lost", "color", "everything becomes beige", { lost: true }),
      trait("suppressed", "lighting", "flat frontal light", { suppressed: true }),
    ],
    invariants: [
      {
        id: "inv_face",
        text: "Preserve the subject's identity and facial proportions.",
        level: "ABSOLUTE",
        traitId: "identity",
      },
    ],
    scars: [
      {
        id: "scar_1",
        cause: "collision",
        operator: "COLLISION",
        description: "a former seam remains visible",
        lostTraitNames: [],
        survivorTraitNames: ["topology"],
        debris: [],
      },
    ],
    relationships: [],
    memories: [],
    interpretations: [],
    debris: [],
    ancestry: ["st_0", "st_1", "st_2", "st_3"],
    uncertainty: 0.1,
    createdAt: 1,
    installedMind: null,
    mindHistory: [],
    retiredMetrics: [],
    provenance: {
      source: "prompt",
      domain: "visual",
      outputKind: "image",
      raw: "original prompt specimen",
    },
  };
}

function concept(family: string): Concept {
  return {
    id: "molting",
    label: "Molting",
    aliases: ["molting"],
    whatItDoes: "test",
    clicheForbidden: [],
    donations: [],
    features: {
      semanticX: 0,
      semanticY: 0,
      structure: 0.5,
      failure: 0.5,
      memory: 0.5,
      temporal: 0.5,
      topology: 0.5,
      energy: 0.5,
    },
    failureMode: "test",
    fracturePlane: "transformation_mechanism",
    mass: 0.5,
    seeded: false,
    family,
  };
}

test("retargeting image to video changes only the output lens", () => {
  const state = specimen();
  const before = JSON.stringify(state);
  const next = retargetVisualOutput(state, "video");

  assert.equal(next.provenance?.outputKind, "video");
  assert.equal(next.provenance?.raw, "original prompt specimen");
  assert.equal(next.id, state.id);
  assert.equal(next.version, state.version);
  assert.deepEqual(next.ancestry, state.ancestry);
  assert.deepEqual(next.traits, state.traits);
  assert.deepEqual(next.scars, state.scars);
  assert.equal(JSON.stringify(state), before);
});

test("visual summary separates anchors, mutable laws, inactive laws, and invariants", () => {
  const summary = summarizeVisualState(specimen());

  assert.deepEqual(summary.anchors.map((row) => row.id), ["identity"]);
  assert.deepEqual(summary.mutable.map((row) => row.id), ["topology", "motion"]);
  assert.deepEqual(summary.inactive.map((row) => row.id), ["lost", "suppressed"]);
  assert.deepEqual(summary.invariants.map((row) => row.id), ["inv_face"]);
  assert.equal(summary.sourcePrompt, "original prompt specimen");
  assert.equal(summary.outputKind, "image");
  assert.equal(summary.generation, 4);
  assert.equal(summary.ancestryDepth, 4);
});

test("only visual-transduced custom concepts may bypass visual transduction", () => {
  assert.equal(isVisualOperationalConcept(concept("visual-transduced")), true);
  assert.equal(isVisualOperationalConcept(concept("rare")), false);
  assert.equal(isVisualOperationalConcept(undefined), false);
});
