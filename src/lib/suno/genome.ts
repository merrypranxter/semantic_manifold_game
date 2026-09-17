import type {
  Jurisdiction,
  OrganismState,
  PhoneticRule,
  Scar,
  Trait,
} from "../manifold/types.ts";

export type GeneStatus =
  | "active"
  | "locked"
  | "scarred"
  | "dormant"
  | "suppressed"
  | "lost";

export type DerivedGene = {
  trait: Trait;
  status: GeneStatus;
};

export type DerivedSunoGenome = {
  seedId: string;
  generation: number;
  byJurisdiction: Record<Jurisdiction, DerivedGene[]>;
  anchors: Trait[];
  scars: Scar[];
  phoneticRules: PhoneticRule[];
};

export const JURISDICTIONS: readonly Jurisdiction[] = [
  "time",
  "meter",
  "rhythm",
  "pulse",
  "pitch",
  "harmony",
  "melody",
  "texture",
  "timbre",
  "instrumentation",
  "vocal",
  "articulation",
  "dynamics",
  "production",
  "form",
  "motif",
  "repetition",
  "performance",
  "spatial",
  "structure",
  "memory",
] as const;

function scarTouchesTrait(state: OrganismState, trait: Trait): boolean {
  return state.scars.some((scar) => {
    const names = [...scar.lostTraitNames, ...scar.survivorTraitNames].map((name) =>
      name.toLowerCase(),
    );
    if (names.includes(trait.name.toLowerCase())) return true;
    return scar.description.toLowerCase().includes(trait.name.toLowerCase());
  });
}

function geneStatus(state: OrganismState, trait: Trait): GeneStatus {
  if (trait.lost) return "lost";
  if (trait.suppressed) return "suppressed";
  if (trait.locked || state.invariants.some((inv) => inv.traitId === trait.id)) return "locked";
  if (scarTouchesTrait(state, trait)) return "scarred";
  if (trait.strength < 0.28) return "dormant";
  return "active";
}

export function deriveSunoGenome(state: OrganismState): DerivedSunoGenome {
  const byJurisdiction = {} as Record<Jurisdiction, DerivedGene[]>;
  for (const jurisdiction of JURISDICTIONS) {
    byJurisdiction[jurisdiction] = [];
  }

  for (const original of state.traits) {
    const trait = { ...original };
    byJurisdiction[trait.jurisdiction].push({
      trait,
      status: geneStatus(state, original),
    });
  }

  for (const jurisdiction of JURISDICTIONS) {
    byJurisdiction[jurisdiction].sort((a, b) => {
      if (b.trait.strength !== a.trait.strength) return b.trait.strength - a.trait.strength;
      return a.trait.name.localeCompare(b.trait.name);
    });
  }

  const anchorIds = new Set(
    state.invariants.map((inv) => inv.traitId).filter((id): id is string => Boolean(id)),
  );
  const anchors = state.traits
    .filter((trait) => trait.locked || anchorIds.has(trait.id))
    .map((trait) => ({ ...trait }));

  return {
    seedId: state.seedId,
    generation: state.generation,
    byJurisdiction,
    anchors,
    scars: state.scars.map((scar) => ({
      ...scar,
      lostTraitNames: [...scar.lostTraitNames],
      survivorTraitNames: [...scar.survivorTraitNames],
      debris: [...scar.debris],
    })),
    phoneticRules: state.phoneticRules.map((rule) => ({ ...rule })),
  };
}
