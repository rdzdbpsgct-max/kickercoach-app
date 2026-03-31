import { useState } from "react";
import { NavLink } from "react-router-dom";

const PRIMARY_TABS = [
  { to: "/", label: "Home", icon: "\u{1F3E0}" },
  { to: "/train", label: "Training", icon: "\u23F1\uFE0F" },
  { to: "/players", label: "Spieler", icon: "\uD83D\uDC64" },
] as const;

const MORE_ITEMS = [
  { to: "/learn", label: "Lernen", icon: "\uD83D\uDCDA" },
  { to: "/plan", label: "Matchplan", icon: "\uD83D\uDCCB" },
  { to: "/board", label: "Taktik", icon: "\uD83C\uDFAF" },
  { to: "/analytics", label: "Analyse", icon: "\uD83D\uDCCA" },
  { to: "/settings", label: "Einstellungen", icon: "\u2699\uFE0F" },
] as const;

export default function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* More overlay */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMoreOpen(false)}
        />
      )}
      {moreOpen && (
        <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+3.5rem)] left-3 right-3 z-50 animate-slide-up rounded-2xl border border-border bg-surface p-3 shadow-xl">
          <div className="mb-2 text-xs font-semibold text-text-dim">Weitere Bereiche</div>
          <div className="grid grid-cols-2 gap-2">
            {MORE_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMoreOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-accent-dim text-accent-hover"
                      : "text-text-muted hover:bg-card-hover"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
        aria-label="Hauptnavigation"
      >
        <div className="flex items-stretch justify-around">
          {PRIMARY_TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === "/"}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                  isActive
                    ? "text-accent"
                    : "text-text-dim"
                }`
              }
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              {tab.label}
            </NavLink>
          ))}
          <button
            onClick={() => setMoreOpen((prev) => !prev)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
              moreOpen ? "text-accent" : "text-text-dim"
            }`}
          >
            <span className="text-xl leading-none">{moreOpen ? "\u2716" : "\u2026"}</span>
            Mehr
          </button>
        </div>
      </nav>
    </>
  );
}
