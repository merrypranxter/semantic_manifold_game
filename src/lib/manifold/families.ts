import type { Features, Jurisdiction } from "./types";

export type FamilyId =
  | "viscera"
  | "weather"
  | "machines"
  | "office"
  | "organisms"
  | "physics"
  | "architecture"
  | "domestic"
  | "cloth"
  | "optics"
  | "geology"
  | "water"
  | "heat"
  | "time"
  | "damage"
  | "plants"
  | "insects"
  | "ritual"
  | "language"
  | "sleep"
  | "food"
  | "math"
  | "weapons"
  | "electric"
  | "waste"
  | "labor"
  | "childhood"
  | "signal"
  | "minerals"
  | "rare"
  | "common";

export type FamilyDef = {
  id: FamilyId;
  label: string;
  centroid: Features;
  spread: number;
  mass: number;
  fracturePlane: Jurisdiction;
  whatItDoes: string;
  failureMode: string;
  cliche: string[];
  donations: {
    jurisdiction: Jurisdiction;
    name: string;
    rule: string;
    rewrite: string;
  }[];
};

const c = (
  semanticX: number,
  semanticY: number,
  structure: number,
  failure: number,
  memory: number,
  temporal: number,
  topology: number,
  energy: number,
): Features => ({
  semanticX,
  semanticY,
  structure,
  failure,
  memory,
  temporal,
  topology,
  energy,
});

export const FAMILIES: Record<FamilyId, FamilyDef> = {
  viscera: {
    id: "viscera",
    label: "Viscera",
    centroid: c(0.62, -0.12, 0.55, 0.58, 0.35, 0.48, 0.7, 0.62),
    spread: 0.22,
    mass: 0.7,
    fracturePlane: "texture",
    whatItDoes:
      "Forces interior systems to the surface: hidden plumbing becomes audible load-bearing, and leaks rewrite the arrangement.",
    failureMode: "the interior takes over and the outer form is only a sack",
    cliche: ["body horror", "guts lyrics", "medical drama"],
    donations: [
      { jurisdiction: "texture", name: "interior as surface", rule: "layers that were hidden become the audible face of the material", rewrite: "the current texture is turned inside-out so plumbing is the arrangement" },
      { jurisdiction: "pulse", name: "organ clock", rule: "attacks follow an involuntary interior clock rather than a counted meter", rewrite: "the pulse is rewritten as a bodily interval that does not care about bars" },
      { jurisdiction: "dynamics", name: "pressure leak", rule: "amplitude is a pressure system; drops are leaks, not fades", rewrite: "decays become loss of containment instead of performed diminuendo" },
    ],
  },
  weather: {
    id: "weather",
    label: "Weather",
    centroid: c(-0.52, 0.58, 0.28, 0.42, 0.3, 0.72, 0.25, 0.68),
    spread: 0.24,
    mass: 0.45,
    fracturePlane: "dynamics",
    whatItDoes:
      "Replaces intention with condition: the organism is a climate that arrives, saturates, and leaves on its own schedule.",
    failureMode: "the piece becomes only atmosphere and can no longer make a decision",
    cliche: ["rain sounds", "storm pad", "weather report"],
    donations: [
      { jurisdiction: "dynamics", name: "front passage", rule: "changes arrive as weather fronts — broad, unstoppable, then gone", rewrite: "sectional changes are environmental rather than authored cadences" },
      { jurisdiction: "texture", name: "saturation", rule: "density increases until nothing is dry, then thins without a cadence", rewrite: "texture is a humidity level, not an orchestration choice" },
      { jurisdiction: "time", name: "unscheduled arrival", rule: "events ignore barlines and obey a larger, slower pressure system", rewrite: "the clock is meteorological; local meter is downstream" },
    ],
  },
  machines: {
    id: "machines",
    label: "Machines",
    centroid: c(0.38, -0.52, 0.82, 0.48, 0.4, 0.35, 0.78, 0.55),
    spread: 0.2,
    mass: 0.75,
    fracturePlane: "meter",
    whatItDoes:
      "Installs cyclic work: a part repeats a job, wears, and only stops when a component shears.",
    failureMode: "the job continues after the purpose is gone; the machine outlives the request",
    cliche: ["industrial", "factory noises", "robot voice"],
    donations: [
      { jurisdiction: "meter", name: "duty cycle", rule: "time is partitioned into work/rest of a mechanism, not verse/chorus", rewrite: "meter becomes a duty cycle with wear on the on-phase" },
      { jurisdiction: "repetition", name: "tooled repeat", rule: "repeats are the same job done again, slightly more worn", rewrite: "loops accumulate mechanical play instead of intensifying" },
      { jurisdiction: "structure", name: "load path", rule: "one part carries the force; if it fails the function stops", rewrite: "arrangement is a load path, not a stack of colors" },
    ],
  },
  office: {
    id: "office",
    label: "Procedure",
    centroid: c(0.08, -0.78, 0.8, 0.38, 0.66, 0.18, 0.72, 0.16),
    spread: 0.18,
    mass: 0.7,
    fracturePlane: "form",
    whatItDoes:
      "Inserts procedural viscosity: nothing proceeds until a stamp, a wait, a duplicate filing.",
    failureMode: "the procedure is satisfied and the original request has expired",
    cliche: ["office sounds", "corporate", "hold music"],
    donations: [
      { jurisdiction: "form", name: "paperwork bridge", rule: "transitions require an intermediate section that only permits the next", rewrite: "direct joins are replaced by filings" },
      { jurisdiction: "meter", name: "clearance click", rule: "attacks wait on a permission-event", rewrite: "the downbeat is authorization" },
      { jurisdiction: "repetition", name: "duplicate filing", rule: "the same request is filed again; duplicates are protocol", rewrite: "repeats become copies for the file, not emphasis" },
    ],
  },
  organisms: {
    id: "organisms",
    label: "Organisms",
    centroid: c(0.52, 0.5, 0.58, 0.4, 0.55, 0.5, 0.6, 0.48),
    spread: 0.22,
    mass: 0.6,
    fracturePlane: "form",
    whatItDoes:
      "Treats the state as a living system with metabolism, defense, and a bias toward staying itself.",
    failureMode: "survival wins; the organism refuses the transformation that would have been interesting",
    cliche: ["nature documentary", "animal sounds", "organic ambient"],
    donations: [
      { jurisdiction: "form", name: "metabolic budget", rule: "every event costs energy that must be paid by a later quiet", rewrite: "development is a budget, not a narrative arc" },
      { jurisdiction: "structure", name: "self-repair", rule: "damage triggers patching with nearby material rather than a new idea", rewrite: "scars are closed with adjacent tissue" },
      { jurisdiction: "performance", name: "taxis", rule: "motion is biased toward an attractor irrespective of local harmony", rewrite: "local goals are subordinated to a biological pull" },
    ],
  },
  physics: {
    id: "physics",
    label: "Physics",
    centroid: c(0.12, 0.78, 0.7, 0.35, 0.28, 0.45, 0.55, 0.5),
    spread: 0.2,
    mass: 0.65,
    fracturePlane: "structure",
    whatItDoes:
      "Imposes a conservation law: something must be paid, transferred, or invariant while the rest moves.",
    failureMode: "the law is kept and the music can no longer violate it even when it should",
    cliche: ["science lecture", "lab coat", "nerdy"],
    donations: [
      { jurisdiction: "structure", name: "conserved quantity", rule: "if density rises here it must fall there; nothing is free", rewrite: "arrangement obeys a ledger of mass" },
      { jurisdiction: "time", name: "inertial lag", rule: "changes continue past the gesture that caused them", rewrite: "stops overshoot because mass does not halt on command" },
      { jurisdiction: "dynamics", name: "threshold event", rule: "nothing happens until a quantity is exceeded, then it happens all at once", rewrite: "crescendos are phase changes, not slopes" },
    ],
  },
  architecture: {
    id: "architecture",
    label: "Architecture",
    centroid: c(-0.18, -0.42, 0.88, 0.32, 0.6, 0.22, 0.85, 0.25),
    spread: 0.2,
    mass: 0.8,
    fracturePlane: "spatial",
    whatItDoes:
      "Builds rooms, load paths, and thresholds; the listener occupies a space rather than a timeline.",
    failureMode: "the building is complete and nobody is in it",
    cliche: ["cathedral reverb", "architectural ambient", "stone"],
    donations: [
      { jurisdiction: "spatial", name: "threshold", rule: "events are doorways: crossing changes the acoustic law", rewrite: "sections are rooms with different load-bearing" },
      { jurisdiction: "structure", name: "span", rule: "material is asked to cover distance with as little mass as it can afford", rewrite: "held material is a beam, not a pad" },
      { jurisdiction: "form", name: "circulation", rule: "return paths are corridors, not choruses", rewrite: "reprise is a walk back through the same hall, slightly tired" },
    ],
  },
  domestic: {
    id: "domestic",
    label: "Domestic",
    centroid: c(-0.68, -0.52, 0.45, 0.28, 0.7, 0.35, 0.4, 0.22),
    spread: 0.22,
    mass: 0.4,
    fracturePlane: "repetition",
    whatItDoes:
      "Installs an ordinary household function as load-bearing so the organism must keep working as furniture, not as a spectacle.",
    failureMode: "the useful object is so ordinary it disappears and takes the piece with it",
    cliche: ["cozy", "kitchen sounds", "homely"],
    donations: [
      { jurisdiction: "repetition", name: "chore cycle", rule: "small tasks recur because they must, not because they develop", rewrite: "hooks become chores with no audience" },
      { jurisdiction: "dynamics", name: "background appliance", rule: "a layer runs at a fixed low duty and is only noticed when it fails", rewrite: "one part is demoted to infrastructure" },
      { jurisdiction: "articulation", name: "used object", rule: "attacks have the wear of daily handling, not concert precision", rewrite: "edges are softened by use, not by reverb" },
    ],
  },
  cloth: {
    id: "cloth",
    label: "Cloth",
    centroid: c(-0.42, 0.08, 0.35, 0.3, 0.45, 0.4, 0.55, 0.28),
    spread: 0.2,
    mass: 0.35,
    fracturePlane: "texture",
    whatItDoes:
      "Covers, tensions, and wrinkles: structure is a surface under strain with gaps where the body shows.",
    failureMode: "coverage fails at the attachment points and the piece is only holes",
    cliche: ["fashion", "sexy", "silky synth"],
    donations: [
      { jurisdiction: "texture", name: "grain of weave", rule: "the surface has a direction; rubbing against the grain is a different sound than with it", rewrite: "texture is anisotropic" },
      { jurisdiction: "structure", name: "tension at points", rule: "load concentrates at tiny attachments; the field between them is slack", rewrite: "support is relocated to a few strained nodes" },
      { jurisdiction: "articulation", name: "drape", rule: "attacks fall according to weight, not according to a grid", rewrite: "phrasing hangs and folds" },
    ],
  },
  optics: {
    id: "optics",
    label: "Optics",
    centroid: c(0.22, 0.82, 0.5, 0.33, 0.38, 0.4, 0.48, 0.45),
    spread: 0.18,
    mass: 0.5,
    fracturePlane: "timbre",
    whatItDoes:
      "Splits, delays, or interferes the existing signal so tiny path differences rewrite the audible surface.",
    failureMode: "the image is only interference and the object underneath is lost",
    cliche: ["shimmer", "iridescent", "holographic", "dreamy"],
    donations: [
      { jurisdiction: "timbre", name: "path difference", rule: "a copy is delayed by a tiny offset so wavelengths reinforce or cancel", rewrite: "tone is an interference pattern, not a filter sweep" },
      { jurisdiction: "spatial", name: "angle of view", rule: "the same object yields a different surface depending on listening position", rewrite: "mix perspective is a viewing angle" },
      { jurisdiction: "motif", name: "thin duplicate", rule: "a motif is laid over itself slightly wrong", rewrite: "unison is forbidden; near-unison is the law" },
    ],
  },
  geology: {
    id: "geology",
    label: "Geology",
    centroid: c(0.72, -0.42, 0.9, 0.45, 0.8, 0.12, 0.7, 0.2),
    spread: 0.2,
    mass: 0.9,
    fracturePlane: "form",
    whatItDoes:
      "Slows time to deposition and fracture: layers accrue, then a plane shears the stack.",
    failureMode: "nothing happens on a human clock; the piece is a rock",
    cliche: ["earth ambient", "mountain", "epic"],
    donations: [
      { jurisdiction: "form", name: "stratigraphy", rule: "new material is laid on old and does not mix; history is a stack", rewrite: "sections are beds, not developments" },
      { jurisdiction: "time", name: "deep clock", rule: "the audible clock is a surface ripple on a much slower process", rewrite: "meter is weather on geology" },
      { jurisdiction: "structure", name: "fracture plane", rule: "the object is strong until one orientation of force splits it cleanly", rewrite: "failure is a plane, not a fade" },
    ],
  },
  water: {
    id: "water",
    label: "Water",
    centroid: c(-0.75, 0.22, 0.3, 0.35, 0.4, 0.6, 0.45, 0.4),
    spread: 0.22,
    mass: 0.4,
    fracturePlane: "rhythm",
    whatItDoes:
      "Takes the shape of the container, transmits pressure instantly, and never holds an edge without a bank.",
    failureMode: "everything dissolves into one medium and distinction drowns",
    cliche: ["water sfx", "ocean pad", "whale song"],
    donations: [
      { jurisdiction: "rhythm", name: "lapping", rule: "attacks are not on a grid; they arrive as returning edges of a medium", rewrite: "the pulse is a shoreline" },
      { jurisdiction: "texture", name: "incompressible mix", rule: "adding force here raises pressure everywhere", rewrite: "local accents flood the whole field" },
      { jurisdiction: "form", name: "container", rule: "shape is borrowed from whatever holds the material", rewrite: "form is a vessel, not a story" },
    ],
  },
  heat: {
    id: "heat",
    label: "Heat",
    centroid: c(0.82, 0.18, 0.4, 0.55, 0.25, 0.55, 0.3, 0.85),
    spread: 0.2,
    mass: 0.55,
    fracturePlane: "timbre",
    whatItDoes:
      "Agitates molecules of the current system: motion increases, edges blur, and some parts oxidize.",
    failureMode: "the object is cooked until only residue remains",
    cliche: ["fire sfx", "hot guitar", "burning"],
    donations: [
      { jurisdiction: "timbre", name: "thermal broadening", rule: "pitch and noise bands widen as energy rises", rewrite: "tone is a temperature, not a vowel" },
      { jurisdiction: "dynamics", name: "oxidation", rule: "exposed material is permanently changed by the energy, not restored on cooling", rewrite: "loudness leaves a chemical scar" },
      { jurisdiction: "dynamics", name: "convection", rule: "hot material rises and is replaced from below", rewrite: "register is a thermal column" },
    ],
  },
  time: {
    id: "time",
    label: "Time",
    centroid: c(-0.22, 0.68, 0.5, 0.4, 0.85, 0.92, 0.35, 0.3),
    spread: 0.2,
    mass: 0.55,
    fracturePlane: "time",
    whatItDoes:
      "Makes the clock itself the instrument: lag, debt, return, and the feeling that a beat is owed.",
    failureMode: "the clock is interesting and the content is only a hand",
    cliche: ["ticking", "clock samples", "time lyrics"],
    donations: [
      { jurisdiction: "time", name: "debt", rule: "an early event must be paid later; lateness is not error, it is the system", rewrite: "phrasing carries arrears" },
      { jurisdiction: "repetition", name: "almost return", rule: "returns land close enough to claim identity and far enough to be a lie", rewrite: "reprise is a near miss" },
      { jurisdiction: "form", name: "elapsed room", rule: "sections are durations occupied, not ideas completed", rewrite: "form is time spent, not argument" },
    ],
  },
  damage: {
    id: "damage",
    label: "Damage",
    centroid: c(0.7, -0.72, 0.4, 0.88, 0.55, 0.4, 0.45, 0.6),
    spread: 0.22,
    mass: 0.65,
    fracturePlane: "structure",
    whatItDoes:
      "Removes load-bearing and leaves the remainder to work around the hole. Damage is not decoration; it is a new architecture.",
    failureMode: "there is no remainder; wreckage is total",
    cliche: ["glitch", "broken", "distortion for mood"],
    donations: [
      { jurisdiction: "structure", name: "missing member", rule: "a necessary part is gone; neighbors take its job badly", rewrite: "arrangement is a repair, not a design" },
      { jurisdiction: "articulation", name: "torn edge", rule: "attacks do not complete; they fail mid-stroke", rewrite: "envelopes are interrupted" },
      { jurisdiction: "memory", name: "scar as feature", rule: "the wound is now the identifying mark of the object", rewrite: "identity migrates into the damage" },
    ],
  },
  plants: {
    id: "plants",
    label: "Plants",
    centroid: c(-0.38, 0.42, 0.55, 0.28, 0.5, 0.55, 0.62, 0.25),
    spread: 0.22,
    mass: 0.5,
    fracturePlane: "form",
    whatItDoes:
      "Grows toward a resource and lignifies: early softness becomes a permanent woody decision.",
    failureMode: "growth continues until the form is only wood and can no longer turn",
    cliche: ["forest ambience", "folk acoustic", "green"],
    donations: [
      { jurisdiction: "form", name: "phototropism", rule: "development leans toward a single resource (light, air, register)", rewrite: "the arc is a lean, not a plot" },
      { jurisdiction: "structure", name: "lignify", rule: "once a decision hardens it cannot be unmade without breaking", rewrite: "early softness becomes irreversible timber" },
      { jurisdiction: "rhythm", name: "seasonal pulse", rule: "activity clusters in seasons with long dormant intervals", rewrite: "the groove hibernates" },
    ],
  },
  insects: {
    id: "insects",
    label: "Insects",
    centroid: c(0.58, -0.28, 0.65, 0.62, 0.3, 0.48, 0.88, 0.7),
    spread: 0.2,
    mass: 0.55,
    fracturePlane: "rhythm",
    whatItDoes:
      "Distributes one function across many small bodies that coordinate without a conductor.",
    failureMode: "coordination becomes swarm and the individual line is eaten",
    cliche: ["buzz", "insect sfx", "swarm pad"],
    donations: [
      { jurisdiction: "rhythm", name: "staggered entry", rule: "attacks arrive as a group of near-misses, not one downbeat", rewrite: "the pulse is a cloud of entries" },
      { jurisdiction: "texture", name: "cellular packing", rule: "space is tiled with many similar cells sharing walls", rewrite: "texture is a comb, not a wash" },
      { jurisdiction: "performance", name: "hive defense", rule: "threat to one cell recruits the others; response is disproportionate", rewrite: "accents cascade into the whole colony" },
    ],
  },
  ritual: {
    id: "ritual",
    label: "Ritual",
    centroid: c(-0.7, 0.7, 0.72, 0.3, 0.78, 0.55, 0.5, 0.35),
    spread: 0.2,
    mass: 0.6,
    fracturePlane: "form",
    whatItDoes:
      "Replaces development with a procedure that must be performed in order, whether or not it means anything this time.",
    failureMode: "the rite is perfect and empty",
    cliche: ["choir", "religious", "occult"],
    donations: [
      { jurisdiction: "form", name: "prescribed order", rule: "steps cannot be swapped; skipping a step voids the result", rewrite: "form is liturgy" },
      { jurisdiction: "repetition", name: "this-time-again", rule: "the same acts return because the calendar requires them", rewrite: "repeats are obligations" },
      { jurisdiction: "performance", name: "witnessed act", rule: "the gesture only counts if it is done as if someone is watching", rewrite: "articulation is ceremonial, even when alone" },
    ],
  },
  language: {
    id: "language",
    label: "Language",
    centroid: c(-0.48, -0.18, 0.5, 0.4, 0.72, 0.45, 0.4, 0.35),
    spread: 0.22,
    mass: 0.5,
    fracturePlane: "vocal",
    whatItDoes:
      "Turns material into utterance: syntax, interruption, mistranslation, and the gap between saying and meaning.",
    failureMode: "it talks and says nothing that can be used as structure",
    cliche: ["spoken word", "talking", "poet voice"],
    donations: [
      { jurisdiction: "vocal", name: "syntax over sense", rule: "phrase shape is grammatical even when the content is emptied", rewrite: "melody follows clause structure" },
      { jurisdiction: "articulation", name: "glottal cut", rule: "ideas are stopped mid-word; meaning is the cut", rewrite: "lines abort and the abort is the sense" },
      { jurisdiction: "memory", name: "mistranslation", rule: "a later voice restates an earlier one wrongly on purpose", rewrite: "recall is a bad translation that becomes canon" },
    ],
  },
  sleep: {
    id: "sleep",
    label: "Sleep",
    centroid: c(-0.18, 0.85, 0.25, 0.35, 0.9, 0.7, 0.22, 0.18),
    spread: 0.2,
    mass: 0.35,
    fracturePlane: "memory",
    whatItDoes:
      "Withdraws monitoring: processes continue without a watcher, and morning reconstruction is a lie told about the night.",
    failureMode: "nothing can be verified; the piece dreams itself into mush",
    cliche: ["lullaby", "dreamy", "sleep music"],
    donations: [
      { jurisdiction: "memory", name: "unwatched process", rule: "material continues without being checked against origin", rewrite: "accuracy is not required while unobserved" },
      { jurisdiction: "dynamics", name: "hypnagogic drop", rule: "amplitude and continuity fail together at the edge of a cycle", rewrite: "the fall is a sleep-onset, not a cadence" },
      { jurisdiction: "form", name: "morning alibi", rule: "the next section claims to remember the last and is slightly wrong", rewrite: "reprise is a reconstructed night" },
    ],
  },
  food: {
    id: "food",
    label: "Food",
    centroid: c(-0.8, -0.22, 0.4, 0.35, 0.45, 0.4, 0.35, 0.5),
    spread: 0.22,
    mass: 0.4,
    fracturePlane: "form",
    whatItDoes:
      "Subjects material to a recipe: cut, heat, bind, rest. The original is not served; a prepared version is.",
    failureMode: "the recipe is followed and the ingredient is gone",
    cliche: ["cooking show", "hungry", "food song"],
    donations: [
      { jurisdiction: "form", name: "mise en place", rule: "parts are prepared separately and only combined at the end", rewrite: "development is delayed until plating" },
      { jurisdiction: "texture", name: "emulsion", rule: "two unmixable layers are forced into a temporary suspension", rewrite: "texture is a fragile bind, not a blend" },
      { jurisdiction: "time", name: "rest the dough", rule: "a waiting period is load-bearing; skipping it ruins the structure", rewrite: "silence is chemistry, not a pause" },
    ],
  },
  math: {
    id: "math",
    label: "Math",
    centroid: c(0.02, 0.38, 0.85, 0.22, 0.4, 0.4, 0.8, 0.25),
    spread: 0.18,
    mass: 0.6,
    fracturePlane: "structure",
    whatItDoes:
      "Replaces taste with a relation that must hold: ratio, remainder, inversion, proof.",
    failureMode: "the relation is elegant and inaudible",
    cliche: ["math rock", "counting", "nerdy"],
    donations: [
      { jurisdiction: "structure", name: "invariant relation", rule: "a ratio is kept while other properties are allowed to move", rewrite: "identity is a proportion" },
      { jurisdiction: "meter", name: "remainder", rule: "groupings do not divide evenly; the leftover becomes the next downbeat", rewrite: "meter is modular arithmetic" },
      { jurisdiction: "harmony", name: "inverse", rule: "a later event is the structural inverse of an earlier one, not its opposite mood", rewrite: "answer is inversion, not contrast" },
    ],
  },
  weapons: {
    id: "weapons",
    label: "Weapons",
    centroid: c(0.85, -0.22, 0.55, 0.75, 0.3, 0.35, 0.4, 0.88),
    spread: 0.18,
    mass: 0.7,
    fracturePlane: "dynamics",
    whatItDoes:
      "Concentrates force into a brief, directional event designed to end a state.",
    failureMode: "everything is an attack and there is no remaining state to inhabit",
    cliche: ["battle", "war drums", "gunshots"],
    donations: [
      { jurisdiction: "dynamics", name: "aimed force", rule: "energy is spent in a short vector, not a field", rewrite: "loudness is a strike" },
      { jurisdiction: "articulation", name: "edge", rule: "the beginning of the event does all the work; sustain is leftover", rewrite: "attacks are the piece" },
      { jurisdiction: "form", name: "after the shot", rule: "the next section is whatever survives the aimed event", rewrite: "form is aftermath" },
    ],
  },
  electric: {
    id: "electric",
    label: "Electric",
    centroid: c(0.42, 0.22, 0.55, 0.5, 0.25, 0.55, 0.6, 0.8),
    spread: 0.2,
    mass: 0.55,
    fracturePlane: "timbre",
    whatItDoes:
      "Makes potential difference the law: current takes the easiest path, sparks jump gaps, grounds dump everything.",
    failureMode: "a short: all paths become one and the system trips",
    cliche: ["electric guitar", "zap", "synthwave"],
    donations: [
      { jurisdiction: "timbre", name: "arc", rule: "when the gap is small enough, energy jumps instead of flowing", rewrite: "connectedness is a spark, not a line" },
      { jurisdiction: "rhythm", name: "mains hum", rule: "a hidden frequency of the supply grid is always present", rewrite: "an unchosen pulse underwrites the chosen one" },
      { jurisdiction: "structure", name: "ground", rule: "excess is dumped to a common reference; without it the system floats dangerously", rewrite: "one part is the earth pin" },
    ],
  },
  waste: {
    id: "waste",
    label: "Waste",
    centroid: c(0.48, -0.85, 0.3, 0.7, 0.5, 0.3, 0.35, 0.25),
    spread: 0.2,
    mass: 0.35,
    fracturePlane: "production",
    whatItDoes:
      "Keeps what was supposed to be thrown away and makes the discarded material do the remaining work.",
    failureMode: "only refuse is left and it cannot hold a form",
    cliche: ["trash", "lo-fi dirt", "garbage percussion"],
    donations: [
      { jurisdiction: "production", name: "offcut", rule: "the usable take is discarded; the leftover is the master", rewrite: "the official version is demoted" },
      { jurisdiction: "texture", name: "residue", rule: "previous processes leave a film that will not clean off", rewrite: "mix is stained on purpose" },
      { jurisdiction: "form", name: "landfill stack", rule: "new events are dumped on old without sorting", rewrite: "form is accumulation of discard" },
    ],
  },
  labor: {
    id: "labor",
    label: "Labor",
    centroid: c(0.22, -0.62, 0.7, 0.5, 0.55, 0.45, 0.5, 0.6),
    spread: 0.2,
    mass: 0.7,
    fracturePlane: "performance",
    whatItDoes:
      "Makes effort audible: the cost of producing the event is part of the event.",
    failureMode: "the work is honest and exhausted and nothing else happens",
    cliche: ["work song", "blues cliche", "grunt"],
    donations: [
      { jurisdiction: "performance", name: "effort noise", rule: "the sound of doing the job is not cleaned off the result", rewrite: "strain is orchestration" },
      { jurisdiction: "meter", name: "shift length", rule: "form is a work period with a hard stop, not an arc", rewrite: "the piece punches a clock" },
      { jurisdiction: "repetition", name: "piecework", rule: "repeats are units of pay, slightly resentful", rewrite: "loops are quotas" },
    ],
  },
  childhood: {
    id: "childhood",
    label: "Childhood",
    centroid: c(-0.85, 0.12, 0.25, 0.4, 0.88, 0.55, 0.3, 0.45),
    spread: 0.22,
    mass: 0.35,
    fracturePlane: "memory",
    whatItDoes:
      "Uses an early, underbuilt version of a system as if it were still in charge: rules that were never finished, still binding.",
    failureMode: "the unfinished rule is treated as law and the adult form cannot act",
    cliche: ["lullaby", "toy piano", "innocent"],
    donations: [
      { jurisdiction: "memory", name: "early rule", rule: "a primitive instruction overrides a later, better one", rewrite: "the first version of a motif is the boss of later versions" },
      { jurisdiction: "harmony", name: "unfinished cadence", rule: "resolutions that a child would accept are left as law", rewrite: "cadences stay too simple on purpose" },
      { jurisdiction: "form", name: "game that ends wrong", rule: "a procedure is abandoned mid-rule when attention leaves", rewrite: "sections stop because the player left, not because the form closed" },
    ],
  },
  signal: {
    id: "signal",
    label: "Signal",
    centroid: c(0.08, 0.52, 0.55, 0.45, 0.5, 0.5, 0.65, 0.55),
    spread: 0.2,
    mass: 0.5,
    fracturePlane: "production",
    whatItDoes:
      "Treats the piece as a transmission: noise, bandwidth, dropout, and the receiving end's bad reconstruction.",
    failureMode: "only the carrier remains; the message did not survive the channel",
    cliche: ["radio static", "glitch", "lofi"],
    donations: [
      { jurisdiction: "production", name: "channel limit", rule: "the medium cannot carry all the information; some of it is refused", rewrite: "mix is a bandwidth budget" },
      { jurisdiction: "repetition", name: "handshake", rule: "a figure must be acknowledged before the next is sent", rewrite: "phrases wait for ACK" },
      { jurisdiction: "memory", name: "lossy recall", rule: "what is stored is a compressed, artifacted version of what occurred", rewrite: "memory is a codec" },
    ],
  },
  minerals: {
    id: "minerals",
    label: "Minerals",
    centroid: c(0.78, -0.58, 0.85, 0.35, 0.7, 0.15, 0.75, 0.22),
    spread: 0.18,
    mass: 0.85,
    fracturePlane: "timbre",
    whatItDoes:
      "Imposes crystal habit: growth is allowed only along certain axes; other directions are forbidden.",
    failureMode: "the habit is perfect and dead; no further growth is possible",
    cliche: ["crystal bowls", "new age", "gems"],
    donations: [
      { jurisdiction: "structure", name: "habit", rule: "growth may only continue in permitted directions", rewrite: "development is anisotropic" },
      { jurisdiction: "timbre", name: "cleavage", rule: "the object breaks cleanly along predetermined planes and nowhere else", rewrite: "tone fails as a facet, not a crush" },
      { jurisdiction: "harmony", name: "lattice", rule: "pitches occupy a repeating grid with vacancies as features", rewrite: "harmony is a crystal with holes" },
    ],
  },
  rare: {
    id: "rare",
    label: "Rare",
    centroid: c(-0.04, 0.04, 0.48, 0.52, 0.55, 0.52, 0.48, 0.48),
    spread: 0.55,
    mass: 0.5,
    fracturePlane: "structure",
    whatItDoes:
      "Applies an uncommon mechanism: the word is rare because the operation is rare. Use the specific physics, not the vibe of obscurity.",
    failureMode: "obscurity is treated as flavor and the mechanism is skipped",
    cliche: ["mysterious", "obscure", "weird for weird"],
    donations: [
      { jurisdiction: "structure", name: "uncommon law", rule: "a rarely used relation becomes temporarily mandatory", rewrite: "the default grammar is suspended for a specialist rule" },
      { jurisdiction: "memory", name: "hapax", rule: "an event is allowed to occur only once and is thereafter illegal to copy", rewrite: "the unique occurrence is protected by forbidding reprise" },
      { jurisdiction: "form", name: "awkward fit", rule: "the section does not match the neighboring joints and must be packed with force", rewrite: "form-fitting is a problem, not a smoothness" },
    ],
  },
  common: {
    id: "common",
    label: "Common",
    centroid: c(-0.12, -0.28, 0.42, 0.38, 0.48, 0.4, 0.4, 0.38),
    spread: 0.7,
    mass: 0.42,
    fracturePlane: "structure",
    whatItDoes:
      "Applies an ordinary, unglamorous function. The word is common because the job is common. Make the mundane do structural work.",
    failureMode: "the ordinary word is treated as flavor text and does no causal work",
    cliche: ["everyday vibes", "relatable", "slice of life"],
    donations: [
      { jurisdiction: "structure", name: "plain function", rule: "the object does the job implied by its ordinary use, not a metaphor of it", rewrite: "arrangement obeys a household or workplace function" },
      { jurisdiction: "repetition", name: "unremarkable cycle", rule: "the action recurs because that is how the day is built, not for emphasis", rewrite: "repeats are infrastructure" },
      { jurisdiction: "production", name: "no special lighting", rule: "the event is mixed as if it were not the point of the song", rewrite: "a layer is demoted to the background of living" },
    ],
  },
};

export const FAMILY_IDS = Object.keys(FAMILIES) as FamilyId[];
