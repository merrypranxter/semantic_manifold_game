# Suno Prompt Manifold Implementation Plan

**Goal:** Turn the existing Semantic Manifold Game into a Suno-only instrument where a selectable prompt genotype becomes generation zero, every route operation mutates canonical musical state, and every generation deterministically renders strict Suno STYLE / LYRICS-CONTROL / CAPTION boxes.

**Architecture:** Keep `OrganismState` as the single source of truth. Add seed identity, generation metadata, phonetic rules, and a derived mutation diff; do not persist a second duplicate genome. Add a pure `src/lib/suno/` projection/rendering layer, then recompose the existing console UI so the live prompt is central, the map steers it, the genome inspector explains it, and history restores exact generations.

**Tech Stack:** TypeScript 5.7, React 19, Zustand 5 persistence, Tailwind 4, TanStack/Vite, Node built-in test runner, existing xAI concept transducer only for genuinely novel concepts.

---

## Task 1 — Add the Suno state contract and six deterministic seed organisms

**Files:**
- Modify: `src/lib/manifold/types.ts`
- Modify: `src/lib/manifold/origin.ts`
- Create: `src/lib/suno/seeds.ts`
- Create: `src/lib/suno/seeds.test.ts`
- Modify: `package.json`

**Step 1: Write the failing seed tests.**

Create `src/lib/suno/seeds.test.ts` using `node:test` + `node:assert/strict`. Assert:
- catalog contains exactly the six approved seed ids;
- every seed builds a generation-zero `OrganismState` with `seedId`, `generation === 0`, at least five live traits, at least three distinct mutable jurisdictions, and at least one invariant/locked load-bearing trait;
- seed state has deterministic phonetic rules where applicable;
- no seed definition needs network access.

Run only this test with Node strip-types and confirm it fails because the seed API/types do not exist yet.

**Step 2: Extend the canonical types.**

In `src/lib/manifold/types.ts` add:

```ts
export type PhoneticRule = {
  trigger: string;
  musicalEffect: string;
  strength: number;
};

export type MutationDiff = {
  added: string[];
  mutated: string[];
  suppressed: string[];
  lost: string[];
  scarred: string[];
  preserved: string[];
};
```

Add to `OrganismState`:

```ts
seedId: string;
generation: number;
phoneticRules: PhoneticRule[];
lastMutationDiff?: MutationDiff;
```

Replace legacy output constants with hard windows:

```ts
export const STYLE_MIN = 975;
export const STYLE_MAX = 999;
export const LYRICS_MIN = 4900;
export const LYRICS_MAX = 4999;
export const CAPTION_MIN = 490;
export const CAPTION_MAX = 499;
```

Bump `SAVE_VERSION` from 3 to 4.

**Step 3: Build the seed catalog.**

Create `src/lib/suno/seeds.ts` with a `SunoSeed` type and six local definitions:

1. `productive-contradiction`
2. `reconstructive-memory`
3. `primitive-vacuum`
4. `alien-sensorium`
5. `phonetic-organism`
6. `metabolic-composition`

Each definition contains UI metadata (`label`, `dna`, `description`, `evolvesWellBy`, concise tendency tags) plus the canonical generation-zero traits/invariants/phonetic rules used to construct state.

Export:

```ts
export const SUNO_SEEDS: readonly SunoSeed[];
export function getSunoSeed(id: string): SunoSeed | undefined;
export function createSeedOrigin(seedId: string): OrganismState;
```

Generation-zero state must be musically complete enough to render all three Suno boxes without AI. Seed construction uses local deterministic data only.

**Step 4: Preserve compatibility at the origin boundary.**

Change `src/lib/manifold/origin.ts` so `createOrigin(seedId = "productive-contradiction")` delegates to `createSeedOrigin(seedId)`. This keeps existing imports stable while changing the ontology from anonymous pulse to explicit genotype.

**Step 5: Add Suno tests to `npm test`.**

Extend the TypeScript portion of the test script to include `src/lib/suno/*.test.ts` and the new manifold tests added later. Keep the existing script tests/auth tests intact.

**Step 6: Run the seed tests until green.**

Expected: six seeds, all deterministic, no missing required state fields.

**Step 7: Commit.**

Commit message: `Add Suno genotype state and seed catalog`

---

## Task 2 — Derive the visible genome and attach mutation diffs to every generation

**Files:**
- Create: `src/lib/suno/genome.ts`
- Create: `src/lib/suno/diff.ts`
- Create: `src/lib/suno/genome.test.ts`
- Modify: `src/lib/manifold/reducer.ts`
- Modify: `src/lib/manifold/types.ts`

**Step 1: Write failing genome/diff tests.**

Test that:
- `deriveSunoGenome(state)` is deterministic;
- it does not mutate input;
- traits are grouped by jurisdiction and each receives status `active | locked | scarred | dormant | suppressed | lost`;
- applying a `MUTATE`, `SUPPRESS`, `LOST`, and `SCAR` delta yields a `lastMutationDiff` describing those consequences;
- at least one unchanged locked/invariant trait appears in `preserved`.

**Step 2: Implement `deriveSunoGenome`.**

Create a pure projection, roughly:

```ts
export type DerivedGene = {
  trait: Trait;
  status: "active" | "locked" | "scarred" | "dormant" | "suppressed" | "lost";
};

export type DerivedSunoGenome = {
  seedId: string;
  generation: number;
  byJurisdiction: Record<Jurisdiction, DerivedGene[]>;
  anchors: Trait[];
  scars: Scar[];
  phoneticRules: PhoneticRule[];
};
```

A scar marks a gene as scarred when the trait name appears in scar survivors/lost lists or its jurisdiction is causally represented by the scar; lost/suppressed override scarred; locked overrides ordinary active.

**Step 3: Implement structural diff calculation.**

Create `deriveMutationDiff(before, after, event?)` in `src/lib/suno/diff.ts`. Use trait ids first, names second. Populate all six arrays with human-readable names.

**Step 4: Wire generation metadata into the reducer.**

Update `hydrateOrganism` defaults for old/incomplete states. In `applyDelta`:
- carry seed id;
- increment `generation` exactly once per committed mutation state;
- collect suppressed names as well as added/mutated/lost/scars;
- derive and store `next.lastMutationDiff` after all ops are applied.

Mind slot/eject states count as generations because they alter future mutation rules and must be restorable prompt states.

**Step 5: Run focused tests.**

Confirm no duplicate persisted genome exists and diff output follows actual state changes.

**Step 6: Commit.**

Commit message: `Derive Suno genome and mutation diffs`

---

## Task 3 — Replace clipping with deterministic strict-budget Suno renderers

**Files:**
- Create: `src/lib/suno/fit-budget.ts`
- Create: `src/lib/suno/render-style.ts`
- Create: `src/lib/suno/render-lyrics.ts`
- Create: `src/lib/suno/render-caption.ts`
- Create: `src/lib/suno/render.ts`
- Create: `src/lib/suno/render.test.ts`
- Modify: `src/lib/manifold/compiler.ts`

**Step 1: Write failing render contract tests.**

For every built-in seed and several mutated descendants assert:
- STYLE length is 975–999;
- LYRICS / CONTROL length is 4900–4999;
- CAPTION length is 490–499;
- repeated render of the same state returns byte-identical text;
- render functions do not call `fetch`;
- output contains no arbitrary terminal ellipsis introduced by budget clipping;
- active locked anchors and active scars appear in at least one appropriate box;
- Lyrics/Control contains bracketed musical controls plus process-narration text rather than hard-coded compulsory Verse/Chorus scaffolding.

Stub `globalThis.fetch` to throw so accidental network use fails loudly.

**Step 2: Implement semantic fragments and the budget fitter.**

`fit-budget.ts` accepts ranked fragments rather than raw prose:

```ts
export type PromptFragment = {
  id: string;
  text: string;
  priority: number;
  mandatory?: boolean;
  compact?: string;
  expand?: string[];
};

export function fitPromptBudget(
  fragments: PromptFragment[],
  min: number,
  max: number,
  separator: string,
): string;
```

Rules:
- mandatory fragments always survive;
- add fragments in deterministic priority/id order;
- if over max, use compact variants then remove lowest-priority optional whole fragments;
- if under min, add deterministic `expand` clauses derived from real state;
- if still under min, repeat no meaningless filler; instead select additional state-derived process clauses from renderer-provided expansion pools;
- throw a developer-facing error if a built-in state cannot satisfy the range.

**Step 3: Implement STYLE renderer.**

Generate operational fragments from active genome jurisdictions, invariants, scars, installed Mind constraints, instrumentation/production/performance. Avoid genre imitation and decorative source-word theming.

**Step 4: Implement LYRICS / CONTROL renderer.**

Build a long-form technical control score with sections determined by current state rather than a mandatory pop-song template. Include:
- opening state installation;
- active timing/pitch/form laws;
- current mutation mechanics;
- memory/scar/invariant instructions;
- process narration written as singable technical explanation;
- phonetic engine blocks when present;
- route/Mind consequences;
- controlled recurrence/reformation ending.

Use selective Unicode/gibberish only when it has an explicit phonetic rule.

**Step 5: Implement CAPTION renderer.**

Publishable summary of seed lineage, latest mutation, preserved anchor, and important scar/process. Keep internal type names out of the final prose.

**Step 6: Add unified `renderSuno(state)` API.**

Return:

```ts
{
  style, lyrics, caption,
  styleCount, lyricsCount, captionCount,
  warnings
}
```

**Step 7: Turn `compiler.ts` into a compatibility wrapper.**

Keep `compileSuno` and `CompileBoxes` exports so old imports do not break immediately, but delegate entirely to `renderSuno`. Delete `clip()` and the legacy fixed Verse/Chorus compiler logic.

**Step 8: Run render tests and all existing tests.**

**Step 9: Commit.**

Commit message: `Render strict live Suno prompt boxes`

---

## Task 4 — Make seed selection/persistence/history operate on live prompt generations

**Files:**
- Modify: `src/lib/manifold/store.ts`
- Create: `src/lib/manifold/store-suno.test.ts`
- Modify: `src/lib/manifold/reducer.ts`

**Step 1: Write failing store/persistence tests around pure helpers.**

Extract any migration logic needed into exported pure helpers so Node tests do not require a browser. Test:
- `begin(seedId)` starts selected seed, not anonymous pulse;
- reset returns to genotype selection;
- restore gives canonical state that renders byte-identical prompts to the original snapshot;
- incompatible pre-v4 persisted run becomes `started: false`, clears run-specific states/ledger, preserves valid `customConcepts` where possible, and surfaces a migration hint;
- unknown-concept caching behavior remains unchanged.

**Step 2: Change store start API.**

`begin(seedId: string)` calls `createOrigin(seedId)`. Replace `sessionPulse` with a seed-aware session origin so double-click protection cannot accidentally reuse a different genotype.

**Step 3: Remove compile-as-state from ordinary workflow.**

The UI can render `renderSuno(currentState)` with `useMemo`; no need to persist/cache prompt prose. Remove `compile` and `compileOpen` from the store, or retain only a tiny compatibility export if another component still needs it during the transition. Final V1 should not treat Compile as state.

**Step 4: Add explicit persist migration.**

Use Zustand persist `version: SAVE_VERSION` and `migrate`. Old run state resets to picker while preserving safe custom concept cache; malformed v4 state also fails safe.

**Step 5: Verify ordinary concept execution still makes one state/event and one generation increment.**

Do not add render calls inside mutation/store logic; rendering remains pure view computation.

**Step 6: Commit.**

Commit message: `Make Suno generations seed-aware and restorable`

---

## Task 5 — Build the genotype picker and live prompt centerpiece

**Files:**
- Create: `src/components/console/GenotypePicker.tsx`
- Create: `src/components/console/LivingPromptPanel.tsx`
- Create: `src/components/console/PromptTabs.tsx`
- Modify or retire: `src/components/console/StartScreen.tsx`
- Modify or retire: `src/components/console/CompileDrawer.tsx`

**Step 1: Implement `GenotypePicker`.**

Use `SUNO_SEEDS` as the single catalog. Each card displays name, DNA, concise identity, evolution tendencies, and tags such as scarability/identity retention/destabilization/vocal plasticity. Selecting calls `onChoose(seed.id)`.

Keep the existing robust pointer/click handling principle from `StartScreen`, but avoid duplicate global event plumbing if ordinary buttons are now reliable.

**Step 2: Implement `LivingPromptPanel`.**

Props: state + `renderSuno(state)` result. Features:
- dominant central header: seed name + generation + scar count + locked count;
- tabs STYLE / LYRICS-CONTROL / CAPTION;
- exact count and valid-range indicator;
- copy current box;
- copy all three;
- text scroll area sized to be the visual center;
- mutation summary chips from `lastMutationDiff`.

Changed-clause highlighting should be best-effort and derived from current mutation names/rules. Do not persist markup into prompt text.

**Step 3: Retire Compile Drawer from primary UX.**

Either delete it after callers are removed, or keep as an unused compatibility component until the final cleanup commit. Copy/export lives on the prompt panel.

**Step 4: Verify keyboard and mobile behavior manually in code review.**

Tabs use real buttons; copied state gives visible feedback; long Lyrics text scrolls without expanding the whole page uncontrollably.

**Step 5: Commit.**

Commit message: `Add genotype picker and living prompt panel`

---

## Task 6 — Build the genome inspector and mutation explanation surface

**Files:**
- Create: `src/components/console/GenomeInspector.tsx`
- Create: `src/components/console/MutationDiff.tsx`
- Modify or retire: `src/components/console/Inspector.tsx`

**Step 1: Implement `MutationDiff`.**

Render only non-empty categories: MUTATED, ADDED, SUPPRESSED, LOST, NEW SCAR, PRESERVED. Keep it concise enough to understand what the last route physically did to the musical organism.

**Step 2: Implement `GenomeInspector`.**

Consume `deriveSunoGenome(state)`. Group only jurisdictions that currently contain genes. For each gene show:
- name;
- short rule;
- jurisdiction;
- strength bar;
- status (`locked`, `scarred`, `suppressed`, etc.);
- lock action for live unlocked traits.

Top area shows installed Temporary Mind and opens the existing Mind Rack.

**Step 3: Preserve deep LAB usefulness without making it the main UX.**

Keep relationships/debris/raw state details behind a compact “lab detail” disclosure rather than making users toggle the entire application out of the prompt view.

**Step 4: Commit.**

Commit message: `Add genome and mutation inspector`

---

## Task 7 — Recompose `ManifoldApp` around the approved hierarchy

**Files:**
- Modify: `src/components/console/ManifoldApp.tsx`
- Modify: `src/components/console/HistoryStrip.tsx`
- Modify: `src/components/console/CommandBar.tsx` only if layout embedding requires it
- Modify: `src/styles.css`

**Step 1: Replace startup with genotype selection.**

When no active state exists, show `GenotypePicker`. Seed choice calls `begin(seedId)`. Keep Mind Rack/spec accessible but do not silently create a default seed merely to open a drawer.

**Step 2: Recompose desktop layout.**

Use approximately:

```text
header
┌ steering (left) ┬ living prompt (center, widest) ┬ genome (right) ┐
└─────────────────┴───────────────────────────────┴────────────────┘
lineage/history
```

Preserve:
- `ManifoldMap`
- `FieldChrome`
- `RulerSelector`
- `WordFinder`
- `RouteRecipe`
- `CommandBar`
- `MindRack`
- `SpecDrawer`

The map should remain usable but no longer dominate the screen.

**Step 3: Render live boxes locally after every state change.**

`const prompt = useMemo(() => renderSuno(state), [state]);`

No LLM call. No store side effect.

**Step 4: Build four-view mobile navigation.**

Mobile tabs: PROMPT (default), NAVIGATE, GENOME, LINEAGE. Do not squeeze three desktop columns into phone width.

**Step 5: Revise HistoryStrip.**

Label origin with selected genotype rather than generic “Origin”; display generation numbers; retain exact state restore semantics. Highlight current generation.

**Step 6: Update visual language toward approved mockup without breaking existing design system.**

Dark interface remains; strengthen accent separation for mutation, preserved/locked, scar/lost, and navigation. Avoid a giant unrelated CSS rewrite.

**Step 7: Commit.**

Commit message: `Make the live Suno prompt the main instrument`

---

## Task 8 — Prove path dependence, operator behavior, Minds, and cost constraints

**Files:**
- Create: `src/lib/manifold/suno-operators.test.ts`
- Modify: `src/lib/manifold/operators.ts` only where a test exposes a missing semantic requirement
- Modify: `src/lib/manifold/mind-engine.ts` only where a test exposes a missing mutation-level Mind behavior

**Step 1: Write representative route tests before changing operator code.**

Cover:
- DIRECT has fewer/less destructive consequences than THROUGH for a representative target;
- HOVER changes less trait strength/feature distance than THROUGH;
- VIA applies waypoint causally: A→C render differs from A→B→C render;
- COLLISION creates at least one scar/loss/debris in a compatible representative setup;
- locked STRONG trait survives DIRECT/HOVER/GEODESIC;
- Primitive Deletion Mind makes its constitutive absence mechanically visible in state and render;
- Recall Mutation / Semantic Recoil produce state changes, not merely appended compile prose;
- known-concept route execution has no network dependency.

**Step 2: Make the smallest operator/Mind changes required by failing tests.**

The existing operator and Mind engines are already structurally strong; do not rewrite them wholesale. Prefer targeted changes that make the Suno state consequences explicit and diffable.

**Step 3: Run all manifold + Suno tests.**

**Step 4: Commit.**

Commit message: `Verify Suno path dependence and Mind mutation semantics`

---

## Task 9 — Documentation, cleanup, and full verification

**Files:**
- Modify: `README.md`
- Delete/retire obsolete compile UI imports/files if now unused
- Modify any files surfaced by type/lint/build errors

**Step 1: Update README for the branch.**

Explain:
- choose a genotype;
- live prompt is always present;
- route grammar still works;
- prompt rendering is local/cheap;
- unknown nouns alone may use xAI transduction;
- hard Suno character windows;
- branch layout including `src/lib/suno/`.

**Step 2: Remove dead compile-era plumbing.**

No unused `CompileDrawer`, `FileOutput`, `compileOpen`, or stale “compile after medical history” copy in the final UI. Preserve compatibility functions only if another internal module genuinely uses them.

**Step 3: Run the full verification suite.**

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Expected: all exit 0.

**Step 4: Perform manual smoke cases.**

- Select each of six genotypes and confirm immediate valid prompt boxes.
- Copy each box.
- DIRECT to a known concept.
- VIA through a second concept to a third.
- COLLISION and confirm visible scar/diff.
- Slot and eject a Mind.
- Restore generation zero and a middle ancestor; rendered prompt must return exactly.
- Reload and confirm persistence.
- Enter one novel concept and confirm only transduction path can use xAI.
- Test phone-width Prompt/Navigate/Genome/Lineage views.

**Step 5: Compare branch against `main`.**

Verify modifications stay scoped to Suno specialization plus required tests/docs; do not accidentally alter the original main branch.

**Step 6: Final commit.**

Commit message: `Finish Suno Prompt Manifold v1`

---

## Final acceptance checklist

- Separate branch remains `suno-prompt-manifold`.
- Startup requires an explicit genotype choice.
- Six seeds are local and evolutionally distinct, not genre presets.
- Canonical state remains one source of truth.
- Every state renders live Suno boxes with exact hard windows: 975–999 / 4900–4999 / 490–499.
- No arbitrary truncation or meaningless character padding.
- Every route produces a readable mutation diff.
- Map is steering, prompt is centerpiece, genome is explanation, lineage is restorable.
- Ordinary travel/rendering is zero-API; only novel-concept transduction can call xAI.
- Different paths to the same destination can produce different rendered descendants.
- All automated verification commands pass before claiming completion.
