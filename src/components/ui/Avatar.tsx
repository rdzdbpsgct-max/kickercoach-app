interface AvatarProps {
  name: string;
  color?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

/**
 * Single source of truth for the player avatar circle (initial + color).
 * Replaces the avatar markup that was duplicated across player/train/plan
 * features with inconsistent fallback colors.
 */
export function Avatar({
  name,
  color,
  size = "md",
  className = "",
}: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold text-bg ${SIZES[size]} ${className}`}
      style={{ backgroundColor: color || "var(--color-accent)" }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
