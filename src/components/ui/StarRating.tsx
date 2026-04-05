interface StarRatingProps {
  rating: number;
  max?: number;
  className?: string;
}

export function StarRating({ rating, max = 5, className = "text-xs text-kicker-orange" }: StarRatingProps) {
  return (
    <span className={className}>
      {Array.from({ length: max }, (_, i) =>
        i < rating ? "\u2605" : "\u2606",
      ).join("")}
    </span>
  );
}
