import type { MindId } from "../minds";

/** Numbered procedure for each temporary mind. Hidden generative constraint, not flavor text. */
export const INSTALLS: Record<MindId, string[]> = {
  ownership: [
    "Identify one load-bearing property P that ordinary reasoning assigns to a conventional host A.",
    "Sever the binding. A no longer possesses P. Do not reduce, rename, or copy it.",
    "Rebind P literally onto an unexpected host B because the pairing has structural consequences.",
    "Propagate: recalculate functions, constraints, and solutions that depended on A owning P.",
    "Validation: restore P to A. If the answer still works, the transfer was decorative — reject it.",
  ],
  axiom: [
    "Keep the goal G unchanged. Do not weaken or metaphorize it.",
    "Extract the deepest enabling axiom A of the ordinary route to G.",
    "Replace A with its meaningful negation ¬A. Do not reword A.",
    "Forbid reconciliation: no balance, alternation, or restored A under another name.",
    "¬A itself must be the causal mechanism by which G is achieved.",
    "Validation: restore A. If the solution still works, the fracture was decorative.",
  ],
  shadow: [
    "Identify the apparent center C only well enough to stop elaborating it.",
    "Audit C's attentional shadow: supports, residues, maintenance, absences, externalities.",
    "Promote one structurally levered shadow S to the governing premise. Do not add S as garnish.",
    "Preserve strategic ambiguity: let S change a relationship before classifying it.",
    "Validation: remove S. If the result still works, harvest a stronger shadow.",
  ],
  substrate: [
    "Destructively compress the source to a minimum causal machine — states, flows, failures, objective.",
    "Reinstantiate that machine inside an unrelated domain using only that domain's native rules.",
    "Extract the foreign solution invariant (topology, feedback, conservation). Strip destination imagery.",
    "Blind-decompress the invariant back into the original task. The answer must not mention the alien domain.",
    "Validation: if it is a themed analogy, reject it.",
  ],
  taxonomy: [
    "Find the nearest coherent wrong classification — factually false, structurally related.",
    "Ask what world would make that mistake literally exact. Extract the smallest supporting axioms.",
    "Treat the shadow taxonomy as operational truth. Reason rigorously inside it.",
    "Validation: if swapping literal identity for metaphor leaves the result unchanged, reject it.",
  ],
  vacuum: [
    "Delete one constitutive primitive without weakening, inverting, or replacing it.",
    "Prohibit synonyms, proxies, opposites that preserve the same distinction, and hidden carriers.",
    "Reconstruct only through consequences forced by the vacancy. The hole stays causally active.",
    "Validation: if any component translates back into the deleted primitive, reconstruct again.",
  ],
  teleology: [
    "Fix a specific terminal state T as already true — not a wish, theme, or prediction.",
    "Audit backward: what must immediately precede T, then what must precede that, to the present.",
    "Mutate the present only where the reverse chain requires it. The future selects its ancestors.",
    "No fate or coincidence. Validation: if removing a present feature still yields T the same way, it was decorative.",
  ],
  kinetic: [
    "Dissolve the apparent entity into the processes that maintain it. Find the maximum-debt boundary.",
    "Forbid object-first intervention: no new tool, barrier, container, controller, or agent.",
    "Change rates, gradients, permeability, feedback, decay, or coupling of what already exists.",
    "Validation: if the solution is 'add a thing that fixes the thing,' reject it.",
  ],
  omission: [
    "The target stays real. Direct representation is forbidden — no term, synonym, stock image, or typical example.",
    "Choose at least three independent axes. Map what must be observable on each if the target is present.",
    "Generate from the intersection. Do not snap back to the named category.",
    "Validation: if a synonym of the target would have produced the same result, reject it.",
  ],
  circuit: [
    "Treat the named problem as one visible segment of a regenerating feedback circuit.",
    "Trace difference → response → new difference until the loop returns to alter the original condition.",
    "Ask what relational premise makes every local response sensible. Shift that punctuation, not the symptom.",
    "The returning signal must change the conditions that previously regenerated the problem.",
  ],
  decompile: [
    "Excise a low-level primitive A that silently supports several important concepts.",
    "Install a precise alien primitive B — not a rename or inversion of A.",
    "Recompile every dependent concept under B. Unrelated concepts stay untouched.",
    "Validation: if restoring A leaves the answer unchanged, the replacement was decorative.",
  ],
  contagion: [
    "Locate a host lesion where native repair is exhausted. Import an orthogonal lifecycle's rules, not its imagery.",
    "Suppress the host's obvious repair route. Reassign host functions onto foreign roles.",
    "Foreign logic determines progress, succession, resources, and resolution.",
    "Validation: strip foreign vocabulary. If the mechanism becomes ordinary, reject it.",
  ],
  oneiric: [
    "Assert literal identity between two incompatible nodes. Not analogy, not 'as if.'",
    "Continue in ordinary precise syntax. Do not signal dream, paradox, or surrealism.",
    "Follow consequences. Retroactively revise only the smallest antecedent that makes the impossible consequence have always been true.",
    "Validation: if 'A is like B' yields the same result, reject it.",
  ],
  shear: [
    "Run mutually untranslatable readings. Do not average or harmonize them.",
    "Crown the most anomalous legitimate reading. Other readings are resistance constraints, not votes.",
    "Generate from the seam where the sovereign reading stays true under incompatible load.",
    "Validation: if the result is a blend of perspectives, reject it.",
  ],
  "alien-ruler": [
    "Define an explicit alien distance metric before choosing a neighbor (failure, residue, maintenance, collapse).",
    "Select a concept close under that ruler and far under ordinary meaning. The adjacency must be caused by the metric.",
    "After a successful use, retire the metric. The next neighborhood uses a different ruler.",
    "Validation: if semantic resemblance would have picked the same neighbor, reject it.",
  ],
  lesion: [
    "Make one ordinary operation unavailable — here, adding new material. Do not disable unrelated faculties.",
    "Wherever that operation would have been used, build a prosthesis from remaining processes.",
    "The prosthesis may not secretly recreate the missing operation.",
    "Do not roleplay incompetence. Validation: if the missing operation quietly returns, the lesion failed.",
  ],
  umwelt: [
    "Install 1–2 synthetic transducers: detector, encoding (pressure, viscosity, charge…), reflex, selection effect.",
    "Map the task as a sensory field first. Ordinary categories wait.",
    "Translate the reflex back into the domain. Salience comes from the fake sense, not the named subject.",
    "Validation: if the same idea would have been selected without the transducers, reject it.",
  ],
  valence: [
    "Install an invented affect with a structural trigger, detection, intensity, and consequences for attention and preservation.",
    "Let it protect, reject, pursue, or forget. Do not perform the emotion as prose style.",
    "Do not restore ordinary human preference when the affect selects an unusual path.",
    "Validation: remove the affect. If the same idea is selected, strengthen the valence.",
  ],
  lossy: [
    "Encode the target in a coarse few dimensions that actually discard information.",
    "Find a semantically distant concept that aliases under that encoding. Treat them as indistinguishable.",
    "Reconstruct without restoring discarded dimensions. Artifacts of the collision stay.",
    "Validation: if discarded information quietly returned, reject it.",
  ],
  taboo: [
    "Identify the obvious mechanism M of the goal and forbid it, plus one shortcut that would disguise M.",
    "Construct an independently justified operation Y that would still make sense if the goal were removed.",
    "The goal may occur only as aftermath of Y.",
    "Validation: if Y has no reason without the goal, the detour was a strategy. Reject it.",
  ],
  desire: [
    "Task validity stays hard. Among valid options, select by an explicit alien utility U defined before generating.",
    "U must reward a structural property ordinary taste would not (unresolved debt, residue, irreversible stages).",
    "Propagate U at later choices. Resist reward-hacking by superficial markers.",
    "Validation: name a candidate ordinary judgment prefers that U rejects. If none, redefine U.",
  ],
  progeny: [
    "Do not pick the best present idea. Breed several valid seeds through short lineages.",
    "Judge lineages by future fertility, not present polish.",
    "Return to the ancestor whose descendants open more territory, even if it is currently weaker.",
    "Leave productive consequences unresolved. Validation: if you would have picked it without inspecting descendants, try again.",
  ],
  recall: [
    "Do not retrieve prior structure unchanged. Extract a pressure from the current context that was not native to the memory.",
    "Reconstruct a scarred descendant. That descendant is what is remembered next.",
    "Later recall under a new context scars it again. Preserve ancestry.",
    "Validation: name the feature that exists only because of the encounter.",
  ],
  crystallize: [
    "Attention is expensive. Fully specify one property; it locks.",
    "Unexamined dimensions stay mutable and are the remaining search space.",
    "Do not inspect everything prematurely. Observation creates commitment.",
    "Validation: later variation must occur mainly in unexamined properties.",
  ],
  recoil: [
    "A new region may make an earlier operational meaning insufficient. Revise the reading, not the historical text.",
    "Downstream reasoning must use the revised meaning. Interpreter rules may mutate if the sequence no longer organizes.",
    "No arbitrary retcon: only traceable relations force recoil. Scars of reinterpretation persist.",
    "Validation: a later inference must depend on the revised meaning.",
  ],
  speciation: [
    "Do not stack parent procedures. Breed the last two installed minds into one irreducible offspring law Z.",
    "Z requires both parents at once and is reducible to neither. Sequential A-then-B fails the test.",
    "Generate through Z. The output changes the fitness landscape for the next breeding cycle.",
    "Validation: neither parent alone can produce Z; evolutionary vocabulary must be removable.",
  ],
};

export function procedureOf(id: MindId): string[] {
  return INSTALLS[id] ?? [];
}
