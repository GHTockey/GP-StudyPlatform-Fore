<template>
   <!-- 班级详情页 -->
   <div class="my-type-center">
      <!-- 班级信息 -->
      <div class="h-[280px] gradation md:rounded-2xl sm:rounded-none relative overflow-hidden">
         <!-- 文字信息 -->
         <div class="absolute left-8 h-full w-[50%] flex flex-wrap items-center content-center z-10">
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
               <img :src="classes.creator?.avatar" />
            </div>
            <div class="ml-3 h-full w-[100px] !flex content-center flex-wrap">
               <p class="font-[600] w-full">{{ classes.creator?.username }}</p>
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
      <div role="tablist" class="tabs tabs-boxed w-1/2 transition-all rounded-b-none bg-base-200"
         @click="tabSelectHandler($event)">
         <a role="tab" data-key="1" class="tab transition-all" :class="{ 'tab-active': tabValue == '1' }">成员</a>
         <a role="tab" data-key="2" class="tab transition-all" :class="{ 'tab-active': tabValue == '2' }">词集</a>
      </div>
      <div class="bg-base-200 flex justify-between rounded-lg rounded-tl-none">
         <!-- 成员 -->
         <div class="p-2 w-full" v-show="tabValue == '1'">
            <ul class="">
               <li class="border-[2px] border-base-300 hover:bg-base-300 rounded-lg cursor-pointer mb-1"
                  v-for=" user in classes.userList">
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
         </div>
         <!-- 词集 -->
         <Transition appear>
            <div v-show="tabValue == '2'" class="w-full p-2">
               <ul class="flex flex-wrap justify-between">
                  <li v-for="(voc, index) in vocList" :key="index" 
                        class="flex h-[180px] md:h-[300px] overflow-hidden transition-all duration-300 mb-[10px] bg-base-300 rounded-xl
                        xl:w-[calc((100%-20px)/3)]
                        md:flex-wrap md:w-[calc((100%-10px)/2)] 
                        w-full 
                  ">
                     <!-- 背景图 -->
                     <div class=" w-[45%] md:h-[60%] md:w-full bg-cover bg-center
                        " :style="{ backgroundImage: `url(${voc.cover})` }">
                     </div>
                     <!-- 内容 -->
                     <div class="p-4 w-[65%] md:h-[40%] md:w-full relative flex flex-wrap content-center text-gray-500">
                        <p class="w-full font-[600] text-base-content cursor-pointer hover:text-primary transition-all"
                           @click="$router.push(`/vocabulary/${voc.id}`)">{{ voc.title }}</p>
                        <p class="w-full text-sm mb-4">{{ voc.desc }}</p>
                        <!-- 底部信息 -->
                        <div class="w-full absolute bottom-2 left-0 p-[0_20px] flex justify-between items-end">
                           <!-- 数量/人数 -->
                           <div class="text-sm">
                              <span class="mr-3">
                                 <IconFont type="icon-icon-test" /> {{ voc.count }}
                              </span>
                              <span>
                                 <IconFont type="icon-zongyonghushu" /> {{ voc.userList.length }}
                              </span>
                           </div>
                           <!-- 日期 -->
                           <div class="text-sm">
                              <p class="text-center">
                                 <IconFont type="icon-shijian" /> {{ voc.createTime.slice(0, 10) }}
                              </p>
                           </div>
                        </div>
                        <!-- 头像 -->
                        <div class="absolute  right-5 md:-top-4">
                           <div class="avatar flex items-center rounded-full ring ring-base-200">
                              <div class="w-8 rounded-full">
                                 <img :src="voc.author.avatar" />
                              </div>
                              <!-- <span class="ml-2">34654833</span> -->
                           </div>
                        </div>
                     </div>
                  </li>
               </ul>
            </div>
         </Transition>
      </div>
   </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref } from "vue";
import { RightOutlined } from "@ant-design/icons-vue";
import { ClassesAPI } from "@/api/classes";
import type { Classes } from "@/types/classes";
import { useUserStore } from "@/stores/userStore";
import IconFont from "@/utils/iconFont";
import type { Vocabulary } from "@/types/vocabulary";


const userStore = useUserStore();
// 路由对象
const route = useRoute();
// 选项卡的选择
const tabValue = ref('2');
// 是否是自己的
const isSelf = ref(false);
// 班级数据
const classes = ref<Classes>({
   id: "",
   annc: "",
   creatorUid: "",
   info: "",
   name: "",
   userList: [],
   creator: {
      id: "",
      username: "",
      avatar: "",
      email: "",
      sex: ""
   }
})
// 班级成员的词集列表
const vocList = ref<Vocabulary[]>([]);

// 获取数据
getClasses()
getVocListByClassesUser()

// 选项卡选择 handler
function tabSelectHandler(e: Event) {
   let element = e.target as HTMLElement;
   if (element.tagName == 'A') {
      // console.log(element.getAttribute("data-key"));
      tabValue.value = element.getAttribute("data-key")!;
   }
}
// 获取班级数据
async function getClasses() {
   let result = await ClassesAPI.getClasses(route.params.id as string)
   classes.value = result.data
   if (classes.value.creator.id == userStore.userInfo?.id) isSelf.value = true;
}
// 根据班级ID获取所有成员的词集列表
async function getVocListByClassesUser() {
   if (!vocList.value.length) {
      let result = await ClassesAPI.getVocListByClassesUser(route.params.id as string)
      vocList.value = result.data;
   }
}
</script>

<style lang="less">
.gradation {
   background-image: linear-gradient(to right, #243949 0%, #517fa4 100%);
}


.v-enter-active {
   animation: el-enter 0.3s;
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
</style>