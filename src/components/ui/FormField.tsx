import { type ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  required = false,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-medium text-text-muted">
        {label}
        {required && <span className="ml-0.5 text-kicker-red">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-kicker-red">{error}</p>}
    </div>
  );
}
