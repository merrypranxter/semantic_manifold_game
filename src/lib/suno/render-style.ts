import { getMind } from "../manifold/minds.ts";
import {
  STYLE_MAX,
  STYLE_MIN,
  type OrganismState,
} from "../manifold/types.ts";
import { deriveSunoGenome, JURISDICTIONS } from "./genome.ts";
import { fitPromptBudget, type PromptFragment } from "./fit-budget.ts";

export function renderStyle(state: OrganismState): string {
  const genome = deriveSunoGenome(state);
  const fragments: PromptFragment[] = [
    {
      id: "identity",
      text: `Original composition descended from the ${state.name} genotype. ${state.identity}. Treat every rule as an operational musical law, not as decorative theme language; do not imitate a named artist or collapse the jurisdictions into a generic genre blend.`,
      compact: `Original composition from ${state.name}. ${state.identity}. Use operational musical laws, not named-artist imitation or generic genre blending.`,
      priority: 100,
      mandatory: true,
      expand: [
        "Keep causal relationships audible: a change in one jurisdiction must create consequences without erasing the independence of the others.",
        "Prefer specific timing, pitch, timbre, performance, and production behavior over adjectives that merely announce a mood.",
      ],
    },
  ];

  for (const anchor of genome.anchors) {
    fragments.push({
      id: `anchor:${anchor.id}`,
      text: `ANCHOR — ${anchor.name}: ${anchor.rule}. This load-bearing property remains recognizable unless an explicitly destructive rule is allowed to scar it.`,
      compact: `ANCHOR — ${anchor.name}: ${anchor.rule}.`,
      priority: 96,
      mandatory: true,
      expand: [
        `Do not counterfeit ${anchor.name} with a convenient synonym if later transformations make the original rule difficult.`,
      ],
    });
  }

  let jurisdictionRank = 90;
  for (const jurisdiction of JURISDICTIONS) {
    const gene = genome.byJurisdiction[jurisdiction].find(
      (candidate) => candidate.status !== "lost" && candidate.status !== "suppressed",
    );
    if (!gene || genome.anchors.some((anchor) => anchor.id === gene.trait.id)) continue;
    const trait = gene.trait;
    fragments.push({
      id: `gene:${trait.id}`,
      text: `${jurisdiction.toUpperCase()} — ${trait.name}: ${trait.rule}. Status ${gene.status}; let this jurisdiction keep its own logic while interacting causally with the rest of the organism.`,
      compact: `${jurisdiction.toUpperCase()} — ${trait.name}: ${trait.rule}.`,
      priority: jurisdictionRank--,
      expand: [
        `When ${trait.name} changes intensity, expose the transition instead of smoothing it into a conventional arrangement gesture.`,
        `Let ${jurisdiction} remain legible enough that a later mutation can specifically rewrite it rather than replacing the whole song at once.`,
      ],
    });
  }

  for (const scar of state.scars.slice(-2)) {
    fragments.push({
      id: `scar:${scar.id}`,
      text: `SCAR — ${scar.description} The loss is permanent history: later material must organize around it rather than quietly restore the previous structure.`,
      compact: `SCAR — ${scar.description} Do not restore what was lost.`,
      priority: 98,
      mandatory: true,
      expand: scar.debris.map((piece) => `Keep collision debris audible as a structural residue: ${piece}.`),
    });
  }

  const mind = getMind(state.installedMind);
  if (mind) {
    fragments.push({
      id: `mind:${mind.id}`,
      text: `INSTALLED MIND — ${mind.label}: ${mind.compile} Apply this as a mutation-selection constraint, not as surface flavor.`,
      compact: `INSTALLED MIND — ${mind.label}: ${mind.compile}`,
      priority: 93,
      expand: [`Let ${mind.label} alter which musical rule is allowed to change first whenever several mutations compete.`],
    });
  }

  fragments.push({
    id: "production-discipline",
    text: "Production must reveal structure rather than rescue it: preserve attack detail, decay, breath, friction, resonance, spacing, and dynamic consequence. Avoid generic trailer drums, automatic cinematic swells, wallpaper ambience, and smoothing that hides incompatibility.",
    compact: "Production reveals structure; avoid generic trailer drums, automatic cinematic swells, wallpaper ambience, and smoothing that hides incompatibility.",
    priority: 72,
    expand: [
      "Transitions should sound caused by the organism's current laws, not by stock build-drop-release arranging habits.",
      "If density rises, make the mechanism of that rise audible; if space opens, let the missing material matter.",
    ],
  });

  // Expansion-only clauses give the budget fitter several short, musically meaningful
  // ways to finish a narrow Suno window without clipping prose or adding nonsense filler.
  const live = state.traits.filter((trait) => !trait.lost && !trait.suppressed);
  const first = live[0];
  const second = live[1] ?? first;
  fragments.push({
    id: "budget-bridges",
    text: "",
    priority: 64,
    expand: [
      `Generation ${state.generation} must retain audible causal ancestry.`,
      first ? `Keep ${first.name} legible under mutation.` : "Keep the active anchor legible under mutation.",
      second ? `Expose pressure on ${second.name}; do not smooth it away.` : "Expose mutation pressure instead of smoothing it away.",
      first ? `Let ${first.jurisdiction} negotiate without blending.` : "Let each jurisdiction negotiate without blending.",
      second ? `Preserve the consequence of ${second.name}.` : "Preserve the consequence of every active rule.",
      "Make every transition causally earned.",
      "Keep mutation audible, not decorative.",
      "Preserve jurisdictional independence.",
      "Do not hide structural disagreement.",
    ],
  });

  return fitPromptBudget(fragments, STYLE_MIN, STYLE_MAX, " ");
}
