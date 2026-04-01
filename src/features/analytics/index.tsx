import { useState, useMemo } from "react";
import { useAppStore } from "../../store";
import { Select, Card, Badge } from "../../components/ui";
import { TrainingFrequencyChart } from "./TrainingFrequencyChart";
import { SkillProgressChart } from "./SkillProgressChart";
import { DrillStatsChart } from "./DrillStatsChart";
import { PlayerComparison } from "./PlayerComparison";

const TECHNIQUE_STATUS_LABELS: Record<string, string> = {
  not_started: "Nicht begonnen",
  learning: "Lernend",
  developing: "Entwickelnd",
  proficient: "Sicher",
  mastered: "Gemeistert",
};
const TECHNIQUE_STATUS_COLORS: Record<string, string> = {
  not_started: "bg-border",
  learning: "bg-kicker-orange",
  developing: "bg-kicker-blue",
  proficient: "bg-kicker-green",
  mastered: "bg-accent",
};

export default function AnalyticsMode() {
  const players = useAppStore((s) => s.players);
  const sessions = useAppStore((s) => s.sessions);
  const matches = useAppStore((s) => s.matches);
  const matchPlans = useAppStore((s) => s.matchPlans);
  const playerTechniques = useAppStore((s) => s.playerTechniques);
  const [selectedPlayerId, setSelectedPlayerId] = useState(
    players[0]?.id ?? "",
  );

  // Match stats from both matches and matchPlans
  const matchWins = matches.filter((m) => m.result === "win").length;
  const matchLosses = matches.filter((m) => m.result === "loss").length;
  const matchDraws = matches.filter((m) => m.result === "draw").length;
  const planWins = matchPlans.filter((m) => m.result === "win").length;
  const planLosses = matchPlans.filter((m) => m.result === "loss").length;
  const planDraws = matchPlans.filter((m) => m.result === "draw").length;
  const wins = matchWins + planWins;
  const losses = matchLosses + planLosses;
  const draws = matchDraws + planDraws;
  const totalMatches = matches.length + matchPlans.length;

  // Technique progress distribution
  const techniqueStats = useMemo(() => {
    const counts: Record<string, number> = {
      not_started: 0, learning: 0, developing: 0, proficient: 0, mastered: 0,
    };
    for (const pt of playerTechniques) {
      counts[pt.status] = (counts[pt.status] ?? 0) + 1;
    }
    return counts;
  }, [playerTechniques]);

  // Drill rating averages from session drill results
  const avgDrillRating = useMemo(() => {
    let totalRating = 0;
    let count = 0;
    for (const s of sessions) {
      if (s.drillResults) {
        for (const dr of s.drillResults) {
          if (dr.successRate != null) {
            totalRating += dr.successRate;
            count++;
          }
        }
      }
    }
    return count > 0 ? (totalRating / count).toFixed(1) : "–";
  }, [sessions]);

  // Recent matches
  const recentMatches = useMemo(() => {
    return [...matches]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  }, [matches]);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-auto pb-4">
      <h1 className="text-xl font-bold">Analyse</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="text-center">
          <div className="text-lg font-bold text-accent">{sessions.length}</div>
          <div className="text-[11px] text-text-dim">Sessions</div>
        </Card>
        <Card className="text-center">
          <div className="text-lg font-bold text-accent">{players.length}</div>
          <div className="text-[11px] text-text-dim">Spieler</div>
        </Card>
        <Card className="text-center">
          <div className="text-lg font-bold text-accent">{totalMatches}</div>
          <div className="text-[11px] text-text-dim">Matches</div>
        </Card>
        <Card className="text-center">
          <div className="text-lg font-bold text-kicker-green">
            {wins}S
          </div>
          <div className="text-[11px] text-text-dim">
            {wins}S / {draws}U / {losses}N
          </div>
        </Card>
      </div>

      {/* Drill avg rating + technique progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <h3 className="text-sm font-semibold text-text mb-2">Drill-Erfolgsquote</h3>
          <div className="text-2xl font-bold text-accent">{avgDrillRating}%</div>
          <div className="text-[11px] text-text-dim">Durchschnittliche Erfolgsrate</div>
        </Card>
        {playerTechniques.length > 0 && (
          <Card>
            <h3 className="text-sm font-semibold text-text mb-2">Technik-Fortschritt</h3>
            <div className="flex flex-col gap-1">
              {Object.entries(techniqueStats).filter(([, v]) => v > 0).map(([status, count]) => (
                <div key={status} className="flex items-center gap-2 text-xs">
                  <div className={`h-2.5 w-2.5 rounded-full ${TECHNIQUE_STATUS_COLORS[status]}`} />
                  <span className="text-text-muted">{TECHNIQUE_STATUS_LABELS[status]}</span>
                  <span className="ml-auto font-medium text-text">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Recent matches */}
      {recentMatches.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-text mb-2">Letzte Spiele</h3>
          <div className="flex flex-col gap-2">
            {recentMatches.map((m) => (
              <div key={m.id} className="flex items-center justify-between text-xs">
                <span className="text-text-muted">{m.date}</span>
                <span className="font-medium text-text">vs. {m.opponent}</span>
                <Badge color={m.result === "win" ? "green" : m.result === "loss" ? "red" : "orange"}>
                  {m.result === "win" ? "Sieg" : m.result === "loss" ? "Niederlage" : "Unentschieden"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Training frequency */}
      <TrainingFrequencyChart />

      {/* Player skill profile */}
      {players.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-text">Spieler:</span>
            <Select
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="w-48"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
          {selectedPlayerId && (
            <SkillProgressChart playerId={selectedPlayerId} />
          )}
        </div>
      )}

      {/* Player comparison */}
      {players.length >= 2 && <PlayerComparison />}

      {/* Drill stats */}
      <DrillStatsChart />
    </div>
  );
}
