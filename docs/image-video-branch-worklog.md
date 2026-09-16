# Image / Video Prompt Manifold — Branch Worklog

Branch: `feature/image-video-prompt-manifold`

This file is the running implementation record for the image/video branch. It is intentionally kept in the repository so the final project document/PDF can be generated from an exact history instead of reconstructing the work from memory.

## Job 1 — Domain abstraction layer

Status: implemented on this branch.

### Goal

Separate the persistent manifold engine from the medium-specific music/Suno shell without changing the current user-facing music behavior. The branch now has a domain boundary that later jobs can populate with image and video behavior.

### Added

- `src/lib/domain/types.ts`
  - `DomainId`: `music | image | video`
  - generic compile-output sections
  - `DomainProfile` contract for origins, compilers, jurisdictions, hints, and default metric
- `src/lib/domain/registry-core.ts`
  - small domain resolver with a safe fallback
- `src/lib/domain/registry-core.test.ts`
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

- Test-first red/green cycle for the domain resolver was executed separately before implementation.
- The exact domain resolver/test pair was re-run after implementation: 3 tests passed, 0 failed.
- GitHub branch comparison confirms this branch is isolated from `main` and currently changes only the domain-abstraction/test surfaces listed above.

A full repository build/typecheck cannot be executed from this chat runtime because the runtime cannot resolve/download the repository dependencies from GitHub. The branch therefore records targeted executable verification here and should receive a normal `npm test`, `npm run typecheck`, and `npm run build` in a connected dev/deploy environment before merge.

## Next

Job 2: define the visual domain schema — image/video jurisdictions, visual feature meanings, prompt-specimen origin model, and temporal failure surfaces — without yet building the full prompt decompiler.
