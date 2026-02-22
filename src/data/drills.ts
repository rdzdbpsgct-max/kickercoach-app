import type { Drill } from "../domain/models/Drill";

export const DEFAULT_DRILLS: Drill[] = [
  // 1. Pull-Shot Basics (beginner, 3 blocks)
  {
    id: "drill-pull-shot-basics",
    name: "Pull-Shot Basics",
    focusSkill: "Pull-Shot / Ziehen",
    blocks: [
      {
        type: "work",
        durationSeconds: 60,
        note: "Ball mittig auf der 3er-Stange positionieren und langsam Pull-Shot-Bewegung ueben. Fokus auf saubere seitliche Mitnahme.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Kurze Pause. Handgelenk lockern und Griffhaltung pruefen.",
      },
      {
        type: "work",
        durationSeconds: 90,
        note: "Pull-Shot mit Schuss ausfuehren. Abwechselnd langes und kurzes Loch anvisieren.",
      },
    ],
  },

  // 2. Push-Shot Basics (beginner, 3 blocks)
  {
    id: "drill-push-shot-basics",
    name: "Push-Shot Basics",
    focusSkill: "Push-Shot / Schieben",
    blocks: [
      {
        type: "work",
        durationSeconds: 60,
        note: "Ball auf der 3er-Stange positionieren und Push-Bewegung langsam nach rechts ueben. Handflaeche offen, Kontrolle halten.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Pause. Lockerungsuebung fuer Unterarm und Handgelenk.",
      },
      {
        type: "work",
        durationSeconds: 90,
        note: "Push-Shot im Wechsel auf langes und kurzes Loch schiessen. Geschwindigkeit langsam steigern.",
      },
    ],
  },

  // 3. Pin-Shot Training (intermediate, 4 blocks)
  {
    id: "drill-pin-shot",
    name: "Pin-Shot Training",
    focusSkill: "Pin-Shot / Abroller",
    blocks: [
      {
        type: "work",
        durationSeconds: 60,
        note: "Ball auf der 3er-Stange pinnen (Vorderseite). Pinning-Position halten und Gefuehl fuer den Druck entwickeln.",
      },
      {
        type: "rest",
        durationSeconds: 20,
        note: "Kurze Erholung. Griff locker halten und Schultern entspannen.",
      },
      {
        type: "work",
        durationSeconds: 90,
        note: "Pin-Shot ausfuehren: Ball gepinnt halten, seitlich versetzen und per Handgelenkrotation abschiessen. Ziel: gerade Loecher.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Regeneration. Mental das Timing der Bewegung durchgehen.",
      },
    ],
  },

  // 4. Jet/Snake Intensive (advanced, 5 blocks)
  {
    id: "drill-jet-snake",
    name: "Jet / Snake Intensive",
    focusSkill: "Jet-Shot (Snake)",
    blocks: [
      {
        type: "work",
        durationSeconds: 45,
        note: "Ball vorne pinnen und nur die Rollbewegung ueben. Handflaeche ueber den Griff rollen, ohne abzuschiessen.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Kurze Pause. Auf korrekte Koerperhaltung achten.",
      },
      {
        type: "work",
        durationSeconds: 90,
        note: "Jet-Shot komplett ausfuehren: Pinnen, laterale Bewegung, Abroller-Schuss. Auf geraden Schuss achten.",
      },
      {
        type: "rest",
        durationSeconds: 20,
        note: "Erholung. Handgelenk dehnen und Griff neu einstellen.",
      },
      {
        type: "work",
        durationSeconds: 120,
        note: "Jet-Shot unter Druck: Abwechselnd langes und kurzes Loch anvisieren. Fake-Bewegungen einbauen und Tempo variieren.",
      },
    ],
  },

  // 5. 5er-Reihe Tic-Tac (intermediate, 4 blocks)
  {
    id: "drill-5er-tic-tac",
    name: "5er-Reihe Tic-Tac",
    focusSkill: "Mittelfeld-Passspiel",
    blocks: [
      {
        type: "work",
        durationSeconds: 60,
        note: "Ball auf der 5er-Reihe hin und her passen (Tic-Tac). Rhythmus aufbauen, Ball flach halten.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Pause. Beide Haende kurz schuetteln.",
      },
      {
        type: "work",
        durationSeconds: 90,
        note: "Tic-Tac mit Abschluss kombinieren: Nach 3-5 Paessen direkt durchschiessen. Timing und Luecken erkennen.",
      },
      {
        type: "rest",
        durationSeconds: 20,
        note: "Erholung. Strategie reflektieren: Welche Luecken waren offen?",
      },
    ],
  },

  // 6. Brush-Pass Technik (advanced, 4 blocks)
  {
    id: "drill-brush-pass",
    name: "Brush-Pass Technik",
    focusSkill: "Brush-Pass / Schraeganspiel",
    blocks: [
      {
        type: "work",
        durationSeconds: 60,
        note: "Brush-Pass von der 5er-Reihe auf die 3er-Reihe ueben. Ball seitlich anschneiden, um Bande zu umgehen.",
      },
      {
        type: "rest",
        durationSeconds: 20,
        note: "Pause. Fingerposition und Druck auf den Griff kontrollieren.",
      },
      {
        type: "work",
        durationSeconds: 90,
        note: "Brush-Pass im Wechsel: Einmal Wandpass, einmal gerader Pass. Annehmen auf der 3er und direkt kontrollieren.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Kurze Erholung. Fokus auf praezise Ausfuehrung statt Geschwindigkeit.",
      },
    ],
  },

  // 7. Bandenpass Drill (beginner, 3 blocks)
  {
    id: "drill-bandenpass",
    name: "Bandenpass Drill",
    focusSkill: "Bandenpass / Wandspiel",
    blocks: [
      {
        type: "work",
        durationSeconds: 60,
        note: "Ball ueber die Bande von der 5er-Reihe zur 3er-Reihe passen. Winkel und Haerte anpassen.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Pause. Ball repositionieren und Griffhaltung korrigieren.",
      },
      {
        type: "work",
        durationSeconds: 90,
        note: "Bandenpaesse abwechselnd auf linke und rechte Seite spielen. Auf saubere Ballannahme auf der 3er achten.",
      },
    ],
  },

  // 8. Ballkontrolle Basics (beginner, 4 blocks)
  {
    id: "drill-ballkontrolle",
    name: "Ballkontrolle Basics",
    focusSkill: "Ballannahme & Kontrolle",
    blocks: [
      {
        type: "work",
        durationSeconds: 45,
        note: "Ball von der 5er zur 3er passen und sauber stoppen. Figur leicht schraeg stellen, um den Ball abzufangen.",
      },
      {
        type: "rest",
        durationSeconds: 10,
        note: "Kurze Pause.",
      },
      {
        type: "work",
        durationSeconds: 60,
        note: "Ball auf der 3er-Stange vor und zurueck rollen. Wechsel zwischen Pin vorne und Pin hinten ueben.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Erholung. Fokus: Immer den Ball unter Kontrolle haben, bevor der naechste Zug kommt.",
      },
    ],
  },

  // 9. Defensive Shuffle (intermediate, 4 blocks)
  {
    id: "drill-defensive-shuffle",
    name: "Defensive Shuffle",
    focusSkill: "Defensivarbeit / Abwehr",
    blocks: [
      {
        type: "work",
        durationSeconds: 60,
        note: "2er-Reihe (Abwehr) schnell hin und her bewegen. Luecken schliessen, die ein Gegner ausnutzen koennte.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Pause. Arme lockern.",
      },
      {
        type: "work",
        durationSeconds: 90,
        note: "Shuffle-Drill: Abwehr und Torwart gleichzeitig verschieben. Koordination beider Haende trainieren.",
      },
      {
        type: "rest",
        durationSeconds: 20,
        note: "Erholung. Beide Stangen gleichmaessig und ruhig bewegen koennen ist das Ziel.",
      },
    ],
  },

  // 10. Torwart Reaktion (intermediate, 5 blocks)
  {
    id: "drill-torwart-reaktion",
    name: "Torwart Reaktion",
    focusSkill: "Torwart / Reaktionsschnelligkeit",
    blocks: [
      {
        type: "work",
        durationSeconds: 45,
        note: "Ball auf Hoehe der gegnerischen 3er-Stange legen. Schnelle Schuesse aufs eigene Tor und mit dem Torwart reagieren.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Kurze Pause. Konzentration sammeln.",
      },
      {
        type: "work",
        durationSeconds: 60,
        note: "Reaktionstraining: Schuesse abwechselnd auf verschiedene Ecken. Torwart moeglichst schnell auf die Schussrichtung bewegen.",
      },
      {
        type: "rest",
        durationSeconds: 20,
        note: "Erholung. Griffdruck lockern, Schultern entspannen.",
      },
      {
        type: "work",
        durationSeconds: 90,
        note: "Torwart gegen simulierte Pull- und Push-Shots. Fokus auf Antizipation und schnelle Seitenverschiebung.",
      },
    ],
  },

  // 11. Kombinations-Training (advanced, 6 blocks)
  {
    id: "drill-kombination",
    name: "Kombinations-Training",
    focusSkill: "Kombinationsspiel / Spielaufbau",
    blocks: [
      {
        type: "work",
        durationSeconds: 60,
        note: "Pass von der 5er-Reihe auf die 3er, dort annehmen und Pin-Shot ausfuehren. Kompletten Spielzug ueben.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Kurze Pause. Bewegungsablauf mental wiederholen.",
      },
      {
        type: "work",
        durationSeconds: 90,
        note: "Kombination erweitern: Brush-Pass auf die 3er, Tic-Tac-Fake, dann Torschuss. Auf fluessigen Uebergang achten.",
      },
      {
        type: "rest",
        durationSeconds: 20,
        note: "Erholung. Welche Variante hat am besten funktioniert?",
      },
      {
        type: "work",
        durationSeconds: 120,
        note: "Freies Kombinationsspiel: Pass- und Schussoptionen variieren. Pull, Push und Pin im Wechsel einsetzen.",
      },
      {
        type: "rest",
        durationSeconds: 30,
        note: "Laengere Pause. Gesamten Spielaufbau reflektieren und Schwachstellen identifizieren.",
      },
    ],
  },

  // 12. Wettkampf-Simulation (advanced, 5 blocks)
  {
    id: "drill-wettkampf-simulation",
    name: "Wettkampf-Simulation",
    focusSkill: "Wettkampfhaerte / Drucksituationen",
    blocks: [
      {
        type: "work",
        durationSeconds: 60,
        note: "Aufschlag ueben und sofort in den Angriff uebergehen. Schnellen Spielaufbau von Tor bis Schuss simulieren.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Pause. Mentalitaet: Im Wettkampf zaehlt jeder Ball.",
      },
      {
        type: "work",
        durationSeconds: 120,
        note: "Matchplay-Szenario: 5 Baelle hintereinander spielen, jeder Ball zaehlt. Wechsel zwischen Offensive und Defensive.",
      },
      {
        type: "rest",
        durationSeconds: 20,
        note: "Erholung. Analyse: Wie viele Tore erzielt, wie viele Fehler gemacht?",
      },
      {
        type: "work",
        durationSeconds: 90,
        note: "Drucksituation simulieren: Letzter Ball, Rueckstand. Bester Schuss unter mentalem Druck abrufen.",
      },
    ],
  },

  // 13. Aufwaerm-Routine (beginner, 4 blocks)
  {
    id: "drill-aufwaermen",
    name: "Aufwaerm-Routine",
    focusSkill: "Aufwaermen / Einspielen",
    blocks: [
      {
        type: "work",
        durationSeconds: 30,
        note: "Alle Stangen langsam hin und her bewegen. Gelenke aufwaermen, lockerer Griff.",
      },
      {
        type: "rest",
        durationSeconds: 10,
        note: "Kurze Pause. Handgelenke kreisen lassen.",
      },
      {
        type: "work",
        durationSeconds: 45,
        note: "Leichte Paesse zwischen den Reihen spielen. Kein Tempo, nur Gefuehl fuer den Ball aufbauen.",
      },
      {
        type: "work",
        durationSeconds: 60,
        note: "Einfache Schuesse aufs Tor mit der 3er-Stange. Nicht auf Haerte, sondern auf Praezision achten.",
      },
    ],
  },

  // 14. Cool-Down & Technik (beginner, 3 blocks)
  {
    id: "drill-cool-down",
    name: "Cool-Down & Technik",
    focusSkill: "Auslaufen / Technikfestigung",
    blocks: [
      {
        type: "work",
        durationSeconds: 60,
        note: "Langsame, kontrollierte Paesse zwischen 5er und 3er spielen. Ruhig und praezise, kein Tempo.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Pause. Tief durchatmen, Schultern und Arme bewusst entspannen.",
      },
      {
        type: "work",
        durationSeconds: 45,
        note: "Abschluss: 5 langsame, saubere Torschuesse. Jeder Schuss bewusst und kontrolliert. Technik sauber ausklingen lassen.",
      },
    ],
  },
];
