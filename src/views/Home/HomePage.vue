<template>
   <div class="home-container my-type-center px-2">

      <a-carousel effect="fade" autoplay class="transition-all">
         <!-- 主功能模式介绍轮播 -->
         <div v-for="(item, index) in carouselData" :key="index"
            class="manBox h-[250px] transition-all relative rounded-xl overflow-hidden">
            <!-- 背景模糊 -->
            <div class="absolute size-full my-bg-gradient">
               <img class="w-[400px] absolute top-1/2 -translate-y-1/2 -right-10 blur-lg rotate-45" :src="item.img">
            </div>
            <!-- 图标展示 -->
            <div :style="`background-image: url(${getAssetsImg(item.img)});`"
               class="absolute size-[200px] top-1/2 -translate-y-1/2 md:left-10 left-2 bg-cover">
               <!-- <img class="absolute bottom-0 left-1/2 -translate-x-1/2" :src="item.img"> -->
            </div>
            <!-- 文字介绍 -->
            <div
               class="absolute top-1/2 -translate-y-1/2 right-2 md:right-10 w-[180px] transition-all md:w-auto text-base-content/100">
               <h1 class="md:text-2xl text-xl font-bold">{{ item.title }}</h1>
               <p class="md:text-lg text-md">{{ item.desc }}</p>
            </div>
         </div>
      </a-carousel>

      <!-- 快捷入口 -->
      <div class="flex gap-3 my-10 flex-wrap justify-center sm:justify-start">
         <!-- 个人中心 -->
         <button @click="$router.push('/user')" class="btn btn-primary">
            <IconFont type="icon-yonghu" class="text-lg" />
            个人中心
         </button>
         <!-- 班级 -->
         <button @click="myClassBtnHandler" class="btn btn-secondary">
            <IconFont type="icon-banjixinxi" class="text-xl" />
            我的班级
         </button>
         <!-- 在线交流 -->
         <button @click="socketStore.chatWindowShow = true" class="btn btn-success">
            <IconFont type="icon-xiaoxi" class="text-xl" />
            聊天消息
         </button>
         <!-- 后台管理 -->
         <button v-show="!isNormalUser" @click="adminBtnHandler" class="btn btn-warning">
            <IconFont type="icon-houtaiguanli-houtaiguanli" class="text-xl" />
            后台管理
         </button>
      </div>

      <!-- 分割线 -->
      <div class="divider divider-start font-bold">近期学习</div>
      <!-- 近期学习的词集列表 h-[calc((200px*2)+10px)] overflow-y-auto -->
      <div v-if="vocStudyList.length"
         class="recent w-full transition-all h-[calc((200px+0.8rem)*4)] md:h-[calc((200px+0.8rem)*2)] min-[1600px]:h-[calc((200px+0.8rem)*1)]">
         <a-row :gutter="[10, 10]">
            <a-col :xs="24" :md="12" :xl="8" :xxl="6" v-for="(voc, i) in vocStudyList" :key="i">
               <div class="cardT z-10 rounded-lg text-gray-200" @click="$router.push('/vocabulary/' + voc.id)">
                  <p>{{ voc.title }}</p>
                  <p>{{ voc.count }} 个词条</p>
                  <!-- 右下角 时间 -->
                  <span>{{ dayjs(voc.updateTime).format('YYYY-MM-DD') }}</span>
                  <div class="userd">
                     <!-- 头像 -->
                     <div class="avatar">
                        <div class="w-8 rounded-full">
                           <img :src="voc.author?.avatar" />
                        </div>
                     </div>
                     <!-- 用户名 -->
                     <span class="font-bold">{{ voc.author?.username }}</span>
                  </div>
               </div>
               <div class="absolute top-0 right-1 w-[calc(100%-10px)] h-full flex items-center rounded-lg overflow-hidden">
                  <img :src="voc.cover" class="blur-[5px]">
               </div>
            </a-col>
         </a-row>
      </div>
      <div v-else class="text-center text-gray-500 py-5">暂无数据</div>

      <!-- 热门词集和活跃者 -->
      <div class="min-h-[200px] mt-5"> 
         <div class="flex justify-between gap-2">
            <div class="w-1/2">
               <h2 class="font-bold">热门词集</h2>
               <!-- 项 -->
               <div v-if="mostStudyVocList.length" v-for="(voc, index) in mostStudyVocList" :key="index" @click="$router.push('/vocabulary/' + voc.id)"
                  class="my-1 pl-4 bg-base-200 h-[80px] flex flex-wrap content-center rounded-lg relative hover:bg-base-300 cursor-pointer">
                  <!-- 标题 -->
                  <p class="font-bold w-full">{{ voc.title }}</p>
                  <!-- 头像 -->
                  <div class="flex gap-2 mt-2 items-center">
                     <div class="avatar">
                        <div class="size-5 rounded-full">
                           <img :src="voc.author?.avatar" />
                        </div>
                     </div>
                     <span class="text-sm">{{ voc.author?.username }}</span>
                  </div>
                  <!-- 数量 -->
                  <div class="absolute top-1/2 -translate-y-1/2 right-5 text-center">
                     <p class="text-2xl">{{ voc.stuNum }}</p>
                     <p class="text-sm">用户学习</p>
                  </div>
               </div>
               <div v-else class="text-center text-gray-500 py-10">暂无数据</div>
            </div>
            <div class="w-1/2">
               <h2 class="font-bold">学霸榜</h2>
               <!-- 项 -->
               <div v-if="mostStudyUserList.length" v-for="(user, i) in mostStudyUserList" :key="i" @click="$router.push('/user/' + user.id)"
                  class="bg-base-200 my-1 rounded-lg h-[120px] sm:h-[80px] relative hover:bg-base-300 cursor-pointer pb-3 sm:pb-0">
                  <div class="flex items-end sm:items-center h-full pl-3 gap-3">
                     <!-- 头像 -->
                     <div class="avatar">
                        <div class="w-12 rounded-full">
                           <img :src="user.avatar" />
                        </div>
                     </div>
                     <div>
                        <p class="font-bold">{{ user.username }}</p>
                        <p class="text-sm">学习了 {{ user.studyTotal }} 次词集</p>
                     </div>
                  </div>
                  <div class="absolute top-3 left-1/2 -translate-x-1/2 sm:-translate-x-0 sm:left-auto sm:top-1/2 sm:-translate-y-1/2 sm:right-5">
                     <div>No.<span class="font-bold text-3xl">{{ i + 1 }}</span> </div>
                  </div>
               </div>
               <div v-else class="text-center text-gray-500 py-10">暂无数据</div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { useSocketStore } from "@/stores/socketStore";
import IconFont from "@/utils/iconFont";
import type { Vocabulary } from "@/types/vocabulary";
import { ref } from "vue";
import { VocabularyAPI } from "@/api/vocabulary";
import { message } from "ant-design-vue";
import { UserAPI } from "@/api/user";
import type { User } from "@/types/user";
import { useRoute } from "vue-router";
import router from "@/router";
import { MyUtils } from "@/utils";
import dayjs from "dayjs";

const route = useRoute();
const userStore = useUserStore();
const socketStore = useSocketStore();

// 轮播数据
const carouselData = [
   {
      title: "实时互动交流",
      desc: "随时发起讨论，快速解决学习难题",
      img: "online2.webp",
   },
   {
      title: "创作共享词集",
      desc: "专业编辑工具，打造高质量学习资源",
      img: "book.webp",
   },
   {
      title: "智能学习模式",
      desc: "科学记忆算法，个性化提升学习效率",
      img: "study.webp",
   }
];
// 用户学习的词集列表
const vocStudyList = ref<Vocabulary[]>([]);
// 学习量前5的词集列表
const mostStudyVocList = ref<Vocabulary[]>([]);
// 学习量前5的用户列表
const mostStudyUserList = ref<User[]>([]);
// 是否是普通用户 (不是管理员和老师)
const isNormalUser = ref<boolean>(true);

// 第三方登录(且已绑定)
if (route.query.token) {
   getUserInfoByToken()
}
// 判断是否登录
if (userStore.userInfo && userStore.userInfo.id) {
   // 获取用户学习的词集列表
   getUserRelevanceVocListByUid();
   // 获取学习数量最多的词集列表
   getMostStudyVocList();
   // 获取学习数前5的用户列表
   getMostStudyUserList();
   // 判断是否是普通用户
   isNormalUser.value = userStore.userInfo.roleList?.findIndex((item) => item.id == 1 || item.id == 2) == -1;
}

// 后台管理按钮点击事件
function adminBtnHandler() {
   // MyUtils.alert("暂未开放", "warning")
   window.open("http://gp-admin.tockey.cn/")
}

// 我的班级按钮点击事件
function myClassBtnHandler(){
   // 检查是否加入了班级
   if(userStore.userInfo?.classes){
      // 跳转到班级页面
      router.push('/classes/' + userStore.userInfo?.classes.id)
   } else {
      MyUtils.alert("您还没有加入班级", "warning")
   }

}

// 获取图片路径
function getAssetsImg(name: string) {
   let data = new URL(`../../assets/img/${name}`, import.meta.url).href
   console.log(data)
   return data;
}

// 通过 token 获取用户信息
async function getUserInfoByToken() {
   let result = await UserAPI.getUserInfoByToken(route.query.token as string);
   if (result.code == 20000) {
      userStore.setUserInfo(result.data, route.query.token as string);
      // console.log("用户信息", result.data);
      // 重新加载页面
      location.href = "/";
   }
}

// 获取用户学习的词集列表
async function getUserRelevanceVocListByUid() {
   let result = await VocabularyAPI.getUserRelevanceVocListByUid(userStore.userInfo?.id!);
   if (result.code == 20000) {
      vocStudyList.value = result.data;
      // 最多显示4个词集
      if (vocStudyList.value.length > 4) {
         vocStudyList.value = vocStudyList.value.slice(0, 4);
      }
      // console.log("vocStudyList", vocStudyList.value);

   } else {
      message.error("获取用户学习的词集列表失败");
   }
}
// 获取学习数量最多的词集列表
async function getMostStudyVocList() {
   let result = await VocabularyAPI.getMostStudyVocList();
   if (result.code == 20000) {
      // mostStudyVocList.value = result.data;
      // 最多显示5个词集
      if (result.data.length > 5) {
         mostStudyVocList.value = result.data.slice(0, 5);
      } else {
         mostStudyVocList.value = result.data;
      }
   } else {
      message.error(result.message);
   }
}
// 获取学习数前5的用户列表
async function getMostStudyUserList() {
   let result = await UserAPI.getActiveUserList();
   if (result.code == 20000) {
      userStore
      mostStudyUserList.value = result.data;
   } else {
      message.error(result.message);
   }
}
</script>

<style lang="less" scoped>
.home-container {
   .recent {
      padding: 10px 0;
      // height: calc((200px * 2) + 30px);
      // background-color: antiquewhite;
      // overflow: hidden;


      >div {
         height: 200px;

         >div {
            height: 100%;
            transition: all 0.3s ease 0s;

            // border: 1px solid red;
            >.cardT {
               transition: all 0.3s ease 0s;
               background-image: linear-gradient(120deg, #555555 20%, #89f6fe00 120%);
               height: 100%;
               position: relative;
               // 悬浮小手
               cursor: pointer;

               // 悬浮阴影
               &:hover {
                  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
               }

               >p {
                  position: absolute;

                  // 标题
                  &:nth-child(1) {
                     top: 10px;
                     left: 10px;
                     font-size: 20px;
                     font-weight: 600;
                  }

                  // 词条数量
                  &:nth-child(2) {
                     top: 40px;
                     left: 10px;
                     font-size: 14px;
                  }
               }

               // 日期
               >span {
                  position: absolute;
                  bottom: 10px;
                  right: 10px;
                  font-size: 14px;
               }

               // 头像和昵称
               >.userd {
                  position: absolute;
                  bottom: 10px;
                  left: 10px;
                  font-size: 14px;
                  display: flex;
                  align-items: center;

                  >span:nth-child(2) {
                     margin-left: 10px;
                  }
               }
            }
         }
      }
   }
}

// 背景渐变
.my-bg-gradient {
   background-image: linear-gradient(120deg, oklch(var(--b3)) 0%, oklch(var(--p)) 100%);
}
</style>