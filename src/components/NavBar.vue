<template>
   <!-- 导航栏 -->
   <div class="navbar fixed top-0 left-0 z-50 transition-all duration-300" :class="y > 50 ? 'glass' : ''">
      <div class="flex-1">
         <!-- <a class="btn btn-ghost text-xl" @click="router.push('/')">LOGO ICON</a> -->
         <!-- <a class="btn btn-ghost text-xl" @click="router.push('/')">智词领航</a> -->
         <a class="btn btn-ghost md:w-[180px] grid place-content-center" @click="router.push('/')">
            <!-- <IconFont v-if="isDark" type="icon-tockey-logo-bai" />
            <IconFont v-else type="icon-a-ziyuan1" /> -->
            <IconFont type="icon-logo" class="text-[100px]" />
         </a>
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
            <!-- 中控台按钮 -->
            <div class="tooltip tooltip-bottom" data-tip="中制台">
               <div v-show="unreadMessage.length" class="badge badge-error absolute right-0 top-0 p-0 size-2"></div>
               <button class="btn btn-circle btn-sm" @click="centerConsoleShow = true">
                  <IconFont type="icon-zhongduankongzhi" />
               </button>
            </div>
         </div>
         <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
               <!-- 头像 -->
               <div v-if="userInfo" class="avatar">
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
   <dialog id="searchDialog" class="modal" ref="searchDialog" @close="searchOptionClick()">
      <div class="modal-box transition-all duration-300 fixed top-[100px] left-1/2 -translate-x-1/2 overflow-y-hidden">
         <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
         </form>
         <h3 class="font-bold text-lg">搜索</h3>
         <div class="mt-5 p-2 max-h-[500px] overflow-y-auto">
            <input type="text" placeholder="输入关键词" class="input input-bordered w-full"
               :oninput="lodash?.debounce(searchHandler, 300)" />
            <!-- 搜索条件 -->
            <div class="text-sm flex gap-4 my-2">
               <label class="flex items-center gap-x-1">
                  <input type="checkbox" v-model="searchCondition.vocabulary" class="checkbox checkbox-xs" />
                  <span class=" cursor-pointer">词集</span>
               </label>
               <label class="flex items-center gap-x-1">
                  <input type="checkbox" v-model="searchCondition.user" class="checkbox checkbox-xs" />
                  <span class=" cursor-pointer">用户</span>
               </label>
               <label class="flex items-center gap-x-1">
                  <input type="checkbox" v-model="searchCondition.classes" class="checkbox checkbox-xs" />
                  <span class=" cursor-pointer">班级</span>
               </label>
            </div>

            <!-- 用户搜索结果 -->
            <Transition>
               <ul class="mt-5" v-show="searchUserResult?.length && searchCondition.user">
                  <div class="divider font-semibold">🧑来自用户</div>
                  <li class="bg-base-200 hover:bg-base-300 rounded-lg cursor-pointer mb-1"
                     v-for="user in searchUserResult" @click="$router.push(`/user/${user.id}`); searchOptionClick()">
                     <div class="h-14 flex relative">
                        <!-- 头像 -->
                        <div class="avatar online p-1 shadow-base-content">
                           <div class="rounded-lg">
                              <img :src="user.avatar" />
                           </div>
                        </div>
                        <!-- 用户名 -->
                        <div class="ml-4">
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
            </Transition>
            <!-- 词集搜索结果 -->
            <Transition>
               <ul class="bg-base-100 mt-5" v-show="searchVocabularyResult?.length && searchCondition.vocabulary">
                  <div class="divider font-semibold">📖来自词集</div>

                  <li class="bg-base-200 hover:bg-base-300 rounded-lg cursor-pointer mb-1"
                     @click="$router.push(`/vocabulary/${voc.id}`); searchOptionClick()"
                     v-for="voc in searchVocabularyResult">
                     <div class="h-14 flex relative">
                        <!-- 标题-描述 -->
                        <div class="border-gray-500 w-44 pl-3 flex flex-wrap items-center self-center">
                           <p class="font-semibold truncate w-full">{{ voc.title }}</p>
                           <p class="text-xs text-gray-500 truncate">{{ voc.desc }}</p>
                        </div>
                        <!-- 时间-作者-数量 -->
                        <div class="w-52 text-gray-500 text-sm flex flex-wrap items-center self-center">
                           <p class="w-full">
                              <IconFont type="icon-shijian" /> {{ voc.createTime?.slice(0, 10) }}
                           </p>
                           <div class="flex gap-2">
                              <!-- 数量 -->
                              <p>
                                 <IconFont type="icon-icon-test" /> {{ voc.count }}
                              </p>
                              <!-- 学习用户数 -->
                              <p>
                                 <IconFont type="icon-zongyonghushu" /> {{ voc.userList?.length || 0 }}
                              </p>
                              <!-- 作者 -->
                              <p>
                                 <IconFont type="icon-hezuozuozhe" /> {{ voc.author?.username || null }}
                              </p>
                           </div>
                        </div>
                        <!-- 图标 -->
                        <div class="absolute right-4 top-1/2 -translate-y-1/2">
                           <RightOutlined />
                        </div>
                     </div>
                  </li>
               </ul>
            </Transition>
            <!-- 班级搜索结果 -->
            <Transition>
               <ul class="bg-base-100 mt-5" v-show="searchClassesResult?.length && searchCondition.classes">
                  <div class="divider font-semibold">🏫来自班级</div>
                  <li class="bg-base-200 hover:bg-base-300 rounded-lg cursor-pointer mb-1"
                     @click="$router.push(`/classes/${classes.id}`); searchOptionClick()"
                     v-for="classes in searchClassesResult">
                     <div class="h-14 flex relative pl-2">
                        <!-- 班级图标 -->
                        <div class="flex justify-center items-center">
                           <IconFont type="icon-banjixinxi" class="text-[2.5rem] text-gray-500" />
                        </div>
                        <!-- 班级信息 -->
                        <div class="border-gray-500 w-40 mr-2 pl-3 flex flex-wrap items-center self-center">
                           <p class="font-semibold truncate w-full">{{ classes.name }}</p>
                           <p class="text-xs text-gray-500 truncate">{{ classes.info }}</p>
                        </div>
                        <!-- 作者-人数 -->
                        <div class="flex gap-4 items-center text-gray-500">
                           <!-- 作者 -->
                           <p>
                              <IconFont type="icon-hezuozuozhe" /> {{ classes.creator?.username }}
                           </p>
                           <!-- 数量 -->
                           <p>
                              <IconFont type="icon-zongyonghushu" /> {{ classes.userList?.length }}
                           </p>
                        </div>
                        <!-- 箭头图标 -->
                        <div class="absolute right-4 top-1/2 -translate-y-1/2">
                           <RightOutlined />
                        </div>
                     </div>
                  </li>
               </ul>
            </Transition>

            <Transition>
               <p v-if="loadingObj.isSearch" class="p-10 flex items-center justify-center gap-2">
                  <span class="loading loading-ring loading-md"></span>
                  <span class="text-gray-500">正在搜索</span>
               </p>
               <template v-else>
                  <p class="text-center text-gray-500 p-10"
                     v-show="!searchVocabularyResult?.length && !searchUserResult?.length && !searchClassesResult?.length && searchKey">
                     没有数据</p>
               </template>
            </Transition>
         </div>
      </div>
   </dialog>
   <!-- 中控台抽屉 -->
   <a-drawer :placement="'top'" forceRender :closable="false" v-model:open="centerConsoleShow" height="auto"
      class="rounded-b-lg" :body-style="{ padding: 0 }">
      <div class="h-full bg-base-100 p-7 flex flex-col items-center gap-y-[10px]">
         <div class="flex gap-[10px]">
            <!-- 个人信息 card -->
            <div class="h-[160px] w-[230px] bg-[#0e7490]/80 rounded-lg p-3 flex flex-col relative">
               <!-- 头像 -->
               <img :src="userInfo?.avatar" alt="avatar" width="60" class="rounded-full">
               <!-- 其它信息 -->
               <div class="flex-1 flex flex-col justify-end text-white font-semibold">
                  <div>{{ userInfo?.username }}</div>
                  <div class="text-[12px] text-gray-300 italic">#{{ userInfo?.id }}</div>
               </div>
               <!-- btns -->
               <div class="absolute top-0 right-0 h-full flex flex-col gap-y-[10px] p-[10px]">
                  <div class="btn flex flex-col font-[500]" @click="chartSwitch(1)">
                     <p class="text-[16px]">123</p>
                     <p class="text-[10px]">学习热力</p>
                  </div>
                  <div class="btn flex flex-col font-[500]" @click="chartSwitch(2)">
                     <p class="text-[16px]">3</p>
                     <p class="text-[10px]">词集掌握</p>
                  </div>
               </div>
            </div>
            <!-- 图表切换 -->
            <div class="h-[160px] bg-base-200 rounded-lg p-3 transition-all">
               <Transition>
                  <!-- 日历图 -->
                  <div v-show="chartIndex === 1" id="chart1" ref="chart1" class="w-[500px] h-full"></div>
               </Transition>
               <Transition>
                  <!-- 雷达图 -->
                  <div v-show="chartIndex === 2" id="chart2" ref="chart2" class="w-[300px] h-full">
                  </div>
               </Transition>
            </div>
         </div>
         <div class="flex justify-center items-center gap-3 mb-[15px]">
            <!-- 昼夜切换按钮 -->
            <div class="size-[100px] relative btn p-0">
               <label class="swap swap-rotate size-full">
                  <!-- 这个隐藏的复选框控制状态 -->
                  <input type="checkbox" class="theme-controller" value="dark" :checked="isDark"
                     @change="themeChange" />
                  <!--太阳图标 -->
                  <!-- <IconFont type="icon-Sunny" class="swap-on fill-current size-[50px]" /> -->
                  <span class="swap-on fill-current text-[2.5rem]">🌞</span>
                  <!-- 月亮图标 -->
                  <span class="swap-off fill-current text-[2.5rem]">🌚</span>
               </label>
               <p>主题切换</p>
            </div>
            <!-- 发布词集按钮 -->
            <div class="size-[100px] relative btn p-0"
               @click="$router.push('/vocabulary/add'); centerConsoleShow = false;">
               <!--图标 -->
               <span class="my-center-console-icon">📖</span>
               <p>发布词集</p>
            </div>
            <!-- 创建班级按钮 -->
            <div onclick="document.querySelector('#createClassDialog').showModal()" @click="centerConsoleShow = false;"
               class="size-[100px] relative btn p-0">
               <span class="my-center-console-icon">🏫</span>
               <p>创建班级</p>
            </div>
            <!-- 我的消息按钮 -->
            <div @click="centerConsoleShow = false; chatWindowShow = true;" class="size-[100px] relative btn p-0">
               <!-- 未读消息数 -->
               <div v-show="unreadMessage.length" class="badge badge-error absolute -top-2 -right-3">{{
                  unreadMessage.length
               }}</div>
               <span class="my-center-console-icon">✉️</span>
               <p>我的消息</p>
            </div>
         </div>
      </div>
   </a-drawer>
   <!-- 创建班级弹框 -->
   <dialog id="createClassDialog" class="modal">
      <div class="modal-box transition-all duration-300 ">
         <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
         </form>
         <h3 class="font-bold text-lg">创建班级</h3>
         <p class="text-sm font-bold">与同学分享词集与在线交流</p>
         <div class="mt-5">
            <input v-model="createClassForm.name" type="text" placeholder="输入班级名称"
               class="input input-bordered w-full" />
            <input v-model="createClassForm.info" type="text" placeholder="输入班级描述"
               class="input input-bordered w-full mt-5" />
            <button @click="createClassSubmit" class="btn btn-primary mt-5 w-full">创建</button>
         </div>
      </div>
   </dialog>
</template>

<script setup lang="ts">
import { UserOutlined, LogoutOutlined, LoginOutlined, RightOutlined } from "@ant-design/icons-vue";
import { useUserStore } from "@/stores/userStore";
import { ref, onMounted, watch, shallowRef } from "vue";
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
import { useWindowScroll, useStorage } from "@vueuse/core";
import { MyUtils } from "@/utils";
import { useSocketStore } from "@/stores/socketStore";
import * as echarts from 'echarts';

// vueuse 获取滚动位置
const { y } = useWindowScroll();

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const { unreadMessage, chatWindowShow } = storeToRefs(useSocketStore());

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
// const isDark = ref<boolean>(false);
const isDark = useStorage("isDark", false);
isDark.value = JSON.parse(localStorage.getItem("isDark") || "false")
// console.log(isDark.value);
// 班级创建表单
const createClassForm = ref<Classes>({
   id: null,
   annc: "",
   creatorUid: userStore.userInfo?.id || '',
   info: "",
   name: ""
});


const loadingObj = ref({
   isSearch: false,
});
// 搜索条件
const searchCondition = ref({
   vocabulary: true,
   user: true,
   classes: true,
})

// 中控台图表索引
const chartIndex = ref(1);


const chart1 = ref<HTMLDivElement | null>(null);
const chart1Instance = shallowRef<echarts.ECharts | null>(null); // ref 调用图表的 resize 时会报错; 详见：https://github.com/apache/echarts/issues/13943
const chart2 = ref<HTMLDivElement | null>(null);
const chart2Instance = shallowRef<echarts.ECharts | null>(null);


onMounted(() => {
   drawChart1();
   drawChart2();
})

watch(isDark, () => {
   chart1Instance.value?.dispose();
   chart2Instance.value?.dispose();
   drawChart1();
   drawChart2();
})


// 创建班级 【提交】
async function createClassSubmit() {
   let createClassDialog = window.document.querySelector("#createClassDialog") as HTMLDialogElement;
   centerConsoleShow.value = false;
   createClassDialog.close();
   if (createClassForm.value.name == "") {
      return MyUtils.alert("班级名称不能为空", "error");
   }
   let res = await ClassesAPI.addClasses(createClassForm.value);
   if (res.code === 20000) {
      MyUtils.alert(res.message, "success");
      router.push(`/classes/${res.other.id}`);
   } else {
      MyUtils.alert(res.message, "error");
   }
}
// 搜索框选项点击
function searchOptionClick() {
   searchDialog.value?.close(); // 关闭弹框
   searchKey.value = ""; // 清空搜索关键词
   // 因为没有进行数据双向绑定，所以需要手动清空输入框 (双向绑定会使节流不生效)
   let inputEl = window.document.querySelector("#searchDialog input") as HTMLInputElement;
   inputEl.value = "";
   // 清空搜索结果
   searchClassesResult.value = [];
   searchUserResult.value = [];
   searchVocabularyResult.value = [];
}
// 执行搜索
async function searchHandler(e: Event) {
   // 清空搜索结果
   searchClassesResult.value = [];
   searchUserResult.value = [];
   searchVocabularyResult.value = [];
   // 获取搜索关键词
   searchKey.value = (<HTMLInputElement>e.target).value;
   // 如果搜索关键词为空，不进行搜索
   if (!searchKey.value.trim()) return;
   loadingObj.value.isSearch = true;
   // 词集搜索
   if (searchCondition.value.vocabulary) {
      searchVocabularyResult.value = (await VocabularyAPI.searchVocabulary(searchKey.value)).data;
   }
   // 用户搜索
   if (searchCondition.value.user) {
      searchUserResult.value = (await UserAPI.searchUser(searchKey.value)).data;
   }
   // 班级搜索
   if (searchCondition.value.classes) {
      searchClassesResult.value = (await ClassesAPI.searchClasses(searchKey.value)).data;
   }
   loadingObj.value.isSearch = false;
}
// 退出登录
function logout() {
   userStore.delUser();
   router.push("/login");
}
// 主题切换事件
function themeChange(e: Event) {
   centerConsoleShow.value = false; // 关闭中控台
   let checkEl = e.target as HTMLInputElement;
   // console.log(checkEl.checked);
   // localStorage.setItem("isDark", String(checkEl.checked))
   isDark.value = checkEl.checked;
}
// 绘制日历图
function drawChart1() {
   // TODO: temp
   function getVirtualData(year: any) {
      const date = +echarts.time.parse(year + '-01-01');
      const end = +echarts.time.parse(+year + 1 + '-01-01');
      const dayTime = 3600 * 24 * 1000;
      const data = [];
      for (let time = date; time < end; time += dayTime) {
         data.push([
            echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
            Math.floor(Math.random() * 10)
         ]);
      }
      return data;
   }
   // console.log(getVirtualData('2025').length);

   chart1Instance.value = echarts.init(chart1.value);
   chart1Instance.value.setOption({
      tooltip: {},
      visualMap: {
         min: 0,
         max: 10,
         type: 'piecewise',
         orient: 'horizontal',
         left: 'center',
         textStyle: {
            color: isDark.value ? '#d1d5db' : '#000'
         },
         inRange: {
            // color: ['#87CEEB', '#4682B4', '#3B5998', '#2F4F7F', '#1F3A93']
            color: ['white', '#2563eb']
         }
         //  bottom: 0,
         //  show: false
      },
      calendar: {
         top: 25,
         left: 20,
         right: 0,
         cellSize: ['auto', 12],
         range: '2025',
         itemStyle: {
            borderWidth: 1
         },
         yearLabel: { show: false },
         dayLabel: {
            color: isDark.value ? '#d1d5db' : '#000'
         },
         monthLabel: {
            color: isDark.value ? '#d1d5db' : '#000'
         }
      },
      series: {
         type: 'heatmap',
         coordinateSystem: 'calendar',
         data: getVirtualData('2025'),
         // itemStyle: {
         //    borderWidth: 0,
         //    color: (p: any) => {
         //       // console.log(p.data[1]);
         //       let value = p.data[1];
         //       if (value <= 0) {
         //          return '#000000'; // black
         //       } else if (value <= 2) {
         //          return '#87CEEB'; // sky-blue
         //       } else if (value <= 4) {
         //          return '#4682B4'; // darker sky-blue
         //       } else if (value <= 6) {
         //          return '#3B5998'; // even darker sky-blue
         //       } else if (value <= 8) {
         //          return '#2F4F7F'; // very dark sky-blue
         //       } else {
         //          return '#1F3A93'; // darkest sky-blue
         //       }
         //    }
         // }
      }
   });
   // console.log("drawChart1", chart1Instance.value);


   // 监听窗口大小变化（加入300ms节流）
   // window.addEventListener("resize", lodash.debounce(() => {
   //    chart1Instance.value?.resize();
   // }, 300))
}
// 绘制雷达图
function drawChart2() {
   chart2Instance.value = echarts.init(chart2.value);
   chart2Instance.value.setOption({
      radar: {
         // shape: 'circle',
         radius: '60',
         center: ['50%', '68%'],
         indicator: [
            { name: '111', max: 6500 },
            { name: '222', max: 16000 },
            { name: '333', max: 30000 },
         ]
      },
      series: [
         {
            type: 'radar',
            data: [
               {
                  value: [4200, 3000, 20000, 35000, 50000, 18000]
               },
               {
                  value: [5000, 14000, 28000, 26000, 42000, 21000]
               }
            ]
         }
      ]
   });
}
// 图表切换事件
function chartSwitch(index: number) {
   if (index === chartIndex.value) return;
   chartIndex.value = index;
   setTimeout(() => {
      chart1Instance.value?.resize();
      chart2Instance.value?.resize();
   }, 0);
}

// 监听 centerConsoleShow
watch(centerConsoleShow, () => {
   // console.log('centerConsoleShow', centerConsoleShow.value);
   if (centerConsoleShow.value) {
      setTimeout(() => {
         chart1Instance.value?.resize();
         chart2Instance.value?.resize();
      }, 0);
   }
})

// watch(isDark, () => {
//    console.log('isDark watch', isDark.value);
// })
</script>

<style lang="less" scoped>
.list-enter-active {
   transition: all 0.5s ease;
}

.list-leave-active {
   transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
   opacity: 0;
   transform: translateY(100px);
}
</style>