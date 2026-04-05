import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Drill } from "../../domain/models/Drill";
import { advanceBlock, previousBlock } from "../../domain/logic/drill";
import { useTimer } from "../../hooks/useTimer";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useAppStore } from "../../store";
import { STORAGE_KEYS } from "../../domain/constants";
import { Button, ConfirmDialog } from "../../components/ui";
import Timer from "./Timer";
import BlockProgress from "./BlockProgress";
import DrillSelector from "./DrillSelector";
import DrillEditor from "./DrillEditor";
import SessionBuilder from "./SessionBuilder";
import SessionRating from "./SessionRating";
import TrainingPlanList from "./TrainingPlanList";
import TrainingPlanEditor from "./TrainingPlanEditor";
import { SessionRetrospectiveForm } from "./SessionRetrospective";
import Journal from "./Journal";
import type { Session } from "../../store";
import type { TrainingPlan } from "../../domain/models/TrainingPlan";
import { getRecommendedDrillIds } from "../../domain/logic/recommendations";

type View = "drills" | "timer" | "session-builder" | "journal" | "drill-editor" | "session-rating" | "session-retrospective" | "training-plans" | "training-plan-editor";

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: "easeOut" as const },
};

export default function TrainMode() {
  const location = useLocation();
  const initialPlayerId = (location.state as { quickStart?: boolean; initialPlayerId?: string } | null)?.initialPlayerId;
  const quickStart = (location.state as { quickStart?: boolean; initialPlayerId?: string } | null)?.quickStart;

  const [defaultDrills, setDefaultDrills] = useState<Drill[]>([]);
  const [view, setView] = useState<View>(initialPlayerId ? "session-builder" : "drills");
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [blockIndex, setBlockIndex] = useState(0);
  const [autoAdvance, setAutoAdvance] = useLocalStorage(
    STORAGE_KEYS.autoAdvance,
    true,
  );
  const sessions = useAppStore((s) => s.sessions);
  const addSession = useAppStore((s) => s.addSession);
  const updateSession = useAppStore((s) => s.updateSession);
  const deleteSession = useAppStore((s) => s.deleteSession);
  const customDrills = useAppStore((s) => s.customDrills);
  const addCustomDrill = useAppStore((s) => s.addCustomDrill);
  const updateCustomDrill = useAppStore((s) => s.updateCustomDrill);
  const deleteCustomDrill = useAppStore((s) => s.deleteCustomDrill);
  const [editSession, setEditSession] = useState<Session | null>(null);
  const addTrainingPlan = useAppStore((s) => s.addTrainingPlan);
  const updateTrainingPlan = useAppStore((s) => s.updateTrainingPlan);
  const [editDrill, setEditDrill] = useState<Drill | undefined>();
  const [deleteDrillId, setDeleteDrillId] = useState<string | null>(null);
  const [lastSavedSession, setLastSavedSession] = useState<Session | null>(null);
  const [editTrainingPlan, setEditTrainingPlan] = useState<TrainingPlan | undefined>();
  const [completedReps, setCompletedReps] = useState(0);
  const [quickStartTemplate, setQuickStartTemplate] = useState<string | null>(null);
  const players = useAppStore((s) => s.players);

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
    return player ? `Empfohlen fuer ${player.name}` : undefined;
  }, [initialPlayerId, players]);

  // Load drills
  useEffect(() => {
    import("../../data/drills").then((mod) => {
      mod.loadDrills().then(setDefaultDrills);
    });
  }, []);

  const currentBlock = selectedDrill?.blocks[blockIndex];

  const handleBlockFinish = useCallback(() => {
    if (!selectedDrill || !autoAdvance) return;
    const next = advanceBlock(selectedDrill, blockIndex);
    if (next) {
      setBlockIndex(next.blockIndex);
    }
  }, [selectedDrill, blockIndex, autoAdvance]);

  const timer = useTimer(
    currentBlock?.durationSeconds ?? 0,
    handleBlockFinish,
  );

  const handleSelectDrill = (drill: Drill) => {
    setSelectedDrill(drill);
    setBlockIndex(0);
    setCompletedReps(0);
    setView("timer");
  };

  const handleNext = useCallback(() => {
    if (!selectedDrill) return;
    const next = advanceBlock(selectedDrill, blockIndex);
    if (next) {
      setBlockIndex(next.blockIndex);
      setCompletedReps(0);
    }
  }, [selectedDrill, blockIndex]);

  const handlePrev = useCallback(() => {
    if (!selectedDrill) return;
    const prev = previousBlock(selectedDrill, blockIndex);
    if (prev) {
      setBlockIndex(prev.blockIndex);
      setCompletedReps(0);
    }
  }, [selectedDrill, blockIndex]);

  const handleReset = useCallback(() => {
    timer.reset();
    setBlockIndex(0);
    setCompletedReps(0);
  }, [timer]);

  const handleRepIncrement = useCallback(() => {
    if (!currentBlock || currentBlock.type !== "repetitions") return;
    const reps = currentBlock.repetitions ?? 0;
    setCompletedReps((prev) => {
      const next = prev + 1;
      if (next >= reps && autoAdvance) {
        // Auto-advance after completing all reps
        setTimeout(() => {
          if (selectedDrill) {
            const nextBlock = advanceBlock(selectedDrill, blockIndex);
            if (nextBlock) {
              setBlockIndex(nextBlock.blockIndex);
              setCompletedReps(0);
            }
          }
        }, 500);
      }
      return next;
    });
  }, [currentBlock, autoAdvance, selectedDrill, blockIndex]);

  const handleRepDecrement = useCallback(() => {
    setCompletedReps((prev) => Math.max(0, prev - 1));
  }, []);

  const handleSaveSession = (session: Session) => {
    if (editSession) {
      updateSession(session.id, session);
      setEditSession(null);
      setView("journal");
    } else {
      addSession(session);
      setEditSession(null);
      setLastSavedSession(session);
      if (session.playerIds.length > 0) {
        setView("session-rating");
      } else {
        setView("session-retrospective");
      }
    }
  };

  const handleDeleteSession = (id: string) => {
    deleteSession(id);
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

  // Keyboard shortcuts
  useEffect(() => {
    if (view !== "timer" || !selectedDrill) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          timer.toggle();
          break;
        case "KeyN":
        case "ArrowRight":
          e.preventDefault();
          handleNext();
          break;
        case "KeyP":
        case "ArrowLeft":
          e.preventDefault();
          handlePrev();
          break;
        case "KeyR":
          e.preventDefault();
          handleReset();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [view, selectedDrill, timer, handleNext, handlePrev, handleReset]);

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

  // Training Plan Editor view
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

  // Training Plan List view
  if (view === "training-plans") {
    return (
      <motion.div className="flex flex-1 flex-col gap-4 overflow-hidden" {...fadeIn}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Trainingspl&auml;ne</h1>
          <button
            onClick={() => setView("drills")}
            className="text-xs text-text-dim hover:text-accent transition-colors"
          >
            &larr; Zurueck
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
        />
      </motion.div>
    );
  }

  // Session Rating view
  if (view === "session-rating" && lastSavedSession) {
    return (
      <SessionRating
        sessionId={lastSavedSession.id}
        playerIds={lastSavedSession.playerIds}
        onComplete={() => {
          setView("session-retrospective");
        }}
        onSkip={() => {
          setView("session-retrospective");
        }}
      />
    );
  }

  // Session Retrospective view
  if (view === "session-retrospective" && lastSavedSession) {
    return (
      <motion.div className="flex flex-1 flex-col gap-4 overflow-auto pb-4" {...fadeIn}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Retrospektive</h2>
        </div>
        <SessionRetrospectiveForm
          initial={lastSavedSession.retrospective}
          onSave={(retro) => {
            updateSession(lastSavedSession.id, { ...lastSavedSession, retrospective: retro });
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

  // Drill Editor view
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

  // Session Builder view
  if (view === "session-builder") {
    return (
      <SessionBuilder
        drills={allDrills}
        editSession={editSession}
        initialPlayerIds={initialPlayerId ? [initialPlayerId] : undefined}
        quickStartTemplateId={quickStartTemplate}
        onSave={handleSaveSession}
        onCancel={() => {
          setEditSession(null);
          setQuickStartTemplate(null);
          setView("drills");
        }}
      />
    );
  }

  // Journal view
  if (view === "journal") {
    return (
      <motion.div className="flex flex-1 flex-col gap-4 overflow-hidden" {...fadeIn}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Trainingstagebuch</h1>
          <button
            onClick={() => setView("drills")}
            className="text-xs text-text-dim hover:text-accent transition-colors"
          >
            &larr; Zurueck
          </button>
        </div>
        <Journal
          sessions={sessions}
          onSelect={(session) => {
            setEditSession(session);
            setView("session-builder");
          }}
          onDelete={handleDeleteSession}
        />
      </motion.div>
    );
  }

  // Timer view
  if (view === "timer" && selectedDrill) {
    return (
      <motion.div className="flex flex-1 flex-col gap-6 overflow-hidden" {...fadeIn}>
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => {
                setSelectedDrill(null);
                setBlockIndex(0);
                setView("drills");
              }}
              className="mb-1 text-xs text-text-dim hover:text-accent transition-colors"
            >
              &larr; Zurueck zur Auswahl
            </button>
            <h1 className="text-xl font-bold">{selectedDrill.name}</h1>
            <p className="text-sm text-text-muted">
              {selectedDrill.focusSkill}
            </p>
            {selectedDrill.description && (
              <p className="mt-0.5 text-xs text-text-dim">
                {selectedDrill.description}
              </p>
            )}
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-text-muted">
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(e) => setAutoAdvance(e.target.checked)}
              className="accent-accent"
            />
            Auto-Advance
          </label>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <AnimatePresence mode="wait">
            {currentBlock && (
              <motion.div
                key={blockIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="text-sm font-medium text-text-muted">
                  {currentBlock.note ||
                    (currentBlock.type === "work" ? "Training" : "Pause")}
                </div>

                <Timer
                  remainingSeconds={timer.remainingSeconds}
                  isRunning={timer.isRunning}
                  isFinished={currentBlock.type === "repetitions" ? (completedReps >= (currentBlock.repetitions ?? 0)) : timer.isFinished}
                  blockType={currentBlock.type}
                  repetitions={currentBlock.repetitions}
                  completedReps={completedReps}
                />

                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    onClick={handlePrev}
                    disabled={blockIndex === 0}
                  >
                    Zurueck
                  </Button>
                  {currentBlock.type === "repetitions" ? (
                    /* Repetition controls */
                    <>
                      <Button
                        variant="secondary"
                        onClick={handleRepDecrement}
                        disabled={completedReps === 0}
                      >
                        -1
                      </Button>
                      <Button
                        size="lg"
                        onClick={handleRepIncrement}
                        disabled={completedReps >= (currentBlock.repetitions ?? 0)}
                      >
                        +1
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="lg"
                      onClick={timer.toggle}
                    >
                      {timer.isFinished
                        ? "Reset"
                        : timer.isRunning
                          ? "Pause"
                          : "Start"}
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    onClick={handleNext}
                    disabled={blockIndex === selectedDrill.blocks.length - 1}
                  >
                    Weiter
                  </Button>
                </div>

                <button
                  onClick={handleReset}
                  className="text-xs text-text-dim hover:text-text transition-colors"
                >
                  Reset (R)
                </button>

                <div className="flex gap-4 text-[11px] text-text-dim">
                  <span>Space: Start/Pause</span>
                  <span>&larr;/P: Prev</span>
                  <span>&rarr;/N: Next</span>
                  <span>R: Reset</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <BlockProgress
          blocks={selectedDrill.blocks}
          currentIndex={blockIndex}
        />
      </motion.div>
    );
  }

  // Default: Drill selector with sub-nav
  return (
    <motion.div className="flex flex-1 flex-col gap-4 overflow-hidden" {...fadeIn}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Training</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setView("training-plans")}>
            Pl&auml;ne
          </Button>
          <Button variant="secondary" onClick={() => setView("journal")}>
            Tagebuch
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const templates = useAppStore.getState().sessionTemplates;
              if (templates.length > 0) {
                setQuickStartTemplate(templates[templates.length - 1].id ?? null);
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
        title="Drill l&ouml;schen"
        message="M&ouml;chtest du diesen eigenen Drill wirklich l&ouml;schen?"
      />
    </motion.div>
  );
}
