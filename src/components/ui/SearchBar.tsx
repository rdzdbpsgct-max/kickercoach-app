interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Suchen...",
}: SearchBarProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-dim text-sm">
        &#128269;
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-8 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-dim hover:text-text transition-colors text-sm"
          aria-label="Suche leeren"
        >
          &#10005;
        </button>
      )}
    </div>
  );
}
