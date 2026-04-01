import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "../../store";
import { Badge, Card, Button } from "../../components/ui";
import { getWeakCategories } from "../../domain/logic/recommendations";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-xs text-kicker-orange">
      {Array.from({ length: 5 }, (_, i) =>
        i < rating ? "\u2605" : "\u2606",
      ).join("")}
    </span>
  );
}

export default function HomePage() {
  const sessions = useAppStore((s) => s.sessions);
  const players = useAppStore((s) => s.players);
  const goals = useAppStore((s) => s.goals);
  const coachingNotes = useAppStore((s) => s.coachingNotes);
  const customDrills = useAppStore((s) => s.customDrills);
  const trainingPlans = useAppStore((s) => s.trainingPlans);

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

    // Streak: consecutive days with sessions
    let streak = 0;
    if (sessions.length > 0) {
      const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
      const today = new Date().toISOString().slice(0, 10);
      let checkDate = today;
      for (let i = 0; i < 30; i++) {
        if (sorted.some((s) => s.date === checkDate)) {
          streak++;
          const d = new Date(checkDate);
          d.setDate(d.getDate() - 1);
          checkDate = d.toISOString().slice(0, 10);
        } else {
          break;
        }
      }
    }

    return {
      sessionsThisWeek: thisWeek.length,
      totalSessions: sessions.length,
      totalHours,
      streak,
    };
  }, [sessions]);

  const activeGoals = useMemo(
    () => goals.filter((g) => g.status === "active"),
    [goals],
  );

  const recentNotes = useMemo(
    () => [...coachingNotes].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [coachingNotes],
  );

  const hasData = sessions.length > 0 || players.length > 0;

  const getPlayerName = (id: string) =>
    players.find((p) => p.id === id)?.name ?? "?";

  // Frequent players (most sessions)
  const frequentPlayers = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of sessions) {
      for (const pid of s.playerIds) {
        counts[pid] = (counts[pid] ?? 0) + 1;
      }
    }
    return players
      .map((p) => ({ ...p, sessionCount: counts[p.id] ?? 0 }))
      .sort((a, b) => b.sessionCount - a.sessionCount)
      .slice(0, 4);
  }, [players, sessions]);

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-auto pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">Coaching-Hub</h1>
          <p className="text-xs text-text-dim">
            {new Date().toLocaleDateString("de-DE", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        {stats.streak > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-kicker-orange/15 px-3 py-1">
            <span className="text-sm">&#128293;</span>
            <span className="text-xs font-bold text-kicker-orange">
              {stats.streak} Tage Streak
            </span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
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
        <Link to="/learn">
          <Button size="sm" variant="secondary">Techniken</Button>
        </Link>
      </div>

      {/* Onboarding (no data) */}
      {!hasData && (
        <div className="animate-fade-in">
          <Card className="text-center py-8">
            <h2 className="text-lg font-bold text-text mb-2">
              Willkommen bei KickerCoach!
            </h2>
            <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
              Deine digitale Coaching-App fuer Tischfussball. Starte jetzt mit deinem ersten Spieler oder einer Trainingseinheit.
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

      {/* Main content grid */}
      {hasData && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Stats row */}
          <Card>
            <h3 className="mb-2 text-xs font-semibold text-text-dim">Trainings-Statistik</h3>
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

          {/* Last Session */}
          {lastSession && (
            <Link to="/train" className="block">
              <Card interactive>
                <h3 className="mb-2 text-xs font-semibold text-text-dim">Letzte Session</h3>
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
                {lastSession.retrospective && (
                  <div className="mt-2 text-[11px] text-accent">
                    Retrospektive vorhanden
                  </div>
                )}
              </Card>
            </Link>
          )}

          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <Card>
              <h3 className="mb-2 text-xs font-semibold text-text-dim">
                Offene Ziele ({activeGoals.length})
              </h3>
              <div className="flex flex-col gap-2">
                {activeGoals.slice(0, 4).map((goal) => (
                  <div key={goal.id} className="flex items-center gap-2">
                    <span className="text-xs text-text">{goal.title}</span>
                    <Badge color="blue">{getPlayerName(goal.playerId)}</Badge>
                    {goal.targetValue != null && goal.currentValue != null && (
                      <span className="ml-auto text-[10px] text-text-dim">
                        {goal.currentValue}/{goal.targetValue}
                      </span>
                    )}
                  </div>
                ))}
                {activeGoals.length > 4 && (
                  <Link to={`/players/${activeGoals[4]?.playerId}`} className="text-[10px] text-accent hover:text-accent-hover">
                    +{activeGoals.length - 4} weitere Ziele
                  </Link>
                )}
              </div>
            </Card>
          )}

          {/* Frequent Players */}
          {frequentPlayers.length > 0 && (
            <Card>
              <h3 className="mb-2 text-xs font-semibold text-text-dim">
                Spieler ({players.length})
              </h3>
              <div className="flex flex-col gap-2">
                {frequentPlayers.map((player) => {
                  const weak = getWeakCategories(player, 2);
                  return (
                    <Link
                      key={player.id}
                      to={`/players/${player.id}`}
                      className="flex items-center gap-2 rounded-lg p-1 -mx-1 hover:bg-card-hover transition-colors"
                    >
                      <span
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white"
                        style={{ backgroundColor: player.avatarColor ?? "#6366f1" }}
                      >
                        {player.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="flex-1">
                        <span className="text-xs font-medium text-text">{player.name}</span>
                        {weak.length > 0 && (
                          <div className="text-[10px] text-text-dim">
                            Fokus: {weak.join(", ")}
                          </div>
                        )}
                      </div>
                      {player.sessionCount > 0 && (
                        <span className="text-[10px] text-text-dim">
                          {player.sessionCount} Sessions
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Recent Coaching Notes */}
          {recentNotes.length > 0 && (
            <Card>
              <h3 className="mb-2 text-xs font-semibold text-text-dim">
                Letzte Coaching-Notizen
              </h3>
              <div className="flex flex-col gap-2">
                {recentNotes.map((note) => (
                  <div key={note.id} className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <Badge color="orange">{note.category}</Badge>
                      <span className="text-[10px] text-text-dim">{note.date}</span>
                    </div>
                    <p className="line-clamp-2 text-xs text-text-muted">{note.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Training Plans summary */}
          {trainingPlans.length > 0 && (
            <Link to="/train" className="block">
              <Card interactive>
                <h3 className="mb-1 text-xs font-semibold text-text-dim">Trainingsplaene</h3>
                <div className="text-sm font-medium text-text">
                  {trainingPlans.length} {trainingPlans.length === 1 ? "Plan" : "Plaene"}
                </div>
                <div className="mt-1 text-xs text-accent">
                  Zu den Plaenen &rarr;
                </div>
              </Card>
            </Link>
          )}
        </div>
      )}

      {/* Feature overview for discoverability (compact) */}
      {hasData && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { to: "/learn", icon: "\uD83D\uDCDA", label: "Lernen", stat: "48 Karten" },
            { to: "/train", icon: "\u23F1\uFE0F", label: "Training", stat: `${20 + customDrills.length} Drills` },
            { to: "/board", icon: "\uD83C\uDFAF", label: "Taktik", stat: "Board" },
            { to: "/analytics", icon: "\uD83D\uDCCA", label: "Analyse", stat: "Stats" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 transition-all hover:border-accent/50"
            >
              <span className="text-lg">{item.icon}</span>
              <div>
                <div className="text-xs font-semibold text-text">{item.label}</div>
                <div className="text-[10px] text-text-dim">{item.stat}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
