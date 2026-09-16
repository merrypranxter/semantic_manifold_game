# Suno Prompt Manifold — Design Specification

Date: 2026-09-16
Branch: `suno-prompt-manifold`
Status: approved concept, design ready for review

## 1. Purpose

Specialize the existing Semantic Manifold Game into a Suno-only creative instrument where the **Suno prompt itself is the evolving organism**.

The current application already provides path-dependent travel, semantic transduction, operators, metrics, scars, memory, installed Temporary Minds, lineage, and local persistence. The new branch keeps those strengths but changes the app's primary ontology:

> The map is the steering apparatus. The continuously evolving Suno prompt is the creature being steered.

The user should be able to choose a starting **prompt genotype**, immediately receive a complete usable Suno prompt, then mutate that prompt by traveling through concepts with the existing manifold operators. Different routes to the same concept must continue to produce different descendants.

This is not a genre blender and not a repeated LLM rewrite loop. Musical behavior is stored as structured state, transformed locally, and deterministically rendered into Suno prompt text after every mutation.

## 2. Core user experience

### 2.1 Entry state: genotype picker

The app opens on a genotype-selection screen rather than immediately creating an anonymous pulse.

A genotype is a complete musical seed chosen for its **evolutionary behavior**, not merely for how it sounds at generation zero.

Each genotype card shows:

- name
- short structural DNA summary
- what makes the seed distinct
- likely mutation behavior
- what kinds of routes/operators it tends to respond to strongly
- optional traits such as high scarability, identity retention, fast destabilization, strong vocal mutation, or long-lineage fertility

Selecting a genotype creates generation zero and immediately produces all three valid Suno boxes.

### 2.2 Main screen hierarchy

Desktop layout follows the approved mockup:

- **Center:** Current Suno Organism, the dominant visual element
  - Style tab
  - Lyrics / Control tab
  - Caption tab
  - character count for each box
  - changed clauses visually highlighted after mutation
- **Left:** Steering Field
  - manifold/map
  - ruler/metric selector
  - concept search
  - natural-language command field
  - operator controls
- **Right:** Genome / Mutation Inspector
  - musical chromosomes and status
  - latest structural delta
  - locks, scars, dormant genes, active mutations
- **Bottom:** lineage/history strip

The prompt is always visible and always current. “Compile” is no longer the moment the prompt comes into existence.

### 2.3 Mobile hierarchy

The prompt remains the default first view.

Secondary views become tabs or sheets:

1. Prompt
2. Navigate
3. Genome
4. Lineage

The app must not make the user fight a tiny three-column desktop layout on mobile.

## 3. Prompt output contract

Every current organism renders to exactly three copyable Suno artifacts:

- **STYLE:** 975–999 characters
- **LYRICS / CONTROL:** 4900–4999 characters
- **CAPTION:** 490–499 characters

These limits are hard output contracts, not visual warnings.

The renderer must not solve overflow by clipping arbitrary text with an ellipsis. It must choose, compress, expand, and sequence musical instructions structurally until the text lands inside the requested range.

### 3.1 Style box

The Style box summarizes the currently active musical genome with strong preference for:

- operational musical rules
- explicit jurisdiction separation
- instrumentation and production behavior
- temporal and pitch logic
- performance attitude
- anchor/invariant behavior
- meaningful scars that remain audible

Avoid generic adjectives when a process can be stated instead.

### 3.2 Lyrics / Control box

This is the primary control surface and contains most of the experimental machinery.

It may include:

- bracketed structural operators
- stage/form instructions
- transformation timing
- technical explanatory lyrics describing what the music is doing
- gibberish when it functions as a phonetic engine
- scar and invariant enforcement
- mutation cycle instructions
- context-derived recurrence rules

The expected style remains the project convention: mostly technical/process narration with selective nonsense, rather than conventional rhyming lyrics.

### 3.3 Caption box

The caption briefly explains the current experiment and notable lineage mechanics in publishable language. It should identify what is structurally interesting about this generation without dumping internal implementation state.

## 4. Musical genome

The current generic trait system remains useful, but the Suno branch needs an explicit musical genome so rendering and mutation are reliable.

Add a structured `PromptGenome` to the organism state.

Suggested shape:

```ts
export type GeneStatus = "active" | "locked" | "scarred" | "dormant" | "suppressed";

export type PromptGene = {
  id: string;
  jurisdiction: Jurisdiction;
  name: string;
  rule: string;
  status: GeneStatus;
  strength: number;
  persistence: number;
  mutability: number;
  ancestry: string[];
  sourceConceptId?: string;
  sourceEventId?: string;
};

export type PromptGenome = {
  seedId: string;
  generation: number;
  harmony: PromptGene[];
  melody: PromptGene[];
  rhythm: PromptGene[];
  meter: PromptGene[];
  pulse: PromptGene[];
  pitch: PromptGene[];
  timbre: PromptGene[];
  instrumentation: PromptGene[];
  vocal: PromptGene[];
  articulation: PromptGene[];
  dynamics: PromptGene[];
  performance: PromptGene[];
  production: PromptGene[];
  spatial: PromptGene[];
  form: PromptGene[];
  motif: PromptGene[];
  repetition: PromptGene[];
  memory: PromptGene[];
  structure: PromptGene[];
  anchors: GenomeAnchor[];
  phoneticEngine: PhoneticRule[];
};
```

This should not duplicate state gratuitously. Existing generic `Trait` records can either become the backing representation for genes or be migrated into a genome projection. The implementation plan should favor the smallest clear representation rather than maintaining two independent truths.

## 5. Genotype system

### 5.1 V1 seed catalog

Ship six curated genotypes at minimum:

#### Productive Contradiction

- separate jurisdictions for harmony, melody, rhythm, timbre/atmosphere, performance, and anchor
- incompatible source traditions are not blended
- operators force negotiation between jurisdictions
- strongest under collision, parallel travel, ownership transfer, and invariant pressure
- default structure can use the project's Productive Contradiction Under Constraint method

#### Reconstructive Memory

- recurrence is never pristine
- recalls are context-scarred descendants
- later concepts can reinterpret earlier returns
- strongest under long routes, déjà-vu-like concepts, repeated geodesics, recall mutation, and semantic recoil

#### Primitive Vacuum

- one foundational musical primitive is permanently absent
- examples: beat, barline, tonic, repetition, accompaniment, phrase boundary, soloist
- later mutation must reorganize around the permanent absence rather than quietly restore it
- strongest under scars, hostile destinations, compensatory systems, and constitutive-vacuum Minds

#### Alien Sensorium

- abstract musical conditions are detected through synthetic transducers
- examples: failure pressure as heat, memory debt as weight, topology as directional force
- the resulting sensory gradients affect which mutations receive priority
- strongest under metric changes, strange concepts, and WTF-neighbor exploration

#### Phonetic Organism

- the voice is a physical control system
- hard consonants drive percussion
- nasals drive drone/resonance
- open vowels sustain melody
- rolled consonants accelerate/agitate
- dense syllables compress runs
- long vowels stretch time
- heavy syllables add bass weight
- strongest under vocal, rhythmic, instrumental, and tempo mutation

#### Metabolic Composition

- treats musical identity as maintained process rather than stable object
- form emerges from rates, flows, gradients, decay, resonance, pressure, permeability, and feedback
- strongest under slow drift, collapse/reformation, phase transitions, and process-oriented Minds

### 5.2 Seed design rule

Every seed must satisfy all of these:

1. generation zero is already a useful Suno prompt
2. it has a recognizable identity that can survive mutation
3. at least three jurisdictions remain meaningfully mutable
4. at least one load-bearing property can scar or become invariant
5. the genotype has a clear evolutionary bias distinct from the other seeds
6. the seed is not merely a genre preset

## 6. Mutation semantics

Existing travel commands stay familiar, but their effects become explicitly genome-aware.

### DIRECT

Apply the target concept to the smallest relevant set of genes. Prefer mutation over replacement. DIRECT should be the least path-dependent transformation.

### VIA

Use the waypoint as a transformation medium. The destination acts on the already waypoint-modified genome. A→C and A→B→C must remain structurally different.

### THROUGH

Expose the genome to a concept strongly enough that multiple jurisdictions can change and at least one persistent consequence may remain after leaving the region.

### GEODESIC

Travel through the minimum structural path required to reach the target under the active metric. Intermediate nodes may produce small cumulative transformations. Geodesic should usually preserve more identity than THROUGH.

### PARALLEL

Make one jurisdiction behave according to a target mechanism without simply converting it into that mechanism. This is ideal for cross-jurisdiction role exchange and “make A behave like B without becoming B.”

### COLLISION

Force incompatible active rules into direct conflict. Collision may:

- suppress or destroy a gene
- produce debris
- leave a scar
- strengthen a survivor
- create a new derived rule that neither side had alone

Collision should never be merely “more intense.”

### HOVER

Apply low-strength pressure without immediate destructive commitment. Hover is useful for reversible exploration, latent influence, and preconditioning later mutations.

### OVERSHOOT

Pass beyond the target's stable interpretation into an exaggerated or unstable consequence, then continue from that displaced state.

### KEEP_GOING

Continue the currently active transformation tendency without introducing a new concept. This should amplify or propagate an existing process rather than invent unrelated material.

## 7. Temporary Minds

Temporary Minds remain a major feature, but they should no longer be treated primarily as prose appended during compile.

A slotted Mind changes **how genome mutations are selected and executed**.

Examples:

- Primitive Deletion changes what may exist at all
- Recall Mutation changes how previously active genes return
- Semantic Recoil changes the interpretation of older genes when new ones arrive
- Alien Distance Metrics changes conceptual neighborhood selection
- Synthetic Valence changes mutation priority
- Descendant Fitness favors mutations that create fertile future lineages
- Meta-Genomic Speciation can change the mutation rule itself

The existing Temporary Minds library remains the conceptual source of truth for those procedures.

## 8. Rendering architecture

Introduce a dedicated deterministic rendering layer.

Suggested module boundaries:

```text
src/lib/suno/seeds.ts
src/lib/suno/genome.ts
src/lib/suno/mutate.ts
src/lib/suno/render-style.ts
src/lib/suno/render-lyrics.ts
src/lib/suno/render-caption.ts
src/lib/suno/fit-budget.ts
src/lib/suno/diff.ts
```

Exact paths may change during implementation if existing repository conventions suggest a cleaner location.

### 8.1 Renderer rules

Rendering must be deterministic for a given organism state.

No API call is required to:

- mutate known structured state
- apply operators
- render any Suno box
- fit character budgets
- restore lineage state
- compute diffs

### 8.2 Budget fitting

Each renderer builds from ordered semantic fragments rather than one monolithic paragraph.

A shared budget fitter should:

1. rank fragments by structural importance
2. include mandatory anchors/scars
3. add optional derived details until the minimum is satisfied
4. compress lower-priority clauses if near maximum
5. remove whole low-priority fragments before mutilating a sentence
6. use deterministic domain-appropriate expansion clauses only when needed to satisfy the minimum
7. assert final length is inside the contract

The fitter must never pad with meaningless characters.

## 9. Mutation diff

Every executed operator produces a small human-readable structural delta alongside the normal ledger event.

Examples:

```text
Δ REPETITION
exact recurrence
→ anticipatory recurrence with false memory

Δ FORM
A-B-A
→ A-B-(memory of A)-A′

PRESERVED
hurdy-gurdy drone

NEW SCAR
first clean return can never occur again
```

The UI should visually distinguish:

- mutated
- added
- suppressed
- lost
- scarred
- preserved/locked

The diff is explanatory UI, not part of the Suno prompt unless the current genome explicitly turns it into lyrics/control instructions.

## 10. Prompt lineage

Each saved generation preserves enough structured state to fully reproduce its three Suno boxes.

History restore must restore the exact prompt organism for that generation, not merely approximate it from the latest state.

Later roadmap may allow lineage branching and breeding, but v1 does not require population genetics or multi-parent crossover.

## 11. API and cost constraints

The branch must not introduce an LLM call on every mutation or render.

The existing xAI transducer remains appropriate only for genuinely novel concepts that are not already in the local atlas/cache.

Requirements:

- known concepts: zero API calls
- operator execution: zero API calls
- render: zero API calls
- character fitting: zero API calls
- restore/history: zero API calls
- unknown concept: at most one compact transduction request, then cache/persist the result
- API failure: fall back to deterministic local uncertain transduction as the current app already does

No feature in v1 should require a direct Suno API.

## 12. State migration and persistence

The current app persists state in the browser. The Suno branch must bump `SAVE_VERSION` and include a migration or clean reset strategy for incompatible old local state.

Preferred behavior:

- preserve compatible custom concepts where practical
- reset incompatible organism state cleanly into genotype selection
- do not crash because a browser contains a v3 generic organism

## 13. UI components

Likely changes/additions:

- `GenotypePicker`
- `LivingPromptPanel`
- `PromptTabs`
- `GenomeInspector`
- `MutationDiff`
- revised `HistoryStrip`
- revised `ManifoldApp`
- revised or retired `CompileDrawer`

The existing map, command parser, operator row, concept finder, ruler selector, Temporary Mind rack, and semantic transducer should be preserved where possible.

The approved visual hierarchy is the source of truth:

> center = prompt, left = steering, right = genome, bottom = lineage

## 14. Error handling

### Unknown concept transduction failure

Use the existing local fallback concept and mark confidence accordingly. The journey should continue.

### Renderer cannot hit minimum length on sparse generation zero

Use deterministic details already implied by the seed genome, not generic filler. Seed definitions must contain enough information that this condition should be rare.

### Renderer exceeds maximum

Drop or compress low-priority fragments at clause boundaries while preserving anchors, active scars, and critical operator consequences.

### Corrupt persisted state

Fail into genotype selection with a readable reset message instead of leaving the interface blank.

### Missing or malformed seed

Exclude invalid seed cards from the picker and surface a development-time warning. Built-in seeds should be covered by tests.

## 15. Testing strategy

### Unit tests

Add tests for:

- each built-in seed creates a valid generation-zero genome
- each built-in seed renders all three boxes inside exact character windows
- all operators produce deterministic deltas
- A→C differs from A→B→C for at least representative route cases
- locked anchors survive ordinary mutation
- collision can create scars/loss/debris
- HOVER remains weaker than THROUGH under equivalent target conditions
- restore reproduces exact prompt text
- unknown concept fallback does not break mutation
- budget fitter never returns out-of-range boxes
- no renderer performs network access

### Regression tests

Preserve existing parser, metric, and Temporary Mind tests where applicable.

### Verification before merge

Run at minimum:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Also manually smoke-test:

1. choose each genotype
2. copy generation-zero Suno boxes
3. travel DIRECT
4. travel VIA
5. COLLISION
6. install/eject a Mind
7. restore an ancestor
8. reload the browser and verify persistence
9. test mobile layout

## 16. V1 non-goals

Do not include these in the first implementation unless required to make the core flow work:

- direct Suno API submission
- audio upload analysis
- automatic song judging
- multi-parent prompt breeding
- prompt populations
- autonomous evolutionary runs
- cloud accounts
- server-side lineage storage
- collaborative sessions

These remain future experiments after the single-organism mutation loop proves itself.

## 17. Success criteria

The branch is successful when a user can:

1. open the app and choose a genotype
2. immediately copy a valid Suno style, lyrics/control, and caption prompt
3. travel through concepts using the existing steering grammar
4. see the prompt change immediately after each move
5. understand which musical jurisdictions changed without needing to read internal data structures
6. preserve meaningful anchors and scars across long routes
7. return to an earlier generation and recover its exact prompt
8. use novel concepts without repeated expensive API calls
9. produce substantially different descendants from different routes to the same semantic destination
10. feel that they are evolving a musical organism rather than repeatedly asking an AI to rewrite prose

## 18. Implementation principle

Do not mutate the rendered prompt text directly.

Mutate structured musical state and render the prompt from that state.

That single rule prevents the project from collapsing into accumulated prose drift and keeps path dependence, scars, Minds, metrics, and lineage mechanically meaningful.
