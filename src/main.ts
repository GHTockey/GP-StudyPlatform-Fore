import { createApp } from 'vue'
import { createPinia } from 'pinia'

import piniaPluhinPersistedstate from "pinia-plugin-persistedstate";

import App from './App.vue'
import router from './router'

// import io from "socket.io-client";
// WebSocket 连接
// const socket = io('ws://localhost:8080/webSocket/1000000', {
//    extraHeaders: {
//       "Authorization": "eyJhbGciOiJSUzI1NiJ9.eyJhdmF0YXIiOiJodHRwczovL2ltZy50b2NrZXkuY24vZ3Av5rWB5rGX6buE6LGGLnBuZyIsImNsYXNzIjoiY24udG9ja2V5LmRvbWFpbi5Vc2VyIiwiZW1haWwiOiJ0b2NrZXlAeWVhaC5uZXQiLCJpZCI6IjEwMDAwMDAiLCJzZXgiOiIxIiwidXNlcm5hbWUiOiJhZG1pbiIsImV4cCI6MTcwOTY0MzYyMX0.KYEj4vO0M6y0hxod0Ry9r9itybMugJhY5N_8qqtrr5BNF8N9-FlyFyRuV5VTgtI6MBTHKFF6YWj56ba8dDMy6s8-rIBbCJg26q6ddswHAe6U9YuqSLs3oM6xwGCHmwxTPMON6cIjHogG-tzBojpyx4qAsuKtQfwkuQMe1tcvPdU"
//    }
// });
// socket.on('connect', () => {
//    console.log('连接成功', socket);
// })


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
