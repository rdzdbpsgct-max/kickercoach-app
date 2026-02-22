import { useState, useRef, useCallback, useEffect } from "react";

export interface TimerState {
  remainingMs: number;
  isRunning: boolean;
  isFinished: boolean;
}

const MS_PER_SECOND = 1000;

/**
 * Drift-free timer hook using Date.now() for accurate time tracking.
 * Throttled to update once per second to avoid unnecessary re-renders.
 */
export function useTimer(durationSeconds: number, onFinish?: () => void) {
  const [remainingMs, setRemainingMs] = useState(durationSeconds * MS_PER_SECOND);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const startTimeRef = useRef<number>(0);
  const elapsedBeforePauseRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const lastSecondRef = useRef<number>(-1);
  const totalDurationMsRef = useRef(durationSeconds * MS_PER_SECOND);

  // Keep totalDurationMs in sync
  useEffect(() => {
    totalDurationMsRef.current = durationSeconds * MS_PER_SECOND;
  }, [durationSeconds]);

  const tick = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current + elapsedBeforePauseRef.current;
    const remaining = totalDurationMsRef.current - elapsed;

    if (remaining <= 0) {
      setRemainingMs(0);
      setIsRunning(false);
      setIsFinished(true);
      onFinish?.();
      return;
    }

    // Only update state when the displayed second changes
    const currentSecond = Math.ceil(remaining / MS_PER_SECOND);
    if (currentSecond !== lastSecondRef.current) {
      lastSecondRef.current = currentSecond;
      setRemainingMs(remaining);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [onFinish]);

  const start = useCallback(() => {
    if (isFinished) return;
    startTimeRef.current = Date.now();
    lastSecondRef.current = -1;
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
    lastSecondRef.current = -1;
    setRemainingMs(durationSeconds * MS_PER_SECOND);
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
    remainingSeconds: Math.ceil(remainingMs / MS_PER_SECOND),
    isRunning,
    isFinished,
    start,
    pause,
    toggle,
    reset,
  };
}
