/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_LASTFM_USERNAME: string
  readonly VITE_LASTFM_API_KEY: string
  readonly VITE_MEDIUM_USERNAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
