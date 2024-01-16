import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import("@/views/layout/LayoutPage.vue"),
      redirect: '/home', children: [
        // 首页
        { path: '/home', name: '主页', component: () => import("@/views/home/HomePage.vue") },
        // 词集
        {
          path: '/vocabulary', children: [
            { path: ':id', name: '词集详情', component: () => import("@/views/vocabulary/DetailPage.vue") },
            { path: 'add', name: '创建词集页', component: () => import("@/views/vocabulary/AddPage.vue") },
            { path: 'selectMode/:vid', name: '选择模式', component: () => import("@/views/vocabulary/SelectModePage.vue") },
            { path: 'writeMode/:vid', name: '书写模式', component: () => import("@/views/vocabulary/WriteModePage.vue") },
          ]
        },
        // 用户
        {
          path: '/user', children: [
            { path: '', name: '用户详情', component: () => import("@/views/user/InfoPage.vue") },
          ]
        },
        // 班级
        {
          path: '/classes', children: [
            { path: ':id', name: '班级详情页', component: () => import("@/views/classes/DetailPage.vue") },
            { path: 'add', name: '添加班级页', component: () => import("@/views/classes/AddPage.vue") }
          ]
        },
      ]
    },
    { path: '/login', name: '登录页', component: () => import("@/views/login/LoginPage.vue") }
  ]
})

export default router