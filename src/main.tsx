import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { migrateLegacyStorage } from "./store/legacyMigration";
import "./index.css";

// Migrate legacy localStorage data to Zustand store
migrateLegacyStorage();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
