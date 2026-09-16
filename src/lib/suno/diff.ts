import type { MutationDiff, OrganismState, Trait } from "../manifold/types.ts";

function changed(before: Trait, after: Trait): boolean {
  return (
    before.name !== after.name ||
    before.rule !== after.rule ||
    before.strength !== after.strength ||
    before.jurisdiction !== after.jurisdiction ||
    before.locked !== after.locked ||
    before.mutability !== after.mutability ||
    before.persistence !== after.persistence
  );
}

function uniq(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function deriveMutationDiff(
  before: OrganismState,
  after: OrganismState,
): MutationDiff {
  const beforeById = new Map(before.traits.map((trait) => [trait.id, trait]));
  const afterById = new Map(after.traits.map((trait) => [trait.id, trait]));

  const added: string[] = [];
  const mutated: string[] = [];
  const suppressed: string[] = [];
  const lost: string[] = [];

  for (const trait of after.traits) {
    const prior = beforeById.get(trait.id);
    if (!prior) {
      if (!trait.lost) added.push(trait.name);
      continue;
    }
    if (!prior.suppressed && trait.suppressed) suppressed.push(trait.name);
    if (!prior.lost && trait.lost) lost.push(trait.name);
    if (!trait.lost && !trait.suppressed && changed(prior, trait)) mutated.push(trait.name);
  }

  for (const trait of before.traits) {
    if (!afterById.has(trait.id)) lost.push(trait.name);
  }

  const priorScarIds = new Set(before.scars.map((scar) => scar.id));
  const newScars = after.scars.filter((scar) => !priorScarIds.has(scar.id));
  const scarred = uniq(
    newScars.flatMap((scar) => [
      ...scar.lostTraitNames,
      ...scar.survivorTraitNames,
      scar.description,
    ]),
  );

  const invariantIds = new Set(
    after.invariants.map((inv) => inv.traitId).filter((id): id is string => Boolean(id)),
  );
  const preserved = after.traits
    .filter((trait) => {
      if (trait.lost || trait.suppressed) return false;
      if (!trait.locked && !invariantIds.has(trait.id)) return false;
      const prior = beforeById.get(trait.id);
      return Boolean(prior && !changed(prior, trait) && !prior.lost && !prior.suppressed);
    })
    .map((trait) => trait.name);

  return {
    added: uniq(added),
    mutated: uniq(mutated),
    suppressed: uniq(suppressed),
    lost: uniq(lost),
    scarred,
    preserved: uniq(preserved),
  };
}
