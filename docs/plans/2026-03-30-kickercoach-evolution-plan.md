# Kicker Coach App Evolution — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Evolve the Kicker Coach App from a functional MVP into a data-driven coaching platform with player profiles, skill tracking, custom drills, centralized state, and analytics.

**Architecture:** Zustand store with Zod-validated localStorage persistence replaces scattered useLocalStorage hooks. Domain models gain versioned schemas with automatic migration. A shared UI component library eliminates Tailwind class duplication across features. New Player, Goal, and Evaluation entities create cross-feature data flow.

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS 4 + Zustand + Zod + Konva (existing) + Plus Jakarta Sans

---

## Phase 1: Foundation (Woche 1–2)

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install zustand and zod**

```bash
cd /Users/michaelprill/Claudeprojekte/Spielergeist/kickercoach-app
npm install zustand zod
```

**Step 2: Verify installation**

```bash
npm ls zustand zod
```

Expected: Both packages listed without errors.

**Step 3: Verify build still works**

```bash
npm run build
```

Expected: Build succeeds with no errors.

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add zustand and zod dependencies"
```

---

### Task 2: Zod Schemas for Existing Models

**Files:**
- Create: `src/domain/schemas/coachCard.ts`
- Create: `src/domain/schemas/drill.ts`
- Create: `src/domain/schemas/session.ts`
- Create: `src/domain/schemas/matchPlan.ts`
- Create: `src/domain/schemas/tacticalBoard.ts`
- Create: `src/domain/schemas/index.ts`
- Create: `tests/domain/schemas.test.ts`

**Step 1: Write tests for all schemas**

Create `tests/domain/schemas.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  DrillSchema,
  SessionSchema,
  MatchPlanSchema,
  TacticalSceneSchema,
  CoachCardSchema,
} from "../../src/domain/schemas";

describe("DrillSchema", () => {
  it("validates a valid drill", () => {
    const drill = {
      id: "pull-shot",
      name: "Pull-Shot",
      focusSkill: "Torschuss",
      blocks: [{ type: "work", durationSeconds: 30, note: "Üben" }],
      difficulty: "beginner",
      description: "Ein grundlegender Schuss",
    };
    expect(DrillSchema.safeParse(drill).success).toBe(true);
  });

  it("rejects drill with missing required fields", () => {
    const drill = { id: "test" };
    expect(DrillSchema.safeParse(drill).success).toBe(false);
  });

  it("accepts drill without optional fields", () => {
    const drill = {
      id: "test",
      name: "Test",
      focusSkill: "Schuss",
      blocks: [],
    };
    expect(DrillSchema.safeParse(drill).success).toBe(true);
  });

  it("adds default values for new fields via migration", () => {
    const oldDrill = {
      id: "test",
      name: "Test",
      focusSkill: "Schuss",
      blocks: [],
      difficulty: "beginner",
    };
    const result = DrillSchema.parse(oldDrill);
    expect(result.isCustom).toBe(false);
    expect(result.playerCount).toBe(1);
  });
});

describe("SessionSchema", () => {
  it("validates a valid session", () => {
    const session = {
      id: "s1",
      name: "Morning",
      date: "2026-03-30",
      drillIds: ["pull-shot"],
      notes: "Gut",
      totalDuration: 300,
    };
    expect(SessionSchema.safeParse(session).success).toBe(true);
  });

  it("adds default values for new fields via migration", () => {
    const oldSession = {
      id: "s1",
      name: "Morning",
      date: "2026-03-30",
      drillIds: [],
      notes: "",
      totalDuration: 0,
    };
    const result = SessionSchema.parse(oldSession);
    expect(result.playerIds).toEqual([]);
    expect(result.focusAreas).toEqual([]);
  });
});

describe("MatchPlanSchema", () => {
  it("validates a valid match plan", () => {
    const plan = {
      id: "mp1",
      opponent: "Team X",
      date: "2026-04-01",
      analysis: "Stark auf 3er",
      gameplan: "Serien auf 5er",
      timeoutStrategies: ["Wechsel"],
      notes: "",
    };
    expect(MatchPlanSchema.safeParse(plan).success).toBe(true);
  });
});

describe("TacticalSceneSchema", () => {
  it("validates a scene with all element types", () => {
    const scene = {
      id: "sc1",
      name: "Szene 1",
      createdAt: "2026-03-30T10:00:00Z",
      updatedAt: "2026-03-30T10:00:00Z",
      figures: [
        {
          id: "f1",
          rodIndex: 0,
          team: "red",
          position: { x: 60, y: 340 },
          figureIndex: 0,
        },
      ],
      arrows: [
        {
          id: "a1",
          arrowType: "pass",
          start: { x: 0, y: 0 },
          end: { x: 100, y: 100 },
        },
      ],
      zones: [
        {
          id: "z1",
          shape: "rectangle",
          origin: { x: 50, y: 50 },
          size: { width: 100, height: 100 },
          color: "rgba(59,130,246,0.15)",
        },
      ],
      ball: { id: "ball", position: { x: 600, y: 340 } },
    };
    expect(TacticalSceneSchema.safeParse(scene).success).toBe(true);
  });

  it("accepts scene without ball", () => {
    const scene = {
      id: "sc1",
      name: "Szene 1",
      createdAt: "2026-03-30T10:00:00Z",
      updatedAt: "2026-03-30T10:00:00Z",
      figures: [],
      arrows: [],
      zones: [],
      ball: null,
    };
    expect(TacticalSceneSchema.safeParse(scene).success).toBe(true);
  });
});

describe("CoachCardSchema", () => {
  it("validates a valid coach card", () => {
    const card = {
      id: "c1",
      title: "Pull-Shot",
      summary: "Grundlegend",
      difficulty: "beginner",
      category: "Torschuss",
      tags: ["schuss"],
      steps: ["Schritt 1"],
      commonMistakes: ["Fehler 1"],
      coachCues: ["Tipp 1"],
    };
    expect(CoachCardSchema.safeParse(card).success).toBe(true);
  });
});
```

**Step 2: Run tests to verify they fail**

```bash
npm test -- tests/domain/schemas.test.ts
```

Expected: FAIL — modules not found.

**Step 3: Create schema files**

Create `src/domain/schemas/coachCard.ts`:

```typescript
import { z } from "zod";

export const DifficultySchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);

export const CategorySchema = z.enum([
  "Torschuss",
  "Passspiel",
  "Ballkontrolle",
  "Defensive",
  "Taktik",
  "Offensive",
  "Mental",
]);

export const CoachCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  difficulty: DifficultySchema,
  category: CategorySchema,
  tags: z.array(z.string()),
  steps: z.array(z.string()),
  commonMistakes: z.array(z.string()),
  coachCues: z.array(z.string()),
  prerequisites: z.array(z.string()).optional(),
  nextCards: z.array(z.string()).optional(),
});
```

Create `src/domain/schemas/drill.ts`:

```typescript
import { z } from "zod";
import { DifficultySchema, CategorySchema } from "./coachCard";

export const TrainingBlockSchema = z.object({
  type: z.enum(["work", "rest"]),
  durationSeconds: z.number().min(0),
  note: z.string(),
});

export const RodPositionSchema = z
  .enum(["keeper", "defense", "midfield", "offense"])
  .optional();

export const DrillSchema = z.object({
  id: z.string(),
  name: z.string(),
  focusSkill: z.string(),
  blocks: z.array(TrainingBlockSchema),
  difficulty: DifficultySchema.optional(),
  description: z.string().optional(),
  category: CategorySchema.optional(),
  position: RodPositionSchema,
  playerCount: z.union([z.literal(1), z.literal(2)]).default(1),
  isCustom: z.boolean().default(false),
  prerequisites: z.array(z.string()).optional(),
  variations: z.array(z.string()).optional(),
  measurableGoal: z.string().optional(),
});
```

Create `src/domain/schemas/session.ts`:

```typescript
import { z } from "zod";
import { CategorySchema } from "./coachCard";

export const MoodSchema = z
  .enum(["great", "good", "ok", "tired", "frustrated"])
  .optional();

export const SessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.string(),
  drillIds: z.array(z.string()),
  notes: z.string(),
  totalDuration: z.number(),
  playerIds: z.array(z.string()).default([]),
  focusAreas: z.array(CategorySchema).default([]),
  rating: z.number().min(1).max(5).optional(),
  mood: MoodSchema,
});
```

Create `src/domain/schemas/matchPlan.ts`:

```typescript
import { z } from "zod";

export const StrategyTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["offensive", "defensive"]),
  description: z.string(),
  tips: z.array(z.string()),
});

export const MatchPlanSchema = z.object({
  id: z.string(),
  opponent: z.string(),
  date: z.string(),
  analysis: z.string(),
  gameplan: z.string(),
  timeoutStrategies: z.array(z.string()),
  notes: z.string(),
  offensiveStrategy: z.string().optional(),
  defensiveStrategy: z.string().optional(),
});
```

Create `src/domain/schemas/tacticalBoard.ts`:

```typescript
import { z } from "zod";

export const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const SizeSchema = z.object({
  width: z.number(),
  height: z.number(),
});

export const TeamSchema = z.enum(["red", "blue"]);
export const ArrowTypeSchema = z.enum(["pass", "shot", "block"]);
export const ZoneShapeSchema = z.enum(["rectangle", "circle"]);

export const FigureMarkerSchema = z.object({
  id: z.string(),
  rodIndex: z.number(),
  team: TeamSchema,
  position: PointSchema,
  figureIndex: z.number(),
});

export const ArrowElementSchema = z.object({
  id: z.string(),
  arrowType: ArrowTypeSchema,
  start: PointSchema,
  end: PointSchema,
});

export const ZoneElementSchema = z.object({
  id: z.string(),
  shape: ZoneShapeSchema,
  origin: PointSchema,
  size: SizeSchema,
  color: z.string(),
});

export const BallMarkerSchema = z.object({
  id: z.string(),
  position: PointSchema,
});

export const TacticalSceneSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  figures: z.array(FigureMarkerSchema),
  arrows: z.array(ArrowElementSchema),
  zones: z.array(ZoneElementSchema),
  ball: BallMarkerSchema.nullable(),
});
```

Create `src/domain/schemas/index.ts`:

```typescript
export { CoachCardSchema, DifficultySchema, CategorySchema } from "./coachCard";
export {
  DrillSchema,
  TrainingBlockSchema,
  RodPositionSchema,
} from "./drill";
export { SessionSchema, MoodSchema } from "./session";
export { MatchPlanSchema, StrategyTemplateSchema } from "./matchPlan";
export {
  TacticalSceneSchema,
  PointSchema,
  SizeSchema,
  TeamSchema,
  ArrowTypeSchema,
  ZoneShapeSchema,
  FigureMarkerSchema,
  ArrowElementSchema,
  ZoneElementSchema,
  BallMarkerSchema,
} from "./tacticalBoard";
```

**Step 4: Run tests to verify they pass**

```bash
npm test -- tests/domain/schemas.test.ts
```

Expected: All tests PASS.

**Step 5: Commit**

```bash
git add src/domain/schemas/ tests/domain/schemas.test.ts
git commit -m "feat: add Zod schemas for all domain models with migration defaults"
```

---

### Task 3: Storage Migration Utility

**Files:**
- Create: `src/store/migrate.ts`
- Create: `tests/store/migrate.test.ts`

**Step 1: Write tests**

Create `tests/store/migrate.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { migrateArray, migrateValue } from "../../src/store/migrate";
import { SessionSchema } from "../../src/domain/schemas";

describe("migrateArray", () => {
  it("migrates valid items and adds defaults", () => {
    const oldSessions = [
      {
        id: "s1",
        name: "Test",
        date: "2026-03-30",
        drillIds: [],
        notes: "",
        totalDuration: 0,
      },
    ];
    const result = migrateArray(oldSessions, SessionSchema);
    expect(result).toHaveLength(1);
    expect(result[0].playerIds).toEqual([]);
    expect(result[0].focusAreas).toEqual([]);
  });

  it("filters out invalid items", () => {
    const data = [
      {
        id: "s1",
        name: "Valid",
        date: "2026-03-30",
        drillIds: [],
        notes: "",
        totalDuration: 0,
      },
      { broken: true },
    ];
    const result = migrateArray(data, SessionSchema);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("s1");
  });

  it("returns empty array for non-array input", () => {
    expect(migrateArray("not-an-array", SessionSchema)).toEqual([]);
    expect(migrateArray(null, SessionSchema)).toEqual([]);
    expect(migrateArray(undefined, SessionSchema)).toEqual([]);
  });
});

describe("migrateValue", () => {
  it("returns parsed value for valid input", () => {
    const session = {
      id: "s1",
      name: "Test",
      date: "2026-03-30",
      drillIds: [],
      notes: "",
      totalDuration: 0,
    };
    const result = migrateValue(session, SessionSchema);
    expect(result).not.toBeNull();
    expect(result!.playerIds).toEqual([]);
  });

  it("returns null for invalid input", () => {
    expect(migrateValue({ broken: true }, SessionSchema)).toBeNull();
  });
});
```

**Step 2: Run tests to verify they fail**

```bash
npm test -- tests/store/migrate.test.ts
```

Expected: FAIL — module not found.

**Step 3: Implement migration utility**

Create `src/store/migrate.ts`:

```typescript
import type { ZodSchema } from "zod";

export function migrateArray<T>(raw: unknown, schema: ZodSchema<T>): T[] {
  if (!Array.isArray(raw)) return [];

  const results: T[] = [];
  for (const item of raw) {
    const parsed = schema.safeParse(item);
    if (parsed.success) {
      results.push(parsed.data);
    }
  }
  return results;
}

export function migrateValue<T>(
  raw: unknown,
  schema: ZodSchema<T>,
): T | null {
  const parsed = schema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test -- tests/store/migrate.test.ts
```

Expected: All tests PASS.

**Step 5: Commit**

```bash
git add src/store/migrate.ts tests/store/migrate.test.ts
git commit -m "feat: add storage migration utility with Zod validation"
```

---

### Task 4: Zustand Store — Core Setup

**Files:**
- Create: `src/store/useAppStore.ts`
- Create: `src/store/index.ts`
- Create: `tests/store/useAppStore.test.ts`
- Modify: `src/domain/constants.ts` (add new STORAGE_KEY)

**Step 1: Write tests**

Create `tests/store/useAppStore.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "../../src/store";

describe("useAppStore", () => {
  beforeEach(() => {
    // Reset store between tests
    useAppStore.setState(useAppStore.getInitialState());
  });

  describe("sessions", () => {
    it("starts with empty sessions", () => {
      expect(useAppStore.getState().sessions).toEqual([]);
    });

    it("adds a session", () => {
      const session = {
        id: "s1",
        name: "Test",
        date: "2026-03-30",
        drillIds: [],
        notes: "",
        totalDuration: 0,
        playerIds: [],
        focusAreas: [],
      };
      useAppStore.getState().addSession(session);
      expect(useAppStore.getState().sessions).toHaveLength(1);
      expect(useAppStore.getState().sessions[0].id).toBe("s1");
    });

    it("updates a session", () => {
      const session = {
        id: "s1",
        name: "Test",
        date: "2026-03-30",
        drillIds: [],
        notes: "",
        totalDuration: 0,
        playerIds: [],
        focusAreas: [],
      };
      useAppStore.getState().addSession(session);
      useAppStore.getState().updateSession("s1", { name: "Updated" });
      expect(useAppStore.getState().sessions[0].name).toBe("Updated");
    });

    it("deletes a session", () => {
      const session = {
        id: "s1",
        name: "Test",
        date: "2026-03-30",
        drillIds: [],
        notes: "",
        totalDuration: 0,
        playerIds: [],
        focusAreas: [],
      };
      useAppStore.getState().addSession(session);
      useAppStore.getState().deleteSession("s1");
      expect(useAppStore.getState().sessions).toEqual([]);
    });
  });

  describe("matchPlans", () => {
    it("starts with empty matchPlans", () => {
      expect(useAppStore.getState().matchPlans).toEqual([]);
    });

    it("adds a match plan", () => {
      const plan = {
        id: "mp1",
        opponent: "Team X",
        date: "2026-04-01",
        analysis: "",
        gameplan: "",
        timeoutStrategies: [],
        notes: "",
      };
      useAppStore.getState().addMatchPlan(plan);
      expect(useAppStore.getState().matchPlans).toHaveLength(1);
    });
  });

  describe("favorites", () => {
    it("toggles favorites", () => {
      useAppStore.getState().toggleFavorite("card-1");
      expect(useAppStore.getState().favorites).toContain("card-1");

      useAppStore.getState().toggleFavorite("card-1");
      expect(useAppStore.getState().favorites).not.toContain("card-1");
    });

    it("checks isFavorite", () => {
      useAppStore.getState().toggleFavorite("card-1");
      expect(useAppStore.getState().isFavorite("card-1")).toBe(true);
      expect(useAppStore.getState().isFavorite("card-2")).toBe(false);
    });
  });

  describe("players", () => {
    it("starts with empty players", () => {
      expect(useAppStore.getState().players).toEqual([]);
    });

    it("adds a player", () => {
      const player = {
        id: "p1",
        name: "Max",
        preferredPosition: "offense" as const,
        level: "beginner" as const,
        notes: "",
        skillRatings: {
          Torschuss: 3,
          Passspiel: 2,
          Ballkontrolle: 2,
          Defensive: 1,
          Taktik: 2,
          Offensive: 3,
          Mental: 2,
        },
        createdAt: "2026-03-30",
      };
      useAppStore.getState().addPlayer(player);
      expect(useAppStore.getState().players).toHaveLength(1);
    });
  });

  describe("selectors", () => {
    it("getPlayerSessions returns sessions for a player", () => {
      useAppStore.getState().addSession({
        id: "s1",
        name: "Test",
        date: "2026-03-30",
        drillIds: [],
        notes: "",
        totalDuration: 300,
        playerIds: ["p1"],
        focusAreas: [],
      });
      useAppStore.getState().addSession({
        id: "s2",
        name: "Other",
        date: "2026-03-30",
        drillIds: [],
        notes: "",
        totalDuration: 300,
        playerIds: ["p2"],
        focusAreas: [],
      });

      const result = useAppStore.getState().getPlayerSessions("p1");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("s1");
    });
  });
});
```

**Step 2: Run tests to verify they fail**

```bash
npm test -- tests/store/useAppStore.test.ts
```

Expected: FAIL — module not found.

**Step 3: Implement the Zustand store**

Create `src/store/useAppStore.ts`:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { migrateArray } from "./migrate";
import { SessionSchema } from "../domain/schemas/session";
import { MatchPlanSchema } from "../domain/schemas/matchPlan";
import { TacticalSceneSchema } from "../domain/schemas/tacticalBoard";
import type { Difficulty, Category } from "../domain/models/CoachCard";
import type { MatchPlan } from "../domain/models/MatchPlan";
import type { TacticalScene } from "../domain/models/TacticalBoard";

// ── Player Types (new) ─────────────────────────────────────────────

export type Position = "offense" | "defense" | "both";

export type SkillRatings = Record<Category, number>;

export interface Player {
  id: string;
  name: string;
  nickname?: string;
  preferredPosition: Position;
  level: Difficulty;
  notes: string;
  skillRatings: SkillRatings;
  avatarColor?: string;
  createdAt: string;
}

// ── Extended Session Type ──────────────────────────────────────────

export interface Session {
  id: string;
  name: string;
  date: string;
  drillIds: string[];
  notes: string;
  totalDuration: number;
  playerIds: string[];
  focusAreas: Category[];
  rating?: number;
  mood?: "great" | "good" | "ok" | "tired" | "frustrated";
}

// ── Goal Type (new) ────────────────────────────────────────────────

export interface Goal {
  id: string;
  playerId: string;
  title: string;
  description?: string;
  category: Category;
  targetDate?: string;
  status: "active" | "achieved" | "paused";
  createdAt: string;
}

// ── Store Interface ────────────────────────────────────────────────

interface AppState {
  // Data
  players: Player[];
  sessions: Session[];
  matchPlans: MatchPlan[];
  boardScenes: TacticalScene[];
  favorites: string[];
  goals: Goal[];

  // Player actions
  addPlayer: (player: Player) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  deletePlayer: (id: string) => void;

  // Session actions
  addSession: (session: Session) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  deleteSession: (id: string) => void;

  // MatchPlan actions
  addMatchPlan: (plan: MatchPlan) => void;
  updateMatchPlan: (id: string, updates: Partial<MatchPlan>) => void;
  deleteMatchPlan: (id: string) => void;
  setMatchPlans: (plans: MatchPlan[]) => void;

  // BoardScene actions
  setBoardScenes: (scenes: TacticalScene[]) => void;

  // Favorite actions
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Goal actions
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Selectors
  getPlayerSessions: (playerId: string) => Session[];
  getPlayerGoals: (playerId: string) => Goal[];
}

// ── Store Version & Migration ──────────────────────────────────────

const STORE_VERSION = 1;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      players: [],
      sessions: [],
      matchPlans: [],
      boardScenes: [],
      favorites: [],
      goals: [],

      // Player actions
      addPlayer: (player) =>
        set((s) => ({ players: [...s.players, player] })),
      updatePlayer: (id, updates) =>
        set((s) => ({
          players: s.players.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        })),
      deletePlayer: (id) =>
        set((s) => ({ players: s.players.filter((p) => p.id !== id) })),

      // Session actions
      addSession: (session) =>
        set((s) => ({ sessions: [...s.sessions, session] })),
      updateSession: (id, updates) =>
        set((s) => ({
          sessions: s.sessions.map((ses) =>
            ses.id === id ? { ...ses, ...updates } : ses,
          ),
        })),
      deleteSession: (id) =>
        set((s) => ({ sessions: s.sessions.filter((ses) => ses.id !== id) })),

      // MatchPlan actions
      addMatchPlan: (plan) =>
        set((s) => ({ matchPlans: [...s.matchPlans, plan] })),
      updateMatchPlan: (id, updates) =>
        set((s) => ({
          matchPlans: s.matchPlans.map((mp) =>
            mp.id === id ? { ...mp, ...updates } : mp,
          ),
        })),
      deleteMatchPlan: (id) =>
        set((s) => ({
          matchPlans: s.matchPlans.filter((mp) => mp.id !== id),
        })),
      setMatchPlans: (plans) => set({ matchPlans: plans }),

      // BoardScene actions
      setBoardScenes: (scenes) => set({ boardScenes: scenes }),

      // Favorite actions
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
      isFavorite: (id) => get().favorites.includes(id),

      // Goal actions
      addGoal: (goal) => set((s) => ({ goals: [...s.goals, goal] })),
      updateGoal: (id, updates) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id ? { ...g, ...updates } : g,
          ),
        })),
      deleteGoal: (id) =>
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      // Selectors
      getPlayerSessions: (playerId) =>
        get().sessions.filter((s) => s.playerIds.includes(playerId)),
      getPlayerGoals: (playerId) =>
        get().goals.filter((g) => g.playerId === playerId),
    }),
    {
      name: "kickercoach-store",
      version: STORE_VERSION,
      migrate: (persistedState, version) => {
        const state = persistedState as Record<string, unknown>;

        if (version === 0 || version === undefined) {
          // Migrate from old localStorage keys to unified store
          return {
            ...state,
            sessions: migrateArray(state.sessions, SessionSchema),
            matchPlans: migrateArray(state.matchPlans, MatchPlanSchema),
            boardScenes: migrateArray(
              state.boardScenes,
              TacticalSceneSchema,
            ),
            players: state.players ?? [],
            favorites: Array.isArray(state.favorites) ? state.favorites : [],
            goals: state.goals ?? [],
          };
        }

        return state as AppState;
      },
    },
  ),
);
```

Create `src/store/index.ts`:

```typescript
export { useAppStore } from "./useAppStore";
export type { Player, Session, Goal, Position, SkillRatings } from "./useAppStore";
export { migrateArray, migrateValue } from "./migrate";
```

**Step 4: Run tests to verify they pass**

```bash
npm test -- tests/store/useAppStore.test.ts
```

Expected: All tests PASS.

**Step 5: Commit**

```bash
git add src/store/ tests/store/
git commit -m "feat: add Zustand store with players, sessions, matchPlans, favorites, goals"
```

---

### Task 5: Migrate Legacy localStorage to Zustand Store

**Files:**
- Create: `src/store/legacyMigration.ts`
- Modify: `src/main.tsx`
- Modify: `src/domain/constants.ts`

**Step 1: Create legacy migration module**

This module reads old localStorage keys, validates data with Zod, writes it into the Zustand store, and deletes the old keys.

Create `src/store/legacyMigration.ts`:

```typescript
import { useAppStore } from "./useAppStore";
import { migrateArray } from "./migrate";
import { SessionSchema } from "../domain/schemas/session";
import { MatchPlanSchema } from "../domain/schemas/matchPlan";
import { TacticalSceneSchema } from "../domain/schemas/tacticalBoard";
import { STORAGE_KEYS } from "../domain/constants";

const LEGACY_MIGRATED_KEY = "kickercoach-legacy-migrated";

export function migrateLegacyStorage(): void {
  if (localStorage.getItem(LEGACY_MIGRATED_KEY)) return;

  const store = useAppStore.getState();
  let migrated = false;

  // Migrate sessions
  const rawSessions = localStorage.getItem(STORAGE_KEYS.sessions);
  if (rawSessions && store.sessions.length === 0) {
    try {
      const parsed = JSON.parse(rawSessions);
      const sessions = migrateArray(parsed, SessionSchema);
      if (sessions.length > 0) {
        useAppStore.setState({ sessions });
        migrated = true;
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  // Migrate match plans
  const rawPlans = localStorage.getItem(STORAGE_KEYS.matchplans);
  if (rawPlans && store.matchPlans.length === 0) {
    try {
      const parsed = JSON.parse(rawPlans);
      const plans = migrateArray(parsed, MatchPlanSchema);
      if (plans.length > 0) {
        useAppStore.setState({ matchPlans: plans });
        migrated = true;
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  // Migrate board scenes
  const rawScenes = localStorage.getItem(STORAGE_KEYS.boardScenes);
  if (rawScenes && store.boardScenes.length === 0) {
    try {
      const parsed = JSON.parse(rawScenes);
      const scenes = migrateArray(parsed, TacticalSceneSchema);
      if (scenes.length > 0) {
        useAppStore.setState({ boardScenes: scenes });
        migrated = true;
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  // Migrate favorites
  const rawFavorites = localStorage.getItem(STORAGE_KEYS.favorites);
  if (rawFavorites && store.favorites.length === 0) {
    try {
      const parsed = JSON.parse(rawFavorites);
      if (Array.isArray(parsed) && parsed.length > 0) {
        useAppStore.setState({ favorites: parsed });
        migrated = true;
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  if (migrated) {
    // Clean up old keys
    localStorage.removeItem(STORAGE_KEYS.sessions);
    localStorage.removeItem(STORAGE_KEYS.matchplans);
    localStorage.removeItem(STORAGE_KEYS.boardScenes);
    localStorage.removeItem(STORAGE_KEYS.favorites);
  }

  localStorage.setItem(LEGACY_MIGRATED_KEY, "true");
}
```

**Step 2: Call migration on app start**

Modify `src/main.tsx` — add the migration call before React renders:

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { migrateLegacyStorage } from "./store/legacyMigration";
import "./index.css";

// Migrate legacy localStorage data to Zustand store
migrateLegacyStorage();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
```

**Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/store/legacyMigration.ts src/main.tsx
git commit -m "feat: add legacy localStorage migration to Zustand store"
```

---

### Task 6: Typography — Plus Jakarta Sans

**Files:**
- Modify: `index.html`
- Modify: `src/index.css`

**Step 1: Add font link to index.html**

Add Google Fonts preconnect and stylesheet link in `<head>` of `index.html`, before the existing `<link rel="icon"`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
  rel="stylesheet"
/>
```

**Step 2: Update font-family in index.css**

In `src/index.css`, change the `body` font-family to:

```css
body {
  background: var(--color-bg);
  font-family:
    "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

**Step 4: Run dev server, visually check font loads**

```bash
npm run dev
```

Open app in browser. All text should now use Plus Jakarta Sans.

**Step 5: Commit**

```bash
git add index.html src/index.css
git commit -m "feat: add Plus Jakarta Sans typography"
```

---

### Task 7: UI Component Library — Button, Badge, Card

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/IconButton.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/index.ts` (partial, will grow)

**Step 1: Create Button component**

Create `src/components/ui/Button.tsx`:

```tsx
import { type ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "border-2 border-accent bg-accent-dim text-accent-hover hover:bg-accent hover:text-white",
  secondary:
    "border border-border bg-surface text-text-muted hover:border-accent/50 hover:text-text",
  ghost: "border border-transparent text-text-muted hover:bg-surface hover:text-text",
  danger:
    "border border-kicker-red/30 bg-kicker-red/10 text-kicker-red hover:bg-kicker-red hover:text-white",
} as const;

const sizes = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-2.5 text-base",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

**Step 2: Create IconButton component**

Create `src/components/ui/IconButton.tsx`:

```tsx
import { type ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  size?: "sm" | "md";
}

export function IconButton({
  active = false,
  size = "md",
  className = "",
  children,
  ...props
}: IconButtonProps) {
  const sizeClass = size === "sm" ? "h-8 w-8 text-sm" : "h-9 w-9 text-base";

  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg transition-all disabled:opacity-50 disabled:pointer-events-none ${sizeClass} ${
        active
          ? "border-2 border-accent bg-accent-dim text-accent-hover"
          : "border border-border text-text-muted hover:border-accent/50 hover:text-text"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

**Step 3: Create Badge component**

Create `src/components/ui/Badge.tsx`:

```tsx
import { type ReactNode } from "react";

const colors = {
  blue: "bg-kicker-blue/15 text-kicker-blue",
  orange: "bg-kicker-orange/15 text-kicker-orange",
  green: "bg-kicker-green/15 text-kicker-green",
  red: "bg-kicker-red/15 text-kicker-red",
  accent: "bg-accent/15 text-accent",
} as const;

interface BadgeProps {
  color?: keyof typeof colors;
  children: ReactNode;
  className?: string;
}

export function Badge({
  color = "accent",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}
```

**Step 4: Create Card component**

Create `src/components/ui/Card.tsx`:

```tsx
import { type ReactNode, type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  children: ReactNode;
}

export function Card({
  interactive = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-4 ${
        interactive
          ? "transition-all hover:border-accent/50 hover:bg-card-hover cursor-pointer"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
```

**Step 5: Create barrel export**

Create `src/components/ui/index.ts`:

```typescript
export { Button } from "./Button";
export { IconButton } from "./IconButton";
export { Badge } from "./Badge";
export { Card } from "./Card";
```

**Step 6: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

**Step 7: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add base UI components — Button, IconButton, Badge, Card"
```

---

### Task 8: UI Component Library — Form Components

**Files:**
- Create: `src/components/ui/Input.tsx`
- Create: `src/components/ui/Textarea.tsx`
- Create: `src/components/ui/Select.tsx`
- Create: `src/components/ui/FormField.tsx`
- Modify: `src/components/ui/index.ts`

**Step 1: Create Input component**

Create `src/components/ui/Input.tsx`:

```tsx
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-xl border bg-surface px-4 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none transition-colors ${
          error ? "border-kicker-red" : "border-border"
        } ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
```

**Step 2: Create Textarea component**

Create `src/components/ui/Textarea.tsx`:

```tsx
import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full rounded-xl border bg-surface px-4 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none transition-colors resize-y min-h-[80px] ${
          error ? "border-kicker-red" : "border-border"
        } ${className}`}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
```

**Step 3: Create Select component**

Create `src/components/ui/Select.tsx`:

```tsx
import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full rounded-xl border bg-surface px-4 py-2 text-sm text-text focus:border-accent focus:outline-none transition-colors ${
          error ? "border-kicker-red" : "border-border"
        } ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";
```

**Step 4: Create FormField component**

Create `src/components/ui/FormField.tsx`:

```tsx
import { type ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  required = false,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-medium text-text-muted">
        {label}
        {required && <span className="ml-0.5 text-kicker-red">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-kicker-red">{error}</p>}
    </div>
  );
}
```

**Step 5: Update barrel export**

Add to `src/components/ui/index.ts`:

```typescript
export { Input } from "./Input";
export { Textarea } from "./Textarea";
export { Select } from "./Select";
export { FormField } from "./FormField";
```

**Step 6: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

**Step 7: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add form UI components — Input, Textarea, Select, FormField"
```

---

### Task 9: UI Component Library — Modal, ConfirmDialog, EmptyState, Tabs

**Files:**
- Create: `src/components/ui/Modal.tsx`
- Create: `src/components/ui/ConfirmDialog.tsx`
- Create: `src/components/ui/EmptyState.tsx`
- Create: `src/components/ui/Tabs.tsx`
- Modify: `src/components/ui/index.ts`

**Step 1: Create Modal component**

Create `src/components/ui/Modal.tsx`:

```tsx
import { type ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function Modal({ open, onClose, title, children, actions }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-dim hover:text-text transition-colors"
            aria-label="Schliessen"
          >
            &#10005;
          </button>
        </div>
        <div className="text-sm text-text-muted">{children}</div>
        {actions && (
          <div className="mt-6 flex justify-end gap-3">{actions}</div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Create ConfirmDialog component**

Create `src/components/ui/ConfirmDialog.tsx`:

```tsx
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Löschen",
  cancelLabel = "Abbrechen",
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
}
```

**Step 3: Create EmptyState component**

Create `src/components/ui/EmptyState.tsx`:

```tsx
import { Button } from "./Button";

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <span className="text-4xl">{icon}</span>
      <h3 className="text-base font-bold text-text">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-text-muted">{description}</p>
      )}
      {action && (
        <Button size="sm" onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

**Step 4: Create Tabs component**

Create `src/components/ui/Tabs.tsx`:

```tsx
interface Tab<T extends string> {
  value: T;
  label: string;
  icon?: string;
}

interface TabsProps<T extends string> {
  tabs: Tab<T>[];
  active: T;
  onChange: (value: T) => void;
}

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: TabsProps<T>) {
  return (
    <div className="flex gap-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
            active === tab.value
              ? "border-2 border-accent bg-accent-dim text-accent-hover"
              : "border border-border text-text-muted hover:border-accent/50 hover:text-text"
          }`}
          aria-pressed={active === tab.value}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

**Step 5: Update barrel export**

Add to `src/components/ui/index.ts`:

```typescript
export { Modal } from "./Modal";
export { ConfirmDialog } from "./ConfirmDialog";
export { EmptyState } from "./EmptyState";
export { Tabs } from "./Tabs";
```

**Step 6: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

**Step 7: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add Modal, ConfirmDialog, EmptyState, Tabs UI components"
```

---

### Task 10: Migrate Train Feature to Zustand + UI Components

**Files:**
- Modify: `src/features/train/TrainMode.tsx`
- Modify: `src/features/train/SessionBuilder.tsx`
- Modify: `src/features/train/Journal.tsx`
- Modify: `src/features/train/DrillSelector.tsx`

**Step 1: Update TrainMode.tsx**

Replace `useLocalStorage` for sessions and autoAdvance with `useAppStore`:

- Import `useAppStore` from `../../store`
- Import `Tabs`, `EmptyState`, `ConfirmDialog` from `../../components/ui`
- Replace `const [sessions, setSessions] = useLocalStorage(STORAGE_KEYS.sessions, [])` with `const sessions = useAppStore((s) => s.sessions)` and `const addSession = useAppStore((s) => s.addSession)`, etc.
- Replace view tabs with `<Tabs>` component
- Add `ConfirmDialog` for delete actions
- Keep `useLocalStorage` only for `autoAdvance` (UI-only preference)

**Step 2: Update SessionBuilder.tsx**

- Replace `onSave` callback to use store's `addSession` directly, or keep prop-based and let parent use store
- Add `playerIds: []`, `focusAreas: []` to the created Session object
- Use `FormField`, `Input`, `Textarea` from UI components

**Step 3: Update Journal.tsx**

- Replace inline stat boxes with `Card` component
- Add `EmptyState` when sessions list is empty
- Use `ConfirmDialog` for delete

**Step 4: Update DrillSelector.tsx**

- Use `Badge` for difficulty indicators
- Use `Card` for drill items

**Step 5: Verify build and manual test**

```bash
npm run build && npm run dev
```

Navigate to /train, verify:
- Timer still works
- Sessions still load from store
- Delete shows confirmation dialog
- Empty state shows when no sessions

**Step 6: Run existing tests**

```bash
npm test
```

Expected: All tests still pass.

**Step 7: Commit**

```bash
git add src/features/train/
git commit -m "refactor: migrate Train feature to Zustand store + UI components"
```

---

### Task 11: Migrate Learn Feature to Zustand + UI Components

**Files:**
- Modify: `src/features/learn/LearnMode.tsx`
- Modify: `src/features/learn/SearchFilter.tsx`
- Modify: `src/features/learn/CardGrid.tsx`
- Modify: `src/features/learn/CardDetail.tsx`

**Step 1: Update LearnMode.tsx**

- Replace `useFavorites()` with `useAppStore` favorites: `const favorites = useAppStore((s) => s.favorites)`, `const toggleFavorite = useAppStore((s) => s.toggleFavorite)`, `const isFavorite = useAppStore((s) => s.isFavorite)`

**Step 2: Update CardGrid.tsx and CardDetail.tsx**

- Use `Badge` for difficulty/category badges
- Use `Card` for card items
- Use `Button` for action buttons

**Step 3: Update SearchFilter.tsx**

- Use `Input` for search field
- Use `Tabs` or keep existing button pattern (both valid)

**Step 4: Verify build and manual test**

```bash
npm run build && npm run dev
```

Navigate to /learn, verify favorites still toggle correctly.

**Step 5: Commit**

```bash
git add src/features/learn/
git commit -m "refactor: migrate Learn feature to Zustand store + UI components"
```

---

### Task 12: Migrate Plan Feature to Zustand + UI Components

**Files:**
- Modify: `src/features/plan/PlanMode.tsx`
- Modify: `src/features/plan/MatchPlanEditor.tsx`
- Modify: `src/features/plan/MatchPlanList.tsx`

**Step 1: Update PlanMode.tsx**

- Replace `useLocalStorage(STORAGE_KEYS.matchplans, [])` with:
  ```typescript
  const matchPlans = useAppStore((s) => s.matchPlans);
  const addMatchPlan = useAppStore((s) => s.addMatchPlan);
  const updateMatchPlan = useAppStore((s) => s.updateMatchPlan);
  const deleteMatchPlan = useAppStore((s) => s.deleteMatchPlan);
  const setMatchPlans = useAppStore((s) => s.setMatchPlans);
  ```
- Import handling stays the same but uses `setMatchPlans` for import

**Step 2: Update MatchPlanEditor.tsx**

- Use `FormField`, `Input`, `Textarea`, `Select` from UI components
- Use `Button` for save/cancel

**Step 3: Update MatchPlanList.tsx**

- Use `Card` for plan items
- Use `Button` for actions
- Add `EmptyState` when no plans exist
- Add `ConfirmDialog` for delete

**Step 4: Verify build and manual test**

```bash
npm run build && npm run dev
```

Navigate to /plan, verify CRUD and import/export still work.

**Step 5: Commit**

```bash
git add src/features/plan/
git commit -m "refactor: migrate Plan feature to Zustand store + UI components"
```

---

### Task 13: Migrate Board Feature to Zustand + UI Components

**Files:**
- Modify: `src/features/board/BoardMode.tsx`
- Modify: `src/features/board/components/SceneManager.tsx`
- Modify: `src/features/board/components/Toolbar.tsx`

**Step 1: Update BoardMode.tsx**

- Replace `useLocalStorage(STORAGE_KEYS.boardScenes, [])` with:
  ```typescript
  const boardScenes = useAppStore((s) => s.boardScenes);
  const setBoardScenes = useAppStore((s) => s.setBoardScenes);
  ```
- Scene save/load/delete still works through the array, just stored in Zustand now

**Step 2: Update Toolbar.tsx**

- Use `Button`, `IconButton` from UI components where appropriate
- Keep existing layout structure

**Step 3: Update SceneManager.tsx**

- Use `Modal` component instead of custom overlay
- Use `Button`, `Input` from UI components
- Add `ConfirmDialog` for scene delete

**Step 4: Verify build and manual test**

```bash
npm run build && npm run dev
```

Navigate to /board, verify canvas, toolbar, scenes, export still work.

**Step 5: Commit**

```bash
git add src/features/board/
git commit -m "refactor: migrate Board feature to Zustand store + UI components"
```

---

### Task 14: Clean Up Legacy Hooks

**Files:**
- Modify: `src/hooks/useFavorites.ts` — add deprecation comment, keep for now
- Modify: `src/hooks/useLocalStorage.ts` — keep only for non-store data (autoAdvance)
- Modify: `src/features/home/HomePage.tsx` — use `Button`, `Card`, `Badge` from UI components

**Step 1: Update HomePage.tsx**

- Refactor `FeatureCard` to use `Card` component internally
- Use `Badge` for stat badges
- Use `Button` or keep as `Link` (links don't need Button)

**Step 2: Verify no feature uses old localStorage hooks for store data**

```bash
grep -r "useLocalStorage.*STORAGE_KEYS\.\(sessions\|matchplans\|boardScenes\|favorites\)" src/features/
```

Expected: No matches (all migrated to store).

**Step 3: Verify full build and all tests**

```bash
npm run build && npm test
```

Expected: Build succeeds, all tests pass.

**Step 4: Commit**

```bash
git add src/hooks/ src/features/home/
git commit -m "refactor: clean up legacy hooks, update HomePage to UI components"
```

---

### Task 15: Add Empty States and Confirm Dialogs Throughout

**Files:**
- Verify all list views have empty states
- Verify all delete actions have confirm dialogs

**Step 1: Audit and add missing empty states**

Check each feature for empty list handling:
- `/learn` — CardGrid with no results → EmptyState "Keine Karten gefunden"
- `/train` — Journal with no sessions → EmptyState "Noch keine Trainingseinheiten"
- `/plan` — MatchPlanList with no plans → EmptyState "Noch keine Matchpläne"
- `/board` — SceneManager with no scenes → EmptyState "Noch keine Szenen gespeichert"

**Step 2: Verify all delete actions use ConfirmDialog**

- Session delete in Journal
- MatchPlan delete in MatchPlanList
- Scene delete in SceneManager

**Step 3: Manual test all empty states and confirm dialogs**

```bash
npm run dev
```

Clear localStorage, navigate through all features, verify empty states render and delete dialogs work.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add empty states and confirm dialogs throughout all features"
```

---

## Phase 2: Core Features (Woche 3–5)

### Task 16: Player Domain Model + Schema

**Files:**
- Create: `src/domain/models/Player.ts`
- Create: `src/domain/schemas/player.ts`
- Create: `tests/domain/player.test.ts`
- Modify: `src/domain/schemas/index.ts`

**Step 1: Write tests**

Create `tests/domain/player.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { PlayerSchema, DEFAULT_SKILL_RATINGS } from "../../src/domain/schemas/player";

describe("PlayerSchema", () => {
  it("validates a complete player", () => {
    const player = {
      id: "p1",
      name: "Max Mustermann",
      nickname: "Maxi",
      preferredPosition: "offense",
      level: "intermediate",
      notes: "Starker Pull-Shot",
      skillRatings: {
        Torschuss: 4,
        Passspiel: 3,
        Ballkontrolle: 3,
        Defensive: 2,
        Taktik: 3,
        Offensive: 4,
        Mental: 3,
      },
      avatarColor: "#3b82f6",
      createdAt: "2026-03-30",
    };
    expect(PlayerSchema.safeParse(player).success).toBe(true);
  });

  it("applies default skill ratings", () => {
    const player = {
      id: "p1",
      name: "Min",
      preferredPosition: "both",
      level: "beginner",
      notes: "",
      createdAt: "2026-03-30",
    };
    const result = PlayerSchema.parse(player);
    expect(result.skillRatings).toEqual(DEFAULT_SKILL_RATINGS);
  });

  it("rejects invalid position", () => {
    const player = {
      id: "p1",
      name: "Test",
      preferredPosition: "goalkeeper",
      level: "beginner",
      notes: "",
      skillRatings: DEFAULT_SKILL_RATINGS,
      createdAt: "2026-03-30",
    };
    expect(PlayerSchema.safeParse(player).success).toBe(false);
  });

  it("rejects skill ratings outside 1-5", () => {
    const player = {
      id: "p1",
      name: "Test",
      preferredPosition: "offense",
      level: "beginner",
      notes: "",
      skillRatings: { ...DEFAULT_SKILL_RATINGS, Torschuss: 6 },
      createdAt: "2026-03-30",
    };
    expect(PlayerSchema.safeParse(player).success).toBe(false);
  });
});
```

**Step 2: Run tests to verify they fail**

```bash
npm test -- tests/domain/player.test.ts
```

Expected: FAIL.

**Step 3: Create Player model**

Create `src/domain/models/Player.ts`:

```typescript
import type { Difficulty, Category } from "./CoachCard";

export type Position = "offense" | "defense" | "both";

export type SkillRatings = Record<Category, number>;

export interface Player {
  id: string;
  name: string;
  nickname?: string;
  preferredPosition: Position;
  level: Difficulty;
  notes: string;
  skillRatings: SkillRatings;
  avatarColor?: string;
  createdAt: string;
}
```

**Step 4: Create Player schema**

Create `src/domain/schemas/player.ts`:

```typescript
import { z } from "zod";
import { DifficultySchema, CategorySchema } from "./coachCard";

export const PositionSchema = z.enum(["offense", "defense", "both"]);

const SkillRatingValue = z.number().int().min(1).max(5);

export const SkillRatingsSchema = z.object({
  Torschuss: SkillRatingValue,
  Passspiel: SkillRatingValue,
  Ballkontrolle: SkillRatingValue,
  Defensive: SkillRatingValue,
  Taktik: SkillRatingValue,
  Offensive: SkillRatingValue,
  Mental: SkillRatingValue,
});

export const DEFAULT_SKILL_RATINGS = {
  Torschuss: 3,
  Passspiel: 3,
  Ballkontrolle: 3,
  Defensive: 3,
  Taktik: 3,
  Offensive: 3,
  Mental: 3,
} as const;

export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  nickname: z.string().optional(),
  preferredPosition: PositionSchema,
  level: DifficultySchema,
  notes: z.string(),
  skillRatings: SkillRatingsSchema.default(DEFAULT_SKILL_RATINGS),
  avatarColor: z.string().optional(),
  createdAt: z.string(),
});
```

Update `src/domain/schemas/index.ts` — add:

```typescript
export {
  PlayerSchema,
  PositionSchema,
  SkillRatingsSchema,
  DEFAULT_SKILL_RATINGS,
} from "./player";
```

**Step 5: Run tests to verify they pass**

```bash
npm test -- tests/domain/player.test.ts
```

Expected: All tests PASS.

**Step 6: Commit**

```bash
git add src/domain/models/Player.ts src/domain/schemas/player.ts src/domain/schemas/index.ts tests/domain/player.test.ts
git commit -m "feat: add Player domain model with skill ratings schema"
```

---

### Task 17: Player Feature — List, Detail, Form

**Files:**
- Create: `src/features/players/PlayerList.tsx`
- Create: `src/features/players/PlayerDetail.tsx`
- Create: `src/features/players/PlayerForm.tsx`
- Create: `src/features/players/SkillRadar.tsx`
- Create: `src/features/players/index.tsx` (route component)

**Step 1: Create SkillRadar component (CSS-only bars)**

Create `src/features/players/SkillRadar.tsx`:

```tsx
import type { SkillRatings } from "../../domain/models/Player";
import { CATEGORY_COLORS } from "../../domain/constants";
import type { Category } from "../../domain/models/CoachCard";

const CATEGORIES: Category[] = [
  "Torschuss",
  "Passspiel",
  "Ballkontrolle",
  "Defensive",
  "Taktik",
  "Offensive",
  "Mental",
];

interface SkillRadarProps {
  ratings: SkillRatings;
  editable?: boolean;
  onChange?: (category: Category, value: number) => void;
}

export function SkillRadar({ ratings, editable = false, onChange }: SkillRadarProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {CATEGORIES.map((cat) => (
        <div key={cat} className="flex items-center gap-3">
          <span className="w-28 text-xs font-medium text-text-muted truncate">
            {cat}
          </span>
          <div className="flex flex-1 gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                disabled={!editable}
                onClick={() => editable && onChange?.(cat, level)}
                className={`h-6 flex-1 rounded transition-all ${
                  level <= ratings[cat]
                    ? CATEGORY_COLORS[cat]
                    : "bg-border/30"
                } ${editable ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
                aria-label={`${cat}: ${level}`}
              />
            ))}
          </div>
          <span className="w-6 text-center text-xs font-semibold text-text-muted">
            {ratings[cat]}
          </span>
        </div>
      ))}
    </div>
  );
}
```

Note: `CATEGORY_COLORS` in constants currently returns Tailwind class strings like `bg-kicker-blue/15 text-kicker-blue`. For the SkillRadar bars, we need solid background colors. This will require adding a `CATEGORY_BAR_COLORS` constant to `src/domain/constants.ts`:

```typescript
export const CATEGORY_BAR_COLORS: Record<Category, string> = {
  Torschuss: "bg-kicker-red/70",
  Passspiel: "bg-kicker-blue/70",
  Ballkontrolle: "bg-kicker-orange/70",
  Defensive: "bg-kicker-green/70",
  Taktik: "bg-accent/70",
  Offensive: "bg-kicker-red/50",
  Mental: "bg-accent-hover/70",
};
```

Update `SkillRadar.tsx` to use `CATEGORY_BAR_COLORS` instead of `CATEGORY_COLORS`.

**Step 2: Create PlayerForm component**

Create `src/features/players/PlayerForm.tsx`:

```tsx
import { useState } from "react";
import { Button, FormField, Input, Textarea, Select } from "../../components/ui";
import { SkillRadar } from "./SkillRadar";
import { DEFAULT_SKILL_RATINGS } from "../../domain/schemas/player";
import type { Player, Position, SkillRatings } from "../../domain/models/Player";
import type { Difficulty, Category } from "../../domain/models/CoachCard";

const AVATAR_COLORS = [
  "#3b82f6", "#ef4444", "#22c55e", "#f59e0b",
  "#6366f1", "#ec4899", "#14b8a6", "#f97316",
];

interface PlayerFormProps {
  player?: Player;
  onSave: (player: Player) => void;
  onCancel: () => void;
}

export function PlayerForm({ player, onSave, onCancel }: PlayerFormProps) {
  const [name, setName] = useState(player?.name ?? "");
  const [nickname, setNickname] = useState(player?.nickname ?? "");
  const [position, setPosition] = useState<Position>(player?.preferredPosition ?? "both");
  const [level, setLevel] = useState<Difficulty>(player?.level ?? "beginner");
  const [notes, setNotes] = useState(player?.notes ?? "");
  const [skillRatings, setSkillRatings] = useState<SkillRatings>(
    player?.skillRatings ?? { ...DEFAULT_SKILL_RATINGS },
  );
  const [avatarColor, setAvatarColor] = useState(
    player?.avatarColor ?? AVATAR_COLORS[0],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name ist erforderlich";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: player?.id ?? crypto.randomUUID(),
      name: name.trim(),
      nickname: nickname.trim() || undefined,
      preferredPosition: position,
      level,
      notes,
      skillRatings,
      avatarColor,
      createdAt: player?.createdAt ?? new Date().toISOString().slice(0, 10),
    });
  }

  function handleSkillChange(category: Category, value: number) {
    setSkillRatings((prev) => ({ ...prev, [category]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 overflow-auto pb-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Name" required error={errors.name}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Spielername"
            error={errors.name}
          />
        </FormField>
        <FormField label="Spitzname">
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Optional"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Bevorzugte Position">
          <Select value={position} onChange={(e) => setPosition(e.target.value as Position)}>
            <option value="offense">Sturm</option>
            <option value="defense">Abwehr</option>
            <option value="both">Beides</option>
          </Select>
        </FormField>
        <FormField label="Niveau">
          <Select value={level} onChange={(e) => setLevel(e.target.value as Difficulty)}>
            <option value="beginner">Anfänger</option>
            <option value="intermediate">Fortgeschritten</option>
            <option value="advanced">Profi</option>
          </Select>
        </FormField>
      </div>

      <FormField label="Farbe">
        <div className="flex gap-2">
          {AVATAR_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setAvatarColor(color)}
              className={`h-8 w-8 rounded-full transition-all ${
                avatarColor === color ? "ring-2 ring-accent ring-offset-2 ring-offset-bg" : ""
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Farbe ${color}`}
            />
          ))}
        </div>
      </FormField>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-text">Skill-Profil</h3>
        <SkillRadar ratings={skillRatings} editable onChange={handleSkillChange} />
      </div>

      <FormField label="Notizen">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Stärken, Schwächen, Beobachtungen..."
          rows={3}
        />
      </FormField>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit">
          {player ? "Speichern" : "Spieler anlegen"}
        </Button>
      </div>
    </form>
  );
}
```

**Step 3: Create PlayerDetail component**

Create `src/features/players/PlayerDetail.tsx`:

```tsx
import { Button, Badge, Card } from "../../components/ui";
import { SkillRadar } from "./SkillRadar";
import { DIFFICULTY_LABELS } from "../../domain/constants";
import type { Player } from "../../domain/models/Player";

const POSITION_LABELS: Record<string, string> = {
  offense: "Sturm",
  defense: "Abwehr",
  both: "Beides",
};

interface PlayerDetailProps {
  player: Player;
  onEdit: () => void;
  onBack: () => void;
  onDelete: () => void;
}

export function PlayerDetail({ player, onEdit, onBack, onDelete }: PlayerDetailProps) {
  return (
    <div className="flex flex-col gap-5 overflow-auto pb-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          &#8592; Zurück
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold text-white"
          style={{ backgroundColor: player.avatarColor ?? "#6366f1" }}
        >
          {player.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-text">
            {player.name}
            {player.nickname && (
              <span className="ml-2 text-base font-normal text-text-muted">
                "{player.nickname}"
              </span>
            )}
          </h1>
          <div className="mt-1 flex gap-2">
            <Badge color="blue">{POSITION_LABELS[player.preferredPosition]}</Badge>
            <Badge color="orange">{DIFFICULTY_LABELS[player.level]}</Badge>
          </div>
        </div>
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-text">Skill-Profil</h2>
        <SkillRadar ratings={player.skillRatings} />
      </Card>

      {player.notes && (
        <Card>
          <h2 className="mb-2 text-sm font-semibold text-text">Notizen</h2>
          <p className="text-sm text-text-muted whitespace-pre-wrap">{player.notes}</p>
        </Card>
      )}

      <div className="flex gap-3">
        <Button onClick={onEdit}>Bearbeiten</Button>
        <Button variant="danger" onClick={onDelete}>Löschen</Button>
      </div>
    </div>
  );
}
```

**Step 4: Create PlayerList component**

Create `src/features/players/PlayerList.tsx`:

```tsx
import { Badge, Card, Button, EmptyState } from "../../components/ui";
import { DIFFICULTY_LABELS } from "../../domain/constants";
import type { Player } from "../../domain/models/Player";

const POSITION_LABELS: Record<string, string> = {
  offense: "Sturm",
  defense: "Abwehr",
  both: "Beides",
};

interface PlayerListProps {
  players: Player[];
  onSelect: (player: Player) => void;
  onAdd: () => void;
}

export function PlayerList({ players, onSelect, onAdd }: PlayerListProps) {
  if (players.length === 0) {
    return (
      <EmptyState
        icon="👤"
        title="Noch keine Spieler"
        description="Lege deinen ersten Spieler an, um mit dem Coaching zu starten."
        action={{ label: "Spieler anlegen", onClick: onAdd }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 overflow-auto pb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">
          Spieler ({players.length})
        </h2>
        <Button size="sm" onClick={onAdd}>
          + Spieler anlegen
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((player) => (
          <Card
            key={player.id}
            interactive
            onClick={() => onSelect(player)}
            className="flex items-center gap-3"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
              style={{ backgroundColor: player.avatarColor ?? "#6366f1" }}
            >
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-text truncate">{player.name}</p>
              <div className="mt-1 flex gap-1.5">
                <Badge color="blue">{POSITION_LABELS[player.preferredPosition]}</Badge>
                <Badge color="orange">{DIFFICULTY_LABELS[player.level]}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

**Step 5: Create route component**

Create `src/features/players/index.tsx`:

```tsx
import { useState, useCallback } from "react";
import { useAppStore } from "../../store";
import { ConfirmDialog } from "../../components/ui";
import { PlayerList } from "./PlayerList";
import { PlayerDetail } from "./PlayerDetail";
import { PlayerForm } from "./PlayerForm";
import type { Player } from "../../domain/models/Player";

type View = "list" | "detail" | "form";

export default function PlayersMode() {
  const players = useAppStore((s) => s.players);
  const addPlayer = useAppStore((s) => s.addPlayer);
  const updatePlayer = useAppStore((s) => s.updatePlayer);
  const deletePlayer = useAppStore((s) => s.deletePlayer);

  const [view, setView] = useState<View>("list");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleSelect = useCallback((player: Player) => {
    setSelectedPlayer(player);
    setView("detail");
  }, []);

  const handleAdd = useCallback(() => {
    setEditingPlayer(undefined);
    setView("form");
  }, []);

  const handleEdit = useCallback(() => {
    setEditingPlayer(selectedPlayer ?? undefined);
    setView("form");
  }, [selectedPlayer]);

  const handleSave = useCallback(
    (player: Player) => {
      if (editingPlayer) {
        updatePlayer(player.id, player);
      } else {
        addPlayer(player);
      }
      setSelectedPlayer(player);
      setView("detail");
    },
    [editingPlayer, addPlayer, updatePlayer],
  );

  const handleDelete = useCallback(() => {
    if (!selectedPlayer) return;
    setDeleteTarget(selectedPlayer.id);
  }, [selectedPlayer]);

  const confirmDelete = useCallback(() => {
    if (deleteTarget) {
      deletePlayer(deleteTarget);
      setDeleteTarget(null);
      setSelectedPlayer(null);
      setView("list");
    }
  }, [deleteTarget, deletePlayer]);

  return (
    <>
      {view === "list" && (
        <PlayerList players={players} onSelect={handleSelect} onAdd={handleAdd} />
      )}
      {view === "detail" && selectedPlayer && (
        <PlayerDetail
          player={
            players.find((p) => p.id === selectedPlayer.id) ?? selectedPlayer
          }
          onEdit={handleEdit}
          onBack={() => setView("list")}
          onDelete={handleDelete}
        />
      )}
      {view === "form" && (
        <PlayerForm
          player={editingPlayer}
          onSave={handleSave}
          onCancel={() =>
            setView(selectedPlayer ? "detail" : "list")
          }
        />
      )}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Spieler löschen"
        message={`Möchtest du "${selectedPlayer?.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`}
      />
    </>
  );
}
```

**Step 6: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

**Step 7: Commit**

```bash
git add src/features/players/ src/domain/models/Player.ts src/domain/schemas/player.ts src/domain/constants.ts
git commit -m "feat: add Player feature with list, detail, form, and skill radar"
```

---

### Task 18: Add Players Route and Navigation Tab

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/Layout.tsx`

**Step 1: Add lazy import and route in App.tsx**

Add after existing lazy imports:
```typescript
const PlayersMode = lazy(() => import("./features/players"));
```

Add route before the catch-all:
```tsx
<Route path="/players" element={<PlayersMode />} />
```

**Step 2: Add tab in Layout.tsx**

Add to the `tabs` array:
```typescript
{ to: "/players", label: "Spieler", icon: "👤" },
```

Place it as the 5th tab (after Board).

**Step 3: Verify build and manual test**

```bash
npm run build && npm run dev
```

Navigate to /players. Verify: empty state shows, can add player, see detail, edit, delete.

**Step 4: Commit**

```bash
git add src/App.tsx src/components/Layout.tsx
git commit -m "feat: add Players route and navigation tab"
```

---

### Task 19: Session Extension — Player Selection and Rating

**Files:**
- Modify: `src/features/train/SessionBuilder.tsx`
- Modify: `src/features/train/Journal.tsx`
- Modify: `src/features/train/TrainMode.tsx`

**Step 1: Update SessionBuilder to include player selection and focus areas**

Add a player multi-select checklist (similar to drill selection) using data from `useAppStore`.

Add rating (1–5 stars) after session completion.

Add focus areas (category checkboxes).

**Step 2: Update Journal to show player names and ratings**

Show player avatars next to sessions. Show rating as stars or number.

**Step 3: Verify build and manual test**

```bash
npm run build && npm run dev
```

Create a session with player assignment. Verify it appears in journal with player info.

**Step 4: Commit**

```bash
git add src/features/train/
git commit -m "feat: extend sessions with player selection, rating, and focus areas"
```

---

### Task 20: Custom Drills — CRUD

**Files:**
- Modify: `src/domain/models/Drill.ts` — add new fields
- Modify: `src/domain/schemas/drill.ts` — already done in Task 2
- Create: `src/features/train/DrillEditor.tsx`
- Modify: `src/features/train/TrainMode.tsx`
- Modify: `src/features/train/DrillSelector.tsx`
- Modify: `src/store/useAppStore.ts` — add customDrills slice

**Step 1: Add customDrills to Zustand store**

Add to `useAppStore`:
```typescript
customDrills: Drill[];
addCustomDrill: (drill: Drill) => void;
updateCustomDrill: (id: string, updates: Partial<Drill>) => void;
deleteCustomDrill: (id: string) => void;
```

**Step 2: Update Drill model**

Add to `src/domain/models/Drill.ts`:
```typescript
export interface Drill {
  id: string;
  name: string;
  focusSkill: string;
  blocks: TrainingBlock[];
  difficulty?: Difficulty;
  description?: string;
  category?: Category;
  position?: RodPosition;
  playerCount?: 1 | 2;
  isCustom?: boolean;
  prerequisites?: string[];
  variations?: string[];
  measurableGoal?: string;
}

export type RodPosition = "keeper" | "defense" | "midfield" | "offense";
```

**Step 3: Create DrillEditor component**

Create `src/features/train/DrillEditor.tsx` with:
- Name, Focus Skill, Description inputs
- Difficulty, Category, Position selects
- Block list with add/remove/reorder
- Each block: type (work/rest), duration (seconds), note
- Uses `FormField`, `Input`, `Select`, `Button` from UI components

**Step 4: Update DrillSelector to show custom + predefined**

- Merge `DEFAULT_DRILLS` (with `isCustom: false`) and store's `customDrills` (with `isCustom: true`)
- Show badge "Eigener Drill" for custom drills
- Add "Neuer Drill" button

**Step 5: Update TrainMode to support drill creation/editing**

- New view: "drill-editor"
- Edit button on selected drill (if custom)
- Delete button on custom drills

**Step 6: Verify build and test**

```bash
npm run build && npm run dev
```

Create a custom drill, use it in a session. Verify it persists across reload.

**Step 7: Commit**

```bash
git add src/features/train/ src/domain/models/Drill.ts src/store/useAppStore.ts
git commit -m "feat: add custom drill CRUD with editor and store integration"
```

---

### Task 21: Cross-Feature Links

**Files:**
- Modify: `src/features/learn/CardDetail.tsx`
- Modify: `src/features/train/TrainMode.tsx`
- Modify: `src/features/plan/MatchPlanList.tsx`

**Step 1: Add drill links to CardDetail**

In `CardDetail.tsx`, at the bottom of the card view, show "Passende Drills" section:
- Match cards to drills by `category` and `focusSkill` / `tags`
- Show as clickable links that navigate to `/train` with a drill pre-selected (via URL search param or store)

**Step 2: Add card links to DrillSelector**

In the selected drill view, show "Passende Coaching-Karten" matching the drill's `focusSkill` to card categories/tags.

**Step 3: Add board link to MatchPlanList**

Add a "Taktikboard" button on each match plan that navigates to `/board`.

**Step 4: Verify navigation works**

```bash
npm run dev
```

Click through cross-links. Verify they navigate correctly.

**Step 5: Commit**

```bash
git add src/features/learn/ src/features/train/ src/features/plan/
git commit -m "feat: add cross-feature navigation links between drills, cards, and plans"
```

---

### Task 22: Dynamic Dashboard (Replace Static HomePage)

**Files:**
- Modify: `src/features/home/HomePage.tsx`

**Step 1: Redesign HomePage with dynamic data**

Replace static feature cards with:

```
┌─────────────────────────────────────────────┐
│  Hero (keep existing field design)          │
├──────────────┬──────────────────────────────┤
│ Quick Actions│  Letzte Session              │
│ ─────────── │  ────────────────────         │
│ + Training  │  "Morning Drill" - 30.03.     │
│ + Spieler   │  Rating: ★★★★☆               │
│ + Matchplan │  Players: Max, Anna            │
├──────────────┼──────────────────────────────┤
│ Spieler (3) │  Statistik                    │
│ ─────────── │  ────────────────────         │
│ Max  ★★★★   │  Sessions diese Woche: 3      │
│ Anna ★★★    │  Gesamt: 12                   │
│ Tom  ★★     │  Stunden: 4.5h                │
├──────────────┴──────────────────────────────┤
│ Feature Cards (keep existing 4 cards,       │
│ but with dynamic counts from store)         │
└─────────────────────────────────────────────┘
```

**Step 2: Wire up store data**

```typescript
const sessions = useAppStore((s) => s.sessions);
const players = useAppStore((s) => s.players);
const goals = useAppStore((s) => s.goals);
```

Show real data. Fall back to existing static cards if no data yet.

**Step 3: Verify build and manual test**

```bash
npm run build && npm run dev
```

**Step 4: Commit**

```bash
git add src/features/home/
git commit -m "feat: replace static homepage with dynamic dashboard"
```

---

## Phase 3: Coaching Intelligence (Woche 6–9)

### Task 23: Goal / Trainingsziel Feature

**Files:**
- Create: `src/domain/models/Goal.ts`
- Create: `src/domain/schemas/goal.ts`
- Create: `src/features/players/GoalList.tsx`
- Create: `src/features/players/GoalForm.tsx`
- Modify: `src/features/players/PlayerDetail.tsx` — add goals section
- Modify: `src/domain/schemas/index.ts`

**Step 1: Create Goal model and schema**

`src/domain/models/Goal.ts`:
```typescript
import type { Category } from "./CoachCard";

export interface Goal {
  id: string;
  playerId: string;
  title: string;
  description?: string;
  category: Category;
  targetDate?: string;
  status: "active" | "achieved" | "paused";
  createdAt: string;
}
```

`src/domain/schemas/goal.ts`:
```typescript
import { z } from "zod";
import { CategorySchema } from "./coachCard";

export const GoalStatusSchema = z.enum(["active", "achieved", "paused"]);

export const GoalSchema = z.object({
  id: z.string(),
  playerId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  category: CategorySchema,
  targetDate: z.string().optional(),
  status: GoalStatusSchema.default("active"),
  createdAt: z.string(),
});
```

**Step 2: Create GoalList and GoalForm components**

GoalList shows goals for a player grouped by status (active first, then achieved).
GoalForm is a simple form with title, description, category, targetDate.

**Step 3: Integrate into PlayerDetail**

Add a "Ziele" section in PlayerDetail that shows GoalList and a "Neues Ziel" button.

**Step 4: Verify and commit**

```bash
npm run build && npm test
git add src/domain/models/Goal.ts src/domain/schemas/goal.ts src/domain/schemas/index.ts src/features/players/
git commit -m "feat: add Goal feature with list, form, and player integration"
```

---

### Task 24: Evaluation / Post-Session-Bewertung

**Files:**
- Create: `src/domain/models/Evaluation.ts`
- Create: `src/domain/schemas/evaluation.ts`
- Create: `src/features/train/SessionRating.tsx`
- Modify: `src/store/useAppStore.ts` — add evaluations slice
- Modify: `src/features/train/TrainMode.tsx`
- Modify: `src/features/players/PlayerDetail.tsx` — show evaluations

**Step 1: Create Evaluation model**

```typescript
import type { Category } from "./CoachCard";

export interface SkillRating {
  category: Category;
  rating: number; // 1-5
  comment?: string;
}

export interface Evaluation {
  id: string;
  playerId: string;
  sessionId?: string;
  date: string;
  skillRatings: SkillRating[];
  notes: string;
}
```

**Step 2: Create SessionRating component**

After a session is saved, offer an optional evaluation:
- Select players who participated
- Rate skills (1-5) per category
- Add notes
- Save as Evaluation to store

**Step 3: Integrate evaluation history into PlayerDetail**

Show last N evaluations per player with skill trend indicators (↑↓→).

**Step 4: Verify and commit**

```bash
npm run build && npm test
git add src/domain/models/Evaluation.ts src/domain/schemas/evaluation.ts src/features/train/ src/features/players/ src/store/useAppStore.ts
git commit -m "feat: add post-session evaluation with skill ratings"
```

---

### Task 25: Coaching Notes

**Files:**
- Create: `src/domain/models/CoachingNote.ts`
- Create: `src/domain/schemas/coachingNote.ts`
- Create: `src/features/players/NotesFeed.tsx`
- Create: `src/features/players/QuickNote.tsx`
- Modify: `src/store/useAppStore.ts` — add coachingNotes slice

**Step 1: Create CoachingNote model**

```typescript
export interface CoachingNote {
  id: string;
  playerId?: string;
  sessionId?: string;
  matchPlanId?: string;
  date: string;
  category: "tactical" | "technical" | "mental" | "communication";
  text: string;
}
```

**Step 2: Add store slice and schema**

**Step 3: Create QuickNote component**

Simple inline form: category select + text input + save button. Can be embedded in PlayerDetail, SessionBuilder, MatchPlanEditor.

**Step 4: Create NotesFeed component**

Chronological list of notes for a player, filterable by category.

**Step 5: Integrate into PlayerDetail and optionally TrainMode/PlanMode**

**Step 6: Verify and commit**

```bash
git add src/domain/models/CoachingNote.ts src/domain/schemas/coachingNote.ts src/features/players/ src/store/useAppStore.ts
git commit -m "feat: add coaching notes with quick entry and feed view"
```

---

### Task 26: Training Plan

**Files:**
- Create: `src/domain/models/TrainingPlan.ts`
- Create: `src/domain/schemas/trainingPlan.ts`
- Create: `src/features/training/TrainingPlanEditor.tsx`
- Create: `src/features/training/TrainingPlanList.tsx`
- Create: `src/features/training/index.tsx`
- Modify: `src/store/useAppStore.ts` — add trainingPlans slice
- Modify: `src/App.tsx` — add route (or integrate into /train)

**Step 1: Create TrainingPlan model**

```typescript
export interface SessionTemplate {
  name: string;
  drillIds: string[];
  focusAreas: Category[];
  estimatedDuration: number;
}

export interface TrainingWeek {
  weekNumber: number;
  sessionTemplates: SessionTemplate[];
}

export interface TrainingPlan {
  id: string;
  name: string;
  playerIds: string[];
  weeks: TrainingWeek[];
  goal?: string;
  createdAt: string;
}
```

**Step 2: Create TrainingPlanEditor**

Multi-week planner: add weeks, add session templates per week, select drills, set focus areas. Calendar-like overview.

**Step 3: Create TrainingPlanList**

List view with plan name, duration (N weeks), player count.

**Step 4: Route decision**

Either integrate as a tab within `/train` or create separate `/training-plans` route. Recommend: tab within `/train` to keep navigation simple.

**Step 5: Verify and commit**

```bash
git add src/domain/models/TrainingPlan.ts src/domain/schemas/trainingPlan.ts src/features/training/ src/store/useAppStore.ts
git commit -m "feat: add multi-week training plan editor"
```

---

### Task 27: Team Model

**Files:**
- Create: `src/domain/models/Team.ts`
- Create: `src/domain/schemas/team.ts`
- Create: `src/features/players/TeamList.tsx`
- Create: `src/features/players/TeamForm.tsx`
- Modify: `src/store/useAppStore.ts` — add teams slice
- Modify: `src/features/players/index.tsx` — add teams tab

**Step 1: Create Team model**

```typescript
export interface Team {
  id: string;
  name: string;
  playerIds: [string, string];
  notes?: string;
  createdAt: string;
}
```

**Step 2: Create TeamList and TeamForm**

TeamForm: select two players from store, add name and notes.
TeamList: show teams with player avatars.

**Step 3: Integrate into Players feature as a "Teams" tab**

Use `Tabs` component to switch between "Spieler" and "Teams" views within `/players`.

**Step 4: Verify and commit**

```bash
git add src/domain/models/Team.ts src/domain/schemas/team.ts src/features/players/ src/store/useAppStore.ts
git commit -m "feat: add Team model with doubles pairing management"
```

---

### Task 28: Unified Filter/Search Pattern

**Files:**
- Create: `src/components/ui/SearchBar.tsx`
- Modify: `src/features/learn/SearchFilter.tsx` — refactor to use SearchBar
- Modify: `src/features/train/DrillSelector.tsx` — add search
- Modify: `src/features/train/Journal.tsx` — add player/date filter
- Modify: `src/features/plan/MatchPlanList.tsx` — add search

**Step 1: Create SearchBar component**

Reusable search input with clear button:

```tsx
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
```

**Step 2: Apply to all list views**

- Drill list: search by name + filter by difficulty/category
- Session journal: filter by player, date range
- Match plan list: search by opponent
- Player list: search by name

**Step 3: Verify and commit**

```bash
git add src/components/ui/SearchBar.tsx src/components/ui/index.ts src/features/
git commit -m "feat: add unified search/filter pattern across all list views"
```

---

### Task 29: Match Model Extension

**Files:**
- Modify: `src/domain/models/MatchPlan.ts` — add Match interface
- Create: `src/domain/schemas/match.ts`
- Modify: `src/features/plan/MatchPlanEditor.tsx` — add set recording
- Modify: `src/store/useAppStore.ts` — extend matchPlans or add matches slice

**Step 1: Create Match model (extension of MatchPlan)**

```typescript
export interface MatchSet {
  setNumber: number;
  scoreHome: number;
  scoreAway: number;
}

export interface Match extends MatchPlan {
  playerIds: string[];
  sets: MatchSet[];
  result?: "win" | "loss" | "draw";
  coachingNotes: string[];
}
```

**Step 2: Add set recording UI to MatchPlanEditor**

After the existing fields, add:
- "Ergebnis erfassen" section
- Player selection
- Set-by-set score input
- Auto-calculate result from sets

**Step 3: Verify and commit**

```bash
git add src/domain/models/MatchPlan.ts src/domain/schemas/match.ts src/features/plan/ src/store/useAppStore.ts
git commit -m "feat: extend Match with set-based scoring and player assignment"
```

---

## Phase 4: Analytics & Polish (Woche 10–12)

### Task 30: Analytics Dashboard

**Files:**
- Create: `src/features/analytics/index.tsx`
- Create: `src/features/analytics/TrainingFrequencyChart.tsx`
- Create: `src/features/analytics/SkillProgressChart.tsx`
- Create: `src/features/analytics/DrillStatsChart.tsx`
- Create: `src/components/ui/SimpleBarChart.tsx` (SVG-based)
- Modify: `src/App.tsx` — add route
- Modify: `src/components/Layout.tsx` — add nav tab

**Step 1: Create SVG-based SimpleBarChart**

Lightweight, no dependency. Takes `{ label, value, color }[]` and renders horizontal or vertical bars.

**Step 2: Create TrainingFrequencyChart**

Sessions per week, last 8 weeks. Uses SimpleBarChart.

**Step 3: Create SkillProgressChart**

For a selected player, show skill ratings over time (from evaluations).

**Step 4: Create DrillStatsChart**

Most-used drills, category distribution.

**Step 5: Create analytics route component**

Combines all charts with player selector.

**Step 6: Add route and navigation**

Route: `/analytics`
Tab: "Analyse" with 📊 icon

**Step 7: Verify and commit**

```bash
git add src/features/analytics/ src/components/ui/SimpleBarChart.tsx src/App.tsx src/components/Layout.tsx
git commit -m "feat: add Analytics dashboard with training frequency, skills, and drill stats"
```

---

### Task 31: Player Comparison

**Files:**
- Create: `src/features/analytics/PlayerComparison.tsx`
- Modify: `src/features/analytics/index.tsx`

**Step 1: Create PlayerComparison component**

Two-player selector. Side-by-side SkillRadar bars. Session count comparison. Win/loss record if matches exist.

**Step 2: Integrate into analytics page**

Add as a tab or section within the analytics dashboard.

**Step 3: Verify and commit**

```bash
git add src/features/analytics/
git commit -m "feat: add player comparison view in analytics"
```

---

### Task 32: Progress Tracking with History

**Files:**
- Modify: `src/store/useAppStore.ts` — evaluations already store historical data
- Create: `src/features/players/ProgressView.tsx`
- Modify: `src/features/players/PlayerDetail.tsx`

**Step 1: Create ProgressView**

Timeline of evaluations. Skill-by-skill mini line chart (SVG). "Fortschritt seit X" summary.

**Step 2: Integrate into PlayerDetail**

Add "Fortschritt" tab/section in player detail view.

**Step 3: Verify and commit**

```bash
git add src/features/players/
git commit -m "feat: add progress tracking with skill history visualization"
```

---

### Task 33: Export (PDF/Print)

**Files:**
- Create: `src/utils/print.ts`
- Modify: `src/features/players/PlayerDetail.tsx` — add print button
- Modify: `src/features/plan/MatchPlanEditor.tsx` — add print button
- Modify: `src/features/train/Journal.tsx` — add export button
- Add print-specific CSS to `src/index.css`

**Step 1: Add print styles**

```css
@media print {
  header, nav, button { display: none !important; }
  body { background: white; color: black; }
  .no-print { display: none !important; }
  .print-only { display: block !important; }
}
```

**Step 2: Create print utility**

```typescript
export function printCurrentPage() {
  window.print();
}
```

**Step 3: Add print/export buttons**

- Player profile: "Profil drucken"
- Match plan: "Matchplan drucken"
- Journal: "Export als JSON" (already exists) + "Drucken"

**Step 4: Verify print output**

```bash
npm run dev
```

Open player detail, click print, verify clean print layout.

**Step 5: Commit**

```bash
git add src/utils/print.ts src/index.css src/features/
git commit -m "feat: add print/export support for player profiles, match plans, and journal"
```

---

### Task 34: Template System

**Files:**
- Modify: `src/store/useAppStore.ts` — add drillTemplates, sessionTemplates
- Modify: `src/features/train/DrillEditor.tsx` — "Als Vorlage speichern"
- Modify: `src/features/train/SessionBuilder.tsx` — "Aus Vorlage erstellen"

**Step 1: Add template actions to store**

```typescript
drillTemplates: Drill[];
sessionTemplates: { name: string; drillIds: string[]; focusAreas: Category[] }[];
saveDrillAsTemplate: (drill: Drill) => void;
saveSessionAsTemplate: (template: SessionTemplate) => void;
```

**Step 2: Add "Save as Template" buttons**

In DrillEditor and SessionBuilder, add button to save current configuration as a reusable template.

**Step 3: Add "From Template" option**

In SessionBuilder, add dropdown to load a session template.

**Step 4: Verify and commit**

```bash
git add src/store/useAppStore.ts src/features/train/
git commit -m "feat: add drill and session template system"
```

---

### Task 35: Polish — Animations, Onboarding, Responsive

**Files:**
- Modify: `src/index.css` — add animation keyframes
- Modify: `src/features/home/HomePage.tsx` — add onboarding for empty state
- Modify: various components — add transition classes

**Step 1: Add CSS animations**

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
```

**Step 2: Add onboarding flow**

When store has no players and no sessions:
- Homepage shows "Willkommen! Lege deinen ersten Spieler an" instead of stats
- Guided first-use flow

**Step 3: Responsive audit**

Test all features on 375px (iPhone SE), 768px (iPad), 1024px+ (Desktop).
Fix any layout issues.

**Step 4: Verify and commit**

```bash
git add src/index.css src/features/
git commit -m "feat: add animations, onboarding flow, and responsive polish"
```

---

### Task 36: Final Integration Test and Cleanup

**Files:**
- Run all tests
- Remove unused code
- Verify all routes work
- Verify store persistence across reload

**Step 1: Run full test suite**

```bash
npm test
```

Expected: All tests pass.

**Step 2: Run lint and format**

```bash
npm run lint && npm run format
```

Fix any issues.

**Step 3: Build production bundle**

```bash
npm run build
```

Verify no warnings or errors.

**Step 4: Manual smoke test**

1. Clear localStorage
2. Open app → see onboarding
3. Create player → see in list and dashboard
4. Create session with player → see in journal
5. Create match plan → see in list
6. Open board → create scene
7. Navigate cross-links
8. Check analytics
9. Reload → verify all data persists

**Step 5: Remove dead code**

- `useFavorites.ts` — if fully replaced by store, delete
- Any unused imports or components

**Step 6: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup, remove dead code, verify all integrations"
```

---

## Summary

| Phase | Tasks | Key Deliverables |
|-------|-------|-----------------|
| 1: Foundation | 1–15 | Zod, Zustand, UI Library, Typography, Migration |
| 2: Core Features | 16–22 | Player, Custom Drills, Cross-Links, Dashboard |
| 3: Coaching Intelligence | 23–29 | Goals, Evaluations, Notes, Plans, Teams, Match |
| 4: Analytics & Polish | 30–36 | Charts, Comparison, Progress, Export, Templates, Polish |

**Total: 36 Tasks across 4 Phases (~12 Wochen)**

Each task is independently committable. Dependencies flow forward (Phase N depends on Phase N-1).
