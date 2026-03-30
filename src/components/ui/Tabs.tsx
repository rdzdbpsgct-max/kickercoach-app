interface Tab<T extends string> {
  value: T;
  label: string;
  icon?: string;
}

interface TabsProps<T extends string> {
  tabs: Tab<T>[];
  active: T;
  onChange: (value: T) => void;
}

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: TabsProps<T>) {
  return (
    <div className="flex gap-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
            active === tab.value
              ? "border-2 border-accent bg-accent-dim text-accent-hover"
              : "border border-border text-text-muted hover:border-accent/50 hover:text-text"
          }`}
          aria-pressed={active === tab.value}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
