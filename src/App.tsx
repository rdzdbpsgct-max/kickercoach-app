import { Suspense, lazy, Component, type ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

const HomePage = lazy(() => import("./features/home/HomePage"));
const LearnMode = lazy(() => import("./features/learn/LearnMode"));
const TrainMode = lazy(() => import("./features/train/TrainMode"));
const PlanMode = lazy(() => import("./features/plan/PlanMode"));

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
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl border-2 border-accent bg-accent-dim px-6 py-2 text-sm font-semibold text-accent-hover hover:bg-accent hover:text-white transition-all"
          >
            Seite neu laden
          </button>
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

export default function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearnMode />} />
            <Route path="/train" element={<TrainMode />} />
            <Route path="/plan" element={<PlanMode />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
}
