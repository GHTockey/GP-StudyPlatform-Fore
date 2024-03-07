<template>
   <Transition name="notification">
      <div v-show="flag" id="myNotification" role="aler" class="alert fixed bottom-5 right-5 w-auto overflow-hidden">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            class="z-10 stroke-info shrink-0 w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
               d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
         </svg>
         <span class="mr-5 z-10">您收到了新的消息!</span>
         <div class="z-10">
            <button onclick="document.querySelector('#onlineBox').showModal();"
               class="btn btn-sm btn-info mr-2">查看</button>
            <!-- <button class="btn btn-sm"> 1 小时内不再提醒</button> -->
         </div>
         <!-- 进度条 -->
         <div ref="tceProgressEl" class="tceProgressEl transition-all absolute top-0 left-0 size-full"></div>
      </div>
   </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";


const flag = ref(false)
const tceProgressEl = ref<HTMLDivElement | null>(null)

onMounted(() => {
   // console.log("通知组件已打开");
   setTimeout(() => {
      flag.value = true;
      if (tceProgressEl.value) {
         tceProgressEl.value.style.animation = `tceProgress ${3000}ms linear`;
         // 监听进度条动画结束
         tceProgressEl.value.addEventListener("animationend", () => {
            flag.value = false;
         })
      }
   }, 0);
})



</script>

<style scoped>
/* hover 暂停进度条 */
#myNotification:hover .tceProgressEl {
   background-color: rgb(255, 124, 124);
   animation-play-state: paused !important;
}

/* 进度条背景渐变 */
.tceProgressEl {
   background: linear-gradient(90deg, rgba(255, 255, 255, 0), gray);
}

/* 进度条动画 */
@keyframes tceProgress {
   0% {
      width: 0;
   }

   100% {
      width: 100%;
   }
}

/* 元素进场动画 */
.notification-enter-active {
   animation: el-in 0.3s;
}
@keyframes el-in {
   0% {
      transform: translateY(20px);
      opacity: 0;
   }

   100% {
      transform: translateY(0);
      opacity: 1;
   }
}
/* 元素离场动画 */
.notification-leave-active {
  animation: el-out 0.3s;
}
@keyframes el-out {
   0% {
      transform: translateX(0);
      opacity: 1;
   }

   100% {
      transform: translateX(20px);
      opacity: 0;
   }
}
</style>