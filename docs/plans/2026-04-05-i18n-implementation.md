# i18n Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Externalize all ~300-400 hardcoded German strings into react-i18next translation files, enabling future multi-language support.

**Architecture:** react-i18next with JSON namespace files per feature area. i18next-browser-languagedetector for persistence. Translation happens at view layer only — Zustand store stays language-agnostic.

**Tech Stack:** i18next, react-i18next, i18next-browser-languagedetector

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install i18n packages**

Run: `npm install i18next react-i18next i18next-browser-languagedetector`

**Step 2: Verify installation**

Run: `npm ls i18next react-i18next i18next-browser-languagedetector`
Expected: All three packages listed without errors.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install i18next, react-i18next, i18next-browser-languagedetector"
```

---

### Task 2: Create i18n Infrastructure + Common Namespace

**Files:**
- Create: `src/i18n/index.ts`
- Create: `src/i18n/locales/de/common.json`
- Modify: `src/main.tsx`

**Step 1: Create `src/i18n/locales/de/common.json`**

Extract all shared/cross-cutting German strings into the common namespace:

```json
{
  "appName": "KickerCoach",
  "appTagline": "by SpielerGeist",
  "skipToContent": "Zum Inhalt springen",
  "nav": {
    "home": "Home",
    "learn": "Lernen",
    "train": "Training",
    "plan": "Matchplan",
    "board": "Taktik",
    "players": "Spieler",
    "analytics": "Analyse",
    "settings": "Einstellungen",
    "more": "Mehr",
    "moreAreas": "Weitere Bereiche",
    "mainNav": "Hauptnavigation"
  },
  "theme": {
    "activateLight": "Light Mode aktivieren",
    "activateDark": "Dark Mode aktivieren"
  },
  "actions": {
    "save": "Speichern",
    "cancel": "Abbrechen",
    "delete": "Löschen",
    "edit": "Bearbeiten",
    "add": "Hinzufügen",
    "back": "Zurück",
    "close": "Schließen",
    "retry": "Erneut versuchen",
    "search": "Suchen",
    "confirm": "Bestätigen",
    "later": "Später",
    "update": "Aktualisieren"
  },
  "error": {
    "title": "Ein Fehler ist aufgetreten",
    "titleWithFeature": "Fehler in {{featureName}}",
    "description": "Dieser Bereich hat einen Fehler verursacht. Die restliche App funktioniert weiterhin.",
    "unknown": "Unbekannter Fehler"
  },
  "pwa": {
    "updateAvailable": "Neue Version verfügbar",
    "updateDescription": "Aktualisiere für die neuesten Funktionen und Fixes."
  },
  "quickAction": {
    "note": "Notiz",
    "training": "Training",
    "evaluation": "Bewertung"
  },
  "constants": {
    "difficulty": {
      "beginner": "Einsteiger",
      "intermediate": "Fortgeschritten",
      "advanced": "Profi"
    },
    "phase": {
      "warmup": "Aufwärmen",
      "technique": "Technik",
      "game": "Spielform",
      "cooldown": "Cool-Down"
    },
    "position": {
      "offense": "Sturm",
      "defense": "Abwehr",
      "both": "Beides"
    },
    "techniqueStatus": {
      "not_started": "Nicht begonnen",
      "learning": "Lernend",
      "developing": "Aufbauend",
      "proficient": "Sicher",
      "mastered": "Gemeistert"
    },
    "star": ["", "Schlecht", "Mässig", "OK", "Gut", "Super"],
    "evaluationType": {
      "session": "Training",
      "match": "Spiel",
      "general": "Allgemein"
    },
    "mood": {
      "great": "Super",
      "good": "Gut",
      "ok": "OK",
      "tired": "Müde",
      "frustrated": "Frustriert"
    },
    "noteCategory": {
      "tactical": "Taktik",
      "technical": "Technik",
      "mental": "Mental",
      "communication": "Kommunikation"
    },
    "notePriority": {
      "low": "Niedrig",
      "medium": "Mittel",
      "high": "Hoch"
    },
    "category": {
      "Torschuss": "Torschuss",
      "Passspiel": "Passspiel",
      "Ballkontrolle": "Ballkontrolle",
      "Defensive": "Defensive",
      "Taktik": "Taktik",
      "Offensive": "Offensive",
      "Mental": "Mental"
    }
  }
}
```

**Step 2: Create `src/i18n/index.ts`**

```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import commonDe from "./locales/de/common.json";

const resources = {
  de: { common: commonDe },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "de",
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "kickercoach-language",
    },
  });

export default i18n;
```

**Step 3: Import i18n in `src/main.tsx`**

Add `import "./i18n";` after other imports, before `migrateLegacyStorage()`.

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { migrateLegacyStorage } from "./store/legacyMigration";
import "./i18n";
import "./index.css";
```

**Step 4: Verify app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 5: Commit**

```bash
git add src/i18n/ src/main.tsx
git commit -m "feat(i18n): add i18next setup with common German namespace"
```

---

### Task 3: Migrate Layout & Navigation

**Files:**
- Modify: `src/components/Layout.tsx`
- Modify: `src/components/BottomNav.tsx`

**Step 1: Update `src/components/Layout.tsx`**

Add `useTranslation` hook and replace all hardcoded strings with `t()` calls:

```tsx
import { useTranslation } from "react-i18next";
// ... existing imports

export default function Layout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const tabs = [
    { to: "/", label: t("nav.home"), icon: "🏠" },
    { to: "/learn", label: t("nav.learn"), icon: "📚" },
    { to: "/train", label: t("nav.train"), icon: "⏱️" },
    { to: "/plan", label: t("nav.plan"), icon: "📋" },
    { to: "/board", label: t("nav.board"), icon: "🎯" },
    { to: "/players", label: t("nav.players"), icon: "👤" },
    { to: "/analytics", label: t("nav.analytics"), icon: "📊" },
  ];

  // Replace:
  // "Zum Inhalt springen" → t("skipToContent")
  // "KickerCoach" → t("appName")
  // "by SpielerGeist" → t("appTagline")
  // "Hauptnavigation" → t("nav.mainNav")
  // theme aria-label → t(theme === "dark" ? "theme.activateLight" : "theme.activateDark")
```

Move `tabs` from module-level const to inside the component (it now uses `t()` which requires React context).

**Step 2: Update `src/components/BottomNav.tsx`**

Add `useTranslation` hook and replace hardcoded labels:

```tsx
import { useTranslation } from "react-i18next";

export default function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const { t } = useTranslation();

  const primaryTabs = [
    { to: "/", label: t("nav.home"), icon: "🏠" },
    { to: "/train", label: t("nav.train"), icon: "⏱️" },
    { to: "/players", label: t("nav.players"), icon: "👤" },
  ];

  const moreItems = [
    { to: "/learn", label: t("nav.learn"), icon: "📚" },
    { to: "/plan", label: t("nav.plan"), icon: "📋" },
    { to: "/board", label: t("nav.board"), icon: "🎯" },
    { to: "/analytics", label: t("nav.analytics"), icon: "📊" },
    { to: "/settings", label: t("nav.settings"), icon: "⚙️" },
  ];

  // Replace:
  // "Weitere Bereiche" → t("nav.moreAreas")
  // "Hauptnavigation" → t("nav.mainNav")
  // "Mehr" → t("nav.more")
```

Move `PRIMARY_TABS` and `MORE_ITEMS` from module-level consts to inside the component.

**Step 3: Verify app builds and navigation renders**

Run: `npm run build`
Expected: No errors.

**Step 4: Commit**

```bash
git add src/components/Layout.tsx src/components/BottomNav.tsx
git commit -m "feat(i18n): migrate navigation labels to translation keys"
```

---

### Task 4: Migrate ErrorBoundary & PwaUpdatePrompt

**Files:**
- Modify: `src/components/ErrorBoundary.tsx`
- Modify: `src/components/PwaUpdatePrompt.tsx`

**Step 1: Update ErrorBoundary**

ErrorBoundary is a class component — use `withTranslation` HOC or access `i18n` directly:

```tsx
import i18n from "../i18n";

// In render(), replace:
// "Fehler in {featureName}" → i18n.t("error.titleWithFeature", { featureName })
// "Ein Fehler ist aufgetreten" → i18n.t("error.title")
// "Dieser Bereich hat einen Fehler..." → i18n.t("error.description")
// "Erneut versuchen" → i18n.t("actions.retry")
```

Note: Class components can't use hooks. Import `i18n` directly and use `i18n.t()`.

**Step 2: Update PwaUpdatePrompt**

```tsx
import { useTranslation } from "react-i18next";

// In component:
const { t } = useTranslation();

// Replace:
// "Neue Version verfügbar" → t("pwa.updateAvailable")
// "Aktualisiere für..." → t("pwa.updateDescription")
// "Später" → t("actions.later")
// "Aktualisieren" → t("actions.update")
```

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/components/ErrorBoundary.tsx src/components/PwaUpdatePrompt.tsx
git commit -m "feat(i18n): migrate error boundary and PWA prompt strings"
```

---

### Task 5: Migrate Domain Constants Labels

**Files:**
- Modify: `src/domain/constants.ts`

**Step 1: Remove label maps, keep colors and non-text constants**

Delete these exports from `constants.ts`:
- `DIFFICULTY_LABELS`
- `PHASE_LABELS`
- `POSITION_LABELS`
- `TECHNIQUE_STATUS_LABELS`
- `STAR_LABELS`
- `EVALUATION_TYPE_LABELS`
- `MOOD_LABELS`
- `NOTE_CATEGORY_LABELS`
- `NOTE_PRIORITY_LABELS`

Keep all `*_COLORS` maps, `STORAGE_KEYS`, `MAX_VISIBLE_TAGS`, `ALL_CATEGORIES`, `STAR_RATING_SCALE`.

**Step 2: Create a helper for constant lookups**

Add to `src/i18n/index.ts` (or create `src/i18n/helpers.ts`):

```typescript
// src/i18n/helpers.ts
import i18n from "./index";

export function tConstant(prefix: string, key: string): string {
  return i18n.t(`constants.${prefix}.${key}`);
}
```

**Step 3: Fix all imports across the codebase**

Every file that imports a deleted label map needs updating. Replace pattern:

```tsx
// Before:
import { DIFFICULTY_LABELS } from "../../domain/constants";
// ... later in JSX:
{DIFFICULTY_LABELS[drill.difficulty]}

// After:
import { useTranslation } from "react-i18next";
// ... in component:
const { t } = useTranslation();
// ... in JSX:
{t(`constants.difficulty.${drill.difficulty}`)}
```

Files to update (search for imports of deleted constants):
- All files importing `DIFFICULTY_LABELS`
- All files importing `PHASE_LABELS`
- All files importing `POSITION_LABELS`
- All files importing `TECHNIQUE_STATUS_LABELS`
- All files importing `STAR_LABELS`
- All files importing `EVALUATION_TYPE_LABELS`
- All files importing `MOOD_LABELS`
- All files importing `NOTE_CATEGORY_LABELS`
- All files importing `NOTE_PRIORITY_LABELS`

Run: `grep -r "DIFFICULTY_LABELS\|PHASE_LABELS\|POSITION_LABELS\|TECHNIQUE_STATUS_LABELS\|STAR_LABELS\|EVALUATION_TYPE_LABELS\|MOOD_LABELS\|NOTE_CATEGORY_LABELS\|NOTE_PRIORITY_LABELS" src/ --include="*.tsx" --include="*.ts" -l`

to find all affected files.

**Step 4: Verify build and tests**

Run: `npm run build && npm run test`
Expected: All pass.

**Step 5: Commit**

```bash
git add src/domain/constants.ts src/i18n/ src/features/ src/components/
git commit -m "feat(i18n): migrate domain label constants to translation keys"
```

---

### Task 6: Create Feature Namespaces + Migrate HomePage

**Files:**
- Create: `src/i18n/locales/de/home.json`
- Modify: `src/i18n/index.ts` (register namespace)
- Modify: `src/features/home/HomePage.tsx`

**Step 1: Extract all hardcoded strings from HomePage.tsx into `home.json`**

Read the full `src/features/home/HomePage.tsx` file, identify every German string, and create appropriate keys.

**Step 2: Register namespace in `src/i18n/index.ts`**

```typescript
import homeDe from "./locales/de/home.json";

const resources = {
  de: { common: commonDe, home: homeDe },
};
```

**Step 3: Update HomePage.tsx**

```tsx
const { t } = useTranslation("home");
// For shared strings: t("actions.save", { ns: "common" }) or use multiple namespaces:
const { t } = useTranslation(["home", "common"]);
```

**Step 4: Build + test**

Run: `npm run build`

**Step 5: Commit**

```bash
git add src/i18n/ src/features/home/
git commit -m "feat(i18n): migrate HomePage strings to home namespace"
```

---

### Task 7: Create & Migrate Learn Feature

**Files:**
- Create: `src/i18n/locales/de/learn.json`
- Modify: `src/i18n/index.ts`
- Modify: `src/features/learn/LearnMode.tsx`
- Modify: `src/features/learn/SearchFilter.tsx`
- Modify: `src/features/learn/CardGrid.tsx`
- Modify: `src/features/learn/CardDetail.tsx`

Same pattern as Task 6. Read each file, extract German strings, create namespace JSON, update components with `useTranslation("learn")`.

**Commit:**
```bash
git commit -m "feat(i18n): migrate Learn feature strings to learn namespace"
```

---

### Task 8: Create & Migrate Train Feature

**Files:**
- Create: `src/i18n/locales/de/train.json`
- Modify: `src/i18n/index.ts`
- Modify: `src/features/train/TrainMode.tsx`
- Modify: `src/features/train/DrillSelector.tsx` (if exists)
- Modify: `src/features/train/DrillEditor.tsx`
- Modify: `src/features/train/DrillTimerView.tsx`
- Modify: `src/features/train/SessionBuilder.tsx`
- Modify: `src/features/train/SessionRating.tsx`
- Modify: `src/features/train/SessionRetrospective.tsx`
- Modify: `src/features/train/Journal.tsx`
- Modify: `src/features/train/Timer.tsx` (if has strings)
- Modify: `src/features/train/BlockProgress.tsx` (if has strings)

This is the largest feature. Extract all German strings from every file. Use `useTranslation("train")` with fallback to `common` for shared labels.

**Commit:**
```bash
git commit -m "feat(i18n): migrate Train feature strings to train namespace"
```

---

### Task 9: Create & Migrate Players Feature

**Files:**
- Create: `src/i18n/locales/de/players.json`
- Modify: `src/i18n/index.ts`
- Modify: All `src/features/players/*.tsx` files (~12 files)

Same pattern. This is the second-largest feature area.

**Commit:**
```bash
git commit -m "feat(i18n): migrate Players feature strings to players namespace"
```

---

### Task 10: Create & Migrate Plan Feature

**Files:**
- Create: `src/i18n/locales/de/plan.json`
- Modify: `src/i18n/index.ts`
- Modify: `src/features/plan/PlanMode.tsx`
- Modify: `src/features/plan/MatchPlanEditor.tsx`
- Modify: `src/features/plan/MatchPlanList.tsx`

**Commit:**
```bash
git commit -m "feat(i18n): migrate Plan feature strings to plan namespace"
```

---

### Task 11: Create & Migrate Board Feature

**Files:**
- Create: `src/i18n/locales/de/board.json`
- Modify: `src/i18n/index.ts`
- Modify: `src/features/board/BoardMode.tsx`
- Modify: `src/features/board/components/Toolbar.tsx`
- Modify: `src/features/board/components/SceneManager.tsx`
- Modify: Other board components as needed

**Commit:**
```bash
git commit -m "feat(i18n): migrate Board feature strings to board namespace"
```

---

### Task 12: Create & Migrate Analytics Feature

**Files:**
- Create: `src/i18n/locales/de/analytics.json`
- Modify: `src/i18n/index.ts`
- Modify: `src/features/analytics/index.tsx`
- Modify: `src/features/analytics/TrainingFrequencyChart.tsx`
- Modify: `src/features/analytics/SkillProgressChart.tsx`
- Modify: `src/features/analytics/DrillStatsChart.tsx`
- Modify: `src/features/analytics/PlayerComparison.tsx`

**Commit:**
```bash
git commit -m "feat(i18n): migrate Analytics feature strings to analytics namespace"
```

---

### Task 13: Create & Migrate Settings + Language Selector

**Files:**
- Create: `src/i18n/locales/de/settings.json`
- Create: `src/components/LanguageSelector.tsx`
- Modify: `src/i18n/index.ts`
- Modify: `src/features/settings/SettingsPage.tsx`

**Step 1: Create `settings.json`**

Extract all Settings page strings.

**Step 2: Create `src/components/LanguageSelector.tsx`**

```tsx
import { useTranslation } from "react-i18next";

const AVAILABLE_LANGUAGES = [
  { code: "de", label: "Deutsch" },
  // Future: { code: "en", label: "English" },
] as const;

export default function LanguageSelector() {
  const { i18n, t } = useTranslation("settings");

  return (
    <div>
      <label className="text-sm font-medium text-text-dim">
        {t("language")}
      </label>
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        {AVAILABLE_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

**Step 3: Add LanguageSelector to SettingsPage**

Import and render `<LanguageSelector />` in the settings page.

**Step 4: Verify build**

Run: `npm run build`

**Step 5: Commit**

```bash
git add src/i18n/ src/components/LanguageSelector.tsx src/features/settings/
git commit -m "feat(i18n): migrate Settings feature + add language selector"
```

---

### Task 14: Migrate Remaining Shared Components

**Files:**
- Modify: `src/components/QuickActionFAB.tsx`
- Modify: `src/components/domain/SessionCard.tsx`
- Modify: `src/components/domain/PlayerCard.tsx`
- Modify: `src/components/domain/GoalCard.tsx`
- Modify: `src/components/domain/DrillCard.tsx`
- Modify: `src/components/domain/NoteCard.tsx`
- Modify: `src/components/ui/SearchBar.tsx` (if has hardcoded placeholder)
- Modify: `src/components/ui/ConfirmDialog.tsx` (if has hardcoded text)
- Modify: `src/components/ui/EmptyState.tsx` (if has hardcoded text)
- Modify: `src/components/ui/StarRating.tsx` (aria-labels)

Add any missed strings to `common.json` or the appropriate feature namespace.

**Commit:**
```bash
git commit -m "feat(i18n): migrate remaining shared component strings"
```

---

### Task 15: Final Verification & Cleanup

**Step 1: Search for remaining hardcoded German strings**

Run: `grep -rn "\"[A-ZÄÖÜ][a-zäöüß]*" src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules\|\.json\|import\|export\|const \|type \|interface " | head -50`

Manually review results for any missed user-facing strings.

**Step 2: Run full test suite**

Run: `npm run test`
Expected: All 222+ tests pass.

**Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

**Step 4: Run lint**

Run: `npm run lint`
Expected: 0 errors.

**Step 5: Run build**

Run: `npm run build`
Expected: Clean build.

**Step 6: Final commit (if any cleanup needed)**

```bash
git commit -m "feat(i18n): final cleanup and verification"
```

**Step 7: Push**

```bash
git push
```
