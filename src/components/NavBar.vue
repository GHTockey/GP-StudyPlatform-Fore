<template>
   <div class="navbar fixed top-0 left-0 z-50 transition-all duration-300" :class="y > 100 ? 'glass' : ''">
      <div class="flex-1">
         <a class="btn btn-ghost text-xl" @click="router.push('/')">LOGO ICON</a>
      </div>
      <div class="flex-none gap-2">
         <div class="form-control">
            <!-- 搜索按钮 -->
            <div class="tooltip tooltip-bottom" data-tip="搜索">
               <button class="btn btn-circle btn-sm" @click="searchDialog?.showModal()">
                  <IconFont type="icon-sousu" />
               </button>
            </div>
         </div>
         <div class="form-control">
            <!-- 控制台按钮 -->
            <div class="tooltip tooltip-bottom" data-tip="中制台">
               <button class="btn btn-circle btn-sm" @click="centerConsoleShow = true">
                  <IconFont type="icon-zhongduankongzhi" />
               </button>
            </div>
         </div>
         <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
               <!-- 头像 -->
               <div v-if="userInfo" class="avatar online">
                  <div class="w-[40px] rounded-full">
                     <img :src="userInfo?.avatar" />
                  </div>
               </div>
               <div v-else class="w-10 rounded-full">
                  <!-- 未登录头像 -->
                  <a-avatar class="cursor-pointer" size="large">LOGIN</a-avatar>
               </div>
            </div>
            <!-- 头像菜单 -->
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
               :oninput="lodash?.debounce(searchHandler, 300)" />

            <ul class="bg-slate-400 mt-2">
               <li class="font-bold" v-show="searchVocabularyResult?.length">来自词集</li>
               <li class="hover:bg-blue-500" v-for=" voc  in  searchVocabularyResult ">{{ voc }}</li>
            </ul>

            <ul class="bg-slate-400 mt-2">
               <li class="font-bold" v-show="searchUserResult?.length">来自用户</li>
               <li class="hover:bg-blue-500" v-for=" user  in  searchUserResult ">{{ user }}</li>
            </ul>

            <ul class="bg-slate-400 mt-2">
               <li class="font-bold" v-show="searchClassesResult?.length">来自班级</li>
               <li class="hover:bg-blue-500" v-for=" classes  in  searchClassesResult ">{{ classes }}</li>
            </ul>
            <p class="text-center text-gray-500"
               v-show="!searchVocabularyResult?.length && !searchUserResult?.length && !searchClassesResult?.length && searchKey">
               没有数据</p>
         </div>
      </div>
   </dialog>
   <!-- 中控台抽屉 -->
   <a-drawer :placement="'top'" forceRender :closable="false" v-model:open="centerConsoleShow" height="300px"
      class="rounded-b-lg" :body-style="{ padding: 0 }">
      <div class="h-full flex justify-center items-center gap-3 bg-base-100 p-7">
         <div class="w-[300px] h-full bg-base-200 rounded-lg">
            123
         </div>
         <!-- 昼夜切换按钮 -->
         <div class="size-[100px] relative btn p-0">
            <label class="swap swap-rotate size-full">
               <!-- 这个隐藏的复选框控制状态 -->
               <input type="checkbox" class="theme-controller" value="dark" :checked="isDark" @change="themeChange" />
               <!--太阳图标 -->
               <!-- <IconFont type="icon-Sunny" class="swap-on fill-current size-[50px]" /> -->
               <span class="swap-on fill-current text-[2.5rem]">🌞</span>
               <!-- 月亮图标 -->
               <span class="swap-off fill-current text-[2.5rem]">🌚</span>
            </label>
            <p>主题切换</p>
         </div>
         <!-- 新增词集按钮 -->
         <div class="size-[100px] relative btn p-0" @click="$router.push('/vocabulary/add'); centerConsoleShow = false">
            <!--图标 -->
            <span class="my-center-console-icon">📖</span>
            <p>新增词集</p>
         </div>
         <!-- 加入班级按钮 -->
         <div class="size-[100px] relative btn p-0">
            <span class="my-center-console-icon">🏫</span>
            <p>加入班级</p>
         </div>
         <!-- 我的消息按钮 -->
         <div class="size-[100px] relative btn p-0">
            <span class="my-center-console-icon">✉️</span>
            <p>我的消息</p>
         </div>
      </div>
   </a-drawer>
</template>

<script setup lang="ts">
import { UserOutlined, LogoutOutlined, LoginOutlined } from "@ant-design/icons-vue";
import { useUserStore } from "@/stores/userStore";
import { ref } from "vue";
import { ClassesAPI } from "@/api/classes";
import { UserAPI } from "@/api/user";
import { VocabularyAPI } from "@/api/vocabulary";
import type { User } from "@/types/user";
import type { Classes } from "@/types/classes";
import type { Vocabulary } from "@/types/vocabulary";
import { storeToRefs } from "pinia";
import router from "@/router";
import lodash from "lodash";
import IconFont from "@/utils/iconFont";
import { useWindowScroll } from "@vueuse/core";

// vueuse 获取滚动位置
const { y } = useWindowScroll();

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
// 中控台显示
const centerConsoleShow = ref(false);
// 主题
const isDark = ref<boolean>(false);
isDark.value = JSON.parse(localStorage.getItem("isDark") || "false")
// console.log(isDark.value);



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
   searchVocabularyResult.value = (await VocabularyAPI.searchVocabulary(searchKey.value)).data;
   // 用户搜索
   searchUserResult.value = (await UserAPI.searchUserAPI(searchKey.value)).data;
   // 班级搜索
   searchClassesResult.value = (await ClassesAPI.searchClassesAPI(searchKey.value)).data;
}
// 退出登录
function logout() {
   userStore.delUser();
   router.push("/login");
}
// 主题切换事件
function themeChange(e: Event) {
   let checkEl = e.target as HTMLInputElement;
   // console.log(checkEl.checked);
   localStorage.setItem("isDark", String(checkEl.checked))
}
</script>

<style lang="less" scoped></style>