import { type ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  size?: "sm" | "md";
}

export function IconButton({
  active = false,
  size = "md",
  className = "",
  children,
  disabled,
  ...props
}: IconButtonProps) {
  const sizeClass = size === "sm" ? "h-8 w-8 text-sm" : "h-9 w-9 text-base";

  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.93 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`inline-flex items-center justify-center rounded-lg transition-all disabled:opacity-50 disabled:pointer-events-none ${sizeClass} ${
        active
          ? "border border-accent bg-accent-dim text-accent"
          : "border border-border text-text-muted hover:border-accent/50 hover:text-text hover:bg-surface-hover"
      } ${className}`}
      disabled={disabled}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </motion.button>
  );
}
