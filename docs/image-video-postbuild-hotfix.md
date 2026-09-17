# Post-build hotfix — stale music-domain compile routing

Branch: `feature/image-video-prompt-manifold`

## Symptom

The first real end-to-end browser run completed the visual workflow correctly until the final **Compile** action, which displayed the music/Suno Style / Lyrics-Control / Caption output instead of an image/video prompt.

## Root cause

The visual organism itself already carried authoritative provenance (`provenance.domain = "visual"`), but `CompileDrawer` still trusted the separately persisted store `domainId` flag. A stale `music` value can survive localStorage across branch/build swaps even while the current organism is visual. That split-brain state allowed the final output boundary to select the music compiler.

## Fix

Added `src/lib/domain/runtime-domain.ts` with `domainIdForOrganism()`.

When explicit organism provenance exists, it wins over stale persisted domain state. Legacy organisms without provenance continue using the stored domain.

`CompileDrawer` now derives its effective domain from the current organism before selecting the output representation and before showing the Image/Video rendering-lens controls. A visual specimen therefore compiles as Image/Video even if old localStorage still says music.

## Regression coverage

Added `src/lib/domain/runtime-domain.test.ts` covering:

- visual provenance overriding stale persisted music state
- explicit music provenance overriding stale visual state
- legacy organisms without provenance retaining their stored domain

Test-first CI failed at the intended missing-module boundary before implementation. Final CI on commit `2c36f982a7fd0e81208110bebb247b749903857b` passed:

- **36 tests passed, 0 failed**
- TypeScript passed
- Vite client/SSR passed
- Nitro/Netlify development build passed

## Architectural lesson

For medium routing, the organism is the primary artifact. Persisted UI/runtime flags are caches of state, not stronger truth than the organism's own provenance.

This issue was found only by the first real browser run after the automated gates were green. Automated verification and hands-on interaction therefore remain complementary release gates.
