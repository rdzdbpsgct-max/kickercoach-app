# M1 + M2 — Analyse & Export, Englisch & Produktreife

**Datum:** 2026-06-14 · **Ziel:** Portfolio-Showcase (lokal, kein Backend).

## M1 — Analyse & Export
- **Skill-Entwicklung über Zeit**: neue, wiederverwendbare `LineChart`-SVG-Primitive + reine `buildSkillTrends()`-Logik (sortiert, forward-filled je Kategorie) + `SkillTrendChart` in der Analyse-Ansicht. Zeigt die Entwicklung jeder Skill-Kategorie über die Bewertungshistorie (vorher nur Momentaufnahme).
- **PDF-Export (Ansatz A, `@react-pdf/renderer`)**:
  - **Spielerprofil** (Header, Skill-Balken, Ziele, letzte Bewertungen) — Button in `PlayerDetail`.
  - **Matchplan** (Gegner, Ergebnis, Sätze, Analyse, Gameplan, Timeout-Strategien, Notizen) — Button in `MatchPlanEditor`.
  - Designte A4-Dokumente mit selektierbarem Text, lokalisierten Labels; **lazy geladen** (≈1,5 MB Renderer bleibt aus dem Haupt-Bundle).
  - `downloadBlob`/`slugify`-Util (getestet).

## M2 — Englisch & Produktreife
- **Englisch**: alle 9 Locale-Namespaces übersetzt (`en/`), in i18n verdrahtet (`supportedLngs` de/en, regionale Varianten → Basis), Sprachumschalter in den Einstellungen aktiviert. Tests auf Deutsch gepinnt für Determinismus.
- **Playwright-E2E**: 3 Chromium-Smoke-Tests (App-Load/Nav, Drill-Laden = End-to-End-Absicherung des Base-URL-Fetch-Fixes, Sprachumschaltung). `npm run e2e`.
- **CI**: neues `ci.yml` validiert jeden Push **und Pull Request** (Lint, Typecheck, Unit-Tests, Build, E2E). `deploy.yml` deployt weiterhin nur `main`.
- **Sentry**: optionales, env-gated Error-Monitoring (`VITE_SENTRY_DSN`); per Dynamic-Import dead-code-eliminiert, wenn kein DSN gesetzt ist. Kein Account nötig.

## Verifikation
- `npm test` — **185 Tests grün** (32 Dateien; vitest jetzt auf `tests/` beschränkt, wodurch stale Worktree-Duplikate nicht mehr doppelt liefen).
- `npm run e2e` — **3 E2E-Tests grün**.
- `npx tsc -b` — 0 Fehler · `npm run lint` — 0 Errors · `npm run build` — erfolgreich.

## Bewusst nicht umgesetzt / Hinweise
- **Branch-Protection** nicht gesetzt (Repo-Zugriffseinstellung — außerhalb des Scopes).
- PDF-Optik & Responsive nur per Build/Tests verifiziert, kein Live-Browser-Klick durch mich — kurzer manueller Check empfohlen.
- Englische Locale erhöht das Haupt-Bundle um die Locale-Daten; bei Bedarf später Lazy-Loading der Nicht-Default-Sprache.
- `@react-pdf/renderer`/Sentry bringen transitive npm-audit-Warnungen mit (Dev-/Lazy-Abhängigkeiten).
