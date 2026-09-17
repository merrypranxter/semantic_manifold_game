# Semantic Manifold - Image / Video Prompt Branch

## Final Project Manual

**Repository:** `merrypranxter/semantic_manifold_game`  
**Branch:** `feature/image-video-prompt-manifold`  
**Scope:** image + video prompt evolution as one persistent visual organism  
**Implementation:** Jobs 1-7 complete  
**Merge status:** branch remains isolated from `main`

---

## 1. What this branch is

The image/video branch turns an existing generative-media prompt into a persistent, path-dependent visual organism.

Instead of treating prompt mutation as "add more adjectives" or "make it look like concept X," the system tries to preserve the prompt's load-bearing structure and let destination concepts donate **operations** against that structure.

A user can paste an existing image or video prompt, decompile it into generation zero, travel through conceptual space using the existing manifold operators, inspect what changed, preserve identity/invariants, accumulate scars and ancestry, and compile the current descendant back into either an image prompt or a video prompt.

The core architectural decision is that **image and video are not separate organisms**. They are two output lenses over the same visual lineage. A descendant can therefore be compiled as a still image or as temporal video without throwing away ancestry or forking the organism merely because the requested rendering mode changed.

### The design in one sentence

> Preserve the specimen, mutate its laws, remember the path, and compile the current creature through either an image or video lens.

---

## 2. What the user actually does

### Basic workflow

1. Open the visual start surface.
2. Paste an existing image or video prompt.
3. Choose the initial output lens: **Image** or **Video**.
4. Create generation zero.
5. Inspect what the decompiler classified as identity anchors, invariants, mutable laws, inactive/lost laws, and provenance.
6. Choose a destination concept or issue a route command.
7. Travel with the existing manifold operators, rulers, and temporary minds.
8. Inspect each descendant, its delta, scars, debris, ancestry, and current visual genome.
9. Lock traits that must become harder constraints.
10. Compile the current descendant as **Image** or **Video**.

### Example experiment

A face-preservation prompt could be ingested, then driven through a route such as:

`via memory loss -> collide with molting -> geodesic to p-adic numbers -> compile`

The intended result is not a collage containing symbols for memory loss, molting, or p-adic numbers. Each destination is first converted into an operational pressure on the current organism: boundary transfer, continuity failure, recursive inherited error, delayed inversion, structural reassignment, topology pressure, and similar mechanisms.

---

## 3. The central architecture

The original application was music/Suno-oriented. Job 1 introduced a medium-independent domain boundary so the existing manifold engine could remain intact while domain-specific behavior moved behind profiles.

### Domain model

`DomainId` now distinguishes broad evolutionary media:

- `music`
- `visual`

`CompileKind` distinguishes concrete outputs:

- `music`
- `image`
- `video`

This distinction is important. The domain is the organism's evolutionary medium. The compile kind is merely a way to render the current state.

### What remained shared

The branch deliberately reuses the existing manifold machinery rather than creating a second game engine:

- route operators
- manifold metrics/rulers
- temporary minds
- lineage and ancestry
- scars
- debris
- memory
- restoring snapshots
- trait mutation
- invariant locking

The visual branch changes the **meaning and vocabulary** of the organism, not the basic path-dependent engine.

---

## 4. What a visual organism contains

A visual organism is represented with the same manifold state structure used by the rest of the application, but the traits are visual operational laws rather than musical laws.

The important layers are:

### Source specimen

The exact original prompt is preserved in provenance. The decompiler never replaces the source text with its interpretation.

### Identity

A persistent factual description of what the specimen fundamentally is.

### Identity anchors

Low-mutability or locked properties that the source strongly requires to remain recognizable.

### Invariants

Explicit preservation requirements such as "preserve the subject's identity" or "keep the camera static." Strong source preservation language can become an `ABSOLUTE` invariant.

### Mutable laws

Operational prompt clauses that the route is allowed to rewrite: topology, materials, anatomy, camera behavior, lighting, transformation mechanism, continuity, and related structure.

### Inactive or lost laws

Traits that have been suppressed or lost during travel. They remain part of ancestry but are omitted from the active compile.

### Scars and debris

Path-dependent evidence left by earlier transformations. These can survive into compilation as ancestral residue rather than being erased by each new generation.

---

## 5. Visual jurisdiction vocabulary

Job 2 defined 36 visual mutation jurisdictions.

### Shared image/video jurisdictions

The shared visual organism can reason about:

- subject identity
- anatomy
- topology
- geometry
- boundary
- material
- surface
- biological process
- scale
- spatial relations
- composition
- perspective
- camera
- lighting
- color
- texture
- rendering medium
- degradation/artifact behavior
- environment
- transformation mechanism
- spatial continuity
- symmetry
- causality

### Video-only temporal jurisdictions

Video activates additional temporal structure:

- temporal identity
- object permanence
- frame correspondence
- motion
- transformation rate
- momentum
- growth/decay
- occlusion
- camera motion
- before/after relation
- temporal topology
- time direction
- persistence

Image compilation filters these temporal-only jurisdictions out. Video compilation can use the shared visual laws plus the temporal layer.

---

## 6. Visual meanings of the manifold feature vector

The branch deliberately reuses the original eight-dimensional manifold vector rather than inventing an unrelated visual coordinate system.

| Feature | Visual meaning |
|---|---|
| `semanticX` | representational distance |
| `semanticY` | ontological stability versus process/category ambiguity |
| `structure` | strength of relational and constraint structure |
| `failure` | pressure on known representation failure surfaces |
| `memory` | ancestral residue and visible path dependence |
| `temporal` | dependence on frame-to-frame continuity and change |
| `topology` | connectivity and boundary pressure |
| `energy` | transformation, motion, deformation, and event intensity |

This lets the existing metric/ruler machinery rearrange neighborhoods without replacing the engine.

---

## 7. Failure surfaces

The visual schema also defines explicit representation failure surfaces so strange outputs can be generated through controlled structural stress rather than vague "weirdness."

### Shared still/video failure surfaces

- identity binding
- anatomical correspondence
- boundary membership
- material consistency
- topological continuity
- projection coherence
- scale coherence

### Video continuity failure surfaces

- frame identity
- object permanence
- trajectory continuity
- causal continuity
- transformation continuity
- temporal order
- camera/world separation

These are operational targets. Later concept transduction can ask what a concept does to identity, boundaries, topology, correspondence, causality, or continuity instead of simply decorating a prompt with concept-themed imagery.

---

## 8. Generation zero: prompt decompilation

Job 3 added the prompt decompiler.

### Core rule

**Decompile; do not improve.**

The model is instructed to extract supported structure from the source prompt, not rewrite it, optimize it, beautify it, or add concepts that were not present.

The decompiler returns:

- a persistent identity sentence
- identity anchors
- explicit invariants
- operational clauses
- jurisdiction for each clause
- role for each clause
- confidence
- mutability
- feature estimates

The normalizer is authoritative. Model output cannot invent an unsupported jurisdiction or slip video-only laws into an image specimen.

### Generation-zero conversion

The normalized specimen becomes the first manifold state:

- anchors get high persistence and low mutability
- ordinary mechanisms remain mutable
- explicit preservation requirements become strong/absolute invariants
- source prompt and output mode remain in provenance
- version starts at 0
- there are no scars/debris/history yet
- AI decompilation receives lower uncertainty than the deterministic fallback

### Local fallback

The instrument still works when xAI is unavailable. A deterministic local parser extracts a smaller set of operational cues such as:

- identity
- camera behavior
- topology
- material
- degradation
- rendering medium
- anatomy
- biological process
- color
- transformation
- temporal cues

Fallback origins are marked with higher uncertainty rather than pretending they are equally rich readings.

---

## 9. Concept transduction: making destinations operational

Job 4 added visual concept transduction.

A destination label is **not** allowed to become a visual theme by default.

### Cheap reading versus operational reading

Cheap:

> make the image look like molting

Operational:

> transfer boundary membership while the obsolete surface persists as residue

Cheap:

> add deja-vu imagery

Operational:

> a present structural relation inherits displaced evidence from its immediately prior arrangement

### Transduction rules

The visual transducer:

- validates every donated jurisdiction against the current image/video output
- rejects video-only donations in image mode
- strips the source concept word out of donation rules and rewrites
- rejects donations aimed solely at protected/locked jurisdictions
- prioritizes donations that can rewrite mutable jurisdictions already present in the organism
- normalizes feature pressure
- validates the failure/fracture plane
- produces deterministic fallback pressure when semantic transduction is unavailable

### Local fallback mechanisms

The fallback does not claim to semantically understand the destination. It uses the destination as a deterministic seed and applies domain-independent structural mechanisms such as:

- state residue during membership transfer
- local continuity with global correspondence reassignment
- recursive repetition with inherited error
- separation of cause and persistent effect
- delayed inversion that leaves evidence of both regimes
- conservation of structure while ownership moves between parts, layers, or regions

Locked subject identity is avoided by default.

---

## 10. Runtime activation

Job 5 connected the visual pieces into the live application.

### Visual profile

`src/lib/domain/profiles/visual.ts` registers the visual domain and exposes its jurisdiction vocabulary and compiler.

The profile's ordinary no-input origin is intentionally empty. The meaningful visual origin comes from prompt ingestion; the system does not fabricate a fake source prompt just to satisfy an interface.

### Prompt ingestion action

`ingestVisualPrompt(rawPrompt, output)`:

- calls the bounded decompiler
- creates generation zero
- switches the active domain to `visual`
- preserves source text and output mode in provenance
- resets lineage-specific run state for the new specimen
- protects generation zero from late persisted rehydration

### Domain-aware concept routing

Unknown destinations in visual mode go through the visual transducer. They do not silently reuse old music donations merely because a music concept with the same name already exists.

Music mode retains its previous atlas and transducer behavior.

---

## 11. Image and video compilation

Job 5 also added the deterministic visual compiler.

Compilation is local. It does not make another model call.

### Image compile

Image output uses active shared visual laws and omits video-only temporal jurisdictions.

### Video compile

Video output includes shared visual laws plus temporal laws. When continuity or identity traits exist, it can add a continuity layer.

### Both modes

Both compilers:

- exclude lost and suppressed traits
- emit strong/absolute invariants as preservation requirements
- retain recent scars/debris as ancestral residue
- preserve lineage
- can fall back to the untouched source prompt if every active law disappears rather than inventing replacement content

Switching Image/Video at compile time is not travel and does not mutate the organism.

---

## 12. Visual user interface

Job 6 exposed the runtime as a usable instrument.

### Start screen

The visual entry surface now supports:

- source prompt textarea up to 8,000 characters
- explicit Image / Video initial selection
- generation-zero creation
- user-facing note that the source prompt is preserved verbatim
- concise explanation of identity/invariants, mutable laws, and path-dependent descendants

The original word-organism workflow remains available rather than being deleted.

### Visual Genome inspector

The inspector shows:

- target output kind
- generation number
- ancestry depth
- identity anchors
- mutable laws
- explicit invariants
- inactive/lost laws
- scar count
- preserved source prompt

PLAY mode shows a compact genome summary. LAB mode expands the classification while retaining detailed trait inspection and lock controls.

### Novel destination safety

The branch fixed an important UI/runtime contamination edge case. A genuinely novel visual destination no longer gets planted as a generic lexicon concept before travel. It remains unresolved until execution, at which point it is transduced specifically against the current visual organism.

Only `visual-transduced` concepts are treated as already operational in visual mode.

---

## 13. Cost architecture after Job 7

Job 7 hardened the branch for repeated real use.

Only two operations can require a model call:

1. decompile a newly ingested source prompt
2. transduce an unresolved destination concept against the current organism

Everything else is local:

- route operators
- mutation
- history
- restore
- trait locking
- image/video rendering-lens switching
- compilation

### Persistent decompile cache

Successful AI decompilations are cached by:

- exact normalized prompt text
- Image/Video output
- cache schema version
- non-plaintext prompt hash

The prompt itself does not appear in the cache key.

Exact re-ingestion rebuilds a fresh generation-zero organism from the cached semantic structure with new organism IDs/timestamps and **no new model call**.

Policy:

- maximum 16 decompile entries
- 30-day lifetime

### Context-specific transduction cache

A destination concept is not globally reusable just because the spelling matches.

The transduction key follows:

- normalized concept label
- output mode
- current organism name and identity
- active trait jurisdictions/names/rules
- mutability and strength
- lock state
- explicit invariants
- installed temporary mind id

Random state IDs and timestamps are intentionally excluded.

This means the same operational state can reuse a reading after restore, while a changed descendant is allowed to receive a genuinely different transduction of the same concept.

Policy:

- maximum 64 transduction entries
- 30-day lifetime

### Fallbacks are not persisted as semantic truth

Only AI results enter the long-lived semantic caches.

Local fallbacks are deterministic and free, but caching them for weeks would make a temporary provider outage permanently suppress a later richer reading. Therefore they are used immediately but not promoted into the AI cache.

---

## 14. Request and spend hardening

Every model-backed operation is bounded.

### Decompile budget

- prompt limit: 8,000 characters
- default output budget: 900 tokens
- hard token range: 512-1,400
- default timeout: 12 seconds
- hard timeout range: 4-20 seconds
- temperature: 0.15

### Visual transduction budget

- concept label: 120 characters
- organism name: 100
- organism identity: 360
- traits: maximum 18
- trait name: 80
- trait rule: 360
- jurisdiction: 80
- invariants: maximum 8, 240 characters each
- temporary mind id: 80
- temporary mind summary: 240
- temporary mind transduction instruction: 900
- temporary mind procedure: maximum 4 steps, 240 characters each
- numeric strength/mutability: clamped to 0-1
- default output budget: 560 tokens
- hard token range: 320-720
- default timeout: 12 seconds
- hard timeout range: 4-20 seconds

### Fail-cheap behavior

There are no automatic model retries.

A provider error, rate limit, timeout, network failure, invalid JSON, or unusable structure gets one attempt and then falls through to the deterministic local path. This prevents a provider outage or double-click from becoming a retry storm or silent bill multiplier.

The store also blocks duplicate ingest/travel execution while a model-backed operation is already busy.

---

## 15. Practical cost model

Typical use after Job 7 behaves like this:

| Action | Model cost behavior |
|---|---|
| First ingestion of a unique prompt/output | At most one bounded decompile call |
| Exact re-ingestion of same prompt/output | Cached, zero model calls |
| First visit to a concept from a particular organism state | At most one bounded transduction call |
| Same concept from same operational state/mind/output | Cached, zero model calls |
| Same concept after descendant changes | New reading allowed; one bounded call at most |
| Change installed mind | New context; new reading allowed |
| Switch Image/Video compile lens | Local, zero model calls |
| Route mutation after concept is known | Local |
| Restore snapshot | Local |
| Compile prompt | Local |
| Provider failure | One attempt, then free deterministic fallback |

The expensive semantic work is concentrated where it adds value. The evolutionary game itself remains local, deterministic, inspectable, and cheap.

---

## 16. Verification history

Development used test-first RED/GREEN checks throughout the branch.

### Job-level verification progression

- Job 1: domain resolver and visual-domain contract tests
- Job 2: visual schema, output filtering, feature meanings, failure surfaces
- Job 3: decompiler normalization, origin creation, fallback extraction
- Job 4: visual transduction, source-word removal, jurisdiction safety, identity protection
- Job 5: visual runtime, image/video compiler, registry/profile activation
- Job 6: visual UI core, image/video lens invariance, operational-concept distinction
- Job 7: cache semantics, state-specific transduction keys, request hardening

### Final Job 7 CI result

The final branch verification on Node 22 reported:

- **33 visual/domain tests passed, 0 failed**
- `npm run typecheck` passed
- Vite client build passed
- SSR build passed
- Nitro/Netlify development build passed

### Broad repository test caveat

The repository's broad `npm test` command includes unrelated workspace/template tests that assume `.grok` files and app-env assets which are not committed to this GitHub repository. Those pre-existing harness assumptions fail independently of the image/video branch. The branch verification workflow therefore runs the relevant domain suites directly and then executes the full TypeScript and Netlify application build gates.

This limitation is recorded rather than treated as a branch success/failure signal.

---

## 17. Production / browser QA still required

The code, targeted behavior, type system, and Netlify development build are verified. One category remains deliberately unclaimed:

**hands-on rendered browser QA.**

This chat environment did not expose a live browser/computer-use surface for the branch. Before merge or public deployment, open the branch in Netlify/local preview and check:

- desktop layout
- narrow mobile layout
- long source prompts
- long invariant text
- large numbers of traits
- PLAY/LAB switching
- trait locking
- source-prompt disclosure panel
- destination search and custom destination travel
- Image/Video compile-lens switching
- clipboard copy behavior
- touch targets
- scroll behavior in the inspector/compile drawer
- real xAI success path
- real xAI timeout/failure fallback
- cache-hit messaging across reloads

No statement in this manual should be read as claiming that this rendered interaction pass has already occurred.

---

## 18. Important source files

### Domain abstraction

- `src/lib/domain/types.ts`
- `src/lib/domain/registry-core.ts`
- `src/lib/domain/registry.ts`
- `src/lib/domain/profiles/music.ts`
- `src/lib/domain/profiles/visual.ts`

### Visual schema / organism interpretation

- `src/lib/domain/visual-schema.ts`
- `src/lib/domain/visual-decompiler-core.ts`
- `src/lib/domain/visual-transducer-core.ts`
- `src/lib/domain/visual-compiler.ts`

### Cost / reliability

- `src/lib/domain/visual-cache-core.ts`
- `src/lib/domain/visual-request-core.ts`

### Provider boundaries

- `src/lib/xai/decompile-visual.ts`
- `src/lib/xai/transduce-visual.ts`

### Runtime

- `src/lib/manifold/store.ts`
- `src/lib/manifold/types.ts`

### UI

- `src/components/console/StartScreen.tsx`
- `src/components/console/VisualGenome.tsx`
- `src/components/console/Inspector.tsx`
- `src/components/console/WordFinder.tsx`
- `src/components/console/CompileDrawer.tsx`

### Verification

- `src/lib/domain/registry-core.test.ts`
- `src/lib/domain/visual-schema.test.ts`
- `src/lib/domain/visual-decompiler-core.test.ts`
- `src/lib/domain/visual-transducer-core.test.ts`
- `src/lib/domain/visual-runtime.test.ts`
- `src/lib/domain/visual-ui-core.test.ts`
- `src/lib/domain/visual-cache-core.test.ts`
- `src/lib/domain/visual-request-core.test.ts`
- `.github/workflows/verify-image-video-branch.yml`

---

## 19. Job-by-job implementation record

### Job 1 - Domain abstraction layer

Separated the persistent manifold engine from the music/Suno shell. Added domain types, registry/profile contracts, generic compile output, music profile wrapping, active `domainId` persistence, and a generic compile drawer. Established the key architecture: `visual` is one evolutionary domain; `image` and `video` are compile kinds.

### Job 2 - Visual domain schema

Defined 36 visual jurisdictions, the prompt-specimen model, shared feature meanings, output-specific filters, and 14 representation failure surfaces. Kept prompt interpretation out of this stage so ingestion and decompilation would remain separate concepts.

### Job 3 - Prompt decompiler

Added extraction-only model decompilation, authoritative normalization, generation-zero conversion, provenance preservation, invariant extraction, uncertainty handling, and deterministic local fallback parsing.

### Job 4 - Visual concept transduction

Made destinations donate operations rather than themes. Added source-word removal, protected-jurisdiction safety, existing-trait rewrite priority, output-aware filtering, known failure-surface context, and structural fallback mechanisms.

### Job 5 - Runtime activation and compilers

Registered the visual profile, activated prompt ingestion, routed visual destinations to the visual transducer, isolated the visual concept field from the music atlas, and added deterministic image/video compilation from the same lineage.

### Job 6 - Visual UI

Added prompt ingestion, Image/Video initial selection, Visual Genome inspection, provenance display, compile-lens switching, and novel-destination safety without deleting the original word-organism workflow.

### Job 7 - Cost, reliability, caching, production hardening

Added persistent AI decompile caching, organism-specific transduction caching, cache bounds/expiry/versioning, AI-only cache persistence, duplicate-call protection, strict server request bounds, configurable hard-capped timeouts, and one-attempt-then-fallback provider behavior.

---

## 20. Architectural invariants worth preserving in future work

These are the decisions most likely to be accidentally broken by later edits:

1. **One visual organism, two renderings.** Image and video are compile lenses, not separate evolutionary domains.
2. **The source prompt is evidence.** Preserve it verbatim; never overwrite provenance with the model's interpretation.
3. **Decompile before mutating.** Generation zero should represent the source prompt's operational structure.
4. **Destinations are operators, not themes.** Concept labels should not survive as lazy visual decoration in donated laws.
5. **Identity protection is structural.** Locked/low-mutability identity constraints must be worked around, not casually rewritten.
6. **The path matters.** Scars, debris, ancestry, and lost traits are part of the organism's history.
7. **Visual concepts are context-specific.** Do not globally reuse a concept reading after the organism changes.
8. **Fallbacks should fail honestly.** Deterministic structural proxies are useful, but they must not masquerade as successful semantic interpretation.
9. **Compilation is local.** Do not add a model call merely to rewrite the final prompt unless a future optional polishing feature is explicitly designed.
10. **Spend should be bounded by architecture, not user restraint.** Token limits, request bounds, cache reuse, and no retry storms belong in code.

---

## 21. What a future Job 8 could be

The original seven-job implementation is complete. Any next phase should be considered a new scope rather than unfinished core work.

Reasonable future directions include:

- browser-based interaction QA and polish from a real Netlify preview
- export/import of visual organisms as portable JSON specimens
- branch comparison between two descendants of the same generation
- explicit "mutation pressure" controls for gentler vs catastrophic travel
- a cache/debug inspector showing why a model call was or was not required
- optional compiler templates tuned to particular image/video generators while preserving the generic organism underneath
- automated browser tests once the intended interaction behavior has been visually approved

These are extensions. They are not required for the completed Jobs 1-7 architecture.

---

## 22. Final status

The image/video prompt manifold is implemented on `feature/image-video-prompt-manifold` and remains separate from `main` pending the user's integration decision.

The completed branch can:

- ingest a real prompt
- preserve the source prompt
- decompile it into generation zero
- protect explicit identity/invariants
- mutate operational visual laws through conceptual travel
- retain path-dependent history
- use image and video as two lenses over one organism
- compile descendants locally
- fall back locally when semantic APIs fail
- avoid repeated semantic spend through bounded, context-aware caching
- pass its visual/domain test suite, TypeScript gate, and Netlify development build

The remaining required pre-merge activity is a rendered browser/Netlify interaction pass, followed by the user's choice about whether and how to integrate the feature branch.
