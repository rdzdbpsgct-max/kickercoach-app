# KickerCoach App -- Staff Engineer Audit & Weiterentwicklungs-Review

**Datum:** 31.03.2026
**Auditor-Rolle:** Staff Product Engineer, UX-Stratege, Frontend-Architekt, Domaenenmodellierer, Technical Auditor

---

## 1. Executive Summary

### Gesamtbewertung

Die KickerCoach App ist ein **funktionaler MVP mit solidem UI-Fundament, aber schwachem Domaenenmodell und unklarer Produktkernschaerfe**. Sie hat beeindruckend viele Features akkumuliert -- von Drill-Timer ueber Taktikboard bis Spielerprofile und Analytics -- aber diese Features sind **nebeneinander gebaut statt fachlich durchdacht verbunden**.

Das Ergebnis: Die App fuehlt sich an wie eine **Feature-Sammlung rund um Kickern**, nicht wie ein **Coaching-System fuer Kickertraining**. Der Unterschied ist entscheidend:

- Eine Feature-Sammlung hat viele Screens, die unabhaengig voneinander funktionieren
- Ein Coaching-System hat einen roten Faden: Spieler entwickeln, Training planen, ausfuehren, auswerten, anpassen

**Die App ist derzeit Ersteres und muss Letzteres werden.**

### Scorecard

| Dimension | Bewertung | Kommentar |
|---|---|---|
| **Produktreife** | 5/10 | Viele Features, aber kein kohaerenter Coaching-Workflow |
| **Coaching-Fachlichkeit** | 4/10 | Gute Inhalte (48 Cards, 20 Drills), aber Domaene zu flach |
| **UX-Reife** | 5/10 | Brauchbare UI-Komponenten, aber Flows zu fragmentiert |
| **Technische Tragfaehigkeit** | 6/10 | Solides Tech-Stack, aber Modell-Inkonsistenzen bremsen |

### Staerken

- **Taktikboard**: Das Konva-Board mit DTFB-Normabstaenden ist ein echtes Alleinstellungsmerkmal
- **Content-Qualitaet**: 48 Coaching-Karten mit Schritten, Fehlern, Coach-Cues -- professionell
- **Drill-Timer**: Drift-freier Timer mit Auto-Advance, Keyboard-Shortcuts, Block-Progress
- **Tech-Stack**: React 18 + TypeScript + Zustand + Zod + Tailwind 4 -- modern, wartbar
- **Shared UI Library**: 13 Basiskomponenten, konsistentes Design-System

### Groesster Hebel

**Das Domaenenmodell radikal schaerfen.** Die App hat derzeit ~15 lose Objekte im Store. Was fehlt, ist ein klares Beziehungsgeflecht, das die Coaching-Realitaet abbildet: Ein Spieler hat Staerken/Schwaechen -> daraus ergeben sich Ziele -> Ziele fuehren zu Trainingsplaenen -> Sessions fuehren diese Plaene aus -> Evaluationen messen Fortschritt -> der Zyklus wiederholt sich.

Dieser Coaching-Zyklus ist das fehlende Rueckgrat der App.

---

## 2. Bewertung der Produktlogik

### A. Primaere Use Cases -- Was die App wirklich unterstuetzt

| Use Case | Status | Bewertung |
|---|---|---|
| Spieler anlegen und verwalten | Vorhanden | Gut, aber Profile zu flach |
| Uebungen erstellen | Vorhanden | Gut (Custom Drills + 20 Default) |
| Session planen | Vorhanden | Session-Builder existiert, aber kein "Trainingsplan ausfuehren" |
| Training dokumentieren | Teilweise | Sessions werden gespeichert, aber ohne Drill-Ergebnisse |
| Technikschwerpunkte festlegen | Teilweise | Fokus-Areas in Sessions, aber nicht spielergebunden |
| Coaching-Notizen machen | Vorhanden | QuickNote + NotesFeed, aber unstrukturiert |
| Match-/Trainingsbeobachtung | Schwach | MatchPlan existiert, aber kein echtes Match-Protokoll |
| Fortschritt nachvollziehen | Schwach | ProgressView zeigt Bewertungen, aber kein echter Fortschrittsindikator |
| Teams / Doppelpaarungen | Vorhanden | Team-Modell existiert, aber nirgends funktional eingebunden |

**Kernproblem**: Jeder Use Case existiert als isolierte Insel. Es gibt keinen Workflow, der sie verbindet.

### B. Zielgruppen

Die App ist aktuell am ehesten geeignet fuer:
- **Ambitionierte Hobbyspieler**, die alleine am Tisch uebt und Techniken lernen will (Coach Cards + Drill Timer)
- **Gelegenheitstrainer**, der sich Spieler und Notizen merken will

Sie ist **nicht geeignet** fuer:
- Systematisches Leistungstraining (kein Coaching-Zyklus)
- Vereinstraining (kein Mannschaftskontext, keine Rollen)
- Turniervorbereitung (kein Turnier-/Matchverlauf)
- Doppeltraining (Teams existieren, werden aber nie genutzt)

### C. Produktkern

**Aktueller Kern**: "Kick-Enzyklopaedie mit Timer" -- die 48 Coach Cards und der Drill-Timer sind das Staerkste in der App.

**Problem**: Der Kern ist nicht scharf genug. Die App versucht gleichzeitig:
1. Technik-Nachschlagewerk zu sein (Learn)
2. Trainingstimer zu sein (Train/Timer)
3. Trainingsplanung zu machen (Sessions, Plans)
4. Coaching-Tool zu sein (Notizen, Evaluationen)
5. Taktik-Editor zu sein (Board)
6. Match-Planer zu sein (Plan)
7. Analytics-Dashboard zu sein (Analytics)

Keine dieser Rollen ist tief genug ausgefuellt. Die App braucht einen klaren Primaer-Kern:

**Empfohlener Primaerkern**: "Spielerentwicklung durch strukturiertes Training" -- also der Coaching-Zyklus: Beobachten -> Ziele setzen -> Trainieren -> Auswerten -> Anpassen.

### D. Produktluecken

Die folgenden fachlichen Luecken verhindern, dass sich die App wie ein echtes Coaching-Tool anfuehlt:

1. **Kein Coaching-Zyklus**: Es gibt keine Verbindung zwischen "Spieler X hat Schwaeche bei Passspiel" -> "Trainingsziel: Passspiel verbessern" -> "Session mit Passspiel-Drills planen" -> "Auswerten, ob Fortschritt sichtbar ist"
2. **Kein Session-Ergebnis**: Eine Session wird gespeichert, aber es gibt keine Information darueber, wie die Drills liefen (Trefferquote, Wiederholungen, Schwierigkeitsgrad)
3. **Kein echtes Match-Log**: MatchPlan mischt Vorbereitung und Ergebnis. Es fehlt ein sauberes Match-Ergebnis-Objekt mit Statistiken
4. **Teams sind Attrappen**: Das Team-Modell existiert, wird aber in keinem Workflow genutzt (nicht in Sessions, nicht in Matches, nicht in Analysen)
5. **Keine Trainingslogik**: Es gibt keine Progression, keine Periodisierung, keine Schwierigkeitsanpassung ueber Zeit
6. **Keine Coach-Identitaet**: Die App weiss nicht, wer der Coach ist, wessen Perspektive gilt

---

## 3. Bewertung der fachlichen Modellierung

### A. Spielerentwicklung

| Aspekt | Status | Bewertung |
|---|---|---|
| Spielerprofil | Vorhanden | Name, Nickname, Avatar -- OK fuer MVP |
| Spielniveau | Vorhanden | `level: Difficulty` (beginner/intermediate/advanced) -- zu grob |
| Position | Vorhanden | offense/defense/both -- OK, aber Kicker hat 4 Stangen, nicht 2 Rollen |
| Staerken/Schwaechen | Teilweise | `skillRatings: Record<Category, number>` -- 7 Kategorien mit 1-5 Skalierung existieren, aber zu generisch |
| Trainingsziele | Vorhanden | Goal-Modell mit Status, aber keine Fortschrittsmessung |
| Entwicklungsverlauf | Schwach | ProgressView zeigt Bewertungsverlauf, aber Evaluationen muessen manuell erstellt werden |
| Trainingshistorie | Schwach | `getPlayerSessions` existiert als Selektor, aber wird nur in Analytics genutzt |

**Hauptkritik**: Die Skill-Kategorien (Torschuss, Passspiel, Ballkontrolle, Defensive, Taktik, Offensive, Mental) sind zu abstrakt fuer echtes Kickercoaching. Ein Trainer denkt nicht "Ballkontrolle 3/5", sondern "Kann noch keinen sauberen Pin-Shot fangen" oder "Brush-Pass von der 5er auf die 3er sitzt zu 60%".

**Was fehlt**:
- Konkrete Techniken als eigenstaendige Objekte (nicht nur Coach Cards)
- Trefferquoten / messbare Kennzahlen pro Technik
- Trainingshistorie auf dem Spielerprofil sichtbar
- Dominante Stangenposition (Torwart, 2er, 5er, 3er)

### B. Technik

Die 48 Coach Cards decken Techniken gut ab, aber sie sind **Content**, nicht **Domaenenobjekte**. Eine Technik (z.B. "Pin-Shot") sollte ein eigenstaendiges Objekt sein, das:
- einen Namen hat
- einer Kategorie angehoert
- eine Schwierigkeit hat
- messbare Ziele hat (z.B. "8 von 10 Treffer")
- einem Spieler zugeordnet werden kann (beherrscht / in Arbeit / nicht gelernt)
- in Drills verwendet wird
- in Evaluationen bewertet wird

Aktuell sind Techniken nur als Texte in Coach Cards kodiert. Es gibt keine Verbindung zwischen "Coach Card: Pin-Shot" und "Drill: Pin-Shot Training" und "Evaluation: Pin-Shot-Faehigkeit des Spielers".

**Konkrete Kicker-Techniken, die modellierbar sein sollten**:
- Schuesse: Pin-Shot, Pull-Shot, Push-Shot, Jet/Snake, Schlenzer, Bank-Shot, Aerial, Spray-Shot, Dead Man
- Paesse: Lane-Pass, Brush-Pass, Stick-Pass, Tic-Tac, Banden-Pass
- Kontrolle: Pin, Front-Pin, Ballstopp, Rollover, Aerial Catch
- Defensive: Grundstellung, Shuffle, Zone, Reaktionsblock, Bait
- Stangenspezifisch: 5er-Kontrolle, 3er-Schuss, 2er-Verteidigung, Torwart-Timing

### C. Taktik / Spiellogik

Das Taktikboard (Konva) ist technisch stark, aber **fachlich isoliert**. Es gibt keine Verbindung zwischen:
- Board-Szene und MatchPlan
- Board-Szene und Trainings-Session
- Board-Szene und Spielsituation

Taktische Konzepte wie Spielaufbau, Ballbesitz, Wandspiel, Gegneranalyse sind als Coach Cards vorhanden, aber nicht als strukturierte Daten modelliert.

**Was spaeter modellierbar sein sollte**:
- Standardablaeufe (Sequenzen von Aktionen: "Ball auf 5er -> Tic-Tac -> Pass auf 3er -> Pin-Shot")
- Situative Muster ("Wenn Gegner Zone spielt, dann...")
- Doppelabsprachen ("Spieler A haelt Ball auf 5er, Spieler B bereitet Schuss auf 3er vor")

### D. Trainingslogik

| Aspekt | Status |
|---|---|
| Trainingsplaene | Vorhanden (TrainingPlan mit Wochen/Templates) |
| Einzelne Sessions | Vorhanden (SessionBuilder) |
| Uebungsbloecke | Vorhanden (work/rest Blocks in Drills) |
| Warm-up/Hauptteil/Abschluss | Nicht vorhanden (keine Phaseneinteilung) |
| Wiederholungen | Nicht vorhanden (nur zeitbasiert) |
| Ziel pro Uebung | Teilweise (`measurableGoal` auf Drill, aber nie in UI gezeigt) |
| Einzel- vs. Doppeltraining | Vorhanden im Modell (`playerCount`), nie in UI |
| Varianten einer Uebung | Vorhanden im Modell (`variations`), nie in UI |
| Trainingsvorlagen | Vorhanden (SessionTemplate, DrillTemplate) |
| Progression | Nicht vorhanden |

**Hauptkritik**: Die Trainingslogik ist zeitbasiert (Blocks mit Sekunden), aber Kickertraining ist oft wiederholungsbasiert ("10x Pin-Shot rechts, dann 10x links"). Es fehlt ein Block-Typ fuer Wiederholungen.

### E. Beobachtung und Coaching

| Aspekt | Status |
|---|---|
| Coaching-Notizen | Vorhanden (4 Kategorien: tactical/technical/mental/communication) |
| Beobachtungen pro Spieler | Vorhanden (Notes an Player gebunden) |
| Fehlerkategorien | Nicht strukturiert (Freitext in Notizen) |
| Handlungsempfehlungen | Nicht vorhanden |
| Session-Rueckblick | Schwach (nur Rating 1-5 + optionale Notizen) |
| Naechste To-dos | Nicht vorhanden (Goals existieren, aber nicht als "naechste Aktion") |

### F. Match- und Leistungsanalyse

| Aspekt | Status |
|---|---|
| Matchdokumentation | Teilweise (MatchPlan mit Sets) |
| Satz-/Spielverlauf | Vorhanden (MatchSet mit Score) |
| Schussquote/Fangquote | Nicht vorhanden |
| Wiederkehrende Fehler | Nicht vorhanden |
| Muster gegen Gegnertypen | Nicht vorhanden |
| Vergleich Training vs. Wettkampf | Nicht vorhanden |

---

## 4. Bewertung von UX / Nutzerfuehrung im Trainingsalltag

### Typische Nutzungssituationen -- Bewertung

#### "Schnell vor dem Training eine Session vorbereiten"
**Aktuell**: Train -> Session erstellen -> Drills einzeln auswaehlen -> Spieler auswaehlen -> Speichern
**Problem**: Mindestens 8-10 Klicks. Kein "Letzte Session wiederholen". Kein "Session fuer Spieler X mit Fokus Passspiel erstellen" als Schnellaktion.
**Empfehlung**: Quick-Create mit 1-Klick-Vorlagen. "Training fuer [Spieler] mit Fokus [Kategorie]" als One-Tap-Action.

#### "Waehrend des Trainings Uebungen auswaehlen"
**Aktuell**: Drill-Selector mit Suche und Difficulty-Filter funktioniert gut.
**Problem**: Kein Bezug zum aktuellen Spieler oder dessen Schwaechen. Ein Trainer will sehen: "Welche Drills passen zu den Schwaechen von Spieler X?"
**Empfehlung**: Drill-Empfehlungen basierend auf Spielerprofil.

#### "Spontan Coaching-Notizen erfassen"
**Aktuell**: Nur ueber Spieler -> Detail -> QuickNote erreichbar.
**Problem**: Zu tief vergraben. Am Tisch will man 2 Taps: Spieler waehlen, Notiz tippen, fertig.
**Empfehlung**: Globale Quick-Note-Action (FAB oder Shortcut auf Dashboard).

#### "Nach dem Training Erkenntnisse dokumentieren"
**Aktuell**: SessionRating nach Session-Save (wenn Spieler zugewiesen). Manuell Notizen schreiben.
**Problem**: Kein strukturierter Retrospektive-Flow ("Was lief gut? Was muss besser werden? Fokus fuer naechstes Mal?").
**Empfehlung**: Session-Review-Wizard nach jeder Session.

#### "Fuer einen Spieler Trainingsschwerpunkte festlegen"
**Aktuell**: Spieler -> Detail -> Trainingsziele anlegen (Goal mit Kategorie).
**Problem**: Ziele sind isoliert. Es gibt keinen Weg von "Ziel: Passspiel verbessern" zu "Sessions mit Passspiel-Drills".
**Empfehlung**: Von Goal direkt Session oder Trainingsplan generieren.

#### "Ueber mehrere Sessions Fortschritte nachvollziehen"
**Aktuell**: ProgressView zeigt SVG-Mini-Charts pro Skill.
**Problem**: Evaluationen muessen manuell erstellt werden. Kein automatischer Fortschritt aus Session-Ergebnissen.
**Empfehlung**: Session-Bewertungen automatisch in Fortschritts-Timeline einspeisen.

#### "Auf dem Smartphone am Tisch arbeiten"
**Aktuell**: Responsive via Tailwind, aber nicht mobile-first optimiert.
**Problem**: Navigation hat 7 Tabs (Lernen, Training, Matchplan, Taktik, Spieler, Analyse) -- auf iPhone SE passen die nicht. Kleine Touch-Targets. Keine Bottom-Navigation.
**Empfehlung**: Mobile-Bottom-Bar mit 4-5 Hauptbereichen. Burger-Menu fuer Rest.

### Groesste UX-Hindernisse

1. **Zu viele gleichrangige Navigationspunkte** (7 Tabs) ohne klare Hierarchie
2. **Kein globaler Schnellzugriff** auf haeufige Aktionen (Notiz, Session starten, Bewertung)
3. **Kein kontextbezogener Einstieg** ("Was sollte ich heute mit Spieler X trainieren?")
4. **Sub-Views nicht per URL erreichbar** (alles lokaler State, kein Deep-Linking)
5. **Spieler und Training sind getrennte Welten** -- ein Trainer denkt aber spielerzentriert

### Wichtigste UX Quick Wins

1. **Dashboard als echter Coaching-Hub**: "Naechste Session", "Offene Ziele", "Letzte Notizen" statt Feature-Karten
2. **Globale Quick-Actions**: Floating Action Button oder Shortcut-Bar fuer Notiz/Session/Bewertung
3. **Bottom-Navigation auf Mobile**: 4 Tabs (Home, Training, Spieler, Mehr)
4. **Spielerzentrische Session-Erstellung**: "Training fuer [Spieler]" als primaerer Einstieg
5. **Verbindung Ziel -> Training**: Von einem Spieler-Ziel direkt zur passenden Session/zum Plan navigieren

---

## 5. Bewertung der technischen Architektur

### A. Komponentenstruktur

**Staerken**:
- 13 konsistente UI-Primitiven (Button, Badge, Card, Input, Textarea, Select, FormField, Modal, ConfirmDialog, EmptyState, Tabs, SearchBar, SimpleBarChart)
- Feature-Slicing mit klarer Trennung

**Schwaechen**:
- Keine wiederverwendbaren Domain-Komponenten (PlayerCard, DrillCard, SessionCard, GoalCard, NoteCard). Jedes Feature baut seine eigenen Card-Layouts
- Kein StatsPanel, kein FilterBar, kein QuickActionBar als Muster
- SkillRadar ist in `/features/players/` -- sollte in `/components/domain/` sein, da es in Analytics wiederverwendet wird

### B. State-Struktur

**Staerken**:
- Zustand mit Persist -- einfach, funktional
- Zod-Schemas fuer Migration
- Selektoren fuer Spieler-bezogene Daten

**Schwaechen**:
- **Monolithischer Store**: Ein einziger Zustand mit 13 Arrays und 30+ Actions. Bei Wachstum wird das unwartbar
- **Kein UI-State vs. Data-State Trennung**: Alles ist persistiert. Filter, Suchbegriffe, aktive Tabs koennten in separatem transientem Store sein
- **Keine Slice-Architektur**: Alle Actions sind in einer riesigen Funktion
- **`isFavorite` als Action statt Selektor**: Verstaendnisfehler in der Store-API
- **Kein Cascading Delete**: Spieler loeschen hinterlaesst verwaiste Goals, Evaluationen, Notizen, Team-Referenzen

### C. Datenmodell

**Kritische Probleme**:

1. **Session-Modell divergiert**: `domain/models/Session.ts` hat 6 Felder, der Store definiert 10 Felder. Components importieren aus dem Store, nicht aus dem Modell. Das Modell ist de facto tot.

2. **SessionTemplate doppelt definiert**: In `domain/models/TrainingPlan.ts` (ohne id, mit estimatedDuration) und in `store/useAppStore.ts` (mit id, ohne estimatedDuration). Zwei inkompatible Definitionen desselben Konzepts.

3. **Player doppelt definiert**: Sowohl in `domain/models/Player.ts` als auch im Store. Aktuell identisch, aber ein Wartungsproblem.

4. **Barrel-Export veraltet**: `domain/models/index.ts` exportiert nur die urspruenglichen 4 Modelle. Player, Goal, Evaluation, CoachingNote, TrainingPlan, Team fehlen.

5. **Keine referentielle Integritaet**: Loeschen eines Spielers hinterlaesst seine ID in Sessions, Goals, Teams, etc.

6. **`focusSkill` auf Drill ist Freitext**: Keine strukturierte Verbindung zu Category oder Coach Cards. Matching erfolgt per Substring.

### D. Navigation

**Aktuell**: 7 gleichrangige Top-Level-Tabs + Home
- / -> HomePage
- /learn -> LearnMode
- /train -> TrainMode
- /plan -> PlanMode
- /board -> BoardMode
- /players -> PlayersMode
- /analytics -> AnalyticsMode

**Problem**: Zu flach und zu breit. 7 Tabs sind auf Mobile nicht handhabbar. Sub-Views innerhalb von Features sind nicht per URL erreichbar (alles lokaler `useState`).

**Fehlende Querverbindungen**: Die Cross-Links (Card -> Drill, Plan -> Board, Home -> Features) sind ein guter Anfang, aber es fehlen die wichtigsten:
- Spieler -> "Training starten" (direkt Session fuer diesen Spieler)
- Ziel -> "Passende Drills anzeigen"
- Session -> "Spieler bewerten" (nur nach Speichern, nicht nachtraeglich)
- Match -> Board-Szene einbetten

### E. Skalierbarkeit

Die App funktioniert mit wenigen Eintraegen. Bei realistischem Coaching-Einsatz (20+ Spieler, 100+ Sessions, 500+ Notizen):

- **Listen werden unuebersichtlich**: SearchBar hilft, aber es fehlen echte Paginierung und Sortieroptionen
- **Store wird langsam**: Alles liegt in einem JSON-Blob im localStorage. Bei >1MB wird `JSON.parse` bei jedem Seitenaufruf merkbar
- **Evaluationen skalieren schlecht**: Jede Bewertung ist ein eigenes Objekt mit 7 SkillRatings. 20 Spieler x 50 Sessions = 1000 Evaluation-Objekte
- **Kein Archivierungskonzept**: Alte Sessions, abgeschlossene Ziele, vergangene Matches -- alles bleibt im aktiven Datenbestand

---

## 6. Empfohlene Zielarchitektur

### Feature-Module

```
/src
  /app                        -- App.tsx, ErrorBoundary, routes
  /components
    /ui                       -- Button, Card, Badge, Input, Modal, etc. (generisch)
    /domain                   -- PlayerCard, DrillCard, SessionCard, SkillRadar, NoteCard
    /layout                   -- Layout, BottomNav, TopBar, QuickActions
  /features
    /dashboard                -- Coaching-Hub, heutige Aufgaben, letzte Aktivitaet
    /players                  -- Spieler CRUD, Profil, Ziele, Fortschritt
    /teams                    -- Doppelpaarungen, Rollen, gemeinsame Ziele
    /drills                   -- Drill-Bibliothek (Default + Custom), Filter, Editor
    /training                 -- Session-Builder, Timer, Journal, Plaene
    /coaching                 -- Notizen, Evaluationen, Beobachtungen
    /matches                  -- Match-Planung, Ergebnisse, Analyse
    /board                    -- Taktikboard (Canvas, Szenen)
    /learn                    -- Coach Cards Bibliothek
    /analytics                -- Charts, Vergleiche, Trends
  /domain
    /models                   -- TypeScript Interfaces (Single Source of Truth)
    /schemas                  -- Zod-Schemas
    /logic                    -- Pure Business-Logik
    /constants                -- Enums, Labels, Farben
  /store
    /slices                   -- playerSlice, sessionSlice, drillSlice, etc.
    useAppStore.ts            -- Compose slices
    migration.ts              -- Versionierung, Migration
  /hooks                      -- useTimer, useLocalStorage, etc.
  /utils                      -- print, formatters, etc.
  /types                      -- Shared TypeScript-Typen
```

### Begruendung der wichtigsten Aenderungen

1. **Drills als eigenes Feature-Modul trennen**: Drills sind aktuell in `/train` versteckt, werden aber in Learn, Players, Analytics referenziert. Sie verdienen ein eigenes Modul.

2. **Training und Coaching trennen**: `train` hat aktuell 8 Views mit 12+ Komponenten. Training (planen, ausfuehren) und Coaching (bewerten, beobachten) sind verschiedene Aktivitaeten.

3. **Matches aus Plan extrahieren**: MatchPlan mischt Vorbereitung und Ergebnis. "Plan" und "Match" sollten getrennte Konzepte sein.

4. **Dashboard statt HomePage**: Die aktuelle HomePage ist eine Feature-Werbung. Sie sollte ein Coaching-Hub werden.

5. **Store in Slices aufteilen**: Der monolithische Store mit 30+ Actions sollte in fachliche Slices aufgeteilt werden (Zustand `immer` middleware oder manuelle Slice-Komposition).

6. **Domain-Komponenten einfuehren**: PlayerCard, DrillCard, etc. werden ueber Feature-Grenzen hinweg gebraucht.

---

## 7. Konkrete Roadmap

### A. Kurzfristig (1-3 Wochen) -- Fundament schaerfen

**Prioritaet 1: Domaenenmodell bereinigen**
- Session-Modell synchronisieren (model = schema = store)
- SessionTemplate-Divergenz aufloesen
- Player aus Store-Datei entfernen, nur aus domain/models importieren
- models/index.ts Barrel-Export vervollstaendigen
- `isFavorite` aus dem State in einen Selektor verschieben
- Cascading Delete implementieren (Spieler loeschen -> Goals, Evals, Notes, Team-Refs bereinigen)

**Prioritaet 2: Coaching-Zyklus als UX-Flow verdrahten**
- Spieler-Detail: "Training starten" Button -> oeffnet SessionBuilder mit Spieler vorausgewaehlt
- Spieler-Detail: "Ziel erreichen" -> zeigt automatisch relevante Evaluationen
- Goal: "Passende Drills" -> filtert Drill-Bibliothek nach Kategorie des Ziels
- Session-Journal: "Bewertung nachtragen" Button auf vergangenen Sessions

**Prioritaet 3: Mobile-Navigation**
- Bottom-Navigation mit 4 Tabs: Home, Training, Spieler, Mehr
- "Mehr"-Menu fuer: Taktik, Matchplan, Learn, Analytics, Settings
- Globaler FAB fuer Quick-Actions: Notiz, Session, Bewertung

**Prioritaet 4: Dashboard als Coaching-Hub**
- Heutige/naechste Session (aus TrainingPlan oder letzte Vorlage)
- Offene Spieler-Ziele
- Letzte 3 Coaching-Notizen
- Schnellzugriff auf haeufige Spieler
- Session-Streak / Trainingsfrequenz

### B. Mittelfristig (4-8 Wochen) -- Fachlichkeit vertiefen

**Prioritaet 5: Technik als Domaenenobjekt**
- Technique-Modell: `{ id, name, category, difficulty, description, measurableGoal, relatedDrillIds, relatedCardIds }`
- Spieler-Technik-Zuordnung: "beherrscht", "in Arbeit", "nicht gelernt"
- Technik-Fortschritt ueber Evaluationen messen

**Prioritaet 6: Session-Ergebnisse**
- DrillResult in Session: `{ drillId, completedBlocks, notes, successRate?, repetitions? }`
- Wiederholungsbasierte Blocks neben zeitbasierten Blocks
- Session-Retrospektive-Wizard: "Was lief gut? Was muss besser werden?"

**Prioritaet 7: Match als eigenes Objekt**
- Match-Modell (getrennt von MatchPlan): `{ id, planId?, opponent, date, sets, result, playerIds, observations, notes }`
- Match-Beobachtungen: strukturiert pro Spieler, pro Satz
- Win/Loss-Tracking pro Spieler und Team

**Prioritaet 8: Drill-Bibliothek professionalisieren**
- Alle Modellfelder in UI verfuegbar machen: position, playerCount, prerequisites, variations, measurableGoal
- Drill-Empfehlungen basierend auf Spieler-Schwaechen
- Phasen-Einteilung: Aufwaermen / Hauptteil / Cool-Down Tags

**Prioritaet 9: Store in Slices aufteilen**
- `createPlayerSlice`, `createSessionSlice`, `createDrillSlice`, etc.
- Sauber getrennte Actions und Selektoren pro Domaenobjekt
- Cascading-Delete-Logik in Slice-uebergreifenden Actions

### C. Langfristig (9-16 Wochen) -- Plattform-Qualitaet

**Prioritaet 10**: Statistik- und Analyse-Module (Trefferquoten-Tracking, Session-Heatmap, Drill-Effectiveness)
**Prioritaet 11**: Trainingsempfehlungen ("Spieler X sollte heute Passspiel trainieren basierend auf letzter Bewertung")
**Prioritaet 12**: Export/Import (PDF-Trainingsplaene, CSV-Statistiken, JSON-Backup/Restore)
**Prioritaet 13**: Offline-First / PWA mit Service Worker
**Prioritaet 14**: Optionaler Cloud-Sync / Multi-Device
**Prioritaet 15**: Video-/Media-Anbindung (Clips an Drills oder Evaluationen)
**Prioritaet 16**: KI-gestuetzte Hinweise ("Basierend auf den letzten 5 Sessions empfehle ich...")

### Was bewusst NICHT gebaut werden sollte (jetzt)

- **Turnierverwaltung**: Bracket-Builder, Gruppenphasen -- zu komplex, zu wenig Nutzwert im Alltag
- **Multi-User / Rollenmodell**: Coach, Spieler, Admin -- erst wenn Cloud-Sync existiert
- **Echtzeit-Statistik-Erfassung**: Live-Tracking waehrend Matches -- zu aufwaendig, fraglicher Nutzen
- **Soziale Features**: Teilen, Kommentare, Feed -- nicht der Produktkern
- **Gamification**: Badges, Streaks, Level-Up -- Ablenkung vom Coaching-Fokus

---

## 8. Fachliche Aspekte, die zusaetzlich beruecksichtigt werden sollten

### Kickerspezifische Technikdimensionen

Die App sollte perspektivisch diese Dimensionen pro Technik erfassen koennen:

| Dimension | Beispiel | Datentyp |
|---|---|---|
| Ausfuehrungsseite | rechts / links / beide | enum |
| Stange | 3er / 5er / 2er / Torwart | enum |
| Variante | Pin-Shot offen / geschlossen / mit Finte | string |
| Serienfaehigkeit | 8 von 10 Treffern | number (success rate) |
| Unter Druck | Ausfuehrung im Match vs. Training | enum |
| Tempo | langsam / mittel / schnell | enum |
| Praezision | Zielbereich getroffen? | boolean / rate |

### Taktikdimensionen fuer Doppel

Fuer Doppeltraining ist besonders relevant:
- Rollenverteilung (wer spielt Sturm, wer Abwehr)
- Kommunikationsmuster ("Halt!", "Durch!", "Meine!")
- Absprachen bei Standardsituationen
- Wechsel-Strategien (wer wechselt wann die Position)

### Trainingsphasen

Eine realistische Trainings-Session im Kickern hat typischerweise:
1. **Aufwaermen** (5-10 min): Ballgefuehl, lockeres Spiel
2. **Technikblock** (15-25 min): Gezieltes Uebenm einer Technik
3. **Spielform** (10-20 min): Anwendung im Spiel / Simulation
4. **Reflexion** (5 min): Was lief gut, was nicht?

Diese Phasenstruktur sollte im Session-Builder abbildbar sein.

---

## 9. Vorschlag fuer ein verbessertes Domaenenmodell

### Neue und ueberarbeitete Kernmodelle

```typescript
// ── SPIELER ────────────────────────────────────────────
interface Player {
  id: string;
  name: string;
  nickname?: string;
  preferredPositions: RodPosition[];  // Mehrere statt eine
  level: DifficultyLevel;
  notes: string;
  skillRatings: Record<Category, number>;  // 1-5 Uebersicht
  avatarColor?: string;
  isActive: boolean;                  // NEU: aktiv/archiviert
  createdAt: string;
}

// ── TECHNIK (NEU) ──────────────────────────────────────
interface Technique {
  id: string;
  name: string;                       // z.B. "Pin-Shot"
  category: Category;
  difficulty: DifficultyLevel;
  description: string;
  rodPositions: RodPosition[];        // Auf welchen Stangen relevant
  measurableGoal?: string;            // z.B. "8/10 Treffer"
  relatedDrillIds: string[];
  relatedCardIds: string[];           // Coach Card IDs
  tags: string[];
}

// ── SPIELER-TECHNIK-ZUORDNUNG (NEU) ────────────────────
interface PlayerTechnique {
  playerId: string;
  techniqueId: string;
  status: "not_started" | "learning" | "developing" | "proficient" | "mastered";
  currentSuccessRate?: number;        // 0-100
  lastPracticedAt?: string;
  notes?: string;
}

// ── DRILL (ueberarbeitet) ──────────────────────────────
interface Drill {
  id: string;
  name: string;
  description?: string;
  category?: Category;
  difficulty?: DifficultyLevel;
  phase: "warmup" | "technique" | "game" | "cooldown";  // NEU
  targetPositions: RodPosition[];     // NEU (statt einzelnes position)
  playerCount: 1 | 2;
  blocks: TrainingBlock[];
  techniqueIds: string[];             // NEU: Welche Techniken werden trainiert
  measurableGoal?: string;
  variations: string[];
  prerequisites: string[];
  isCustom: boolean;
  tags: string[];                     // NEU
}

interface TrainingBlock {
  type: "timed" | "repetitions";      // NEU: reps-basiert
  durationSeconds?: number;           // fuer timed
  repetitions?: number;               // NEU: fuer repetitions
  note: string;
}

// ── SESSION (ueberarbeitet) ────────────────────────────
interface TrainingSession {
  id: string;
  name: string;
  date: string;
  playerIds: string[];
  planId?: string;                    // NEU: Referenz zum TrainingPlan
  drillResults: DrillResult[];        // NEU: statt nur drillIds
  focusAreas: Category[];
  phase: "planned" | "in_progress" | "completed";  // NEU
  rating?: number;
  notes: string;
  retrospective?: SessionRetrospective;  // NEU
  totalDuration: number;
  createdAt: string;
}

interface DrillResult {               // NEU
  drillId: string;
  completed: boolean;
  blocksCompleted: number;
  successRate?: number;               // 0-100
  notes?: string;
}

interface SessionRetrospective {      // NEU
  whatWentWell: string;
  whatToImprove: string;
  focusNextTime: string;
}

// ── MATCH (NEU, getrennt von MatchPlan) ────────────────
interface Match {
  id: string;
  planId?: string;                    // Optional: Bezug zum MatchPlan
  opponent: string;
  date: string;
  matchType: "singles" | "doubles";
  playerIds: string[];
  teamId?: string;                    // Bei Doppel
  sets: MatchSet[];
  result?: "win" | "loss" | "draw";
  observations: MatchObservation[];   // NEU
  notes: string;
  createdAt: string;
}

interface MatchObservation {          // NEU
  id: string;
  matchId: string;
  playerId?: string;
  setNumber?: number;
  category: "strength" | "weakness" | "pattern" | "mistake" | "tactical";
  text: string;
  timestamp?: string;
}

// ── COACHING NOTE (ueberarbeitet) ──────────────────────
interface CoachingNote {
  id: string;
  playerId?: string;
  sessionId?: string;
  matchId?: string;                   // NEU: statt matchPlanId
  date: string;
  category: "tactical" | "technical" | "mental" | "communication" | "physical";  // NEU: physical
  priority: "low" | "medium" | "high";  // NEU
  text: string;
  actionItems: string[];              // NEU: konkrete naechste Schritte
  createdAt: string;
}

// ── EVALUATION (ueberarbeitet) ─────────────────────────
interface Evaluation {
  id: string;
  playerId: string;
  sessionId?: string;
  matchId?: string;                   // NEU
  date: string;
  type: "session" | "match" | "general";  // NEU
  skillRatings: SkillRating[];
  techniqueRatings?: TechniqueRating[];   // NEU
  overallRating?: number;             // NEU: 1-5 Gesamteindruck
  notes: string;
  createdAt: string;
}

interface TechniqueRating {           // NEU
  techniqueId: string;
  rating: number;                     // 1-5
  successRate?: number;               // 0-100
  comment?: string;
}

// ── TEAM (ueberarbeitet) ──────────────────────────────
interface Team {
  id: string;
  name: string;
  playerIds: [string, string];
  roles?: {                           // NEU
    [playerId: string]: "offense" | "defense" | "flex";
  };
  strengths?: string[];               // NEU
  weaknesses?: string[];              // NEU
  notes?: string;
  isActive: boolean;                  // NEU
  createdAt: string;
}

// ── GOAL (ueberarbeitet) ──────────────────────────────
interface Goal {
  id: string;
  playerId: string;
  teamId?: string;                    // NEU: Team-Ziele
  title: string;
  description?: string;
  category: Category;
  techniqueId?: string;               // NEU: Technik-bezogenes Ziel
  targetValue?: number;               // NEU: Messbarer Zielwert
  currentValue?: number;              // NEU: Aktueller Stand
  targetDate?: string;
  status: "active" | "achieved" | "paused" | "abandoned";  // NEU: abandoned
  createdAt: string;
}
```

### Beziehungen (vereinfacht)

```
Player ──< PlayerTechnique >── Technique
Player ──< Goal
Player ──< Evaluation
Player ──< CoachingNote
Player ──< TrainingSession.playerIds
Player ──< Match.playerIds
Player ──< Team.playerIds

Technique ──< Drill.techniqueIds
Technique ──< PlayerTechnique
Technique ──< TechniqueRating

Drill ──< DrillResult.drillId
Drill ──< TrainingSession (via DrillResult)

TrainingSession ──< DrillResult
TrainingSession ──< Evaluation.sessionId
TrainingSession ──< CoachingNote.sessionId
TrainingSession ──? TrainingPlan.planId

Match ──< MatchObservation
Match ──< Evaluation.matchId
Match ──< CoachingNote.matchId
Match ──? MatchPlan.planId
Match ──? Team.id

Goal ──? Technique.id
Goal ──? Player.id
Goal ──? Team.id
```

### Was jetzt notwendig ist vs. spaeter

| Modell | Jetzt | Spaeter |
|---|---|---|
| Player (ueberarbeitet) | Ja | - |
| Technique | Ja | - |
| PlayerTechnique | Ja | - |
| Drill (ueberarbeitet) | Ja | - |
| TrainingSession (ueberarbeitet) | Ja | - |
| DrillResult | Ja | - |
| SessionRetrospective | Ja | - |
| Match (getrennt) | Ja | - |
| MatchObservation | Mittelfristig | - |
| CoachingNote (ueberarbeitet) | Ja | - |
| Evaluation (ueberarbeitet) | Mittelfristig | - |
| TechniqueRating | - | Spaeter |
| Goal (ueberarbeitet) | Ja | - |
| Team (ueberarbeitet) | Mittelfristig | - |
| CoachProfile | - | Spaeter (erst mit Multi-User) |
| MediaAsset | - | Spaeter (erst mit Video-Feature) |
| Tournament | - | Viel spaeter oder nie |
| StatisticEntry | - | Spaeter (abgeleitete Daten, nicht eigenes Modell) |

---

## 10. Risiken und Sackgassen

### Hohe Risiken

1. **Feature-Sprawl ohne Coaching-Kern**: Die App hat 7 Feature-Bereiche, aber keinen kohaerenten Workflow. Jedes neue Feature macht dies schlimmer, wenn der Kern nicht zuerst geschaerft wird.

2. **Domaenenmodell-Drift**: Session, SessionTemplate und Player haben bereits divergierende Definitionen. Ohne Bereinigung wird jedes kuenftige Feature auf wackeligen Fundamenten bauen.

3. **localStorage-Limit**: Bei intensiver Nutzung (100+ Sessions, 500+ Notizen, Evaluationen) wird das ~5MB localStorage-Limit zum Problem. Es gibt keinen Fallback oder Warnung.

4. **Keine referentielle Integritaet**: Spieler loeschen, aber Goals/Evals/Notes bleiben -- fuehrt zu Ghost-Daten und UI-Fehlern.

### Mittlere Risiken

5. **Mobile-Unbrauchbarkeit**: 7 Header-Tabs auf einem Smartphone. Ohne Mobile-First-Redesign wird die App am Tisch (dem primaeren Einsatzort!) nicht nutzbar sein.

6. **Monolithischer Store**: 30+ Actions in einer Datei. Bei weiterem Wachstum wird die Wartbarkeit zum Problem.

7. **Teams als totes Feature**: Teams existieren, werden aber nirgends genutzt. Das schafft falsche Erwartungen beim Nutzer.

8. **Content-Code-Kopplung**: 48 Coach Cards und 20 Drills sind TypeScript-Arrays. Inhaltliche Aenderungen erfordern Entwickler-Deployment.

### Sackgassen

9. **MatchPlan als "Match + Plan"**: Wenn Matches spaeter separiert werden sollen, ist die Migration der bestehenden MatchPlan-Daten nicht trivial.

10. **focusSkill als Freitext**: Jede Drill-Kategorisierung, die auf Substring-Matching basiert, wird bei wachsendem Drill-Katalog brechen.

---

## 11. Priorisierte Handlungsempfehlungen

### Top 5 Architekturentscheidungen

1. **Domaenenmodell als Single Source of Truth etablieren**: Alle Typen ausschliesslich in `domain/models/` definieren. Store importiert nur, definiert nicht.
2. **Store in Slices aufteilen**: Je ein Slice fuer Players, Sessions, Drills, Coaching, Matches.
3. **URL-basiertes Routing fuer Sub-Views**: Statt `useState<View>` in Feature-Roots echte Routes verwenden (`/players/:id`, `/train/session/:id`).
4. **Cascading Delete implementieren**: Beim Loeschen eines Spielers alle Referenzen bereinigen.
5. **Mobile-First Bottom-Navigation**: 4 primaere Tabs statt 7 Header-Tabs.

### Top 5 fachliche Modellierungen

1. **Technique als eigenes Domaenenobjekt**: Die Bruecke zwischen Coach Cards, Drills und Spieler-Faehigkeiten.
2. **DrillResult in Sessions**: Nicht nur welche Drills, sondern wie sie liefen.
3. **Match getrennt von MatchPlan**: Planung und Ergebnis sind verschiedene Aktivitaeten.
4. **SessionRetrospective**: Strukturierte Reflexion nach jeder Session.
5. **Goal mit messbarem Fortschritt**: `targetValue` / `currentValue` statt nur "active/achieved" Toggle.

### Top 5 UX-Verbesserungen

1. **Dashboard als Coaching-Hub**: Heutige Session, offene Ziele, letzte Notizen, Quick-Actions.
2. **Spielerzentrische Session-Erstellung**: "Training fuer [Spieler X]" als primaerer Flow.
3. **Globale Quick-Note**: Von ueberall aus maximal 2 Taps zur Coaching-Notiz.
4. **Verbindung Ziel -> Training -> Auswertung**: Der Coaching-Zyklus als durchgaengiger UX-Flow.
5. **Bottom-Navigation auf Mobile**: 4 Tabs, die am Tisch mit einer Hand bedienbar sind.

### Features, die sich wirklich als naechstes lohnen

1. Coaching-Zyklus-Flow (Spieler -> Ziel -> Training -> Auswertung)
2. Session-Retrospektive (strukturierte Nachbereitung)
3. Technique-Modell mit Spieler-Zuordnung
4. Mobiles Navigationslayout
5. Dashboard-Redesign als Coaching-Hub

### Was bewusst noch NICHT gebaut werden sollte

- Turnierverwaltung
- Multi-User / Rollen
- Cloud-Sync
- KI-Empfehlungen
- Video-Integration
- Gamification

---

## 12. Direkte technische Umsetzungsvorschlaege

### Quick Win 1: Domaenenmodell-Bereinigung

Sofort umsetzbar ohne Feature-Aenderungen:

1. Session-Modell in `domain/models/Session.ts` auf den tatsaechlichen Zustand aktualisieren (10 Felder statt 6)
2. `domain/models/index.ts` aktualisieren: Alle Modelle exportieren
3. Player-Definition im Store entfernen, nur aus domain importieren
4. SessionTemplate-Divergenz aufloesen: Ein einziges Interface mit allen Feldern
5. `isFavorite` aus dem Store-State in einen standalone Selektor verschieben

### Quick Win 2: Cascading Delete

```typescript
deletePlayer: (id) =>
  set((s) => ({
    players: s.players.filter((p) => p.id !== id),
    goals: s.goals.filter((g) => g.playerId !== id),
    evaluations: s.evaluations.filter((e) => e.playerId !== id),
    coachingNotes: s.coachingNotes.filter((n) => n.playerId !== id),
    teams: s.teams.filter((t) => !t.playerIds.includes(id)),
    sessions: s.sessions.map((sess) => ({
      ...sess,
      playerIds: sess.playerIds.filter((pid) => pid !== id),
    })),
  })),
```

### Quick Win 3: Homepage -> Coaching Hub

Statt der aktuellen Feature-Karten-Landingpage:
- "Heutige Session" (naechste geplante oder letzte Vorlage als Vorschlag)
- "Offene Ziele" (aktive Goals mit Spielernamen)
- "Letzte Coaching-Notizen" (chronologisch, letzte 5)
- "Schnellzugriff" (letzte 4 Spieler mit Avatar)
- Quick-Action-Buttons: "Notiz", "Session starten", "Bewertung"

### Quick Win 4: Drill-Bibliothek Felder anzeigen

Die Felder `position`, `playerCount`, `prerequisites`, `variations`, `measurableGoal` existieren im Modell, werden aber in DrillSelector und DrillEditor nicht angezeigt. Diese einfach sichtbar machen erhoecht den fachlichen Wert sofort.

---

## 13. Offene Annahmen und Risiken

### Annahmen

1. **Einzelnutzer-Szenario**: Die App wird von einem einzelnen Trainer/Spieler genutzt, nicht von einem Verein mit mehreren Coaches. Diese Annahme bestimmt, dass Multi-User und Cloud-Sync niedrig priorisiert werden.

2. **Primaerer Einsatzort: am Kickertisch + unterwegs**: Daher Mobile-First-Optimierung kritisch. Desktop ist sekundaer (Nachbereitung/Analyse).

3. **Zielgruppe: ambitionierter Trainer oder selbsttrainierender Spieler**: Nicht Gelegenheitsspieler (zu komplex) und nicht professioneller Bundesliga-Coach (zu wenig Analytics).

4. **localStorage reicht vorerst**: Fuer die naechsten 6-12 Monate ist localStorage mit 5MB ausreichend. Danach muss ueber IndexedDB oder Cloud nachgedacht werden.

5. **Kein Backend geplant**: Die App bleibt client-only. Alle Daten leben lokal. Diese Annahme beeinflusst die Priorisierung von Sync, Export und Backup massiv.

### Verbleibende offene Fragen

1. Soll die App spaeter mehrere Trainer pro Team unterstuetzen?
2. Gibt es Ambitionen fuer eine native Mobile App (React Native / Capacitor)?
3. Soll der Drill-/Card-Content von Nutzern erweiterbar sein oder bleibt er kuratiert?
4. Welche Rolle soll das Taktikboard langfristig spielen -- eigenstaendiges Tool oder integriert in Match/Training?
5. Gibt es eine Monetarisierungsstrategie, die die Feature-Priorisierung beeinflusst?

---

*Dieser Audit basiert auf einer vollstaendigen Code-Analyse aller Domaenenmodelle, Store-Logik, Feature-Module, Daten-Dateien und UI-Komponenten der KickerCoach App (Stand: 31.03.2026, Branch feature/kickercoach-evolution).*
