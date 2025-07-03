<template>
   <div class="userinfo-container my-type-center">
      <!-- 头像名称box -->
      <div class="my-transition-all h-[400px] sm:h-[300px] flex justify-between items-center sm:pl-10 relative mb-3">
         <!-- 文字信息 -->
         <div class="text-gray-500
          absolute left-1/2 -translate-x-1/2 text-center 
          w-full sm:w-[500px] top-48 sm:left-5 sm:text-left sm:transform-none
          sm:top-20">
            <!-- 用户名 -->
            <p class="font-bold text-4xl text-base-content">{{ currentUserInfo?.username }}</p>
            <!-- ID -->
            <p class="font-semibold text-sm -mt-1">#{{ currentUserInfo?.id }}</p>
            <!-- 邮箱 -->
            <p class="m-[8px_0]">
               <MailOutlined class="mr-[5px]" /> {{ currentUserInfo?.email }}
            </p>
            <!-- 注册时间 -->
            <p class="m-[8px_0]">
               <FieldTimeOutlined class="mr-[8px]" />2022年10月1日加入 todo
            </p>
            <!-- 班级 -->
            <p class="hover:text-blue-500 cursor-pointer my-2 inline"
               @click="currentUserInfo?.classes ? $router.push('/classes/' + currentUserInfo.classes.id) : null">
               <IconFont type="icon-banjixinxi" />&nbsp; {{ currentUserInfo?.classes?.name || '未加入' }}
            </p>
         </div>
         <!-- 头像 -->
         <div class="size-[120px] sm:size-[200px] absolute top-10 right-1/2 translate-x-1/2 
         sm:right-10 sm:transform-none">
            <img :src="currentUserInfo?.avatar" alt="头像模糊" class=" size-full blur-[30px] my-user-avatar">
            <!-- <img :src="userInfo?.avatar" alt="头像" class="size-[180px] absolute my-user-avatar ring"
               :class="(userInfo?.sex == '1' ? 'ring-blue-500' : (userInfo?.sex == '0' ? 'ring-pink-500' : 'ring-white'))"> -->
            <img :src="currentUserInfo?.avatar" alt="头像" class="size-full absolute my-user-avatar ring"
               :class="'ring-white'">
         </div>
         <!-- 按钮 -->
         <div class="absolute -bottom-3 right-1/2 translate-x-1/2 sm:left-5 sm:transform-none">
            <a-space>
               <template v-if="isSelf">
                  <button class="btn btn-info text-white btn-sm" @click="openEditModal">
                     <IconFont type="icon-xiugai" />修改信息
                  </button>
               </template>

               <template v-else>
                  <button class="btn btn-success text-white btn-sm">私信</button>
               </template>
            </a-space>
         </div>
      </div>

      <!-- 选项切换 -->
      <div class="flex justify-center sm:justify-end">
         <div role="tablist" class="tabs tabs-boxed mt-10 w-[350px] font-bold">
            <a v-for="(item, i) in  ['发布词集', '学习清单', '动态信息']" @click="changeTab(i + 1)" :key="i" role="tab"
               class="tab transition-all" :class="tab == i + 1 ? 'tab-active' : ''">

               <template v-if="i == 0">
                  <IconFont type="icon-xuexiku" />
               </template>

               <template v-if="i == 1">
                  <IconFont type="icon-qingdanguanli" />
               </template>

               <template v-if="i == 2">
                  <IconFont type="icon-xingqiudiqiu" />
               </template>
               <span class="ml-1">{{ item }}</span>
            </a>
         </div>
      </div>

      <!-- 发布的词集 -->
      <div v-show="tab == 1" class="my-transition-all p-4 md:p-6">
         <div class="divider divider-start font-semibold text-xl mb-6">
            <IconFont type="icon-xuexiku" />
            发布的词集
         </div>
         
         <!-- 骨架屏 -->
         <div v-if="vocabularyListLoading" class="space-y-4">
            <div v-for="item in 3" :key="item" 
               class="skeleton bg-base-200 w-full h-[140px] rounded-xl"></div>
         </div>
         
         <!-- 词集列表 -->
         <div v-else-if="vocabularyList?.length" class="space-y-3">
            <div v-for="item in vocabularyList" :key="item.id" 
               @click="$router.push(`/vocabulary/${item.id}`)" 
               class="group cursor-pointer rounded-xl p-4 
                      relative flex items-center gap-4 transition-all duration-300 
                      hover:shadow-lg hover:scale-[1.02] border border-transparent 
                      bg-gradient-to-r from-base-200 via-base-100 to-base-200
                      hover:from-primary/5 hover:via-primary/10 hover:to-primary/5
                      hover:border-primary/20 overflow-hidden">
               
               <!-- 背景装饰图片 -->
               <div class="absolute right-0 top-0 w-48 h-48 opacity-10 group-hover:opacity-20 
                          transition-all duration-500 transform rotate-12 translate-x-8 -translate-y-8">
                  <img :src="item.cover" alt="背景装饰" 
                     class="w-full h-full object-cover rounded-lg blur-sm" />
               </div>
               
               <!-- 封面 -->
               <div class="relative flex-shrink-0">
                  <img :src="item.cover" alt="封面" 
                     class="w-16 h-16 sm:w-36 sm:h-20 rounded-lg object-cover 
                            shadow-md group-hover:shadow-lg transition-shadow duration-300" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
               </div>
               
               <!-- 内容区域 -->
               <div class="flex-1 min-w-0">
                  <!-- 标题 -->
                  <h3 class="text-base font-semibold text-base-content mb-1 
                             transition-colors duration-300 
                             truncate">{{ item.title }}</h3>
                  
                  <!-- 描述 -->
                  <p class="text-xs text-base-content/70 mb-2 line-clamp-1 
                           group-hover:text-base-content/80 transition-colors duration-300">
                     {{ item.desc || '暂无描述' }}
                  </p>
                  
                  <!-- 统计信息 -->
                  <div class="flex items-center gap-3 text-xs text-base-content/60">
                     <div class="flex items-center gap-1">
                        <IconFont type="icon-icon-test" />
                        <span>{{ item.count }} 个词条</span>
                     </div>
                     <div class="flex items-center gap-1">
                        <IconFont type="icon-shijian" />
                        <span>{{ item.createTime.slice(0, 10) }}</span>
                     </div>
                  </div>
               </div>
               
               <!-- 操作按钮 -->
               <div v-if="isSelf" class="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 
                                      transition-opacity duration-300 relative z-10">
                  <!-- 编辑 -->
                  <button class="btn btn-xs btn-info btn-outline" 
                     @click.stop="$router.push(`/vocabulary/edit/${item.id}`)"
                     title="编辑词集">
                     <IconFont type="icon-xiugai" />
                  </button>
                  
                  <!-- 删除 -->
                  <button class="btn btn-xs btn-error btn-outline" 
                     @click.stop="delVocabulary(item.id)"
                     title="删除词集">
                     <IconFont type="icon-shanchu" />
                  </button>
               </div>
               
               <!-- 悬停指示器 -->
               <div class="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300 relative z-10">
                  <IconFont type="icon-arrow-right" class="text-primary" />
               </div>
            </div>
         </div>
         
         <!-- 空数据状态 -->
         <div v-else class="flex flex-col items-center justify-center py-16">
            <a-empty class="text-base-content/40" 
               description="还没有发布任何词集">
               <template #image>
                  <div class="w-24 h-24 bg-base-300 rounded-full flex items-center justify-center mb-4">
                     <IconFont type="icon-xuexiku" class="text-4xl text-base-content/30" />
                  </div>
               </template>
            </a-empty>
            <button v-if="isSelf" class="btn btn-primary mt-4" @click="$router.push('/vocabulary/create')">
               <IconFont type="icon-add" class="mr-2" />
               创建第一个词集
            </button>
         </div>
      </div>

      <!-- 学习的词集 -->
      <div v-show="tab == 2" class="my-transition-all p-2 md:p-0">
         <div class="divider divider-start font-semibold text-lg">学习清单</div>
         <!-- 空数据状态 -->
         <a-empty v-if="userRelevanceVocList.length == 0 && userRelevanceVocListLoading == false"
            class="mt-20 text-gray-400" />
         <!-- 骨架屏 -->
         <div v-else-if="userRelevanceVocListLoading" class="skeleton bg-base-200 w-full h-[100px] mb-2"></div>
         <!-- 词集列表 -->
         <div @click="$router.push(`/vocabulary/${item.id}`)" v-for="(item, index) in userRelevanceVocList" :key="index"
            class="shadow bg-base-200 hover:bg-base-300 cursor-pointer mb-2 rounded-md py-5 px-6 relative">
            <div>
               <p class="font-bold text-lg mb-2">{{ item.title }}</p>
            </div>
            <div class="flex gap-5 items-center">
               <!-- 标题 -->
               <p class="text-sm">
                  <IconFont type="icon-icon-test" /> {{ item.count }}个词条
               </p>
               <!-- 作者与数量 -->
               <div class="avatar placeholder flex items-center">
                  <div class="bg-neutral text-neutral-content rounded-full size-5 mr-2">
                     <img :src="item.author?.avatar" />
                  </div>
                  <span>{{ item.author?.username }}</span>
               </div>
               <!-- 操作 -->
               <div v-if="isSelf" class="absolute right-5 top-1/2 -translate-y-1/2">
                  <!-- 取消 -->
                  <button class="btn btn-sm w-full btn-warning"
                     @click.stop="MyUtils.modal('移出清单', `将词集 【${item.title}】 移除我的学习清单？`, () => cancelLearnVocabulary(item.id))">
                     <IconFont type="icon-refuse" />
                  </button>
               </div>
            </div>
         </div>
      </div>

      <!-- 动态 -->
      <div v-show="tab == 3" class="my-transition-all p-4 md:p-6">
         <div class="divider divider-start font-semibold text-xl mb-6">
            <IconFont type="icon-xingqiudiqiu" class="mr-2" />
            动态
         </div>
         
         <!-- 动态列表 -->
         <div class="space-y-4">
            <!-- 动态项1：创建词集 -->
            <div class="bg-base-200 rounded-xl p-4 hover:bg-base-300 transition-all duration-300 
                        border border-transparent hover:border-primary/20">
               <div class="flex items-start gap-3">
                  <!-- 头像 -->
                  <div class="flex-shrink-0">
                     <img :src="currentUserInfo?.avatar" alt="头像" 
                        class="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20" />
                  </div>
                  
                  <!-- 内容 -->
                  <div class="flex-1 min-w-0">
                     <div class="flex items-center gap-2 mb-2">
                        <span class="font-semibold text-base-content">{{ currentUserInfo?.username }}</span>
                        <span class="text-xs text-base-content/60">创建了词集</span>
                        <span class="text-sm font-medium text-primary">《英语四级核心词汇》</span>
                     </div>
                     
                     <p class="text-sm text-base-content/70 mb-3">
                        整理了英语四级考试中最常出现的核心词汇，包含详细的释义和例句，帮助大家更好地备考。
                     </p>
                     
                     <!-- 词集预览 -->
                     <div class="bg-base-100 rounded-lg p-3 mb-3">
                        <div class="flex items-center gap-3">
                           <img src="https://picsum.photos/60/40" alt="词集封面" 
                              class="w-15 h-10 rounded object-cover" />
                           <div class="flex-1">
                              <p class="text-sm font-medium">英语四级核心词汇</p>
                              <p class="text-xs text-base-content/60">500个词条 · 2小时前</p>
                           </div>
                        </div>
                     </div>
                     
                     <div class="flex items-center gap-4 text-xs text-base-content/50">
                        <span>2小时前</span>
                        <div class="flex items-center gap-1">
                           <IconFont type="icon-like" class="text-primary" />
                           <span>12</span>
                        </div>
                        <div class="flex items-center gap-1">
                           <IconFont type="icon-comment" class="text-primary" />
                           <span>3</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            
            <!-- 动态项2：学习进度 -->
            <div class="bg-base-200 rounded-xl p-4 hover:bg-base-300 transition-all duration-300 
                        border border-transparent hover:border-primary/20">
               <div class="flex items-start gap-3">
                  <!-- 头像 -->
                  <div class="flex-shrink-0">
                     <img :src="currentUserInfo?.avatar" alt="头像" 
                        class="w-12 h-12 rounded-full object-cover ring-2 ring-success/20" />
                  </div>
                  
                  <!-- 内容 -->
                  <div class="flex-1 min-w-0">
                     <div class="flex items-center gap-2 mb-2">
                        <span class="font-semibold text-base-content">{{ currentUserInfo?.username }}</span>
                        <span class="text-xs text-base-content/60">完成了学习</span>
                        <span class="text-sm font-medium text-success">《日语N5基础词汇》</span>
                     </div>
                     
                     <p class="text-sm text-base-content/70 mb-3">
                        今天完成了日语N5基础词汇的学习，掌握了300个基础词汇，感觉收获满满！
                     </p>
                     
                     <!-- 学习进度 -->
                     <div class="bg-base-100 rounded-lg p-3 mb-3">
                        <div class="flex items-center justify-between mb-2">
                           <span class="text-sm font-medium">学习进度</span>
                           <span class="text-xs text-success">100%</span>
                        </div>
                        <div class="w-full bg-base-300 rounded-full h-2">
                           <div class="bg-success h-2 rounded-full transition-all duration-500" style="width: 100%"></div>
                        </div>
                        <div class="flex justify-between text-xs text-base-content/60 mt-1">
                           <span>300/300 词条</span>
                           <span>连续学习 7 天</span>
                        </div>
                     </div>
                     
                     <div class="flex items-center gap-4 text-xs text-base-content/50">
                        <span>5小时前</span>
                        <div class="flex items-center gap-1">
                           <IconFont type="icon-like" class="text-primary" />
                           <span>8</span>
                        </div>
                        <div class="flex items-center gap-1">
                           <IconFont type="icon-comment" class="text-primary" />
                           <span>1</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            
            <!-- 动态项3：分享词集 -->
            <div class="bg-base-200 rounded-xl p-4 hover:bg-base-300 transition-all duration-300 
                        border border-transparent hover:border-primary/20">
               <div class="flex items-start gap-3">
                  <!-- 头像 -->
                  <div class="flex-shrink-0">
                     <img :src="currentUserInfo?.avatar" alt="头像" 
                        class="w-12 h-12 rounded-full object-cover ring-2 ring-warning/20" />
                  </div>
                  
                  <!-- 内容 -->
                  <div class="flex-1 min-w-0">
                     <div class="flex items-center gap-2 mb-2">
                        <span class="font-semibold text-base-content">{{ currentUserInfo?.username }}</span>
                        <span class="text-xs text-base-content/60">分享了词集</span>
                        <span class="text-sm font-medium text-warning">《编程术语大全》</span>
                     </div>
                     
                     <p class="text-sm text-base-content/70 mb-3">
                        整理了一份编程相关的专业术语词汇表，包含前端、后端、数据库等各个领域的常用术语，希望对大家有帮助！
                     </p>
                     
                     <!-- 分享统计 -->
                     <div class="bg-base-100 rounded-lg p-3 mb-3">
                        <div class="grid grid-cols-3 gap-4 text-center">
                           <div>
                              <p class="text-lg font-bold text-primary">1.2k</p>
                              <p class="text-xs text-base-content/60">学习人数</p>
                           </div>
                           <div>
                              <p class="text-lg font-bold text-success">4.8</p>
                              <p class="text-xs text-base-content/60">评分</p>
                           </div>
                           <div>
                              <p class="text-lg font-bold text-warning">156</p>
                              <p class="text-xs text-base-content/60">收藏数</p>
                           </div>
                        </div>
                     </div>
                     
                     <div class="flex items-center gap-4 text-xs text-base-content/50">
                        <span>1天前</span>
                        <div class="flex items-center gap-1">
                           <IconFont type="icon-like" class="text-primary" />
                           <span>25</span>
                        </div>
                        <div class="flex items-center gap-1">
                           <IconFont type="icon-comment" class="text-primary" />
                           <span>7</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            
            <!-- 动态项4：获得成就 -->
            <div class="bg-base-200 rounded-xl p-4 hover:bg-base-300 transition-all duration-300 
                        border border-transparent hover:border-primary/20">
               <div class="flex items-start gap-3">
                  <!-- 头像 -->
                  <div class="flex-shrink-0 relative">
                     <img :src="currentUserInfo?.avatar" alt="头像" 
                        class="w-12 h-12 rounded-full object-cover ring-2 ring-accent" />
                     <div class="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <IconFont type="icon-trophy" class="text-accent-content text-xs" />
                     </div>
                  </div>
                  
                  <!-- 内容 -->
                  <div class="flex-1 min-w-0">
                     <div class="flex items-center gap-2 mb-2">
                        <span class="font-semibold text-base-content">{{ currentUserInfo?.username }}</span>
                        <span class="text-xs text-base-content/60">获得了成就</span>
                        <span class="text-sm font-medium text-accent">词汇达人</span>
                     </div>
                     
                     <p class="text-sm text-base-content/70 mb-3">
                        恭喜！你已经学习了超过1000个词汇，获得了"词汇达人"成就，继续加油！
                     </p>
                     
                     <!-- 成就徽章 -->
                     <div class="bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg p-3 mb-3 
                                border border-accent/20">
                        <div class="flex items-center gap-3">
                           <div class="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                              <IconFont type="icon-trophy" class="text-accent-content text-xl" />
                           </div>
                           <div>
                              <p class="text-sm font-bold text-accent">词汇达人</p>
                              <p class="text-xs text-base-content/60">学习1000+词汇解锁</p>
                           </div>
                        </div>
                     </div>
                     
                     <div class="flex items-center gap-4 text-xs text-base-content/50">
                        <span>2天前</span>
                        <div class="flex items-center gap-1">
                           <IconFont type="icon-like" class="text-primary" />
                           <span>18</span>
                        </div>
                        <div class="flex items-center gap-1">
                           <IconFont type="icon-comment" class="text-primary" />
                           <span>5</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>

   <!-- 编辑 -->
   <dialog id="editModal" class="modal">
      <div class="modal-box">
         <h3 class="font-bold text-lg mb-5">修改信息</h3>
         <a-form :model="editUserInfo" ref="editUserInfoFormEl">
            <!-- 头像 -->
            <a-form-item name="avatar" :rules="{ required: true, message: '请选择头像' }">
               <div class="flex justify-center">
                  <label class="bg-gray-500 relative rounded-full cursor-pointer">
                     <img :src="editUserInfo.avatar" alt="头像"
                        class="w-[100px] h-[100px] rounded-full border-[5px] border-base-100 shadow">
                     <div class="absolute top-0 left-0 size-full rounded-full transition-all
                     border-[3px] border-dashed border-gray-500 opacity-0 hover:opacity-80
                     bg-gray-400 flex justify-center items-center">
                        <span class="text-base">选择头像</span>
                     </div>
                     <input type="file" class="size-0" @change="handleAvatarChange($event)" />
                     <div v-if="progress > 0 && progress < 100" :style="`--value:${progress};`"
                        class="radial-progress bg-primary text-primary-content border-4 border-primary absolute size-full top-0 left-0"
                        role="progressbar">{{ progress }}%</div>
                  </label>
               </div>
            </a-form-item>
            <a-form-item name="username" :rules="{ required: true, message: '请输入用户名' }">
               <label class="form-control w-full">
                  <div class="label">
                     <span class="label-text">用户名</span>
                  </div>
                  <input type="text" v-model="editUserInfo.username" class="my-form-input-sm" />
               </label>
            </a-form-item>
            <a-form-item>
               <label class="form-control w-full">
                  <div class="label">
                     <span class="label-text">邮箱</span>
                  </div>
                  <input type="text" v-model="editUserInfo.email" disabled class="my-form-input-sm" />
               </label>
            </a-form-item>
            <a-form-item name="sex" :rules="{ required: true, message: '请选择性别' }">
               <label class="form-control w-full">
                  <div class="label">
                     <span class="label-text">性别</span>
                  </div>
               </label>
               <div class="join">
                  <input v-model="editUserInfo.sex" value="1" class="join-item btn btn-sm" type="radio" name="options"
                     aria-label="男" />
                  <input v-model="editUserInfo.sex" value="0" class="join-item btn btn-sm" type="radio" name="options"
                     aria-label="女" />
               </div>
            </a-form-item>
         </a-form>
         <!-- {{ editUserInfo }} -->
         <div class="modal-action">
            <form method="dialog">
               <!-- if there is a button in form, it will close the modal -->
               <button class="btn">取消</button>
            </form>
            <button class="btn btn-primary" @click.stop="editSubmit">确定</button>
         </div>
      </div>
   </dialog>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { VocabularyAPI } from "@/api/vocabulary";
import { UserAPI } from "@/api/user";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import type { Vocabulary } from "@/types/vocabulary";
import type { User } from "@/types/user";
import { message } from "ant-design-vue";
import { MailOutlined, FieldTimeOutlined } from "@ant-design/icons-vue";
import IconFont from "@/utils/iconFont";
import type { FormExpose } from "ant-design-vue/es/form/Form";
import { OtherAPI } from "@/api/other";
import { MyUtils } from "@/utils";

const route = useRoute();
const vocabularyList = ref<Vocabulary[]>();
const currentUserInfo = ref<User>();
const userStore = useUserStore();


// 是否是自己
const isSelf = ref(false);
// 词集列表 loading
const vocabularyListLoading = ref(false);
// 用户学习的词集列表
const userRelevanceVocList = ref<Vocabulary[]>([]);
// 获取用户学习清单时的loading
const userRelevanceVocListLoading = ref(false);
// 编辑的用户信息
const editUserInfo = ref<User>({
   id: "",
   username: "",
   avatar: "",
   email: "",
   sex: "",
   createTime: ""
});
// editUserInfoForm 实例
const editUserInfoFormEl = ref<FormExpose | null>(null);
// 上传进度
const progress = ref(0);
// 选项卡
const tab = ref(1);



getUserInfoAndVocabularyList();



// 用户取消学习词集
async function cancelLearnVocabulary(vid: string) {
   let data = { vid, uid: userStore.userInfo!.id };
   let result = await VocabularyAPI.cancelLearnVocabulary(data);
   if (result.code == 20000) {
      MyUtils.alert(result.message, "success");
      getUserRelevanceVocListByUid();
   } else {
      MyUtils.alert(result.message, "error");
   }
}
// 选项卡切换
function changeTab(active: number) {
   tab.value = active;
   if (tab.value == 2) getUserRelevanceVocListByUid();
}
// 编辑弹框 【选择上传头像事件】
async function handleAvatarChange(e: Event) {
   let file = (<HTMLInputElement>e.target).files?.[0] as File; // 获取文件对象
   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'; // 检查是不是图片
   if (!isJpgOrPng) return message.error('只能上传JPG格式的文件!');
   const isLt2M = file.size / 1024 / 1024 < 2; // 检查图片大小
   if (!isLt2M) return message.error('头像必须小于2MB!');
   let formData = new FormData(); // 创建 formData
   formData.append('file', file); // 添加文件
   let result = await OtherAPI.imageUpl(formData, (p) => { // 调用接口
      progress.value = Math.floor(p.progress! * 100) // 上传进度
   });
   if (result.code == 20000) {
      editUserInfo.value.avatar = result.data;
      message.success('上传成功');
   } else {
      message.error('上传失败');
   }
}
// 编辑弹框 【打开】
function openEditModal() {
   editUserInfo.value = JSON.parse(JSON.stringify(currentUserInfo.value));
   let editModal = window.document.querySelector('#editModal') as HTMLDialogElement;
   editModal.showModal();
};
// 编辑弹框 【提交】
async function editSubmit() {
   try {
      await editUserInfoFormEl.value?.validate()
      let result = await UserAPI.editUser(editUserInfo.value);
      if (result.code == 20000) {
         MyUtils.alert("操作成功", "success");
         // 关闭EditModal();
         (<HTMLDialogElement>window.document.querySelector('#editModal')).close();
         getUserInfoAndVocabularyList();
      } else {
         MyUtils.alert("操作失败", "error");
      }
   } catch (error) {
      console.log('表单验证失败', error);
   }
};
// 删除词集 【按钮】
async function delVocabulary(id: string) {
   let voc = vocabularyList.value?.find(v => v.id == id);
   MyUtils.modal("操作确认", `您确认要删除词集 ${voc?.title} 吗？`, () => delVocabularyConfirm(id))
};
// 删除词集 【确认】
async function delVocabularyConfirm(id: string) {
   let result = await VocabularyAPI.delVocbulary(id);
   if (result.code == 20000) {
      MyUtils.alert("操作成功", "success");
      getUserInfoAndVocabularyList();
   } else {
      MyUtils.alert("操作失败", "error");
   }
}
// 获取词集列表
async function getUserInfoAndVocabularyList() {
   vocabularyListLoading.value = true; // 显示骨架屏
   // 获取指定用户信息
   if (route.params.id) {
      let userInfoRes = await UserAPI.getUserInfoById(<string>route.params.id);
      currentUserInfo.value = userInfoRes.data;
      let vocListRes = await VocabularyAPI.getVocabularyListByUid(<string>route.params.id);
      vocabularyList.value = vocListRes.data;
      isSelf.value = false;
      // 使用当前登录用户的信息
   } else if (userStore.userInfo) {
      let userInfoRes = await UserAPI.getUserInfoById(userStore.userInfo.id);
      currentUserInfo.value = userInfoRes.data;
      // userInfo.value = userStore.userInfo; // 注意这里的数据是响应式
      // userInfo.value = JSON.parse(JSON.stringify(userStore.userInfo));
      let vocListRes = await VocabularyAPI.getVocabularyListByUid(userStore.userInfo.id);
      vocabularyList.value = vocListRes.data;
      isSelf.value = true; // 走的是当前登录的用户，就是自己
      userStore.userInfo = JSON.parse(JSON.stringify(currentUserInfo.value));
   } else {
      // console.log(route);
      message.error("未登录");
      router.push("/login");
   }
   vocabularyListLoading.value = false; // 加载完成 隐藏骨架屏
   editUserInfo.value = JSON.parse(JSON.stringify(currentUserInfo.value)); // 编辑用户信息回显
   // 判断是否是自己
   if (route.params?.id == userStore.userInfo?.id) {
      isSelf.value = true;
   }
}
// 获取用户学习的词集列表
async function getUserRelevanceVocListByUid() {
   // if (userRelevanceVocList.value!.length > 0) return;
   userRelevanceVocList.value = [];
   userRelevanceVocListLoading.value = true;
   let result = await VocabularyAPI.getUserRelevanceVocListByUid(currentUserInfo.value?.id!);
   userRelevanceVocListLoading.value = false;
   if (result.code == 20000) {
      userRelevanceVocList.value = result.data;
   } else {
      message.error("获取用户学习的词集列表失败");
   }
}

// 
watch(() => route.params, () => {
   // vue中多个路由对应同一个组件，页面切换不刷新问题
   getUserInfoAndVocabularyList();
})
</script>

<style lang="less"></style>