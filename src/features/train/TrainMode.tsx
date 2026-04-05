import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import type { Drill } from "../../domain/models/Drill";
import { useAppStore } from "../../store";
import { makeCompletionKey } from "../../domain/logic/drill";
import { Button, ConfirmDialog } from "../../components/ui";
import DrillSelector from "./DrillSelector";
import DrillEditor from "./DrillEditor";
import DrillTimerView from "./DrillTimerView";
import SessionBuilder from "./SessionBuilder";
import SessionRating from "./SessionRating";
import TrainingPlanList from "./TrainingPlanList";
import TrainingPlanEditor from "./TrainingPlanEditor";
import { SessionRetrospectiveForm } from "./SessionRetrospective";
import Journal from "./Journal";
import type { Session } from "../../store";
import type { TrainingPlan } from "../../domain/models/TrainingPlan";
import type { PlanSessionContext } from "./SessionBuilder";
import { getRecommendedDrillIds } from "../../domain/logic/recommendations";

type View =
  | "drills"
  | "timer"
  | "session-builder"
  | "journal"
  | "drill-editor"
  | "session-rating"
  | "session-retrospective"
  | "training-plans"
  | "training-plan-editor";

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: "easeOut" as const },
};

export default function TrainMode() {
  const location = useLocation();
  const locState = location.state as {
    quickStart?: boolean;
    initialPlayerId?: string;
  } | null;
  const initialPlayerId = locState?.initialPlayerId;
  const quickStart = locState?.quickStart;

  const [defaultDrills, setDefaultDrills] = useState<Drill[]>([]);
  const [view, setView] = useState<View>(
    initialPlayerId ? "session-builder" : "drills",
  );
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);

  // Store selectors
  const sessions = useAppStore((s) => s.sessions);
  const addSession = useAppStore((s) => s.addSession);
  const updateSession = useAppStore((s) => s.updateSession);
  const deleteSession = useAppStore((s) => s.deleteSession);
  const customDrills = useAppStore((s) => s.customDrills);
  const addCustomDrill = useAppStore((s) => s.addCustomDrill);
  const updateCustomDrill = useAppStore((s) => s.updateCustomDrill);
  const deleteCustomDrill = useAppStore((s) => s.deleteCustomDrill);
  const addTrainingPlan = useAppStore((s) => s.addTrainingPlan);
  const updateTrainingPlan = useAppStore((s) => s.updateTrainingPlan);
  const markPlanSessionCompleted = useAppStore(
    (s) => s.markPlanSessionCompleted,
  );
  const players = useAppStore((s) => s.players);

  // Sub-view state
  const [editSession, setEditSession] = useState<Session | null>(null);
  const [editDrill, setEditDrill] = useState<Drill | undefined>();
  const [deleteDrillId, setDeleteDrillId] = useState<string | null>(null);
  const [lastSavedSession, setLastSavedSession] = useState<Session | null>(
    null,
  );
  const [editTrainingPlan, setEditTrainingPlan] = useState<
    TrainingPlan | undefined
  >();
  const [quickStartTemplate, setQuickStartTemplate] = useState<string | null>(
    null,
  );
  const [planSessionContext, setPlanSessionContext] =
    useState<PlanSessionContext | null>(null);

  // Drill result tracking (persists across drill runs within a session)
  const [drillResults, setDrillResults] = useState<
    Record<string, { rating: number; notes?: string }>
  >({});
  const drillResultCount = Object.keys(drillResults).length;
  const drillResultLabel = `${drillResultCount} Drill-Ergebnis${drillResultCount !== 1 ? "se" : ""} erfasst`;

  // Merge default + custom drills
  const allDrills = useMemo(
    () => [...defaultDrills, ...customDrills],
    [defaultDrills, customDrills],
  );

  // Drill recommendations based on initial player
  const recommendedDrillIds = useMemo(() => {
    if (!initialPlayerId) return undefined;
    const player = players.find((p) => p.id === initialPlayerId);
    if (!player) return undefined;
    return getRecommendedDrillIds(player, allDrills, 5);
  }, [initialPlayerId, players, allDrills]);

  const recommendLabel = useMemo(() => {
    if (!initialPlayerId) return undefined;
    const player = players.find((p) => p.id === initialPlayerId);
    return player ? `Empfohlen für ${player.name}` : undefined;
  }, [initialPlayerId, players]);

  // Load drills
  useEffect(() => {
    import("../../data/drills").then((mod) => {
      mod.loadDrills().then(setDefaultDrills);
    });
  }, []);

  // Quick-start: auto-load last template and navigate to session-builder
  useEffect(() => {
    if (quickStart) {
      const templates = useAppStore.getState().sessionTemplates;
      if (templates.length > 0) {
        setQuickStartTemplate(templates[templates.length - 1].id ?? null);
      }
      setView("session-builder");
    }
  }, [quickStart]);

  // ── Handlers ──────────────────────────────────────────────────────

  const handleSelectDrill = (drill: Drill) => {
    setSelectedDrill(drill);
    setView("timer");
  };

  const handleDrillResultSave = (
    drillId: string,
    result: { rating: number; notes?: string },
  ) => {
    setDrillResults((prev) => ({ ...prev, [drillId]: result }));
    setSelectedDrill(null);
    setView("drills");
  };

  const handleDrillResultSkip = () => {
    setSelectedDrill(null);
    setView("drills");
  };

  const handleSaveSession = (session: Session) => {
    if (editSession) {
      updateSession(session.id, session);
      setEditSession(null);
      setView("journal");
    } else {
      addSession(session);
      if (planSessionContext) {
        markPlanSessionCompleted(
          planSessionContext.planId,
          makeCompletionKey(
            planSessionContext.weekIndex,
            planSessionContext.sessionIndex,
            session.id,
          ),
        );
        setPlanSessionContext(null);
      }
      setEditSession(null);
      setLastSavedSession(session);
      setDrillResults({});
      if (session.playerIds.length > 0) {
        setView("session-rating");
      } else {
        setView("session-retrospective");
      }
    }
  };

  const handleSaveDrill = (drill: Drill) => {
    if (editDrill) {
      updateCustomDrill(drill.id, drill);
    } else {
      addCustomDrill(drill);
    }
    setEditDrill(undefined);
    setView("drills");
  };

  // ── View rendering ────────────────────────────────────────────────

  if (view === "training-plan-editor") {
    return (
      <TrainingPlanEditor
        plan={editTrainingPlan}
        onSave={(plan) => {
          if (editTrainingPlan) {
            updateTrainingPlan(plan.id, plan);
          } else {
            addTrainingPlan(plan);
          }
          setEditTrainingPlan(undefined);
          setView("training-plans");
        }}
        onCancel={() => {
          setEditTrainingPlan(undefined);
          setView("training-plans");
        }}
      />
    );
  }

  if (view === "training-plans") {
    return (
      <motion.div className="flex flex-col gap-4" {...fadeIn}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Trainingspläne</h1>
          <button
            onClick={() => setView("drills")}
            className="text-xs text-text-dim hover:text-accent transition-colors"
          >
            &larr; Zurück
          </button>
        </div>
        <TrainingPlanList
          onEdit={(plan) => {
            setEditTrainingPlan(plan);
            setView("training-plan-editor");
          }}
          onNew={() => {
            setEditTrainingPlan(undefined);
            setView("training-plan-editor");
          }}
          onStartSession={(planId, weekIndex, sessionIndex) => {
            setPlanSessionContext({ planId, weekIndex, sessionIndex });
            setEditSession(null);
            setQuickStartTemplate(null);
            setView("session-builder");
          }}
        />
      </motion.div>
    );
  }

  if (view === "session-rating" && lastSavedSession) {
    return (
      <SessionRating
        sessionId={lastSavedSession.id}
        playerIds={lastSavedSession.playerIds}
        onComplete={() => setView("session-retrospective")}
        onSkip={() => setView("session-retrospective")}
      />
    );
  }

  if (view === "session-retrospective" && lastSavedSession) {
    return (
      <motion.div
        className="flex flex-1 flex-col gap-4 overflow-auto pb-4"
        {...fadeIn}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Retrospektive</h2>
        </div>
        <SessionRetrospectiveForm
          initial={lastSavedSession.retrospective}
          onSave={(retro) => {
            updateSession(lastSavedSession.id, {
              ...lastSavedSession,
              retrospective: retro,
            });
            setLastSavedSession(null);
            setView("journal");
          }}
          onSkip={() => {
            setLastSavedSession(null);
            setView("journal");
          }}
        />
      </motion.div>
    );
  }

  if (view === "drill-editor") {
    return (
      <DrillEditor
        drill={editDrill}
        onSave={handleSaveDrill}
        onCancel={() => {
          setEditDrill(undefined);
          setView("drills");
        }}
      />
    );
  }

  if (view === "session-builder") {
    return (
      <SessionBuilder
        drills={allDrills}
        editSession={editSession}
        initialPlayerIds={initialPlayerId ? [initialPlayerId] : undefined}
        quickStartTemplateId={quickStartTemplate}
        planSessionContext={planSessionContext}
        drillResults={drillResults}
        onSave={handleSaveSession}
        onCancel={() => {
          setEditSession(null);
          setQuickStartTemplate(null);
          setPlanSessionContext(null);
          setView("drills");
        }}
      />
    );
  }

  if (view === "journal") {
    return (
      <motion.div className="flex flex-col gap-4" {...fadeIn}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Trainingstagebuch</h1>
          <button
            onClick={() => setView("drills")}
            className="text-xs text-text-dim hover:text-accent transition-colors"
          >
            &larr; Zurück
          </button>
        </div>
        <Journal
          sessions={sessions}
          drills={allDrills}
          onSelect={(session) => {
            setEditSession(session);
            setView("session-builder");
          }}
          onDelete={(id) => deleteSession(id)}
        />
      </motion.div>
    );
  }

  if (view === "timer" && selectedDrill) {
    return (
      <DrillTimerView
        drill={selectedDrill}
        drillResultCount={drillResultCount}
        drillResultLabel={drillResultLabel}
        onBack={() => {
          setSelectedDrill(null);
          setView("drills");
        }}
        onSaveResult={handleDrillResultSave}
        onSkipResult={handleDrillResultSkip}
      />
    );
  }

  // Default: Drill selector
  return (
    <motion.div className="flex flex-col gap-4" {...fadeIn}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Training</h1>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setView("training-plans")}
          >
            Pläne
          </Button>
          <Button variant="secondary" onClick={() => setView("journal")}>
            Tagebuch
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const templates = useAppStore.getState().sessionTemplates;
              if (templates.length > 0) {
                setQuickStartTemplate(
                  templates[templates.length - 1].id ?? null,
                );
              }
              setEditSession(null);
              setView("session-builder");
            }}
          >
            Schnellstart
          </Button>
          <Button
            onClick={() => {
              setEditSession(null);
              setView("session-builder");
            }}
          >
            + Session
          </Button>
        </div>
      </div>

      {drillResultCount > 0 && (
        <div className="rounded-lg border border-accent/30 bg-accent-dim px-3 py-2 text-xs text-accent-hover flex items-center justify-between">
          <span>{drillResultLabel}</span>
          <span className="text-text-dim">
            Werden bei Session-Erstellung gespeichert
          </span>
        </div>
      )}

      <DrillSelector
        drills={allDrills}
        selectedId={null}
        onSelect={handleSelectDrill}
        onNewDrill={() => {
          setEditDrill(undefined);
          setView("drill-editor");
        }}
        onEditDrill={(drill) => {
          setEditDrill(drill);
          setView("drill-editor");
        }}
        onDeleteDrill={(id) => setDeleteDrillId(id)}
        recommendedDrillIds={recommendedDrillIds}
        recommendLabel={recommendLabel}
      />

      <ConfirmDialog
        open={deleteDrillId !== null}
        onClose={() => setDeleteDrillId(null)}
        onConfirm={() => {
          if (deleteDrillId) {
            deleteCustomDrill(deleteDrillId);
            setDeleteDrillId(null);
          }
        }}
        title="Drill löschen"
        message="Möchtest du diesen eigenen Drill wirklich löschen?"
      />
    </motion.div>
  );
}
