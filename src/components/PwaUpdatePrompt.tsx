import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui";

/**
 * Listens for Service Worker updates and shows a banner
 * prompting the user to reload for the new version.
 */
export function PwaUpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handleControllerChange = () => {
      // New SW activated — page will use it on next navigation.
      // If we didn't trigger it ourselves, prompt.
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    // Check for waiting worker on existing registrations
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;
      setRegistration(reg);

      if (reg.waiting) {
        setShowUpdate(true);
        return;
      }

      // Listen for new installations
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            setShowUpdate(true);
          }
        });
      });
    });

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
    setShowUpdate(false);
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {showUpdate && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md rounded-xl border border-accent/30 bg-card p-4 shadow-lg md:bottom-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-text">Neue Version verfügbar</p>
              <p className="text-xs text-text-muted">
                Aktualisiere für die neuesten Funktionen und Fixes.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpdate(false)}
              >
                Später
              </Button>
              <Button size="sm" onClick={handleUpdate}>
                Aktualisieren
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
