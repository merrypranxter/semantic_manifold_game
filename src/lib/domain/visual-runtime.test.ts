import test from "node:test";
import assert from "node:assert/strict";
import {
  compileImagePrompt,
  compileVideoPrompt,
  compileVisual,
} from "./visual-compiler.ts";
import { visualProfile } from "./profiles/visual.ts";
import { getDomainProfile } from "./registry.ts";
import type { OrganismState, Trait } from "../manifold/types.ts";

function trait(
  id: string,
  jurisdiction: string,
  rule: string,
  locked = false,
): Trait {
  return {
    id,
    name: id,
    rule,
    jurisdiction,
    strength: 0.8,
    confidence: 0.9,
    persistence: 0.8,
    mutability: locked ? 0.02 : 0.6,
    source: "ORIGIN",
    recency: 0,
    locked,
  };
}

function specimen(outputKind: "image" | "video" = "video"): OrganismState {
  return {
    id: "st_visual",
    version: 3,
    name: "Visual Descendant",
    identity: "the same recognizable face remains the subject",
    playProjection: "visual descendant",
    labProjection: "visual descendant",
    features: {
      semanticX: 0.1,
      semanticY: 0.2,
      structure: 0.8,
      failure: 0.6,
      memory: 0.7,
      temporal: 0.7,
      topology: 0.8,
      energy: 0.6,
    },
    traits: [
      trait("identity", "subject_identity", "facial proportions remain recognizable", true),
      trait("topology", "topology", "the cheek surface passes through itself without tearing"),
      trait("motion", "motion", "the surface fold propagates slowly from left to right"),
      trait("lost", "color", "everything becomes beige"),
    ].map((row) => (row.id === "lost" ? { ...row, lost: true } : row)),
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
        description: "a former surface seam remains visible as residue",
        lostTraitNames: [],
        survivorTraitNames: ["topology"],
        debris: [],
      },
    ],
    relationships: [],
    memories: [],
    interpretations: [],
    debris: [],
    ancestry: ["st_0", "st_1", "st_2"],
    uncertainty: 0.1,
    createdAt: 1,
    installedMind: null,
    mindHistory: [],
    retiredMetrics: [],
    provenance: {
      source: "prompt",
      domain: "visual",
      outputKind,
      raw: "original prompt specimen",
    },
  };
}

test("image compiler keeps shared rules and invariants but excludes video-only rules", () => {
  const result = compileImagePrompt(specimen("video"));
  const text = result.sections.map((section) => section.text).join("\n");
  assert.equal(result.kind, "image");
  assert.match(text, /cheek surface passes through itself/i);
  assert.match(text, /preserve the subject's identity/i);
  assert.doesNotMatch(text, /propagates slowly from left to right/i);
  assert.doesNotMatch(text, /everything becomes beige/i);
});

test("video compiler includes temporal laws and ancestral residue", () => {
  const result = compileVideoPrompt(specimen("video"));
  const text = result.sections.map((section) => section.text).join("\n");
  assert.equal(result.kind, "video");
  assert.match(text, /propagates slowly from left to right/i);
  assert.match(text, /former surface seam remains visible as residue/i);
  assert.match(text, /facial proportions remain recognizable/i);
});

test("generic visual compiler follows the specimen output mode without mutating lineage", () => {
  const state = specimen("video");
  const before = JSON.stringify(state);
  const result = compileVisual(state);
  assert.equal(result.kind, "video");
  assert.equal(JSON.stringify(state), before);
});

test("visual profile is registered and exposes the visual jurisdiction vocabulary", () => {
  assert.equal(visualProfile.id, "visual");
  assert.equal(getDomainProfile("visual").id, "visual");
  assert.equal(visualProfile.jurisdictions.includes("subject_identity"), true);
  assert.equal(visualProfile.jurisdictions.includes("frame_correspondence"), true);
});

test("visual profile can create an unseeded placeholder origin without inventing prompt content", () => {
  const origin = visualProfile.createOrigin();
  assert.equal(origin.provenance?.domain, "visual");
  assert.equal(origin.provenance?.source, "generated");
  assert.equal(origin.traits.length, 0);
  assert.match(origin.identity, /awaiting a source prompt/i);
});
