import test from "node:test";
import assert from "node:assert/strict";
import {
  fallbackVisualDecompilation,
  normalizeVisualDecompilation,
  visualSpecimenToOrigin,
} from "./visual-decompiler-core.ts";

test("normalizes model payload without inventing unsupported jurisdictions", () => {
  const result = normalizeVisualDecompilation(
    "  Preserve her face exactly; skin folds through itself. VHS close-up.  ",
    "image",
    {
      identity: "the same woman remains recognizable",
      clauses: [
        {
          text: "Preserve her face exactly",
          jurisdiction: "subject_identity",
          role: "anchor",
          confidence: 1.4,
          mutability: -1,
        },
        {
          text: "skin folds through itself",
          jurisdiction: "topology",
          role: "mechanism",
          confidence: 0.9,
          mutability: 0.7,
        },
        {
          text: "camera remembers tomorrow",
          jurisdiction: "time_direction",
          role: "temporal_law",
          confidence: 0.8,
          mutability: 0.5,
        },
        {
          text: "nonsense",
          jurisdiction: "made_up_zone",
          role: "constraint",
          confidence: 0.8,
          mutability: 0.5,
        },
      ],
      identityAnchors: [" her face ", "her face"],
      explicitInvariants: [
        "preserve her face exactly",
        "preserve her face exactly",
      ],
      features: { topology: 1.7, temporal: -2 },
    },
  );

  assert.equal(
    result.specimen.rawPrompt,
    "Preserve her face exactly; skin folds through itself. VHS close-up.",
  );
  assert.equal(result.specimen.decompiled, true);
  assert.equal(result.specimen.clauses.length, 2);
  assert.equal(result.specimen.clauses[0]?.confidence, 1);
  assert.equal(result.specimen.clauses[0]?.mutability, 0);
  assert.deepEqual(result.specimen.identityAnchors, ["her face"]);
  assert.deepEqual(result.specimen.explicitInvariants, [
    "preserve her face exactly",
  ]);
  assert.equal(result.features.topology, 1);
  assert.equal(result.features.temporal, 0);
  assert.equal(result.warnings.length, 2);
});

test("video keeps temporal clauses and produces temporal pressure", () => {
  const result = normalizeVisualDecompilation(
    "The figure remains itself while changing between frames.",
    "video",
    {
      clauses: [
        {
          text: "identity must survive between frames",
          jurisdiction: "temporal_identity",
          role: "temporal_law",
          confidence: 0.9,
          mutability: 0.4,
        },
      ],
      identityAnchors: ["the figure"],
    },
  );

  assert.equal(
    result.specimen.clauses[0]?.jurisdiction,
    "temporal_identity",
  );
  assert.ok(result.features.temporal >= 0.55);
});

test("origin turns clauses into traits and invariants while preserving provenance", () => {
  const decompiled = normalizeVisualDecompilation(
    "Preserve the face. Skin follows a non-orientable surface.",
    "image",
    {
      identity: "the same face remains the subject",
      clauses: [
        {
          text: "the face remains recognizable",
          jurisdiction: "subject_identity",
          role: "anchor",
          confidence: 0.95,
          mutability: 0.1,
        },
        {
          text: "skin follows one continuous non-orientable surface",
          jurisdiction: "topology",
          role: "mechanism",
          confidence: 0.9,
          mutability: 0.7,
        },
      ],
      identityAnchors: ["the face"],
      explicitInvariants: ["Preserve the face."],
    },
  );

  const state = visualSpecimenToOrigin(decompiled);
  assert.equal(state.version, 0);
  assert.equal(state.traits.length, 2);
  assert.equal(state.invariants.length, 1);
  assert.equal(state.invariants[0]?.level, "ABSOLUTE");
  assert.equal(
    state.provenance?.raw,
    "Preserve the face. Skin follows a non-orientable surface.",
  );
  assert.equal(state.provenance?.domain, "visual");
  assert.equal(state.provenance?.outputKind, "image");
  assert.match(state.identity, /same face/i);
});

test("fallback decompiler extracts operational visual rules locally", () => {
  const result = fallbackVisualDecompilation(
    "Static close-up. Preserve the same face. Foam latex skin folds into a Möbius-like loop. Heavy VHS tracking noise.",
    "image",
  );
  const jurisdictions = new Set(
    result.specimen.clauses.map((clause) => clause.jurisdiction),
  );

  assert.equal(result.source, "fallback");
  assert.equal(result.specimen.decompiled, true);
  assert.equal(jurisdictions.has("subject_identity"), true);
  assert.equal(jurisdictions.has("camera"), true);
  assert.equal(jurisdictions.has("material"), true);
  assert.equal(jurisdictions.has("topology"), true);
  assert.equal(jurisdictions.has("degradation"), true);
});
