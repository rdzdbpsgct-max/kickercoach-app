import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const { t } = useTranslation();

  const primaryTabs = [
    { to: "/", label: t("nav.home"), icon: "\u{1F3E0}" },
    { to: "/train", label: t("nav.train"), icon: "\u23F1\uFE0F" },
    { to: "/players", label: t("nav.players"), icon: "\uD83D\uDC64" },
  ];

  const moreItems = [
    { to: "/learn", label: t("nav.learn"), icon: "\uD83D\uDCDA" },
    { to: "/plan", label: t("nav.plan"), icon: "\uD83D\uDCCB" },
    { to: "/board", label: t("nav.board"), icon: "\uD83C\uDFAF" },
    { to: "/analytics", label: t("nav.analytics"), icon: "\uD83D\uDCCA" },
    { to: "/settings", label: t("nav.settings"), icon: "\u2699\uFE0F" },
  ];

  return (
    <>
      {/* More overlay */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed bottom-[calc(env(safe-area-inset-bottom)+3.5rem)] left-3 right-3 z-50 rounded-2xl border border-border bg-surface p-3 shadow-2xl"
            >
              <div className="mb-2 text-xs font-semibold text-text-dim">{t("nav.moreAreas")}</div>
              <div className="grid grid-cols-2 gap-2">
                {moreItems.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.15 }}
                  >
                    <NavLink
                      to={item.to}
                      onClick={() => setMoreOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive
                            ? "bg-accent-dim text-accent"
                            : "text-text-muted hover:bg-surface-hover hover:text-text"
                        }`
                      }
                    >
                      <span className="text-lg">{item.icon}</span>
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom nav bar */}
      <nav
        className="bottom-nav fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/90 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]"
        aria-label={t("nav.mainNav")}
      >
        <div className="flex items-stretch justify-around">
          {primaryTabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === "/"}
              className={({ isActive }) =>
                `relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                  isActive
                    ? "text-accent"
                    : "text-text-dim"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="bottomnav-indicator"
                      className="absolute top-0 left-1/4 right-1/4 h-0.5 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="text-xl leading-none">{tab.icon}</span>
                  {tab.label}
                </>
              )}
            </NavLink>
          ))}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => setMoreOpen((prev) => !prev)}
            aria-label={t("nav.moreAreas")}
            aria-expanded={moreOpen}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
              moreOpen ? "text-accent" : "text-text-dim"
            }`}
          >
            <span className="text-xl leading-none">{moreOpen ? "\u2716" : "\u2026"}</span>
            {t("nav.more")}
          </motion.button>
        </div>
      </nav>
    </>
  );
}
