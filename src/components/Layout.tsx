import { type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import BottomNav from "./BottomNav";

const tabs = [
  { to: "/", label: "Home", icon: "\u{1F3E0}" },
  { to: "/learn", label: "Lernen", icon: "\uD83D\uDCDA" },
  { to: "/train", label: "Training", icon: "\u23F1\uFE0F" },
  { to: "/plan", label: "Matchplan", icon: "\uD83D\uDCCB" },
  { to: "/board", label: "Taktik", icon: "\uD83C\uDFAF" },
  { to: "/players", label: "Spieler", icon: "\uD83D\uDC64" },
  { to: "/analytics", label: "Analyse", icon: "\uD83D\uDCCA" },
] as const;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col bg-bg text-text">
      {/* Skip to content */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded">
        Zum Inhalt springen
      </a>

      {/* Desktop Header — hidden on mobile */}
      <header className="hidden md:flex shrink-0 items-center justify-between border-b border-border bg-surface px-5 py-3">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-xl p-1 transition-all ${
              isActive ? "ring-2 ring-accent/40" : "hover:opacity-80"
            }`
          }
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-kicker-blue text-lg font-bold text-white">
            K
          </div>
          <div>
            <div className="text-base font-bold tracking-tight">
              KickerCoach
            </div>
            <div className="-mt-0.5 text-[11px] text-text-dim">
              by SpielerGeist
            </div>
          </div>
        </NavLink>

        <nav className="flex gap-1.5" aria-label="Hauptnavigation">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
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

      {/* Main content — extra bottom padding on mobile for BottomNav */}
      <main id="main-content" role="main" className="flex flex-1 flex-col overflow-hidden p-3 pb-20 md:p-5 md:pb-5">
        {children}
      </main>

      {/* Mobile Bottom Navigation — hidden on desktop */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
