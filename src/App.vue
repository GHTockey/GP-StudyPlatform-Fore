<template>
  <a-config-provider :locale="zhCN" :theme="{
    // token: {
    //   // colorPrimary: myColorPrimary,
    // },
    // components: {
    //   Button: {
    //     borderRadius:20,
    //   },
    // }
  }">
    <RouterView />
    <!-- 聊天窗口 (限定与token是为了登录后再连接socket服务) -->
    <!-- 当 key 属性发生变化时，Vue 会认为这是一个新的组件实例，从而销毁旧的实例并创建一个新的实例 -->
    <OnlineWindow :chat-window-show="socketStore.chatWindowShow" :key="socketStore.onlineWindowKey"  />
  </a-config-provider>
</template>


<script setup lang="ts">
import OnlineWindow from "@/components/OnlineWindow.vue";
import { RouterView } from 'vue-router';
import { useUserStore } from "@/stores/userStore";
import { useSocketStore } from "@/stores/socketStore";
// antd 组件国际化
import zhCN from "ant-design-vue/es/locale/zh_CN";
// antd 日期选择器
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh_CN");

// const myColorPrimary = "#a991f7";

const userStore = useUserStore();
const socketStore = useSocketStore();
</script>

<style>
/* 元素进场动画 */
.v-enter-active {
  animation: el-enter 0.3s;
}

/* .v-leave-active {
  animation: el-leave 0.3s;
} */

/* 单元素动画 */
.one-enter-active {
  animation: el-enter 0.3s;
}

.one-leave-active {
  animation: el-leave 0.3s;
}

@keyframes el-enter {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes el-leave {
  0% {
    transform: translateY(0);
    opacity: 1;
  }

  100% {
    transform: translateY(20px);
    opacity: 0;
  }
}
</style>