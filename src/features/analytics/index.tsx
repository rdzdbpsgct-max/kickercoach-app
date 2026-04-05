import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../../store";
import { Select, Card, Badge } from "../../components/ui";
import { TECHNIQUE_STATUS_LABELS, TECHNIQUE_STATUS_COLORS } from "../../domain/constants";
import type { TechniqueStatus } from "../../domain/models/PlayerTechnique";
import { TrainingFrequencyChart } from "./TrainingFrequencyChart";
import { SkillProgressChart } from "./SkillProgressChart";
import { DrillStatsChart } from "./DrillStatsChart";
import { PlayerComparison } from "./PlayerComparison";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

const statCardVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
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
    <motion.div
      className="flex flex-1 flex-col gap-4 overflow-auto pb-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={itemVariants} className="text-xl font-bold">
        Analyse
      </motion.h1>

      {/* Summary stats */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        variants={containerVariants}
      >
        <motion.div variants={statCardVariants}>
          <Card className="text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00e676]/10 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="text-lg font-bold text-accent">{sessions.length}</div>
              <div className="text-[11px] text-text-dim">Sessions</div>
            </div>
          </Card>
        </motion.div>
        <motion.div variants={statCardVariants}>
          <Card className="text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00e676]/10 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="text-lg font-bold text-accent">{players.length}</div>
              <div className="text-[11px] text-text-dim">Spieler</div>
            </div>
          </Card>
        </motion.div>
        <motion.div variants={statCardVariants}>
          <Card className="text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00e676]/10 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="text-lg font-bold text-accent">{totalMatches}</div>
              <div className="text-[11px] text-text-dim">Matches</div>
            </div>
          </Card>
        </motion.div>
        <motion.div variants={statCardVariants}>
          <Card className="text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00e676]/10 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="text-lg font-bold text-kicker-green">
                {wins}S
              </div>
              <div className="text-[11px] text-text-dim">
                {wins}S / {draws}U / {losses}N
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Drill avg rating + technique progress */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card>
            <h3 className="text-sm font-semibold text-text mb-2">Drill-Erfolgsquote</h3>
            <div className="text-2xl font-bold text-accent">{avgDrillRating}%</div>
            <div className="text-[11px] text-text-dim">Durchschnittliche Erfolgsrate</div>
          </Card>
        </motion.div>
        {playerTechniques.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="text-sm font-semibold text-text mb-2">Technik-Fortschritt</h3>
              <div className="flex flex-col gap-1">
                {Object.entries(techniqueStats).filter(([, v]) => v > 0).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-2 text-xs">
                    <div className={`h-2.5 w-2.5 rounded-full ${TECHNIQUE_STATUS_COLORS[status as TechniqueStatus]}`} />
                    <span className="text-text-muted">{TECHNIQUE_STATUS_LABELS[status as TechniqueStatus]}</span>
                    <span className="ml-auto font-medium text-text">{count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Recent matches */}
      {recentMatches.length > 0 && (
        <motion.div variants={itemVariants}>
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
        </motion.div>
      )}

      {/* Training frequency */}
      <motion.div variants={itemVariants}>
        <TrainingFrequencyChart />
      </motion.div>

      {/* Player skill profile */}
      {players.length > 0 && (
        <motion.div variants={itemVariants} className="flex flex-col gap-3">
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
        </motion.div>
      )}

      {/* Player comparison */}
      {players.length >= 2 && (
        <motion.div variants={itemVariants}>
          <PlayerComparison />
        </motion.div>
      )}

      {/* Drill stats */}
      <motion.div variants={itemVariants}>
        <DrillStatsChart />
      </motion.div>
    </motion.div>
  );
}
