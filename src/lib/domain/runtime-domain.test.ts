import test from "node:test";
import assert from "node:assert/strict";
import { domainIdForOrganism } from "./runtime-domain.ts";
import type { DomainId } from "./types.ts";
import type { OrganismState } from "../manifold/types.ts";

function specimen(domain?: string): OrganismState {
  return {
    id: "st-test",
    version: 3,
    name: "Test specimen",
    identity: "test",
    playProjection: "",
    labProjection: "",
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
    uncertainty: 0,
    createdAt: 1,
    installedMind: null,
    mindHistory: [],
    retiredMetrics: [],
    ...(domain
      ? { provenance: { source: "prompt" as const, domain } }
      : {}),
  };
}

test("visual provenance overrides a stale persisted music domain", () => {
  const stored: DomainId = "music";
  assert.equal(domainIdForOrganism(specimen("visual"), stored), "visual");
});

test("explicit music provenance can repair a stale visual domain", () => {
  const stored: DomainId = "visual";
  assert.equal(domainIdForOrganism(specimen("music"), stored), "music");
});

test("legacy organisms without provenance keep the stored domain", () => {
  assert.equal(domainIdForOrganism(specimen(), "music"), "music");
  assert.equal(domainIdForOrganism(specimen(), "visual"), "visual");
});
