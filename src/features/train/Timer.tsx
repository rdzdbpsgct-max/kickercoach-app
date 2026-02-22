import { formatTime } from "../../domain/logic/time";

interface TimerProps {
  remainingSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
  blockType: "work" | "rest";
}

export default function Timer({
  remainingSeconds,
  isRunning,
  isFinished,
  blockType,
}: TimerProps) {
  const colorClass =
    isFinished
      ? "text-kicker-green"
      : blockType === "work"
        ? "text-text"
        : "text-kicker-orange";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        role="timer"
        aria-live="polite"
        aria-label={formatTime(remainingSeconds)}
        className={`font-mono text-6xl md:text-8xl font-bold tabular-nums tracking-tight ${colorClass} transition-colors`}
      >
        {formatTime(remainingSeconds)}
      </div>
      <div className="flex items-center gap-2 text-sm text-text-muted">
        {isFinished ? (
          <span className="text-kicker-green font-medium">Fertig!</span>
        ) : isRunning ? (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-kicker-green" />
            Laeuft
          </span>
        ) : (
          <span>Pausiert</span>
        )}
      </div>
    </div>
  );
}
