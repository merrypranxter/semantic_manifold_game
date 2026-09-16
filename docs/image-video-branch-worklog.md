# Image / Video Prompt Manifold — Branch Worklog

Branch: `feature/image-video-prompt-manifold`

This file is the running implementation record for the image/video branch. It is intentionally kept in the repository so the final project document/PDF can be generated from an exact history instead of reconstructing the work from memory.

## Job 1 — Domain abstraction layer

Status: implemented on this branch; targeted verification completed. Full repo build remains for a connected dev/deploy environment.

### Goal

Separate the persistent manifold engine from the medium-specific music/Suno shell without changing the current user-facing music behavior. The branch now has a domain boundary that later jobs can populate with visual behavior.

Image and video are deliberately **not** separate evolutionary organisms. They are two compile/output modes of one future `visual` domain, so the same prompt lineage can be rendered as a still-image prompt or a temporal/video prompt without throwing away its ancestry.

### Added

- `src/lib/domain/types.ts`
  - `DomainId`: `music | visual`
  - `CompileKind`: `music | image | video`
  - generic compile-output sections
  - `DomainProfile` contract for origins, compilers, jurisdictions, hints, and default metric
- `src/lib/domain/registry-core.ts`
  - small domain resolver with a safe fallback
- `src/lib/domain/registry-core.test.ts`
  - asserts the single-visual-domain / dual-output contract
  - tests requested-domain resolution, fallback behavior, and missing-registry failure
- `src/lib/domain/registry.ts`
  - registry entry point; only the music profile is installed during Job 1
- `src/lib/domain/profiles/music.ts`
  - wraps the existing pulse origin and Suno compiler as the first domain profile
  - preserves current music jurisdictions and compile labels

### Refactored

- `src/lib/manifold/store.ts`
  - stores an active `domainId`
  - creates origin state through the active domain profile
  - compiles through the active domain profile
  - keeps in-session origin state associated with its domain
  - persists `domainId` and restores a safe default for older saves
  - exposes `currentDomain()` for later jobs
- `src/components/console/CompileDrawer.tsx`
  - now renders generic compile sections supplied by a domain profile
  - current music output still appears as Style / Lyrics-Control / Caption with the same limits
- `src/lib/manifold/types.ts`
  - retains named music jurisdictions for autocomplete while allowing future domain-specific jurisdiction names
- `package.json`
  - includes the new domain registry test in the normal test command

### What deliberately did NOT change

- route operators
- manifold metrics
- temporary minds
- scars / memory / debris / lineage behavior
- concept map behavior
- Suno compiler internals
- visible music workflow
- image/video prompt behavior (that begins in Job 2)

### Verification performed

- Test-first type-contract check: `visual` correctly failed against the old `music | image | video` domain union before the architecture was changed.
- After the change, a local TypeScript contract check accepted `DomainId = visual` plus `CompileKind = image | video`.
- The exact domain resolver/test logic was re-run after implementation: **4 tests passed, 0 failed**.
- GitHub branch comparison confirms this branch is isolated from `main` and contains only this branch's domain-abstraction/test/worklog changes.
- The repository has no GitHub Actions workflow/status checks to use as a remote build gate.

A full repository `npm test`, `npm run typecheck`, and `npm run build` cannot be executed from this chat runtime because its shell has no network access to clone/install the repository and dependencies. Do not treat targeted verification as a substitute for that final build gate before merge/deploy.

## Job 2 — Visual domain schema

Status: implemented on this branch; targeted tests and isolated typecheck completed.

### Goal

Define the operational vocabulary for a persistent visual organism before adding prompt decompilation. The schema treats image and video as two views of the same lineage. Image compilation uses the shared spatial/representational state; video compilation additionally activates temporal jurisdictions and failure surfaces.

### Added

- `src/lib/domain/visual-schema.ts`
  - `VisualOutputKind`: `image | video`
  - `VisualSpecimen`: raw prompt container for later ingestion/decompilation
  - `VisualSpecimenClause`: future decompiler output with jurisdiction, role, confidence, and mutability
  - 36 mutation jurisdictions
    - 23 shared visual jurisdictions such as subject identity, anatomy, topology, geometry, boundary, material, surface, biological process, scale, spatial relations, composition, perspective, camera, lighting, color, texture, rendering medium, degradation, environment, transformation mechanism, spatial continuity, symmetry, and causality
    - 13 video-only temporal jurisdictions such as temporal identity, object permanence, frame correspondence, motion, transformation rate, momentum, growth/decay, occlusion, camera motion, before/after relation, temporal topology, time direction, and persistence
  - visual meanings for all eight existing manifold feature axes (`semanticX`, `semanticY`, `structure`, `failure`, `memory`, `temporal`, `topology`, `energy`)
  - 14 explicit model failure surfaces spanning still-image binding/coherence failures and video continuity failures
  - output filters so image mode excludes video-only jurisdictions/failures while video mode sees the full schema
  - `VISUAL_SCHEMA` bundle advertising one `visual` domain with `image` and `video` outputs
- `src/lib/domain/visual-schema.test.ts`
  - verifies key spatial and temporal jurisdictions
  - verifies image/video output filtering
  - verifies feature-axis coverage
  - verifies static and temporal failure-surface coverage
  - verifies raw specimen creation without premature decompilation
  - verifies the one-domain/two-output contract
- `package.json`
  - normal test command now includes `visual-schema.test.ts`

### Prompt specimen model

Job 2 intentionally does **not** try to understand the prompt yet. `createVisualSpecimen()` only trims and preserves the raw prompt, records whether the requested output is image or video, and creates empty slots for decompiled clauses, identity anchors, and explicit invariants. Job 3 will fill those slots.

This keeps ingestion separate from interpretation: the original prompt remains an immutable specimen rather than being overwritten by the model's first reading of it.

### Feature meanings

The existing manifold vector is reused rather than inventing a second visual-only vector:

- `semanticX` → representational distance
- `semanticY` → ontological stability versus process/category ambiguity
- `structure` → strength of relational/constraint structure
- `failure` → pressure on known representational failure surfaces
- `memory` → ancestral residue and visible path dependence
- `temporal` → dependence on frame-to-frame continuity and change
- `topology` → connectivity/boundary pressure
- `energy` → transformation, motion, deformation, and event intensity

### Failure surfaces

Shared still/video failure surfaces currently include identity binding, anatomical correspondence, boundary membership, material consistency, topological continuity, projection coherence, and scale coherence.

Video adds frame identity, object permanence, trajectory continuity, causal continuity, transformation continuity, temporal order, and camera/world separation.

These are defined as operational failure surfaces rather than aesthetic styles so later concept transduction can ask a concept what it *does* to identity, boundaries, topology, correspondence, causality, and continuity instead of simply decorating the prompt with themed adjectives.

### Verification performed

- Test-first RED: the visual schema tests initially failed because `visual-schema.ts` did not exist.
- GREEN: after implementing the schema, the schema contract passed.
- A second RED/GREEN cycle covered output-specific failure-surface filtering.
- Combined isolated domain verification: **11 tests passed, 0 failed** (4 domain-registry tests + 7 visual-schema tests).
- Isolated TypeScript check of the production visual schema passed under strict mode against the existing `CompileKind` and `Features` contracts.

### Deliberately deferred

- no model/API call yet
- no prompt clause extraction yet
- no image/video compiler yet
- no visual domain registration in the runtime registry yet, because its origin factory and compiler do not exist yet
- no UI changes yet
- no changes to operators/minds/metrics yet

## Next

Job 3: build the **Prompt Decompiler**. It will ingest a real user prompt, preserve the untouched original specimen, extract load-bearing visual clauses/anchors/invariants into the new schema, and construct the first visual `OrganismState` without turning the prompt into keyword soup.
