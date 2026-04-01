# UX Coaching Usability — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make KickerCoach usable in real coaching at the foosball table — fast input, big touch targets, connected flows, minimal tap depth.

**Architecture:** 10 targeted fixes across existing components. No new models or store changes. Primarily UI/UX adjustments: CSS size increases, flow wiring, navigation fixes, and one new "retrospective" step in the post-session wizard.

**Tech Stack:** React 18 + TypeScript + Tailwind CSS 4 + Zustand + React Router

---

## Task 1: Touch Targets — Button Minimum 44px

**Files:**
- Modify: `src/components/ui/Button.tsx:13-16`
- Modify: `src/features/train/SessionRating.tsx:108-122`
- Modify: `src/features/players/GoalList.tsx:97-119`

**Step 1: Fix Button sizes to meet 44px minimum**

In `src/components/ui/Button.tsx`, replace the sizes object:

```typescript
const sizes = {
  sm: "px-3 py-2 text-xs min-h-[44px]",
  md: "px-4 py-2.5 text-sm min-h-[44px]",
  lg: "px-6 py-3 text-base min-h-[48px]",
} as const;
```

**Step 2: Fix SessionRating skill buttons from 28px to 44px**

In `src/features/train/SessionRating.tsx`, replace the skill rating button class (line 114):

```tsx
className={`h-11 w-11 rounded-lg text-sm font-semibold transition-all ${
  level <= ratings[cat]
    ? "bg-accent text-white"
    : "bg-border/30 text-text-dim hover:bg-border/50"
}`}
```

**Step 3: Fix GoalList inline action buttons**

In `src/features/players/GoalList.tsx`, replace the three inline buttons (lines 98-118). Each button gets `min-h-[44px] min-w-[44px]` and larger text:

```tsx
<button
  onClick={() => onToggleStatus(goal)}
  className="rounded-lg border border-border min-h-[44px] min-w-[44px] px-3 py-2 text-sm text-text-muted hover:border-accent/50 transition-all"
  title={goal.status === "active" ? "Als erreicht markieren" : "Reaktivieren"}
>
  {goal.status === "active" ? "\u2713" : "\u21BB"}
</button>
<button
  onClick={() => onEdit(goal)}
  className="rounded-lg border border-border min-h-[44px] min-w-[44px] px-3 py-2 text-sm text-text-muted hover:border-accent/50 transition-all"
  title="Bearbeiten"
>
  &#9998;
</button>
<button
  onClick={() => setDeleteId(goal.id)}
  className="rounded-lg border border-border min-h-[44px] min-w-[44px] px-3 py-2 text-sm text-kicker-red hover:border-kicker-red/50 transition-all"
  title="Loeschen"
>
  &#10005;
</button>
```

**Step 4: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: clean, no errors

**Step 5: Commit**

```bash
git add src/components/ui/Button.tsx src/features/train/SessionRating.tsx src/features/players/GoalList.tsx
git commit -m "fix: enforce 44px minimum touch targets for mobile coaching"
```

---

## Task 2: Fix FAB "Bewertung" Action — Direct to Evaluation

**Files:**
- Modify: `src/components/QuickActionFAB.tsx:33-46`

**Step 1: Fix the evaluation action to show an inline player selector + navigate to evaluation**

In `src/components/QuickActionFAB.tsx`, change the `handleAction` case for "evaluation" (line 42-43):

Replace:
```typescript
case "evaluation":
  navigate("/players");
  break;
```

With logic that shows a player picker, then navigates to the player's detail (where ProgressView/evaluations live):
```typescript
case "evaluation":
  if (players.length === 1) {
    navigate(`/players/${players[0].id}`);
  } else if (players.length > 1) {
    setShowPlayerPicker(true);
    setPendingAction("evaluation");
  } else {
    navigate("/players/new");
  }
  break;
```

Add state for the player picker:
```typescript
const [showPlayerPicker, setShowPlayerPicker] = useState(false);
const [pendingAction, setPendingAction] = useState<string | null>(null);
```

Add a player picker sheet (after the note form, before the FAB div). Reuse the same overlay pattern as the note form:
```tsx
{showPlayerPicker && (
  <>
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      onClick={() => setShowPlayerPicker(false)}
    />
    <div className="fixed bottom-24 left-3 right-3 z-50 rounded-2xl border border-border bg-surface p-4 shadow-xl md:left-auto md:right-6 md:w-80">
      <h3 className="mb-3 text-sm font-bold text-text">Spieler waehlen</h3>
      <div className="flex flex-col gap-1 max-h-60 overflow-auto">
        {players.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setShowPlayerPicker(false);
              navigate(`/players/${p.id}`);
            }}
            className="flex items-center gap-2 rounded-lg p-2 text-left hover:bg-card-hover transition-colors min-h-[44px]"
          >
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: p.avatarColor ?? "#6366f1" }}
            >
              {p.name.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm font-medium text-text">{p.name}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => setShowPlayerPicker(false)}
        className="mt-2 w-full rounded-lg py-2 text-xs text-text-muted hover:text-text"
      >
        Abbrechen
      </button>
    </div>
  </>
)}
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: clean

**Step 3: Commit**

```bash
git add src/components/QuickActionFAB.tsx
git commit -m "fix: FAB Bewertung action navigates to player detail instead of list"
```

---

## Task 3: Wire Retrospective Into Post-Session Flow

**Files:**
- Modify: `src/features/train/TrainMode.tsx:23,153-167`

**Step 1: Add "session-retrospective" to the View type and wire it after session-rating**

In `src/features/train/TrainMode.tsx`, line 23, add to View type:
```typescript
type View = "drills" | "timer" | "session-builder" | "journal" | "drill-editor" | "session-rating" | "session-retrospective" | "training-plans" | "training-plan-editor";
```

**Step 2: Add the import for SessionRetrospectiveForm**

Add at top of file:
```typescript
import { SessionRetrospectiveForm } from "./SessionRetrospective";
```

**Step 3: After session-rating completes, go to retrospective instead of journal**

Find the section where SessionRating's `onComplete` callback is handled. It currently calls `setView("journal")`. Change it to:
```typescript
setView("session-retrospective");
```

**Step 4: Add the retrospective view rendering in the view switch**

Add a new view case in the render logic (after session-rating case):
```tsx
{view === "session-retrospective" && lastSavedSession && (
  <div className="flex flex-1 flex-col gap-4 overflow-auto pb-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold">Retrospektive</h2>
    </div>
    <SessionRetrospectiveForm
      initial={lastSavedSession.retrospective}
      onSave={(retro) => {
        updateSession(lastSavedSession.id, { ...lastSavedSession, retrospective: retro });
        setLastSavedSession(null);
        setView("journal");
      }}
      onSkip={() => {
        setLastSavedSession(null);
        setView("journal");
      }}
    />
  </div>
)}
```

**Step 5: Also ensure sessions without players get the retrospective option**

In `handleSaveSession` (line 153-167), change the `else` branch (no players):
```typescript
} else {
  addSession(session);
  setLastSavedSession(session);
  setView("session-retrospective");
}
```

Now ALL sessions get the retrospective prompt (with Skip option).

**Step 6: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: clean

**Step 7: Commit**

```bash
git add src/features/train/TrainMode.tsx
git commit -m "feat: show retrospective form after every session save"
```

---

## Task 4: Quick-Start Session (Last Template or Empty)

**Files:**
- Modify: `src/features/train/TrainMode.tsx`
- Modify: `src/features/home/HomePage.tsx`

**Step 1: Add a "Schnellstart" button in TrainMode's drills view**

In TrainMode, in the drills view header area, add a Quick-Start button that either loads the last template or creates a minimal session:

```tsx
<Button
  onClick={() => {
    const templates = useAppStore.getState().sessionTemplates;
    if (templates.length > 0) {
      const last = templates[templates.length - 1];
      setEditSession(null);
      // Pre-fill from last template by passing state
      setView("session-builder");
      // The session builder will check for quickStartTemplate in location state
    } else {
      setView("session-builder");
    }
  }}
>
  Schnellstart
</Button>
```

Better approach — add a `quickStartTemplate` state to TrainMode:

```typescript
const [quickStartTemplate, setQuickStartTemplate] = useState<string | null>(null);
```

And pass it to SessionBuilder as a prop:
```tsx
<SessionBuilder
  ...existing props...
  quickStartTemplateId={quickStartTemplate}
/>
```

In SessionBuilder, auto-load the template on mount:
```typescript
useEffect(() => {
  if (quickStartTemplateId) {
    const tmpl = sessionTemplates.find((t) => t.id === quickStartTemplateId);
    if (tmpl) {
      setName(tmpl.name);
      setSelectedDrillIds(tmpl.drillIds);
      setFocusAreas(tmpl.focusAreas);
    }
  }
}, [quickStartTemplateId]);
```

**Step 2: Add Quick-Start to HomePage quick actions**

In `src/features/home/HomePage.tsx`, replace the simple "Training" link with a quick-start that passes state:

```tsx
<Link
  to="/train"
  state={{ quickStart: true }}
  className="..."
>
  Schnellstart
</Link>
```

And in TrainMode, detect the quickStart state on mount:
```typescript
const quickStart = (location.state as { quickStart?: boolean } | null)?.quickStart;

useEffect(() => {
  if (quickStart) {
    const templates = useAppStore.getState().sessionTemplates;
    if (templates.length > 0) {
      setQuickStartTemplate(templates[templates.length - 1].id);
      setView("session-builder");
    }
  }
}, [quickStart]);
```

**Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```bash
git add src/features/train/TrainMode.tsx src/features/train/SessionBuilder.tsx src/features/home/HomePage.tsx
git commit -m "feat: add quick-start session from last template"
```

---

## Task 5: Training Plan Sessions — Add Drill Selector

**Files:**
- Modify: `src/features/train/TrainingPlanEditor.tsx`

**Step 1: Add drill selection to plan sessions**

Import DrillSelector or a simplified drill picker. Since the full DrillSelector is too heavy for inline use, add a multi-select with drill names:

Add state and imports:
```typescript
import { useState, useEffect } from "react";
import type { Drill } from "../../domain/models/Drill";

// Inside component, add drill loading:
const [availableDrills, setAvailableDrills] = useState<Drill[]>([]);
const customDrills = useAppStore((s) => s.customDrills);

useEffect(() => {
  import("../../data/drills").then((mod) => mod.loadDrills().then((d) => setAvailableDrills([...d, ...customDrills])));
}, [customDrills]);
```

Add a drill selector for each session template in the week editor. For each session, show a compact drill list with checkboxes:

```tsx
<div className="flex flex-col gap-1">
  <label className="text-[11px] font-medium text-text-dim">Drills</label>
  <div className="flex flex-wrap gap-1">
    {availableDrills.slice(0, 20).map((drill) => (
      <button
        key={drill.id}
        type="button"
        onClick={() => {
          const current = session.drillIds;
          const newIds = current.includes(drill.id)
            ? current.filter((id) => id !== drill.id)
            : [...current, drill.id];
          updateSession(weekIdx, sessionIdx, { drillIds: newIds });
        }}
        className={`rounded-full px-2 py-1 text-[11px] min-h-[36px] transition-all ${
          session.drillIds.includes(drill.id)
            ? "border-2 border-accent bg-accent-dim text-accent-hover"
            : "border border-border text-text-muted"
        }`}
      >
        {drill.name}
      </button>
    ))}
  </div>
  {session.drillIds.length > 0 && (
    <span className="text-[10px] text-text-dim">{session.drillIds.length} Drills gewaehlt</span>
  )}
</div>
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/features/train/TrainingPlanEditor.tsx
git commit -m "feat: add drill selection to training plan sessions"
```

---

## Task 6: Auto-Update Goal Progress From Evaluations

**Files:**
- Modify: `src/store/slices/coachingSlice.ts`

**Step 1: In addEvaluation, auto-update matching goal currentValue**

When an evaluation is saved with skill ratings, find active goals in the same category and update their currentValue to the rating * 20 (mapping 1-5 rating to 0-100 scale):

In `src/store/slices/coachingSlice.ts`, find the `addEvaluation` action and add after the evaluation is pushed:

```typescript
addEvaluation: (evaluation) => set((s) => {
  const newEvaluations = [...s.evaluations, evaluation];

  // Auto-update goal progress from skill ratings
  const updatedGoals = s.goals.map((goal) => {
    if (goal.status !== "active" || goal.playerId !== evaluation.playerId) return goal;
    const matchingRating = evaluation.skillRatings.find((sr) => sr.category === goal.category);
    if (matchingRating && goal.targetValue != null) {
      return { ...goal, currentValue: matchingRating.rating * 20 };
    }
    return goal;
  });

  return { evaluations: newEvaluations, goals: updatedGoals };
}),
```

**Step 2: Write a test for the auto-update logic**

Create/modify `tests/store/goalProgress.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "../../src/store/useAppStore";

describe("Goal auto-progress from evaluation", () => {
  beforeEach(() => {
    useAppStore.setState({
      players: [{ id: "p1", name: "Test", preferredPosition: "both", level: "beginner", notes: "", skillRatings: { Torschuss: 3 }, createdAt: "2024-01-01" }],
      goals: [{
        id: "g1", playerId: "p1", title: "Torschuss verbessern",
        category: "Torschuss", status: "active", targetValue: 80,
        currentValue: 40, createdAt: "2024-01-01",
      }],
      evaluations: [],
    });
  });

  it("updates goal currentValue when evaluation matches category", () => {
    useAppStore.getState().addEvaluation({
      id: "e1", playerId: "p1", date: "2024-06-01",
      skillRatings: [{ category: "Torschuss", rating: 4 }],
      notes: "",
    });
    const goal = useAppStore.getState().goals.find((g) => g.id === "g1");
    expect(goal?.currentValue).toBe(80); // 4 * 20
  });

  it("does not update goal for different category", () => {
    useAppStore.getState().addEvaluation({
      id: "e2", playerId: "p1", date: "2024-06-01",
      skillRatings: [{ category: "Passspiel", rating: 5 }],
      notes: "",
    });
    const goal = useAppStore.getState().goals.find((g) => g.id === "g1");
    expect(goal?.currentValue).toBe(40); // unchanged
  });
});
```

**Step 3: Run tests**

Run: `npx vitest run`
Expected: all pass

**Step 4: Commit**

```bash
git add src/store/slices/coachingSlice.ts tests/store/goalProgress.test.ts
git commit -m "feat: auto-update goal progress when evaluation matches category"
```

---

## Task 7: HomePage Links — Direct to Player Detail

**Files:**
- Modify: `src/features/home/HomePage.tsx:256-280`

**Step 1: Change player links from `/players` to `/players/${player.id}`**

In `src/features/home/HomePage.tsx`, find the frequent players section (around line 256). Replace:

```tsx
<Link
  key={player.id}
  to="/players"
```

With:
```tsx
<Link
  key={player.id}
  to={`/players/${player.id}`}
```

**Step 2: Also fix the "Offene Ziele" link**

If the goals section links to `/players`, change it to link to the specific player's detail (if the goal has a playerId):

```tsx
<Link to={`/players/${goal.playerId}`}>
```

**Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```bash
git add src/features/home/HomePage.tsx
git commit -m "fix: home page links go to specific player detail, not player list"
```

---

## Task 8: Session Template Management

**Files:**
- Modify: `src/features/train/SessionBuilder.tsx`
- Modify: `src/store/slices/sessionSlice.ts` (or wherever deleteSessionTemplate lives)

**Step 1: Check if deleteSessionTemplate exists in store**

Look for the action in the store. If it does not exist, add it to the session slice:

```typescript
deleteSessionTemplate: (id: string) => set((s) => ({
  sessionTemplates: s.sessionTemplates.filter((t) => t.id !== id),
})),
```

**Step 2: Replace the template dropdown with an expandable template list with delete buttons**

In `src/features/train/SessionBuilder.tsx`, replace the Select dropdown (lines 131-152) with:

```tsx
{sessionTemplates.length > 0 && !editSession && (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-medium text-text-dim">Aus Vorlage laden</label>
    <div className="flex flex-wrap gap-1.5">
      {sessionTemplates.map((t) => (
        <div key={t.id} className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setName(t.name);
              setSelectedDrillIds(t.drillIds);
              setFocusAreas(t.focusAreas);
            }}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-text-muted hover:border-accent/50 min-h-[36px] transition-all"
          >
            {t.name} ({t.drillIds.length})
          </button>
          <button
            type="button"
            onClick={() => deleteSessionTemplate(t.id)}
            className="rounded-full border border-border px-2 py-1.5 text-xs text-kicker-red hover:border-kicker-red/50 min-h-[36px] transition-all"
            title="Vorlage loeschen"
          >
            &#10005;
          </button>
        </div>
      ))}
    </div>
  </div>
)}
```

Import `deleteSessionTemplate` from the store:
```typescript
const deleteSessionTemplate = useAppStore((s) => s.deleteSessionTemplate);
```

**Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```bash
git add src/features/train/SessionBuilder.tsx src/store/slices/sessionSlice.ts
git commit -m "feat: session template management with delete buttons"
```

---

## Task 9: Technique Status in ProgressView

**Files:**
- Modify: `src/features/players/ProgressView.tsx`

**Step 1: Add technique status summary to ProgressView**

Import PlayerTechnique and show a summary at the top of ProgressView:

```typescript
import type { PlayerTechnique, TechniqueStatus } from "../../domain/models/PlayerTechnique";

// Add to props
interface ProgressViewProps {
  evaluations: Evaluation[];
  playerTechniques?: PlayerTechnique[];
}
```

Add a technique status summary section before the existing evaluation content:

```tsx
{playerTechniques && playerTechniques.length > 0 && (
  <Card className="mb-3">
    <h3 className="mb-2 text-sm font-semibold text-text">Technik-Status</h3>
    <div className="flex flex-wrap gap-2">
      {(["mastered", "proficient", "developing", "learning", "not_started"] as TechniqueStatus[]).map((status) => {
        const count = playerTechniques.filter((pt) => pt.status === status).length;
        if (count === 0) return null;
        return (
          <div key={status} className="flex items-center gap-1 text-xs">
            <span className={`h-2.5 w-2.5 rounded-full ${STATUS_COLORS[status]}`} />
            <span className="text-text-muted">{STATUS_LABELS[status]}</span>
            <span className="font-medium text-text">{count}</span>
          </div>
        );
      })}
    </div>
  </Card>
)}
```

With constants:
```typescript
const STATUS_LABELS: Record<TechniqueStatus, string> = {
  not_started: "Offen", learning: "Lernend", developing: "Entwickelnd",
  proficient: "Sicher", mastered: "Gemeistert",
};
const STATUS_COLORS: Record<TechniqueStatus, string> = {
  not_started: "bg-border", learning: "bg-kicker-orange", developing: "bg-kicker-blue",
  proficient: "bg-kicker-green", mastered: "bg-accent",
};
```

**Step 2: Pass playerTechniques from PlayerDetail**

In `src/features/players/PlayerDetail.tsx`, where ProgressView is rendered, add the prop:

```tsx
<ProgressView
  evaluations={playerEvaluations}
  playerTechniques={useAppStore((s) => s.playerTechniques.filter((pt) => pt.playerId === player.id))}
/>
```

**Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```bash
git add src/features/players/ProgressView.tsx src/features/players/PlayerDetail.tsx
git commit -m "feat: show technique status summary in player progress view"
```

---

## Task 10: Goal-to-Drill Recommendations Link

**Files:**
- Modify: `src/features/players/GoalList.tsx`

**Step 1: Add "Passende Drills" link to each active goal**

In `src/features/players/GoalList.tsx`, add a link below each goal card that navigates to training with the player pre-selected:

```tsx
import { Link } from "react-router-dom";
```

After the goal description/target date (around line 95), add:

```tsx
{goal.status === "active" && (
  <Link
    to="/train"
    state={{ initialPlayerId: goal.playerId }}
    className="mt-1 inline-block text-[11px] text-accent hover:text-accent-hover transition-colors"
  >
    Passende Drills anzeigen &rarr;
  </Link>
)}
```

This leverages the existing recommendation system in TrainMode which reads `initialPlayerId` from location state and calls `getRecommendedDrillIds` for that player.

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/features/players/GoalList.tsx
git commit -m "feat: link from goals to recommended drills for player"
```

---

## Final Verification

**Step 1: Run all tests**

Run: `npx vitest run`
Expected: all pass (75+ existing + new goal progress tests)

**Step 2: TypeScript check**

Run: `npx tsc --noEmit`
Expected: clean

**Step 3: Build**

Run: `npx vite build`
Expected: successful build with PWA

**Step 4: Deploy**

Run: `vercel --prod --yes`
