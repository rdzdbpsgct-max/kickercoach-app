import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-accent focus:ring-1 focus:ring-accent/30 focus:outline-none transition-all resize-y min-h-[80px] ${
          error ? "border-kicker-red" : "border-border"
        } ${className}`}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
