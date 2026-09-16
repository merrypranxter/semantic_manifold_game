import type {
  Features,
  Invariant,
  Jurisdiction,
  OrganismState,
  PhoneticRule,
  Trait,
} from "../manifold/types.ts";

export type SunoSeed = {
  id: string;
  label: string;
  dna: string;
  description: string;
  evolvesWellBy: string[];
  tendencies: string[];
  identity: string;
  traits: SeedTrait[];
  invariants: SeedInvariant[];
  phoneticRules?: PhoneticRule[];
  features: Features;
};

type SeedTrait = {
  key: string;
  name: string;
  rule: string;
  jurisdiction: Jurisdiction;
  strength: number;
  persistence: number;
  mutability: number;
  locked?: boolean;
};

type SeedInvariant = {
  key: string;
  text: string;
  level: Invariant["level"];
  traitKey?: string;
};

const f = (
  structure: number,
  failure: number,
  memory: number,
  temporal: number,
  topology: number,
  energy: number,
  semanticX = 0,
  semanticY = 0,
): Features => ({ semanticX, semanticY, structure, failure, memory, temporal, topology, energy });

export const SUNO_SEEDS: readonly SunoSeed[] = [
  {
    id: "productive-contradiction",
    label: "Productive Contradiction",
    dna: "separate jurisdictions · hard anchor · incompatible laws",
    description:
      "Harmony, melody, rhythm, timbre, and performance begin under different laws and are forbidden to dissolve into one blended style.",
    evolvesWellBy: ["collision", "parallel travel", "ownership transfer", "invariant pressure"],
    tendencies: ["high identity retention", "high scarability", "jurisdiction swaps"],
    identity:
      "a negotiated composition whose parts disagree on purpose while one anchor keeps the disagreement recognizable",
    features: f(0.82, 0.43, 0.38, 0.61, 0.58, 0.72, -0.15, 0.14),
    traits: [
      {
        key: "anchor",
        name: "fixed eleven-step harmonic anchor",
        rule: "an unequal eleven-step harmonic circulation returns intact even when other jurisdictions change ownership",
        jurisdiction: "harmony",
        strength: 0.92,
        persistence: 0.96,
        mutability: 0.05,
        locked: true,
      },
      {
        key: "melody",
        name: "elastic declamation",
        rule: "melody stretches phrase length freely across the harmonic circulation and refuses symmetrical four-bar closure",
        jurisdiction: "melody",
        strength: 0.76,
        persistence: 0.68,
        mutability: 0.68,
      },
      {
        key: "rhythm",
        name: "interlocking pulse lattice",
        rule: "rhythm distributes attacks across interlocking unequal subdivisions rather than letting one layer own the beat",
        jurisdiction: "rhythm",
        strength: 0.8,
        persistence: 0.72,
        mutability: 0.62,
      },
      {
        key: "timbre",
        name: "friction against resonance",
        rule: "dry bow friction and metallic attack repeatedly open into long sympathetic resonance without smoothing the transition",
        jurisdiction: "timbre",
        strength: 0.72,
        persistence: 0.61,
        mutability: 0.74,
      },
      {
        key: "performance",
        name: "committed disagreement",
        rule: "performers execute incompatible timing laws with conviction and do not correct the resulting disagreement into tasteful looseness",
        jurisdiction: "performance",
        strength: 0.78,
        persistence: 0.76,
        mutability: 0.58,
      },
      {
        key: "production",
        name: "close physical production",
        rule: "production stays near-field, dry, tactile, and dynamically exposed so jurisdiction conflicts remain audible",
        jurisdiction: "production",
        strength: 0.63,
        persistence: 0.66,
        mutability: 0.52,
      },
    ],
    invariants: [
      {
        key: "harmonic-anchor",
        text: "Keep the unequal eleven-step harmonic circulation recognizable across every ordinary mutation.",
        level: "STRONG",
        traitKey: "anchor",
      },
    ],
  },
  {
    id: "reconstructive-memory",
    label: "Reconstructive Memory",
    dna: "recall mutation · semantic recoil · accumulating scars",
    description:
      "Returns are rebuilt from the current context, so later events can alter what an earlier phrase means without replaying it exactly.",
    evolvesWellBy: ["déjà vu", "loops", "geodesics", "long lineages"],
    tendencies: ["slow identity drift", "strong lineage effects", "memory-sensitive"],
    identity:
      "a composition that remembers by reconstruction, allowing every return to expose the history accumulated since the last one",
    features: f(0.67, 0.34, 0.93, 0.72, 0.46, 0.52, 0.04, 0.22),
    traits: [
      {
        key: "memory-anchor",
        name: "recognizable return contour",
        rule: "every major return preserves one contour interval sequence even while timing, harmony, and instrumentation are reconstructed",
        jurisdiction: "motif",
        strength: 0.9,
        persistence: 0.94,
        mutability: 0.08,
        locked: true,
      },
      {
        key: "repetition",
        name: "contextual recurrence",
        rule: "repetition never copies a prior event; it rebuilds the event from the current harmonic, rhythmic, and timbral context",
        jurisdiction: "repetition",
        strength: 0.86,
        persistence: 0.8,
        mutability: 0.69,
      },
      {
        key: "memory",
        name: "backward reinterpretation",
        rule: "new material changes the apparent function of earlier material when that material returns",
        jurisdiction: "memory",
        strength: 0.88,
        persistence: 0.84,
        mutability: 0.64,
      },
      {
        key: "form",
        name: "reconstructive form",
        rule: "formal sections recur as changed descendants that retain causal links to earlier sections rather than fixed labels",
        jurisdiction: "form",
        strength: 0.72,
        persistence: 0.7,
        mutability: 0.73,
      },
      {
        key: "harmony",
        name: "memory-weighted harmony",
        rule: "harmonic arrivals emphasize pitches that were structurally important in the most recent remembered version",
        jurisdiction: "harmony",
        strength: 0.66,
        persistence: 0.58,
        mutability: 0.75,
      },
      {
        key: "production",
        name: "residual ghosts",
        rule: "faint residual transients from earlier versions remain audible behind reconstructed returns without becoming literal echoes",
        jurisdiction: "production",
        strength: 0.6,
        persistence: 0.63,
        mutability: 0.6,
      },
    ],
    invariants: [
      {
        key: "return-contour",
        text: "Every major return must preserve the seed contour relationship even when the remembered event is rebuilt.",
        level: "STRONG",
        traitKey: "memory-anchor",
      },
    ],
  },
  {
    id: "primitive-vacuum",
    label: "Primitive Vacuum",
    dna: "one load-bearing primitive permanently absent",
    description:
      "A foundational musical primitive is removed at birth. The organism survives by evolving compensatory structures around the vacancy.",
    evolvesWellBy: ["scars", "hostile destinations", "compensatory systems", "through-routes"],
    tendencies: ["high structural pressure", "strong compensatory evolution", "fragile equilibrium"],
    identity:
      "a beatless organism that coordinates by breath, density, resonance, and event causality without secretly restoring a beat",
    features: f(0.88, 0.68, 0.42, 0.83, 0.74, 0.57, -0.24, -0.04),
    traits: [
      {
        key: "vacuum",
        name: "permanent beat vacuum",
        rule: "no beat, implied beat, click, recurrent accent grid, or substitute pulse may organize the composition",
        jurisdiction: "pulse",
        strength: 1,
        persistence: 1,
        mutability: 0,
        locked: true,
      },
      {
        key: "timing",
        name: "causal timing",
        rule: "events begin because another event decays, saturates, runs out of breath, or crosses a density threshold rather than because a beat arrives",
        jurisdiction: "time",
        strength: 0.84,
        persistence: 0.78,
        mutability: 0.58,
      },
      {
        key: "rhythm",
        name: "breath-distributed rhythm",
        rule: "rhythmic grouping follows changing breath lengths and attack clusters without converging on periodic accents",
        jurisdiction: "rhythm",
        strength: 0.76,
        persistence: 0.68,
        mutability: 0.71,
      },
      {
        key: "form",
        name: "threshold form",
        rule: "sections change only when accumulated resonance, density, or register crosses a structural threshold",
        jurisdiction: "form",
        strength: 0.77,
        persistence: 0.72,
        mutability: 0.7,
      },
      {
        key: "melody",
        name: "unmetered melodic expansion",
        rule: "melodic lines expand and contract according to breath pressure and harmonic tension rather than bar length",
        jurisdiction: "melody",
        strength: 0.69,
        persistence: 0.62,
        mutability: 0.76,
      },
      {
        key: "texture",
        name: "coordination by permeability",
        rule: "layers enter when sonic space opens and withdraw when density blocks them, creating coordination without pulse ownership",
        jurisdiction: "texture",
        strength: 0.7,
        persistence: 0.67,
        mutability: 0.72,
      },
    ],
    invariants: [
      {
        key: "no-beat",
        text: "Beat remains genuinely absent; no synonym, proxy, periodic accent, or hidden click may restore it.",
        level: "ABSOLUTE",
        traitKey: "vacuum",
      },
    ],
  },
  {
    id: "alien-sensorium",
    label: "Alien Sensorium",
    dna: "synthetic transducers · reflex rules · alien salience",
    description:
      "Abstract variables are treated like sensory quantities, and those sensed gradients decide which musical jurisdictions become urgent.",
    evolvesWellBy: ["strange nouns", "metric switching", "WTF neighbors", "semantic recoil"],
    tendencies: ["high novelty", "metric-sensitive", "unusual causal mapping"],
    identity:
      "a composition whose musical decisions are controlled by synthetic senses for failure, memory pressure, topology, and structural heat",
    features: f(0.71, 0.71, 0.69, 0.58, 0.92, 0.7, 0.31, -0.27),
    traits: [
      {
        key: "sensor-anchor",
        name: "topology as direction",
        rule: "topological change is always sensed as directional pressure that determines where register and spatial motion may travel next",
        jurisdiction: "spatial",
        strength: 0.91,
        persistence: 0.92,
        mutability: 0.08,
        locked: true,
      },
      {
        key: "failure",
        name: "failure as heat",
        rule: "rising structural failure increases articulation heat, attack density, and upper partial activity before any other response",
        jurisdiction: "articulation",
        strength: 0.78,
        persistence: 0.66,
        mutability: 0.76,
      },
      {
        key: "memory",
        name: "memory debt as weight",
        rule: "unresolved recurrence adds perceived weight, lowering register and increasing sustain until the debt is discharged",
        jurisdiction: "memory",
        strength: 0.8,
        persistence: 0.7,
        mutability: 0.72,
      },
      {
        key: "topology",
        name: "fold-sensitive melody",
        rule: "melodic direction follows changes in connection and adjacency rather than scale ascent or descent",
        jurisdiction: "melody",
        strength: 0.72,
        persistence: 0.64,
        mutability: 0.78,
      },
      {
        key: "structure",
        name: "structural heat routing",
        rule: "high structural pressure moves activity into timbre and texture while low pressure returns it to pitch and silence",
        jurisdiction: "structure",
        strength: 0.75,
        persistence: 0.68,
        mutability: 0.74,
      },
      {
        key: "instrumentation",
        name: "transducer instrumentation",
        rule: "instrument families are selected for how clearly they can expose sensed gradients through friction, airflow, resonance, or metallic decay",
        jurisdiction: "instrumentation",
        strength: 0.66,
        persistence: 0.58,
        mutability: 0.79,
      },
    ],
    invariants: [
      {
        key: "sensor-law",
        text: "Abstract state changes must continue to enter the music through explicit sensory transduction rather than decorative metaphor.",
        level: "STRONG",
        traitKey: "sensor-anchor",
      },
    ],
  },
  {
    id: "phonetic-organism",
    label: "Phonetic Organism",
    dna: "voice as physical control surface · nonsense with mechanics",
    description:
      "Consonants, vowels, nasals, rolls, and syllable density directly control rhythm, pitch, resonance, acceleration, and mass.",
    evolvesWellBy: ["vocal mutation", "tempo abuse", "instrumentation transfer", "articulation pressure"],
    tendencies: ["very high vocal plasticity", "fast mutation", "strong body-to-music coupling"],
    identity:
      "a vocal machine in which phonetic gestures are control signals and nonsense syllables only exist when they perform a musical job",
    features: f(0.73, 0.5, 0.46, 0.78, 0.57, 0.88, 0.18, 0.1),
    traits: [
      {
        key: "phonetic-anchor",
        name: "phonemes are controls",
        rule: "every non-lexical vocal sound must cause an explicit musical change; decorative gibberish is forbidden",
        jurisdiction: "vocal",
        strength: 0.96,
        persistence: 0.97,
        mutability: 0.04,
        locked: true,
      },
      {
        key: "articulation",
        name: "consonant percussion",
        rule: "hard consonants create percussive attacks and can hand their attack pattern to instruments",
        jurisdiction: "articulation",
        strength: 0.84,
        persistence: 0.73,
        mutability: 0.72,
      },
      {
        key: "melody",
        name: "vowel sustain",
        rule: "open vowels carry sustained pitch and longer vowels stretch melodic time before releasing the next event",
        jurisdiction: "melody",
        strength: 0.8,
        persistence: 0.68,
        mutability: 0.77,
      },
      {
        key: "timbre",
        name: "nasal resonance routing",
        rule: "nasal sounds increase drone, sympathetic resonance, and narrow-band timbral focus",
        jurisdiction: "timbre",
        strength: 0.74,
        persistence: 0.62,
        mutability: 0.78,
      },
      {
        key: "rhythm",
        name: "syllabic compression",
        rule: "dense syllable clusters compress rhythmic spacing while sparse syllables allow events to widen and decelerate",
        jurisdiction: "rhythm",
        strength: 0.78,
        persistence: 0.64,
        mutability: 0.81,
      },
      {
        key: "dynamics",
        name: "phonetic mass",
        rule: "heavy closed syllables add low-frequency weight while airy aspirates remove mass and open spectral space",
        jurisdiction: "dynamics",
        strength: 0.67,
        persistence: 0.58,
        mutability: 0.8,
      },
    ],
    invariants: [
      {
        key: "phonetic-causality",
        text: "Every gibberish or non-lexical vocal event must remain causally tied to an audible musical operation.",
        level: "STRONG",
        traitKey: "phonetic-anchor",
      },
    ],
    phoneticRules: [
      { trigger: "hard consonants", musicalEffect: "create percussive attacks and transient clusters", strength: 0.9 },
      { trigger: "open vowels", musicalEffect: "sustain melody and stretch local time", strength: 0.88 },
      { trigger: "nasal consonants", musicalEffect: "increase drone and sympathetic resonance", strength: 0.8 },
      { trigger: "rolled consonants", musicalEffect: "accelerate repeated figures and agitation", strength: 0.82 },
      { trigger: "dense syllable clusters", musicalEffect: "compress rhythmic spacing and melodic runs", strength: 0.86 },
      { trigger: "long vowels", musicalEffect: "lengthen phrase duration before the next causal event", strength: 0.78 },
    ],
  },
  {
    id: "metabolic-composition",
    label: "Metabolic Composition",
    dna: "rates · gradients · flows · maintenance debt",
    description:
      "Musical objects are temporary states maintained by processes. Identity persists only while flows, pressure, feedback, and decay keep rebuilding it.",
    evolvesWellBy: ["slow drift", "phase changes", "collapse/reformation", "process-oriented minds"],
    tendencies: ["continuous morphing", "phase-transition scars", "long-form fertility"],
    identity:
      "a process ecology where form is maintained by rates and gradients until the maintenance conditions fail and a new phase takes over",
    features: f(0.76, 0.59, 0.5, 0.86, 0.68, 0.62, -0.08, -0.3),
    traits: [
      {
        key: "metabolic-anchor",
        name: "process before object",
        rule: "no musical object may persist by declaration; every stable pattern must be continuously maintained by a named flow, rate, gradient, or feedback process",
        jurisdiction: "structure",
        strength: 0.95,
        persistence: 0.96,
        mutability: 0.04,
        locked: true,
      },
      {
        key: "form",
        name: "phase-transition form",
        rule: "formal changes occur when maintenance conditions cross thresholds and the current state can no longer sustain itself",
        jurisdiction: "form",
        strength: 0.84,
        persistence: 0.76,
        mutability: 0.69,
      },
      {
        key: "texture",
        name: "density metabolism",
        rule: "texture thickens when inflow exceeds decay and thins when decay outruns new material",
        jurisdiction: "texture",
        strength: 0.76,
        persistence: 0.69,
        mutability: 0.75,
      },
      {
        key: "timbre",
        name: "resonance exchange",
        rule: "timbres trade energy through resonance and damping so one spectrum can feed, starve, or poison another",
        jurisdiction: "timbre",
        strength: 0.73,
        persistence: 0.64,
        mutability: 0.78,
      },
      {
        key: "dynamics",
        name: "pressure-regulated dynamics",
        rule: "dynamic level follows accumulated pressure and release rate rather than expressive swell conventions",
        jurisdiction: "dynamics",
        strength: 0.7,
        persistence: 0.61,
        mutability: 0.77,
      },
      {
        key: "repetition",
        name: "maintenance recurrence",
        rule: "a figure repeats only while the processes supporting it remain above maintenance threshold; otherwise it degrades or speciaties",
        jurisdiction: "repetition",
        strength: 0.71,
        persistence: 0.66,
        mutability: 0.8,
      },
    ],
    invariants: [
      {
        key: "process-law",
        text: "Persistent musical identity must always be explained by active maintenance processes, never by static section labels alone.",
        level: "STRONG",
        traitKey: "metabolic-anchor",
      },
    ],
  },
] as const;

export function getSunoSeed(id: string): SunoSeed | undefined {
  return SUNO_SEEDS.find((seed) => seed.id === id);
}

export function createSeedOrigin(seedId: string): OrganismState {
  const seed = getSunoSeed(seedId);
  if (!seed) throw new Error(`Unknown Suno seed: ${seedId}`);

  const traits: Trait[] = seed.traits.map((trait, index) => ({
    id: `${seed.id}:trait:${trait.key || index}`,
    name: trait.name,
    rule: trait.rule,
    jurisdiction: trait.jurisdiction,
    strength: trait.strength,
    confidence: 0.96,
    persistence: trait.persistence,
    mutability: trait.mutability,
    source: "ORIGIN",
    recency: 0,
    locked: trait.locked,
  }));
  const traitByKey = new Map(seed.traits.map((trait, index) => [trait.key, traits[index]!]));
  const invariants: Invariant[] = seed.invariants.map((inv) => ({
    id: `${seed.id}:invariant:${inv.key}`,
    text: inv.text,
    level: inv.level,
    traitId: inv.traitKey ? traitByKey.get(inv.traitKey)?.id : undefined,
  }));

  return {
    id: `${seed.id}:generation:0`,
    version: 0,
    seedId: seed.id,
    generation: 0,
    name: seed.label,
    identity: seed.identity,
    playProjection: `${seed.description} This is generation zero; travel must transform this organism rather than replace it.`,
    labProjection: `Seed ${seed.id}. ${traits.length} traits, ${invariants.length} invariants, ${seed.phoneticRules?.length ?? 0} phonetic rules.`,
    features: { ...seed.features },
    traits,
    invariants,
    scars: [],
    relationships: [],
    memories: [],
    interpretations: [],
    debris: [],
    ancestry: [],
    phoneticRules: (seed.phoneticRules ?? []).map((rule) => ({ ...rule })),
    lastMutationDiff: undefined,
    uncertainty: 0.08,
    createdAt: Date.now(),
    installedMind: null,
    mindHistory: [],
    retiredMetrics: [],
  };
}
