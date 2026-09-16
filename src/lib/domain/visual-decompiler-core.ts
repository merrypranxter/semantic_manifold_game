import { uid } from "../manifold/ids.ts";
import type {
  Features,
  Invariant,
  OrganismState,
  Trait,
} from "../manifold/types.ts";
import {
  createVisualSpecimen,
  jurisdictionsForOutput,
  type VisualClauseRole,
  type VisualOutputKind,
  type VisualSpecimen,
  type VisualSpecimenClause,
} from "./visual-schema.ts";

const ROLES = new Set<VisualClauseRole>([
  "anchor",
  "mechanism",
  "constraint",
  "rendering",
  "temporal_law",
  "negative_constraint",
]);

export type VisualDecompilation = {
  specimen: VisualSpecimen;
  identity: string;
  features: Features;
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

function uniqText(values: unknown, limit = 12): string[] {
  if (!Array.isArray(values)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    const text = String(value ?? "")
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 240);
    const key = text.toLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    out.push(text);
    if (out.length >= limit) break;
  }
  return out;
}

function roleOf(value: unknown): VisualClauseRole {
  const role = String(value ?? "constraint") as VisualClauseRole;
  return ROLES.has(role) ? role : "constraint";
}

function deriveFeatures(specimen: VisualSpecimen, raw: unknown): Features {
  const f = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const ids = new Set(specimen.clauses.map((c) => c.jurisdiction));
  const topologyBase =
    ids.has("topology") || ids.has("boundary") || ids.has("temporal_topology")
      ? 0.72
      : 0.35;
  const temporalBase = specimen.output === "video" ? 0.55 : 0.16;
  const failureBase =
    specimen.clauses.length >= 8
      ? 0.56
      : specimen.clauses.length >= 4
        ? 0.42
        : 0.3;
  const structureBase = Math.min(0.82, 0.38 + specimen.clauses.length * 0.045);

  return {
    semanticX: clamp11(f.semanticX, 0),
    semanticY: clamp11(
      f.semanticY,
      ids.has("transformation_mechanism") ? 0.28 : 0,
    ),
    structure: clamp01(f.structure, structureBase),
    failure: clamp01(f.failure, failureBase),
    memory: clamp01(f.memory, specimen.identityAnchors.length ? 0.42 : 0.25),
    temporal: clamp01(f.temporal, temporalBase),
    topology: clamp01(f.topology, topologyBase),
    energy: clamp01(
      f.energy,
      ids.has("transformation_mechanism") ? 0.58 : 0.38,
    ),
  };
}

export function normalizeVisualDecompilation(
  rawPrompt: string,
  output: VisualOutputKind,
  payload: unknown,
  source: "ai" | "fallback" = "ai",
): VisualDecompilation {
  const base = createVisualSpecimen(rawPrompt, output);
  const allowed = new Set(jurisdictionsForOutput(output));
  const row =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};
  const clausesRaw = Array.isArray(row.clauses) ? row.clauses : [];
  const clauses: VisualSpecimenClause[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();

  for (const value of clausesRaw.slice(0, 18)) {
    if (!value || typeof value !== "object") continue;
    const c = value as Record<string, unknown>;
    const jurisdiction = String(c.jurisdiction ?? "").trim();
    const text = String(c.text ?? c.rule ?? "")
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 360);
    if (!text || !jurisdiction) continue;
    if (!allowed.has(jurisdiction)) {
      warnings.push(
        `Dropped clause outside ${output} jurisdiction set: ${jurisdiction}`,
      );
      continue;
    }
    const key = `${jurisdiction}:${text.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    clauses.push({
      text,
      jurisdiction,
      role: roleOf(c.role),
      confidence: clamp01(c.confidence, 0.72),
      mutability: clamp01(
        c.mutability,
        c.role === "anchor" ? 0.18 : 0.62,
      ),
    });
  }

  const specimen: VisualSpecimen = {
    ...base,
    clauses,
    identityAnchors: uniqText(row.identityAnchors, 10),
    explicitInvariants: uniqText(row.explicitInvariants, 10),
    decompiled: true,
  };

  if (clauses.length === 0) {
    warnings.push("Decompiler returned no usable operational clauses.");
  }

  const identity =
    String(row.identity ?? "")
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 360) ||
    specimen.identityAnchors[0] ||
    "a visual prompt specimen whose existing subject and operational rules must remain traceable through mutation";

  return {
    specimen,
    identity,
    features: deriveFeatures(specimen, row.features),
    warnings,
    source,
  };
}

function traitName(clause: VisualSpecimenClause, index: number): string {
  const words = clause.text
    .replace(/[.,;:!?]+/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6)
    .join(" ");
  return words || `${clause.jurisdiction.replace(/_/g, " ")} rule ${index + 1}`;
}

export function visualSpecimenToOrigin(
  decompiled: VisualDecompilation,
): OrganismState {
  const { specimen } = decompiled;
  const traits: Trait[] = specimen.clauses.map((clause, index) => {
    const anchor = clause.role === "anchor";
    const negative = clause.role === "negative_constraint";
    return {
      id: uid("tr"),
      name: traitName(clause, index),
      rule: clause.text,
      jurisdiction: clause.jurisdiction,
      strength: Math.max(
        0.25,
        Math.min(0.96, 0.38 + clause.confidence * 0.5 + (anchor ? 0.08 : 0)),
      ),
      confidence: clause.confidence,
      persistence: anchor
        ? 0.95
        : negative
          ? 0.86
          : Math.max(0.42, 0.82 - clause.mutability * 0.32),
      mutability: clause.mutability,
      source: "ORIGIN",
      recency: 0,
      locked: anchor && clause.mutability <= 0.08,
    };
  });

  const invariants: Invariant[] = specimen.explicitInvariants.map((text) => ({
    id: uid("inv"),
    text,
    level: "ABSOLUTE",
  }));

  const anchorSummary = specimen.identityAnchors.length
    ? ` Identity anchors: ${specimen.identityAnchors.join("; ")}.`
    : "";

  return {
    id: uid("st"),
    version: 0,
    name: specimen.output === "video" ? "Video Prompt Specimen" : "Image Prompt Specimen",
    identity: decompiled.identity,
    playProjection: `Generation zero from a pasted ${specimen.output} prompt. ${traits.length} operational rules are available for mutation.${anchorSummary}`,
    labProjection: `Prompt decompiled into ${traits.length} traits, ${invariants.length} explicit invariants, and ${specimen.identityAnchors.length} identity anchors. Source=${decompiled.source}. The raw prompt remains preserved in provenance.`,
    features: decompiled.features,
    traits,
    invariants,
    scars: [],
    relationships: [],
    memories: [],
    interpretations: [],
    debris: [],
    ancestry: [],
    uncertainty: decompiled.source === "ai" ? 0.18 : 0.42,
    createdAt: Date.now(),
    installedMind: null,
    mindHistory: [],
    retiredMetrics: [],
    provenance: {
      source: "prompt",
      domain: "visual",
      outputKind: specimen.output,
      raw: specimen.rawPrompt,
    },
  };
}

type FallbackRule = {
  jurisdiction: string;
  pattern: RegExp;
  role?: VisualClauseRole;
  mutability?: number;
};

const FALLBACK_RULES: FallbackRule[] = [
  {
    jurisdiction: "subject_identity",
    pattern:
      /\b(preserve|same|identity|recognizable|likeness|unchanged|exact(?:ly)?)\b/i,
    role: "anchor",
    mutability: 0.12,
  },
  {
    jurisdiction: "camera",
    pattern:
      /\b(camera|close[- ]?up|wide shot|lens|framing|static shot|angle|depth of field)\b/i,
    role: "rendering",
  },
  {
    jurisdiction: "topology",
    pattern:
      /\b(topolog|möbius|mobius|klein|non[- ]?orientable|loop|hole|inside[- ]?out)\b/i,
    role: "mechanism",
  },
  {
    jurisdiction: "material",
    pattern:
      /\b(latex|silicone|foam|glass|metal|chrome|plastic|flesh|gel|liquid|viscous|rubber|ceramic)\b/i,
    role: "constraint",
  },
  {
    jurisdiction: "degradation",
    pattern:
      /\b(vhs|betacam|scanline|tracking|compression|artifact|grain|telecine|tape|generation loss|chroma)\b/i,
    role: "rendering",
  },
  {
    jurisdiction: "rendering_medium",
    pattern:
      /\b(photo|photograph|film|puppet|practical effect|cgi|render|illustration|painting|animation)\b/i,
    role: "rendering",
  },
  {
    jurisdiction: "anatomy",
    pattern:
      /\b(face|eye|mouth|skin|limb|hand|body|anatom|teeth|tongue|bone|organ)\b/i,
  },
  {
    jurisdiction: "biological_process",
    pattern:
      /\b(grow|heal|secrete|morphogenesis|decay|rot|bloom|fold|split|shed|molting|moult)\b/i,
    role: "mechanism",
  },
  {
    jurisdiction: "color",
    pattern:
      /\b(neon|palette|cyan|magenta|pink|violet|lime|orange|cobalt|iridescent|holographic|color)\b/i,
    role: "rendering",
  },
  {
    jurisdiction: "transformation_mechanism",
    pattern:
      /\b(transform|become|emerge|phase|mutate|morph|translate|governed by|rewrites?)\b/i,
    role: "mechanism",
  },
  {
    jurisdiction: "motion",
    pattern: /\b(move|motion|trajectory|drift|spin|crawl|walk|run|flow)\b/i,
    role: "temporal_law",
  },
  {
    jurisdiction: "temporal_identity",
    pattern:
      /\b(across frames|between frames|through time|remains itself|same subject)\b/i,
    role: "temporal_law",
  },
  {
    jurisdiction: "frame_correspondence",
    pattern:
      /\b(frame[- ]?to[- ]?frame|correspondence|each frame|successive frames)\b/i,
    role: "temporal_law",
  },
  {
    jurisdiction: "time_direction",
    pattern:
      /\b(reverse|rewind|cyclic time|time loop|backward|forwards? in time)\b/i,
    role: "temporal_law",
  },
];

function splitPrompt(prompt: string): string[] {
  return prompt
    .split(/(?:[\n;]+|(?<=[.!?])\s+)/)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function fallbackVisualDecompilation(
  rawPrompt: string,
  output: VisualOutputKind,
): VisualDecompilation {
  const allowed = new Set(jurisdictionsForOutput(output));
  const clauses: Array<Record<string, unknown>> = [];
  const anchors: string[] = [];

  for (const segment of splitPrompt(rawPrompt)) {
    for (const rule of FALLBACK_RULES) {
      if (!allowed.has(rule.jurisdiction) || !rule.pattern.test(segment)) continue;
      clauses.push({
        text: segment,
        jurisdiction: rule.jurisdiction,
        role: rule.role ?? "constraint",
        confidence: 0.58,
        mutability: rule.mutability ?? 0.62,
      });
      if (rule.role === "anchor") {
        anchors.push(segment.replace(/[.!?]+$/g, ""));
      }
    }
  }

  if (clauses.length === 0) {
    clauses.push({
      text: rawPrompt.trim(),
      jurisdiction: "composition",
      role: "constraint",
      confidence: 0.35,
      mutability: 0.75,
    });
  }

  const invariants = anchors.filter((anchor) =>
    /\b(preserve|unchanged|exact(?:ly)?|same)\b/i.test(anchor),
  );
  const identity = anchors[0]
    ? `the visual subject constrained by: ${anchors[0]}`
    : "a visual prompt specimen whose source rules remain traceable through mutation";

  return normalizeVisualDecompilation(
    rawPrompt,
    output,
    {
      identity,
      clauses,
      identityAnchors: anchors,
      explicitInvariants: invariants,
    },
    "fallback",
  );
}
