# Image / Video Prompt Manifold — Job 4

Branch: `feature/image-video-prompt-manifold`

## Visual concept transduction

Job 4 adds a visual-domain concept transducer without replacing the existing music transducer.

### Goal

A destination concept must act on the current visual organism as an operational mechanism rather than as a theme, aesthetic, icon, or bag of keywords. The preferred behavior is to rewrite traits that already exist in the specimen. The concept label remains metadata; donation rules and rewrites must survive a source-word-removal test.

Examples of the intended distinction:

- cheap reading: make the image look like molting
- operational reading: transfer boundary membership while the obsolete surface persists as residue
- cheap reading: add déjà-vu imagery
- operational reading: a present structural relation inherits displaced evidence from its immediately prior arrangement

### Added

- `src/lib/domain/visual-transducer-core.ts`
  - output-aware jurisdiction validation
  - image mode rejects video-only donations
  - source concept words are stripped from operational rule/rewrite text
  - donations aimed only at protected/locked jurisdictions are rejected
  - donations that can rewrite existing mutable jurisdictions are ordered first
  - cliche-forbidden phrases explicitly retain the source label so cheap thematic readings can be blocked later
  - feature-vector normalization and fallback defaults
  - failure-plane validation
  - deterministic local fallback transduction when semantic/API transduction is unavailable
- `src/lib/domain/visual-transducer-core.test.ts`
  - image/video jurisdiction guard
  - source-word-removal test
  - existing-trait rewrite priority test
  - fallback protection of locked identity
- `src/lib/xai/transduce-visual.ts`
  - one bounded xAI call per novel visual destination concept
  - sends a compact summary of the existing specimen, mutable traits, identity, invariants, output mode, and known failure surfaces
  - instructs the model to produce 2–4 operational donations and to prefer rewriting existing jurisdictions
  - explicitly forbids aesthetic adjective soup, concept-themed output, literal iconography, source-word leakage in rules, and mutation of locked identity
  - uses the pure core normalizer as final authority over model output
  - falls back to deterministic local structural pressure on API failure, missing key, timeout, parse failure, or unusable donations
- `package.json`
  - normal test command includes the new visual transducer core suite

### Local fallback behavior

The fallback does not pretend to understand the destination concept semantically. Instead it uses the destination as a deterministic seed and attacks existing mutable traits with a small bank of domain-independent mechanisms such as:

- state residue during membership transfer
- local continuity with global correspondence reassignment
- recursive repetition with inherited error
- separation of cause and persistent effect
- delayed inversion that leaves evidence of both regimes
- conservation of structure while ownership moves between parts/layers

Locked subject identity is avoided by default. If the organism contains no safe mutable visual traits, the fallback applies a generic transformation-mechanism pressure rather than violating an invariant.

### Cost behavior

Visual transduction uses a separate bounded token budget (`XAI_VISUAL_MAX_TOKENS`, default 560; hard clamp 320–720) and a stable conversation/cache id. The expected runtime pattern remains one transduction call for a novel destination concept, after which the resulting concept can be cached in the existing custom-concept state.

### Verification

Test-first RED was established with an unimplemented visual transducer stub. Both initial contract tests failed as expected.

After implementation, the isolated core GREEN suite passed 4/4 tests:

1. image transduction rejects video-only donations
2. source concept words are removed from operational rules/rewrites
3. donations targeting existing mutable jurisdictions are ordered first
4. fallback avoids locked subject identity and attacks existing mutable traits

The repository still requires its normal full `npm test`, `npm run typecheck`, and `npm run build` in a networked/connected development environment before merge. This chat runtime cannot clone/install the repository dependencies.

### Runtime integration boundary

The visual transducer server function is implemented, but the main store still uses the music transducer because the visual runtime profile itself is not registered yet. Wiring the store to dispatch to `transduce-visual.ts` belongs with the Job 5 runtime activation so the branch does not enter a half-registered visual mode with no image/video compiler.

## Next

Job 5: implement the visual runtime profile and image/video compilers, register the `visual` domain, connect prompt-origin creation plus visual concept transduction to the store, and make the same evolved organism compile to either still-image or video prompt output.
