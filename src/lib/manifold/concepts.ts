import type { Concept, Features } from "./types";

export type { Concept };

function f(
  semanticX: number,
  semanticY: number,
  structure: number,
  failure: number,
  memory: number,
  temporal: number,
  topology: number,
  energy: number,
): Features {
  return { semanticX, semanticY, structure, failure, memory, temporal, topology, energy };
}

export const ATLAS: Concept[] = [
  {
    id: "deja-vu",
    label: "Déjà Vu",
    aliases: ["deja vu", "déjà vu", "dejavu"],
    whatItDoes:
      "Forces recurrence to reconstruct from the immediately previous instance rather than from origin, so sameness is a recognition error.",
    clicheForbidden: ["mysterious", "eerie deja", "lyrics about deja vu", "you've been here before"],
    donations: [
      {
        jurisdiction: "repetition",
        name: "reconstructive return",
        rule: "each recurrence is rebuilt from the immediately previous version, never from the original",
        rewrite: "returns no longer copy origin; each cycle is a reconstruction of the last cycle",
      },
      {
        jurisdiction: "repetition",
        name: "false recognition",
        rule: "the listener is handed the feeling of prior knowledge without a matching prior event",
        rewrite: "memory cues fire one cycle early, claiming familiarity the material has not earned",
      },
      {
        jurisdiction: "form",
        name: "offset loop",
        rule: "formal returns land a fraction late or early so the loop never seals",
        rewrite: "sectional returns misalign with their first appearance by a small, consistent offset",
      },
    ],
    features: f(-0.15, 0.72, 0.45, 0.55, 0.92, 0.78, 0.4, 0.35),
    failureMode: "recognition without content — the loop claims to be memory and is empty",
    fracturePlane: "repetition",
    mass: 0.7,
    seeded: true,
  },
  {
    id: "tardigrade",
    label: "Tardigrade",
    aliases: ["tardigrades", "water bear", "moss piglet"],
    whatItDoes:
      "Suspends metabolism of a core configuration under hostile conditions, then reactivates that same core rather than improvising a new one.",
    clicheForbidden: ["cute", "water bear", "microscopic", "nature documentary"],
    donations: [
      {
        jurisdiction: "structure",
        name: "cryptobiotic core",
        rule: "when conditions turn hostile, halt activity and preserve a compact inner configuration",
        rewrite: "instead of adapting in place, the existing core powers down and waits",
      },
      {
        jurisdiction: "dynamics",
        name: "suspension under stress",
        rule: "amplitude collapses toward silence without deleting the object being protected",
        rewrite: "loud or active material is allowed to go dormant rather than develop",
      },
      {
        jurisdiction: "form",
        name: "reactivation after cessation",
        rule: "after an apparent stop, the same configuration resumes from its stored state, not a new beginning",
        rewrite: "stops are storage, not endings; resumption uses the stored core",
      },
    ],
    features: f(0.55, 0.62, 0.88, 0.22, 0.7, 0.4, 0.55, 0.18),
    failureMode: "refuses to die, so it also refuses to change — preservation becomes stasis",
    fracturePlane: "dynamics",
    mass: 0.85,
    seeded: true,
  },
  {
    id: "wasp-nest",
    label: "Wasp Nest",
    aliases: ["wasp nest", "wasps", "wasp", "hornet nest", "paper nest"],
    whatItDoes:
      "Distributes a single function across many small cells that coordinate entries and defend the structure, not the individuals.",
    clicheForbidden: ["buzzing synth", "insect sounds", "wasp lyrics", "swarm pad"],
    donations: [
      {
        jurisdiction: "texture",
        name: "cellular packing",
        rule: "material is partitioned into many small similar cells rather than one continuous layer",
        rewrite: "the existing texture is broken into adjacent cells that share a wall but not a voice",
      },
      {
        jurisdiction: "rhythm",
        name: "coordinated entries",
        rule: "attacks arrive as staggered group entries, not a single downbeat",
        rewrite: "the pulse's attacks split into offset group entries that imply a hive rather than a drummer",
      },
      {
        jurisdiction: "structure",
        name: "paper architecture",
        rule: "load-bearing is thin, hexagonal, and surprisingly strong until a fracture plane is found",
        rewrite: "support is redistributed into a thin repeating lattice instead of a single beam",
      },
    ],
    features: f(0.62, -0.35, 0.7, 0.68, 0.3, 0.45, 0.9, 0.72),
    failureMode: "one broken cell cascades; defense of the nest can destroy the nest",
    fracturePlane: "texture",
    mass: 0.75,
    seeded: true,
  },
  {
    id: "void",
    label: "The Void",
    aliases: ["void", "the void", "nothing", "vacuum"],
    whatItDoes:
      "Removes reference, continuity, and expected response until remaining objects must justify their own existence without surroundings.",
    clicheForbidden: ["dark ambient", "drone", "spacey pads", "empty void", "cosmic"],
    donations: [
      {
        jurisdiction: "harmony",
        name: "reference collapse",
        rule: "remove the anchoring function of a tonic or home chord without substituting a new one",
        rewrite: "the current harmonic home is deleted; remaining pitches must stand without it",
      },
      {
        jurisdiction: "production",
        name: "informational vacuum",
        rule: "strip density, reverb tails, and answering layers so events do not receive a reply",
        rewrite: "surrounding layers that answered the motif are removed; the motif is left unanswered",
      },
      {
        jurisdiction: "spatial",
        name: "loss of orientation",
        rule: "left/right and near/far cease to be reliable maps; placement becomes unmarked",
        rewrite: "spatial cues that located the figure are withdrawn",
      },
    ],
    features: f(-0.82, -0.55, 0.15, 0.9, 0.12, 0.35, 0.08, 0.1),
    failureMode: "so much is removed that nothing remains to be transformed",
    fracturePlane: "harmony",
    mass: 0.95,
    seeded: true,
  },
  {
    id: "caffeine",
    label: "Caffeine",
    aliases: ["caffeine", "coffee", "espresso"],
    whatItDoes:
      "Advances the clock of an existing system: onset lag, borrowed energy, then a crash that the original pulse must survive.",
    clicheForbidden: ["fast bpm", "coffee shop", "jittery coffee", "espresso", "upbeat"],
    donations: [
      {
        jurisdiction: "time",
        name: "borrowed tempo",
        rule: "the clock runs ahead of the body's actual energy, then owes a deficit",
        rewrite: "the existing clock is pushed forward without adding new events to justify the speed",
      },
      {
        jurisdiction: "articulation",
        name: "onset lag then snap",
        rule: "attacks arrive late, then overcorrect into clipped fronts",
        rewrite: "articulation of the current figure develops a late-then-early error",
      },
      {
        jurisdiction: "dynamics",
        name: "crash as structure",
        rule: "a scheduled collapse in energy is part of the form, not an accident",
        rewrite: "the dynamic arc is rewritten so a drop is owed after the borrowed peak",
      },
    ],
    features: f(0.38, -0.7, 0.4, 0.74, 0.2, 0.88, 0.35, 0.93),
    failureMode: "the system spends energy it does not have and the pulse fails on the debt",
    fracturePlane: "time",
    mass: 0.45,
    seeded: true,
  },
  {
    id: "circus",
    label: "Circus",
    aliases: ["circus", "circus freaks", "big top", "sideshow"],
    whatItDoes:
      "Runs multiple simultaneous acts inside a hard ring-boundary, with staged danger that must resolve as spectacle, not accident.",
    clicheForbidden: ["calliope", "carnival organ", "big top", "clown", "circus music"],
    donations: [
      {
        jurisdiction: "form",
        name: "ring as boundary",
        rule: "all action is confined to a circular arena; leaving the ring is a structural event",
        rewrite: "the existing form is given a hard perimeter that material may not casually cross",
      },
      {
        jurisdiction: "texture",
        name: "simultaneous acts",
        rule: "two or three independent procedures occupy the same time without blending into one texture",
        rewrite: "layers that were supportive become competing acts that refuse to mix",
      },
      {
        jurisdiction: "performance",
        name: "staged danger",
        rule: "risk is displayed and timed; the gasp is a scheduled function",
        rewrite: "the performance of the current material is rewritten as a timed risk, not a confession",
      },
    ],
    features: f(0.72, 0.18, 0.62, 0.5, 0.25, 0.55, 0.68, 0.8),
    failureMode: "spectacle consumes the act; the ring remains and the performer does not",
    fracturePlane: "performance",
    mass: 0.6,
    seeded: true,
  },
  {
    id: "mad-scientist",
    label: "Mad Scientist",
    aliases: ["mad scientist", "mad science", "scientist"],
    whatItDoes:
      "Iterates an illegal experiment on the current apparatus: each trial mutates the method, ethics optional, the lab notebook is the form.",
    clicheForbidden: ["theremin", "evil laugh", "lab coat", "mad science lyrics"],
    donations: [
      {
        jurisdiction: "form",
        name: "lab-notebook form",
        rule: "sections are trials; each trial records a method change rather than a chorus return",
        rewrite: "repeats become numbered trials that alter one variable at a time",
      },
      {
        jurisdiction: "timbre",
        name: "apparatus over intuition",
        rule: "tone is produced by a procedure (patch, process, misuse) rather than a chosen color",
        rewrite: "existing timbre is treated as an instrument to be misused, not a palette to paint with",
      },
      {
        jurisdiction: "repetition",
        name: "unethical iteration",
        rule: "the same subject is run again after an unsafe modification",
        rewrite: "recurrence now includes a modification that should not have been allowed",
      },
    ],
    features: f(0.22, 0.08, 0.5, 0.6, 0.48, 0.5, 0.42, 0.77),
    failureMode: "the experiment succeeds and the original subject is no longer recoverable",
    fracturePlane: "form",
    mass: 0.55,
    seeded: true,
  },
  {
    id: "nostalgia",
    label: "Nostalgia",
    aliases: ["nostalgia", "nostalgic"],
    whatItDoes:
      "Recalls a past that is reconstructed to be kinder than the record, so memory itself is the distortion engine.",
    clicheForbidden: ["vinyl crackle", "warm analog", "lofi", "good old days"],
    donations: [
      {
        jurisdiction: "repetition",
        name: "sweetened recall",
        rule: "retrieved material is rebuilt with reduced friction and increased glow relative to the ledger",
        rewrite: "when a prior figure returns, it is easier and kinder than it was when first stored",
      },
      {
        jurisdiction: "harmony",
        name: "retrospective tonic",
        rule: "a home is assigned after the fact to events that did not have one",
        rewrite: "harmonic wandering is later claimed as having always belonged to a home",
      },
      {
        jurisdiction: "vocal",
        name: "unreliable narrator",
        rule: "the voice reports a past it cannot have witnessed at this fidelity",
        rewrite: "vocal delivery asserts memory where the music only has reconstruction",
      },
    ],
    features: f(-0.35, 0.85, 0.4, 0.42, 0.95, 0.7, 0.3, 0.28),
    failureMode: "the sweetened version overwrites the ledger and the original cannot be recalled",
    fracturePlane: "repetition",
    mass: 0.65,
    seeded: true,
  },
  {
    id: "astral-plane",
    label: "Astral Plane",
    aliases: ["astral plane", "astral", "the astral"],
    whatItDoes:
      "Makes location observer-dependent: adjacency is granted by attention, not by shared coordinates, so there is no canonical here.",
    clicheForbidden: ["new age", "singing bowls", "cosmic journey", "astral lyrics"],
    donations: [
      {
        jurisdiction: "spatial",
        name: "observer-dependent place",
        rule: "position in the stereo/depth field depends on which voice is currently attended",
        rewrite: "fixed placement is replaced by placement that moves when focus moves",
      },
      {
        jurisdiction: "harmony",
        name: "non-local adjacency",
        rule: "distant functions may sit next to each other without a modulating corridor",
        rewrite: "harmonic neighbors are no longer required to share a corridor",
      },
      {
        jurisdiction: "form",
        name: "no canonical here",
        rule: "the piece refuses a single home-section; arrival is always from a particular damaged angle",
        rewrite: "the destination section is rewritten as encountered-by-this-traveler, not as a place",
      },
    ],
    features: f(-0.6, 0.35, 0.28, 0.38, 0.55, 0.6, 0.22, 0.4),
    failureMode: "without a here, nothing can arrive; the traveler dissolves into attention",
    fracturePlane: "spatial",
    mass: 0.5,
    seeded: true,
  },
  {
    id: "thin-film",
    label: "Thin-Film Interference",
    aliases: ["thin-film interference", "thin film", "interference", "iridescence"],
    whatItDoes:
      "Duplicates a wave with a tiny offset so phase difference, not new material, decides what is amplified or cancelled.",
    clicheForbidden: ["shimmering", "rainbow", "holographic", "dreamy", "iridescent pads"],
    donations: [
      {
        jurisdiction: "timbre",
        name: "phase cancellation",
        rule: "near-identical copies with tiny delay reinforce some bands and cancel others",
        rewrite: "the current tone is doubled at a slight offset so its spectrum becomes angle-dependent",
      },
      {
        jurisdiction: "melody",
        name: "thickness as color",
        rule: "small changes in interval or delay produce large changes in apparent color",
        rewrite: "ornament is replaced by micro-adjustment of doubling distance",
      },
      {
        jurisdiction: "spatial",
        name: "angle-dependent surface",
        rule: "the same object presents a different audible surface depending on listening position",
        rewrite: "a stable object is given a surface that changes with viewpoint rather than with time",
      },
    ],
    features: f(-0.05, -0.22, 0.58, 0.33, 0.4, 0.48, 0.6, 0.44),
    failureMode: "complete cancellation: the object is present and inaudible",
    fracturePlane: "timbre",
    mass: 0.5,
    seeded: true,
  },
  {
    id: "string-bikini",
    label: "String Bikini",
    aliases: ["string bikini", "bikini"],
    whatItDoes:
      "Supports a large exposed region with minimal connective material; tension concentrates at tiny attachment points.",
    clicheForbidden: ["sexy", "beach", "summer", "surf guitar", "sensual"],
    donations: [
      {
        jurisdiction: "texture",
        name: "minimal connective support",
        rule: "most of the field is uncovered; a few thin lines carry the entire load",
        rewrite: "supporting layers are reduced until only attachment lines remain",
      },
      {
        jurisdiction: "structure",
        name: "tension at attachments",
        rule: "stress concentrates at two or three nodes; if a node fails, coverage collapses",
        rewrite: "structural weight moves onto a few remaining nodes of the current figure",
      },
      {
        jurisdiction: "dynamics",
        name: "exposed region",
        rule: "large areas of silence or raw signal sit next to the thin supports without being filled",
        rewrite: "gaps around the figure are left uncovered on purpose",
      },
    ],
    features: f(0.15, -0.48, 0.35, 0.58, 0.18, 0.3, 0.25, 0.5),
    failureMode: "an attachment point fails and the exposed region has nothing left to hold it",
    fracturePlane: "structure",
    mass: 0.35,
    seeded: true,
  },
  {
    id: "rabies",
    label: "Rabies",
    aliases: ["rabies"],
    whatItDoes:
      "Installs an irreversible progression: hydrophobia of the organism's own medium, agitation that overrides prior goals.",
    clicheForbidden: ["growling", "animal sounds", "horror movie", "rabid lyrics"],
    donations: [
      {
        jurisdiction: "vocal",
        name: "hydrophobia of medium",
        rule: "the voice begins to refuse the substance it must travel through (air, words, pitch)",
        rewrite: "the current vocal behavior develops an aversion to its own carrying medium",
      },
      {
        jurisdiction: "rhythm",
        name: "overriding agitation",
        rule: "a secondary pulse interrupts and eventually commandeers the primary pulse",
        rewrite: "the existing pulse is interrupted by a more urgent, less coordinated pulse",
      },
      {
        jurisdiction: "form",
        name: "irreversible stages",
        rule: "once a stage is entered it cannot be undone; later stages only know later stages",
        rewrite: "formal sections become a one-way disease course",
      },
    ],
    features: f(0.78, -0.12, 0.48, 0.88, 0.35, 0.62, 0.5, 0.85),
    failureMode: "the host's original goal is fully overwritten; only the progression remains",
    fracturePlane: "vocal",
    mass: 0.7,
    seeded: true,
  },
  {
    id: "bisous",
    label: "Bisous",
    aliases: ["bisous", "bisou", "kiss", "kisses"],
    whatItDoes:
      "Performs brief surface contact that claims intimacy it does not structurally possess; the ritual is the entire attachment.",
    clicheForbidden: ["french", "romantic", "kissing sounds", "love song", "chanson"],
    donations: [
      {
        jurisdiction: "articulation",
        name: "brief contact",
        rule: "events touch and release immediately; sustain is socially excessive",
        rewrite: "held notes or long attacks are rewritten as short claims of contact",
      },
      {
        jurisdiction: "form",
        name: "ritual as structure",
        rule: "a small social procedure (approach, contact, withdrawal) is the entire section",
        rewrite: "developmental sections collapse into a greeting ritual",
      },
      {
        jurisdiction: "harmony",
        name: "surface-only attachment",
        rule: "cadences suggest closeness without shared harmonic function underneath",
        rewrite: "harmonic closeness is performed at the surface and not supported below",
      },
    ],
    features: f(-0.28, 0.22, 0.32, 0.3, 0.5, 0.42, 0.38, 0.36),
    failureMode: "the claim of intimacy is believed; there is still no shared structure",
    fracturePlane: "articulation",
    mass: 0.3,
    seeded: true,
  },
  {
    id: "getting-high",
    label: "Getting High",
    aliases: ["getting high", "get high", "high"],
    whatItDoes:
      "Raises the operating altitude of the current system so load-bearing connections loosen; return is delayed and slightly wrong.",
    clicheForbidden: ["stoner", "weed", "trippy", "psychedelic rock", "wah"],
    donations: [
      {
        jurisdiction: "pitch",
        name: "altitude without support",
        rule: "register rises while the bass or grounding function thins",
        rewrite: "the current pitch center is lifted and its support is not invited to follow",
      },
      {
        jurisdiction: "time",
        name: "delayed return",
        rule: "phrases take longer to come down than they took to go up",
        rewrite: "the clock of descent is slower than the clock of ascent",
      },
      {
        jurisdiction: "texture",
        name: "loosened load-bearing",
        rule: "connections that held the arrangement together are allowed to float",
        rewrite: "binding layers are relaxed so figures drift relative to each other",
      },
    ],
    features: f(-0.42, 0.05, 0.22, 0.47, 0.4, 0.75, 0.2, 0.6),
    failureMode: "altitude is achieved and there is no way to land the original connections",
    fracturePlane: "pitch",
    mass: 0.4,
    seeded: true,
  },
  {
    id: "bureaucracy",
    label: "Bureaucracy",
    aliases: ["bureaucracy", "bureaucratic", "paperwork", "the office"],
    whatItDoes:
      "Inserts procedural viscosity: nothing proceeds until a stamp, a form, a waiting period. Authorization becomes the rhythm.",
    clicheForbidden: ["office sounds", "keyboard clacks", "corporate", "hold music"],
    donations: [
      {
        jurisdiction: "meter",
        name: "authorization as downbeat",
        rule: "events may not occur until a permission-event (stamp, rest, spoken clearance) precedes them",
        rewrite: "the existing meter is rewritten so attacks wait on a clearance click",
      },
      {
        jurisdiction: "form",
        name: "procedural viscosity",
        rule: "transitions require filling out an intermediate section that does no musical work except permit the next",
        rewrite: "direct sectional joins are replaced by paperwork-bridges",
      },
      {
        jurisdiction: "repetition",
        name: "form-before-function",
        rule: "the same request is filed multiple times; duplicates are not errors, they are protocol",
        rewrite: "repeats become filings rather than intensifications",
      },
    ],
    features: f(0.08, -0.78, 0.82, 0.4, 0.62, 0.2, 0.75, 0.15),
    failureMode: "the procedure is satisfied and the original request has expired",
    fracturePlane: "meter",
    mass: 0.8,
    seeded: true,
  },
  {
    id: "butterflies",
    label: "Butterflies",
    aliases: ["butterflies", "butterfly"],
    whatItDoes:
      "Requires a total reorganization between stages: the adult form does not contain the larval form except as spent fuel.",
    clicheForbidden: ["fluttery", "delicate", "spring", "pretty", "wings"],
    donations: [
      {
        jurisdiction: "form",
        name: "metamorphic cut",
        rule: "one section must be unrecognizable as a continuation of the previous, yet caused by it",
        rewrite: "development is replaced by a stage-change that discards the prior body",
      },
      {
        jurisdiction: "motif",
        name: "spent larval motif",
        rule: "an earlier motif is used up as fuel and does not return except as a chemical trace",
        rewrite: "the current motif is consumed to pay for a later figure and may not recur intact",
      },
      {
        jurisdiction: "articulation",
        name: "taxis toward light",
        rule: "motion is biased toward a single attractor (brightness, register, density) irrespective of local harmony",
        rewrite: "local goals are subordinated to a phototactic pull",
      },
    ],
    features: f(0.48, 0.48, 0.3, 0.52, 0.28, 0.58, 0.33, 0.55),
    failureMode: "metamorphosis completes and the adult has no memory of why it was built",
    fracturePlane: "motif",
    mass: 0.4,
    seeded: true,
  },
];

const byId = new Map(ATLAS.map((c) => [c.id, c]));

export function getConcept(id: string): Concept | undefined {
  return byId.get(id);
}

export function allConcepts(extra: Concept[] = []): Concept[] {
  if (extra.length === 0) return ATLAS;
  const seen = new Set(ATLAS.map((c) => c.id));
  const merged = [...ATLAS];
  for (const c of extra) {
    if (!seen.has(c.id)) {
      merged.push(c);
      seen.add(c.id);
    }
  }
  return merged;
}

export function findConcept(
  phrase: string,
  extra: Concept[] = [],
): Concept | undefined {
  const n = normalizeName(phrase);
  if (!n) return undefined;
  const pool = allConcepts(extra);
  for (const c of pool) {
    if (normalizeName(c.label) === n || c.aliases.some((a) => normalizeName(a) === n)) {
      return c;
    }
  }
  for (const c of pool) {
    if (n.includes(normalizeName(c.label))) return c;
    if (c.aliases.some((a) => n.includes(normalizeName(a)))) return c;
  }
  return undefined;
}

export function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugFromLabel(label: string): string {
  return normalizeName(label).replace(/\s+/g, "-").slice(0, 40) || "unnamed";
}

export function containsForbidden(text: string, concept: Concept): boolean {
  const n = text.toLowerCase();
  return concept.clicheForbidden.some((c) => n.includes(c.toLowerCase()));
}

export function sourceWordIn(text: string, concept: Concept): boolean {
  const n = normalizeName(text);
  if (n.includes(normalizeName(concept.label))) return true;
  return concept.aliases.some((a) => {
    const an = normalizeName(a);
    return an.length > 3 && n.includes(an);
  });
}
