/**
 * Format seconds into MM:SS display string.
 */
export function formatTime(seconds: number): string {
  if (seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Compute remaining seconds in a block given an elapsed time.
 * Returns 0 if elapsed exceeds duration.
 */
export function computeRemaining(
  durationSeconds: number,
  elapsedMs: number,
): number {
  const remaining = durationSeconds - elapsedMs / 1000;
  return Math.max(0, Math.ceil(remaining));
}
