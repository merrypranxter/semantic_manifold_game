import { compileSuno } from "../../manifold/compiler.ts";
import { createOrigin } from "../../manifold/origin.ts";
import {
  CAPTION_MAX,
  LYRICS_MAX,
  STYLE_MAX,
} from "../../manifold/types.ts";
import type { DomainCompileOutput, DomainProfile } from "../types.ts";

export const MUSIC_JURISDICTIONS = [
  "time",
  "meter",
  "rhythm",
  "pulse",
  "pitch",
  "harmony",
  "melody",
  "texture",
  "timbre",
  "instrumentation",
  "vocal",
  "articulation",
  "dynamics",
  "production",
  "form",
  "motif",
  "repetition",
  "performance",
  "spatial",
  "structure",
  "memory",
] as const;

function compileMusic(state: Parameters<typeof compileSuno>[0]): DomainCompileOutput {
  const boxes = compileSuno(state);
  return {
    kind: "music",
    title: "Compile to Suno",
    description:
      "Three boxes. Character counts are the app's, not the model's. Rules over adjectives. History is not dumped.",
    sections: [
      {
        id: "style",
        label: "Style",
        text: boxes.style,
        count: boxes.styleCount,
        max: STYLE_MAX,
      },
      {
        id: "lyrics",
        label: "Lyrics / Control",
        text: boxes.lyrics,
        count: boxes.lyricsCount,
        max: LYRICS_MAX,
      },
      {
        id: "caption",
        label: "Caption",
        text: boxes.caption,
        count: boxes.captionCount,
        max: CAPTION_MAX,
      },
    ],
    warnings: boxes.warnings,
  };
}

export const musicProfile: DomainProfile = {
  id: "music",
  label: "Music / Suno",
  description: "Persistent musical organism compiled to Suno-style output.",
  jurisdictions: MUSIC_JURISDICTIONS,
  defaultMetric: "SEMANTIC",
  idleHint: "Begin as a pulse. Drift the field. Type a word. Go there.",
  beginHint: "Zoom in. Drag or WASD to drift. Find a word — any word — and go there.",
  createOrigin,
  compile: compileMusic,
};
