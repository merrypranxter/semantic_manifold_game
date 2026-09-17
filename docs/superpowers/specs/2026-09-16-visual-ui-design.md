# Visual Prompt Manifold UI — Job 6 Design

## Purpose

Turn the already-working visual runtime into a human-usable image/video prompt instrument without replacing the existing manifold interaction model. The branch remains a path-dependent semantic navigation tool; the new UI simply gives the visual domain an appropriate generation-zero entry point and makes its visual state legible.

## Start flow

The visual branch opens with visual prompt ingestion as the primary action. The user chooses **Image** or **Video**, pastes an existing prompt, and creates generation zero. The source prompt is not rewritten in the UI before ingestion. While decompilation is running, the launch control becomes busy and repeated submission is blocked. Errors stay beside the ingest controls.

The original pulse workflow remains available as a secondary escape hatch so the underlying music/word domain is not destroyed by this branch, but it is visually subordinate to visual prompt ingestion.

## Live visual shell

After ingestion, the existing manifold shell remains: map/field, ruler, route recipe, persistent lineage, minds, command bar, inspector, and compile drawer. The header identifies the active visual output and provides an Image/Video output switch. Switching output changes only the rendering/compile mode of the current organism; it does not increment version, erase ancestry, or create a fake travel event.

The Compile control names the artifact being produced: **Compile Image** or **Compile Video**. The existing generic compile drawer remains the output surface.

## Concept field behavior

The visual domain must not display the built-in music atlas as if those music interpretations were already valid visual regions. Existing visual custom concepts remain visible. A novel typed destination is not pre-expanded with the generic/music `inflateWord()` path. Instead, the label is left unresolved until execution, where the visual transducer from Job 4 interprets it against the current specimen. This preserves the rule that visual concepts become operations on the specimen rather than themed keywords.

## Inspector

For a visual specimen the inspector surfaces:

- output mode and decompiler uncertainty
- preserved source prompt
- persistent identity
- active mutable laws grouped through the existing trait list
- invariants / locked rules
- lineage events, scars, debris, and installed mind as before

PLAY remains a readable summary of the descendant; LAB remains the detailed operational view. No separate visual-only state store is introduced.

## Mobile

The current Map / State mobile split remains. Prompt ingestion must fit in a single-column start screen; Image/Video selection and the primary ingest action must remain reachable without horizontal scrolling. The header may wrap but the output switch and Compile action remain explicit.

## Error and cost behavior

No new model call is introduced by the UI. Prompt ingestion continues to use the single bounded decompiler call (with local fallback). Novel destination execution continues to use the visual transducer only when the label is not already known. Output switching and compilation are local and deterministic.

## Verification

Job 6 must pass the existing image-video domain test suite, add tests proving output-mode switching preserves lineage/provenance, pass `npm run typecheck`, and pass `npm run build:dev` in the branch GitHub Actions workflow. UI behavior is also reviewed statically against the existing component architecture because this connector does not expose an interactive browser for the repository preview.