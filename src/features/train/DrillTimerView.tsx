import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Drill } from "../../domain/models/Drill";
import { advanceBlock, previousBlock } from "../../domain/logic/drill";
import { useTimer } from "../../hooks/useTimer";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../../domain/constants";
import { Button } from "../../components/ui";
import Timer from "./Timer";
import BlockProgress from "./BlockProgress";
import DrillResultCapture from "./DrillResultCapture";

interface DrillTimerViewProps {
  drill: Drill;
  drillResultCount: number;
  drillResultLabel: string;
  onBack: () => void;
  onSaveResult: (drillId: string, result: { rating: number; notes?: string }) => void;
  onSkipResult: () => void;
}

export default function DrillTimerView({
  drill,
  drillResultCount,
  drillResultLabel,
  onBack,
  onSaveResult,
  onSkipResult,
}: DrillTimerViewProps) {
  const [blockIndex, setBlockIndex] = useState(0);
  const [completedReps, setCompletedReps] = useState(0);
  const [showResultCapture, setShowResultCapture] = useState(false);
  const [autoAdvance, setAutoAdvance] = useLocalStorage(STORAGE_KEYS.autoAdvance, true);

  const currentBlock = drill.blocks[blockIndex];
  const isLastBlock = blockIndex === drill.blocks.length - 1;

  const handleBlockFinish = useCallback(() => {
    if (!autoAdvance) return;
    const next = advanceBlock(drill, blockIndex);
    if (next) {
      setBlockIndex(next.blockIndex);
    } else if (isLastBlock) {
      setShowResultCapture(true);
    }
  }, [drill, blockIndex, autoAdvance, isLastBlock]);

  const timer = useTimer(currentBlock?.durationSeconds ?? 0, handleBlockFinish);

  // Show result capture when last block reps are completed
  useEffect(() => {
    if (!isLastBlock || !currentBlock) return;
    if (currentBlock.type !== "repetitions") return;
    const reps = currentBlock.repetitions ?? 0;
    if (completedReps >= reps && !showResultCapture) {
      setShowResultCapture(true);
    }
  }, [completedReps, isLastBlock, currentBlock, showResultCapture]);

  const handleNext = useCallback(() => {
    const next = advanceBlock(drill, blockIndex);
    if (next) {
      timer.reset();
      setBlockIndex(next.blockIndex);
      setCompletedReps(0);
    }
  }, [drill, blockIndex, timer]);

  const handlePrev = useCallback(() => {
    const prev = previousBlock(drill, blockIndex);
    if (prev) {
      timer.reset();
      setBlockIndex(prev.blockIndex);
      setCompletedReps(0);
    }
  }, [drill, blockIndex, timer]);

  const handleReset = useCallback(() => {
    timer.reset();
    setBlockIndex(0);
    setCompletedReps(0);
    setShowResultCapture(false);
  }, [timer]);

  const handleRepIncrement = useCallback(() => {
    if (!currentBlock || currentBlock.type !== "repetitions") return;
    setCompletedReps((prev) => prev + 1);
  }, [currentBlock]);

  const handleRepDecrement = useCallback(() => {
    setCompletedReps((prev) => Math.max(0, prev - 1));
  }, []);

  // Auto-advance after completing all reps (skip for last block)
  useEffect(() => {
    if (!autoAdvance || !currentBlock) return;
    if (currentBlock.type !== "repetitions") return;
    const reps = currentBlock.repetitions ?? 0;
    if (completedReps < reps) return;
    if (isLastBlock) return;

    const timeout = setTimeout(() => {
      const nextBlock = advanceBlock(drill, blockIndex);
      if (nextBlock) {
        setBlockIndex(nextBlock.blockIndex);
        setCompletedReps(0);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [completedReps, drill, autoAdvance, currentBlock, blockIndex, isLastBlock]);

  // Keyboard shortcuts
  useEffect(() => {
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
  }, [timer, handleNext, handlePrev, handleReset]);

  const handleSaveResultLocal = (result: { rating: number; notes?: string }) => {
    onSaveResult(drill.id, result);
  };

  const handleSkipLocal = () => {
    setShowResultCapture(false);
    onSkipResult();
  };

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="mb-1 text-xs text-text-dim hover:text-accent transition-colors"
          >
            &larr; Zurück zur Auswahl
          </button>
          <h1 className="text-xl font-bold">{drill.name}</h1>
          <p className="text-sm text-text-muted">{drill.focusSkill}</p>
          {drill.description && (
            <p className="mt-0.5 text-xs text-text-dim">{drill.description}</p>
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
          {currentBlock && !showResultCapture && (
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
                isFinished={
                  currentBlock.type === "repetitions"
                    ? completedReps >= (currentBlock.repetitions ?? 0)
                    : timer.isFinished
                }
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
                  Zurück
                </Button>
                {currentBlock.type === "repetitions" ? (
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
                  <Button size="lg" onClick={timer.toggle}>
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
                  disabled={blockIndex === drill.blocks.length - 1}
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

          {showResultCapture && (
            <DrillResultCapture
              drill={drill}
              onSave={handleSaveResultLocal}
              onSkip={handleSkipLocal}
            />
          )}
        </AnimatePresence>
      </div>

      <BlockProgress blocks={drill.blocks} currentIndex={blockIndex} />

      {drillResultCount > 0 && (
        <div className="text-center text-[11px] text-text-dim">
          {drillResultLabel}
        </div>
      )}
    </motion.div>
  );
}
