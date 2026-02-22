import { type ReactNode } from "react";
import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/learn", label: "Lernen", icon: "\uD83D\uDCDA" },
  { to: "/train", label: "Training", icon: "\u23F1\uFE0F" },
  { to: "/plan", label: "Matchplan", icon: "\uD83D\uDCCB" },
] as const;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col bg-bg text-text">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-kicker-blue text-lg font-bold text-white">
            K
          </div>
          <div className="hidden md:block">
            <div className="text-base font-bold tracking-tight">
              KickerCoach
            </div>
            <div className="-mt-0.5 text-[11px] text-text-dim">
              by SpielerGeist
            </div>
          </div>
        </div>

        <nav className="flex gap-1.5" aria-label="Hauptnavigation">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm font-medium transition-all ${
                  isActive
                    ? "border-2 border-accent bg-accent-dim text-accent-hover"
                    : "border border-border text-text-muted hover:border-accent/50 hover:text-text"
                }`
              }
            >
              <span>{tab.icon}</span>
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden p-3 md:p-5">
        {children}
      </main>
    </div>
  );
}
