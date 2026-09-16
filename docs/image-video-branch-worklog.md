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

## Next

Job 2: define the **visual domain schema** — shared image/video jurisdictions, visual feature meanings, prompt-specimen origin model, and temporal failure surfaces — without yet building the full prompt decompiler.
