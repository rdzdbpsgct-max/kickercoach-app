import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry error monitoring. Only called when VITE_SENTRY_DSN is set
 * (see main.tsx) — and this module is dynamically imported, so the SDK is never
 * shipped to users who haven't configured a DSN.
 */
export function initSentry(dsn: string): void {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    // Conservative defaults; tune per environment.
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}
