import { useState, useEffect, useCallback } from "react";
import type { Drill } from "../../domain/models/Drill";
import type { Session } from "../../domain/models/Session";
import { advanceBlock, previousBlock } from "../../domain/logic/drill";
import { useTimer } from "../../hooks/useTimer";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../../domain/constants";
import Timer from "./Timer";
import BlockProgress from "./BlockProgress";
import DrillSelector from "./DrillSelector";
import SessionBuilder from "./SessionBuilder";
import Journal from "./Journal";

type View = "drills" | "timer" | "session-builder" | "journal";

export default function TrainMode() {
  const [drills, setDrills] = useState<Drill[]>([]);
  const [view, setView] = useState<View>("drills");
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [blockIndex, setBlockIndex] = useState(0);
  const [autoAdvance, setAutoAdvance] = useLocalStorage(
    STORAGE_KEYS.autoAdvance,
    true,
  );
  const [sessions, setSessions] = useLocalStorage<Session[]>(
    STORAGE_KEYS.sessions,
    [],
  );
  const [editSession, setEditSession] = useState<Session | null>(null);

  // Load drills
  useEffect(() => {
    import("../../data/drills").then((mod) => {
      setDrills(mod.DEFAULT_DRILLS);
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
    setView("timer");
  };

  const handleNext = useCallback(() => {
    if (!selectedDrill) return;
    const next = advanceBlock(selectedDrill, blockIndex);
    if (next) {
      setBlockIndex(next.blockIndex);
    }
  }, [selectedDrill, blockIndex]);

  const handlePrev = useCallback(() => {
    if (!selectedDrill) return;
    const prev = previousBlock(selectedDrill, blockIndex);
    if (prev) {
      setBlockIndex(prev.blockIndex);
    }
  }, [selectedDrill, blockIndex]);

  const handleReset = useCallback(() => {
    timer.reset();
    setBlockIndex(0);
  }, [timer]);

  const handleSaveSession = (session: Session) => {
    setSessions((prev) => {
      const existing = prev.findIndex((s) => s.id === session.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = session;
        return updated;
      }
      return [...prev, session];
    });
    setEditSession(null);
    setView("journal");
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
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

  // Session Builder view
  if (view === "session-builder") {
    return (
      <SessionBuilder
        drills={drills}
        editSession={editSession}
        onSave={handleSaveSession}
        onCancel={() => {
          setEditSession(null);
          setView("drills");
        }}
      />
    );
  }

  // Journal view
  if (view === "journal") {
    return (
      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
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
      </div>
    );
  }

  // Timer view
  if (view === "timer" && selectedDrill) {
    return (
      <div className="flex flex-1 flex-col gap-6 overflow-hidden">
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
          {currentBlock && (
            <>
              <div className="text-sm font-medium text-text-muted">
                {currentBlock.note ||
                  (currentBlock.type === "work" ? "Training" : "Pause")}
              </div>

              <Timer
                remainingSeconds={timer.remainingSeconds}
                isRunning={timer.isRunning}
                isFinished={timer.isFinished}
                blockType={currentBlock.type}
              />

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  disabled={blockIndex === 0}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-muted transition-all hover:border-accent/50 hover:text-text disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Zur&uuml;ck
                </button>
                <button
                  onClick={timer.toggle}
                  className="rounded-xl border-2 border-accent bg-accent-dim px-8 py-3 text-base font-bold text-accent-hover transition-all hover:bg-accent hover:text-white"
                >
                  {timer.isFinished
                    ? "Reset"
                    : timer.isRunning
                      ? "Pause"
                      : "Start"}
                </button>
                <button
                  onClick={handleNext}
                  disabled={blockIndex === selectedDrill.blocks.length - 1}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-muted transition-all hover:border-accent/50 hover:text-text disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Weiter
                </button>
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
            </>
          )}
        </div>

        <BlockProgress
          blocks={selectedDrill.blocks}
          currentIndex={blockIndex}
        />
      </div>
    );
  }

  // Default: Drill selector with sub-nav
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Training</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView("journal")}
            className="rounded-xl border border-border px-4 py-2 text-sm text-text-muted hover:border-accent/50 transition-all"
          >
            Tagebuch
          </button>
          <button
            onClick={() => {
              setEditSession(null);
              setView("session-builder");
            }}
            className="rounded-xl border-2 border-accent bg-accent-dim px-4 py-2 text-sm font-semibold text-accent-hover hover:bg-accent hover:text-white transition-all"
          >
            + Session
          </button>
        </div>
      </div>
      <DrillSelector
        drills={drills}
        selectedId={null}
        onSelect={handleSelectDrill}
      />
    </div>
  );
}
