import test from "node:test";
import assert from "node:assert/strict";
import { resolveDomainProfile } from "./registry-core.ts";
import type { DomainProfile } from "./types.ts";

const music = { id: "music", label: "Music" } as DomainProfile;
const image = { id: "image", label: "Image" } as DomainProfile;

test("returns the requested registered domain", () => {
  const result = resolveDomainProfile({ music, image }, "image", "music");
  assert.equal(result, image);
});

test("falls back to the registered default when a future domain is not installed yet", () => {
  const result = resolveDomainProfile({ music }, "video", "music");
  assert.equal(result, music);
});

test("throws when neither the requested domain nor fallback exists", () => {
  assert.throws(
    () => resolveDomainProfile({}, "video", "music"),
    /No domain profile registered for video or fallback music/,
  );
});
