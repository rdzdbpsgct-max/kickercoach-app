# KickerCoach

Das digitale Trainings-Oekosystem fuer Tischfussball. By **SpielerGeist**.

## Features

### Learn Mode
- 32 Coaching Cards mit Schritt-fuer-Schritt-Anleitungen
- Kategorien: Torschuss, Passspiel, Ballkontrolle, Defensive, Taktik
- Schwierigkeitsstufen: Einsteiger, Fortgeschritten, Profi
- Volltextsuche und Filter
- Favoriten (localStorage)

### Train Mode
- 14 vordefinierte Drills mit Work/Rest-Bloecken
- Driftfreier Timer (Date.now basiert)
- Tastaturkuerzel: Space (Start/Pause), N (Next), P (Prev), R (Reset)
- Auto-Advance zwischen Bloecken
- Session Builder: Eigene Trainings aus Drills zusammenstellen
- Trainingstagebuch mit Statistiken

### Plan Mode
- Matchplan-Editor mit Gegneranalyse und Gameplan
- Timeout-Strategien verwalten
- JSON Export/Import
- localStorage Persistenz

## Tech Stack

- React 18 + TypeScript
- Vite 6
- TailwindCSS v4
- Vitest (27 Unit Tests)
- ESLint + Prettier

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Die App startet auf `http://localhost:5173/kickercoach-app/`.

## Tests

```bash
npm test            # Tests einmalig ausfuehren
npm run test:watch  # Tests im Watch-Modus
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

Die App ist dann erreichbar unter:
`https://<username>.github.io/kickercoach-app/`

### Vercel / Netlify (alternativ)

- Build Command: `npm run build`
- Output Directory: `dist`
- Base Path in `vite.config.ts` ggf. auf `/` aendern

## Projektstruktur

```
src/
  domain/models/     # TypeScript Interfaces (framework-unabhaengig)
  domain/logic/      # Pure Functions (unit-testbar)
  components/        # Shared UI Components
  features/          # Feature-Module (learn, train, plan)
  hooks/             # Custom React Hooks
  data/              # Default-Daten (Cards, Drills)
tests/               # Unit Tests
.github/workflows/   # CI/CD
```

## Verfuegbare Scripts

| Script | Beschreibung |
|---|---|
| `npm run dev` | Entwicklungsserver starten |
| `npm run build` | TypeScript pruefen + Production Build |
| `npm run preview` | Build lokal pruefen |
| `npm test` | Alle Tests ausfuehren |
| `npm run test:watch` | Tests im Watch-Modus |
| `npm run lint` | ESLint ausfuehren |
| `npm run format` | Prettier formatieren |

## Design-Entscheidungen

- **HashRouter** statt BrowserRouter fuer GitHub Pages Kompatibilitaet
- **Lazy Loading** der Datenmodule (coachCards, drills) fuer schnelleres Initial Load
- **localStorage** fuer alle persistenten Daten (Favoriten, Sessions, Matchplaene, Settings)
- **Keine externen UI-Bibliotheken** - alles mit TailwindCSS
- **Dark Theme** als Default mit sport-orientierten Akzentfarben
- **Domain Logic** ist framework-unabhaengig und rein funktional

## Lizenz

Proprietaer. Alle Rechte vorbehalten. (c) 2026 SpielerGeist.
