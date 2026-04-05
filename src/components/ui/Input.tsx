import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-accent focus:ring-1 focus:ring-accent/30 focus:outline-none transition-all ${
          error ? "border-kicker-red" : "border-border"
        } ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
