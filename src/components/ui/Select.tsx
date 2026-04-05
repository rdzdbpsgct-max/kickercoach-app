import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-text focus:border-accent focus:ring-1 focus:ring-accent/30 focus:outline-none transition-all ${
          error ? "border-kicker-red" : "border-border"
        } ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";
