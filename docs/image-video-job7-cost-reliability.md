# Job 7 — Cost, Reliability, Caching, and Production Hardening

Branch: `feature/image-video-prompt-manifold`

## Goal

Make the visual manifold cheap enough to use repeatedly on Netlify without weakening the path-dependent architecture or allowing stale concept readings to silently contaminate later descendants.

The two model-backed operations remain:

1. decompile a newly ingested source prompt
2. transduce an unresolved destination concept against the current visual organism

Everything else remains local: route operators, mutation, history, restoring, rendering-lens switching, and compilation.

## Persistent decompile cache

`src/lib/domain/visual-cache-core.ts` defines a versioned cache key for prompt decompilation.

The key includes:

- normalized outer whitespace of the exact source prompt
- Image vs Video output
- cache-schema version
- a non-plaintext hash of the prompt body

The prompt text itself is not embedded in the cache key. The cached decompilation value still contains the prompt specimen because the application already persists the active source prompt in local state/provenance.

Successful AI decompilations are retained locally in the Zustand persisted store. Re-ingesting the exact same prompt/output rebuilds a fresh generation-zero organism from the cached decompilation, so it receives fresh organism ids/timestamps without paying for the same semantic extraction again.

The cache is bounded to 16 decompilations and pruned by recency/age.

## Context-specific transduction cache

Visual destination concepts are organism-specific. A previous reading of `molting`, `déjà vu`, or any other label is not globally valid merely because the spelling matches.

The transduction cache therefore keys on:

- normalized concept label
- image/video output mode
- current organism name and identity
- active trait jurisdictions, names, operational rules, mutability, strength, and lock state
- explicit invariants
- installed temporary mind id

Random state ids and timestamps are deliberately excluded. Restoring the same operational state can therefore reuse the same reading, but changing a mutable law, invariant, output mode, or installed mind creates a cache miss and requires a new reading.

This also fixes an important semantic bug from the pre-cache runtime: `customConcepts` are still useful as visible/map destinations, but a visual concept stored there is no longer treated as automatically valid for every descendant. Runtime execution now resolves visual concepts through the context cache first and retransduces when the organism has changed.

The transduction cache is bounded to 64 entries.

## Fallbacks are never persisted as semantic truth

Only results whose source is `ai` enter the long-lived caches.

The deterministic local decompiler and local visual transducer remain available whenever the API key is missing, the provider returns an error, the request times out, JSON is invalid, or the returned structure is unusable. Those fallbacks are free and reproducible, but they are intentionally **not** persisted in the AI cache.

Reason: a temporary provider outage must not leave a low-confidence fallback cached for weeks and prevent a later session from recovering a richer semantic reading.

## Duplicate-call protection

The store now refuses a second ingest/travel execution while the current model-backed operation is already marked busy. This prevents common double-click/tap duplicate calls from creating parallel provider requests.

Within one visual travel, target and waypoint resolution also consult the just-updated cache, so repeated identical context work can be reused during the same operation.

## Bounded storage

Both caches are persisted locally with the rest of the manifold session, but are bounded and age-pruned instead of growing indefinitely.

Current policy:

- maximum decompile entries: 16
- maximum transduction entries: 64
- AI cache lifetime: 30 days
- expired/malformed/future-dated entries are ignored by lookup and removed during pruning

Cache keys are versioned so future changes to the decompiler/transducer contract can invalidate prior semantics by bumping the key version instead of trying to reinterpret stale structures.

## Server request hardening

Added `src/lib/domain/visual-request-core.ts`.

Before a visual transduction reaches xAI, every user-controlled field is bounded:

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
- strength/mutability clamped to 0–1

This prevents a corrupted/persisted client state from turning one conceptual trip into an unexpectedly huge provider request.

## Fail-cheap behavior

The model calls intentionally do **not** automatically retry.

A 429/5xx response, timeout, network failure, invalid JSON, or unusable structure falls through once to the deterministic local path. This caps accidental spend and prevents a provider outage from creating a retry storm.

Timeouts are configurable but hard-bounded:

- `XAI_DECOMPILE_TIMEOUT_MS`: default 12,000 ms, clamp 4,000–20,000
- `XAI_VISUAL_TIMEOUT_MS`: default 12,000 ms, clamp 4,000–20,000

Existing token budgets remain bounded:

- decompile default 900 tokens, clamp 512–1,400
- visual transduction default 560 tokens, clamp 320–720

## User-visible cost/reliability hints

When generation zero is reconstructed from the decompile cache, the UI hint explicitly says no model call was required.

When a visual destination uses a cached organism-specific transduction, the post-travel hint says the reading was reused without a model call.

When semantic transduction falls back locally, the hint states that the deterministic local transducer was used instead of pretending an AI reading succeeded.

## Tests

Added:

- `visual-cache-core.test.ts`
  - exact prompt/output cache separation
  - cache keys do not expose plaintext prompt text
  - transduction cache follows operational state rather than random ids/timestamps
  - changed rules/output/mind force cache misses
  - bounded/age pruning
  - fallback results are not persistable AI cache entries
- `visual-request-core.test.ts`
  - collection and text bounds
  - numeric clamping
  - output normalization
  - safe empty defaults

The branch verification workflow and normal domain test list now include the UI, cache, and request-hardening suites.

## Verification

Final Job 7 CI on Node 22 reports:

- **33 visual/domain tests passed, 0 failed**
- `npm run typecheck` passed
- Vite client build passed
- SSR build passed
- Nitro/Netlify development build passed

The branch still requires a hands-on rendered browser/Netlify interaction pass for visual spacing, touch ergonomics, and real provider behavior with the deployment environment's xAI key. The code/build verification here does not claim that browser QA has happened.

## Cost model after Job 7

Typical repeat use now behaves like this:

- first ingestion of a unique prompt/output: at most one bounded decompile call
- exact re-ingestion: local cache, zero model calls
- first visit to a concept from a particular operational organism state: at most one bounded transduction call
- same concept from the same operational state/mind/output: local cache, zero model calls
- changed descendant/mind/output: new context, new transduction allowed
- known route mutation after transduction: local
- image/video compilation: local
- image/video rendering-lens switch: local
- provider failure: one attempt, then free deterministic fallback; no retry storm

This keeps semantic model work at the two places where it actually adds value while leaving the evolutionary instrument itself deterministic, inspectable, and cheap.
