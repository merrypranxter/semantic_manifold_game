# Visual Prompt Manifold UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the visual domain usable from the existing app UI: ingest a prompt, inspect generation zero and descendants, switch image/video compile mode without altering lineage, navigate novel visual concepts correctly, and compile the current descendant.

**Architecture:** Preserve the existing console and Zustand store. Add one focused visual-start component, one pure runtime helper for output switching, and minimal domain-aware branches in `ManifoldApp`/`Inspector`. Do not create a second visual state store or replace existing map/history/command components.

**Tech Stack:** React 19, TypeScript, Zustand, Tailwind CSS v4, TanStack Start/Vite, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-16-visual-ui-design.md`

## Global Constraints

- Work only on `feature/image-video-prompt-manifold`.
- Keep image and video as output modes of one `visual` organism.
- Switching output mode must not increment version, change ancestry, or add ledger travel.
- Do not expose the music atlas as pre-interpreted visual concepts.
- Novel visual labels must reach the visual transducer at execution time.
- Add no new model call for output switching or compilation.
- Preserve the current app visual language and mobile Map/State split.

---

### Task 1: Pure output-mode switch

**Files:**
- Create: `src/lib/domain/visual-ui-core.ts`
- Create: `src/lib/domain/visual-ui-core.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `setVisualOutputMode(state: OrganismState, output: VisualOutputKind): OrganismState`
- Produces: `visualOutputMode(state: OrganismState): VisualOutputKind`

- [ ] **Step 1:** Write tests proving an image/video switch preserves `id`, `version`, `ancestry`, raw source prompt, traits, and invariants while changing only `provenance.outputKind`.
- [ ] **Step 2:** Run the branch domain suite and observe the new test fail because the helper does not exist.
- [ ] **Step 3:** Implement the immutable helper and safe output reader.
- [ ] **Step 4:** Re-run the suite and require green.
- [ ] **Step 5:** Commit.

### Task 2: Store output switching

**Files:**
- Modify: `src/lib/manifold/store.ts`

**Interfaces:**
- Adds store action: `setVisualOutput(output: VisualOutputKind): void`
- Consumes `setVisualOutputMode()` from Task 1.

- [ ] **Step 1:** Add the action type and implementation.
- [ ] **Step 2:** Reject/no-op when active domain is not visual or there is no current state.
- [ ] **Step 3:** Replace only the current state snapshot in `states`, clear stale compile output, keep lineage/ledger unchanged, and update the hint.
- [ ] **Step 4:** Run typecheck through CI.
- [ ] **Step 5:** Commit.

### Task 3: Visual generation-zero start panel

**Files:**
- Create: `src/components/console/VisualPromptStart.tsx`
- Modify: `src/components/console/StartScreen.tsx`
- Modify: `src/components/console/ManifoldApp.tsx`

**Interfaces:**
- `VisualPromptStart` props: `busy`, `error`, `onIngest(rawPrompt, output)`.
- `StartScreen` receives the visual-ingest callback and busy state while retaining the legacy pulse/spec/rack actions.

- [ ] **Step 1:** Add Image/Video segmented controls, a multiline prompt field, and a primary `Create generation zero` action.
- [ ] **Step 2:** Disable ingestion for blank input and while busy; keep errors adjacent to the form.
- [ ] **Step 3:** Make visual ingestion the primary start path; retain `Begin as a pulse` as a secondary legacy action.
- [ ] **Step 4:** Wire the form to `useManifold.getState().ingestVisualPrompt`.
- [ ] **Step 5:** Verify mobile-safe single-column layout and no new global CSS dependency.
- [ ] **Step 6:** Commit.

### Task 4: Domain-aware visual navigation and header

**Files:**
- Modify: `src/components/console/ManifoldApp.tsx`
- Modify: `src/components/console/WordFinder.tsx`

**Interfaces:**
- Visual domain concept list comes only from `customConcepts`.
- Novel visual labels create a command proposal without calling `inflateWord()` or pre-planting a generic concept.

- [ ] **Step 1:** Read `domainId` from the store and use it when building the UI concept list.
- [ ] **Step 2:** In visual mode, route a novel word directly into draft/preview so execution invokes the visual transducer.
- [ ] **Step 3:** Keep existing inflate/plant behavior for music.
- [ ] **Step 4:** Add Image/Video output switch in the header and call `setVisualOutput`.
- [ ] **Step 5:** Change compile button copy to `Compile Image` / `Compile Video` in visual mode; keep `Compile` for music.
- [ ] **Step 6:** Update WordFinder placeholder/empty label via optional props so visual copy says `Find a destination — any concept` instead of implying only words.
- [ ] **Step 7:** Commit.

### Task 5: Visual inspector

**Files:**
- Modify: `src/components/console/Inspector.tsx`
- Modify: `src/components/console/ManifoldApp.tsx`

**Interfaces:**
- Inspector receives enough context to render visual provenance when `state.provenance?.domain === "visual"`.

- [ ] **Step 1:** Add a compact visual specimen summary showing output mode, uncertainty, and persistent identity.
- [ ] **Step 2:** Add a preserved source prompt block with bounded height/scrolling so long prompts do not swallow the inspector.
- [ ] **Step 3:** Keep existing PLAY/LAB content and locking behavior unchanged.
- [ ] **Step 4:** Commit.

### Task 6: Verification and worklog

**Files:**
- Modify: `.github/workflows/verify-image-video-branch.yml` only if needed to include the new test.
- Create: `docs/image-video-job6-visual-ui.md`

**Interfaces:** None.

- [ ] **Step 1:** Run the image-video domain suite in GitHub Actions and require zero failures.
- [ ] **Step 2:** Require `npm run typecheck` success.
- [ ] **Step 3:** Require `npm run build:dev` success including Netlify/Nitro output.
- [ ] **Step 4:** Compare branch against `main` and confirm it remains isolated.
- [ ] **Step 5:** Record Job 6 behavior, cost implications, tests, and remaining Job 7 work in the repo worklog.
- [ ] **Step 6:** Commit.