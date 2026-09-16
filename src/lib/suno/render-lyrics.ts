import { getMind } from "../manifold/minds.ts";
import {
  LYRICS_MAX,
  LYRICS_MIN,
  type OrganismState,
  type Trait,
} from "../manifold/types.ts";
import { fitPromptBudget, type PromptFragment } from "./fit-budget.ts";
import { deriveSunoGenome, JURISDICTIONS } from "./genome.ts";

const PHASES = [
  {
    name: "INSTALL",
    instruction: "state the rule cleanly before it begins interfering with anything else",
    narration: "At first the mechanism is exposed without disguise so the listener can hear what will later be transformed.",
  },
  {
    name: "COUPLE",
    instruction: "let this rule affect one neighboring jurisdiction without surrendering its own identity",
    narration: "The next event is caused by contact between systems, not by a stock section change or a decorative transition.",
  },
  {
    name: "STRESS",
    instruction: "increase pressure until the rule has to reveal its failure mode or compensatory behavior",
    narration: "Nothing simply gets bigger; pressure changes what the mechanism can continue to maintain.",
  },
  {
    name: "RECALL",
    instruction: "return the material through the current state so history changes the meaning of the recurrence",
    narration: "The return is a descendant carrying memory, not a pristine copy pretending that the route never happened.",
  },
  {
    name: "REFORM",
    instruction: "stabilize only what the present organism can still support and leave every genuine loss absent",
    narration: "The new form is coherent because consequences persist, not because the composition resets to its opening conditions.",
  },
] as const;

function liveTraits(state: OrganismState): Trait[] {
  const genome = deriveSunoGenome(state);
  const result: Trait[] = [];
  for (const jurisdiction of JURISDICTIONS) {
    const gene = genome.byJurisdiction[jurisdiction].find(
      (candidate) => candidate.status !== "lost" && candidate.status !== "suppressed",
    );
    if (gene) result.push(gene.trait);
  }
  return result;
}

function phaseFragment(trait: Trait, phase: (typeof PHASES)[number], index: number): PromptFragment {
  const tag = `${phase.name}:${trait.jurisdiction.toUpperCase()}`;
  return {
    id: `phase:${index}:${phase.name}:${trait.id}`,
    text: `[${tag} — ${phase.instruction}]\n${trait.name} operates here: ${trait.rule}. ${phase.narration} Sing the explanation plainly enough that the process can be followed while the music demonstrates it.`,
    compact: `[${tag}] ${trait.name}: ${trait.rule}. ${phase.narration}`,
    priority: 78 - index + (trait.locked ? 16 : 0),
    mandatory: Boolean(trait.locked && phase.name === "INSTALL"),
    expand: [
      `[TRACE:${trait.jurisdiction.toUpperCase()}] The audible consequence of ${trait.name} must appear before another mechanism is allowed to claim the same event.`,
      `The singer reports the causal change without rhyming it into a slogan: ${trait.jurisdiction} is doing work, and the arrangement must prove that work acoustically.`,
      `[NO RESET] If this rule has already been altered by travel, perform the altered descendant; do not quote the generation-zero version for convenience.`,
    ],
  };
}

export function renderLyrics(state: OrganismState): string {
  const traits = liveTraits(state);
  const genome = deriveSunoGenome(state);
  const fragments: PromptFragment[] = [
    {
      id: "install-organism",
      text: `[INSTALL CURRENT ORGANISM — generation ${state.generation}; seed ${state.seedId}]\nThis song explains its own machinery while performing it. The words describe rates, collisions, recurrences, transfers, failures, and repairs as they happen. Do not default to rhyme, a compulsory chorus, or a generic emotional summary. The route has produced this exact descendant, so current rules outrank genre expectation.`,
      compact: `[INSTALL CURRENT ORGANISM — generation ${state.generation}] The song sings what its mechanisms are doing. Current inherited rules outrank rhyme, compulsory chorus, and genre expectation.`,
      priority: 100,
      mandatory: true,
      expand: [
        "The explanation is part of the performance: each technical statement should coincide with the audible process it names rather than arriving as commentary after the fact.",
        "Treat brackets as control instructions and unbracketed lines as dry process narration; neither layer should secretly turn into conventional verse-chorus writing unless the organism itself evolves that structure.",
      ],
    },
    {
      id: "identity",
      text: `[IDENTITY] ${state.identity}. Preserve recognizability through causal continuity rather than through static genre markers. A destination may rewrite a jurisdiction, but it may not replace the entire organism with music merely associated with that destination.`,
      compact: `[IDENTITY] ${state.identity}. Preserve causal continuity; destination concepts transform jurisdictions instead of replacing the whole organism.`,
      priority: 96,
      mandatory: true,
      expand: [
        "If two rules disagree, let the disagreement produce timing, voicing, density, or timbral consequences before choosing a winner.",
      ],
    },
  ];

  for (const anchor of genome.anchors) {
    fragments.push({
      id: `anchor:${anchor.id}`,
      text: `[LOCKED ANCHOR — ${anchor.name}] ${anchor.rule}. Keep this audible across every phase. Other material may orbit, interrupt, translate, or scar itself against the anchor, but ordinary travel cannot quietly remove it.`,
      compact: `[LOCKED ANCHOR — ${anchor.name}] ${anchor.rule}. Ordinary travel cannot quietly remove it.`,
      priority: 99,
      mandatory: true,
      expand: [
        `The narration names the anchor only when necessary; most of the proof should come from hearing ${anchor.name} survive while surrounding systems mutate.`,
      ],
    });
  }

  traits.forEach((trait, traitIndex) => {
    PHASES.forEach((phase) => fragments.push(phaseFragment(trait, phase, traitIndex)));
  });

  for (const rule of state.phoneticRules) {
    fragments.push({
      id: `phonetic:${rule.trigger}`,
      text: `[PHONETIC TRANSDUCER — ${rule.trigger}] When the voice produces ${rule.trigger}, it must ${rule.musicalEffect}. Use nonsense syllables only to trigger this mechanism; the sound itself is a control signal, not decoration. Strength ${Math.round(rule.strength * 100)} percent.`,
      compact: `[PHONETIC — ${rule.trigger}] ${rule.musicalEffect}; nonsense exists only as a control signal.`,
      priority: 90,
      expand: [
        `Demonstrate the ${rule.trigger} mapping once sparsely, once under pressure, and once after another jurisdiction has changed so the same phonetic cause produces a lineage-aware consequence.`,
      ],
    });
  }

  for (const scar of state.scars.slice(-3)) {
    fragments.push({
      id: `scar:${scar.id}`,
      text: `[SCAR CANNOT HEAL] ${scar.description} Lost material: ${scar.lostTraitNames.join(", ") || "named prior structure"}. Survivors: ${scar.survivorTraitNames.join(", ") || "none declared"}. Continue composing around the absence. Do not restore the lost mechanism under a synonym, proxy, hidden layer, or nostalgic reprise.`,
      compact: `[SCAR CANNOT HEAL] ${scar.description} Do not restore the lost mechanism under any proxy.`,
      priority: 98,
      mandatory: true,
      expand: scar.debris.map(
        (piece) => `[DEBRIS] ${piece} remains available as an interruption, residue, or malformed recurrence rather than becoming a clean replacement.`,
      ),
    });
  }

  const diff = state.lastMutationDiff;
  if (diff) {
    fragments.push({
      id: "latest-diff",
      text: `[LATEST MUTATION] Added: ${diff.added.join(", ") || "none"}. Mutated: ${diff.mutated.join(", ") || "none"}. Suppressed: ${diff.suppressed.join(", ") || "none"}. Lost: ${diff.lost.join(", ") || "none"}. Preserved anchors: ${diff.preserved.join(", ") || "none"}. Perform these consequences as current anatomy rather than narrating them as a past event.`,
      compact: `[LATEST MUTATION] mutated ${diff.mutated.join(", ") || "none"}; lost ${diff.lost.join(", ") || "none"}; preserved ${diff.preserved.join(", ") || "none"}.`,
      priority: 95,
      expand: [
        "Where the latest mutation changed only one jurisdiction, resist the temptation to repaint every other jurisdiction with the destination concept.",
      ],
    });
  }

  const mind = getMind(state.installedMind);
  if (mind) {
    fragments.push({
      id: `mind:${mind.id}`,
      text: `[INSTALLED TEMPORARY MIND — ${mind.label}] ${mind.compile} This procedure decides how transformations are selected and interpreted. It does not merely add a descriptive layer to the lyrics.`,
      compact: `[MIND — ${mind.label}] ${mind.compile}`,
      priority: 94,
      expand: [
        `When several mutations are plausible, let ${mind.label} determine which dependency, failure, memory, or distance relation becomes causally privileged.`,
      ],
    });
  }

  fragments.push({
    id: "ending",
    text: `[REFORM WITHOUT RESET] End when the current mechanisms reach a temporary working equilibrium. Let the final recurrence expose what survived, what changed ownership, and what can no longer happen. Do not manufacture a tonic home, downbeat, chorus, or emotional resolution merely because the track is ending.`,
    compact: `[REFORM WITHOUT RESET] End on a temporary equilibrium that exposes survival, mutation, and permanent absence without manufacturing conventional resolution.`,
    priority: 92,
    mandatory: true,
    expand: [
      "The last audible event should feel like a consequence still in motion rather than a curtain closing on a finished object.",
      "Leave enough structural evidence that a later generation can continue from this exact state without pretending the lineage began again.",
    ],
  });

  return fitPromptBudget(fragments, LYRICS_MIN, LYRICS_MAX, "\n\n");
}
