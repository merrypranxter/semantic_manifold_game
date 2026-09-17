import test from "node:test";
import assert from "node:assert/strict";
import {
  cacheableVisualSource,
  pruneVisualCache,
  visualDecompileCacheKey,
  visualTransductionCacheKey,
} from "./visual-cache-core.ts";
import type { OrganismState, Trait } from "../manifold/types.ts";

function trait(rule = "the cheek passes through itself"): Trait {
  return {
    id: "tr_topology",
    name: "Topology",
    rule,
    jurisdiction: "topology",
    strength: 0.8,
    confidence: 0.9,
    persistence: 0.8,
    mutability: 0.7,
    source: "ORIGIN",
    recency: 0,
  };
}

function specimen(): OrganismState {
  return {
    id: "state_random_id",
    version: 3,
    name: "Visual Descendant",
    identity: "the same recognizable face remains the subject",
    playProjection: "projection",
    labProjection: "projection",
    features: {
      semanticX: 0,
      semanticY: 0,
      structure: 0.7,
      failure: 0.4,
      memory: 0.5,
      temporal: 0.2,
      topology: 0.8,
      energy: 0.5,
    },
    traits: [trait()],
    invariants: [
      {
        id: "inv_face",
        text: "Preserve facial identity.",
        level: "ABSOLUTE",
      },
    ],
    scars: [],
    relationships: [],
    memories: [],
    interpretations: [],
    debris: [],
    ancestry: ["a", "b", "c"],
    uncertainty: 0.1,
    createdAt: 1,
    installedMind: null,
    mindHistory: [],
    retiredMetrics: [],
    provenance: {
      source: "prompt",
      domain: "visual",
      outputKind: "image",
      raw: "source prompt",
    },
  };
}

test("decompile cache key is exact to normalized prompt text and output without leaking prompt text", () => {
  const prompt = "  preserve the face exactly; use wet foam latex  ";
  const imageA = visualDecompileCacheKey(prompt, "image");
  const imageB = visualDecompileCacheKey(prompt.trim(), "image");
  const video = visualDecompileCacheKey(prompt, "video");

  assert.equal(imageA, imageB);
  assert.notEqual(imageA, video);
  assert.equal(imageA.includes("preserve the face"), false);
});

test("transduction key follows operational state rather than random ids or timestamps", () => {
  const a = specimen();
  const b = { ...specimen(), id: "another_id", createdAt: 99999 };
  const sameA = visualTransductionCacheKey("Molting", a, "image", null);
  const sameB = visualTransductionCacheKey(" molting ", b, "image", null);
  assert.equal(sameA, sameB);

  const mutated = specimen();
  mutated.traits = [trait("the cheek becomes disconnected at the seam")];
  assert.notEqual(
    sameA,
    visualTransductionCacheKey("Molting", mutated, "image", null),
  );
  assert.notEqual(
    sameA,
    visualTransductionCacheKey("Molting", a, "video", null),
  );
  assert.notEqual(
    sameA,
    visualTransductionCacheKey("Molting", a, "image", "mind_07"),
  );
});

test("cache pruning removes expired entries and keeps only the newest bounded set", () => {
  const now = 10_000;
  const cache = {
    expired: { cachedAt: 1, value: "old" },
    a: { cachedAt: 9_100, value: "a" },
    b: { cachedAt: 9_200, value: "b" },
    c: { cachedAt: 9_300, value: "c" },
  };
  const pruned = pruneVisualCache(cache, now, 1_000, 2);

  assert.deepEqual(Object.keys(pruned).sort(), ["b", "c"]);
});

test("only AI results are persisted so a temporary fallback cannot block later semantic recovery", () => {
  assert.equal(cacheableVisualSource("ai"), true);
  assert.equal(cacheableVisualSource("fallback"), false);
});
