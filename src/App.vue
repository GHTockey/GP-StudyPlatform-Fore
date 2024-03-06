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
    <OnlineWindow :show-window="true" />
  </a-config-provider>
</template>


<script setup lang="ts">
import OnlineWindow from "@/components/OnlineWindow.vue";
import { onMounted } from "vue";
import { RouterView } from 'vue-router'
// antd 组件国际化
import zhCN from "ant-design-vue/es/locale/zh_CN";
// antd 日期选择器
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh_CN")

const myColorPrimary = "#a991f7";


onMounted(() => {
  (<HTMLDialogElement>document.querySelector("#onlineBox")).showModal();
})







</script>

<style>
/* 元素进场动画 */
.v-enter-active {
  animation: el-enter 0.3s;
}

/* .v-leave-active {
  animation: el-leave 0.3s;
} */

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
    width: 100%;
    /* transform: translateY(0); */
    opacity: 1;
  }

  100% {
    width: 0;
    /* transform: translateY(20px); */
    opacity: 0;
  }
}
</style>