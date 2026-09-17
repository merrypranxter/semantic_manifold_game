import type { OrganismState, Trait } from "../manifold/types.ts";
import type { VisualDecompilation } from "./visual-decompiler-core.ts";
import type { VisualOutputKind } from "./visual-schema.ts";
import type { VisualTransductionResult } from "./visual-transducer-core.ts";

export const VISUAL_AI_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const VISUAL_DECOMPILE_CACHE_LIMIT = 16;
export const VISUAL_TRANSDUCTION_CACHE_LIMIT = 64;

export type VisualDecompileCacheEntry = {
  cachedAt: number;
  decompiled: VisualDecompilation;
};

export type VisualTransductionCacheEntry = {
  cachedAt: number;
  result: VisualTransductionResult;
};

const DECOMPILE_CACHE_VERSION = "visual-decompile-v1";
const TRANSDUCTION_CACHE_VERSION = "visual-transduction-v1";

function hash(text: string): string {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36).padStart(7, "0");
}

function normalizedLabel(label: string): string {
  return label.trim().replace(/\s+/g, " ").toLowerCase();
}

function activeTraitSignature(trait: Trait): string | null {
  if (trait.lost || trait.suppressed) return null;
  return [
    String(trait.jurisdiction),
    trait.name.trim(),
    trait.rule.trim(),
    trait.mutability.toFixed(3),
    trait.strength.toFixed(3),
    trait.locked ? "locked" : "open",
  ].join("|");
}

function operationalStateSignature(state: OrganismState): string {
  const traits = state.traits
    .map(activeTraitSignature)
    .filter((row): row is string => Boolean(row))
    .sort();
  const invariants = state.invariants
    .map((row) => `${row.level}|${row.text.trim()}`)
    .sort();

  return [
    state.name.trim(),
    state.identity.trim(),
    traits.join("\n"),
    invariants.join("\n"),
  ].join("\n---\n");
}

/**
 * Exact source-prompt cache key after the same outer trim used by ingestion.
 * The raw prompt never appears in the persisted key.
 */
export function visualDecompileCacheKey(
  rawPrompt: string,
  output: VisualOutputKind,
): string {
  const normalized = rawPrompt.trim();
  return `${DECOMPILE_CACHE_VERSION}:${output}:${normalized.length}:${hash(normalized)}`;
}

/**
 * Transduction is organism-specific. The key intentionally ignores random state
 * ids/timestamps and follows only the operational state sent to the transducer.
 */
export function visualTransductionCacheKey(
  label: string,
  state: OrganismState,
  output: VisualOutputKind,
  mindId: string | null | undefined,
): string {
  const concept = normalizedLabel(label);
  const stateSignature = operationalStateSignature(state);
  const mind = mindId?.trim() || "none";
  const body = `${concept}\n${output}\n${mind}\n${stateSignature}`;
  return `${TRANSDUCTION_CACHE_VERSION}:${output}:${hash(concept)}:${hash(body)}`;
}

/**
 * Fallbacks are deterministic and free. Persisting them would be actively bad:
 * a temporary API outage could prevent a later session from recovering a richer
 * semantic reading. Only successful AI readings enter the long-lived cache.
 */
export function cacheableVisualSource(source: "ai" | "fallback"): boolean {
  return source === "ai";
}

export function pruneVisualCache<T extends { cachedAt: number }>(
  cache: Record<string, T>,
  now = Date.now(),
  maxAgeMs = VISUAL_AI_CACHE_TTL_MS,
  maxEntries = VISUAL_TRANSDUCTION_CACHE_LIMIT,
): Record<string, T> {
  const fresh = Object.entries(cache)
    .filter(([, entry]) => {
      const at = Number(entry?.cachedAt);
      return Number.isFinite(at) && at <= now && now - at <= maxAgeMs;
    })
    .sort((a, b) => b[1].cachedAt - a[1].cachedAt)
    .slice(0, Math.max(0, maxEntries));
  return Object.fromEntries(fresh);
}

export function freshVisualCacheEntry<T extends { cachedAt: number }>(
  cache: Record<string, T>,
  key: string,
  now = Date.now(),
  maxAgeMs = VISUAL_AI_CACHE_TTL_MS,
): T | undefined {
  const entry = cache[key];
  if (!entry) return undefined;
  const at = Number(entry.cachedAt);
  if (!Number.isFinite(at) || at > now || now - at > maxAgeMs) return undefined;
  return entry;
}
