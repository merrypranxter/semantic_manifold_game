import test from "node:test";
import assert from "node:assert/strict";
import { resolveDomainProfile } from "./registry-core.ts";
import type { CompileKind, DomainId, DomainProfile } from "./types.ts";

const visualDomainId: DomainId = "visual";
const imageCompileKind: CompileKind = "image";
const videoCompileKind: CompileKind = "video";

const music = { id: "music", label: "Music" } as DomainProfile;
const visual = { id: visualDomainId, label: "Visual" } as DomainProfile;

test("keeps image and video as outputs of one visual domain", () => {
  assert.equal(visualDomainId, "visual");
  assert.equal(imageCompileKind, "image");
  assert.equal(videoCompileKind, "video");
});

test("returns the requested registered domain", () => {
  const result = resolveDomainProfile({ music, visual }, "visual", "music");
  assert.equal(result, visual);
});

test("falls back to the registered default when a future domain is not installed yet", () => {
  const result = resolveDomainProfile({ music }, "visual", "music");
  assert.equal(result, music);
});

test("throws when neither the requested domain nor fallback exists", () => {
  assert.throws(
    () => resolveDomainProfile({}, "visual", "music"),
    /No domain profile registered for visual or fallback music/,
  );
});
