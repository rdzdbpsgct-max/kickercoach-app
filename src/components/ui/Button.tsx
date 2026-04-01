import { type ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "border-2 border-accent bg-accent-dim text-accent-hover hover:bg-accent hover:text-white",
  secondary:
    "border border-border bg-surface text-text-muted hover:border-accent/50 hover:text-text",
  ghost: "border border-transparent text-text-muted hover:bg-surface hover:text-text",
  danger:
    "border border-kicker-red/30 bg-kicker-red/10 text-kicker-red hover:bg-kicker-red hover:text-white",
} as const;

const sizes = {
  sm: "px-3 py-2 text-xs min-h-[44px]",
  md: "px-4 py-2.5 text-sm min-h-[44px]",
  lg: "px-6 py-3 text-base min-h-[48px]",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
