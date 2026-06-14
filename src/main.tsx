import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { migrateLegacyStorage } from "./store/legacyMigration";
import "./i18n";
import "./index.css";

// Migrate legacy localStorage data to Zustand store
migrateLegacyStorage();

// Optional error monitoring — only loads when a DSN is configured, so the
// Sentry SDK is never shipped to users who haven't set one up.
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) {
  void import("./monitoring/sentry").then((m) => m.initSentry(sentryDsn));
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
