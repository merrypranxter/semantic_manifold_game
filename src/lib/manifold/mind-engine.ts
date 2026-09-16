import type { Concept } from "./concepts";
import { uid } from "./ids";
import { getMind, type MindDef } from "./minds";
import {
  clampFeatures,
  neighborsOf,
  wtfNeighbor,
} from "./metrics";
import type {
  Delta,
  DeltaOp,
  Features,
  MetricId,
  OperatorId,
  OrganismState,
  Scar,
  Trait,
} from "./types";

export type MindRun = {
  state: OrganismState;
  target: Concept;
  extra: Concept[];
  metric: MetricId;
  operator: OperatorId;
  waypoint?: Concept;
  mind: MindDef;
  priorMinds: string[];
  retiredMetrics: MetricId[];
};

const METRIC_CYCLE: MetricId[] = ["FAILURE", "MEMORY", "TEMPORAL", "TOPOLOGICAL", "SEMANTIC"];

export function prepareMind(run: MindRun): {
  operator: OperatorId;
  metric: MetricId;
  waypoint?: Concept;
  retireAfter?: MetricId;
} {
  const { mind, operator, metric, target, extra, state, retiredMetrics } = run;
  let nextOp = operator;
  let nextMetric = metric;
  let waypoint = run.waypoint;
  let retireAfter: MetricId | undefined;

  if (mind.id === "taboo" && operator === "DIRECT" && !waypoint) {
    const n = neighborsOf(state.features, extra.filter((c) => c.id !== target.id), metric, 4);
    const pick = n.find((x) => x.concept.id !== target.id)?.concept;
    if (pick) {
      nextOp = "VIA";
      waypoint = pick;
    }
  }

  if (mind.id === "alien-ruler") {
    const avail = METRIC_CYCLE.filter((m) => m !== metric && !retiredMetrics.includes(m));
    nextMetric = avail[0] ?? METRIC_CYCLE.find((m) => m !== metric) ?? "FAILURE";
    retireAfter = nextMetric;
  }

  if (mind.id === "shear" && !waypoint) {
    const wtf = wtfNeighbor(state, extra, nextMetric);
    if (wtf && wtf.id !== target.id) waypoint = wtf;
  }

  return { operator: nextOp, metric: nextMetric, waypoint, retireAfter };
}

function live(state: OrganismState): Trait[] {
  return state.traits.filter((t) => !t.lost && !t.suppressed);
}

function quantize(f: Features): Features {
  const q = (n: number) => Math.round(n * 2) / 2;
  const q11 = (n: number) => Math.round(n * 2) / 2;
  return {
    semanticX: q11(f.semanticX),
    semanticY: q11(f.semanticY),
    structure: q(f.structure),
    failure: q(f.failure),
    memory: q(f.memory),
    temporal: q(f.temporal),
    topology: q(f.topology),
    energy: q(f.energy),
  };
}

function featDist(a: Features, b: Features): number {
  const keys: (keyof Features)[] = [
    "semanticX",
    "semanticY",
    "structure",
    "failure",
    "memory",
    "temporal",
    "topology",
    "energy",
  ];
  let s = 0;
  for (const k of keys) s += (a[k] - b[k]) ** 2;
  return Math.sqrt(s);
}

function appendLab(delta: Delta, note: string) {
  delta.lab = `${delta.lab} · MIND ${note}`;
  delta.mindNote = note;
}

function scarMind(delta: Delta, mind: MindDef, description: string) {
  const scar: Scar = {
    id: uid("scar"),
    cause: `Installed mind: ${mind.label}`,
    operator: delta.operator,
    sourceConceptId: delta.targetId,
    description,
    lostTraitNames: [],
    survivorTraitNames: [],
    debris: [],
  };
  delta.ops.push({ kind: "SCAR", scar });
}

function dropAdds(ops: DeltaOp[]): DeltaOp[] {
  return ops.filter((o) => o.kind !== "ADD");
}

export function finishMind(delta: Delta, run: MindRun): Delta {
  const { mind, state, target, extra, metric } = run;
  delta.mindId = mind.id;
  const ops = delta.ops;
  const traits = live(state);

  switch (mind.id) {
    case "ownership": {
      const host = traits.find((t) => t.source === "ORIGIN") ?? traits[0];
      const donation = target.donations[0];
      if (host && donation) {
        ops.push({
          kind: "MUTATE",
          traitId: host.id,
          name: host.name,
          rule: `${donation.rule} — rebound onto ${host.name}, which is not the conventional owner`,
          source: "MIND",
        });
        appendLab(delta, `rebound ${donation.name} onto ${host.name}`);
      }
      break;
    }
    case "axiom": {
      const d = target.donations[0];
      if (d) {
        const victim =
          traits.find((t) => t.jurisdiction === d.jurisdiction) ??
          traits.find((t) => t.source === "ORIGIN");
        if (victim) {
          ops.push({
            kind: "MUTATE",
            traitId: victim.id,
            rule: `the enabling assumption (${d.rule}) is false; its negation is the only remaining mechanism`,
            source: "MIND",
          });
        }
        const feat = ops.find((o) => o.kind === "FEATURES");
        if (feat && feat.kind === "FEATURES") {
          feat.features = clampFeatures({ ...feat.features, failure: Math.min(1, feat.features.failure + 0.2) });
        }
        appendLab(delta, "enabling axiom negated; ¬A does the work");
      }
      break;
    }
    case "shadow": {
      const wtf = wtfNeighbor(state, extra, metric);
      const donor = wtf && wtf.id !== target.id ? wtf : extra.find((c) => c.family && c.family !== target.family);
      if (donor?.donations[0]) {
        const host = traits[0];
        if (host) {
          ops.push({
            kind: "MUTATE",
            traitId: host.id,
            rule: donor.donations[0].rule,
            source: "MIND",
          });
        }
        appendLab(delta, `shadow ${donor.label} governed instead of ${target.label}`);
      }
      break;
    }
    case "substrate": {
      const foreign = extra.find(
        (c) => c.family && c.family !== target.family && c.seeded,
      ) ?? extra.find((c) => c.id !== target.id && c.seeded);
      if (foreign?.donations[0] && traits[0]) {
        ops.push({
          kind: "MUTATE",
          traitId: traits[0].id,
          rule: foreign.donations[0].rule,
          source: "MIND",
        });
        appendLab(delta, `solved in ${foreign.family ?? foreign.label} rules; imagery stripped`);
      }
      delta.ops = ops.map((o) => {
        if (o.kind === "RENAME") {
          return { ...o, play: o.play.replace(new RegExp(target.label, "ig"), "the compressed machine") };
        }
        return o;
      });
      break;
    }
    case "taxonomy": {
      if (traits[0]) {
        ops.push({
          kind: "MUTATE",
          traitId: traits[0].id,
          rule: `operate as if this classification were exact: ${target.failureMode}`,
          source: "MIND",
        });
        appendLab(delta, "near-miss classification frozen as ontology");
      }
      break;
    }
    case "vacuum": {
      const primitive = traits.find((t) => t.jurisdiction === target.fracturePlane) ?? traits.find((t) => t.source === "ORIGIN");
      if (primitive) {
        ops.push({ kind: "SUPPRESS", traitId: primitive.id });
        scarMind(
          delta,
          mind,
          `${primitive.name} was deleted without replacement. Nothing may perform its former function.`,
        );
        appendLab(delta, `deleted primitive ${primitive.name}; vacancy held`);
      }
      break;
    }
    case "teleology": {
      const feat = ops.find((o) => o.kind === "FEATURES");
      if (feat && feat.kind === "FEATURES") {
        feat.features = clampFeatures({
          ...target.features,
          memory: Math.min(1, target.features.memory + 0.15),
        });
        feat.delta = {
          semanticX: feat.features.semanticX - state.features.semanticX,
          semanticY: feat.features.semanticY - state.features.semanticY,
          structure: feat.features.structure - state.features.structure,
          failure: feat.features.failure - state.features.failure,
          memory: feat.features.memory - state.features.memory,
          temporal: feat.features.temporal - state.features.temporal,
          topology: feat.features.topology - state.features.topology,
          energy: feat.features.energy - state.features.energy,
        };
      }
      appendLab(delta, "present selected as ancestor of a fixed terminal");
      break;
    }
    case "kinetic": {
      delta.ops = dropAdds(ops);
      for (const t of traits.slice(0, 2)) {
        delta.ops.push({
          kind: "MUTATE",
          traitId: t.id,
          rule: `${t.rule} — rate, permeability, or decay changed; no new object introduced`,
          strength: Math.max(0.2, t.strength - 0.08),
          source: "MIND",
        });
      }
      appendLab(delta, "zero-mass: rates only, adds discarded");
      break;
    }
    case "omission": {
      delta.ops = dropAdds(ops).filter((o) => o.kind !== "INTERPRET");
      const others = extra.filter((c) => c.id !== target.id && c.family !== target.family);
      const picked: Concept[] = [];
      const usedFam = new Set<string>();
      for (const c of others) {
        const fam = c.family ?? c.fracturePlane;
        if (usedFam.has(fam)) continue;
        usedFam.add(fam);
        picked.push(c);
        if (picked.length >= 3) break;
      }
      for (const c of picked) {
        const d = c.donations[0];
        if (!d || !traits[0]) continue;
        delta.ops.push({
          kind: "MUTATE",
          traitId: traits[0].id,
          rule: d.rule,
          source: "MIND",
        });
      }
      appendLab(delta, `triangulated via ${picked.map((p) => p.label).join(", ") || "empty field"}; target unnamed`);
      break;
    }
    case "circuit": {
      const last = [...traits].sort((a, b) => b.recency - a.recency)[0];
      if (last) {
        delta.ops.push({
          kind: "MUTATE",
          traitId: last.id,
          rule: `${last.rule} — the relational premise that made this response locally sensible has been punctuated`,
          source: "MIND",
        });
        delta.ops.push({
          kind: "RELATE",
          relationship: {
            id: uid("rel"),
            from: last.id,
            to: target.id,
            kind: "DESTABILIZES",
          },
        });
        appendLab(delta, `circuit closed through ${last.name}; premise shifted`);
      }
      break;
    }
    case "decompile": {
      const root = traits.find((t) => t.source === "ORIGIN") ?? traits[0];
      const replacement = target.donations[0];
      if (root && replacement) {
        for (const t of traits) {
          delta.ops.push({
            kind: "MUTATE",
            traitId: t.id,
            rule: `${t.rule} — recompiled under new primitive: ${replacement.rule}`,
            source: "MIND",
          });
        }
        appendLab(delta, `primitive replaced; ${traits.length} dependents recompiled`);
      }
      break;
    }
    case "contagion": {
      delta.ops = ops.map((o) => {
        if (o.kind === "ADD") {
          return { ...o, trait: { ...o.trait, source: "MIND" as const, persistence: Math.min(1, o.trait.persistence + 0.15) } };
        }
        return o;
      });
      const native = traits.find((t) => t.jurisdiction === target.fracturePlane);
      if (native) {
        delta.ops.push({ kind: "SUPPRESS", traitId: native.id });
        appendLab(delta, `host repair (${native.name}) suppressed; foreign lifecycle in charge`);
      } else {
        appendLab(delta, "foreign lifecycle assigned host roles");
      }
      break;
    }
    case "oneiric": {
      const host = traits.find((t) => t.jurisdiction !== target.fracturePlane) ?? traits[0];
      if (host) {
        delta.ops.push({
          kind: "MUTATE",
          traitId: host.id,
          name: `${host.name} is ${target.label}`,
          rule: `${host.rule}. Also: ${target.donations[0]?.rule ?? target.whatItDoes}. The identity is literal.`,
          source: "MIND",
        });
        scarMind(delta, mind, `${host.name} is ${target.label}. History was revised only where that identity forced it.`);
        appendLab(delta, `literal identity ${host.name} = ${target.label}`);
      }
      break;
    }
    case "shear": {
      const wtf = wtfNeighbor(state, extra, metric);
      if (wtf?.donations[0] && traits[0]) {
        delta.ops.push({
          kind: "MUTATE",
          traitId: traits[0].id,
          rule: wtf.donations[0].rule,
          source: "MIND",
        });
        if (target.donations[1] && traits[1]) {
          delta.ops.push({
            kind: "MUTATE",
            traitId: traits[1].id,
            rule: `${traits[1].rule} — held as resistance against the sovereign minority reading, not averaged with it`,
            source: "MIND",
          });
        }
        appendLab(delta, `minority ${wtf.label} sovereign; ${target.label} is constraint`);
      }
      break;
    }
    case "alien-ruler": {
      appendLab(delta, `nearness under ${run.metric}; semantic resemblance ignored`);
      break;
    }
    case "lesion": {
      const adds = ops.filter((o) => o.kind === "ADD");
      delta.ops = dropAdds(ops);
      if (adds.length && traits[0] && adds[0].kind === "ADD") {
        delta.ops.push({
          kind: "MUTATE",
          traitId: traits[0].id,
          rule: `${traits[0].rule} — prosthesis for a missing add-operation: ${adds[0].trait.rule}`,
          source: "MIND",
        });
      }
      appendLab(delta, "add-operation lesioned; prosthesis built from existing tissue");
      break;
    }
    case "umwelt": {
      const feat = ops.find((o) => o.kind === "FEATURES");
      if (feat && feat.kind === "FEATURES") {
        feat.features = clampFeatures({
          ...feat.features,
          topology: Math.min(1, feat.features.topology + 0.18),
          energy: Math.min(1, feat.features.energy + 0.12),
        });
      }
      delta.ops.push({
        kind: "ADD",
        trait: {
          id: uid("tr"),
          name: "synthetic transducer",
          rule: "an installed detector converts an abstract property into pressure; reflexes to that pressure choose what may act",
          jurisdiction: "spatial",
          strength: 0.5,
          confidence: 0.6,
          persistence: 0.45,
          mutability: 0.55,
          source: "MIND",
          sourceConceptId: target.id,
          recency: state.version + 1,
        },
      });
      appendLab(delta, "synthetic sense installed; salience rerouted");
      break;
    }
    case "valence": {
      const protect = [...traits].sort((a, b) => b.strength - a.strength)[0];
      const reject = [...traits].sort((a, b) => a.strength - b.strength)[0];
      if (protect) {
        delta.ops.push({
          kind: "MUTATE",
          traitId: protect.id,
          rule: `${protect.rule} — protected by an invented affect triggered by ${target.fracturePlane} structure`,
          strength: Math.min(1, protect.strength + 0.12),
          source: "MIND",
        });
      }
      if (reject && reject.id !== protect?.id) {
        delta.ops.push({ kind: "SUPPRESS", traitId: reject.id });
      }
      appendLab(delta, "alien affect protected one trait and rejected another");
      break;
    }
    case "lossy": {
      const feat = ops.find((o) => o.kind === "FEATURES");
      if (feat && feat.kind === "FEATURES") {
        feat.features = clampFeatures(quantize(feat.features));
      }
      const qTarget = quantize(target.features);
      let alias: Concept | undefined;
      let best = Infinity;
      for (const c of extra) {
        if (c.id === target.id) continue;
        const d = featDist(quantize(c.features), qTarget);
        const sem = Math.hypot(
          c.features.semanticX - target.features.semanticX,
          c.features.semanticY - target.features.semanticY,
        );
        if (d < 0.55 && sem > 0.6 && d < best) {
          best = d;
          alias = c;
        }
      }
      if (alias?.donations[0] && traits[0]) {
        delta.ops.push({
          kind: "MUTATE",
          traitId: traits[0].id,
          rule: `${alias.donations[0].rule} — artifact of aliasing under a damaged encoding; discarded dimensions stay discarded`,
          source: "MIND",
        });
        appendLab(delta, `aliased with ${alias.label}; resolution not restored`);
      } else {
        appendLab(delta, "features quantized; no distant alias found");
      }
      break;
    }
    case "taboo": {
      delta.ops = ops.map((o) => {
        if (o.kind === "ADD") {
          return { ...o, trait: { ...o.trait, source: "ROUTE_OPERATOR" as const } };
        }
        return o;
      });
      appendLab(delta, "direct mechanism forbidden; destination is aftermath of the via");
      break;
    }
    case "desire": {
      const ranked = [...target.donations].sort((a, b) => {
        const ja = a.jurisdiction === "form" || a.jurisdiction === "structure" ? 0 : 1;
        const jb = b.jurisdiction === "form" || b.jurisdiction === "structure" ? 0 : 1;
        return ja - jb;
      });
      const preferred = ranked[ranked.length - 1];
      if (preferred && traits[0]) {
        delta.ops.push({
          kind: "MUTATE",
          traitId: traits[0].id,
          rule: preferred.rule,
          source: "MIND",
        });
        appendLab(delta, `alien U selected ${preferred.name} over the elegant donation`);
      }
      break;
    }
    case "progeny": {
      delta.ops.push({
        kind: "ADD",
        trait: {
          id: uid("tr"),
          name: "unfinished seed",
          rule: "a high-mutability law left unresolved so later travel has territory to occupy",
          jurisdiction: "form",
          strength: 0.35,
          confidence: 0.5,
          persistence: 0.7,
          mutability: 0.92,
          source: "MIND",
          sourceConceptId: target.id,
          recency: state.version + 1,
        },
      });
      const feat = ops.find((o) => o.kind === "FEATURES");
      if (feat && feat.kind === "FEATURES") {
        feat.features = clampFeatures({
          ...feat.features,
          structure: feat.features.structure * 0.85,
        });
      }
      appendLab(delta, "weaker present seed; high future mutability");
      break;
    }
    case "recall": {
      const recalled = [...traits].sort((a, b) => b.recency - a.recency)[0];
      if (recalled) {
        delta.ops.push({
          kind: "MUTATE",
          traitId: recalled.id,
          rule: `${recalled.rule} — reconstructed under ${target.label} pressure; the pristine version is no longer what is remembered`,
          source: "RECALL",
        });
        appendLab(delta, `${recalled.name} recalled as a scarred descendant`);
      }
      break;
    }
    case "crystallize": {
      const examined = [...traits].sort((a, b) => b.strength - a.strength)[0];
      if (examined) {
        delta.ops.push({
          kind: "MUTATE",
          traitId: examined.id,
          rule: examined.rule,
          strength: Math.min(1, examined.strength + 0.05),
          source: "MIND",
        });
        // lock via invariant-like scar
        scarMind(
          delta,
          mind,
          `${examined.name} crystallized under attention and may not casually mutate. Unexamined traits remain free.`,
        );
        appendLab(delta, `${examined.name} locked by observation`);
      }
      break;
    }
    case "recoil": {
      const earlier = [...traits].sort((a, b) => a.recency - b.recency)[0];
      if (earlier) {
        delta.ops.push({
          kind: "MUTATE",
          traitId: earlier.id,
          rule: `${earlier.rule} — operational meaning revised because ${target.label} made the prior reading insufficient`,
          source: "SEMANTIC_RECOIL",
        });
        appendLab(delta, `${earlier.name} now means something else`);
      }
      break;
    }
    case "speciation": {
      const parents = run.priorMinds.filter((id) => id !== "speciation").slice(-2);
      const a = getMind(parents[0]);
      const b = getMind(parents[1]);
      if (a && b) {
        delta.ops.push({
          kind: "ADD",
          trait: {
            id: uid("tr"),
            name: "offspring law",
            rule: `a single operation that requires both (${a.whatItDoes}) and (${b.whatItDoes}) at once, reducible to neither parent`,
            jurisdiction: "structure",
            strength: 0.58,
            confidence: 0.55,
            persistence: 0.6,
            mutability: 0.5,
            source: "MIND",
            recency: state.version + 1,
          },
        });
        appendLab(delta, `offspring of ${a.label} × ${b.label}; neither parent sufficient`);
      } else {
        delta.ops.push({
          kind: "ADD",
          trait: {
            id: uid("tr"),
            name: "unbred axiom",
            rule: "no parent minds were available; this is a seed law waiting for a second parent",
            jurisdiction: "structure",
            strength: 0.4,
            confidence: 0.4,
            persistence: 0.5,
            mutability: 0.7,
            source: "MIND",
            recency: state.version + 1,
          },
        });
        appendLab(delta, "speciation seeded; needs a second parent mind in history");
      }
      break;
    }
  }

  return delta;
}

export function ejectScar(mind: MindDef): Scar {
  return {
    id: uid("scar"),
    cause: `Ejected mind: ${mind.label}`,
    operator: "KEEP_GOING",
    description: `${mind.full} was uninstalled. The procedure is gone; a scar of having thought that way remains.`,
    lostTraitNames: [],
    survivorTraitNames: [],
    debris: [],
  };
}

export function slotMindDelta(mind: MindDef, previous?: MindDef): Delta {
  const ops: DeltaOp[] = [
    {
      kind: "MEMORY",
      memory: {
        id: uid("mem"),
        text: `Temporary mind installed: ${mind.full}. Hidden constraint, not a theme.`,
        fromEventId: "slot",
      },
    },
  ];
  if (previous) {
    ops.push({ kind: "SCAR", scar: ejectScar(previous) });
  }
  return {
    ops,
    operator: "KEEP_GOING",
    mindId: mind.id,
    mindNote: `INSTALL ${mind.id}`,
    setInstalledMind: mind.id,
    narrative: `A temporary mind slotted. Travel now happens through ${mind.label} — ${mind.whatItDoes}`,
    lab: `MIND INSTALL ${mind.id} · ${mind.full}`,
  };
}

export function unslotMindDelta(mind: MindDef): Delta {
  return {
    ops: [
      { kind: "SCAR", scar: ejectScar(mind) },
      {
        kind: "MEMORY",
        memory: {
          id: uid("mem"),
          text: `${mind.label} uninstalled. The procedure is gone; the scar remains.`,
          fromEventId: "unslot",
        },
      },
    ],
    operator: "KEEP_GOING",
    mindId: mind.id,
    mindNote: `EJECT ${mind.id}`,
    setInstalledMind: null,
    narrative: `${mind.label} was ejected. Thinking that way left a scar.`,
    lab: `MIND EJECT ${mind.id}`,
  };
}


