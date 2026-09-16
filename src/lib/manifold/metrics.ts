import type { Concept } from "./concepts";
import type { Features, MetricId, OrganismState } from "./types";

export type Vec2 = { x: number; y: number };
export type Vec3 = { x: number; y: number; z: number };

export function projectFeatures(f: Features, metric: MetricId): Vec2 {
  switch (metric) {
    case "SEMANTIC":
      return { x: f.semanticX, y: f.semanticY };
    case "FAILURE":
      return { x: f.failure * 2 - 1, y: f.energy * 2 - 1 };
    case "MEMORY":
      return { x: f.memory * 2 - 1, y: f.temporal * 2 - 1 };
    case "TEMPORAL":
      return { x: f.temporal * 2 - 1, y: f.structure * 2 - 1 };
    case "TOPOLOGICAL":
      return { x: f.topology * 2 - 1, y: f.structure * 2 - 1 };
  }
}

/** Depth axis is the feature the current ruler is not using as X/Y. */
export function altitudeOf(f: Features, metric: MetricId): number {
  switch (metric) {
    case "SEMANTIC":
      return f.structure * 2 - 1;
    case "FAILURE":
      return f.topology * 2 - 1;
    case "MEMORY":
      return f.energy * 2 - 1;
    case "TEMPORAL":
      return f.memory * 2 - 1;
    case "TOPOLOGICAL":
      return f.temporal * 2 - 1;
  }
}

export function projectFeatures3(f: Features, metric: MetricId): Vec3 {
  const p = projectFeatures(f, metric);
  return { x: p.x, y: p.y, z: altitudeOf(f, metric) * 0.42 };
}


export const METRICS: { id: MetricId; label: string; blurb: string }[] = [
  {
    id: "SEMANTIC",
    label: "Semantic",
    blurb: "Ordinary conceptual neighborhood. Related meanings sit near each other.",
  },
  {
    id: "FAILURE",
    label: "Failure",
    blurb: "Nearness by how things collapse. Shared breaking is adjacency.",
  },
  {
    id: "MEMORY",
    label: "Memory",
    blurb: "Nearness by recall behavior. What remembers like this, sits here.",
  },
  {
    id: "TEMPORAL",
    label: "Temporal",
    blurb: "Nearness by clocks, lag, debt, and return. Time-logic is the ruler.",
  },
  {
    id: "TOPOLOGICAL",
    label: "Topological",
    blurb: "Nearness by connectedness and packing. How parts attach, not what they mean.",
  },
];

export function dist(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpFeatures(a: Features, b: Features, t: number): Features {
  return {
    semanticX: lerp(a.semanticX, b.semanticX, t),
    semanticY: lerp(a.semanticY, b.semanticY, t),
    structure: lerp(a.structure, b.structure, t),
    failure: lerp(a.failure, b.failure, t),
    memory: lerp(a.memory, b.memory, t),
    temporal: lerp(a.temporal, b.temporal, t),
    topology: lerp(a.topology, b.topology, t),
    energy: lerp(a.energy, b.energy, t),
  };
}

export function addFeatures(a: Features, b: Features): Features {
  return {
    semanticX: a.semanticX + b.semanticX,
    semanticY: a.semanticY + b.semanticY,
    structure: a.structure + b.structure,
    failure: a.failure + b.failure,
    memory: a.memory + b.memory,
    temporal: a.temporal + b.temporal,
    topology: a.topology + b.topology,
    energy: a.energy + b.energy,
  };
}

export function scaleFeatures(a: Features, s: number): Features {
  return {
    semanticX: a.semanticX * s,
    semanticY: a.semanticY * s,
    structure: a.structure * s,
    failure: a.failure * s,
    memory: a.memory * s,
    temporal: a.temporal * s,
    topology: a.topology * s,
    energy: a.energy * s,
  };
}

export function subFeatures(a: Features, b: Features): Features {
  return addFeatures(a, scaleFeatures(b, -1));
}

export function clampFeatures(f: Features): Features {
  const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
  const clamp11 = (n: number) => Math.max(-1, Math.min(1, n));
  return {
    semanticX: clamp11(f.semanticX),
    semanticY: clamp11(f.semanticY),
    structure: clamp01(f.structure),
    failure: clamp01(f.failure),
    memory: clamp01(f.memory),
    temporal: clamp01(f.temporal),
    topology: clamp01(f.topology),
    energy: clamp01(f.energy),
  };
}

export function featureDistance(
  a: Features,
  b: Features,
  metric: MetricId,
): number {
  return dist(projectFeatures(a, metric), projectFeatures(b, metric));
}

export function neighborsOf(
  features: Features,
  concepts: Concept[],
  metric: MetricId,
  k = 5,
): { concept: Concept; d: number }[] {
  return concepts
    .map((c) => ({ concept: c, d: featureDistance(features, c.features, metric) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k);
}

/** Near under the active ruler, far under semantic — the useful weird neighbor. */
export function wtfNeighbor(
  state: OrganismState,
  concepts: Concept[],
  metric: MetricId,
): Concept | undefined {
  const near = neighborsOf(state.features, concepts, metric, 6);
  if (metric === "SEMANTIC") {
    return near.find((n) => n.d > 0.15)?.concept ?? near[1]?.concept;
  }
  let best: { concept: Concept; score: number } | undefined;
  for (const n of near.slice(0, 5)) {
    const semantic = featureDistance(state.features, n.concept.features, "SEMANTIC");
    const score = semantic - n.d;
    if (!best || score > best.score) best = { concept: n.concept, score };
  }
  return best?.concept;
}

export function geodesicWaypoints(
  from: Features,
  dest: Concept,
  concepts: Concept[],
  metric: MetricId,
  count = 1,
): Concept[] {
  const start = projectFeatures(from, metric);
  const end = projectFeatures(dest.features, metric);
  const picked: Concept[] = [];
  const used = new Set([dest.id]);
  for (let i = 0; i < count; i++) {
    const t = (i + 1) / (count + 1);
    const probe = { x: lerp(start.x, end.x, t), y: lerp(start.y, end.y, t) };
    let best: Concept | undefined;
    let bestD = Infinity;
    for (const c of concepts) {
      if (used.has(c.id)) continue;
      const p = projectFeatures(c.features, metric);
      const d = dist(p, probe);
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    }
    if (best) {
      picked.push(best);
      used.add(best.id);
    }
  }
  return picked;
}
