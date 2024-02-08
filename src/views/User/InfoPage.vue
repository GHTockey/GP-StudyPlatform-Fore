<template>
   <div class="userinfo-container m-auto
               lg:w-[80%] md:w-[85%]">
      <!-- 头像名称box -->
      <div class="h-[230px] flex justify-between items-center pl-10 relative">
         <!-- 文字信息 -->
         <div class="text-gray-500">
            <!-- 用户名 -->
            <p class="font-bold text-4xl text-gray-900">{{ userInfo?.username }}</p>
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
            <img :src="userInfo?.avatar" alt="头像" class="size-[180px] absolute my-user-avatar ring"
               :class="(userInfo?.sex == '1' ? 'ring-blue-500' : (userInfo?.sex == '0' ? 'ring-pink-500' : 'ring-white'))">
         </div>
         <!-- 按钮 -->
         <div class="absolute bottom-0">
            <a-space>
               <button class="btn btn-success text-white btn-sm">私信</button>
               <button class="btn btn-success text-white btn-sm">私信</button>
               <button class="btn btn-success text-white btn-sm">私信</button>
            </a-space>
         </div>
      </div>

      <div class="p-10">
         <div class="divider divider-start font-semibold">词集列表</div>
         <div v-for="item in vocabularyList" :key="item.id" class="bg-base-200 hover:bg-base-300
                        mb-2 cursor-pointer rounded-2xl p-5 h-[100px]
                        relative flex  justify-between items-center">
            <!-- 封面 -->
            <img :src="item.cover" alt="封面" class="absolute top-1/2 -translate-y-1/2 w-[120px] h-[80%]
             left-[-20px] rounded-lg border-[5px] border-neutral-content" />
            <div class="ml-24">
               <!-- 标题 -->
               <p class="text-lg font-[600]">{{ item.title }}</p>
               <!-- 时间 -->
               <p class="text-sm">{{ item.desc }}</p>
            </div>
            <!-- 中间内容 -->
            <div>
               <p>
                  <IconFont type="icon-icon-test" /> {{ item.count }}
               </p>
               <p>
                  <IconFont type="icon-shijian" /> {{ item.createTime }}
               </p>
            </div>
            <!-- 结尾操作 -->
            <div>
               <p>
                  <RightOutlined />
               </p>
            </div>
         </div>
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


getVocabularyList();


// 编辑弹框提交
async function editSubmit() {
   console.log(123);
};

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