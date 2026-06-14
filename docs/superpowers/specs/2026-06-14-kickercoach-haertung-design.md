# KickerCoach — Härtung & Professionalisierung (Design / Spec)

**Datum:** 2026-06-14
**Status:** Genehmigt (Scope), Plan folgt
**Branch-Strategie:** Direkt auf `main`, Phasen sequenziell
**Leitprinzip:** Kein Rewrite. Bestehende Funktionen bleiben 1:1 erhalten — nur korrekter, zugänglicher und robuster. Jede Phase wird durch `npm test` + `npm run build` (grün) abgesichert, bevor die nächste beginnt.

## Ausgangslage

KickerCoach ist eine React-18-PWA (Vite, Tailwind v4, Zustand 5, Zod 4, i18next, react-konva) für Tischkicker-Coaching. Die Codebasis ist bereits überdurchschnittlich sauber: feature-basierte Struktur, reine Domain-Schicht mit Unit-Tests, lazy-geladene Routes, Error-Boundaries (global + pro Feature), versionierte Persistenz mit Zod-validierten Migrationen, token-getriebenes Designsystem, 23 Testdateien, `strict: true`, keine `any` im `src/`.

Eine vollständige Überarbeitung ("Rewrite") wäre kontraproduktiv: Sie würde funktionierenden, getesteten Code zerstören. Stattdessen: **gezieltes Härten** an konkret identifizierten Schwachstellen aus dem Audit.

## Ziele

1. Zwei echte Korrektheits-Bugs beheben (Datenvalidierung).
2. Datensicherheit beim Import/Export erhöhen und absichern (Tests).
3. Accessibility auf professionelles Niveau heben (Focus-Management, Tastaturbedienung, korrekte ARIA-Rollen).
4. Technische Schuld reduzieren (Duplikation, fehlende Lade-Zustände, Re-Render-Risiken, TypeScript-Strenge).

## Nicht-Ziele (YAGNI)

- Kein Framework-Wechsel, keine Backend-Einführung, kein Routing-Umbau.
- Keine neuen Features.
- Keine Komponenten-Bibliothek von Grund auf neu — die 15 vorhandenen Primitives bleiben.
- Keine Virtualisierung von Listen (Datenmengen sind klein: ein Coach, dutzende Spieler/Sessions).

---

## Phase 1 — Korrektheit & Datensicherheit

**Risiko zuerst.** Diese Punkte betreffen Datenintegrität.

### 1.1 `validateOrWarn` gibt unvalidierte Daten zurück
- **Datei:** `src/utils/validate.ts:9-18`
- **Problem:** Funktion parsed mit Zod, loggt bei Fehler, gibt aber immer das **originale** `data` zurück — nie `result.data`. Folge: Zod-`.default()`-Transforms (z. B. `PlayerSchema.skillRatings`) greifen nie; invalide Daten gelangen trotzdem in den Store.
- **Fix:** Bei Erfolg `result.data` zurückgeben (inkl. angewandter Defaults). Bei Fehler: bisheriges nicht-werfendes Verhalten beibehalten (Warnung loggen + Original-`data` als Fallback zurückgeben), damit kein Aufrufer bricht. Nur der Erfolgspfad wird korrigiert.
- **Test:** Default-Anwendung + Fehlerpfad.

### 1.2 Unvollständige Import-Validierung
- **Datei:** `src/utils/storage.ts:23-34` (`ARRAY_SCHEMAS`), Importpfad `storage.ts:121-190`
- **Problem:** `teams`, `drillTemplates`, `sessionTemplates`, `favorites` fehlen in der Schema-Map → werden beim Import **unvalidiert** nach localStorage geschrieben. Eine manipulierte/kaputte Backup-Datei kann beliebig geformte Objekte injizieren.
- **Fix:** Schemas für alle persistierten Arrays ergänzen (`favorites` als `z.array(z.string())`). Import re-hydriert den laufenden Zustand-Store (nicht nur localStorage), damit UI und Speicher nicht divergieren.
- **Test:** valide / kaputte / partielle / leere Backups.

### 1.3 `partialize` auf Persist
- **Datei:** `src/store/useAppStore.ts:47-49`
- **Problem:** Gesamter State wird persistiert. Heute ok (Funktionen fallen bei JSON.stringify weg), aber künftiger transienter/UI-State würde nach localStorage lecken.
- **Fix:** Explizite Allow-List der Daten-Arrays in `partialize`.
- **Test:** persistiertes Objekt enthält nur erwartete Keys.

### 1.4 Import/Export-Tests
- **Datei:** `tests/utils/storage.test.ts` (aktuell nur `getStorageUsage`)
- **Fix:** Test-Suite für `importStoreData`/`exportStoreData` über alle obigen Fälle inkl. Quota-Fehler (gemockt).

**Phase-1-Abnahme:** Alle neuen + bestehenden Tests grün; Build grün.

---

## Phase 2 — Accessibility & Interaktion

### 2.1 Focus-Management in Dialogen
- **Dateien:** `src/components/ui/Modal.tsx`, `src/components/ui/ConfirmDialog.tsx`
- **Problem:** `role="dialog"`/`aria-modal`/Esc vorhanden, aber kein Focus-Trap, kein Autofokus beim Öffnen, keine Focus-Wiederherstellung beim Schließen. Tab entkommt in den Hintergrund.
- **Fix:** Beim Öffnen Fokus in den Dialog (erstes fokussierbares Element oder Dialog-Container), Tab/Shift-Tab innerhalb des Dialogs zyklisch fangen, beim Schließen Fokus auf das auslösende Element zurück. Implementierung als wiederverwendbarer Hook (`useFocusTrap`), den beide Dialoge nutzen.
- **Test:** Fokus-Wanderung (Testing Library / user-event).

### 2.2 `Tabs` korrekte ARIA + Tastatur
- **Datei:** `src/components/ui/Tabs.tsx:33`
- **Problem:** `aria-pressed` auf Buttons statt `role="tablist"`/`role="tab"`/`aria-selected`; keine Pfeiltasten-Navigation.
- **Fix:** Korrekte Tab-Rollen, roving `tabindex`, Pfeiltasten (←/→, Home/End).
- **Test:** Rollen + Tastatur.

### 2.3 `StarRating` Tastatur + i18n
- **Datei:** `src/components/ui/StarRating.tsx:38`
- **Problem:** Nur Maus bedienbar; `aria-label` hartkodiert deutsch ("Sterne").
- **Fix:** Pfeiltasten/Zahlen ändern den Wert; `aria-label` über i18n. Als `radiogroup` mit `radio`-Sternen modellieren.
- **Test:** Tastatur + Label aus i18n.

### 2.4 `QuickActionFAB`-Menü
- **Datei:** `src/components/QuickActionFAB.tsx:207-216`
- **Problem:** `role="menu"` vorhanden, aber keine Pfeiltasten-Navigation, schließt nur per Outside-Click (kein Esc).
- **Fix:** Pfeiltasten zwischen Menüpunkten, Esc schließt, Fokus-Rückgabe auf den FAB-Button.
- **Test:** Tastaturfluss.

**Phase-2-Abnahme:** A11y-Tests grün; manuelle Tastatur-Stichprobe; Build grün.

---

## Phase 3 — Design-System & Performance-Polish

### 3.1 `<Avatar>`-Komponente
- **Problem:** Avatar-Kreis (Initiale + `avatarColor ?? hex` + Größe) ist ~9× dupliziert (HomePage, SessionBuilder, TeamForm, TeamList, PlayerList, PlayerDetail, QuickActionFAB, MatchPlanEditor, TrainingPlanEditor) mit **inkonsistentem** Fallback (`#6366f1` vs. `#00e676`).
- **Fix:** Eine `<Avatar>`-UI-Komponente (Props: name/initial, color?, size). Fallback-Farbe als Token. Alle Aufrufstellen umstellen.
- **Test:** Render-Smoke + Fallback.

### 3.2 Lade-Zustände für async Daten
- **Dateien:** `src/features/train/TrainMode.tsx:117`, `src/features/plan/MatchPlanEditor.tsx:26`
- **Problem:** Async Drill-/Template-/Strategie-Loads (dynamische Imports) rendern währenddessen nichts → Liste blitzt leer auf.
- **Fix:** Skeleton/Spinner bis `loadDrills()`/Templates aufgelöst sind.

### 3.3 Konva-Board Re-Render
- **Dateien:** `src/features/board/components/AnnotationLayer.tsx:15`, `BoardCanvas.tsx:196-199`
- **Problem:** `AnnotationLayer` nicht memoized; Move-Handler als frische Closures pro Render → Ruckeln beim Zeichnen vieler Annotationen.
- **Fix:** `React.memo` für den Layer, `useCallback` für Move-Handler.

### 3.4 `noUncheckedIndexedAccess`
- **Datei:** `tsconfig.json`
- **Problem:** Aus; latente undefined-Zugriffe (z. B. `templates[templates.length-1].id`).
- **Fix:** Aktivieren, Compiler-Fallout sauber beheben (kein `!`-Spam, echte Guards).

**Phase-3-Abnahme:** Build + Typecheck + Tests grün; visuelle Stichprobe der betroffenen Views.

---

## Architektur-Hinweise

- **Datenzugriff:** Kein neuer Repository-Layer (Overkill für die Größe). Aber `getState()`-Direktaufrufe in Event-Handlern (z. B. `TrainMode.tsx:126,380`) im Zuge der Arbeit dort belassen, wo sie reines Read-on-Click sind — kein erzwungener Umbau.
- **Reuse:** Focus-Trap als Hook, Avatar als Komponente, Validierungslogik zentral — reduziert Duplikation ohne neue Abstraktionsebenen.

## Risiken & Rollback

- Persistenz-Änderungen (`partialize`, Import-Rehydration) sind die heikelsten Punkte → vor Phase-1-Merge manueller Export/Import-Durchlauf gegen echte Daten.
- Bei jeder Phase: bestehende Tests sind das Sicherheitsnetz; rote Tests blockieren den Fortschritt.

## Empfohlene spätere Ausbauschritte (out of scope)

- Listen-Virtualisierung, falls Datenmengen wachsen.
- Konsolidierung der zwei Error-Boundary-Klassen.
- Erweiterung der Design-Tokens um Spacing/Radius/Shadow.
- Integrations-Tests für komplette Flows (TrainMode, SessionBuilder).
