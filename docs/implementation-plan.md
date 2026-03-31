# KickerCoach App – Master-Implementierungsplan

**Datum:** 31.03.2026
**Basis:** Staff Engineer Audit vom 31.03.2026
**Autor-Rolle:** Staff Product Engineer, Technical Program Architect, Delivery Lead, UX-Stratege, Domaenenmodellierer, Frontend-Architekt

---

## 1. Strategische Gesamteinordnung

### Diagnose

Die KickerCoach App hat in kurzer Zeit beeindruckend viele Features akkumuliert. Das Problem ist nicht Quantitaet, sondern **fehlende Kohaerenz**: 7 Feature-Bereiche existieren als isolierte Inseln. Es gibt keinen durchgaengigen Coaching-Workflow, der sie verbindet.

Die App ist derzeit eine **Feature-Sammlung rund um Kickern**. Sie muss ein **Coaching-System fuer Spielerentwicklung** werden.

### Die drei Schichten des Problems

```
┌─────────────────────────────────────────────────────┐
│  SCHICHT 1: FUNDAMENT (technisch)                   │
│  - Domaenenmodell divergiert (Model vs. Store)      │
│  - Monolithischer Store (30+ Actions, 1 Datei)      │
│  - Keine referentielle Integritaet                  │
│  - Session-Modell ist de facto tot (6 vs. 10 Felder)│
│  - Barrel-Exports veraltet                          │
└─────────────────────────────────────────────────────┘
         ↓ blockiert
┌─────────────────────────────────────────────────────┐
│  SCHICHT 2: PRODUKTKERN (fachlich)                  │
│  - Kein Coaching-Zyklus als roter Faden             │
│  - Techniken nicht als Domaenenobjekte modelliert   │
│  - Sessions ohne Ergebnisse (nur Drill-IDs)         │
│  - Teams existieren, werden nirgends genutzt        │
│  - Goals ohne messbaren Fortschritt                 │
└─────────────────────────────────────────────────────┘
         ↓ blockiert
┌─────────────────────────────────────────────────────┐
│  SCHICHT 3: NUTZERERLEBNIS (UX)                     │
│  - 7 gleichrangige Tabs ohne Hierarchie             │
│  - Kein spielerzentrierter Einstieg                 │
│  - Dashboard ist Feature-Werbung, kein Coaching-Hub │
│  - Mobile am Tisch nicht nutzbar                    │
│  - Kein Quick-Access fuer Coaching-Notizen          │
└─────────────────────────────────────────────────────┘
```

### Strategische Reihenfolge

**Fundament zuerst, dann Fachlichkeit, dann UX.**

Warum? Weil jede UX-Verbesserung auf einem wackeligen Domaenenmodell gebaut wird und spaeter migriert werden muss. Und jede fachliche Erweiterung auf divergierenden Typen aufbaut und Inkonsistenzen multipliziert.

### Groesste Hebel (Impact/Effort)

| Rang | Hebel | Impact | Effort | Warum zuerst |
|------|-------|--------|--------|-------------|
| 1 | Domaenenmodell als Single Source of Truth | Sehr hoch | S-M | Beseitigt Divergenz, sichert alles Folgende ab |
| 2 | Cascading Delete + referentielle Integritaet | Hoch | S | Verhindert Ghost-Daten und UI-Fehler |
| 3 | Coaching-Zyklus als UX-Flow | Sehr hoch | M | Verwandelt Feature-Sammlung in Coaching-System |
| 4 | Technique als Domaenenobjekt | Hoch | M | Bruecke zwischen Cards, Drills und Spielern |
| 5 | Mobile Bottom-Navigation | Hoch | S | App wird am Tisch nutzbar |
| 6 | Dashboard als Coaching-Hub | Hoch | M | Ersetzt Feature-Werbung durch Arbeitsoberflaeche |
| 7 | Store in Slices aufteilen | Mittel | M | Wartbarkeit bei wachsender Codebase |
| 8 | DrillResult in Sessions | Hoch | M | Sessions werden auswertbar |
| 9 | URL-basiertes Sub-Routing | Mittel | M | Deep-Linking, Browser-History, Teilbarkeit |
| 10 | Session-Retrospektive | Hoch | S | Strukturierte Nachbereitung statt Freitext |

### Voraussetzungskette

```
Domaenenmodell bereinigen (M-01..M-06)
    ├─→ Technique einfuehren (M-07)
    │       └─→ Drill-Bibliothek professionalisieren (M-18)
    │       └─→ Spieler-Technik-Zuordnung (M-19)
    ├─→ Cascading Delete (M-04)
    │       └─→ Team-Integration in Workflows (M-22)
    ├─→ Session-Modell synchronisieren (M-02)
    │       └─→ DrillResult einfuehren (M-08)
    │       └─→ Session-Retrospektive (M-09)
    ├─→ Store in Slices (M-13)
    │       └─→ UI-State vs. Data-State trennen (M-14)
    └─→ Mobile Navigation (M-10)
            └─→ Dashboard als Coaching-Hub (M-11)
            └─→ Quick-Actions (M-12)
```

### Quick Wins vs. Strukturelle Umbauten

**Quick Wins** (hoher Nutzen, S-Aufwand, sofort machbar):
- Barrel-Export vervollstaendigen
- `isFavorite` zum Selektor machen
- Cascading Delete implementieren
- Drill-Modellfelder in UI anzeigen
- Session-Retrospektive (3 Freitext-Felder)
- Print-CSS verfeinern
- EmptyStates mit kontextbezogenen CTAs
- Globale Quick-Note ueber FAB
- Bottom-Nav auf Mobile
- `measurableGoal` in Drill-UI anzeigen

**Strukturelle Umbauten** (hoher Aufwand, aber zukunftsentscheidend):
- Domaenenmodell als einzige Quelle etablieren
- Store in Slices aufteilen
- Technique als eigenes Domaenenobjekt
- DrillResult-System in Sessions
- URL-basiertes Sub-Routing
- Dashboard-Redesign zum Coaching-Hub
- Coaching-Zyklus-Flow (Spieler→Ziel→Training→Auswertung)
- Match von MatchPlan trennen
- Domain-Komponenten einfuehren (PlayerCard, DrillCard, etc.)
- Mobile-First Layout-Redesign

---

## 2. Groesste Hebel und sinnvollste Reihenfolge

### Was muss vor allem anderen stabilisiert werden?

1. **Domaenenmodell**: Session.ts hat 6 Felder, Store nutzt 10. SessionTemplate existiert doppelt. Player wird im Store redefiniert. → Alles in `domain/models/` als Single Source of Truth.
2. **Referentielle Integritaet**: Spieler loeschen hinterlaesst verwaiste Daten. → Cascading Delete.
3. **Barrel-Exports**: `domain/models/index.ts` exportiert nur 4 von 11 Modellen. → Alle exportieren.

### Was sollte zuerst fachlich modelliert werden?

1. **Technique**: Die Bruecke zwischen Coach Cards (Content), Drills (Training) und Player Skills (Bewertung). Ohne Technique bleiben diese drei Welten getrennt.
2. **DrillResult**: Sessions sind aktuell nur Drill-Listen. Ohne Ergebnisse gibt es keine Auswertung.
3. **SessionRetrospective**: Strukturierte Nachbereitung ist der einfachste Einstieg in den Coaching-Zyklus.

### Welche UX-Themen sind zentral?

1. **Navigation**: 7 Tabs → 4-5 mit Bottom-Nav auf Mobile
2. **Dashboard**: Feature-Karten → Coaching-Hub mit heutiger Session, offenen Zielen, letzten Notizen
3. **Quick-Actions**: Globaler FAB fuer Notiz/Session/Bewertung
4. **Spielerzentrierter Einstieg**: "Training fuer Spieler X" statt "Drill auswaehlen, dann Spieler zuweisen"

### Was sollte bewusst erst spaeter folgen?

- Analytics-Ausbau (erst wenn DrillResults existieren)
- KI-Empfehlungen (erst wenn Technique + PlayerTechnique existieren)
- Cloud-Sync (erst wenn Datenmodell stabil ist)
- Video/Media (erst wenn Grundfunktionen sitzen)
- Multi-User / Rollen (erst wenn Cloud existiert)
- Turnierverwaltung (wahrscheinlich nie)
- Gamification (bewusst nicht)

---

## 3. Vollstaendiger Implementierungsrasterplan

### Legende

- **ID**: M-XX (Massnahme)
- **Cluster**: C1-C7 (siehe Abschnitt 4)
- **Prioritaet**: P0 (kritisch), P1 (sehr wichtig), P2 (wichtig), P3 (spaeter)
- **Aufwand**: S (1-3h), M (4-8h), L (1-2 Tage), XL (3-5 Tage)

---

### M-01: Session-Modell synchronisieren

- **Cluster**: C1 – Fundament
- **Handlungsfeld**: Domaenenmodell
- **Problem**: `domain/models/Session.ts` definiert 6 Felder (id, name, date, drillIds, notes, totalDuration). Der Store nutzt 10 Felder (+ playerIds, focusAreas, rating, mood). Das Modell ist de facto tot – alle Components importieren aus dem Store.
- **Zielbild**: Ein einziges Session-Interface in `domain/models/Session.ts` mit allen 10+ Feldern. Store importiert nur.
- **Massnahme**: Session.ts aktualisieren mit: playerIds, focusAreas, rating?, mood?, createdAt. SessionSchema in schemas/ synchronisieren. Store-Typ entfernen, aus domain importieren.
- **Prioritaet**: P0
- **Aufwand**: S
- **Abhaengigkeiten**: Keine
- **Deliverable**: `domain/models/Session.ts` ist die einzige Session-Definition. Store importiert daraus.
- **Nutzen**: Eliminiert Typ-Divergenz, verhindert kuenftige Inkonsistenzen.
- **Risiko**: Bestehende Components muessen ggf. Imports anpassen. Migration bestehender localStorage-Daten pruefen.

---

### M-02: SessionTemplate-Divergenz aufloesen

- **Cluster**: C1 – Fundament
- **Handlungsfeld**: Domaenenmodell
- **Problem**: SessionTemplate existiert zweimal: In `domain/models/TrainingPlan.ts` (name, drillIds, focusAreas, estimatedDuration, ohne id) und in `store/useAppStore.ts` (id, name, drillIds, focusAreas, ohne estimatedDuration). Zwei inkompatible Definitionen desselben Konzepts.
- **Zielbild**: Ein einziges SessionTemplate-Interface mit allen Feldern (id, name, drillIds, focusAreas, estimatedDuration).
- **Massnahme**: SessionTemplate in domain/models/ vereinheitlichen. Store-Version entfernen. TrainingPlan.ts SessionTemplate um id erweitern. Schema aktualisieren.
- **Prioritaet**: P0
- **Aufwand**: S
- **Abhaengigkeiten**: Keine
- **Deliverable**: Einzige SessionTemplate-Definition in domain/models/.
- **Nutzen**: Konsistenz, keine Verwechslung mehr.
- **Risiko**: Bestehende SessionTemplates im localStorage haben evtl. kein id-Feld → Migration.

---

### M-03: Player-Definition konsolidieren

- **Cluster**: C1 – Fundament
- **Handlungsfeld**: Domaenenmodell
- **Problem**: Player wird sowohl in `domain/models/Player.ts` als auch implizit im Store typisiert. Aktuell identisch, aber ein Wartungsproblem.
- **Zielbild**: Store importiert Player ausschliesslich aus domain/models/Player.ts. Keine Re-Definition.
- **Massnahme**: Store-Typ-Referenzen auf domain/models/Player.ts zeigen lassen. Explizite Import-Pruefung.
- **Prioritaet**: P0
- **Aufwand**: S
- **Abhaengigkeiten**: Keine
- **Deliverable**: Player-Typ kommt nur aus einer Quelle.
- **Nutzen**: Verhindert Drift bei kuenftigen Player-Erweiterungen.
- **Risiko**: Gering.

---

### M-04: Barrel-Export vervollstaendigen

- **Cluster**: C1 – Fundament
- **Handlungsfeld**: Domaenenmodell
- **Problem**: `domain/models/index.ts` exportiert nur CoachCard, Drill, MatchPlan, TacticalBoard. Es fehlen: Player, Goal, Evaluation, CoachingNote, TrainingPlan, Team, Session.
- **Zielbild**: Alle Modelle ueber Barrel-Export verfuegbar.
- **Massnahme**: `domain/models/index.ts` um alle fehlenden Exports erweitern. Analog `domain/schemas/index.ts` pruefen.
- **Prioritaet**: P0
- **Aufwand**: S
- **Abhaengigkeiten**: Keine
- **Deliverable**: Vollstaendiger Barrel-Export beider Verzeichnisse.
- **Nutzen**: Konsistente Imports im gesamten Projekt.
- **Risiko**: Naming-Konflikte pruefen (z.B. Team vs. TacticalTeam).

---

### M-05: Cascading Delete implementieren

- **Cluster**: C1 – Fundament
- **Handlungsfeld**: State-Architektur / Datenintegritaet
- **Problem**: `deletePlayer` entfernt nur aus `players[]`. Verwaiste Goals, Evaluations, CoachingNotes, Team-Referenzen, Session-playerIds bleiben zurueck. Fuehrt zu Ghost-Daten und potentiellen UI-Fehlern (z.B. "Spieler undefined" in Listen).
- **Zielbild**: Loeschen eines Spielers bereinigt alle Referenzen konsistent.
- **Massnahme**: `deletePlayer` Action erweitern: goals.filter, evaluations.filter, coachingNotes.filter, teams.filter (wo playerIds.includes), sessions.map (playerIds.filter). Analog fuer deleteDrill (Templates, Sessions), deleteSession (Evaluations, Notes), deleteTeam.
- **Prioritaet**: P0
- **Aufwand**: S
- **Abhaengigkeiten**: Keine
- **Deliverable**: Alle Delete-Actions bereinigen referenzierte Daten.
- **Nutzen**: Keine Ghost-Daten, stabile UI.
- **Risiko**: Unbeabsichtigtes Loeschen. → ConfirmDialog bereits vorhanden, gut.

---

### M-06: isFavorite als Selektor statt State-Action

- **Cluster**: C1 – Fundament
- **Handlungsfeld**: State-Architektur
- **Problem**: `isFavorite` ist als Action im Store implementiert (Zugriff auf State innerhalb einer Action). Semantisch ist es ein Selektor/Ableitung, keine Mutation.
- **Zielbild**: `isFavorite` als standalone Selektor-Funktion ausserhalb des Store-Objekts.
- **Massnahme**: `isFavorite` aus Actions entfernen. Als `export const selectIsFavorite = (id: string) => useAppStore((s) => s.favorites.includes(id))` oder als Hook implementieren.
- **Prioritaet**: P1
- **Aufwand**: S
- **Abhaengigkeiten**: Keine
- **Deliverable**: Saubere Trennung von Mutations und Selektoren.
- **Nutzen**: Korrekte Store-Architektur, bessere Testbarkeit.
- **Risiko**: Alle Aufrufe von `isFavorite` muessen angepasst werden.

---

### M-07: Technique als Domaenenobjekt einfuehren

- **Cluster**: C4 – Domaene und Datenmodell
- **Handlungsfeld**: Fachliche Modellierung
- **Problem**: Techniken (Pin-Shot, Pull-Shot, Brush-Pass, etc.) existieren nur als Content in Coach Cards und als Freitext in `Drill.focusSkill`. Es gibt keine strukturierte Verbindung zwischen einer Technik, den Drills die sie trainieren, den Cards die sie erklaeren, und der Faehigkeit eines Spielers diese Technik auszufuehren.
- **Zielbild**: `Technique` als eigenes Domaenenobjekt mit `id, name, category, difficulty, rodPositions[], description, measurableGoal?, relatedDrillIds[], relatedCardIds[], tags[]`.
- **Massnahme**: 1) Interface `Technique` in domain/models/ erstellen. 2) Zod-Schema erstellen. 3) Initiale Technik-Daten aus Coach Cards extrahieren (~30 Techniken). 4) Store um `techniques[]` erweitern. 5) Drill.focusSkill optional durch `techniqueIds[]` ergaenzen/ersetzen.
- **Prioritaet**: P1
- **Aufwand**: L
- **Abhaengigkeiten**: M-01, M-04 (Barrel-Export)
- **Deliverable**: Technique-Modell, Schema, Default-Daten, Store-Integration.
- **Nutzen**: Bruecke zwischen Learn, Train und Players. Ermoeglicht spaeter: "Welche Drills trainieren Pin-Shot?", "Kann Spieler X den Pull-Shot?", "Empfohlene Uebungen fuer Schwaechen".
- **Risiko**: Daten-Extraktion aus Coach Cards erfordert manuelle Zuordnung. Backward-Compatibility mit bestehenden Drills (focusSkill als Freitext bleibt uebergangsweise).

---

### M-08: DrillResult in Sessions einfuehren

- **Cluster**: C4 – Domaene und Datenmodell
- **Handlungsfeld**: Fachliche Modellierung
- **Problem**: Eine Session speichert nur `drillIds[]` – welche Drills eingeplant waren. Es gibt keine Information darueber, wie die Drills liefen (abgeschlossen? Trefferquote? Wiederholungen? Notizen?). Ohne Ergebnisse ist jede Session-Auswertung unmoeglich.
- **Zielbild**: `DrillResult { drillId, completed, blocksCompleted, successRate?, repetitions?, notes? }` als Teil der Session.
- **Massnahme**: 1) DrillResult Interface in domain/models/ erstellen. 2) Session um `drillResults: DrillResult[]` erweitern (parallel zu drillIds fuer Migration). 3) Schema aktualisieren. 4) Timer/SessionBuilder anpassen: nach Drill-Abschluss Ergebnis erfassen. 5) Journal-Ansicht um Ergebnisse erweitern.
- **Prioritaet**: P1
- **Aufwand**: M
- **Abhaengigkeiten**: M-01 (Session-Modell synchronisieren)
- **Deliverable**: Sessions mit Drill-Ergebnissen, UI fuer Ergebnis-Erfassung.
- **Nutzen**: Sessions werden auswertbar. Grundlage fuer Fortschritts-Tracking und Analytics.
- **Risiko**: Migration bestehender Sessions (drillIds → drillResults). Loesung: drillResults optional, drillIds bleibt als Fallback.

---

### M-09: Session-Retrospektive einfuehren

- **Cluster**: C2 – Produktkern
- **Handlungsfeld**: Coaching-Workflow
- **Problem**: Nach einer Session gibt es nur ein 1-5 Rating und optionale Freitext-Notizen. Keine strukturierte Reflexion ("Was lief gut?", "Was muss besser werden?", "Fokus naechstes Mal?").
- **Zielbild**: `SessionRetrospective { whatWentWell, whatToImprove, focusNextTime }` als Teil der Session. Retrospektive-Wizard nach jeder abgeschlossenen Session.
- **Massnahme**: 1) SessionRetrospective Interface erstellen. 2) Session um `retrospective?: SessionRetrospective` erweitern. 3) Retrospektive-UI nach Session-Abschluss (3 Textfelder + Speichern). 4) Journal-Ansicht um Retrospektive erweitern. 5) "Bewertung nachtragen" Button auf vergangenen Sessions.
- **Prioritaet**: P1
- **Aufwand**: S
- **Abhaengigkeiten**: M-01 (Session-Modell)
- **Deliverable**: Retrospektive-Flow nach Session, sichtbar im Journal.
- **Nutzen**: Strukturierte Nachbereitung. Coaching-Zyklus beginnt sich zu schliessen.
- **Risiko**: Gering. Einfache Erweiterung, keine Breaking Changes.

---

### M-10: Mobile Bottom-Navigation

- **Cluster**: C3 – Kern-UX
- **Handlungsfeld**: Navigation / Mobile Nutzung
- **Problem**: 7 gleichrangige Header-Tabs. Auf iPhone SE/Android passen sie nicht. Am Kickertisch (primaerer Einsatzort!) ist die App nicht bedienbar.
- **Zielbild**: Bottom-Navigation mit 4-5 Haupttabs: Home, Training, Spieler, Mehr. "Mehr" oeffnet Menue mit: Taktik, Matchplan, Learn, Analytics, Einstellungen. Desktop behalt optionale Top-Navigation.
- **Massnahme**: 1) BottomNav-Komponente erstellen. 2) Layout.tsx auf Breakpoint umstellen: < md → BottomNav, >= md → TopNav. 3) "Mehr"-Overlay/Sheet mit sekundaeren Links. 4) Active-State-Styling. 5) Safe-Area-Insets fuer iOS.
- **Prioritaet**: P1
- **Aufwand**: M
- **Abhaengigkeiten**: Keine (kann parallel laufen)
- **Deliverable**: Mobile-taugliche Navigation, Desktop-kompatibel.
- **Nutzen**: App wird am Tisch nutzbar. Primaerer Einsatzort wird bedienbar.
- **Risiko**: Breakpoint-Logik muss sauber sein. Keine Inhalte hinter "Mehr" verstecken, die Hauptfeatures sind.

---

### M-11: Dashboard als Coaching-Hub redesignen

- **Cluster**: C2 – Produktkern
- **Handlungsfeld**: UX / Produktkern
- **Problem**: Die aktuelle HomePage zeigt Feature-Karten ("Lerne Techniken", "Trainiere Drills", etc.) – das ist Onboarding/Marketing, keine Arbeitsoberflaeche. Ein Trainer braucht beim Oeffnen der App: Was steht heute an? Welche Ziele sind offen? Was war die letzte Beobachtung?
- **Zielbild**: Coaching-Hub mit: Naechste/heutige Session, offene Spieler-Ziele, letzte 3-5 Coaching-Notizen, Schnellzugriff auf haeufige Spieler, Quick-Action-Buttons, Session-Streak/Trainingsfrequenz.
- **Massnahme**: 1) HomePage.tsx komplett neu gestalten. 2) Store-Selektoren fuer: naechste Session, offene Ziele, letzte Notizen. 3) Quick-Action-Leiste: "Notiz", "Training starten", "Bewertung". 4) Onboarding-Zustand beibehalten fuer erstmalige Nutzer (wenn keine Spieler/Sessions existieren).
- **Prioritaet**: P1
- **Aufwand**: M
- **Abhaengigkeiten**: M-10 (Navigation, damit Dashboard als "Home" Tab erreichbar)
- **Deliverable**: Coaching-Hub statt Feature-Werbung.
- **Nutzen**: App oeffnen = sofort arbeitsfaehig. Coaching-Zyklus beginnt auf dem Dashboard.
- **Risiko**: Muss mit wenig Daten gut aussehen (progressive Komplexitaet). Leere Zustaende muessen sinnvoll sein.

---

### M-12: Globale Quick-Actions (FAB)

- **Cluster**: C3 – Kern-UX
- **Handlungsfeld**: UX / Effizienz
- **Problem**: Coaching-Notizen sind nur ueber Spieler → Detail → QuickNote erreichbar (zu viele Taps). Session starten erfordert Train → Session erstellen. Am Tisch will ein Trainer maximal 2 Taps fuer die haeufigsten Aktionen.
- **Zielbild**: Floating Action Button (FAB) auf Mobile, der 3 Quick-Actions bietet: Notiz erfassen (mit optionalem Spieler-Bezug), Session starten, Bewertung erstellen.
- **Massnahme**: 1) FAB-Komponente erstellen (expandable, 3 Sub-Actions). 2) Quick-Note-Sheet: Textfeld + optionaler Spieler-Selector + Kategorie. 3) Quick-Session: Letztes Template oder leere Session starten. 4) Quick-Eval: Spieler waehlen → Bewertungsformular.
- **Prioritaet**: P2
- **Aufwand**: M
- **Abhaengigkeiten**: M-10 (Bottom-Nav, FAB positioniert sich darueber)
- **Deliverable**: FAB mit 3 Quick-Actions, auf allen Screens verfuegbar.
- **Nutzen**: Kernaktionen in 2 Taps. Coaching-Notizen werden tatsaechlich erfasst.
- **Risiko**: FAB darf Inhalte nicht verdecken. Z-Index und Scroll-Verhalten beachten.

---

### M-13: Store in Slices aufteilen

- **Cluster**: C5 – Technische Professionalisierung
- **Handlungsfeld**: State-Architektur
- **Problem**: Ein monolithischer Store mit 13 Daten-Arrays und 30+ Actions in einer Datei (~400 Zeilen). Bei weiterem Wachstum wird die Wartbarkeit zum Problem. Actions sind nicht nach Domaene gruppiert.
- **Zielbild**: Zustand Slices: `createPlayerSlice`, `createSessionSlice`, `createDrillSlice`, `createCoachingSlice`, `createMatchSlice`, `createBoardSlice`. Compose via `useAppStore = create(...)`. Jeder Slice hat eigene Actions und Selektoren.
- **Massnahme**: 1) Slice-Dateien anlegen unter store/slices/. 2) Actions pro Domaene umziehen. 3) Typen pro Slice definieren. 4) Cascading-Delete als slice-uebergreifende Action (oder in einem "integrity" Modul). 5) useAppStore bleibt als einziger Consumer-Export. 6) Persist-Config anpassen.
- **Prioritaet**: P2
- **Aufwand**: L
- **Abhaengigkeiten**: M-01..M-05 (Domaenenmodell bereinigt, bevor Slices gebaut werden)
- **Deliverable**: Store aufgeteilt in 6+ Slices, weiterhin ueber useAppStore nutzbar.
- **Nutzen**: Wartbarkeit, Testbarkeit, klare Verantwortlichkeiten pro Domaene.
- **Risiko**: Persist-Migration muss funktionieren. Reihenfolge der Slice-Komposition beachten. Bestehende Selektoren muessen weiter funktionieren.

---

### M-14: UI-State von Data-State trennen

- **Cluster**: C5 – Technische Professionalisierung
- **Handlungsfeld**: State-Architektur
- **Problem**: Alles wird im persisted Store gespeichert, auch transiente Zustaende wie Suchbegriffe, aktive Tabs, Filter-Einstellungen. Das blaehst den localStorage auf und fuehrt zu unerwarteten "sticky" States nach App-Neustart.
- **Zielbild**: Separater transienter Store (oder React Context) fuer UI-State. Persisted Store nur fuer Domaendaten.
- **Massnahme**: 1) `useUIStore` fuer Filter, Suchbegriffe, aktive Views, Drafts. 2) Nicht persistiert. 3) Bestehende useState-Logik in Feature-Roots pruefen und ggf. zentralisieren.
- **Prioritaet**: P2
- **Aufwand**: M
- **Abhaengigkeiten**: M-13 (Store Slices, damit die Trennung sauber ist)
- **Deliverable**: Separater UI-Store, persisted Store nur fuer Daten.
- **Nutzen**: Schnellerer App-Start, kein "Sticky State"-Problem, saubere Trennung.
- **Risiko**: Gering, aber viele kleine Refactorings in Feature-Komponenten.

---

### M-15: URL-basiertes Sub-Routing

- **Cluster**: C5 – Technische Professionalisierung
- **Handlungsfeld**: Navigation / Architektur
- **Problem**: Sub-Views innerhalb von Features sind per lokalem `useState<View>` gesteuert (z.B. in PlayersMode: "list" | "detail" | "form" | "team-form"). Kein Deep-Linking, kein Browser-History, kein Teilen von URLs.
- **Zielbild**: Echte Routes fuer wichtige Sub-Views: `/players/:id`, `/players/new`, `/players/:id/goals`, `/train/session/:id`, `/train/timer`, `/plan/:id`, `/board/:sceneId`.
- **Massnahme**: 1) React Router Nested Routes einrichten. 2) Feature-Module als Route-Layouts umbauen. 3) Lokale View-States durch useParams/useNavigate ersetzen. 4) Lazy Loading pro Sub-Route.
- **Prioritaet**: P2
- **Aufwand**: L
- **Abhaengigkeiten**: M-10 (Navigation-Redesign, damit Routes zur neuen Nav passen)
- **Deliverable**: Alle wichtigen Views per URL erreichbar.
- **Nutzen**: Deep-Linking, Browser Back/Forward, Teilbarkeit, bessere Code-Struktur.
- **Risiko**: Umfangreiches Refactoring aller Feature-Module. Schrittweise umsetzbar (ein Feature nach dem anderen).

---

### M-16: Domain-Komponenten einfuehren

- **Cluster**: C5 – Technische Professionalisierung
- **Handlungsfeld**: Komponentenbibliothek
- **Problem**: Jedes Feature baut eigene Card-Layouts fuer Spieler, Drills, Sessions, Goals, Notes. Es gibt keine wiederverwendbaren Domain-Komponenten. SkillRadar ist in `/features/players/` obwohl es in Analytics wiederverwendet wird.
- **Zielbild**: `components/domain/` mit: PlayerCard, DrillCard, SessionCard, GoalCard, NoteCard, SkillRadar. Wiederverwendbar ueber Feature-Grenzen.
- **Massnahme**: 1) Verzeichnis `components/domain/` anlegen. 2) Bestehende Card-Layouts extrahieren und vereinheitlichen. 3) SkillRadar verschieben. 4) Props-Interfaces definieren. 5) Features auf Domain-Komponenten umstellen.
- **Prioritaet**: P2
- **Aufwand**: M
- **Abhaengigkeiten**: Keine (kann parallel laufen)
- **Deliverable**: 6+ Domain-Komponenten in components/domain/.
- **Nutzen**: Konsistentes Look-and-Feel ueber Features hinweg. Weniger Duplikation.
- **Risiko**: Gering. Schrittweise umsetzbar.

---

### M-17: Coaching-Zyklus als UX-Flow verdrahten

- **Cluster**: C2 – Produktkern
- **Handlungsfeld**: Produktkern / UX
- **Problem**: Die 7 Feature-Bereiche sind isolierte Inseln. Es gibt keinen durchgaengigen Workflow: Spieler beobachten → Schwaeche erkennen → Ziel setzen → Training planen → Ausfuehren → Auswerten → Anpassen. Jeder Schritt erfordert manuelles Navigieren in ein anderes Feature.
- **Zielbild**: Cross-Feature-Navigation: Spieler-Detail hat "Training starten" (→ SessionBuilder mit Spieler vorgewaehlt). Goal hat "Passende Drills anzeigen" (→ Drill-Bibliothek gefiltert nach Kategorie). Session-Journal hat "Bewertung nachtragen". Dashboard zeigt den Zyklus-Status.
- **Massnahme**: 1) Spieler-Detail: "Training starten" Button → SessionBuilder mit playerIds=[playerId]. 2) GoalList: "Passende Drills" → DrillSelector gefiltert nach goal.category. 3) Journal: "Bewertung nachtragen" → EvaluationForm mit sessionId. 4) Dashboard: Zyklus-Visualisierung (optional).
- **Prioritaet**: P1
- **Aufwand**: M
- **Abhaengigkeiten**: M-01 (Session-Modell), M-15 (URL-Routing fuer Deep-Links, aber initial auch mit Navigation-Callbacks machbar)
- **Deliverable**: Verknuepfungen zwischen Features, die den Coaching-Zyklus abbilden.
- **Nutzen**: Die App fuehlt sich wie ein Coaching-System an, nicht wie eine Feature-Sammlung.
- **Risiko**: Erfordert sorgfaeltiges UX-Design. Nicht zu viele Links, sondern die richtigen.

---

### M-18: Drill-Bibliothek professionalisieren

- **Cluster**: C2 – Produktkern
- **Handlungsfeld**: Uebungen / Drills
- **Problem**: Die Drill-Modellfelder `position`, `playerCount`, `prerequisites`, `variations`, `measurableGoal` existieren, werden aber im DrillSelector und DrillEditor nicht angezeigt. Drill-Empfehlungen basierend auf Spieler-Schwaechen sind nicht moeglich. Keine Phasen-Einteilung (Aufwaermen/Hauptteil/Cool-Down).
- **Zielbild**: Vollstaendige Drill-Ansicht mit allen Modellfeldern. Drill-Empfehlungen pro Spieler. Phasen-Tags. Technik-Verknuepfung.
- **Massnahme**: 1) DrillSelector: Filter um position, playerCount, phase erweitern. 2) DrillEditor: Alle Modellfelder in UI anzeigen/editierbar. 3) DrillCard (Domain-Komponente): Badges fuer Difficulty, Phase, PlayerCount. 4) "Empfohlene Drills fuer Spieler X" basierend auf schwachen Kategorien (Selektorfunktion).
- **Prioritaet**: P1
- **Aufwand**: M
- **Abhaengigkeiten**: M-07 (Technique, fuer Technik-Verknuepfung), M-16 (DrillCard)
- **Deliverable**: Professionelle Drill-Bibliothek mit Filtern, Details, Empfehlungen.
- **Nutzen**: Drills werden fachlich erschlossen statt nur aufgelistet.
- **Risiko**: Default-Drills muessen ggf. um fehlende Felder ergaenzt werden (position, phase, etc.).

---

### M-19: Spieler-Technik-Zuordnung (PlayerTechnique)

- **Cluster**: C4 – Domaene und Datenmodell
- **Handlungsfeld**: Fachliche Modellierung / Spielerentwicklung
- **Problem**: Ein Trainer denkt nicht "Ballkontrolle 3/5", sondern "Kann noch keinen sauberen Pin-Shot". Die 7 abstrakten Kategorien sind zu grob fuer echtes Coaching. Es gibt keine Verbindung zwischen einer konkreten Technik und dem Koennen eines Spielers.
- **Zielbild**: `PlayerTechnique { playerId, techniqueId, status: "not_started"|"learning"|"developing"|"proficient"|"mastered", currentSuccessRate?, lastPracticedAt?, notes? }`. Sichtbar im Spieler-Profil.
- **Massnahme**: 1) PlayerTechnique Interface und Schema. 2) Store um `playerTechniques[]` erweitern. 3) Spieler-Detail: "Techniken" Tab mit Status-Uebersicht. 4) Status-Aenderung per Tap (Statusuebergang). 5) Technik-Detail zeigt alle Spieler mit ihrem Status.
- **Prioritaet**: P2
- **Aufwand**: L
- **Abhaengigkeiten**: M-07 (Technique muss existieren)
- **Deliverable**: Spieler-Technik-Matrix, UI im Spieler-Profil.
- **Nutzen**: Coaching wird konkret: "Spieler X lernt gerade den Pin-Shot" statt "Torschuss 3/5".
- **Risiko**: Viele PlayerTechnique-Eintraege (30 Techniken × 20 Spieler = 600). Lazy-Init: Nur erstellen wenn Status geaendert wird, nicht fuer alle Kombinationen.

---

### M-20: Match von MatchPlan trennen

- **Cluster**: C4 – Domaene und Datenmodell
- **Handlungsfeld**: Fachliche Modellierung
- **Problem**: `MatchPlan` mischt Vorbereitung (Gegneranalyse, Gameplan, Strategien) und Ergebnis (Sets, Score, Result). Das sind verschiedene Aktivitaeten zu verschiedenen Zeitpunkten. Spaetere Trennung wird umso schwieriger, je mehr Daten existieren.
- **Zielbild**: `MatchPlan` bleibt als Vorbereitung (Analyse, Gameplan, Strategien). Neues `Match`-Modell fuer Ergebnis (opponent, date, sets, result, playerIds, observations, notes, planId?).
- **Massnahme**: 1) Match Interface in domain/models/ erstellen. 2) Schema erstellen. 3) Store um `matches[]` erweitern. 4) MatchPlan.sets, .result, .playerIds in Match migrieren. 5) Plan-Feature aufteilen: Planung (MatchPlanEditor) und Ergebnis (MatchResultEditor). 6) Migration fuer bestehende MatchPlans mit Sets.
- **Prioritaet**: P2
- **Aufwand**: L
- **Abhaengigkeiten**: M-01 (Modell-Bereinigung), M-05 (Cascading Delete fuer Match-Referenzen)
- **Deliverable**: Saubere Trennung MatchPlan (Planung) und Match (Ergebnis).
- **Nutzen**: Fachlich korrekte Modellierung. Ermoeglicht: Match-Historie, Win/Loss-Tracking, Gegner-Statistiken.
- **Risiko**: Migration bestehender MatchPlans. Loesung: MatchPlan behalt alte Felder als deprecated, Match wird parallel aufgebaut.

---

### M-21: Goal-Modell mit messbarem Fortschritt

- **Cluster**: C4 – Domaene und Datenmodell
- **Handlungsfeld**: Fachliche Modellierung / Fortschritt
- **Problem**: Goals haben nur `status: "active"|"achieved"|"paused"` – ein einfacher Toggle. Kein messbarer Fortschritt, kein Zielwert, kein aktueller Stand. "Ziel: Passspiel verbessern" hat keine Metrik.
- **Zielbild**: Goal erweitert um: `techniqueId?`, `targetValue?`, `currentValue?`, `status: "active"|"achieved"|"paused"|"abandoned"`. Fortschritt ist sichtbar und messbar.
- **Massnahme**: 1) Goal-Interface um Felder erweitern. 2) GoalForm: Technik-Bezug (optional), Zielwert (optional). 3) GoalList: Fortschrittsbalken (currentValue/targetValue). 4) "Achieved" automatisch vorschlagen wenn targetValue erreicht. 5) Schema + Migration.
- **Prioritaet**: P1
- **Aufwand**: M
- **Abhaengigkeiten**: M-07 (Technique, fuer techniqueId)
- **Deliverable**: Messbare Goals mit Fortschrittsanzeige.
- **Nutzen**: Coaching-Ziele werden greifbar und nachvollziehbar.
- **Risiko**: Nicht jedes Ziel ist quantifizierbar. targetValue bleibt optional.

---

### M-22: Team-Integration in Workflows

- **Cluster**: C2 – Produktkern
- **Handlungsfeld**: Teams / Doppeltraining
- **Problem**: Teams existieren als Modell (2 Spieler, Name, Notes), werden aber in keinem Workflow genutzt. Nicht in Sessions, nicht in Matches, nicht in Analysen. Das schafft falsche Erwartungen.
- **Zielbild**: Teams werden in Sessions, Matches und Analysen verwendbar. Doppeltraining als Session-Typ. Team-spezifische Ziele. Team-Statistiken in Analytics.
- **Massnahme**: 1) Session: `teamId?` optional. 2) Match: `teamId?` optional. 3) Goal: `teamId?` fuer Team-Ziele. 4) SessionBuilder: Team auswaehlen → beide Spieler automatisch zugewiesen. 5) Analytics: Team-Vergleich (Win/Loss, Sessions, Fortschritt). 6) Team erweitern: `roles?`, `strengths?`, `weaknesses?`, `isActive`.
- **Prioritaet**: P2
- **Aufwand**: L
- **Abhaengigkeiten**: M-05 (Cascading Delete), M-20 (Match-Modell), M-01 (Session-Modell)
- **Deliverable**: Teams als funktionaler Teil des Coaching-Systems.
- **Nutzen**: Doppeltraining wird abbildbar. Feature ist nicht mehr "tot".
- **Risiko**: Umfangreich. Schrittweise: Erst Team in Session, dann in Match, dann in Analytics.

---

### M-23: Wiederholungsbasierte Training Blocks

- **Cluster**: C2 – Produktkern
- **Handlungsfeld**: Trainingslogik
- **Problem**: Alle Trainings-Blocks sind zeitbasiert (`type: "work"|"rest"` mit `durationSeconds`). Kickertraining ist aber oft wiederholungsbasiert: "10x Pin-Shot rechts, dann 10x links". Es gibt keinen Block-Typ fuer Wiederholungen.
- **Zielbild**: `TrainingBlock { type: "timed"|"repetitions"|"rest", durationSeconds?, repetitions?, note }`. Timer zeigt bei Repetitions einen Zaehler statt Countdown.
- **Massnahme**: 1) TrainingBlock Interface um `type: "repetitions"` und `repetitions?: number` erweitern. 2) Schema aktualisieren. 3) Timer-Komponente: bei "repetitions" Zaehler-UI statt Countdown. 4) DrillEditor: Block-Typ-Auswahl. 5) Default-Drills ggf. ergaenzen.
- **Prioritaet**: P2
- **Aufwand**: M
- **Abhaengigkeiten**: M-01 (Drill-Modell)
- **Deliverable**: Wiederholungsbasierte Blocks in Drills und Timer.
- **Nutzen**: Realistische Trainingsabbildung. Pin-Shot-Training wird "10 Treffer" statt "60 Sekunden".
- **Risiko**: Timer-Logik muss fuer neuen Block-Typ funktionieren. useTimer Hook muss erweitert oder ein neuer useRepCounter Hook erstellt werden.

---

### M-24: CoachingNote mit Prioritaet und Aktionspunkten

- **Cluster**: C2 – Produktkern
- **Handlungsfeld**: Coaching / Beobachtung
- **Problem**: Coaching-Notizen sind unstrukturierte Freitexte mit 4 Kategorien. Keine Prioritaet, keine Aktionspunkte, keine Verbindung zu konkreten naechsten Schritten. Notizen versickern ohne Wirkung.
- **Zielbild**: CoachingNote erweitert um: `priority: "low"|"medium"|"high"`, `actionItems: string[]`, `matchId?` (statt matchPlanId). Notizen mit Prioritaet "high" erscheinen auf dem Dashboard.
- **Massnahme**: 1) CoachingNote Interface erweitern. 2) QuickNote-Formular: Priority-Toggle, Action-Items-Liste. 3) NotesFeed: Prioritaet-Badge, Action-Items anzeigen. 4) Dashboard: "Wichtige Notizen" (priority=high). 5) Schema + Migration.
- **Prioritaet**: P2
- **Aufwand**: M
- **Abhaengigkeiten**: M-11 (Dashboard fuer Anzeige), M-20 (Match-Modell fuer matchId)
- **Deliverable**: Strukturiertere Coaching-Notizen mit Prioritaet und Aktionspunkten.
- **Nutzen**: Notizen fuehren zu Handlungen. Wichtiges geht nicht unter.
- **Risiko**: Darf Notiz-Erfassung nicht verkomplizieren. Priority und ActionItems optional lassen.

---

### M-25: Drill Phase-Tags

- **Cluster**: C2 – Produktkern
- **Handlungsfeld**: Trainingslogik
- **Problem**: Eine Trainings-Session hat typischerweise Phasen: Aufwaermen, Technikblock, Spielform, Reflexion. Drills haben keine Phase-Zuordnung, der SessionBuilder kennt keine Phasenstruktur.
- **Zielbild**: `Drill.phase?: "warmup"|"technique"|"game"|"cooldown"`. SessionBuilder gruppiert Drills nach Phase. Drag-and-Drop innerhalb von Phasen (spaeter).
- **Massnahme**: 1) Drill Interface um `phase?` erweitern. 2) Schema aktualisieren. 3) Default-Drills um Phase taggen. 4) DrillSelector: Filter nach Phase. 5) SessionBuilder: Gruppen-Header pro Phase. 6) DrillEditor: Phase-Auswahl.
- **Prioritaet**: P2
- **Aufwand**: M
- **Abhaengigkeiten**: Keine
- **Deliverable**: Phasen-getaggte Drills, gruppierte Darstellung im SessionBuilder.
- **Nutzen**: Trainingsstruktur wird sichtbar. Sessions folgen einer paedagogischen Logik.
- **Risiko**: Default-Drills muessen manuell getaggt werden.

---

### M-26: Evaluation-Modell erweitern

- **Cluster**: C6 – Analyse und Auswertung
- **Handlungsfeld**: Fachliche Modellierung / Bewertung
- **Problem**: Evaluationen haben nur 7 abstrakte SkillRatings (Kategorien 1-5). Kein Bezug zu konkreten Techniken. Kein Typ (Session vs. Match vs. allgemein). Kein Gesamteindruck-Rating.
- **Zielbild**: Evaluation erweitert um: `type: "session"|"match"|"general"`, `matchId?`, `techniqueRatings?: TechniqueRating[]`, `overallRating?: number`.
- **Massnahme**: 1) Evaluation Interface erweitern. 2) TechniqueRating Interface: `{ techniqueId, rating, successRate?, comment? }`. 3) Evaluation-Formular um Typ und Technik-Bewertungen erweitern. 4) ProgressView: Technik-spezifischen Fortschritt anzeigen. 5) Schema + Migration.
- **Prioritaet**: P2
- **Aufwand**: L
- **Abhaengigkeiten**: M-07 (Technique), M-20 (Match-Modell fuer matchId)
- **Deliverable**: Reichhaltigere Evaluationen mit Technik-Bezug.
- **Nutzen**: Bewertungen werden konkreter. Fortschritt auf Technik-Ebene messbar.
- **Risiko**: Evaluation-Formular darf nicht zu komplex werden. Technik-Ratings optional lassen.

---

### M-27: Spielerzentrische Session-Erstellung

- **Cluster**: C3 – Kern-UX
- **Handlungsfeld**: UX / Coaching-Workflow
- **Problem**: Training starten erfordert: Train-Tab oeffnen → Session erstellen → Drills waehlen → Spieler zuweisen. Der Trainer denkt aber: "Ich will mit Spieler X an seiner Schwaeche arbeiten". Der Einstieg ist feature-zentriert statt spieler-zentriert.
- **Zielbild**: Von Spieler-Detail: "Training starten" → SessionBuilder oeffnet sich mit: Spieler vorausgewaehlt, Drills nach Spieler-Schwaechen vorgefiltert, "Empfohlene Drills" ganz oben.
- **Massnahme**: 1) Spieler-Detail: "Training starten" Button. 2) SessionBuilder: `initialPlayerId` Prop akzeptieren. 3) Drill-Empfehlungen basierend auf niedrigsten Skill-Kategorien. 4) "Empfohlen fuer [Spieler]" Sektion im DrillSelector.
- **Prioritaet**: P1
- **Aufwand**: M
- **Abhaengigkeiten**: M-17 (Cross-Feature-Navigation), M-07 (Technique fuer praezisere Empfehlungen)
- **Deliverable**: Spielerzentrierter Trainings-Einstieg.
- **Nutzen**: Coaching-Zyklus wird natuerlich: Spieler → Training → Auswertung.
- **Risiko**: Drill-Empfehlungslogik muss sinnvoll sein (nicht random). Basierend auf niedrigsten skillRatings-Kategorien als Startalgorithmus.

---

### M-28: Trainingsplan-Ausfuehrung

- **Cluster**: C2 – Produktkern
- **Handlungsfeld**: Trainingsplanung
- **Problem**: TrainingPlan existiert mit Wochen und SessionTemplates, aber es gibt keine "Trainingsplan ausfuehren" Funktion. Man kann Plaene erstellen, aber nicht systematisch abarbeiten. Kein Tracking welche Sessions des Plans bereits durchgefuehrt wurden.
- **Zielbild**: TrainingPlan-Detail zeigt Wochen/Sessions mit Status (geplant/durchgefuehrt/uebersprungen). "Session starten" aus dem Plan heraus erstellt eine reale Session mit planId-Referenz. Fortschrittsanzeige pro Plan.
- **Massnahme**: 1) Session um `planId?` erweitern. 2) TrainingPlan-Detail-Ansicht: Wochen-Grid mit Session-Status. 3) "Session starten" Button pro Template → SessionBuilder mit Drills aus Template. 4) Plan-Fortschritt: X von Y Sessions durchgefuehrt.
- **Prioritaet**: P2
- **Aufwand**: L
- **Abhaengigkeiten**: M-01 (Session-Modell), M-02 (SessionTemplate)
- **Deliverable**: Ausfuehrbare Trainingsplaene mit Fortschritts-Tracking.
- **Nutzen**: Trainingsplanung bekommt einen Sinn. Systematisches Training wird moeglich.
- **Risiko**: UX-Komplexitaet. Plan-Ausfuehrung darf sich nicht wie eine Zwangsjacke anfuehlen – Flexibilitaet behalten.

---

### M-29: Player-Modell erweitern

- **Cluster**: C4 – Domaene und Datenmodell
- **Handlungsfeld**: Fachliche Modellierung
- **Problem**: Player hat `preferredPosition: "offense"|"defense"|"both"`. Kicker hat aber 4 Stangen (Torwart, 2er, 5er, 3er), nicht 2 Rollen. Ausserdem fehlt: `isActive` (fuer archivierte Spieler), `preferredPositions` (Plural, Array statt Single).
- **Zielbild**: Player mit `preferredPositions: RodPosition[]` (Mehrfachauswahl), `isActive: boolean`. Position-Typ nutzt bestehenden RodPosition-Enum.
- **Massnahme**: 1) Player Interface: `preferredPosition` → `preferredPositions: RodPosition[]`, `isActive: boolean` hinzufuegen. 2) Schema aktualisieren. 3) PlayerForm anpassen: Multi-Select fuer Positionen, Active-Toggle. 4) PlayerList: Filter "Aktive/Alle". 5) Migration: `preferredPosition` → `preferredPositions: [oldValue === "both" ? alle 4 : mapping]`.
- **Prioritaet**: P2
- **Aufwand**: M
- **Abhaengigkeiten**: M-03 (Player-Konsolidierung)
- **Deliverable**: Praeziseres Player-Modell mit Stangen-Positionen und Archivierung.
- **Nutzen**: Fachlich korrekter. Archivierte Spieler bloehen Listen nicht auf.
- **Risiko**: Migration von String zu Array. Alle Stellen pruefen die `preferredPosition` nutzen.

---

### M-30: focusSkill strukturiert ersetzen

- **Cluster**: C4 – Domaene und Datenmodell
- **Handlungsfeld**: Datenqualitaet
- **Problem**: `Drill.focusSkill` ist ein Freitext-String. Drill-Kategorie-Matching passiert per Substring. Bei wachsendem Drill-Katalog bricht das.
- **Zielbild**: `Drill.focusSkill` wird durch `Drill.category` (bereits vorhanden) und `Drill.techniqueIds: string[]` (neu) ersetzt. focusSkill bleibt uebergangsweise fuer Abwaertskompatibilitaet.
- **Massnahme**: 1) Default-Drills: `category` konsistent setzen (einige haben es, andere nicht). 2) `techniqueIds[]` zu Drill hinzufuegen. 3) Filter-Logik auf category + techniqueIds umstellen. 4) focusSkill als deprecated markieren. 5) Migration: focusSkill-Werte in category/techniqueIds mappen.
- **Prioritaet**: P2
- **Aufwand**: M
- **Abhaengigkeiten**: M-07 (Technique muss existieren)
- **Deliverable**: Strukturierte Drill-Kategorisierung statt Freitext.
- **Nutzen**: Zuverlaessige Filter, Empfehlungen, Verknuepfungen.
- **Risiko**: Custom Drills haben beliebige focusSkill-Werte. Migration ist best-effort, Rest bleibt als Freitext-Fallback.

---

### M-31: Analytics mit echten Daten

- **Cluster**: C6 – Analyse und Auswertung
- **Handlungsfeld**: Analyse / Fortschritt
- **Problem**: Analytics-Dashboard existiert, zeigt aber nur aggregierte Counts und abstrakte Skill-Ratings. Keine Auswertung von DrillResults, keine Technik-spezifischen Trends, keine Match-Statistiken.
- **Zielbild**: Analytics basiert auf: DrillResults (Trefferquoten-Trends), TechniqueRatings (Fortschritt pro Technik), Match-Ergebnisse (Win/Loss pro Gegner/Team), Session-Frequenz + Qualitaet (Rating-Trend).
- **Massnahme**: 1) DrillResult-Auswertung: Durchschnittliche Success-Rate pro Drill ueber Zeit. 2) Technique-Progress: Rating-Verlauf pro Technik. 3) Match-Statistiken: Win/Loss-Bilanz, Satz-Statistiken. 4) Session-Quality-Trend: Rating-Verlauf. 5) Bestehende Charts auf echte Daten umstellen.
- **Prioritaet**: P3
- **Aufwand**: L
- **Abhaengigkeiten**: M-08 (DrillResult), M-20 (Match), M-26 (Evaluation erweitert)
- **Deliverable**: Datengetriebenes Analytics-Dashboard.
- **Nutzen**: Fortschritt wird sichtbar und messbar. Coaching-Entscheidungen datenbasiert.
- **Risiko**: Abhaengig von Datenverfuegbarkeit. Erst sinnvoll wenn genuegend Sessions mit DrillResults existieren.

---

### M-32: localStorage-Monitoring und Warnungen

- **Cluster**: C5 – Technische Professionalisierung
- **Handlungsfeld**: Persistenz / Stabilitaet
- **Problem**: localStorage hat ~5MB Limit. Bei intensiver Nutzung (100+ Sessions, 500+ Notizen) wird das Limit erreicht. Kein Fallback, keine Warnung, keine Archivierungs-Moeglichkeit.
- **Zielbild**: Storage-Monitor der aktuellen Auslastung anzeigt. Warnung bei >80%. Export-Funktion fuer Backup. Optional: Archivierungs-Logik (alte Sessions komprimieren oder entfernen).
- **Massnahme**: 1) Utility: `getStorageUsage()` → Bytes/Prozent. 2) Settings-Page: Storage-Anzeige. 3) Warnung bei >80% als Banner. 4) JSON-Export/Import fuer Komplett-Backup. 5) Spaeter: Archivierungs-UI fuer alte Sessions.
- **Prioritaet**: P2
- **Aufwand**: M
- **Abhaengigkeiten**: Keine
- **Deliverable**: Storage-Monitoring, Backup-Export/Import.
- **Nutzen**: Kein ploetzlicher Datenverlust. Nutzer hat Kontrolle.
- **Risiko**: Gering. Export/Import als JSON ist straightforward.

---

### M-33: Formular-Validierung mit Zod

- **Cluster**: C5 – Technische Professionalisierung
- **Handlungsfeld**: Validierung / Typisierung
- **Problem**: Zod-Schemas existieren fuer alle Modelle, werden aber nur bei der Store-Migration verwendet. Formulare haben keine Runtime-Validierung. Invalide Daten koennen in den Store gelangen.
- **Massnahme**: 1) Shared `validateForm<T>(schema, data)` Utility. 2) Form-Komponenten: onSubmit validiert mit Zod, zeigt Fehler. 3) Inline-Fehleranzeige pro Feld. 4) Wichtigste Formulare zuerst: PlayerForm, DrillEditor, GoalForm.
- **Prioritaet**: P3
- **Aufwand**: M
- **Abhaengigkeiten**: Keine
- **Deliverable**: Zod-basierte Formular-Validierung mit Fehleranzeige.
- **Nutzen**: Datenqualitaet. Keine invaliden Eintraege im Store.
- **Risiko**: Gering. Schrittweise umsetzbar, Formular fuer Formular.

---

### M-34: Print-Optimierung

- **Cluster**: C3 – Kern-UX
- **Handlungsfeld**: UX / Output
- **Problem**: Basis-Print-CSS existiert (Header/Nav ausblenden), aber keine optimierten Print-Layouts fuer Trainingsplaene, Matchplaene oder Spieler-Berichte.
- **Massnahme**: 1) Print-CSS fuer TrainingPlan: Session-Uebersicht tabellarisch. 2) Print-CSS fuer MatchPlan: Gegneranalyse + Gameplan als Ausdruck. 3) Print-CSS fuer PlayerDetail: Steckbrief mit Skills und Zielen. 4) "Drucken"-Buttons an relevanten Stellen.
- **Prioritaet**: P3
- **Aufwand**: S
- **Abhaengigkeiten**: Keine
- **Deliverable**: Druckbare Trainings-/Match-/Spieler-Berichte.
- **Nutzen**: Offline-Nutzung am Kickertisch (ausgedruckte Trainingsplaene).
- **Risiko**: Gering.

---

### M-35: Error Boundaries pro Feature

- **Cluster**: C5 – Technische Professionalisierung
- **Handlungsfeld**: Stabilitaet
- **Problem**: Ein globaler ErrorBoundary existiert. Wenn ein Feature einen Fehler wirft, crasht die gesamte App.
- **Massnahme**: ErrorBoundary pro Feature-Modul (Learn, Train, Plan, Board, Players, Analytics). Feature-Fehler zeigt Feature-spezifische Fehlermeldung, nicht App-Crash.
- **Prioritaet**: P3
- **Aufwand**: S
- **Abhaengigkeiten**: Keine
- **Deliverable**: Isolierte Fehlerbehandlung pro Feature.
- **Nutzen**: Ein Feature-Bug bringt nicht die ganze App zum Stillstand.
- **Risiko**: Gering.

---

### M-36: Accessibility-Grundlagen

- **Cluster**: C3 – Kern-UX
- **Handlungsfeld**: UX / Zugaenglichkeit
- **Problem**: Keine systematische Accessibility. Fehlende aria-Labels, fehlende Keyboard-Navigation ausserhalb des Timers, keine Focus-Management in Modals.
- **Massnahme**: 1) Alle UI-Komponenten: aria-labels, roles pruefen. 2) Modal: Focus-Trap. 3) Buttons/Links: sichtbarer Focus-Ring. 4) Kontrast-Pruefung auf Dark Theme. 5) Tab-Navigation testen.
- **Prioritaet**: P3
- **Aufwand**: M
- **Abhaengigkeiten**: Keine
- **Deliverable**: Basis-Accessibility fuer alle UI-Komponenten.
- **Nutzen**: Breitere Nutzbarkeit, professionellerer Eindruck.
- **Risiko**: Taktikboard (Konva) ist schwer accessible zu machen. Dort best-effort.

---

### M-37: Test-Abdeckung erweitern

- **Cluster**: C5 – Technische Professionalisierung
- **Handlungsfeld**: Qualitaetssicherung
- **Problem**: 27 Unit Tests existieren, aber keine Systematik. Domain-Logik ist gut testbar (pure functions), aber Store-Actions und Selektoren sind nicht getestet.
- **Massnahme**: 1) Tests fuer alle domain/logic/ Funktionen. 2) Tests fuer Store-Actions (Cascading Delete, Selektoren). 3) Tests fuer Zod-Schemas (Validierung + Migration). 4) Mindestens 1 Integration-Test pro Feature (Render + Interaktion). 5) CI: Test-Coverage-Report.
- **Prioritaet**: P3
- **Aufwand**: L
- **Abhaengigkeiten**: Keine (kann laufend parallel mitgefuehrt werden)
- **Deliverable**: 60+ Tests, Coverage-Report in CI.
- **Nutzen**: Regressionssicherheit bei Refactorings.
- **Risiko**: Tests duerfen Refactorings nicht blockieren. Lieber wenige gute Tests als viele brueche.

---

### M-38: Content-Daten externalisieren (spaeter)

- **Cluster**: C7 – Spaetere Erweiterungen
- **Handlungsfeld**: Architektur / Skalierung
- **Problem**: 48 Coach Cards und 20 Default-Drills sind TypeScript-Arrays (coachCards.ts: 1362 Zeilen, drills.ts: 683 Zeilen). Inhaltliche Aenderungen erfordern Developer-Deployment.
- **Zielbild**: Content als JSON-Dateien, geladen zur Laufzeit. Spaeter: CMS oder Admin-UI.
- **Prioritaet**: P3
- **Aufwand**: M
- **Abhaengigkeiten**: Keine
- **Deliverable**: Content in JSON-Dateien, dynamisch geladen.
- **Nutzen**: Content-Updates ohne Code-Deployment.
- **Risiko**: Initiales Laden wird minimal langsamer. Lazy Loading bereits implementiert.

---

### M-39: PWA / Offline-Faehigkeit (spaeter)

- **Cluster**: C7 – Spaetere Erweiterungen
- **Handlungsfeld**: Mobile / Offline
- **Problem**: App funktioniert nur online. Am Kickertisch ist WLAN nicht garantiert.
- **Zielbild**: Service Worker fuer Offline-Caching. App installierbar auf Homescreen. Manifest.json.
- **Prioritaet**: P3
- **Aufwand**: M
- **Abhaengigkeiten**: Keine
- **Deliverable**: Installierbare PWA mit Offline-Unterstuetzung.
- **Nutzen**: App funktioniert ohne Internet. Natuerlicheres Mobile-Erlebnis.
- **Risiko**: Service Worker Caching-Strategie muss durchdacht sein (stale-while-revalidate).

---

### M-40: JSON Export/Import fuer alle Daten

- **Cluster**: C5 – Technische Professionalisierung
- **Handlungsfeld**: Persistenz / Backup
- **Problem**: Matchplan hat Export/Import, aber alle anderen Daten nicht. Kein Komplett-Backup moeglich.
- **Massnahme**: 1) Export: Gesamten Store als JSON herunterladen. 2) Import: JSON hochladen, validieren mit Zod, in Store uebernehmen. 3) Merge-Strategie: Replace vs. Merge Option. 4) Settings-Page: Export/Import Buttons.
- **Prioritaet**: P2
- **Aufwand**: M
- **Abhaengigkeiten**: M-32 (Storage-Monitoring, da Export Teil davon ist)
- **Deliverable**: Komplett-Backup und -Restore.
- **Nutzen**: Datensicherheit. Geraetewechsel ohne Datenverlust.
- **Risiko**: Import-Validierung muss robust sein (korrupte Dateien abfangen).

---

## 4. Clusterung der Massnahmen

### Cluster 1 – Fundament (M-01 bis M-06)

Alles, was zuerst geschaffen werden muss, damit die App tragfaehig wird.

| ID | Massnahme | P | Aufwand |
|----|-----------|---|---------|
| M-01 | Session-Modell synchronisieren | P0 | S |
| M-02 | SessionTemplate-Divergenz aufloesen | P0 | S |
| M-03 | Player-Definition konsolidieren | P0 | S |
| M-04 | Barrel-Export vervollstaendigen | P0 | S |
| M-05 | Cascading Delete | P0 | S |
| M-06 | isFavorite als Selektor | P1 | S |

**Ergebnis**: Domaenenmodell ist Single Source of Truth. Keine Typ-Divergenz. Keine Ghost-Daten.

---

### Cluster 2 – Produktkern (M-09, M-17, M-18, M-22, M-23, M-24, M-25, M-28)

Alles, was den Kernnutzen der App im Coaching-Alltag schaerft.

| ID | Massnahme | P | Aufwand |
|----|-----------|---|---------|
| M-09 | Session-Retrospektive | P1 | S |
| M-17 | Coaching-Zyklus Flow | P1 | M |
| M-18 | Drill-Bibliothek professionalisieren | P1 | M |
| M-22 | Team-Integration | P2 | L |
| M-23 | Wiederholungsbasierte Blocks | P2 | M |
| M-24 | CoachingNote erweitern | P2 | M |
| M-25 | Drill Phase-Tags | P2 | M |
| M-28 | Trainingsplan-Ausfuehrung | P2 | L |

**Ergebnis**: Coaching-Zyklus ist erlebbar. Training hat Ergebnisse. Reflexion ist strukturiert.

---

### Cluster 3 – Kern-UX (M-10, M-11, M-12, M-27, M-34, M-36)

Alles, was die App alltagstauglich und schneller nutzbar macht.

| ID | Massnahme | P | Aufwand |
|----|-----------|---|---------|
| M-10 | Mobile Bottom-Navigation | P1 | M |
| M-11 | Dashboard als Coaching-Hub | P1 | M |
| M-12 | Globale Quick-Actions | P2 | M |
| M-27 | Spielerzentrische Session-Erstellung | P1 | M |
| M-34 | Print-Optimierung | P3 | S |
| M-36 | Accessibility-Grundlagen | P3 | M |

**Ergebnis**: App ist am Tisch nutzbar. Dashboard zeigt was ansteht. Kernaktionen in 2 Taps.

---

### Cluster 4 – Domaene und Datenmodell (M-07, M-08, M-19, M-20, M-21, M-26, M-29, M-30)

Alles, was fuer saubere fachliche Modellierung notwendig ist.

| ID | Massnahme | P | Aufwand |
|----|-----------|---|---------|
| M-07 | Technique einfuehren | P1 | L |
| M-08 | DrillResult in Sessions | P1 | M |
| M-19 | PlayerTechnique-Zuordnung | P2 | L |
| M-20 | Match von MatchPlan trennen | P2 | L |
| M-21 | Goal mit messbarem Fortschritt | P1 | M |
| M-26 | Evaluation erweitern | P2 | L |
| M-29 | Player-Modell erweitern | P2 | M |
| M-30 | focusSkill strukturiert ersetzen | P2 | M |

**Ergebnis**: Domaene bildet Coaching-Realitaet ab. Techniken, Ergebnisse, Matches sind sauber modelliert.

---

### Cluster 5 – Technische Professionalisierung (M-13, M-14, M-15, M-16, M-32, M-33, M-35, M-37, M-40)

Alles, was technische Schulden abbaut und Skalierung ermoeglicht.

| ID | Massnahme | P | Aufwand |
|----|-----------|---|---------|
| M-13 | Store in Slices | P2 | L |
| M-14 | UI-State von Data-State trennen | P2 | M |
| M-15 | URL-basiertes Sub-Routing | P2 | L |
| M-16 | Domain-Komponenten | P2 | M |
| M-32 | localStorage-Monitoring | P2 | M |
| M-33 | Formular-Validierung mit Zod | P3 | M |
| M-35 | Error Boundaries pro Feature | P3 | S |
| M-37 | Test-Abdeckung erweitern | P3 | L |
| M-40 | JSON Export/Import | P2 | M |

**Ergebnis**: Wartbare Codebase, robuste Persistenz, URL-basierte Navigation.

---

### Cluster 6 – Analyse und Auswertung (M-31)

Alles, was Fortschritt, Review und Entwicklung sichtbar macht.

| ID | Massnahme | P | Aufwand |
|----|-----------|---|---------|
| M-31 | Analytics mit echten Daten | P3 | L |

**Ergebnis**: Datengetriebenes Analytics-Dashboard mit echten Metriken.

---

### Cluster 7 – Spaetere Erweiterungen (M-38, M-39)

Alles, was wertvoll ist, aber nicht sofort noetig.

| ID | Massnahme | P | Aufwand |
|----|-----------|---|---------|
| M-38 | Content externalisieren | P3 | M |
| M-39 | PWA / Offline | P3 | M |

**Ergebnis**: App ist offline nutzbar, Content dynamisch ladbar.

---

## 5. Phasen / Roadmap

### Phase 1 – Stabilisierung und Zielschaerfung

**Ziel**: Domaenenmodell ist Single Source of Truth. Keine Ghost-Daten. Grundlage fuer alles Weitere.

**Massnahmen**: M-01, M-02, M-03, M-04, M-05, M-06

**Abhaengigkeiten**: Keine – diese Phase ist Voraussetzung fuer alle anderen.

**Erwartetes Ergebnis**:
- Alle Typen kommen aus `domain/models/`
- Store importiert nur, definiert nicht
- Barrel-Exports sind vollstaendig
- Loeschen bereinigt alle Referenzen
- ~2-4 Stunden Aufwand

---

### Phase 2 – Domaene und Kern-Workflows

**Ziel**: Zentrale Domaenenobjekte (Technique, DrillResult, SessionRetrospective, erweitertes Goal) existieren. Coaching-Zyklus ist als UX-Flow verdrahtet.

**Massnahmen**: M-07, M-08, M-09, M-17, M-21

**Abhaengigkeiten**: Phase 1 muss abgeschlossen sein.

**Erwartetes Ergebnis**:
- Technique als eigenes Domaenenobjekt mit ~30 Techniken
- Sessions haben Drill-Ergebnisse
- Session-Retrospektive nach Abschluss
- Goals mit messbarem Fortschritt
- Cross-Feature-Navigation: Spieler → Training → Auswertung
- ~3-5 Tage Aufwand

---

### Phase 3 – Strukturierte Trainings- und Coachinglogik + UX

**Ziel**: App ist am Tisch nutzbar. Training hat Phasen und Wiederholungen. Coaching-Notizen fuehren zu Handlungen. Dashboard ist Arbeitsplatz.

**Massnahmen**: M-10, M-11, M-18, M-23, M-24, M-25, M-27

**Abhaengigkeiten**: Phase 2 (Technique fuer Drill-Bibliothek, Session-Modell fuer Retrospektive im Dashboard).

**Erwartetes Ergebnis**:
- Bottom-Nav auf Mobile
- Dashboard als Coaching-Hub
- Drill-Bibliothek mit allen Modellfeldern, Filtern, Empfehlungen
- Wiederholungsbasierte Blocks
- Strukturiertere Coaching-Notizen
- Spielerzentrische Session-Erstellung
- ~5-8 Tage Aufwand

---

### Phase 4 – Review, Fortschritt, Auswertung

**Ziel**: Fortschritt wird sichtbar. Matches sind sauber dokumentiert. Spieler-Technik-Zuordnung funktioniert. Teams sind integriert.

**Massnahmen**: M-19, M-20, M-22, M-26, M-29, M-30, M-31

**Abhaengigkeiten**: Phase 2 (Technique fuer PlayerTechnique), Phase 3 (DrillResults fuer Analytics).

**Erwartetes Ergebnis**:
- Spieler-Technik-Matrix
- Match getrennt von MatchPlan
- Teams in Workflows integriert
- Evaluationen mit Technik-Bezug
- Player-Modell mit Stangen-Positionen
- Strukturierte Drill-Kategorisierung
- Analytics mit echten Daten
- ~5-8 Tage Aufwand

---

### Phase 5 – Professionalisierung und Ausbau

**Ziel**: Codebase ist wartbar und skalierbar. Persistenz ist robust. App ist offline nutzbar.

**Massnahmen**: M-12, M-13, M-14, M-15, M-16, M-28, M-32, M-33, M-34, M-35, M-36, M-37, M-38, M-39, M-40

**Abhaengigkeiten**: Phasen 1-4 abgeschlossen.

**Erwartetes Ergebnis**:
- Store in Slices aufgeteilt
- URL-basiertes Sub-Routing
- Domain-Komponenten-Bibliothek
- Trainingsplan-Ausfuehrung
- localStorage-Monitoring + Backup
- Formular-Validierung
- PWA
- 60+ Tests
- ~8-12 Tage Aufwand

---

## 6. Konkrete Arbeitspakete

### AP-01: Domaenenmodell-Bereinigung

- **Ziel**: Einzige Quelle der Wahrheit fuer alle Typen
- **Scope**: domain/models/, domain/schemas/, store/useAppStore.ts
- **Aufgaben**: M-01, M-02, M-03, M-04
- **Abgrenzung**: Keine neuen Modelle, nur Konsolidierung bestehender
- **Abhaengigkeiten**: Keine
- **Deliverables**: Aktualisierte Session.ts, SessionTemplate, Player-Import, vollstaendiger Barrel-Export
- **Akzeptanzkriterien**: Store importiert alle Typen aus domain/models/. Kein Typ ist im Store definiert. models/index.ts exportiert alle 11 Modelle. schemas/index.ts exportiert alle 12 Schemas.

### AP-02: Datenintegritaet und Store-Hygiene

- **Ziel**: Keine Ghost-Daten, saubere Selektoren
- **Scope**: store/useAppStore.ts
- **Aufgaben**: M-05, M-06
- **Abgrenzung**: Keine Slice-Aufteilung (kommt spaeter)
- **Abhaengigkeiten**: AP-01
- **Deliverables**: Cascading Delete fuer Player/Drill/Session/Team. isFavorite als Selektor.
- **Akzeptanzkriterien**: Spieler loeschen entfernt alle Referenzen in Goals, Evaluations, Notes, Teams, Sessions. `isFavorite` ist kein State-Mutator mehr.

### AP-03: Technique-Modell und Datenbasis

- **Ziel**: Techniken als eigene Domaenenobjekte mit Verknuepfungen
- **Scope**: domain/models/, domain/schemas/, data/, store/
- **Aufgaben**: M-07
- **Abgrenzung**: Nur Modell + Default-Daten + Store. Keine UI (kommt in AP-06).
- **Abhaengigkeiten**: AP-01
- **Deliverables**: Technique Interface, Schema, ~30 Default-Techniken, Store-Integration (techniques[])
- **Akzeptanzkriterien**: Jede Technik hat Name, Kategorie, Schwierigkeit, relatedDrillIds, relatedCardIds. Store kann Techniken laden und speichern.

### AP-04: Session-Ergebnisse und Retrospektive

- **Ziel**: Sessions werden auswertbar und reflexiv
- **Scope**: domain/models/, features/train/, store/
- **Aufgaben**: M-08, M-09
- **Abgrenzung**: Nur DrillResult-Erfassung und Retrospektive. Keine Analytics-Auswertung (kommt spaeter).
- **Abhaengigkeiten**: AP-01
- **Deliverables**: DrillResult Interface, SessionRetrospective Interface, Timer-Integration, Retrospektive-UI
- **Akzeptanzkriterien**: Nach Drill-Abschluss: Ergebnis erfassbar (completed, blocksCompleted, notes). Nach Session: Retrospektive-Wizard (3 Felder). Journal zeigt Ergebnisse und Retrospektive.

### AP-05: Goal-System mit Fortschritt

- **Ziel**: Messbare Ziele mit Fortschrittsanzeige
- **Scope**: domain/models/Goal.ts, features/players/GoalForm.tsx, GoalList.tsx
- **Aufgaben**: M-21
- **Abgrenzung**: Nur Goal-Erweiterung. Keine automatische Fortschrittsmessung (kommt spaeter via DrillResults).
- **Abhaengigkeiten**: AP-03 (Technique fuer techniqueId)
- **Deliverables**: Erweitertes Goal-Interface, Fortschrittsbalken in GoalList, Technik-Bezug in GoalForm
- **Akzeptanzkriterien**: Goal hat optional targetValue/currentValue. GoalList zeigt Fortschrittsbalken. GoalForm hat optionale Technik-Auswahl.

### AP-06: Mobile Navigation und Dashboard

- **Ziel**: App ist am Tisch nutzbar, Dashboard ist Arbeitsplatz
- **Scope**: components/Layout.tsx, features/home/HomePage.tsx
- **Aufgaben**: M-10, M-11
- **Abgrenzung**: Nur Navigation + Dashboard. Keine Quick-Actions (kommt in AP-08).
- **Abhaengigkeiten**: Keine
- **Deliverables**: BottomNav-Komponente, Responsive Layout, Coaching-Hub Dashboard
- **Akzeptanzkriterien**: Mobile: 4-5 Bottom-Tabs. Desktop: Top-Navigation. Dashboard zeigt: naechste Session, offene Ziele, letzte Notizen, Schnellzugriff Spieler.

### AP-07: Coaching-Zyklus-Flow

- **Ziel**: Features sind durchgaengig verknuepft
- **Scope**: features/players/, features/train/, features/plan/
- **Aufgaben**: M-17, M-27
- **Abgrenzung**: Nur Cross-Navigation und spielerzentrierter Einstieg. Kein URL-Routing (kommt spaeter).
- **Abhaengigkeiten**: AP-04 (Session-Ergebnisse fuer "Bewertung nachtragen")
- **Deliverables**: "Training starten" auf Spieler-Detail, "Passende Drills" auf Goals, "Bewertung nachtragen" im Journal, Spieler-vorgewaehlt im SessionBuilder
- **Akzeptanzkriterien**: Von Spieler-Detail in 1 Tap zu SessionBuilder. Von Goal in 1 Tap zu gefilterten Drills. Von Journal in 1 Tap zu Evaluation.

### AP-08: Drill-Bibliothek und Training erweitern

- **Ziel**: Drills fachlich vollstaendig, Blocks flexibel
- **Scope**: features/train/, domain/models/Drill.ts, data/drills.ts
- **Aufgaben**: M-18, M-23, M-25
- **Abgrenzung**: Nur Drill-UI und Block-Erweiterung. Kein focusSkill-Replacement (kommt in Phase 4).
- **Abhaengigkeiten**: AP-03 (Technique fuer Verknuepfung), AP-06 (Dashboard fuer Empfehlungen)
- **Deliverables**: Alle Drill-Modellfelder in UI, Wiederholungsbasierte Blocks, Phase-Tags, Drill-Empfehlungen
- **Akzeptanzkriterien**: DrillSelector zeigt position, playerCount, phase Filter. DrillEditor hat alle Felder. Timer kann Repetitions-Blocks. Default-Drills haben Phase-Tags.

### AP-09: Coaching-Notizen und Beobachtung

- **Ziel**: Strukturiertere Notizen mit Handlungsimpulsen
- **Scope**: domain/models/CoachingNote.ts, features/players/QuickNote.tsx, NotesFeed.tsx
- **Aufgaben**: M-24
- **Abgrenzung**: Nur Note-Erweiterung. Kein globaler FAB (kommt in Phase 5).
- **Abhaengigkeiten**: AP-06 (Dashboard fuer "Wichtige Notizen")
- **Deliverables**: Priority und ActionItems auf CoachingNote, UI-Anpassungen
- **Akzeptanzkriterien**: QuickNote hat Priority-Toggle. NotesFeed zeigt Priority-Badge und ActionItems. Dashboard zeigt High-Priority Notizen.

### AP-10: Match-Modell und Team-Integration

- **Ziel**: Saubere Match-Dokumentation, Teams in Workflows
- **Scope**: domain/models/, features/plan/, features/players/
- **Aufgaben**: M-20, M-22
- **Abgrenzung**: Nur Match-Separation und Team-Basisintegration. Keine Match-Statistiken (kommt in Analytics).
- **Abhaengigkeiten**: AP-01, AP-02
- **Deliverables**: Match-Modell, Match-Editor, Team-Auswahl in Sessions und Matches
- **Akzeptanzkriterien**: MatchPlan ist nur Planung. Match ist Ergebnis. Teams koennen in Sessions und Matches gewaehlt werden.

### AP-11: Spieler-Modell und Technik-Zuordnung

- **Ziel**: Praeziseres Spielerprofil mit Technik-Matrix
- **Scope**: domain/models/Player.ts, features/players/
- **Aufgaben**: M-19, M-29, M-30
- **Abgrenzung**: Nur Modell-Erweiterungen und UI. Keine Analytics-Integration.
- **Abhaengigkeiten**: AP-03 (Technique)
- **Deliverables**: Player mit RodPositions und isActive, PlayerTechnique-Zuordnung, Technik-Tab im Spieler-Profil, focusSkill durch techniqueIds ersetzt
- **Akzeptanzkriterien**: Spieler hat Multi-Select fuer Stangen-Positionen. Spieler-Detail hat "Techniken" Tab mit Statusuebersicht. Drills nutzen techniqueIds statt focusSkill fuer Filter.

### AP-12: Technische Professionalisierung

- **Ziel**: Wartbare Codebase, robuste Persistenz
- **Scope**: store/, components/, src/
- **Aufgaben**: M-13, M-14, M-15, M-16, M-32, M-40
- **Abgrenzung**: Rein technisch, keine fachlichen Aenderungen.
- **Abhaengigkeiten**: Phase 1-3 abgeschlossen
- **Deliverables**: Store-Slices, UI-Store, URL-Routing, Domain-Komponenten, Storage-Monitoring, Export/Import
- **Akzeptanzkriterien**: Store hat 6+ Slices. Sub-Views per URL erreichbar. 6+ Domain-Komponenten. Storage-Auslastung sichtbar. Komplett-Backup/Restore funktioniert.

---

## 7. Quick Wins vs. Strukturelle Massnahmen

### Top 10 Quick Wins

| Rang | Massnahme | Aufwand | Nutzen |
|------|-----------|---------|--------|
| 1 | Barrel-Export vervollstaendigen (M-04) | S | Sofort konsistente Imports |
| 2 | Cascading Delete (M-05) | S | Keine Ghost-Daten mehr |
| 3 | Session-Modell synchronisieren (M-01) | S | Eliminiert Typ-Divergenz |
| 4 | isFavorite als Selektor (M-06) | S | Korrekte Store-Semantik |
| 5 | Session-Retrospektive (M-09) | S | Coaching-Reflexion sofort nutzbar |
| 6 | SessionTemplate vereinheitlichen (M-02) | S | Keine Verwechslung mehr |
| 7 | Player-Import konsolidieren (M-03) | S | Verhindert Drift |
| 8 | Error Boundaries pro Feature (M-35) | S | Isolierte Fehlerbehandlung |
| 9 | Print-CSS verfeinern (M-34) | S | Offline-Nutzung am Tisch |
| 10 | Drill-Modellfelder in UI anzeigen (Teil von M-18) | S | Fachlicher Sofortwert |

### Top 10 Strukturelle Massnahmen

| Rang | Massnahme | Aufwand | Warum entscheidend |
|------|-----------|---------|-------------------|
| 1 | Technique als Domaenenobjekt (M-07) | L | Bruecke zwischen allen Features |
| 2 | Store in Slices (M-13) | L | Wartbarkeit bei Wachstum |
| 3 | URL-basiertes Sub-Routing (M-15) | L | Deep-Linking, Architektur |
| 4 | DrillResult in Sessions (M-08) | M | Sessions werden auswertbar |
| 5 | Match von MatchPlan trennen (M-20) | L | Fachlich korrekte Modellierung |
| 6 | Dashboard als Coaching-Hub (M-11) | M | App wird zum Arbeitswerkzeug |
| 7 | Mobile Bottom-Navigation (M-10) | M | Primaerer Einsatzort nutzbar |
| 8 | Coaching-Zyklus Flow (M-17) | M | Features werden System |
| 9 | PlayerTechnique-Zuordnung (M-19) | L | Coaching wird konkret |
| 10 | Trainingsplan-Ausfuehrung (M-28) | L | Planung bekommt Sinn |

---

## 8. Priorisierte Umsetzungsempfehlung

### P0 – Kritisch / Sofort (Phase 1)

| ID | Massnahme | Aufwand | Begruendung |
|----|-----------|---------|-------------|
| M-01 | Session-Modell synchronisieren | S | Fundament fuer alles Weitere |
| M-02 | SessionTemplate vereinheitlichen | S | Fundament |
| M-03 | Player-Import konsolidieren | S | Fundament |
| M-04 | Barrel-Export vervollstaendigen | S | Fundament |
| M-05 | Cascading Delete | S | Datenintegritaet |

**Diese 5 Massnahmen sind Grundlage fuer alle anderen.** Ohne sie baut jede Erweiterung auf wackeligen Fundamenten.

### P1 – Sehr wichtig (Phase 2-3)

| ID | Massnahme | Aufwand | Begruendung |
|----|-----------|---------|-------------|
| M-06 | isFavorite als Selektor | S | Store-Korrektheit |
| M-07 | Technique einfuehren | L | Groesster fachlicher Hebel |
| M-08 | DrillResult in Sessions | M | Sessions auswertbar |
| M-09 | Session-Retrospektive | S | Coaching-Reflexion |
| M-10 | Mobile Bottom-Navigation | M | Primaerer Einsatzort |
| M-11 | Dashboard als Coaching-Hub | M | App als Arbeitswerkzeug |
| M-17 | Coaching-Zyklus Flow | M | Features → System |
| M-18 | Drill-Bibliothek professionalisieren | M | Fachlicher Sofortwert |
| M-21 | Goal mit messbarem Fortschritt | M | Coaching-Ziele greifbar |
| M-27 | Spielerzentrische Session-Erstellung | M | Coaching-Einstieg |

### P2 – Wichtig (Phase 3-4)

| ID | Massnahme | Aufwand |
|----|-----------|---------|
| M-12 | Globale Quick-Actions | M |
| M-13 | Store in Slices | L |
| M-14 | UI-State trennen | M |
| M-15 | URL-basiertes Sub-Routing | L |
| M-16 | Domain-Komponenten | M |
| M-19 | PlayerTechnique-Zuordnung | L |
| M-20 | Match von MatchPlan trennen | L |
| M-22 | Team-Integration | L |
| M-23 | Wiederholungsbasierte Blocks | M |
| M-24 | CoachingNote erweitern | M |
| M-25 | Drill Phase-Tags | M |
| M-28 | Trainingsplan-Ausfuehrung | L |
| M-29 | Player-Modell erweitern | M |
| M-30 | focusSkill ersetzen | M |
| M-32 | localStorage-Monitoring | M |
| M-40 | JSON Export/Import | M |

### P3 – Spaeter (Phase 5+)

| ID | Massnahme | Aufwand |
|----|-----------|---------|
| M-26 | Evaluation erweitern | L |
| M-31 | Analytics mit echten Daten | L |
| M-33 | Formular-Validierung mit Zod | M |
| M-34 | Print-Optimierung | S |
| M-35 | Error Boundaries pro Feature | S |
| M-36 | Accessibility-Grundlagen | M |
| M-37 | Test-Abdeckung erweitern | L |
| M-38 | Content externalisieren | M |
| M-39 | PWA / Offline | M |

---

## 9. Technische Migrations- und Umsetzungslogik

### Prinzipien

1. **Kein Big Bang**: Schrittweise umbauen, nicht alles neu schreiben. Jede Massnahme erzeugt einen lauffaehigen Zwischenzustand.
2. **Backward-Compatible Migrations**: Neue Felder optional. Alte Daten bleiben lesbar. Zod-Migration fuer localStorage-Daten.
3. **Feature-Flags statt Feature-Branching**: Neue Features koennen neben alten existieren (z.B. drillResults neben drillIds).
4. **Tests vor Refactoring**: Vor jedem groesseren Refactoring (Store Slices, URL-Routing) Tests fuer betroffene Logik schreiben.

### Reihenfolge der Refactorings

```
1. Domaenenmodell bereinigen (M-01..M-04)
   → Kein Code-Refactoring, nur Typ-Definitionen und Imports anpassen
   → Sichere Operation, keine Runtime-Aenderung

2. Cascading Delete + isFavorite (M-05, M-06)
   → Store-Actions anpassen
   → Test: Spieler loeschen, pruefen ob Goals/Evals/Notes weg sind

3. Neue Modelle einfuehren (M-07, M-08, M-09, M-21)
   → Additive Aenderungen: Neue Interfaces, neue Store-Arrays, neue UI-Elemente
   → Alte Funktionalitaet bleibt unveraendert
   → Migration: Neue Felder mit Defaults, bestehende Daten bleiben

4. Navigation + Dashboard (M-10, M-11)
   → Layout-Aenderung, keine Daten-Migration
   → Kann parallel zu Schritt 3 laufen

5. Cross-Feature-Flow (M-17, M-27)
   → Navigation-Callbacks oder URL-Params
   → Keine Daten-Aenderung, nur UX-Verknuepfung

6. Store in Slices (M-13)
   → ERST wenn Phase 2-3 stabil ist
   → Rein technisches Refactoring, keine fachliche Aenderung
   → Test-Suite vorher aufbauen fuer Regressionssicherheit
```

### Sichere Zwischenzustaende

Nach jeder Phase ist die App lauffaehig und deployfaehig:

- **Nach Phase 1**: Gleiches Verhalten, sauberere Typen. Nutzer merkt nichts.
- **Nach Phase 2**: Neue Features (Technique, DrillResult, Retrospektive, Goals mit Fortschritt) sind verfuegbar. Alte Features funktionieren weiter.
- **Nach Phase 3**: Neue Navigation und Dashboard. Alte Inhalte in neuer Struktur.
- **Nach Phase 4**: Reichhaltigere Modelle (Match, PlayerTechnique, erweiterte Player). Alte Daten migriert.
- **Nach Phase 5**: Sauberere Codebase, gleiche Funktionalitaet, bessere Wartbarkeit.

### Altstrukturen die uebergangsweise bestehen bleiben duerfen

- `Drill.focusSkill` (Freitext) neben `Drill.techniqueIds[]` bis Phase 4
- `Session.drillIds[]` neben `Session.drillResults[]` bis alle alten Sessions migriert sind
- `MatchPlan.sets`, `.result`, `.playerIds` bis Match-Modell vollstaendig getrennt ist
- `Player.preferredPosition` (String) neben `Player.preferredPositions[]` (Array) bis Migration
- Monolithischer Store bis Phase 5 (Slices sind Wartbarkeit, nicht Funktionalitaet)
- useState-basierte Sub-Views bis URL-Routing implementiert ist

### Migrationslogik fuer localStorage

Zustand persist hat bereits Version-Support (aktuell Version 1). Fuer jede Modell-Erweiterung:

```typescript
// store/migrate.ts
export function migrateStore(persisted: unknown, version: number) {
  let state = persisted as Record<string, unknown>;

  if (version < 2) {
    // Phase 1: Session-Felder defaults
    state.sessions = (state.sessions as unknown[]).map((s: Record<string, unknown>) => ({
      ...s,
      playerIds: s.playerIds ?? [],
      focusAreas: s.focusAreas ?? [],
      createdAt: s.createdAt ?? s.date ?? new Date().toISOString(),
    }));
    // Phase 2: Neue Arrays initialisieren
    state.techniques = state.techniques ?? [];
    state.playerTechniques = state.playerTechniques ?? [];
    state.matches = state.matches ?? [];
  }

  return state;
}
```

---

## 10. Risiken / Trade-offs / Bewusst spaeter

### Risiken

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| localStorage-Limit bei intensiver Nutzung | Mittel | Hoch | M-32 (Monitoring + Export) frueh umsetzen |
| Migration bricht bestehende Daten | Niedrig | Hoch | Zod-Validation bei Migration, Backup vor grossen Updates |
| Technique-Daten-Extraktion aufwaendig | Mittel | Niedrig | ~30 Techniken manuell, spaeter erweiterbar |
| Mobile Navigation versteckt wichtige Features | Mittel | Mittel | Nutzertests, "Mehr"-Menu nicht zu tief |
| Store-Slice-Migration bricht Persist | Niedrig | Hoch | Thorough Testing vor Umstellung |
| focusSkill-zu-techniqueIds-Migration unvollstaendig | Mittel | Niedrig | focusSkill als Fallback beibehalten |

### Zielkonflikte

1. **Einfachheit vs. Fachliche Tiefe**: Jedes neue Modell (Technique, DrillResult, Match) erhoeht Komplexitaet. → Mitigation: Felder optional lassen, Progressive Disclosure in UI.
2. **Mobile vs. Desktop**: Bottom-Nav fuer Mobile vs. Top-Nav fuer Desktop. → Mitigation: Responsive Breakpoint, nicht entweder-oder.
3. **Schnelle Dateneingabe vs. Datenqualitaet**: Quick-Note vs. strukturierte Notiz. → Mitigation: Quick-Note als Einstieg, spaeter strukturieren.
4. **Abwaertskompatibilitaet vs. Sauberes Modell**: Alte Felder mitschleppen vs. Breaking Migration. → Mitigation: Deprecated Felder uebergangsweise beibehalten.

### Overengineering-Warnung

Folgende Themen sind attraktiv, aber aktuell verfrueht:
- **Volles Event-Sourcing** statt einfacher CRUD-Updates
- **IndexedDB** statt localStorage (erst wenn 5MB-Limit erreicht)
- **React Query / SWR** (keine API, alles lokal)
- **Micro-Frontend-Architektur** (eine App, ein Team)
- **Automatische Trainingsempfehlungs-KI** (erst wenn Datenbasis existiert)
- **GraphQL-Layer** (kein Backend)
- **Storybook** (13 UI-Komponenten reichen fuer Dokumentation im Code)

### Bewusst nicht bauen (jetzt und absehbar)

- **Turnierverwaltung**: Bracket-Builder, Gruppenphasen. Zu komplex, zu wenig Alltagsnutzen.
- **Multi-User / Rollenmodell**: Coach, Spieler, Admin. Erst wenn Cloud-Sync existiert.
- **Echtzeit-Match-Statistik**: Live-Tracking waehrend Matches. Zu aufwaendig, fraglicher Nutzen.
- **Soziale Features**: Teilen, Kommentare, Feed. Nicht der Produktkern.
- **Gamification**: Badges, Streaks, Level-Up. Ablenkung vom Coaching-Fokus.
- **Video-Integration**: Clips an Drills. Erst wenn Grundfunktionen sitzen.
- **Vereinsverwaltung**: Mitglieder, Beitraege, Termine. Anderes Produkt.

---

## 11. Master-Implementierungsblock fuer Claude Code

Der folgende Block kann als Prompt fuer die systematische Umsetzung verwendet werden.

---

```
# MASTER-IMPLEMENTIERUNGSANWEISUNG FUER KICKERCOACH APP

Du arbeitest in der KickerCoach App (React 18 + TypeScript + Vite + Tailwind 4 + Zustand + Zod).
Worktree: .worktrees/feature-evolution
Branch: feature/kickercoach-evolution

## KONTEXT

Es existiert ein detaillierter Implementierungsplan unter docs/implementation-plan.md
mit 40 Massnahmen (M-01 bis M-40), organisiert in 5 Phasen und 12 Arbeitspaketen.

## UMSETZUNGSREGELN

1. **Phasenweise arbeiten**: Phase 1 (Fundament) MUSS zuerst vollstaendig abgeschlossen sein, bevor Phase 2 beginnt.
2. **Keine Breaking Changes**: Jede Aenderung erzeugt einen lauffaehigen Zwischenzustand. App muss nach jedem Commit deployfaehig sein.
3. **Migration beachten**: Neue Felder auf Modellen immer optional oder mit Default. Zustand persist Version erhoehen. Zod-Migration fuer bestehende localStorage-Daten.
4. **Nicht blind neu bauen**: Bestehende Komponenten und Logik wiederverwenden. Nur aendern was laut Plan geaendert werden muss.
5. **Tests bei kritischen Aenderungen**: Cascading Delete, Migration, Store-Slices muessen getestet werden.
6. **Batch-Arbeit**: Zusammengehoerige Massnahmen als Batch umsetzen. Nach jedem Batch committen.
7. **Abhaengigkeiten respektieren**: Siehe Voraussetzungskette im Plan.

## PHASE 1 – STABILISIERUNG (M-01 bis M-06)

Setze diese 6 Massnahmen als ersten Batch um:

### M-01: Session-Modell synchronisieren
- `domain/models/Session.ts` aktualisieren: playerIds: string[], focusAreas: Category[], rating?: number, mood?: string, createdAt: string hinzufuegen
- `domain/schemas/session.ts` synchronisieren
- Store: Session-Typ aus domain/models/ importieren, nicht selbst definieren
- Alle Importe in Features pruefen

### M-02: SessionTemplate vereinheitlichen
- Ein einziges SessionTemplate Interface in domain/models/TrainingPlan.ts: id, name, drillIds, focusAreas, estimatedDuration (alle Felder)
- Store-Version entfernen, aus domain importieren
- Schema aktualisieren

### M-03: Player konsolidieren
- Store importiert Player ausschliesslich aus domain/models/Player.ts
- Keine Re-Definition im Store

### M-04: Barrel-Exports vervollstaendigen
- domain/models/index.ts: Alle 11 Modelle exportieren (Player, Session, Goal, Evaluation, CoachingNote, TrainingPlan, Team + bestehende 4)
- domain/schemas/index.ts pruefen und vervollstaendigen
- Naming-Konflikte aufloesen (Team vs. TacticalTeam)

### M-05: Cascading Delete
- deletePlayer: goals, evaluations, coachingNotes, teams (wo includes), sessions (playerIds) bereinigen
- deleteDrill: drillTemplates, sessions (drillIds/drillResults) bereinigen
- deleteSession: evaluations (sessionId), coachingNotes (sessionId) bereinigen
- deleteTeam: sessions (teamId) bereinigen

### M-06: isFavorite als Selektor
- Aus Store-Actions entfernen
- Als standalone Hook oder Selektor implementieren

Nach Abschluss: Committen, Tests laufen lassen, pruefen.

## PHASE 2 – DOMAENE UND KERN-WORKFLOWS (M-07 bis M-09, M-17, M-21)

### Batch A: Neue Modelle (M-07, M-08, M-09, M-21)

M-07: Technique-Modell
- domain/models/Technique.ts erstellen
- domain/schemas/technique.ts erstellen
- data/techniques.ts mit ~30 Default-Techniken aus Coach Cards extrahieren
- Store: techniques: Technique[] hinzufuegen
- Store-Version erhoehen, Migration

M-08: DrillResult
- domain/models/DrillResult.ts oder in Session.ts
- Session.drillResults: DrillResult[] (optional, neben drillIds)
- Timer: nach Block-Abschluss Ergebnis-Erfassung
- Journal: DrillResults anzeigen

M-09: SessionRetrospective
- SessionRetrospective Interface (whatWentWell, whatToImprove, focusNextTime)
- Session.retrospective?: SessionRetrospective
- Retrospektive-UI nach Session-Abschluss
- Journal: Retrospektive anzeigen

M-21: Goal mit Fortschritt
- Goal erweitern: techniqueId?, targetValue?, currentValue?, status += "abandoned"
- GoalForm: Technik-Select, Zielwert
- GoalList: Fortschrittsbalken

### Batch B: Coaching-Zyklus (M-17)

- Spieler-Detail: "Training starten" → SessionBuilder mit playerIds
- GoalList: "Passende Drills" → DrillSelector gefiltert
- Journal: "Bewertung nachtragen" → EvaluationForm
- Cross-Navigation mit Callbacks oder URL-Params

## PHASE 3 – TRAINING UND UX (M-10, M-11, M-18, M-23, M-25, M-27)

### Batch A: Navigation und Dashboard (M-10, M-11)

M-10: BottomNav-Komponente, Responsive Layout
M-11: Dashboard-Redesign (naechste Session, offene Ziele, letzte Notizen, Schnellzugriff)

### Batch B: Training erweitern (M-18, M-23, M-25, M-27)

M-18: Drill-Bibliothek: Alle Modellfelder in UI, Filter erweitern
M-23: TrainingBlock type "repetitions" + Timer-Anpassung
M-25: Drill phase Tags + SessionBuilder Gruppierung
M-27: Spielerzentrische Session-Erstellung

## PHASE 4 – FORTSCHRITT UND VERTIEFUNG (M-19, M-20, M-22, M-24, M-29, M-30)

### Batch A: Modell-Erweiterungen (M-19, M-20, M-29, M-30)

M-19: PlayerTechnique-Zuordnung
M-20: Match von MatchPlan trennen
M-29: Player preferredPositions + isActive
M-30: focusSkill durch techniqueIds ersetzen

### Batch B: Workflows (M-22, M-24)

M-22: Team-Integration in Sessions und Matches
M-24: CoachingNote mit Priority und ActionItems

## PHASE 5 – PROFESSIONALISIERUNG (M-12 bis M-16, M-28, M-32, M-40)

Nur umsetzen wenn Phase 1-4 stabil sind.

M-13: Store in Slices aufteilen
M-14: UI-State separieren
M-15: URL-basiertes Sub-Routing
M-16: Domain-Komponenten extrahieren
M-12: Globale Quick-Actions (FAB)
M-28: Trainingsplan-Ausfuehrung
M-32: localStorage-Monitoring
M-40: JSON Export/Import

## WICHTIG

- Zwischen den Phasen: Tests laufen lassen, Build pruefen
- Nach jedem Batch: Kurze Zusammenfassung was sich geaendert hat
- Bei Unsicherheit: Lieber nachfragen als falsch implementieren
- Altstrukturen duerfen uebergangsweise bestehen bleiben (siehe Plan Abschnitt 9)
- Store-Version bei jeder Schema-Aenderung erhoehen
- Commit-Messages: feat/fix/refactor Prefix, kurze Beschreibung
```

---

## 12. Offene Annahmen und Risiken

### Annahmen

| # | Annahme | Einfluss wenn falsch |
|---|---------|---------------------|
| A1 | App wird von einem einzelnen Trainer/Spieler genutzt, nicht von einem Verein mit mehreren Coaches | Multi-User wuerde Cloud-Sync und Rollenmodell erfordern |
| A2 | Primaerer Einsatzort: am Kickertisch + unterwegs (Mobile) | Wenn Desktop primaer → Bottom-Nav weniger wichtig |
| A3 | Zielgruppe: ambitionierter Trainer oder selbsttrainierender Spieler | Wenn Anfaenger → weniger Komplexitaet, mehr Guided Flows |
| A4 | localStorage reicht fuer 6-12 Monate | Wenn intensive Nutzung frueher → IndexedDB-Migration vorziehen |
| A5 | Kein Backend geplant (client-only) | Wenn Backend → API-Layer, Auth, Sync-Logik |
| A6 | ~30 Techniken decken den Kickerkosmos ab | Wenn mehr → Datenstruktur flexibel genug |
| A7 | Taktikboard bleibt eigenstaendiges Tool | Wenn tief integriert → Board-Szenen in Sessions/Matches einbetten |

### Offene Fragen

1. Soll die App spaeter mehrere Trainer pro Team unterstuetzen?
2. Gibt es Ambitionen fuer eine native Mobile App (Capacitor/React Native)?
3. Soll Content (Cards, Drills) von Nutzern erweiterbar sein oder kuratiert bleiben?
4. Welche Rolle spielt das Taktikboard langfristig – eigenstaendig oder in Workflows eingebettet?
5. Gibt es eine Monetarisierungsstrategie, die Feature-Priorisierung beeinflusst?
6. Welcher Detailgrad bei Technik-Daten ist gewuenscht? (z.B. Ausfuehrungsseite links/rechts, Tempo, Praezision)
7. Sollen Trainingsplaene an Kalender-Wochen gebunden sein oder flexibel?

---

*Dieser Implementierungsplan basiert auf dem Staff Engineer Audit vom 31.03.2026 und einer vollstaendigen Code-Analyse der KickerCoach App (Branch feature/kickercoach-evolution).*
