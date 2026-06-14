/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional Sentry DSN. When set, error monitoring is initialized at startup. */
  readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
