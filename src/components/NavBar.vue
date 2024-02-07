<template>
   <div class="navbar bg-base-100">
      <div class="flex-1">
         <a class="btn btn-ghost text-xl">LOGO ICON</a>
      </div>
      <div class="flex-none gap-2">
         <div class="form-control">
            <!-- 搜索按钮 -->
            <div class="tooltip tooltip-bottom" data-tip="搜索">
               <a-button type="primary" size="large" shape="circle" ghost @click="searchDialog?.showModal()">🔍</a-button>
            </div>
         </div>
         <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
               <div class="w-10 rounded-full">
                  <!-- 头像 -->
                  <a-avatar :src="userInfo?.avatar" class="cursor-pointer" size="large">USER</a-avatar>
               </div>
            </div>
            <ul tabindex="0"
               class="mt-3 z-[1] p-2 shadow menu menu-md dropdown-content font-semibold bg-base-100 rounded-box w-36">
               <template v-if=userInfo>
                  <li @click="$router.push('/user')">
                     <a>
                        <UserOutlined class="text-lg" />个人中心
                     </a>
                  </li>
                  <li @click="logout">
                     <a>
                        <LogoutOutlined class="text-lg" />退出登录
                     </a>
                  </li>
               </template>
               <template v-else>
                  <li @click="$router.push('/login')">
                     <a>
                        <LoginOutlined class="text-lg" />前往登录
                     </a>
                  </li>
               </template>
            </ul>
         </div>
      </div>
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
               v-show="!searchVocabularyResult?.length && !searchUserResult?.length && !searchClassesResult?.length && searchKey">
               没有数据</p>
         </div>
      </div>
   </dialog>
</template>

<script setup lang="ts">
import { UserOutlined, LogoutOutlined, LoginOutlined } from "@ant-design/icons-vue";
import { useUserStore } from "@/stores/userStore";
import { onMounted, ref } from "vue";
import lodash from "lodash";
import { searchClassesAPI } from "@/api/classes";
import { searchUserAPI } from "@/api/user";
import { searchVocabularyAPI } from "@/api/vocabulary";
import type { User } from "@/types/user";
import type { Classes } from "@/types/classes";
import type { Vocabulary } from "@/types/vocabulary";
import { storeToRefs } from "pinia";
import router from "@/router";

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
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

// onMounted(() => {
//    searchDialog.value?.showModal();
// })

// 执行搜索
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
// 退出登录
function logout() {
   userStore.delUser();
   router.push("/login");
}
</script>

<style lang="less"></style>