import { type ReactNode, type HTMLAttributes } from "react";
import { motion } from "framer-motion";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  children: ReactNode;
}

export function Card({
  interactive = false,
  className = "",
  children,
  ...props
}: CardProps) {
  if (interactive) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={`rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent/40 hover:bg-card-hover cursor-pointer ${className}`}
        {...(props as Record<string, unknown>)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-border bg-card p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
