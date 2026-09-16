import { findConcept, normalizeName, type Concept } from "./concepts";
import { findMind, padMind } from "./minds";
import type { CommandProposal, OperatorId } from "./types";

const STOP = new Set([
  "the",
  "a",
  "an",
  "this",
  "that",
  "it",
  "to",
  "from",
  "into",
  "onto",
  "at",
  "of",
  "and",
  "then",
  "now",
  "please",
  "okay",
  "ok",
  "go",
  "take",
  "find",
  "run",
  "move",
  "bring",
  "drive",
  "send",
  "make",
  "me",
  "my",
  "our",
  "we",
  "with",
  "toward",
  "towards",
  "around",
  "near",
  "for",
  "on",
  "in",
  "by",
  "way",
  "route",
  "path",
  "through",
  "via",
  "past",
  "over",
]);

function detectOperator(n: string): { operator: OperatorId; restHint: string } {
  if (/\b(keep going|go farther|go further|extend that|do that again)\b/.test(n)) {
    if (/\b(past|beyond|overshoot)\b/.test(n)) return { operator: "OVERSHOOT", restHint: n };
    return { operator: "KEEP_GOING", restHint: n };
  }
  if (/\b(overshoot|drive past|go past|beyond)\b/.test(n)) {
    return { operator: "OVERSHOOT", restHint: n };
  }
  if (/\b(collide|collision|smash|wreck|crash into|launch .+ at|hit .+ hard)\b/.test(n)) {
    return { operator: "COLLISION", restHint: n };
  }
  if (/\b(parallel|run parallel|same motion)\b/.test(n)) {
    return { operator: "PARALLEL", restHint: n };
  }
  if (/\b(geodesic|shortest path|low-cost path)\b/.test(n)) {
    return { operator: "GEODESIC", restHint: n };
  }
  if (/\b(hover|don't fall|do not fall|orbit without)\b/.test(n)) {
    return { operator: "HOVER", restHint: n };
  }
  if (/\b(swan dive|pass through|through the|through )\b/.test(n) && !/\bby way of\b/.test(n)) {
    return { operator: "THROUGH", restHint: n };
  }
  if (/\b(via|by way of|byway)\b/.test(n)) {
    return { operator: "VIA", restHint: n };
  }
  return { operator: "DIRECT", restHint: n };
}

function extractVia(n: string): { dest: string; waypoint: string } | undefined {
  const m =
    n.match(/\b(?:to|toward|towards)\s+(.+?)\s+(?:by way of|via)\s+(.+)$/) ||
    n.match(/\b(?:by way of|via)\s+(.+?)\s+(?:to|toward|towards)\s+(.+)$/);
  if (!m) return undefined;
  if (n.includes("by way of") && n.search(/\bto\b/) < n.search(/by way of/)) {
    return { dest: m[1]!.trim(), waypoint: m[2]!.trim() };
  }
  if (/\bvia\s+(.+?)\s+to\b/.test(n)) {
    return { waypoint: m[1]!.trim(), dest: m[2]!.trim() };
  }
  return { dest: m[1]!.trim(), waypoint: m[2]!.trim() };
}

function leftoverPhrase(n: string): string {
  return n
    .replace(
      /\b(keep going|go farther|go further|overshoot|drive past|go past|beyond|collide with|collide|collision|smash into|smash|wreck|crash into|launch|hit|parallel to|run parallel to|run parallel|geodesic (?:from .+? )?to|find the geodesic(?: to)?|shortest path to|hover around|hover near|hover|don't fall into|do not fall into|swan dive into|pass through|take it through|through the|through|by way of|via|take this to|take that to|take it to|go to|go from this to|direct to|toward|towards|to the|to)\b/g,
      " ",
    )
    .replace(/\b(this|that|it|the|a|an)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveLabel(
  phrase: string,
  extra: Concept[],
): { concept?: Concept; novel?: string } {
  const cleaned = leftoverPhrase(normalizeName(phrase));
  if (!cleaned) return {};
  const hit = findConcept(cleaned, extra) ?? findConcept(phrase, extra);
  if (hit) return { concept: hit };
  const words = cleaned.split(" ").filter((w) => !STOP.has(w));
  const guess = words.join(" ").trim();
  if (!guess) return {};
  const hit2 = findConcept(guess, extra);
  if (hit2) return { concept: hit2 };
  return { novel: guess };
}

export function parseCommand(
  raw: string,
  extra: Concept[] = [],
  lastTargetId?: string,
  lastTargetLabel?: string,
): CommandProposal {
  const n = normalizeName(raw);
  if (!n) {
    return {
      raw,
      operator: "DIRECT",
      targetLabel: "",
      confidence: 0,
      note: "Empty command.",
    };
  }

  if (/\b(eject|uninstall|unslot|unequip|remove (?:the )?mind|clear (?:the )?mind|drop (?:the )?mind)\b/.test(n)) {
    return {
      raw,
      operator: "KEEP_GOING",
      targetLabel: "",
      ejectMind: true,
      confidence: 0.9,
      note: "Eject the installed mind. The procedure leaves; a scar remains.",
    };
  }

  if (/\b(install|slot|rack|load mind|use mind|equip)\b/.test(n)) {
    const rest = n
      .replace(
        /\b(install|slot|rack|load|use|equip|the|a|an|mind|module|this|please|temporary|cognitive)\b/g,
        " ",
      )
      .replace(/\s+/g, " ")
      .trim();
    const mind = findMind(rest);
    if (mind) {
      return {
        raw,
        operator: "KEEP_GOING",
        targetLabel: mind.label,
        mindId: mind.id,
        installOnly: true,
        confidence: 0.95,
        note: `Slot ${padMind(mind.n)} ${mind.label}. Hidden constraint — destinations will be forced through it.`,
      };
    }
    return {
      raw,
      operator: "KEEP_GOING",
      targetLabel: rest,
      installOnly: true,
      confidence: 0.35,
      note: rest
        ? `No mind named “${rest}”. Try install ownership, slot vacuum, or open the rack.`
        : "Name a mind to slot. Open the rack, or try install ownership.",
    };
  }

  const { operator } = detectOperator(n);

  if (operator === "KEEP_GOING") {
    return {
      raw,
      operator: "KEEP_GOING",
      targetId: lastTargetId,
      targetLabel: lastTargetLabel ?? "last heading",
      confidence: lastTargetId ? 0.85 : 0.5,
      note: lastTargetId
        ? `Continue the last transformation (toward ${lastTargetLabel}).`
        : "Continue recent transformation logic. No prior heading — will extend origin traits.",
    };
  }

  const via = extractVia(n);
  if (via && operator === "VIA") {
    const dest = resolveLabel(via.dest, extra);
    const wp = resolveLabel(via.waypoint, extra);
    return {
      raw,
      operator: "VIA",
      targetId: dest.concept?.id,
      targetLabel: dest.concept?.label ?? dest.novel ?? via.dest,
      novelTarget: dest.concept ? undefined : dest.novel,
      waypointId: wp.concept?.id,
      waypointLabel: wp.concept?.label ?? wp.novel ?? via.waypoint,
      novelWaypoint: wp.concept ? undefined : wp.novel,
      confidence: dest.concept && wp.concept ? 0.92 : 0.7,
      note: `Via ${(wp.concept?.label ?? via.waypoint)} then ${(dest.concept?.label ?? via.dest)}. Waypoint must leave evidence.`,
    };
  }

  const resolved = resolveLabel(n, extra);
  const label = resolved.concept?.label ?? resolved.novel ?? leftoverPhrase(n);

  const notes: Record<OperatorId, string> = {
    DIRECT: `Direct transit toward ${label || "a target"}. Destination reorganizes the current organism.`,
    VIA: `Via ${label}. If no separate destination was named, ${label} is the waypoint-as-destination.`,
    THROUGH: `Through ${label}. It becomes an environment; residual consequences persist.`,
    GEODESIC: `Geodesic to ${label} under the active ruler. Low-cost coherent path, not a straight blend.`,
    PARALLEL: `Parallel transport toward ${label}. Apply the last change-relation, not a copy of ${label}.`,
    COLLISION: `Collision with ${label}. Wreckage, not a blend: survivors, losses, scars, debris.`,
    OVERSHOOT: `Overshoot ${label}. Cross it and continue. Beyond is not more of the same.`,
    HOVER: `Hover near ${label}. Pressure without capture; identity retained.`,
    KEEP_GOING: "Keep going.",
  };

  return {
    raw,
    operator,
    targetId: resolved.concept?.id,
    targetLabel: label,
    novelTarget: resolved.concept ? undefined : resolved.novel ?? (label || undefined),
    confidence: resolved.concept ? 0.9 : label ? 0.55 : 0.2,
    note: notes[operator],
  };
}

export const OPERATOR_HELP: { id: OperatorId; label: string; example: string }[] = [
  { id: "DIRECT", label: "Direct", example: "take this to the void" },
  { id: "VIA", label: "Via", example: "to getting high by way of tardigrades" },
  { id: "THROUGH", label: "Through", example: "take it through the void" },
  { id: "GEODESIC", label: "Geodesic", example: "find the geodesic to astral plane" },
  { id: "PARALLEL", label: "Parallel", example: "run that parallel to mad scientist" },
  { id: "COLLISION", label: "Collision", example: "collide with wasp nest" },
  { id: "OVERSHOOT", label: "Overshoot", example: "overshoot caffeine" },
  { id: "HOVER", label: "Hover", example: "hover around the void" },
  { id: "KEEP_GOING", label: "Keep going", example: "keep going" },
];
