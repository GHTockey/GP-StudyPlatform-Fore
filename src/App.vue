<template>
  <a-config-provider :locale="zhCN" :theme="{
    token: {
      // colorPrimary: myColorPrimary,
    },
    // components: {
    //   Button: {
    //     borderRadius:20,
    //   },
    // }
  }">
    <RouterView />
  </a-config-provider>
</template>


<script setup lang="ts">
import { RouterView } from 'vue-router'
// antd 组件国际化
import zhCN from "ant-design-vue/es/locale/zh_CN";
// antd 日期选择器
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
// dayjs.locale("zh-cn");
dayjs.locale("zh_CN")

const myColorPrimary = "#a991f7";

</script>