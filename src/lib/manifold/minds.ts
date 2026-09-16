import { INSTALLS } from "./data/installs";

export type MindRack = "transfer" | "process" | "senses" | "memory";

export type MindId =
  | "ownership"
  | "axiom"
  | "shadow"
  | "substrate"
  | "taxonomy"
  | "vacuum"
  | "teleology"
  | "kinetic"
  | "omission"
  | "circuit"
  | "decompile"
  | "contagion"
  | "oneiric"
  | "shear"
  | "alien-ruler"
  | "lesion"
  | "umwelt"
  | "valence"
  | "lossy"
  | "taboo"
  | "desire"
  | "progeny"
  | "recall"
  | "crystallize"
  | "recoil"
  | "speciation";

export type MindDef = {
  id: MindId;
  n: number;
  rack: MindRack;
  label: string;
  full: string;
  aliases: string[];
  whatItDoes: string;
  transduce: string;
  compile: string;
  procedure: string[];
};

type MindSeed = Omit<MindDef, "procedure">;

const SEEDS: MindSeed[] = [
  {
    id: "ownership",
    n: 1,
    rack: "transfer",
    label: "Ownership",
    full: "Property unbundling / ownership transfer",
    aliases: ["property unbundling", "ownership transfer", "rebind", "unbundle"],
    whatItDoes:
      "Severs a load-bearing property from its usual host and rebinds it literally onto a host that should not own it.",
    transduce:
      "Do not let the concept keep its conventional owner. Rebind one load-bearing property onto an unexpected existing host. If restoring the original owner leaves the donations unchanged, the transfer failed.",
    compile: "Rules must be owned by the wrong layer. Do not restore conventional instrument roles.",
  },
  {
    id: "axiom",
    n: 2,
    rack: "transfer",
    label: "Axiom",
    full: "Axiom fracture / negative load-bearing synthesis",
    aliases: ["axiom fracture", "negative load", "negated axiom"],
    whatItDoes:
      "Finds the enabling assumption of the destination, negates it, and makes the negation itself the mechanism of arrival.",
    transduce:
      "Identify the ordinary enabling axiom of this concept, negate it, and let ¬A do the causal work. Do not compromise with A.",
    compile: "Success must depend on an inverted enabling condition, not on the obvious one.",
  },
  {
    id: "shadow",
    n: 3,
    rack: "transfer",
    label: "Shadow",
    full: "Attentional shadow harvesting",
    aliases: ["shadow harvest", "attentional shadow", "harvest shadow"],
    whatItDoes:
      "Stops elaborating the named center. A neglected support, residue, or externality becomes the governing premise.",
    transduce:
      "Do not elaborate the obvious center. Promote one structurally necessary shadow (waste, maintenance, absence, support) to the generative premise.",
    compile: "Foreground the maintenance cost, residue, or overlooked support — not the named subject.",
  },
  {
    id: "substrate",
    n: 4,
    rack: "transfer",
    label: "Substrate",
    full: "Destructive compression + alien substrate",
    aliases: ["alien substrate", "destructive compression", "minimum machine"],
    whatItDoes:
      "Compresses the destination to a minimum causal machine, solves it in an unrelated family's rules, brings home only the structure.",
    transduce:
      "Strip domain identity. Keep only the minimum causal machine. Reinstantiate it using rules from an unrelated operational family, then strip that family's vocabulary from the donations.",
    compile: "No souvenir imagery from the source word. Only transferred structure.",
  },
  {
    id: "taxonomy",
    n: 5,
    rack: "transfer",
    label: "Taxonomy",
    full: "Error axiomatization / shadow taxonomy",
    aliases: ["shadow taxonomy", "error axiom", "wrong classification"],
    whatItDoes:
      "Treats a coherent near-miss classification as literally true and reasons inside that ontology.",
    transduce:
      "Find the nearest coherent wrong classification of this concept. Freeze it. Extract the smallest axioms that would make the mistake exact. Donate from inside that ontology, not the correct one.",
    compile: "Write as if the misclassification were operational fact, not a joke.",
  },
  {
    id: "vacuum",
    n: 6,
    rack: "transfer",
    label: "Vacuum",
    full: "Primitive deletion / constitutive vacuum",
    aliases: ["primitive deletion", "constitutive vacuum", "delete primitive"],
    whatItDoes:
      "Deletes a foundational primitive without replacement. The hole stays causally active; no synonym may fill it.",
    transduce:
      "Delete one constitutive primitive this concept normally requires. Do not invert or replace it. Donations must reorganize around the vacancy.",
    compile: "A necessary category is absent. Do not smuggle it back under another name.",
  },
  {
    id: "teleology",
    n: 7,
    rack: "process",
    label: "Teleology",
    full: "Teleological bootstrap inversion",
    aliases: ["bootstrap", "from the end", "terminal state", "teleological"],
    whatItDoes:
      "Fixes the destination as already true and selects the present only by the ancestry required to have produced it.",
    transduce:
      "Treat the concept as a fixed terminal state. Donations are predecessor conditions required for that end, not descriptions of arriving there.",
    compile: "The present is an ancestor selected by a finished future, not a buildup toward one.",
  },
  {
    id: "kinetic",
    n: 8,
    rack: "process",
    label: "Kinetic",
    full: "Kinetic dissolution / metabolic vectors",
    aliases: ["metabolic", "kinetic dissolution", "rates not objects", "zero mass"],
    whatItDoes:
      "Forbids adding objects. Intervenes only by changing rates, gradients, permeability, or decay of what already exists.",
    transduce:
      "Do not donate new objects or layers. Only change rates, gradients, permeability, feedback, or decay of processes already implied.",
    compile: "No new instrument. Change a rate, a leak, a coupling, a debt.",
  },
  {
    id: "omission",
    n: 9,
    rack: "process",
    label: "Omission",
    full: "Omission-field / negative triangulation",
    aliases: ["omission field", "triangulation", "do not name it"],
    whatItDoes:
      "Forbids representing the destination directly. Reconstructs it from three independent external constraints.",
    transduce:
      "Do not name or synonym the concept. Describe only what three independent axes would have to show if it were present. Donate from that intersection.",
    compile: "Never name the destination. The song is the intersection of its constraints.",
  },
  {
    id: "circuit",
    n: 10,
    rack: "process",
    label: "Circuit",
    full: "Cybernetic circuit + deutero-learning",
    aliases: ["cybernetic", "feedback circuit", "deutero"],
    whatItDoes:
      "Treats the destination as a loop that regenerates a problem. Changes the relational premise, not the visible node.",
    transduce:
      "The concept is one node in a regenerating circuit. Donate a change to the relational premise that makes every local response sensible, not a fix of the visible node.",
    compile: "A loop is punctuated, not a symptom treated.",
  },
  {
    id: "decompile",
    n: 11,
    rack: "process",
    label: "Decompile",
    full: "Ontological decompilation + cascading recompilation",
    aliases: ["recompile", "ontological decompile", "replace primitive"],
    whatItDoes:
      "Excises a low-level primitive and recompiles every dependent trait under the destination's replacement rule.",
    transduce:
      "Replace a silent supporting primitive with a precise alien one from this concept. Every donation must be a recompiled dependent, traceable to the new primitive.",
    compile: "Old definitions are invalid. Rewrite dependents from the new root rule.",
  },
  {
    id: "contagion",
    n: 12,
    rack: "process",
    label: "Contagion",
    full: "Systemic taxonomic contagion",
    aliases: ["parasite protocol", "taxonomic contagion", "colonize"],
    whatItDoes:
      "Lets an orthogonal lifecycle colonize the organism so the host must run on foreign succession rules.",
    transduce:
      "Import this concept's operational lifecycle (roles, succession, resources), not its imagery. Host functions must be reassigned until the original repair route cannot describe the result.",
    compile: "Foreign lifecycle determines progress and resolution. Strip foreign vocabulary.",
  },
  {
    id: "oneiric",
    n: 13,
    rack: "senses",
    label: "Oneiric",
    full: "Oneiric contamination / identity slippage",
    aliases: ["identity slip", "a is b", "oneiric", "dream identity"],
    whatItDoes:
      "Asserts literal identity between two incompatible nodes and continues in ordinary syntax. Retroactively revises only what the identity forces.",
    transduce:
      "This concept is literally identical to an incompatible existing function. Do not analogize. Donations follow from A=B. No commentary on the impossibility.",
    compile: "Ordinary grammar. Impossible identity. No dream-language.",
  },
  {
    id: "shear",
    n: 14,
    rack: "senses",
    label: "Shear",
    full: "Multi-axial shear / minority-axis sovereignty",
    aliases: ["minority axis", "multi axial", "shear"],
    whatItDoes:
      "Runs incompatible readings without consensus. The most anomalous legitimate reading governs; the others constrain it.",
    transduce:
      "Produce readings that cannot translate into each other. Crown the most anomalous legitimate one. Other readings are resistance, not votes. Do not blend.",
    compile: "Do not average interpretations. The minority reading is law; others are load.",
  },
  {
    id: "alien-ruler",
    n: 15,
    rack: "senses",
    label: "Alien ruler",
    full: "Alien distance metrics + metric turnover",
    aliases: ["alien metric", "alien distance", "metric turnover", "other ruler"],
    whatItDoes:
      "Forces nearness under a non-semantic ruler. After a successful use, that ruler is retired so geometry keeps turning over.",
    transduce:
      "Associate by failure, residue, maintenance, or collapse trajectory — not by ordinary meaning. The neighbor must be far semantically.",
    compile: "Adjacency is from the active alien ruler, not from theme.",
  },
  {
    id: "lesion",
    n: 16,
    rack: "senses",
    label: "Lesion",
    full: "Selective cognitive lesion / primitive ablation",
    aliases: ["ablation", "cognitive lesion", "lesion"],
    whatItDoes:
      "Removes one ordinary operation (adding new material). Compensation must be built from what remains.",
    transduce:
      "You may not introduce a new layer or object. Build a prosthesis by mutating existing processes. If the missing operation quietly returns, the lesion failed.",
    compile: "No new parts. A prosthesis around a missing faculty.",
  },
  {
    id: "umwelt",
    n: 17,
    rack: "senses",
    label: "Umwelt",
    full: "Synthetic transducer array / downstream umwelt",
    aliases: ["transducer", "synthetic sense", "umwelt"],
    whatItDoes:
      "Installs fake senses for abstract properties. Reflexes to those signals choose what gets to act.",
    transduce:
      "Invent 1–2 transducers (detector, encoding, reflex). Donations are reflexes to those signals, not ordinary associations with the word.",
    compile: "Salience comes from a synthetic sense (pressure, viscosity, charge), not from the subject.",
  },
  {
    id: "valence",
    n: 18,
    rack: "senses",
    label: "Valence",
    full: "Synthetic valence / invented emotion",
    aliases: ["invented emotion", "synthetic valence", "alien affect"],
    whatItDoes:
      "Installs an invented affect with a trigger. Attraction/aversion changes what is protected, pursued, or forgotten.",
    transduce:
      "Define a non-human affect with a structural trigger. Donations are what that affect protects or rejects, not mood adjectives.",
    compile: "Selection is weighted by an invented affect. Do not perform the emotion as style.",
  },
  {
    id: "lossy",
    n: 19,
    rack: "senses",
    label: "Lossy",
    full: "Lossy cognition / forced aliasing",
    aliases: ["forced aliasing", "lossy cognition", "alias"],
    whatItDoes:
      "Destroys representational resolution until a distant concept aliases with the destination; reconstructs without restoring what was lost.",
    transduce:
      "Encode the concept in a coarse few dimensions. Allow a semantically distant collision. Reconstruct without restoring discarded dimensions.",
    compile: "Artifacts of a collision that could not be distinguished under a damaged encoding.",
  },
  {
    id: "taboo",
    n: 20,
    rack: "memory",
    label: "Taboo",
    full: "Procedural taboo + aftermath calculus",
    aliases: ["aftermath", "procedural taboo", "forbidden route"],
    whatItDoes:
      "Forbids the direct mechanism. The destination may occur only as collateral of an independently justified other operation.",
    transduce:
      "The ordinary mechanism of this concept is forbidden. Donate an operation that would be justified even if the goal were removed. The concept may only appear as aftermath.",
    compile: "The goal is a side-effect of a process that had its own reason.",
  },
  {
    id: "desire",
    n: 21,
    rack: "memory",
    label: "Desire",
    full: "Generative desire / alien utility",
    aliases: ["alien utility", "generative desire", "utility function"],
    whatItDoes:
      "Keeps the task valid but selects among options with an alien utility: reward what ordinary taste would not.",
    transduce:
      "Among valid operational readings, select the one that maximizes an alien U (e.g. remaining unresolved debt, irreversible stages, maximum residue) not elegance.",
    compile: "Prefer the valid option ordinary taste would reject.",
  },
  {
    id: "progeny",
    n: 22,
    rack: "memory",
    label: "Progeny",
    full: "Descendant fitness / progeny selection",
    aliases: ["descendant fitness", "progeny", "fertile seed"],
    whatItDoes:
      "Chooses the weaker present seed if its descendants open more future territory. Immediate polish loses.",
    transduce:
      "Prefer donations that are unfinished, high-mutability, and fertile over complete elegant ones. Leave productive consequences unresolved.",
    compile: "Leave a fertile unfinished law. Do not close the form.",
  },
  {
    id: "recall",
    n: 23,
    rack: "memory",
    label: "Recall",
    full: "Recall mutation / reconstructive memory",
    aliases: ["recall mutation", "reconstructive memory", "scarred memory"],
    whatItDoes:
      "Every recall is rebuilt under current pressure. The scarred version, not the original, is what the next step remembers.",
    transduce:
      "Do not retrieve prior structure unchanged. Reconstruct it under this concept's pressure. The scarred descendant is the memory.",
    compile: "Memory is the last reconstruction, not the origin.",
  },
  {
    id: "crystallize",
    n: 24,
    rack: "memory",
    label: "Crystallize",
    full: "Observational crystallization / attentional collapse",
    aliases: ["attentional collapse", "crystallization", "observe lock"],
    whatItDoes:
      "Whatever is examined locks. Unexamined dimensions stay mutable. Attention is expensive.",
    transduce:
      "Specify one property of this concept completely (it crystallizes). Leave other properties underdetermined and use them as the remaining search space.",
    compile: "One law is fixed because it was looked at. Other layers may still mutate.",
  },
  {
    id: "recoil",
    n: 25,
    rack: "memory",
    label: "Recoil",
    full: "Semantic recoil / interpreter mutation",
    aliases: ["semantic recoil", "interpreter state", "retcon meaning"],
    whatItDoes:
      "A new region rewrites what earlier traits now mean. The text of history stays; its operational reading does not.",
    transduce:
      "This concept must force a prior operational meaning to become insufficient. Donate the revised reading, not a new independent layer.",
    compile: "Earlier rules now mean something else because this region arrived.",
  },
  {
    id: "speciation",
    n: 26,
    rack: "memory",
    label: "Speciation",
    full: "Meta-genomic speciation / axiom breeding",
    aliases: ["axiom breeding", "meta genomic", "breed rules", "speciation"],
    whatItDoes:
      "Breeds the last two installed minds into one irreducible offspring law. Parents cannot produce the result alone.",
    transduce:
      "Do not apply a known parent procedure. Invent one operation that requires two different cognitive moves at once and is reducible to neither.",
    compile: "A hybrid law neither parent mind could have written.",
  },
];

export const MINDS: MindDef[] = SEEDS.map((m) => ({
  ...m,
  procedure: INSTALLS[m.id],
}));

export const RACKS: { id: MindRack; label: string; blurb: string }[] = [
  { id: "transfer", label: "Transfer", blurb: "Ownership, axioms, shadows, holes." },
  { id: "process", label: "Process", blurb: "Ends, rates, loops, colonization." },
  { id: "senses", label: "Senses", blurb: "Identity, rulers, lesions, fake perception." },
  { id: "memory", label: "Memory", blurb: "Taboo, desire, recall, recoil, breeding." },
];

const byId = new Map(MINDS.map((m) => [m.id, m]));

export function padMind(n: number): string {
  return String(n).padStart(2, "0");
}

export function getMind(id: string | null | undefined): MindDef | undefined {
  if (!id) return undefined;
  return byId.get(id as MindId);
}

function normalizeMindPhrase(phrase: string): string {
  return phrase
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findMind(phrase: string): MindDef | undefined {
  const n = normalizeMindPhrase(phrase);
  if (!n) return undefined;
  const numbered = n.match(/^(?:mind\s+|m\s*|module\s+|#)?(\d{1,2})$/);
  if (numbered) {
    const num = Number(numbered[1]);
    return MINDS.find((m) => m.n === num);
  }
  for (const m of MINDS) {
    if (m.id === n || m.label.toLowerCase() === n || m.full.toLowerCase() === n) return m;
    if (m.aliases.some((a) => a === n)) return m;
  }
  for (const m of MINDS) {
    if (n.includes(m.label.toLowerCase()) || n.includes(m.id.replace("-", " "))) return m;
    if (m.aliases.some((a) => n.includes(a))) return m;
  }
  return undefined;
}

export function mindConstraint(mind: MindDef): string {
  const steps = mind.procedure.map((s, i) => `${i + 1}. ${s}`).join("\n");
  return `TEMPORARY COGNITIVE INSTALLATION: ${mind.full}\n${mind.transduce}\n${steps}\nDo not explain this installation. It is a hidden generative constraint.`;
}
