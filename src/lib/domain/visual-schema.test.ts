import test from "node:test";
import assert from "node:assert/strict";
import {
  VISUAL_FAILURE_SURFACES,
  VISUAL_FEATURE_MEANINGS,
  VISUAL_JURISDICTIONS,
  VISUAL_SCHEMA,
  createVisualSpecimen,
  jurisdictionsForOutput,
} from "./visual-schema.ts";

test("visual schema contains shared and video-only mutation jurisdictions", () => {
  const ids = new Set(VISUAL_JURISDICTIONS.map((jurisdiction) => jurisdiction.id));
  assert.equal(ids.has("subject_identity"), true);
  assert.equal(ids.has("topology"), true);
  assert.equal(ids.has("material"), true);
  assert.equal(ids.has("camera"), true);
  assert.equal(ids.has("frame_correspondence"), true);
  assert.equal(ids.has("object_permanence"), true);
});

test("image output excludes video-only jurisdictions while video includes them", () => {
  const image = new Set(jurisdictionsForOutput("image"));
  const video = new Set(jurisdictionsForOutput("video"));
  assert.equal(image.has("subject_identity"), true);
  assert.equal(image.has("frame_correspondence"), false);
  assert.equal(video.has("frame_correspondence"), true);
  assert.equal(video.has("time_direction"), true);
});

test("visual feature map covers the existing manifold feature vector", () => {
  assert.deepEqual(
    Object.keys(VISUAL_FEATURE_MEANINGS).sort(),
    [
      "energy",
      "failure",
      "memory",
      "semanticX",
      "semanticY",
      "structure",
      "temporal",
      "topology",
    ].sort(),
  );
});

test("visual failure surfaces include static binding and temporal continuity failures", () => {
  const ids = new Set(VISUAL_FAILURE_SURFACES.map((surface) => surface.id));
  assert.equal(ids.has("identity_binding"), true);
  assert.equal(ids.has("boundary_membership"), true);
  assert.equal(ids.has("frame_identity"), true);
  assert.equal(ids.has("causal_continuity"), true);
});

test("prompt specimen preserves raw prompt and desired output without decompiling it", () => {
  const specimen = createVisualSpecimen(
    "  a face governed by a recursive surface  ",
    "video",
  );
  assert.equal(specimen.rawPrompt, "a face governed by a recursive surface");
  assert.equal(specimen.output, "video");
  assert.equal(specimen.clauses.length, 0);
  assert.equal(specimen.decompiled, false);
});

test("visual schema advertises one visual domain with image and video outputs", () => {
  assert.equal(VISUAL_SCHEMA.domainId, "visual");
  assert.deepEqual(VISUAL_SCHEMA.outputKinds, ["image", "video"]);
});
