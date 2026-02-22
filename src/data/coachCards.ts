import type { CoachCard } from "../domain/models/CoachCard";

export const COACH_CARDS: CoachCard[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // TORSCHUSS (8 Karten)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "torschuss-jet",
    title: "Jet / Snake",
    summary:
      "Der Jet (auch Snake genannt) ist einer der schnellsten und effektivsten Schüsse im Tischfussball. Der Ball wird aus der Pin-Position heraus durch eine schnelle Handgelenkbewegung über die Stange gerollt und ins Tor befördert.",
    difficulty: "advanced",
    category: "Torschuss",
    tags: ["jet", "snake", "pin-shot", "3er-reihe", "offense", "technik"],
    steps: [
      "Lege den Ball in die vordere Pin-Position unter die mittlere Figur der 3er-Reihe.",
      "Positioniere dein Handgelenk locker auf der Stange, sodass die Hand oben aufliegt.",
      "Bewege den Ball lateral durch eine kurze seitliche Stangenbewegung, um die gegnerische Abwehr zu verschieben.",
      "Führe die Schussbewegung aus, indem du das Handgelenk explosiv nach vorne über die Stange rollst.",
      "Der Ball wird dabei von der Figur überrollt und mit hoher Geschwindigkeit aufs Tor geschossen.",
      "Achte auf ein sauberes Durchschwingen und bringe die Stange danach kontrolliert zum Stopp.",
    ],
    commonMistakes: [
      "Zu viel Kraft aus dem Arm statt aus dem Handgelenk – der Schuss wird unkontrolliert.",
      "Die Pin-Position ist nicht stabil, sodass der Ball vor dem Schuss verrutscht.",
      "Die laterale Bewegung ist zu langsam oder vorhersehbar, sodass der Gegner die Lücke schließen kann.",
    ],
    coachCues: [
      "Denk an eine schnelle Handgelenk-Rotation – der Arm bleibt ruhig.",
      "Halte den Ball ruhig in der Pin-Position, bevor du schießt – Geduld vor Explosivität.",
      "Variiere die Seitenbewegung, damit der Gegner nicht antizipieren kann.",
    ],
  },
  {
    id: "torschuss-pin-shot",
    title: "Pin-Shot (Abroller)",
    summary:
      "Der Pin-Shot ist ein klassischer Schuss, bei dem der Ball aus der vorderen Pin-Position durch Abrollen der Figur ins Tor befördert wird. Er ist die Grundlage vieler fortgeschrittener Schusstechniken.",
    difficulty: "intermediate",
    category: "Torschuss",
    tags: ["pin-shot", "abroller", "3er-reihe", "grundtechnik", "offense"],
    steps: [
      "Positioniere den Ball in der vorderen Pin-Position unter der mittleren Figur der 3er-Reihe.",
      "Halte den Griff locker und positioniere die Hand so, dass eine schnelle Drehung möglich ist.",
      "Führe eine laterale Bewegung aus, um eine Lücke in der gegnerischen Abwehr zu erzeugen.",
      "Rolle die Figur kontrolliert nach vorne über den Ball, sodass er Richtung Tor geschossen wird.",
      "Ziele entweder auf die lange oder kurze Ecke, je nach Positionierung des Gegners.",
    ],
    commonMistakes: [
      "Der Ball liegt nicht mittig unter der Figur, wodurch der Schuss unpräzise wird.",
      "Zu langsame Ausführung gibt dem Gegner Zeit, die Lücke zu schließen.",
      "Die Stange wird nach dem Schuss nicht kontrolliert gestoppt, was zu einem Foul führen kann.",
    ],
    coachCues: [
      "Achte darauf, dass die Figur den Ball sauber von oben überrollt.",
      "Übe den Schuss zunächst langsam und steigere die Geschwindigkeit schrittweise.",
    ],
  },
  {
    id: "torschuss-pull-shot",
    title: "Pull-Shot (Zieher)",
    summary:
      "Der Pull-Shot ist einer der populärsten Schüsse im Tischfussball. Der Ball wird seitlich gezogen und im selben Bewegungsfluss aufs Tor geschossen. Die Kombination aus lateraler und rotatorischer Bewegung macht ihn schwer zu verteidigen.",
    difficulty: "intermediate",
    category: "Torschuss",
    tags: ["pull-shot", "zieher", "3er-reihe", "offense", "klassiker"],
    steps: [
      "Positioniere den Ball seitlich neben der mittleren Figur der 3er-Reihe, stationär auf dem Spielfeld.",
      "Greife den Griff im sogenannten Wrist-Grip, bei dem das Handgelenk die Hauptbewegung steuert.",
      "Ziehe die Stange lateral zu dir heran, um den Ball seitlich mitzunehmen.",
      "Sobald sich eine Lücke in der gegnerischen Abwehr öffnet, schieße durch eine schnelle Handgelenkdrehung.",
      "Der gesamte Bewegungsablauf – Ziehen und Schießen – soll in einer flüssigen Bewegung erfolgen.",
      "Bringe die Stange nach dem Schuss kontrolliert zum Stopp.",
    ],
    commonMistakes: [
      "Die Ziehbewegung und der Schuss sind nicht synchronisiert – der Ball geht am Tor vorbei.",
      "Der Griff ist zu fest, wodurch die Handgelenkdrehung eingeschränkt wird.",
      "Fehlende Variation: Der Schuss geht immer in dieselbe Ecke.",
    ],
    coachCues: [
      "Ziehen und Schießen ist eine Bewegung – nicht zwei getrennte Aktionen.",
      "Variiere die Geschwindigkeit des Ziehens, um den Gegner aus dem Rhythmus zu bringen.",
      "Lockerer Griff erlaubt eine schnellere Handgelenkrotation.",
    ],
  },
  {
    id: "torschuss-push-shot",
    title: "Push-Shot (Schieber)",
    summary:
      "Der Push-Shot ist das Gegenstück zum Pull-Shot. Der Ball wird von der Körpermitte weg geschoben und gleichzeitig aufs Tor geschossen. Er erweitert das Angriffsrepertoire und macht die Offensive unberechenbarer.",
    difficulty: "intermediate",
    category: "Torschuss",
    tags: ["push-shot", "schieber", "3er-reihe", "offense"],
    steps: [
      "Positioniere den Ball neben der mittleren Figur der 3er-Reihe auf der dir zugewandten Seite.",
      "Greife den Griff locker, damit ein schnelles Schieben möglich ist.",
      "Schiebe die Stange von dir weg, um den Ball lateral mitzunehmen.",
      "Sobald die Lücke in der Abwehr erscheint, führe die Schussdrehung mit dem Handgelenk aus.",
      "Achte auf eine kontrollierte Nachbewegung, damit die Stange nicht unkontrolliert dreht.",
    ],
    commonMistakes: [
      "Die Schiebebewegung ist zu weit, sodass der Ball den Schussbereich verlässt.",
      "Der Schuss wird zu spät ausgelöst, und die Lücke hat sich bereits geschlossen.",
      "Der Arm bewegt sich zu viel mit – die Kraft soll primär aus dem Handgelenk kommen.",
    ],
    coachCues: [
      "Schiebe kurz und explosiv – lange Wege sind leichter zu lesen.",
      "Trainiere den Push-Shot zusammen mit dem Pull-Shot, um den Gegner zu verwirren.",
    ],
  },
  {
    id: "torschuss-bank-shot",
    title: "Bandentor (Bank-Shot)",
    summary:
      "Beim Bank-Shot wird der Ball über die Bande ins Tor gespielt. Dieser Schuss ist besonders effektiv, wenn der direkte Weg zum Tor blockiert ist, und überrascht viele Verteidiger.",
    difficulty: "intermediate",
    category: "Torschuss",
    tags: ["bank-shot", "bande", "winkel", "überraschung", "offense"],
    steps: [
      "Positioniere den Ball auf der 3er-Reihe oder 5er-Reihe nahe an der Bande.",
      "Berechne den Winkel: Der Ball muss so auf die Bande treffen, dass er im richtigen Winkel zum Tor abprallt.",
      "Schieße den Ball mit mittlerer bis hoher Kraft schräg gegen die nahe Bande.",
      "Der Ball prallt von der Bande ab und fliegt in die gegenüberliegende Torecke.",
      "Übe verschiedene Auftreffwinkel, um den Schuss aus unterschiedlichen Positionen spielen zu können.",
    ],
    commonMistakes: [
      "Der Winkel ist falsch berechnet – der Ball prallt am Tor vorbei.",
      "Zu viel Kraft lässt den Ball zu schnell und unkontrolliert von der Bande abprallen.",
      "Der Schuss wird zu offensichtlich angekündigt, sodass der Gegner sich anpassen kann.",
    ],
    coachCues: [
      "Einfallswinkel gleich Ausfallswinkel – visualisiere die Flugbahn vor dem Schuss.",
      "Nutze den Bank-Shot als Überraschungselement, nicht als Standardschuss.",
      "Übe den Winkel aus verschiedenen Positionen auf der 3er-Reihe.",
    ],
  },
  {
    id: "torschuss-volley",
    title: "Volley-Schuss",
    summary:
      "Der Volley-Schuss wird direkt aus dem Ballfluss heraus geschossen, ohne den Ball vorher zu stoppen. Er ist besonders schnell und überraschend, erfordert aber exzellentes Timing.",
    difficulty: "advanced",
    category: "Torschuss",
    tags: ["volley", "direkt", "timing", "schnell", "offense"],
    steps: [
      "Beobachte den ankommenden Ball genau und antizipiere seine Position.",
      "Positioniere die Figur so, dass sie den Ball im optimalen Moment trifft.",
      "Schlage im richtigen Moment zu – die Figur trifft den Ball in der Bewegung.",
      "Nutze die Geschwindigkeit des ankommenden Balls und addiere die Schussenergie hinzu.",
      "Ziele auf eine Torecke, die der Gegner nicht erwartet.",
      "Trainiere das Timing mit langsamen Bällen und steigere die Geschwindigkeit schrittweise.",
    ],
    commonMistakes: [
      "Falsches Timing – die Figur trifft den Ball zu früh oder zu spät.",
      "Zu viel Kraft, obwohl der ankommende Ball bereits Geschwindigkeit mitbringt.",
      "Keine Torrichtung geplant – der Schuss geht planlos aufs Tor.",
    ],
    coachCues: [
      "Warte auf den Ball, anstatt ihm entgegenzuschlagen – Timing schlägt Kraft.",
      "Plane vor dem Schuss, wohin der Ball gehen soll.",
    ],
  },
  {
    id: "torschuss-aerial",
    title: "Flugball (Aerial Shot)",
    summary:
      "Der Flugball ist ein spektakulärer Schuss, bei dem der Ball angehoben wird und über die gegnerischen Figuren hinwegfliegt. Im Wettkampf selten eingesetzt, aber als Überraschungselement sehr wirkungsvoll.",
    difficulty: "advanced",
    category: "Torschuss",
    tags: ["aerial", "flugball", "heber", "spezial", "offense"],
    steps: [
      "Positioniere den Ball stabil unter einer Figur, am besten in der Pin-Position.",
      "Führe die Figur mit einer schnellen, schaufelartigen Bewegung unter den Ball.",
      "Die Figur hebt den Ball durch die Aufwärtsbewegung vom Spielfeld an.",
      "Der Ball fliegt über die gegnerischen Figurenreihen hinweg Richtung Tor.",
      "Kontrolliere die Flughöhe durch die Intensität der Schaufelbewegung.",
    ],
    commonMistakes: [
      "Der Ball wird nicht richtig angehoben und bleibt auf dem Spielfeld.",
      "Zu viel Höhe – der Ball fliegt über das Tor oder aus dem Spielfeld.",
      "Die Technik wird zu häufig eingesetzt und verliert ihren Überraschungseffekt.",
    ],
    coachCues: [
      "Die Schaufelbewegung muss schnell und flach ansetzen, um den Ball sauber anzuheben.",
      "Nutze den Flugball nur als seltene Überraschung – er ist kein Standardschuss.",
      "Übe zuerst ohne Tor, um die Höhenkontrolle zu entwickeln.",
    ],
  },
  {
    id: "torschuss-cutback",
    title: "Cutback (Rückzieher)",
    summary:
      "Der Cutback ist eine Schusstäuschung, bei der die Figur zunächst in eine Richtung bewegt wird und dann blitzschnell in die entgegengesetzte Richtung schießt. Er lebt von der Täuschung des Gegners.",
    difficulty: "advanced",
    category: "Torschuss",
    tags: ["cutback", "rückzieher", "täuschung", "finte", "offense"],
    steps: [
      "Positioniere den Ball in Schussposition auf der 3er-Reihe.",
      "Beginne eine deutliche laterale Bewegung in eine Richtung (z.B. Pull-Bewegung).",
      "Der Gegner reagiert und verschiebt seine Abwehr in die angezeigte Richtung.",
      "Stoppe abrupt und wechsle blitzschnell die Richtung.",
      "Schieße den Ball in die nun offene, gegenüberliegende Ecke.",
      "Die Täuschung muss überzeugend und die Richtungsänderung extrem schnell sein.",
    ],
    commonMistakes: [
      "Die Täuschung ist nicht überzeugend genug – der Gegner fällt nicht darauf herein.",
      "Die Richtungsänderung dauert zu lange, sodass der Gegner zurückkehren kann.",
      "Der Ballkontakt geht beim Richtungswechsel verloren.",
    ],
    coachCues: [
      "Verkaufe die Täuschung – deine erste Bewegung muss aussehen wie ein echter Schuss.",
      "Explosivität im Richtungswechsel ist der Schlüssel.",
      "Beobachte die Reaktion des Gegners, bevor du den Cutback einsetzt.",
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // PASSSPIEL (7 Karten)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "passspiel-tic-tac",
    title: "Tic-Tac-Pass",
    summary:
      "Der Tic-Tac ist ein schneller, direkter Pass zwischen zwei Figurenreihen, bei dem der Ball ohne Stoppen weitergegeben wird. Er erzeugt hohes Tempo und überfordert die gegnerische Deckung.",
    difficulty: "intermediate",
    category: "Passspiel",
    tags: ["tic-tac", "direktpass", "tempo", "5er-reihe", "3er-reihe"],
    steps: [
      "Positioniere die Figuren der 5er- und 3er-Reihe so, dass eine direkte Passlinie existiert.",
      "Spiele den Ball mit der 5er-Reihe flach und präzise zur 3er-Reihe.",
      "Die 3er-Figur spielt den Ball sofort zurück zur 5er-Reihe, ohne ihn zu stoppen.",
      "Wiederhole den Tic-Tac mehrfach, um den Gegner in Bewegung zu bringen.",
      "Sobald eine Lücke entsteht, spiele den entscheidenden Pass zur Schussposition.",
    ],
    commonMistakes: [
      "Die Pässe sind zu hart, sodass der Ball nicht kontrolliert werden kann.",
      "Fehlende Abstimmung zwischen den Reihen führt zu Ballverlusten.",
      "Der Rhythmus wird vorhersehbar, und der Gegner kann den Ball abfangen.",
    ],
    coachCues: [
      "Spiele die Tic-Tacs mit konstantem Rhythmus und variiere dann plötzlich.",
      "Sanfter Ballkontakt – es geht um Präzision, nicht um Kraft.",
      "Halte die Passwege offen, indem du die Figuren nicht zu nah beieinander positionierst.",
    ],
  },
  {
    id: "passspiel-brush-pass",
    title: "Brush-Pass (Bürstenpass)",
    summary:
      "Beim Brush-Pass wird der Ball durch eine streifende Bewegung der Figur seitlich angeschnitten und in eine diagonale Bahn gebracht. Dieser Pass ermöglicht Pässe in Winkel, die mit geraden Pässen nicht möglich wären.",
    difficulty: "advanced",
    category: "Passspiel",
    tags: ["brush", "bürstenpass", "diagonal", "anschnitt", "technik"],
    steps: [
      "Positioniere den Ball stabil unter oder neben der Figur auf der 5er-Reihe.",
      "Führe die Figur seitlich und leicht schräg am Ball vorbei, sodass sie ihn nur streift.",
      "Durch den Anschnitt bekommt der Ball eine diagonale Flugbahn.",
      "Ziele auf die empfangende Figur der 3er-Reihe, die den Ball in der Diagonale erwartet.",
      "Übe verschiedene Anschnittwinkel, um die Passrichtung variieren zu können.",
      "Die empfangende Figur muss den angeschnittenen Ball sauber stoppen können.",
    ],
    commonMistakes: [
      "Zu viel Kontaktfläche – der Ball geht gerade statt diagonal.",
      "Zu wenig Kontakt – der Ball rollt zu langsam und wird abgefangen.",
      "Die empfangende Figur ist nicht auf die Diagonale eingestellt.",
    ],
    coachCues: [
      "Streife den Ball nur leicht – weniger ist mehr beim Brush-Pass.",
      "Übe den Anschnitt zunächst isoliert, bevor du ihn im Passspiel einsetzt.",
    ],
  },
  {
    id: "passspiel-bandenpass",
    title: "Bandenpass",
    summary:
      "Der Bandenpass nutzt die Spielfeldbande, um den Ball an gegnerischen Figuren vorbeizuspielen. Er ist besonders effektiv, wenn die direkte Passlinie blockiert ist.",
    difficulty: "intermediate",
    category: "Passspiel",
    tags: ["bande", "wall-pass", "indirekt", "umweg", "kreativ"],
    steps: [
      "Identifiziere, dass die direkte Passlinie zur nächsten Reihe blockiert ist.",
      "Berechne den Winkel: Der Ball muss so an die Bande gespielt werden, dass er zur Zielposition abprallt.",
      "Spiele den Ball mit kontrollierter Kraft gegen die nahe Bande.",
      "Der Ball prallt von der Bande ab und passiert die gegnerische Figurenreihe.",
      "Die empfangende Figur nimmt den Ball nach dem Bandenabpraller an.",
    ],
    commonMistakes: [
      "Falsche Kraftdosierung – der Ball kommt zu schnell oder zu langsam an.",
      "Der Abprallwinkel ist falsch berechnet, und der Ball landet beim Gegner.",
      "Die empfangende Figur ist nicht richtig positioniert für den Bandenabpraller.",
    ],
    coachCues: [
      "Einfallswinkel gleich Ausfallswinkel – berechne den Winkel vor dem Pass.",
      "Übe den Bandenpass aus verschiedenen Positionen auf der 5er-Reihe.",
      "Kontrollierte Kraft ist wichtiger als maximale Geschwindigkeit.",
    ],
  },
  {
    id: "passspiel-stick-pass",
    title: "Stick-Pass (Klebender Pass)",
    summary:
      "Der Stick-Pass ist ein präziser, flacher Pass, der so gespielt wird, dass die empfangende Figur den Ball sofort unter Kontrolle hat. Der Ball 'klebt' förmlich an der empfangenden Figur.",
    difficulty: "beginner",
    category: "Passspiel",
    tags: ["stick-pass", "kontrolle", "flach", "präzise", "grundlagen"],
    steps: [
      "Positioniere den Ball unter der passenden Figur auf der 5er-Reihe.",
      "Positioniere die empfangende Figur der 3er-Reihe so, dass sie den Ball direkt annehmen kann.",
      "Spiele den Ball flach und mit moderater Geschwindigkeit zur 3er-Reihe.",
      "Die empfangende Figur geht dem Ball leicht entgegen und stoppt ihn durch sanftes Nachgeben.",
      "Der Ball soll direkt in der Pin-Position oder unter der Figur zur Ruhe kommen.",
    ],
    commonMistakes: [
      "Der Pass ist zu hart, und der Ball prallt von der empfangenden Figur ab.",
      "Die empfangende Figur steht nicht im richtigen Winkel für die Ballannahme.",
      "Keine Kommunikation im Doppel – der Partner ist nicht bereit für den Pass.",
    ],
    coachCues: [
      "Weich passen, fest annehmen – der Ball soll kleben, nicht springen.",
      "Übe die Ballannahme isoliert, bevor du sie im Passspiel einsetzt.",
    ],
  },
  {
    id: "passspiel-lane-pass",
    title: "Lane-Pass (Gassenpass)",
    summary:
      "Der Lane-Pass wird durch eine offene Gasse zwischen den gegnerischen Figuren gespielt. Er erfordert präzises Timing, da die Gassen nur kurz offen sind.",
    difficulty: "intermediate",
    category: "Passspiel",
    tags: ["lane", "gasse", "timing", "lücke", "präzision"],
    steps: [
      "Beobachte die gegnerische Figurenreihe und identifiziere offene Gassen.",
      "Positioniere den Ball so, dass ein gerader Pass durch die Gasse möglich ist.",
      "Warte auf den richtigen Moment, in dem die Gasse maximal offen ist.",
      "Spiele den Ball schnell und flach durch die offene Gasse.",
      "Die empfangende Figur muss bereitstehen, um den Ball sofort zu kontrollieren.",
      "Variiere die Geschwindigkeit des Passes, um den Gegner zu überraschen.",
    ],
    commonMistakes: [
      "Der Pass wird zu langsam gespielt, und der Gegner schließt die Gasse rechtzeitig.",
      "Falsche Gasse gewählt – der Ball wird von einer gegnerischen Figur abgefangen.",
      "Fehlende Geduld: Der Pass wird forciert, obwohl keine Gasse offen ist.",
    ],
    coachCues: [
      "Geduld ist der Schlüssel – warte auf die offene Gasse, erzwinge nichts.",
      "Schneller Pass durch die Gasse, aber kontrollierte Annahme auf der anderen Seite.",
    ],
  },
  {
    id: "passspiel-give-and-go",
    title: "Give-and-Go (Doppelpass)",
    summary:
      "Der Give-and-Go ist ein schneller Doppelpass zwischen zwei Reihen, bei dem der Ball sofort zurückgespielt wird. Er nutzt die kurze Reaktionszeit des Gegners aus und schafft Raum für einen Schuss.",
    difficulty: "intermediate",
    category: "Passspiel",
    tags: ["give-and-go", "doppelpass", "kombination", "schnell", "teamplay"],
    steps: [
      "Spiele einen schnellen Pass von der 5er-Reihe zur 3er-Reihe.",
      "Nimm den Ball auf der 3er-Reihe kurz an und spiele ihn sofort auf eine andere Position der 5er-Reihe zurück.",
      "Die 5er-Reihe nimmt den Rückpass an und hat nun eine bessere Schuss- oder Passposition.",
      "Spiele den entscheidenden Pass oder Schuss aus der neuen Position.",
      "Die gesamte Sequenz muss so schnell ablaufen, dass der Gegner keine Zeit zum Reagieren hat.",
    ],
    commonMistakes: [
      "Der Rückpass kommt zu spät, und der Gegner hat sich angepasst.",
      "Der Ball wird beim schnellen Passwechsel nicht sauber kontrolliert.",
      "Das Timing zwischen den beiden Reihen stimmt nicht – der Ball geht ins Leere.",
    ],
    coachCues: [
      "Schnelligkeit vor Perfektion – der Doppelpass lebt vom Tempo.",
      "Kommuniziere im Doppel klar, wer wann bereit ist.",
      "Übe die Sequenz als feste Kombination immer wieder.",
    ],
  },
  {
    id: "passspiel-chip-pass",
    title: "Chip-Pass (Heber-Pass)",
    summary:
      "Der Chip-Pass hebt den Ball leicht an, um ihn über eine gegnerische Figur hinweg zur nächsten Reihe zu spielen. Er ist eine kreative Alternative, wenn alle flachen Passwege blockiert sind.",
    difficulty: "advanced",
    category: "Passspiel",
    tags: ["chip", "heber", "kreativ", "überraschung", "spezial"],
    steps: [
      "Positioniere den Ball stabil unter der Figur.",
      "Führe die Figur schnell und in einem steilen Winkel unter den Ball.",
      "Der Ball wird durch die aufwärts gerichtete Kraft leicht angehoben.",
      "Dosiere die Kraft so, dass der Ball nur knapp über die gegnerische Figur fliegt.",
      "Die empfangende Figur muss den ankommenden Ball aus der Luft kontrollieren.",
    ],
    commonMistakes: [
      "Der Ball wird zu hoch angehoben und fliegt über die empfangende Figur hinweg.",
      "Zu wenig Kraft – der Ball erreicht die gegnerische Figurenreihe nicht.",
      "Die Annahme des Chip-Passes misslingt, weil der Ball springt.",
    ],
    coachCues: [
      "Wenig Kraft, steiler Winkel – der Ball soll nur knapp über die Figur fliegen.",
      "Übe zuerst die Annahme von Chip-Pässen, bevor du sie im Spiel einsetzt.",
      "Der Chip-Pass ist ein Überraschungselement – nutze ihn sparsam.",
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BALLKONTROLLE (6 Karten)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "ballkontrolle-pin-control",
    title: "Pin-Kontrolle (Grundposition)",
    summary:
      "Die Pin-Kontrolle ist die wichtigste Grundtechnik der Ballkontrolle. Der Ball wird von oben mit der Figurensohle fixiert und kann aus dieser Position heraus in jede Richtung bewegt werden.",
    difficulty: "beginner",
    category: "Ballkontrolle",
    tags: ["pin", "grundposition", "kontrolle", "basis", "anfänger"],
    steps: [
      "Fange den Ball mit einer Figur ab, indem du ihn unter die Figurensohle bringst.",
      "Drücke die Figur leicht nach vorne, sodass der Ball zwischen Spielfeld und Figurenfuß eingeklemmt wird.",
      "Halte den Druck konstant – nicht zu fest (Ball springt) und nicht zu locker (Ball rollt weg).",
      "Übe, den Ball aus der Pin-Position seitlich zu bewegen, ohne ihn zu verlieren.",
      "Trainiere den Wechsel zwischen verschiedenen Figuren auf derselben Stange.",
    ],
    commonMistakes: [
      "Zu viel Druck auf den Ball – er springt beim Loslassen unkontrolliert weg.",
      "Die Figur steht nicht im richtigen Winkel, sodass der Ball seitlich wegrollt.",
      "Hektische Bewegungen bei der lateralen Ballführung lassen den Ball entkommen.",
    ],
    coachCues: [
      "Sanfter, konstanter Druck – stelle dir vor, du hältst ein Ei unter der Figur.",
      "Der Ball soll ruhig liegen, bevor du die nächste Aktion startest.",
    ],
  },
  {
    id: "ballkontrolle-front-pin",
    title: "Vorderer Pin (Front-Pin)",
    summary:
      "Beim vorderen Pin wird der Ball vor der Figur fixiert. Die Figur ist leicht nach vorne geneigt und klemmt den Ball zwischen ihrer Vorderseite und dem Spielfeld. Dies ist die Ausgangsposition für viele Schusstechniken.",
    difficulty: "beginner",
    category: "Ballkontrolle",
    tags: ["front-pin", "vorne", "schussposition", "grundlage", "kontrolle"],
    steps: [
      "Neige die Figur leicht nach vorne (Richtung gegnerisches Tor).",
      "Bringe den Ball vor die Figur, sodass er zwischen der geneigten Figurenvorderseite und dem Spielfeld eingeklemmt wird.",
      "Halte den Druck über den Griff konstant, sodass der Ball stabil liegt.",
      "Übe, aus dem Front-Pin heraus seitlich zu bewegen – dies ist die Basis für den Jet/Snake.",
      "Trainiere den Übergang vom Front-Pin zum Schuss in einer flüssigen Bewegung.",
    ],
    commonMistakes: [
      "Die Figur ist zu steil geneigt – der Ball rutscht unter der Figur durch.",
      "Inkonstanter Druck führt dazu, dass der Ball bei Seitwärtsbewegungen verloren geht.",
      "Der Übergang vom Pin zum Schuss ist zu langsam und gibt dem Gegner Zeit.",
    ],
    coachCues: [
      "Der vordere Pin ist deine Schussausgangsposition – gewöhne dich daran, hier sicher zu stehen.",
      "Übe den Front-Pin mit beiden Händen, um flexibel zu sein.",
      "Stabilität vor Geschwindigkeit – erst sicher stehen, dann schnell bewegen.",
    ],
  },
  {
    id: "ballkontrolle-back-pin",
    title: "Hinterer Pin (Back-Pin)",
    summary:
      "Beim hinteren Pin wird der Ball hinter der Figur fixiert. Die Figur ist leicht nach hinten geneigt und klemmt den Ball zwischen ihrer Rückseite und dem Spielfeld. Ideal zum Empfangen von Pässen aus der eigenen Hälfte.",
    difficulty: "beginner",
    category: "Ballkontrolle",
    tags: ["back-pin", "hinten", "annahme", "passempfang", "kontrolle"],
    steps: [
      "Neige die Figur leicht nach hinten (Richtung eigenes Tor).",
      "Der Ball wird von hinten an die Figur herangespielt oder rollt auf sie zu.",
      "Fange den Ball mit der Rückseite der geneigten Figur ab.",
      "Klemme den Ball zwischen der Figurenrückseite und dem Spielfeld ein.",
      "Wechsle bei Bedarf vom Back-Pin in den Front-Pin, um die Schussposition einzunehmen.",
    ],
    commonMistakes: [
      "Die Figur ist nicht weit genug nach hinten geneigt – der Ball prallt ab.",
      "Der Wechsel vom Back-Pin zum Front-Pin dauert zu lange und gibt dem Gegner Zeit.",
      "Zu wenig Übung bei der Annahme schneller Bälle im Back-Pin.",
    ],
    coachCues: [
      "Geh dem Ball entgegen und federe ihn sanft ab – nicht hart stoppen.",
      "Der Back-Pin ist die natürliche Annahmeposition für Pässe von hinten.",
    ],
  },
  {
    id: "ballkontrolle-ball-stop",
    title: "Ballstopp (Catch)",
    summary:
      "Der Ballstopp ist die Fähigkeit, einen sich bewegenden Ball mit der Figur kontrolliert zum Stehen zu bringen. Er ist die Grundvoraussetzung für jedes kontrollierte Spiel.",
    difficulty: "beginner",
    category: "Ballkontrolle",
    tags: ["stopp", "catch", "annahme", "grundlage", "anfänger"],
    steps: [
      "Beobachte den ankommenden Ball und antizipiere seine Geschwindigkeit und Richtung.",
      "Positioniere die Figur leicht schräg in den Weg des Balls.",
      "Gib beim Kontakt mit dem Ball leicht nach, um die Energie des Balls zu absorbieren.",
      "Bringe den Ball in die Pin-Position, sobald er genug abgebremst ist.",
      "Übe den Ballstopp aus verschiedenen Geschwindigkeiten und Winkeln.",
      "Trainiere den Stopp auf verschiedenen Reihen (2er, 5er, 3er).",
    ],
    commonMistakes: [
      "Die Figur steht starr – der Ball prallt ab, anstatt kontrolliert zu werden.",
      "Zu frühes oder zu spätes Nachgeben beim Ballkontakt.",
      "Nur auf einer Reihe geübt – im Spiel muss der Ball überall gestoppt werden können.",
    ],
    coachCues: [
      "Federe den Ball ab wie ein Torwart einen Schuss – weich auffangen, nicht blocken.",
      "Übe den Stopp mit beiden Händen und auf allen Reihen.",
      "Je schneller der Ball, desto mehr musst du nachgeben.",
    ],
  },
  {
    id: "ballkontrolle-cushion-control",
    title: "Cushion-Kontrolle (Abfederung)",
    summary:
      "Die Cushion-Kontrolle ist eine fortgeschrittene Technik, bei der die Figur dem Ball aktiv entgegenkommt und ihn durch kontrolliertes Zurückweichen sanft auffängt. Sie ermöglicht die Kontrolle auch sehr schneller Bälle.",
    difficulty: "intermediate",
    category: "Ballkontrolle",
    tags: ["cushion", "abfederung", "fortgeschritten", "schnelle-bälle", "kontrolle"],
    steps: [
      "Positioniere die Figur im Weg des ankommenden Balls.",
      "Bewege die Figur dem Ball leicht entgegen, um den Kontaktpunkt zu bestimmen.",
      "Im Moment des Ballkontakts ziehe die Figur in Ballrichtung zurück.",
      "Die Rückwärtsbewegung absorbiert die Energie des Balls und bremst ihn sanft ab.",
      "Bringe den Ball nahtlos in eine kontrollierte Position (Pin oder unter der Figur).",
    ],
    commonMistakes: [
      "Die Entgegenbewegung ist zu stark – die Figur schießt den Ball zurück.",
      "Das Timing der Rückwärtsbewegung stimmt nicht mit dem Ballkontakt überein.",
      "Die Cushion-Bewegung ist zu groß, sodass der Ball hinter der Figur endet.",
    ],
    coachCues: [
      "Stell dir vor, du fängst ein rohes Ei – entgegenfahren und sanft auffangen.",
      "Übe das Timing mit verschieden schnellen Bällen.",
      "Die Cushion-Kontrolle macht dich auch gegen harte Schüsse sicherer.",
    ],
  },
  {
    id: "ballkontrolle-ball-roll",
    title: "Ballführung (Ball-Roll)",
    summary:
      "Die Ballführung beschreibt das kontrollierte seitliche Bewegen des Balls entlang einer Stange. Der Ball wird durch geschickte Figurenbewegungen lateral über das Spielfeld gerollt, um Schuss- oder Passpositionen zu verändern.",
    difficulty: "intermediate",
    category: "Ballkontrolle",
    tags: ["ball-roll", "führung", "lateral", "bewegung", "positionierung"],
    steps: [
      "Halte den Ball in der Pin-Position unter einer Figur.",
      "Bewege die Stange seitlich, sodass der Ball mit der Figur mitrollt.",
      "Übergib den Ball von einer Figur zur nächsten auf derselben Stange durch kurze, präzise Stöße.",
      "Halte den Druck während der gesamten Seitwärtsbewegung konstant.",
      "Übe die Ballführung in beide Richtungen mit gleichmäßigem Tempo.",
      "Trainiere Tempowechsel: langsam rollen, dann explosiv beschleunigen.",
    ],
    commonMistakes: [
      "Der Ball entkommt bei der Übergabe zwischen zwei Figuren.",
      "Die Seitwärtsbewegung ist ruckartig statt flüssig.",
      "Nur in eine Richtung geübt – im Spiel muss die Ballführung beidseitig sicher sein.",
    ],
    coachCues: [
      "Flüssig rollen, nicht ruckeln – der Ball bleibt immer unter Kontrolle.",
      "Die Übergabe zwischen Figuren ist der kritische Moment – hier präzise arbeiten.",
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // DEFENSIVE (6 Karten)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "defensive-shuffle",
    title: "Shuffle-Defense (Verschieben)",
    summary:
      "Die Shuffle-Defense ist die grundlegende Verteidigungstechnik, bei der die Abwehrreihe ständig seitlich verschoben wird, um Schusslücken zu schließen. Durch schnelles Hin-und-her-Bewegen wird es dem Angreifer erschwert, eine offene Ecke zu finden.",
    difficulty: "beginner",
    category: "Defensive",
    tags: ["shuffle", "verschieben", "2er-reihe", "grundlage", "defense"],
    steps: [
      "Positioniere die 2er-Abwehrreihe in der Mitte des Tores.",
      "Bewege die Stange in einem gleichmäßigen, schnellen Rhythmus seitlich hin und her.",
      "Variiere die Geschwindigkeit und den Rhythmus, um unberechenbar zu bleiben.",
      "Achte darauf, dass die Figuren den maximalen Torbereich abdecken.",
      "Reagiere auf die laterale Bewegung des Gegners – verschiebe dich in seine Schussrichtung.",
    ],
    commonMistakes: [
      "Der Rhythmus ist zu gleichmäßig und vorhersehbar – der Gegner schießt in die Lücke.",
      "Die Verschiebung deckt nicht den gesamten Torbereich ab.",
      "Zu hastige Bewegungen, die zu Überreaktionen und offenen Lücken führen.",
    ],
    coachCues: [
      "Bleib unberechenbar – variiere Tempo und Richtungswechsel.",
      "Decke den gesamten Torbereich ab, nicht nur die Mitte.",
      "Beobachte den Ball, nicht die Hände des Gegners.",
    ],
  },
  {
    id: "defensive-zone",
    title: "Zone-Defense (Zonenverteidigung)",
    summary:
      "Bei der Zonenverteidigung werden feste Zonen des Tores der Abwehr und dem Torwart zugewiesen. Statt reaktiv zu verschieben, deckt jede Reihe ihren zugewiesenen Bereich konsequent ab.",
    difficulty: "intermediate",
    category: "Defensive",
    tags: ["zone", "zuordnung", "torwart", "2er-reihe", "system"],
    steps: [
      "Weise dem Torwart die Mitte und eine Seite des Tores zu.",
      "Die 2er-Abwehrreihe deckt den gegenüberliegenden Bereich ab.",
      "Beide Reihen bleiben primär in ihren zugewiesenen Zonen.",
      "Bei einem Schuss reagiert die zuständige Reihe, während die andere ihre Position hält.",
      "Kommuniziere im Doppel klar, welche Zone wer abdeckt.",
      "Passe die Zonenaufteilung an die Schussgewohnheiten des Gegners an.",
    ],
    commonMistakes: [
      "Beide Reihen versuchen, denselben Bereich abzudecken – andere Bereiche bleiben offen.",
      "Die Zonenaufteilung wird unter Druck aufgegeben, und beide Spieler reagieren chaotisch.",
      "Keine Anpassung der Zonen an die Spielweise des Gegners.",
    ],
    coachCues: [
      "Vertraue deinem System – bleib in deiner Zone, auch wenn es schwerfällt.",
      "Kommunikation ist der Schlüssel: Wer deckt was ab?",
      "Passe die Zonen nach jedem Satz an, wenn der Gegner eine Schwäche gefunden hat.",
    ],
  },
  {
    id: "defensive-baiting",
    title: "Baiting (Ködern)",
    summary:
      "Beim Baiting wird absichtlich eine Lücke in der Abwehr geöffnet, um den Gegner zu einem Schuss in diese Lücke zu verleiten. Im letzten Moment wird die Lücke geschlossen und der Ball abgefangen.",
    difficulty: "advanced",
    category: "Defensive",
    tags: ["baiting", "ködern", "falle", "psychologie", "defense"],
    steps: [
      "Identifiziere die bevorzugte Schussrichtung des Gegners.",
      "Öffne absichtlich eine Lücke in der Abwehr auf der entsprechenden Seite.",
      "Warte, bis der Gegner den Schuss ansetzt und auf die offene Lücke zielt.",
      "Schließe die Lücke blitzschnell, genau wenn der Gegner schießt.",
      "Fange den Ball ab oder blocke den Schuss und starte sofort den Gegenangriff.",
    ],
    commonMistakes: [
      "Die Lücke wird zu spät geschlossen – der Gegner trifft ins offene Tor.",
      "Das Ködern ist zu offensichtlich, und der Gegner durchschaut die Falle.",
      "Zu häufiger Einsatz – der Gegner gewöhnt sich daran und ändert seine Strategie.",
    ],
    coachCues: [
      "Timing ist alles – schließe die Lücke genau im Moment des Schusses.",
      "Mache die Lücke verlockend, aber nicht verdächtig groß.",
      "Nutze Baiting sparsam – es funktioniert am besten als Überraschung.",
    ],
  },
  {
    id: "defensive-race",
    title: "Race-Condition (Schnelligkeitsduell)",
    summary:
      "Bei der Race-Condition geht es darum, die Abwehr schneller zu bewegen als der Angreifer schießen kann. Es ist ein direktes Schnelligkeitsduell zwischen Abwehr und Angriff.",
    difficulty: "intermediate",
    category: "Defensive",
    tags: ["race", "schnelligkeit", "reaktion", "duell", "defense"],
    steps: [
      "Beobachte die Position des Balls und die Handbewegung des Angreifers genau.",
      "Halte die Abwehrfiguren in einer neutralen, mittig positionierten Grundstellung.",
      "Reagiere auf die erste Bewegung des Angreifers – verschiebe sofort in die erkannte Richtung.",
      "Bewege die Abwehr so schnell wie möglich, um die Schussrichtung zu blockieren.",
      "Nach dem Block sofort den Ball sichern und kontrolliert spielen.",
    ],
    commonMistakes: [
      "Zu frühe Reaktion auf eine Finte – die Abwehr bewegt sich in die falsche Richtung.",
      "Zu langsame Reaktion – der Ball passiert die Abwehr, bevor sie in Position ist.",
      "Die Grundstellung ist nicht optimal, sodass der Weg in eine Richtung zu weit ist.",
    ],
    coachCues: [
      "Reagiere auf den Ball, nicht auf die Hand – Finten liest du an der Hand, Schüsse am Ball.",
      "Bleib locker und in der Mitte – Spannung verlangsamt dich.",
      "Kurze, explosive Bewegungen schlagen weite Verschiebungen.",
    ],
  },
  {
    id: "defensive-goalie-angles",
    title: "Torwart-Winkel (Goalie Angles)",
    summary:
      "Die richtige Positionierung des Torwarts basiert auf den Schusswinkeln des Gegners. Durch optimale Winkelstellung wird die effektive Torgröße für den Angreifer minimiert.",
    difficulty: "intermediate",
    category: "Defensive",
    tags: ["torwart", "winkel", "positionierung", "goalie", "defense"],
    steps: [
      "Analysiere, von welcher Position der Gegner schießen kann.",
      "Positioniere den Torwart so, dass er den optimalen Winkel zur Schussposition abdeckt.",
      "Bei zentralen Schüssen steht der Torwart mittig, bei seitlichen Schüssen verschiebt er sich zur Schussseite.",
      "Koordiniere die Torwartposition mit der 2er-Abwehrreihe für maximale Abdeckung.",
      "Passe die Position bei jedem Ballwechsel auf der gegnerischen Seite an.",
    ],
    commonMistakes: [
      "Der Torwart steht immer mittig, egal wo der Ball ist – seitliche Schüsse haben freie Bahn.",
      "Überreaktion auf seitliche Positionen – die Mitte bleibt offen.",
      "Keine Abstimmung zwischen Torwart und 2er-Reihe führt zu doppelter Abdeckung und offenen Zonen.",
    ],
    coachCues: [
      "Dein Torwart folgt dem Ball – immer auf der Linie zwischen Ball und Tormitte.",
      "Stimme dich mit deiner 2er-Reihe ab – doppelte Abdeckung nützt nichts.",
      "Übe die Winkelstellung gegen verschiedene Schusspositionen.",
    ],
  },
  {
    id: "defensive-2bar-coverage",
    title: "2er-Reihen-Abdeckung",
    summary:
      "Die 2er-Reihe ist die letzte Verteidigungslinie vor dem Torwart. Ihre optimale Positionierung und Bewegung ist entscheidend für eine stabile Defensive.",
    difficulty: "beginner",
    category: "Defensive",
    tags: ["2er-reihe", "abdeckung", "positionierung", "grundlage", "defense"],
    steps: [
      "Positioniere die beiden Figuren der 2er-Reihe so, dass sie den maximalen Torbereich abdecken.",
      "Halte einen gleichmäßigen Abstand zwischen den Figuren und zum Torwart.",
      "Verschiebe die 2er-Reihe als Einheit seitlich, um auf die Ballposition zu reagieren.",
      "Nutze die 2er-Reihe nicht nur zum Blocken, sondern auch zum kontrollierten Abfangen des Balls.",
      "Nach einem erfolgreichen Block spiele den Ball sofort kontrolliert weiter – nicht planlos wegschießen.",
    ],
    commonMistakes: [
      "Die Figuren stehen zu eng beieinander und decken nur einen kleinen Bereich ab.",
      "Nach dem Block wird der Ball unkontrolliert nach vorne geschossen und landet beim Gegner.",
      "Die 2er-Reihe wird zu hektisch bewegt und überreagiert auf Finten.",
    ],
    coachCues: [
      "Breite Aufstellung, ruhige Verschiebung – Hektik hilft dem Angreifer.",
      "Nach dem Block ist vor dem Angriff – spiele den Ball kontrolliert weiter.",
      "Arbeite zusammen mit dem Torwart – ihr seid ein Team in der Defensive.",
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // TAKTIK (5 Karten)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "taktik-tempo-control",
    title: "Tempo-Kontrolle",
    summary:
      "Tempo-Kontrolle bedeutet, das Spieltempo bewusst zu steuern. Durch gezieltes Beschleunigen oder Verlangsamen des Spiels kann der Gegner unter Druck gesetzt oder aus dem Rhythmus gebracht werden.",
    difficulty: "intermediate",
    category: "Taktik",
    tags: ["tempo", "kontrolle", "rhythmus", "strategie", "spielsteuerung"],
    steps: [
      "Analysiere, bei welchem Tempo sich dein Gegner wohl fühlt.",
      "Wenn der Gegner schnelles Spiel mag, verlangsame das Tempo und halte den Ball.",
      "Wenn der Gegner langsam und kontrolliert spielt, beschleunige mit schnellen Pässen.",
      "Wechsle das Tempo innerhalb eines Ballbesitzes: erst langsam aufbauen, dann plötzlich beschleunigen.",
      "Nutze die Schussuhr bewusst – halte den Ball so lange wie erlaubt, um den Gegner warten zu lassen.",
    ],
    commonMistakes: [
      "Das eigene Tempo wird dem Gegner überlassen, statt es selbst zu bestimmen.",
      "Das Tempo wird zu abrupt gewechselt, sodass man selbst die Kontrolle verliert.",
      "Tempoverlangsamung wird als Zeitspiel empfunden und verärgert den Gegner unnötig.",
    ],
    coachCues: [
      "Du bestimmst das Tempo, nicht dein Gegner – sei der Dirigent des Spiels.",
      "Langsam aufbauen, explosiv abschließen – der Tempowechsel ist deine Waffe.",
      "Nutze die erlaubte Zeit am Ball bewusst, aber provoziere nicht.",
    ],
  },
  {
    id: "taktik-mental-game",
    title: "Mentales Spiel",
    summary:
      "Das mentale Spiel umfasst alle psychologischen Aspekte des Tischfussballs: Konzentration, Umgang mit Druck, Selbstvertrauen und die Fähigkeit, nach Rückständen ruhig zu bleiben.",
    difficulty: "intermediate",
    category: "Taktik",
    tags: ["mental", "psychologie", "fokus", "druck", "konzentration"],
    steps: [
      "Entwickle eine Pre-Shot-Routine: Atme tief ein, fokussiere dich und führe dann den Schuss aus.",
      "Nach einem Gegentor: Kurz pausieren, durchatmen und den Fokus auf den nächsten Ball richten.",
      "Setze dir Zwischenziele im Spiel: erst den nächsten Punkt, nicht das Gesamtergebnis.",
      "Vermeide negative Selbstgespräche – ersetze ‚Ich darf nicht verlieren' durch ‚Ich fokussiere mich auf meinen nächsten Schuss'.",
      "Trainiere unter simuliertem Druck: Spiele Übungssätze mit künstlichem Rückstand.",
    ],
    commonMistakes: [
      "Nach einem Fehler wird über den Fehler nachgedacht statt über die nächste Aktion.",
      "Bei Rückstand wird zu riskant gespielt, anstatt das eigene System beizubehalten.",
      "Fehlende Routine vor Schüssen führt zu inkonsistenter Ausführung.",
    ],
    coachCues: [
      "Jeder Ball ist ein neues Spiel – vergiss, was vorher war.",
      "Atmen, Fokussieren, Ausführen – deine drei Schritte vor jedem Schuss.",
      "Vertraue deinem Training – unter Druck machst du das, was du geübt hast.",
    ],
  },
  {
    id: "taktik-timeout",
    title: "Timeout-Strategie",
    summary:
      "Das Timeout ist ein mächtiges taktisches Werkzeug. Richtig eingesetzt, kann es den Spielfluss des Gegners unterbrechen, dem eigenen Team eine Denkpause verschaffen und die Dynamik eines Satzes komplett verändern.",
    difficulty: "advanced",
    category: "Taktik",
    tags: ["timeout", "pause", "strategie", "momentum", "taktik"],
    steps: [
      "Nimm ein Timeout, wenn der Gegner einen Lauf hat und mehrere Punkte hintereinander erzielt.",
      "Nutze die Pause, um die Taktik des Gegners zu analysieren und Anpassungen zu besprechen.",
      "Nimm kein Timeout, wenn du selbst im Spielfluss bist – Momentum nicht unterbrechen.",
      "Spare mindestens ein Timeout für kritische Situationen im letzten Satz auf.",
      "Nutze das Timeout auch, um dich physisch zu erholen: Hände trocknen, Griff nachfassen.",
    ],
    commonMistakes: [
      "Alle Timeouts werden zu früh verbraucht, und in der Endphase steht keins mehr zur Verfügung.",
      "Das Timeout wird nicht genutzt, um taktische Anpassungen zu machen – es wird nur ‚gewartet'.",
      "Das Timeout wird aus Frustration genommen, nicht aus strategischen Gründen.",
    ],
    coachCues: [
      "Ein Timeout unterbricht das Momentum des Gegners – nutze es gezielt.",
      "Besprich in der Pause konkret: Was machen wir anders? Nicht: Was lief schlecht?",
      "Halte immer ein Timeout in Reserve für den entscheidenden Moment.",
    ],
  },
  {
    id: "taktik-reading-opponent",
    title: "Gegner lesen",
    summary:
      "Die Fähigkeit, den Gegner zu lesen, ist eine der wichtigsten taktischen Kompetenzen. Durch Beobachtung von Mustern, Gewohnheiten und Tendenzen kann das eigene Spiel optimal angepasst werden.",
    difficulty: "advanced",
    category: "Taktik",
    tags: ["analyse", "beobachtung", "muster", "anpassung", "gegner"],
    steps: [
      "Beobachte in den ersten Ballwechseln, welche Schüsse und Pässe der Gegner bevorzugt.",
      "Achte auf Muster: Schießt der Gegner meistens in dieselbe Ecke? Nutzt er immer denselben Pass?",
      "Analysiere die Defensive: Wo steht der Gegner in der Abwehr? Welche Lücken öffnen sich regelmäßig?",
      "Passe dein Spiel an: Nutze die erkannten Schwächen gezielt aus.",
      "Überprüfe laufend, ob der Gegner sein Spiel anpasst, und reagiere entsprechend.",
      "Tausche im Doppel Beobachtungen mit deinem Partner aus.",
    ],
    commonMistakes: [
      "Keine Beobachtung in den ersten Ballwechseln – wertvolle Informationen gehen verloren.",
      "Einmal erkannte Muster werden als unveränderlich angenommen – gute Gegner passen sich an.",
      "Zu starker Fokus auf den Gegner, sodass das eigene Spiel vernachlässigt wird.",
    ],
    coachCues: [
      "Die ersten drei Ballwechsel sind deine Analysezeit – beobachte mehr als du spielst.",
      "Frage dich nach jedem Punkt: Was hat der Gegner gemacht und warum?",
      "Passe dein Spiel an, aber verliere nie deine eigenen Stärken aus den Augen.",
    ],
  },
  {
    id: "taktik-doubles-communication",
    title: "Doppel-Kommunikation",
    summary:
      "Effektive Kommunikation im Doppel ist der Schlüssel zum Erfolg. Klare Absprachen über Zuständigkeiten, Spielzüge und taktische Anpassungen unterscheiden gute Teams von großartigen Teams.",
    difficulty: "beginner",
    category: "Taktik",
    tags: ["doppel", "kommunikation", "teamplay", "absprache", "partner"],
    steps: [
      "Klärt vor dem Spiel die Grundaufstellung: Wer spielt welche Stangen?",
      "Vereinbart einfache Codewörter für häufige Spielzüge und Pässe.",
      "Kommuniziert während des Spiels laufend: ‚Bereit', ‚Pass kommt', ‚Ich schieße'.",
      "Gebt euch nach Fehlern positives Feedback – Schuldzuweisungen zerstören die Teamchemie.",
      "Nutzt Pausen und Timeouts, um taktische Anpassungen zu besprechen.",
      "Feiert gelungene Aktionen zusammen, um die Moral hochzuhalten.",
    ],
    commonMistakes: [
      "Keine Absprache vor dem Spiel – jeder spielt sein eigenes System.",
      "Vorwürfe nach Fehlern statt konstruktiver Kommunikation.",
      "Zu viel Kommunikation während der Aktion – der Fokus geht verloren.",
    ],
    coachCues: [
      "Kurz und klar kommunizieren – ein Wort reicht oft: ‚Bereit!', ‚Jetzt!', ‚Halt!'.",
      "Ihr gewinnt und verliert als Team – unterstützt euch gegenseitig.",
      "Besprecht Taktik in Pausen, nicht während des Spiels.",
    ],
  },
];
