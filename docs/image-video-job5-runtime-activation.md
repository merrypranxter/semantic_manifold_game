# Job 5 — Visual Runtime Activation

Branch: `feature/image-video-prompt-manifold`

Status: implemented and verified on GitHub Actions.

## Goal

Activate the visual domain as a real runtime path instead of a collection of disconnected schema/decompiler/transducer modules. A user prompt can now become generation zero, travel through the existing manifold operators using visual concept transduction, and compile back out as either an image prompt or a video prompt without changing evolutionary lineage.

## Runtime profile

Added `src/lib/domain/profiles/visual.ts` and registered it in `src/lib/domain/registry.ts`.

The visual profile owns the complete visual jurisdiction vocabulary from Job 2, uses the existing semantic metric by default, and supplies the visual compiler. Its ordinary no-input origin is deliberately an **empty placeholder**, not fabricated prompt content. The meaningful visual origin is created by prompt ingestion.

## Prompt ingestion

`src/lib/manifold/store.ts` now exposes `ingestVisualPrompt(rawPrompt, output)`.

That action:

- calls the bounded Job 3 visual decompiler exactly once for the source prompt;
- uses either the AI decompilation or local fallback origin returned by that server function;
- switches the active runtime domain to `visual`;
- makes the returned prompt-derived organism generation zero;
- preserves raw source text/output kind in provenance;
- resets ledger/custom concept state for the new specimen;
- keeps the generation-zero state protected from late persisted rehydration with the existing session-origin mechanism.

## Visual concept routing

Unknown destinations in a visual run now use the Job 4 visual transducer rather than the music transducer.

The store passes the transducer the current visual output mode, organism identity, live traits, invariant text, and optional installed temporary mind. Returned concepts are stored as custom concepts and then consumed by the existing route operators.

The built-in music atlas is deliberately **not** treated as the visual concept field. In visual mode, known concepts are the visual concepts actually transduced/created in that run. This prevents a destination such as déjà vu from silently reusing its old music donations merely because a music concept with the same label already exists.

Music mode keeps its previous atlas/transducer behavior.

## Image / video compiler

Added `src/lib/domain/visual-compiler.ts`.

Compilation is deterministic and local; it does not make another model call.

Both output modes compile from the same descendant state:

- image output uses active shared visual laws and omits video-only temporal jurisdictions;
- video output includes those shared laws plus temporal laws and an additional continuity section when continuity/identity traits exist;
- lost and suppressed traits are excluded;
- strong/absolute invariants are emitted as preservation requirements;
- recent scars/debris are retained as ancestral residue;
- if all active traits disappear, the untouched source prompt can serve as a provenance fallback rather than inventing replacement content.

`compileVisual()` chooses image/video from the organism's provenance output kind unless an explicit compile mode is supplied. It does not mutate lineage.

## Tests

Added `src/lib/domain/visual-runtime.test.ts` covering:

- still-image filtering of temporal laws and lost traits;
- video inclusion of temporal behavior and ancestral scars;
- lineage immutability during compilation;
- visual profile jurisdiction exposure;
- the unseeded placeholder origin refusing to invent source prompt content.

The branch verification workflow runs the complete isolated image/video domain suite, TypeScript typecheck, and a development/Netlify build.

## Verification

GitHub Actions run `35166764252` on commit `a7351fa45d65428aca7492044bce7559b61b3a6f` completed successfully:

- image/video domain tests: **24 passed, 0 failed**;
- `npm run typecheck`: **passed**;
- `npm run build:dev`: **passed**;
- Vite client, SSR, and Nitro/Netlify output all built successfully.

The repository's broad `npm test` command is not used as the Job 5 gate because its unrelated workspace/template script suite assumes `.grok` files and app-env assets that are not committed to this GitHub repository. A diagnostic CI run showed 16 failures in those pre-existing harness assumptions before the domain tests could run. The Job 5 verification workflow therefore executes the domain tests directly, then performs the full TypeScript and application build gates. This limitation is recorded rather than hidden.

## Cost behavior

Job 5 does not add continuous model activity.

- prompt ingestion: at most one bounded decompiler call;
- unknown visual destination: at most one bounded transducer call when first encountered;
- known/transduced concepts: reused locally;
- route operators: local/deterministic;
- image/video compilation: local/deterministic.

Further caching/deduplication belongs to Job 7.

## Deliberately deferred

The runtime API is live, but the existing UI still looks like the music-oriented manifold. Job 6 will expose prompt ingestion, image/video selection, source/provenance, visual laws/invariants, and visual compile controls in the interface without discarding the current map/operator interaction model.

## Next

Job 6 — build the visual UI around the now-live runtime.
