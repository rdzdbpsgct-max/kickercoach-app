import { Link } from "react-router-dom";

interface FeatureCardProps {
  icon: string;
  title: string;
  stat: string;
  statColor: string;
  description: string;
  to: string;
  cta: string;
}

function FeatureCard({
  icon,
  title,
  stat,
  statColor,
  description,
  to,
  cta,
}: FeatureCardProps) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-accent hover:bg-card-hover focus-visible:outline-2 focus-visible:outline-accent"
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statColor}`}
        >
          {stat}
        </span>
      </div>
      <div>
        <h2 className="text-base font-bold text-text">{title}</h2>
        <p className="mt-1.5 text-xs leading-relaxed text-text-muted">
          {description}
        </p>
      </div>
      <div className="mt-auto pt-2">
        <span className="text-xs font-semibold text-accent group-hover:text-accent-hover transition-colors">
          {cta}
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col gap-6 overflow-auto pb-6">
      {/* Hero: Tischkicker-Feld */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-field-border bg-field px-6 py-10 text-center">
        {/* Stangenlinien */}
        <div className="pointer-events-none absolute inset-0 flex">
          <div className="flex-1 border-r border-white/20" />
          <div className="flex-1 border-r border-white/20" />
          <div className="flex-1 border-r border-white/20" />
          <div className="flex-1 border-r border-white/20" />
          <div className="flex-1" />
        </div>
        {/* Mittelkreis */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />

        {/* Inhalt */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-kicker-blue text-2xl font-bold text-white shadow-lg">
            K
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            KickerCoach
          </h1>
          <p className="text-sm text-white/70">by SpielerGeist</p>
        </div>
      </div>

      {/* Willkommenstext */}
      <div className="text-center">
        <p className="text-sm leading-relaxed text-text-muted md:text-base">
          Deine digitale Coaching-App f&uuml;r Tischfussball.{" "}
          <span className="text-text">
            Technik lernen, gezielt trainieren, taktisch planen und Spielz&uuml;ge
            visualisieren.
          </span>
        </p>
      </div>

      {/* Feature-Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          icon={"\uD83D\uDCDA"}
          title="Lernen"
          stat="48 Coaching-Karten"
          statColor="bg-kicker-blue/15 text-kicker-blue"
          description="7 Kategorien &ndash; von Torschuss &uuml;ber Passspiel und Ballkontrolle bis hin zu Defensive, Taktik, Offensive und Mental. Schritt-f&uuml;r-Schritt-Anleitungen, Coach-Tipps und Lernpfade."
          to="/learn"
          cta="Zur Bibliothek &rarr;"
        />
        <FeatureCard
          icon={"\u23F1\uFE0F"}
          title="Training"
          stat="20 Drills"
          statColor="bg-kicker-orange/15 text-kicker-orange"
          description="Timer-gest&uuml;tzte Trainingsbl&ouml;cke mit Auto-Advance, Schwierigkeitsfilter und Session-Builder. Halte deinen Fortschritt im Trainingstagebuch fest."
          to="/train"
          cta="Zum Training &rarr;"
        />
        <FeatureCard
          icon={"\uD83D\uDCCB"}
          title="Matchplan"
          stat="Taktik & Strategie"
          statColor="bg-kicker-green/15 text-kicker-green"
          description="Erstelle individuelle Matchpl&auml;ne mit Gegneranalyse, Gameplan, Timeout-Strategien sowie offensiven und defensiven Taktikvorlagen. Import &amp; Export als JSON."
          to="/plan"
          cta="Zum Matchplan &rarr;"
        />
        <FeatureCard
          icon={"\uD83C\uDFAF"}
          title="Taktikboard"
          stat="Interaktiv"
          statColor="bg-accent/15 text-accent"
          description="Spielz&uuml;ge auf dem Canvas-Taktikboard planen. Figuren verschieben, Pfeile und Zonen zeichnen, Szenen speichern und als PNG exportieren."
          to="/board"
          cta="Zum Taktikboard &rarr;"
        />
      </div>
    </div>
  );
}
