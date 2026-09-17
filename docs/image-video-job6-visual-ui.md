# Job 6 — Visual UI

Branch: `feature/image-video-prompt-manifold`

## Goal

Expose the visual manifold as a usable instrument without replacing the existing word-manifold interface or turning image and video into separate organisms.

The interaction model is now:

1. Paste an existing image or video prompt.
2. Choose the initial output lens: Image or Video.
3. Decompile the prompt into generation zero.
4. Inspect preserved source text, identity anchors, invariants, mutable visual laws, inactive/lost laws, scars, and ancestry.
5. Navigate the persistent organism through conceptual space using the existing map/operators/rulers/minds.
6. Compile the current descendant as either an image prompt or a video prompt without forking or mutating its lineage.

## Start surface

`src/components/console/StartScreen.tsx` now gives the visual branch a real entry point.

The source prompt textarea accepts up to 8,000 characters, matching the bounded ingestion contract from Job 3. Image / Video selection is explicit before ingestion. Submitting calls `ingestVisualPrompt()` and creates generation zero through the existing decompiler path.

The screen states that the original prompt is preserved verbatim in provenance and explains the three important layers of the resulting organism:

- identity + invariants
- mutable visual laws
- path-dependent descendants

The original word-organism workflow is still available below the visual entry point, so this branch does not delete the earlier instrument.

## Visual genome inspector

Added `src/components/console/VisualGenome.tsx` and `src/lib/domain/visual-ui-core.ts`.

The inspector exposes the current visual organism as a genome instead of making the user infer it from a generic trait dump.

It displays:

- target output kind
- generation number
- ancestry depth
- identity anchors / low-mutability laws
- mutable laws
- explicit invariants
- inactive / lost laws
- scar count
- preserved original source prompt

Play mode shows a compact genome summary. Lab mode expands the classifications while retaining the existing full trait list and trait-lock controls.

The classification logic lives in `visual-ui-core.ts`, not inside React, so it is independently testable.

## Image / Video rendering lens

`src/components/console/CompileDrawer.tsx` now exposes an Image / Video rendering-lens switch for visual organisms.

This switch is deliberately **not travel**. It does not:

- create a generation
- change the state id
- change ancestry
- rewrite traits
- rewrite scars
- overwrite the preserved source prompt

It simply retargets compilation in memory and asks the local visual compiler for the requested representation.

Image output uses shared visual laws and omits video-only temporal jurisdictions. Video output adds temporal laws and continuity constraints where available.

This preserves the core architecture: one organism, two renderings.

## Novel destination safety

During UI integration, an old word-manifold edge case was found: `WordFinder` could plant a generic lexicon concept before visual travel. A generic planted concept carries the old lexicon/family donation structure and could therefore appear to satisfy concept lookup before the visual transducer had converted it into organism-specific visual operations.

The visual WordFinder path now leaves genuinely novel words as unresolved destinations until travel. At execution time the visual runtime transduces that label against the current specimen, which prevents a generic music/word donor from bypassing visual transduction.

`isVisualOperationalConcept()` also records the runtime distinction explicitly: only concepts with the `visual-transduced` family are considered already operational for the visual domain.

## Test-first verification

Job 6 began with `visual-ui-core.test.ts` before the implementation existed. The branch CI failed at the expected missing-module contract, then passed after the UI core was implemented.

A second regression test was added for the generic-planted-concept edge case. The CI failed before `isVisualOperationalConcept()` existed, then returned green after the visual/runtime distinction and WordFinder fix were implemented.

The branch workflow currently verifies:

- domain registry behavior
- visual schema
- prompt decompiler
- visual transducer
- visual compiler/runtime
- visual UI core
- TypeScript (`tsc --noEmit`)
- full development/Netlify build (`npm run build:dev`)

At the final code head for Job 6, the targeted image/video suite, typecheck, and Netlify development build all passed.

## Visual QA limitation

This chat session does not expose an interactive browser/computer-use surface for the branch, so Job 6 has compile/type/test verification but not screenshot-based or hands-on browser QA. That visual interaction pass should be done when the branch is opened in Netlify/local preview. No claim is made here that rendered spacing or touch ergonomics were visually inspected in-browser.

## Cost behavior

The UI does not add new model calls beyond the architecture already established:

- one bounded decompile call when a source prompt is ingested, with local fallback
- one visual transduction call only when an unresolved destination must be operationalized, with local fallback
- navigation/mutation remains local after a concept is known
- image/video compilation and lens switching are local

## Next

Job 7: cost, reliability, caching, and production hardening. This should make repeated destinations cheaper, make decompile/transduction reuse explicit, improve failure/retry behavior, and prepare the branch for practical Netlify use without turning every click into an API bill.
