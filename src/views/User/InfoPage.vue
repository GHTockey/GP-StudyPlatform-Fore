<template>
   <div class="userinfo-container m-auto
               lg:w-[80%] md:w-[85%]">
      <!-- 头像名称box -->
      <div class="h-[230px] flex justify-between items-center pl-10 relative">
         <!-- 文字信息 -->
         <div class="text-gray-500">
            <!-- 用户名 -->
            <p class="font-bold text-4xl text-base-content">{{ userInfo?.username }}</p>
            <!-- ID -->
            <p class="font-semibold text-sm -mt-1">#{{ userInfo?.id }}</p>
            <!-- 邮箱 -->
            <p class="m-[8px_0]">
               <MailOutlined class="mr-[5px]" /> {{ userInfo?.email }}
            </p>
            <!-- 注册时间 -->
            <p class="m-[8px_0]">
               <FieldTimeOutlined class="mr-[8px]" />2022年10月1日加入
            </p>
         </div>
         <!-- 头像 -->
         <div class="w-[280px] relative">
            <img :src="userInfo?.avatar" alt="头像模糊" class=" size-[200px] blur-[40px] my-user-avatar">
            <!-- <img :src="userInfo?.avatar" alt="头像" class="size-[180px] absolute my-user-avatar ring"
               :class="(userInfo?.sex == '1' ? 'ring-blue-500' : (userInfo?.sex == '0' ? 'ring-pink-500' : 'ring-white'))"> -->
            <img :src="userInfo?.avatar" alt="头像" class="size-[180px] absolute my-user-avatar ring" :class="'ring-white'">
         </div>
         <!-- 按钮 -->
         <div class="absolute bottom-0">
            <a-space>
               <template v-if="isSelf">
                  <button class="btn btn-info text-white btn-sm" @click.stop="openEditModal">
                     <IconFont type="icon-xiugai" />修改信息
                  </button>
               </template>
               <template v-else >
                  <button class="btn btn-success text-white btn-sm">私信</button>
               </template>
            </a-space>
         </div>
      </div>

      <div class="p-10">
         <div class="divider divider-start font-semibold text-lg">词集列表</div>
         <div v-for="item in vocabularyList" :key="item.id" @click="$router.push(`/vocabulary/${item.id}`)" class="bg-base-200 hover:bg-base-300
                        mb-2 cursor-pointer rounded-2xl p-5 h-[100px]
                        relative flex  justify-between items-center">
            <!-- 封面 -->
            <img :src="item.cover" alt="封面" class="absolute top-1/2 -translate-y-1/2 w-[120px] h-[80%]
             left-[-20px] rounded-lg border-[5px] border-base-100 shadow-lg shadow-gray-400" />
            <div class="ml-24 max-w-[230px]">
               <!-- 标题 -->
               <p class="text-lg font-[600]">{{ item.title }}</p>
               <!-- 描述 -->
               <p class="text-xs text-ellipsis h-3/4">{{ item.desc }}</p>
            </div>
            <!-- 中间内容 -->
            <div class="text-base-center">
               <!-- 数量 -->
               <p>
                  <IconFont type="icon-icon-test" /> {{ item.count }}
               </p>
               <!-- 时间 -->
               <p>
                  <IconFont type="icon-shijian" /> {{ item.createTime }}
               </p>
            </div>
            <!-- 结尾操作 -->
            <div class="gap-2 flex items-center">
               <template v-if="isSelf">
                  <!-- 编辑 -->
                  <button class="btn btn-sm btn-info">
                     <IconFont type="icon-xiugai" />
                  </button>
                  <!-- 删除 -->
                  <button class="btn btn-sm btn-error" @click.stop="delVocabulary(item.id)">
                     <IconFont type="icon-shanchu" />
                  </button>
               </template>
               <p>
                  <RightOutlined />
               </p>
            </div>
         </div>
         <!-- 没有数据 -->
         <a-empty v-if="!vocabularyList?.length" />
      </div>
   </div>

   <!-- 编辑 -->
   <a-modal v-model:open="editVisible" title="编辑信息" @ok="editSubmit">
      <p>123</p>
   </a-modal>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { getVocabularyListByUidAPI } from "@/api/vocabulary";
import { getUserInfoById } from "@/api/user";
import { ref } from "vue";
import { useRoute } from "vue-router";
import type { VocabularyData } from "@/types/vocabulary";
import type { User } from "@/types/user";
import { message } from "ant-design-vue";
import router from "@/router";
import { MailOutlined, FieldTimeOutlined, RightOutlined } from "@ant-design/icons-vue";
import IconFont from "@/utils/iconFont";

const route = useRoute();
const vocabularyList = ref<VocabularyData[]>();
const userInfo = ref<User>();
const userStore = useUserStore();

// 编辑弹框
const editVisible = ref(false);
// 是否是自己
const isSelf = ref(false);


getVocabularyList();
if(route.params.id == userInfo.value?.id) {
   isSelf.value = true;
} else {
   isSelf.value = false;
}


// 编辑弹框 【打开】
function openEditModal() {
   editVisible.value = true;
};
// 编辑弹框 【提交】
async function editSubmit() {
   console.log(123);
};
// 删除词集
async function delVocabulary(id: number) {
   message.error("删除词集" + id);
};
// 获取词集列表
async function getVocabularyList() {
   // 获取指定用户信息
   if (route.params.id) {
      let userInfoRes = await getUserInfoById(<string>route.params.id);
      userInfo.value = userInfoRes.data;
      let vocListRes = await getVocabularyListByUidAPI(<string>route.params.id);
      vocabularyList.value = vocListRes.data;
      // 获取当前用户信息
   } else if (userStore.userInfo && userStore.userInfo) {
      let userInfoRes = await getUserInfoById(userStore.userInfo.id);
      userInfo.value = userInfoRes.data;
      let vocListRes = await getVocabularyListByUidAPI(userStore.userInfo.id);
      vocabularyList.value = vocListRes.data;
   } else {
      console.log(route);
      message.error("未登录");
      router.push("/");
   }
}
</script>

<style lang="less"></style>