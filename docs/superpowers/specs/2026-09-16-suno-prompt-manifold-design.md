# Suno Prompt Manifold — Design Specification

Date: 2026-09-16
Branch: `suno-prompt-manifold`
Status: design ready for user review

## 1. Purpose

Specialize the existing Semantic Manifold Game into a Suno-only creative instrument where the **Suno prompt itself is the evolving organism**.

The existing map, semantic transduction, route operators, metrics, scars, memory, Temporary Minds, history, and local persistence remain useful. The primary ontology changes to:

> The map is the steering apparatus. The continuously evolving Suno prompt is the creature being steered.

A user chooses a starting **prompt genotype**, immediately receives a complete generation-zero Suno prompt, then mutates it by traveling through concepts. Different routes to the same destination must keep producing different descendants.

This is not a genre blender and not a repeated LLM rewrite loop. Structured musical state mutates locally; deterministic renderers produce the visible Suno text after every change.

## 2. Core user experience

### Genotype picker

The opening screen is a seed/genotype picker. A genotype is selected for **how it can evolve**, not merely how it sounds initially.

Each card shows its structural DNA, recognizable identity, likely mutation behavior, and evolutionary tendencies such as scarability, identity retention, destabilization speed, vocal plasticity, or long-lineage fertility.

Selecting a seed creates generation zero locally and immediately renders all three Suno boxes. Seed selection itself uses no API call.

### Main desktop hierarchy

Use the approved mockup hierarchy:

- **Center — Current Suno Organism:** STYLE, LYRICS / CONTROL, CAPTION; character counts; copy buttons; recent changed clauses highlighted.
- **Left — Steering Field:** manifold/map, ruler, finder, natural-language command field, route operators.
- **Right — Genome / Mutation Inspector:** musical jurisdictions, gene status, locks, scars, dormant/active pressure, latest mutation diff.
- **Bottom — Lineage:** restorable generations.

The prompt is always visible and current. “Compile” is retired as the moment the prompt comes into existence; export/copy becomes a lightweight action on the live prompt.

### Mobile hierarchy

Prompt is the default view. Secondary surfaces become tabs/sheets: **Prompt / Navigate / Genome / Lineage**.

## 3. Hard Suno output contract

Every generation renders exactly three copyable artifacts:

- **STYLE:** 975–999 characters
- **LYRICS / CONTROL:** 4900–4999 characters
- **CAPTION:** 490–499 characters

The app must enforce these ranges, not merely display warnings.

The renderer may reorder, omit, compress, or expand complete semantic fragments, but it must not arbitrarily chop text with an ellipsis and must never pad with meaningless characters.

### Style

Prioritize operational musical rules: separate jurisdictions, harmony/pitch logic, rhythm/time behavior, timbre/instrumentation, performance, production, anchors, and audible scars. Prefer mechanisms over generic adjectives.

### Lyrics / Control

This is the main experimental control surface. It contains most bracketed operators, structural timing, technical explanatory singing, mutation-cycle instructions, invariant/scar enforcement, and selective gibberish when the gibberish acts as a phonetic engine. Default lyric behavior remains process narration rather than conventional rhyme/chorus writing.

### Caption

A short publishable explanation of the current experiment and its notable lineage mechanics. It should explain the generation without dumping implementation internals.

## 4. Canonical state and derived Suno genome

Do **not** create a second independent persisted genome that duplicates the existing `Trait[]` state.

The existing `OrganismState` remains the single source of truth. Its traits, invariants, scars, memories, interpretations, debris, ancestry, installed Mind, and feature values are the canonical mutation record.

Add only Suno-specific metadata that is not already represented cleanly:

```ts
export type PhoneticRule = {
  trigger: string;
  musicalEffect: string;
  strength: number;
};

export type MutationDiff = {
  added: string[];
  mutated: string[];
  suppressed: string[];
  lost: string[];
  scarred: string[];
  preserved: string[];
};

// additions to OrganismState
seedId: string;
generation: number;
phoneticRules: PhoneticRule[];
lastMutationDiff?: MutationDiff;
```

Create a pure `deriveSunoGenome(state)` projection that groups canonical traits by musical jurisdiction and computes status such as active, locked, scarred, dormant, suppressed, or lost. UI and renderers consume this derived projection; they do not maintain a second truth.

This keeps the current reducer/operator machinery useful and prevents state divergence.

## 5. V1 genotype catalog

Ship six curated local genotypes. Each seed is a complete set of initial canonical traits/invariants/phonetic rules sufficient to render a useful generation-zero prompt without AI.

### Productive Contradiction

Separate jurisdictions for harmony, melody, rhythm, timbre/atmosphere, performance, and anchor. Incompatible traditions/techniques are not blended; they negotiate through operators. Especially fertile under collision, parallel travel, ownership transfer, and invariant pressure. Its generation-zero logic follows the project's Productive Contradiction Under Constraint method.

### Reconstructive Memory

Recurrence is never pristine. Every return is context-scarred; later material can revise what earlier material means. Especially fertile under long routes, repeated travel, recall mutation, semantic recoil, and déjà-vu-like concepts.

### Primitive Vacuum

One foundational musical primitive is absent from generation zero and may not return under a synonym or proxy. Examples include beat, tonic, repetition, accompaniment, soloist, barline, or phrase boundary. Evolution occurs by compensatory reorganization around the permanent absence.

### Alien Sensorium

Synthetic transducers convert abstract conditions into usable pressures: e.g. failure as heat, memory debt as weight, topology as direction. Those sensed gradients alter mutation priority. Especially fertile under metric turnover, strange nouns, and WTF-neighbor exploration.

### Phonetic Organism

Voice is a physical control system: hard consonants act percussively; nasals drive drone/resonance; open vowels sustain melody; rolled consonants accelerate/agitate; dense syllables compress runs; long vowels stretch time; heavy syllables add bass weight. Especially fertile under vocal, tempo, articulation, and instrumentation mutation.

### Metabolic Composition

Musical identity is maintained by rates, gradients, flows, pressure, decay, resonance, permeability, coupling, and feedback rather than stable song-objects. Especially fertile under slow drift, phase changes, collapse/reformation, and process-oriented Minds.

Every built-in seed must: (1) render a useful generation zero, (2) retain a recognizable identity under ordinary mutation, (3) expose at least three meaningfully mutable jurisdictions, (4) contain at least one load-bearing property that can lock or scar, (5) have an evolutionary bias distinct from the other seeds, and (6) not be merely a genre preset.

## 6. Genome-aware route semantics

The existing command grammar stays familiar.

- **DIRECT:** smallest relevant mutation set; least destructive route.
- **VIA:** waypoint mutates the state first; destination acts on that altered descendant. A→C must differ from A→B→C.
- **THROUGH:** stronger exposure across multiple jurisdictions; may leave persistent consequences.
- **GEODESIC:** smallest structural path under the active metric; intermediate nodes may leave small cumulative changes; usually preserves more identity than THROUGH.
- **PARALLEL:** makes one jurisdiction obey a target mechanism without simply becoming the target; ideal for “make A behave like B without becoming B.”
- **COLLISION:** forces incompatible active rules into conflict and may suppress/lose genes, create debris/scars, strengthen survivors, or derive a third rule. It must not reduce to “more intense.”
- **HOVER:** low-strength pressure and preconditioning; weaker and more reversible than THROUGH.
- **OVERSHOOT:** carries the state beyond the stable target interpretation into an exaggerated consequence and continues from there.
- **KEEP_GOING:** propagates the active transformation tendency without inventing a new concept.

Every operator produces a `MutationDiff` from before/after canonical state.

## 7. Temporary Minds

A slotted Temporary Mind changes **how mutations are selected or executed**, rather than merely appending prose during render.

Examples: Primitive Deletion constrains existence; Recall Mutation alters returning traits; Semantic Recoil revises earlier interpretations; Alien Distance Metrics changes neighborhood selection; Synthetic Valence changes mutation priority; Descendant Fitness rewards fertile future lineages; Meta-Genomic Speciation may change the mutation rule itself.

The existing Temporary Minds library remains the conceptual source of truth.

## 8. Deterministic rendering layer

Suggested modules:

```text
src/lib/suno/seeds.ts
src/lib/suno/genome.ts
src/lib/suno/render-style.ts
src/lib/suno/render-lyrics.ts
src/lib/suno/render-caption.ts
src/lib/suno/fit-budget.ts
src/lib/suno/diff.ts
```

Rendering is pure/deterministic for a given organism state and performs no network request.

`fit-budget.ts` works on ordered semantic fragments:

1. reserve mandatory anchors and active scars
2. add highest-priority jurisdiction fragments
3. add history/operator/phonetic fragments until minimum length is reached
4. compress or remove whole low-priority fragments if near maximum
5. use deterministic, domain-appropriate expansion clauses derived from active state if still below minimum
6. assert the final output is inside the hard range

Generation-zero seeds must contain enough structured information to satisfy all three ranges locally.

## 9. Mutation diff and lineage

After each move, show a compact human-readable structural delta, for example:

```text
Δ REPETITION
exact recurrence
→ anticipatory recurrence with false memory

PRESERVED
hurdy-gurdy drone

NEW SCAR
first clean return can never occur again
```

The diff is explanatory UI. It enters the Lyrics / Control box only when the current genome itself makes that process musically relevant.

Each saved generation preserves canonical state sufficient to regenerate the exact same three prompt boxes. Restoring an ancestor must reproduce its exact prompt text.

Multi-parent breeding and autonomous populations are future work, not V1.

## 10. API/cost rules

Do not introduce an LLM call on ordinary mutation or rendering.

- known concepts: zero API calls
- operator execution: zero API calls
- rendering and budget fitting: zero API calls
- history/restore: zero API calls
- seed selection: zero API calls
- novel unknown concept: at most one compact xAI transduction request, then persist/cache the resulting custom concept
- transduction failure: use the existing deterministic uncertain fallback and continue

No V1 feature requires a direct Suno API.

## 11. Persistence migration

Bump `SAVE_VERSION`.

Old generic-organism persisted state is not silently reinterpreted as a genotype. On incompatible saved state, preserve compatible cached custom concepts when practical, discard incompatible run state, and return cleanly to genotype selection with a readable migration/reset message.

## 12. UI component changes

Likely additions/revisions:

- `GenotypePicker`
- `LivingPromptPanel`
- `PromptTabs`
- `GenomeInspector`
- `MutationDiff`
- revised `HistoryStrip`
- revised `ManifoldApp`
- retire or reduce `CompileDrawer` to export/copy behavior

Preserve the existing map, parser, concept finder, ruler selector, operator controls, Mind rack, and concept transducer where possible.

Approved hierarchy is fixed for V1: **center = prompt, left = steering, right = genome, bottom = lineage**.

## 13. Error handling

- Unknown concept failure: use local fallback concept; journey continues.
- Sparse render: expand from seed/state-derived clauses, never generic filler.
- Oversized render: remove/compress low-priority complete fragments while preserving anchors, active scars, and critical operator consequences.
- Corrupt persistence: fail safely into genotype selection rather than blank UI.
- Invalid built-in seed: exclude it from the picker in development and fail tests; production catalog should never ship an invalid seed.

## 14. Testing and verification

Add tests for:

- every built-in seed produces a valid generation-zero state
- every seed renders STYLE 975–999, LYRICS / CONTROL 4900–4999, CAPTION 490–499
- `deriveSunoGenome` is deterministic and does not mutate state
- each operator produces deterministic before/after state and mutation diff
- representative A→C differs from A→B→C
- locks survive ordinary mutation
- collision can produce loss/scar/debris
- HOVER is weaker than THROUGH for the same target
- restore reproduces exact rendered prompts
- unknown concept fallback remains playable
- budget fitter never emits out-of-range text
- render modules perform no network access
- old persisted save versions safely return to genotype selection

Before completion run:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Manual smoke test: select all six seeds; copy generation zero; run DIRECT, VIA, COLLISION; install/eject a Mind; restore an ancestor; reload persistence; test mobile layout.

## 15. V1 non-goals

No direct Suno submission, audio analysis, song judging, multi-parent breeding, prompt populations, autonomous evolution, cloud accounts, server-side lineage, or collaboration in V1.

## 16. Success criteria

V1 is complete when the user can choose a genotype, immediately copy three valid Suno boxes, drive the prompt through semantic concepts, watch those boxes change after every move, understand which musical jurisdictions changed, preserve anchors/scars across a long route, restore an exact earlier generation, use novel concepts without repeated expensive calls, and obtain substantially different descendants from different routes to the same conceptual destination.

## 17. Implementation principle

**Never mutate rendered prompt prose as the source of truth. Mutate structured canonical musical state and render prompt prose from that state.**

This keeps path dependence, scars, Temporary Minds, metrics, and lineage mechanically meaningful instead of degrading into accumulated rewrite noise.
