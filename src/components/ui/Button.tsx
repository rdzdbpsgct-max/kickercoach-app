import { type ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";

const variants = {
  primary:
    "border border-accent bg-accent text-bg font-bold hover:bg-accent-hover hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]",
  secondary:
    "border border-border bg-surface text-text-muted hover:border-accent/50 hover:text-text hover:bg-surface-hover",
  ghost:
    "border border-transparent text-text-muted hover:bg-surface-hover hover:text-text",
  danger:
    "border border-kicker-red/30 bg-kicker-red/10 text-kicker-red hover:bg-kicker-red hover:text-white",
} as const;

const sizes = {
  sm: "px-3 py-2 text-xs min-h-[44px]",
  md: "px-5 py-2.5 text-sm min-h-[44px]",
  lg: "px-7 py-3 text-base min-h-[48px]",
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
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </motion.button>
  );
}
