import { ATLAS, getConcept, sourceWordIn } from "./concepts";
import { getMind } from "./minds";
import {
  CAPTION_MAX,
  LYRICS_MAX,
  STYLE_MAX,
  type OrganismState,
} from "./types";

export type CompileBoxes = {
  style: string;
  lyrics: string;
  caption: string;
  styleCount: number;
  lyricsCount: number;
  captionCount: number;
  warnings: string[];
};

function clip(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

function activeTraits(state: OrganismState) {
  return state.traits
    .filter((t) => !t.lost && !t.suppressed && t.strength >= 0.28)
    .sort((a, b) => b.strength - a.strength);
}

function stripSourceWords(text: string, state: OrganismState): string {
  let out = text;
  const ids = new Set(
    [
      ...state.interpretations.map((i) => i.conceptId),
      ...state.traits.map((t) => t.sourceConceptId),
    ].filter(Boolean) as string[],
  );
  for (const id of ids) {
    const c = getConcept(id);
    if (!c) continue;
    if (sourceWordIn(out, c)) {
      const re = new RegExp(c.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig");
      out = out.replace(re, "the encountered region");
      for (const a of c.aliases) {
        if (a.length < 4) continue;
        out = out.replace(new RegExp(a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig"), "the encountered region");
      }
    }
  }
  return out.replace(/\s+/g, " ").trim();
}

function clicheHits(text: string, state: OrganismState): string[] {
  const hits: string[] = [];
  const n = text.toLowerCase();
  const ids = new Set(state.interpretations.map((i) => i.conceptId));
  for (const id of ids) {
    const c = getConcept(id) ?? ATLAS.find((x) => x.id === id);
    if (!c) continue;
    for (const ban of c.clicheForbidden) {
      if (n.includes(ban.toLowerCase())) hits.push(ban);
    }
  }
  return hits;
}

export function compileSuno(state: OrganismState): CompileBoxes {
  const traits = activeTraits(state);
  const warnings: string[] = [];

  const styleParts: string[] = [];
  styleParts.push("Original contemporary song. Do not imitate a famous artist.");
  const jurisdictions = new Map<string, string[]>();
  for (const t of traits.slice(0, 10)) {
    const list = jurisdictions.get(t.jurisdiction) ?? [];
    list.push(t.rule);
    jurisdictions.set(t.jurisdiction, list);
  }
  for (const [j, rules] of jurisdictions) {
    styleParts.push(`${j}: ${rules[0]}`);
  }
  if (state.invariants.length) {
    styleParts.push(
      "Hard constraints: " + state.invariants.map((i) => i.text).join("; ") + ".",
    );
  }
  const scar = state.scars[state.scars.length - 1];
  if (scar) {
    styleParts.push(`Structural scar in effect: ${scar.description}`);
  }
  const mind = getMind(state.installedMind);
  if (mind) {
    styleParts.push(`Installed cognitive constraint (${mind.label}): ${mind.compile}`);
  }
  styleParts.push("Prefer rules over adjectives. Do not add cinematic trailer drums or generic swell.");

  let style = stripSourceWords(styleParts.join(" "), state);
  const styleCliche = clicheHits(style, state);
  if (styleCliche.length) {
    warnings.push(`Stripped cliché basin: ${styleCliche.join(", ")}`);
    for (const c of styleCliche) {
      style = style.replace(new RegExp(c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig"), "");
    }
    style = style.replace(/\s+/g, " ").trim();
  }

  const lines: string[] = [];
  lines.push("[Verse 1]");
  const motif = traits.find((t) => t.jurisdiction === "motif") ?? traits[0];
  const pulse = traits.find((t) => t.jurisdiction === "pulse" || t.jurisdiction === "rhythm");
  const mem = traits.find((t) => t.jurisdiction === "repetition");
  if (motif) {
    lines.push(`[the figure: ${motif.rule}]`);
  }
  if (pulse) {
    lines.push(`[time behavior: ${pulse.rule}]`);
  }
  lines.push("");
  lines.push("[Chorus]");
  if (mem) {
    lines.push(`[recurrence law: ${mem.rule}]`);
  } else {
    lines.push("[return the figure without announcing a destination]");
  }
  const vocal = traits.find((t) => t.jurisdiction === "vocal");
  if (vocal) lines.push(`[voice: ${vocal.rule}]`);
  lines.push("");
  lines.push("[Verse 2]");
  if (scar) {
    lines.push(`[scar remains audible: ${scar.lostTraitNames.join(", ") || "a named loss"}]`);
    if (scar.debris[0]) lines.push(`[debris as interruption: ${scar.debris[0]}]`);
  } else {
    const next = traits.find((t) => t.jurisdiction === "form") ?? traits[1];
    if (next) lines.push(`[form: ${next.rule}]`);
  }
  lines.push("");
  lines.push("[Bridge]");
  const env = traits.find((t) => t.source === "ROUTE_OPERATOR" || t.source === "WAYPOINT");
  if (env) {
    lines.push(`[consequence of travel: ${env.rule}]`);
  } else {
    lines.push("[do not explain the journey; only perform what it left]");
  }
  lines.push("");
  lines.push("[Chorus]");
  if (mem) lines.push(`[recurrence law, now with reconstruction from the previous chorus]`);
  lines.push("");
  lines.push("[Outro]");
  const prod = traits.find((t) => t.jurisdiction === "production" || t.jurisdiction === "spatial");
  if (prod) lines.push(`[space: ${prod.rule}]`);
  lines.push("[end without resolving a home that was never declared]");

  let lyrics = stripSourceWords(lines.join("\n"), state);

  const captionRaw = `${state.name}: ${state.identity} Path-dependent descendant, not a theme.`;
  let caption = stripSourceWords(captionRaw, state);

  style = clip(style, STYLE_MAX);
  lyrics = clip(lyrics, LYRICS_MAX);
  caption = clip(caption, CAPTION_MAX);

  if (style.length < 80) warnings.push("Style box is thin — travel more, then compile.");
  if (state.scars.length === 0 && state.version > 2) {
    warnings.push("No scars in a long lineage. Collision or through-routes leave more specific compiles.");
  }

  return {
    style,
    lyrics,
    caption,
    styleCount: style.length,
    lyricsCount: lyrics.length,
    captionCount: caption.length,
    warnings,
  };
}
