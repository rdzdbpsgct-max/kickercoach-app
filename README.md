# KickerCoach

Das digitale Trainings-Oekosystem fuer Tischfussball. By **SpielerGeist**.

## Features

### Learn Mode
- 48 Coaching Cards mit Schritt-fuer-Schritt-Anleitungen
- 7 Kategorien: Torschuss, Passspiel, Ballkontrolle, Defensive, Taktik, Offensive, Mental
- Schwierigkeitsstufen: Einsteiger, Fortgeschritten, Profi
- Lernpfade zwischen Cards (Voraussetzungen & naechste Schritte)
- Volltextsuche und Filter
- Favoriten (localStorage)

### Train Mode
- 20 vordefinierte Drills mit Work/Rest-Bloecken
- Schwierigkeitsfilter und farbkodierte Badges
- Driftfreier Timer (Date.now basiert)
- Tastaturkuerzel: Space (Start/Pause), N (Next), P (Prev), R (Reset)
- Auto-Advance zwischen Bloecken
- Session Builder: Eigene Trainings aus Drills zusammenstellen
- Trainingstagebuch mit Statistiken

### Plan Mode
- Matchplan-Editor mit Gegneranalyse und Gameplan
- Strategie-Templates: 4 Offensive + 4 Defensive Vorlagen mit Tipps
- Timeout-Strategien verwalten
- **PDF-Export** des Matchplans (designtes Dokument)
- JSON Export/Import
- localStorage Persistenz

### Players Mode
- Spielerprofile mit Skill-Profil (Radar), Zielen, Techniken und Coaching-Notizen
- Teams verwalten
- **PDF-Export** des Spielerprofils (designtes Dokument)

### Analytics Mode
- Übersichts-Statistiken (Sessions, Spieler, Matches, Bilanz)
- **Skill-Entwicklung über Zeit** (Trend-Liniendiagramm aus der Bewertungshistorie)
- Skill-Profil, Spielervergleich, Trainingsfrequenz, Drill-Statistiken

### Board Mode
- Interaktives Taktik-Board (react-konva) mit Figuren, Ball, Pfeilen und Zonen
- Undo/Redo, Szenen speichern

### Internationalisierung
- Deutsch & Englisch (i18next), umschaltbar in den Einstellungen

## Tech Stack

- React 18 + TypeScript (strict, `noUncheckedIndexedAccess`)
- Vite 6, TailwindCSS v4
- Zustand (persistierter Store mit versionierten Migrationen) + Zod-Validierung
- i18next (de/en), react-konva, Framer Motion
- @react-pdf/renderer (lazy) für PDF-Exporte
- Vitest (185 Unit-/Component-Tests) + Playwright (E2E)
- Optionales Sentry-Error-Monitoring (env-gated)
- ESLint + Prettier

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Die App startet auf `http://localhost:5173/kicker-coach/`.

## Tests

```bash
npm test            # Unit-/Component-Tests (Vitest)
npm run test:watch  # Tests im Watch-Modus
npm run e2e         # End-to-End-Tests (Playwright, startet den Dev-Server)
```

## Build

```bash
npm run build
npm run preview     # Build lokal pruefen
```

## Deployment

### GitHub Pages (automatisch)

Bei jedem Push auf `main` wird die App automatisch via GitHub Actions deployt:

1. Repository Settings > Pages > Source: "GitHub Actions"
2. Push auf `main` triggert `.github/workflows/deploy.yml`
3. Workflow: Install > Test > Build > Deploy

Zusätzlich validiert `.github/workflows/ci.yml` jeden **Pull Request** und Push (Lint, Typecheck, Unit-Tests, Build, E2E).

### Vercel / Netlify (alternativ)

- Build Command: `npm run build`
- Output Directory: `dist`
- Base Path in `vite.config.ts` ggf. auf `/` aendern

## Projektstruktur

```
src/
  domain/models/     # TypeScript Interfaces (framework-unabhaengig)
  domain/logic/      # Pure Functions (unit-testbar)
  components/        # Shared UI Components (Design-System-Primitive)
  features/          # Feature-Module (home, learn, train, plan, board, players, analytics, settings, export)
  store/             # Zustand-Store + Slices + Migrationen
  hooks/             # Custom React Hooks
  i18n/              # i18next-Setup + Locales (de, en)
  monitoring/        # Optionales Sentry-Setup
  data/              # Default-Daten (Cards, Drills, Strategie-Templates)
tests/               # Unit-/Component-Tests (Vitest)
e2e/                 # End-to-End-Tests (Playwright)
.github/workflows/   # CI (ci.yml) + Deployment (deploy.yml)
```

## Verfuegbare Scripts

| Script | Beschreibung |
|---|---|
| `npm run dev` | Entwicklungsserver starten |
| `npm run build` | TypeScript pruefen + Production Build |
| `npm run preview` | Build lokal pruefen |
| `npm test` | Unit-/Component-Tests (Vitest) |
| `npm run test:watch` | Tests im Watch-Modus |
| `npm run e2e` | End-to-End-Tests (Playwright) |
| `npm run lint` | ESLint ausfuehren |
| `npm run format` | Prettier formatieren |

> Optionales Error-Monitoring: `VITE_SENTRY_DSN` in `.env.local` setzen (siehe `.env.example`). Ohne DSN wird das Sentry-SDK nicht geladen.

## Design-Entscheidungen

- **HashRouter** statt BrowserRouter fuer GitHub Pages Kompatibilitaet
- **Lazy Loading** der Datenmodule (coachCards, drills, strategyTemplates) fuer schnelleres Initial Load
- **localStorage** fuer alle persistenten Daten (Favoriten, Sessions, Matchplaene, Settings)
- **Keine externen UI-Bibliotheken** - alles mit TailwindCSS
- **Dark Theme** als Default mit sport-orientierten Akzentfarben
- **Domain Logic** ist framework-unabhaengig und rein funktional
- **Lernpfade** verknuepfen Cards bidirektional (prerequisites / nextCards)

## Lizenz

Proprietaer. Alle Rechte vorbehalten. (c) 2026 SpielerGeist.
