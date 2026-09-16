import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SUNO_SEEDS, createSeedOrigin } from "./seeds.ts";

const EXPECTED_IDS = [
  "productive-contradiction",
  "reconstructive-memory",
  "primitive-vacuum",
  "alien-sensorium",
  "phonetic-organism",
  "metabolic-composition",
] as const;

describe("Suno genotype catalog", () => {
  it("ships exactly the six approved evolution-first genotypes", () => {
    assert.deepEqual(
      SUNO_SEEDS.map((seed) => seed.id),
      EXPECTED_IDS,
    );
  });

  it("creates a complete generation-zero organism for every genotype", () => {
    for (const seed of SUNO_SEEDS) {
      const state = createSeedOrigin(seed.id);
      const live = state.traits.filter((trait) => !trait.lost && !trait.suppressed);
      const mutableJurisdictions = new Set(
        live
          .filter((trait) => !trait.locked && trait.mutability >= 0.25)
          .map((trait) => trait.jurisdiction),
      );

      assert.equal(state.seedId, seed.id, `${seed.id} should preserve seed identity`);
      assert.equal(state.generation, 0, `${seed.id} should begin at generation zero`);
      assert.ok(live.length >= 5, `${seed.id} should begin as a complete musical organism`);
      assert.ok(
        mutableJurisdictions.size >= 3,
        `${seed.id} should expose at least three meaningfully mutable jurisdictions`,
      );
      assert.ok(
        state.invariants.length > 0 || live.some((trait) => trait.locked),
        `${seed.id} should contain at least one load-bearing anchor`,
      );
      assert.ok(
        state.name.length > 0 && state.identity.length > 0,
        `${seed.id} should have a recognizable identity`,
      );
    }
  });

  it("keeps phonetic behavior local and deterministic where a seed defines it", () => {
    const first = createSeedOrigin("phonetic-organism");
    const second = createSeedOrigin("phonetic-organism");

    assert.ok(first.phoneticRules.length >= 5);
    assert.deepEqual(first.phoneticRules, second.phoneticRules);
    assert.ok(first.phoneticRules.some((rule) => /consonant/i.test(rule.trigger)));
    assert.ok(first.phoneticRules.some((rule) => /vowel/i.test(rule.trigger)));
  });

  it("does not silently substitute a default for an unknown genotype id", () => {
    assert.throws(() => createSeedOrigin("absolutely-not-a-seed"), /seed/i);
  });
});
