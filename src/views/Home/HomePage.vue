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
      <template v-if="userStore.userInfo">
         <div class="flex items-center gap-3 my-8">
            <IconFont type="icon-xuexi" class="text-xl text-base-content" />
            <h2 class="text-xl font-bold text-base-content">近期学习</h2>
         </div>
         
         <!-- 近期学习的词集列表 -->
         <div v-if="vocStudyList.length" class="recent-study-section mb-8">
            <a-row :gutter="[16, 16]">
               <a-col :xs="24" :md="12" :xl="8" :xxl="6" v-for="(voc, i) in vocStudyList" :key="i">
                  <div class="group relative h-[200px] rounded-xl overflow-hidden cursor-pointer border border-transparent hover:border-base-300 dark:hover:border-base-600 transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl" 
                       @click="$router.push('/vocabulary/' + voc.id)">
                     
                     <!-- 背景图片 -->
                     <div class="absolute inset-0">
                        <img :src="voc.cover" 
                             class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-115" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/60 group-hover:via-black/30 group-hover:to-black/10 transition-all duration-300"></div>
                     </div>
                     
                     <!-- 内容层 -->
                     <div class="relative z-10 h-full p-4 flex flex-col justify-between text-white">
                        <!-- 顶部信息 -->
                        <div>
                           <div class="flex items-center justify-between mb-2">
                              <!-- 学习进度标识 -->
                              <div class="bg-white/20 backdrop-blur-sm border border-white/30 px-2 py-1 rounded-full group-hover:bg-white/30 group-hover:border-white/50 transition-all duration-300">
                                 <span class="text-white/90 group-hover:text-white text-xs font-medium transition-colors duration-300">最近学习</span>
                              </div>
                              
                              <!-- 词条数量 -->
                              <div class="bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full group-hover:bg-black/40 transition-all duration-300">
                                 <span class="text-white/90 group-hover:text-white text-xs transition-colors duration-300">{{ voc.count }} 词条</span>
                              </div>
                           </div>
                           
                           <!-- 标题 -->
                           <h3 class="text-lg font-bold leading-tight mb-1 group-hover:text-white group-hover:scale-[1.02] transition-all duration-300 line-clamp-2">
                              {{ voc.title }}
                           </h3>
                        </div>
                        
                        <!-- 底部信息 -->
                        <div>
                           <!-- 作者信息 -->
                           <div class="flex items-center justify-between">
                              <div class="flex items-center gap-2">
                                 <div class="avatar">
                                    <div class="w-8 h-8 rounded-full border-2 border-white/30 group-hover:border-white/50 overflow-hidden transition-all duration-300">
                                       <img :src="voc.author?.avatar" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                 </div>
                                 <span class="text-sm font-medium text-white/90 group-hover:text-white transition-colors duration-300">
                                    {{ voc.author?.username }}
                                 </span>
                              </div>
                              
                              <!-- 学习时间 -->
                              <div class="text-right">
                                 <div class="text-xs text-white/70 group-hover:text-white/90 transition-colors duration-300">
                                    {{ dayjs(voc.updateTime).format('MM-DD') }}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     <!-- 悬停装饰效果 -->
                     <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-150"></div>
                     
                     <!-- 边框光晕效果 -->
                     <div class="absolute inset-0 rounded-xl border-2 border-white/0 group-hover:border-white/20 transition-all duration-300"></div>
                  </div>
               </a-col>
            </a-row>
         </div>
         
         <!-- 空状态 -->
         <div v-else class="text-center py-16 bg-gradient-to-br from-base-200 to-base-100 rounded-xl border border-base-300">
            <div class="flex flex-col items-center gap-4">
               <div class="w-16 h-16 bg-gradient-to-br from-base-300 to-base-400 rounded-full flex items-center justify-center">
                  <IconFont type="icon-xuexi" class="text-2xl text-base-content" />
               </div>
               <div>
                  <h3 class="text-lg font-semibold text-base-content mb-1">还没有学习记录</h3>
                  <p class="text-sm text-base-content/60">开始学习第一个词集吧！</p>
               </div>
            </div>
         </div>
      </template>

      <!-- 热门词集和活跃者 -->
      <div class="min-h-[200px] mt-8">
         <div class="flex flex-col lg:flex-row justify-between gap-6">
            <!-- 热门词集 -->
            <div class="w-full lg:w-1/2">
               <div class="flex items-center gap-2 mb-4">
                  <IconFont type="icon-icon_huore" class="text-xl text-blue-500" />
                  <h2
                     class="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                     热门词集
                  </h2>
               </div>

               <div v-if="mostStudyVocList.length" class="space-y-3">
                  <div v-for="(voc, index) in mostStudyVocList" :key="index"
                     @click="$router.push('/vocabulary/' + voc.id)"
                     class="group relative bg-gradient-to-r from-base-200 to-base-100 hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 p-4 rounded-xl border border-base-300 hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] overflow-hidden">

                     <!-- 排名标识 -->
                     <!-- <div class="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        {{ index + 1 }}
                     </div> -->

                     <!-- 热门标识 (前三名) -->
                     <!-- <div v-if="index < 3" class="absolute top-2 right-2">
                        <div class="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                           <IconFont type="icon-icon_huore" class="text-xs" />
                           <span v-if="index === 0">🔥热</span>
                           <span v-else-if="index === 1">💎优</span>
                           <span v-else>⭐赞</span>
                        </div>
                     </div> -->

                     <div class="flex items-center justify-between">
                        
                     <!-- 排名数字 -->
                     <div class="flex-shrink-0 mr-3">
                        <div
                           class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                           {{ index + 1 }}
                        </div>
                     </div>

                        <div class="flex-1 min-w-0">
                           <!-- 标题 -->
                           <h3
                              class="font-bold text-base text-base-content group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 truncate mb-2">
                              {{ voc.title }}
                           </h3>

                           <!-- 作者信息 -->
                           <div class="flex items-center gap-2">
                              <div class="avatar">
                                 <div class="w-6 h-6 rounded-full border-2 border-blue-200 dark:border-blue-800">
                                    <img :src="voc.author?.avatar" class="rounded-full" />
                                 </div>
                              </div>
                              <span
                                 class="text-sm text-base-content/70 group-hover:text-blue-500 transition-colors duration-300">
                                 {{ voc.author?.username }}
                              </span>
                           </div>
                        </div>

                        <!-- 学习数据 -->
                        <div class="text-right ml-4">
                           <div class="bg-gradient-to-r text-center from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                              <div class="text-2xl font-bold">{{ voc.stuNum }}</div>
                              <div class="text-xs text-base-content/60">人学习</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div v-else class="text-center text-gray-500 py-12 bg-base-200 rounded-xl">
                  <IconFont type="icon-zanwushuju" class="text-4xl mb-2" />
                  <p>暂无热门词集</p>
               </div>
            </div>

            <!-- 学霸榜 -->
            <div class="w-full lg:w-1/2">
               <div class="flex items-center gap-2 mb-4">
                  <IconFont type="icon-paihangbang" class="text-xl text-blue-500" />
                  <h2
                     class="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                     学霸榜</h2>
               </div>

               <div v-if="mostStudyUserList.length" class="space-y-3">
                  <div v-for="(user, i) in mostStudyUserList" :key="i" @click="$router.push('/user/' + user.id)"
                     class="group relative bg-gradient-to-r from-base-200 to-base-100 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 p-4 rounded-xl border border-base-300 hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] overflow-hidden">

                     <!-- 排名背景效果 -->
                     <div class="absolute inset-0 opacity-5">
                        <div
                           class="absolute right-0 top-0 text-8xl font-black text-blue-500 transform rotate-12 translate-x-4 -translate-y-4">
                           {{ i + 1 }}
                        </div>
                     </div>

                     <!-- 排名奖牌 (前三名) -->
                     <!-- <div v-if="i < 3" class="absolute -top-1 -right-1">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center text-lg">
                           <span v-if="i === 0">🥇</span>
                           <span v-else-if="i === 1">🥈</span>
                           <span v-else>🥉</span>
                        </div>
                     </div> -->

                     <div class="relative flex items-center justify-between">
                        <div class="flex items-center gap-3 flex-1 min-w-0">
                           <!-- 排名数字
                           <div class="flex-shrink-0">
                              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                 {{ i + 1 }}
                              </div>
                           </div> -->

                           <!-- 头像 -->
                           <div class="avatar flex-shrink-0">
                              <div
                                 class="w-12 h-12 rounded-full border-3 border-blue-200 dark:border-blue-800 group-hover:border-blue-400 transition-colors duration-300">
                                 <img :src="user.avatar" class="rounded-full" />
                              </div>
                           </div>

                           <!-- 用户信息 -->
                           <div class="flex-1 min-w-0">
                              <h3
                                 class="font-bold text-base text-base-content group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 truncate">
                                 {{ user.username }}
                              </h3>
                              <div class="flex items-center gap-1 text-sm text-base-content/70">
                                 <IconFont type="icon-xuexi" class="text-xs" />
                                 <span>学习了 {{ user.studyTotal }} 次</span>
                              </div>
                           </div>
                        </div>

                        <!-- 学霸标识 (前三名) -->
                        <div v-if="i < 3" class="flex-shrink-0">
                           <div
                              class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              <span v-if="i === 0">🥇优秀</span>
                              <span v-else-if="i === 1">🥈杰出</span>
                              <span v-else>🥉出色</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div v-else class="text-center text-gray-500 py-12 bg-base-200 rounded-xl">
                  <IconFont type="icon-zanwushuju" class="text-4xl mb-2" />
                  <p>暂无活跃用户</p>
               </div>
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
   // getMostStudyVocList(); // 不登录也能看到
   // 获取学习数前5的用户列表
   // getMostStudyUserList(); // 不登录也能看到
   // 判断是否是普通用户
   isNormalUser.value = userStore.userInfo.roleList?.findIndex((item) => item.id == 1 || item.id == 2) == -1;
} else {
   console.log("未登录");
}
// 获取学习数量最多的词集列表
getMostStudyVocList();
// 获取学习数前5的用户列表
getMostStudyUserList();

// 后台管理按钮点击事件
function adminBtnHandler() {
   // MyUtils.alert("暂未开放", "warning")
   window.open("http://gp-admin.tockey.cn/")
}

// 我的班级按钮点击事件
function myClassBtnHandler() {
   // 检查是否加入了班级
   if (userStore.userInfo?.classes) {
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
   // 近期学习区域
   .recent-study-section {
      .line-clamp-2 {
         display: -webkit-box;
         -webkit-line-clamp: 2;
         -webkit-box-orient: vertical;
         overflow: hidden;
      }
   }
}

// 背景渐变
.my-bg-gradient {
   background-image: linear-gradient(120deg, oklch(var(--b3)) 0%, oklch(var(--p)) 100%);
}
</style>