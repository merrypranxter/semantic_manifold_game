import type { DomainCompileOutput } from "./types.ts";
import {
  VISUAL_JURISDICTIONS,
  jurisdictionsForOutput,
  type VisualOutputKind,
} from "./visual-schema.ts";
import type { OrganismState, Trait } from "../manifold/types.ts";

const VIDEO_ONLY = new Set(
  VISUAL_JURISDICTIONS
    .filter((jurisdiction) => jurisdiction.scope === "video")
    .map((jurisdiction) => jurisdiction.id),
);

function activeTraits(state: OrganismState, output: VisualOutputKind): Trait[] {
  const allowed = new Set(jurisdictionsForOutput(output));
  return state.traits
    .filter(
      (trait) =>
        !trait.lost &&
        !trait.suppressed &&
        allowed.has(String(trait.jurisdiction)),
    )
    .sort((a, b) => {
      const lock = Number(Boolean(b.locked)) - Number(Boolean(a.locked));
      if (lock !== 0) return lock;
      return b.strength - a.strength;
    });
}

function uniqueSentences(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const text = value.trim().replace(/\s+/g, " ");
    if (!text) continue;
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(text.replace(/[.]+$/g, ""));
  }
  return out;
}

function sentenceBlock(label: string, values: string[]): string {
  const rows = uniqueSentences(values);
  if (rows.length === 0) return "";
  return `${label}: ${rows.map((row) => `${row}.`).join(" ")}`;
}

function invariantText(state: OrganismState): string {
  return sentenceBlock(
    "Preserve",
    state.invariants
      .filter((invariant) => invariant.level === "ABSOLUTE" || invariant.level === "STRONG")
      .map((invariant) => invariant.text),
  );
}

function residueText(state: OrganismState): string {
  const scars = state.scars.slice(-6).map((scar) => scar.description);
  const debris = state.debris.slice(-4).map((row) => row.rule);
  return sentenceBlock("Ancestral residue", [...scars, ...debris]);
}

function promptText(state: OrganismState, output: VisualOutputKind): string {
  const traits = activeTraits(state, output);
  const shared = traits
    .filter((trait) => !VIDEO_ONLY.has(String(trait.jurisdiction)))
    .map((trait) => trait.rule);
  const temporal = traits
    .filter((trait) => VIDEO_ONLY.has(String(trait.jurisdiction)))
    .map((trait) => trait.rule);

  const sourceFallback =
    traits.length === 0 && state.provenance?.raw
      ? state.provenance.raw.trim()
      : "";

  const parts = [
    state.identity.trim(),
    sourceFallback,
    sentenceBlock("Current visual laws", shared),
    output === "video" ? sentenceBlock("Temporal laws", temporal) : "",
    invariantText(state),
    residueText(state),
  ].filter(Boolean);

  return parts.join("\n\n");
}

function warningsFor(state: OrganismState, output: VisualOutputKind): string[] {
  const warnings: string[] = [];
  const traits = activeTraits(state, output);
  if (traits.length === 0) {
    warnings.push(
      state.provenance?.raw
        ? "No active decompiled traits remain; compiler is falling back to the preserved source prompt."
        : "This visual organism has no prompt specimen yet. Ingest a prompt before meaningful compilation.",
    );
  }
  if (output === "video") {
    const temporal = traits.some((trait) =>
      VIDEO_ONLY.has(String(trait.jurisdiction)),
    );
    if (!temporal) {
      warnings.push(
        "Video output has no explicit temporal laws yet; the prompt will preserve the visual state but motion/continuity behavior is underspecified.",
      );
    }
  }
  return warnings;
}

function compile(state: OrganismState, output: VisualOutputKind): DomainCompileOutput {
  const text = promptText(state, output);
  const continuity =
    output === "video"
      ? sentenceBlock(
          "Continuity constraints",
          activeTraits(state, output)
            .filter((trait) =>
              [
                "subject_identity",
                "spatial_continuity",
                "temporal_identity",
                "object_permanence",
                "frame_correspondence",
                "occlusion",
                "persistence",
                "before_after",
              ].includes(String(trait.jurisdiction)),
            )
            .map((trait) => trait.rule),
        )
      : "";

  return {
    kind: output,
    title: output === "video" ? "Compile Video Prompt" : "Compile Image Prompt",
    description:
      output === "video"
        ? "The current visual descendant compiled with temporal laws and continuity constraints."
        : "The current visual descendant compiled from active shared visual laws; video-only traits are omitted.",
    sections: [
      {
        id: "prompt",
        label: output === "video" ? "Video Prompt" : "Image Prompt",
        text,
        count: text.length,
      },
      ...(continuity
        ? [
            {
              id: "continuity",
              label: "Continuity",
              text: continuity,
              count: continuity.length,
            },
          ]
        : []),
    ],
    warnings: warningsFor(state, output),
  };
}

export function compileImagePrompt(state: OrganismState): DomainCompileOutput {
  return compile(state, "image");
}

export function compileVideoPrompt(state: OrganismState): DomainCompileOutput {
  return compile(state, "video");
}

export function compileVisual(
  state: OrganismState,
  output?: VisualOutputKind,
): DomainCompileOutput {
  const selected =
    output ?? (state.provenance?.outputKind === "video" ? "video" : "image");
  return selected === "video"
    ? compileVideoPrompt(state)
    : compileImagePrompt(state);
}
