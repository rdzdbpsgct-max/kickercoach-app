import { Button } from "./Button";

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center animate-fade-in">
      <span className="text-4xl">{icon}</span>
      <h3 className="text-base font-bold text-text">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-text-muted">{description}</p>
      )}
      {action && (
        <Button size="sm" onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}
