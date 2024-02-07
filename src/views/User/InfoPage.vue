<template>
   <div class="userinfo-container">
      <div class="avatar block">
         <div class="w-24 rounded">
            {{ userInfo?.avatar }}
            <!-- <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" /> -->
         </div>
      </div>
      <span>ID: {{ userInfo?.id }}</span> |
      <span>用户名: {{ userInfo?.username }}</span> |
      <span>邮箱: {{ userInfo?.email }}</span>

      <h3>发布的词集</h3>
      <div v-for="item in vocabularyList" :key="item.id" class="border-[2px] border-sky-400 rounded-md border-double">
         <h4>{{ item.title + "--" + item.count }}</h4>
         {{ item }}
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

<style lang="less"></style>@/api/voc@/types/vocabulary