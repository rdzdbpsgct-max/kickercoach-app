# CLAUDE.md — KickerCoach App

## Project Overview

KickerCoach is a digital training ecosystem for table football (Tischkicker), built by SpielerGeist. It is a single-page application with four main feature modes: Learn, Train, Plan, and Tactical Board. The UI is entirely in German.

## Tech Stack

- **Framework**: React 18 + TypeScript (strict mode)
- **Build**: Vite 6 (ESM, `"type": "module"`)
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin, custom theme in `src/index.css`)
- **Canvas**: Konva + react-konva (tactical board)
- **Routing**: react-router-dom v6 with `HashRouter` (for GitHub Pages compatibility)
- **Testing**: Vitest + @testing-library/react + jsdom
- **Linting**: ESLint 9 (flat config) + typescript-eslint + react-hooks + react-refresh
- **Formatting**: Prettier (double quotes, semicolons, trailing commas)
- **Deployment**: GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server at http://localhost:5173/kickercoach-app/
npm run build        # TypeScript check + production build (tsc -b && vite build)
npm test             # Run all tests once (vitest run) — 27 tests, 3 files
npm run test:watch   # Tests in watch mode
npm run lint         # ESLint (must pass with zero warnings/errors)
npm run format       # Prettier — formats src/**/*.{ts,tsx}
```

The CI pipeline (on push to `main`) runs: `npm ci` → `npm run lint` → `npm test` → `npm run build` → deploy.

## Project Structure

```
src/
  main.tsx                    # Entry point: StrictMode + HashRouter + App
  App.tsx                     # Routes + ErrorBoundary + Suspense/lazy loading
  index.css                   # Tailwind import + custom theme (@theme block)
  vite-env.d.ts               # Vite client types

  domain/
    models/                   # TypeScript interfaces (framework-independent)
      CoachCard.ts            # CoachCard, Difficulty, Category
      Drill.ts                # Drill, TrainingBlock, DrillDifficulty
      Session.ts              # Session
      MatchPlan.ts            # MatchPlan, StrategyTemplate
      TacticalBoard.ts        # Point, FigureMarker, ArrowElement, ZoneElement, TacticalScene, etc.
      index.ts                # Re-exports all model types
    logic/                    # Pure functions (unit-testable, no React)
      time.ts                 # formatTime, computeRemaining
      drill.ts                # advanceBlock, previousBlock, validateDrill, drillTotalDuration
      session.ts              # calculateSessionStats, calculateSessionDuration
      index.ts                # Re-exports all logic + types
    constants.ts              # DIFFICULTY_LABELS, CATEGORY_COLORS, STORAGE_KEYS, etc.

  data/                       # Static default data (lazy-loaded via dynamic import)
    coachCards.ts              # COACH_CARDS — 48 coaching cards
    drills.ts                 # DEFAULT_DRILLS — 20 training drills
    strategyTemplates.ts      # STRATEGY_TEMPLATES — 8 templates (4 offensive, 4 defensive)
    fieldConfig.ts            # FIELD dimensions, RODS config, ARROW_STYLES, TEAM_COLORS, etc.

  components/
    Layout.tsx                # App shell: header with nav tabs + main content area

  features/
    home/
      HomePage.tsx            # Landing page with hero + feature cards
    learn/
      LearnMode.tsx           # Card browser with search, filter, favorites
      SearchFilter.tsx         # Search + category/difficulty/favorites filter bar
      CardGrid.tsx            # Grid display of coaching cards
      CardDetail.tsx          # Single card detail view with learning paths
    train/
      TrainMode.tsx           # Training hub: drill selector, timer, session builder, journal
      Timer.tsx               # Timer display component
      BlockProgress.tsx       # Visual block progress indicator
      DrillSelector.tsx       # Drill list with difficulty filter
      SessionBuilder.tsx      # Custom session builder from drills
      Journal.tsx             # Training journal with session stats
    plan/
      PlanMode.tsx            # Match plan manager: create, edit, import/export JSON
      MatchPlanEditor.tsx     # Match plan form with strategy templates
      MatchPlanList.tsx       # List of saved match plans
    board/
      BoardMode.tsx           # Tactical board: canvas editor with scene management
      components/
        BoardCanvas.tsx       # Konva Stage wrapper handling interactions
        FieldLayer.tsx        # Green field background + lines + goals
        FigureLayer.tsx       # Draggable figure markers (red/blue teams)
        AnnotationLayer.tsx   # Arrows and zones rendering
        OverlayLayer.tsx      # Drawing-in-progress preview
        Toolbar.tsx           # Tool selection bar (select, arrow, zone, eraser)
        SceneManager.tsx      # Scene save/load/delete modal
      hooks/
        useBoardReducer.ts    # Board state management with undo/redo history
        useCanvasDimensions.ts # ResizeObserver-based dimension tracking
        useKeyboardShortcuts.ts # Delete/Backspace/Escape shortcuts
      logic/
        fieldGeometry.ts      # Hit-testing and rod constraints
        sceneFactory.ts       # Default scene/figure/ball creation

  hooks/
    useLocalStorage.ts        # Generic localStorage persistence hook
    useFavorites.ts           # Favorite IDs management hook
    useTimer.ts               # Drift-free timer using Date.now() + requestAnimationFrame

tests/
  setup.ts                    # Imports @testing-library/jest-dom/vitest
  domain/
    drill.test.ts             # Tests for advanceBlock, previousBlock, validateDrill, drillTotalDuration
    time.test.ts              # Tests for formatTime, computeRemaining
    session.test.ts           # Tests for calculateSessionStats, calculateSessionDuration
```

## Architecture & Key Patterns

### Domain-Driven Separation
- **`domain/models/`**: Pure TypeScript interfaces — no framework imports, no runtime code.
- **`domain/logic/`**: Pure functions operating on domain models. These are the primary target for unit tests.
- **`domain/constants.ts`**: Shared constants including `STORAGE_KEYS` for localStorage keys.
- **`data/`**: Static data arrays. Loaded via dynamic `import()` in feature components for code-splitting.

### Feature Modules
Each feature is self-contained under `src/features/<name>/`. Feature entry components are lazy-loaded in `App.tsx` via `React.lazy()`.

### State Management
- No external state library (no Redux, Zustand, etc.) — local React state + hooks only.
- **localStorage** for all persistence via `useLocalStorage` hook and `STORAGE_KEYS` constants.
- The tactical board uses a custom reducer pattern (`useBoardReducer`) with undo/redo history (max 50 states).

### Styling Conventions
- All styling via Tailwind CSS utility classes — no CSS modules, no styled-components.
- Custom color theme defined in `src/index.css` using `@theme` block (Tailwind v4 syntax).
- Dark theme is the default and only theme. Color tokens: `bg`, `surface`, `card`, `border`, `text`, `text-muted`, `text-dim`, `accent`, `kicker-blue`, `kicker-red`, `kicker-green`, `kicker-orange`, `field`, `field-line`, `field-border`.
- Button patterns: primary uses `border-2 border-accent bg-accent-dim text-accent-hover`, secondary uses `border border-border text-text-muted`.

### Routing
- `HashRouter` for GitHub Pages SPA compatibility.
- Routes: `/` (home), `/learn`, `/train`, `/plan`, `/board`.
- Catch-all `*` redirects to `/`.

### Data Loading
Data modules (`coachCards`, `drills`, `strategyTemplates`) are lazy-loaded via `import()` inside `useEffect` to keep the initial bundle small.

### TypeScript
- Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`.
- Target: ES2020, JSX: react-jsx.
- Models use `type` exports; logic uses named function exports.

## Testing

- Tests live in `tests/domain/` and test pure domain logic functions only.
- Test runner: Vitest with jsdom environment and `@testing-library/jest-dom` matchers.
- Test config is in `vite.config.ts` under the `test` key (global mode enabled).
- Pattern: `describe`/`it`/`expect` with inline test data fixtures.
- Tests must always pass before committing — CI will reject failing builds.

## Code Style

- **Prettier config** (`.prettierrc`): double quotes, semicolons, trailing commas, 80 char width, 2-space indent.
- **ESLint**: flat config (`eslint.config.js`) extending recommended + typescript-eslint + react-hooks + prettier.
- Function components with `export default function ComponentName()`.
- Named exports for hooks and pure functions.
- German-language user-facing strings throughout (labels, errors, descriptions).
- JSDoc comments on domain logic functions.

## localStorage Keys

All persistent data uses keys defined in `src/domain/constants.ts`:
- `kickercoach-favorites` — favorite card IDs
- `kickercoach-sessions` — training sessions
- `kickercoach-matchplans` — match plans
- `kickercoach-autoadvance` — timer auto-advance setting
- `kickercoach-board-scenes` — tactical board scenes

## Important Notes

- The app base path is `/kickercoach-app/` (configured in `vite.config.ts`).
- All feature entry components must have a `default` export (required for `React.lazy()`).
- The tactical board uses Konva canvas coordinates (field: 1200x680 units) scaled to the container.
- Figure spacing on rods follows real DTFB (Deutscher Tischfussballbund) norms — see `fieldConfig.ts`.
- IDs are generated via `crypto.randomUUID()`.
- The app has no backend — everything is client-side with localStorage.
