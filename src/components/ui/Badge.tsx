import { type ReactNode } from "react";

const colors = {
  blue: "bg-kicker-blue/15 text-kicker-blue",
  orange: "bg-kicker-orange/15 text-kicker-orange",
  green: "bg-kicker-green/15 text-kicker-green",
  red: "bg-kicker-red/15 text-kicker-red",
  accent: "bg-accent/15 text-accent",
} as const;

interface BadgeProps {
  color?: keyof typeof colors;
  children: ReactNode;
  className?: string;
}

export function Badge({
  color = "accent",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}
