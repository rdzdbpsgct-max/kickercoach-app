import type { StrategyTemplate } from "../domain/models/MatchPlan";

export const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  // ── Offensive Strategien ──────────────────────────────────────────────

  {
    id: "strat-serien-druck",
    name: "Serien-Druck",
    category: "offensive",
    description:
      "Konstanten offensiven Druck aufbauen, Gegner nicht zur Ruhe kommen lassen. Nach jedem Ballgewinn sofort angreifen.",
    tips: [
      "Nach jedem Ballgewinn sofort den Angriff einleiten \u2013 keine Pause geben.",
      "Schnelle Ballweitergabe von der 5er auf die 3er-Reihe nutzen, um \u00dcberg\u00e4nge zu verk\u00fcrzen.",
      "Zeitdruck bewusst einsetzen: Nicht lange den Ball halten, sondern z\u00fcgig abschlie\u00dfen.",
      "Schussauswahl variieren, damit der Gegner sich nicht auf eine Technik einstellen kann.",
      "Ballbesitz in der offensiven Zone halten \u2013 lieber zur\u00fcckspielen als den Ball zu verlieren.",
      "Gegner durch konstante Aktivit\u00e4t mental erm\u00fcden und zu Fehlern zwingen.",
    ],
  },

  {
    id: "strat-schuss-rotation",
    name: "Schuss-Rotation",
    category: "offensive",
    description:
      "Systematisch zwischen verschiedenen Schusstechniken wechseln (Pull, Push, Pin, Snake). Der Gegner kann sich nicht auf einen Schuss einstellen.",
    tips: [
      "Nie zweimal hintereinander den gleichen Schuss w\u00e4hlen \u2013 Muster vermeiden.",
      "Defensive Reaktionen des Gegners lesen und den n\u00e4chsten Schuss darauf abstimmen.",
      "Immer einen prim\u00e4ren Schuss und mindestens eine Backup-Option vorbereiten.",
      "Muster bewusst brechen: Nach zwei schnellen Sch\u00fcssen einen langsamen, platzierten Schuss einstreuen.",
      "Alle Schusstechniken regelm\u00e4\u00dfig trainieren, damit jede Option jederzeit abrufbar ist.",
      "Beobachte, auf welche Sch\u00fcsse der Gegner am schlechtesten reagiert, und erh\u00f6he deren Anteil leicht.",
    ],
  },

  {
    id: "strat-positions-wechsel",
    name: "Positions-Wechsel",
    category: "offensive",
    description:
      "Angriffe \u00fcber verschiedene Reihen variieren. Nicht immer von der 3er schie\u00dfen, auch 5er-Durchsch\u00fcsse und Torwart-Sch\u00fcsse nutzen.",
    tips: [
      "5er-Reihe Durchsch\u00fcsse als \u00dcberraschungselement nutzen \u2013 der Gegner rechnet selten damit.",
      "Torwart-Konter direkt nach Ballgewinn einsetzen, wenn der Gegner noch nicht sortiert ist.",
      "Angriffe \u00fcber alle Reihen verteilen, damit die Verteidigung den Ursprung nicht vorhersagen kann.",
      "Bewusst zwischen 3er-Reihe, 5er-Reihe und Torwart als Angriffsursprung wechseln.",
      "Lange B\u00e4lle vom Torwart direkt auf die 3er-Reihe \u00fcben \u2013 \u00fcberspringt die gegnerische 5er.",
      "Nach mehreren 3er-Angriffen bewusst einen 5er-Durchschuss spielen, um den Rhythmus zu \u00e4ndern.",
    ],
  },

  {
    id: "strat-tempo-variation",
    name: "Tempo-Variation",
    category: "offensive",
    description:
      "Bewusster Wechsel zwischen schnellem und langsamem Spiel. Langsam aufbauen und explosiv abschlie\u00dfen, oder schnell starten und dann kontrolliert spielen.",
    tips: [
      "Langsamer Aufbau zwingt die Verteidigung, sich festzulegen \u2013 dann explosiv abschlie\u00dfen.",
      "Nach einer langsamen Phase pl\u00f6tzlich beschleunigen: Der Tempowechsel \u00fcberrascht den Gegner.",
      "Die Schuss-Uhr strategisch nutzen: Fr\u00fch schie\u00dfen oder bewusst bis kurz vor Ablauf warten.",
      "Rhythmuswechsel einbauen: Zwei schnelle Angriffe, dann ein langsamer, kontrollierter Aufbau.",
      "Beim langsamen Spiel den Ball bewusst hin- und herschieben, um Verteidigungsl\u00fccken zu \u00f6ffnen.",
      "Tempo an den Gegner anpassen: Gegen hektische Spieler langsam spielen, gegen ruhige schnell.",
    ],
  },

  // ── Defensive Strategien ──────────────────────────────────────────────

  {
    id: "strat-zone-defense",
    name: "Zone-Defense",
    category: "defensive",
    description:
      "Feste Zonenaufteilung zwischen Torwart und 2er-Reihe. Jeder deckt seinen Bereich konsequent ab.",
    tips: [
      "Klare Zonenaufteilung festlegen: Torwart deckt die Mitte, 2er-Reihe die Au\u00dfenbereiche (oder umgekehrt).",
      "Auch unter Druck die eigene Zone nicht verlassen \u2013 Disziplin ist entscheidend.",
      "Zonenaufteilung zwischen den S\u00e4tzen anpassen, wenn der Gegner eine Schw\u00e4che erkannt hat.",
      "Kommunikation mit dem Partner: Kurze Absprachen bei Stellungs\u00e4nderungen.",
      "Die Zonen so w\u00e4hlen, dass m\u00f6glichst wenig tote Winkel entstehen.",
      "Bei Gegner-Timeout die Zonenaufteilung \u00fcberpr\u00fcfen und ggf. rotieren.",
    ],
  },

  {
    id: "strat-bait-defense",
    name: "Bait-Defense",
    category: "defensive",
    description:
      "Gezielt L\u00fccken \u00f6ffnen, um den Gegner zu einem vorhersehbaren Schuss zu verleiten. Im letzten Moment schlie\u00dfen.",
    tips: [
      "Einladende L\u00fccken bewusst \u00f6ffnen \u2013 der Gegner soll denken, er hat eine freie Bahn.",
      "Im letzten Moment die L\u00fccke schlie\u00dfen: Das Timing ist entscheidend und muss trainiert werden.",
      "Bait-Defense nicht \u00fcberstrapazieren \u2013 nach 2\u20133 Mal wechseln, bevor der Gegner es durchschaut.",
      "Variiere, auf welcher Seite du die L\u00fccke anbietest: Links, rechts und Mitte abwechseln.",
      "Beobachte die Schussgewohnheiten des Gegners und biete die L\u00fccke dort an, wo er bevorzugt schie\u00dft.",
      "Leichte K\u00f6rperbewegung kann die T\u00e4uschung unterst\u00fctzen \u2013 suggeriere eine offene Seite.",
    ],
  },

  {
    id: "strat-reaktionsblock",
    name: "Reaktionsblock",
    category: "defensive",
    description:
      "Rein reaktive Verteidigung: Auf den Ball reagieren statt antizipieren. Schnelle Reflexe und optimale Grundposition.",
    tips: [
      "Immer in der zentrierten Grundposition bleiben \u2013 von dort sind alle Seiten gleich schnell erreichbar.",
      "Auf den Ball reagieren, nicht auf die Handbewegungen des Gegners \u2013 T\u00e4uschungen werden wirkungslos.",
      "Kurze, explosive Bewegungen statt langer Wege \u2013 minimale Distanz, maximale Geschwindigkeit.",
      "Regelm\u00e4\u00dfig Reaktions\u00fcbungen trainieren: Zuf\u00e4llige Sch\u00fcsse blocken ohne Vorwarnung.",
      "Griff locker halten, um schneller reagieren zu k\u00f6nnen \u2013 verkrampfte H\u00e4nde verlangsamen.",
      "Nach jedem Block sofort in die Grundposition zur\u00fcckkehren \u2013 bereit f\u00fcr den n\u00e4chsten Schuss.",
    ],
  },

  {
    id: "strat-anti-serie",
    name: "Anti-Serie",
    category: "defensive",
    description:
      "Strategie gegen Gegner die in einen Lauf kommen. Tempo rausnehmen, Timeouts nutzen, Defensivsystem wechseln.",
    tips: [
      "Timeout nehmen, um den Rhythmus des Gegners zu brechen \u2013 Momentum unterbrechen.",
      "Defensivsystem bewusst wechseln: Von Zone auf Bait oder von Reaktion auf Zone umstellen.",
      "Spielgeschwindigkeit verlangsamen: Ball kontrolliert halten, nicht hektisch werden.",
      "Mental ruhig bleiben \u2013 der Gegner f\u00fcttert sich von deiner Frustration.",
      "Auf die eigenen Grundlagen besinnen: Saubere Ballkontrolle, sichere P\u00e4sse, feste Grundposition.",
      "Zwischen den Punkten kurz durchatmen und den n\u00e4chsten Ball als Neuanfang betrachten.",
    ],
  },
];
