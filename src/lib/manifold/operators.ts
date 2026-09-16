import type { Concept } from "./concepts";
import { sourceWordIn } from "./concepts";
import { uid } from "./ids";
import {
  addFeatures,
  clampFeatures,
  geodesicWaypoints,
  lerpFeatures,
  scaleFeatures,
  subFeatures,
} from "./metrics";
import type {
  Delta,
  DeltaOp,
  Debris,
  Features,
  MetricId,
  OperatorId,
  OrganismState,
  Relationship,
  Scar,
  Trait,
  TraitSource,
} from "./types";

type Ctx = {
  state: OrganismState;
  target: Concept;
  waypoint?: Concept;
  metric: MetricId;
  extra: Concept[];
  eventId: string;
};

function cloneFeatures(f: Features): Features {
  return { ...f };
}

function protect(state: OrganismState, trait: Trait, op: OperatorId): boolean {
  if (trait.locked) return true;
  const inv = state.invariants.find((i) => i.traitId === trait.id);
  if (!inv) return false;
  if (inv.level === "ABSOLUTE") return true;
  if (inv.level === "STRONG") {
    return op !== "COLLISION" && op !== "THROUGH";
  }
  return op === "GEODESIC" || op === "HOVER";
}

function pickDonations(concept: Concept, n: number) {
  return concept.donations.slice(0, n);
}

function stripSource(rule: string, concept: Concept): string {
  if (!sourceWordIn(rule, concept)) return rule;
  return rule;
}

function existingIn(state: OrganismState, jurisdiction: Trait["jurisdiction"]): Trait | undefined {
  return state.traits.find(
    (t) => t.jurisdiction === jurisdiction && !t.lost && !t.suppressed,
  );
}

function intensityFor(op: OperatorId): { donate: number; feature: number; persist: number } {
  switch (op) {
    case "DIRECT":
      return { donate: 3, feature: 0.42, persist: 0.55 };
    case "VIA":
      return { donate: 2, feature: 0.28, persist: 0.7 };
    case "THROUGH":
      return { donate: 3, feature: 0.55, persist: 0.82 };
    case "GEODESIC":
      return { donate: 2, feature: 0.32, persist: 0.6 };
    case "PARALLEL":
      return { donate: 2, feature: 0.3, persist: 0.5 };
    case "COLLISION":
      return { donate: 2, feature: 0.5, persist: 0.75 };
    case "OVERSHOOT":
      return { donate: 2, feature: 0.38, persist: 0.45 };
    case "HOVER":
      return { donate: 1, feature: 0.12, persist: 0.35 };
    case "KEEP_GOING":
      return { donate: 1, feature: 0.22, persist: 0.5 };
  }
}

function applyDonations(
  ops: DeltaOp[],
  state: OrganismState,
  concept: Concept,
  source: TraitSource,
  op: OperatorId,
  count: number,
  recencyBase: number,
): { added: string[]; mutated: string[] } {
  const added: string[] = [];
  const mutated: string[] = [];
  const donations = pickDonations(concept, count);
  for (const d of donations) {
    const existing = existingIn(state, d.jurisdiction);
    if (existing && !existing.lost) {
      if (protect(state, existing, op)) {
        continue;
      }
      const rule = stripSource(d.rewrite ?? d.rule, concept);
      ops.push({
        kind: "MUTATE",
        traitId: existing.id,
        name: d.name,
        rule,
        strength: Math.min(1, existing.strength + 0.08),
        source,
      });
      mutated.push(d.name);
    } else {
      const trait: Trait = {
        id: uid("tr"),
        name: d.name,
        rule: stripSource(d.rule, concept),
        jurisdiction: d.jurisdiction,
        strength: 0.55 + concept.mass * 0.15,
        confidence: 0.75,
        persistence: intensityFor(op).persist,
        mutability: 1 - concept.mass * 0.4,
        source,
        sourceConceptId: concept.id,
        recency: recencyBase,
      };
      ops.push({ kind: "ADD", trait });
      added.push(d.name);
    }
  }
  return { added, mutated };
}

function moveFeatures(from: Features, toward: Features, t: number): { features: Features; delta: Features } {
  const next = clampFeatures(lerpFeatures(from, toward, t));
  return { features: next, delta: subFeatures(next, from) };
}

function overshootFeatures(from: Features, through: Features, t: number): { features: Features; delta: Features } {
  const past = clampFeatures(
    addFeatures(through, scaleFeatures(subFeatures(through, from), t)),
  );
  return { features: past, delta: subFeatures(past, from) };
}

function lineageName(state: OrganismState, concept: Concept, op: OperatorId): string {
  const base = state.name === "Unnamed Pulse" ? "Pulse" : state.name.split(" / ")[0]!;
  switch (op) {
    case "DIRECT":
      return `${base} under ${concept.label}`;
    case "VIA":
      return `${base} via ${concept.label}`;
    case "THROUGH":
      return `${base} after ${concept.label}`;
    case "GEODESIC":
      return `${base} along ${concept.label}`;
    case "PARALLEL":
      return `${base} ∥ ${concept.label}`;
    case "COLLISION":
      return `Wreckage of ${base} × ${concept.label}`;
    case "OVERSHOOT":
      return `Past ${concept.label}`;
    case "HOVER":
      return `${base} near ${concept.label}`;
    case "KEEP_GOING":
      return `${base} continued`;
  }
}

function identityFor(state: OrganismState, concept: Concept, op: OperatorId, extra: string): string {
  return `${lineageName(state, concept, op)}. ${extra}`;
}

function interpretOp(ops: DeltaOp[], concept: Concept, reading: string) {
  ops.push({
    kind: "INTERPRET",
    interpretation: { conceptId: concept.id, reading },
  });
}

function memoryOp(ops: DeltaOp[], eventId: string, text: string) {
  ops.push({
    kind: "MEMORY",
    memory: { id: uid("mem"), text, fromEventId: eventId },
  });
}

function relate(
  ops: DeltaOp[],
  from: string,
  to: string,
  kind: Relationship["kind"],
) {
  ops.push({
    kind: "RELATE",
    relationship: { id: uid("rel"), from, to, kind },
  });
}

function direct(ctx: Ctx): Delta {
  const { state, target } = ctx;
  const ops: DeltaOp[] = [];
  const { added, mutated } = applyDonations(
    ops,
    state,
    target,
    "CONCEPT_INTERPRETATION",
    "DIRECT",
    3,
    state.version + 1,
  );
  const moved = moveFeatures(state.features, target.features, 0.42);
  ops.push({ kind: "FEATURES", features: moved.features, delta: moved.delta });
  interpretOp(ops, target, target.whatItDoes);
  memoryOp(ops, ctx.eventId, `Direct encounter with ${target.label}.`);
  relate(ops, "organism", target.id, "TRANSFORMS_INTO");
  const play = `The organism reorganized under ${target.label} pressure. ${target.whatItDoes} Existing structure was rewritten before anything new was added.`;
  const lab = `DIRECT intensity 0.42. Mutated: ${mutated.join(", ") || "none"}. Added: ${added.join(", ") || "none"}. No scars. Identity preserved where compatible.`;
  ops.push({
    kind: "RENAME",
    name: lineageName(state, target, "DIRECT"),
    identity: identityFor(state, target, "DIRECT", "Arrived by direct transit."),
    play,
    lab,
  });
  return { ops, operator: "DIRECT", targetId: target.id, narrative: play, lab };
}

function via(ctx: Ctx): Delta {
  const { state, target, waypoint } = ctx;
  const ops: DeltaOp[] = [];
  const wp = waypoint ?? target;
  const dest = waypoint ? target : target;
  const wpWork = applyDonations(ops, state, wp, "WAYPOINT", "VIA", 2, state.version + 1);
  let cursor = cloneFeatures(state.features);
  const mid = moveFeatures(cursor, wp.features, 0.28);
  cursor = mid.features;
  let destWork = { added: [] as string[], mutated: [] as string[] };
  if (waypoint) {
    destWork = applyDonations(ops, state, dest, "CONCEPT_INTERPRETATION", "DIRECT", 2, state.version + 1);
    const end = moveFeatures(cursor, dest.features, 0.35);
    cursor = end.features;
    ops.push({ kind: "FEATURES", features: end.features, delta: subFeatures(end.features, state.features) });
  } else {
    ops.push({ kind: "FEATURES", features: mid.features, delta: mid.delta });
  }
  interpretOp(ops, wp, wp.whatItDoes);
  memoryOp(
    ops,
    ctx.eventId,
    waypoint
      ? `Passed through ${wp.label} before encountering ${dest.label}.`
      : `Via-route through ${wp.label}; identity more protected than a direct landing.`,
  );
  relate(ops, wp.id, dest.id, "CAUSES");
  const play = waypoint
    ? `${wp.label} altered the organism first. Only then did ${dest.label} act on the already-changed descendant. Removing the waypoint would not produce this arrival.`
    : `The organism touched the neighborhood of ${wp.label} and carried consequences forward without fully becoming it.`;
  const lab = `VIA. Waypoint donations (${wp.label}): ${[...wpWork.added, ...wpWork.mutated].join(", ") || "none"}. Destination: ${[...destWork.added, ...destWork.mutated].join(", ") || "n/a"}.`;
  ops.push({
    kind: "RENAME",
    name: waypoint ? `${lineageName(state, dest, "DIRECT")} via ${wp.label}` : lineageName(state, wp, "VIA"),
    identity: identityFor(state, dest, "VIA", `Waypoint ${wp.label} is causal.`),
    play,
    lab,
  });
  return {
    ops,
    operator: "VIA",
    targetId: dest.id,
    waypointId: waypoint?.id ?? wp.id,
    narrative: play,
    lab,
  };
}

function through(ctx: Ctx): Delta {
  const { state, target } = ctx;
  const ops: DeltaOp[] = [];
  const incompat = state.traits.filter(
    (t) =>
      !t.lost &&
      !t.suppressed &&
      t.jurisdiction === target.fracturePlane &&
      !protect(state, t, "THROUGH"),
  );
  const suppressedNames: string[] = [];
  for (const t of incompat.slice(0, 1)) {
    ops.push({ kind: "SUPPRESS", traitId: t.id });
    suppressedNames.push(t.name);
  }
  const work = applyDonations(ops, state, target, "ROUTE_OPERATOR", "THROUGH", 3, state.version + 1);
  const moved = moveFeatures(state.features, target.features, 0.58);
  ops.push({ kind: "FEATURES", features: moved.features, delta: moved.delta });
  if (suppressedNames.length) {
    const scar: Scar = {
      id: uid("scar"),
      cause: `Passage through ${target.label}`,
      operator: "THROUGH",
      sourceConceptId: target.id,
      description: `${suppressedNames.join(", ")} could not operate inside the environment and was suppressed on exit.`,
      lostTraitNames: suppressedNames,
      survivorTraitNames: work.mutated,
      debris: [],
    };
    ops.push({ kind: "SCAR", scar });
  }
  interpretOp(ops, target, `Environment: ${target.whatItDoes}`);
  memoryOp(ops, ctx.eventId, `Entered ${target.label}, reorganized under its rules, exited carrying residual law.`);
  relate(ops, target.id, "organism", "DESTABILIZES");
  const play = `The organism passed through ${target.label} as an environment. ${suppressedNames.length ? `On the way, ${suppressedNames.join(", ")} went quiet.` : "It survived without losing a named trait."} Residual rules persist.`;
  const lab = `THROUGH. Entry/internal/exit. Suppressed: ${suppressedNames.join(", ") || "none"}. Donated: ${[...work.added, ...work.mutated].join(", ")}.`;
  ops.push({
    kind: "RENAME",
    name: lineageName(state, target, "THROUGH"),
    identity: identityFor(state, target, "THROUGH", "Immersion, then exit."),
    play,
    lab,
  });
  return { ops, operator: "THROUGH", targetId: target.id, narrative: play, lab };
}

function geodesic(ctx: Ctx): Delta {
  const { state, target, extra, metric } = ctx;
  const ops: DeltaOp[] = [];
  const vias = geodesicWaypoints(state.features, target, extra, metric, 1);
  const names: string[] = [];
  let cursor = cloneFeatures(state.features);
  for (const step of vias) {
    applyDonations(ops, state, step, "ROUTE_OPERATOR", "GEODESIC", 1, state.version + 1);
    cursor = moveFeatures(cursor, step.features, 0.22).features;
    names.push(step.label);
    interpretOp(ops, step, `Geodesic step: ${step.whatItDoes}`);
  }
  const work = applyDonations(ops, state, target, "CONCEPT_INTERPRETATION", "GEODESIC", 2, state.version + 1);
  const end = moveFeatures(cursor, target.features, 0.3);
  ops.push({ kind: "FEATURES", features: end.features, delta: subFeatures(end.features, state.features) });
  memoryOp(
    ops,
    ctx.eventId,
    names.length
      ? `Low-cost path via ${names.join(", ")} then ${target.label} under ${metric}.`
      : `Direct geodesic to ${target.label} (no useful intermediate under ${metric}).`,
  );
  const play = names.length
    ? `A coherent path under the ${metric.toLowerCase()} ruler ran through ${names.join(", ")} before ${target.label}. Those steps donated structure; this is not a straight interpolation.`
    : `No cheaper neighbor sat on the path. Arrival at ${target.label} still used geodesic protection (invariants held).`;
  const lab = `GEODESIC metric=${metric}. Via: ${names.join(", ") || "none"}. Added/mutated: ${[...work.added, ...work.mutated].join(", ") || "none"}. High invariant protection.`;
  ops.push({
    kind: "RENAME",
    name: lineageName(state, target, "GEODESIC"),
    identity: identityFor(state, target, "GEODESIC", `Ruler: ${metric}.`),
    play,
    lab,
  });
  return {
    ops,
    operator: "GEODESIC",
    targetId: target.id,
    geodesicVia: vias.map((v) => v.id),
    narrative: play,
    lab,
  };
}

function parallel(ctx: Ctx): Delta {
  const { state, target } = ctx;
  const ops: DeltaOp[] = [];
  const last = state.lastFeatureDelta;
  let features: Features;
  let delta: Features;
  if (last) {
    const analog = clampFeatures(addFeatures(target.features, scaleFeatures(last, 0.65)));
    features = analog;
    delta = subFeatures(analog, state.features);
    ops.push({ kind: "FEATURES", features, delta });
  } else {
    const moved = moveFeatures(state.features, target.features, 0.22);
    features = moved.features;
    delta = moved.delta;
    ops.push({ kind: "FEATURES", features, delta });
  }
  const analogDonation = target.donations[0];
  if (analogDonation) {
    const existing = state.traits.find((t) => !t.lost && t.source !== "ORIGIN" && !protect(state, t, "PARALLEL"));
    if (existing) {
      ops.push({
        kind: "MUTATE",
        traitId: existing.id,
        rule: `${existing.rule} — the same relation of change is now applied using ${analogDonation.rule}`,
        source: "ROUTE_OPERATOR",
      });
    }
    applyDonations(ops, state, target, "ROUTE_OPERATOR", "PARALLEL", 1, state.version + 1);
  }
  interpretOp(
    ops,
    target,
    last
      ? `Analog of the previous transformation, relocated into ${target.label}'s frame.`
      : `No prior Δ. Carried the organism's relation (a repeating figure) into ${target.label} without copying it.`,
  );
  memoryOp(ops, ctx.eventId, `Parallel transport toward ${target.label}.`);
  relate(ops, "previous-Δ", target.id, "REINTERPRETS");
  const play = last
    ? `The last change was lifted off its old location and applied as an analogy at ${target.label}. ${target.label} was not pasted on; the relation of change moved.`
    : `No previous heading to transport. The pulse's repeating relation was carried into ${target.label}'s frame without absorbing its identity.`;
  const lab = `PARALLEL. Last Δ ${last ? "present" : "absent"}. Analog donation: ${analogDonation?.name ?? "none"}.`;
  ops.push({
    kind: "RENAME",
    name: lineageName(state, target, "PARALLEL"),
    identity: identityFor(state, target, "PARALLEL", "Relational, not copy."),
    play,
    lab,
  });
  return { ops, operator: "PARALLEL", targetId: target.id, narrative: play, lab };
}

function collision(ctx: Ctx): Delta {
  const { state, target } = ctx;
  const ops: DeltaOp[] = [];
  const live = state.traits.filter((t) => !t.lost && !t.suppressed);
  const contact = live.filter((t) => target.donations.some((d) => d.jurisdiction === t.jurisdiction));
  const fracture = live.filter(
    (t) => t.jurisdiction === target.fracturePlane && !protect(state, t, "COLLISION"),
  );
  const lost: Trait[] = [];
  const survivors: Trait[] = [];

  const victim = (fracture[0] ?? contact[0] ?? live.find((t) => t.mutability > 0.5 && !protect(state, t, "COLLISION")));
  if (victim) {
    ops.push({ kind: "LOST", traitId: victim.id });
    lost.push(victim);
  }
  for (const t of live) {
    if (t.id !== victim?.id) survivors.push(t);
  }

  const work = applyDonations(ops, state, target, "COLLISION", "COLLISION", 2, state.version + 1);

  const debrisRule = target.donations[2]?.rule ?? target.failureMode;
  const debris: Debris = {
    id: uid("deb"),
    label: `${target.label} shrapnel`,
    rule: debrisRule,
    fromEventId: ctx.eventId,
    conceptId: target.id,
  };
  ops.push({ kind: "DEBRIS", debris });

  const scar: Scar = {
    id: uid("scar"),
    cause: `Collision with ${target.label}`,
    operator: "COLLISION",
    sourceConceptId: target.id,
    description: `${target.label} struck the organism. ${lost.map((t) => t.name).join(", ") || "No named trait"} ${lost.length ? "did not survive contact." : "held."} A fragment of ${target.fracturePlane} law remains as debris, not as a blended layer.`,
    lostTraitNames: lost.map((t) => t.name),
    survivorTraitNames: survivors.slice(0, 3).map((t) => t.name),
    debris: [debris.label],
  };
  ops.push({ kind: "SCAR", scar });

  const organismMass = Math.min(1, 0.35 + state.ancestry.length * 0.08 + live.length * 0.04);
  const t = 0.35 + (1 - organismMass) * 0.25;
  const moved = moveFeatures(state.features, target.features, t);
  const wrecked = clampFeatures({
    ...moved.features,
    failure: Math.min(1, moved.features.failure + 0.18),
    structure: Math.max(0, moved.features.structure - 0.12),
  });
  ops.push({ kind: "FEATURES", features: wrecked, delta: subFeatures(wrecked, state.features) });

  interpretOp(ops, target, `Collision object: ${target.whatItDoes} Fracture plane: ${target.fracturePlane}.`);
  memoryOp(ops, ctx.eventId, `Wreckage recorded. ${scar.description}`);
  relate(ops, "organism", target.id, "DESTABILIZES");
  if (lost[0]) relate(ops, lost[0].name, debris.label, "TRANSFORMS_INTO");

  const play = `Collision, not a blend. ${lost.length ? `Lost: ${lost.map((t) => t.name).join(", ")}.` : "Mass held; no trait fully lost."} Survivors continue in damaged form. Debris (${debris.label}) remains off the main body. ${target.label} did not become a flavor.`;
  const lab = `COLLISION mass(organism)=${organismMass.toFixed(2)} mass(${target.label})=${target.mass}. Contact jurisdictions: ${contact.map((t) => t.jurisdiction).join(", ") || "none"}. Fracture: ${target.fracturePlane}. Lost: ${lost.map((t) => t.name).join(", ") || "none"}. Added under collision source: ${work.added.join(", ") || "none"}. Debris emitted.`;
  ops.push({
    kind: "RENAME",
    name: lineageName(state, target, "COLLISION"),
    identity: identityFor(state, target, "COLLISION", "Wreckage state. Continue from here."),
    play,
    lab,
  });
  return { ops, operator: "COLLISION", targetId: target.id, narrative: play, lab };
}

function overshoot(ctx: Ctx): Delta {
  const { state, target } = ctx;
  const ops: DeltaOp[] = [];
  applyDonations(ops, state, target, "CONCEPT_INTERPRETATION", "OVERSHOOT", 2, state.version + 1);
  const past = overshootFeatures(state.features, target.features, 0.45);
  ops.push({ kind: "FEATURES", features: past.features, delta: past.delta });
  const extra: Trait = {
    id: uid("tr"),
    name: "unnamed territory",
    rule: `after crossing ${target.label}'s law, the organism continues along the incoming direction and acquires a consequence ${target.label} itself does not contain`,
    jurisdiction: "structure",
    strength: 0.48,
    confidence: 0.55,
    persistence: 0.4,
    mutability: 0.7,
    source: "ROUTE_OPERATOR",
    sourceConceptId: target.id,
    recency: state.version + 1,
  };
  ops.push({ kind: "ADD", trait: extra });
  interpretOp(ops, target, `Station, not destination: ${target.whatItDoes}`);
  memoryOp(ops, ctx.eventId, `Crossed ${target.label} and continued. Beyond is not more ${target.label}.`);
  const play = `The organism crossed ${target.label} and kept going. What lies past it is not a louder version of ${target.label}; it is unnamed territory produced by leftover direction.`;
  const lab = `OVERSHOOT. Feature vector past target. Extra trait 'unnamed territory' added. ${target.label} treated as station.`;
  ops.push({
    kind: "RENAME",
    name: lineageName(state, target, "OVERSHOOT"),
    identity: identityFor(state, target, "OVERSHOOT", "Unnamed territory."),
    play,
    lab,
  });
  return { ops, operator: "OVERSHOOT", targetId: target.id, narrative: play, lab };
}

function hover(ctx: Ctx): Delta {
  const { state, target } = ctx;
  const ops: DeltaOp[] = [];
  applyDonations(ops, state, target, "CONCEPT_INTERPRETATION", "HOVER", 1, state.version + 1);
  const moved = moveFeatures(state.features, target.features, 0.12);
  ops.push({ kind: "FEATURES", features: moved.features, delta: moved.delta });
  interpretOp(ops, target, `Pressure without capture: ${target.whatItDoes}`);
  memoryOp(ops, ctx.eventId, `Hovered near ${target.label}. Identity retained.`);
  const play = `The organism held near ${target.label} without falling in. Pressure is active; capture did not occur. The name of the organism is still its own.`;
  const lab = `HOVER. Feature step 0.12. Single donation. Invariants held.`;
  ops.push({
    kind: "RENAME",
    name: lineageName(state, target, "HOVER"),
    identity: identityFor(state, target, "HOVER", "Uncaptured."),
    play,
    lab,
  });
  return { ops, operator: "HOVER", targetId: target.id, narrative: play, lab };
}

function keepGoing(ctx: Ctx): Delta {
  const { state, target } = ctx;
  const ops: DeltaOp[] = [];
  const last = state.lastFeatureDelta;
  if (last) {
    const next = clampFeatures(addFeatures(state.features, scaleFeatures(last, 0.7)));
    ops.push({ kind: "FEATURES", features: next, delta: subFeatures(next, state.features) });
  } else {
    const moved = overshootFeatures(state.features, target.features, 0.3);
    ops.push({ kind: "FEATURES", features: moved.features, delta: moved.delta });
  }
  const recent = [...state.traits].filter((t) => !t.lost).sort((a, b) => b.recency - a.recency)[0];
  if (recent && !protect(state, recent, "KEEP_GOING")) {
    ops.push({
      kind: "MUTATE",
      traitId: recent.id,
      rule: `${recent.rule} — continued along the same transformation logic rather than intensified uniformly`,
      source: "ROUTE_OPERATOR",
    });
  }
  memoryOp(ops, ctx.eventId, "Kept going. Same logic of change, another step.");
  const play =
    "The last transformation was continued, not simply turned up. Parameters were not globally intensified; the direction of change took another step.";
  const lab = `KEEP_GOING. Last Δ ${last ? "applied ×0.7" : "synthesized from target"}.`;
  ops.push({
    kind: "RENAME",
    name: lineageName(state, target, "KEEP_GOING"),
    identity: identityFor(state, target, "KEEP_GOING", "Extension of prior logic."),
    play,
    lab,
  });
  return { ops, operator: "KEEP_GOING", targetId: target.id, narrative: play, lab };
}

export function runOperator(
  operator: OperatorId,
  state: OrganismState,
  target: Concept,
  metric: MetricId,
  extra: Concept[],
  waypoint?: Concept,
  eventId = uid("ev"),
): Delta {
  const ctx: Ctx = { state, target, waypoint, metric, extra, eventId };
  switch (operator) {
    case "DIRECT":
      return direct(ctx);
    case "VIA":
      return via(ctx);
    case "THROUGH":
      return through(ctx);
    case "GEODESIC":
      return geodesic(ctx);
    case "PARALLEL":
      return parallel(ctx);
    case "COLLISION":
      return collision(ctx);
    case "OVERSHOOT":
      return overshoot(ctx);
    case "HOVER":
      return hover(ctx);
    case "KEEP_GOING":
      return keepGoing(ctx);
  }
}
