# KickerCoach Härtung — Ergebnisdokumentation

**Datum:** 2026-06-14
**Branch:** `harden/correctness-a11y-polish`
**Ausgangslage:** Die App war bereits überdurchschnittlich gut strukturiert (Feature-Architektur, Domain-Layer, Zustand-Slices mit versionierter Persistenz, Lazy-Routing, Error-Boundaries, Design-Token-System, i18n, PWA, 222 Tests). Kein Rewrite nötig — gezieltes Härten.

## Was geändert wurde

### Baseline-Fix (vor den Phasen)
- **i18n in Test-Setup initialisiert** (`tests/setup.ts`). 3 vorbestehende Test-Failures (SearchBar/ConfirmDialog asserteten auf deutsche Strings, während `t()` rohe Keys lieferte) behoben.

### Phase 1 — Korrektheit & Datenintegrität
1. **`validateOrWarn` gibt validierte Daten zurück** (`src/utils/validate.ts`). Vorher: parsed & warnte, gab aber unvalidierte Daten zurück → Zod-`.default()` griff nie. Betraf addPlayer/addSession/addGoal/addEvaluation/addCoachingNote.
2. **Import validiert alle persistierten Arrays** (`src/utils/storage.ts`). Vorher fehlten `teams`, `customDrills`, `drillTemplates`, `sessionTemplates`, `techniques`, `favorites` → ein Backup konnte beliebig geformte Objekte injizieren.
3. **Import re-hydriert den Store** (`persist.rehydrate()`) — UI aktualisiert sich ohne Reload.
4. **`partialize` auf persist** (`src/store/useAppStore.ts`) — nur Daten-Arrays werden persistiert, keine Selektoren/Actions/transienter State.
5. **Tests für Import/Export** (höchste Risiko-Fläche, vorher ungetestet).

### Phase 2 — Accessibility
6. **`useFocusTrap`-Hook** (`src/hooks/useFocusTrap.ts`) + **Modal/ConfirmDialog** fangen jetzt den Fokus, setzen ihn beim Öffnen hinein und stellen ihn beim Schließen wieder her.
7. **Tabs** nutzen `role="tablist"`/`role="tab"`/`aria-selected`, roving `tabindex` und Pfeiltasten-Navigation (vorher `aria-pressed`, mausonly).
8. **StarRating** ist tastaturbedienbar (`role="slider"` + Pfeiltasten) und i18n-lokalisiert (vorher hartkodiert „Sterne").

### Phase 3 — Design-System & Polish
9. **`<Avatar>`-Komponente** als Single Source of Truth (`src/components/ui/Avatar.tsx`). 13 inline-duplizierte Avatar-Markups ersetzt; inkonsistente Fallback-Farbe (`#6366f1` vs `#00e676`) auf einen Wert (`AVATAR_FALLBACK_COLOR`) vereinheitlicht. Jede Aufrufstelle behält ihre exakte Größe/Form via `className` → keine visuelle Regression.
10. **Lade-Spinner** in TrainMode während Drills async laden (vorher Flash-Empty).
11. **Board-Performance**: `AnnotationLayer` memoisiert + Rod/Ball-Move-Handler `useCallback`-stabilisiert → committete Annotationen rendern nicht mehr bei jedem Zeichen-Pointermove neu.
12. **`noUncheckedIndexedAccess` aktiviert** (`tsconfig.json`) + ~99 latente Undefined-Zugriffsstellen gehärtet (echte Guards in `src/`, idiomatische Assertions in Tests).

## Verifikation
- ✅ `npm test` — **246/246 Tests grün** (von 222; +24 neue Tests)
- ✅ `npx tsc -b` — **0 Fehler** (mit strengerem `noUncheckedIndexedAccess`)
- ✅ `npm run build` — **Production-Build erfolgreich** (2,4 s)
- ✅ `npm run lint` — **0 Errors** (10 vorbestehende `exhaustive-deps`-Warnings)
- ✅ Dev-Server bootet & serviert fehlerfrei

## Verbleibende Risiken
- **Visueller/Responsive-Smoke-Test im Browser** wurde nicht live durchgeführt (nur automatisiert + Build verifiziert). Der Avatar-Refactor reproduziert die Klassen exakt; einziger sichtbarer Delta: Spieler **ohne** gesetzte `avatarColor` zeigen nun Indigo statt Grün als Fallback (selten, da `PlayerForm` immer eine Farbe setzt). Empfehlung: kurzer manueller Durchklick auf Mobile/Desktop.
- Die `react-hooks/exhaustive-deps`-Warnings (10) bestehen weiter; bewusst nicht angefasst (Verhaltensänderungsrisiko ohne Tests).

## Empfohlene nächste Schritte (bewusst NICHT in diesem Durchlauf)
- Listen-Virtualisierung für Journal/NotesFeed/PlayerList (erst ab hunderten Einträgen relevant)
- Konsolidierung der zwei ErrorBoundary-Klassen
- `forwardRef` für Button/IconButton/Card (nur falls Refs gebraucht werden)
- Spacing/Radius/Shadow-Design-Tokens (Farb-Tokens existieren bereits)
- Integrationstests für TrainMode-/SessionBuilder-Flows; Test für `useBoardReducer` (Undo/Redo)
