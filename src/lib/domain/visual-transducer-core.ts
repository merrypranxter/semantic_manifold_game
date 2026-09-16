import { slugFromLabel, titleCase } from "../manifold/names.ts";
import type { Concept, Donation, Features, Trait } from "../manifold/types.ts";
import {
  failureSurfacesForOutput,
  jurisdictionsForOutput,
  type VisualOutputKind,
} from "./visual-schema.ts";

export type VisualTransductionResult = {
  concept: Concept;
  readings: string[];
  warnings: string[];
  source: "ai" | "fallback";
};

function clamp01(value: unknown, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(1, n));
}

function clamp11(value: unknown, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(-1, Math.min(1, n));
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sourceTokens(label: string): string[] {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 3);
}

export function stripSourceConcept(text: string, label: string): string {
  let next = String(text ?? "").trim();
  if (!next) return next;

  const phrase = label.trim();
  if (phrase) {
    next = next.replace(
      new RegExp(escapeRegex(phrase), "gi"),
      "the encountered process",
    );
  }

  for (const token of sourceTokens(label)) {
    next = next.replace(
      new RegExp(`\\b${escapeRegex(token)}\\b`, "gi"),
      "the process",
    );
  }

  return next.replace(/\s+/g, " ").trim();
}

function compactText(value: unknown, max: number): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, max);
}

function uniqueText(values: unknown, limit: number): string[] {
  if (!Array.isArray(values)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    const text = compactText(value, 280);
    const key = text.toLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    out.push(text);
    if (out.length >= limit) break;
  }
  return out;
}

function activeTraits(traits: readonly Trait[]): Trait[] {
  return traits.filter((trait) => !trait.lost && !trait.suppressed);
}

function mutableJurisdictions(traits: readonly Trait[]): Set<string> {
  return new Set(
    activeTraits(traits)
      .filter((trait) => !trait.locked && trait.mutability > 0.08)
      .map((trait) => trait.jurisdiction),
  );
}

function protectedJurisdictions(traits: readonly Trait[]): Set<string> {
  const grouped = new Map<string, Trait[]>();
  for (const trait of activeTraits(traits)) {
    const rows = grouped.get(trait.jurisdiction) ?? [];
    rows.push(trait);
    grouped.set(trait.jurisdiction, rows);
  }

  const out = new Set<string>();
  for (const [jurisdiction, rows] of grouped) {
    if (rows.length && rows.every((trait) => trait.locked || trait.mutability <= 0.08)) {
      out.add(jurisdiction);
    }
  }
  return out;
}

function defaultFeatures(label: string, output: VisualOutputKind): Features {
  const h = hash(label.toLowerCase());
  const axis = (shift: number) => (((h >>> shift) & 0xff) / 127.5) - 1;
  return {
    semanticX: Math.max(-1, Math.min(1, axis(0))),
    semanticY: Math.max(-1, Math.min(1, axis(8))),
    structure: 0.58,
    failure: 0.62,
    memory: 0.48,
    temporal: output === "video" ? 0.66 : 0.28,
    topology: 0.56,
    energy: 0.54,
  };
}

function normalizeFeatures(
  label: string,
  output: VisualOutputKind,
  raw: unknown,
): Features {
  const defaults = defaultFeatures(label, output);
  const row = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    semanticX: clamp11(row.semanticX, defaults.semanticX),
    semanticY: clamp11(row.semanticY, defaults.semanticY),
    structure: clamp01(row.structure, defaults.structure),
    failure: clamp01(row.failure, defaults.failure),
    memory: clamp01(row.memory, defaults.memory),
    temporal: clamp01(row.temporal, defaults.temporal),
    topology: clamp01(row.topology, defaults.topology),
    energy: clamp01(row.energy, defaults.energy),
  };
}

export function normalizeVisualConcept(
  label: string,
  output: VisualOutputKind,
  traits: readonly Trait[],
  payload: unknown,
  source: "ai" | "fallback" = "ai",
): VisualTransductionResult {
  const row = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const allowed = new Set(jurisdictionsForOutput(output));
  const mutable = mutableJurisdictions(traits);
  const protectedSet = protectedJurisdictions(traits);
  const warnings: string[] = [];
  const seen = new Set<string>();
  const donations: Donation[] = [];
  const rawDonations = Array.isArray(row.donations) ? row.donations : [];

  for (const value of rawDonations.slice(0, 8)) {
    if (!value || typeof value !== "object") continue;
    const donation = value as Record<string, unknown>;
    const jurisdiction = compactText(donation.jurisdiction, 80);
    if (!allowed.has(jurisdiction)) {
      if (jurisdiction) warnings.push(`Dropped visual donation outside ${output} jurisdiction set: ${jurisdiction}`);
      continue;
    }
    if (protectedSet.has(jurisdiction)) {
      warnings.push(`Dropped visual donation aimed only at protected jurisdiction: ${jurisdiction}`);
      continue;
    }

    const rawRule = compactText(donation.rule, 320);
    const rule = stripSourceConcept(rawRule, label);
    if (!rule) continue;
    const rewriteRaw = compactText(donation.rewrite, 320);
    const rewrite = rewriteRaw ? stripSourceConcept(rewriteRaw, label) : undefined;
    const name = stripSourceConcept(
      compactText(donation.name, 64) || `${jurisdiction.replace(/_/g, " ")} pressure`,
      label,
    );
    const key = `${jurisdiction}:${rule.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    donations.push({
      jurisdiction,
      name: name || `${jurisdiction.replace(/_/g, " ")} pressure`,
      rule,
      rewrite,
      mass: clamp01(donation.mass, 0.55),
    });
  }

  donations.sort((a, b) => {
    const aScore = mutable.has(a.jurisdiction) ? 1 : 0;
    const bScore = mutable.has(b.jurisdiction) ? 1 : 0;
    return bScore - aScore;
  });

  const readings = uniqueText(row.readings, 4).map((reading) => stripSourceConcept(reading, label));
  const rawWhatItDoes = compactText(row.whatItDoes ?? row.selected_reading, 420);
  const whatItDoes = stripSourceConcept(
    rawWhatItDoes || "applies an operational pressure to existing visual rules rather than adding themed decoration",
    label,
  );

  const requiredCliches = [
    label.toLowerCase(),
    `${label.toLowerCase()} themed`,
    `looks like ${label.toLowerCase()}`,
  ];
  const clicheForbidden = [...new Set([...requiredCliches, ...uniqueText(row.clicheForbidden, 8)])].slice(0, 10);

  const requestedFracture = compactText(row.fracturePlane, 80);
  const fracturePlane =
    requestedFracture && allowed.has(requestedFracture) && !protectedSet.has(requestedFracture)
      ? requestedFracture
      : donations[0]?.jurisdiction ?? "transformation_mechanism";

  const concept: Concept = {
    id: slugFromLabel(label),
    label: titleCase(label.trim()),
    aliases: [label.toLowerCase()],
    whatItDoes,
    clicheForbidden,
    donations: donations.slice(0, 4),
    features: normalizeFeatures(label, output, row.features),
    failureMode: stripSourceConcept(
      compactText(row.failureMode, 280) || "the pressure collapses into decoration instead of changing an existing visual rule",
      label,
    ),
    fracturePlane,
    mass: Math.max(0.2, Math.min(0.95, Number(row.mass) || 0.58)),
    seeded: false,
    family: "visual-transduced",
  };

  if (concept.donations.length === 0) {
    warnings.push("Visual transduction produced no usable donations.");
  }

  return {
    concept,
    readings: readings.length ? readings : [whatItDoes],
    warnings,
    source,
  };
}

const FALLBACK_MECHANISMS = [
  "the prior state remains as visible residue while membership transfers to a successor state",
  "local continuity is preserved while global correspondence is reassigned, so no single boundary resolves the whole structure",
  "the existing relation repeats at another scale and each repetition inherits error from the previous instance",
  "cause and visible effect are separated so the effect survives after its initiating condition has been removed",
  "the existing relation is inverted only after it has been satisfied once, leaving evidence of both regimes",
  "structure is conserved while ownership of that structure moves to a neighboring part, layer, or region",
] as const;

function rotate<T>(values: readonly T[], start: number): T[] {
  if (!values.length) return [];
  const offset = ((start % values.length) + values.length) % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

export function fallbackVisualConcept(
  label: string,
  output: VisualOutputKind,
  traits: readonly Trait[],
): VisualTransductionResult {
  const allowed = new Set(jurisdictionsForOutput(output));
  const candidates = activeTraits(traits).filter(
    (trait) =>
      allowed.has(trait.jurisdiction) &&
      !trait.locked &&
      trait.mutability > 0.08 &&
      trait.jurisdiction !== "subject_identity",
  );
  const seed = hash(label.toLowerCase());
  const ordered = rotate(
    [...candidates].sort((a, b) => b.mutability - a.mutability),
    seed,
  );
  const mechanisms = rotate(FALLBACK_MECHANISMS, seed >>> 8);
  const donations: Array<Record<string, unknown>> = [];

  for (let i = 0; i < Math.min(3, ordered.length); i++) {
    const trait = ordered[i]!;
    const mechanism = mechanisms[i % mechanisms.length]!;
    donations.push({
      jurisdiction: trait.jurisdiction,
      name: `${trait.jurisdiction.replace(/_/g, " ")} reassignment`,
      rule: mechanism,
      rewrite: `Rewrite the existing rule "${trait.rule.slice(0, 150)}" so ${mechanism}`,
      mass: 0.48,
    });
  }

  if (donations.length === 0) {
    const safe = output === "video" ? "temporal_topology" : "transformation_mechanism";
    donations.push({
      jurisdiction: safe,
      name: "structural proxy",
      rule: mechanisms[0],
      rewrite: mechanisms[1] ?? mechanisms[0],
      mass: 0.42,
    });
  }

  const failureSurfaces = failureSurfacesForOutput(output);
  const surface = failureSurfaces[seed % failureSurfaces.length];
  return normalizeVisualConcept(
    label,
    output,
    traits,
    {
      readings: ["low-confidence structural proxy used because semantic transduction was unavailable"],
      whatItDoes:
        "applies a deterministic structural proxy to existing mutable rules while preserving protected identity constraints",
      clicheForbidden: ["decorative theming", "literal iconography", "keyword collage"],
      donations,
      failureMode: surface?.failureSignature ?? "the proxy becomes decorative instead of structural",
      fracturePlane: donations[0]?.jurisdiction,
      mass: 0.46,
      features: defaultFeatures(label, output),
    },
    "fallback",
  );
}
