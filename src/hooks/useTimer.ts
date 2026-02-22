import { useState, useRef, useCallback, useEffect } from "react";

export interface TimerState {
  remainingMs: number;
  isRunning: boolean;
  isFinished: boolean;
}

/**
 * Drift-free timer hook using Date.now() for accurate time tracking.
 */
export function useTimer(durationSeconds: number, onFinish?: () => void) {
  const [remainingMs, setRemainingMs] = useState(durationSeconds * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const startTimeRef = useRef<number>(0);
  const elapsedBeforePauseRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const tick = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current + elapsedBeforePauseRef.current;
    const remaining = durationSeconds * 1000 - elapsed;

    if (remaining <= 0) {
      setRemainingMs(0);
      setIsRunning(false);
      setIsFinished(true);
      onFinish?.();
      return;
    }

    setRemainingMs(remaining);
    rafRef.current = requestAnimationFrame(tick);
  }, [durationSeconds, onFinish]);

  const start = useCallback(() => {
    if (isFinished) return;
    startTimeRef.current = Date.now();
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick, isFinished]);

  const pause = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    elapsedBeforePauseRef.current += Date.now() - startTimeRef.current;
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    startTimeRef.current = 0;
    elapsedBeforePauseRef.current = 0;
    setRemainingMs(durationSeconds * 1000);
    setIsRunning(false);
    setIsFinished(false);
  }, [durationSeconds]);

  const toggle = useCallback(() => {
    if (isFinished) {
      reset();
      return;
    }
    if (isRunning) {
      pause();
    } else {
      start();
    }
  }, [isRunning, isFinished, start, pause, reset]);

  // Reset when duration changes
  useEffect(() => {
    reset();
  }, [durationSeconds, reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return {
    remainingMs,
    remainingSeconds: Math.ceil(remainingMs / 1000),
    isRunning,
    isFinished,
    start,
    pause,
    toggle,
    reset,
  };
}
