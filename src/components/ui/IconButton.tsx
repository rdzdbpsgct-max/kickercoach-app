import { type ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  size?: "sm" | "md";
}

export function IconButton({
  active = false,
  size = "md",
  className = "",
  children,
  ...props
}: IconButtonProps) {
  const sizeClass = size === "sm" ? "h-8 w-8 text-sm" : "h-9 w-9 text-base";

  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg transition-all disabled:opacity-50 disabled:pointer-events-none ${sizeClass} ${
        active
          ? "border-2 border-accent bg-accent-dim text-accent-hover"
          : "border border-border text-text-muted hover:border-accent/50 hover:text-text"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
