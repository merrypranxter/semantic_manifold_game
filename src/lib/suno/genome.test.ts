import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createSeedOrigin } from "./seeds.ts";
import { deriveSunoGenome } from "./genome.ts";
import { deriveMutationDiff } from "./diff.ts";
import { applyDelta } from "../manifold/reducer.ts";
import type { Delta, Scar } from "../manifold/types.ts";

describe("derived Suno genome", () => {
  it("is deterministic and does not mutate canonical state", () => {
    const state = createSeedOrigin("productive-contradiction");
    const before = JSON.stringify(state);
    const a = deriveSunoGenome(state);
    const b = deriveSunoGenome(state);

    assert.deepEqual(a, b);
    assert.equal(JSON.stringify(state), before);
    assert.equal(a.seedId, "productive-contradiction");
    assert.equal(a.generation, 0);
    assert.ok(a.anchors.length >= 1);
    assert.ok(a.byJurisdiction.harmony.some((gene) => gene.status === "locked"));
  });

  it("reports active, locked, scarred, suppressed and lost statuses from canonical state", () => {
    const state = createSeedOrigin("productive-contradiction");
    const [anchor, melody, rhythm, timbre] = state.traits;
    assert.ok(anchor && melody && rhythm && timbre);

    const changed = {
      ...state,
      traits: state.traits.map((trait) =>
        trait.id === melody.id
          ? { ...trait, suppressed: true }
          : trait.id === rhythm.id
            ? { ...trait, lost: true, strength: 0 }
            : trait,
      ),
      scars: [
        {
          id: "scar:test",
          cause: "test collision",
          operator: "COLLISION" as const,
          description: "timbre survived a destructive collision",
          lostTraitNames: [rhythm.name],
          survivorTraitNames: [timbre.name],
          debris: [],
        },
      ],
    };
    const genome = deriveSunoGenome(changed);

    assert.equal(genome.byJurisdiction.harmony.find((g) => g.trait.id === anchor.id)?.status, "locked");
    assert.equal(genome.byJurisdiction.melody.find((g) => g.trait.id === melody.id)?.status, "suppressed");
    assert.equal(genome.byJurisdiction.rhythm.find((g) => g.trait.id === rhythm.id)?.status, "lost");
    assert.equal(genome.byJurisdiction.timbre.find((g) => g.trait.id === timbre.id)?.status, "scarred");
  });
});

describe("mutation diff", () => {
  it("describes structural consequences and preserves unchanged anchors", () => {
    const before = createSeedOrigin("productive-contradiction");
    const anchor = before.traits.find((trait) => trait.locked)!;
    const melody = before.traits.find((trait) => trait.jurisdiction === "melody")!;
    const rhythm = before.traits.find((trait) => trait.jurisdiction === "rhythm")!;
    const timbre = before.traits.find((trait) => trait.jurisdiction === "timbre")!;
    const scar: Scar = {
      id: "scar:diff",
      cause: "forced incompatibility",
      operator: "COLLISION",
      description: "rhythm was lost while timbre survived",
      lostTraitNames: [rhythm.name],
      survivorTraitNames: [timbre.name],
      debris: ["broken attack lattice"],
    };
    const after = {
      ...before,
      traits: before.traits.map((trait) =>
        trait.id === melody.id
          ? { ...trait, rule: `${trait.rule}; now bends earlier`, source: "ROUTE_OPERATOR" as const }
          : trait.id === rhythm.id
            ? { ...trait, lost: true, strength: 0 }
            : timbre && trait.id === timbre.id
              ? { ...trait, suppressed: true }
              : trait,
      ),
      scars: [scar],
    };

    const diff = deriveMutationDiff(before, after);
    assert.ok(diff.mutated.includes(melody.name));
    assert.ok(diff.lost.includes(rhythm.name));
    assert.ok(diff.suppressed.includes(timbre.name));
    assert.ok(diff.scarred.some((name) => name.includes("rhythm") || name.includes("timbre")));
    assert.ok(diff.preserved.includes(anchor.name));
  });

  it("attaches the derived diff and increments generation in the reducer", () => {
    const before = createSeedOrigin("productive-contradiction");
    const melody = before.traits.find((trait) => trait.jurisdiction === "melody")!;
    const delta: Delta = {
      operator: "DIRECT",
      targetId: "test-target",
      narrative: "test",
      lab: "test",
      ops: [
        {
          kind: "MUTATE",
          traitId: melody.id,
          name: melody.name,
          rule: `${melody.rule}; compressed by test pressure`,
          source: "ROUTE_OPERATOR",
        },
      ],
    };

    const { next } = applyDelta(before, delta, "SEMANTIC", "test target");
    assert.equal(next.seedId, before.seedId);
    assert.equal(next.generation, 1);
    assert.ok(next.lastMutationDiff?.mutated.includes(melody.name));
    assert.ok(next.lastMutationDiff?.preserved.length);
  });
});
