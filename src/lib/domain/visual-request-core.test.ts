import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeVisualTransductionInput } from "./visual-request-core.ts";

test("visual transduction request clamps every user-controlled text and collection", () => {
  const input = sanitizeVisualTransductionInput({
    label: `  ${"x".repeat(180)}  `,
    output: "not-video",
    organismName: "n".repeat(180),
    organismIdentity: "i".repeat(600),
    traits: Array.from({ length: 30 }, (_, i) => ({
      name: `trait-${i}-${"a".repeat(100)}`,
      rule: "r".repeat(800),
      jurisdiction: "j".repeat(140),
      strength: 9,
      mutability: -3,
      locked: i === 0,
      lost: false,
      suppressed: false,
    })),
    invariants: Array.from({ length: 20 }, () => "p".repeat(500)),
    mind: {
      id: "m".repeat(200),
      full: "f".repeat(500),
      transduce: "t".repeat(1500),
      procedure: Array.from({ length: 12 }, () => "q".repeat(500)),
    },
  });

  assert.equal(input.output, "image");
  assert.equal(input.label.length, 120);
  assert.equal(input.organismName.length, 100);
  assert.equal(input.organismIdentity.length, 360);
  assert.equal(input.traits.length, 18);
  assert.equal(input.traits[0]?.name.length, 80);
  assert.equal(input.traits[0]?.rule.length, 360);
  assert.equal(input.traits[0]?.jurisdiction.length, 80);
  assert.equal(input.traits[0]?.strength, 1);
  assert.equal(input.traits[0]?.mutability, 0);
  assert.equal(input.invariants.length, 8);
  assert.equal(input.invariants[0]?.length, 240);
  assert.equal(input.mind?.id.length, 80);
  assert.equal(input.mind?.full.length, 240);
  assert.equal(input.mind?.transduce.length, 900);
  assert.equal(input.mind?.procedure.length, 4);
  assert.equal(input.mind?.procedure[0]?.length, 240);
});

test("video survives normalization while missing collections become safe empties", () => {
  const input = sanitizeVisualTransductionInput({
    label: "  déjà   vu  ",
    output: "video",
    organismName: "specimen",
    organismIdentity: "identity",
  });

  assert.equal(input.label, "déjà vu");
  assert.equal(input.output, "video");
  assert.deepEqual(input.traits, []);
  assert.deepEqual(input.invariants, []);
  assert.equal(input.mind, undefined);
});
