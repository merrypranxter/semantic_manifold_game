import {
  CAPTION_MAX,
  CAPTION_MIN,
  type OrganismState,
} from "../manifold/types.ts";
import { fitPromptBudget, type PromptFragment } from "./fit-budget.ts";

export function renderCaption(state: OrganismState): string {
  const diff = state.lastMutationDiff;
  const latestScar = state.scars.at(-1);
  const anchor = state.traits.find((trait) => trait.locked || state.invariants.some((inv) => inv.traitId === trait.id));

  const fragments: PromptFragment[] = [
    {
      id: "core",
      text: `Generation ${state.generation} of ${state.name}: a path-dependent Suno prompt organism descended from the ${state.seedId} genotype. The music changes by mutating specific musical jurisdictions instead of repainting the whole track with destination-themed style words.`,
      compact: `Generation ${state.generation} of ${state.name}, descended from ${state.seedId}: a path-dependent Suno prompt whose musical jurisdictions mutate instead of being replaced by destination-themed genre paint.`,
      priority: 100,
      mandatory: true,
      expand: [
        "The route is part of the composition.",
        "Its route remains audible.",
        "History stays causal.",
        "Nothing resets cleanly.",
        "The lineage matters.",
      ],
    },
    {
      id: "anchor",
      text: anchor
        ? `Its load-bearing anchor is ${anchor.name}; later mutations must work around that rule unless a destructive event genuinely scars it.`
        : "Identity is carried by surviving rules and causal history rather than by a fixed genre label.",
      compact: anchor ? `Anchor: ${anchor.name}.` : "Identity is carried by causal history.",
      priority: 96,
      mandatory: Boolean(anchor),
      expand: [
        anchor ? `That anchor is still audible.` : "Surviving rules define continuity.",
        anchor ? `The anchor resists ordinary travel.` : "Continuity comes from consequences.",
      ],
    },
    {
      id: "latest",
      text: diff
        ? `This generation mutated ${diff.mutated.join(", ") || "no named trait"}; added ${diff.added.join(", ") || "nothing new"}; preserved ${diff.preserved.join(", ") || "its remaining anchors"}.`
        : "This is generation zero: no route has acted yet, so the starting rules are exposed clearly before the first mutation.",
      compact: diff
        ? `Latest mutation: ${diff.mutated.join(", ") || "none"}; preserved ${diff.preserved.join(", ") || "anchors"}.`
        : "Generation zero exposes the starting rules before travel begins.",
      priority: 92,
      expand: [
        "Future moves inherit this exact state.",
        "The next concept acts on this descendant.",
        "A different route would produce a different child.",
        "The prompt itself is the evolving creature.",
      ],
    },
  ];

  if (latestScar) {
    fragments.push({
      id: "scar",
      text: `A persistent scar remains: ${latestScar.description} The composition must organize around that loss rather than quietly restoring the earlier mechanism.`,
      compact: `Scar: ${latestScar.description}`,
      priority: 98,
      mandatory: true,
      expand: [
        "The loss stays structural.",
        "The scar remains active.",
      ],
    });
  }

  return fitPromptBudget(fragments, CAPTION_MIN, CAPTION_MAX, " ");
}
