<template>
   <div class="thirdLogin-box size-full grid place-content-center">
      <!-- 对话窗口容器 -->
      <div class="w-[730px] h-[500px] shadow-tce-shadow rounded-xl 
              text-white relative overflow-hidden bg-slate-800">
         <!-- 标题 -->
         <h1 class="text-center text-2xl font-bold mt-8">第三方账号绑定</h1>
         <!-- 双方图标 -->
         <div class="flex my-5 justify-center gap-10">
            <!-- 对方 -->
            <div class=" flex items-center">
               <div class="avatar">
                  <!--  ring ring-white -->
                  <div class="w-16 rounded-full bg-white ring ring-gray-300">
                     <img src="/logo/github-logo.svg" />
                  </div>
               </div>
            </div>
            <!-- 连接图标 -->
            <div class="grid place-items-center">
               <p class="text-7xl bg-gradient-to-r">♾️</p>
            </div>
            <!-- 我方 -->
            <div class=" flex items-center">
               <div class="avatar">
                  <div class="w-16 rounded-full bg-white ring ring-gray-300">
                     <img src="/douyinemoji/cde766dbded94bab8cac6f71e9690bc1.png" />
                  </div>
               </div>
            </div>
         </div>
         <!-- 说明 -->
         <p class="text-center">你已通过 {{ OAuthType }} 授权，完善以下信息以继续</p>
         <!-- 表单 -->
         <div class="grid place-content-center gap-4 my-5 text-base-content">
            <input type="text" placeholder="手机号 / 邮箱" class="input input-bordered input-md w-[350px]" />
            <input type="text" placeholder="密码" class="input input-bordered input-md w-[350px]" />
         </div>
         <!-- 按钮 -->
         <div class="grid place-content-center gap-2">
            <button class="btn btn-primary w-[350px]">绑定已有账号并登录</button>
            <button class="btn w-[350px]">使用第三方信息注册并登录</button>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const OAuthType = useRoute().query.type as string;
const OAuthKeyName = useRoute().query.okey as string;

</script>

<style>
.thirdLogin-box {
   background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
}

/* 文字渐变 */
.bg-gradient-to-r {
   /* 应用背景裁剪到文本 */
   -webkit-background-clip: text;
   /* 将文本颜色设置为透明，以显示背景渐变 */
   -webkit-text-fill-color: transparent;

   /* 无缝效果 */
   background-image: linear-gradient(to right, indigo, violet, red, orange, yellow, indigo, violet);
   /* 设置足够大的背景尺寸，确保无缝循环 */
   background-size: 600% 100%;

   /* 无限循环动画 */
   animation: text-gradient-animation 5s linear infinite;
}

@keyframes text-gradient-animation {
   from {
      background-position: 100% 50%;
   }

   to {
      background-position: 0% 50%;
   }
}
</style>