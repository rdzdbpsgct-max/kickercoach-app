# Kicker Coach App — Weiterentwicklungs-Design

**Datum:** 2026-03-30
**Status:** Approved
**Kontext:** Umfassender Audit der bestehenden App + Designentscheidungen

---

## Designentscheidungen

| Entscheidung | Gewählt | Alternativen verworfen |
|---|---|---|
| State-Architektur | Zustand ab Phase 1 | Zustand in Phase 2, Context-Pattern |
| Zod-Schemas | Zuerst, vor neuen Features | Parallel mit Features |
| UI-Komponenten | Erweitertes Set (10–12) | Minimal-Set (5–6), Headless UI |
| Player-Feature | Mit Skill-Profil, Verlauf später | Lean Player, Player + Verlauf |
| Typografie | Plus Jakarta Sans | Outfit, Geist Sans, System-Fonts |
| Phasenstruktur | 4 Phasen, straff (~12 Wochen) | 6 granulare Phasen, 3 Horizonte |

---

## Phase 1: Foundation (Woche 1–2)

Technisches Fundament für alles Weitere.

### 1.1 Zod + Migrations-System
- Zod als Dependency
- Schemas für alle 5 bestehenden Models: Drill, Session, CoachCard, MatchPlan, TacticalScene
- Versionierungs-Pattern mit `_version` Feld
- `migrateFromStorage<T>(key, schema, migrations)` Utility
- Automatische Migration beim ersten Laden

### 1.2 Zustand Store
- `zustand` + `persist`-Middleware
- Zentraler `useAppStore` mit Slices: players, sessions, matchPlans, boardScenes, favorites, goals
- Persist mit Zod-Validierung im Deserialize-Step
- Migration bestehender useLocalStorage-Hooks
- Selektoren: `getPlayerSessions(id)`, `getRecentActivity()`

### 1.3 UI-Komponentenbibliothek
- `src/components/ui/` mit 10–12 Komponenten:
  - Button, IconButton, Card, Badge, Input, Textarea, Select
  - FormField, Modal, ConfirmDialog, EmptyState, Tabs
- Barrel-Export
- Bestehende Features auf neue Komponenten umstellen

### 1.4 Typografie
- Plus Jakarta Sans (400, 500, 600, 700, 800)
- Font-Weight-System: 400 Body, 500 Labels, 600 Buttons, 700 Headings, 800 Hero

### 1.5 Housekeeping
- Empty States für Session-Liste, Matchplan-Liste, Favoriten
- ConfirmDialog bei allen Lösch-Aktionen
- Error-States bei fehlgeschlagener Datenvalidierung

---

## Phase 2: Core Features (Woche 3–5)

Player-Modell als Kern, Custom Drills, vernetzte Features.

### 2.1 Player-Feature
- Model: Player mit id, name, nickname, preferredPosition, level, notes, avatarColor, skillRatings (7 Kategorien × 1–5), createdAt
- Zod-Schema + Store-Slice
- Feature: PlayerList, PlayerDetail, PlayerForm, SkillRadar (CSS-only Balken)
- Navigation: 5. Tab "Spieler"
- Routes: /players, /players/:id

### 2.2 Session-Erweiterung
- Neue Felder: playerIds[], rating (1–5), focusAreas (Category[]), mood
- Schema V2 mit V1-Migration
- SessionBuilder um Player-Auswahl und Rating erweitern
- Journal zeigt Player-Zuordnung und Bewertung

### 2.3 Custom Drills
- Drill erweitern: isCustom, category, position, playerCount, prerequisites, measurableGoal
- DrillEditor-Komponente
- DrillSelector zeigt Custom + Predefined

### 2.4 Cross-Links
- Drill ↔ CoachCards (über category + focusSkill)
- MatchPlan → Taktikboard
- Session-Detail → Drills

### 2.5 Dashboard (neue HomePage)
- Letzte Session, aktive Ziele, Spieler-Übersicht
- Quick Actions
- Trainingsfrequenz (einfache Zahl)

---

## Phase 3: Coaching Intelligence (Woche 6–9)

Fortschritt, Ziele, Bewertungen, Pläne.

### 3.1 Goal/Trainingsziel
- Model: Goal (id, playerId, title, description, category, targetDate, status, createdAt)
- Goal-Liste pro Spieler, Status-Tracking

### 3.2 Evaluation/Bewertung
- Model: Evaluation (id, playerId, sessionId?, date, skillRatings[], notes)
- Post-Session-Bewertung pro Spieler
- Evaluationshistorie

### 3.3 Coaching-Notizen
- Model: CoachingNote (id, playerId?, sessionId?, matchPlanId?, date, category, text)
- Schnell-Eingabe-UI, Notizen-Feed auf Player-Detail

### 3.4 Trainingsplan
- Models: TrainingPlan, TrainingWeek, SessionTemplate
- Trainingsplan-Editor, Kalenderübersicht

### 3.5 Team-Modell
- Model: Team (id, name, playerIds[2], notes, createdAt)
- Team-Liste, -Detail, Doppel-Paarungen

### 3.6 Filter/Suche vereinheitlichen
- Einheitliches SearchFilter-Pattern auf alle Listen

### 3.7 Match-Modell erweitern
- Match mit Sets (MatchSet[]), result, coachingNotes[]
- Satz-Erfassung, automatische Ergebnisableitung

---

## Phase 4: Analytics & Polish (Woche 10–12)

Datenvisualisierung, Export, Feinschliff.

### 4.1 Analytics-Dashboard
- Trainingsfrequenz-Chart, Skill-Entwicklung, Drill-Statistiken
- SVG-basiert oder leichtgewichtige Chart-Library

### 4.2 Spieler-Vergleich
- Zwei Spieler nebeneinander, Skill-Profile vergleichen

### 4.3 Fortschritts-Tracking
- ProgressEntry (date, skillRatings), Verlaufsgraph

### 4.4 Export
- PDF/Print-CSS für Spielerprofil, Trainingsplan, Matchplan, Journal

### 4.5 Template-System
- Drill-, Session-, Matchplan-Vorlagen

### 4.6 Polish & UX
- Animationen, Onboarding, Keyboard Shortcuts, Responsive Feinschliff

---

## Abhängigkeiten

```
Phase 1 (Foundation) → Phase 2 (alle Features bauen auf Zod + Zustand + UI-Komponenten)
Phase 2 (Player + Sessions) → Phase 3 (Goals, Evaluations, Teams brauchen Player)
Phase 3 (Evaluations + Notes) → Phase 4 (Analytics braucht Datenbasis)
```

---

## Bewusst ausgeklammert

- Backend/API/Auth
- Multi-User / Rollen
- i18n / Mehrsprachigkeit
- Gamification
- Video-Einbindung
- KI-Features
- Offline-First (Service Worker)
- Native Mobile App
