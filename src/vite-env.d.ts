/// <reference types="vite/client" />

// Версия из package.json, подставляется Vite при сборке (см. vite.config.ts)
declare const __APP_VERSION__: string

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
