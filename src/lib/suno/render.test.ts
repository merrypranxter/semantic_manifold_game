import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SUNO_SEEDS, createSeedOrigin } from "./seeds.ts";
import { renderSuno } from "./render.ts";
import {
  CAPTION_MAX,
  CAPTION_MIN,
  LYRICS_MAX,
  LYRICS_MIN,
  STYLE_MAX,
  STYLE_MIN,
} from "../manifold/types.ts";

function inRange(value: string, min: number, max: number, label: string) {
  assert.ok(
    value.length >= min && value.length <= max,
    `${label} length ${value.length} should be ${min}-${max}`,
  );
}

describe("strict deterministic Suno rendering", () => {
  it("renders every seed inside the hard Suno character windows", () => {
    for (const seed of SUNO_SEEDS) {
      const rendered = renderSuno(createSeedOrigin(seed.id));
      inRange(rendered.style, STYLE_MIN, STYLE_MAX, `${seed.id} style`);
      inRange(rendered.lyrics, LYRICS_MIN, LYRICS_MAX, `${seed.id} lyrics`);
      inRange(rendered.caption, CAPTION_MIN, CAPTION_MAX, `${seed.id} caption`);
      assert.equal(rendered.styleCount, rendered.style.length);
      assert.equal(rendered.lyricsCount, rendered.lyrics.length);
      assert.equal(rendered.captionCount, rendered.caption.length);
    }
  });

  it("is byte-identical for the same canonical state and performs no fetch", () => {
    const state = createSeedOrigin("alien-sensorium");
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (() => {
      throw new Error("render must stay local");
    }) as typeof fetch;
    try {
      assert.deepEqual(renderSuno(state), renderSuno(state));
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("keeps anchors audible and uses a control score instead of compulsory pop scaffolding", () => {
    const state = createSeedOrigin("phonetic-organism");
    const rendered = renderSuno(state);
    const anchor = state.traits.find((trait) => trait.locked)!;
    const combined = `${rendered.style}\n${rendered.lyrics}`.toLowerCase();

    assert.ok(combined.includes(anchor.name.toLowerCase()) || combined.includes(anchor.rule.toLowerCase()));
    assert.match(rendered.lyrics, /\[[^\]]+\]/);
    assert.ok(!rendered.lyrics.includes("[Verse 1]"));
    assert.ok(!rendered.lyrics.includes("[Chorus]"));
    assert.ok(!rendered.style.endsWith("…"));
    assert.ok(!rendered.lyrics.endsWith("…"));
    assert.ok(!rendered.caption.endsWith("…"));
  });
});
