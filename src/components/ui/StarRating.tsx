import { useTranslation } from "react-i18next";

interface StarRatingProps {
  rating: number;
  max?: number;
  className?: string;
  /** When provided, stars become clickable. Clicking a star calls onChange with that value (or 0 to deselect). */
  onChange?: (value: number) => void;
  /** Size variant for interactive stars */
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-2xl",
};

export function StarRating({
  rating,
  max = 5,
  className,
  onChange,
  size = "sm",
}: StarRatingProps) {
  const { t } = useTranslation("common");
  if (onChange) {
    return (
      <span
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={rating}
        aria-label={t("ui.ratingLabel")}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            onChange(Math.min(max, rating + 1));
          } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            onChange(Math.max(0, rating - 1));
          }
        }}
        className={className ?? `inline-flex gap-0.5 ${SIZE_CLASSES[size]}`}
      >
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1;
          const filled = starValue <= rating;
          return (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              onClick={() => onChange(rating === starValue ? 0 : starValue)}
              className={`transition-transform hover:scale-110 ${
                filled ? "text-kicker-orange" : "text-text-dim"
              }`}
              aria-label={t("ui.starValue", { count: starValue })}
            >
              {filled ? "\u2605" : "\u2606"}
            </button>
          );
        })}
      </span>
    );
  }

  return (
    <span className={className ?? `${SIZE_CLASSES[size]} text-kicker-orange`}>
      {Array.from({ length: max }, (_, i) =>
        i < rating ? "\u2605" : "\u2606",
      ).join("")}
    </span>
  );
}
