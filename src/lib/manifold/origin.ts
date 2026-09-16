import { uid } from "./ids";
import type { OrganismState, Trait } from "./types";

function originTrait(
  name: string,
  rule: string,
  jurisdiction: Trait["jurisdiction"],
  strength: number,
): Trait {
  return {
    id: uid("tr"),
    name,
    rule,
    jurisdiction,
    strength,
    confidence: 0.9,
    persistence: 0.7,
    mutability: 0.65,
    source: "ORIGIN",
    recency: 0,
  };
}

export function createOrigin(): OrganismState {
  const pulse = originTrait(
    "even pulse",
    "a four-beat cycle returns unchanged and does not yet owe anyone an explanation",
    "pulse",
    0.72,
  );
  const motif = originTrait(
    "single figure",
    "one short figure occupies the center and returns as itself",
    "motif",
    0.68,
  );
  const density = originTrait(
    "modest density",
    "few layers; nothing answers the figure except the pulse",
    "texture",
    0.55,
  );
  const home = originTrait(
    "uncommitted home",
    "pitches lean toward a center but no tonic has been declared",
    "harmony",
    0.4,
  );
  const dry = originTrait(
    "close and dry",
    "events are near-field and unprocessed; no room has been assigned",
    "production",
    0.5,
  );

  return {
    id: uid("st"),
    version: 0,
    name: "Unnamed Pulse",
    identity: "a quiet repeating figure that has not yet been anywhere",
    playProjection:
      "A small repeating organism. It has a pulse, one figure, and no medical history. Destinations will have to work on this, not replace it.",
    labProjection:
      "Origin state. Five traits, no scars, no invariants, no debris. Feature vector centered. Ready for first operator.",
    features: {
      semanticX: 0,
      semanticY: 0,
      structure: 0.5,
      failure: 0.2,
      memory: 0.15,
      temporal: 0.45,
      topology: 0.4,
      energy: 0.35,
    },
    traits: [pulse, motif, density, home, dry],
    invariants: [],
    scars: [],
    relationships: [],
    memories: [],
    interpretations: [],
    debris: [],
    ancestry: [],
    uncertainty: 0.2,
    createdAt: Date.now(),
  };
}
