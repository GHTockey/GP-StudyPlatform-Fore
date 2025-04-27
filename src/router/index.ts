import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import("@/views/Layout/LayoutPage.vue"),
      redirect: '/home', children: [
        // 首页
        { path: '/home', name: '主页', component: () => import("@/views/Home/HomePage.vue") },
        // 词集
        {
          path: '/vocabulary', children: [
            { path: ':id', name: '词集详情', component: () => import("@/views/Vocabulary/DetailPage.vue") },
            { path: 'add', name: '创建词集', component: () => import("@/views/Vocabulary/AddPage.vue") },
            { path: 'edit/:id', name: '编辑词集', component: () => import("@/views/Vocabulary/AddPage.vue") },
            { path: 'selectMode/:vid', name: '选择模式', component: () => import("@/views/Vocabulary/SelectModePage.vue") },
            { path: 'writeMode/:vid', name: '书写模式', component: () => import("@/views/Vocabulary/WriteModePage.vue") },
          ]
        },
        // 用户
        {
          path: '/user', children: [
            { path: '', name: '用户详情(自己)', component: () => import("@/views/User/InfoPage.vue") },
            { path: ':id', name: '用户详情', component: () => import("@/views/User/InfoPage.vue") },
          ]
        },
        // 班级
        {
          path: '/classes', children: [
            { path: ':id', name: '班级详情页', component: () => import("@/views/Classes/DetailPage.vue") },
          ]
        },
      ]
    },
    { path: '/login', name: '登录页', component: () => import("@/views/Login/LoginPage.vue") },
    // 第三方登录 (绑定)
    { path: '/thirdLogin', name: '第三方登录绑定', component: () => import("@/views/Login/ThirdLoginPage.vue") }
  ]
})

export default router
