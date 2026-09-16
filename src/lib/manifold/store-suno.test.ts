import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createOrigin } from "./origin.ts";
import { migratePersistedRun } from "./store-suno.ts";
import { renderSuno } from "../suno/render.ts";

const cachedConcept = {
  id: "custom-test",
  label: "custom test",
  aliases: [],
  whatItDoes: "changes a local rule",
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
  failureMode: "uncertain",
  fracturePlane: "structure" as const,
  mass: 0.4,
  seeded: false,
};

describe("Suno store helpers", () => {
  it("starts the genotype explicitly rather than an anonymous pulse", () => {
    const state = createOrigin("alien-sensorium");
    assert.equal(state.seedId, "alien-sensorium");
    assert.equal(state.generation, 0);
    assert.match(state.name, /Alien Sensorium/i);
  });

  it("restoring the same canonical snapshot regenerates byte-identical prompts", () => {
    const snapshot = createOrigin("reconstructive-memory");
    assert.deepEqual(renderSuno(snapshot), renderSuno(structuredClone(snapshot)));
  });

  it("resets incompatible pre-v4 run state while preserving safe custom concepts", () => {
    const legacy = {
      started: true,
      currentId: "old-state",
      states: { "old-state": { id: "old-state", version: 3 } },
      ledger: [{ id: "old-event" }],
      customConcepts: [cachedConcept],
      metric: "MEMORY",
    };
    const migrated = migratePersistedRun(legacy, 3);

    assert.equal(migrated.started, false);
    assert.equal(migrated.currentId, null);
    assert.deepEqual(migrated.states, {});
    assert.deepEqual(migrated.ledger, []);
    assert.deepEqual(migrated.customConcepts, [cachedConcept]);
    assert.match(String(migrated.hint), /genotype|migrat|updated/i);
  });
});
