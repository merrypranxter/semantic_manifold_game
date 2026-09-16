import { LEXICON_COUNT as BASE_COUNT, LEXICON_WORDS } from "./data/lexicon";
import { LEXICON_MORE, LEXICON_MORE_COUNT } from "./data/lexicon-more";
import { FAMILIES, type FamilyId } from "./families";
import { fnv, slugFromLabel, titleCase } from "./names";
import type { Concept, Features } from "./types";

export const LEXICON_COUNT = BASE_COUNT + LEXICON_MORE_COUNT;

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function unitJitter(word: string, salt: number, spread: number): number {
  const h = fnv(`${word}:${salt}`);
  return ((h % 2000) / 1000 - 1) * spread;
}

export function inflateWord(word: string, familyId: FamilyId): Concept {
  const fam = FAMILIES[familyId] ?? FAMILIES.rare;
  const slug = slugFromLabel(word);
  const sp = fam.spread;
  const features: Features = {
    semanticX: clamp(fam.centroid.semanticX + unitJitter(word, 0, sp), -1, 1),
    semanticY: clamp(fam.centroid.semanticY + unitJitter(word, 1, sp), -1, 1),
    structure: clamp(fam.centroid.structure + unitJitter(word, 2, sp * 0.4), 0, 1),
    failure: clamp(fam.centroid.failure + unitJitter(word, 3, sp * 0.4), 0, 1),
    memory: clamp(fam.centroid.memory + unitJitter(word, 4, sp * 0.4), 0, 1),
    temporal: clamp(fam.centroid.temporal + unitJitter(word, 5, sp * 0.4), 0, 1),
    topology: clamp(fam.centroid.topology + unitJitter(word, 6, sp * 0.4), 0, 1),
    energy: clamp(fam.centroid.energy + unitJitter(word, 7, sp * 0.4), 0, 1),
  };
  const massJ = ((fnv(word + "m") % 100) / 100 - 0.5) * 0.18;
  const pretty = titleCase(word.replace(/-/g, " "));
  return {
    id: slug,
    label: pretty,
    aliases: Array.from(new Set([word.toLowerCase(), word.replace(/-/g, " ").toLowerCase()])),
    whatItDoes: fam.whatItDoes,
    clicheForbidden: [...fam.cliche, word.toLowerCase(), `${pretty.toLowerCase()} themed`],
    donations: fam.donations.map((d) => ({ ...d })),
    features,
    failureMode: fam.failureMode,
    fracturePlane: fam.fracturePlane,
    mass: clamp(fam.mass + massJ, 0.18, 0.95),
    seeded: false,
    family: familyId,
  };
}

function mergedWords(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const [fam, words] of Object.entries(LEXICON_WORDS)) {
    out[fam] = [...words];
  }
  for (const [fam, words] of Object.entries(LEXICON_MORE)) {
    out[fam] = [...(out[fam] ?? []), ...words];
  }
  return out;
}

function buildField(): Concept[] {
  const out: Concept[] = [];
  const seen = new Set<string>();
  for (const [fam, words] of Object.entries(mergedWords())) {
    if (!(fam in FAMILIES)) continue;
    for (const word of words) {
      const c = inflateWord(word, fam as FamilyId);
      if (seen.has(c.id)) continue;
      seen.add(c.id);
      out.push(c);
    }
  }
  return out;
}

export const FIELD: Concept[] = buildField();

export const FIELD_BY_ID = new Map(FIELD.map((c) => [c.id, c]));
