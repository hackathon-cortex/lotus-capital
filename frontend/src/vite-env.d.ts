/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOW_PENDING_STATS?: string;
  readonly VITE_SHOW_REAL_ESTATE?: string;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

