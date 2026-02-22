import type { Drill } from "../domain/models/Drill";

export const DEFAULT_DRILLS: Drill[] = [
  // 1. Pull-Shot Basics (beginner, 3 blocks)
  {
    id: "drill-pull-shot-basics",
    name: "Pull-Shot Basics",
    focusSkill: "Pull-Shot / Ziehen",
    difficulty: "beginner",
    description:
      "Grundlagen des Pull-Shots: Seitliche Ballmitnahme und Schuss in einer flüssigen Bewegung üben.",
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
    difficulty: "beginner",
    description:
      "Push-Shot Grundlagen trainieren: Ball wegschieben und im selben Fluss aufs Tor schießen.",
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
    difficulty: "intermediate",
    description:
      "Pin-Shot Technik vertiefen: Ball pinnen, lateral versetzen und per Handgelenkrotation abschließen.",
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
    difficulty: "advanced",
    description:
      "Intensive Jet/Snake Übung: Fortgeschrittene Rollbewegung mit Fakes und Tempovariationen unter Druck.",
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
    difficulty: "intermediate",
    description:
      "Tic-Tac-Passspiel auf der 5er-Reihe: Rhythmus aufbauen, Lücken erkennen und mit Abschluss kombinieren.",
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
    difficulty: "advanced",
    description:
      "Brush-Pass Technik perfektionieren: Diagonale Anspiele von der 5er auf die 3er-Reihe mit sauberer Annahme.",
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
    difficulty: "beginner",
    description:
      "Bandenpässe von der 5er auf die 3er-Reihe: Winkel und Härte dosieren, saubere Annahme trainieren.",
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
    difficulty: "beginner",
    description:
      "Grundlegende Ballkontrolle: Stoppen, Pinnen und kontrolliertes Rollen auf der 3er-Stange.",
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
    difficulty: "intermediate",
    description:
      "Defensives Verschieben mit 2er-Reihe und Torwart: Koordination beider Hände und Lücken schließen.",
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
    difficulty: "intermediate",
    description:
      "Torwart-Reaktionsschnelligkeit: Auf verschiedene Schussrichtungen reagieren und Pull/Push-Shots abwehren.",
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
    difficulty: "advanced",
    description:
      "Komplettes Kombinationsspiel: Pass-Schuss-Sequenzen mit verschiedenen Techniken und Variationen.",
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
    difficulty: "advanced",
    description:
      "Wettkampfsimulation unter Druck: Matchplay-Szenarien mit Zählsystem und mentaler Belastung.",
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
    difficulty: "beginner",
    description:
      "Standardmäßige Aufwärmroutine: Gelenke lockern, Ball fühlen und langsam auf Präzision schießen.",
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
    difficulty: "beginner",
    description:
      "Kontrolliertes Auslaufen: Langsame Pässe und bewusst saubere Torschüsse zum Technikfestigen.",
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

  // 15. Sanfter Touch (beginner, 5 blocks)
  {
    id: "drill-sanfter-touch",
    name: "Sanfter Touch",
    focusSkill: "Ballgefühl / Soft Touch",
    difficulty: "beginner",
    description:
      "Feinfühliges Ballhandling üben: Sanftes Stoppen, weiches Passen und kontrollierte Pin-Übergänge.",
    blocks: [
      {
        type: "work",
        durationSeconds: 45,
        note: "Ball auf der 3er-Reihe sanft von Figur zu Figur rollen. Minimaler Druck, maximale Kontrolle.",
      },
      {
        type: "rest",
        durationSeconds: 10,
        note: "Pause. Griffdruck bewusst lockern.",
      },
      {
        type: "work",
        durationSeconds: 60,
        note: "Weiche Pässe von der 5er zur 3er spielen. Ball soll bei Annahme sofort ruhig liegen.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Pause. Fokus auf Fingerspitzengefühl.",
      },
      {
        type: "work",
        durationSeconds: 45,
        note: "Pin-Übergänge: Front-Pin zu Back-Pin und zurück. Fließende, ruhige Bewegungen.",
      },
    ],
  },

  // 16. Finten-Training (intermediate, 5 blocks)
  {
    id: "drill-finten",
    name: "Finten-Training",
    focusSkill: "Täuschung / Finten",
    difficulty: "intermediate",
    description:
      "Fake-Bewegungen an der 3er-Reihe trainieren: Schussantäuschungen, Richtungswechsel und Timing.",
    blocks: [
      {
        type: "work",
        durationSeconds: 60,
        note: "Schussantäuschung üben: Pull-Bewegung andeuten, stoppen, dann Push-Shot schießen. Wechsel wiederholen.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Pause. Bewegungsablauf mental durchgehen.",
      },
      {
        type: "work",
        durationSeconds: 90,
        note: "Finten-Serien: 3 Fake-Bewegungen hintereinander, dann Schuss. Variiere Richtung und Timing.",
      },
      {
        type: "rest",
        durationSeconds: 20,
        note: "Erholung. Welche Finte war am überzeugendsten?",
      },
      {
        type: "work",
        durationSeconds: 60,
        note: "Unter Zeitdruck: Maximal 5 Sekunden pro Angriff. Schnelle Finte + sofortiger Schuss.",
      },
    ],
  },

  // 17. Schlenzer-Übung (intermediate, 5 blocks)
  {
    id: "drill-schlenzer",
    name: "Schlenzer-Übung",
    focusSkill: "Schlenzer / Winkelschuss",
    difficulty: "intermediate",
    description:
      "Angeschnittene Schüsse aus verschiedenen Positionen: Spin-Technik und Winkelvariation üben.",
    blocks: [
      {
        type: "work",
        durationSeconds: 60,
        note: "Schlenzer-Grundbewegung üben: Ball seitlich anschneiden statt gerade schießen. Spin beobachten.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Pause. Handgelenkposition korrigieren.",
      },
      {
        type: "work",
        durationSeconds: 90,
        note: "Schlenzer aus verschiedenen Positionen auf der 3er-Reihe. Ziel: Beide Torecken treffen.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Kurze Erholung.",
      },
      {
        type: "work",
        durationSeconds: 60,
        note: "Schlenzer mit Vorbereitung: Erst lateral bewegen, dann angeschnittenen Schuss aus der Bewegung.",
      },
    ],
  },

  // 18. Zone-Defense Drill (intermediate, 5 blocks)
  {
    id: "drill-zone-defense",
    name: "Zone-Defense Drill",
    focusSkill: "Zonenverteidigung",
    difficulty: "intermediate",
    description:
      "Defensive Zonenabdeckung trainieren: Feste Bereiche mit Torwart und 2er-Reihe systematisch abdecken.",
    blocks: [
      {
        type: "work",
        durationSeconds: 60,
        note: "Torwart und 2er-Reihe in Zonen aufteilen: Torwart links, 2er rechts. Positionen halten.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Pause. Zonen mental visualisieren.",
      },
      {
        type: "work",
        durationSeconds: 90,
        note: "Simulierte Schüsse abwehren: Nur in der eigenen Zone reagieren, nicht überreagieren.",
      },
      {
        type: "rest",
        durationSeconds: 20,
        note: "Erholung. Zonen tauschen: Torwart rechts, 2er links.",
      },
      {
        type: "work",
        durationSeconds: 60,
        note: "Zonenwechsel unter Druck: Schnelle Schüsse auf verschiedene Bereiche. System beibehalten.",
      },
    ],
  },

  // 19. Täuschungs-Kombi (advanced, 6 blocks)
  {
    id: "drill-taeuschungs-kombi",
    name: "Täuschungs-Kombi",
    focusSkill: "Kombination aus Finten und Schüssen",
    difficulty: "advanced",
    description:
      "Fortgeschrittene Täuschungssequenzen: Finten, Richtungswechsel und Schüsse in komplexen Kombinationen.",
    blocks: [
      {
        type: "work",
        durationSeconds: 60,
        note: "Dreier-Sequenz üben: Fake-Pull → Fake-Push → echter Schuss. Flüssiger Ablauf.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Pause. Sequenz mental wiederholen.",
      },
      {
        type: "work",
        durationSeconds: 90,
        note: "Freie Täuschungs-Kombination: Mindestens 2 Finten vor jedem Schuss. Variiere die Muster.",
      },
      {
        type: "rest",
        durationSeconds: 20,
        note: "Erholung. Welche Kombinationen überraschen am meisten?",
      },
      {
        type: "work",
        durationSeconds: 120,
        note: "Wettkampf-Tempo: Komplette Angriffssequenz mit Finten in unter 8 Sekunden. Schnelligkeit plus Präzision.",
      },
      {
        type: "rest",
        durationSeconds: 30,
        note: "Längere Pause. Gesamten Ablauf reflektieren.",
      },
    ],
  },

  // 20. Mental-Fokus Routine (beginner, 5 blocks)
  {
    id: "drill-mental-fokus",
    name: "Mental-Fokus Routine",
    focusSkill: "Mentale Stärke / Fokus",
    difficulty: "beginner",
    description:
      "Atemübungen und konzentrierte Schussserien: Mentale Klarheit vor und während des Spiels trainieren.",
    blocks: [
      {
        type: "work",
        durationSeconds: 30,
        note: "Tief durchatmen: 4 Sekunden einatmen, 4 Sekunden halten, 4 Sekunden ausatmen. Wiederholen.",
      },
      {
        type: "rest",
        durationSeconds: 10,
        note: "Augen schließen. Einen erfolgreichen Schuss visualisieren.",
      },
      {
        type: "work",
        durationSeconds: 60,
        note: "5 bewusste Schüsse: Vor jedem Schuss kurz innehalten, Ziel visualisieren, dann ausführen.",
      },
      {
        type: "rest",
        durationSeconds: 15,
        note: "Pause. Wie hat sich die Konzentration angefühlt?",
      },
      {
        type: "work",
        durationSeconds: 45,
        note: "Ablenkungstest: Schüsse ausführen während du laut von 100 rückwärts zählst. Fokus halten.",
      },
    ],
  },
];
