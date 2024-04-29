/// <reference types="vite/client" />

interface ImportMetaEnv {
   // readonly VITE_APP_TITLE: string
   // 更多环境变量...
   readonly VITE_BASE_URL: string
   readonly VITE_NAME: string
   readonly VITE_USER_MODE_ENV: string
}

interface ImportMeta {
   readonly env: ImportMetaEnv
}