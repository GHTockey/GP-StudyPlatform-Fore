import { createApp } from 'vue'
import { createPinia } from 'pinia'

import piniaPluhinPersistedstate from "pinia-plugin-persistedstate";

import App from './App.vue'
import router from './router'

// tailwind css
import './index.css';
import "./assets/preflight.css";

const app = createApp(App)
const pinia = createPinia()

// pinia 持久化插件
pinia.use(piniaPluhinPersistedstate);

app.use(pinia)
app.use(router)

app.mount('#app')

console.log("模式:", import.meta.env.VITE_NAME);