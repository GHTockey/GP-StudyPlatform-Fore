<template>
   <!-- 班级详情页 -->
   <div class="my-type-center">
      <!-- 班级信息 -->
      <div class="h-[280px] gradation md:rounded-2xl sm:rounded-none relative overflow-hidden">
         <!-- 文字信息 -->
         <div class="absolute left-8 h-full w-[60%] flex flex-wrap items-center content-center z-10">
            <p class="text-3xl font-[600] text-white">{{ classes.name }}</p>
            <p class="w-full text-gray-400">{{ classes.info }}</p>
         </div>
         <!-- 装饰图片 -->
         <div class="lg:w-[350px] md:w-[300px] w-[280px] h-full absolute right-0">
            <img src="@/assets/img/teaching.png" class="absolute top-1/2 -translate-y-1/2">
         </div>
      </div>
      <!-- 操作栏 -->
      <div class="m-[18px_0] h-16 bg-base-200 rounded-xl p-[0_18px] flex justify-between">
         <div class="avatar h-full min-w-[150px] flex items-center">
            <div class="h-12 rounded-full ring ring-primary/50 ring-offset-base-100 ring-offset-2">
               <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
            <div class="ml-3 h-full w-[100px] !flex content-center flex-wrap">
               <p class="font-[600]">username</p>
               <p class="text-gray-500 text-xs">创建者</p>
            </div>
         </div>
         <div class="flex items-center gap-4">
            <button class="btn btn-sm btn-error">解散</button>
            <button class="btn btn-sm btn-primary">管理</button>
            <button class="btn btn-sm btn-secondary">编辑</button>
            <button class="btn btn-sm btn-accent">加入</button>
         </div>
      </div>
      <!-- 选项卡切换 -->
      <div role="tablist" class="tabs tabs-boxed w-1/2 transition-all" @click="tabSelectHandler($event)">
         <a role="tab" data-key="1" class="tab" :class="{ 'tab-active': tabValue == '1' }">成员</a>
         <a role="tab" data-key="2" class="tab" :class="{ 'tab-active': tabValue == '2' }">词集</a>
      </div>
      <div class="bg-neutral-content flex justify-between">
         <ul class="flex-1 p-2">
            <li class="bg-base-200 hover:bg-base-300 rounded-lg cursor-pointer mb-1" v-for=" user in classes.userList">
               <div class="h-14 flex relative">
                  <!-- 头像 -->
                  <div class="avatar p-1 shadow-base-content">
                     <div class="rounded-lg">
                        <img :src="user.avatar" />
                     </div>
                  </div>
                  <!-- 用户名 -->
                  <div class="ml-2">
                     <p class="font-semibold mt-1">{{ user.username }}</p>
                     <span class="text-sm text-gray-500">#{{ user.id }}</span>
                  </div>
                  <!-- 图标 -->
                  <div class="absolute right-4 top-1/2 -translate-y-1/2">
                     <RightOutlined />
                  </div>
               </div>
            </li>
         </ul>
         <ul class="bg-gray-400 w-[300px]">
            <h2>班级作业列表</h2>
            <li>123</li>
         </ul>
      </div>
   </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useClassesStore } from "@/stores/classesStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { RightOutlined } from "@ant-design/icons-vue";

// 路由对象
const route = useRoute();
// classesStore
const classesStore = useClassesStore();
// 响应式解构
const { classes } = storeToRefs(classesStore);
// 选项卡的选择
const tabValue = ref('1');

// 获取数据
classesStore.getClassesHandler(route.params.id as string);


// 选项卡选择 handler
function tabSelectHandler(e: Event) {
   let element = e.target as HTMLElement;
   if (element.tagName == 'A') {
      // console.log(element.getAttribute("data-key"));
      tabValue.value = element.getAttribute("data-key")!;
   }
}
</script>
<style lang="less">
.gradation {
   background-image: linear-gradient(to right, #243949 0%, #517fa4 100%);
}
</style>