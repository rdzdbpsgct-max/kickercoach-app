import { useState } from "react";
import { useAppStore } from "../../store";
import { Select, Card } from "../../components/ui";
import { TrainingFrequencyChart } from "./TrainingFrequencyChart";
import { SkillProgressChart } from "./SkillProgressChart";
import { DrillStatsChart } from "./DrillStatsChart";

export default function AnalyticsMode() {
  const players = useAppStore((s) => s.players);
  const sessions = useAppStore((s) => s.sessions);
  const matchPlans = useAppStore((s) => s.matchPlans);
  const [selectedPlayerId, setSelectedPlayerId] = useState(
    players[0]?.id ?? "",
  );

  // Match stats
  const wins = matchPlans.filter((m) => m.result === "win").length;
  const losses = matchPlans.filter((m) => m.result === "loss").length;
  const draws = matchPlans.filter((m) => m.result === "draw").length;

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
          <div className="text-lg font-bold text-accent">{matchPlans.length}</div>
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

      {/* Drill stats */}
      <DrillStatsChart />
    </div>
  );
}
