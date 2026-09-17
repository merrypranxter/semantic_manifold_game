import type { Trait } from "../manifold/types.ts";
import type { VisualOutputKind } from "./visual-schema.ts";

export type SanitizedVisualTraitInput = Pick<
  Trait,
  | "name"
  | "rule"
  | "jurisdiction"
  | "strength"
  | "mutability"
  | "locked"
  | "lost"
  | "suppressed"
>;

export type SanitizedVisualMindInput = {
  id: string;
  full: string;
  transduce: string;
  procedure: string[];
};

export type SanitizedVisualTransductionInput = {
  label: string;
  output: VisualOutputKind;
  organismName: string;
  organismIdentity: string;
  traits: SanitizedVisualTraitInput[];
  invariants: string[];
  mind?: SanitizedVisualMindInput;
};

function text(value: unknown, max: number, collapse = true): string {
  const raw = String(value ?? "").trim();
  const normalized = collapse ? raw.replace(/\s+/g, " ") : raw;
  return normalized.slice(0, max);
}

function clamp01(value: unknown, fallback = 0): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(1, n));
}

function stringList(value: unknown, limit: number, maxLength: number): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value.slice(0, limit)) {
    const normalized = text(item, maxLength);
    if (normalized) out.push(normalized);
  }
  return out;
}

function traits(value: unknown): SanitizedVisualTraitInput[] {
  if (!Array.isArray(value)) return [];
  const out: SanitizedVisualTraitInput[] = [];
  for (const item of value.slice(0, 18)) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    out.push({
      name: text(row.name, 80),
      rule: text(row.rule, 360),
      jurisdiction: text(row.jurisdiction, 80),
      strength: clamp01(row.strength, 0.5),
      mutability: clamp01(row.mutability, 0.5),
      locked: Boolean(row.locked),
      lost: Boolean(row.lost),
      suppressed: Boolean(row.suppressed),
    });
  }
  return out;
}

function mind(value: unknown): SanitizedVisualMindInput | undefined {
  if (!value || typeof value !== "object") return undefined;
  const row = value as Record<string, unknown>;
  const id = text(row.id, 80);
  if (!id) return undefined;
  return {
    id,
    full: text(row.full, 240),
    transduce: text(row.transduce, 900),
    procedure: stringList(row.procedure, 4, 240),
  };
}

export function sanitizeVisualTransductionInput(
  input: unknown,
): SanitizedVisualTransductionInput {
  const row = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  return {
    label: text(row.label, 120),
    output: row.output === "video" ? "video" : "image",
    organismName: text(row.organismName, 100),
    organismIdentity: text(row.organismIdentity, 360),
    traits: traits(row.traits),
    invariants: stringList(row.invariants, 8, 240),
    mind: mind(row.mind),
  };
}
