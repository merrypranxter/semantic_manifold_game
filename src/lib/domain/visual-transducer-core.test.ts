import test from "node:test";
import assert from "node:assert/strict";
import {
  fallbackVisualConcept,
  normalizeVisualConcept,
} from "./visual-transducer-core.ts";
import type { Trait } from "../manifold/types.ts";

const traits: Trait[] = [
  {
    id: "tr_identity",
    name: "preserved subject",
    rule: "the same subject remains recognizable",
    jurisdiction: "subject_identity",
    strength: 0.9,
    confidence: 0.95,
    persistence: 0.95,
    mutability: 0.08,
    source: "ORIGIN",
    recency: 0,
    locked: true,
  },
  {
    id: "tr_surface",
    name: "continuous surface",
    rule: "surface continuity remains visible during deformation",
    jurisdiction: "surface",
    strength: 0.72,
    confidence: 0.85,
    persistence: 0.72,
    mutability: 0.62,
    source: "ORIGIN",
    recency: 0,
  },
  {
    id: "tr_topology",
    name: "single connected body",
    rule: "connectivity stays globally legible",
    jurisdiction: "topology",
    strength: 0.68,
    confidence: 0.82,
    persistence: 0.7,
    mutability: 0.58,
    source: "ORIGIN",
    recency: 0,
  },
];

test("image transduction rejects video-only donations", () => {
  const result = normalizeVisualConcept(
    "molting",
    "image",
    traits,
    {
      whatItDoes: "Transfers membership while an old boundary remains as residue.",
      readings: ["boundary transfer"],
      donations: [
        {
          jurisdiction: "frame_correspondence",
          name: "bad temporal donation",
          rule: "successive frames disagree about correspondence",
        },
        {
          jurisdiction: "surface",
          name: "residual shell",
          rule: "the obsolete boundary remains visible after membership moves inward",
          rewrite: "surface continuity becomes a two-stage separation with residual evidence",
        },
      ],
      fracturePlane: "surface",
    },
  );

  assert.equal(result.concept.donations.some((d) => d.jurisdiction === "frame_correspondence"), false);
  assert.equal(result.concept.donations.some((d) => d.jurisdiction === "surface"), true);
});

test("source concept words are removed from operational rules and rewrites", () => {
  const result = normalizeVisualConcept(
    "molting",
    "image",
    traits,
    {
      whatItDoes: "Molting makes an old boundary persist after identity has moved.",
      donations: [
        {
          jurisdiction: "surface",
          name: "molting shell",
          rule: "molting leaves a molting shell attached to the surface",
          rewrite: "molting rewrites the surface into two generations",
        },
      ],
      fracturePlane: "surface",
    },
  );

  const donation = result.concept.donations[0]!;
  assert.equal(/molting/i.test(donation.rule), false);
  assert.equal(/molting/i.test(donation.rewrite ?? ""), false);
  assert.equal(result.concept.clicheForbidden.some((x) => /molting/i.test(x)), true);
});

test("donations that rewrite existing mutable jurisdictions are ordered first", () => {
  const result = normalizeVisualConcept(
    "déjà vu",
    "image",
    traits,
    {
      whatItDoes: "A current state inherits evidence from a prior state without literal duplication.",
      donations: [
        {
          jurisdiction: "color",
          name: "new color law",
          rule: "spectral relationships repeat with a displaced phase",
        },
        {
          jurisdiction: "topology",
          name: "recurrent connectivity",
          rule: "a current connection inherits an earlier connection as structural residue",
          rewrite: "connectivity remains legible while carrying a displaced trace of its prior arrangement",
        },
      ],
      fracturePlane: "topology",
    },
  );

  assert.equal(result.concept.donations[0]?.jurisdiction, "topology");
});

test("fallback transduction attacks existing mutable traits without touching locked identity", () => {
  const result = fallbackVisualConcept("p-adic numbers", "image", traits);
  const jurisdictions = new Set(result.concept.donations.map((d) => d.jurisdiction));

  assert.equal(jurisdictions.has("subject_identity"), false);
  assert.equal([...jurisdictions].every((j) => ["surface", "topology"].includes(j)), true);
  assert.equal(result.source, "fallback");
});
