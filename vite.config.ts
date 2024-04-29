import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// export const baseURL = "http://localhost:8080"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({ // 自动导入组件
      resolvers: [AntDesignVueResolver({ importStyle: false })],
    }),
    AutoImport({ // 自动导入类型  (还要在tsconfig.app.json中配置include: {..., "./components.d.ts"} )
      resolvers: [AntDesignVueResolver()]
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    // host: '0.0.0.0',
    // proxy: {
    //   '/api': {
    //     target: baseURL, // 后端接口地址
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   }
    // }
  },
})
