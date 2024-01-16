<template>
   <div class="fixed top-0 left-0 bg-slate-600 h-[60px] w-full z-50 flex">
      <!-- 左 -->
      <div class="bg-slate-400 h-full min-w-[150px]">
         <!-- logo -->
         <div class="nav-logo">
            <img src="" alt="">
            <span style="margin-right: 10px;" class="font-bold">LOGO ICON</span>
         </div>
         <!-- 按钮1 -->
         <div class="nav-btn">
            <AButton shape="circle" type="default">
               <PlusOutlined />
            </AButton>
         </div>
      </div>
      <!-- 中 -->
      <div class="bg-slate-500 h-full flex-1">
         2
      </div>
      <!-- 右 -->
      <div class="bg-slate-400 h-full min-w-[150px]">
         <!-- 搜索按钮 -->
         <!-- onclick="my_modal_3.showModal()" -->
         <button class="btn btn-circle btn-outline" @click="searchDialog?.showModal()">
            <svg t="1705321728765" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="1596" width="32" height="32">
               <path
                  d="M966.4 924.8l-230.4-227.2c60.8-67.2 96-156.8 96-256 0-217.6-176-390.4-390.4-390.4-217.6 0-390.4 176-390.4 390.4 0 217.6 176 390.4 390.4 390.4 99.2 0 188.8-35.2 256-96l230.4 227.2c9.6 9.6 28.8 9.6 38.4 0C979.2 950.4 979.2 934.4 966.4 924.8zM102.4 441.6c0-185.6 150.4-339.2 339.2-339.2s339.2 150.4 339.2 339.2c0 89.6-35.2 172.8-92.8 233.6-3.2 0-3.2 3.2-6.4 3.2-3.2 3.2-3.2 3.2-3.2 6.4-60.8 57.6-144 92.8-233.6 92.8C256 780.8 102.4 627.2 102.4 441.6z"
                  p-id="1597"></path>
            </svg>
         </button>

         <!-- 头像 -->
         <a-avatar>
            <template #icon>
               <AntDesignOutlined />
            </template>
         </a-avatar>
         {{ userStore.userInfo?.username }}
      </div>

      <!-- 搜索弹框 -->
      <dialog id="searchDialog" class="modal" ref="searchDialog">
         <div class="modal-box">
            <form method="dialog">
               <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 class="font-bold text-lg">SEARCH</h3>
            <div class="mt-5">
               <input type="text" placeholder="输入" class="input input-bordered w-full"
                  :oninput="lodash.debounce(searchHandler, 300)" />

               <ul class="bg-slate-400 mt-2">
                  <li class="font-bold" v-show="searchVocabularyResult?.length">来自词集</li>
                  <li class="hover:bg-blue-500" v-for="voc in searchVocabularyResult">{{ voc }}</li>
               </ul>

               <ul class="bg-slate-400 mt-2">
                  <li class="font-bold" v-show="searchUserResult?.length">来自用户</li>
                  <li class="hover:bg-blue-500" v-for="user in searchUserResult">{{ user }}</li>
               </ul>

               <ul class="bg-slate-400 mt-2">
                  <li class="font-bold" v-show="searchClassesResult?.length">来自班级</li>
                  <li class="hover:bg-blue-500" v-for="classes in searchClassesResult">{{ classes }}</li>
               </ul>
               <p class="text-center text-gray-500"
                  v-show="!searchVocabularyResult?.length && !searchUserResult?.length && !searchClassesResult?.length">
                  没有数据</p>
            </div>
         </div>
      </dialog>
   </div>
</template>

<script setup lang="ts">
import { PlusOutlined, AntDesignOutlined } from "@ant-design/icons-vue";
import { useUserStore } from "@/stores/userStore";
import { onMounted, ref } from "vue";
import lodash from "lodash";
import { searchClassesAPI } from "@/api/classes";
import { searchUserAPI } from "@/api/user";
import { searchVocabularyAPI } from "@/api/vocabulary";
import type { User } from "@/types/user";
import type { Classes } from "@/types/classes";
import type { Vocabulary } from "@/types/vocabulary";

const userStore = useUserStore();
// 搜索弹框组件
const searchDialog = ref<HTMLDialogElement | null>(null);
// 搜索关键词
const searchKey = ref<string>("");
// 词集搜索结果
const searchVocabularyResult = ref<Vocabulary[]>();
// 用户搜索结果
const searchUserResult = ref<User[]>();
// 班级搜索结果
const searchClassesResult = ref<Classes[]>();

onMounted(() => {
   searchDialog.value?.showModal();
})

async function searchHandler(e: Event) {
   // 清空搜索结果
   searchClassesResult.value = [];
   searchUserResult.value = [];
   searchVocabularyResult.value = [];
   // 获取搜索关键词
   searchKey.value = (<HTMLInputElement>e.target).value;
   // 如果搜索关键词为空，不进行搜索
   if (!searchKey.value) return;
   // 词集搜索
   searchVocabularyResult.value = (await searchVocabularyAPI(searchKey.value)).data;
   // 用户搜索
   searchUserResult.value = (await searchUserAPI(searchKey.value)).data;
   // 班级搜索
   searchClassesResult.value = (await searchClassesAPI(searchKey.value)).data;
}
</script>

<style lang="less"></style>