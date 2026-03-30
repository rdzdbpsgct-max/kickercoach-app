import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "../../store";
import { Badge, Card, Button } from "../../components/ui";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-xs text-kicker-orange">
      {Array.from({ length: 5 }, (_, i) =>
        i < rating ? "\u2605" : "\u2606",
      ).join("")}
    </span>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  stat: string;
  badgeColor: "blue" | "orange" | "green" | "red" | "accent";
  description: string;
  to: string;
  cta: string;
}

function FeatureCard({
  icon,
  title,
  stat,
  badgeColor,
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
        <Badge color={badgeColor}>{stat}</Badge>
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
  const sessions = useAppStore((s) => s.sessions);
  const players = useAppStore((s) => s.players);
  const matchPlans = useAppStore((s) => s.matchPlans);
  const customDrills = useAppStore((s) => s.customDrills);
  const goals = useAppStore((s) => s.goals);

  const lastSession = useMemo(() => {
    if (sessions.length === 0) return null;
    return [...sessions].sort((a, b) => b.date.localeCompare(a.date))[0];
  }, [sessions]);

  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    const thisWeek = sessions.filter((s) => s.date >= weekAgo);
    const totalMinutes = Math.round(
      sessions.reduce((sum, s) => sum + s.totalDuration, 0) / 60,
    );
    const totalHours = (totalMinutes / 60).toFixed(1);
    return {
      sessionsThisWeek: thisWeek.length,
      totalSessions: sessions.length,
      totalHours,
    };
  }, [sessions]);

  const hasData = sessions.length > 0 || players.length > 0;
  const activeGoals = goals.filter((g) => g.status === "active").length;

  const getPlayerName = (id: string) =>
    players.find((p) => p.id === id)?.name ?? "?";

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-auto pb-6">
      {/* Hero: Tischkicker-Feld */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-field-border bg-field px-6 py-10 text-center">
        <div className="pointer-events-none absolute inset-0 flex">
          <div className="flex-1 border-r border-white/20" />
          <div className="flex-1 border-r border-white/20" />
          <div className="flex-1 border-r border-white/20" />
          <div className="flex-1 border-r border-white/20" />
          <div className="flex-1" />
        </div>
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
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

      {/* Dynamic content when data exists */}
      {hasData && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <h3 className="mb-3 text-sm font-bold text-text">Schnellzugriff</h3>
            <div className="flex flex-wrap gap-2">
              <Link to="/train">
                <Button size="sm">+ Training</Button>
              </Link>
              <Link to="/players">
                <Button size="sm" variant="secondary">+ Spieler</Button>
              </Link>
              <Link to="/plan">
                <Button size="sm" variant="secondary">+ Matchplan</Button>
              </Link>
            </div>
          </Card>

          {/* Last Session */}
          {lastSession && (
            <Card>
              <h3 className="mb-2 text-sm font-bold text-text">Letzte Session</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text">
                  {lastSession.name}
                </span>
                {lastSession.rating && <StarRating rating={lastSession.rating} />}
              </div>
              <div className="mt-1 text-xs text-text-dim">
                {lastSession.date} &middot; {lastSession.drillIds.length} Drills
              </div>
              {lastSession.playerIds.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {lastSession.playerIds.map((id) => (
                    <Badge key={id} color="blue">{getPlayerName(id)}</Badge>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Players */}
          {players.length > 0 && (
            <Card>
              <h3 className="mb-2 text-sm font-bold text-text">
                Spieler ({players.length})
              </h3>
              <div className="flex flex-col gap-1.5">
                {players.slice(0, 4).map((player) => (
                  <div key={player.id} className="flex items-center gap-2">
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: player.avatarColor ?? "#6366f1" }}
                    >
                      {player.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-xs font-medium text-text">{player.name}</span>
                    <Badge color="orange">{player.level === "beginner" ? "Einsteiger" : player.level === "intermediate" ? "Fortgeschritten" : "Profi"}</Badge>
                  </div>
                ))}
                {players.length > 4 && (
                  <span className="text-[10px] text-text-dim">
                    +{players.length - 4} weitere
                  </span>
                )}
              </div>
            </Card>
          )}

          {/* Stats */}
          <Card>
            <h3 className="mb-2 text-sm font-bold text-text">Statistik</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-accent">
                  {stats.sessionsThisWeek}
                </div>
                <div className="text-[10px] text-text-dim">Diese Woche</div>
              </div>
              <div>
                <div className="text-lg font-bold text-accent">
                  {stats.totalSessions}
                </div>
                <div className="text-[10px] text-text-dim">Gesamt</div>
              </div>
              <div>
                <div className="text-lg font-bold text-accent">
                  {stats.totalHours}h
                </div>
                <div className="text-[10px] text-text-dim">Stunden</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Onboarding (shown when no data) */}
      {!hasData && (
        <div className="animate-fade-in">
          <Card className="text-center py-8">
            <h2 className="text-lg font-bold text-text mb-2">
              Willkommen bei KickerCoach!
            </h2>
            <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
              Deine digitale Coaching-App f&uuml;r Tischfussball. Starte jetzt mit deinem ersten Spieler oder einer Trainingseinheit.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/players">
                <Button>Ersten Spieler anlegen</Button>
              </Link>
              <Link to="/train">
                <Button variant="secondary">Erstes Training starten</Button>
              </Link>
              <Link to="/learn">
                <Button variant="secondary">Techniken entdecken</Button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* Feature-Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up">
        <FeatureCard
          icon={"\uD83D\uDCDA"}
          title="Lernen"
          stat="48 Coaching-Karten"
          badgeColor="blue"
          description="7 Kategorien &ndash; von Torschuss &uuml;ber Passspiel und Ballkontrolle bis hin zu Defensive, Taktik, Offensive und Mental."
          to="/learn"
          cta="Zur Bibliothek &rarr;"
        />
        <FeatureCard
          icon={"\u23F1\uFE0F"}
          title="Training"
          stat={`${20 + customDrills.length} Drills`}
          badgeColor="orange"
          description={`Timer-gest&uuml;tzte Trainingsbl&ouml;cke mit Auto-Advance und Session-Builder.${sessions.length > 0 ? ` ${sessions.length} Sessions aufgezeichnet.` : ""}`}
          to="/train"
          cta="Zum Training &rarr;"
        />
        <FeatureCard
          icon={"\uD83D\uDCCB"}
          title="Matchplan"
          stat={matchPlans.length > 0 ? `${matchPlans.length} Pl&auml;ne` : "Taktik & Strategie"}
          badgeColor="green"
          description="Matchpl&auml;ne mit Gegneranalyse, Gameplan, Timeout-Strategien sowie offensiven und defensiven Taktikvorlagen."
          to="/plan"
          cta="Zum Matchplan &rarr;"
        />
        <FeatureCard
          icon={"\uD83C\uDFAF"}
          title="Taktikboard"
          stat="Interaktiv"
          badgeColor="accent"
          description="Spielz&uuml;ge auf dem Canvas-Taktikboard planen. Figuren verschieben, Pfeile und Zonen zeichnen."
          to="/board"
          cta="Zum Taktikboard &rarr;"
        />
        <FeatureCard
          icon={"\uD83D\uDC64"}
          title="Spieler"
          stat={players.length > 0 ? `${players.length} Spieler` : "Neu"}
          badgeColor="blue"
          description={`Spielerprofile mit Skill-Radar, Positionen und Leistungsnachverfolgung.${activeGoals > 0 ? ` ${activeGoals} aktive Ziele.` : ""}`}
          to="/players"
          cta="Zu den Spielern &rarr;"
        />
      </div>
    </div>
  );
}
