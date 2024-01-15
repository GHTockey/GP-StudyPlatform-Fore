<template>
   <!-- 班级详情页 -->
   <div class="detail-page-container">
      <h1 class="text-2xl">名称：{{ classes.name }}</h1>
      <p>描述：{{ classes.info }}</p>
      <p>公告：{{ classes.annc }}</p>
      <p>创建者：{{ classes.creatorUid }}</p>

      <ul class="bg-slate-500 text-white">
         <h2>班级成员列表</h2>
         <li v-if="classes.userList" v-for="user in classes.userList">{{ user }}</li>
         <li v-else>无</li>
      </ul>
      <ul class="bg-gray-400">
         <h2>班级作业列表</h2>
         <li>123</li>
      </ul>
   </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useClassesStore } from "@/stores/classesStore";
import { storeToRefs } from "pinia";

// 路由对象
const route = useRoute();
// classesStore
const classesStore = useClassesStore();
// 响应式解构
const { classes } = storeToRefs(classesStore);

// 获取数据
classesStore.getClassesHandler(route.params.id as string);
</script>

<style lang="less"></style>