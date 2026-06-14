# KickerCoach Härtung — Implementierungsplan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax. TDD where a behavior is testable. Frequent commits.

**Goal:** Gezieltes Härten der bestehenden, soliden KickerCoach-App — Korrektheits-Bugs, Accessibility und Polish — ohne Rewrite, abgesichert durch die vorhandene Testsuite.

**Architecture:** Inkrementelle Änderungen an existierenden Modulen. Datenfluss, Slice-Struktur und Routing bleiben unverändert. Neue Bausteine: `useFocusTrap`-Hook, `<Avatar>`-Komponente.

**Tech Stack:** React 18, Vite, Tailwind v4, Zustand 5 (persist), Zod 4, i18next, Vitest + Testing Library, react-konva.

**Test command:** `npm test` (vitest run). Typecheck: `npx tsc -b`. Lint: `npm run lint`.

---

## Phase 1 — Korrektheit & Datenintegrität

### Task 1: `validateOrWarn` gibt validierte Daten zurück

Bug: Funktion parsed, warnt, gibt aber `data` (unvalidiert) zurück → Zod-`.default()`-Transforms greifen nie, Schrott-Daten landen im Store.

**Files:**
- Modify: `src/utils/validate.ts`
- Test: `tests/utils/validate.test.ts` (neu)

- [ ] **Step 1: Failing test** (`tests/utils/validate.test.ts`)

```ts
import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { validateOrWarn } from "../../src/utils/validate";

describe("validateOrWarn", () => {
  it("applies schema defaults on success", () => {
    const schema = z.object({ name: z.string(), tags: z.array(z.string()).default([]) });
    const out = validateOrWarn({ name: "x" }, schema, "test");
    expect(out).toEqual({ name: "x", tags: [] });
  });

  it("returns original data and warns on failure", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const schema = z.object({ name: z.string() });
    const bad = { name: 123 } as unknown;
    const out = validateOrWarn(bad, schema, "ctx");
    expect(out).toBe(bad);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
```

- [ ] **Step 2: Run** `npm test -- validate` → erste Assertion FAILS (kein `tags`).

- [ ] **Step 3: Implementierung** — `src/utils/validate.ts`, Funktionsrumpf ersetzen:

```ts
export function validateOrWarn<T>(data: T, schema: ZodType, context: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.warn(
      `[KickerCoach] Validation warning in ${context}:`,
      result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", "),
    );
    return data;
  }
  return result.data as T;
}
```

- [ ] **Step 4: Run** `npm test -- validate` → PASS. Dann volle Suite `npm test` → grün (Regression-Check, da addPlayer/addSession/addGoal/addEvaluation/addCoachingNote diese Funktion nutzen).

- [ ] **Step 5: Commit** `fix(validation): return parsed data from validateOrWarn so Zod defaults apply`

---

### Task 2: Import-Validierung vollständig (alle persistierten Arrays)

Bug: `ARRAY_SCHEMAS` in `storage.ts` lässt `teams`, `customDrills`, `drillTemplates`, `sessionTemplates`, `techniques`, `favorites` aus → ein Backup kann beliebig geformte Objekte injizieren.

**Files:**
- Modify: `src/utils/storage.ts:5-34`
- Test: `tests/utils/storage.test.ts`

- [ ] **Step 1: Failing test** (an `tests/utils/storage.test.ts` anhängen) — siehe Task 5 (Tests werden dort gebündelt geschrieben). Hier nur Schema-Map erweitern.

- [ ] **Step 2: Implementierung** — Imports ergänzen (nach Zeile 15):

```ts
import { TeamSchema } from "../domain/schemas/team";
import { DrillSchema } from "../domain/schemas/drill";
import { TechniqueSchema } from "../domain/schemas/technique";
import { SessionTemplateSchema } from "../domain/schemas/trainingPlan";
import { z } from "zod";
```

`ARRAY_SCHEMAS` erweitern:

```ts
const ARRAY_SCHEMAS: Record<string, import("zod").ZodType> = {
  players: PlayerSchema,
  goals: GoalSchema,
  evaluations: EvaluationSchema,
  coachingNotes: CoachingNoteSchema,
  sessions: SessionSchema,
  matchPlans: MatchPlanSchema,
  matches: MatchSchema,
  boardScenes: TacticalSceneSchema,
  playerTechniques: PlayerTechniqueSchema,
  trainingPlans: TrainingPlanSchema,
  teams: TeamSchema,
  customDrills: DrillSchema,
  drillTemplates: DrillSchema,
  sessionTemplates: SessionTemplateSchema,
  techniques: TechniqueSchema,
  favorites: z.string(),
};
```

`favorites` ist `string[]` → Element-Schema `z.string()`, `migrateArray` validiert jedes Element. Passt zur bestehenden `migrateArray`-Semantik.

- [ ] **Step 3: Run** `npx tsc -b` → keine Typfehler.

- [ ] **Step 4: Commit** `fix(storage): validate all persisted arrays on import (teams, drills, templates, techniques, favorites)`

---

### Task 3: Import re-hydriert den laufenden Store

Bug: `importStoreData` schreibt nur localStorage; die laufende App zeigt weiter alte Daten, bis manuell neu geladen wird — `SettingsPage` meldet aber „Import erfolgreich". UI und Speicher divergieren.

**Files:**
- Modify: `src/utils/storage.ts` (Import + beide Erfolgspfade)
- Test: `tests/utils/storage.test.ts` (Task 5)

- [ ] **Step 1: Implementierung** — am Dateikopf importieren:

```ts
import { useAppStore } from "../store/useAppStore";
```

(Kein Zyklus: `useAppStore` importiert `storage.ts` nicht.)

In `importStoreData` beide Erfolgspfade so umbauen, dass nach `localStorage.setItem(...)` re-hydriert wird, bevor resolved wird. Den Promise-Executor zu `async` machen ist nicht nötig — `rehydrate()` zurückgeben und dann resolven:

```ts
// Pfad 1 (raw state export), ersetzt Zeilen ~163-168:
const raw = localStorage.getItem(STORE_KEY);
const current = raw ? JSON.parse(raw) : {};
current.state = validateState(parsed as Record<string, unknown>);
localStorage.setItem(STORE_KEY, JSON.stringify(current));
void useAppStore.persist.rehydrate();
resolve({ success: true });
return;
```

```ts
// Pfad 2 (meta+state), ersetzt Zeilen ~174-180:
const state = parsed.state ?? parsed;
const validatedState = validateState(state as Record<string, unknown>);
const raw = localStorage.getItem(STORE_KEY);
const current = raw ? JSON.parse(raw) : {};
current.state = validatedState;
localStorage.setItem(STORE_KEY, JSON.stringify(current));
void useAppStore.persist.rehydrate();
resolve({ success: true });
```

- [ ] **Step 2: Run** `npx tsc -b` → grün.

- [ ] **Step 3: Commit** `fix(storage): rehydrate store after import so UI reflects imported data`

---

### Task 4: `partialize` auf persist (nur Daten-Arrays persistieren)

Robustheit: Aktuell wird der gesamte State (inkl. künftiger transienter/UI-Felder) serialisiert. Explizite Allow-List der persistierten Daten-Schlüssel.

**Files:**
- Modify: `src/store/useAppStore.ts` (persist-Options-Objekt)
- Test: `tests/store/partialize.test.ts` (neu)

- [ ] **Step 1: Failing test** (`tests/store/partialize.test.ts`)

```ts
import { describe, it, expect } from "vitest";
import { useAppStore } from "../../src/store/useAppStore";

describe("persist partialize", () => {
  it("does not persist function members (selectors/actions)", () => {
    useAppStore.getState(); // ensure store instantiated
    const raw = localStorage.getItem("kickercoach-store");
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string);
    expect(typeof parsed.state.getPlayerSessions).toBe("undefined");
    expect(typeof parsed.state.addPlayer).toBe("undefined");
    expect(Array.isArray(parsed.state.players)).toBe(true);
  });
});
```

- [ ] **Step 2: Run** `npm test -- partialize`. (Hinweis: JSON.stringify entfernt Funktionen bereits — der Test dokumentiert das gewünschte Verhalten und sichert es nach Einführung von `partialize` ab. Falls er schon grün ist, ist das ok; nach Step 3 muss er grün bleiben.)

- [ ] **Step 3: Implementierung** — `useAppStore.ts`, persist-Options ergänzen (nach `version: STORE_VERSION,`):

```ts
      partialize: (state) => ({
        players: state.players,
        teams: state.teams,
        sessions: state.sessions,
        sessionTemplates: state.sessionTemplates,
        customDrills: state.customDrills,
        drillTemplates: state.drillTemplates,
        matches: state.matches,
        matchPlans: state.matchPlans,
        goals: state.goals,
        evaluations: state.evaluations,
        coachingNotes: state.coachingNotes,
        techniques: state.techniques,
        playerTechniques: state.playerTechniques,
        trainingPlans: state.trainingPlans,
        boardScenes: state.boardScenes,
        favorites: state.favorites,
      }),
```

- [ ] **Step 4: Run** `npm test` → volle Suite grün (besonders `migrationFull.test.ts`, `useAppStore.test.ts`).

- [ ] **Step 5: Commit** `feat(store): add explicit partialize allow-list for persisted data`

---

### Task 5: Tests für Import/Export (höchste Risiko-Fläche)

**Files:**
- Modify/erweitern: `tests/utils/storage.test.ts`

- [ ] **Step 1: Tests schreiben** — anhängen:

```ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { importStoreData, exportStoreData } from "../../src/utils/storage";

function fileFrom(obj: unknown): File {
  return new File([JSON.stringify(obj)], "backup.json", { type: "application/json" });
}

describe("importStoreData", () => {
  beforeEach(() => localStorage.clear());

  it("imports a valid meta+state backup and drops invalid items", async () => {
    const backup = {
      _meta: { app: "KickerCoach" },
      state: {
        players: [
          { id: "p1", name: "Anna", createdAt: new Date().toISOString() },
          { id: "bad" }, // invalid → dropped
        ],
        teams: [{ not: "a team" }], // invalid → dropped
      },
    };
    const res = await importStoreData(fileFrom(backup));
    expect(res.success).toBe(true);
    const stored = JSON.parse(localStorage.getItem("kickercoach-store") as string);
    expect(stored.state.players).toHaveLength(1);
    expect(stored.state.teams).toHaveLength(0);
  });

  it("imports a raw state export (no _meta wrapper)", async () => {
    const res = await importStoreData(fileFrom({ players: [] }));
    expect(res.success).toBe(true);
  });

  it("fails gracefully on malformed JSON", async () => {
    const file = new File(["{ not json"], "b.json", { type: "application/json" });
    const res = await importStoreData(file);
    expect(res.success).toBe(false);
    expect(res.error).toBeTruthy();
  });

  it("fails on a non-object payload", async () => {
    const res = await importStoreData(fileFrom(42));
    expect(res.success).toBe(false);
  });
});

describe("exportStoreData", () => {
  beforeEach(() => localStorage.clear());

  it("fails when there is nothing to export", () => {
    const res = exportStoreData();
    expect(res.success).toBe(false);
  });

  it("succeeds when store data exists", () => {
    localStorage.setItem("kickercoach-store", JSON.stringify({ version: 4, state: { players: [] } }));
    // jsdom: stub anchor click + URL APIs
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:x");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const res = exportStoreData();
    expect(res.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run** `npm test -- storage` → alle PASS. (Falls `URL.createObjectURL` in jsdom fehlt, sichert der `vi.spyOn`-Stub das ab.)

- [ ] **Step 3: Commit** `test(storage): cover import validation and export paths`

---

## Phase 2 — Accessibility & Interaktion

### Task 6: `useFocusTrap`-Hook

**Files:**
- Create: `src/hooks/useFocusTrap.ts`
- Test: `tests/hooks/useFocusTrap.test.tsx` (neu)

- [ ] **Step 1: Failing test** (`tests/hooks/useFocusTrap.test.tsx`)

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import { useFocusTrap } from "../../src/hooks/useFocusTrap";

function Harness({ open }: { open: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open);
  return (
    <div ref={ref}>
      <button>first</button>
      <button>last</button>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("moves focus into the container when active", async () => {
    render(<Harness open />);
    // first focusable should receive focus
    expect(screen.getByText("first")).toHaveFocus();
  });

  it("wraps Tab from last back to first", async () => {
    const user = userEvent.setup();
    render(<Harness open />);
    screen.getByText("last").focus();
    await user.tab();
    expect(screen.getByText("first")).toHaveFocus();
  });
});
```

- [ ] **Step 2: Run** `npm test -- useFocusTrap` → FAIL (Modul fehlt).

- [ ] **Step 3: Implementierung** (`src/hooks/useFocusTrap.ts`)

```ts
import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps focus within `containerRef` while `active`. On activate it moves focus
 * to the first focusable element and remembers the previously focused element;
 * on deactivate it restores focus to that element. Tab/Shift+Tab wrap.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );

    const first = focusables()[0];
    first?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const els = focusables();
      if (els.length === 0) return;
      const firstEl = els[0];
      const lastEl = els[els.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    container.addEventListener("keydown", handleKey);
    return () => {
      container.removeEventListener("keydown", handleKey);
      previouslyFocused?.focus?.();
    };
  }, [active, containerRef]);
}
```

- [ ] **Step 4: Run** `npm test -- useFocusTrap` → PASS.

- [ ] **Step 5: Commit** `feat(a11y): add useFocusTrap hook`

---

### Task 7: Modal nutzt Focus-Trap + Focus-Restore

**Files:**
- Modify: `src/components/ui/Modal.tsx`
- Test: `tests/components/Modal.test.tsx` (erweitern)

- [ ] **Step 1: Failing test** ergänzen in `tests/components/Modal.test.tsx`:

```tsx
it("moves focus into the dialog on open", () => {
  render(
    <Modal open onClose={() => {}} title="T">
      <button>inner</button>
    </Modal>,
  );
  // close button is first focusable in the dialog
  expect(document.activeElement).not.toBe(document.body);
});
```

- [ ] **Step 2: Implementierung** — `Modal.tsx`: `useRef` + `useFocusTrap` an das Dialog-`motion.div` hängen.

Imports:

```ts
import { type ReactNode, useEffect, useRef } from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
```

Im Body vor `return`:

```ts
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open);
```

Am Dialog-`motion.div` (das mit `role="dialog"`) `ref={dialogRef}` ergänzen.

- [ ] **Step 3: Run** `npm test -- Modal ConfirmDialog` → PASS (ConfirmDialog rendert über Modal, profitiert automatisch).

- [ ] **Step 4: Commit** `fix(a11y): trap and restore focus in Modal/ConfirmDialog`

---

### Task 8: Tabs — korrekte ARIA-Rollen + Pfeiltasten

**Files:**
- Modify: `src/components/ui/Tabs.tsx`
- Test: `tests/components/Tabs.test.tsx` (erweitern)

- [ ] **Step 1: Failing test** ergänzen:

```tsx
it("uses tablist/tab roles and selects via aria-selected", () => {
  const tabs = [
    { value: "a", label: "A" },
    { value: "b", label: "B" },
  ];
  render(<Tabs tabs={tabs} active="a" onChange={() => {}} />);
  expect(screen.getByRole("tablist")).toBeInTheDocument();
  const tabA = screen.getByRole("tab", { name: "A" });
  expect(tabA).toHaveAttribute("aria-selected", "true");
});

it("moves active tab with ArrowRight", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  const tabs = [
    { value: "a", label: "A" },
    { value: "b", label: "B" },
  ];
  render(<Tabs tabs={tabs} active="a" onChange={onChange} />);
  screen.getByRole("tab", { name: "A" }).focus();
  await user.keyboard("{ArrowRight}");
  expect(onChange).toHaveBeenCalledWith("b");
});
```

(Sicherstellen, dass `userEvent` und `vi` in der Datei importiert sind.)

- [ ] **Step 2: Implementierung** — `Tabs.tsx` Container + Buttons:

Container-`div`: `role="tablist"` ergänzen.

Button: `aria-pressed` ersetzen durch `role="tab"`, `aria-selected={isActive}`, `tabIndex={isActive ? 0 : -1}`, und `onKeyDown`:

```tsx
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.value)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const idx = tabs.findIndex((x) => x.value === active);
              const next =
                e.key === "ArrowRight"
                  ? tabs[(idx + 1) % tabs.length]
                  : tabs[(idx - 1 + tabs.length) % tabs.length];
              onChange(next.value);
            }}
            className={/* unverändert */}
          >
```

(Bestehende `className`/`motion.div`-Innerei unverändert lassen.)

- [ ] **Step 3: Run** `npm test -- Tabs` → PASS.

- [ ] **Step 4: Commit** `fix(a11y): proper tablist roles and arrow-key navigation for Tabs`

---

### Task 9: StarRating — Tastatur + i18n-Label

**Files:**
- Modify: `src/components/ui/StarRating.tsx`
- Test: `tests/components/StarRating.test.tsx` (erweitern)

- [ ] **Step 1: Failing test** ergänzen:

```tsx
it("changes value with ArrowRight/ArrowLeft when interactive", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<StarRating rating={3} onChange={onChange} />);
  const group = screen.getByRole("slider");
  group.focus();
  await user.keyboard("{ArrowRight}");
  expect(onChange).toHaveBeenCalledWith(4);
});
```

- [ ] **Step 2: Implementierung** — interaktiven Zweig auf ein `role="slider"`-Wrapper umstellen:

Imports oben: `import { useTranslation } from "react-i18next";`

Im interaktiven Zweig den `<span>`-Wrapper ersetzen:

```tsx
  const { t } = useTranslation("common");
  if (onChange) {
    return (
      <span
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={rating}
        aria-label={t("ui.ratingLabel", { defaultValue: "Bewertung" })}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            onChange(Math.min(max, rating + 1));
          } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            onChange(Math.max(0, rating - 1));
          }
        }}
        className={className ?? `inline-flex gap-0.5 ${SIZE_CLASSES[size]}`}
      >
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1;
          const filled = starValue <= rating;
          return (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              onClick={() => onChange(rating === starValue ? 0 : starValue)}
              className={`transition-transform hover:scale-110 ${
                filled ? "text-kicker-orange" : "text-text-dim"
              }`}
              aria-label={t("ui.starValue", { count: starValue, defaultValue: `${starValue}` })}
            >
              {filled ? "★" : "☆"}
            </button>
          );
        })}
      </span>
    );
  }
```

i18n-Keys ergänzen in `src/i18n/locales/de/common.json` unter `"ui"`: `"ratingLabel": "Bewertung"`, `"starValue": "{{count}} Sterne"`.

- [ ] **Step 3: Run** `npm test -- StarRating` → PASS.

- [ ] **Step 4: Commit** `fix(a11y): keyboard support and i18n labels for StarRating`

---

## Phase 3 — Design-System & Polish

### Task 10: `<Avatar>`-Komponente (DRY + Farb-Konsistenz)

Avatar-Kreis ist ~9× inline dupliziert mit inkonsistentem Fallback (`#6366f1` vs `#00e676`). Eine Quelle der Wahrheit.

**Files:**
- Create: `src/components/ui/Avatar.tsx`
- Modify: `src/components/ui/index.ts` (export)
- Test: `tests/components/Avatar.test.tsx` (neu)

- [ ] **Step 1: Failing test** (`tests/components/Avatar.test.tsx`)

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "../../src/components/ui/Avatar";

describe("Avatar", () => {
  it("renders the first letter of the name", () => {
    render(<Avatar name="Anna" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });
  it("uses provided color over the fallback", () => {
    const { container } = render(<Avatar name="Bo" color="#123456" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBe("rgb(18, 52, 86)");
  });
});
```

- [ ] **Step 2: Run** `npm test -- Avatar` → FAIL.

- [ ] **Step 3: Implementierung** (`src/components/ui/Avatar.tsx`)

```tsx
interface AvatarProps {
  name: string;
  color?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

/** Single source of truth for the player avatar circle (initial + color). */
export function Avatar({ name, color, size = "md", className = "" }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold text-bg ${SIZES[size]} ${className}`}
      style={{ backgroundColor: color || "var(--color-accent)" }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
```

Export in `src/components/ui/index.ts` ergänzen: `export { Avatar } from "./Avatar";`

- [ ] **Step 4: Run** `npm test -- Avatar` → PASS.

- [ ] **Step 5: Commit** `feat(ui): add Avatar component as single source of truth`

---

### Task 11: Avatar-Duplikate ersetzen

**Files (ersetze die jeweilige inline-Avatar-Markup durch `<Avatar name=... color=... size=... />`):**
- `src/features/players/PlayerList.tsx:117`
- `src/features/players/PlayerDetail.tsx:110`
- `src/features/train/SessionBuilder.tsx:265`
- `src/features/plan/MatchPlanEditor.tsx:265`
- `src/features/train/TrainingPlanEditor.tsx:166`
- `src/components/QuickActionFAB.tsx:178`
- `src/features/players/TeamList.tsx:61`, `TeamForm.tsx:87,120,140`

- [ ] **Step 1:** Pro Datei: das inline `<div class="...rounded-full..." style={{backgroundColor: ...}}>{initial}</div>` durch `<Avatar name={player.name} color={player.avatarColor} size="md" />` ersetzen. Größe je nach bisherigem Markup (`h-8`→sm, `h-10`→md, `h-14`→lg).
- [ ] **Step 2: Run** `npx tsc -b && npm run lint` → grün; visuell unverändert.
- [ ] **Step 3: Commit** `refactor(ui): replace duplicated avatar markup with <Avatar>`

---

### Task 12: Lade-Zustände für async Drill-/Template-Loads

**Files:**
- Modify: `src/features/train/TrainMode.tsx` (Drill-Load)
- Modify: `src/features/plan/MatchPlanEditor.tsx` (Strategie-Templates)

- [ ] **Step 1:** In `TrainMode.tsx` ein `drillsLoading`-State (`useState(true)`) einführen; im Drill-`useEffect` nach erfolgreichem `setDefaultDrills` auf `false` setzen. In der Drill-Auswahl-View bei `drillsLoading` den bestehenden `LoadingFallback`-artigen Spinner (kleine inline-Variante) statt leerer Liste zeigen.

```tsx
  const [drillsLoading, setDrillsLoading] = useState(true);
  useEffect(() => {
    import("../../data/drills").then((mod) => {
      mod.loadDrills().then((d) => {
        setDefaultDrills(d);
        setDrillsLoading(false);
      });
    });
  }, []);
```

In der View, wo die Drill-Liste/Selector gerendert wird, vorab:

```tsx
  {drillsLoading ? (
    <div className="flex items-center justify-center py-12">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  ) : (
    /* bestehende Drill-Liste */
  )}
```

- [ ] **Step 2:** Analog in `MatchPlanEditor.tsx` für den Template-Load (Spinner statt leerer Zustand während `await`).
- [ ] **Step 3: Run** `npx tsc -b && npm test` → grün.
- [ ] **Step 4: Commit** `feat(ux): show loading spinners during async drill/template loads`

---

### Task 13: Konva `AnnotationLayer` memoisieren + Move-Handler stabilisieren

**Files:**
- Modify: `src/features/board/components/AnnotationLayer.tsx`
- Modify: `src/features/board/components/BoardCanvas.tsx`

- [ ] **Step 1:** `AnnotationLayer` in `React.memo` wickeln (Default-Export oder benannten Export entsprechend anpassen). Imports: `import { memo } from "react";`
- [ ] **Step 2:** In `BoardCanvas.tsx` die an `FigureLayer` übergebenen `onMoveRod`/`onMoveBall`-Closures (Zeilen ~196-199) in `useCallback` mit korrekten Deps wrappen.
- [ ] **Step 3: Run** `npm test && npx tsc -b` → grün. Manueller Smoke-Test des Boards (Zeichnen/Verschieben) bei finaler Verifikation.
- [ ] **Step 4: Commit** `perf(board): memoize AnnotationLayer and stabilize move handlers`

---

### Task 14: `noUncheckedIndexedAccess` aktivieren + Fallout fixen

**Files:**
- Modify: `tsconfig.json`
- Modify: betroffene Stellen (z. B. `src/features/train/TrainMode.tsx:128,383` — `templates[templates.length - 1]?.id`)

- [ ] **Step 1:** In `tsconfig.json` unter `compilerOptions`: `"noUncheckedIndexedAccess": true`.
- [ ] **Step 2: Run** `npx tsc -b` → Liste der neuen Fehler. Jede Stelle mit `?.`/`??`/Guard absichern (kein `!`-Holzhammer, außer nachweislich sicher).
- [ ] **Step 3: Run** `npx tsc -b && npm test` → grün.
- [ ] **Step 4: Commit** `chore(ts): enable noUncheckedIndexedAccess and fix fallout`

---

## Abschluss-Verifikation

- [ ] `npm test` — gesamte Suite grün
- [ ] `npx tsc -b` — keine Typfehler
- [ ] `npm run lint` — sauber
- [ ] `npm run build` — Production-Build erfolgreich
- [ ] Manueller Smoke-Test: Import eines Backups (UI aktualisiert sich ohne Reload), Modal-Tastaturbedienung (Tab bleibt gefangen, Esc schließt, Fokus kehrt zurück), Tabs/Sterne per Tastatur, Board zeichnen.
- [ ] Abschluss-Doku: geänderte Dateien, verbleibende Risiken, empfohlene nächste Schritte.

## Verbleibende, bewusst NICHT adressierte Punkte (YAGNI / niedrige Priorität)

- Listen-Virtualisierung (erst bei hunderten Einträgen relevant)
- Konsolidierung der zwei ErrorBoundary-Klassen
- Forward-Ref für Button/IconButton/Card (kosmetisch; nur nötig falls Refs gebraucht werden)
- Spacing/Radius/Shadow-Tokens (Farb-Tokens existieren bereits; Rest ist optional)
