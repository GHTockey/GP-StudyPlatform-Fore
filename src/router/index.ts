import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import("@/views/Layout/LayoutPage.vue"),
      redirect: '/home',
      children: [
        { path: '/home', name: '主页', component: () => import("@/views/Home/HomePage.vue") },
        {
          path: '/vocabulary',
          children: [
            { path: ':id', name: '词集详情', component: () => import("@/views/Vocabulary/DetailPage.vue") },
            { path: 'add', name: '创建词集页', component: () => import("@/views/Vocabulary/AddPage.vue") },
            { path: 'selectMode/:vid', name: '选择模式', component: () => import("@/views/Vocabulary/SelectModePage.vue") },
            { path: 'writeMode/:vid', name: '书写模式', component: () => import("@/views/Vocabulary/WriteModePage.vue") },
          ]
        },
        {
          path: '/user',
          children: [
            { path: '', name: '用户详情', component: () => import("@/views/User/InfoPage.vue") },
          ]
        }
      ]
    },
    { path: '/login', name: '登录页', component: () => import("@/views/Login/LoginPage.vue") }
  ]
})

export default router
