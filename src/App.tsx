import { Suspense, lazy, Component, type ReactNode } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import { FeatureErrorBoundary } from "./components/ErrorBoundary";
import QuickActionFAB from "./components/QuickActionFAB";
import { useInitStore } from "./hooks/useInitStore";

const HomePage = lazy(() => import("./features/home/HomePage"));
const LearnMode = lazy(() => import("./features/learn/LearnMode"));
const TrainMode = lazy(() => import("./features/train/TrainMode"));
const PlanMode = lazy(() => import("./features/plan/PlanMode"));
const BoardMode = lazy(() => import("./features/board/BoardMode"));
const PlayersMode = lazy(() => import("./features/players"));
const AnalyticsMode = lazy(() => import("./features/analytics"));
const SettingsPage = lazy(() => import("./features/settings/SettingsPage"));

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleEmergencyExport = () => {
    try {
      const raw = localStorage.getItem("kickercoach-store");
      if (!raw) return;
      const blob = new Blob([raw], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kickercoach-notfall-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Silent fail — already in error state
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <span className="text-4xl">&#9888;&#65039;</span>
          <h2 className="text-lg font-bold text-text">
            Etwas ist schiefgelaufen
          </h2>
          <p className="text-sm text-text-muted">
            Bitte lade die Seite neu, um fortzufahren.
          </p>
          <div className="flex gap-3">
            <button
              onClick={this.handleEmergencyExport}
              className="rounded-xl border border-border px-6 py-2 text-sm font-bold text-text-muted hover:border-accent/50 transition-all"
            >
              Daten sichern
            </button>
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl border border-accent bg-accent px-6 py-2 text-sm font-bold text-bg hover:bg-accent-hover transition-all"
            >
              Seite neu laden
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function LoadingFallback() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="text-sm text-text-dim">Laden...</span>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  useInitStore();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname.split("/")[1] || "home"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex flex-1 flex-col min-h-0"
      >
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location}>
            <Route path="/" element={<FeatureErrorBoundary featureName="Home"><HomePage /></FeatureErrorBoundary>} />
            <Route path="/learn" element={<FeatureErrorBoundary featureName="Lernen"><LearnMode /></FeatureErrorBoundary>} />
            <Route path="/train" element={<FeatureErrorBoundary featureName="Training"><TrainMode /></FeatureErrorBoundary>} />
            <Route path="/plan" element={<FeatureErrorBoundary featureName="Matchplan"><PlanMode /></FeatureErrorBoundary>} />
            <Route path="/board" element={<FeatureErrorBoundary featureName="Taktikboard"><BoardMode /></FeatureErrorBoundary>} />
            <Route path="/players" element={<FeatureErrorBoundary featureName="Spieler"><PlayersMode /></FeatureErrorBoundary>}>
              <Route index element={null} />
              <Route path="new" element={null} />
              <Route path=":playerId" element={null} />
              <Route path=":playerId/edit" element={null} />
              <Route path="teams" element={null} />
              <Route path="teams/new" element={null} />
            </Route>
            <Route path="/analytics" element={<FeatureErrorBoundary featureName="Analyse"><AnalyticsMode /></FeatureErrorBoundary>} />
            <Route path="/settings" element={<FeatureErrorBoundary featureName="Einstellungen"><SettingsPage /></FeatureErrorBoundary>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <AnimatedRoutes />
        <QuickActionFAB />
      </Layout>
    </ErrorBoundary>
  );
}
