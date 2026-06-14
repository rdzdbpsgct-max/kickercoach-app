/**
 * Single fallback color for player avatars without an explicit avatarColor.
 * Previously two different values (#6366f1 and #00e676) were hardcoded across
 * ~9 call sites; this is the one source of truth.
 */
export const AVATAR_FALLBACK_COLOR = "#6366f1";

interface AvatarProps {
  name: string;
  color?: string | null;
  /** Caller-controlled sizing/shape/text-size classes (e.g. "h-10 w-10 rounded-xl text-lg"). */
  className?: string;
}

/**
 * Player avatar circle: the uppercased initial on a colored background.
 * Centralizes the initial computation and the fallback color; the caller keeps
 * control of dimensions and shape via `className` so each context keeps its look.
 */
export function Avatar({ name, color, className = "" }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center font-bold text-white ${className}`}
      style={{ backgroundColor: color || AVATAR_FALLBACK_COLOR }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
