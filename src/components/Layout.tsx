import { type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import BottomNav from "./BottomNav";
import { useTheme } from "../hooks/useTheme";

export default function Layout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const tabs = [
    { to: "/", label: t("nav.home"), icon: "\u{1F3E0}" },
    { to: "/learn", label: t("nav.learn"), icon: "\uD83D\uDCDA" },
    { to: "/train", label: t("nav.train"), icon: "\u23F1\uFE0F" },
    { to: "/plan", label: t("nav.plan"), icon: "\uD83D\uDCCB" },
    { to: "/board", label: t("nav.board"), icon: "\uD83C\uDFAF" },
    { to: "/players", label: t("nav.players"), icon: "\uD83D\uDC64" },
    { to: "/analytics", label: t("nav.analytics"), icon: "\uD83D\uDCCA" },
  ];

  return (
    <div className="flex h-full flex-col bg-bg text-text">
      {/* Skip to content */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-accent focus:text-bg focus:px-4 focus:py-2 focus:rounded">
        {t("skipToContent")}
      </a>

      {/* Desktop Header */}
      <header className="hidden md:flex shrink-0 items-center justify-between border-b border-border bg-surface/80 backdrop-blur-md px-5 py-3">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-xl p-1 transition-all ${
              isActive ? "ring-2 ring-accent/40" : "hover:opacity-80"
            }`
          }
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-secondary text-lg font-bold text-bg">
            K
          </div>
          <div>
            <div className="text-base font-bold tracking-tight">
              {t("appName")}
            </div>
            <div className="-mt-0.5 text-[11px] text-text-dim">
              {t("appTagline")}
            </div>
          </div>
        </NavLink>

        <div className="flex items-center gap-3">
          <nav className="flex gap-1.5" aria-label={t("nav.mainNav")}>
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.to === "/"}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-accent-dim text-accent border border-accent/30"
                      : "border border-transparent text-text-muted hover:text-text hover:bg-surface-hover"
                  }`
                }
              >
                <span>{tab.icon}</span>
                {tab.label}
              </NavLink>
            ))}
          </nav>

          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text-muted hover:text-text hover:bg-surface-hover transition-all"
            aria-label={t(theme === "dark" ? "theme.activateLight" : "theme.activateDark")}
          >
            {theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19"}
          </motion.button>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" role="main" className="flex flex-col flex-1 overflow-y-auto p-3 pb-20 md:p-5 md:pb-5">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
